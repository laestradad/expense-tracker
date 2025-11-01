from flask import Blueprint, request, jsonify

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()    
    
    if not data:
        return jsonify({"message": "No data received"}), 400
    
    username = data.get("username", "")
    password = data.get("password", "")
    print(f"Contact form submission: {username} / {password}")

    return jsonify({"message": f"Thanks {username}, your message was received!"}), 200
