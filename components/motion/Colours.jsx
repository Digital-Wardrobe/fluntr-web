'use client'
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Glyph } from './Demo'
import { KweenPerch } from './KweenRoamer'

/**
 * Your colours: one selfie, matched to the shades that suit your skin. The
 * portrait is a neutral placeholder in the interface's own greys (no face, no
 * skin tone, no real person), scanned once when it comes into view; then the
 * reading and the palette appear.
 */

const INK = '#121317'
const MUTED = '#6B7080'
const SKIN = '#D6D9E0'   // the placeholder's grey, not a skin tone
const HAIR = '#C3C7D0'
const BODY = '#E7E9EE'

const SUITS = [['Olive', '#6E7B3B'], ['Rust', '#B4532A'], ['Mustard', '#D4A13A'], ['Teal', '#2E7D80'], ['Cream', '#EFE3C8'], ['Maroon', '#7A2335']]
const SKIP = [['Neon green', '#46F05A'], ['Icy grey', '#D9E1EA'], ['Pale lilac', '#DCCBF2']]
const POINTS = [[100, 96], [76, 126], [100, 172]] // forehead, cheek, neck, in the portrait's 200 x 250 box

/** A neutral head and shoulders, like a profile placeholder: the selfie, without a person. 200 x 250. */
export function FaceArt({ className = 'absolute inset-0 h-full w-full' }) {
  return (
    <svg viewBox="0 0 200 250" className={className} aria-hidden>
      <path d="M18 250 C 26 204, 66 188, 100 188 C 134 188, 174 204, 182 250 Z" fill={BODY} />
      <rect x="85" y="146" width="30" height="50" rx="13" fill={SKIN} />
      <ellipse cx="100" cy="110" rx="43" ry="53" fill={SKIN} />
      <path d="M55 116 C 48 62, 78 42, 103 44 C 131 46, 155 66, 146 118 C 144 98, 134 82, 118 76 C 100 88, 78 90, 60 98 C 57 104, 56 110, 55 116 Z" fill={HAIR} />
      <path d="M146 118 C 152 140, 150 168, 140 186 C 146 160, 146 138, 142 120 Z" fill={HAIR} />
    </svg>
  )
}
export { SKIN, SUITS, SKIP }

function Portrait({ go, reduce }) {
  return (
    <div className="relative overflow-hidden" style={{ width: '100%', aspectRatio: '200 / 250', borderRadius: 28, background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F2F5 100%)', border: '1px solid rgba(18,19,23,0.08)', boxShadow: '0 30px 60px -30px rgba(18,19,23,0.25)' }}>
      <FaceArt />
      <span className="absolute left-3 top-3 flex items-center gap-1.5" style={{ background: '#fff', borderRadius: 999, padding: '5px 10px', fontSize: 12, fontWeight: 700, color: INK, boxShadow: '0 4px 12px rgba(18,19,23,0.08)' }}><Glyph k="camera" size={13} sw={2} />Selfie</span>
      {/* the scan: once, top to bottom */}
      {!reduce ? (
        <motion.div aria-hidden className="absolute inset-0" initial={{ y: '0%', opacity: 0 }} animate={go ? { y: ['0%', '98%'], opacity: [0, 1, 1, 0] } : {}} transition={{ y: { duration: 2.0, ease: 'easeInOut' }, opacity: { duration: 2.0, times: [0, 0.1, 0.9, 1] } }}>
          <div style={{ height: 4, background: '#FFD700', boxShadow: '0 0 16px 4px #FFD700aa' }} />
        </motion.div>
      ) : null}
      {/* where she reads the skin */}
      {POINTS.map(([x, y], n) => (
        <motion.span key={n} aria-hidden className="absolute" style={{ left: `${x / 2}%`, top: `${y / 2.5}%`, width: 14, height: 14, marginLeft: -7, marginTop: -7, borderRadius: 999, border: '2.5px solid #121317', background: '#fff', boxShadow: '0 0 0 3px rgba(255,255,255,0.8)' }} initial={{ scale: 0, opacity: 0 }} animate={go ? { scale: 1, opacity: 1 } : {}} transition={{ type: 'spring', stiffness: 400, damping: 18, delay: reduce ? 0 : 0.6 + n * 0.45 }} />
      ))}
      <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5">
        {['Warm undertone'].map((t, n) => (
          <motion.span key={t} className="flex items-center gap-1" style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 999, padding: '6px 10px', fontSize: 12.5, fontWeight: 700, color: INK, boxShadow: '0 6px 14px rgba(18,19,23,0.10)' }} initial={{ opacity: 0, y: 8 }} animate={go ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: reduce ? 0 : 2.1 + n * 0.25 }}>
            <Glyph k="check" color="#2E7D4F" size={12} sw={2.4} />{t}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

function Swatches({ title, items, go, delay, skip = false }) {
  return (
    <div>
      <p className="m-0 mb-2.5 text-[13px] font-semibold" style={{ color: skip ? '#9AA0A6' : INK }}>{title}</p>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {items.map(([name, hex], n) => (
          <motion.li key={name} className="flex items-center gap-2" style={{ background: '#fff', borderRadius: 999, padding: '5px 12px 5px 5px', fontSize: 13, fontWeight: 600, color: skip ? '#9AA0A6' : INK, border: '1px solid rgba(18,19,23,0.07)' }} initial={{ opacity: 0, scale: 0.7 }} animate={go ? { opacity: 1, scale: 1 } : {}} transition={{ type: 'spring', stiffness: 380, damping: 22, delay: delay + n * 0.12 }}>
            <span className="relative block" style={{ width: 22, height: 22, borderRadius: 999, background: hex, boxShadow: 'inset 0 0 0 1px rgba(18,19,23,0.12)' }}>
              {skip ? <span className="absolute left-1/2 top-1/2 block" style={{ width: 26, height: 2, marginLeft: -13, marginTop: -1, background: '#9AA0A6', transform: 'rotate(-45deg)' }} /> : null}
            </span>
            {name}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

export default function Colours() {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const go = useInView(ref, { once: true, amount: 0.45 }) || !!reduce
  return (
    <section id="colours" className="cv-auto relative scroll-mt-20 px-4 py-14 md:px-6 md:py-24" style={{ containIntrinsicSize: 'auto 1000px' }}>
      <div className="relative mx-auto max-w-6xl overflow-hidden" style={{ borderRadius: 40, background: 'linear-gradient(135deg, #FFF4EC 0%, #FDF0F4 55%, #F5F6F8 100%)', border: '1px solid rgba(18,19,23,0.06)' }}>
        <div ref={ref} className="grid items-center gap-10 px-6 py-12 md:px-12 md:py-16 lg:grid-cols-[minmax(0,330px)_1fr] lg:gap-16">
          <div className="mx-auto w-full" style={{ maxWidth: 330 }}><Portrait go={go} reduce={reduce} /></div>
          <div>
            <p className="text-eyebrow mb-5">Your colours</p>
            <h2 className="h-display" style={{ fontSize: 'clamp(32px,4.2vw,58px)', color: INK }}>
              Colours that suit <span className="serif-accent">your</span> face.
            </h2>
            <p className="mt-5 max-w-xl text-[18px] leading-relaxed md:text-[20px]" style={{ color: MUTED }}>
              One selfie. Your colours, in every outfit she picks.
            </p>
            <div className="mt-7 flex flex-col gap-5">
              <Swatches title="Suits you" items={SUITS} go={go} delay={reduce ? 0 : 2.4} />
              <Swatches title="Skip these near your face" items={SKIP} go={go} delay={reduce ? 0 : 3.1} skip />
            </div>
            <KweenPerch name="colours" line="Olive, rust, cream. Trust me on this one." mood="love" className="mt-8" width="clamp(64px, 7vw, 96px)" />
          </div>
        </div>
      </div>
    </section>
  )
}
