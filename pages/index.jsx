import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import WaitlistForm from '../components/WaitlistForm'
import Photo from '../components/Photo'
import Shot from '../components/Shot'
import Reveal from '../components/motion/Reveal'
import MaskLine from '../components/motion/MaskLine'
import Marquee from '../components/motion/Marquee'
import Parallax from '../components/motion/Parallax'
import TiltCard from '../components/motion/TiltCard'
import DrawLine from '../components/motion/DrawLine'
import PhoneLoop from '../components/motion/PhoneLoop'
import Demo from '../components/motion/Demo'
import Kween, { Bubble } from '../components/motion/Kween'
import Orb from '../components/motion/Orb'

/*
 * Fluntr homepage.
 *
 * The site now looks like the app: white, electric blue for anything you can
 * press, near-black ink. Panels are liquid glass over colour and photography.
 *
 * The spine is Demo: how it works as a demo you click through yourself, with
 * Kween, the closet mascot, guiding each step. Nothing is pinned to the scroll
 * any more; the page reads at normal length.
 *
 * Palette is the app's: white, grey surfaces, black for anything pressable.
 * Blue survives only on links. Kween's tangerine felt is the one colour.
 */

const INK = '#15171B'
const MUTED = '#767A85'
const ACCENT = '#15171B'

const H2 = { fontSize: 'clamp(34px,4.6vw,64px)', lineHeight: 1.04, color: INK }

// ── 1. HERO ──────────────────────────────────────────── split, device right ──
function Hero() {
  return (
    <section className="relative flex items-center overflow-hidden px-6 pb-20 pt-28 md:px-12 md:pb-24 md:pt-32 lg:px-16" style={{ minHeight: '100dvh' }}>
      <Orb left="30%" top="42%" size={900} />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(70% 50% at 85% 0%, #fff, transparent 60%)' }} />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 md:gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <Reveal from="none">
            <p className="text-eyebrow mb-6">Your closet, on your phone</p>
          </Reveal>

          <h1 className="font-serif-display" style={{ fontSize: 'clamp(44px,6.4vw,92px)', lineHeight: 0.98, letterSpacing: '-0.015em', color: INK }}>
            <MaskLine as="span" text="Your wardrobe is full." delay={0.15} className="block" />
            <MaskLine as="span" text="You still have nothing to wear." delay={0.42} className="block" style={{ color: ACCENT, fontStyle: 'italic', opacity: 0.55 }} />
          </h1>

          <Reveal delay={0.85} blur>
            <p className="mt-7 max-w-[30rem] text-[17px] leading-relaxed md:mt-8" style={{ color: MUTED }}>
              Fluntr puts every piece you own on your phone, so you can see it, plan it, and wear it.
            </p>
          </Reveal>

          <Reveal delay={1}>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#waitlist" className="btn-primary">Join the waitlist</a>
              <a href="#how" className="btn-glass glass">Watch how it works</a>
            </div>
          </Reveal>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative">
            <PhoneLoop width={300} />
            {/* Kween peeks out from behind the phone, the way she does in the app */}
            <Reveal delay={1.3} from="up" className="pointer-events-none absolute bottom-0 right-[-8%] z-20 w-[34%] lg:left-[min(-30%,-110px)] lg:right-auto lg:w-[40%]">
              <div className="relative" style={{ transform: 'rotate(-8deg)' }}>
                <div className="pointer-events-auto"><Kween size="100%" /></div>
                <div className="absolute bottom-[104%] right-[4%] lg:left-[4%] lg:right-auto" style={{ whiteSpace: 'nowrap' }}>
                  <Bubble text="Hi, I'm Kween. I live in your closet." />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── 2. THE DRIFT ────────────────────────────── two bands, opposite directions ──
function Drift() {
  return (
    <section aria-hidden className="select-none" style={{ background: '#fff' }}>
      <Marquee items={['Wedding on Saturday', 'Nothing to wear', 'Bought it twice', 'Twenty minutes at the mirror', 'Forgot you owned it']} duration={40} tone="rgba(21,23,27,0.14)" />
      <Marquee items={['See it', 'Plan it', 'Wear it', 'Share it', 'Borrow it']} reverse duration={30} tone="rgba(21,23,27,0.55)" />
    </section>
  )
}

// ── 3. THE PROBLEM ─────────────────── parallax band + typographic moments ──
function Problem() {
  const moments = [
    ['Wedding on Saturday.', 'Remembered on Friday night.'],
    ['Two of you, one mirror.', 'Twenty minutes gone, nobody happy.'],
    ['You bought it twice', 'because you forgot you owned the first one.'],
  ]
  return (
    <section style={{ background: '#fff' }}>
      <div className="px-4 pt-4 md:px-6 md:pt-6">
        <Parallax distance={120} scale className="relative h-[60vh] min-h-[380px] w-full overflow-hidden" style={{ borderRadius: 28 }}>
          <Photo src="full" alt="A wardrobe packed with shirts, sorted by colour" w={1900} h={1266} className="h-full w-full object-cover" />
        </Parallax>
      </div>
      <div className="relative -mt-[60vh] h-[60vh] min-h-[380px] px-4 md:px-6">
        <div className="relative h-full overflow-hidden" style={{ borderRadius: 28 }}>
          <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.75) 100%)' }} />
          <div className="absolute inset-x-0 bottom-0 flex items-end p-8 md:p-14">
            <div className="glass px-7 py-6 md:px-9 md:py-7" style={{ borderRadius: 24 }}>
              <h2 className="font-serif-display" style={H2}><MaskLine as="span" text="You already own enough." /></h2>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-24 pt-16 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-5xl">
          {moments.map(([a, b], i) => (
            <div key={a} className="py-7 md:py-9">
              <DrawLine delay={i * 0.05} />
              <p className="font-serif-display pt-7 md:pt-9" style={{ fontSize: 'clamp(28px,3.6vw,48px)', lineHeight: 1.15, color: INK }}>
                <MaskLine as="span" text={a} stagger={0.04} />{' '}
                <MaskLine as="span" text={b} delay={0.16} stagger={0.03} style={{ color: MUTED }} />
              </p>
            </div>
          ))}
          <Reveal delay={0.12} blur>
            <p className="mt-10 max-w-xl text-[17px] leading-relaxed" style={{ color: MUTED }}>
              None of this is a shopping problem. You just cannot see everything you have in one place.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ── 4. THE JOURNEY ─────────────────── the pinned sequence, id="how" ──
// (JourneyStage)

// ── 5. THE SOCIAL SIDE ──────────────────────── glass bento, pointer-reactive ──
function Social() {
  const card = { borderRadius: 26 }
  return (
    <section id="features" className="relative overflow-hidden px-6 py-24 md:px-12 md:py-32 lg:px-16" style={{ background: '#fff' }}>
      <Orb left="80%" top="30%" size={760} />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-eyebrow mb-5">Then it gets social</p>
        <h2 className="font-serif-display mb-12 max-w-2xl" style={H2}><MaskLine as="span" text="Ask before you commit." /></h2>

        <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <Reveal from="right" className="lg:col-span-2 lg:row-span-2">
            <TiltCard max={4} className="group glass relative flex h-full flex-col justify-between gap-8 overflow-hidden p-8 md:flex-row md:items-end md:p-10" style={card}>
              <div className="max-w-sm">
                <h3 className="mb-3 text-[22px] font-medium tracking-tight" style={{ color: INK }}>Put a look up, see what people think</h3>
                <p className="text-[15px] leading-relaxed" style={{ color: MUTED }}>While you still have time to change. Every post says which pieces made it, and which ones are already in your closet.</p>
              </div>
              <Shot src="app-feed-2" alt="A Fluntr post showing an outfit, with like, comment and share counts" width={190} className="self-center md:self-end" />
            </TiltCard>
          </Reveal>

          <Reveal from="left" delay={0.08}>
            <TiltCard className="group glass relative h-full overflow-hidden p-8" style={card}>
              <h3 className="mb-3 text-[20px] font-medium tracking-tight" style={{ color: INK }}>See the whole outfit</h3>
              <p className="text-[14.5px] leading-relaxed" style={{ color: MUTED }}>Any look breaks down into the pieces behind it, and tells you which ones you already have.</p>
            </TiltCard>
          </Reveal>

          <Reveal from="left" delay={0.14}>
            <TiltCard className="group glass-ink relative h-full overflow-hidden p-8" style={card}>
              <h3 className="mb-3 text-[20px] font-medium tracking-tight">Borrow from friends</h3>
              <p className="text-[14.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>Close friends can look through each other&apos;s closets and ask for a piece. Fluntr keeps track of who has what.</p>
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
    <section id="app" className="px-6 py-24 md:px-12 md:py-32 lg:px-16">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal from="right">
          <Parallax distance={80} scale className="overflow-hidden" style={{ borderRadius: 28, height: 'clamp(320px,44vw,500px)', boxShadow: '0 30px 70px rgba(21,23,27,0.12)' }}>
            <Photo src="rail" alt="A curated clothing rail in neutral tones" w={1100} h={825} className="h-full w-full object-cover" />
          </Parallax>
        </Reveal>

        <div>
          <p className="text-eyebrow mb-5">The app</p>
          <h2 className="font-serif-display" style={H2}>
            <MaskLine as="span" text="Photograph it once." className="block" />
            <MaskLine as="span" text="See it forever." delay={0.2} className="block" style={{ color: ACCENT, fontStyle: 'italic', opacity: 0.55 }} />
          </h2>
          <Reveal delay={0.3} blur>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed" style={{ color: MUTED }}>
              The background drops away on the phone itself. Nothing waits on a server, and your closet turns into a grid you can actually look through.
            </p>
          </Reveal>
          <ul className="mt-8 flex flex-col gap-3">
            {points.map((point, i) => (
              <Reveal key={point} from="right" delay={0.36 + i * 0.1}>
                <li className="glass flex items-center gap-3 px-5 py-3.5 text-[15px]" style={{ borderRadius: 999, color: INK }}>
                  <span aria-hidden className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: ACCENT, color: '#fff', fontSize: 11 }}>✓</span>
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
    <section className="px-6 py-24 md:px-12 md:py-32 lg:px-16" style={{ background: '#fff' }}>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif-display" style={{ fontSize: 'clamp(32px,4.4vw,60px)', lineHeight: 1.08, color: INK }}>
          <MaskLine as="span" text="For people who own plenty" className="block" />
          <MaskLine as="span" text="and wear a fraction of it." delay={0.2} className="block" style={{ color: ACCENT, fontStyle: 'italic', opacity: 0.55 }} />
        </h2>
        <Reveal delay={0.35} blur>
          <p className="mx-auto mt-7 max-w-lg text-[17px] leading-relaxed" style={{ color: MUTED }}>
            Fluntr is not open yet. We are building it with the people on the waitlist, which is why the list is short and the questions are real.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// ── 8. WAITLIST ───────────────────────────────────────────── glass panel ──
function Waitlist() {
  return (
    <section id="waitlist" className="relative overflow-hidden px-6 py-28 md:py-36">
      <Orb left="50%" top="50%" size={900} pulse />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 50% at 20% 100%, rgba(21,23,27,0.05), transparent 60%)' }} />
      <div className="relative z-10 mx-auto max-w-lg">
        <Reveal>
          <div className="glass px-7 py-10 text-center md:px-12 md:py-14" style={{ borderRadius: 32 }}>
            <h2 className="font-serif-display" style={{ fontSize: 'clamp(38px,5vw,66px)', lineHeight: 1, color: INK }}>
              <MaskLine as="span" text="Get in early." />
            </h2>
            <p className="mb-8 mt-4 text-[16px]" style={{ color: MUTED }}>Leave your number and we will tell you the day it opens.</p>
            <WaitlistForm />
          </div>
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
        <meta name="description" content="Your wardrobe is full and you still have nothing to wear. Fluntr puts every piece you own on your phone, so you can see it, plan it, and wear it." />
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
        <Demo />
        <Social />
        <Promise_ />
        <WhoFor />
        <Waitlist />
      </main>
      <Footer />
    </>
  )
}
