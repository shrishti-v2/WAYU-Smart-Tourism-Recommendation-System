from flask import Blueprint, request, jsonify
from ml.recommender import get_recommendations
from config import users_collection
from datetime import datetime, timedelta

recommend_bp = Blueprint("recommend", __name__)

@recommend_bp.route("/recommend", methods=["POST"])
def recommend():
    data = request.json

    interest = data.get("interest")
    budget = data.get("budget")
    days = data.get("days")
    email = data.get("email") 

    if not interest or not budget:
        return jsonify({"error": "Interest and budget are required"}), 400

    if email:
        users_collection.update_one(
            {"email": email},
            {
                "$push": {
                    "search_history": {
                        "interest": interest,
                        "budget": budget,
                        "days": days,
                        "timestamp": datetime.utcnow().isoformat()
                    }
                }
            }
        )

    results = get_recommendations(interest, int(budget), int(days))
    return jsonify(results), 200

@recommend_bp.route("/popular", methods=["GET"])
def get_popular():
    from ml.recommender import load_json_data, extract_budget

    df = load_json_data()

    if df.empty:
        return []

    df["destination"] = df["destination_name"]
    df["budget"] = df["budget_category"].apply(extract_budget)

    df["final_score"] = (
        df["popularity_score"].fillna(0) +
        df["safety_rating"].fillna(0)
    ) / 2

    df = df.sort_values(by="final_score", ascending=False)

    return df.head(6)[
        [
            "destination",
            "state",
            "budget",
            "popularity_score",
            "safety_rating"
        ]
    ].to_dict(orient="records")
