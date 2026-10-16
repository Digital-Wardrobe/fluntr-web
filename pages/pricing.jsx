import Head from 'next/head'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { PLANS, PERIOD_DAYS, PERIOD_MONTHS, fromApi } from '../content/plans'
import { track } from '../lib/analytics'
import KweenRoamer, { KweenPerch } from '../components/motion/KweenRoamer'
import Friends from '../components/motion/Friends'

/*
 * Pricing. The point of the page: what you pay is tiny next to what you get
 * back. Every price is shown per day first (the number people compare with a
 * chai), then what it gives back in time, money and mornings without a fight.
 * Prices and limits come from the API at build time (same numbers the app
 * enforces), with content/plans.js as the fallback. Kween and the Planner lead.
 */

const INK = '#121317'
const MUTED = '#6B7080'
const ease = [0.16, 1, 0.3, 1]
const PERIODS = [['MONTHLY', 'Monthly'], ['QUARTERLY', '3 months'], ['HALF_YEARLY', '6 months'], ['ANNUAL', 'Yearly']]
const PERIOD_WORD = { MONTHLY: 'a month', QUARTERLY: 'every 3 months', HALF_YEARLY: 'every 6 months', ANNUAL: 'a year' }

const inr = n => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 1 })}`
const perDay = (p, period) => Math.round((p.prices[period].inr / PERIOD_DAYS[period]) * 10) / 10
const perMonth = (p, period) => Math.round(p.prices[period].inr / PERIOD_MONTHS[period])
const save = (p, period) => {
  if (!p.prices?.[period] || period === 'MONTHLY') return 0
  const m = p.prices.MONTHLY.inr * PERIOD_MONTHS[period]
  return Math.max(0, Math.round(((m - p.prices[period].inr) / m) * 100))
}
const proDay = pro => (pro?.prices?.ANNUAL ? perDay(pro, 'ANNUAL') : 2.7)

// Kween and the Planner first: they're what people pay for
const ROWS = [
  ['kween', 'Ask Kween anything', 'limit', 'Your stylist, for anything outfits, occasions and shopping'],
  ['reroll', '“Show me another” outfit', 'limit', 'Kween’s daily pick, and another, and another'],
  ['plannerDays', 'Plan outfits ahead', 'setting', 'Your week, a trip, the wedding: planned around your events and the weather'],
  ['fitcheck', 'Fit checks', 'limit', 'A mirror selfie, an honest score, one change to make'],
  ['scan', 'Smart Scans', 'limit', 'One outfit photo, every piece found, cropped and tagged'],
  ['pieces', 'New pieces, one by one', 'limit', 'A photo of one piece, background removed', 'piecesDaily'],
  ['items', 'Wardrobe size', 'limit'],
  ['collections', 'Collections', 'limit'],
  ['beautify', 'Studio shots', 'limit', 'Your piece as a clean product photo'],
  ['beautifyPro', 'Beautify Pro', 'limit', 'Our best image model, for the pieces you love most'],
  ['tryon', 'Virtual try-ons', 'limit', 'See a piece on you before you wear it'],
  ['historyDays', 'Outfit history (what you wore, where)', 'setting'],
]
const PER = { day: 'a day', week: 'a week', month: 'a month', life: 'to try', total: '' }
const cell = (p, [key, , kind, , daily]) => {
  if (kind === 'setting') {
    const v = p.settings[key]
    return v === null || v === undefined ? 'Forever' : `${v} days`
  }
  const l = p.limits[key]
  if (!l) return '—'
  if (l.value === null || l.value === undefined) return 'Unlimited'
  if (l.value === 0) return '—'
  let text = `${Number(l.value).toLocaleString('en-IN')} ${PER[l.window] || ''}`.trim()
  const d = daily ? p.limits[daily]?.value : null
  if (d && l.window !== 'day') text += ` · ${d} a day`
  if (l.bonus) text += ` +${l.bonus} to start`
  return text
}

// What Pro a day sits next to (everyday Indian prices, rounded)
const scaleOf = day => [
  ['Fluntr Pro, a day', day, true],
  ['Cutting chai', 10],
  ['Metro ride', 30],
  ['Cold coffee', 120],
  ['A burger', 180],
]

const backOf = (day, proMonth) => [
  ['91 hours', 'back every year', '15 minutes saved each morning, deciding in seconds instead of standing at the wardrobe. That works out to about ₹10 an hour for your mornings.'],
  ['₹1,200', 'one skipped impulse buy', `You see everything you own, so you stop buying the black top you already have twice. One skipped buy pays for ${Math.floor(1200 / proMonth)} months of Pro.`],
  ['1 less', '“what should I wear?” fight', `With your partner before dinner, your mum before the wedding, your roommate at 8:55 before class. Priceless. Also ${inr(day)}.`],
  ['1 lehenga', 'three weddings', 'Fluntr remembers who saw it where and restyles it, so the outfit you already own feels new. Studio for wedding season costs less than one dupatta.'],
]

const FAQ = [
  ['Is Free really free?', 'Yes, forever. Your closet (up to 50 pieces), Kween’s outfit pick every morning, 2 days of planning, the wear log and the social side are free. You pay for more Kween: more questions, more outfit ideas, planning weeks ahead, fit checks, scans and studio shots.'],
  ['Is there a free trial?', 'Yes. Pro starts with 7 days free. Cancel before the trial ends and you pay nothing.'],
  ['What does “unlimited” mean?', 'Fair use: everything one person does in a day, however much they love Kween. It just isn’t for automated use.'],
  ['What happens if I hit a limit?', 'Nothing you added is ever deleted or locked. You just can’t add more of that thing until tomorrow, next week or next month (it says which), or until you upgrade.'],
  ['What’s a Smart Scan?', 'One photo of an outfit, even a mirror selfie, and Fluntr finds every piece in it, crops each one and tags it (type, colour, fabric, occasion). Lots of pieces from one tap. Free starts with 10, then 5 a month.'],
  ['Beautify vs Beautify Pro?', 'Beautify turns your photo into a clean studio shot: 1 a month on Free, 30 on Pro, 150 on Studio. Beautify Pro uses our most detailed image model for the pieces you love most, on Pro and Studio.'],
  ['Can I cancel?', 'Any time, from the Play Store. Your plan runs to the end of what you paid for, then you’re back on Free with everything still there.'],
  ['Do you train AI on my photos?', 'No. Your photos are used to run your closet, not to train models. Try-on photos of you are deleted as soon as the picture is made.'],
  ['How do I pay?', 'Through Google Play (UPI, cards, wallets) when the app launches. Prices include GST.'],
]

export async function getStaticProps() {
  const api = process.env.FLUNTR_API_URL || 'https://api.fluntr.com'
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 4000)
    const res = await fetch(`${api}/api/billing/plans`, { signal: ctrl.signal })
    clearTimeout(timer)
    if (res.ok) {
      const data = await res.json()
      // Only trust a catalogue with the final pricing (6-month plans); an older API falls back to the bundled copy
      if (Array.isArray(data?.plans) && data.plans.some(p => p.prices?.HALF_YEARLY)) return { props: { plans: fromApi(data.plans) }, revalidate: 3600 }
    }
  } catch { /* fall back to the bundled copy */ }
  return { props: { plans: PLANS }, revalidate: 3600 }
}

function Rise({ children, delay = 0, className = '', style }) {
  const reduce = useReducedMotion()
  return (
    <motion.div className={className} style={style}
      initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease, delay }}>
      {children}
    </motion.div>
  )
}

function PlanCard({ p, period, onPick }) {
  const dark = p.recommended
  const price = p.prices
  const s = save(p, period)
  const fg = dark ? '#fff' : INK
  const sub = dark ? 'rgba(255,255,255,0.66)' : MUTED
  const row = key => ROWS.find(r => r[0] === key)
  const n = key => cell(p, row(key))
  const highlights = [
    ['kween', p.limits.kween?.value === null ? 'Ask Kween anything, unlimited' : `Ask Kween ${n('kween')}`],
    ['reroll', p.limits.reroll?.value === null ? 'Unlimited outfit ideas' : `${p.limits.reroll.value} more outfit ideas ${PER[p.limits.reroll.window] || ''}`.trim()],
    ['plannerDays', `Plan ${p.settings.plannerDays} days ahead`],
    ['fitcheck', `Fit checks: ${n('fitcheck')}`],
    ['scan', `Smart Scans: ${n('scan')}`],
    ['beautify', `Studio shots: ${n('beautify')}`],
    ['historyDays', p.settings.historyDays === null ? 'Outfit history forever' : `${p.settings.historyDays} days of outfit history`],
  ]
  return (
    <div className={dark ? '' : 'glass'} style={{
      borderRadius: 28, padding: 26, display: 'flex', flexDirection: 'column', height: '100%',
      background: dark ? INK : undefined, color: fg,
      boxShadow: dark ? '0 30px 60px rgba(18,19,23,0.28)' : undefined,
      transform: dark ? 'translateY(-8px)' : undefined,
    }}>
      <div className="flex items-center justify-between">
        <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: fg }}>{p.name}</h3>
        {dark && <span style={{ fontSize: 12, fontWeight: 700, padding: '5px 10px', borderRadius: 999, background: 'var(--tang)', color: '#fff' }}>Most loved</span>}
      </div>
      <p style={{ margin: '6px 0 0', fontSize: 14, color: sub, minHeight: 40 }}>{p.tagline}</p>

      <div style={{ marginTop: 18 }}>
        {price ? (
          <>
            <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, color: fg }}>
              {inr(perDay(p, period))}<span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em', color: sub }}> a day</span>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 13.5, color: sub }}>
              {inr(price[period].inr)} {PERIOD_WORD[period]}{period !== 'MONTHLY' ? ` · ${inr(perMonth(p, period))} a month` : ''}
              {s > 0 && <span style={{ marginLeft: 8, fontWeight: 700, color: dark ? '#9BE7B5' : 'var(--sage)' }}>Save {s}%</span>}
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, color: fg }}>₹0</div>
            <p style={{ margin: '8px 0 0', fontSize: 13.5, color: sub }}>Free forever</p>
          </>
        )}
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: '22px 0 24px', display: 'grid', gap: 10, flex: 1 }}>
        {highlights.map(([k, text]) => (
          <li key={k} style={{ display: 'flex', gap: 10, fontSize: 14.5, fontWeight: 500, color: fg }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden>
              <path d="M5 12.5l4.2 4.2L19 7" stroke={dark ? 'var(--tang)' : INK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {text}
          </li>
        ))}
      </ul>

      <button onClick={() => onPick(p)} className={dark ? '' : 'btn-primary'} style={dark ? {
        border: 'none', cursor: 'pointer', borderRadius: 999, padding: '16px 24px', fontSize: 15, fontWeight: 700,
        background: '#fff', color: INK, justifyContent: 'center', display: 'flex',
      } : { justifyContent: 'center' }}>
        {p.prices ? (p.trialDays ? `Try ${p.name} free for ${p.trialDays} days` : `Get ${p.name}`) : 'Start free'}
      </button>
    </div>
  )
}

function Slider({ label, value, set, min, max, step, fmt }) {
  return (
    <label style={{ display: 'block' }}>
      <div className="flex justify-between" style={{ fontSize: 14.5, fontWeight: 600, color: INK }}>
        <span>{label}</span><span>{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(Number(e.target.value))}
        style={{ width: '100%', marginTop: 10, accentColor: 'var(--tang)' }} />
    </label>
  )
}

function Calculator({ pro }) {
  const [minutes, setMinutes] = useState(15)
  const [buys, setBuys] = useState(1)
  const [price, setPrice] = useState(1200)
  const hours = Math.round((minutes * 365) / 60)
  const saved = buys * 12 * price
  const proYear = pro?.prices?.ANNUAL?.inr || 999
  const times = Math.max(0, Math.round((saved / proYear) * 10) / 10)
  return (
    <div className="grid gap-8 md:grid-cols-2" style={{ alignItems: 'center' }}>
      <div className="glass" style={{ borderRadius: 28, padding: 28, display: 'grid', gap: 26 }}>
        <Slider label="Minutes you spend deciding each morning" value={minutes} set={setMinutes} min={5} max={40} step={1} fmt={v => `${v} min`} />
        <Slider label="Times a month you buy something you already own" value={buys} set={setBuys} min={0} max={4} step={1} fmt={v => (v === 0 ? 'Never' : `${v}×`)} />
        <Slider label="What that piece usually costs" value={price} set={setPrice} min={300} max={4000} step={100} fmt={v => inr(v)} />
      </div>
      <div>
        <p className="text-eyebrow" style={{ marginBottom: 14 }}>Every year, Fluntr gives you back</p>
        <p style={{ margin: 0, fontSize: 'clamp(44px,6vw,76px)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, color: INK }}>{hours} hours</p>
        <p style={{ margin: '6px 0 0', fontSize: 'clamp(30px,4vw,48px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#B4B8C1' }}>and {inr(saved)}</p>
        <p style={{ marginTop: 22, fontSize: 18, fontWeight: 600, color: INK, maxWidth: 440 }}>
          {saved > 0
            ? <>Pro costs {inr(proYear)} a year. That’s <span className="serif-accent">{times}×</span> back, before counting the mornings.</>
            : <>Pro costs {inr(proYear)} a year: about {inr(proDay(pro))} for every calmer morning.</>}
        </p>
      </div>
    </div>
  )
}

export default function Pricing({ plans }) {
  const [period, setPeriod] = useState('ANNUAL')
  const pro = useMemo(() => plans.find(p => p.plan === 'PRO'), [plans])
  const day = proDay(pro)
  const proMonth = pro?.prices?.ANNUAL ? perMonth(pro, 'ANNUAL') : 83
  const SCALE = scaleOf(day)
  const BACK = backOf(day, proMonth)
  const max = SCALE[SCALE.length - 1][1]
  const maxSave = Math.max(...plans.map(p => save(p, 'ANNUAL')))

  const pick = p => {
    track('pricing_cta', { plan: p.plan, period })
    window.location.href = `/?plan=${p.plan.toLowerCase()}#waitlist`
  }

  const ld = {
    '@context': 'https://schema.org', '@type': 'Product', name: 'Fluntr', brand: { '@type': 'Brand', name: 'Fluntr' },
    description: 'Fluntr is a digital wardrobe and personal AI stylist. Free forever, with Pro and Studio plans for more Kween.',
    offers: plans.filter(p => p.prices).flatMap(p => Object.entries(p.prices).map(([k, v]) => ({
      '@type': 'Offer', name: `Fluntr ${p.name} (${k.toLowerCase()})`, price: v.inr, priceCurrency: 'INR', url: 'https://www.fluntr.com/pricing',
    }))),
  }

  return (
    <>
      <Head>
        <title>Pricing · Fluntr: less than a chai a day</title>
        <meta name="description" content={`Fluntr is free forever. Pro is ${inr(pro?.prices?.ANNUAL?.inr || 999)} a year, about ${inr(day)} a day: less than a cutting chai, for mornings without “I have nothing to wear”.`} />
        <link rel="canonical" href="https://www.fluntr.com/pricing" />
        <meta property="og:title" content="Fluntr pricing: less than a chai a day" />
        <meta property="og:description" content={`Free forever. Pro is about ${inr(day)} a day, with 7 days free. Get back 90 hours a year.`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </Head>
      <Nav />
      <main style={{ background: 'var(--bg)', color: INK }}>
        {/* ── Headline ── */}
        <section className="px-4 pb-10 pt-32 text-center md:px-6 md:pt-40">
          <Rise>
            <p className="text-eyebrow">Pricing</p>
            <h1 className="hero-title mx-auto" style={{ marginTop: 14 }}>
              <span className="hero-main" style={{ fontSize: 'clamp(48px,8vw,104px)' }}>Less than a <em className="hero-accent">chai</em> a day.</span>
              <span className="hero-frame">Start free. Upgrade when your closet does.</span>
            </h1>
          </Rise>
          <Rise delay={0.1} className="mt-10 flex justify-center">
            <div className="glass inline-flex" style={{ borderRadius: 999, padding: 5 }} role="tablist" aria-label="Billing period">
              {PERIODS.map(([k, label]) => (
                <button key={k} role="tab" aria-selected={period === k} onClick={() => setPeriod(k)} className="px-[8px] py-[10px] text-[12.5px] sm:px-[15px] sm:text-[14px]" style={{
                  border: 'none', cursor: 'pointer', borderRadius: 999, fontWeight: 600, whiteSpace: 'nowrap',
                  background: period === k ? INK : 'transparent', color: period === k ? '#fff' : '#3A3D45', transition: 'all 0.3s',
                }}>
                  {label}{k === 'ANNUAL' && maxSave > 0 && <span style={{ marginLeft: 6, color: period === k ? '#9BE7B5' : 'var(--sage)' }}><span className="hidden sm:inline">up to </span>−{maxSave}%</span>}
                </button>
              ))}
            </div>
          </Rise>
        </section>

        {/* ── Plans ── */}
        <section className="px-4 pb-24 md:px-6">
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3" style={{ alignItems: 'stretch' }}>
            {plans.map((p, i) => <Rise key={p.plan} delay={0.06 * i} style={{ height: '100%' }}><PlanCard p={p} period={period} onPick={pick} /></Rise>)}
          </div>
          <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-center sm:text-left">
            <KweenPerch name="pricing" line={`${inr(day)} a day. I cost less than your chai.`} mood="smug" bubble="right" className="shrink-0" width="clamp(64px, 7vw, 92px)" />
            <p className="m-0 max-w-md" style={{ fontSize: 14, color: MUTED }}>
              Prices include GST. Change or cancel any time. Nothing you add is ever deleted or locked if you change plans. “Unlimited” means fair use.
            </p>
          </div>
        </section>

        {/* ── What Pro a day sits next to ── */}
        <section className="px-4 py-20 md:px-6 md:py-28" style={{ background: 'var(--surface)' }}>
          <div className="mx-auto max-w-5xl">
            <Rise>
              <h2 className="h-display" style={{ fontSize: 'clamp(36px,5vw,64px)', margin: 0 }}>
                {inr(day)} a day, next to <span className="serif-accent">everything</span> else.
              </h2>
              <p style={{ marginTop: 14, fontSize: 18, color: MUTED, maxWidth: 620 }}>Pro billed yearly is {inr(day)} a day. Here’s what that is, next to what you already buy without thinking.</p>
            </Rise>
            <div style={{ marginTop: 40, display: 'grid', gap: 14 }}>
              {SCALE.map(([label, amount, ours], i) => (
                <Rise key={label} delay={0.06 * i}>
                  <div className="flex items-center gap-4">
                    <span style={{ width: 150, flexShrink: 0, fontSize: 15, fontWeight: ours ? 800 : 600, color: ours ? INK : '#3A3D45' }}>{label}</span>
                    <div style={{ flex: 1, height: 34, borderRadius: 999, background: 'rgba(18,19,23,0.05)', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${Math.max(3, (amount / max) * 100)}%` }} viewport={{ once: true }} transition={{ duration: 0.9, ease, delay: 0.1 + 0.06 * i }}
                        style={{ height: '100%', borderRadius: 999, background: ours ? 'var(--tang)' : '#C9CDD5' }} />
                    </div>
                    <span style={{ width: 64, textAlign: 'right', fontSize: 15, fontWeight: 800, color: ours ? 'var(--tang)' : INK }}>{inr(amount)}</span>
                  </div>
                </Rise>
              ))}
            </div>
            <Rise delay={0.3}><p style={{ marginTop: 28, fontSize: 17, fontWeight: 600 }}>A whole month of Pro ({inr(proMonth)}) costs less than half a burger.</p></Rise>
          </div>
        </section>

        {/* ── What it gives back ── */}
        <section className="px-4 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Rise>
              <p className="text-eyebrow mb-4">What you get back</p>
              <h2 className="h-display" style={{ fontSize: 'clamp(36px,5vw,64px)', margin: 0, maxWidth: 820 }}>
                The price is small. What it <span className="serif-accent">saves</span> isn’t.
              </h2>
            </Rise>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {BACK.map(([big, label, body], i) => (
                <Rise key={label} delay={0.06 * i}>
                  <div className="glass" style={{ borderRadius: 28, padding: 30, height: '100%' }}>
                    <p style={{ margin: 0, fontSize: 'clamp(40px,5vw,60px)', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1 }}>{big}</p>
                    <p style={{ margin: '6px 0 0', fontSize: 18, fontWeight: 700, color: MUTED }}>{label}</p>
                    <p style={{ margin: '16px 0 0', fontSize: 16, lineHeight: 1.55, color: '#3A3D45' }}>{body}</p>
                  </div>
                </Rise>
              ))}
            </div>
          </div>
        </section>

        {/* ── Your own numbers ── */}
        <section className="px-4 py-20 md:px-6 md:py-28" style={{ background: 'var(--surface)' }}>
          <div className="mx-auto max-w-6xl">
            <Rise>
              <h2 className="h-display" style={{ fontSize: 'clamp(36px,5vw,64px)', margin: '0 0 40px' }}>
                Do your own <span className="serif-accent">maths</span>.
              </h2>
            </Rise>
            <Rise delay={0.1}><Calculator pro={pro} /></Rise>
          </div>
        </section>

        {/* ── Every detail ── */}
        <section className="px-4 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Rise><h2 className="h-display" style={{ fontSize: 'clamp(32px,4vw,52px)', margin: '0 0 32px' }}>Every plan, side by side.</h2></Rise>
            <Rise delay={0.1}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: 640, borderCollapse: 'collapse', fontSize: 15 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '14px 12px', fontSize: 13, color: MUTED, fontWeight: 600 }} />
                      {plans.map(p => (
                        <th key={p.plan} style={{ textAlign: 'center', padding: '14px 12px', fontSize: 17, fontWeight: 800, color: p.recommended ? 'var(--tang)' : INK }}>
                          {p.name}
                          <div style={{ fontSize: 13, fontWeight: 600, color: MUTED, marginTop: 4 }}>{p.prices ? `${inr(perDay(p, period))} a day` : 'Free'}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map(r => (
                      <tr key={r[0]} style={{ borderTop: '1px solid var(--line)' }}>
                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ fontWeight: 600 }}>{r[1]}</div>
                          {r[3] && <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{r[3]}</div>}
                        </td>
                        {plans.map(p => <td key={p.plan} style={{ textAlign: 'center', padding: '14px 12px', fontWeight: 700, color: cell(p, r) === '—' ? '#C0C4CC' : INK }}>{cell(p, r)}</td>)}
                      </tr>
                    ))}
                    {[['Closet, wear log, daily outfit picks, social', 'all'], ['Pro badge on your profile', 'paid']].map(([label, who]) => (
                      <tr key={label} style={{ borderTop: '1px solid var(--line)' }}>
                        <td style={{ padding: '14px 12px', fontWeight: 600 }}>{label}</td>
                        {plans.map(p => <td key={p.plan} style={{ textAlign: 'center', padding: '14px 12px', fontWeight: 700 }}>{who === 'all' || (who === 'paid' && ['PRO', 'STUDIO'].includes(p.plan)) ? '✓' : <span style={{ color: '#C0C4CC' }}>—</span>}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Rise>
          </div>
        </section>

        {/* ── Questions ── */}
        <section className="px-4 pb-24 md:px-6">
          <div className="mx-auto max-w-3xl">
            <Rise><h2 className="h-display" style={{ fontSize: 'clamp(32px,4vw,52px)', margin: '0 0 24px' }}>Questions.</h2></Rise>
            {FAQ.map(([q, a], i) => (
              <Rise key={q} delay={0.04 * i}>
                <details style={{ borderTop: '1px solid var(--line)', padding: '18px 0' }}>
                  <summary style={{ cursor: 'pointer', fontSize: 18, fontWeight: 700, listStyle: 'none' }}>{q}</summary>
                  <p style={{ margin: '10px 0 0', fontSize: 16, lineHeight: 1.6, color: '#3A3D45' }}>{a}</p>
                </details>
              </Rise>
            ))}
          </div>
        </section>

        {/* ── Last word ── */}
        <section className="px-4 pb-28 text-center md:px-6">
          <Rise>
            <h2 className="h-display" style={{ fontSize: 'clamp(40px,6vw,84px)', margin: 0 }}>
              Your mornings are worth <span className="serif-accent">{inr(day)}</span>.
            </h2>
            <div className="mt-10 flex flex-col-reverse items-center gap-5 sm:flex-row sm:items-end sm:justify-center sm:gap-4">
              <Link href="/#waitlist" className="btn-primary" onClick={() => track('pricing_cta', { plan: 'waitlist', period })}>Join the waitlist</Link>
              <KweenPerch name="pricing-end" line="Go on. I’ll keep your spot." mood="love" bubble="left" width="clamp(64px, 7vw, 96px)" />
            </div>
          </Rise>
        </section>
      </main>
      <Footer />
      <KweenRoamer />
      <Friends />
    </>
  )
}
