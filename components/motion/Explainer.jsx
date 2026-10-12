'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useTransform } from 'framer-motion'
import Kween from './Kween'
import { Photo, Cut, Glyph } from './Demo'
import { Mark } from '../Logo'
import { FaceArt, SKIN, SUITS, SKIP } from './Colours'
import { useSound } from './Sound'
import { KweenPerch } from './KweenRoamer'
import { kweenSay } from './kweenStore'
import { track } from '../../lib/analytics'

/**
 * "What is Fluntr?" in five short animated bites, played like Instagram
 * stories: progress bars on top, tap to skip, about six seconds a bite so
 * there is time to read each one (30 seconds in all). A
 * first-time visitor should understand the product before they are asked to
 * try it, and these say it in the plainest words we have.
 *
 * Every bite is drawn on a fixed 360x640 canvas and scaled to fit, so it looks
 * the same on a phone and a laptop, and can be recorded as a 1080x1920 reel.
 */

const W = 360
const H = 640
const INK = '#121317'
const MUTED = '#5E6373'
const SOFT = '#F5F5F7'

export const BITES = [
  { k: 'snap', tone: '#F28C38', bg: 'linear-gradient(180deg,#FFF3E8 0%,#FFFFFF 70%)', ms: 6000,
    say: 'Step one: show me your clothes.', mood: 'happy',
    tag: 'Your closet', title: 'Your clothes, on your phone.', sub: 'Click a photo once. Sorted for you.' },
  { k: 'colours', tone: '#E0457B', bg: 'linear-gradient(180deg,#FFEAF1 0%,#FFFFFF 70%)', ms: 6200,
    say: 'Ooh. Olive is SO your colour.', mood: 'love',
    tag: 'Your colours', title: 'Kween learns your colours.', sub: 'One selfie. The shades that suit you.' },
  { k: 'kween', tone: '#2E8FA3', bg: 'linear-gradient(180deg,#E6F4F7 0%,#FFFFFF 70%)', ms: 6200,
    say: 'That’s me. I pick your outfits.', mood: 'smug',
    tag: 'Every day', title: 'Every morning, your outfit.', sub: 'Your clothes. Your colours. Your weather.' },
  { k: 'plans', tone: '#7B6CF6', bg: 'linear-gradient(180deg,#EFEDFF 0%,#FFFFFF 70%)', ms: 6000,
    say: 'Interview on Monday? Sorted.', mood: 'happy',
    tag: 'Plans', title: 'Every plan, planned.', sub: 'Interviews, parties, weddings, trips. Ready days ahead.' },
  { k: 'shop', tone: '#4F9D6B', bg: 'linear-gradient(180deg,#E9F5EE 0%,#FFFFFF 70%)', ms: 6600,
    say: 'Missing something? I’ll find it.', mood: 'smug',
    tag: 'Shopping', title: 'Missing something? She shops.', sub: 'Only if you say yes. Best price, in time, or nearby.' },
]

const spring = { type: 'spring', stiffness: 320, damping: 24 }
const pop = (delay = 0) => ({ initial: { opacity: 0, scale: 0.6, y: 10 }, animate: { opacity: 1, scale: 1, y: 0 }, transition: { ...spring, delay } })

function Tile({ id, size = 84, delay = 0, style }) {
  return (
    <motion.div {...pop(delay)} className="relative overflow-hidden" style={{ width: size, height: size, borderRadius: 16, background: SOFT, boxShadow: '0 6px 16px rgba(18,19,23,0.08)', ...style }}>
      <div className="absolute inset-[10%]"><Cut id={id} /></div>
    </motion.div>
  )
}

/* ── the five scenes, each in a 360 x 330 box ───────────────────────────── */

function Snap({ play }) {
  useEffect(() => { const t = setTimeout(() => play('shutter', { gain: 0.7 }), 1600); return () => clearTimeout(t) }, [play])
  return (
    <div className="absolute inset-0">
      <motion.div className="absolute overflow-hidden" style={{ left: 34, top: 8, width: 168, height: 312, borderRadius: 30, background: '#111', border: '6px solid #1B1C20', boxShadow: '0 24px 50px rgba(18,19,23,0.25)' }} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <div className="absolute inset-0"><Photo src="kurta-set" sizes="170px" /></div>
        {/* viewfinder */}
        {[[10, 34, '0 0'], [130, 34, '90deg'], [10, 214, '-90deg'], [130, 214, '180deg']].map(([l, t, r], n) => (
          <span key={n} className="absolute" style={{ left: l, top: t, width: 18, height: 18, borderTop: '3px solid #fff', borderLeft: '3px solid #fff', borderRadius: '4px 0 0 0', transform: `rotate(${r})`, transformOrigin: '9px 9px', opacity: 0.95 }} />
        ))}
        <motion.span className="absolute left-1/2 -translate-x-1/2" style={{ bottom: 14, width: 48, height: 48, borderRadius: 999, border: '4px solid #fff', background: 'rgba(255,255,255,0.35)' }} animate={{ scale: [1, 1, 0.82, 1] }} transition={{ duration: 2.0, times: [0, 0.72, 0.8, 1] }} />
        <motion.div className="absolute inset-0" style={{ background: '#fff' }} initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 0.95, 0] }} transition={{ duration: 2.3, times: [0, 0.69, 0.74, 1] }} />
      </motion.div>
      <div className="absolute flex flex-col gap-3" style={{ left: 226, top: 30 }}>
        {['kurta-set', 'juttis', 'denim-jacket'].map((id, n) => (
          <motion.div key={id} className="overflow-hidden" style={{ width: 92, height: 76, borderRadius: 14, boxShadow: '0 10px 20px rgba(18,19,23,0.14)', border: '3px solid #fff' }} initial={{ opacity: 0, x: -60, scale: 0.5 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ ...spring, delay: 2.4 + n * 0.45 }}>
            <Photo src={id} sizes="92px" />
          </motion.div>
        ))}
        <motion.span {...pop(3.8)} className="text-center" style={{ fontSize: 13, fontWeight: 800, color: '#F28C38' }}>+3 added</motion.span>
      </div>
    </div>
  )
}

function ColoursScene({ play }) {
  const [read, setRead] = useState(false)
  useEffect(() => { const t = setTimeout(() => { setRead(true); play('zip', { gain: 0.4 }) }, 1900); return () => clearTimeout(t) }, [play])
  return (
    <div className="absolute inset-0">
      <motion.div className="absolute overflow-hidden" style={{ left: 26, top: 8, width: 168, height: 224, borderRadius: 26, background: 'radial-gradient(80% 70% at 50% 30%, #FDEEE2 0%, #F6DCC8 100%)', border: '5px solid #fff', boxShadow: '0 20px 44px rgba(18,19,23,0.16)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <FaceArt />
        {!read ? <motion.div className="absolute inset-0" initial={{ y: '0%' }} animate={{ y: ['0%', '98%', '0%'] }} transition={{ duration: 1.8, ease: 'linear' }}><div style={{ height: 4, background: '#FFD700', boxShadow: '0 0 14px 3px #FFD700aa' }} /></motion.div> : null}
        {[[50, 38], [38, 50], [50, 69]].map(([x, y], n) => (
          <motion.span key={n} className="absolute" style={{ left: `${x}%`, top: `${y}%`, width: 12, height: 12, marginLeft: -6, marginTop: -6, borderRadius: 999, border: '2px solid #fff', background: SKIN }} initial={{ scale: 0 }} animate={{ scale: read ? 1 : 0 }} transition={{ ...spring, delay: n * 0.15 }} />
        ))}
      </motion.div>
      <motion.span {...pop(2.3)} className="absolute flex items-center gap-1" style={{ left: 34, top: 246, fontSize: 12.5, fontWeight: 700, color: '#E0457B' }}>✓ Warm undertone</motion.span>
      <div className="absolute" style={{ left: 210, top: 14, width: 130 }}>
        <motion.span {...pop(2.5)} className="block" style={{ fontSize: 12, fontWeight: 800, color: INK }}>Suits you</motion.span>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {SUITS.map(([name, hex], n) => (
            <motion.span key={name} {...pop(2.7 + n * 0.16)} title={name} className="block" style={{ width: 36, height: 36, borderRadius: 999, background: hex, boxShadow: '0 6px 14px rgba(18,19,23,0.14), inset 0 0 0 1px rgba(18,19,23,0.1)' }} />
          ))}
        </div>
        <motion.span {...pop(3.9)} className="mt-4 block" style={{ fontSize: 12, fontWeight: 800, color: '#9AA0A6' }}>Skip</motion.span>
        <div className="mt-2 flex gap-2">
          {SKIP.map(([name, hex], n) => (
            <motion.span key={name} {...pop(4.1 + n * 0.16)} title={name} className="relative block" style={{ width: 30, height: 30, borderRadius: 999, background: hex, boxShadow: 'inset 0 0 0 1px rgba(18,19,23,0.12)' }}>
              <span className="absolute left-1/2 top-1/2 block" style={{ width: 34, height: 2, marginLeft: -17, marginTop: -1, background: '#9AA0A6', transform: 'rotate(-45deg)' }} />
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  )
}

function KweenPicks({ play }) {
  const [worn, setWorn] = useState(false)
  useEffect(() => { const t = setTimeout(() => { setWorn(true); play('hanger', { gain: 0.6 }) }, 4400); return () => clearTimeout(t) }, [play])
  return (
    <div className="absolute inset-0">
      <motion.div {...pop(0.2)} className="absolute" style={{ left: 14, top: 6, width: 196, background: '#fff', borderRadius: '18px 18px 18px 6px', padding: '10px 12px', fontSize: 13.5, fontWeight: 600, color: INK, lineHeight: 1.35, boxShadow: '0 10px 24px rgba(18,19,23,0.10)' }}>
        Good morning! 31° and an office day. Wear this 👇
      </motion.div>
      <div className="absolute" style={{ left: 8, top: 150, width: 112 }}>
        <Kween expression={worn ? 'love' : 'happy'} talking={!worn} size="100%" follow={false} />
      </div>
      <motion.div className="absolute" style={{ left: 128, top: 78, width: 218, background: '#fff', borderRadius: 22, padding: 12, boxShadow: '0 20px 44px rgba(18,19,23,0.14)' }} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ ...spring, delay: 1.0 }}>
        <div className="flex items-center justify-between" style={{ fontSize: 12, fontWeight: 700, color: INK }}>
          <span>Today · Office</span>
          <span className="flex items-center gap-1" style={{ background: '#FFF3E8', borderRadius: 999, padding: '3px 8px' }}><Glyph k="sun" color="#F28C38" size={12} />31°</span>
        </div>
        <div className="mt-2.5 flex gap-1.5">
          {['kurti', 'jeans', 'sneakers'].map((id, n) => <Tile key={id} id={id} size={60} delay={1.6 + n * 0.4} />)}
        </div>
        <motion.div {...pop(3.2)} className="mt-3 flex items-center justify-center gap-1.5" style={{ height: 38, borderRadius: 999, background: worn ? '#2E7D4F' : '#0A0A0A', color: '#fff', fontSize: 13, fontWeight: 700, transition: 'background .3s' }}>
          <motion.span className="flex items-center gap-1.5" animate={worn ? { scale: [1, 0.92, 1] } : {}} transition={{ duration: 0.3 }}><Glyph k="check" color="#fff" size={13} />{worn ? 'Logged for today' : 'Wearing this'}</motion.span>
        </motion.div>
      </motion.div>
    </div>
  )
}

function Plans({ play }) {
  const rows = [
    { day: 'Monday · reminder set', what: 'Interview', tone: '#2E8FA3', ids: ['kurta-set', 'juttis'] },
    { day: 'Friday', what: 'Party', tone: '#E0457B', ids: ['saree'] },
    { day: 'Saturday', what: 'Sangeet', tone: '#F28C38', ids: ['lehenga', 'juttis'] },
  ]
  const packing = ['2 bottoms', '4 tops', 'Sandals', 'Rain jacket']
  const [ticked, setTicked] = useState(0)
  useEffect(() => {
    const ts = packing.map((_, i) => setTimeout(() => { setTicked(i + 1); play('tick', { gain: 0.4, rate: 1.1 + i * 0.08 }) }, 3100 + i * 480))
    return () => ts.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play])
  return (
    <div className="absolute inset-0" style={{ padding: '4px 22px' }}>
      <div className="flex flex-col gap-2">
        {rows.map((r, n) => (
          <motion.div key={r.what} className="flex items-center justify-between" style={{ background: '#fff', borderRadius: 18, padding: '8px 10px 8px 14px', boxShadow: '0 10px 22px rgba(18,19,23,0.08)' }} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ ...spring, delay: 0.2 + n * 0.45 }}>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: MUTED }}>{r.day}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: r.tone, letterSpacing: '-0.01em' }}>{r.what}</div>
            </div>
            <div className="flex gap-1.5">{r.ids.map((id, m) => <Tile key={id} id={id} size={50} delay={0.8 + n * 0.45 + m * 0.2} style={{ borderRadius: 12 }} />)}</div>
          </motion.div>
        ))}
      </div>
      <motion.div className="mt-2.5" style={{ background: '#fff', borderRadius: 18, padding: '10px 14px', boxShadow: '0 10px 22px rgba(18,19,23,0.08)' }} {...pop(2.6)}>
        <div className="flex items-center justify-between" style={{ fontSize: 13, fontWeight: 800, color: INK }}>
          <span>Goa trip · packing list</span><span style={{ fontSize: 11, color: '#7B6CF6' }}>{ticked}/{packing.length}</span>
        </div>
        <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1">
          {packing.map((p, n) => (
            <span key={p} className="flex items-center gap-1.5" style={{ fontSize: 12.5, fontWeight: 600, color: n < ticked ? INK : '#A3A7B2' }}>
              <span className="flex items-center justify-center" style={{ width: 16, height: 16, borderRadius: 5, background: n < ticked ? '#7B6CF6' : '#EDEEF1', transition: 'background .2s' }}>{n < ticked ? <Glyph k="check" color="#fff" size={10} /> : null}</span>{p}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function ShopScene({ play }) {
  const [yes, setYes] = useState(false)
  useEffect(() => { const t = setTimeout(() => { setYes(true); play('pop', { gain: 0.5, rate: 1.2 }) }, 2000); return () => clearTimeout(t) }, [play])
  const rows = [
    ['tag', '#F28C38', '3 that go with it, same store online'],
    ['clock', '#2E7D4F', 'Sale in 9 days: wait, save ₹800'],
    ['calendar', '#3C6DD9', 'Arrives Thursday, before your party'],
    ['globe', '#7B6CF6', 'In your size, 1.2 km away'],
  ]
  return (
    <div className="absolute inset-0" style={{ padding: '0 20px' }}>
      <motion.div {...pop(0.2)} className="ml-auto flex w-max items-center gap-2" style={{ background: INK, color: '#fff', borderRadius: '18px 18px 6px 18px', padding: 6, paddingRight: 14, fontSize: 13.5, fontWeight: 600 }}>
        <span className="relative block overflow-hidden" style={{ width: 44, height: 44, borderRadius: 12, background: '#fff' }}><span className="absolute inset-[8%]"><Cut id="denim-jacket" /></span></span>
        Trying this on. Pants?
      </motion.div>
      <motion.div {...pop(0.9)} className="mt-2.5 w-max" style={{ background: '#fff', borderRadius: '18px 18px 18px 6px', padding: '9px 13px', fontSize: 13.5, fontWeight: 600, color: INK, boxShadow: '0 8px 18px rgba(18,19,23,0.08)' }}>
        Can I look outside your closet?
      </motion.div>
      <motion.span {...pop(1.5)} className="mt-2 flex w-max items-center gap-1.5" style={{ borderRadius: 999, padding: '7px 12px', background: yes ? '#2E7D4F' : '#fff', color: yes ? '#fff' : INK, fontSize: 12.5, fontWeight: 700, border: '1px solid rgba(18,19,23,0.1)', transition: 'background .25s, color .25s' }}>
        <Glyph k="check" color={yes ? '#fff' : INK} size={12} sw={2.4} />Yes, look
      </motion.span>
      <div className="mt-3 flex flex-col gap-1.5">
        {rows.map(([k, tone, text], n) => (
          <motion.div key={text} className="flex items-center gap-2.5" style={{ background: '#fff', borderRadius: 14, padding: '7px 10px', boxShadow: '0 6px 14px rgba(18,19,23,0.06)' }} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ ...spring, delay: 2.5 + n * 0.55 }}>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center" style={{ borderRadius: 9, background: `${tone}18` }}><Glyph k={k} color={tone} size={14} sw={2} /></span>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: INK }}>{text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const SCENES = { snap: Snap, colours: ColoursScene, kween: KweenPicks, plans: Plans, shop: ShopScene }

/* ── the player ──────────────────────────────────────────────────────────── */

/**
 * The 360x640 story card. `i` is the bite (BITES.length = the end card),
 * `progress` a motion value from 0 to 1 within it. Exported so a recorder can
 * drive it frame by frame.
 */
export function StoryCard({ i, progress, onTap, onPrev, onNext, onReplay, onTry, playing, onToggle, play = () => {} }) {
  const end = i >= BITES.length
  const b = BITES[Math.min(i, BITES.length - 1)]
  const barWidth = useTransform(progress, v => `${v * 100}%`)
  const Scene = SCENES[b.k]
  return (
    <div className="absolute left-0 top-0 overflow-hidden" style={{ width: W, height: H, borderRadius: 34, background: end ? 'linear-gradient(180deg,#FFEAF1 0%,#FFF3E8 55%,#FFFFFF 100%)' : b.bg, transition: 'background .5s' }}>
      {/* progress */}
      <div className="absolute flex gap-1.5" style={{ left: 16, right: 16, top: 14 }}>
        {BITES.map((_, n) => (
          <span key={n} className="flex-1 overflow-hidden" style={{ height: 4, borderRadius: 999, background: 'rgba(18,19,23,0.12)' }}>
            {n === i ? <motion.span className="block h-full" style={{ width: barWidth, background: INK, borderRadius: 999 }} />
              : <span className="block h-full" style={{ width: n < i ? '100%' : '0%', background: INK, borderRadius: 999 }} />}
          </span>
        ))}
      </div>
      {/* header, like a reel */}
      <div className="absolute flex items-center gap-2" style={{ left: 16, top: 30 }}>
        <span className="flex items-center justify-center" style={{ width: 30, height: 30, borderRadius: 999, background: '#fff', boxShadow: '0 2px 8px rgba(18,19,23,0.10)' }}><Mark size={15} color={INK} /></span>
        <span style={{ fontSize: 14, fontWeight: 700, color: INK }}>fluntr</span>
        <span style={{ fontSize: 12, color: MUTED }}>· Fluntr in 30 seconds</span>
      </div>
      {/* story arrows: back and forward, so it reads as a story and can be paged by hand */}
      {onNext ? (
        <>
          {i > 0 ? (
            <button type="button" onClick={e => { e.stopPropagation(); onPrev() }} aria-label="Previous" className="absolute z-20 flex items-center justify-center" style={{ left: 10, top: 222, width: 42, height: 42, borderRadius: 999, border: 0, background: 'rgba(255,255,255,0.9)', boxShadow: '0 4px 14px rgba(18,19,23,0.14)', cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M9 2 4 7l5 5" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          ) : null}
          {!end ? (
            <button type="button" onClick={e => { e.stopPropagation(); onNext() }} aria-label="Next" className="absolute z-20 flex items-center justify-center" style={{ right: 10, top: 222, width: 42, height: 42, borderRadius: 999, border: 0, background: 'rgba(255,255,255,0.9)', boxShadow: '0 4px 14px rgba(18,19,23,0.14)', cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="m5 2 5 5-5 5" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          ) : null}
        </>
      ) : null}
      {onToggle && !end ? (
        <button type="button" onClick={e => { e.stopPropagation(); onToggle() }} aria-label={playing ? 'Pause' : 'Play'} className="absolute z-20 flex items-center justify-center" style={{ right: 14, top: 28, width: 34, height: 34, borderRadius: 999, border: 0, background: 'rgba(255,255,255,0.85)', boxShadow: '0 2px 8px rgba(18,19,23,0.10)', cursor: 'pointer' }}>
          {playing
            ? <svg width="12" height="12" viewBox="0 0 12 12"><rect x="2" y="1" width="3" height="10" rx="1" fill={INK} /><rect x="7" y="1" width="3" height="10" rx="1" fill={INK} /></svg>
            : <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 1.5v9l7.5-4.5z" fill={INK} /></svg>}
        </button>
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        {end ? (
          <motion.div key="end" className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ width: 150 }}><Kween expression="love" size="100%" follow={false} /></div>
            <h3 className="h-display mt-2" style={{ fontSize: 34, color: INK }}>That’s Fluntr.</h3>
            <p className="mt-3" style={{ fontSize: 16, lineHeight: 1.45, color: MUTED }}>One app for everything you wear.</p>
            {onTry ? (
              <div className="mt-7 flex flex-col items-center gap-3">
                <button type="button" onClick={onTry} className="btn-primary" style={{ fontSize: 15 }}>See why it’s different <span aria-hidden>↓</span></button>
                <button type="button" onClick={onReplay} style={{ background: 'none', border: 0, fontSize: 13.5, fontWeight: 600, color: MUTED, cursor: 'pointer', textDecoration: 'underline' }}>Watch again</button>
              </div>
            ) : <p className="mt-6" style={{ fontSize: 15, fontWeight: 700, color: INK }}>fluntr.com</p>}
          </motion.div>
        ) : (
          <motion.div key={b.k} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={onTap} style={{ cursor: onTap ? 'pointer' : 'default' }}>
            <div className="absolute" style={{ left: 0, right: 0, top: 78, height: 330 }}><Scene play={play} /></div>
            <div className="absolute" style={{ left: 22, right: 22, top: 430 }}>
              <motion.span className="inline-flex items-center gap-1.5" style={{ background: b.tone, color: '#fff', borderRadius: 999, padding: '5px 11px', fontSize: 12.5, fontWeight: 800 }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                {i + 1} · {b.tag}
              </motion.span>
              <motion.h3 className="h-display mt-3" style={{ fontSize: 29, lineHeight: 1.08, color: INK }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>{b.title}</motion.h3>
              <motion.p className="mt-2.5" style={{ fontSize: 15.5, lineHeight: 1.45, color: MUTED }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>{b.sub}</motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Explainer() {
  const reduce = useReducedMotion()
  const { play } = useSound()
  const [i, setI] = useState(0)
  const progress = useMotionValue(0)
  const underline = useTransform(progress, v => `${v * 100}%`)
  const [paused, setPaused] = useState(false) // paused by the visitor
  const [inView, setInView] = useState(false)
  const [scale, setScale] = useState(1)
  const boxRef = useRef(null)
  const rootRef = useRef(null)
  const seen = useRef(new Set())
  const playing = inView && !paused && i < BITES.length

  // scale the 360x640 card to the width it is given
  useEffect(() => {
    const el = boxRef.current; if (!el) return
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W))
    ro.observe(el); return () => ro.disconnect()
  }, [])
  // play only while on screen; reduced motion starts paused
  useEffect(() => {
    if (reduce) setPaused(true)
    const el = rootRef.current; if (!el || typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const io = new IntersectionObserver(([e]) => setInView(e.intersectionRatio > 0.45), { threshold: [0, 0.45, 0.8] })
    io.observe(el); return () => io.disconnect()
  }, [reduce])
  useEffect(() => {
    if (inView && !seen.current.has('view')) { seen.current.add('view'); track('explainer_view') }
  }, [inView])
  // Kween talks you through it from her spot beside the card
  useEffect(() => {
    if (!inView) return
    if (i < BITES.length) kweenSay(BITES[i].say, BITES[i].mood, { talkMs: reduce ? 0 : 1000, perch: 'what' })
    else kweenSay('Scroll on. I’ll show you everything.', 'love', { talkMs: reduce ? 0 : 900, perch: 'what' })
  }, [i, inView, reduce])
  useEffect(() => {
    if (i < BITES.length && !seen.current.has(i)) { seen.current.add(i); if (i > 0) track('explainer_bite', { bite: i + 1, name: BITES[i].k }) }
    if (i === BITES.length && !seen.current.has('done')) { seen.current.add('done'); track('explainer_complete') }
  }, [i])

  // the clock: fills the bar, then moves to the next bite
  useEffect(() => {
    if (!playing) return
    const ms = BITES[i].ms
    let raf, last = performance.now()
    const tick = now => {
      const p = progress.get() + (now - last) / ms; last = now
      if (p >= 1) { progress.set(0); setI(x => x + 1); return }
      progress.set(p)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, i, progress])

  const go = useCallback(n => { progress.set(0); setI(Math.max(0, Math.min(BITES.length, n))) }, [progress])
  const next = () => { play('pop', { gain: 0.5, rate: 1.2 }); go(i + 1) }
  const prev = () => { play('pop', { gain: 0.5, rate: 1.0 }); setPaused(false); go(i - 1) }
  // a swipe on the card pages it like a story; the tap that ends a swipe is not a tap
  const touch = useRef(null), swiped = useRef(false)
  const onDown = e => { touch.current = { x: e.clientX, y: e.clientY, t: Date.now() } }
  const onUp = e => {
    const s = touch.current; touch.current = null; if (!s) return
    const dx = e.clientX - s.x, dy = e.clientY - s.y
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5 && Date.now() - s.t < 800) { swiped.current = true; track('explainer_swipe'); if (dx < 0) { if (i < BITES.length) next() } else prev() }
  }
  const tap = () => { if (swiped.current) { swiped.current = false; return } next() }
  const replay = () => { track('explainer_replay'); setPaused(false); go(0) }
  // the story goes on below: why it exists, then everything she does, then the demo
  const tryIt = () => { track('explainer_cta', { to: 'why' }); document.getElementById('why')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }) }

  return (
    <section id="what" ref={rootRef} className="relative mx-auto w-full max-w-6xl scroll-mt-24" aria-label="What is Fluntr">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_minmax(0,380px)] lg:gap-16">
        {/* words and chapters */}
        <div className="text-center lg:text-left">
          <p className="text-eyebrow mb-3">What is Fluntr?</p>
          <h2 className="h-display" style={{ fontSize: 'clamp(30px,3.8vw,50px)', color: INK }}>Fluntr in 30 seconds.</h2>
          <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed lg:mx-0" style={{ color: MUTED }}>Five quick bites.</p>
          <ol className="mx-auto mt-7 hidden max-w-md flex-col gap-1 text-left lg:mx-0 lg:flex">
            {BITES.map((b, n) => (
              <li key={b.k}>
                <button type="button" onClick={() => { track('explainer_chapter', { bite: n + 1 }); setPaused(false); go(n) }} className="relative flex w-full items-center gap-4 overflow-hidden rounded-2xl px-3 py-2.5 text-left" style={{ background: n === i ? '#fff' : 'transparent', boxShadow: n === i ? '0 1px 2px rgba(18,19,23,0.06)' : 'none', border: 0, cursor: 'pointer' }}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center" style={{ borderRadius: 999, background: n <= i ? b.tone : '#E8E9EC', color: n <= i ? '#fff' : MUTED, fontSize: 12, fontWeight: 700 }}>{n < i ? <Glyph k="check" color="#fff" size={12} /> : n + 1}</span>
                  <span style={{ fontSize: 15, fontWeight: n === i ? 700 : 500, color: n === i ? INK : MUTED }}>{b.title}</span>
                  {n === i ? <motion.span aria-hidden className="absolute bottom-0 left-0 h-[3px]" style={{ width: underline, background: b.tone }} /> : null}
                </button>
              </li>
            ))}
          </ol>
          <div className="mt-7 hidden flex-wrap items-center gap-3 lg:flex">
            <a href="#how" onClick={() => track('explainer_cta', { to: 'demo', from: 'skip' })} className="btn-glass glass">{i >= BITES.length ? 'Try it yourself' : 'Skip to the demo'} <span aria-hidden>↓</span></a>
          </div>
          {/* where Kween stands while the bites play */}
          <KweenPerch name="what" mood="happy" bubble="right" className="mt-8 hidden lg:block" width="clamp(84px, 7vw, 100px)" />
        </div>

        {/* the story card */}
        <div className="flex flex-col items-center">
          <div ref={boxRef} className="relative" onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => { touch.current = null }} style={{ width: 'min(86vw, 360px)', aspectRatio: `${W} / ${H}`, borderRadius: 34 * scale, boxShadow: '0 40px 80px -30px rgba(18,19,23,0.35), 0 0 0 1px rgba(18,19,23,0.06)', touchAction: 'pan-y' }}>
            <div className="absolute left-0 top-0" style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: '0 0' }}>
              <StoryCard i={i} progress={progress} playing={playing} onTap={tap} onPrev={prev} onNext={next} onReplay={replay} onTry={tryIt} onToggle={() => { setPaused(p => !p); track('explainer_pause_toggle') }} play={play} />
            </div>
          </div>
          {/* on phones Kween sits just below the card: above it she would slide under the navigation while the card fills the screen */}
          <div className="mt-3 flex w-full justify-start lg:hidden" style={{ maxWidth: 'min(86vw, 360px)' }}><KweenPerch name="what" mood="happy" bubble="right" className="ml-2" width="60px" /></div>
          <p className="mt-2 text-center text-[13px] lg:hidden" style={{ color: MUTED }}>Swipe, or use the arrows · <a href="#how" onClick={() => track('explainer_cta', { to: 'demo', from: 'skip' })} className="font-semibold underline" style={{ color: INK }}>Skip to the demo ↓</a></p>
        </div>
      </div>
    </section>
  )
}
