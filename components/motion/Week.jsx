'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { Cut, Glyph } from './Demo'
import { Mark } from '../Logo'
import { KweenPerch } from './KweenRoamer'
import { useSound } from './Sound'
import { track } from '../../lib/analytics'

/**
 * A week with Kween: the calendar and the reminders. Each plan gets an outfit
 * from your own closet, her reasons, and the nudge she sends at the right
 * moment. It plays through the week on its own while on screen; tapping a day
 * takes over.
 */

const INK = '#121317'
const MUTED = '#6B7080'
const STEP_MS = 4800

const DAYS = [
  { id: 'mon', day: 'Mon', label: 'Interview', when: 'Monday · 10:00 am', tone: '#2E8FA3', ids: ['kurta-set', 'juttis'],
    notes: ['Smart, not stiff', 'In your colours', 'Iron the dupatta'],
    remind: { at: 'Sunday · 9:00 pm', text: 'Interview tomorrow at 10. Your chikankari set is ready. Iron the dupatta tonight.' } },
  { id: 'wed', day: 'Wed', label: 'Client meeting', when: 'Wednesday · 3:00 pm', tone: '#3C6DD9', ids: ['kurti', 'jeans', 'sneakers'],
    notes: ['31° and humid', 'Jeans are clean', 'Not worn in 3 weeks'],
    remind: { at: 'Wednesday · 8:00 am', text: 'Meeting at 3 and it’s 31° out. The olive kurti, and leave the jacket at home.' } },
  { id: 'fri', day: 'Fri', label: 'Party', when: 'Friday · 8:00 pm', tone: '#E0457B', ids: ['saree'],
    notes: ['Mauve suits you', 'New to this crowd', 'Pleats take 15 minutes'],
    remind: { at: 'Friday · 6:30 pm', text: 'Party at 8. Start the saree at 7: the pleats take 15 minutes.' } },
  { id: 'sat', day: 'Sat', label: 'Sangeet', when: 'Saturday · 7:00 pm', tone: '#F28C38', ids: ['lehenga', 'juttis'],
    notes: ['Not worn with this crowd', 'Maroon juttis to match', 'Dry-clean pickup Thursday'],
    remind: { at: 'Thursday · 6:00 pm', text: 'Pick up the lehenga from the dry cleaner today. Sangeet is on Saturday.' } },
  { id: 'trip', day: 'Next month', label: 'Goa trip', when: '4 days · 31° and rain', tone: '#4F9D6B', ids: ['denim-jacket', 'white-tee', 'jeans', 'sneakers'],
    notes: ['Packing list: 9 pieces', 'All from your closet', 'Missing: a rain jacket'],
    remind: { at: '12 days before', text: 'Goa in 12 days: 31° and rain. Your packing list is ready. One thing is missing: a light rain jacket. Shall I find one?' } },
]

export default function Week() {
  const reduce = useReducedMotion()
  const { play } = useSound()
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4 })
  const [i, setI] = useState(0)
  const [held, setHeld] = useState(false) // the visitor picked a day: stop the tour
  const d = DAYS[i]

  useEffect(() => {
    if (!inView || held || reduce) return
    const t = setTimeout(() => setI(x => (x + 1) % DAYS.length), STEP_MS)
    return () => clearTimeout(t)
  }, [inView, held, reduce, i])

  const pick = n => { setHeld(true); setI(n); play('pop', { gain: 0.4, rate: 1.15 }); track('week_day', { day: DAYS[n].id }) }

  return (
    <section id="week" className="cv-auto relative scroll-mt-20 px-4 py-16 md:px-6 md:py-24" style={{ containIntrinsicSize: 'auto 1100px' }}>
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-eyebrow mb-5">Calendar and reminders</p>
          <h2 className="h-display" style={{ fontSize: 'clamp(32px,4.4vw,60px)', color: INK }}>
            Every plan, <span className="serif-accent">planned</span>.
          </h2>
          <p className="mt-5 max-w-2xl text-[18px] leading-relaxed md:text-[19px]" style={{ color: MUTED }}>
            Interviews, meetings, parties, a sangeet, a trip next month. Add it once. Kween plans the outfit from your closet and in your colours, checks the laundry and what this crowd has already seen, and reminds you at the right moment.
          </p>
        </div>

        <div ref={ref} className="relative mt-10 overflow-hidden" style={{ borderRadius: 40, background: '#F5F6F8', border: '1px solid rgba(18,19,23,0.08)' }}>
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(55% 60% at 80% 20%, ${d.tone}1f, transparent 65%)`, transition: 'background .5s' }} />
          {/* the week */}
          <div className="relative flex gap-2 overflow-x-auto px-5 pt-6 md:px-10 md:pt-9" style={{ scrollbarWidth: 'none' }} role="tablist" aria-label="Plans this week">
            {DAYS.map((x, n) => (
              <button key={x.id} type="button" role="tab" aria-selected={n === i} onClick={() => pick(n)} className="flex shrink-0 flex-col items-start" style={{ borderRadius: 18, padding: '10px 14px', border: 0, cursor: 'pointer', background: n === i ? '#fff' : 'transparent', boxShadow: n === i ? '0 6px 18px rgba(18,19,23,0.08)' : 'none', transition: 'background .2s' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: MUTED }}>{x.day}</span>
                <span className="flex items-center gap-1.5" style={{ fontSize: 15, fontWeight: 700, color: n === i ? INK : '#8A8F9C' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: x.tone }} />{x.label}
                </span>
              </button>
            ))}
          </div>

          <div className="relative grid gap-6 px-5 pb-7 pt-5 md:px-10 md:pb-10 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
            {/* room for the biggest day, so the page below never moves as the days play */}
            <div className="min-h-[352px] sm:min-h-[318px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={d.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="p-5 md:p-6" style={{ borderRadius: 28, background: '#fff', boxShadow: '0 20px 44px -24px rgba(18,19,23,0.25)' }}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2" style={{ fontSize: 13, fontWeight: 700, color: d.tone }}><Glyph k="calendar" color={d.tone} size={15} sw={2} />{d.when}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: MUTED }}>From your closet</span>
                </div>
                <h3 className="h-display mt-2" style={{ fontSize: 'clamp(26px,3vw,36px)', color: INK }}>{d.label}</h3>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {d.ids.map((id, n) => (
                    <motion.div key={id} className="relative overflow-hidden" style={{ width: 'clamp(70px, 18vw, 96px)', aspectRatio: '1 / 1.15', borderRadius: 16, background: '#F5F5F7' }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 24, delay: 0.1 + n * 0.08 }}>
                      <div className="absolute inset-[9%]"><Cut id={id} /></div>
                    </motion.div>
                  ))}
                </div>
                <ul className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0">
                  {d.notes.map(t => (
                    <li key={t} className="flex items-center gap-1.5" style={{ borderRadius: 999, padding: '6px 11px', background: `${d.tone}14`, fontSize: 13, fontWeight: 600, color: INK }}>
                      <Glyph k="sparkle" color={d.tone} size={12} sw={2} />{t}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
            </div>

            {/* the reminder, as it lands on the phone */}
            <div className="flex flex-col justify-center gap-4">
              <p className="text-eyebrow m-0">The reminder</p>
              <div className="min-h-[124px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={d.id} initial={{ opacity: 0, y: -18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ type: 'spring', stiffness: 320, damping: 26, delay: 0.25 }} className="flex gap-3 p-4" style={{ borderRadius: 24, background: 'rgba(255,255,255,0.86)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(18,19,23,0.06)', boxShadow: '0 18px 40px -20px rgba(18,19,23,0.3)' }}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center" style={{ borderRadius: 12, background: INK }}><Mark size={18} color="#fff" /></span>
                  <span className="min-w-0">
                    <span className="flex items-center justify-between gap-3" style={{ fontSize: 12, fontWeight: 600, color: MUTED }}><span>FLUNTR · Kween</span><span>{d.remind.at}</span></span>
                    <span className="mt-1 block text-[15px] leading-snug" style={{ color: INK, fontWeight: 500 }}>{d.remind.text}</span>
                  </span>
                </motion.div>
              </AnimatePresence>
              </div>
              <KweenPerch name="week" line="Interview on Monday? Already sorted." mood="smug" width="clamp(60px, 6vw, 88px)" />
            </div>
          </div>

          {/* the tour's clock */}
          {!held && !reduce ? (
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: 'rgba(18,19,23,0.06)' }}>
              <motion.div key={`${i}-${inView}`} className="h-full w-full" style={{ background: d.tone, transformOrigin: '0 50%' }} initial={{ scaleX: 0 }} animate={{ scaleX: inView ? 1 : 0 }} transition={{ duration: inView ? STEP_MS / 1000 : 0, ease: 'linear' }} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
