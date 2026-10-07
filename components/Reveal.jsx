'use client'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Scroll reveal. Motion here is doing one job: sequencing, so a section reads
 * top to bottom rather than arriving all at once. Anything that does not need
 * sequencing does not get wrapped.
 *
 * Collapses to static under prefers-reduced-motion.
 */
export default function Reveal({ children, delay = 0, y = 24, className = '' }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
