import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './profile.css'

const Profile = () => {
  const { id } = useParams()
  const [partner, setPartner] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  const [currentPartnerId, setCurrentPartnerId] = useState(null)
  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        // correct auth route prefix: auth routes are mounted under /api/auth
        const [pRes, fRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/auth/foodpartner/${id}`),
          axios.get('http://localhost:3000/api/food')
        ])
        if (!mounted) return
        setPartner(pRes.data.foodPartner || pRes.data)
        // filter food items that belong to this partner
        const items = Array.isArray(fRes.data.foodItems) ? fRes.data.foodItems : (Array.isArray(fRes.data) ? fRes.data : [])
        const filtered = items.filter(it => {
          // foodPartner may be populated object or an id string
          const raw = it.foodPartner
          const pid = raw && typeof raw === 'object' ? (raw._id || raw.id || raw) : raw
          return String(pid) === String(id)
        })
        setVideos(filtered)
      } catch (err) {
        // try to fetch current authenticated partner id (optional)
        try {
          const me = await axios.get('http://localhost:3000/api/auth/foodpartner/me', { withCredentials: true })
          const meId = me?.data?.foodPartener?._id || me?.data?.foodPartener?.id
          setCurrentPartnerId(meId)
        } catch (e) {
          // ignore if not logged in
        }
        console.error('Profile load error', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id])

  if (loading) return <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading profile…</div>
  if (!partner) return <div style={{padding:24}}>Partner not found.</div>

  return (
    <div className="profile-page">
      <div style={{position:'fixed', right:12, top:12, zIndex:40, background:'rgba(0,0,0,0.5)', color:'#fff', padding:8, borderRadius:6, fontSize:12}}>
      <div style={{display:'flex', justifyContent:'flex-end', padding:12}}>
        {String(currentPartnerId) === String(id) && (
          <button onClick={() => window.location.assign('/create-food')} style={{padding:'8px 12px', background:'#ff5a5f', color:'#fff', border:'none', borderRadius:6}}>Create Food</button>
        )}
      </div>
        <div>profile id: <code style={{color:'#fff'}}>{id}</code></div>
        <div style={{marginTop:6}}>partner._id: <code style={{color:'#fff'}}>{partner._id || partner.id || '–'}</code></div>
      </div>
      <details style={{position:'fixed', right:12, top:80, zIndex:40, maxWidth:360, background:'rgba(0,0,0,0.5)', color:'#fff', padding:8, borderRadius:6}}>
        <summary style={{cursor:'pointer'}}>Raw data (debug)</summary>
        <pre style={{whiteSpace:'pre-wrap', fontSize:11, color:'#ddd', maxHeight:320, overflow:'auto'}}>{JSON.stringify({partner, videos}, null, 2)}</pre>
      </details>
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar" />

          <div className="header-right">
            <div className="pill-row">
              <div className="pill">{partner.name || partner.RestaurantName || 'Business Name'}</div>
              <div className="pill">{partner.address || 'Address'}</div>
            </div>
            <div style={{height:6}} />
            <div style={{fontSize:13, color:'var(--pf-muted)'}}>{partner.tagline || partner.contactName || ''}</div>
          </div>
        </div>

        <div className="stats">
          <div className="stat-col">
            <div className="stat-label">total meals</div>
            <div className="stat-value">{videos.length}</div>
          </div>
          <div className="stat-col">
            <div className="stat-label">customer serve</div>
            <div className="stat-value">15K</div>
          </div>
        </div>

        <div className="divider" />

        <div className="videos-grid">
          {videos.map((it, i) => (
            <div className="video-tile" key={i}>
              <video src={it.video || it.videoUrl || it.url} controls style={{width:'100%'}} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile
