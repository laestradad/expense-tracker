from flask import Response
import pandas as pd
import csv
import io
from datetime import datetime
from models.categories import get_category_map, get_full_category_map
from models.transactions import insert_transactions_bulk


REQUIRED_HEADERS = ["date", "category", "amount", "comment"]
VALID_CATEGORIES = None


def _validate_date(value, line):
    try:
        return datetime.strptime(value.strip(), "%Y-%m-%d").date()
    except Exception:
        raise ValueError(f"Invalid date format at line {line}. Expected YYYY-MM-DD.")


def _validate_amount(value, line):
    try:
        return float(value)
    except Exception:
        raise ValueError(f"Invalid amount at line {line}: must be a number.")

    
def process_csv(file, user_id):
    try:
        # Load file into CSV reader
        stream = io.StringIO(file.stream.read().decode("utf-8"))
        reader = csv.DictReader(stream)
        
        # Validate headers
        if reader.fieldnames != REQUIRED_HEADERS:
            return ({
                "error": f"Invalid headers. Expected {REQUIRED_HEADERS}, got {reader.fieldnames}"
            }), 400

        # Load category map (name : id)
        category_map = get_category_map(user_id)

        # Init arrays
        errors = []
        transactions = []

        for i, row in enumerate(reader, start=2):  # line 2 = first data row\\
            
            print(f"{i=},{row=}")#DEBUGXXX
            try:
                # Validate each field, save in transactions if no errors
                transaction_date = _validate_date(row["date"], line=i)
                category_name = row["category"].strip()
                amount = _validate_amount(row["amount"], line=i)
                comment = row["comment"].strip() if row["comment"] else None

                if category_name not in category_map:
                    errors.append({
                        "line": i,
                        "error": f"Unknown category '{category_name}'"
                    })
                    continue

                category_id = category_map[category_name]
                transactions.append((user_id, category_id, amount, comment, transaction_date))

            except ValueError as e:
                errors.append({"line": i, "error": str(e)})

        # If error, return them
        if errors:
            return ({
                "status": "error",
                "message": f"{len(errors)} validation errors found.",
                "errors": errors
            }), 400
        
        print(transactions)
        # Otherwise, insert transactions
        if transactions:
            insert_transactions_bulk(transactions)

        return ({
            "status": "success",
            "inserted": len(transactions),
            "message": f"Successfully imported {len(transactions)} records."
        }), 200

    except UnicodeDecodeError:
        return ({"error": "File encoding must be UTF-8"}), 400
    except Exception as e:
        print(f"Upload error: {e}")
        return ({"error": str(e)}), 500
    

def getSunburstData(totals):

    labels = []
    parents = []
    values = []

    # Root nodes
    income_total = sum(float(r["total_amount"]) for r in totals if r["category_type"] == "income")
    expense_total = sum(float(r["total_amount"]) for r in totals if r["category_type"] == "expense")

    # Add top-level categories (Income, Expenses)
    labels.extend(["Income", "Expenses"])
    parents.extend(["", ""])
    values.extend([income_total, expense_total])

    # Add income subcategories
    for r in totals:
        if r["category_type"] == "income":
            labels.append(r["category_name"])
            parents.append("Income")
            values.append(float(r["total_amount"]))

    # Add expense subcategories
    for r in totals:
        if r["category_type"] == "expense":
            labels.append(r["category_name"])
            parents.append("Expenses")
            values.append(float(r["total_amount"]))

    return ({ "labels": labels, "parents": parents, "values": values }), 201

def getTransactionsDF(rows):
    try:
        if not rows:
            return pd.DataFrame(columns=["date", "category", "amount", "comment"])

        df = pd.DataFrame(rows)
        df["date"] = pd.to_datetime(df["date"])
        df["amount"] = df["amount"].astype(float)
        return df

    except Exception as e:
        print(f"Error creating DataFrame: {e}")
        return pd.DataFrame(columns=["date", "category", "amount", "comment"])

def getTrendData(df, categories):
    # Create month column
    df["date"] = pd.to_datetime(df["date"])
    df["month"] = df["date"].dt.to_period("M").astype(str)

    # Create new dataframe which is groupby month and category
    grouped = df.groupby(["month", "category"])["amount"].sum().to_frame().reset_index()
    
    # Create Transactions column
    grouped['Transactions'] = ""
    for index, row in grouped.iterrows():
        # Create dataframe x that has ["date","amount","comment"] for the current ["month", "category"] in grouped
        x = df[(df["month"] == row["month"]) & (df["category"] == row["category"])][["date","amount","comment"]]
        x["date"] = x["date"].dt.strftime('%d/%m')
        
        # Title of catergory
        label = "<b>" + row["category"] + "</b><br>"
        # Iterate dataframe x, and create 1 label
        for _, r in x.iterrows():
            comment = r["comment"] if pd.notna(r["comment"]) else ""
            label += f"{r['date']} ${round(r['amount'],0)} {comment}<br>"
        
        # Save label
        grouped.at[index, 'Transactions'] = label

    # Prepare data 
    bar_data = []
    for cat in categories:
        cat_name = cat["name"]
        cat_type = cat["type"]

        # Filter grouped DataFrame by category name
        x = grouped[grouped["category"] == cat_name]
        if x.empty:
            continue

        # Make negative values for expenses
        values = x["amount"].tolist()
        if cat_type.lower() == "expense":
            values = [-v for v in values]

        bar_data.append({
            "type": cat_type,
            "category": cat_name,
            "months": x["month"].tolist(),
            "values": values,
            "text": x["Transactions"].tolist(),
        })

    # Create cashflow trend based on pivot
    df_cf = df.copy()

    # Negate amounts for expense categories
    df_cf.loc[df_cf['category'].isin(
        [cat["name"] for cat in categories if cat["type"].lower() == "expense"]
    ), 'amount'] *= -1

    pivot= pd.pivot_table(data=df_cf, 
                            index="month", 
                            values="amount",
                            fill_value=0,
                            aggfunc= "sum")
    
    # Calculate cumulative cashflow
    pivot['Cashflow_Cumulative'] = 0.0
    prev = None
    for i in pivot.index:
        if prev is None: # First row
            pivot.at[i, "Cashflow_Cumulative"] = pivot.loc[i, "amount"]
        else:
            pivot.at[i, "Cashflow_Cumulative"] = pivot.loc[prev, "Cashflow_Cumulative"] + pivot.loc[i, "amount"]
        prev = i
        
    pos_months = pivot[pivot["amount"] > 0]
    neg_months = pivot[pivot["amount"] < 0]

    return {
        "months": pivot.index.tolist(),
        "balance": pivot["amount"].tolist(),
        "cumulative": pivot["Cashflow_Cumulative"].tolist(),
        "pos_months": pos_months.index.tolist(),
        "pos_amounts": pos_months["amount"].tolist(),
        "neg_months": neg_months.index.tolist(),
        "neg_amounts": neg_months["amount"].tolist(),
        "bardata": bar_data
    }


def generate_csv_response(data):

    if not data:
        return Response("No data found", status=404)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"data_{timestamp}.csv"

    # Extract headers from the first dict
    headers = data[0].keys()
    
    # Create CSV
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=headers)
    writer.writeheader()
    writer.writerows(data)
    output.seek(0)

    # Compose response
    response = Response(output.getvalue(), mimetype='text/csv')
    response.headers['Content-Disposition'] = (
        f"attachment; filename=\"{filename}\";"
    )

    return response