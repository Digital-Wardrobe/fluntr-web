'use client'
import { motion, useReducedMotion } from 'framer-motion'

/** A hairline that draws itself across when it enters view. Used as a divider. */
export default function DrawLine({ delay = 0, tone = 'rgba(21,23,27,0.1)' }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      aria-hidden
      className="h-px w-full origin-left"
      style={{ background: tone }}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  )
}
