from psycopg_pool import ConnectionPool

pool = None

def init_db(app):
    global pool
    dsn = (
        f"postgresql://{app.config['DB_USER']}:{app.config['DB_PASSWORD']}"
        f"@{app.config['DB_HOST']}:{app.config['DB_PORT']}/{app.config['DB_NAME']}"
    )
    pool = ConnectionPool(dsn)