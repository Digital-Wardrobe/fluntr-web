'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import Figure from './svg/Figure'
import Garment from './svg/Garment'

/**
 * The journey, as one pinned scroll-scrubbed sequence.
 *
 * This is the spine of the page. A visitor should be able to scroll through it
 * once and know exactly what the app does, without reading a word: she walks up
 * to a mirror, takes one photo, the photo leaves the camera, the room is
 * stripped out of it, the garment lands in a closet grid, the grid builds an
 * outfit, and she is pleased about it.
 *
 * Everything hangs off a single scroll progress value so nothing can drift out
 * of step. The value is spring-smoothed, which is what makes a trackpad scrub
 * feel like film rather than like dragging a slider.
 *
 * Under prefers-reduced-motion the whole thing collapses to a static storyboard
 * further down this file. No pin, no scrub, same story.
 */

const GOLD = '#C9A84C'
const GOLD_LIGHT = '#E2C97E'

// The twelve pieces that fill the closet. Index 0 is the one she photographs,
// so it has to match the garment on the travelling card.
const CLOSET = [
  ['tee', '#C9A84C'], ['trousers', '#3F4A5C'], ['jacket', '#6E4A3A'], ['dress', '#8A4A52'],
  ['shirt', '#D8CFC0'], ['skirt', '#2E3A2F'], ['shoe', '#1F1F24'], ['bag', '#A9843F'],
  ['tee', '#8A95A5'], ['dress', '#B8503C'], ['shirt', '#5A6B7A'], ['skirt', '#9A8A6A'],
]

const BEATS = [
  [0.00, 0.13, 'A full wardrobe,', 'and nothing to wear.'],
  [0.13, 0.26, 'So she takes one photo', 'in the mirror.'],
  [0.26, 0.44, 'The photo leaves the camera', 'on its own.'],
  [0.44, 0.56, 'The room falls away.', 'The piece stays.'],
  [0.56, 0.72, 'Every piece lands', 'in her closet.'],
  [0.72, 0.86, 'The outfit assembles', 'itself.'],
  [0.86, 1.00, 'Saturday is already', 'decided.'],
]

/* ── leaves ──────────────────────────────────────────────────────────────── */

function Caption({ p, from, to, a, b }) {
  const span = to - from
  const opacity = useTransform(p, [from, from + span * 0.18, to - span * 0.14, to], [0, 1, 1, 0])
  const y = useTransform(p, [from, from + span * 0.22, to - span * 0.14, to], [26, 0, 0, -22])
  return (
    <motion.p
      className="font-cormorant absolute inset-x-0 text-center"
      style={{
        opacity, y,
        fontSize: 'clamp(19px,2.5vw,34px)',
        lineHeight: 1.25,
        fontWeight: 400,
        willChange: 'transform, opacity',
      }}
    >
      {a}
      <br />
      <em style={{ color: GOLD_LIGHT, fontStyle: 'italic' }}>{b}</em>
    </motion.p>
  )
}

/** One closet cell. Pops in on a spring when the scrub reaches its turn. */
function Cell({ p, i, kind, tone }) {
  // Cell 0 is the piece she just photographed, so it arrives first and alone.
  const start = i === 0 ? 0.565 : 0.6 + ((i - 1) / (CLOSET.length - 1)) * 0.095
  const opacity = useTransform(p, [start, start + 0.03, 0.72, 0.765], [0, 1, 1, 0])
  const scale = useTransform(p, [start, start + 0.025, start + 0.05], [0.4, 1.12, 1])
  return (
    <motion.div
      className="flex items-center justify-center"
      style={{
        opacity, scale,
        aspectRatio: '3 / 4',
        background: i === 0 ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.035)',
        border: i === 0 ? '0.5px solid rgba(201,168,76,0.45)' : '0.5px solid rgba(255,255,255,0.07)',
        willChange: 'transform, opacity',
      }}
    >
      <Garment kind={kind} tone={tone} size="78%" />
    </motion.div>
  )
}

/** A piece sliding in to build the outfit. */
function OutfitPiece({ p, kind, tone, fromX, fromY, at, width }) {
  const opacity = useTransform(p, [at, at + 0.02, 0.87, 0.9], [0, 1, 1, 0])
  const x = useTransform(p, [at, at + 0.055], [fromX, 0])
  const y = useTransform(p, [at, at + 0.055], [fromY, 0])
  const rotate = useTransform(p, [at, at + 0.055], [fromX > 0 ? 16 : -16, 0])
  return (
    <motion.div
      style={{ opacity, x, y, rotate, width, aspectRatio: '1 / 1', willChange: 'transform, opacity' }}
    >
      <Garment kind={kind} tone={tone} size="100%" />
    </motion.div>
  )
}

/** A reaction floating off the final frame. The "emotion" beat. */
function Bubble({ p, at, label, left, top, tone }) {
  const opacity = useTransform(p, [at, at + 0.025, 0.985, 1], [0, 1, 1, 0.7])
  const y = useTransform(p, [at, 1], [18, -42])
  const scale = useTransform(p, [at, at + 0.02, at + 0.045], [0.5, 1.18, 1])
  return (
    <motion.div
      className="absolute whitespace-nowrap"
      style={{
        left, top, opacity, y, scale,
        padding: '6px 13px',
        borderRadius: 999,
        fontSize: 11,
        letterSpacing: '0.08em',
        color: tone || GOLD_LIGHT,
        background: 'rgba(12,12,15,0.9)',
        border: `0.5px solid ${tone ? 'rgba(216,120,104,0.45)' : 'rgba(201,168,76,0.45)'}`,
        backdropFilter: 'blur(6px)',
        willChange: 'transform, opacity',
      }}
    >
      {label}
    </motion.div>
  )
}

/* ── the stage ───────────────────────────────────────────────────────────── */

export default function JourneyStage() {
  const reduce = useReducedMotion()
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  // Spring-smoothed: a wheel notch should glide the sequence, not step it.
  const p = useSpring(scrollYProgress, { stiffness: 190, damping: 38, mass: 0.35 })

  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(max-width: 900px)')
    const sync = () => setNarrow(m.matches)
    sync()
    m.addEventListener('change', sync)
    return () => m.removeEventListener('change', sync)
  }, [])

  /* The travelling photo card's path, in fractions of the stage box, so it
     lands correctly at any viewport without measuring anything. */
  const path = narrow
    ? { born: [0.62, 0.25], mid: [0.52, 0.40], show: [0.50, 0.45], land: [0.50, 0.52] }
    : { born: [0.345, 0.40], mid: [0.50, 0.33], show: [0.525, 0.47], land: [0.735, 0.47] }

  const cardXf = useTransform(
    p,
    [0.185, 0.30, 0.42, 0.56, 0.60],
    [path.born[0], path.mid[0], path.show[0], path.show[0], path.land[0]],
  )
  const cardYf = useTransform(
    p,
    [0.185, 0.30, 0.42, 0.56, 0.60],
    [path.born[1], path.mid[1], path.show[1], path.show[1], path.land[1]],
  )
  const cardLeft = useTransform(cardXf, v => `${v * 100}%`)
  const cardTop = useTransform(cardYf, v => `${v * 100}%`)
  const cardScale = useTransform(p, [0.185, 0.22, 0.30, 0.42, 0.56, 0.60], [0.12, 0.45, 1, 1.04, 1.04, 0.2])
  const cardRotate = useTransform(p, [0.185, 0.30, 0.42, 0.60], [-16, 6, 0, 0])
  const cardOpacity = useTransform(p, [0.185, 0.215, 0.585, 0.605], [0, 1, 1, 0])

  // The cut-out: backdrop dissolves, a dashed outline traces the garment.
  const backdropOpacity = useTransform(p, [0.44, 0.53], [1, 0])
  const traceLength = useTransform(p, [0.445, 0.525], [0, 1])
  const traceOpacity = useTransform(p, [0.44, 0.46, 0.53, 0.56], [0, 1, 1, 0])
  const chromeOpacity = useTransform(p, [0.50, 0.57], [1, 0])

  // Mirror: on a phone it hands over to the app screen; on a desktop both stay.
  // On a desktop she dims while the phone has the floor, then comes back up for
  // the last beat — the whole point of that beat is her face, so leaving her at
  // 42% through it would throw away the payoff.
  const mirrorOpacity = useTransform(
    p,
    narrow ? [0.36, 0.48] : [0.30, 0.46, 0.80, 0.9],
    narrow ? [1, 0] : [1, 0.4, 0.4, 0.95],
  )
  const mirrorScale = useTransform(
    p,
    narrow ? [0.36, 0.48] : [0.30, 0.46, 0.80, 0.9],
    narrow ? [1, 0.84] : [1, 0.9, 0.9, 1],
  )
  const mirrorX = useTransform(p, [0.30, 0.46], [0, narrow ? 0 : -34])

  // App phone.
  const phoneOpacity = useTransform(p, narrow ? [0.40, 0.50] : [0.30, 0.42], [0, 1])
  const phoneX = useTransform(p, narrow ? [0.40, 0.50] : [0.30, 0.42], [narrow ? 0 : 58, 0])
  const phoneScale = useTransform(p, narrow ? [0.40, 0.50] : [0.30, 0.42], [0.9, 1])

  // Screen states inside the app phone.
  const gridOpacity = useTransform(p, [0.46, 0.52, 0.72, 0.765], [0, 1, 1, 0])
  const outfitOpacity = useTransform(p, [0.72, 0.76, 0.87, 0.9], [0, 1, 1, 0])
  const shotOpacity = useTransform(p, [0.87, 0.93], [0, 1])
  const outfitRule = useTransform(p, [0.83, 0.86], [0, 1])

  // Ambient: the gold wash tracks the action across the stage.
  const glowLeft = useTransform(p, [0.1, 0.5, 0.9], narrow ? ['50%', '50%', '50%'] : ['30%', '52%', '72%'])
  const glowOpacity = useTransform(p, [0, 0.18, 0.2, 0.9, 1], [0.35, 0.35, 0.8, 0.6, 0.35])

  // Scroll hint, only while the sequence has not started moving.
  const hintOpacity = useTransform(p, [0, 0.04], [1, 0])

  if (reduce) return <JourneyStatic />

  return (
    <section ref={sectionRef} id="how" className="relative h-[560vh] md:h-[660vh]">
      <div className="sticky top-0 overflow-hidden" style={{ height: '100dvh' }}>
        {/* progress, so a pinned section does not feel like a stuck page */}
        <motion.div
          aria-hidden
          className="absolute left-0 top-0 z-30 h-px origin-left"
          style={{ scaleX: p, width: '100%', background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})` }}
        />

        {/* ambient wash */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left: glowLeft, top: '46%', translateX: '-50%', translateY: '-50%',
            width: 'min(140vw,1000px)', height: 'min(140vw,1000px)',
            opacity: glowOpacity,
            background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 62%)',
          }}
        />

        <div className="relative mx-auto h-full w-full max-w-[1500px]">
          {/* ── mirror + figure ──────────────────────────────── */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: narrow ? '50%' : '27%',
              top: narrow ? '31%' : '49%',
              // Both axes are capped so the mirror fits a short laptop window as
              // well as a tall one; the SVG letterboxes inside whichever wins.
              width: narrow ? 'min(74vw, 320px, 34vh)' : 'min(34vw, 400px, 48vh)',
              height: narrow ? 'min(50vh, 470px)' : 'min(72vh, 600px)',
            }}
          >
            <motion.div
              className="h-full w-full"
              style={{ opacity: mirrorOpacity, scale: mirrorScale, x: mirrorX, willChange: 'transform, opacity' }}
            >
              <Figure p={p} />
            </motion.div>
          </div>

          {/* ── app phone ────────────────────────────────────── */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: narrow ? '50%' : '73.5%',
              top: narrow ? '45%' : '47%',
              // 9:19.2 means height is 2.13x width, so the viewport height caps
              // the width before the viewport width ever does on a laptop.
              width: narrow ? 'min(60vw, 224px, 30vh)' : 'min(21vw, 268px, 33vh)',
            }}
          >
          <motion.div
            style={{ opacity: phoneOpacity, scale: phoneScale, x: phoneX, willChange: 'transform, opacity' }}
          >
            <div
              className="relative overflow-hidden"
              style={{
                aspectRatio: '9 / 19.2',
                borderRadius: 'clamp(20px,2.4vw,30px)',
                border: '1px solid rgba(201,168,76,0.3)',
                background: '#0A0A0C',
                boxShadow: '0 40px 90px rgba(0,0,0,0.7)',
              }}
            >
              {/* closet grid */}
              <motion.div className="absolute inset-0 flex flex-col px-[7%] pb-[7%] pt-[13%]" style={{ opacity: gridOpacity }}>
                <p className="mb-[5%] text-[9px] uppercase" style={{ color: GOLD, letterSpacing: '0.22em' }}>
                  Your closet
                </p>
                <div className="grid grid-cols-3 gap-[5%]">
                  {CLOSET.map(([kind, tone], i) => (
                    <Cell key={`${kind}-${i}`} p={p} i={i} kind={kind} tone={tone} />
                  ))}
                </div>
              </motion.div>

              {/* outfit assembly */}
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
                style={{ opacity: outfitOpacity, background: '#0A0A0C' }}
              >
                <p className="mb-[6%] text-[9px] uppercase" style={{ color: GOLD, letterSpacing: '0.22em' }}>
                  Saturday &middot; Wedding
                </p>
                {/* Each piece slides in from just outside the screen edge, not
                    from a fixed pixel offset: a 130px throw is most of a phone
                    wide and the piece arrives from off-stage entirely. */}
                <OutfitPiece p={p} kind="jacket" tone="#6E4A3A" fromX={-78} fromY={-26} at={0.735} width="56%" />
                <OutfitPiece p={p} kind="trousers" tone="#3F4A5C" fromX={84} fromY={8} at={0.775} width="56%" />
                <OutfitPiece p={p} kind="shoe" tone="#1F1F24" fromX={-70} fromY={34} at={0.815} width="40%" />
                <motion.div
                  className="mt-[6%] h-px"
                  style={{ width: '46%', background: 'rgba(201,168,76,0.5)', scaleX: outfitRule }}
                />
              </motion.div>

              {/* the real app, as the payoff */}
              <motion.div className="absolute inset-0" style={{ opacity: shotOpacity }}>
                <Image
                  src="/images/app-feed.webp"
                  alt="The Fluntr feed, showing outfit posts"
                  width={620}
                  height={1344}
                  sizes="(max-width: 900px) 60vw, 21vw"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </motion.div>

              {/* notch */}
              <div
                aria-hidden
                className="absolute left-1/2 top-[2.5%] z-10 -translate-x-1/2"
                style={{ width: '26%', height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.18)' }}
              />
            </div>

            {/* reactions, floating off the final frame */}
            <Bubble p={p} at={0.9} label="♥ 142" left="-14%" top="22%" />
            <Bubble p={p} at={0.925} label="that's the one" left="78%" top="34%" tone="#E9A08E" />
            <Bubble p={p} at={0.95} label="where's the jacket from?" left="-32%" top="62%" />
          </motion.div>
          </div>

          {/* ── the travelling photo ─────────────────────────── */}
          <motion.div
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: cardLeft,
              top: cardTop,
              width: narrow ? 'min(42vw, 168px)' : 'min(15vw, 196px)',
            }}
          >
          <motion.div
            style={{ opacity: cardOpacity, scale: cardScale, rotate: cardRotate, willChange: 'transform, opacity' }}
          >
            <div className="relative" style={{ aspectRatio: '4 / 5' }}>
              {/* the photo as shot: room, light, the lot */}
              <motion.div
                className="absolute inset-0"
                style={{
                  opacity: backdropOpacity,
                  background: 'linear-gradient(160deg,#2A2721 0%,#1A1A20 48%,#121215 100%)',
                }}
              >
                <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(120% 80% at 70% 15%, rgba(255,246,220,0.14), transparent 60%)' }} />
                {/* a hint of the room behind her: door frame, skirting */}
                <div aria-hidden className="absolute" style={{ left: '12%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.08)' }} />
                <div aria-hidden className="absolute" style={{ right: '16%', top: '8%', bottom: 0, width: 1, background: 'rgba(255,255,255,0.05)' }} />
                <div aria-hidden className="absolute" style={{ left: 0, right: 0, bottom: '11%', height: 1, background: 'rgba(255,255,255,0.07)' }} />
              </motion.div>

              {/* card chrome, gone once the cut-out is done */}
              <motion.div
                className="absolute inset-0"
                style={{ opacity: chromeOpacity, border: '1px solid rgba(201,168,76,0.4)', boxShadow: '0 26px 60px rgba(0,0,0,0.65)' }}
              />

              {/* the piece itself, which survives all of this */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Garment kind="tee" tone={GOLD} size="62%" />
              </div>

              {/* the cut line being traced */}
              <motion.svg
                viewBox="0 0 100 125"
                className="absolute inset-0 h-full w-full"
                style={{ opacity: traceOpacity, overflow: 'visible' }}
                aria-hidden
              >
                <motion.path
                  d="M31,41 L43,33 Q50,43 57,33 L69,41 L78,59 L68,65 L68,110 L32,110 L32,65 L22,59 Z"
                  fill="none"
                  stroke={GOLD_LIGHT}
                  strokeWidth="1.1"
                  strokeDasharray="3 2.5"
                  style={{ pathLength: traceLength }}
                />
              </motion.svg>

              {/* label, so the mechanic is named not just shown */}
              <motion.p
                className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase"
                style={{
                  top: '103%',
                  opacity: traceOpacity,
                  color: GOLD,
                  letterSpacing: '0.2em',
                }}
              >
                Background removed on your phone
              </motion.p>
            </div>
          </motion.div>
          </motion.div>

          {/* ── captions ─────────────────────────────────────── */}
          <div
            className="pointer-events-none absolute inset-x-0 px-6"
            style={{ bottom: 'clamp(28px,7vh,78px)' }}
          >
            <div className="relative mx-auto h-[4.6em] max-w-xl">
              {BEATS.map(([from, to, a, b]) => (
                <Caption key={a} p={p} from={from} to={to} a={a} b={b} />
              ))}
            </div>
          </div>

          {/* ── scroll hint ──────────────────────────────────── */}
          <motion.div
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: 14, opacity: hintOpacity }}
          >
            <motion.div
              animate={{ y: [0, 9, 0], opacity: [0.35, 0.9, 0.35] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
              className="text-[9px] uppercase"
              style={{ color: GOLD, letterSpacing: '0.3em' }}
            >
              Scroll
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── reduced-motion fallback ─────────────────────────────────────────────── */

/**
 * Same seven beats, no pin and no scrub. Someone who has asked their OS to stop
 * animations still gets the whole story, just read rather than watched.
 */
function JourneyStatic() {
  const frames = [
    ['Mirror', 'A full wardrobe, and nothing to wear.'],
    ['One photo', 'She takes a single shot in the mirror.'],
    ['It travels', 'The photo leaves the camera on its own.'],
    ['Cut out', 'The room falls away. The piece stays.'],
    ['Closet', 'Every piece lands in her closet.'],
    ['Outfit', 'The outfit assembles itself.'],
    ['Decided', 'Saturday is already sorted.'],
  ]
  return (
    <section id="how" className="px-6 py-24 md:px-12 md:py-32 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-6 text-[11px] uppercase" style={{ color: GOLD, letterSpacing: '0.3em' }}>
          How it works
        </p>
        <h2 className="font-cormorant mb-14 max-w-2xl" style={{ fontSize: 'clamp(28px,3.8vw,52px)', fontWeight: 400, lineHeight: 1.15 }}>
          One photo in the mirror, and the rest follows.
        </h2>
        <ol className="grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: 'rgba(201,168,76,0.13)' }}>
          {frames.map(([title, body], i) => (
            <li key={title} className="h-full p-8" style={{ background: '#09090b' }}>
              <span className="font-cormorant block" style={{ fontSize: 30, color: 'rgba(201,168,76,0.4)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-cormorant mb-2 mt-1" style={{ fontSize: 22, fontWeight: 400 }}>{title}</h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.56)' }}>{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
