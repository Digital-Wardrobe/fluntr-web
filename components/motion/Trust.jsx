'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { Glyph } from './Demo'
import { KweenPerch } from './KweenRoamer'

/**
 * What Kween asks before she does anything personal. The fit-check line is the
 * app's own promise (also in the stylist section); the rest are the
 * permissions the colour, store and shopping features ask for.
 */

const INK = '#121317'
const MUTED = '#6B7080'

const ASKS = [
  { k: 'camera', tone: '#E0457B', title: 'Your selfie', body: 'Used for your colours, and only after you say yes.' },
  { k: 'globe', tone: '#3C6DD9', title: 'Your location', body: 'Only when you ask for a store near you, for that one search.' },
  { k: 'tag', tone: '#F28C38', title: 'Shopping', body: 'She looks outside your closet only when you tell her to.' },
  { k: 'lock', tone: '#4F9D6B', title: 'Fit checks', body: 'Clothes only, never your body. The photo is deleted straight after.' },
]

export default function Trust() {
  const reduce = useReducedMotion()
  return (
    <section id="trust" className="cv-auto relative scroll-mt-20 px-4 py-16 md:px-6 md:py-24" style={{ containIntrinsicSize: 'auto 700px' }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-eyebrow mb-5">Your permission</p>
            <h2 className="h-display" style={{ fontSize: 'clamp(32px,4.2vw,56px)', color: INK }}>
              Personal, never pushy. She always <span className="serif-accent">asks</span> first.
            </h2>
          </div>
          <KweenPerch name="trust" line="I always ask first. Manners." mood="happy" width="clamp(60px, 6vw, 88px)" />
        </div>
        <ul className="m-0 mt-10 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {ASKS.map((a, n) => (
            <motion.li key={a.title} className="glass flex flex-col gap-3 p-6" style={{ borderRadius: 26 }} initial={reduce ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: n * 0.07 }}>
              <span className="flex h-11 w-11 items-center justify-center" style={{ borderRadius: 14, background: `${a.tone}1f` }}><Glyph k={a.k} color={a.tone} size={20} sw={2} /></span>
              <h3 className="m-0" style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', color: INK }}>{a.title}</h3>
              <p className="m-0 text-[14.5px] leading-relaxed" style={{ color: MUTED }}>{a.body}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
