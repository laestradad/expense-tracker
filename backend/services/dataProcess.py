import csv
import io
from datetime import datetime
from models.categories import get_category_map
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