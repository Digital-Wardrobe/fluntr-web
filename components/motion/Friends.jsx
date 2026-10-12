'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion'
import Kween, { Bubble, PLUSH } from './Kween'
import { kweenReact, useLooks } from './kweenStore'
import { useSound } from './Sound'

/**
 * Teddy and Mochi drop by. Now and then one of them walks in from the side,
 * stands in the empty margin beside the content for a moment, and leaves. If
 * Kween is nearby they stop next to her instead, and both react. Only where
 * there is a free margin to walk in (wide screens); on phones they live in the
 * gang section.
 */

const RATIO = 278 / 200
const SIZE = 76
const SPEED = 170              // px per second, Kween's walking pace
const FIRST = 16000            // the first visit, after the page has been read a little
const EVERY = [55000, 110000]  // then now and then
const STAY = [3200, 5200]
const CONTENT = 1152           // the content column (max-w-6xl); the margins either side are free
const LINES = {
  teddy: ['Cosy day for a kurta.', 'Hug? No? Okay.', 'I keep the sweaters warm.'],
  plain: ['mochi mochi.', 'Snack, then outfit.', 'Just vibing in the closet.'],
}
const HELLO = { teddy: ['Teddy! Where have you been?', 'Teddy, hi!'], plain: ['Mochi! Aww.', 'Mochi, come here!'] }
const TAP = { teddy: ['Boop.', 'Careful, I’m fragile. Not really.'], plain: ['mochi?', 'hehe.'] }
const pick = a => a[Math.floor(Math.random() * a.length)]
const rand = ([a, b]) => a + Math.random() * (b - a)

export default function Friends() {
  const looks = useLooks()
  const { play } = useSound()
  const [who, setWho] = useState(null)      // the friend on screen
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
    const canRoam = () => margin() >= SIZE + 32 && !document.hidden
    const wait = ms => new Promise(r => { timer = setTimeout(r, ms) })
    const walk = (tx, ty) => new Promise(res => {
      const d = Math.hypot(tx - x.get(), ty - y.get())
      setFacing(tx < x.get() ? -1 : 1); setWalking(true)
      run.current = [animate(x, tx, { duration: reduce ? 0 : d / SPEED, ease: 'linear' }), animate(y, ty, { duration: reduce ? 0 : d / SPEED, ease: 'linear', onComplete: () => { setWalking(false); res() } })]
    })

    async function visit() {
      if (!alive) return
      if (!canRoam() || busy.current) { timer = setTimeout(visit, 20000); return }
      busy.current = true
      const persona = turn++ % 2 ? 'plain' : 'teddy'
      const side = Math.random() < 0.5 ? 'left' : 'right'
      const vw = window.innerWidth, vh = window.innerHeight, m = margin(), h = SIZE * RATIO
      // the floor: above the floating badge on the right
      const floor = vh - h - (side === 'right' ? 72 : 8)
      let tx = side === 'left' ? 10 + Math.random() * Math.max(0, m - SIZE - 24) : vw - m + 14 + Math.random() * Math.max(0, m - SIZE - 24)
      // is Kween on screen and close to where they are headed? then stop beside her
      const k = document.querySelector('[data-kween-state]')
      const kr = k ? k.getBoundingClientRect() : null
      const kweenOut = kr && kr.width > 0 && kr.bottom > 0 && kr.top < vh && getComputedStyle(k).opacity !== '0' && k.dataset.kweenState !== 'asleep'
      const meet = kweenOut && Math.abs(kr.left + kr.width / 2 - (tx + SIZE / 2)) < 260 && Math.abs(kr.bottom - (floor + h)) < 160
      if (meet) tx = Math.max(6, Math.min(vw - SIZE - 6, kr.left + kr.width / 2 < tx + SIZE / 2 ? kr.right + 12 : kr.left - SIZE - 12))
      x.set(side === 'left' ? -SIZE - 12 : vw + 12); y.set(floor)
      setOnRight(tx + SIZE / 2 > vw / 2); setFace('idle'); setLine(null); setWho(persona)
      await walk(tx, floor); if (!alive) return
      if (meet) {
        // they noticed each other
        setFace('happy'); setHop(n => n + 1); playRef.current('pop', { gain: 0.4, rate: 1.2 })
        kweenReact(pick(HELLO[persona]), 'love', 2600)
        await wait(700); if (!alive) return
        setLine('Hi Kween!')
      } else {
        await wait(500); if (!alive) return
        setFace('content'); setLine(pick(LINES[persona]))
      }
      await wait(rand(STAY)); if (!alive) return
      setLine(null); setFace('idle')
      await walk(side === 'left' ? -SIZE - 12 : vw + 12, floor); if (!alive) return
      setWho(null); busy.current = false
      timer = setTimeout(visit, rand(EVERY))
    }
    timer = setTimeout(visit, FIRST)
    return () => { alive = false; clearTimeout(timer); run.current?.forEach(a => a.stop()) }
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
      <div className="pointer-events-auto" style={{ cursor: 'pointer' }}>
        <Kween persona={who} color={looks[who]} expression={face} talking={!!line} walking={walking} mirrored={facing < 0} hopKey={hop} follow={false} size="100%" onClick={tap} />
      </div>
    </motion.div>
  )
}
