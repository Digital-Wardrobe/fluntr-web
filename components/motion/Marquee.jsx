'use client'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * A continuously drifting band of phrases.
 *
 * It is here because a page with no idle motion looks switched off between
 * scroll events, and because these phrases are the fastest way to say "we know
 * your Tuesday". Duplicated once and translated by exactly -50% so the loop has
 * no seam.
 */
export default function Marquee({ items, reverse = false, duration = 34, tone = 'rgba(255,255,255,0.1)' }) {
  const reduce = useReducedMotion()
  const row = [...items, ...items]

  return (
    <div
      className="relative w-full overflow-hidden py-7"
      style={{
        borderTop: '1px solid rgba(21,23,27,0.07)',
        borderBottom: '1px solid rgba(21,23,27,0.07)',
        // feather both ends so the phrases drift out of view rather than being chopped
        maskImage: 'linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 9%, #000 91%, transparent)',
      }}
    >
      <motion.div
        className="flex w-max items-center gap-10 md:gap-16"
        animate={reduce ? undefined : { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-serif-display whitespace-nowrap"
            style={{ fontSize: 'clamp(22px,3.4vw,46px)', color: tone, fontStyle: 'italic', lineHeight: 1 }}
          >
            {item}
            <span aria-hidden className="not-italic" style={{ color: 'rgba(21,23,27,0.3)', margin: '0 0 0 2.2rem' }}>
              &bull;
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
