'use client'
import { motion, useReducedMotion } from 'framer-motion'
import TiltCard from './TiltCard'
import { Device, Cut, Glyph, TabBar, byId } from './Demo'
import { KweenPerch } from './KweenRoamer'

/**
 * The stylist. Fluntr is a closet on your phone and the most personal AI
 * stylist there is, because Kween only knows your clothes, your city, your
 * week and your taste. Everything listed here is what the app's stylist does
 * (src/components/stylist, app/fit-check, app/day-events, app/outfit-calendar,
 * app/insights, app/laundry), in the words the app uses.
 */

const INK = '#121317'
const MUTED = '#6B7080'
const FILL = 'rgba(118,118,128,0.10)'
const SOFT = '#F5F5F7'

const ROWS = [
  { k: 'sun', tone: '#F28C38', title: 'Today’s outfit, every morning', body: 'For your weather, your dress code and your plans. Two alternatives a tap away, each with the reason it was picked. One tap logs it as worn.' },
  { k: 'camera', tone: '#7B6CF6', title: 'Fit check', body: 'A mirror selfie: what works, the one change that would help most, and a score. Clothes only, never your body. The photo is deleted straight after.' },
  { k: 'calendar', tone: '#2E8FA3', title: 'Events, festivals and trips', body: 'Weddings, interviews, Diwali, Eid, a trip. She plans the outfit days ahead and reminds you. Trips get a packing list for the weather there.' },
  { k: 'clock', tone: '#4F9D6B', title: 'Wear history', body: 'Plan a day, mark it worn. She knows what has not been out in 60 days, and stops you repeating a look at the same event.' },
  { k: 'stats', tone: '#3C6DD9', title: 'Insights', body: 'How much of your closet actually gets worn, cost per wear, your go-to pieces, and the gaps worth filling within your budget.' },
  { k: 'water', tone: '#2E8FA3', title: 'Laundry', body: 'Put pieces in the wash from the Today card. She will not suggest them again until they are clean.' },
]

const list = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } } }

/** The Today card from the app's Home tab (src/components/stylist/TodayCard.tsx), at rest. */
function TodayScreen() {
  const reduce = useReducedMotion()
  const outfit = ['kurti', 'jeans', 'sneakers']
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#fff' }}>
      <div className="flex items-center justify-between px-4 pt-[12%]">
        <Glyph k="bell" size={22} sw={2} />
        <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.02em', color: '#0A0A0A' }}>Fluntr</span>
        <Glyph k="chat" size={22} sw={2} />
      </div>

      <motion.div className="mx-3 mt-3" style={{ borderRadius: 22, background: '#fff', border: '1px solid rgba(10,10,10,0.08)', boxShadow: '0 4px 14px rgba(0,0,0,0.06)', padding: 14 }} variants={list} initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.4 }}>
        <div className="flex items-start justify-between">
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.01em' }}>Good morning, Priya</div>
            <div style={{ fontSize: 12, color: 'rgba(10,10,10,0.64)', marginTop: 2 }}>Smart casual · Tuesday</div>
          </div>
          <span className="flex items-center gap-1" style={{ background: FILL, borderRadius: 999, padding: '5px 9px', fontSize: 11.5, fontWeight: 600, color: '#0A0A0A' }}><Glyph k="sun" color="#F28C38" size={13} />31° / 24°</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {outfit.map(id => (
            <motion.div key={id} variants={item} className="relative overflow-hidden" style={{ aspectRatio: '1 / 1.15', borderRadius: 14, background: SOFT }}>
              <div className="absolute inset-[9%]"><Cut id={id} /></div>
            </motion.div>
          ))}
        </div>
        <motion.div variants={item} className="mt-3 flex items-start gap-2" style={{ fontSize: 11.5, lineHeight: 1.35, color: 'rgba(10,10,10,0.64)' }}>
          <Glyph k="sparkle" color="#F28C38" size={13} />
          <span>Office day and 31°. The olive kurti has not been out in three weeks, and the sneakers go with everything.</span>
        </motion.div>
        <motion.div variants={item} className="mt-3 flex gap-2">
          <span className="pulse-soft flex flex-1 items-center justify-center gap-1.5" style={{ height: 40, borderRadius: 999, background: '#0A0A0A', color: '#fff', fontSize: 13, fontWeight: 600 }}><Glyph k="check" color="#fff" size={14} />Wearing this</span>
          <span className="flex items-center justify-center" style={{ height: 40, padding: '0 16px', borderRadius: 999, background: FILL, fontSize: 13, fontWeight: 600, color: '#0A0A0A' }}>Another</span>
        </motion.div>
        <motion.div variants={item} className="mt-3 flex items-center gap-2 pt-3" style={{ borderTop: '1px solid rgba(10,10,10,0.08)', fontSize: 12 }}>
          <Glyph k="calendar" size={14} />
          <span className="flex-1" style={{ color: '#0A0A0A', fontWeight: 500 }}>Wedding in 3 days</span>
          <span style={{ fontWeight: 600, color: '#0A0A0A' }}>Plan outfit</span>
        </motion.div>
      </motion.div>

      <div className="mx-3 mt-3" style={{ borderRadius: 22, background: SOFT, padding: 14 }}>
        <div className="flex items-center justify-between" style={{ fontSize: 11.5, color: 'rgba(10,10,10,0.64)' }}><span>Quick question</span><span style={{ color: 'rgba(10,10,10,0.4)' }}>Not now</span></div>
        <div className="mt-1.5" style={{ fontSize: 14, fontWeight: 600, color: '#0A0A0A' }}>How do you like tops to fit?</div>
        <div className="mt-2.5 flex gap-2">
          {['Fitted', 'Regular', 'Relaxed'].map((o, i) => <span key={o} style={{ height: 32, padding: '0 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, lineHeight: '32px', background: i === 1 ? '#0A0A0A' : '#fff', color: i === 1 ? '#fff' : '#0A0A0A', border: '1px solid rgba(10,10,10,0.1)' }}>{o}</span>)}
        </div>
      </div>
      <TabBar active="home" />
    </div>
  )
}

export default function Stylist() {
  const reduce = useReducedMotion()
  return (
    <section id="stylist" className="cv-auto relative scroll-mt-20 overflow-hidden px-4 py-20 md:px-6 md:py-28" style={{ containIntrinsicSize: 'auto 1900px' }}>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(50% 45% at 85% 10%, rgba(242,140,56,0.12), transparent 60%), radial-gradient(45% 40% at 10% 90%, rgba(123,108,246,0.10), transparent 60%)' }} />
      <div className="relative mx-auto max-w-6xl">
        <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="max-w-3xl">
          <p className="text-eyebrow mb-5">The most personal AI stylist</p>
          <h2 className="h-display" style={{ fontSize: 'clamp(34px,4.6vw,64px)', color: INK }}>
            She only knows <span style={{ color: '#F28C38' }}>your</span> clothes. That is the point.
          </h2>
          <p className="mt-6 max-w-2xl text-[18px] leading-relaxed md:text-[20px]" style={{ color: MUTED }}>
            A shop’s stylist wants you to buy. Kween wants you to wear. She learns what you own, your city, your week and your taste, and picks from that, every morning, in English or Hindi. The answer is always something in your cupboard, never something in a cart.
          </p>
        </motion.div>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative" style={{ width: 'min(84vw, 340px)' }}>
              <TiltCard max={5} sheen={false}><Device><TodayScreen /></Device></TiltCard>
              <span className="float-y pointer-events-none absolute z-20 hidden whitespace-nowrap md:block" style={{ left: '-26%', top: '12%', background: '#F28C38', color: '#fff', borderRadius: 999, padding: '8px 14px', fontSize: 13, fontWeight: 700, boxShadow: '0 14px 30px -10px #F28C38aa', animationDuration: '3s' }}>7:00 · your outfit is ready</span>
              <span className="float-y pointer-events-none absolute z-20 hidden whitespace-nowrap md:block" style={{ left: '74%', top: '58%', background: '#121317', color: '#fff', borderRadius: 999, padding: '8px 14px', fontSize: 13, fontWeight: 700, boxShadow: '0 14px 30px -10px #121317aa', animationDuration: '3.4s', animationDelay: '0.5s' }}>31° · smart casual</span>
            </div>
            <KweenPerch name="stylist" line="I know every piece you own. A shop’s stylist can’t say that." mood="smug" className="mt-8 hidden md:block" width="clamp(84px, 8vw, 110px)" />
          </div>

          <motion.ol className="grid gap-3 md:grid-cols-2" variants={list} initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {ROWS.map(r => (
              <motion.li key={r.k} variants={item} className="glass flex gap-4 p-5" style={{ borderRadius: 24 }}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center" style={{ borderRadius: 14, background: `${r.tone}1f` }}><Glyph k={r.k} color={r.tone} size={20} sw={2} /></span>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', color: INK }}>{r.title}</h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed" style={{ color: MUTED }}>{r.body}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  )
}
