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
 * On a phone the page is narrow and every corner is content, so she behaves
 * differently: no wandering and no dragging (a swipe that starts on her must
 * scroll the page). She hops between perches instead of walking across the
 * screen, and between perches she only peeks up from the bottom edge, silent
 * and untouchable. People read a phone without touching it, so she waits
 * longer before dozing off and wakes quietly.
 *
 * Behaviour and lines are the app's (src/mascot/MascotOverlay.tsx, rules.ts,
 * i18n/en.ts): the greetings by time of day, the tap lines, the wake lines,
 * sleep after 18 s idle, a glance every 2.5 s.
 */

const RATIO = 278 / 200 // her height per unit width, shadow included
const SLEEP_AFTER = 18000        // with a mouse: the app's 18 s
const SLEEP_AFTER_TOUCH = 45000  // on a phone, reading without touching is normal
const PEEK = 0.32                // on a phone, how much of her shows above the bottom edge between perches
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
/** `bubble` fixes which side of her head the speech bubble goes on at this perch; by default it points inwards. */
export function KweenPerch({ name, line, mood = 'idle', bubble, width = 'clamp(84px, 9vw, 116px)', className = '', style }) {
  return (
    <div
      aria-hidden
      data-kween-perch={name}
      data-kween-line={line || ''}
      data-kween-mood={mood}
      data-kween-bubble={bubble}
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
    out.push({ el, name, line: name === 'hero' ? greeting() : el.dataset.kweenLine, mood: el.dataset.kweenMood || 'idle', x: r.left, y: r.top, w: r.width, h: r.height, cy: r.top + r.height / 2 })
  })
  return out
}

export default function KweenRoamer() {
  const reduce = useReducedMotion()
  const guide = useKween()
  const { play } = useSound()
  const x = useMotionValue(-200)
  const y = useMotionValue(0)
  const alpha = useMotionValue(1)
  const [compact, setCompact] = useState(false) // phone layout
  const [coarse, setCoarse] = useState(false)   // a finger, not a mouse
  const [peeking, setPeeking] = useState(false) // phone: tucked under the bottom edge
  const compactRef = useRef(false), coarseRef = useRef(false), peekRef = useRef(false)
  // Seated on a perch she is part of the page (position: absolute, in page
  // coordinates), so she scrolls with it natively instead of chasing it a frame
  // behind, which shakes on a phone. Walking, hopping and peeking she floats
  // (position: fixed, in window coordinates).
  const rootRef = useRef(null)
  const docRef = useRef(false)
  const [seated, setSeated] = useState(false)
  const [size, setSize] = useState(96)
  const [walking, setWalking] = useState(false)
  const [facing, setFacing] = useState(1)
  const [face, setFace] = useState('idle')
  const [bubble, setBubble] = useState(null)
  const [asleep, setAsleep] = useState(false)
  const [tapLine, setTapLine] = useState(null)
  const [onPerch, setOnPerch] = useState(null)
  const perchRef = useRef(null)      // name of the perch she is on / heading to
  const perchEl = useRef(null)       // and its element: a section can have more than one spot with the same name
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

  // switch between floating and seated without a visible jump: same spot, other coordinates
  const seat = useCallback((el) => {
    travelRef.current?.forEach(a => a.stop()); travelRef.current = null
    const r = el.getBoundingClientRect()
    if (rootRef.current) rootRef.current.style.position = 'absolute'
    x.set(r.left + window.scrollX); y.set(r.top + window.scrollY); docRef.current = true; setSeated(true)
  }, [x, y])
  const unseat = useCallback(() => {
    if (!docRef.current) return
    const vx = x.get() - window.scrollX, vy = y.get() - window.scrollY
    if (rootRef.current) rootRef.current.style.position = 'fixed'
    x.set(vx); y.set(vy); docRef.current = false; setSeated(false)
  }, [x, y])

  useEffect(() => {
    const f = () => {
      compactRef.current = window.innerWidth < 768; setCompact(compactRef.current)
      coarseRef.current = window.matchMedia('(pointer: coarse)').matches; setCoarse(coarseRef.current)
    }
    f(); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f)
  }, [])

  // Phones: a quick fade and pop to the new place, instead of a walk across the content.
  const hopTo = useCallback((tx, ty, opts = {}) => {
    stopTravel(); setWalking(false)
    if (reduce || !mounted.current) { x.set(tx); y.set(ty); alpha.set(1); opts.onArrive?.(); return }
    const run = [animate(alpha, 0, { duration: 0.14 })]
    travelRef.current = run
    const t1 = setTimeout(() => {
      if (travelRef.current !== run) return
      x.set(tx); y.set(ty + 16)
      run.push(animate(alpha, 1, { duration: 0.2 }), animate(y, ty, { type: 'spring', stiffness: 380, damping: 20 }))
      // land: stop the bounce before she is seated, or it would keep pulling her in window coordinates
      const t2 = setTimeout(() => { if (travelRef.current === run) { run.forEach(a => a.stop()); travelRef.current = null; y.set(ty); alpha.set(1); opts.onArrive?.() } }, 360)
      run.push({ stop: () => clearTimeout(t2) })
    }, 150)
    run.push({ stop: () => clearTimeout(t1) })
  }, [x, y, alpha, reduce])

  const travelTo = useCallback((tx, ty, opts = {}) => {
    stopTravel(); alpha.set(1)
    const dx = tx - x.get(), dy = ty - y.get(), d = Math.hypot(dx, dy)
    if (Math.abs(dx) > 8) setFacing(dx < 0 ? -1 : 1)
    if (reduce || d < 2 || !mounted.current) { x.set(tx); y.set(ty); return }
    const duration = Math.min(2.6, Math.max(0.55, d / 260))
    setWalking(true)
    const ease = [0.45, 0, 0.55, 1]
    const ax = animate(x, tx, { duration, ease })
    const ay = animate(y, ty, { duration, ease, onComplete: () => { setWalking(false); travelRef.current = null; opts.onArrive?.() } })
    travelRef.current = [ax, ay]
  }, [x, y, alpha, reduce])

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
      if (draggingRef.current || freeRef.current || perchRef.current || narrow()) return
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
      const move = narrow() ? hopTo : travelTo
      // a perch counts when its middle sits well inside the window, not when a sliver clips the edge
      const inView = perches.filter(p => p.cy > vh() * 0.15 && p.cy < vh() * (narrow() ? 0.92 : 0.88))
      inView.sort((a, b) => Math.abs(a.cy - mid) - Math.abs(b.cy - mid))
      // ...but once she is on one, she stays while any of it is still on screen, instead of flitting off at the edge
      const cur = perchRef.current && (perches.find(p => p.el === perchEl.current) || perches.find(p => p.name === perchRef.current))
      // (the top bound clears the fixed navigation bar: a spot under it hides her and her bubble)
      let target = cur && cur.cy > Math.max(vh() * 0.03, 100) && cur.cy < vh() * 0.97 ? cur : inView[0]
      // Dragged somewhere: she stays until the perch she was pulled off has scrolled away.
      if (freeRef.current) {
        if (target && target.name === freeAtRef.current) target = null
        else if (target) { freeRef.current = false; freeAtRef.current = null }
      }
      if (target) {
        clearTimeout(wanderTimer.current); wanderTimer.current = null
        if (peekRef.current) { peekRef.current = false; setPeeking(false) }
        if (perchRef.current !== target.name || perchEl.current !== target.el) {
          unseat()
          const sameSection = perchRef.current === target.name
          perchRef.current = target.name; perchEl.current = target.el; lastPerch = target.name; settled = false
          setSize(target.w)
          move(target.x, target.y, { onArrive: () => {
            // arriving on a perch drops any leftover wander or greeting line, so she says the section's line
            settled = true; seat(target.el); setAsleep(false); setTapLine(null); setOnPerch(target.name); play('tick', { gain: 0.3 })
            if (target.line && target.name !== 'demo' && !sameSection) kweenSay(target.line, target.mood, { perch: target.name })
          } })
        } else if (settled || !travelRef.current) {
          // seated: the page carries her. Only follow if the layout itself moved the perch.
          if (!docRef.current) { settled = true; seat(target.el) }
          else {
            const r = target.el.getBoundingClientRect(), dx = r.left + window.scrollX, dy = r.top + window.scrollY
            if (Math.abs(dx - x.get()) > 0.5 || Math.abs(dy - y.get()) > 0.5) { x.set(dx); y.set(dy) }
          }
          if (alpha.get() < 1) alpha.set(1)
        }
      } else {
        if (perchRef.current) {
          // the perch scrolled away, maybe while she was still walking to it: abandon the walk
          unseat()
          perchRef.current = null; perchEl.current = null; settled = false; setOnPerch(null)
          if (travelRef.current) { stopTravel(); setWalking(false) }
        }
        if (narrow()) {
          // phones: no wandering over the content; she peeks up from the bottom-left edge
          const ps = wanderSize(), py = vh() - ps * RATIO * PEEK
          if (!peekRef.current && !travelRef.current) { peekRef.current = true; setPeeking(true); setSize(ps); hopTo(10, py) }
          else if (peekRef.current && !travelRef.current) { x.set(10); y.set(py); if (alpha.get() < 1) alpha.set(1) } // the toolbar can change the window height
        } else if (!freeRef.current && !travelRef.current && !wanderTimer.current) {
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
    const s = wanderSize(); setSize(s); x.set(narrow() ? 10 : 16); y.set(vh() + 40)
    const enter = setTimeout(() => {
      started = true
      if (narrow()) { schedule(); return } // a perch in view, or a peek; no walk across the screen
      travelTo(16, floorY(s), { onArrive: () => { if (perchRef.current) return; flash('happy'); setTapLine(greeting()); setTimeout(() => setTapLine(null), 3600) } })
      setTimeout(schedule, 250)
    }, 900)
    return () => { mounted.current = false; clearTimeout(enter); clearInterval(poll); clearTimeout(wanderTimer.current); cancelAnimationFrame(raf); stopTravel(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [travelTo, hopTo, seat, unseat, flash, play, x, y, alpha])

  // a section talking through her (the explainer, the demo) counts as company: no dozing mid-story
  useEffect(() => { if (guide.at) lastActRef.current = Date.now() }, [guide.at])

  // ── life: sleep when the page is left alone, wake with a start ──
  useEffect(() => {
    const act = () => { lastActRef.current = Date.now() }
    const evs = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart', 'wheel']
    evs.forEach(e => window.addEventListener(e, act, { passive: true }))
    // a tab in the background is nobody there; coming back is activity
    const onVis = () => { if (!document.hidden) act() }
    document.addEventListener('visibilitychange', onVis)
    const t = setInterval(() => {
      const touch = coarseRef.current || compactRef.current
      const idle = document.hidden ? Infinity : Date.now() - lastActRef.current
      if (idle > (touch ? SLEEP_AFTER_TOUCH : SLEEP_AFTER) && !asleep && !walking) { setAsleep(true); setFace('sleepy'); setBubble(null) }
      else if (idle < 2000 && asleep) {
        setAsleep(false)
        if (touch) flash('happy', 900) // on a phone she just opens her eyes: no start, no sound, no line
        else { flash('shock', 1200); setTapLine(pick(WAKE)); play('pop', { rate: 1.3 }); setTimeout(() => setTapLine(null), 2600) }
      }
    }, 1000)
    return () => { clearInterval(t); evs.forEach(e => window.removeEventListener(e, act)); document.removeEventListener('visibilitychange', onVis) }
  }, [asleep, walking, flash, play])

  // ── what she says: the section's line, or a tap/wake line on top ──
  useEffect(() => {
    if (peeking) { setBubble(null); return } // tucked away on a phone: she listens, she doesn't talk over the page
    if (asleep) return
    const scoped = guide.perch && guide.perch !== onPerch
    setBubble(tapLine || (scoped ? null : guide.line))
  }, [guide.line, guide.perch, onPerch, tapLine, asleep, peeking])
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
  // the perch may say which side the bubble goes (the hero's sits beside buttons it must not cover)
  const perchBubble = onPerch && typeof document !== 'undefined' ? [...document.querySelectorAll(`[data-kween-perch="${onPerch}"]`)].find(e => e.getBoundingClientRect().width)?.dataset.kweenBubble : null
  const onRight = perchBubble ? perchBubble === 'left' : x.get() + size / 2 > vw / 2

  return (
    <motion.div
      ref={rootRef}
      className="pointer-events-none left-0 top-0 z-[45]"
      data-kween-state={asleep ? 'asleep' : walking ? 'walking' : 'awake'}
      data-kween-on={onPerch || ''}
      style={{ position: seated ? 'absolute' : 'fixed', x, y, opacity: alpha, width: size, touchAction: coarse ? 'auto' : 'none' }}
      drag={!coarse}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => { draggingRef.current = true; stopTravel(); setWalking(false); clearTimeout(wanderTimer.current); wanderTimer.current = null; flash('shock', 600); setBubble(null) }}
      onDragEnd={() => {
        unseat()
        draggingRef.current = false; draggedAt.current = Date.now(); freeRef.current = true; freeAtRef.current = perchRef.current; perchRef.current = null; perchEl.current = null; setOnPerch(null)
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
      <div className={!compact || (onPerch && !peeking) ? 'pointer-events-auto' : ''} style={{ cursor: coarse ? 'pointer' : 'grab' }}>
        <Kween size="100%" expression={mood} talking={talking} walking={walking} mirrored={facing < 0} onClick={onTap} />
      </div>
    </motion.div>
  )
}
