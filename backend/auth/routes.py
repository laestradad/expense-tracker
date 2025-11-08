from datetime import datetime, timedelta, UTC
from flask import current_app as app
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from services.decorators import login_required
from models import users


auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()    
    
    if not data:
        return jsonify({"error": "No data received"}), 400
    
    username = data.get("username", "")
    password = data.get("password", "")

    if not username or not password:
        return jsonify({"error": "Missing fields"}), 400
    
    userData = users.get_userData(username=username)
    
    if not userData or not check_password_hash(userData["hash"], password):
        return jsonify({"error": "Invalid credentials"}), 401
    
    token = create_access_token(
        identity = str(userData["id"]),
        expires_delta = timedelta(seconds=app.config["JWT_EXPIRATION"])
    )

    return jsonify({"token": token, "message": f"Thanks {username}, your message was received!"}), 200


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()    
    
    if not data:
        return jsonify({"error": "No data received"}), 400
    
    username = data.get("username", "")
    password = data.get("password", "")
    confirmation = data.get("confirmation", "")

    if not username or not password or not confirmation:
        return jsonify({"error": "Missing fields"}), 400
    
    if password != confirmation:
        return jsonify({"error": "Passwords do not match"}), 400
    
    result = users.registerUser(username, generate_password_hash(password))

    return result


@auth_bp.route("/changepsw", methods=["POST"])
@login_required
def changepsw(user_id):
    data = request.get_json()    
    
    if not data:
        return jsonify({"error": "No data received"}), 400

    oldpsw = data.get("oldpsw", "")
    newpsw = data.get("newpsw", "")
    confirm = data.get("confirm", "")
    print(oldpsw, newpsw, confirm)

    if not oldpsw or not newpsw or not confirm:
        return jsonify({"error": "Missing fields"}), 400
    
    userData = users.get_userData(userid=user_id)

    if not userData or not check_password_hash(userData["hash"], oldpsw):
        return jsonify({"error": "Invalid credentials"}), 401
    
    if newpsw != confirm:
        return jsonify({"error": "Passwords do not match"}), 400
    
    result = users.changePsw(user_id, generate_password_hash(newpsw))

    return result


@auth_bp.route("/delete", methods=["POST"])
@login_required
def delete(user_id):
    result = users.deleteUser(user_id)
    print(result)
    return result
    


    


