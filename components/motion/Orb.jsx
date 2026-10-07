'use client'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * The gold wash behind a section. It drifts, and optionally breathes, because a
 * perfectly still gradient on a near-black page reads as a dead pixel field.
 */
export default function Orb({ left = '50%', top = '50%', size = 760, pulse = false }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        left, top,
        width: size, height: size,
        maxWidth: '150vw', maxHeight: '150vw',
        translateX: '-50%', translateY: '-50%',
        background: `radial-gradient(circle, rgba(201,168,76,${pulse ? 0.085 : 0.065}) 0%, transparent 65%)`,
      }}
      animate={
        reduce
          ? undefined
          : pulse
            ? { scale: [1, 1.1, 1], opacity: [0.75, 1, 0.75] }
            : { x: [0, 34, -18, 0], y: [0, -26, 20, 0] }
      }
      transition={{ duration: pulse ? 9 : 22, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}
