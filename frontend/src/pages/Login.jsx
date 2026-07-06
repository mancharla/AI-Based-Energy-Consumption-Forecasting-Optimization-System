import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", form);

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", response.data.user.name);

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <h1>Welcome Back</h1>
          <p>
            Login to monitor energy usage, forecast demand, detect anomalies and
            optimize consumption.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <p className="auth-subtitle">Access your Energy AI dashboard</p>

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-btn">
            Login
          </button>

          <p className="auth-link">
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;