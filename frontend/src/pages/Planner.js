import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

function Planner() {
  const [interest, setInterest] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [popular, setPopular] = useState([]);
  const [history, setHistory] = useState([]);

  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const email = storedUser?.email;

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Popular destinations
        const popularRes = await API.get("/popular");
        setPopular(popularRes.data);

        if (email) {
          // Search history
          const historyRes = await API.get(
            `/auth/search-history/${email}`
          );
          setHistory(
            historyRes.data
            .slice(-5)
            .reverse()
          );


          // Profile preferences (auto-fill)
          const profileRes = await API.get(
            `/auth/profile/${email}`
          );

          const prefs = profileRes.data.profile?.preferences || profileRes.data.preferences;

          if (prefs) {
            if (prefs.categories?.length > 0)
              setInterest(prefs.categories[0]);

            if (prefs.budget_range)
              setBudget(prefs.budget_range);

            if (prefs.trip_duration)
              setDays(prefs.trip_duration);
          }
        }
      } catch (err) {
        console.error("Error loading planner data", err);
      }
    };

    fetchData();
  }, [email]);

  // ---------------- SUBMIT ----------------
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/recommendations", {
      state: { interest, budget, days },
    });
  };

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

      {/* PLANNER CARD */}
      <div className="container d-flex justify-content-center mt-5">
        <div
          className="card shadow-lg p-4"
          style={{
            maxWidth: "520px",
            width: "100%",
            borderRadius: "16px",
          }}
        >
          <div className="text-center mb-4">
            <h3 className="fw-bold">Plan Your Trip</h3>
            <p className="text-muted mb-0">
              Tell us your preferences and we’ll suggest the best destinations
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Travel Interest</label>
              <input
                type="text"
                className="form-control"
                placeholder="Beach, Heritage, Spiritual, Adventure..."
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Daily Budget (₹)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter your budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">
                Trip Duration (Days)
              </label>
              <select
                className="form-select"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                required
              >
                <option value="">Select days</option>
                <option value="1">1 Day</option>
                <option value="2">2 Days</option>
                <option value="3">3 Days</option>
                <option value="4">4 Days</option>
                <option value="5">5 Days</option>
                <option value="7">7 Days</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 py-2"
              style={{ borderRadius: "10px" }}
            >
              Get Recommendations
            </button>
          </form>
        </div>
      </div>

      {/* POPULAR DESTINATIONS */}
      <div className="container mt-5" id="popular-section">
        <h4 className="fw-bold mb-3">
          🔥 Top Destinations
        </h4>

        <div className="row">
          {popular.map((p, index) => (
            <div className="col-md-4 mb-3" key={index}>
              <div className="card shadow-sm">
                <img
                  src={`https://picsum.photos/400/250?random=popular${index}`}
                  className="card-img-top"
                  alt={p.destination}
                  style={{
                    height: "160px",
                    objectFit: "cover",
                  }}
                />
                <div className="card-body">
                  <h6 className="fw-bold">
                    {p.destination}
                  </h6>
                  <p className="text-muted small mb-2">
                    {p.state}
                  </p>
                  <p className="small mb-2">
                    ⭐ {p.popularity_score} | 🛡{" "}
                    {p.safety_rating}
                  </p>
                  <p className="fw-semibold mb-0">
                    ₹{p.budget} / day
                  </p>
                </div>
                <button
  className={`heart-btn ${isSaved(p.destination) ? "active" : ""}`}
  onClick={() => toggleSaveTrip(p)}
>
  <span className="heart-icon">
    {isSaved(p.destination) ? "❤️" : "🤍"}
  </span>
</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT SEARCHES */}
      <div className="container mt-5 mb-5" id="history-section">
        <h4 className="fw-bold mb-3">
          🕒 Recent Searches
        </h4>

        {history.length === 0 ? (
          <p className="text-muted">
            No recent searches yet.
          </p>
        ) : (
          <div className="row">
            {history.map((h, index) => (
              <div className="col-md-4 mb-3" key={index}>
                <div className="card shadow-sm p-3">
                  <p className="mb-1 fw-semibold">
                    {h.interest}
                  </p>
                  <p className="small text-muted mb-1">
                    ₹{h.budget} • {h.days} days
                  </p>
                  <p className="small text-muted mb-0">
                    {new Date(
                      h.timestamp
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Planner;
