'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { Glyph } from './Demo'
import { KweenPerch } from './KweenRoamer'

/**
 * Why Fluntr, in as few words as it takes. Three things people said on the
 * waitlist form (real lines, no explanation needed), then one big statement
 * that builds line by line to the point, then what she knows.
 */

const INK = '#121317'
const MUTED = '#6B7080'

const SAID = [['I never know what to wear.', 'Bengaluru'], ['I forget what clothes I own.', 'Mumbai'], ['Can’t plan outfits for occasions.', 'Delhi']]
const OTHERS = [['Instagram', 'knows other people’s clothes.'], ['Shopping apps', 'know what sells.'], ['Closet apps', 'know your list.'], ['Chatbots', 'know everyone.']]
const KNOWS = [['closet', 'Your clothes', '#2E8FA3'], ['sparkle', 'Your colours', '#E0457B'], ['calendar', 'Your plans', '#7B6CF6'], ['sun', 'Your weather', '#F28C38'], ['body', 'Your fit', '#4F9D6B'], ['stats', 'Your budget', '#3C6DD9']]

const ease = [0.16, 1, 0.3, 1]

export default function Why() {
  const reduce = useReducedMotion()
  const rise = (delay = 0) => ({ initial: reduce ? false : { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.4 }, transition: { duration: 0.6, ease, delay } })
  return (
    <section id="why" className="cv-auto relative scroll-mt-20 px-4 py-14 md:px-6 md:py-24" style={{ containIntrinsicSize: 'auto 1300px' }}>
      <div className="relative mx-auto max-w-6xl">
        {/* what people said, in their words */}
        <motion.p {...rise()} className="text-eyebrow mb-6">You told us</motion.p>
        <div className="grid gap-x-8 gap-y-6 md:grid-cols-3">
          {SAID.map(([q, where], n) => (
            <motion.figure key={q} {...rise(0.08 * n)} className="m-0">
              <blockquote className="m-0" style={{ fontSize: 'clamp(24px,2.6vw,34px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: INK, textWrap: 'balance' }}>
                <span className="serif-accent" style={{ fontSize: '1.3em', lineHeight: 0 }}>“</span>{q}
              </blockquote>
              <figcaption className="mt-3 text-[13px] font-semibold" style={{ color: '#9AA0A6' }}>Waitlist · {where}</figcaption>
            </motion.figure>
          ))}
        </div>

        {/* the point, one line at a time */}
        <div className="mt-24 md:mt-32">
          {OTHERS.map(([who, what], n) => (
            <motion.p key={who} {...rise(0.12 * n)} className="m-0" style={{ fontSize: 'clamp(24px,3.4vw,46px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.12, color: '#B4B8C1' }}>
              <span style={{ color: MUTED }}>{who}</span> {what}
            </motion.p>
          ))}
          <motion.h2 {...rise(0.12 * OTHERS.length + 0.1)} className="h-display mt-3" style={{ fontSize: 'clamp(40px,6.4vw,92px)', color: INK }}>
            Fluntr knows <span className="serif-accent">you</span>.
          </motion.h2>
        </div>

        {/* what she knows */}
        <motion.div {...rise(0.2)} className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <ul className="m-0 flex max-w-2xl list-none flex-wrap gap-2 p-0">
            {KNOWS.map(([k, label, tone]) => (
              <li key={label} className="glass flex items-center gap-2" style={{ borderRadius: 999, padding: '9px 15px', fontSize: 15, fontWeight: 600, color: INK }}>
                <Glyph k={k} color={tone} size={16} sw={2} />{label}
              </li>
            ))}
          </ul>
          <KweenPerch name="why" line="Clothes apps know clothes. I know you." mood="smug" bubble="left" className="shrink-0" width="clamp(64px, 7vw, 100px)" />
        </motion.div>
      </div>
    </section>
  )
}
