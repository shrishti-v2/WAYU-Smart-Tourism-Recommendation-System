from pymongo import MongoClient
import os

MONGO_URI = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URI)

db = client["wayu_db"]
users_collection = db["users"]
destinations_collection = db["destinations"]
