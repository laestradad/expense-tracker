from services import db


def getMonthlyBalance(user_id,date):
    sql = """
    SELECT 
    SUM(CASE 
        WHEN c.type = 'income' THEN t.amount
        WHEN c.type = 'expense' THEN -t.amount
        ELSE 0
        END
    ) AS balance
    FROM transactions t JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = %s
        AND DATE_TRUNC('month', t.transaction_date) = DATE_TRUNC('month', %s);
    """
    parameters = (user_id,date)
    row = db.select_query(sql, parameters, fetch=1, as_dict=True)
    return row, 201
    

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


def getTotalInOut(user_id,date):
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
    return rows, 201


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