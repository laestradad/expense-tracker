from flask import Blueprint, request, jsonify, send_from_directory, current_app
from datetime import datetime
from services.decorators import login_required
import services.dataProcess as dp
from models import transactions
from models import categories
from models import insights


api_bp = Blueprint("api", __name__)


@api_bp.route("/hello", methods=["GET"])
def hello():
    return jsonify(message="Hello from Flask!")


@api_bp.route('/upload', methods = ['POST'])
@login_required
def upload(user_id):
    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    if not file.filename.endswith(".csv"):
        return jsonify({"error": "Invalid file type, must be CSV"}), 400
    
    result, status = dp.process_csv(file, user_id)

    return jsonify(result), status


@api_bp.route("/download")
def download():
    return send_from_directory(
            directory=current_app.static_folder,
            path="sample.csv",
            as_attachment=True)


@api_bp.route("/downloadraw")
@login_required
def download_raw(user_id):
    return send_from_directory(
            directory=current_app.static_folder,
            path="sample.csv",
            as_attachment=True
        )


@api_bp.route("/transactions", methods=["GET"])
@login_required
def get_transactions(user_id):
    result = transactions.getTransactions(user_id)
    return jsonify(result), 200


@api_bp.route("/transactions", methods=["POST"])
@login_required
def create_transaction(user_id):
    data = request.json
    
    category_id = data["category_id"]
    amount = float(data["amount"])
    tran_date_str = data["transaction_date"]
    comment = data.get("comment")

    if not category_id or not amount or not tran_date_str:
        return jsonify({"error": "Missing required fields"}), 400
    
    if not isinstance(amount, (int, float)):
        return jsonify({"error": "Amount must be number"}), 400
    
    try:
        transaction_date = datetime.strptime(tran_date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "transaction_date must be YYYY-MM-DD"}), 400

    result, status = transactions.createTransaction(user_id, category_id, amount, comment, transaction_date)
    return jsonify(result), status


@api_bp.route("/transactions/<int:transaction_id>", methods=["PUT"])
@login_required
def update_transaction(user_id, transaction_id):
    data = request.json

    category_id = data["category_id"]
    amount = float(data["amount"])
    tran_date_str = data["transaction_date"]
    comment = data.get("comment")

    if not category_id or not amount or not tran_date_str:
        return jsonify({"error": "Missing required fields"}), 400
    
    if not isinstance(amount, (int, float)):
        return jsonify({"error": "Amount must be number"}), 400
    
    try:
        transaction_date = datetime.strptime(tran_date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "transaction_date must be YYYY-MM-DD"}), 400

    result, status = transactions.updateTransaction(transaction_id, category_id, amount, comment, transaction_date)
    return jsonify(result), status


@api_bp.route("/transactions/<int:transaction_id>", methods=["DELETE"])
@login_required
def delete_transaction(user_id, transaction_id):
    result, status = transactions.deleteTransaction(transaction_id)
    return jsonify(result), status


@api_bp.route("/categories", methods=["GET"])
@login_required
def get_categories(user_id):
    result, status = categories.getCategories(user_id)
    return jsonify(result), status


@api_bp.route("/monthslist", methods=["GET"])
@login_required
def get_user_months(user_id):
    result, status = insights.getUserMonths(user_id)
    return jsonify(result), status


@api_bp.route("/insights/categories", methods=["GET"])
@login_required
def get_total_by_category(user_id):
    # Example: GET /insights/categories?date=2025-10-01
    date_par = request.args.get("date")
    try:
        date = datetime.strptime(date_par, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "date must be YYYY-MM-DD"}), 400
    
    result, status = insights.getTotalByCategory(user_id, date)
    return jsonify(result), status


@api_bp.route("/insights/inout", methods=["GET"])
@login_required
def get_total_in_out(user_id):
    # Example: GET /insights/inout?date=2025-10-01
    date_par = request.args.get("date")
    
    if not date_par:
        return jsonify({"error": "Missing date parameter"}), 400
    
    try:
        date = datetime.strptime(date_par, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "date must be YYYY-MM-DD"}), 400
    
    result, status = insights.getMonthlyBalance(user_id, date)
    return jsonify(result), status


@api_bp.route("/plots/sunburst", methods=["GET"])
@login_required
def get_sunburst_data(user_id):
    # Example: GET /plots/sunburst?date=2025-10-01
    date_par = request.args.get("date")
    try:
        date = datetime.strptime(date_par, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "date must be YYYY-MM-DD"}), 400
    
    totals, _ = insights.getTotalByCategory(user_id, date)
    result, status= dp.getSunburstData(totals)

    return jsonify(result), status


@api_bp.route("/plots/trend", methods=["GET"])
@login_required
def get_trend_data(user_id):
    try:
        rows = transactions.getTransactionsForDP(user_id)
        df = dp.getTransactionsDF(rows)
        cats = categories.get_full_category_map(user_id)
        result = dp.getTrendData(df, cats)

        return jsonify(result), 200

    except Exception as e:
        print(f"[ERROR] Trend plot generation failed: {e}")
        return jsonify({"error": "internal server error"}), 500