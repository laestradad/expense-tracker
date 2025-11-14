from psycopg_pool import ConnectionPool
import psycopg.rows

pool = None


def init_db(app):
    global pool

    # Heroku DATABASE_URL 
    database_url = app.config['DATABASE_URL']
    if not database_url:
        raise RuntimeError("DATABASE_URL is not set")

    # psycopg2 need 'postgresql://' instead of 'postgres://'
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    pool = ConnectionPool(database_url)

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