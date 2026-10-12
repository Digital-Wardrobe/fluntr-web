'use client'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Scroll reveal with a direction. Sequencing only — anything that needs to
 * actually perform has its own component in this folder.
 */
const FROM = {
  up: { y: 30, x: 0 },
  down: { y: -26, x: 0 },
  left: { y: 0, x: 42 },
  right: { y: 0, x: -42 },
  none: { y: 0, x: 0 },
}

export default function Reveal({ children, delay = 0, from = 'up', blur = false, className = '', style }) {
  const reduce = useReducedMotion()
  const off = FROM[from] || FROM.up
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, ...off, ...(blur ? { filter: 'blur(8px)' } : null) }}
      whileInView={{ opacity: 1, y: 0, x: 0, ...(blur ? { filter: 'blur(0px)' } : null) }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
