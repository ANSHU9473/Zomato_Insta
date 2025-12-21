import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import '../styles/auth.css';
import axios from'axios';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('User Login:', formData);

    try {
      const res = await axios.post("http://localhost:3000/api/auth/user/login", {
        email: formData.email,
        password: formData.password
      }, { withCredentials: true });

      // navigate only when login succeeded
      if (res?.data?.user?._id) {
        navigate("/reels");
      } else {
        alert(res?.data?.message || 'Login failed');
      }
    } catch (err) {
      console.error('User login error', err);
      alert(err?.response?.data?.message || err.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="account-toggle">
          <Link to="/user/login" className={`account-option ${location.pathname.includes('/user') ? 'active' : ''}`}>
            User
          </Link>
          <Link to="/food-partner/login" className={`account-option ${location.pathname.includes('/food-partner') ? 'active' : ''}`}>
            Food-Partner
          </Link>
        </div>
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">Login</button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
