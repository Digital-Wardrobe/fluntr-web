'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'

/**
 * The hero device: real captures from the running app, cross-fading on a loop,
 * floating, and tilting towards the cursor.
 *
 * The chips around it are the only place on the page where a feature gets named
 * next to the screen it happens on, which is why they are timed to land after
 * the headline has finished rising rather than competing with it.
 */

const SCREENS = [
  { src: 'app-feed', alt: 'The Fluntr feed, showing outfit posts from people you follow' },
  { src: 'app-feed-2', alt: 'A Fluntr post with its like, comment and share counts' },
]

const CHIPS = [
  { label: 'Background removed', left: '-18%', top: '16%', delay: 1.1 },
  { label: '+ Added to closet', left: '72%', top: '38%', delay: 1.45 },
  { label: 'Saturday · planned', left: '-26%', top: '66%', delay: 1.8 },
]

export default function PhoneLoop({ width = 288 }) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setI(v => (v + 1) % SCREENS.length), 3600)
    return () => clearInterval(t)
  }, [reduce])

  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 140, damping: 22 })
  const sy = useSpring(my, { stiffness: 140, damping: 22 })
  const rotateY = useTransform(sx, [0, 1], [-9, 9])
  const rotateX = useTransform(sy, [0, 1], [7, -7])

  useEffect(() => {
    if (reduce) return
    // Tracked on the window, not the device: the phone should answer the cursor
    // from across the hero, otherwise the tilt only ever fires once you are
    // already looking straight at it.
    function onMove(e) {
      mx.set(e.clientX / window.innerWidth)
      my.set(e.clientY / window.innerHeight)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my, reduce])

  const screen = SCREENS[i]

  return (
    <motion.div
      className="relative shrink-0"
      style={{ width, rotateX, rotateY, transformPerspective: 1100 }}
      initial={reduce ? false : { opacity: 0, y: 48, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* the glow it casts */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          inset: '-18%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.14) 0%, transparent 62%)',
        }}
      />

      <motion.div
        animate={reduce ? undefined : { y: [0, -13, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: 30,
            border: '1px solid rgba(201,168,76,0.26)',
            boxShadow: '0 40px 90px rgba(0,0,0,0.66)',
            background: '#0A0A0C',
            aspectRatio: '620 / 1344',
          }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={screen.src}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
            >
              <Image
                src={`/images/${screen.src}.webp`}
                alt={screen.alt}
                width={620}
                height={1344}
                priority={screen.src === 'app-feed'}
                sizes={`${width}px`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </motion.div>
          </AnimatePresence>

          {/* a highlight sweeping the glass */}
          {reduce ? null : (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-1/2"
              style={{ background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.055), transparent)' }}
              animate={{ x: ['-120%', '220%'] }}
              transition={{ duration: 5.2, repeat: Infinity, repeatDelay: 2.6, ease: 'easeInOut' }}
            />
          )}
        </div>
      </motion.div>

      {/* feature chips */}
      {CHIPS.map(chip => (
        <motion.span
          key={chip.label}
          className="absolute hidden whitespace-nowrap md:block"
          style={{
            left: chip.left,
            top: chip.top,
            padding: '6px 13px',
            borderRadius: 999,
            fontSize: 10.5,
            letterSpacing: '0.1em',
            color: '#E2C97E',
            background: 'rgba(12,12,15,0.86)',
            border: '0.5px solid rgba(201,168,76,0.4)',
            backdropFilter: 'blur(6px)',
          }}
          initial={reduce ? false : { opacity: 0, scale: 0.7, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: chip.delay, ease: [0.16, 1, 0.3, 1] }}
        >
          {chip.label}
        </motion.span>
      ))}
    </motion.div>
  )
}
