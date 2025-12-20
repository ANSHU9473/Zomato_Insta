import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Header = () => {
  const [partnerId, setPartnerId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    axios.get('http://localhost:3000/api/auth/foodpartner/me', { withCredentials: true })
      .then(res => {
        if (!mounted) return
        const id = res?.data?.foodPartener?._id || res?.data?.foodPartener?.id
        setPartnerId(id)
      })
      .catch(()=>{})
    return () => { mounted = false }
  }, [])

  return (
    <header style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:12, borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
      <div>
        <Link to="/" style={{textDecoration:'none', color:'#fff', fontWeight:700}}>Food App</Link>
      </div>
      <div style={{display:'flex', gap:12}}>
        <Link to="/reels" style={{background:'linear-gradient(90deg,#ff7a7a,#ff5a5f)', padding:'8px 12px', borderRadius:8, color:'#fff', textDecoration:'none'}}>Food Zone</Link>
        {partnerId && (
          <button onClick={()=> navigate('/create-food')} style={{padding:'8px 12px', borderRadius:8, background:'#ff5a5f', color:'#fff', border:'none'}}>Create Food</button>
        )}
      </div>
    </header>
  )
}

export default Header
