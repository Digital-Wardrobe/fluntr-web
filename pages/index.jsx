import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import WaitlistForm from '../components/WaitlistForm'
import Reveal from '../components/motion/Reveal'
import Demo, { Glyph } from '../components/motion/Demo'
import Ticker from '../components/motion/Ticker'
import Features from '../components/motion/Features'
import Conversations from '../components/motion/Conversations'
import Cursors from '../components/motion/Cursors'
import Blobs from '../components/motion/Blobs'
import Typed from '../components/motion/Typed'
import KweenRoamer, { KweenPerch } from '../components/motion/KweenRoamer'

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
      '@type': 'Organization', '@id': 'https://fluntr.com/#org', name: 'Fluntr', legalName: 'Melchizedek Technologies Private Limited', url: 'https://fluntr.com/',
      email: 'support@fluntr.com', areaServed: 'IN', description: 'Fluntr is a digital wardrobe and style app from India.',
    },
    {
      '@type': 'WebSite', '@id': 'https://fluntr.com/#site', url: 'https://fluntr.com/', name: 'Fluntr', publisher: { '@id': 'https://fluntr.com/#org' },
    },
    {
      '@type': 'SoftwareApplication', '@id': 'https://fluntr.com/#app', name: 'Fluntr', applicationCategory: 'LifestyleApplication', operatingSystem: 'iOS, Android',
      url: 'https://fluntr.com/', author: { '@id': 'https://fluntr.com/#org' },
      description: 'Photograph the clothes you own and Fluntr turns them into a closet you can see and search on your phone, plans outfits from it, and lets you post looks and ask friends which to wear. Kween, the in-app stylist, suggests outfits from your own clothes.',
      featureList: ['Digital wardrobe from photos', 'Background removed on the device', 'Automatic category, colour and occasion', 'Outfit planning from your own closet', 'Post looks and ask friends', 'Kween, an in-app stylist'],
      keywords: 'digital wardrobe app, closet organiser app, outfit planner, AI stylist, what to wear today, virtual closet, wardrobe app India, OOTD, fit check, capsule wardrobe',
    },
  ],
}

function PillWord({ tone, soft, icon, children }) {
  return (
    <span className="pill-word" style={{ '--pill-bg': soft, '--pill-fg': tone }}>
      <Glyph k={icon} color={tone} size="1em" />
      {children}
    </span>
  )
}

// ── 1. HERO ─────────────────────────────── headline, then the product ──
function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-32 md:px-6 md:pt-40">
      <Blobs />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <Cursors />
        <Reveal from="none">
          <p className="text-eyebrow mb-7">Your closet, on your phone</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="h-display mx-auto" style={{ fontSize: 'clamp(38px,6vw,82px)', color: INK, textWrap: 'pretty' }}>
            Your <PillWord tone="#2E8FA3" soft="#E4F3F6" icon="closet">closet</PillWord>{' '}
            <span style={{ color: '#9AA0A6' }}>on your phone.</span>
            <br className="hidden md:block" />{' '}
            Outfits in <PillWord tone="#F28C38" soft="#FFF0E3" icon="sparkle">seconds</PillWord>
            <span style={{ color: '#9AA0A6' }}>, not twenty</span>
            <br className="hidden md:block" />{' '}
            <span style={{ color: '#9AA0A6' }}>minutes at the</span>{' '}
            <PillWord tone="#7B6CF6" soft="#EEEBFF" icon="camera">mirror</PillWord>
            <span style={{ color: '#9AA0A6' }}>.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.3} blur>
          <p className="mx-auto mt-8 max-w-2xl text-[18px] leading-relaxed md:text-[21px]" style={{ color: MUTED }}>
            Photograph each piece once. Kween sorts it, keeps it, and tells you what goes with what.
            Dressed for <Typed words={['weddings', 'the office', 'Diwali', 'a first date', 'brunch', 'the airport']} style={{ color: INK, fontWeight: 600 }} />
          </p>
        </Reveal>
        <Reveal delay={0.42}>
          <div className="mt-9 flex flex-wrap items-end justify-center gap-3">
            <a href="#waitlist" className="btn-primary">Join the waitlist <span aria-hidden>→</span></a>
            <a href="#how" className="btn-glass glass">Try the demo <span aria-hidden>↓</span></a>
            {/* she stands beside the buttons when you arrive, and greets you */}
            <KweenPerch name="hero" className="ml-3 hidden md:block" width="clamp(84px, 7.5vw, 104px)" />
          </div>
        </Reveal>
      </div>

      <div className="relative z-10 mt-20 md:mt-24">
        <Demo />
      </div>
    </section>
  )
}

// ── 5. WAITLIST ─────────────────────────────────── glass panel + Kween ──
function Waitlist() {
  return (
    <section id="waitlist" className="relative overflow-hidden px-6 py-28 md:py-36">
      <Blobs tones={['#FFE3CC', '#EEEBFF', '#E4F3F6']} opacity={0.8} />
      <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-20">
        <div className="relative hidden lg:flex lg:justify-center">
          <KweenPerch name="waitlist" line="Go on. I’ll keep your spot." mood="happy" width="min(26vw, 240px)" />
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

export default function Home() {
  return (
    <>
      <Head>
        <title>Fluntr - Your closet on your phone, outfits in seconds</title>
        <meta name="description" content="Photograph each piece once. Kween sorts it, keeps it, and tells you what goes with what. Your whole closet on your phone, and outfits in seconds instead of twenty minutes at the mirror." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://fluntr.com/" />
        <meta property="og:title" content="Fluntr - Your closet on your phone, outfits in seconds" />
        <meta property="og:description" content="Photograph each piece once. Kween sorts it, keeps it, and tells you what goes with what." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fluntr.com/" />
        <meta property="og:image" content="https://fluntr.com/og/default.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      </Head>

      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Features />
        <Conversations />
        <Waitlist />
      </main>
      <Footer />
      <FloatingBadge />
      <KweenRoamer />
    </>
  )
}
