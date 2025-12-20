import React, { useState } from 'react'
import '../../styles/reels.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreateFood = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name) return alert('Please provide a name')
    if (!videoFile) return alert('Please choose a video file')
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('video', videoFile)
      fd.append('name', name)
      fd.append('description', description)

      const res = await axios.post('http://localhost:3000/api/food', fd, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } })
      // after creation, redirect to reels or profile
      navigate('/reels')
    } catch (err) {
      console.error('Create food error', err)
      alert(err?.response?.data?.message || err.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{padding:20}}>
      <h2>Create Food Video</h2>
      <form onSubmit={handleSubmit} style={{maxWidth:560}}>
        <div style={{marginBottom:12}}>
          <label style={{display:'block', marginBottom:6}}>Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Meal name" style={{width:'100%', padding:8}} />
        </div>

        <div style={{marginBottom:12}}>
          <label style={{display:'block', marginBottom:6}}>Description</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Short description" style={{width:'100%', padding:8}} />
        </div>

        <div style={{marginBottom:12}}>
          <label style={{display:'block', marginBottom:6}}>Video file</label>
          <input type="file" accept="video/*" onChange={e=>setVideoFile(e.target.files && e.target.files[0])} />
        </div>

        <div>
          <button type="submit" disabled={loading} style={{padding:'10px 16px', background:'#ff5a5f', color:'#fff', border:'none', borderRadius:8}}>
            {loading ? 'Uploading...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateFood
