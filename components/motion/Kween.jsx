'use client'
import { useEffect, useId, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * Kween, the Fluntr mascot, as she is in the app.
 *
 * The app (src/mascot/Tikki.tsx on the Main App branch) draws her in two
 * layers: a pre-rendered plush body with real fur and a velvet bow, and a face
 * drawn live on top so it can blink, look around and change expression. This
 * is that drawing, same body image and same face geometry (200 x 222 design
 * space, eyes at 77/123 x 127, bead radius 11), ported from Skia to SVG.
 *
 * Props
 *   expression  idle | happy | smug | love | shock | sleepy | content | wink
 *   talking     mouth opens and closes while a line is being said
 *   follow      eyes track the pointer
 *   size        rendered width (number of px, or a CSS length)
 */

const PAD = 46
const W = 200
const H = 222 + PAD
const EL = 77, ER = 123, EY = 127, R = 11
const MY = EY + 16
const INK = '#16101A'
const TONGUE = '#FF7F9A'
const CHEEK = '#FF4D7E'
const FUR = '#FB9DB8'
const FUR_HI = '#FDC4D4'

const heart = (x, y, s = 1) => `M${x} ${y + 5.5 * s} l${-6 * s} ${-6 * s} a${3.3 * s} ${3.3 * s} 0 0 1 ${6 * s} ${-3.5 * s} a${3.3 * s} ${3.3 * s} 0 0 1 ${6 * s} ${3.5 * s}z`
const closed = (x, y) => `M${x - 8} ${y - 1} q8 6.5 16 0`
const arcUp = (x, y) => `M${x - 8} ${y + 2} q8 -9 16 0`
const smile = (y, w = 7, d = 3.8) => `M${100 - w} ${y} q${w} ${d * 2} ${w * 2} 0`

const Stroke = ({ d, w = 3, color = INK }) => <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />

function Bead({ x, y, s = 1, sy = 1, id }) {
  const rx = R * 0.92 * s, ry = R * s * sy
  return (
    <g>
      <ellipse cx={x} cy={y} rx={rx * 1.45} ry={ry * 1.25} fill="rgba(58,36,48,0.16)" filter={`url(#${id}-b4)`} />
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={`url(#${id}-bead)`} />
      <ellipse cx={x - R * 0.32 * s} cy={y - ry * 0.38} rx={R * 0.3 * s} ry={R * 0.26 * s * Math.min(1, sy + 0.2)} fill="#fff" />
      <circle cx={x + R * 0.34 * s} cy={y + ry * 0.3} r={1.3 * s} fill="rgba(255,255,255,0.85)" />
    </g>
  )
}
function Lashes({ y, only }) {
  const one = (cx, side) => `M${cx + side * 8.2} ${y - 5.9} L${cx + side * 13.9} ${y - 8.1} M${cx + side * 9.8} ${y - 2.4} L${cx + side * 15.3} ${y - 2.35}`
  return <Stroke d={[only !== 'R' ? one(EL, -1) : '', only !== 'L' ? one(ER, 1) : ''].join(' ')} w={1.9} />
}
function Cheeks({ y, o = 0.3, id }) {
  return (
    <g filter={`url(#${id}-b4)`}>
      <ellipse cx={68.5} cy={y + 17.5} rx={14.5} ry={8.5} fill={CHEEK} opacity={o} />
      <ellipse cx={131.5} cy={y + 17.5} rx={14.5} ry={8.5} fill={CHEEK} opacity={o} />
    </g>
  )
}
function OpenMouth({ y, w = 9, h = 9 }) {
  return (
    <g>
      <path d={`M${100 - w} ${y} h${w * 2} q-1 ${h + 2} ${-w} ${h + 2} q${-w + 1} 0 ${-w} ${-h - 2}z`} fill="#2A1218" />
      <path d={`M${100 - w * 0.55} ${y + h - 1} q${w * 0.55} ${-3.5} ${w * 1.1} 0 q-1 3.5 ${-w * 0.55} 3.5 q${-w * 0.55 + 1} 0 ${-w * 0.55} -3.5z`} fill={TONGUE} />
    </g>
  )
}

function Face({ face, blinking, open, id }) {
  const ey = EY, my = MY
  const beads = blinking ? <Stroke d={`${closed(EL, ey)} ${closed(ER, ey)}`} /> : <><Bead x={EL} y={ey} id={id} /><Bead x={ER} y={ey} id={id} /></>
  const lashes = !blinking ? <Lashes y={ey} /> : null
  // While she talks the mouth opens and closes over whatever the expression's resting mouth is.
  const mouth = open ? <OpenMouth y={my - 1} w={8} h={7.5} /> : null
  switch (face) {
    case 'happy':
      return <>{beads}{lashes}{mouth || <OpenMouth y={my - 1} />}<Cheeks y={ey} o={0.38} id={id} /></>
    case 'wink':
      return <>{blinking ? <Stroke d={closed(EL, ey)} /> : <Bead x={EL} y={ey} id={id} />}<Stroke d={arcUp(ER, ey)} w={3.4} />{!blinking && <Lashes y={ey} only="L" />}{mouth || <OpenMouth y={my} w={7.5} h={7} />}<Cheeks y={ey} o={0.4} id={id} /></>
    case 'smug':
      return (
        <>
          {blinking ? beads : (
            <>
              <Bead x={EL} y={ey + 1} id={id} /><Bead x={ER} y={ey + 1} id={id} />
              <path d={`M${EL - 13} ${ey - 13} h26 v12 q-13 4 -26 0z M${ER - 13} ${ey - 13} h26 v12 q-13 4 -26 0z`} fill={`url(#${id}-lid)`} />
              <Stroke d={`M${EL - 10} ${ey - 1} q10 3 20 0 M${ER - 10} ${ey - 1} q10 3 20 0`} w={2.6} />
            </>
          )}
          {!blinking && <Lashes y={ey + 3} />}
          {mouth || <Stroke d={`M${100 - 7} ${my + 2} q9 4 15 -3`} />}
        </>
      )
    case 'love':
      return (
        <>
          <path d={heart(EL, ey - 1, 1.75)} fill="#FF2E63" /><path d={heart(ER, ey - 1, 1.75)} fill="#FF2E63" />
          <ellipse cx={EL - 5} cy={ey - 4.5} rx={2} ry={1.5} fill="rgba(255,255,255,0.75)" /><ellipse cx={ER - 5} cy={ey - 4.5} rx={2} ry={1.5} fill="rgba(255,255,255,0.75)" />
          {mouth || <OpenMouth y={my - 1} w={8} h={8} />}<Cheeks y={ey} o={0.45} id={id} />
        </>
      )
    case 'shock':
      return <>{blinking ? beads : <><Bead x={EL} y={ey} s={1.2} id={id} /><Bead x={ER} y={ey} s={1.2} id={id} /></>}{lashes}<ellipse cx={100} cy={my + 5.5} rx={4.5} ry={5.5} fill="#2A1218" /></>
    case 'content':
      return <><Stroke d={`${arcUp(EL, ey)} ${arcUp(ER, ey)}`} w={3.4} />{mouth || <Stroke d={smile(my)} />}<Cheeks y={ey} o={0.4} id={id} /></>
    case 'sleepy':
      return <><Stroke d={`${closed(EL, ey)} ${closed(ER, ey)}`} />{mouth || <Stroke d={`M96 ${my + 2} h8`} />}<Stroke d="M146 58 h10 l-10 11 h10" w={2.6} /><Stroke d="M160 42 h7 l-7 8 h7" w={2.1} /></>
    default:
      return <>{beads}{lashes}{mouth || <Stroke d={smile(my)} />}<Cheeks y={ey} id={id} /></>
  }
}

export default function Kween({ expression = 'idle', talking = false, follow = true, walking = false, mirrored = false, size = 180, className = '', style, onClick }) {
  const reduce = useReducedMotion()
  const id = useId().replace(/:/g, '')
  const [open, setOpen] = useState(false)
  const [blink, setBlink] = useState(false)
  const [hop, setHop] = useState(0)

  useEffect(() => {
    if (!talking || reduce) { setOpen(false); return }
    const t = setInterval(() => setOpen(o => !o), 120)
    return () => { clearInterval(t); setOpen(false) }
  }, [talking, reduce])

  useEffect(() => {
    if (reduce) return
    let alive = true, t
    const loop = () => {
      t = setTimeout(() => {
        if (!alive) return
        setBlink(true); setTimeout(() => alive && setBlink(false), 120)
        if (Math.random() < 0.25) setTimeout(() => { if (alive) { setBlink(true); setTimeout(() => alive && setBlink(false), 120) } }, 240)
        loop()
      }, 2400 + Math.random() * 3600)
    }
    loop()
    return () => { alive = false; clearTimeout(t) }
  }, [reduce])

  // The whole face slides a little towards the pointer, as in the app.
  const fx = useMotionValue(0), fy = useMotionValue(0)
  const sx = useSpring(fx, { stiffness: 120, damping: 18 }), sy = useSpring(fy, { stiffness: 120, damping: 18 })
  const ref = useRef(null)
  useEffect(() => {
    if (!follow || reduce) return
    function onMove(e) {
      const el = ref.current; if (!el) return
      const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > window.innerHeight) return
      const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 260))
      const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * 0.55)) / 260))
      fx.set(dx * 7 * (mirrored ? -1 : 1)); fy.set(dy * 5)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [follow, reduce, fx, fy, mirrored])

  const blinking = blink && !['love', 'sleepy', 'content'].includes(expression)

  return (
    <motion.div
      className={className}
      style={{ width: size, display: 'block', cursor: onClick ? 'pointer' : 'default', ...style }}
      onClick={() => { if (!reduce) setHop(h => h + 1); onClick && onClick() }}
    >
      {/* the app's waddle while walking: a bob on each step and a lean into it */}
      <motion.div
        style={{ transformOrigin: '50% 100%' }}
        animate={walking && !reduce ? { y: [0, -6, 0, -6, 0], rotate: [0, 4.5, 0, -4.5, 0], scaleX: mirrored ? -1 : 1 } : { y: 0, rotate: 0, scaleX: mirrored ? -1 : 1 }}
        transition={walking ? { duration: 0.84, repeat: Infinity, ease: 'easeInOut', scaleX: { duration: 0.2 } } : { duration: 0.25 }}
      >
      {/* the app's hop: crouch, leap, land, settle */}
      <motion.div
        key={hop}
        style={{ transformOrigin: '50% 100%' }}
        animate={hop && !reduce ? { y: [0, 0, '-17%', 0, 0], scaleX: [1, 1.12, 0.89, 1.1, 1], scaleY: [1, 0.86, 1.13, 0.9, 1] } : {}}
        transition={{ duration: 0.79, times: [0, 0.14, 0.44, 0.7, 1], ease: 'easeOut' }}
      >
        <motion.svg
          ref={ref}
          viewBox={`0 0 ${W} ${H + 6}`}
          role="img"
          aria-label="Kween, Fluntr's closet plush"
          style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible', transformOrigin: '50% 100%' }}
          animate={reduce ? undefined : { scaleX: [1, 1.022, 1], scaleY: [1, 0.978, 1] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <defs>
            <filter id={`${id}-b4`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4" /></filter>
            <filter id={`${id}-b6`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.5" /></filter>
            <radialGradient id={`${id}-bead`} cx="38%" cy="30%" r="80%"><stop offset="0" stopColor="#3B2C34" /><stop offset=".55" stopColor="#140E12" /><stop offset="1" stopColor="#0E090C" /></radialGradient>
            <linearGradient id={`${id}-lid`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={FUR_HI} /><stop offset="1" stopColor={FUR} /></linearGradient>
          </defs>
          <g transform={`translate(0 ${PAD})`}>
            <ellipse cx="100" cy="216" rx="62" ry="8" fill="rgba(30,20,48,0.22)" filter={`url(#${id}-b6)`} />
            <image href="/mascot/kween-blush.webp" x="0" y="22" width="200" height="200" preserveAspectRatio="none" />
            <motion.g style={{ x: sx, y: sy }}>
              <Face face={expression} blinking={blinking} open={open} id={id} />
            </motion.g>
          </g>
        </motion.svg>
      </motion.div>
      </motion.div>
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
        fontSize: 14, fontWeight: 500, lineHeight: 1.35, color: '#121317', maxWidth: 240,
        transformOrigin: side === 'left' ? '0% 100%' : '100% 100%',
        ...style,
      }}
    >
      {text}
    </motion.div>
  )
}
