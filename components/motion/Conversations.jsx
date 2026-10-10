'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { useSound } from './Sound'
import { Mark } from '../Logo'

/**
 * Kween, in conversation.
 *
 * A wall of chat threads in the style of the reference's review wall: a
 * message, a reply, a strip of reactions, a name underneath. The difference is
 * what is in them. Fluntr has not launched, so there are no reviews to quote
 * and none are invented. The user side of each thread is a real line: four are
 * the struggles people pick on the waitlist form, the rest are the questions
 * the demo answers. Kween's side is what the app says back.
 *
 * When real testimonials exist they drop into THREADS with the same shape;
 * nothing else changes.
 */

const THREADS = [
  { u: 'I never know what to wear.', k: 'You own forty tops. We’ll start there.', mood: '🫠', who: 'Waitlist', where: 'Bengaluru', r: ['👗', '🔥', '😭'] },
  { u: 'Wedding on Saturday. Help.', k: 'Snake print over the white shirt. Arre, iconic.', mood: '😍', who: 'Demo', where: 'Question 2', r: ['✨', '❤️', '👏'] },
  { u: 'I forget what clothes I own.', k: 'That is the whole app. Photograph it once, see it forever.', mood: '🙃', who: 'Waitlist', where: 'Mumbai', r: ['🧥', '💯'] },
  { u: 'Too much for office?', k: 'The teal? No. The snake print? Yes. Obviously.', mood: '😏', who: 'Demo', where: 'Question 3', r: ['😂', '🔥', '👔'] },
  { u: "Can't plan outfits for occasions.", k: 'Tell me the occasion. I’ll pull three from your closet.', mood: '📅', who: 'Waitlist', where: 'Delhi', r: ['✨', '👗'] },
  { u: 'My partner and I never agree on my fits.', k: 'Post both. Let the people decide.', mood: '🙄', who: 'Waitlist', where: 'Hyderabad', r: ['😂', '❤️', '🗳️'] },
  { u: "What haven't I worn lately?", k: 'That cream knit hasn’t seen daylight in 3 weeks.', mood: '😳', who: 'Demo', where: 'Question 4', r: ['🧶', '😭', '🔥'] },
  { u: 'What goes with this?', k: 'Easy. Sand chinos, white shirt. Done before chai.', mood: '☕', who: 'Demo', where: 'Question 1', r: ['👟', '✨', '💯'] },
  { u: 'Is this too much for brunch?', k: 'Nothing is too much for brunch. Wear the earrings.', mood: '💅', who: 'Kween', where: 'Running bit', r: ['💅', '🔥'] },
]

const TANG = '#F28C38'

function Thread({ t, i }) {
  const reduce = useReducedMotion()
  const { play } = useSound()
  return (
    <motion.article
      className="mb-5 break-inside-avoid"
      initial={reduce ? false : { opacity: 0, y: 26, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative">
        {/* user */}
        <div className="chat-u ml-auto w-max max-w-[88%]">
          <span style={{ marginRight: 8 }}>{t.mood}</span>{t.u}
        </div>

        {/* kween, with the reactions riding on her bubble */}
        <div className="relative mt-5 w-max max-w-[92%]">
          <motion.div
            className="glass absolute -top-4 left-3 z-10 flex items-center gap-1.5"
            style={{ borderRadius: 999, padding: '6px 10px', fontSize: 15, lineHeight: 1 }}
            whileHover={{ scale: 1.08, rotate: -2 }}
            onHoverStart={() => play('tick', { gain: 0.4, rate: 1.3 })}
          >
            {t.r.map((e, n) => <motion.span key={n} whileHover={{ scale: 1.5, y: -3 }} style={{ display: 'inline-block', cursor: 'default' }}>{e}</motion.span>)}
          </motion.div>
          <div className="chat-k">
            {t.k}
            <div className="mt-2 flex items-center gap-1.5" style={{ fontSize: 10.5, opacity: 0.85 }}>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m2 13 4 4L14 9" /><path d="m9 17 11-11" /></svg>
              Read · {7 + (i % 3)}:{String((12 + i * 7) % 60).padStart(2, '0')} PM
            </div>
          </div>
        </div>
      </div>

      {/* who */}
      <div className="mt-2 flex items-center justify-between rounded-2xl px-3 py-2.5" style={{ background: '#fff', border: '1px solid rgba(18,19,23,0.08)' }}>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: '#F3F4F6' }}>
            <Mark size={14} color="#121317" />
          </span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#121317', lineHeight: 1.1 }}>{t.who}</div>
            <div style={{ fontSize: 11.5, color: '#6B7080' }}>{t.where}</div>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5" style={{ background: '#121317', color: '#fff', borderRadius: 999, padding: '4px 10px', fontSize: 10.5, fontWeight: 600 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: TANG, display: 'inline-block' }} />
          Answered by Kween
        </span>
      </div>
    </motion.article>
  )
}

export default function Conversations() {
  return (
    <section id="features" className="relative overflow-hidden px-6 py-24 md:px-12 md:py-32 lg:px-16" style={{ background: '#fff' }}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-eyebrow mb-4">Early conversations</p>
          <h2 className="h-display" style={{ fontSize: 'clamp(36px,5vw,68px)', color: '#121317' }}>Kween, in conversation.</h2>
          <p className="mt-5 text-[17px] leading-relaxed" style={{ color: '#6B7080' }}>
            The grey messages are what people told us on the waitlist form, and what the demo gets asked. The orange ones are Kween&apos;s.
          </p>
        </div>
        <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
          {THREADS.map((t, i) => <Thread key={t.u} t={t} i={i} />)}
        </div>
      </div>
    </section>
  )
}
