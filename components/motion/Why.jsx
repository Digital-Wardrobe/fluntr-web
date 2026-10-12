'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { Glyph } from './Demo'
import { KweenPerch } from './KweenRoamer'

/**
 * Why Fluntr. The problem in the words people used on the waitlist form (the
 * same real lines as the chat wall), then where they turn today and what each
 * of those actually knows, then Fluntr: the one that knows you, and acts.
 */

const INK = '#121317'
const MUTED = '#6B7080'

const TRUTHS = [
  { q: 'I never know what to wear.', a: 'The same five outfits come out every week, while the rest of the cupboard waits.', where: 'Bengaluru' },
  { q: 'I forget what clothes I own.', a: 'So the fourth navy top gets bought, and last Diwali’s kurta never comes out again.', where: 'Mumbai' },
  { q: 'Can’t plan outfits for occasions.', a: 'Every interview, wedding and trip starts with panic. And shopping is a guess: will it go, is it cheaper next week, will it arrive in time?', where: 'Delhi' },
]

const TODAY = [
  { k: 'images', who: 'Instagram and Pinterest', knows: 'Other people’s clothes.' },
  { k: 'tag', who: 'Shopping apps and store stylists', knows: 'What they want to sell you.' },
  { k: 'closet', who: 'Closet apps', knows: 'A list of what you own.' },
  { k: 'chat', who: 'AI chatbots', knows: 'Advice for anyone.' },
]

const KNOWS = [['closet', 'Your clothes'], ['sparkle', 'Your colours'], ['calendar', 'Your plans'], ['sun', 'Your weather'], ['body', 'Your fit'], ['stats', 'Your budget']]
const DOES = ['Picks your outfit every day', 'Gets you ready for every event', 'Shops with you, only if you say yes', 'Finds it in a store near you']

const ease = [0.16, 1, 0.3, 1]

export default function Why() {
  const reduce = useReducedMotion()
  const rise = (delay = 0) => ({ initial: reduce ? false : { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 0.65, ease, delay } })
  return (
    <section id="why" className="cv-auto relative scroll-mt-20 px-4 py-20 md:px-6 md:py-28" style={{ containIntrinsicSize: 'auto 1500px' }}>
      <div className="relative mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-8">
        <motion.div {...rise()} className="max-w-3xl">
          <p className="text-eyebrow mb-5">Why Fluntr</p>
          <h2 className="h-display" style={{ fontSize: 'clamp(34px,4.6vw,64px)', color: INK }}>
            Clothes apps know clothes. Fluntr knows <span className="serif-accent">you</span>.
          </h2>
          <p className="mt-6 max-w-2xl text-[18px] leading-relaxed md:text-[20px]" style={{ color: MUTED }}>
            Keeping a list of your clothes, or scrolling other people’s, is where fashion help starts. Fluntr goes further: it learns you, and takes care of what you wear, buy and plan.
          </p>
        </motion.div>
        <KweenPerch name="why" line="Clothes apps know clothes. I know you." mood="smug" className="mb-2 hidden shrink-0 lg:block" width="clamp(84px, 7vw, 100px)" />
        </div>

        {/* the problem, in their words */}
        <p className="text-eyebrow mb-4 mt-14">What people told us when they joined the waitlist</p>
        <div className="grid gap-4 md:grid-cols-3">
          {TRUTHS.map((t, n) => (
            <motion.figure key={t.q} {...rise(0.08 * n)} className="glass m-0 flex flex-col p-6 md:p-7" style={{ borderRadius: 28 }}>
              <span aria-hidden className="serif-accent" style={{ fontSize: 64, lineHeight: 0.6, height: 30, display: 'block' }}>“</span>
              <blockquote className="m-0" style={{ fontSize: 'clamp(21px,2vw,25px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2, color: INK }}>{t.q}</blockquote>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed" style={{ color: MUTED }}>{t.a}</p>
              <figcaption className="mt-5 text-[12.5px] font-semibold" style={{ color: '#9AA0A6' }}>Waitlist · {t.where}</figcaption>
            </motion.figure>
          ))}
        </div>

        {/* the gap: where people turn today, and what each of those knows */}
        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-8">
          <div>
            <p className="text-eyebrow mb-4">Where people turn today, and what it knows</p>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {TODAY.map((r, n) => (
                <motion.li key={r.who} {...rise(0.06 * n)} className="flex items-center gap-4 px-5 py-4" style={{ borderRadius: 22, background: '#F5F6F8', border: '1px solid rgba(18,19,23,0.06)' }}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center" style={{ borderRadius: 12, background: '#fff' }}><Glyph k={r.k} color="#8A8F9C" size={18} sw={2} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15.5px] font-semibold" style={{ color: INK }}>{r.who}</span>
                    <span className="block text-[14.5px]" style={{ color: MUTED }}>{r.knows}</span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div {...rise(0.15)} className="relative flex flex-col justify-between overflow-hidden p-7 md:p-9" style={{ borderRadius: 32, background: INK, color: '#fff', boxShadow: '0 40px 80px -40px rgba(18,19,23,0.55)' }}>
            <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 55% at 85% 0%, rgba(242,140,56,0.35), transparent 60%)' }} />
            <div className="relative">
              <p className="mb-3 text-[12px] font-semibold uppercase" style={{ letterSpacing: '0.16em', color: 'rgba(255,255,255,0.6)' }}>Fluntr</p>
              <h3 className="h-display" style={{ fontSize: 'clamp(30px,3.4vw,44px)', color: '#fff' }}>Knows <span className="serif-accent">you</span>. And acts on it.</h3>
              <ul className="m-0 mt-6 flex list-none flex-wrap gap-2 p-0">
                {KNOWS.map(([k, label]) => (
                  <li key={label} className="flex items-center gap-1.5" style={{ borderRadius: 999, padding: '7px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.14)', fontSize: 13.5, fontWeight: 600 }}>
                    <Glyph k={k} color="#F8B47A" size={14} sw={2} />{label}
                  </li>
                ))}
              </ul>
              <ul className="m-0 mt-7 grid list-none gap-3 p-0 sm:grid-cols-2">
                {DOES.map(d => (
                  <li key={d} className="flex items-start gap-2.5 text-[15.5px] leading-snug" style={{ color: 'rgba(255,255,255,0.88)' }}>
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center" style={{ borderRadius: 999, background: '#F28C38' }}><Glyph k="check" color="#fff" size={11} sw={2.4} /></span>{d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative mt-8 flex items-end justify-between gap-4">
              <p className="m-0 max-w-sm text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>One place to ask before anything you wear, buy or plan.</p>
              <KweenPerch name="why" line="Clothes apps know clothes. I know you." mood="smug" bubble="left" className="shrink-0" width="clamp(60px, 6vw, 84px)" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
