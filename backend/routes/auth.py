from flask import Blueprint, request, jsonify
from config import users_collection
from models.user_model import hash_password, check_password
from datetime import datetime

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    if users_collection.find_one({"email": data["email"]}):
        return jsonify({"message": "User already exists"}), 400

    users_collection.insert_one({
        "name": data["name"],
        "email": data["email"],
        "password": hash_password(data["password"]),
        "profile": {
        "phone": "",
        "gender": "",
        "dob": "",
        "location": "",
        "preferences": {
            "categories": [],
            "budget_range": "",
            "trip_duration": "",
            "travel_style": ""
        }
    },
    "search_history": []
    })

    return jsonify({"message": "Registration successful"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = users_collection.find_one({"email": data["email"]})

    if user and check_password(data["password"], user["password"]):
        return {
    "message": "Login successful",
    "name": user["name"],
    "email": user["email"]
    }, 200

    return jsonify({"message": "Invalid credentials"}), 401

@auth_bp.route("/profile/<email>", methods=["GET"])
def get_profile(email):
    user = users_collection.find_one({"email": email})

    if not user:
        return {"message": "User not found"}, 404

    return {
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "profile": user.get("profile", {})
    }, 200

@auth_bp.route("/profile/<email>", methods=["PUT"])
def update_profile(email):
    data = request.json

    result = users_collection.update_one(
        {"email": email},
        {"$set": {"profile": data}}
    )

    if result.matched_count == 0:
        return {"message": "User not found"}, 404

    return {"message": "Profile updated successfully"}, 200

@auth_bp.route("/save-destination/<email>", methods=["POST"])
def save_destination(email):
    data = request.json

    users_collection.update_one(
        {"email": email},
        {"$addToSet": {"saved_destinations": data}}
    )

    return {"message": "Destination saved"}, 200

@auth_bp.route("/search-history/<email>", methods=["GET"])
def get_search_history(email):
    user = users_collection.find_one({"email": email})

    if not user:
        return {"message": "User not found"}, 404

    return user.get("search_history", []), 200

@auth_bp.route("/save-trip", methods=["POST"])
def save_trip():
    data = request.json
    email = data.get("email")
    trip = data.get("trip")

    if not email or not trip:
        return jsonify({"error": "Missing data"}), 400

    users_collection.update_one(
        {"email": email},
        {
            "$addToSet": {   # prevents duplicates
                "saved_trips": {
                    **trip,
                    "saved_at": datetime.utcnow().isoformat()
                }
            }
        }
    )

    return jsonify({"message": "Trip saved successfully"})

@auth_bp.route("/saved-trips/<email>", methods=["GET"])
def get_saved_trips(email):
    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify([])

    trips = user.get("saved_trips", [])

    return jsonify(trips[::-1])  # newest first

@auth_bp.route("/remove-trip", methods=["POST"])
def remove_trip():
    data = request.json
    email = data.get("email")
    destination = data.get("destination")

    users_collection.update_one(
        {"email": email},
        {
            "$pull": {
                "saved_trips": {
                    "destination": destination
                }
            }
        }
    )

    return jsonify({"message": "Trip removed"})