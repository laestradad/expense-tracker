from services import db

def get_userData(username):
    sql = "SELECT id, username, hash FROM users WHERE username=%s"
    with db.pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (username,))
            row = cur.fetchone()
    if row:
        return {"id": row[0], "username": row[1], "hash": row[2]}
    return None