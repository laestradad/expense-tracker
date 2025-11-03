from psycopg_pool import ConnectionPool

pool = None

def init_db(app):
    global pool
    dsn = (
        f"postgresql://{app.config['DB_USER']}:{app.config['DB_PASSWORD']}"
        f"@{app.config['DB_HOST']}:{app.config['DB_PORT']}/{app.config['DB_NAME']}"
    )
    pool = ConnectionPool(dsn)


def select_query(sql, params=None, fetch=0):
    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, params)

            if isinstance(fetch, int) and fetch >= 0:
                if fetch == 0:
                    return cur.fetchall()
                elif fetch == 1:
                    return cur.fetchone()
                else:
                    return cur.fetchmany(fetch)
            else:
                return None