from services import db


def getTotalByCategory(user_id,date):
    sql = """
    SELECT 
        c.id AS category_id,
        c.name AS category_name,
        c.type AS category_type,
        SUM(t.amount) AS total_amount
    FROM transactions t JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = %s
        AND DATE_TRUNC('month', t.transaction_date) = DATE_TRUNC('month', %s)
    GROUP BY c.id, c.name, c.type
    ORDER BY c.type, total_amount DESC;
    """
    parameters = (user_id,date)
    rows = db.select_query(sql, parameters, as_dict=True)
    return rows, 201


def getMonthlyBalance(user_id,date):
    sql = """
    SELECT 
        c.type AS category_type,
        SUM(t.amount) AS total_amount
    FROM transactions t JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = %s
        AND DATE_TRUNC('month', t.transaction_date) = DATE_TRUNC('month', %s)
    GROUP BY c.type;
    """
    parameters = (user_id,date)
    rows = db.select_query(sql, parameters, as_dict=True)
    
    income = 0
    outcome = 0
    isPositive = False

    for row in rows:
        if row["category_type"] == "income":
            income = row["total_amount"]
        elif row["category_type"] == "expense":
            outcome = row["total_amount"]

    balance = income - outcome
    isPositive = balance > 0
    
    result = {
        "income": income,
        "outcome": outcome,
        "balance": balance,
        "isPositive": isPositive
    }
    return result, 201


def getUserMonths(user_id):
    sql = """
        SELECT 
            to_char(month_start, 'YYYY-MM-DD') AS date,
            trim(to_char(month_start, 'MONTH YYYY')) AS value
        FROM (
            SELECT DISTINCT date_trunc('month', transaction_date)::date AS month_start
            FROM transactions
            WHERE transaction_date IS NOT NULL
              AND user_id = %s
        ) m
        ORDER BY month_start;
    """
    parameters = (user_id,)
    result = db.select_query(sql, parameters, as_dict=True)
    return result, 201