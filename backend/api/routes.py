from flask import Blueprint, request, jsonify, send_from_directory, current_app
from services.decorators import login_required
from services.dataProcess import process_csv

api_bp = Blueprint("api", __name__)


@api_bp.route("/hello", methods=["GET"])
def hello():
    return jsonify(message="Hello from Flask!")


@api_bp.route("/dashboard")
@login_required
def dashboard(user_id):
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


@api_bp.route("/download")
@login_required
def download(user_id):
    return send_from_directory(
            directory=current_app.static_folder,
            path="sample.csv",
            as_attachment=True
        )


