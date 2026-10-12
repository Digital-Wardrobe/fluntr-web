'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'

/**
 * Pointer-reactive card: tilts towards the cursor and runs a gold sheen across
 * itself on hover.
 *
 * Deliberately shallow — 6 degrees, not 20. The point is that the surface feels
 * alive under the hand, not that it performs a trick.
 */
export default function TiltCard({ children, className = '', style, max = 6, sheen = true }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 220, damping: 26 })
  const sy = useSpring(my, { stiffness: 220, damping: 26 })
  const rotateY = useTransform(sx, [0, 1], [-max, max])
  const rotateX = useTransform(sy, [0, 1], [max, -max])
  const sheenX = useTransform(sx, [0, 1], ['-10%', '110%'])

  function onMove(e) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  function onLeave() {
    mx.set(0.5)
    my.set(0.5)
  }

  if (reduce) return <div className={className} style={style}>{children}</div>

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={className}
      style={{ ...style, rotateX, rotateY, transformPerspective: 900, willChange: 'transform' }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
    >
      {children}
      {sheen ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-1/3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            left: sheenX,
            background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.5), transparent)',
          }}
        />
      ) : null}
    </motion.div>
  )
}
