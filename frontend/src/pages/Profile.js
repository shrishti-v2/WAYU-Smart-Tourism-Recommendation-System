import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

const defaultProfile = {
    phone: "",
    gender: "",
    dob: "",
    location: "",
    preferences: {
      categories: [],
      budget_range: "",
      trip_duration: "",
      travel_style: ""
    }
  };

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const email = storedUser ? storedUser.email : null;

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: ""
  });

  const [profile, setProfile] = useState(defaultProfile);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/auth/profile/${email}`);

        setUserInfo({
          name: res.data.name,
          email: res.data.email
        });

        setProfile({
          ...defaultProfile,
          ...res.data.profile,
          preferences: {
            ...defaultProfile.preferences,
            ...(res.data.profile?.preferences || {})
          }
        });

      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    if (email) fetchProfile();
  }, [email]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
  try {
    await API.put(`/auth/profile/${email}`, profile);

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);

  } catch (err) {
    console.error("Error updating profile", err);
  }
};

  return (
    <>
      <Navbar />

      <div className="container mt-5 mb-5">
        <div className="card p-4 shadow-lg">

          <div className="text-center mb-4">
            <h3 className="fw-bold">My Profile</h3>
            <h5 className="mt-2">{userInfo.name}</h5>
            <p className="text-muted">{userInfo.email}</p>
          </div>

          {/* Personal Info */}
          <div className="mb-3">
            <label>Phone</label>
            <input
              name="phone"
              className="form-control"
              value={profile.phone}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Gender</label>
            <select
              name="gender"
              className="form-select"
              value={profile.gender}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              className="form-control"
              value={profile.dob}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Location</label>
            <input
              name="location"
              className="form-control"
              value={profile.location}
              onChange={handleChange}
            />
          </div>

          <hr className="my-4" />

          <h5 className="text-center fw-bold mb-3">Travel Preferences</h5>

          <div className="mb-3">
            <label>Favorite Categories</label>
            <input
              className="form-control"
              value={profile.preferences.categories.join(", ")}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  preferences: {
                    ...profile.preferences,
                    categories: e.target.value
                      .split(",")
                      .map((c) => c.trim())
                  }
                })
              }
            />
          </div>

          <div className="mb-3">
            <label>Preferred Budget (₹ per day)</label>
            <input
              type="number"
              className="form-control"
              value={profile.preferences.budget_range}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  preferences: {
                    ...profile.preferences,
                    budget_range: e.target.value
                  }
                })
              }
            />
          </div>

          <div className="mb-3">
            <label>Preferred Trip Duration</label>
            <select
              className="form-select"
              value={profile.preferences.trip_duration}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  preferences: {
                    ...profile.preferences,
                    trip_duration: e.target.value
                  }
                })
              }
            >
              <option value="">Select</option>
              <option value="1">1 Day</option>
              <option value="2">2 Days</option>
              <option value="3">3 Days</option>
              <option value="5">5 Days</option>
              <option value="7">7 Days</option>
            </select>
          </div>

          <div className="mb-3">
            <label>Travel Style</label>
            <select
              className="form-select"
              value={profile.preferences.travel_style}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  preferences: {
                    ...profile.preferences,
                    travel_style: e.target.value
                  }
                })
              }
            >
              <option value="">Select</option>
              <option value="Solo">Solo</option>
              <option value="Family">Family</option>
              <option value="Couple">Couple</option>
              <option value="Friends">Friends</option>
            </select>
          </div>

          <button
            className="btn btn-dark w-100 mt-3"
            onClick={handleSave}
          >
            Save Profile
          </button>

        </div>
      </div>

      {showToast && (
  <div className="toast-container position-fixed bottom-0 end-0 p-3">
    <div className="toast show align-items-center text-white bg-success border-0 shadow">
      <div className="d-flex">
        <div className="toast-body">
          Profile updated successfully 🎉
        </div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          onClick={() => setShowToast(false)}
        ></button>
      </div>
    </div>
  </div>
)}

      <Footer />
    </>
  );
}

export default Profile;