import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });
      alert("Registration successful. Please login.");
      navigate("/");
    } catch (err) {
      alert("Registration failed. Try again.");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ width: "400px", borderRadius: "15px" }}
      >
        {/* LOGO + TAGLINE */}
        <div className="text-center mb-4">
          <img
            src="/wayu-logo.png"
            alt="WAYU Logo"
            style={{
              width: "220px",
              display: "block",
              margin: "0 auto",
            }}
          />

          <p
            className="text-muted mt-1"
            style={{
              fontSize: "14px",
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "0.5px",
            }}
          >
            Explore Smarter, Travel Better
          </p>
        </div>

        {/* REGISTER FORM */}
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-dark w-100 mt-2">
            Create Account
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <Link to="/" className="fw-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
