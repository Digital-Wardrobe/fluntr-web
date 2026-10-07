'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

/**
 * Moves its child against the scroll while the wrapper passes the viewport.
 *
 * `distance` is the total travel in pixels; a photo inside wants to be taller
 * than its frame or parallax will drag its edge into view, which is why the
 * callers here all pair this with an overflow-hidden parent.
 */
export default function Parallax({ children, distance = 90, scale = false, className = '', style }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-distance / 2, distance / 2])
  const s = useTransform(scrollYProgress, [0, 0.5, 1], scale ? [1.12, 1.02, 1.12] : [1, 1, 1])

  if (reduce) return <div className={className} style={style}>{children}</div>

  return (
    <div ref={ref} className={className} style={style}>
      <motion.div style={{ y, scale: s, willChange: 'transform', height: '100%' }}>{children}</motion.div>
    </div>
  )
}
