import React, { useEffect, useRef, useState } from 'react'
import '../styles/reels.css'
import axios from 'axios'
import { useNavigate,Link } from 'react-router-dom'




const Reels = () => {
  const containerRef = useRef(null)
  const [videos, setVideos] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollingRef = useRef(false)
  const touchStartY = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const vidEls = Array.from(container.querySelectorAll('video'))
    const reelEls = Array.from(container.querySelectorAll('.reel'))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const vid = entry.target
          const idx = reelEls.findIndex(r => r.contains(vid))
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            setActiveIndex(idx >= 0 ? idx : 0)
            vidEls.forEach((v) => { if (v !== vid) v.pause() })
            vid.play().catch(() => {})
          } else {
            vid.pause()
          }
        })
      },
      { threshold: [0.6] }
    )

    vidEls.forEach((v) => observer.observe(v))

    // navigation handlers
    const scrollToIndex = (idx) => {
      const reels = Array.from(container.querySelectorAll('.reel'))
      if (!reels.length) return
      const clamped = Math.max(0, Math.min(reels.length - 1, idx))
      if (clamped === activeIndex) return
      scrollingRef.current = true
      reels[clamped].scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => { scrollingRef.current = false; setActiveIndex(clamped) }, 700)
    }

    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') scrollToIndex(activeIndex + 1)
      if (e.key === 'ArrowUp' || e.key === 'PageUp') scrollToIndex(activeIndex - 1)
      if (e.key === ' ') { e.preventDefault(); scrollToIndex(activeIndex + 1) }
    }

    let wheelTimeout
    const onWheel = (ev) => {
      ev.preventDefault()
      if (scrollingRef.current) return
      scrollingRef.current = true
      if (ev.deltaY > 0) scrollToIndex(activeIndex + 1)
      else if (ev.deltaY < 0) scrollToIndex(activeIndex - 1)
      clearTimeout(wheelTimeout)
      wheelTimeout = setTimeout(() => { scrollingRef.current = false }, 700)
    }

    const onTouchStart = (ev) => { touchStartY.current = ev.touches[0].clientY }
    const onTouchEnd = (ev) => {
      if (touchStartY.current == null) return
      const endY = ev.changedTouches[0].clientY
      const diff = touchStartY.current - endY
      if (Math.abs(diff) > 40) {
        if (diff > 0) scrollToIndex(activeIndex + 1)
        else scrollToIndex(activeIndex - 1)
      }
      touchStartY.current = null
    }

    window.addEventListener('keydown', onKey)
    container.addEventListener('wheel', onWheel, { passive: false })
    container.addEventListener('touchstart', onTouchStart, { passive: true })
    container.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('keydown', onKey)
      container.removeEventListener('wheel', onWheel)
      container.removeEventListener('touchstart', onTouchStart)
      container.removeEventListener('touchend', onTouchEnd)
    }
  }, [activeIndex])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [lastCount, setLastCount] = useState(null)

  const loadVideos = async () => {
    setLoading(true)
    setFetchError(null)
    let mounted = true
    try {
      const response = await axios.get('http://localhost:3000/api/food', { withCredentials: true })
      if (!mounted) return
      // try common response shapes
      const items = Array.isArray(response.data.foodItems)
        ? response.data.foodItems
        : Array.isArray(response.data)
          ? response.data
          : []
      setVideos(items)
      setLastCount(items.length)
    } catch (err) {
      // improved debug logging so you can see status/body in browser console
      console.error('Reels fetch error (detailed):', {
        message: err?.message,
        code: err?.code,
        status: err?.response?.status,
        responseData: err?.response?.data,
        responseHeaders: err?.response?.headers,
        requestPresent: !!err?.request
      })
      setFetchError(err.message || 'Fetch error')
      setVideos([])
      setLastCount(0)
    } finally {
      setLoading(false)
    }
    return () => { mounted = false }
  }

  useEffect(() => { loadVideos() }, [])

  // use only backend data; do not use any demo fallback
  const sourceItems = videos

  if (loading) {
    return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading videos…</div>
  }

  if (!sourceItems || !sourceItems.length) {
    return (
      <div className="reels-empty" style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: 24, flexDirection: 'column'}}>
        <div style={{color: '#fff', marginBottom: 12}}>No videos available from the backend.</div>
        <div style={{color: '#ccc', fontSize: 13, marginBottom: 12}}>Last fetch returned {lastCount === null ? 'no result' : lastCount} items.</div>
        {fetchError && <div style={{color: '#ffb3b3', marginBottom: 12}}>Error: {fetchError}</div>}
        <div style={{display: 'flex', gap: 12}}>
          <button onClick={loadVideos} style={{padding: '8px 14px', borderRadius: 8, background: '#ff5a5f', color: '#fff', border: 'none'}}>Retry</button>
          <button onClick={() => console.log('Reels debug:', { videos })} style={{padding: '8px 14px', borderRadius: 8, background: '#333', color: '#fff', border: 'none'}}>Log Debug</button>
        </div>
        <div style={{marginTop: 18, color: '#999', fontSize: 12}}>If Postman returns items but this page shows none, there may be a browser CORS or authorization issue.</div>
      </div>
    )
  }

  return (
    <div className="reels-container" ref={containerRef}>
      {sourceItems.map((item, index) => (
        <section className="reel" key={item.foodPartner || item._id || item.id || index}>
          <video
            className="reel-video"
            src={item.videoUrl || item.video || item.url}
            muted
            playsInline
            loop
            preload="metadata"
            autoPlay
          />

          <div className="reel-overlay">
            <div className="reel-meta">
              <h3 className="reel-title">{item.title || `Video ${index+1}`}</h3>
              <p className="reel-desc">{item.description || ''}</p>
              {/* debug: show computed partner id for this reel */}
              <div style={{marginTop:8, color:'#ddd', fontSize:12}}>partner id: <code style={{color:'#fff'}}>{(item.foodPartner && item.foodPartner._id) ? item.foodPartner._id : (item.foodPartner || item._id || item.id || `fallback-${index}`)}</code></div>
              <Link className="visit-btn" to={'/food-partner/' + (item.foodPartner && item.foodPartner._id ? item.foodPartner._id : (item.foodPartner || item._id || item.id || `fallback-${index}`))}>Visit Store</Link>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}

export default Reels
