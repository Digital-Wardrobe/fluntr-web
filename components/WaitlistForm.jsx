'use client'
import { useState } from 'react'
import { Mark } from './Logo'

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzSQkxDshm3SigX4og7GHrz98ywQGmakHJy_yDKelY9fwMsn9lJ9Wco7y1XTU0HYynn9g/exec'

const ERR = { fontSize: 12, color: '#D93025', marginTop: -6 }

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
    if (!phone.trim() || phone.length < 10) e.phone = true
    if (!struggle) e.struggle = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePhoneChange = e => {
    setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
    setErrors(p => ({ ...p, phone: false }))
  }

  const handleSubmit = async e => {
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
      <div className="glass flex flex-col items-center gap-3 p-10 text-center" style={{ borderRadius: 24 }}>
        <Mark size={34} color="#15171B" />
        <h3 className="h-display" style={{ fontSize: 30, color: '#121317' }}>You&apos;re on the list.</h3>
        <p style={{ fontSize: 14, color: '#767A85' }}>We will tell you the day it opens.</p>
      </div>
    )
  }

  const errStyle = { borderColor: '#D93025', boxShadow: '0 0 0 4px rgba(217,48,37,0.08)' }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-md flex-col gap-3">
      <input
        className="field"
        placeholder="Your name"
        value={name}
        onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: false })) }}
        style={errors.name ? errStyle : undefined}
        autoComplete="name"
      />
      {errors.name ? <p style={ERR}>Please enter your name</p> : null}

      <div className="relative">
        <input
          className="field"
          placeholder="Phone number (10 digits)"
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={handlePhoneChange}
          style={errors.phone ? errStyle : undefined}
          autoComplete="tel"
          maxLength={10}
        />
        <span
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
          style={{ fontSize: 12, color: phone.length === 10 ? '#15171B' : '#9AA0A6', fontVariantNumeric: 'tabular-nums' }}
        >
          {phone.length}/10
        </span>
      </div>
      {errors.phone ? <p style={ERR}>Please enter a valid 10-digit phone number</p> : null}

      <select
        className="field"
        value={struggle}
        onChange={e => { setStruggle(e.target.value); setErrors(p => ({ ...p, struggle: false })) }}
        style={{
          color: struggle ? '#15171B' : '#9AA0A6',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23767A85' stroke-width='1.6' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 16px center',
          ...(errors.struggle ? errStyle : null),
        }}
      >
        <option value="" disabled>Your biggest wardrobe struggle</option>
        <option value="I never know what to wear">I never know what to wear</option>
        <option value="I forget what clothes I own">I forget what clothes I own</option>
        <option value="Can't plan outfits for occasions">Can&apos;t plan outfits for occasions</option>
        <option value="My partner / friends never agree on my fits">My partner / friends never agree on my fits</option>
      </select>
      {errors.struggle ? <p style={ERR}>Please select an option</p> : null}

      <button type="submit" disabled={loading} className="btn-primary mt-1 w-full justify-center" style={{ opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Joining…' : 'Join the waitlist'}
      </button>

      <p className="mt-1 text-center" style={{ fontSize: 12, color: '#9AA0A6' }}>No spam. We will message you once, when it opens.</p>
    </form>
  )
}
