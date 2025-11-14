from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from functools import wraps


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
        except Exception as e:
            return jsonify({"error": str(e)}), 401
        
        return f(current_user_id, *args, **kwargs)
    return decorated
