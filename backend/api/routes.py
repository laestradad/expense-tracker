from flask import Blueprint, request, jsonify
import jwt
from functools import wraps

api_bp = Blueprint("api", __name__)

# Demo KEY
SECRET_KEY = "TEST12345"

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get("Authorization")
        if not auth or not auth.startswith("Bearer "):
            return jsonify({"error": "Missing token"}), 401
        token = auth.split()[1]
        print(token)
        try:
            jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)
    return decorated


@api_bp.route("/hello", methods=["GET"])
def hello():
    return jsonify(message="Hello from Flask!")


@api_bp.route("/dashboard")
@login_required
def dashboard():
    return jsonify({"message": "Hello, you are authenticated!"})





