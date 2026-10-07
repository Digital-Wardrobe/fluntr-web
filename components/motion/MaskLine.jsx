'use client'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * A headline that wipes up from behind its own baseline, word by word.
 *
 * Each word sits in its own clipping row so the type rises out of nothing
 * rather than fading in on top of the background.
 *
 * The stagger is driven by variants on the parent, not by `whileInView` on each
 * word. That is load-bearing: a word starts translated 110% down, which puts it
 * outside its clipping wrapper, and a clipped-away element never reports as
 * intersecting. Giving each word its own viewport trigger deadlocks it hidden
 * forever. The parent is never clipped, so it can always see itself.
 */
export default function MaskLine({ text, delay = 0, stagger = 0.055, className = '', style, as = 'span' }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  const Tag = motion[as] || motion.span

  if (reduce) {
    const Plain = as
    return <Plain className={className} style={style}>{text}</Plain>
  }

  return (
    <Tag
      className={className}
      style={style}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.1em' }}
        >
          <motion.span
            style={{ display: 'inline-block', willChange: 'transform' }}
            variants={{
              hidden: { y: '110%', opacity: 0 },
              shown: { y: '0%', opacity: 1 },
            }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
