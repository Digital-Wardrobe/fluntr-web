'use client'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Other people, drifting across the page.
 *
 * Playful presence tags like a multiplayer canvas: an arrow, a name, a city.
 * The names are closet-flavoured animal handles, not people, and say so by
 * being obviously made up. They move on slow looping paths so the page never
 * sits still even before anyone scrolls.
 */
// Paths stay in the outer fifths of the box so no tag ever crosses the copy.
const TAGS = [
  { name: 'Linen Fox', city: 'Bengaluru', tone: '#F28C38', path: [[-6, 14], [6, 2], [-2, 34], [-6, 14]], dur: 26, delay: 0 },
  { name: 'Denim Owl', city: 'Mumbai', tone: '#3C6DD9', path: [[92, 6], [84, 24], [96, 40], [92, 6]], dur: 30, delay: 3, mobileHidden: true },
  { name: 'Silk Heron', city: 'Delhi', tone: '#7B6CF6', path: [[88, 62], [96, 80], [82, 92], [88, 62]], dur: 24, delay: 6, mobileHidden: true },
  { name: 'Velvet Cat', city: 'Hyderabad', tone: '#4F9D6B', path: [[-4, 70], [8, 58], [-8, 88], [-4, 70]], dur: 28, delay: 9, mobileHidden: true },
]

function Arrow({ tone }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden style={{ display: 'block', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.25))' }}>
      <path d="M5 3l14 8-6.5 1.5L10 19z" fill={tone} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

export default function Cursors({ className = '' }) {
  const reduce = useReducedMotion()
  return (
    <div aria-hidden className={`pointer-events-none absolute -inset-x-8 inset-y-0 z-30 md:-inset-x-24 ${className}`}>
      {TAGS.map(t => (
        <motion.div
          key={t.name}
          className={`absolute ${t.mobileHidden ? 'hidden md:block' : ''}`}
          style={{ left: `${t.path[0][0]}%`, top: `${t.path[0][1]}%` }}
          animate={reduce ? undefined : { left: t.path.map(p => `${p[0]}%`), top: t.path.map(p => `${p[1]}%`) }}
          transition={{ duration: t.dur, delay: t.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + t.delay * 0.15, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <Arrow tone={t.tone} />
            <div
              className="whitespace-nowrap"
              style={{
                marginLeft: 16, marginTop: -4, padding: '7px 12px', borderRadius: 14,
                background: t.tone, color: '#fff', fontSize: 12, fontWeight: 600, lineHeight: 1.2,
                boxShadow: `0 10px 24px -8px ${t.tone}99`,
              }}
            >
              {t.name}
              <div style={{ fontSize: 10.5, fontWeight: 500, opacity: 0.9, marginTop: 1 }}>{t.city}</div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
