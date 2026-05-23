import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

function SavedTrips() {
  const [trips, setTrips] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const email = storedUser?.email;

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await API.get(`/auth/saved-trips/${email}`);
        setTrips(res.data);
      } catch (err) {
        console.error("Error fetching saved trips", err);
      }
    };

    if (email) fetchSaved();
  }, [email]);

  const handleRemove = async (destination) => {
    try {
      await API.post("/auth/remove-trip", {
        email,
        destination,
      });

      const res = await API.get(`/auth/saved-trips/${email}`);
      setTrips(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5 mb-5">
        <h3 className="fw-bold mb-4 text-center">
  <i className="bi bi-heart-fill text-danger me-2"></i>
  Saved Trips
</h3>

        {trips.length === 0 ? (
          <p className="text-center text-muted">
            No saved trips yet.
          </p>
        ) : (
          <div className="row">
            {trips.map((trip, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card shadow-sm popular-card">
                  <img
                    src={`https://picsum.photos/400/250?random=saved${index}`}
                    className="card-img-top"
                    alt={trip.destination}
                    style={{ height: "160px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h6 className="fw-bold">
                      {trip.destination}
                    </h6>
                    <p className="text-muted small mb-2">
                      {trip.state}
                    </p>
                    <p className="fw-semibold mb-2">
                      ₹{trip.budget} / day
                    </p>

                    <button
                      className="btn btn-outline-danger btn-sm w-100"
                      onClick={() =>
                        handleRemove(trip.destination)
                      }
                    >
                      🗑 Remove
                    </button>
                  </div>
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

export default SavedTrips;