from flask import Blueprint, jsonify
import pandas as pd
from config import destinations_collection

dest_bp = Blueprint("destinations", __name__)

@dest_bp.route("/load", methods=["GET"])
def load_data():
    df = pd.read_csv("data/destinations.csv")
    destinations_collection.delete_many({})
    destinations_collection.insert_many(df.to_dict("records"))
    return jsonify({"message": "Destinations loaded successfully"})

@dest_bp.route("/all", methods=["GET"])
def get_all():
    data = list(destinations_collection.find({}, {"_id": 0}))
    return jsonify(data)
