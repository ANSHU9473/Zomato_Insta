import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import '../styles/auth.css';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    RestaurantName: '',
    name: '',
    email: '',
    phone: '',
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
    console.log('Food Partner Register:', formData);
    axios.post("http://localhost:3000/api/auth/food-partner/register",{
      restaurantName:formData.RestaurantName,
      name:formData.name,
      email:formData.email,
      phone:formData.phone,
      password:formData.password
    }
  ,{        withCredentials:true
      })
      navigate("/create-food");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="account-toggle">
          <Link to="/user/register" className={`account-option ${location.pathname.includes('/user') ? 'active' : ''}`}>
            User
          </Link>
          <Link to="/food-partner/register" className={`account-option ${location.pathname.includes('/food-partner') ? 'active' : ''}`}>
            Food-Partner
          </Link>
        </div>
        <div className="auth-header">
          <h1>Partner With Us</h1>
          <p>Register your restaurant</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="restaurantName">Restaurant Name</label>
            <input
              type="text"
              id="restaurantName"
              name="restaurantName"
              placeholder="Enter your restaurant name"
              value={formData.restaurantName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ownerName">Owner Name</label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              placeholder="Enter your full name"
              value={formData.ownerName}
              onChange={handleChange}
              required
            />
          </div>

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
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          

          <button type="submit" className="submit-btn">Register</button>
        </form>

        <div className="auth-footer">
          Already registered? <a href="/food-partner/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;
