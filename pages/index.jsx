// Drop this file into: flauntr-web/pages/index.jsx

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Nav from '../components/Nav'
import Sparkle from '../components/Sparkle'
import Marquee from '../components/Marquee'
import PhoneMockup from '../components/PhoneMockup'
import WaitlistForm from '../components/WaitlistForm'
import Footer from '../components/Footer'

// ── Reveal wrapper ──────────────────────────────────────────────────────────
function Reveal({ children, direction = 'up', delay = 0, className = '' }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const hidden = {
    opacity: 0,
    y: direction === 'up' ? 28 : 0,
    x: direction === 'left' ? -28 : direction === 'right' ? 28 : 0,
  }
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hidden}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : hidden}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}

// ── Gold divider ─────────────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="flex items-center gap-5 px-16 max-md:px-6">
      <div className="flex-1" style={{ height: '0.5px', background: 'rgba(201,168,76,0.1)' }} />
      <span style={{ color: 'rgba(201,168,76,0.35)', fontSize: '14px' }}>✦</span>
      <div className="flex-1" style={{ height: '0.5px', background: 'rgba(201,168,76,0.1)' }} />
    </div>
  )
}

// ── Feature row ──────────────────────────────────────────────────────────────
function FeatureRow({ num, tag, title, desc, points, screen, reverse = false }) {
  return (
    <div className={`flex items-center gap-20 max-md:flex-col max-md:gap-10 ${reverse ? 'flex-row-reverse' : ''}`}>
      <Reveal direction={reverse ? 'right' : 'left'} className="flex-1">
        <span
          className="font-cormorant block"
          style={{ fontSize: '72px', fontWeight: 300, color: 'rgba(201,168,76,0.07)', lineHeight: 1, marginBottom: '-16px' }}
        >
          {num}
        </span>
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A84C' }}>{tag}</p>
        <h3
          className="font-cormorant font-normal leading-tight mb-5"
          style={{ fontSize: 'clamp(28px,3vw,44px)', letterSpacing: '-0.3px' }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.58)', letterSpacing: '0.02em' }}>
          {desc}
        </p>
        <ul className="flex flex-col gap-3">
          {points.map((p, i) => (
            <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              <span style={{ color: '#C9A84C', fontSize: '8px', marginTop: '5px', flexShrink: 0 }}>✦</span>
              {p}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal direction={reverse ? 'left' : 'right'} className="flex-1 flex justify-center">
        <PhoneMockup screen={screen} />
      </Reveal>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [waitlistCount, setWaitlistCount] = useState(127)

  return (
    <>
      <Nav />

      {/* ── HERO ── */}
      <section
        className="min-height-screen flex items-center relative overflow-hidden"
        style={{
          minHeight: '100vh',
          padding: '140px 60px 100px',
          backgroundImage:
            'linear-gradient(rgba(201,168,76,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.025) 1px,transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      >
        {/* Glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '50%', left: '35%',
            transform: 'translate(-50%,-50%)',
            width: '700px', height: '700px',
            background: 'radial-gradient(circle,rgba(201,168,76,.05) 0%,transparent 65%)',
          }}
        />

        <div className="flex items-center justify-between w-full max-w-7xl mx-auto gap-16 max-md:flex-col relative z-10">

          {/* Left copy */}
          <div className="flex-1 max-w-xl max-md:text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-xs tracking-widest uppercase mb-7 flex items-center gap-3 max-md:justify-center"
              style={{ color: '#C9A84C' }}
            >
              <span style={{ width: 32, height: '0.5px', background: 'rgba(201,168,76,0.4)', display: 'inline-block' }} />
              Introducing Fluntr
              <span style={{ width: 32, height: '0.5px', background: 'rgba(201,168,76,0.4)', display: 'inline-block' }} />
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="font-cormorant font-light leading-none mb-7"
              style={{ fontSize: 'clamp(52px,7vw,96px)', letterSpacing: '-1px' }}
            >
              <span className="block">Your Wardrobe.</span>
              <span className="block" style={{ fontStyle: 'italic', color: '#E2C97E' }}>Your Runway.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="text-sm leading-relaxed mb-12 max-w-md max-md:mx-auto"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              <strong className="text-white font-normal">
                Fluntr is the social commerce app that turns your wardrobe into a runway.
              </strong>
              <br />
              Digitise your closet, plan every occasion, and never open your wardrobe clueless again.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
              className="flex gap-4 flex-wrap mb-12 max-md:justify-center"
            >
              <a href="#waitlist" className="btn-gold">Join the Waitlist ✦</a>
              <a href="#features" className="btn-outline">See How it Works</a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="flex gap-10 flex-wrap max-md:justify-center"
            >
              {[
                [waitlistCount, 'On Waitlist'],
                [3, 'Core Pillars'],
                [1, 'App. All of it.'],
              ].map(([num, label]) => (
                <div key={label}>
                  <span className="font-cormorant block font-light" style={{ fontSize: '30px', color: '#E2C97E', lineHeight: 1 }}>{num}</span>
                  <span className="block text-xs uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.58)' }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Phone stack with real screenshots */}
          <motion.div
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex-1 flex justify-center items-center max-md:w-full"
          >
            <div className="relative" style={{ width: '300px', height: '560px' }}>
              {/* Back left — login screen */}
              <div className="absolute" style={{ left: 0, top: 80, zIndex: 1 }}>
                <PhoneMockup screen="login" tilt={-7} opacity={0.35} scale={0.83} width={200} />
              </div>
              {/* Back right — closet screen */}
              <div className="absolute" style={{ left: 80, top: 80, zIndex: 1 }}>
                <PhoneMockup screen="closet" tilt={7} opacity={0.28} scale={0.83} width={200} />
              </div>
              {/* Main — splash screen */}
              <div className="absolute" style={{ left: 25, top: 0, zIndex: 3 }}>
                <PhoneMockup screen="splash" width={250} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee />

      {/* ── FEATURES ── */}
      <section id="features" className="py-28 max-w-screen-xl mx-auto px-16 max-md:px-6">
        <Reveal>
          <div className="text-center mb-24">
            <p className="text-xs tracking-widest uppercase mb-5" style={{ color: '#C9A84C' }}>What Fluntr Does</p>
            <h2 className="font-cormorant font-light" style={{ fontSize: 'clamp(36px,5vw,64px)', letterSpacing: '-0.5px' }}>
              Three pillars.<br /><em style={{ color: '#E2C97E' }}>One runway.</em>
            </h2>
          </div>
        </Reveal>

        <div className="flex flex-col gap-28 max-md:gap-16">
          <FeatureRow
            num="01" tag="The Wardrobe"
            title="Your entire closet.<br/><em style='color:#E2C97E'>Finally visible.</em>"
            desc="Upload your clothes and AI removes the background instantly. Organise by occasion — beach, wedding, night out. Build collections, toggle public or private, and never forget what you own."
            points={[
              'AI background removal — instant, zero effort',
              'Occasion-based collections — beach, wedding, night out',
              'Everyone / Followers / Friends / Only me privacy controls',
              'Auto-Closet — buy in-app, it appears when delivered',
            ]}
            screen="closet"
          />
          <FeatureRow
            num="02" tag="The Stage"
            title="Post Vibes.<br/><em style='color:#E2C97E'>Run Polls. Get Hyped.</em>"
            desc="Step out of your private closet onto a social runway. Post outfit content, share 24-hour mirror selfies, and run real-time A/B polls. Fashion is social — Fluntr is built for it."
            points={[
              'Vibes — short-form vertical outfit videos',
              'Mirrors — 24-hour disappearing outfit stories',
              'Polls — let followers vote on your look',
              'Lookbooks — curated shoppable carousels',
            ]}
            screen="home"
            reverse
          />
          <FeatureRow
            num="03" tag="The Commerce"
            title="Every look.<br/><em style='color:#E2C97E'>Instantly shoppable.</em>"
            desc="Tag every item in your post with a floating buy button. Followers tap and shop directly. Add any outfit to your closet in one tap. No more gatekeeping — your style is your earning engine."
            points={[
              'Floating shoppable tags on every post',
              'Add to closet from the home feed in one tap',
              'Sell directly from your digital closet',
              'Peer-to-peer marketplace with wallet payouts',
            ]}
            screen="addcloset"
          />
        </div>
      </section>

      <GoldDivider />

      {/* ── APP SHOWCASE ── */}
      <section className="py-24 px-16 max-md:px-6" style={{ background: '#111113' }}>
        <div className="max-w-screen-lg mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-xs tracking-widest uppercase mb-5" style={{ color: '#C9A84C' }}>Inside the App</p>
              <h2 className="font-cormorant font-light" style={{ fontSize: 'clamp(34px,5vw,60px)', letterSpacing: '-0.5px' }}>
                See it. <em style={{ color: '#E2C97E' }}>Feel it.</em>
              </h2>
              <p className="text-sm mt-4 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.58)', lineHeight: 1.9 }}>
                Every screen designed to be invisible — so your clothes and style take centre stage.
              </p>
            </div>
          </Reveal>

          {/* Staggered phone row */}
          <Reveal>
            <div className="flex justify-center items-end gap-5 flex-wrap">
              {[
                { screen: 'splash', label: 'Splash', offset: 0 },
                { screen: 'login', label: 'Login', offset: -20 },
                { screen: 'home', label: 'Home Feed', offset: -40 },
                { screen: 'posts', label: 'Profile', offset: -20 },
                { screen: 'closet', label: 'Closet', offset: 0 },
              ].map(({ screen, label, offset }) => (
                <div key={screen} className="flex flex-col items-center gap-3" style={{ transform: `translateY(${offset}px)` }}>
                  <PhoneMockup screen={screen} width={160} />
                  <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.28)', fontSize: '9px' }}>{label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <GoldDivider />

      {/* ── WHY FLUNTR EXISTS ── */}
      <section className="py-28 px-16 max-md:px-6">
        <div className="max-w-screen-lg mx-auto grid grid-cols-2 gap-20 items-start max-md:grid-cols-1 max-md:gap-12">

          <Reveal direction="left">
            <p className="text-xs tracking-widest uppercase mb-5" style={{ color: '#C9A84C' }}>Why Fluntr Exists</p>
            <h2 className="font-cormorant font-light leading-tight mb-5" style={{ fontSize: 'clamp(32px,4vw,52px)', letterSpacing: '-0.5px' }}>
              Built for every time<br />you said <em style={{ color: '#E2C97E' }}>"I have nothing to wear."</em>
            </h2>
            <p className="leading-relaxed mb-10" style={{ fontSize: '15px' }} style={{ color: 'rgba(255,255,255,0.58)' }}>
              Fluntr was born from a real frustration — the daily battle of deciding what to wear. We built the app we always wished existed.
            </p>
            <div className="p-8" style={{ border: '0.5px solid rgba(201,168,76,0.15)', background: 'rgba(201,168,76,0.03)' }}>
              <p className="font-cormorant text-xl italic leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                "Born from one too many couple fights about what to wear — we built Fluntr so you never have to fight again."
              </p>
              <p className="text-xs uppercase tracking-widest mt-4" style={{ color: '#C9A84C' }}>— The Fluntr Team</p>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div style={{ border: '0.5px solid rgba(201,168,76,0.12)' }}>
              {[
                { title: 'The "Nothing to Wear" Paradox', desc: '100 pieces of clothing, zero visibility. Fluntr puts your entire wardrobe in front of you — clean, categorised, always accessible.' },
                { title: 'The Couple / Friends Fight', desc: '"What should I wear?" shouldn\'t start an argument. Plan looks in advance, share, get a vote — before the fight begins.' },
                { title: 'Occasion Panic', desc: 'Wedding Saturday. Remembered Friday night. With occasion collections, you plan weeks in advance with what you already own.' },
                { title: 'Fashion Gatekeeping', desc: 'Every outfit on Fluntr is tagged, linked, shoppable. See it, love it, own it. One tap. No more "where is that from?"' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-5 items-start p-8 transition-colors hover:bg-white/5"
                  style={{ borderBottom: i < 3 ? '0.5px solid rgba(201,168,76,0.08)' : 'none' }}
                >
                  <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-xs"
                    style={{ border: '0.5px solid rgba(201,168,76,0.3)', color: '#C9A84C' }}>✦</div>
                  <div>
                    <h4 className="font-cormorant text-lg font-normal mb-2">{item.title}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.58)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-28 px-16 max-md:px-6" style={{ background: '#111113', borderTop: '0.5px solid rgba(201,168,76,0.08)' }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-20">
              <p className="text-xs tracking-widest uppercase mb-5" style={{ color: '#C9A84C' }}>How It Works</p>
              <h2 className="font-cormorant font-light" style={{ fontSize: 'clamp(36px,5vw,64px)', letterSpacing: '-0.5px' }}>
                From your wardrobe<br /><em style={{ color: '#E2C97E' }}>to the world.</em>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1" style={{ border: '0.5px solid rgba(201,168,76,0.1)' }}>
            {[
              { num: '01', title: 'Snap & Digitise', desc: 'Photograph your clothes. AI removes backgrounds and categorises each item into your digital closet.' },
              { num: '02', title: 'Curate Collections', desc: 'Build occasion-based collections. Plan outfits for beach trips, weddings, date nights — weeks in advance.' },
              { num: '03', title: 'Post & Go Viral', desc: 'Share Vibes, Mirrors, Lookbooks. Run polls, get feedback, and build your style audience.' },
              { num: '04', title: 'Earn from Every Look', desc: 'Tag items as shoppable. Followers buy directly. Earn straight to your Fluntr wallet.' },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-10 transition-colors hover:bg-white/5 h-full"
                  style={{ borderRight: i < 3 ? '0.5px solid rgba(201,168,76,0.1)' : 'none' }}>
                  <div className="font-cormorant mb-4" style={{ fontSize: '44px', fontWeight: 300, color: 'rgba(201,168,76,0.12)', lineHeight: 1 }}>{step.num}</div>
                  <h3 className="font-cormorant text-xl font-normal mb-3">{step.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.58)' }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BORROW ── */}
      <section className="py-28 px-16 max-md:px-6 text-center">
        <div className="max-w-screen-lg mx-auto">
          <Reveal>
            <div className="relative overflow-hidden p-20 max-md:p-10" style={{ border: '0.5px solid rgba(201,168,76,0.15)' }}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(201,168,76,.06) 0%,transparent 70%)' }} />
              <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#C9A84C' }}>✦ &nbsp; Exclusive Feature &nbsp; ✦</p>
              <h2 className="font-cormorant font-light leading-tight mb-6" style={{ fontSize: 'clamp(32px,5vw,68px)' }}>
                Your bestie's wardrobe<br />is now <em style={{ color: '#E2C97E' }}>your</em> wardrobe.
              </h2>
              <p className="text-sm leading-relaxed max-w-lg mx-auto mb-12" style={{ color: 'rgba(255,255,255,0.58)' }}>
                Fluntr's Close Friends feature lets mutual friends browse each other's digital closets and request to borrow real items. The app tracks what's borrowed and when it's back. Fashion, shared.
              </p>
              <a href="#waitlist" className="btn-gold">Get Early Access ✦</a>
            </div>
          </Reveal>
        </div>
      </section>

      <GoldDivider />

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 px-16 max-md:px-6" style={{ background: '#111113', borderTop: '0.5px solid rgba(201,168,76,0.08)', borderBottom: '0.5px solid rgba(201,168,76,0.08)' }}>
        <div className="max-w-screen-lg mx-auto">
          <Reveal>
            <div className="text-center mb-20">
              <p className="text-xs tracking-widest uppercase mb-5" style={{ color: '#C9A84C' }}>Early Reactions</p>
              <h2 className="font-cormorant font-light" style={{ fontSize: 'clamp(36px,5vw,64px)', letterSpacing: '-0.5px' }}>
                What people are<br /><em style={{ color: '#E2C97E' }}>already saying.</em>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-3 max-md:grid-cols-1" style={{ background: 'rgba(201,168,76,0.08)', gap: '1px' }}>
            {[
              { q: "Finally an app that gets the 'full wardrobe, nothing to wear' problem. This is literally what I needed.", name: 'Priya S.', handle: '@priyastyles · Mumbai' },
              { q: "The poll feature is everything. My followers literally helped me pick my outfit for my cousin's wedding.", name: 'Ananya K.', handle: '@ananyaootd · Delhi' },
              { q: "My boyfriend and I used to fight every time we went out. I showed him this app and he actually got excited.", name: 'Rhea M.', handle: '@rheafashion · Bangalore' },
            ].map((card, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-10 transition-colors hover:bg-white/5" style={{ background: '#111113' }}>
                  <div className="mb-4" style={{ color: '#C9A84C', fontSize: '12px', letterSpacing: '2px' }}>★★★★★</div>
                  <p className="font-cormorant text-xl italic font-light leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.7)' }}>"{card.q}"</p>
                  <p className="text-xs uppercase tracking-widest" style={{ color: '#C9A84C' }}>{card.name}</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.58)' }}>{card.handle}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAITLIST ── */}
      <section id="waitlist" className="py-36 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: '700px', height: '700px', background: 'radial-gradient(circle,rgba(201,168,76,.07) 0%,transparent 65%)' }} />
        <div className="relative z-10 max-w-md mx-auto px-6">
          <div className="flex justify-center mb-8">
            <Sparkle size={64} animate />
          </div>
          <h2 className="font-cormorant font-light leading-none mb-6" style={{ fontSize: 'clamp(44px,7vw,96px)' }}>
            Your runway<br /><em style={{ color: '#E2C97E' }}>is almost ready.</em>
          </h2>
          <p className="text-sm mb-14" style={{ color: 'rgba(255,255,255,0.58)', letterSpacing: '0.04em' }}>
            Be the first to experience Fluntr. Join the waitlist.
          </p>
          <WaitlistForm onSuccess={() => setWaitlistCount(c => c + 1)} />
        </div>
      </section>

      <Footer />
    </>
  )
}
