'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion'
import Kween, { Bubble } from './Kween'
import { useKween, kweenSay, kweenState } from './kweenStore'
import { useSound } from './Sound'

/**
 * Kween roams the page, as she roams the app.
 *
 * One mascot, fixed to the viewport. Sections put down a perch where they want
 * her (an empty slot with data-kween-perch); when a perch scrolls into view
 * she walks over to it, stands in it, and says that section's line. Between
 * perches she wanders along the bottom of the window. She blinks and glances
 * about, dozes off when you leave the page alone and wakes with a start, hops
 * and chats when tapped, and you can drag her anywhere, which the app allows
 * too.
 *
 * Behaviour and lines are the app's (src/mascot/MascotOverlay.tsx, rules.ts,
 * i18n/en.ts): the greetings by time of day, the tap lines, the wake lines,
 * sleep after 18 s idle, a glance every 2.5 s.
 */

const RATIO = 278 / 200 // her height per unit width, shadow included
const SLEEP_AFTER = 18000
const TAP = ['Hi! I live in your closet.', 'Arre, that colour? Obsessed.', 'Socks with sandals? I won’t tell.', 'Your closet called. It misses you.', 'Wheee! Again!', 'Psst… post a fit today?']
const WAKE = ['I was NOT asleep.', 'Oh! You’re back.']
const WANDER = ['Just scrolling for inspo, as one does.', 'La la la… feed, fits and chill.', 'Hmm… would that colour work in your closet?']
const pick = a => a[Math.floor(Math.random() * a.length)]
function greeting() {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'Good morning! What are we wearing today?'
  if (h >= 12 && h < 17) return 'Hey you. Your closet missed you.'
  if (h >= 17 && h < 22) return 'Evening plans? I can help you dress.'
  return 'Late-night closet scroll? Same.'
}

/** An empty slot a section reserves for her. She sizes herself to its width. */
export function KweenPerch({ name, line, mood = 'idle', width = 'clamp(84px, 9vw, 116px)', className = '', style }) {
  return (
    <div
      aria-hidden
      data-kween-perch={name}
      data-kween-line={line || ''}
      data-kween-mood={mood}
      className={className}
      style={{ width, aspectRatio: `200 / ${278}`, pointerEvents: 'none', ...style }}
    />
  )
}

function measurePerches() {
  const out = []
  document.querySelectorAll('[data-kween-perch]').forEach(el => {
    const r = el.getBoundingClientRect()
    if (!r.width) return
    const name = el.dataset.kweenPerch
    out.push({ name, line: name === 'hero' ? greeting() : el.dataset.kweenLine, mood: el.dataset.kweenMood || 'idle', x: r.left, y: r.top, w: r.width, h: r.height, cy: r.top + r.height / 2 })
  })
  return out
}

export default function KweenRoamer() {
  const reduce = useReducedMotion()
  const guide = useKween()
  const { play } = useSound()
  const x = useMotionValue(-200)
  const y = useMotionValue(0)
  const [size, setSize] = useState(96)
  const [walking, setWalking] = useState(false)
  const [facing, setFacing] = useState(1)
  const [face, setFace] = useState('idle')
  const [bubble, setBubble] = useState(null)
  const [asleep, setAsleep] = useState(false)
  const [tapLine, setTapLine] = useState(null)
  const [onPerch, setOnPerch] = useState(null)
  const perchRef = useRef(null)      // name of the perch she is on / heading to
  const freeAtRef = useRef(null)     // the perch that was in view when she was dragged: she ignores it until it leaves
  const travelRef = useRef(null)     // running animations
  const freeRef = useRef(false)      // user dragged her: stay put until a new perch
  const draggingRef = useRef(false)
  const lastActRef = useRef(Date.now())
  const wanderTimer = useRef(null)
  const faceTimer = useRef(null)
  const mounted = useRef(false)

  const flash = useCallback((f, ms = 1400) => {
    setFace(f); clearTimeout(faceTimer.current)
    faceTimer.current = setTimeout(() => setFace('idle'), ms)
  }, [])

  const stopTravel = () => { travelRef.current?.forEach(a => a.stop()); travelRef.current = null }

  const travelTo = useCallback((tx, ty, opts = {}) => {
    stopTravel()
    const dx = tx - x.get(), dy = ty - y.get(), d = Math.hypot(dx, dy)
    if (Math.abs(dx) > 8) setFacing(dx < 0 ? -1 : 1)
    if (reduce || d < 2 || !mounted.current) { x.set(tx); y.set(ty); return }
    const duration = Math.min(2.6, Math.max(0.55, d / 260))
    setWalking(true)
    const ease = [0.45, 0, 0.55, 1]
    const ax = animate(x, tx, { duration, ease })
    const ay = animate(y, ty, { duration, ease, onComplete: () => { setWalking(false); travelRef.current = null; opts.onArrive?.() } })
    travelRef.current = [ax, ay]
  }, [x, y, reduce])

  // ── perches: walk to the one in view; follow it while it scrolls ──
  useEffect(() => {
    mounted.current = true
    const vw = () => window.innerWidth, vh = () => window.innerHeight
    const narrow = () => vw() < 768
    const wanderSize = () => (narrow() ? 64 : 84)
    const floorY = (s) => vh() - s * RATIO - (narrow() ? 70 : 6) // above the floating badge on desktop, the thumb zone on phones
    let raf = 0, lastPerch = null, settled = false

    function wander() {
      clearTimeout(wanderTimer.current); wanderTimer.current = null
      if (draggingRef.current || freeRef.current || perchRef.current) return
      const s = wanderSize(); setSize(s)
      // between the left edge and about a fifth of the way in: out of the copy's way
      const tx = 10 + Math.random() * Math.max(40, (narrow() ? vw() * 0.35 : vw() * 0.2) - s)
      travelTo(tx, floorY(s), { onArrive: () => { if (Math.random() < 0.3) { setTapLine(pick(WANDER)); setTimeout(() => setTapLine(null), 3200) } } })
      wanderTimer.current = setTimeout(wander, 7000 + Math.random() * 6000)
    }

    let started = false
    function tick() {
      raf = 0
      if (draggingRef.current || !started) return
      const perches = measurePerches()
      const mid = vh() * 0.5
      // a perch counts when its middle sits well inside the window, not when a sliver clips the edge
      const inView = perches.filter(p => p.cy > vh() * 0.15 && p.cy < vh() * 0.88)
      inView.sort((a, b) => Math.abs(a.cy - mid) - Math.abs(b.cy - mid))
      let target = inView[0]
      // Dragged somewhere: she stays until the perch she was pulled off has scrolled away.
      if (freeRef.current) {
        if (target && target.name === freeAtRef.current) target = null
        else if (target) { freeRef.current = false; freeAtRef.current = null }
      }
      if (target) {
        clearTimeout(wanderTimer.current); wanderTimer.current = null
        if (perchRef.current !== target.name) {
          perchRef.current = target.name; lastPerch = target.name; settled = false
          setSize(target.w)
          travelTo(target.x, target.y, { onArrive: () => {
            settled = true; setAsleep(false); setOnPerch(target.name); play('tick', { gain: 0.3 })
            if (target.line && target.name !== 'demo') kweenSay(target.line, target.mood, { perch: target.name })
          } })
        } else if (settled || !travelRef.current) {
          // perched: ride along with the page
          x.set(target.x); y.set(target.y); settled = true
        }
      } else {
        if (perchRef.current) {
          // the perch scrolled away, maybe while she was still walking to it: abandon the walk
          perchRef.current = null; settled = false; setOnPerch(null)
          if (travelRef.current) { stopTravel(); setWalking(false) }
        }
        if (!freeRef.current && !travelRef.current && !wanderTimer.current) {
          wanderTimer.current = setTimeout(wander, 300)
        }
      }
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(tick) }
    const poll = setInterval(schedule, 400)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // first appearance: she is parked just below the window, then walks up into
    // the corner and greets. Perches only start pulling her once that has begun,
    // so the entrance and a perch never fight over her.
    const s = wanderSize(); setSize(s); x.set(16); y.set(vh() + 40)
    const enter = setTimeout(() => {
      started = true
      travelTo(16, floorY(s), { onArrive: () => { if (perchRef.current) return; flash('happy'); setTapLine(greeting()); setTimeout(() => setTapLine(null), 3600) } })
      setTimeout(schedule, 250)
    }, 900)
    return () => { mounted.current = false; clearTimeout(enter); clearInterval(poll); clearTimeout(wanderTimer.current); cancelAnimationFrame(raf); stopTravel(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [travelTo, flash, play, x, y])

  // ── life: sleep when the page is left alone, wake with a start ──
  useEffect(() => {
    const act = () => { lastActRef.current = Date.now() }
    const evs = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart']
    evs.forEach(e => window.addEventListener(e, act, { passive: true }))
    const t = setInterval(() => {
      const idle = Date.now() - lastActRef.current
      if (idle > SLEEP_AFTER && !asleep && !walking) { setAsleep(true); setFace('sleepy'); setBubble(null) }
      else if (idle < 2000 && asleep) { setAsleep(false); flash('shock', 1200); setTapLine(pick(WAKE)); play('pop', { rate: 1.3 }); setTimeout(() => setTapLine(null), 2600) }
    }, 1000)
    return () => { clearInterval(t); evs.forEach(e => window.removeEventListener(e, act)) }
  }, [asleep, walking, flash, play])

  // ── what she says: the section's line, or a tap/wake line on top ──
  useEffect(() => {
    if (asleep) return
    const scoped = guide.perch && guide.perch !== onPerch
    setBubble(tapLine || (scoped ? null : guide.line))
  }, [guide.line, guide.perch, onPerch, tapLine, asleep])
  const mood = asleep ? 'sleepy' : face !== 'idle' ? face : guide.mood
  const talking = !asleep && (guide.talking || !!tapLine)

  const draggedAt = useRef(0)
  function onTap() {
    if (asleep || Date.now() - draggedAt.current < 400) return // a drop is not a tap
    play('pop', { rate: 1.1 })
    flash('happy', 1300)
    setTapLine(pick(TAP)); setTimeout(() => setTapLine(null), 2800)
  }

  const [vw, setVw] = useState(1440)
  useEffect(() => { const f = () => setVw(window.innerWidth); f(); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f) }, [])
  const onRight = x.get() + size / 2 > vw / 2

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[45]"
      style={{ x, y, width: size, touchAction: 'none' }}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => { draggingRef.current = true; stopTravel(); setWalking(false); clearTimeout(wanderTimer.current); wanderTimer.current = null; flash('shock', 600); setBubble(null) }}
      onDragEnd={() => {
        draggingRef.current = false; draggedAt.current = Date.now(); freeRef.current = true; freeAtRef.current = perchRef.current; perchRef.current = null; setOnPerch(null)
        // keep her on the page
        const w = size, h = size * RATIO
        const cx = Math.min(Math.max(x.get(), -w * 0.3), window.innerWidth - w * 0.7)
        const cy = Math.min(Math.max(y.get(), 8), window.innerHeight - h)
        if (cx !== x.get() || cy !== y.get()) { animate(x, cx, { type: 'spring', damping: 18, stiffness: 160 }); animate(y, cy, { type: 'spring', damping: 18, stiffness: 160 }) }
        flash('happy', 1200); play('tick')
      }}
    >
      {/* bubble above her head, on the side facing the page */}
      <AnimatePresence mode="wait">
        {bubble ? (
          <motion.div
            key={bubble}
            className="absolute bottom-[52%]"
            style={onRight ? { right: '78%' } : { left: '78%' }}
            initial={{ opacity: 0, scale: 0.7, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <Bubble text={bubble} side={onRight ? 'right' : 'left'} style={{ fontSize: 13, width: 'max-content', maxWidth: 230 }} />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="pointer-events-auto" style={{ cursor: 'grab' }}>
        <Kween size="100%" expression={mood} talking={talking} walking={walking} mirrored={facing < 0} onClick={onTap} />
      </div>
    </motion.div>
  )
}
