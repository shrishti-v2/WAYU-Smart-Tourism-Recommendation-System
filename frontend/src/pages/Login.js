import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem(
  "user",
  JSON.stringify({
    name: res.data.name,
    email: res.data.email
  })
);
      navigate("/planner");
    } catch (err) {
      alert("Invalid credentials");
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
        style={{ width: "380px", borderRadius: "15px" }}
      >
        {/* LOGO */}
        <div className="text-center mb-3">
          <img
          src="/wayu-logo.png"
          alt="WAYU Logo"
          style={{
            width: "220px",
            display: "block",
            margin: "0 auto"
          }}
          />
          <p
          className="text-muted mt-1"
          style={{
            fontSize: "14px",
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: "0.5px"
            }}
            >
              Explore Smarter, Travel Better
          </p>
        </div>
        {/* LOGIN FORM */}
        <form onSubmit={handleLogin}>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100 mt-2"
          >
            Login
          </button>
        </form>

        {/* REGISTER LINK */}
        <p className="text-center mt-3 mb-0">
          New to WAYU?{" "}
          <Link to="/register" className="fw-semibold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
