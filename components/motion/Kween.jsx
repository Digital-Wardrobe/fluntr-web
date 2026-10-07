'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * Kween, Fluntr's closet mascot: a felt sock puppet that talks.
 *
 * The character was designed in the "Main App" session (artifacts "Fluntr
 * Mascot Concepts" and "Tikki 2.0"); this is that drawing, ported to React and
 * carrying the name the brief uses. The toe is the mouth and the jaw moves on
 * every line; the darker heel sits at the back of the head where it would on a
 * real sock; two calm dot eyes, no sparkle, one accent scarf.
 *
 * Props
 *   expression  idle | smug | love | shock | sleepy | happy
 *   talking     true while a line is being "said": the jaw flaps
 *   follow      eyes track the pointer across the window
 *   size        rendered width in px (height follows the 220x240 viewbox)
 */

const INK = '#211C1B'
const P = { hi: '#FBDDBE', base: '#EFA36A', shade: '#C46F37', patch: '#D9824A', patchHi: '#EDA06C', cuff: '#F6C9A0', rib: '#BF7440' }
const SCARF = '#15171B'

const EYES = {
  idle: (
    <g>
      <ellipse cx="128" cy="78" rx="3.8" ry="5.2" fill={INK} /><ellipse cx="151" cy="74" rx="3.8" ry="5.2" fill={INK} />
      <circle cx="129.3" cy="76" r="1.1" fill="#fff" opacity=".8" /><circle cx="152.3" cy="72" r="1.1" fill="#fff" opacity=".8" />
    </g>
  ),
  happy: (
    <g>
      <path d="M122 78 q6 -6 12 0 M145 74 q6 -6 12 0" stroke={INK} strokeWidth="2.8" fill="none" strokeLinecap="round" />
    </g>
  ),
  smug: (
    <g>
      <path d="M122.5 78 h11" stroke={INK} strokeWidth="2.8" strokeLinecap="round" /><ellipse cx="151" cy="74" rx="3.8" ry="5.2" fill={INK} />
    </g>
  ),
  love: (
    <path d="M128 83 l-6.5 -6.5 a3.6 3.6 0 0 1 6.5 -3.8 a3.6 3.6 0 0 1 6.5 3.8z M151 79 l-6.5 -6.5 a3.6 3.6 0 0 1 6.5 -3.8 a3.6 3.6 0 0 1 6.5 3.8z" fill="#D9364C" />
  ),
  shock: (
    <g>
      <circle cx="128" cy="78" r="5.6" fill="none" stroke={INK} strokeWidth="2.4" /><circle cx="128" cy="78" r="1.9" fill={INK} />
      <circle cx="151" cy="74" r="5.6" fill="none" stroke={INK} strokeWidth="2.4" /><circle cx="151" cy="74" r="1.9" fill={INK} />
    </g>
  ),
  sleepy: (
    <g>
      <path d="M122 78 q6 5 12 0 M145 74 q6 5 12 0" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <text x="168" y="46" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="17" fill={INK} opacity=".5">z<tspan dx="1" dy="-9" fontSize="12">z</tspan></text>
    </g>
  ),
}
const LIDS = <path d="M122 78 q6 5 12 0 M145 74 q6 5 12 0" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />

let uid = 0

export default function Kween({ expression = 'idle', talking = false, follow = true, size = 180, scarf = true, className = '', style, onClick }) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [blink, setBlink] = useState(false)
  const [hop, setHop] = useState(0)
  const idRef = useRef(null)
  if (idRef.current == null) idRef.current = `kw${++uid}`
  const id = idRef.current

  // The jaw flaps while a line is being said: a steady alternation reads as
  // syllables at any speech length, and never leaves the mouth stuck open.
  useEffect(() => {
    if (!talking || reduce) { setOpen(false); return }
    const t = setInterval(() => setOpen(o => !o), 115)
    return () => { clearInterval(t); setOpen(false) }
  }, [talking, reduce])

  // Blink at irregular intervals, occasionally twice.
  useEffect(() => {
    if (reduce) return
    let alive = true
    let t
    const loop = () => {
      t = setTimeout(() => {
        if (!alive) return
        setBlink(true); setTimeout(() => alive && setBlink(false), 130)
        if (Math.random() < 0.25) setTimeout(() => { if (alive) { setBlink(true); setTimeout(() => alive && setBlink(false), 130) } }, 260)
        loop()
      }, 2400 + Math.random() * 3600)
    }
    loop()
    return () => { alive = false; clearTimeout(t) }
  }, [reduce])

  // Eyes follow the pointer.
  const fx = useMotionValue(0)
  const fy = useMotionValue(0)
  const sx = useSpring(fx, { stiffness: 120, damping: 18 })
  const sy = useSpring(fy, { stiffness: 120, damping: 18 })
  const svgRef = useRef(null)
  useEffect(() => {
    if (!follow || reduce) return
    function onMove(e) {
      const el = svgRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return
      const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width * 0.62)) / 260))
      const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * 0.32)) / 260))
      fx.set(dx * 5); fy.set(dy * 3.5)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [follow, reduce, fx, fy])

  const eyes = blink && expression !== 'love' && expression !== 'shock' ? LIDS : (EYES[expression] || EYES.idle)
  const jawOpen = open || expression === 'shock'

  return (
    <motion.div
      className={className}
      style={{ width: size, display: 'block', cursor: onClick ? 'pointer' : 'default', ...style }}
      onClick={() => { if (!reduce) setHop(h => h + 1); onClick && onClick() }}
      key={hop}
      initial={hop ? { y: 0, scaleX: 1, scaleY: 1 } : false}
      animate={hop && !reduce ? { y: [0, 0, -size * 0.14, 0, 0], scaleX: [1, 1.1, 0.93, 1.08, 1], scaleY: [1, 0.88, 1.09, 0.92, 1] } : {}}
      transition={{ duration: 0.76, ease: [0.32, 0.72, 0, 1] }}
    >
      <motion.svg
        ref={svgRef}
        viewBox="0 0 220 240"
        role="img"
        aria-label="Kween, Fluntr's closet mascot"
        style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible', transformOrigin: '46% 95%' }}
        animate={reduce ? undefined : { rotate: [0, -2.2, 0], scaleX: [1, 1.012, 1], scaleY: [1, 0.988, 1] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          <filter id={`${id}-felt`} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" seed="5" result="fibre" />
            <feDisplacementMap in="SourceGraphic" in2="fibre" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="edge" />
            <feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="3" seed="9" result="grain" />
            <feColorMatrix in="grain" type="saturate" values="0" result="grey" />
            <feComponentTransfer in="grey" result="soft">
              <feFuncR type="linear" slope=".3" intercept=".76" /><feFuncG type="linear" slope=".3" intercept=".76" /><feFuncB type="linear" slope=".3" intercept=".76" /><feFuncA type="linear" slope="0" intercept="1" />
            </feComponentTransfer>
            <feBlend in="edge" in2="soft" mode="multiply" result="textured" />
            <feComposite in="textured" in2="edge" operator="in" />
          </filter>
          <clipPath id={`${id}-head`}><ellipse cx="126" cy="92" rx="58" ry="46" transform="rotate(-6 126 92)" /></clipPath>
          <linearGradient id={`${id}-ao`} x1="0" y1="0" x2="0" y2="1"><stop offset=".5" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".2" /></linearGradient>
          <radialGradient id={`${id}-rim`} cx="32%" cy="18%" r="45%"><stop offset="0" stopColor="#fff" stopOpacity=".5" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
          <radialGradient id={`${id}-b`} cx="34%" cy="26%" r="80%"><stop offset="0" stopColor={P.hi} /><stop offset=".45" stopColor={P.base} /><stop offset="1" stopColor={P.shade} /></radialGradient>
          <radialGradient id={`${id}-p`} cx="40%" cy="25%" r="85%"><stop offset="0" stopColor={P.patchHi} /><stop offset="1" stopColor={P.patch} /></radialGradient>
        </defs>

        <ellipse cx="106" cy="232" rx="46" ry="6" fill="#000" opacity=".16" />

        <g filter={`url(#${id}-felt)`}>
          <path d="M70 232 C66 192 70 152 88 122 L152 118 C141 152 137 192 143 232 Z" fill={`url(#${id}-b)`} />
          <ellipse cx="84" cy="172" rx="12" ry="21" transform="rotate(24 84 172)" fill={`url(#${id}-p)`} />
          <rect x="64" y="198" width="84" height="34" rx="12" fill={P.cuff} />
          <ellipse cx="126" cy="92" rx="58" ry="46" transform="rotate(-6 126 92)" fill={`url(#${id}-b)`} />
          <g clipPath={`url(#${id}-head)`}>
            <ellipse cx="74" cy="72" rx="32" ry="34" fill={`url(#${id}-p)`} />
            <ellipse cx="184" cy="108" rx="34" ry="42" fill={`url(#${id}-p)`} />
            <rect x="60" y="40" width="140" height="100" fill={`url(#${id}-ao)`} /><rect x="60" y="40" width="140" height="100" fill={`url(#${id}-rim)`} />
          </g>
        </g>
        <path d="M104 50 C96 66 96 84 104 100" stroke={P.rib} strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity=".6" />
        <path d="M158 66 C150 84 152 104 162 122" stroke={P.rib} strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity=".6" />
        <path d="M74 204 v24 M84 203 v26 M94 203 v26 M104 203 v26 M114 203 v26 M124 203 v26 M134 204 v24" stroke={P.rib} strokeWidth="1.5" opacity=".4" />

        {/* mouth: inside, tongue, then the jaw that moves */}
        <path d="M138 113 Q162 121 178 106 Q175 123 157 127 Q142 126 138 113 Z" fill="#4A1C24" />
        <path d="M146 120 Q158 123 168 118 Q163 125 155 126 Q149 124 146 120 Z" fill="#E7788B" opacity=".85" />
        <motion.g
          style={{ transformBox: 'view-box', transformOrigin: '136px 114px' }}
          animate={{ rotate: jawOpen ? 17 : 0 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
        >
          <path d="M136 114 Q162 123 179 107 Q178 132 156 137 Q136 135 136 114 Z" fill={`url(#${id}-p)`} filter={`url(#${id}-felt)`} />
        </motion.g>
        <path d="M136 113 Q162 122 179 106" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".85" />

        {scarf ? (
          <g>
            <g filter={`url(#${id}-felt)`}>
              <path d="M82 122 C104 134 132 134 154 120 L156 138 C132 152 104 152 80 140 Z" fill={SCARF} />
              <path d="M96 138 C94 156 98 172 106 186 L120 182 C114 168 112 154 114 142 Z" fill={SCARF} />
            </g>
            <path d="M90 130 C110 140 132 140 150 128 M100 156 l12 -2 M102 168 l13 -3" stroke="#fff" strokeWidth="1.6" opacity=".3" fill="none" strokeLinecap="round" />
          </g>
        ) : null}

        <motion.g style={{ x: sx, y: sy }}>{eyes}</motion.g>

        <motion.path
          d="M112 50 c-1 -13 -11 -19 -15 -13 c-4 7 9 9 11 -1 c2 -9 13 -11 16 -4"
          stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round"
          style={{ transformBox: 'view-box', transformOrigin: '112px 50px' }}
          animate={reduce ? undefined : { rotate: [0, -15, 6, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </motion.svg>
    </motion.div>
  )
}

/** The speech bubble Kween talks through. Pops on every new line. */
export function Bubble({ text, side = 'left', className = '', style }) {
  return (
    <motion.div
      key={text}
      className={`glass ${className}`}
      initial={{ opacity: 0, scale: 0.7, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        padding: '10px 14px',
        borderRadius: side === 'left' ? '18px 18px 18px 6px' : '18px 18px 6px 18px',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.35,
        color: '#15171B',
        maxWidth: 230,
        transformOrigin: side === 'left' ? '0% 100%' : '100% 100%',
        ...style,
      }}
    >
      {text}
    </motion.div>
  )
}
