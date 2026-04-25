'use client'
import { useState } from 'react'
import Sparkle from './Sparkle'

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzSQkxDshm3SigX4og7GHrz98ywQGmakHJy_yDKelY9fwMsn9lJ9Wco7y1XTU0HYynn9g/exec'

export default function WaitlistForm({ onSuccess }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [struggle, setStruggle] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = true
    if (!phone.trim()) e.phone = true
    if (!struggle) e.struggle = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, struggle }),
      })
      setDone(true)
      if (onSuccess) onSuccess()
    } catch (err) {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 p-12 text-center"
        style={{ border: '0.5px solid rgba(201,168,76,0.25)', background: 'rgba(201,168,76,0.03)' }}>
        <Sparkle size={40} animate />
        <h3 className="font-cormorant text-3xl font-normal" style={{ color: '#E2C97E' }}>
          You're on the runway.
        </h3>
        <p className="text-xs leading-relaxed tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Welcome to Flauntr. Your closet's about to get its moment —<br />we'll be in touch soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md mx-auto">
      <input
        className="gold-input"
        placeholder="Your Name"
        value={name}
        onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: false })) }}
        style={errors.name ? { borderColor: 'rgba(201,168,76,0.8)' } : {}}
        autoComplete="off"
      />
      <input
        className="gold-input"
        placeholder="Phone Number"
        type="tel"
        value={phone}
        onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: false })) }}
        style={errors.phone ? { borderColor: 'rgba(201,168,76,0.8)' } : {}}
        autoComplete="off"
      />
      <select
        className="gold-input"
        value={struggle}
        onChange={e => { setStruggle(e.target.value); setErrors(p => ({ ...p, struggle: false })) }}
        style={{
          color: struggle ? 'white' : 'rgba(255,255,255,0.25)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23C9A84C' opacity='.6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 16px center',
          ...(errors.struggle ? { borderColor: 'rgba(201,168,76,0.8)' } : {}),
        }}>
        <option value="" disabled>Your Biggest Wardrobe Struggle</option>
        <option value="I never know what to wear">I never know what to wear</option>
        <option value="I forget what clothes I own">I forget what clothes I own</option>
        <option value="Can't plan outfits for occasions">Can't plan outfits for occasions</option>
        <option value="My partner / friends never agree on my fits">My partner / friends never agree on my fits 😅</option>
      </select>
      <button type="submit" disabled={loading} className="btn-gold mt-1 w-full"
        style={{ opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Joining...' : 'Join the Waitlist ✦'}
      </button>
      <p className="text-center mt-2"
        style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em' }}>
        No spam. No noise. Just Flauntr.
      </p>
    </form>
  )
}