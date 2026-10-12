'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

/**
 * Closet sounds.
 *
 * Eight short samples synthesised for this site: a hanger clink, a fabric
 * swish, a zip, a camera shutter, a soft pop, a three-note chime, a whoosh and
 * a dry tick. They play only on things the visitor does (a tap, a step, a
 * reply), never on scroll or hover, and never before the first gesture, which
 * is also the browser's rule.
 *
 * Volume lives in localStorage so the choice sticks across visits. The default
 * is low on purpose: 20 of 100, the level a UI should sit at when nobody asked
 * for sound. The toggle in the nav mutes it in one tap.
 */

const KEY = 'fluntr-sfx-volume'
const DEFAULT = 20
const NAMES = ['pop', 'tick', 'hanger', 'swish', 'zip', 'shutter', 'chime', 'whoosh']

const Ctx = createContext({ play: () => {}, volume: DEFAULT, setVolume: () => {}, muted: false })

export function SoundProvider({ children }) {
  const [volume, setVol] = useState(DEFAULT)
  const unlocked = useRef(false)
  const cache = useRef(new Map())

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY)
      if (v != null) setVol(Math.max(0, Math.min(100, parseInt(v, 10) || 0)))
    } catch {}
    // First gesture: mark unlocked and warm the cache so the first real play
    // has no fetch latency.
    const unlock = () => {
      unlocked.current = true
      for (const n of NAMES) {
        if (cache.current.has(n)) continue
        const a = new Audio(`/sounds/${n}.mp3`)
        a.preload = 'auto'
        cache.current.set(n, a)
      }
    }
    const evs = ['pointerdown', 'keydown', 'touchstart']
    evs.forEach(e => window.addEventListener(e, unlock, { once: true, passive: true }))
    return () => evs.forEach(e => window.removeEventListener(e, unlock))
  }, [])

  const setVolume = useCallback(v => {
    setVol(v)
    try { localStorage.setItem(KEY, String(v)) } catch {}
  }, [])

  const play = useCallback((name, { gain = 1, rate = 1 } = {}) => {
    if (!volume || !unlocked.current) return
    try {
      let a = cache.current.get(name)
      if (!a) { a = new Audio(`/sounds/${name}.mp3`); cache.current.set(name, a) }
      // A sample still playing is cloned rather than restarted, so quick
      // successive taps overlap instead of cutting each other off.
      const el = a.paused || a.ended ? a : a.cloneNode()
      el.volume = Math.max(0, Math.min(1, (volume / 100) * gain))
      el.playbackRate = rate
      el.currentTime = 0
      el.play().catch(() => {})
    } catch {}
  }, [volume])

  const value = useMemo(() => ({ play, volume, setVolume, muted: volume === 0 }), [play, volume, setVolume])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useSound = () => useContext(Ctx)

export function SoundToggle({ className = '' }) {
  const { muted, setVolume, play } = useSound()
  return (
    <button
      type="button"
      aria-pressed={!muted}
      aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
      title={muted ? 'Sound off' : 'Sound on'}
      onClick={() => {
        if (muted) { setVolume(DEFAULT); setTimeout(() => play('pop'), 30) }
        else { play('tick'); setVolume(0) }
      }}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[rgba(18,19,23,0.06)] ${className}`}
      style={{ color: muted ? '#9AA0A6' : '#121317', background: 'transparent', border: 0, cursor: 'pointer' }}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 9v6h4l5 4V5L8 9z" />
        {muted ? <path d="m17 9 4 6M21 9l-4 6" /> : <><path d="M16.5 8.5a5 5 0 0 1 0 7" /><path d="M19 6a8.5 8.5 0 0 1 0 12" /></>}
      </svg>
    </button>
  )
}
