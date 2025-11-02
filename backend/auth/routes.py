from datetime import datetime, timedelta, UTC
from flask import current_app as app
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity
from models import users

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()    
    
    if not data:
        return jsonify({"message": "No data received"}), 400
    
    username = data.get("username", "")
    password = data.get("password", "")
    
    userData = users.get_userData(username)
    if not userData or not check_password_hash(userData["hash"], password):
        return jsonify({"error": "Invalid credentials"}), 401
    
    token = create_access_token(
        identity = userData["id"],
        expires_delta = timedelta(seconds=app.config["JWT_EXPIRATION"])
    )

    return jsonify({"token": token, "message": f"Thanks {username}, your message was received!"}), 200