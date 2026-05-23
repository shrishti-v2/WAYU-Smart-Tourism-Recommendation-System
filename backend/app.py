from flask import Flask
from flask_cors import CORS

from routes.auth import auth_bp
from routes.destinations import dest_bp
from routes.recommendations import recommend_bp   # ← THIS LINE IS CRITICAL

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(dest_bp, url_prefix="/api/destinations")
app.register_blueprint(recommend_bp, url_prefix="/api")  # ← AND THIS

@app.route("/")
def home():
    return {"message": "WAYU Backend Running 🚀"}

if __name__ == "__main__":
    app.run(debug=True)
