from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
#from ..extensions import jwt
import jwt
from datetime import datetime, timedelta, UTC

auth_bp = Blueprint("auth", __name__)

# Demo User
USERS = {
    "luis": generate_password_hash("123456")
}
# Demo KEY
SECRET_KEY = "TEST12345"

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()    
    
    if not data:
        return jsonify({"message": "No data received"}), 400
    
    username = data.get("username", "")
    password = data.get("password", "")
    
    print(f"Contact form submission: {username} / {password}")

    if username not in USERS or not check_password_hash(USERS[username], password):
        return jsonify({"error": "Invalid credentials"}), 401
    
    token = jwt.encode(
        {"user_id": username, "exp": datetime.now(UTC) + timedelta(seconds=4)},
        SECRET_KEY,
        algorithm="HS256"
    )

    return jsonify({"token": token, "message": f"Thanks {username}, your message was received!"}), 200