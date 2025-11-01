from flask import Flask
from extensions import cors
from auth.routes import auth_bp
from api.routes import api_bp

def create_app(config_name=None):
    app = Flask(__name__)
    app.config.from_object(config_name)
    cors.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(api_bp, url_prefix="/api")

    return app

if __name__ == "__main__":
    app = create_app("DevelopmentConfig")
    app.run(debug=True, port=5000)