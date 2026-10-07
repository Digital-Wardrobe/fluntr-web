'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion'

/**
 * The journey, first person.
 *
 * You are holding the phone. The screen is the real app. You open the camera,
 * point it at your wardrobe in the mirror, tap once. The photo lifts off the
 * glass towards you, the room dissolves out of it, and the shirt that is left
 * drops back into your closet. Then everything you own comes out to float
 * around the phone, snaps back together as an outfit, and the feed arrives.
 *
 * Every garment on this stage is a real photograph with its background removed
 * by the same kind of model the app uses, not an illustration. Every screen is
 * a capture of the shipping app.
 *
 * One scroll value drives all of it. Under prefers-reduced-motion the section
 * swaps itself for the static storyboard at the bottom of this file.
 */

const BLUE = '#0047FF'
const INK = '#15171B'
const MUTED = '#767A85'

// Real cutouts. `w` is the rendered width as a fraction of the phone width,
// so a folded pair of jeans and a hanging shirt land at believable sizes.
const PIECES = [
  { src: 'teal-shirt', w: 0.2, outfit: 1.05 },
  { src: 'jeans', w: 0.34, outfit: 1.25 },
  { src: 'knit-brown', w: 0.13, outfit: 0.8 },
  { src: 'white-shirt', w: 0.22 },
  { src: 'chinos', w: 0.34 },
  { src: 'cardigan', w: 0.2 },
  { src: 'knit-cream', w: 0.34 },
  { src: 'navy-shirts', w: 0.17 },
  { src: 'linen', w: 0.34 },
]

// Where each piece floats to during the scatter beat, in phone-widths from
// the phone's centre. Hand-placed so nothing covers the headline.
const SCATTER = [
  [-1.3, -0.5], [0.95, -0.85], [-1.0, 0.55], [1.1, 0.2],
  [-1.6, 0.05], [0.85, 0.85], [-0.7, 1.05], [0.55, -1.25], [1.25, 1.0],
]

const BEATS = [
  [0.00, 0.11, 'Stand in front of your mirror.', 'Open Fluntr.'],
  [0.11, 0.20, 'One tap.', 'That is the whole chore.'],
  [0.20, 0.44, 'The room falls away', 'on the phone itself.'],
  [0.44, 0.58, 'The piece lands', 'in your closet.'],
  [0.58, 0.72, 'Every piece you own,', 'in one place.'],
  [0.72, 0.86, 'Outfits build', 'themselves.'],
  [0.86, 1.00, 'Post it. Ask.', 'Then wear it.'],
]

/* ── leaves ──────────────────────────────────────────────────────────────── */

function Caption({ p, from, to, a, b, align }) {
  const span = to - from
  const opacity = useTransform(p, [from, from + span * 0.16, to - span * 0.14, to], [0, 1, 1, 0])
  const y = useTransform(p, [from, from + span * 0.2, to - span * 0.14, to], [22, 0, 0, -18])
  return (
    <motion.p
      className={`font-serif-display absolute inset-x-0 ${align}`}
      style={{ opacity, y, fontSize: 'clamp(26px,3.4vw,50px)', lineHeight: 1.1, color: INK, willChange: 'transform, opacity' }}
    >
      {a}
      <br />
      <em style={{ color: BLUE, fontStyle: 'italic' }}>{b}</em>
    </motion.p>
  )
}

/**
 * One real garment. It has three homes over the sequence and glides between
 * them: a cell in the closet grid, a spot floating around the phone, and (for
 * the three that make the outfit) a slot in the outfit card. Everything is
 * expressed relative to the phone, so one component works at every viewport.
 */
function Piece({ p, i, piece, outfitSlot, narrow }) {
  const cols = 3
  const col = i % cols
  const row = Math.floor(i / cols)
  // closet grid cell centre, as fractions of the phone screen
  const gx = 0.17 + col * 0.33
  const gy = 0.30 + row * 0.215
  const [sx, sy] = SCATTER[i]
  const spread = narrow ? 0.72 : 1
  // arrival in the grid: the photographed shirt first, the rest in a stagger
  const arrive = i === 0 ? 0.465 : 0.485 + ((i - 1) / (PIECES.length - 1)) * 0.08

  // the three outfit pieces end in the card; the others fade out behind it
  const inOutfit = outfitSlot != null
  const ox = inOutfit ? outfitSlot[0] : 0.5
  const oy = inOutfit ? outfitSlot[1] : 0.5

  const x = useTransform(
    p,
    [arrive, 0.58, 0.63, 0.72, 0.78],
    [`${gx * 100}%`, `${gx * 100}%`, `${(0.5 + sx * spread) * 100}%`, `${(0.5 + sx * spread) * 100}%`, `${ox * 100}%`],
  )
  const y = useTransform(
    p,
    [arrive, 0.58, 0.63, 0.72, 0.78],
    [`${gy * 100}%`, `${gy * 100}%`, `${(0.5 + sy * spread) * 100}%`, `${(0.5 + sy * spread) * 100}%`, `${oy * 100}%`],
  )
  const scale = useTransform(
    p,
    [arrive - 0.001, arrive, arrive + 0.03, 0.58, 0.63, 0.72, 0.78],
    [0.3, 0.3, 1.08, 1, 1.7, 1.7, inOutfit ? piece.outfit : 0.6],
  )
  const rotate = useTransform(p, [0.58, 0.63, 0.72, 0.78], [0, (i % 2 ? 1 : -1) * (6 + (i % 3) * 4), (i % 2 ? -1 : 1) * 3, inOutfit ? (i === 0 ? -8 : i === 1 ? 6 : 10) : 0])
  const opacity = useTransform(
    p,
    [arrive, arrive + 0.012, 0.76, 0.8, 0.86, 0.9],
    [0, 1, 1, inOutfit ? 1 : 0, inOutfit ? 1 : 0, 0],
  )
  // a slow, continuous float so a scattered piece never sits dead still
  const drift = useTransform(p, v => Math.sin(v * 40 + i * 1.7) * 6)

  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y, width: `${piece.w * 100}%`, zIndex: 30 + i }}
    >
      {/* static centring on its own box: Framer owns `transform` on the child */}
      <div className="-translate-x-1/2 -translate-y-1/2">
      <motion.div style={{ scale, rotate, opacity, willChange: 'transform, opacity' }}>
      <motion.div style={{ y: drift }}>
        <Image
          src={`/images/g/${piece.src}.webp`}
          alt=""
          width={640}
          height={640}
          sizes="200px"
          style={{ width: '100%', height: 'auto', display: 'block', filter: 'drop-shadow(0 14px 22px rgba(21,23,27,0.18))' }}
        />
      </motion.div>
      </motion.div>
      </div>
    </motion.div>
  )
}

function Chip({ p, at, until = 1, label, left, top, dark = false, delayFade = 0 }) {
  const opacity = useTransform(p, [at, at + 0.02, until - 0.03 - delayFade, until - delayFade], [0, 1, 1, 0])
  const scale = useTransform(p, [at, at + 0.02, at + 0.045], [0.6, 1.12, 1])
  const y = useTransform(p, [at, until], [8, -22])
  return (
    <motion.div
      className={`${dark ? 'glass-dark' : 'glass'} absolute whitespace-nowrap`}
      style={{
        left, top, opacity, scale, y,
        padding: '8px 14px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: '-0.005em',
        color: dark ? '#fff' : INK,
        willChange: 'transform, opacity',
        zIndex: 60,
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
  const p = useSpring(scrollYProgress, { stiffness: 170, damping: 36, mass: 0.35 })

  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(max-width: 900px)')
    const sync = () => setNarrow(m.matches)
    sync()
    m.addEventListener('change', sync)
    return () => m.removeEventListener('change', sync)
  }, [])

  // ── the phone ──
  // Held, not mounted: a slow handheld drift runs the whole time, and the
  // phone leans back a touch as the photo lifts off it, then rights itself.
  const phoneRotateX = useTransform(p, [0.2, 0.3, 0.42, 0.47], [0, 6, 6, 0])
  const phoneScale = useTransform(p, [0, 0.12, 0.135, 0.17, 0.3, 0.47, 0.58, 0.63, 0.72, 0.78], [1, 1, 0.985, 1, 0.95, 1, 1, 0.92, 0.92, 1])
  const phoneY = useTransform(p, [0.58, 0.63, 0.72, 0.78], [0, 18, 18, 0])

  // screens, in order
  const createOpacity = useTransform(p, [0, 0.05, 0.08], [1, 1, 0])
  const viewfinderOpacity = useTransform(p, [0.05, 0.08, 0.145, 0.16], [0, 1, 1, 0])
  const capturedOpacity = useTransform(p, [0.145, 0.16, 0.42, 0.45], [0, 1, 1, 0])
  const closetOpacity = useTransform(p, [0.43, 0.46, 0.84, 0.88], [0, 1, 1, 0])
  const closetEmptyText = useTransform(p, [0.455, 0.46, 0.47], [1, 1, 0])
  const closetCover = useTransform(closetEmptyText, v => 1 - v)
  const outfitOpacity = useTransform(p, [0.75, 0.79, 0.86, 0.89], [0, 1, 1, 0])
  const feedOpacity = useTransform(p, [0.87, 0.92], [0, 1])

  // shutter + flash
  const shutterScale = useTransform(p, [0.11, 0.125, 0.14], [1, 0.82, 1])
  const shutterRing = useTransform(p, [0.1, 0.125, 0.15], [1, 1.5, 1])
  const flashScreen = useTransform(p, [0.125, 0.135, 0.165], [0, 1, 0])
  const flashStage = useTransform(p, [0.125, 0.14, 0.22], [0, 0.85, 0])

  // the photo card: born on the screen at the flash, lifts off, loses its room,
  // then shrinks back into the phone as the shirt drops into the closet
  const cardOpacity = useTransform(p, [0.14, 0.16, 0.44, 0.455], [0, 1, 1, 0])
  // slightly smaller than the screen once lifted, so the phone's edge shows
  // around it and it reads as a print held above the glass, not a second screen
  const cardScale = useTransform(p, [0.14, 0.2, 0.3, 0.42, 0.455], [1, 1.04, 1.08, 1.08, 0.22])
  const cardY = useTransform(p, [0.14, 0.2, 0.3, 0.42, 0.455], ['0%', '-7%', '-11%', '-11%', '-2%'])
  const cardX = useTransform(p, [0.42, 0.455], ['0%', '-12%'])
  const cardRotateX = useTransform(p, [0.2, 0.3, 0.42, 0.45], [0, 8, 8, 0])
  // The phone wrapper preserves 3D so the tilt reads as depth, which means a
  // tilted card's far edge would sink behind the screen plane. Lift it towards
  // the viewer for the whole time it is off the glass.
  const cardZ = useTransform(p, [0.14, 0.2, 0.42, 0.455], [2, 70, 70, 2])
  const roomOpacity = useTransform(p, [0.30, 0.37], [1, 0])
  const cardChrome = useTransform(p, [0.40, 0.44], [1, 0])
  const traceLength = useTransform(p, [0.305, 0.36], [0, 1])
  const traceOpacity = useTransform(p, [0.30, 0.315, 0.37, 0.395], [0, 1, 1, 0])
  // once the room is gone the shirt becomes the subject: it grows from where it
  // sat in the photo to the middle of the card
  const shirtLeft = useTransform(p, [0.36, 0.40], ['32%', '33%'])
  const shirtTop = useTransform(p, [0.36, 0.40], ['14%', '8%'])
  const shirtWidth = useTransform(p, [0.36, 0.40], ['14%', '34%'])

  // big type behind the phone for the scatter beat — the Orla moment
  const bigOpacity = useTransform(p, [0.59, 0.64, 0.72, 0.76], [0, 1, 1, 0])
  const bigX = useTransform(p, [0.59, 0.66, 0.72, 0.76], [-60, 0, 0, 40])
  const bigSpacing = useTransform(p, [0.59, 0.66], ['0.08em', '-0.03em'])

  // ambient
  const glowX = useTransform(p, [0, 0.4, 0.72, 1], narrow ? ['50%', '50%', '50%', '50%'] : ['38%', '44%', '50%', '56%'])
  const glowOpacity = useTransform(p, [0, 0.12, 0.15, 0.58, 0.72, 1], [0.6, 0.6, 1, 0.8, 1, 0.7])
  const hintOpacity = useTransform(p, [0, 0.04], [1, 0])

  if (reduce) return <JourneyStatic />

  // laid out like a flat lay, not a column: shirt left, jeans right, knit below
  const outfitSlots = { 0: [0.36, 0.42], 1: [0.68, 0.36], 2: [0.6, 0.74] }

  return (
    <section ref={sectionRef} id="how" className="relative h-[620vh] md:h-[700vh]">
      <div className="sticky top-0 overflow-hidden" style={{ height: '100dvh', background: '#F6F7F9' }}>
        {/* progress hairline */}
        <motion.div aria-hidden className="absolute left-0 top-0 z-40 h-[2px] origin-left" style={{ scaleX: p, width: '100%', background: BLUE }} />

        {/* ambient wash the glass refracts */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left: glowX, top: '48%', translateX: '-50%', translateY: '-50%',
            width: 'min(120vw,1100px)', height: 'min(120vw,1100px)', opacity: glowOpacity,
            background: 'radial-gradient(circle, rgba(0,71,255,0.13) 0%, rgba(0,71,255,0.04) 40%, transparent 65%)',
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(80% 60% at 80% 10%, rgba(255,255,255,0.9), transparent 60%)' }} />

        {/* flash across the whole stage */}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-50" style={{ opacity: flashStage, background: '#fff' }} />

        <div className="relative mx-auto h-full w-full max-w-[1500px]">
          {/* ── big type (Orla beat) ─────────────────────────── */}
          <motion.h2
            aria-hidden
            className="font-serif-display pointer-events-none absolute left-[4%] top-[10%] z-10 select-none md:top-[14%]"
            style={{
              opacity: bigOpacity, x: bigX, letterSpacing: bigSpacing,
              fontSize: 'clamp(64px,14vw,210px)', lineHeight: 0.92, color: INK,
            }}
          >
            See it<br /><em style={{ color: BLUE }}>all.</em>
          </motion.h2>

          {/* ── the phone, held ──────────────────────────────── */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: narrow ? '50%' : '46%',
              top: narrow ? '44%' : '50%',
              // 9:19.3 means height is 2.14x width; the viewport height caps the
              // width before the viewport width ever does on a laptop
              width: narrow ? 'min(60vw, 240px, 31vh)' : 'min(22vw, 300px, 36vh)',
              perspective: 1400,
            }}
          >
            <motion.div
              animate={{ x: [0, 3, -2, 0], y: [0, -2, 3, 0], rotate: [0, 0.5, -0.4, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                className="relative"
                style={{ rotateX: phoneRotateX, scale: phoneScale, y: phoneY, transformStyle: 'preserve-3d', willChange: 'transform' }}
              >
                {/* device */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    aspectRatio: '9 / 19.3',
                    borderRadius: 'clamp(26px,3vw,40px)',
                    background: '#fff',
                    border: '1px solid rgba(21,23,27,0.14)',
                    boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.9), inset 0 0 0 3px rgba(21,23,27,0.06), 0 2px 4px rgba(21,23,27,0.06), 0 50px 100px rgba(21,23,27,0.22)',
                  }}
                >
                  {/* real create screen */}
                  <motion.div className="absolute inset-0" style={{ opacity: createOpacity }}>
                    <Image src="/images/app-create.webp" alt="" width={620} height={1262} sizes="300px" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </motion.div>

                  {/* viewfinder: the wardrobe in the mirror, with glass camera chrome */}
                  <motion.div className="absolute inset-0" style={{ opacity: viewfinderOpacity }}>
                    <Image src="/images/viewfinder.webp" alt="" width={800} height={1000} sizes="300px" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div className="glass absolute left-[6%] right-[6%] top-[5%] flex items-center justify-between" style={{ borderRadius: 999, padding: '6px 10px' }}>
                      <span style={{ fontSize: 9, fontWeight: 600, color: INK }}>1x</span>
                      <span style={{ fontSize: 9, fontWeight: 500, color: INK, letterSpacing: '0.04em' }}>MIRROR</span>
                      <span style={{ width: 9, height: 9, borderRadius: 999, background: '#FF3B30' }} />
                    </div>
                    {/* framing guide */}
                    <div aria-hidden className="absolute left-[12%] right-[12%] top-[20%] bottom-[22%]" style={{ border: '1px solid rgba(255,255,255,0.55)', borderRadius: 12 }} />
                    {/* shutter */}
                    <div className="absolute inset-x-0 bottom-[5%] flex items-center justify-center">
                      <motion.div className="glass flex items-center justify-center" style={{ width: '24%', aspectRatio: '1', borderRadius: 999, scale: shutterRing }}>
                        <motion.div style={{ width: '78%', aspectRatio: '1', borderRadius: 999, background: '#fff', scale: shutterScale, boxShadow: '0 2px 10px rgba(21,23,27,0.2)' }} />
                      </motion.div>
                    </div>
                    <motion.div aria-hidden className="absolute inset-0" style={{ opacity: flashScreen, background: '#fff' }} />
                  </motion.div>

                  {/* after the shot: the screen is blank because the photo has left it */}
                  <motion.div className="absolute inset-0 flex items-end justify-center pb-[8%]" style={{ opacity: capturedOpacity, background: '#fff' }}>
                    <span className="glass" style={{ borderRadius: 999, padding: '6px 12px', fontSize: 10, fontWeight: 500, color: INK }}>1 photo · processing on device</span>
                  </motion.div>

                  {/* real closet screen, filling */}
                  <motion.div className="absolute inset-0" style={{ opacity: closetOpacity }}>
                    <Image src="/images/app-closet-empty.webp" alt="" width={620} height={1262} sizes="300px" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    {/* the "No closet items yet" line is real; it goes when the first piece lands */}
                    <motion.div className="absolute inset-x-0" style={{ top: '26%', bottom: '14%', background: '#fff', opacity: closetCover }} />
                  </motion.div>

                  {/* outfit card */}
                  <motion.div className="absolute inset-x-[7%] top-[22%] bottom-[16%] z-20" style={{ opacity: outfitOpacity }}>
                    <div className="glass h-full w-full" style={{ borderRadius: 22 }}>
                      <div className="absolute left-0 right-0 top-[5%] text-center" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: BLUE }}>SATURDAY · WEDDING</div>
                      <div className="absolute inset-x-[10%] bottom-[7%] flex items-center justify-between" style={{ fontSize: 10, color: MUTED }}>
                        <span>3 pieces</span><span style={{ color: BLUE, fontWeight: 600 }}>Wear it</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* the real feed, as the payoff */}
                  <motion.div className="absolute inset-0 z-30" style={{ opacity: feedOpacity }}>
                    <Image src="/images/app-feed.webp" alt="The Fluntr feed" width={620} height={1344} sizes="300px" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </motion.div>

                  {/* dynamic island */}
                  <div aria-hidden className="absolute left-1/2 top-[1.8%] z-40 -translate-x-1/2" style={{ width: '28%', height: '3.2%', borderRadius: 999, background: '#0A0A0C' }} />
                  {/* glass reflection on the screen */}
                  <div aria-hidden className="pointer-events-none absolute inset-0 z-40" style={{ background: 'linear-gradient(115deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.08) 100%)' }} />
                </div>

                {/* ── the garments: grid cells, then out around the phone ── */}
                {/* Outside the device on purpose. The device clips its screen, and
                    the whole point of the scatter beat is that the pieces leave it. */}
                <div className="absolute inset-x-0" style={{ top: '26%', bottom: '14%', zIndex: 45 }}>
                  {PIECES.map((piece, i) => (
                    <Piece key={piece.src} p={p} i={i} piece={piece} outfitSlot={outfitSlots[i]} narrow={narrow} />
                  ))}
                </div>

                {/* ── the photo, lifting off the glass ─────────── */}
                <motion.div
                  className="absolute z-50"
                  style={{
                    left: '7%', right: '7%', top: '13%', bottom: '15%',
                    opacity: cardOpacity, scale: cardScale, y: cardY, x: cardX, z: cardZ, rotateX: cardRotateX,
                    transformOrigin: '50% 50%', transformStyle: 'preserve-3d', willChange: 'transform, opacity',
                  }}
                >
                  <div className="relative h-full w-full overflow-visible">
                    <motion.div
                      className="absolute inset-0 overflow-hidden"
                      style={{
                        borderRadius: 18, opacity: cardChrome, background: '#fff',
                        border: '1px solid rgba(21,23,27,0.1)',
                        boxShadow: 'inset 0 0 0 6px #fff, 0 30px 70px rgba(21,23,27,0.28)',
                      }}
                    >
                      <motion.div className="absolute inset-0" style={{ opacity: roomOpacity }}>
                        <Image src="/images/viewfinder.webp" alt="" width={800} height={1000} sizes="360px" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </motion.div>
                    </motion.div>
                    {/* the shirt that survives — sits where it is in the photo */}
                    <motion.div className="absolute" style={{ left: shirtLeft, top: shirtTop, width: shirtWidth }}>
                      <Image src="/images/g/teal-shirt.webp" alt="" width={640} height={640} sizes="140px" style={{ width: '100%', height: 'auto', display: 'block', filter: 'drop-shadow(0 18px 28px rgba(21,23,27,0.22))' }} />
                      <motion.svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" style={{ opacity: traceOpacity }} aria-hidden>
                        <motion.rect x="-6" y="-4" width="112" height="108" rx="6" fill="none" stroke={BLUE} strokeWidth="1.6" strokeDasharray="4 3" style={{ pathLength: traceLength }} />
                      </motion.svg>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* chips around the phone */}
            <Chip p={p} at={0.31} until={0.43} label="Background removed · on device" left="-34%" top="24%" />
            <Chip p={p} at={0.47} until={0.58} label="+ Added to closet" left="72%" top="27%" />
            <Chip p={p} at={0.79} until={0.88} label="Built from your closet" left="-38%" top="44%" />
            <Chip p={p} at={0.9} label="♥ 142" left="-14%" top="22%" />
            <Chip p={p} at={0.925} label="that's the one" left="76%" top="36%" dark />
            <Chip p={p} at={0.95} label="where's the shirt from?" left="-36%" top="64%" />
          </div>

          {/* ── captions ─────────────────────────────────────── */}
          <div
            className={`pointer-events-none absolute z-40 ${narrow ? 'inset-x-0 px-6' : 'right-[6%] w-[30%]'}`}
            style={narrow ? { bottom: 'clamp(22px,5vh,60px)' } : { top: '50%', transform: 'translateY(-50%)' }}
          >
            <div className={`relative h-[5em] ${narrow ? 'mx-auto max-w-md' : ''}`} style={{ fontSize: 'clamp(26px,3.4vw,50px)' }}>
              {BEATS.map(([from, to, a, b]) => (
                <Caption key={a} p={p} from={from} to={to} a={a} b={b} align={narrow ? 'text-center' : 'text-left'} />
              ))}
            </div>
          </div>

          {/* ── scroll hint ──────────────────────────────────── */}
          <motion.div aria-hidden className="absolute left-1/2 -translate-x-1/2" style={{ bottom: 14, opacity: hintOpacity }}>
            <motion.div animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="text-eyebrow">
              Scroll
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── reduced-motion fallback ─────────────────────────────────────────────── */

function JourneyStatic() {
  const frames = [
    ['Mirror', 'Stand in front of your mirror and open Fluntr.'],
    ['One tap', 'Take a single photo. That is the whole chore.'],
    ['Cut out', 'The room falls away on the phone itself.'],
    ['Closet', 'The piece lands in your closet.'],
    ['See it all', 'Do it a few times and you can finally see everything you own.'],
    ['Outfit', 'Outfits build themselves.'],
    ['Wear it', 'Post it, ask, then wear it.'],
  ]
  return (
    <section id="how" className="px-6 py-24 md:px-12 md:py-32 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-eyebrow mb-6">How it works</p>
        <h2 className="font-serif-display mb-14 max-w-2xl" style={{ fontSize: 'clamp(32px,4.4vw,60px)', lineHeight: 1.05 }}>
          One photo in the mirror, and the rest follows.
        </h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {frames.map(([title, body], i) => (
            <li key={title} className="glass h-full p-7" style={{ borderRadius: 22 }}>
              <span className="font-serif-display block" style={{ fontSize: 30, color: BLUE }}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mb-2 mt-1 text-[17px] font-medium">{title}</h3>
              <p className="text-[14px] leading-relaxed" style={{ color: MUTED }}>{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
