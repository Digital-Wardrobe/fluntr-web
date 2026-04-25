import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import Nav from '../components/Nav'
import Sparkle from '../components/Sparkle'
import Marquee from '../components/Marquee'
import PhoneMockup from '../components/PhoneMockup'
import WaitlistForm from '../components/WaitlistForm'
import Footer from '../components/Footer'
import { useState } from 'react'

// Reusable reveal wrapper
function Reveal({ children, direction = 'up', delay = 0 }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12 })
  const variants = {
    hidden: { opacity: 0, y: direction === 'up' ? 28 : 0, x: direction === 'left' ? -28 : direction === 'right' ? 28 : 0 },
    visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.7, ease: 'easeOut', delay } }
  }
  return (
    <motion.div ref={ref} variants={variants} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
      {children}
    </motion.div>
  )
}

// Gold divider
function GoldDivider() {
  return (
    <div className="flex items-center gap-5 px-16">
      <div className="flex-1" style={{ height: '0.5px', background: 'rgba(201,168,76,0.1)' }} />
      <Sparkle size={14} color="rgba(201,168,76,0.35)" />
      <div className="flex-1" style={{ height: '0.5px', background: 'rgba(201,168,76,0.1)' }} />
    </div>
  )
}

// Feature row
function FeatureRow({ num, tag, title, desc, points, screen, reverse = false }) {
  return (
    <div className={`flex items-center gap-20 ${reverse ? 'flex-row-reverse' : ''} max-md:flex-col max-md:gap-12`}>
      <Reveal direction={reverse ? 'right' : 'left'} className="flex-1">
        <div className="flex-1">
          <span className="font-cormorant block" style={{ fontSize: '80px', fontWeight: 300, color: 'rgba(201,168,76,0.08)', lineHeight: 1, marginBottom: '-20px' }}>{num}</span>
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A84C' }}>{tag}</p>
          <h3 className="font-cormorant text-4xl font-normal leading-tight mb-5" style={{ letterSpacing: '-0.3px' }}
            dangerouslySetInnerHTML={{ __html: title }} />
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.38)', letterSpacing: '0.02em' }}>{desc}</p>
          <ul className="flex flex-col gap-3">
            {points.map((p, i) => (
              <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                <span style={{ color: '#C9A84C', fontSize: '8px', marginTop: '4px', flexShrink: 0 }}>✦</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <Reveal direction={reverse ? 'left' : 'right'} className="flex-1 flex justify-center">
        <div className="flex justify-center">
          <PhoneMockup screen={screen} />
        </div>
      </Reveal>
    </div>
  )
}

export default function Home() {
  const [waitlistCount, setWaitlistCount] = useState(127)

  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden hero-grid"
        style={{ padding: '140px 60px 100px' }}>
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: '800px', height: '800px', background: 'radial-gradient(circle,rgba(201,168,76,.05) 0%,transparent 65%)' }} />

        <div className="flex items-center justify-between w-full max-w-7xl gap-16 max-md:flex-col">
          {/* Left */}
          <div className="flex-1 max-w-xl">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-xs tracking-widest uppercase mb-7 flex items-center gap-3"
              style={{ color: '#C9A84C' }}>
              <span style={{ flex: 1, maxWidth: 40, height: '0.5px', background: 'rgba(201,168,76,0.4)', display: 'inline-block' }} />
              Introducing Flauntr
              <span style={{ flex: 1, maxWidth: 40, height: '0.5px', background: 'rgba(201,168,76,0.4)', display: 'inline-block' }} />
            </motion.p>

            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="font-cormorant font-light leading-none mb-7"
              style={{ fontSize: 'clamp(56px,7vw,96px)', letterSpacing: '-1px' }}>
              <span className="block">Your Wardrobe.</span>
              <span className="block" style={{ fontStyle: 'italic', color: '#E2C97E' }}>Your Runway.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="text-sm leading-relaxed mb-12 max-w-md"
              style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.02em' }}>
              <strong className="text-white font-normal">Flauntr is the social commerce app that turns your wardrobe into a runway.</strong>
              <br />Digitise your closet, plan every occasion, and never open your wardrobe clueless again.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
              className="flex gap-4 flex-wrap mb-12">
              <a href="#waitlist" className="btn-gold">Join the Waitlist ✦</a>
              <a href="#features" className="btn-outline">See How it Works</a>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="flex gap-12 flex-wrap">
              {[
                [waitlistCount, 'On Waitlist'],
                [3, 'Core Pillars'],
                [1, 'App. All of it.'],
              ].map(([num, label]) => (
                <div key={label}>
                  <span className="font-cormorant block text-3xl font-light" style={{ color: '#E2C97E', lineHeight: 1 }}>{num}</span>
                  <span className="block text-xs uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.38)' }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Phone stack */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex-1 flex justify-end items-center max-md:justify-center">
            <div className="relative" style={{ width: '320px', height: '560px' }}>
              {/* Back left */}
              <div className="absolute" style={{ left: 0, top: 80, zIndex: 1 }}>
                <PhoneMockup screen="closet" tilt={-7} opacity={0.35} scale={0.83} />
              </div>
              {/* Back right */}
              <div className="absolute" style={{ left: 90, top: 80, zIndex: 1 }}>
                <PhoneMockup screen="vibe" tilt={7} opacity={0.3} scale={0.83} />
              </div>
              {/* Main */}
              <div className="absolute" style={{ left: 30, top: 10, zIndex: 3 }}>
                <PhoneMockup screen="splash" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee />

      {/* FEATURES */}
      <section id="features" className="py-28 max-w-screen-xl mx-auto px-16 max-md:px-6">
        <Reveal>
          <div className="text-center mb-24">
            <p className="text-xs tracking-widest uppercase mb-5" style={{ color: '#C9A84C' }}>What Flauntr Does</p>
            <h2 className="font-cormorant font-light" style={{ fontSize: 'clamp(36px,5vw,64px)', letterSpacing: '-0.5px' }}>
              Three pillars.<br /><em style={{ color: '#E2C97E' }}>One runway.</em>
            </h2>
          </div>
        </Reveal>

        <div className="flex flex-col gap-28">
          <FeatureRow
            num="01" tag="The Wardrobe"
            title="Your entire closet.<br/><em style='color:#E2C97E'>Finally visible.</em>"
            desc="Upload your clothes and AI removes the background instantly — every item clean, categorised, and searchable. Organise by occasion, filter by colour, and even track what's in the laundry."
            points={['AI background removal — instant, zero effort','Occasion-based collections — beach, wedding, night out','Laundry bin — knows what\'s dirty','Auto-Closet — buy it in-app, it appears when delivered']}
            screen="closet"
          />
          <FeatureRow
            num="02" tag="The Stage"
            title="Post Vibes.<br/><em style='color:#E2C97E'>Run Polls. Get Hyped.</em>"
            desc="Step out of your private closet and onto a social runway. Post short-form outfit videos, 24-hour mirror selfies, or create A/B outfit polls — let your followers vote in real time."
            points={['Vibes — short-form vertical outfit videos','Mirrors — 24-hour disappearing outfit stories','Polls — let followers choose your look','Lookbooks — curated carousel posts']}
            screen="poll"
            reverse
          />
          <FeatureRow
            num="03" tag="The Commerce"
            title="Every look.<br/><em style='color:#E2C97E'>Instantly shoppable.</em>"
            desc="Tag every item in your Vibe or Lookbook with a floating buy button. Followers tap and shop directly. No more gatekeeping — your style is your earning engine."
            points={['Floating shoppable tags on every post','Sell directly from your digital closet','Peer-to-peer marketplace with wallet payouts','Borrow from close friends\' wardrobes']}
            screen="vibe"
          />
        </div>
      </section>

      <GoldDivider />

      {/* WHY FLAUNTR EXISTS */}
      <section className="py-28 max-w-screen-lg mx-auto px-16 max-md:px-6">
        <div className="grid grid-cols-2 gap-20 items-start max-md:grid-cols-1 max-md:gap-12">
          <Reveal direction="left">
            <div>
              <p className="text-xs tracking-widest uppercase mb-5" style={{ color: '#C9A84C' }}>Why Flauntr Exists</p>
              <h2 className="font-cormorant font-light leading-tight mb-5" style={{ fontSize: 'clamp(36px,4vw,56px)', letterSpacing: '-0.5px' }}>
                Built for every time<br/>you said <em style={{ color: '#E2C97E' }}>"I have nothing to wear."</em>
              </h2>
              <p className="text-sm leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.38)', letterSpacing: '0.02em' }}>
                Flauntr was born from a real frustration — the daily battle of deciding what to wear. We built the app we always wished existed.
              </p>
              <div className="p-8" style={{ border: '0.5px solid rgba(201,168,76,0.15)', background: 'rgba(201,168,76,0.03)' }}>
                <p className="font-cormorant text-xl italic leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  "Born from one too many couple fights about what to wear — we built Flauntr so you never have to fight again."
                </p>
                <p className="text-xs uppercase tracking-widest mt-4" style={{ color: '#C9A84C' }}>— The Flauntr Team</p>
              </div>
            </div>
          </Reveal>
          <Reveal direction="right">
            <div style={{ border: '0.5px solid rgba(201,168,76,0.12)' }}>
              {[
                { icon: '✦', title: 'The "Nothing to Wear" Paradox', desc: '100 pieces of clothing, zero visibility. Flauntr puts your entire wardrobe in front of you — clean, categorised, always accessible.' },
                { icon: '✦', title: 'The Couple / Friends Fight', desc: '"What should I wear?" shouldn\'t start an argument. Plan looks in advance, share, get a vote — before the fight begins.' },
                { icon: '✦', title: 'Occasion Panic', desc: 'Wedding Saturday. Remembered Friday night. With occasion collections, you plan weeks in advance with what you already own.' },
                { icon: '✦', title: 'Fashion Gatekeeping', desc: 'Every outfit on Flauntr is tagged, linked, and shoppable. See it, love it, own it. One tap. No more "where is that from?"' },
              ].map((item, i) => (
                <div key={i} className="flex gap-5 items-start p-8 transition-colors hover:bg-white/5"
                  style={{ borderBottom: i < 3 ? '0.5px solid rgba(201,168,76,0.08)' : 'none' }}>
                  <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-sm"
                    style={{ border: '0.5px solid rgba(201,168,76,0.3)', color: '#C9A84C' }}>{item.icon}</div>
                  <div>
                    <h4 className="font-cormorant text-lg font-normal mb-2">{item.title}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)', letterSpacing: '0.02em' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-28" style={{ background: '#111113', borderTop: '0.5px solid rgba(201,168,76,0.08)' }}>
        <div className="max-w-4xl mx-auto px-16 max-md:px-6">
          <Reveal>
            <div className="text-center mb-20">
              <p className="text-xs tracking-widest uppercase mb-5" style={{ color: '#C9A84C' }}>How It Works</p>
              <h2 className="font-cormorant font-light" style={{ fontSize: 'clamp(36px,5vw,64px)', letterSpacing: '-0.5px' }}>
                From your wardrobe<br/><em style={{ color: '#E2C97E' }}>to the world.</em>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-4 max-md:grid-cols-1" style={{ border: '0.5px solid rgba(201,168,76,0.1)' }}>
            {[
              { num: '01', title: 'Snap & Digitise', desc: 'Photograph your clothes. AI instantly removes backgrounds and categorises each item into your digital closet.' },
              { num: '02', title: 'Curate Collections', desc: 'Build occasion-based collections — beach trip, wedding guest, date night. Plan outfits before panic sets in.' },
              { num: '03', title: 'Post & Go Viral', desc: 'Share Vibes, Mirrors, and Lookbooks. Run polls, get feedback, and build your style audience.' },
              { num: '04', title: 'Earn from Every Look', desc: 'Tag items as shoppable. Followers buy directly. Sell from your closet and earn to your Flauntr wallet.' },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-12 relative transition-colors hover:bg-white/5 max-md:border-b max-md:border-gold/10"
                  style={{ borderRight: i < 3 ? '0.5px solid rgba(201,168,76,0.1)' : 'none' }}>
                  <div className="font-cormorant mb-4" style={{ fontSize: '48px', fontWeight: 300, color: 'rgba(201,168,76,0.12)', lineHeight: 1 }}>{step.num}</div>
                  <h3 className="font-cormorant text-xl font-normal mb-3">{step.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>{step.desc}</p>
                  {i < 3 && <span className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-0 hidden md:block" style={{ color: 'rgba(201,168,76,0.2)', fontSize: '20px' }}>→</span>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BORROW */}
      <section className="py-28 max-w-screen-lg mx-auto px-16 max-md:px-6 text-center">
        <Reveal>
          <div className="relative overflow-hidden p-20 max-md:p-10" style={{ border: '0.5px solid rgba(201,168,76,0.15)' }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(201,168,76,.06) 0%,transparent 70%)' }} />
            <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#C9A84C' }}>✦ &nbsp; Exclusive Feature &nbsp; ✦</p>
            <h2 className="font-cormorant font-light leading-tight mb-6" style={{ fontSize: 'clamp(36px,5vw,72px)' }}>
              Your bestie's wardrobe<br/>is now <em style={{ color: '#E2C97E' }}>your</em> wardrobe.
            </h2>
            <p className="text-sm leading-relaxed max-w-lg mx-auto mb-12" style={{ color: 'rgba(255,255,255,0.38)' }}>
              With Flauntr's Close Friends feature, mutual friends can browse each other's digital closets and request to borrow real items. The app tracks what's borrowed and when it's available again.
            </p>
            <a href="#waitlist" className="btn-gold">Get Early Access ✦</a>
          </div>
        </Reveal>
      </section>

      <GoldDivider />

      {/* SOCIAL PROOF */}
      <section className="py-28" style={{ background: '#111113', borderTop: '0.5px solid rgba(201,168,76,0.08)', borderBottom: '0.5px solid rgba(201,168,76,0.08)' }}>
        <div className="max-w-screen-lg mx-auto px-16 max-md:px-6">
          <Reveal>
            <div className="text-center mb-20">
              <p className="text-xs tracking-widest uppercase mb-5" style={{ color: '#C9A84C' }}>Early Reactions</p>
              <h2 className="font-cormorant font-light" style={{ fontSize: 'clamp(36px,5vw,64px)', letterSpacing: '-0.5px' }}>
                What people are<br/><em style={{ color: '#E2C97E' }}>already saying.</em>
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-3 max-md:grid-cols-1" style={{ background: 'rgba(201,168,76,0.08)', gap: '1px' }}>
            {[
              { quote: "Finally an app that gets the 'full wardrobe, nothing to wear' problem. This is literally what I needed.", name: 'Priya S.', handle: '@priyastyles · Mumbai' },
              { quote: "The poll feature is everything. My followers literally helped me pick my outfit for my cousin's wedding.", name: 'Ananya K.', handle: '@ananyaootd · Delhi' },
              { quote: "My boyfriend and I used to fight every single time we went out. I showed him this app and he actually got excited.", name: 'Rhea M.', handle: '@rheafashion · Bangalore' },
            ].map((card, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-10 transition-colors hover:bg-white/5" style={{ background: '#111113' }}>
                  <div className="mb-4" style={{ color: '#C9A84C', fontSize: '12px', letterSpacing: '2px' }}>★★★★★</div>
                  <p className="font-cormorant text-xl italic font-light leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.7)' }}>"{card.quote}"</p>
                  <p className="text-xs uppercase tracking-widest" style={{ color: '#C9A84C' }}>{card.name}</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.38)' }}>{card.handle}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section id="waitlist" className="py-36 text-center relative overflow-hidden" style={{ background: '#09090b' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: '700px', height: '700px', background: 'radial-gradient(circle,rgba(201,168,76,.07) 0%,transparent 65%)' }} />
        <div className="relative z-10 max-w-lg mx-auto px-6">
          <div className="flex justify-center mb-8">
            <Sparkle size={64} animate />
          </div>
          <h2 className="font-cormorant font-light leading-none mb-6" style={{ fontSize: 'clamp(48px,7vw,100px)' }}>
            Your runway<br/><em style={{ color: '#E2C97E' }}>is almost ready.</em>
          </h2>
          <p className="text-sm mb-14" style={{ color: 'rgba(255,255,255,0.38)', letterSpacing: '0.04em' }}>
            Be the first to experience Flauntr. Join the waitlist.
          </p>
          <WaitlistForm onSuccess={() => setWaitlistCount(c => c + 1)} />
        </div>
      </section>

      <Footer />
    </>
  )
}
