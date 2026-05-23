import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const username = storedUser?.name;
  const location = useLocation();

  const [showPanel, setShowPanel] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark px-4">
        <div
          className="navbar-brand d-flex align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/planner")}
        >
          <img
            src="/wayu-logo.png"
            alt="WAYU"
            className="me-2"
            style={{
            height: "50px",
            filter: "drop-shadow(0 0 4px rgba(255,255,255,0.6))",
          }}
          />
          <span className="fw-bold">
            Explore Smarter, Travel Better
          </span>
        </div>

        <div className="ms-auto d-flex align-items-center gap-4">

          {/* Home */}
          <span
  className={`nav-link ${
    location.pathname === "/planner" ? "active-link" : ""
  }`}
  style={{ cursor: "pointer" }}
  onClick={() => navigate("/planner")}
>
  Home
</span>

          {/* Scroll to Popular */}
          <span
            className="nav-link"
            style={{ cursor: "pointer" }}
            onClick={() =>
              document
                .getElementById("popular-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Top Destinations
          </span>

          {/* Scroll to History */}
          <span
            className="nav-link"
            style={{ cursor: "pointer" }}
            onClick={() =>
              document
                .getElementById("history-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Recent Searches
          </span>

          {/* Username */}
          <span
            className="nav-link fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() => setShowPanel(true)}
          >
            {username}
          </span>
        </div>
      </nav>

      {/* Side Panel */}
      {showPanel && (
        <div className="side-panel">
  <div className="d-flex justify-content-between align-items-center mb-4">
    <h5 className="fw-bold mb-0">My Account</h5>
    <button
      className="btn-close"
      onClick={() => setShowPanel(false)}
    />
  </div>

  <div className="text-center mt-4">
  <div className="avatar-circle">
    {username?.charAt(0).toUpperCase()}
  </div>
  <p className="fw-semibold">{username}</p>
</div>

<div className="side-divider"></div>

<div className="side-actions">
  <button
    className="btn btn-outline-dark w-100"
    onClick={() => {
      navigate("/profile");
      setShowPanel(false);
    }}
  >
    Profile
  </button>

  <button
    className="btn btn-outline-dark w-100"
    onClick={() => {
      navigate("/saved-trips");
      setShowPanel(false);
    }}
  >
    Saved Trips
  </button>

  <button
    className="btn btn-dark w-100"
    onClick={handleLogout}
  >
    Logout
  </button>

</div>
</div>
      )}
    </>
  );
}

export default Navbar;