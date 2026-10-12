'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import Kween from './Kween'
import { Device, Cut, Glyph } from './Demo'
import { KweenPerch } from './KweenRoamer'
import { kweenSay } from './kweenStore'
import { useSound } from './Sound'
import { track } from '../../lib/analytics'

/**
 * Shopping, only with your OK. Closet first; when nothing there works, Kween
 * asks, then: completes the look from the store you are standing in (online),
 * finds it in a store near you, says whether to buy now or wait for a sale,
 * checks delivery against the date, and lets you try it without wearing it.
 * One phone, one step at a time, playing on its own while on screen.
 */

const INK = '#121317'
const MUTED = '#6B7080'
const SOFT = '#F5F5F7'
const STEP_MS = 5200

const STEPS = [
  { k: 'ask', title: 'She asks first.', body: 'Nothing in your closet works? Kween asks before she looks anywhere else. Your closet always comes first.',
    say: 'Closet first. I only shop if you say yes.', mood: 'happy' },
  { k: 'store', title: 'Trying something on? She completes the look.', body: 'In H&M with a jacket in your hands? She finds the pants that suit it from H&M’s own range online, in your size and your colours.',
    say: 'Same store, online, in your size.', mood: 'smug' },
  { k: 'near', title: 'Not loving those? A store near you.', body: 'Share your location for that one search, and she finds a match in your size at a store close by.',
    say: 'Or walk 1.2 km. It’s right there.', mood: 'happy' },
  { k: 'when', title: 'Buy now, or wait?', body: 'She checks today’s offers and the sales coming up across thousands of online stores, and tells you the best day to buy.',
    say: 'Wait 9 days. Save ₹800.', mood: 'smug' },
  { k: 'arrive', title: 'Will it arrive in time?', body: 'Ordering online? She checks the delivery date against your event before you pay.',
    say: 'Arrives Thursday. Party’s Saturday. Safe.', mood: 'love' },
  { k: 'try', title: 'Try it without wearing it.', body: '',
    say: 'Try it on. No trial-room queue.', mood: 'love' },
]

// three pants from the same store: one cutout, three washes
const PANTS = [
  { name: 'Wide-leg, light', price: '₹2,299', filter: 'none' },
  { name: 'Straight, dark', price: '₹1,999', filter: 'brightness(0.62) saturate(1.25)' },
  { name: 'Relaxed, black', price: '₹2,499', filter: 'grayscale(1) brightness(0.42) contrast(1.2)' },
]

const enter = (delay = 0) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1], delay } })

function Me({ children, delay }) {
  return <motion.div {...enter(delay)} className="ml-auto w-max max-w-[86%]" style={{ background: INK, color: '#fff', borderRadius: '16px 16px 4px 16px', padding: '8px 12px', fontSize: 12.5, fontWeight: 500, lineHeight: 1.4 }}>{children}</motion.div>
}
function Her({ children, delay }) {
  return <motion.div {...enter(delay)} className="w-max max-w-[88%]" style={{ background: '#F0F0F0', color: INK, borderRadius: '16px 16px 16px 4px', padding: '8px 12px', fontSize: 12.5, fontWeight: 500, lineHeight: 1.4 }}>{children}</motion.div>
}
function Tile({ id, filter = 'none', w = '30%' }) {
  return (
    <div className="relative overflow-hidden" style={{ width: w, aspectRatio: '1 / 1.12', borderRadius: 12, background: SOFT }}>
      <div className="absolute inset-[9%]"><Cut id={id} style={{ filter }} /></div>
    </div>
  )
}
function Panel({ children, delay, style }) {
  return <motion.div {...enter(delay)} style={{ background: '#fff', borderRadius: 18, padding: 12, border: '1px solid rgba(10,10,10,0.08)', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', ...style }}>{children}</motion.div>
}
function Verdict({ children, tone = '#2E7D4F', delay }) {
  return (
    <motion.div {...enter(delay)} className="flex items-center gap-1.5" style={{ marginTop: 10, borderRadius: 999, padding: '7px 11px', background: `${tone}18`, color: tone, fontSize: 12, fontWeight: 700 }}>
      <Glyph k="check" color={tone} size={12} sw={2.4} />{children}
    </motion.div>
  )
}

/** The screen for step k, in the app's Kween chat. */
function ShopScreen({ k }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: 'linear-gradient(180deg, #FFEBD9 0%, #fff 30%)' }}>
      <div className="flex items-center gap-2.5 px-4 pt-[13%]">
        <Glyph k="back" size={18} sw={2} />
        <span className="block" style={{ width: 34 }}><Kween expression={STEPS.find(s => s.k === k)?.mood || 'happy'} size="100%" follow={false} /></span>
        <span>
          <span className="block" style={{ fontSize: 14, fontWeight: 700, color: INK }}>Kween</span>
          <span className="block" style={{ fontSize: 10.5, color: MUTED }}>Shopping with your OK</span>
        </span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={k} className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-4 pt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {k === 'ask' ? (<>
            <Me delay={0.1}>
              <span className="mb-1.5 block overflow-hidden" style={{ width: 84, borderRadius: 10, background: '#fff' }}><Tile id="denim-jacket" w="100%" /></span>
              Trying this on at H&amp;M. What pants go with it?
            </Me>
            <Her delay={0.7}>Nothing in your closet goes with it yet. Can I look outside your closet?</Her>
            <motion.div {...enter(1.3)} className="flex gap-2">
              <span className="pulse-soft flex items-center gap-1" style={{ borderRadius: 999, padding: '8px 13px', background: INK, color: '#fff', fontSize: 12, fontWeight: 700 }}><Glyph k="check" color="#fff" size={12} sw={2.4} />Yes, look</span>
              <span style={{ borderRadius: 999, padding: '8px 13px', background: '#fff', color: INK, border: '1px solid rgba(18,19,23,0.14)', fontSize: 12, fontWeight: 600 }}>Closet only</span>
            </motion.div>
          </>) : null}

          {k === 'store' ? (<>
            <Her delay={0.1}>From H&amp;M online, in your size. All three go with the jacket:</Her>
            <Panel delay={0.5}>
              <div className="flex justify-between gap-2">
                {PANTS.map(p => (
                  <div key={p.name} className="flex-1">
                    <Tile id="jeans" filter={p.filter} w="100%" />
                    <span className="mt-1.5 block" style={{ fontSize: 10.5, fontWeight: 600, color: INK, lineHeight: 1.25 }}>{p.name}</span>
                    <span className="block" style={{ fontSize: 10.5, color: MUTED }}>{p.price}</span>
                  </div>
                ))}
              </div>
              <Verdict delay={1.1}>In your colours · your size in stock</Verdict>
            </Panel>
          </>) : null}

          {k === 'near' ? (<>
            <Me delay={0.1}>Not loving these.</Me>
            <Her delay={0.6}>Share your location, just for this search?</Her>
            <motion.span {...enter(1.1)} className="ml-auto flex w-max items-center gap-1.5" style={{ borderRadius: 999, padding: '6px 11px', background: '#E9F5EE', color: '#2E7D4F', fontSize: 11.5, fontWeight: 700 }}><Glyph k="globe" color="#2E7D4F" size={12} sw={2} />Shared once</motion.span>
            <Panel delay={1.5} style={{ padding: 0, overflow: 'hidden' }}>
              <div className="relative" style={{ height: 92, background: 'repeating-linear-gradient(0deg, #EEF1F4 0 1px, transparent 1px 22px), repeating-linear-gradient(90deg, #EEF1F4 0 1px, #F8FAFB 1px 22px)' }}>
                <span className="absolute" style={{ left: '22%', top: '58%', width: 12, height: 12, borderRadius: 999, background: '#3C6DD9', boxShadow: '0 0 0 5px #3C6DD933' }} />
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden><path d="M24 25 C 40 25, 48 12, 70 13" fill="none" stroke="#F28C38" strokeWidth="1.2" strokeDasharray="2 2" /></svg>
                <span className="absolute flex items-center justify-center" style={{ left: '68%', top: '14%', width: 26, height: 26, borderRadius: '50% 50% 50% 4px', transform: 'rotate(-45deg)', background: '#F28C38' }}><span style={{ transform: 'rotate(45deg)' }}><Glyph k="tag" color="#fff" size={12} sw={2.2} /></span></span>
              </div>
              <div className="flex items-center gap-2.5 p-3">
                <Tile id="jeans" w="22%" />
                <span className="min-w-0 flex-1">
                  <span className="block" style={{ fontSize: 12, fontWeight: 700, color: INK }}>Wide-leg jeans · your size</span>
                  <span className="block" style={{ fontSize: 11, color: MUTED }}>In stock · 1.2 km · open till 10 pm</span>
                </span>
              </div>
            </Panel>
          </>) : null}

          {k === 'when' ? (<>
            <Me delay={0.1}>Should I buy them now?</Me>
            <Panel delay={0.6}>
              <span className="block" style={{ fontSize: 11.5, fontWeight: 700, color: MUTED }}>Price, now and coming up</span>
              <div className="relative mt-3" style={{ height: 64 }}>
                <span className="absolute inset-x-1 top-[30px] h-[2px]" style={{ background: '#E6E8EC' }} />
                {[['Today', '₹2,299', '0%', INK], ['Sale in 9 days', '₹1,499', '52%', '#2E7D4F'], ['Your trip', 'in 14 days', '100%', '#F28C38']].map(([a, b, left, tone], n) => (
                  <motion.span key={a} {...enter(0.9 + n * 0.25)} className="absolute flex flex-col items-center" style={{ left, top: 0, transform: `translateX(${n === 0 ? '0' : n === 2 ? '-100%' : '-50%'})`, alignItems: n === 0 ? 'flex-start' : n === 2 ? 'flex-end' : 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: tone }}>{b}</span>
                    <span className="my-1 block" style={{ width: 10, height: 10, borderRadius: 999, background: tone, border: '2px solid #fff', boxShadow: `0 0 0 1px ${tone}` }} />
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: MUTED, whiteSpace: 'nowrap' }}>{a}</span>
                  </motion.span>
                ))}
              </div>
              <Verdict delay={1.8}>Wait for the sale. Save ₹800, still in time.</Verdict>
            </Panel>
          </>) : null}

          {k === 'arrive' ? (<>
            <Her delay={0.1}>Ordering online? Let me check the date first.</Her>
            <Panel delay={0.6}>
              {[['Order', 'Today', INK], ['Arrives', 'Thursday', '#3C6DD9'], ['Party', 'Saturday, 8 pm', '#E0457B']].map(([a, b, tone], n) => (
                <motion.div key={a} {...enter(0.9 + n * 0.3)} className="flex items-center gap-2.5" style={{ padding: '6px 0' }}>
                  <span className="flex h-7 w-7 items-center justify-center" style={{ borderRadius: 9, background: `${tone}14` }}><Glyph k={n === 2 ? 'calendar' : n === 1 ? 'down' : 'tag'} color={tone} size={13} sw={2} /></span>
                  <span className="flex-1" style={{ fontSize: 12, color: MUTED }}>{a}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: INK }}>{b}</span>
                </motion.div>
              ))}
              <Verdict delay={1.9}>Arrives 2 days early</Verdict>
            </Panel>
          </>) : null}

          {k === 'try' ? (<>
            <Her delay={0.1}>Here it is with the jacket. Try it without wearing it.</Her>
            <Panel delay={0.6} style={{ background: 'linear-gradient(180deg,#FFF4EC,#fff)' }}>
              <div className="relative mx-auto" style={{ width: '62%', aspectRatio: '1 / 1.25' }}>
                <motion.div className="absolute inset-x-[6%] top-0" style={{ height: '52%' }} initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.9 }}><Cut id="denim-jacket" /></motion.div>
                <motion.div className="absolute inset-x-[14%] bottom-0" style={{ height: '56%' }} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.2 }}><Cut id="jeans" /></motion.div>
              </div>
              <motion.div {...enter(1.6)} className="mt-2 flex items-center justify-center gap-1.5" style={{ height: 36, borderRadius: 999, background: INK, color: '#fff', fontSize: 12, fontWeight: 700 }}><Glyph k="sparkle" color="#FFD27A" size={13} sw={2} />Try it without wearing it</motion.div>
            </Panel>
          </>) : null}
        </motion.div>
      </AnimatePresence>
      <div className="mx-4 mb-[13%] mt-2 flex items-center gap-2" style={{ height: 40, borderRadius: 999, background: '#fff', border: '1px solid rgba(10,10,10,0.1)', padding: '0 6px 0 14px' }}>
        <span className="flex-1" style={{ fontSize: 12, color: '#A3A7B2' }}>Message Kween</span>
        <span className="flex h-7 w-7 items-center justify-center" style={{ borderRadius: 999, background: INK }}><Glyph k="send" color="#fff" size={13} sw={2} /></span>
      </div>
    </div>
  )
}

export default function Shop() {
  const reduce = useReducedMotion()
  const { play } = useSound()
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.45 })
  const [i, setI] = useState(0)
  const [held, setHeld] = useState(false)
  const s = STEPS[i]

  useEffect(() => {
    if (!inView || held || reduce) return
    const t = setTimeout(() => setI(x => (x + 1) % STEPS.length), STEP_MS)
    return () => clearTimeout(t)
  }, [inView, held, reduce, i])
  // she talks you through it from her spot by the phone
  useEffect(() => { if (inView) kweenSay(s.say, s.mood, { talkMs: reduce ? 0 : 900, perch: 'shop' }) }, [i, inView, reduce, s.say, s.mood])

  const pick = n => { setHeld(true); setI(n); play('pop', { gain: 0.45, rate: 1.1 }); track('shop_step', { step: STEPS[n].k }) }

  return (
    <section id="shop" className="cv-auto relative scroll-mt-20 px-4 py-16 md:px-6 md:py-24" style={{ containIntrinsicSize: 'auto 1300px' }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-8">
        <div className="max-w-3xl">
          <p className="text-eyebrow mb-5">Shopping, only with your OK</p>
          <h2 className="h-display" style={{ fontSize: 'clamp(34px,4.6vw,64px)', color: INK }}>
            Closet first. Then she <span className="serif-accent">shops</span>.
          </h2>
          <p className="mt-5 max-w-2xl text-[18px] leading-relaxed md:text-[19px]" style={{ color: MUTED }}>
            When nothing you own works, Kween looks across thousands of online stores for what suits you, in your colours and your size, and takes care of the rest: the best day to buy, delivery before your date, or a store near you.
          </p>
        </div>
        <KweenPerch name="shop" bubble="left" className="mb-2 hidden shrink-0 lg:block" width="clamp(84px, 7vw, 100px)" />
        </div>

        <div ref={ref} className="relative mt-10 overflow-hidden" style={{ borderRadius: 40, background: '#F5F6F8', border: '1px solid rgba(18,19,23,0.08)' }}>
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 50% at 75% 15%, rgba(242,140,56,0.12), transparent 60%), radial-gradient(50% 40% at 10% 90%, rgba(60,109,217,0.08), transparent 60%)' }} />
          <div className="relative grid items-center gap-8 px-5 py-8 md:px-12 md:py-14 lg:grid-cols-[1fr_minmax(0,360px)] lg:gap-16">
            {/* the steps */}
            <div className="order-2 lg:order-1">
              <ol className="m-0 flex list-none flex-col gap-1 p-0">
                {STEPS.map((x, n) => (
                  <li key={x.k}>
                    <button type="button" onClick={() => pick(n)} className="relative flex w-full items-start gap-4 overflow-hidden text-left" style={{ borderRadius: 20, padding: '12px 14px', border: 0, cursor: 'pointer', background: n === i ? '#fff' : 'transparent', boxShadow: n === i ? '0 1px 2px rgba(18,19,23,0.06)' : 'none' }}>
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center" style={{ borderRadius: 999, background: n === i ? '#F28C38' : '#E8E9EC', color: n === i ? '#fff' : MUTED, fontSize: 12, fontWeight: 700 }}>{n + 1}</span>
                      <span className="min-w-0">
                        <span className="block" style={{ fontSize: 16, fontWeight: 700, color: n === i ? INK : '#5A5F6B', letterSpacing: '-0.01em' }}>{x.title}</span>
                        {/* always shown, so the list never changes height while it plays */}
                        {x.body ? <span className="block pt-1 text-[14.5px] leading-relaxed" style={{ color: n === i ? MUTED : '#9AA0A6', transition: 'color .3s' }}>{x.body}</span> : null}
                      </span>
                      {n === i && !held && !reduce && inView ? (
                        <motion.span aria-hidden key={`bar-${i}`} className="absolute bottom-0 left-0 h-[3px] w-full" style={{ background: '#F28C38', transformOrigin: '0 50%' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: STEP_MS / 1000, ease: 'linear' }} />
                      ) : null}
                    </button>
                  </li>
                ))}
              </ol>
              <KweenPerch name="shop" bubble="right" className="ml-3 mt-6" width="clamp(60px, 7vw, 96px)" />
            </div>

            {/* the phone */}
            <div className="order-1 flex flex-col items-center lg:order-2">
              <div className="relative" style={{ width: 'min(80vw, 340px)' }}>
                <KweenPerch name="shop" className="absolute lg:hidden" style={{ left: 2, top: -46 }} width="60px" />
                <Device><ShopScreen k={s.k} /></Device>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
