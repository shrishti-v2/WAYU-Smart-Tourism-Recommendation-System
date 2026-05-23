import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Recommendations() {
  const location = useLocation();
  const { interest, budget, days } = location.state || {};
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const email = storedUser?.email;
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
  const fetchRecommendations = async () => {
    try {
      const res = await API.post("/recommend", {
        interest,
        budget,
        days,
        email: email,
      });

      setDestinations(res.data);
    } catch (err) {
      console.error("Error fetching recommendations", err);
    }
  };

  if (interest && budget && days) {
    fetchRecommendations();
  }
}, [interest, budget, days, email]);

const [savedTrips, setSavedTrips] = useState([]);

useEffect(() => {
  const fetchSaved = async () => {
    try {
      const res = await API.get(`/auth/saved-trips/${email}`);
      setSavedTrips(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (email) fetchSaved();
}, [email]);

const isSaved = (destinationName) => {
  return savedTrips.some(
    (trip) => trip.destination === destinationName
  );
};

const toggleSaveTrip = async (trip) => {
  try {
    if (isSaved(trip.destination)) {
      await API.post("/auth/remove-trip", {
        email,
        destination: trip.destination,
      });
    } else {
      await API.post("/auth/save-trip", {
        email,
        trip,
      });
    }

    // Optimistic UI update
    setSavedTrips((prev) =>
      isSaved(trip.destination)
        ? prev.filter((t) => t.destination !== trip.destination)
        : [...prev, trip]
    );
  } catch (err) {
    console.error(err);
  }
};
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        {/* HEADER */}
        <div className="text-center mb-4">
          <h3 className="fw-bold">Recommended Destinations</h3>
          <p className="text-muted mb-0">
            {days}-day trip • Interest: <b>{interest}</b> • Budget: ₹{budget}
          </p>
        </div>

        {/* RESULTS */}
        <div className="row">
          {destinations.length === 0 ? (
            <p className="text-center text-muted">
              No destinations found. Try changing your preferences.
            </p>
          ) : (
            destinations.map((d, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div
                className="card h-100 shadow-sm recommendation-card"
                style={{ borderRadius: "16px" }}
                >
                  <img
                  src={`https://picsum.photos/400/300?random=${index}`}
                  className="card-img-top"
                  alt={d.destination}
                  style={{ height: "180px", objectFit: "cover" }}/>

                  <div className="card-body d-flex flex-column">
                  {/* DESTINATION NAME */}
                  <h5 className="fw-bold">{d.destination}</h5>
                  <p className="text-muted mb-2">{d.state}</p>
                  {/* CATEGORY BADGE */}
                  <span
                  className="category-badge mb-3"
                  >
                    {d.category}
                  </span>
                    {/* RATINGS */}
                    <p className="mb-2">
                      ⭐ Popularity: {d.popularity_score} | 🛡 Safety: {d.safety_rating}
                      </p>
                      {/* TOP ATTRACTIONS */}
                      <p className="small text-muted mb-2">
                        <strong>Top Attractions:</strong>{" "}
                        {Array.isArray(d.primary_attractions)
                        ? d.primary_attractions.slice(0, 3).join(", ")
                        : ""}
                        </p>
                        {/* REVIEW SUMMARY */}
                        <p className="small text-muted mb-3">
                          {d.user_reviews_summary}
                          </p>
                          {/* WHY RECOMMENDED */}
                          <p className="small text-muted mb-3">
                            {d.why_recommended}
                            </p>
                            {/* BUDGET */}
                            <div className="mt-auto fw-semibold">
                              ₹{d.budget} / day
                            </div>
                            <button
  className={`heart-btn ${isSaved(d.destination) ? "active" : ""}`}
  onClick={() => toggleSaveTrip(d)}
>
  <span className="heart-icon">
    {isSaved(d.destination) ? "❤️" : "🤍"}
  </span>
</button>
                    </div>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Recommendations;
