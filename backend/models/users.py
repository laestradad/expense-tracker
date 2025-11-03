from psycopg import errors
from services import db

def get_userData(username=None, userid=None):
    if userid is not None:
        sql = "SELECT id, username, hash FROM users WHERE id=%s"
        parameters = (userid,)
    elif username:
        sql = "SELECT id, username, hash FROM users WHERE username=%s"
        parameters = (username,)
    else:
        return None
    
    row = db.select_query(sql, parameters, fetch=1)

    if row:
        return {"id": row[0], "username": row[1], "hash": row[2]}
    return None

def registerUser(username, hash):
    sql = "INSERT INTO users (username, hash) VALUES (%s, %s)"
    try:
        with db.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, (username, hash))
                conn.commit()
                return {"message": f"user {username} registered in database"}, 200
    
    except errors.UniqueViolation:
        return {"error": "username already exists"}, 403

    except Exception as e:
        print(f"Database error: {e}")
        return {"error": "database error"}, 500
    
def changePsw(userid, newhash):
    sql = "UPDATE users SET hash = %s WHERE id = %s"
    try:
        with db.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, (newhash, userid))
                conn.commit()
                return {"message": "password updated"}, 200
    
    except Exception as e:
        print(f"Database error: {e}")
        return {"error": "database error"}, 500
    

