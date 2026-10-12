'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion'
import Kween, { Bubble } from './Kween'
import { kweenReact, useLooks } from './kweenStore'
import { useSound } from './Sound'

/**
 * Teddy and Mochi, playing around the page. Two kinds of visit:
 *
 * - A peek, on any screen: one of them pokes its head in from the side edge,
 *   grins, wiggles, and ducks back out. If Kween is on screen they peek in
 *   beside her, and she notices ("Mochi, I can see you.").
 * - A walk, where there is a free margin beside the content (wide screens):
 *   one walks in, stands there a moment, hops about, says a line and leaves.
 *   If Kween is near where they are headed they stop next to her, and both
 *   react.
 *
 * The first peek comes a few seconds in; after that a visit every half minute
 * or so. Only one friend is out at a time, and they take turns.
 */

const RATIO = 278 / 200
const SIZE = 76
const SPEED = 170              // px per second, Kween's walking pace
const FIRST = 7000             // the first visit
const EVERY = [32000, 64000]   // then now and then
const CONTENT = 1152           // the content column (max-w-6xl); the margins either side are free
const LINES = {
  teddy: ['Cosy day for a kurta.', 'Hug? No? Okay.', 'I keep the sweaters warm.'],
  plain: ['mochi mochi.', 'Snack, then outfit.', 'Just vibing in the closet.'],
}
const PSST = { teddy: ['psst.', 'hehe.', 'boo!'], plain: ['mochi?', 'hehe.', 'hi.'] }
const HELLO = { teddy: ['Teddy! Where have you been?', 'Teddy, hi!'], plain: ['Mochi! Aww.', 'Mochi, come here!'] }
const SEES = { teddy: ['Teddy. I can see you.', 'Teddy, I know you’re there.'], plain: ['Mochi, I can see you.', 'Mochi. Not subtle.'] }
const TAP = { teddy: ['Boop.', 'Careful, I’m fragile. Not really.'], plain: ['mochi?', 'hehe.'] }
const pick = a => a[Math.floor(Math.random() * a.length)]
const rand = ([a, b]) => a + Math.random() * (b - a)
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

export default function Friends() {
  const looks = useLooks()
  const { play } = useSound()
  const [who, setWho] = useState(null)      // the friend on screen
  const [mode, setMode] = useState('walk')  // walk | peek
  const [walking, setWalking] = useState(false)
  const [face, setFace] = useState('idle')
  const [line, setLine] = useState(null)
  const [hop, setHop] = useState(0)
  const [facing, setFacing] = useState(1)
  const [onRight, setOnRight] = useState(false)
  const x = useMotionValue(0), y = useMotionValue(0)
  const run = useRef(null)
  const busy = useRef(false)
  const playRef = useRef(play); playRef.current = play // the visit loop must never restart because the sound setting changed

  useEffect(() => {
    let alive = true, turn = 0, timer
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const margin = () => (window.innerWidth - CONTENT) / 2
    const wide = () => margin() >= SIZE + 32
    const wait = ms => new Promise(r => { timer = setTimeout(r, ms) })
    const stop = () => { run.current?.forEach(a => a.stop()); run.current = null }
    const walk = (tx, ty) => new Promise(res => {
      const d = Math.hypot(tx - x.get(), ty - y.get())
      setFacing(tx < x.get() ? -1 : 1); setWalking(true)
      run.current = [animate(x, tx, { duration: reduce ? 0 : d / SPEED, ease: 'linear' }), animate(y, ty, { duration: reduce ? 0 : d / SPEED, ease: 'linear', onComplete: () => { setWalking(false); res() } })]
    })
    const slide = (tx, soft = true) => new Promise(res => {
      run.current = [animate(x, tx, reduce ? { duration: 0, onComplete: res } : soft ? { type: 'spring', stiffness: 220, damping: 18, onComplete: res } : { duration: 0.32, ease: [0.4, 0, 1, 1], onComplete: res })]
    })
    // where Kween is right now, if she is on screen and awake
    const kween = () => {
      const k = document.querySelector('[data-kween-state]'); if (!k) return null
      const r = k.getBoundingClientRect()
      const out = r.width > 0 && r.bottom > 0 && r.top < window.innerHeight && getComputedStyle(k).opacity !== '0' && k.dataset.kweenState !== 'asleep'
      return out ? r : null
    }

    async function peekVisit(persona) {
      const vw = window.innerWidth, vh = window.innerHeight, h = SIZE * RATIO
      const kr = kween()
      // beside Kween if she is around, else anywhere in the middle band of the screen
      let side = Math.random() < 0.5 ? 'left' : 'right'
      let ty = vh * 0.25 + Math.random() * vh * 0.45
      if (kr) { side = kr.left + kr.width / 2 < vw / 2 ? 'left' : 'right'; ty = clamp(kr.top - 10, 90, vh - h - 90) }
      const shown = SIZE * 0.5
      const tx = side === 'left' ? shown - SIZE : vw - shown
      x.set(side === 'left' ? -SIZE - 10 : vw + 10); y.set(ty)
      setFacing(side === 'left' ? 1 : -1); setOnRight(side === 'right'); setMode('peek'); setFace('idle'); setLine(null); setWho(persona)
      await slide(tx); if (!alive) return
      setFace(Math.random() < 0.5 ? 'happy' : 'wink'); playRef.current('pop', { gain: 0.3, rate: 1.4 })
      if (wide()) setLine(pick(PSST[persona]))
      if (kr) kweenReact(pick(SEES[persona]), 'smug', 2200)
      await wait(rand([1900, 2800])); if (!alive) return
      setLine(null); setFace('idle')
      await slide(side === 'left' ? -SIZE - 10 : vw + 10, false); if (!alive) return
      setWho(null)
    }

    async function walkVisit(persona) {
      const side = Math.random() < 0.5 ? 'left' : 'right'
      const vw = window.innerWidth, vh = window.innerHeight, m = margin(), h = SIZE * RATIO
      const floor = vh - h - (side === 'right' ? 72 : 8) // above the floating badge on the right
      let tx = side === 'left' ? 10 + Math.random() * Math.max(0, m - SIZE - 24) : vw - m + 14 + Math.random() * Math.max(0, m - SIZE - 24)
      const kr = kween()
      const meet = kr && Math.abs(kr.left + kr.width / 2 - (tx + SIZE / 2)) < 260 && Math.abs(kr.bottom - (floor + h)) < 160
      if (meet) tx = clamp(kr.left + kr.width / 2 < tx + SIZE / 2 ? kr.right + 12 : kr.left - SIZE - 12, 6, vw - SIZE - 6)
      x.set(side === 'left' ? -SIZE - 12 : vw + 12); y.set(floor)
      setOnRight(tx + SIZE / 2 > vw / 2); setMode('walk'); setFace('idle'); setLine(null); setWho(persona)
      await walk(tx, floor); if (!alive) return
      if (meet) {
        setFace('happy'); setHop(n => n + 1); playRef.current('pop', { gain: 0.4, rate: 1.2 })
        kweenReact(pick(HELLO[persona]), 'love', 2600)
        await wait(700); if (!alive) return
        setLine('Hi Kween!')
        await wait(2600); if (!alive) return
      } else {
        // a little play: a couple of hops, then a line
        await wait(400); if (!alive) return
        setFace('happy')
        for (let n = 0; n < 2; n++) { setHop(k => k + 1); playRef.current('tick', { gain: 0.3, rate: 1.2 + n * 0.2 }); await wait(620); if (!alive) return }
        setFace('content'); setLine(pick(LINES[persona]))
        await wait(rand([2600, 4000])); if (!alive) return
      }
      setLine(null); setFace('idle')
      await walk(side === 'left' ? -SIZE - 12 : vw + 12, floor); if (!alive) return
      setWho(null)
    }

    async function visit() {
      if (!alive) return
      if (document.hidden || busy.current) { timer = setTimeout(visit, 15000); return }
      busy.current = true
      const persona = turn++ % 2 ? 'plain' : 'teddy'
      try {
        if (wide() && Math.random() < 0.55) await walkVisit(persona)
        else await peekVisit(persona)
      } finally { busy.current = false }
      if (alive) timer = setTimeout(visit, rand(EVERY))
    }
    timer = setTimeout(visit, FIRST)
    return () => { alive = false; clearTimeout(timer); stop() }
  }, [x, y])

  if (!who) return null
  const tap = () => { setHop(n => n + 1); setLine(pick(TAP[who])); setFace('happy'); play('pop', { rate: 1.3 }); setTimeout(() => { setLine(null); setFace('idle') }, 2000) }
  return (
    <motion.div className="pointer-events-none fixed left-0 top-0 z-[44]" style={{ x, y, width: SIZE }}>
      <AnimatePresence>
        {line ? (
          <motion.div key={line} className="absolute bottom-[52%]" style={onRight ? { right: '78%' } : { left: '78%' }} initial={{ opacity: 0, scale: 0.7, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}>
            <Bubble text={line} side={onRight ? 'right' : 'left'} style={{ fontSize: 13, width: 'max-content', maxWidth: 200 }} />
          </motion.div>
        ) : null}
      </AnimatePresence>
      {/* peeking, she leans in and wiggles */}
      <motion.div className="pointer-events-auto" style={{ cursor: 'pointer', transformOrigin: facing > 0 ? '0% 100%' : '100% 100%' }} animate={mode === 'peek' ? { rotate: [0, facing * -9, facing * 6, facing * -4, 0] } : { rotate: 0 }} transition={mode === 'peek' ? { duration: 1.9, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}>
        <Kween persona={who} color={looks[who]} expression={face} talking={!!line} walking={walking} mirrored={facing < 0} hopKey={hop} follow={false} size="100%" onClick={tap} />
      </motion.div>
    </motion.div>
  )
}
