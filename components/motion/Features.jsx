'use client'
import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import TiltCard from './TiltCard'
import { Device, ClosetScreen, FeedScreen, KweenScreen, byId } from './Demo'
import { KweenPerch } from './KweenRoamer'

/**
 * Three big cards, alternating sides, each with a real screen in a device and
 * a headline that says the one thing that screen is for. The screens are the
 * demo's own components at rest, not screenshots, so hovering a question in
 * the Kween card actually asks it.
 */

const INK = '#121317'
const MUTED = '#6B7080'

function Card({ children, flip = false, tone, title, body, props = [], perch }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden"
      style={{ borderRadius: 40, background: '#F5F6F8', border: '1px solid rgba(18,19,23,0.08)' }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(55% 60% at ${flip ? '80%' : '20%'} 30%, ${tone}22, transparent 65%)` }} />
      <div className={`relative grid items-center gap-10 px-6 py-12 md:px-12 md:py-16 lg:grid-cols-2 lg:gap-16 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <div className="relative flex justify-center">
          <div className="relative" style={{ width: 'min(78vw, 320px)' }}>
            <TiltCard max={5} sheen={false}><Device>{children}</Device></TiltCard>
            {props.map((p, i) => (
              <motion.span
                key={p.text}
                className="pointer-events-none absolute z-20 hidden whitespace-nowrap md:block"
                style={{ left: p.left, top: p.top, background: p.tone || tone, color: '#fff', borderRadius: 999, padding: '8px 14px', fontSize: 13, fontWeight: 700, boxShadow: `0 14px 30px -10px ${p.tone || tone}aa` }}
                animate={reduce ? undefined : { y: [0, -7, 0] }}
                transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
              >
                {p.text}
              </motion.span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="h-display" style={{ fontSize: 'clamp(32px,4.2vw,58px)', color: INK }}>{title}</h3>
          <p className="mt-5 max-w-md text-[18px] leading-relaxed md:text-[20px]" style={{ color: MUTED }}>{body}</p>
          {perch ? <KweenPerch name={perch.name} line={perch.line} mood={perch.mood} className="mt-8 hidden md:block" width="clamp(84px, 8vw, 110px)" /> : null}
        </div>
      </div>
    </motion.div>
  )
}

export default function Features() {
  const [mood, setMood] = useState('smug')
  const [talking, setTalking] = useState(false)
  return (
    <section id="app" className="px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Card
          tone="#2E8FA3"
          title="See everything you own. Finally."
          body="Every piece, in a grid you can actually look through. Grouped by colour, type and occasion, and searchable the way your memory is not."
          props={[{ text: '+ 6 added', left: '-22%', top: '16%', tone: '#4F9D6B' }, { text: 'Ethnic wear · 4', left: '78%', top: '42%' }]}
          perch={{ name: 'closet', line: 'Your tops and bottoms make 24 combos. Lots to wear!', mood: 'happy' }}
        >
          <ClosetScreen selected={['kurta-look', 'lehenga', 'denim-jacket', 'saree', 'sneakers', 'juttis']} animate={false} />
        </Card>

        <Card
          flip
          tone="#F28C38"
          title="Ask before you commit."
          body="Put a look up and see what people think while you still have time to change. Every post says which pieces made it."
          props={[{ text: '♥ 142', left: '-16%', top: '26%' }, { text: 'that’s the one', left: '76%', top: '58%', tone: '#121317' }]}
          perch={{ name: 'feed', line: 'I saw that like. Good taste.', mood: 'love' }}
        >
          <FeedScreen item={byId['kurta-look']} />
        </Card>

        <Card
          tone="#7B6CF6"
          title="Kween knows your closet."
          body="Short answers from the clothes you actually own, not a shop. Ask about Saturday, about the office, about what you have been ignoring."
          props={[{ text: 'Saturday · Wedding', left: '-28%', top: '20%' }, { text: '3 picks', left: '80%', top: '66%', tone: '#F28C38' }]}
        >
          <KweenScreen preset={1} mood={mood} talking={talking} setMood={setMood} setTalking={setTalking} />
        </Card>
      </div>
    </section>
  )
}
