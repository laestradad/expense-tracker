import os

class BaseConfig:
    # Flask
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")

    # PostgreSQL connection
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = int(os.getenv("DB_PORT", 5432))
    DB_NAME = os.getenv("DB_NAME", "postgres")
    DB_USER = os.getenv("DB_USER", "postgres")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret")
    JWT_EXPIRATION = int(os.getenv("JWT_EXPIRATION", 3600))
    
    TESTING = False

class Dev(BaseConfig):
    DEBUG = True

class Prod(BaseConfig):
    DEBUG = False