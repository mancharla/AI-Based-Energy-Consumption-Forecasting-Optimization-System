import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    await API.post("/auth/register", {
      name: form.name,
      email: form.email,
      password: form.password,
    });

    alert("Registration successful. Please login.");
    navigate("/login");
  } catch (error) {
    alert(error.response?.data?.detail || "Registration failed");
  }
};
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <h1>Create Account</h1>
          <p>
            Build an AI-powered energy optimization system with forecasting,
            peak prediction and smart recommendations.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleRegister}>
          <h2>Register</h2>
          <p className="auth-subtitle">Create your Energy AI account</p>

          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={form.name}
            onChange={handleChange}
            required
          />

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
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-btn">
            Register
          </button>

          <p className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;