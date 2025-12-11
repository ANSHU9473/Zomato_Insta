import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/auth.css'

const ChooseAccount = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Choose account type to continue</p>
        </div>

        <div style={{display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12}}>
          <Link to="/user/register" className="account-option" style={{padding: '12px 20px'}}>User</Link>
          <Link to="/food-partner/register" className="account-option" style={{padding: '12px 20px'}}>Food-Partner</Link>
        </div>

        <div className="auth-footer" style={{marginTop: 24}}>
          Already have an account? <Link to="/user/login">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default ChooseAccount
