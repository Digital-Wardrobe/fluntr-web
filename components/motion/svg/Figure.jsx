'use client'
import { motion, useTransform } from 'framer-motion'

/**
 * A person at an arched mirror, taking the selfie that starts the whole
 * product. Driven entirely by one scroll MotionValue so it stays in lockstep
 * with the rest of the stage.
 *
 * What moves, and when (p = 0..1 across the pinned section):
 *   0.00 .. 0.08  she walks in from the left
 *   0.08 .. 0.16  the arm comes up, phone to the mirror
 *   0.17 .. 0.21  flash
 *   0.21 ..       arm lowers, she watches what happens next
 *
 * The expression is four crossfaded mouth/brow pairs rather than a path morph.
 * Morphing `d` needs a plugin and buys nothing here: nobody can tell the
 * difference at this size, and a crossfade cannot produce a broken in-between
 * frame.
 */

const SKIN = '#D9B89C'
const SKIN_DARK = '#C49E80'
const HAIR = '#36291F'
const HAIR_HI = '#5A422F'
const DRESS = '#2F3744'
const DRESS_HI = '#3C4654'

export default function Figure({ p }) {
  // Walk-in. She enters from outside the mirror and settles at centre.
  const walkX = useTransform(p, [0, 0.075], [-128, 0])
  const walkOpacity = useTransform(p, [0, 0.025], [0, 1])
  // A small vertical bob while the legs are moving, flat once she has arrived.
  const bob = useTransform(p, [0, 0.02, 0.04, 0.06, 0.075], [0, -5, 0, -4, 0])

  // Arm: starts hanging (58deg from the raised pose), comes up for the shot,
  // then relaxes part-way so she is still holding the phone, looking at it.
  const armRotate = useTransform(p, [0.075, 0.15, 0.22, 0.3], [58, 0, 0, 14])

  // Flash. Short and sharp, with a bloom that outlives the core by a frame or two.
  const flashCore = useTransform(p, [0.168, 0.182, 0.2, 0.225], [0, 1, 0.55, 0])
  const flashBloom = useTransform(p, [0.168, 0.19, 0.26], [0, 0.75, 0])

  // Shutter ring contracting on the phone.
  const shutterScale = useTransform(p, [0.16, 0.2], [1.5, 0.2])
  const shutterOpacity = useTransform(p, [0.155, 0.17, 0.205], [0, 0.9, 0])

  // Expression. Four states, crossfaded: resigned, concentrating, watching, delighted.
  const eResigned = useTransform(p, [0, 0.07, 0.1], [1, 1, 0])
  const eFocused = useTransform(p, [0.07, 0.11, 0.21, 0.26], [0, 1, 1, 0])
  const eWatching = useTransform(p, [0.23, 0.3, 0.76, 0.82], [0, 1, 1, 0])
  const eDelighted = useTransform(p, [0.78, 0.86], [0, 1])

  // She leans in slightly to look at the phone, then straightens with the grin.
  const headTilt = useTransform(p, [0.22, 0.34, 0.78, 0.88], [0, 5, 5, -3])

  // The mirror glass brightens with the flash and stays a touch warmer after.
  const glassLift = useTransform(p, [0.16, 0.2, 0.3], [0, 0.5, 0.12])

  return (
    <svg
      viewBox="0 0 420 620"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', overflow: 'visible' }}
      aria-hidden
    >
      <defs>
        <linearGradient id="fg-glass" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#1A1A1F" />
          <stop offset="55%" stopColor="#121216" />
          <stop offset="100%" stopColor="#0C0C0F" />
        </linearGradient>
        <linearGradient id="fg-frame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8F7633" />
          <stop offset="38%" stopColor="#E2C97E" />
          <stop offset="62%" stopColor="#A98B3C" />
          <stop offset="100%" stopColor="#E2C97E" />
        </linearGradient>
        <radialGradient id="fg-wash" cx="0.5" cy="0.42" r="0.62">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#C9A84C" stopOpacity="0.035" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fg-flash" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#FFF6DC" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFF6DC" stopOpacity="0" />
        </radialGradient>
        {/* Everything inside the mirror is clipped to the glass, so she can walk
            in from off-mirror and be revealed by the frame rather than sliding
            over the top of it. */}
        <clipPath id="fg-clip">
          <path d="M62,598 L62,222 A148,148 0 0 1 358,222 L358,598 Z" />
        </clipPath>
      </defs>

      {/* ── glass ─────────────────────────────────────────────── */}
      <path d="M62,598 L62,222 A148,148 0 0 1 358,222 L358,598 Z" fill="url(#fg-glass)" />

      <g clipPath="url(#fg-clip)">
        {/* a cool wash down the glass so the figure is not floating in flat black */}
        <rect x="62" y="74" width="296" height="524" fill="url(#fg-wash)" />
        <motion.rect x="62" y="74" width="296" height="524" fill="#FFF6DC" style={{ opacity: glassLift }} />

        {/* ── the figure ──────────────────────────────────────── */}
        <motion.g style={{ x: walkX, y: bob, opacity: walkOpacity }}>
          {/* Drawn at a comfortable working size, then scaled about her feet so
              she fills the arch instead of standing in a pool of empty glass. */}
          <g transform="translate(210 600) scale(1.17) translate(-210 -600)">
          {/* the arm that is not holding the phone, behind the dress so it
              reads as coming out of a sleeve rather than lying on top of it */}
          <path
            d="M178,310 Q146,350 152,398"
            stroke={SKIN}
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="152" cy="400" r="5.5" fill={SKIN} />

          {/* legs */}
          <path d="M186,432 L200,432 L203,588 L189,588 Z" fill={SKIN_DARK} />
          <path d="M222,432 L236,432 L233,588 L219,588 Z" fill={SKIN} />
          {/* shoes */}
          <path d="M184,582 L205,582 L207,596 L182,596 Z" fill="#15151A" />
          <path d="M217,582 L238,582 L240,596 L215,596 Z" fill="#15151A" />

          {/* dress */}
          <path d="M172,300 L248,300 L264,444 L156,444 Z" fill={DRESS} />
          <path d="M210,300 L248,300 L264,444 L210,444 Z" fill={DRESS_HI} />
          {/* shoulders */}
          <path d="M172,300 Q210,286 248,300 L244,314 Q210,302 176,314 Z" fill={DRESS_HI} />

          {/* neck */}
          <path d="M201,276 h18 v26 h-18 z" fill={SKIN_DARK} />

          {/* head + face, tilting */}
          <motion.g style={{ rotate: headTilt, transformBox: 'view-box', transformOrigin: '210px 296px' }}>
            {/* hair behind */}
            <path
              d="M176,256 Q174,206 210,204 Q246,206 244,256 L248,312 Q240,272 232,264 L188,264 Q180,272 172,312 Z"
              fill={HAIR}
            />
            {/* a lift down the length of the hair, or it is a silhouette-shaped
                hole in a near-black panel */}
            <path d="M177,256 Q175,214 204,207 Q187,222 184,256 L186,300 Q181,274 177,294 Z" fill={HAIR_HI} opacity="0.55" />
            {/* face */}
            <ellipse cx="210" cy="256" rx="29" ry="35" fill={SKIN} />
            {/* fringe */}
            <path d="M182,242 Q196,222 210,230 Q226,220 238,242 Q222,232 210,238 Q196,232 182,242 Z" fill={HAIR} />

            {/* eyes — blink on a loop, independent of scroll */}
            <motion.g
              animate={{ scaleY: [1, 1, 0.1, 1, 1, 1, 0.1, 1] }}
              transition={{ duration: 6.5, times: [0, 0.3, 0.325, 0.35, 0.7, 0.78, 0.805, 0.83], repeat: Infinity, ease: 'linear' }}
              style={{ transformBox: 'view-box', transformOrigin: '210px 253px' }}
            >
              <ellipse cx="199" cy="253" rx="2.9" ry="3.3" fill="#14141A" />
              <ellipse cx="221" cy="253" rx="2.9" ry="3.3" fill="#14141A" />
            </motion.g>

            {/* expression 1 — resigned */}
            <motion.g style={{ opacity: eResigned }} fill="none" strokeLinecap="round">
              <path d="M192,245 Q199,243 205,245" stroke="#2A2420" strokeWidth="1.8" />
              <path d="M215,245 Q221,243 228,245" stroke="#2A2420" strokeWidth="1.8" />
              <path d="M201,275 Q210,271 219,275" stroke="#8A5A4E" strokeWidth="2" />
            </motion.g>
            {/* expression 2 — concentrating */}
            <motion.g style={{ opacity: eFocused }} fill="none" strokeLinecap="round">
              <path d="M192,244 Q199,241 205,244" stroke="#2A2420" strokeWidth="1.8" />
              <path d="M215,244 Q221,241 228,244" stroke="#2A2420" strokeWidth="1.8" />
              <path d="M202,274 H218" stroke="#8A5A4E" strokeWidth="2" />
            </motion.g>
            {/* expression 3 — watching */}
            <motion.g style={{ opacity: eWatching }} fill="none" strokeLinecap="round">
              <path d="M192,242 Q199,238 205,241" stroke="#2A2420" strokeWidth="1.8" />
              <path d="M215,241 Q221,238 228,242" stroke="#2A2420" strokeWidth="1.8" />
              <path d="M203,274 Q210,277 217,274" stroke="#8A5A4E" strokeWidth="2" />
            </motion.g>
            {/* expression 4 — delighted */}
            <motion.g style={{ opacity: eDelighted }} strokeLinecap="round">
              <path d="M191,240 Q199,235 206,239" stroke="#2A2420" strokeWidth="1.8" fill="none" />
              <path d="M214,239 Q221,235 229,240" stroke="#2A2420" strokeWidth="1.8" fill="none" />
              <path d="M199,271 Q210,283 221,271 Q210,276 199,271 Z" fill="#8A5A4E" />
              {/* a flush of colour on the cheeks, because this is the payoff frame */}
              <ellipse cx="189" cy="264" rx="6" ry="3.6" fill="#D98878" opacity="0.5" />
              <ellipse cx="231" cy="264" rx="6" ry="3.6" fill="#D98878" opacity="0.5" />
            </motion.g>
          </motion.g>

          {/* raised arm + phone, rotating up from the shoulder */}
          <motion.g style={{ rotate: armRotate, transformBox: 'view-box', transformOrigin: '246px 312px' }}>
            <path
              d="M246,312 Q288,300 280,268"
              stroke={SKIN}
              strokeWidth="13"
              strokeLinecap="round"
              fill="none"
            />
            <g transform="rotate(-14 280 252)">
              <rect x="266" y="226" width="28" height="50" rx="6" fill="#0A0A0C" stroke="rgba(201,168,76,0.55)" strokeWidth="1.2" />
              <rect x="269" y="230" width="22" height="42" rx="3.5" fill="#1C1C22" />
              {/* what the lens sees */}
              <rect x="273" y="238" width="14" height="26" rx="2" fill="rgba(201,168,76,0.3)" />
              {/* shutter ring */}
              <motion.circle
                cx="280" cy="251" r="13"
                fill="none" stroke="#FFF6DC" strokeWidth="1.4"
                style={{ scale: shutterScale, opacity: shutterOpacity, transformBox: 'view-box', transformOrigin: '280px 251px' }}
              />
            </g>
            {/* flash at the phone */}
            <motion.circle cx="280" cy="251" r="66" fill="url(#fg-flash)" style={{ opacity: flashCore }} />
          </motion.g>
          </g>
        </motion.g>

        {/* flash filling the glass */}
        <motion.rect x="62" y="74" width="296" height="524" fill="#FFF6DC" style={{ opacity: flashBloom }} />
      </g>

      {/* ── frame, over the glass ─────────────────────────────── */}
      <path
        d="M62,598 L62,222 A148,148 0 0 1 358,222 L358,598"
        fill="none"
        stroke="url(#fg-frame)"
        strokeWidth="7"
        strokeLinecap="square"
      />
      <path
        d="M74,598 L74,224 A136,136 0 0 1 346,224 L346,598"
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="1"
      />
      {/* the floor the mirror stands on */}
      <path d="M30,598 H390" stroke="rgba(201,168,76,0.22)" strokeWidth="1" />
      <ellipse cx="210" cy="600" rx="150" ry="13" fill="rgba(0,0,0,0.55)" />
    </svg>
  )
}
