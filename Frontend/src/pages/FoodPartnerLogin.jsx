import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import axios from "axios";

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ EXTENSION-SAFE PARTNER LOGIN
      const res = await axios.post(
        "http://localhost:3000/api/auth/vendor/session/create",
        {
          email: formData.email,
          password: formData.password
        },
        { withCredentials: true }
      );

      const partnerId =
        res?.data?.foodPartener?._id || res?.data?.foodPartener?.id;

      if (partnerId) {
        navigate(`/vendor/profile/${partnerId}`);
      } else {
        navigate("/vendor/create-food");
      }
    } catch (err) {
      console.error("Food partner login error", err);
      alert(
        err?.response?.data?.message ||
          err.message ||
          "Login failed"
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="account-toggle">
          <Link
            to="/login"
            className={`account-option ${
              location.pathname === "/login" ? "active" : ""
            }`}
          >
            User
          </Link>

          <Link
            to="/vendor/login"
            className={`account-option ${
              location.pathname.includes("/vendor") ? "active" : ""
            }`}
          >
            Food Partner
          </Link>
        </div>

        <div className="auth-header">
          <h1>Partner Login</h1>
          <p>Sign in to your restaurant account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>

        <div className="auth-footer">
          Don't have a restaurant account?{" "}
          <Link to="/vendor/signup">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
