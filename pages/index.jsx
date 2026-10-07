import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import WaitlistForm from '../components/WaitlistForm'
import Photo from '../components/Photo'
import Reveal from '../components/motion/Reveal'
import MaskLine from '../components/motion/MaskLine'
import Marquee from '../components/motion/Marquee'
import Parallax from '../components/motion/Parallax'
import TiltCard from '../components/motion/TiltCard'
import DrawLine from '../components/motion/DrawLine'
import PhoneLoop from '../components/motion/PhoneLoop'
import JourneyStage from '../components/motion/JourneyStage'
import Orb from '../components/motion/Orb'
import Shot from '../components/Shot'

/*
 * Fluntr homepage.
 *
 * Brief: a visitor should know within seconds why they need this, and should be
 * able to watch somebody use it rather than read about it.
 *
 * The spine of the page is JourneyStage: a pinned, scroll-scrubbed sequence in
 * which a woman walks up to a mirror, takes one photo, and the photo turns
 * itself into her closet and then into an outfit. Everything above it sets that
 * up; everything below it is the part that only makes sense once you have seen
 * it. Each section carries its own motion rather than deferring to one shared
 * fade wrapper.
 *
 * Every motion component honours prefers-reduced-motion, and JourneyStage swaps
 * itself for a static storyboard outright.
 */

const GOLD = '#C9A84C'
const GOLD_LIGHT = '#E2C97E'
const MUTED = 'rgba(255,255,255,0.62)'
const FAINT = 'rgba(255,255,255,0.45)'

// ── 1. HERO ───────────────────────────────────────────── split, device right ──
function Hero() {
  return (
    <section
      className="relative flex items-center overflow-hidden px-6 pb-20 pt-24 md:px-12 md:pb-24 md:pt-28 lg:px-16"
      style={{ minHeight: '100dvh' }}
    >
      <Orb left="26%" top="46%" size={820} />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 md:gap-14 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
        <div>
          <Reveal from="none">
            <p className="mb-5 text-[10.5px] uppercase md:mb-7 md:text-[11px]" style={{ color: GOLD, letterSpacing: '0.3em' }}>
              Your closet, on your phone
            </p>
          </Reveal>

          <h1
            className="font-cormorant"
            style={{ fontSize: 'clamp(30px,4.4vw,60px)', fontWeight: 400, lineHeight: 1.12, letterSpacing: '-0.4px' }}
          >
            <MaskLine as="span" text="Your wardrobe is full." delay={0.15} className="block" />
            <MaskLine
              as="span"
              text="You still have nothing to wear."
              delay={0.42}
              className="block"
              style={{ color: GOLD_LIGHT, fontStyle: 'italic' }}
            />
          </h1>

          <Reveal delay={0.85} blur>
            <p className="mt-6 max-w-[30rem] text-[14.5px] leading-relaxed md:mt-8 md:text-[15px]" style={{ color: MUTED }}>
              Fluntr puts every piece you own on your phone, so you can see it,
              plan it, and wear it.
            </p>
          </Reveal>

          <Reveal delay={1}>
            <div className="mt-8 flex flex-wrap gap-3 md:mt-10 md:gap-4">
              <a href="#waitlist" className="btn-gold btn-shine">Join the waitlist</a>
              <a href="#how" className="btn-outline">Watch how it works</a>
            </div>
          </Reveal>
        </div>

        <div className="flex justify-center lg:justify-end">
          <PhoneLoop width={288} />
        </div>
      </div>
    </section>
  )
}

// ── 2. THE DRIFT ─────────────────────────────── two bands, opposite directions ──
function Drift() {
  return (
    <section aria-hidden className="select-none">
      <Marquee
        items={[
          'Wedding on Saturday',
          'Nothing to wear',
          'Bought it twice',
          'Twenty minutes at the mirror',
          'Forgot you owned it',
        ]}
        duration={40}
        tone="rgba(255,255,255,0.11)"
      />
      <Marquee
        items={['See it', 'Plan it', 'Wear it', 'Share it', 'Borrow it']}
        reverse
        duration={30}
        tone="rgba(201,168,76,0.3)"
      />
    </section>
  )
}

// ── 3. THE PROBLEM ───────────────── parallax band + typographic moments ──
function Problem() {
  const moments = [
    ['Wedding on Saturday.', 'Remembered on Friday night.'],
    ['Two of you, one mirror.', 'Twenty minutes gone, nobody happy.'],
    ['You bought it twice', 'because you forgot you owned the first one.'],
  ]
  return (
    <section>
      <Parallax
        distance={120}
        scale
        className="relative h-[52vh] min-h-[340px] w-full overflow-hidden"
      >
        <Photo
          src="full"
          alt="A wardrobe packed with shirts, sorted by colour"
          w={1900} h={1266}
          className="h-full w-full object-cover"
          style={{ filter: 'grayscale(0.35) brightness(0.5)' }}
        />
      </Parallax>

      <div className="relative -mt-[52vh] h-[52vh] min-h-[340px]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(9,9,11,0.62) 0%, rgba(9,9,11,0.22) 42%, #09090b 100%)' }}
        />
        <div className="absolute inset-0 flex items-center px-6 md:px-12 lg:px-16">
          <h2
            className="font-cormorant mx-auto max-w-5xl"
            style={{ fontSize: 'clamp(28px,4.2vw,56px)', fontWeight: 400, lineHeight: 1.15 }}
          >
            <MaskLine as="span" text="You already own enough." />
          </h2>
        </div>
      </div>

      <div className="px-6 pb-24 pt-16 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-5xl">
          {moments.map(([a, b], i) => (
            <div key={a} className="py-8 md:py-10">
              <DrawLine delay={i * 0.05} tone="rgba(255,255,255,0.1)" />
              <p
                className="font-cormorant pt-8 md:pt-10"
                style={{ fontSize: 'clamp(22px,3vw,38px)', fontWeight: 400, lineHeight: 1.3 }}
              >
                <MaskLine as="span" text={a} stagger={0.04} />{' '}
                <MaskLine as="span" text={b} delay={0.16} stagger={0.03} style={{ color: FAINT }} />
              </p>
            </div>
          ))}
          <Reveal delay={0.12} blur>
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

// ── 4. THE JOURNEY ──────────────────── the pinned sequence, id="how" ──
// (JourneyStage)

// ── 5. THE SOCIAL SIDE ──────────────────────── bento, pointer-reactive ──
function Social() {
  return (
    <section id="features" className="px-6 py-24 md:px-12 md:py-28 lg:px-16" style={{ background: '#111113' }}>
      <div className="mx-auto max-w-6xl">
        <h2
          className="font-cormorant mb-14 max-w-2xl"
          style={{ fontSize: 'clamp(28px,3.8vw,52px)', fontWeight: 400, lineHeight: 1.15 }}
        >
          <MaskLine as="span" text="Then it gets social." />
        </h2>

        <div className="grid gap-5 lg:grid-cols-3 lg:grid-rows-2">
          <Reveal from="right" className="lg:col-span-2 lg:row-span-2">
            <TiltCard
              max={4}
              className="group relative flex h-full flex-col justify-between gap-8 overflow-hidden p-9 md:flex-row md:items-end"
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
              <Shot
                src="app-feed-2"
                alt="A Fluntr post showing an outfit, with like, comment and share counts"
                width={182}
                className="self-center md:self-end"
              />
            </TiltCard>
          </Reveal>

          <Reveal from="left" delay={0.08}>
            <TiltCard
              className="group relative h-full overflow-hidden p-9"
              style={{ border: '0.5px solid rgba(201,168,76,0.16)', background: '#09090b' }}
            >
              <h3 className="font-cormorant mb-3" style={{ fontSize: 24, fontWeight: 400 }}>
                See the whole outfit
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.58)' }}>
                Any look breaks down into the pieces behind it, and tells you
                which ones are already in your closet.
              </p>
            </TiltCard>
          </Reveal>

          <Reveal from="left" delay={0.14}>
            <TiltCard
              className="group relative h-full overflow-hidden p-9"
              style={{
                border: '0.5px solid rgba(201,168,76,0.16)',
                background: 'linear-gradient(145deg, rgba(201,168,76,0.1) 0%, #09090b 58%)',
              }}
            >
              <h3 className="font-cormorant mb-3" style={{ fontSize: 24, fontWeight: 400 }}>
                Borrow from friends
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.58)' }}>
                Close friends can look through each other&apos;s closets and ask for
                a piece. Fluntr keeps track of who has what.
              </p>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ── 6. THE PROMISE ────────────────────────── parallax photo + claims ──
function Promise_() {
  const points = [
    'Backgrounds removed on the device, not in the cloud',
    'Grouped by colour, type and occasion',
    'Private by default, shared only when you choose',
  ]
  return (
    <section id="app" className="px-6 py-24 md:px-12 md:py-28 lg:px-16">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal from="right">
          <Parallax
            distance={80}
            scale
            className="overflow-hidden"
            style={{ border: '0.5px solid rgba(201,168,76,0.16)', height: 'clamp(300px,42vw,460px)' }}
          >
            <Photo
              src="rail"
              alt="A curated clothing rail in neutral tones"
              w={1100} h={825}
              className="h-full w-full object-cover"
            />
          </Parallax>
        </Reveal>

        <div>
          <h2
            className="font-cormorant"
            style={{ fontSize: 'clamp(28px,3.8vw,52px)', fontWeight: 400, lineHeight: 1.15 }}
          >
            <MaskLine as="span" text="Photograph it once." className="block" />
            <MaskLine as="span" text="See it forever." delay={0.2} className="block" style={{ color: GOLD_LIGHT, fontStyle: 'italic' }} />
          </h2>
          <Reveal delay={0.3} blur>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed" style={{ color: MUTED }}>
              The background drops away on the phone itself. Nothing waits on a
              server, and your closet turns into a grid you can actually look
              through.
            </p>
          </Reveal>
          <ul className="mt-8 flex flex-col gap-4">
            {points.map((point, i) => (
              <Reveal key={point} from="right" delay={0.36 + i * 0.1}>
                <li className="flex gap-3 text-[14px]" style={{ color: 'rgba(255,255,255,0.56)', lineHeight: 1.65 }}>
                  <span aria-hidden style={{ color: GOLD }}>+</span>
                  {point}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

// ── 7. WHO IT IS FOR ──────────────────────────────── centred statement ──
function WhoFor() {
  return (
    <section className="px-6 py-24 md:px-12 md:py-32 lg:px-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="font-cormorant"
          style={{ fontSize: 'clamp(26px,3.4vw,46px)', fontWeight: 400, lineHeight: 1.22 }}
        >
          <MaskLine as="span" text="For people who own plenty" className="block" />
          <MaskLine as="span" text="and wear a fraction of it." delay={0.2} className="block" style={{ color: GOLD_LIGHT, fontStyle: 'italic' }} />
        </h2>
        <Reveal delay={0.35} blur>
          <p className="mx-auto mt-7 max-w-lg text-[15px] leading-relaxed" style={{ color: MUTED }}>
            Fluntr is not open yet. We are building it with the people on the
            waitlist, which is why the list is short and the questions are real.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// ── 8. WAITLIST ───────────────────────────────────────────── centred CTA ──
function Waitlist() {
  return (
    <section
      id="waitlist"
      className="relative overflow-hidden px-6 py-28 text-center md:py-36"
      style={{ background: '#111113', borderTop: '0.5px solid rgba(201,168,76,0.1)' }}
    >
      <Orb left="50%" top="50%" size={760} pulse />
      <div className="relative z-10 mx-auto max-w-md">
        <h2 className="font-cormorant" style={{ fontSize: 'clamp(32px,4.6vw,60px)', fontWeight: 400, lineHeight: 1.1 }}>
          <MaskLine as="span" text="Get in early." />
        </h2>
        <Reveal delay={0.25} blur>
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
        <Drift />
        <Problem />
        <JourneyStage />
        <Social />
        <Promise_ />
        <WhoFor />
        <Waitlist />
      </main>
      <Footer />
    </>
  )
}
