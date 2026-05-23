import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans

DATA_PATH = "data/india_tourism_dataset.json"


# -------------------- DATA LOADING --------------------

def load_json_data():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return pd.DataFrame(data)


def extract_budget(budget_obj):
    try:
        low, high = budget_obj.get("total_daily_range", [0, 0])
        return int((low + high) / 2)
    except:
        return 0


# -------------------- CLUSTERING --------------------

def apply_clustering(df, n_clusters=5):
    if len(df) < 2:
        df["cluster"] = 0
        return df

    k = min(n_clusters, len(df))

    vectorizer = TfidfVectorizer(stop_words="english", max_features=3000)
    tfidf_matrix = vectorizer.fit_transform(df["combined"])

    kmeans = KMeans(
        n_clusters=k,
        random_state=42,
        n_init=10
    )

    df["cluster"] = kmeans.fit_predict(tfidf_matrix)
    return df


def label_clusters(df):
    cluster_labels = {}

    for cluster_id in df["cluster"].unique():
        cluster_data = df[df["cluster"] == cluster_id]
        text = " ".join(cluster_data["category"].tolist()).lower()

        if "beach" in text or "coastal" in text:
            label = "Beach Cluster"
        elif "spiritual" in text or "religious" in text or "pilgrimage" in text:
            label = "Spiritual Cluster"
        elif "nature" in text or "waterfall" in text or "hill" in text:
            label = "Nature & Adventure Cluster"
        elif "heritage" in text or "cultural" in text:
            label = "Heritage Cluster"
        else:
            label = "Mixed Interest Cluster"

        cluster_labels[cluster_id] = label

    df["cluster_label"] = df["cluster"].map(cluster_labels)
    return df


# -------------------- EXPLAINABILITY --------------------

def generate_reason(row, user_interest, days):
    reasons = []

    reasons.append(f"Matches your interest in {user_interest.title()}")
    reasons.append(f"Fits your {days}-day trip budget (₹{row['budget']} per day)")
    reasons.append(f"Belongs to {row['cluster_label']}")

    return " • ".join(reasons)


# -------------------- MAIN RECOMMENDER --------------------

def get_recommendations(user_interest, user_budget, days=1):
    days = int(days) if days else 1
    total_budget = user_budget * days

    df = load_json_data()
    if df.empty:
        return []

    # Feature engineering
    df["destination"] = df["destination_name"]
    df["state"] = df["state"]

    df["category"] = df["trip_types"].apply(
        lambda x: ", ".join(x) if isinstance(x, list) else ""
    )

    df["description"] = (
        df["primary_attractions"].apply(
            lambda x: " ".join(x) if isinstance(x, list) else ""
        )
        + " "
        + df["unique_experiences"].fillna("")
        + " "
        + df["user_reviews_summary"].fillna("")
    )

    df["budget"] = df["budget_category"].apply(extract_budget)

    # -------------------- DAYS-AWARE BUDGET FILTER --------------------
    df = df[(df["budget"] * days) <= total_budget]
    if df.empty:
        return []

    # -------------------- STRICT PREFERENCE FILTER --------------------
    df = df[
        df["category"].str.lower().str.contains(user_interest.lower())
    ]
    if df.empty:
        return []

    # -------------------- COMBINED TEXT --------------------
    df["combined"] = (
        df["category"] + " " +
        df["description"] + " " +
        df["state"]
    )

    # -------------------- CLUSTERING --------------------
    df = apply_clustering(df)
    df = label_clusters(df)

    # -------------------- SIMILARITY RANKING --------------------
    vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
    tfidf_matrix = vectorizer.fit_transform(df["combined"])
    user_vector = vectorizer.transform([user_interest])

    df["score"] = cosine_similarity(user_vector, tfidf_matrix)[0]

    # -------------------- EXPLAINABILITY --------------------
    df["why_recommended"] = df.apply(
        lambda row: generate_reason(row, user_interest, days),
        axis=1
    )

    # -------------------- FINAL RANKING --------------------
    df = df.sort_values(by="score", ascending=False)

    return df[
    [
        "destination",
        "category",
        "state",
        "budget",
        "primary_attractions",
        "user_reviews_summary",
        "popularity_score",
        "safety_rating",
        "why_recommended"
    ]
].head(9).to_dict(orient="records")