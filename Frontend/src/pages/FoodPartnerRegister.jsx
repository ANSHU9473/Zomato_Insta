import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import '../styles/auth.css';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', // restaurant name
    contactName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [videoFile, setVideoFile] = useState(null)
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFile = (e) => {
    const f = e.target.files && e.target.files[0]
    setVideoFile(f || null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        RestaurantName: formData.name,
        contactName: formData.contactName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      }
      // register partner (this sets token2 cookie)
      const res = await axios.post('http://localhost:3000/api/auth/foodpartner/register', payload, { withCredentials: true })
      const partnerId = res?.data?.foodPartener?._id || res?.data?.foodPartener?.id

      // if a video was provided, upload it to /api/food (requires auth cookie set by registration)
      if (videoFile) {
        const fd = new FormData()
        fd.append('video', videoFile)
        fd.append('name', `${formData.name} intro`)
        fd.append('description', `${formData.name} uploaded video`)
        await axios.post('http://localhost:3000/api/food', fd, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } })
      }

      // navigate to partner profile
      if (partnerId) navigate(`/food-partner/${partnerId}`)
      else navigate('/create-food')
    } catch (err) {
      console.error('Register partner error', err)
      alert(err?.response?.data?.message || err.message || 'Registration failed')
    }
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
            <label htmlFor="name">Restaurant Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your restaurant name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactName">Contact Name</label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              placeholder="Enter contact / owner name"
              value={formData.contactName}
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

          <div className="form-group">
            <label htmlFor="video">Intro Video (optional)</label>
            <input type="file" id="video" name="video" accept="video/*" onChange={handleFile} />
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
