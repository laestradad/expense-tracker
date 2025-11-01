from flask import Blueprint, request, jsonify
import jwt
from functools import wraps
from services.dataProcess import process_csv

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

@api_bp.route('/upload', methods = ['POST'])
def upload():
    title = request.form.get("title", "")
    file = request.files.get("file")
    print(title, file)
    if not file:
        return jsonify({"error": "No file uploaded"}), 400
    
    # Read CSV into pandas dataframe
    try:
        table_json = process_csv(file)
    except Exception as e:
        return jsonify({"error": f"Failed to read CSV: {str(e)}"}), 400

    return jsonify({"title": title, "table": table_json, "message": "file received!"})





