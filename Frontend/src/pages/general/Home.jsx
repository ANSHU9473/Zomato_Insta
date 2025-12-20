import React from 'react'
import './Home.css'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="home-container">
      <Link to="/register" className="btn">
        Choose Account
      </Link>
    </div>
  )
}

export default Home
