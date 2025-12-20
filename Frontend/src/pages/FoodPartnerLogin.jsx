import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import '../styles/auth.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const FoodPartnerLogin = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
    console.log('Food Partner Login:', formData);
    (async () => {
      try {
        const res = await axios.post('http://localhost:3000/api/auth/foodpartner/login', {
          email: formData.email,
          password: formData.password
        }, { withCredentials: true })
        const partnerId = res?.data?.foodPartener?._id || res?.data?.foodPartener?.id
        if (partnerId) navigate(`/food-partner/${partnerId}`)
        else navigate('/create-food')
      } catch (err) {
        console.error('Food partner login error', err)
        alert(err?.response?.data?.message || err.message || 'Login failed')
      }
    })()
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
          <h1>Partner Login</h1>
          <p>Sign in to your restaurant account</p>
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
          Don't have a restaurant account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
