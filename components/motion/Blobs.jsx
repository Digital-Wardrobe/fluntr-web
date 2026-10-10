'use client'
import { motion, useReducedMotion } from 'framer-motion'

/** Soft colour behind a section: three tinted clouds, drifting. */
export default function Blobs({ tones = ['#FFE3CC', '#DDEFF3', '#ECE9FF'], opacity = 0.9 }) {
  const reduce = useReducedMotion()
  const spots = [
    { left: '8%', top: '10%', size: 520, x: [0, 40, -20, 0], y: [0, -30, 20, 0], d: 26 },
    { left: '62%', top: '-6%', size: 600, x: [0, -50, 30, 0], y: [0, 30, -20, 0], d: 32 },
    { left: '40%', top: '46%', size: 480, x: [0, 30, -40, 0], y: [0, -20, 30, 0], d: 28 },
  ]
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity }}>
      {spots.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, background: tones[i % tones.length], filter: 'blur(70px)', translateX: '-50%', translateY: '-50%' }}
          animate={reduce ? undefined : { x: s.x, y: s.y }}
          transition={{ duration: s.d, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
