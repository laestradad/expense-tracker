import psycopg.rows
from services import db


def getTransactions(user_id):
    
    sql = "SELECT * FROM transactions WHERE user_id = %s"
    parameters = (user_id,)
    rows = db.select_query(sql, parameters)
    return rows


def createTransaction(user_id, category_id, amount, comment=None, transaction_date=None):
    sql = """
    INSERT INTO transactions (user_id, category_id, amount, comment, transaction_date)
    VALUES (%s, %s, %s, %s, %s)
    RETURNING id;
    """
    try:
        with db.pool.connection() as conn:
            with conn.cursor(row_factory=psycopg.rows.dict_row) as cur:
                cur.execute(sql, (user_id, category_id, amount, comment, transaction_date))
                conn.commit()
                return cur.fetchone(), 201
    except Exception as e:
        print(f"Database error: {e}")
        return {"error": "database error"}, 500
    

def deleteTransaction(transaction_id):
    sql = "DELETE FROM transactions WHERE id = %s"
    try:
        with db.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, (transaction_id,))
                conn.commit()
                if cur.rowcount == 0:
                    return {"error": "Transaction not found"}, 404
                return {"message": "Transaction deleted"}, 200
    except Exception as e:
        print(f"Database error: {e}")
        return {"error": "database error"}, 500
    

def updateTransaction(transaction_id, category_id, amount, comment, transaction_date):
    sql = """
    UPDATE transactions
    SET category_id = %s,
        amount = %s,
        comment = %s,
        transaction_date = %s,
        last_edit = NOW()
    WHERE id = %s
    """
    values = (category_id, amount, comment, transaction_date, transaction_id)

    try:
        with db.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, values)
                conn.commit()
                if cur.rowcount == 0:
                    return {"error": "Transaction not found"}, 404
                return {"message": "Transaction updated"}, 200
    except Exception as e:
        print(f"Database error: {e}")
        return {"error": "database error"}, 500



