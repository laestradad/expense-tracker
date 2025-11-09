from psycopg_pool import ConnectionPool
import psycopg.rows

pool = None


def init_db(app):
    global pool
    dsn = (
        f"postgresql://{app.config['DB_USER']}:{app.config['DB_PASSWORD']}"
        f"@{app.config['DB_HOST']}:{app.config['DB_PORT']}/{app.config['DB_NAME']}"
    )
    pool = ConnectionPool(dsn)


def select_query(sql, params=None, fetch=0, as_dict=False):

    with pool.connection() as conn:
        # Use dict_row factory if requested
        if as_dict:
            with conn.cursor(row_factory=psycopg.rows.dict_row) as cur:
                cur.execute(sql, params)
                return _fetch_results(cur, fetch)
        else:
            with conn.cursor() as cur:
                cur.execute(sql, params)
                return _fetch_results(cur, fetch)

def _fetch_results(cur, fetch):

    if isinstance(fetch, int) and fetch >= 0:
        if fetch == 0:
            return cur.fetchall()
        elif fetch == 1:
            return cur.fetchone()
        else:
            return cur.fetchmany(fetch)
    else:
        return None