import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import WaitlistForm from '../components/WaitlistForm'
import Reveal from '../components/Reveal'
import Shot from '../components/Shot'
import Photo from '../components/Photo'

/*
 * Fluntr homepage.
 *
 * Brief: a visitor should know within seconds why they need this.
 *
 * The previous version opened on "Your Wardrobe. Your Runway." over a mood and
 * buried the line that actually lands, "I have nothing to wear", five screens
 * down. It also carried three testimonials from people who do not exist. This
 * version leads with the problem, answers it with the real product, and claims
 * nothing that has not shipped.
 */

const GOLD = '#C9A84C'
const GOLD_LIGHT = '#E2C97E'
const MUTED = 'rgba(255,255,255,0.62)'
const FAINT = 'rgba(255,255,255,0.45)'

// ── 1. HERO ───────────────────────────────────────────── split, asset right ──
function Hero() {
  return (
    <section
      className="relative flex items-center overflow-hidden px-6 pb-16 pt-20 md:px-12 md:pb-20 md:pt-24 lg:px-16"
      style={{ minHeight: '100dvh' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: '46%', left: '28%', transform: 'translate(-50%,-50%)',
          width: 780, height: 780,
          background: 'radial-gradient(circle, rgba(201,168,76,.06) 0%, transparent 66%)',
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 md:gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <Reveal y={0}>
            <p className="mb-5 text-[10.5px] uppercase md:mb-7 md:text-[11px]" style={{ color: GOLD, letterSpacing: '0.3em' }}>
              Your closet, on your phone
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1
              className="font-cormorant"
              style={{ fontSize: 'clamp(29px,4.3vw,58px)', fontWeight: 400, lineHeight: 1.12, letterSpacing: '-0.4px' }}
            >
              Your wardrobe is full.
              <br />
              <em style={{ color: GOLD_LIGHT, fontStyle: 'italic', lineHeight: 1.15 }} className="inline-block pb-1">
                You still have nothing to wear.
              </em>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-5 max-w-[30rem] text-[14.5px] leading-relaxed md:mt-7 md:text-[15px]" style={{ color: MUTED }}>
              Fluntr puts every piece you own on your phone, so you can see it,
              plan it, and wear it.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-7 flex flex-wrap gap-3 md:mt-10 md:gap-4">
              <a href="#waitlist" className="btn-gold">Join the waitlist</a>
              <a href="#how" className="btn-outline">See how it works</a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="flex justify-center lg:justify-end">
          <Shot src="app-feed" alt="The Fluntr feed, showing outfit posts from people you follow" width={288} priority />
        </Reveal>
      </div>
    </section>
  )
}

// ── 2. THE PROBLEM ──────────────────── full-bleed photo band + typographic list ──
function Problem() {
  const moments = [
    ['Wedding on Saturday.', 'Remembered on Friday night.'],
    ['Two of you, one mirror.', 'Twenty minutes gone, nobody happy.'],
    ['You bought it twice', 'because you forgot you owned the first one.'],
  ]
  return (
    <section>
      <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden">
        <Photo
          src="full"
          alt="A wardrobe packed with shirts, sorted by colour"
          w={1900} h={1266}
          className="h-full w-full object-cover"
          style={{ filter: 'grayscale(0.35) brightness(0.52)' }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(9,9,11,0.6) 0%, rgba(9,9,11,0.25) 45%, #09090b 100%)' }}
        />
        <div className="absolute inset-0 flex items-center px-6 md:px-12 lg:px-16">
          <Reveal>
            <h2
              className="font-cormorant mx-auto max-w-5xl"
              style={{ fontSize: 'clamp(28px,4.2vw,56px)', fontWeight: 400, lineHeight: 1.15 }}
            >
              You already own enough.
            </h2>
          </Reveal>
        </div>
      </div>

      <div className="px-6 pb-24 pt-16 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-5xl">
          {moments.map(([a, b], i) => (
            <Reveal key={a} delay={i * 0.08}>
              <div className="py-8 md:py-10" style={{ borderTop: '0.5px solid rgba(255,255,255,0.09)' }}>
                <p
                  className="font-cormorant"
                  style={{ fontSize: 'clamp(22px,3vw,38px)', fontWeight: 400, lineHeight: 1.3 }}
                >
                  {a} <span style={{ color: FAINT }}>{b}</span>
                </p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.2}>
            <p className="mt-12 max-w-xl text-[15px] leading-relaxed" style={{ color: MUTED }}>
              None of this is a shopping problem. You just cannot see everything
              you have in one place.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ── 3. THE ANSWER ──────────────────────────────────── split, photo left ──
function Answer() {
  return (
    <section className="px-6 py-24 md:px-12 md:py-28 lg:px-16" style={{ background: '#111113' }}>
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="overflow-hidden" style={{ border: '0.5px solid rgba(201,168,76,0.16)' }}>
            <Photo
              src="rail"
              alt="A curated clothing rail in neutral tones"
              w={1100} h={825}
              className="w-full"
              style={{ height: 'auto' }}
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2
            className="font-cormorant"
            style={{ fontSize: 'clamp(28px,3.8vw,52px)', fontWeight: 400, lineHeight: 1.15 }}
          >
            Photograph it once.
            <br />
            <em style={{ color: GOLD_LIGHT }}>See it forever.</em>
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed" style={{ color: MUTED }}>
            Snap a piece and the background drops away on the phone itself.
            Nothing is uploaded to be processed, nothing waits on a server, and
            your closet turns into a grid you can actually look through.
          </p>
          <ul className="mt-8 flex flex-col gap-3">
            {[
              'Backgrounds removed on the device, not in the cloud',
              'Grouped by colour, type and occasion',
              'Private by default, shared only when you choose',
            ].map(point => (
              <li key={point} className="flex gap-3 text-[14px]" style={{ color: 'rgba(255,255,255,0.56)', lineHeight: 1.65 }}>
                <span aria-hidden style={{ color: GOLD }}>+</span>
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

// ── 4. HOW IT WORKS ─────────────────────────────────────── four-step grid ──
function How() {
  const steps = [
    ['Photograph', 'Shoot each piece as you wear it. The background goes on its own.'],
    ['Organise', 'Group by occasion. Beach, office, wedding, whatever you actually do.'],
    ['Plan', 'Build the outfit the night before, not during the morning.'],
    ['Share', 'Post the look, or put two up and let people pick.'],
  ]
  return (
    <section id="how" className="px-6 py-24 md:px-12 md:py-32 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-6 text-[11px] uppercase" style={{ color: GOLD, letterSpacing: '0.3em' }}>
            How it works
          </p>
          <h2
            className="font-cormorant mb-16 max-w-2xl"
            style={{ fontSize: 'clamp(28px,3.8vw,52px)', fontWeight: 400, lineHeight: 1.15 }}
          >
            Four steps, then it runs itself.
          </h2>
        </Reveal>

        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: 'rgba(201,168,76,0.13)' }}>
          {steps.map(([title, desc], i) => (
            <Reveal key={title} delay={i * 0.07}>
              <div className="h-full p-9" style={{ background: '#09090b' }}>
                <h3 className="font-cormorant mb-3" style={{ fontSize: 24, fontWeight: 400 }}>{title}</h3>
                <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.56)' }}>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 5. THE SOCIAL SIDE ───────────────────────────── asymmetric bento, 3 cells ──
function Bento() {
  return (
    <section id="features" className="px-6 py-24 md:px-12 md:py-28 lg:px-16" style={{ background: '#111113' }}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2
            className="font-cormorant mb-14 max-w-2xl"
            style={{ fontSize: 'clamp(28px,3.8vw,52px)', fontWeight: 400, lineHeight: 1.15 }}
          >
            Then it gets social.
          </h2>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-3 lg:grid-rows-2">
          <Reveal className="lg:col-span-2 lg:row-span-2">
            <div
              className="flex h-full flex-col justify-between gap-8 overflow-hidden p-9 md:flex-row md:items-end"
              style={{ border: '0.5px solid rgba(201,168,76,0.16)', background: '#09090b' }}
            >
              <div className="max-w-sm">
                <h3 className="font-cormorant mb-3" style={{ fontSize: 30, fontWeight: 400 }}>
                  Ask before you commit
                </h3>
                <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.58)' }}>
                  Put a look up and see what people think while you still have
                  time to change. Every post says which pieces made it.
                </p>
              </div>
              <Shot src="app-feed-2" alt="A Fluntr post showing an outfit, with like, comment and share counts" width={182} className="self-center md:self-end" />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="h-full p-9" style={{ border: '0.5px solid rgba(201,168,76,0.16)', background: '#09090b' }}>
              <h3 className="font-cormorant mb-3" style={{ fontSize: 24, fontWeight: 400 }}>
                See the whole outfit
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.58)' }}>
                Any look breaks down into the pieces behind it, and tells you
                which ones are already in your closet.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div
              className="h-full p-9"
              style={{
                border: '0.5px solid rgba(201,168,76,0.16)',
                background: 'linear-gradient(145deg, rgba(201,168,76,0.1) 0%, #09090b 58%)',
              }}
            >
              <h3 className="font-cormorant mb-3" style={{ fontSize: 24, fontWeight: 400 }}>
                Borrow from friends
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.58)' }}>
                Close friends can look through each other's closets and ask for a
                piece. Fluntr keeps track of who has what.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ── 6. WHO IT IS FOR ──────────────────────────────────── centred statement ──
function WhoFor() {
  return (
    <section className="px-6 py-24 md:px-12 md:py-32 lg:px-16">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <h2
            className="font-cormorant"
            style={{ fontSize: 'clamp(26px,3.4vw,46px)', fontWeight: 400, lineHeight: 1.22 }}
          >
            For people who own plenty
            <br />
            and <em style={{ color: GOLD_LIGHT }}>wear a fraction of it.</em>
          </h2>
          <p className="mx-auto mt-7 max-w-lg text-[15px] leading-relaxed" style={{ color: MUTED }}>
            Fluntr is not open yet. We are building it with the people on the
            waitlist, which is why the list is short and the questions are real.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// ── 7. WAITLIST ───────────────────────────────────────────── centred CTA ──
function Waitlist() {
  return (
    <section
      id="waitlist"
      className="relative overflow-hidden px-6 py-28 text-center md:py-36"
      style={{ background: '#111113', borderTop: '0.5px solid rgba(201,168,76,0.1)' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 720, height: 720,
          background: 'radial-gradient(circle, rgba(201,168,76,.075) 0%, transparent 65%)',
        }}
      />
      <div className="relative z-10 mx-auto max-w-md">
        <Reveal>
          <h2 className="font-cormorant" style={{ fontSize: 'clamp(32px,4.6vw,60px)', fontWeight: 400, lineHeight: 1.1 }}>
            Get in early.
          </h2>
          <p className="mb-10 mt-5 text-[15px]" style={{ color: MUTED }}>
            Leave your email and we will tell you the day it opens.
          </p>
          <WaitlistForm />
        </Reveal>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Fluntr - See everything you own, and actually wear it</title>
        <meta
          name="description"
          content="Your wardrobe is full and you still have nothing to wear. Fluntr puts every piece you own on your phone, so you can see it, plan it, and wear it."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://fluntr.com/" />
        <meta property="og:title" content="Fluntr - See everything you own, and actually wear it" />
        <meta property="og:description" content="Your wardrobe is full and you still have nothing to wear. Fluntr puts every piece you own on your phone." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fluntr.com/" />
      </Head>

      <Nav />
      <main>
        <Hero />
        <Problem />
        <Answer />
        <How />
        <Bento />
        <WhoFor />
        <Waitlist />
      </main>
      <Footer />
    </>
  )
}
