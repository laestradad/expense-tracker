from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify(message="Hello from Flask!")

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()    
    
    if not data:
        return jsonify({"message": "No data received"}), 400
    
    username = data.get("username", "")
    password = data.get("password", "")
    print(f"Contact form submission: {username} / {password}")

    return jsonify({"message": f"Thanks {username}, your message was received!"}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)