import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Header = () => {
  const [partnerId, setPartnerId] = useState(null)
  const [userId, setUserId] = useState(null)
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
    // fetch current user (if any)
    axios.get('http://localhost:3000/api/auth/user/me', { withCredentials: true })
      .then(res => {
        if (!mounted) return
        const id = res?.data?.user?._id || res?.data?.user?.id
        setUserId(id)
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
        {partnerId && (
          <>
            <button onClick={()=> navigate('/create-food')} style={{padding:'8px 12px', borderRadius:8, background:'#ff5a5f', color:'#fff', border:'none'}}>Create Food</button>
            <button onClick={async () => {
              try {
                await axios.get('http://localhost:3000/api/auth/foodpartner/logout', { withCredentials: true })
                setPartnerId(null)
                navigate('/')
              } catch (err) {
                console.error('Food partner logout error', err)
                alert(err?.response?.data?.message || 'Logout failed')
              }
            }} style={{padding:'8px 12px', borderRadius:8, background:'#333', color:'#fff', border:'none'}}>Logout Partner</button>
          </>
        )}

        {userId && (
          <button onClick={async () => {
            try {
              await axios.get('http://localhost:3000/api/auth/user/logout', { withCredentials: true })
              setUserId(null)
              navigate('/')
            } catch (err) {
              console.error('User logout error', err)
              alert(err?.response?.data?.message || 'Logout failed')
            }
          }} style={{padding:'8px 12px', borderRadius:8, background:'#333', color:'#fff', border:'none'}}>Logout</button>
        )}
      </div>
    </header>
  )
}

export default Header
