import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import WaitlistForm from '../components/WaitlistForm'
import Reveal from '../components/motion/Reveal'
import Demo from '../components/motion/Demo'
import Explainer from '../components/motion/Explainer'
import Ticker from '../components/motion/Ticker'
import Stylist from '../components/motion/Stylist'
import Why from '../components/motion/Why'
import Colours from '../components/motion/Colours'
import Week from '../components/motion/Week'
import Shop from '../components/motion/Shop'
import Trust from '../components/motion/Trust'
import Features from '../components/motion/Features'
import Conversations from '../components/motion/Conversations'
import Cursors from '../components/motion/Cursors'
import Blobs from '../components/motion/Blobs'
import Typed from '../components/motion/Typed'
import KweenRoamer, { KweenPerch } from '../components/motion/KweenRoamer'
import { Suspense, useEffect } from 'react'
import { Mark } from '../components/Logo'
import { track } from '../lib/analytics'

/*
 * Fluntr homepage.
 *
 * Shape borrowed from the site the brief pointed at: a bold headline with the
 * key words lifted into coloured pills, the product itself in a big stage card
 * straight underneath, other people drifting across the page, a mascot sitting
 * on the frame, a ticker, big alternating feature cards, and a wall of chat
 * bubbles. Fluntr's own version of each, in the app's palette plus a handful
 * of closet colours, with sound on everything you press.
 */

const INK = '#121317'
const MUTED = '#6B7080'

// What Fluntr is, for machines: the app, the company, and the site. Only facts
// that are true today; no ratings, no prices, no download counts.
const LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization', '@id': 'https://www.fluntr.com/#org', name: 'Fluntr', legalName: 'Melchizedek Technologies Private Limited', url: 'https://www.fluntr.com/',
      email: 'support@fluntr.com', areaServed: 'IN', slogan: 'The most personal AI stylist. For everything you wear, buy or plan.',
      logo: 'https://www.fluntr.com/icons/icon-512.png', description: 'Fluntr is one app for everything you wear, buy or plan, with the most personal AI stylist, from India.',
      knowsAbout: ['What to wear', 'Indian wedding guest outfits', 'Festival outfits', 'Colour analysis', 'When to buy clothes', 'Capsule wardrobes', 'Closet organisation', 'Personal styling'],
    },
    {
      '@type': 'WebSite', '@id': 'https://www.fluntr.com/#site', url: 'https://www.fluntr.com/', name: 'Fluntr', inLanguage: 'en-IN', publisher: { '@id': 'https://www.fluntr.com/#org' },
    },
    {
      '@type': 'SoftwareApplication', '@id': 'https://www.fluntr.com/#app', name: 'Fluntr', applicationCategory: 'LifestyleApplication', operatingSystem: 'iOS, Android',
      url: 'https://www.fluntr.com/', author: { '@id': 'https://www.fluntr.com/#org' },
      description: 'Fluntr is one app for everything you wear, buy or plan. Photograph the clothes you own and Fluntr turns them into a closet you can see and search on your phone. Kween, the most personal AI stylist, learns your clothes, the colours that suit your skin, your calendar, your city’s weather, your fit and your budget. She picks your outfit every morning from your own clothes, plans and reminds you before interviews, parties, weddings, festivals and trips, and does fit checks from a mirror selfie. When something is missing, and only if you say yes, she shops with you: what goes with the piece you are trying on, a store near you that has it in your size, whether to buy now or wait for a sale, and whether it will arrive before your date. Try it without wearing it. Post looks and ask friends which to wear.',
      featureList: ['Digital wardrobe from photos', 'Background removed on the device', 'Automatic category, colour and occasion', 'Personal AI stylist that picks an outfit every morning', 'Your colours from one selfie', 'Calendar and reminders for every plan', 'Outfits planned for interviews, parties, weddings, festivals and trips', 'Fit check from a mirror selfie', 'Shopping only with your permission', 'Complete the look from the store you are in', 'Find it in your size at a store near you', 'Buy now or wait: current offers and upcoming sales', 'Delivery checked against your event date', 'Try it without wearing it', 'Wear history, laundry and wardrobe insights', 'Post looks and ask friends', 'English and Hindi'],
      keywords: 'personal AI stylist, AI stylist app, digital wardrobe app, what to wear today, outfit planner, outfit reminder app, colour analysis app, which colours suit me, when to buy clothes India, buy now or wait for sale, virtual try on, shopping assistant app, fit check app, virtual closet, wardrobe app India, OOTD, what to wear to a wedding',
    },
  ],
}

// ── 1. HERO ─────────────────────────────── headline, then the product ──
function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-32 md:px-6 md:pt-36">
      <Blobs />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <Cursors />
        <div className="hero-in">
          {/* One line carries the page, the other two frame it: a big heavy
              statement with its key word in the wordmark's serif, between two
              quiet lines. One accent colour, and the Fluntr sparkle as the full stop. */}
          <h1 className="hero-title mx-auto">
            <span className="hero-frame">Your clothes. Your colours. Your plans.</span>{' '}
            <span className="hero-main">The most <em className="hero-accent">personal</em>{' '}<br className="hidden md:inline" />AI&nbsp;stylist<span className="hero-stop"><Mark size="0.34em" color="var(--tang)" /></span></span>{' '}
            <span className="hero-frame">For everything you wear, buy or plan.</span>
          </h1>
        </div>
        <div className="hero-in" style={{ animationDelay: '0.12s' }}>
          <p className="mx-auto mt-8 max-w-2xl text-[18px] leading-relaxed md:text-[21px]" style={{ color: MUTED }}>
            <strong style={{ color: INK, fontWeight: 600 }}>Fluntr is one app for everything you wear.</strong> Kween, your AI stylist, knows your clothes, your colours and your plans. She picks your outfit every day and, when something is missing, shops with you.
            {/* on a line of its own, so the changing word never wraps away from "Dressed for" */}
            <span className="mt-1 block">Dressed for <Typed words={['weddings', 'interviews', 'the office', 'Diwali', 'a first date', 'parties', 'the airport']} style={{ color: INK, fontWeight: 600 }} /></span>
          </p>
        </div>
        <div className="hero-in" style={{ animationDelay: '0.28s' }}>
          <div className="relative mt-9 md:mt-14">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="#waitlist" className="btn-primary">Join the waitlist <span aria-hidden>→</span></a>
              <a href="#what" className="btn-glass glass"><span aria-hidden style={{ fontSize: 11 }}>▶</span> What is Fluntr? 30 sec</a>
            </div>
            {/* she stands just right of the buttons when you arrive, and greets you.
                Placed outside the row so the buttons stay centred under the headline. */}
            <KweenPerch name="hero" bubble="right" className="absolute hidden min-[1100px]:block" style={{ left: 'calc(50% + 248px)', bottom: -24 }} width="clamp(84px, 7.5vw, 104px)" />
            {/* on phones and tablets, below the buttons, where she covers nothing:
                beside them there is no room for her bubble until about 1100px */}
            <KweenPerch name="hero" className="mt-6 min-[1100px]:hidden" style={{ marginLeft: 4 }} width="64px" />
          </div>
        </div>
      </div>

      {/* what it is, in five short bites, before anything else */}
      <div className="relative z-10 mt-16 md:mt-24">
        <Explainer />
      </div>
    </section>
  )
}

// ── TRY IT ─────────────────────── the demo, once the story has been told ──
function TryIt() {
  return (
    <section className="relative px-4 py-12 md:px-6 md:py-20">
      <Demo />
    </section>
  )
}

// ── 5. WAITLIST ─────────────────────────────────── glass panel + Kween ──
function Waitlist() {
  return (
    <section id="waitlist" className="cv-auto relative overflow-hidden px-6 py-28 md:py-36" style={{ containIntrinsicSize: 'auto 900px' }}>
      <Blobs tones={['#FFE3CC', '#EEEBFF', '#E4F3F6']} opacity={0.8} />
      <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-20">
        <div className="relative hidden lg:flex lg:justify-center">
          <KweenPerch name="waitlist" line="Go on. I’ll keep your spot." mood="happy" width="min(26vw, 240px)" />
        </div>
        <div className="lg:hidden">
          <KweenPerch name="waitlist" line="Go on. I’ll keep your spot." mood="happy" width="64px" className="-mb-6 ml-2" />
        </div>
        <Reveal>
          <div className="glass px-7 py-10 md:px-12 md:py-14" style={{ borderRadius: 32 }}>
            <h2 className="h-display" style={{ fontSize: 'clamp(38px,5vw,64px)', color: INK }}>Get in early.</h2>
            <p className="mb-8 mt-4 text-[16px]" style={{ color: MUTED }}>Leave your number and we will tell you the day it opens.</p>
            <WaitlistForm />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function FloatingBadge() {
  return (
    <a
      href="#waitlist"
      className="glass fixed bottom-5 right-5 z-40 hidden items-center gap-3 no-underline md:flex"
      style={{ borderRadius: 999, padding: '8px 14px 8px 8px', color: INK, fontSize: 13, fontWeight: 600 }}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: '#F28C38' }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: '#fff', display: 'inline-block', boxShadow: '0 0 0 4px rgba(255,255,255,0.35)' }} />
      </span>
      <span>
        <span style={{ display: 'block', fontSize: 10, letterSpacing: '0.12em', color: MUTED, fontWeight: 700 }}>LAUNCHING SOON</span>
        Join the waitlist →
      </span>
    </a>
  )
}

const SECTIONS = ['what', 'why', 'stylist', 'colours', 'week', 'shop', 'how', 'app', 'features', 'trust', 'waitlist']

export default function Home() {
  // How far down people get: one event per section, the first time it is seen.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const seen = new Set()
    const io = new IntersectionObserver(es => es.forEach(e => {
      const id = e.target.id
      if (e.isIntersecting && !seen.has(id)) { seen.add(id); track('section_viewed', { section: id }) }
    }), { threshold: 0.35 })
    SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])
  return (
    <>
      <Head>
        <title>Fluntr - The most personal AI stylist for everything you wear</title>
        <meta name="description" content="Fluntr is one app for everything you wear, buy or plan. Kween, the most personal AI stylist, knows your clothes, your colours and your plans: she picks your outfit every morning, gets you ready for every event, and when something is missing, shops with you at the best price, in time, or in a store near you." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.fluntr.com/" />
        <meta property="og:title" content="Fluntr - The most personal AI stylist for everything you wear" />
        <meta property="og:description" content="Kween knows your clothes, your colours and your plans. She picks your outfit every day and, when something is missing, shops with you." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.fluntr.com/" />
        <meta property="og:image" content="https://www.fluntr.com/og/default.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      </Head>

      <Nav />
      <main>
        {/* the story: what it is, why it exists, who she is, what she does, then try it */}
        <Hero />
        {/* Each section below the first screen is its own Suspense boundary, so
            React hydrates them one at a time and the phone stays responsive
            while the page wakes up, instead of one long block of work. */}
        <Suspense fallback={null}><Why /></Suspense>
        <Suspense fallback={null}><Stylist /></Suspense>
        <Suspense fallback={null}><Colours /></Suspense>
        <Suspense fallback={null}><Week /></Suspense>
        <Suspense fallback={null}><Shop /></Suspense>
        <Suspense fallback={null}><TryIt /></Suspense>
        <Suspense fallback={null}><Ticker /></Suspense>
        <Suspense fallback={null}><Features /></Suspense>
        <Suspense fallback={null}><Conversations /></Suspense>
        <Suspense fallback={null}><Trust /></Suspense>
        <Suspense fallback={null}><Waitlist /></Suspense>
      </main>
      <Footer />
      <FloatingBadge />
      <KweenRoamer />
    </>
  )
}
