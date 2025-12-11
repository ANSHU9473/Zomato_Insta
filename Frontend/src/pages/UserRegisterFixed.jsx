import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import axios from 'axios';

const UserRegisterFixed = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const password = e.target.password.value;

 const response = axios.post("http://localhost:3000/api/auth/user/register", {
      name,
      email,
      phone,
      password
    },{
        withCredentials:true
    });
    console.log(response.data);  

    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="account-toggle">
          <Link 
            to="/user/register" 
            className={`account-option ${
              location.pathname.includes('/user') ? 'active' : ''
            }`}
          >
            User
          </Link>

          <Link 
            to="/food-partner/register" 
            className={`account-option ${
              location.pathname.includes('/food-partner') ? 'active' : ''
            }`}
          >
            Food-Partner
          </Link>
        </div>

        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Sign up as a customer</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input 
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="submit-btn">Register</button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/user/login">Login</Link>
        </div>

      </div>
    </div>
  );
};

export default UserRegisterFixed;
