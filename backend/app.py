from flask import Flask
from dotenv import load_dotenv
import config
from extensions import cors, jwt
from services.db import init_db
from auth.routes import auth_bp
from api.routes import api_bp

load_dotenv()

def create_app(config_name=config.Dev):
    app = Flask(__name__)
    app.config.from_object(config_name)

    init_db(app)

    cors.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(api_bp, url_prefix="/api")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(port=5000)