from flask import Flask, jsonify, send_from_directory, abort
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
    app = Flask(__name__, static_folder='dist')
    app.config.from_object(config_name)

    init_db(app)

    cors.init_app(app)
    jwt.init_app(app)

    @app.errorhandler(RequestEntityTooLarge)
    def handle_file_too_large(e):
        return jsonify({"error": "File too large"}), 413

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(api_bp, url_prefix="/api")

    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react(path):
        # prevent React from hijacking API routes
        if path.startswith("api") or path.startswith("auth"):
            abort(404)

        full_path = os.path.join(app.static_folder, path)

        # Only serve the file if it's a *file*, not a directory
        if os.path.isfile(full_path):
            return send_from_directory(app.static_folder, path)

        # Anything else → React SPA
        return send_from_directory(app.static_folder, 'index.html')
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(port=5000)