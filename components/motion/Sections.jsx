'use client'
import { motion, useReducedMotion } from 'framer-motion'
import TiltCard from './TiltCard'
import { Device, Glyph, Photo, Cut, TabBar } from './Demo'
import { KweenPerch } from './KweenRoamer'

/**
 * The rest of what Fluntr does, one section each: adding clothes from any
 * photo, how Kween gets to know you, plans and reminders, your closet in
 * numbers, the moments she dresses you for, and shopping with your yes.
 *
 * Everything here is in the app (Scan outfit, Scan many, Share to Fluntr,
 * Find me, taste learning, colours from a selfie, the stylist profile, day
 * events and the phone calendar, the evening reminders, insights, laundry,
 * shopping). Shopping copy stays honest about what it can't know: prices
 * change, and a store map knows where shops are, never what's in stock.
 */

const INK = '#121317'
const MUTED = '#6B7080'
const FILL = 'rgba(118,118,128,0.10)'
const SOFT = '#F5F5F7'
const TANG = '#F28C38'

const list = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } } }

function Heading({ eyebrow, title, body, badge }) {
  const reduce = useReducedMotion()
  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="max-w-3xl">
      <p className="text-eyebrow mb-5">
        {eyebrow}
        {badge ? <span className="ml-3 inline-block align-middle" style={{ background: TANG, color: '#fff', borderRadius: 999, padding: '3px 10px', fontSize: 11, letterSpacing: '0.08em' }}>{badge}</span> : null}
      </p>
      <h2 className="h-display" style={{ fontSize: 'clamp(34px,4.6vw,64px)', color: INK }}>{title}</h2>
      {body ? <p className="mt-6 max-w-2xl text-[18px] leading-relaxed md:text-[20px]" style={{ color: MUTED }}>{body}</p> : null}
    </motion.div>
  )
}

function Rows({ rows, cols = 'md:grid-cols-2' }) {
  const reduce = useReducedMotion()
  return (
    <motion.ol className={`grid gap-3 ${cols}`} variants={list} initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.15 }}>
      {rows.map(r => (
        <motion.li key={r.title} variants={item} className="glass flex gap-4 p-5" style={{ borderRadius: 24 }}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center" style={{ borderRadius: 14, background: `${r.tone}1f` }}><Glyph k={r.k} color={r.tone} size={20} sw={2} /></span>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', color: INK }}>
              {r.title}
              {r.tag ? <span className="ml-2 inline-block whitespace-nowrap align-middle" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', color: MUTED, background: FILL, borderRadius: 999, padding: '2px 8px' }}>{r.tag.toUpperCase()}</span> : null}
            </h3>
            <p className="mt-1.5 text-[14.5px] leading-relaxed" style={{ color: MUTED }}>{r.body}</p>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  )
}

function Phone({ children, chips = [] }) {
  return (
    <div className="relative" style={{ width: 'min(84vw, 330px)' }}>
      <TiltCard max={5} sheen={false}><Device>{children}</Device></TiltCard>
      {chips.map((c, i) => (
        <span key={c.text} className="float-y pointer-events-none absolute z-20 hidden whitespace-nowrap md:block"
          style={{ left: c.left, top: c.top, background: c.tone || TANG, color: '#fff', borderRadius: 999, padding: '8px 14px', fontSize: 13, fontWeight: 700, boxShadow: `0 14px 30px -10px ${(c.tone || TANG)}aa`, animationDuration: `${3 + i * 0.5}s`, animationDelay: `${i * 0.4}s` }}>
          {c.text}
        </span>
      ))}
    </div>
  )
}

/* ── Adding clothes: any photo, even group ones ──────────────────────────── */

/** Scan outfit's "Which one is you?" picker (app/scan-outfit.tsx), at rest. */
function PickScreen() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: SOFT }}>
      <div className="px-4 pt-[13%] text-center" style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0A' }}>Scan outfit</div>
      <div className="relative mx-3 mt-3 grid grid-cols-2 overflow-hidden" style={{ borderRadius: 22, aspectRatio: '1 / 0.95' }}>
        {['kurta-look', 'jeans-look'].map((id, i) => (
          <div key={id} className="relative">
            <Photo src={id} sizes="160px" />
            <div className="absolute" style={{ inset: '7% 9%', border: `2.5px solid ${i === 1 ? '#0A0A0A' : '#fff'}`, borderRadius: 14, background: i === 1 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)' }}>
              <span className="absolute flex items-center justify-center" style={{ top: 6, left: 6, width: 24, height: 24, borderRadius: 999, background: '#fff', fontSize: 12, fontWeight: 800, color: '#0A0A0A' }}>{i + 1}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-3 mt-3 p-3.5" style={{ borderRadius: 20, background: '#fff', border: '1px solid rgba(10,10,10,0.07)' }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: '#0A0A0A' }}>Which one is you?</div>
        <div className="mt-1" style={{ fontSize: 12, lineHeight: 1.4, color: 'rgba(10,10,10,0.64)' }}>Tap yourself and I’ll add only your outfit.</div>
        <div className="mt-2.5 inline-flex items-center gap-1.5" style={{ background: FILL, borderRadius: 999, padding: '6px 11px', fontSize: 11.5, fontWeight: 600, color: '#0A0A0A' }}><Glyph k="scan" size={13} />Find me automatically</div>
      </div>
      <div className="mx-3 mt-3 flex items-center gap-2.5 p-3" style={{ borderRadius: 18, background: '#fff', border: '1px solid rgba(10,10,10,0.07)' }}>
        <div className="flex -space-x-2">
          {['saree', 'denim-jacket', 'kurti'].map(id => <div key={id} className="overflow-hidden" style={{ width: 30, height: 36, borderRadius: 8, border: '2px solid #fff' }}><Photo src={id} sizes="40px" /></div>)}
        </div>
        <div className="flex-1" style={{ fontSize: 12, color: '#0A0A0A', fontWeight: 600 }}>Scanning 3 of 12…<div style={{ fontWeight: 400, color: 'rgba(10,10,10,0.6)' }}>Review the ready ones</div></div>
      </div>
      <TabBar active="add" />
    </div>
  )
}

export function AnyPhoto() {
  return (
    <section id="add" className="cv-auto relative scroll-mt-20 overflow-hidden px-4 py-20 md:px-6 md:py-28" style={{ containIntrinsicSize: 'auto 1500px' }}>
      <div className="relative mx-auto max-w-6xl">
        <Heading eyebrow="Adding clothes" title={<>Any photo works. <span style={{ color: TANG }}>Even group ones.</span></>}
          body="No laying everything out for new pictures. Screenshots, Instagram posts, wedding photos, the ones already in your gallery." />
        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[1fr_minmax(0,360px)] lg:gap-16">
          <Rows rows={[
            { k: 'people', tone: '#7B6CF6', title: 'Group photos', body: 'Tap yourself and only your outfit is added. Switch on Find me and she spots you herself from your profile photo. Nothing about your face is stored.' },
            { k: 'albums', tone: TANG, title: 'Twenty at once', body: 'Pick a pile of photos. She scans them one after another while you carry on, and you review each when you like, now or later.' },
            { k: 'share', tone: '#2E8FA3', title: 'Share to Fluntr', tag: 'Android', body: 'From your gallery, WhatsApp or a fresh screenshot: Share, then Fluntr. One photo or many.' },
            { k: 'scan', tone: '#4F9D6B', title: 'One photo, every piece', body: 'A photo of a whole outfit becomes separate pieces, top, bottom, shoes and bag, with the details filled in.' },
          ]} />
          <div className="flex justify-center lg:justify-start"><Phone chips={[{ text: 'Only your outfit', left: '-20%', top: '30%' }, { text: '12 photos', left: '78%', top: '72%', tone: INK }]}><PickScreen /></Phone></div>
        </div>
      </div>
    </section>
  )
}

/* ── Knows you ───────────────────────────────────────────────────────────── */

/** The Today card's taste question and "What Kween knows about you" (app/settings/taste.tsx), at rest. */
function TasteScreen() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#fff' }}>
      <div className="px-4 pt-[13%]" style={{ fontSize: 16, fontWeight: 700, color: '#0A0A0A' }}>What Kween knows about you</div>
      <div className="mx-3 mt-3 p-3.5" style={{ borderRadius: 20, background: SOFT }}>
        <div className="flex items-center justify-between" style={{ fontSize: 11.5, color: 'rgba(10,10,10,0.6)' }}><span>Quick question</span><span style={{ color: 'rgba(10,10,10,0.4)' }}>Not now</span></div>
        <div className="mt-2 flex items-center gap-3">
          <span style={{ width: 40, height: 40, borderRadius: 999, background: '#1F2A44', flexShrink: 0 }} />
          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0A0A0A', lineHeight: 1.3 }}>You reach for navy a lot. Is it your colour?<div style={{ fontSize: 11.5, fontWeight: 400, color: 'rgba(10,10,10,0.6)' }}>33% of what you wear</div></div>
        </div>
        <div className="mt-3 flex gap-2">
          <span className="flex flex-1 items-center justify-center gap-1" style={{ height: 34, borderRadius: 999, background: '#0A0A0A', color: '#fff', fontSize: 12, fontWeight: 600 }}><Glyph k="heart" color="#fff" size={12} />Yes, love it</span>
          <span className="flex flex-1 items-center justify-center" style={{ height: 34, borderRadius: 999, background: FILL, fontSize: 12, fontWeight: 600, color: '#0A0A0A' }}>Not really</span>
        </div>
      </div>
      <div className="mx-3 mt-3 overflow-hidden" style={{ borderRadius: 20, border: '1px solid rgba(10,10,10,0.07)' }}>
        {[
          { sw: '#FFFFFF', name: 'White', tag: 'You said so', on: true },
          { sw: '#C9A43A', name: 'Mustard', tag: 'Pretty sure' },
          { sw: '#6B6B2A', name: 'Olive', tag: 'A guess' },
        ].map((c, i) => (
          <div key={c.name} className="flex items-center gap-3 px-3 py-2.5" style={{ borderTop: i ? '1px solid rgba(10,10,10,0.06)' : 'none' }}>
            <span style={{ width: 24, height: 24, borderRadius: 999, background: c.sw, border: '1px solid rgba(10,10,10,0.12)' }} />
            <span className="flex-1" style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A' }}>{c.name}</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, borderRadius: 999, padding: '3px 8px', background: c.on ? '#E6F4EA' : FILL, color: c.on ? '#2E7D4F' : 'rgba(10,10,10,0.6)' }}>{c.tag}</span>
          </div>
        ))}
      </div>
      <div className="mx-3 mt-3 flex items-center gap-3 p-3" style={{ borderRadius: 20, border: '1px solid rgba(10,10,10,0.07)' }}>
        <div className="flex items-center gap-1">
          <div style={{ width: 38, height: 46, borderRadius: 10, background: SOFT }}><Cut id="kurti" /></div>
          <span style={{ fontSize: 11, color: 'rgba(10,10,10,0.4)' }}>+</span>
          <div style={{ width: 38, height: 46, borderRadius: 10, background: SOFT }}><Cut id="jeans" /></div>
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#0A0A0A', lineHeight: 1.3 }}>Go-to combo<div style={{ fontWeight: 400, color: 'rgba(10,10,10,0.6)' }}>Together 8×</div></div>
      </div>
      <TabBar active="me" />
    </div>
  )
}

export function KnowsYou() {
  return (
    <section id="knows" className="cv-auto relative scroll-mt-20 overflow-hidden px-4 py-20 md:px-6 md:py-28" style={{ containIntrinsicSize: 'auto 1700px', background: '#FAFAFB' }}>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(45% 40% at 90% 15%, rgba(123,108,246,0.10), transparent 60%)' }} />
      <div className="relative mx-auto max-w-6xl">
        <Heading eyebrow="She gets to know you" title={<>The longer you use it, the more it’s <span style={{ color: '#7B6CF6' }}>yours</span>.</>}
          body="Kween learns from what you wear, how it felt and what you save. Then she checks with you, one tap at a time, and remembers the answer." />
        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
          <div className="flex flex-col items-center lg:items-start">
            <Phone chips={[{ text: 'Learned, then asked', left: '-24%', top: '18%', tone: '#7B6CF6' }]}><TasteScreen /></Phone>
            <KweenPerch name="knows" line="Navy again? Classic you." mood="smug" className="mt-6 self-start md:mt-8" width="clamp(64px, 8vw, 110px)" />
          </div>
          <Rows rows={[
            { k: 'heart', tone: '#7B6CF6', title: 'Your taste', body: 'Favourite colours, go-to pieces and the combos you keep coming back to, learned from what you actually wear. Never from a quiz.' },
            { k: 'shirt', tone: TANG, title: 'Your fit and style', body: 'One quick question a day, never more: how tops should fit, colours you love or avoid, what you usually spend on a piece.' },
            { k: 'calendar', tone: '#2E8FA3', title: 'Your week', body: 'Your routine and dress code by day, your city’s weather and the festivals you follow. A minute to set up, then she just knows.' },
            { k: 'lock', tone: '#4F9D6B', title: 'You’re in charge', body: 'See everything she has learned, tap yes or not really, or wipe it all. Only you see it, and it is never used for ads.' },
            { k: 'chat', tone: '#3C6DD9', title: 'Her own voice', body: 'Playful, sassy, caring. She answers in text or out loud, in English or Hindi, and remembers the conversation.' },
            { k: 'camera', tone: TANG, title: 'Colours that suit you', body: 'One selfie in daylight: the shades that flatter you and the few to skip, used in every pick. The photo isn’t kept.' },
          ]} />
        </div>
      </div>
    </section>
  )
}

/* ── Plans and reminders ─────────────────────────────────────────────────── */

const PUSHES = [
  { t: '📅 Interview tomorrow: your outfit is ready', b: 'White shirt + navy trousers. A quick iron for the white shirt tonight?', when: '9:00 pm' },
  { t: '📅 Riya’s sangeet on Saturday', b: 'Want your outfit picked now?', when: 'Wed' },
  { t: '🌙 Tomorrow: smart casual, 31°', b: 'Olive kurti + wide-leg jeans. Plan it now and skip the morning rush.', when: 'Mon' },
  { t: '📅 Team offsite tomorrow: your outfit is ready', b: 'Heads up: your denim jacket is in the laundry. Sort it tonight or swap it.', when: 'Thu' },
]

export function Plans() {
  const reduce = useReducedMotion()
  return (
    <section id="plans" className="cv-auto relative scroll-mt-20 overflow-hidden px-4 py-20 md:px-6 md:py-28" style={{ containIntrinsicSize: 'auto 1500px' }}>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(45% 40% at 10% 20%, rgba(46,143,163,0.10), transparent 60%)' }} />
      <div className="relative mx-auto max-w-6xl">
        <Heading eyebrow="Plans and reminders" title={<>Interview tomorrow? <span style={{ color: '#2E8FA3' }}>Already sorted.</span></>}
          body="Add what’s coming up, or connect your phone’s calendar. She plans the outfit days ahead and tells you the night before what still needs doing." />
        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
          <motion.div className="flex flex-col gap-3" variants={list} initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.3 }}>
            {PUSHES.map((p, i) => (
              <motion.div key={p.t} variants={item} className="glass flex gap-3 p-4" style={{ borderRadius: 22, marginLeft: i % 2 ? 24 : 0 }}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center" style={{ borderRadius: 10, background: '#0A0A0A' }}><Glyph k="sparkle" color="#fff" size={16} /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2"><span style={{ fontSize: 12, fontWeight: 700, color: MUTED, letterSpacing: '0.04em' }}>FLUNTR</span><span style={{ fontSize: 11.5, color: MUTED }}>{p.when}</span></div>
                  <div className="mt-0.5" style={{ fontSize: 14.5, fontWeight: 700, color: INK, lineHeight: 1.3 }}>{p.t}</div>
                  <div className="mt-0.5" style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.4 }}>{p.b}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <Rows cols="md:grid-cols-1 xl:grid-cols-2" rows={[
            { k: 'calendar', tone: '#2E8FA3', title: 'Your calendar', body: 'Interviews, meetings, parties, dates and weddings. Add them yourself or connect your phone’s calendar, and the outfit is planned ahead.' },
            { k: 'bell', tone: TANG, title: 'The night before', body: 'Your outfit is ready, the shirt is still in the laundry, the kurta could use a quick iron. One reminder, never a pile of them.' },
            { k: 'sparkle', tone: '#7B6CF6', title: 'Festivals', body: 'Diwali, Eid, Navratri, Onam, Christmas and more, only the ones you follow, with festive picks from your own closet.' },
            { k: 'albums', tone: '#4F9D6B', title: 'Trips', body: 'A packing list for the weather where you are going, built from what you own.' },
          ]} />
        </div>
      </div>
    </section>
  )
}

/* ── Your closet in numbers ──────────────────────────────────────────────── */

const STATS = [
  { n: '38%', l: 'of your closet worn in the last 90 days', k: 'stats', tone: '#3C6DD9' },
  { n: '₹42', l: 'per wear for your white sneakers, and climbing down', k: 'tag', tone: '#4F9D6B' },
  { n: '14', l: 'pieces not out in 60 days, and why: fit, style or occasion', k: 'clock', tone: TANG },
  { n: '4', l: 'in the wash, so she won’t suggest them till they’re clean', k: 'water', tone: '#2E8FA3' },
  { n: '1 gap', l: 'worth filling: formal shoes for your three office days', k: 'search', tone: '#7B6CF6' },
  { n: 'Monthly', l: 'report: outfits worn, your favourite piece, what felt great', k: 'sparkle', tone: TANG },
]

export function Insights() {
  const reduce = useReducedMotion()
  return (
    <section id="insights" className="cv-auto relative scroll-mt-20 px-4 py-20 md:px-6 md:py-24" style={{ containIntrinsicSize: 'auto 900px', background: '#FAFAFB' }}>
      <div className="relative mx-auto max-w-6xl">
        <Heading eyebrow="Your closet, in numbers" title={<>Know what you wear. <span style={{ color: '#3C6DD9' }}>And what you don’t.</span></>}
          body="Wear history, cost per wear, the pieces you keep skipping and the gaps worth filling within your budget. An example closet:" />
        <motion.div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" variants={list} initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          {STATS.map(s => (
            <motion.div key={s.l} variants={item} className="glass p-6" style={{ borderRadius: 26 }}>
              <span className="flex h-10 w-10 items-center justify-center" style={{ borderRadius: 12, background: `${s.tone}1f` }}><Glyph k={s.k} color={s.tone} size={18} sw={2} /></span>
              <div className="mt-4" style={{ fontSize: 'clamp(30px,3.4vw,42px)', fontWeight: 800, letterSpacing: '-0.03em', color: INK, lineHeight: 1 }}>{s.n}</div>
              <p className="mt-2 text-[15px] leading-relaxed" style={{ color: MUTED }}>{s.l}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ── Moments ─────────────────────────────────────────────────────────────── */

const MOMENTS = [
  { e: '💼', t: 'Office', b: 'Your dress code by day: sharp on Monday, easy on Friday.' },
  { e: '💍', t: 'Wedding', b: 'Every function planned, haldi to reception, from what you own.' },
  { e: '🪔', t: 'Diwali', b: 'Festive picks days ahead, for the festivals you follow.' },
  { e: '🌹', t: 'First date', b: 'Something that feels like you, picked the night before.' },
  { e: '🥂', t: 'Brunch', b: 'Easy and put-together, right for the weather.' },
  { e: '✈️', t: 'Airport', b: 'Comfortable for the flight, packed for where you land.' },
  { e: '🎤', t: 'Interview', b: 'Sharp and simple, ready the night before, ironing reminder included.' },
  { e: '🤝', t: 'Meeting', b: 'A notch sharper on meeting days, straight from your calendar.' },
  { e: '🎉', t: 'Party', b: 'Something fun you haven’t worn in a while.' },
  { e: '🧳', t: 'Trip', b: 'A packing list for the weather there, from your own closet.' },
  { e: '🛍️', t: 'Shopping day', b: 'What you already own before you buy, and the gaps actually worth filling.' },
  { e: '🍂', t: 'Season change', b: 'Linen when it heats up, layers when it cools, and what sat out last season.' },
]

export function Moments() {
  const reduce = useReducedMotion()
  return (
    <section id="moments" className="cv-auto relative scroll-mt-20 px-4 py-20 md:px-6 md:py-28" style={{ containIntrinsicSize: 'auto 1100px' }}>
      <div className="relative mx-auto max-w-6xl">
        <Heading eyebrow="Every moment" title={<>Dressed for <span style={{ color: TANG }}>whatever’s next.</span></>} />
        <motion.div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4" variants={list} initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.15 }}>
          {MOMENTS.map(m => (
            <motion.div key={m.t} variants={item} className="glass p-5" style={{ borderRadius: 24 }}>
              <div style={{ fontSize: 28, lineHeight: 1 }} aria-hidden>{m.e}</div>
              <h3 className="mt-3" style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', color: INK }}>{m.t}</h3>
              <p className="mt-1.5 text-[14.5px] leading-relaxed" style={{ color: MUTED }}>{m.b}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ── Shopping, only with your yes ────────────────────────────────────────── */

const SHOP = [
  { k: 'lock', t: 'Only when you say yes', b: 'Off until you turn it on. Your closet comes first; she looks outside it only when you ask.' },
  { k: 'search', t: 'The best match, across stores', b: 'One search across Myntra, Amazon, Flipkart, Ajio and brand stores, ranked by your budget, the colours that suit you and the brands you already wear.' },
  { k: 'tag', t: 'Buy now or wait', b: 'The store’s discount, prices she has seen before and the next big sale, then a straight answer.' },
  { k: 'clock', t: 'Here in time', b: 'Checks delivery against your event date, so the outfit shows up before the wedding does.' },
  { k: 'shirt', t: 'Complete the look', b: 'Trying a shirt at H&M? Snap it. She tells you if the colour suits you, what in your closet goes with it, and H&M pieces online that match.' },
  { k: 'globe', t: 'Stores nearby', b: 'Ask, and she shows that brand’s stores near you: “1.2 km away”. She knows where stores are, not what’s on their shelves.' },
  { k: 'camera', t: 'See it before you buy', b: 'See a piece next to your own clothes, or an AI picture of you wearing it. Nothing is kept.' },
]

export function Shopping() {
  const reduce = useReducedMotion()
  return (
    <section id="shop" className="cv-auto relative scroll-mt-20 overflow-hidden px-4 py-20 md:px-6 md:py-28" style={{ containIntrinsicSize: 'auto 1100px' }}>
      <div className="relative mx-auto max-w-6xl">
        <div className="relative overflow-hidden px-6 py-12 md:px-12 md:py-16" style={{ borderRadius: 40, background: '#121317' }}>
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(50% 60% at 85% 10%, rgba(242,140,56,0.25), transparent 65%)' }} />
          <div className="relative max-w-3xl">
            <p className="text-eyebrow mb-5" style={{ color: TANG }}>Shopping<span className="ml-3 inline-block align-middle" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderRadius: 999, padding: '3px 10px', fontSize: 11, letterSpacing: '0.08em' }}>OFF UNTIL YOU TURN IT ON</span></p>
            <h2 className="h-display" style={{ fontSize: 'clamp(34px,4.6vw,64px)', color: '#fff' }}>Shopping, <span style={{ color: TANG }}>only when you say yes.</span></h2>
            <p className="mt-6 max-w-2xl text-[18px] leading-relaxed md:text-[20px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Kween wants you to wear what you own. When your closet can’t do the job and you ask, she looks further, for you, not for a store.
            </p>
          </div>
          <motion.ul className="relative mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3" variants={list} initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.15 }}>
            {SHOP.map(s => (
              <motion.li key={s.t} variants={item} className="flex gap-4 p-5" style={{ borderRadius: 24, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center" style={{ borderRadius: 12, background: 'rgba(242,140,56,0.16)' }}><Glyph k={s.k} color={TANG} size={18} sw={2} /></span>
                <div>
                  <h3 style={{ fontSize: 16.5, fontWeight: 700, color: '#fff' }}>{s.t}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.62)' }}>{s.b}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
          <p className="relative mt-8 text-[14px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Prices are what stores list and can change. Fluntr doesn’t sell anything: links open the store.</p>
        </div>
      </div>
    </section>
  )
}
