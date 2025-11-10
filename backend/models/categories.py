import psycopg.rows
from services import db


def getCategories(user_id):
    """
    Returns all categories visible to a user:
    - Global categories (user_id IS NULL)
    - User-specific categories (user_id = user_id)
    """
    sql = """
    SELECT id, name, type, user_id
    FROM categories
    WHERE user_id IS NULL OR user_id = %s
    ORDER BY type, name
    """
    try:
        with db.pool.connection() as conn:
            with conn.cursor(row_factory=psycopg.rows.dict_row) as cur:
                cur.execute(sql, (user_id,))
                rows = cur.fetchall()
                return rows, 200
    except Exception as e:
        print(f"Database error: {e}")
        return {"error": "database error"}, 500
    
    
def get_category_map(user_id):
    """Load {name: id} map of valid categories from DB."""
    sql = "SELECT id, name FROM categories WHERE user_id IS NULL OR user_id = %s"
    with db.pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (user_id,))
            return {row[1]: row[0] for row in cur.fetchall()}