from flask import Flask, jsonify, send_from_directory
from dotenv import load_dotenv
import os
import config
from extensions import cors, jwt
from services.db import init_db
from auth.routes import auth_bp
from api.routes import api_bp
from werkzeug.exceptions import RequestEntityTooLarge

load_dotenv()

def create_app(config_name=config.Dev):
    app = Flask(__name__, static_folder='./dist', static_url_path='/')
    app.config.from_object(config_name)

    init_db(app)

    cors.init_app(app)
    jwt.init_app(app)

    @app.errorhandler(RequestEntityTooLarge)
    def handle_file_too_large(e):
        return jsonify({"error": "File too large"}), 413
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(api_bp, url_prefix="/api")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(port=5000)