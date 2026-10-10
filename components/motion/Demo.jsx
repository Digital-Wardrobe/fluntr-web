'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Kween from './Kween'
import { KweenPerch } from './KweenRoamer'
import { kweenSay, kweenMood } from './kweenStore'
import { useSound } from './Sound'

/**
 * How it works, as a demo you drive. This is also the hero's stage.
 *
 * The screens copy the app's own layouts (app/add-item.tsx, the AI Magic
 * Studio, app/(tabs)/closet.tsx, app/(tabs)/index.tsx) so what people try
 * here is what they get. You pick a few photos, tap the gold sparkles and
 * watch each background go, check the details Kween filled in, save, see the
 * piece in your closet, then in the feed, then ask Kween what to wear.
 *
 * Every gallery photo has a pre-made cutout in /images/g, so "remove the
 * background" always lands on a real cutout rather than a promise.
 */

const INK = '#0A0A0A'
const INK2 = 'rgba(10,10,10,0.64)'
const INK3 = 'rgba(10,10,10,0.40)'
const HAIR = 'rgba(10,10,10,0.08)'
const FILL = 'rgba(118,118,128,0.10)'
const SOFT = '#F5F5F7'
const MUTED = '#6B7080'
const GOLD = '#FFD700'
const TANG = '#F28C38'

/* ── the camera roll ─────────────────────────────────────────────────────── */

const C = {
  olive: '#6B6B2A', white: '#FFFFFF', cream: '#F3E9D2', maroon: '#7A1F2B', gold: '#C9A43A', blue: '#2F6FD6',
  'light blue': '#9EC5F0', pink: '#E88AAE', silver: '#B8BCC2', tan: '#C19A6B', black: '#111111', grey: '#8A8D91', beige: '#D9C7A7',
}

export const GALLERY = [
  { id: 'kurta-look', name: 'Green kurta set', category: 'kurtas', colours: ['olive', 'white'], pattern: 'solid', fabric: 'cotton', occasions: ['festive', 'wedding'], seasons: ['all season'], look: ['Green kurta', 'White pajama', 'Red mojaris'] },
  { id: 'lehenga', name: 'Cream lehenga', category: 'lehengas', colours: ['cream', 'maroon', 'gold'], pattern: 'embroidered', fabric: 'silk', occasions: ['wedding', 'festive'], seasons: ['winter'] },
  { id: 'denim-jacket', name: 'Denim jacket', category: 'jackets', colours: ['blue'], pattern: 'solid', fabric: 'denim', occasions: ['casual', 'college'], seasons: ['winter', 'monsoon'] },
  { id: 'saree', name: 'Mauve saree', category: 'sarees', colours: ['pink', 'silver'], pattern: 'solid', fabric: 'georgette', occasions: ['party', 'wedding'], seasons: ['all season'] },
  { id: 'sneakers', name: 'White sneakers', category: 'sneakers', colours: ['white'], pattern: 'solid', fabric: 'leather', occasions: ['casual', 'college', 'travel'], seasons: ['all season'] },
  { id: 'kurta-set', name: 'Chikankari kurta set', category: 'kurtas', colours: ['cream', 'light blue'], pattern: 'embroidered', fabric: 'cotton', occasions: ['festive', 'office'], seasons: ['summer'], look: ['Cream kurta', 'Blue jeans', 'Tan bag'] },
  { id: 'jeans', name: 'Wide-leg jeans', category: 'jeans', colours: ['light blue'], pattern: 'solid', fabric: 'denim', occasions: ['casual', 'college'], seasons: ['all season'] },
  { id: 'sherwani', name: 'Ivory sherwani', category: 'sherwanis', colours: ['cream', 'maroon', 'gold'], pattern: 'embroidered', fabric: 'silk', occasions: ['wedding'], seasons: ['winter'] },
  { id: 'juttis', name: 'Maroon juttis', category: 'flats', colours: ['maroon', 'gold'], pattern: 'embroidered', fabric: 'leather', occasions: ['wedding', 'festive'], seasons: ['all season'] },
  { id: 'white-tee', name: 'White tee', category: 'T-shirts', colours: ['white'], pattern: 'solid', fabric: 'cotton', occasions: ['casual', 'lounge'], seasons: ['summer'] },
  { id: 'kurti', name: 'Olive kurti', category: 'kurtas', colours: ['olive'], pattern: 'solid', fabric: 'cotton', occasions: ['office', 'casual'], seasons: ['summer'] },
  { id: 'jeans-look', name: 'Jeans and a white top', category: 'jeans', colours: ['light blue', 'white'], pattern: 'solid', fabric: 'denim', occasions: ['casual', 'college'], seasons: ['all season'], look: ['White top', 'Wide-leg jeans', 'White sneakers'] },
].map(g => ({ ...g, src: g.id, hex: C[g.colours[0]] }))
export const byId = Object.fromEntries(GALLERY.map(g => [g.id, g]))

export const QA = [
  { q: 'What goes with the kurta?', a: 'The maroon juttis. That’s it, you’re done.', mood: 'smug', picks: ['kurta-look', 'juttis'] },
  { q: 'Wedding on Saturday. Help.', a: 'Cream lehenga. Maroon juttis. Arre, iconic.', mood: 'love', picks: ['lehenga', 'juttis', 'saree'] },
  { q: 'Too much for office?', a: 'The olive kurti? No. The sherwani? Yes. Obviously.', mood: 'smug', picks: ['kurti', 'sherwani'] },
  { q: "What haven't I worn lately?", a: 'That denim jacket hasn’t seen daylight in 3 weeks.', mood: 'shock', picks: ['denim-jacket', 'sneakers'] },
]

const STEPS = [
  { k: 'pick', title: 'Pick a few photos.', body: 'Straight from your camera roll. A mirror shot, a flat lay, the kurta on its hanger.', line: 'Pick a few. Any photo works.' },
  { k: 'magic', title: 'Tap ✦✦. The background goes.', body: 'Each piece is cut out on the phone itself, one tap, no studio needed. Nothing is uploaded until you save.', line: 'See the gold sparkles on the photo? Tap them.' },
  { k: 'details', title: 'Kween fills in the details.', body: 'Category, colours, fabric, occasion. Check them, fix anything, save.', line: 'I filled it in. Fix anything I got wrong.' },
  { k: 'closet', title: 'It lands in your closet.', body: 'Every piece you own, cut out and in one grid you can actually look through.', line: 'That’s your closet. Finally.' },
  { k: 'feed', title: 'Post it, or ask first.', body: 'Put a look up and see what people think while you still have time to change.', line: 'Now post it. Or ask me.' },
  { k: 'kween', title: 'Ask Kween.', body: 'Short answers, from the clothes you actually own.', line: 'Go on. Ask me something.' },
]

const COLLECTIONS = ['My Closet', 'Office wear', 'Festive']
const VIS = [['Everyone', 'globe'], ['Followers', 'people'], ['Friends', 'heart'], ['Only me', 'lock']]
const PATTERNS = ['solid', 'striped', 'checked', 'floral', 'printed', 'embroidered']
const FABRICS = ['cotton', 'linen', 'denim', 'silk', 'leather', 'georgette', 'wool']
const OCCASIONS = ['casual', 'office', 'party', 'festive', 'wedding', 'travel', 'college', 'lounge']
const SEASONS = ['summer', 'monsoon', 'winter', 'all season']

/* ── small parts ─────────────────────────────────────────────────────────── */

/** A gallery photo, as it came off the camera roll. */
export function Photo({ src, alt = '', sizes = '160px', className = '', style }) {
  return (
    <Image src={`/images/gallery/${src}.webp`} alt={alt} width={480} height={600} sizes={sizes} className={className} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }} />
  )
}

/** The same piece with its background removed (pre-made, in /images/g). */
export function Cut({ id, alt = '', className = '', style }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/images/g/${id}.webp`} alt={alt} className={className} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', ...style }} />
}

export function Glyph({ k, color = INK, size = 13, sw = 1.8 }) {
  const s = { width: size, height: size, display: 'block', flexShrink: 0 }
  const p = { fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (k) {
    case 'home': return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M3 11 12 3l9 8v10h-6v-6H9v6H3z" /></svg>
    case 'closet': return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M12 4a2 2 0 1 1 2 2c-1 0-2 1-2 2v1l9 6H3l9-6" /></svg>
    case 'add': return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M12 5v14M5 12h14" /></svg>
    case 'search': return <svg viewBox="0 0 24 24" style={s}><circle {...p} cx="11" cy="11" r="6" /><path {...p} d="m16 16 4 4" /></svg>
    case 'me': return <svg viewBox="0 0 24 24" style={s}><circle {...p} cx="12" cy="8" r="4" /><path {...p} d="M4 21a8 8 0 0 1 16 0" /></svg>
    case 'heart': return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /></svg>
    case 'comment': return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M4 5h16v11H8l-4 4z" /></svg>
    case 'share': return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M21 3 10 14M21 3l-7 18-4-7-7-4z" /></svg>
    case 'check': return <svg viewBox="0 0 24 24" style={s}><path {...p} strokeWidth="2.6" d="m5 13 4 4L19 7" /></svg>
    case 'camera': return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle {...p} cx="12" cy="13" r="3.5" /></svg>
    case 'sparkle': return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M12 3c.5 5 3 7.5 8 8-5 .5-7.5 3-8 8-.5-5-3-7.5-8-8 5-.5 7.5-3 8-8z" /></svg>
    case 'chat': return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M4 6h16v10H9l-5 4z" /></svg>
    case 'back': return <svg viewBox="0 0 24 24" style={s}><path {...p} strokeWidth="2.2" d="m15 5-7 7 7 7" /></svg>
    case 'close': return <svg viewBox="0 0 24 24" style={s}><path {...p} strokeWidth="2.2" d="M6 6l12 12M18 6 6 18" /></svg>
    case 'down': return <svg viewBox="0 0 24 24" style={s}><path {...p} strokeWidth="2.2" d="m6 9 6 6 6-6" /></svg>
    case 'trash': return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" /></svg>
    case 'scan': return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" /></svg>
    case 'calendar': return <svg viewBox="0 0 24 24" style={s}><rect {...p} x="4" y="5" width="16" height="15" rx="2" /><path {...p} d="M4 10h16M8 3v4M16 3v4" /></svg>
    case 'bell': return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0" /></svg>
    case 'bookmark': return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M6 4h12v17l-6-4-6 4z" /></svg>
    case 'more': return <svg viewBox="0 0 24 24" style={s}><circle cx="6" cy="12" r="1.8" fill={color} /><circle cx="12" cy="12" r="1.8" fill={color} /><circle cx="18" cy="12" r="1.8" fill={color} /></svg>
    case 'morev': return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="6" r="1.8" fill={color} /><circle cx="12" cy="12" r="1.8" fill={color} /><circle cx="12" cy="18" r="1.8" fill={color} /></svg>
    case 'tag': return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M4 4h7l9 9-7 7-9-9z" /><circle cx="8" cy="8" r="1.3" fill={color} /></svg>
    case 'globe': return <svg viewBox="0 0 24 24" style={s}><circle {...p} cx="12" cy="12" r="8" /><path {...p} d="M4 12h16M12 4c3 3 3 13 0 16M12 4c-3 3-3 13 0 16" /></svg>
    case 'people': return <svg viewBox="0 0 24 24" style={s}><circle {...p} cx="9" cy="8" r="3.2" /><circle {...p} cx="17" cy="9" r="2.4" /><path {...p} d="M3 20a6 6 0 0 1 12 0M15 19a4.5 4.5 0 0 1 7 0" /></svg>
    case 'lock': return <svg viewBox="0 0 24 24" style={s}><rect {...p} x="5" y="10" width="14" height="10" rx="2" /><path {...p} d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
    case 'albums': return <svg viewBox="0 0 24 24" style={s}><rect {...p} x="4" y="8" width="16" height="12" rx="2" /><path {...p} d="M7 8V5h10v3" /></svg>
    case 'images': return <svg viewBox="0 0 24 24" style={s}><rect {...p} x="3" y="5" width="18" height="14" rx="2" /><path {...p} d="m3 16 5-5 4 4 3-3 6 6" /><circle cx="16" cy="9" r="1.5" fill={color} /></svg>
    case 'body': return <svg viewBox="0 0 24 24" style={s}><circle {...p} cx="12" cy="5" r="2.5" /><path {...p} d="M8 10h8l-2 4v7h-4v-7z" /></svg>
    case 'water': return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" /></svg>
    case 'stats': return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></svg>
    case 'shirt': return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M8 4 4 7l2 4 2-1v10h8V10l2 1 2-4-4-3a4 4 0 0 1-8 0z" /></svg>
    case 'send': return <svg viewBox="0 0 24 24" style={s}><path {...p} d="M21 3 10 14M21 3l-7 18-4-7-7-4z" /></svg>
    case 'spin': return <svg viewBox="0 0 24 24" style={s}><path {...p} stroke={color} strokeWidth="2.4" d="M12 3a9 9 0 1 1-9 9" /></svg>
    default: return null
  }
}

function Pill({ children, dark = false, small = false, onClick, disabled, style }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-1.5 transition-transform active:scale-[0.97] disabled:opacity-40"
      style={{
        background: dark ? INK : FILL, color: dark ? '#fff' : INK,
        borderRadius: 999, padding: small ? '7px 12px' : '11px 18px', fontSize: small ? 12 : 13, fontWeight: 600, border: 0, cursor: disabled ? 'default' : 'pointer',
        boxShadow: dark ? '0 10px 24px rgba(10,10,10,0.22)' : 'none', ...style,
      }}
    >
      {children}
    </button>
  )
}

/** The app's round glass icon button (src/ui/Glass.tsx IconButton). */
function IconBtn({ k, dark = false, size = 36, onClick, label, style }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="flex items-center justify-center" style={{ width: size, height: size, borderRadius: 999, border: 0, cursor: onClick ? 'pointer' : 'default', background: dark ? 'rgba(18,18,20,0.64)' : 'rgba(255,255,255,0.82)', boxShadow: dark ? 'inset 0 0 0 1px rgba(255,255,255,0.16)' : 'inset 0 0 0 1px rgba(255,255,255,0.85), 0 4px 14px rgba(0,0,0,0.06)', backdropFilter: 'blur(14px)', ...style }}>
      <Glyph k={k} color={dark ? '#fff' : INK} size={size * 0.5} sw={2} />
    </button>
  )
}

/** The app's chip (src/ui/Glass.tsx Chip): grey fill, ink when selected. */
function Chip({ label, selected, icon, outline, onClick, style }) {
  return (
    <button type="button" onClick={onClick} className="flex shrink-0 items-center gap-1.5 whitespace-nowrap" style={{ height: 32, padding: '0 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, border: 0, cursor: onClick ? 'pointer' : 'default', background: selected ? INK : outline ? '#fff' : FILL, color: selected ? '#fff' : INK, boxShadow: outline && !selected ? `inset 0 0 0 1.5px rgba(10,10,10,0.14)` : 'none', ...style }}>
      {icon ? <Glyph k={icon} color={selected ? '#fff' : INK2} size={13} /> : null}{label}
    </button>
  )
}

function Label({ text, required, kween }) {
  return (
    <div className="flex items-center justify-between" style={{ marginTop: 16, marginBottom: 8 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: INK2 }}>{text}{required ? <span style={{ color: '#E5484D' }}> *</span> : null}</span>
      <AnimatePresence>{kween ? <motion.span key="k" initial={{ opacity: 0, scale: 0.6, x: 8 }} animate={{ opacity: 1, scale: 1, x: 0 }} style={{ background: FILL, borderRadius: 999, padding: '2px 8px', fontSize: 10.5, fontWeight: 600, color: INK }}>✨ by Kween</motion.span> : null}</AnimatePresence>
    </div>
  )
}

function Row({ children, style }) {
  return <div className="flex gap-2 overflow-hidden" style={style}>{children}</div>
}

export function TabBar({ active = 'closet' }) {
  const items = ['home', 'closet', 'add', 'search', 'me']
  return (
    <div className="absolute inset-x-[5%] bottom-[3%] z-30 flex items-center justify-around" style={{ background: '#2E2E30', borderRadius: 999, padding: '8px 10px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
      {items.map(k => (
        <span key={k} className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 999, background: k === active ? '#fff' : 'transparent', boxShadow: k === 'add' ? 'inset 0 0 0 1px rgba(255,255,255,0.25)' : 'none' }}>
          <Glyph k={k} color={k === active ? INK : '#fff'} size={k === 'add' ? 20 : 17} sw={2} />
        </span>
      ))}
    </div>
  )
}

/** The phone. Width is set by the parent; height follows 9:19.3. */
export function Device({ children, className = '', style }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: '9 / 19.3', borderRadius: 40, background: '#fff', border: '1px solid rgba(18,19,23,0.14)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.9), inset 0 0 0 3px rgba(18,19,23,0.06), 0 2px 4px rgba(18,19,23,0.06), 0 50px 100px rgba(18,19,23,0.2)', ...style }}
    >
      {children}
      <div aria-hidden className="absolute left-1/2 top-[1.8%] z-40 -translate-x-1/2" style={{ width: '28%', height: '3.2%', borderRadius: 999, background: '#0A0A0C' }} />
    </div>
  )
}

/* ── 1. the picker (add-item.tsx ClosetImagePickerModal) ─────────────────── */

const ALBUMS = ['Recents', 'Favourites', 'Mirror', 'Screenshots']

function PickScreen({ selected, toggle, onNext }) {
  const n = selected.length
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: '#fff' }}>
      <div className="flex items-center justify-between px-4 pb-3 pt-[13%]" style={{ borderBottom: `1px solid ${HAIR}` }}>
        <Glyph k="close" size={20} sw={2.2} />
        <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.01em' }}>Select Photos</span>
        <motion.button type="button" onClick={onNext} disabled={!n} animate={n ? { scale: [1, 1.08, 1] } : { scale: 1 }} transition={{ duration: 0.35 }} style={{ background: n ? INK : '#F0F0F0', color: n ? '#fff' : '#AAA', borderRadius: 999, padding: '7px 14px', fontSize: 12.5, fontWeight: 700, border: 0, cursor: n ? 'pointer' : 'default' }}>
          Add{n ? ` (${n})` : ''}
        </motion.button>
      </div>
      <div className="flex items-center justify-between px-4 py-2" style={{ background: '#FAFAFA', borderBottom: `1px solid ${HAIR}` }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#666' }}>{n < 4 ? `Select up to ${4 - n} photo${4 - n > 1 ? 's' : ''} (${n}/4 filled)` : 'Closet item is full (4/4 photos)'}</span>
        <span className="flex gap-1.5">{[0, 1, 2, 3].map(i => <motion.span key={i} animate={{ background: i < n ? INK : 'transparent', borderColor: i < n ? INK : '#DDD' }} style={{ width: 8, height: 8, borderRadius: 999, border: '1.5px solid #DDD' }} />)}</span>
      </div>
      <div className="flex gap-2 overflow-hidden px-4 py-2" style={{ borderBottom: `1px solid ${HAIR}` }}>
        {ALBUMS.map((a, i) => <span key={a} className="shrink-0" style={{ padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: i ? 600 : 700, background: i ? 'transparent' : INK, color: i ? '#666' : '#fff', border: `1px solid ${i ? '#E5E5E5' : INK}` }}>{a}</span>)}
      </div>
      <div className="grid grid-cols-3 gap-[3px] px-2 pt-2">
        {GALLERY.map(g => {
          const on = selected.includes(g.id)
          const full = !on && n >= 4
          return (
            <button key={g.id} type="button" onClick={() => toggle(g.id)} className="relative overflow-hidden" style={{ aspectRatio: '1 / 1', border: `2px solid ${on ? INK : 'transparent'}`, padding: 0, background: '#eee', cursor: 'pointer', borderRadius: 8, opacity: full ? 0.45 : 1, transition: 'opacity .2s' }} aria-pressed={on} aria-label={g.name}>
              <motion.div className="h-full w-full overflow-hidden" style={{ borderRadius: 6 }} animate={{ scale: on ? 0.94 : 1 }} transition={{ type: 'spring', stiffness: 400, damping: 26 }}>
                <Photo src={g.src} sizes="120px" />
              </motion.div>
              <AnimatePresence>
                {on ? (
                  <motion.span key="b" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 22 }} className="absolute right-1.5 top-1.5 flex items-center justify-center" style={{ width: 22, height: 22, borderRadius: 999, background: INK, border: '1.5px solid #fff' }}>
                    <Glyph k="check" color="#fff" size={13} />
                  </motion.span>
                ) : null}
              </AnimatePresence>
              {on ? <span aria-hidden className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.12)', borderRadius: 6 }} /> : null}
            </button>
          )
        })}
      </div>
      <AnimatePresence>
        {!n ? (
          <motion.div key="hint" className="pointer-events-none absolute inset-x-0 text-center" style={{ bottom: '5%', fontSize: 12, color: MUTED }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            Tap up to four photos
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

/* ── 2 and 3. add item (add-item.tsx), with the AI Magic Studio on top ───── */

function Hero({ item, cut, onMagic, onTrash, pulse }) {
  return (
    <div className="relative overflow-hidden" style={{ aspectRatio: '1 / 1', borderRadius: 14, background: cut ? SOFT : '#E5E5E5' }}>
      <AnimatePresence mode="wait" initial={false}>
        {cut ? (
          <motion.div key="cut" className="absolute inset-[8%]" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 22 }}>
            <Cut id={item.id} style={{ filter: 'drop-shadow(0 18px 22px rgba(10,10,10,0.16))' }} />
          </motion.div>
        ) : (
          <motion.div key="photo" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ filter: 'blur(26px)', transform: 'scale(1.3)' }}><Photo src={item.src} sizes="300px" /></div>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} />
            <div className="absolute inset-0"><Photo src={item.src} sizes="300px" style={{ objectFit: 'contain' }} /></div>
          </motion.div>
        )}
      </AnimatePresence>
      <button type="button" aria-label="Remove photo" onClick={onTrash} className="absolute left-2 top-2 flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 999, background: 'rgba(0,0,0,0.5)', border: 0 }}><Glyph k="trash" color="#fff" size={15} /></button>
      {/* the gold sparkles: the AI Magic Studio button, exactly where the app has it */}
      <div className="absolute right-2 top-2">
        {pulse ? <motion.span aria-hidden className="absolute inset-0 rounded-full" style={{ border: `2px solid ${GOLD}` }} animate={{ scale: [1, 2.1], opacity: [0.9, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }} /> : null}
        <motion.button type="button" aria-label="Remove background" onClick={onMagic} className="relative flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 999, background: 'rgba(0,0,0,0.5)', border: 0, cursor: 'pointer', color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }} animate={pulse ? { scale: [1, 1.15, 1] } : { scale: 1 }} transition={{ duration: 1.4, repeat: Infinity }}>✦✦</motion.button>
      </div>
      {item.look && !cut ? (
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5" style={{ background: 'rgba(10,10,10,0.86)', color: '#fff', borderRadius: 999, padding: '7px 11px', fontSize: 11.5, fontWeight: 700 }}><Glyph k="scan" color="#fff" size={13} />Scan outfit</span>
      ) : null}
      {cut ? <span className="absolute bottom-3 left-3" style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 999, padding: '4px 9px', fontSize: 10, fontWeight: 700, color: INK, backdropFilter: 'blur(10px)' }}>Background removed</span> : null}
    </div>
  )
}

/**
 * The form from src/components/closet/ItemDetailsForm.tsx. `fill` is how many
 * fields Kween has filled so far (0 = empty, the state you see before saving).
 */
function DetailsForm({ item, fill }) {
  const f = n => fill >= n
  const colours = [...item.colours, ...Object.keys(C).filter(c => !item.colours.includes(c))].slice(0, 6)
  return (
    <div className="px-4 pb-4">
      {item.look && f(1) ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-center gap-2" style={{ background: '#FFF4EA', borderRadius: 14, padding: '10px 12px' }}>
          <Glyph k="scan" color={TANG} size={16} />
          <div style={{ fontSize: 11.5, lineHeight: 1.3 }}><b>Kween found {item.look.length} pieces</b><div style={{ color: INK2 }}>{item.look.join(' · ')}</div></div>
        </motion.div>
      ) : null}
      <Label text="Collection" required />
      <Row>{COLLECTIONS.map((c, i) => <Chip key={c} label={c} icon="albums" selected={i === 0} />)}<Chip label="New collection" icon="add" outline /></Row>
      <Label text="Who can see" required />
      <Row style={{ flexWrap: 'wrap' }}>{VIS.map(([v, ic], i) => <Chip key={v} label={v} icon={ic} selected={i === 0} />)}</Row>
      <Label text="Category" kween={f(1)} />
      <div className="flex items-center gap-2.5" style={{ height: 46, borderRadius: 14, background: FILL, padding: '0 14px' }}>
        <Glyph k="tag" color={f(1) ? INK : INK3} size={16} />
        <AnimatePresence mode="wait">
          <motion.span key={f(1) ? 'v' : 'p'} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1" style={{ fontSize: 14, fontWeight: f(1) ? 600 : 400, color: f(1) ? INK : INK3 }}>{f(1) ? item.category : 'Pick a category'}</motion.span>
        </AnimatePresence>
        <Glyph k="down" color={INK3} size={14} />
      </div>
      <Label text="Colours (up to 3)" kween={f(2)} />
      <Row style={{ flexWrap: 'wrap' }}>
        {colours.map(c => {
          const on = f(2) && item.colours.includes(c)
          return (
            <motion.span key={c} className="flex items-center gap-1.5" animate={{ background: on ? '#fff' : FILL, boxShadow: on ? `inset 0 0 0 1.5px ${INK}` : 'inset 0 0 0 1.5px transparent' }} style={{ height: 32, padding: '0 11px 0 5px', borderRadius: 999, fontSize: 12, fontWeight: on ? 600 : 500, color: on ? INK : INK2 }}>
              <span className="flex items-center justify-center" style={{ width: 22, height: 22, borderRadius: 999, background: C[c], border: '1px solid rgba(10,10,10,0.14)' }}>{on ? <Glyph k="check" color={['white', 'cream', 'light blue', 'silver', 'beige'].includes(c) ? INK : '#fff'} size={11} /> : null}</span>{c}
            </motion.span>
          )
        })}
      </Row>
      <Label text="Pattern" kween={f(3)} />
      <Row>{PATTERNS.map(p => <Chip key={p} label={p} selected={f(3) && p === item.pattern} />)}</Row>
      <Label text="Fabric" kween={f(4)} />
      <Row>{FABRICS.map(p => <Chip key={p} label={p} selected={f(4) && p === item.fabric} />)}</Row>
      <Label text="Occasion" kween={f(5)} />
      <Row>{OCCASIONS.map(p => <Chip key={p} label={p} selected={f(5) && item.occasions.includes(p)} />)}</Row>
      <Label text="Season" kween={f(6)} />
      <Row>{SEASONS.map(p => <Chip key={p} label={p} selected={f(6) && item.seasons.includes(p)} />)}</Row>
      <div className="flex gap-2.5">
        <div className="flex-1"><Label text="Brand" /><div style={{ height: 46, borderRadius: 14, background: FILL, padding: '0 14px', lineHeight: '46px', fontSize: 14, color: INK3 }}>e.g. Fabindia</div></div>
        <div className="flex-1"><Label text="Size" /><div style={{ height: 46, borderRadius: 14, background: FILL, padding: '0 14px', lineHeight: '46px', fontSize: 14, color: INK3 }}>M / 32 / 8</div></div>
      </div>
      <div style={{ height: 70 }} />
    </div>
  )
}

/** The AI Magic Studio modal, as in add-item.tsx: dark room, gold scan line, Undo / Apply. */
function Studio({ selected, onApply, onClose }) {
  const reduce = useReducedMotion()
  const { play } = useSound()
  const [i, setI] = useState(0)          // which photo is in the room
  const [cut, setCut] = useState(false)  // has the current photo's background gone
  const per = reduce ? 700 : 2300
  const done = i >= selected.length
  const playRef = useRef(play); playRef.current = play
  useEffect(() => {
    if (done) { playRef.current('chime'); return }
    setCut(false)
    playRef.current('shutter', { gain: 0.8 })
    const a = setTimeout(() => { setCut(true); playRef.current('zip', { gain: 0.55 }) }, per * 0.6)
    const b = setTimeout(() => setI(i + 1), per)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [i, done, per])
  const cur = byId[selected[Math.min(i, selected.length - 1)]]
  return (
    <motion.div className="absolute inset-0 z-20 flex flex-col" style={{ background: '#0F0F0F' }} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
      <div className="flex items-center justify-between px-5 pb-3 pt-[13%]" style={{ borderBottom: '1px solid #2C2C2C' }}>
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: 1.2 }}>✦ AI MAGIC STUDIO</span>
        {done ? <button type="button" aria-label="Close" onClick={onClose} style={{ background: 'none', border: 0, cursor: 'pointer' }}><Glyph k="close" color="#fff" size={20} sw={2.2} /></button> : <span style={{ color: '#9A9A9A', fontSize: 12, fontWeight: 600 }}>{Math.min(i + 1, selected.length)} of {selected.length}</span>}
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-5">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1 / 1.1', borderRadius: 16, background: '#1E1E1E' }}>
          <AnimatePresence mode="wait">
            <motion.div key={cur.id} className="absolute inset-0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
              <div className="absolute inset-0"><Photo src={cur.src} sizes="320px" style={{ objectFit: 'contain', opacity: cut || done ? 0 : 1, transition: 'opacity .5s' }} /></div>
              <motion.div className="absolute inset-[6%]" animate={{ opacity: cut || done ? 1 : 0, scale: cut || done ? 1 : 0.94 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
                <Cut id={cur.id} style={{ filter: 'drop-shadow(0 20px 26px rgba(0,0,0,0.5))' }} />
              </motion.div>
              {/* a little burst when the background goes */}
              {cut && !reduce ? [0, 1, 2, 3, 4, 5, 6, 7].map(n => (
                <motion.span key={n} aria-hidden className="absolute left-1/2 top-1/2" style={{ width: 7, height: 7, borderRadius: 999, background: GOLD }} initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: Math.cos(n / 8 * Math.PI * 2) * 120, y: Math.sin(n / 8 * Math.PI * 2) * 120, opacity: 0, scale: 0.3 }} transition={{ duration: 0.7, ease: 'easeOut' }} />
              )) : null}
            </motion.div>
          </AnimatePresence>
          {!done && !cut && !reduce ? (
            <motion.div aria-hidden className="absolute inset-x-0" style={{ height: 4, background: GOLD, boxShadow: `0 0 14px 3px ${GOLD}aa` }} animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
          ) : null}
        </div>
        {/* the pieces done so far */}
        <div className="mt-4 flex gap-2">
          {selected.map((id, n) => (
            <div key={id} className="relative overflow-hidden" style={{ width: 44, height: 44, borderRadius: 10, background: '#1E1E1E', border: `1.5px solid ${n === i ? GOLD : '#2C2C2C'}` }}>
              {n < i || done ? <div className="absolute inset-[10%]"><Cut id={id} /></div> : <Photo src={byId[id].src} sizes="44px" style={{ opacity: n === i ? 0.9 : 0.4 }} />}
              {n < i || done ? <span className="absolute bottom-0.5 right-0.5 flex items-center justify-center" style={{ width: 14, height: 14, borderRadius: 999, background: GOLD }}><Glyph k="check" color="#000" size={9} /></span> : null}
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 pb-[9%] pt-4" style={{ borderTop: '1px solid #2C2C2C' }}>
        {done ? (
          <motion.div className="flex gap-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, height: 48, borderRadius: 24, background: '#2C2C2C', color: '#fff', fontSize: 13.5, fontWeight: 700, border: 0, cursor: 'pointer' }}>Undo</button>
            <button type="button" onClick={onApply} style={{ flex: 1, height: 48, borderRadius: 24, background: '#fff', color: '#000', fontSize: 13.5, fontWeight: 700, border: 0, cursor: 'pointer' }}>Apply / Keep</button>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center gap-2.5" style={{ height: 48 }}>
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}><Glyph k="spin" color={GOLD} size={16} /></motion.span>
            <span style={{ color: GOLD, fontSize: 12.5, fontWeight: 600 }}>{cut ? 'Cutting it out…' : 'Removing background…'}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/** The iOS alert the app shows after saving (ai.savedFilled). */
function SavedAlert({ item, onOk }) {
  const filled = ['category', 'colours', item.fabric && 'fabric', 'occasion'].filter(Boolean).join(', ')
  return (
    <motion.div className="absolute inset-0 z-30 flex items-center justify-center px-8" style={{ background: 'rgba(10,10,10,0.28)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="w-full overflow-hidden text-center" style={{ borderRadius: 20, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)' }} initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 26 }}>
        <div className="px-4 pb-4 pt-5">
          <div style={{ fontSize: 16, fontWeight: 700 }}>Saved! 🎉</div>
          <div className="mt-1.5" style={{ fontSize: 12.5, lineHeight: 1.35, color: INK2 }}>Kween already filled in {filled} from your photo. Have a look and fix anything that’s off.</div>
        </div>
        <button type="button" onClick={onOk} className="w-full" style={{ height: 44, border: 0, borderTop: `1px solid ${HAIR}`, background: 'transparent', color: '#007AFF', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>OK</button>
      </motion.div>
    </motion.div>
  )
}

export function AddItemScreen({ selected, cut, fill, pulse, studio, saved, onMagic, onApply, onCloseStudio, onSave, onOk }) {
  const item = byId[selected[0]] || GALLERY[0]
  const scroll = useRef(null)
  // Kween fills the form: scroll down to watch her do it
  useEffect(() => {
    if (fill === 1 && scroll.current) scroll.current.scrollTo({ top: 330, behavior: 'smooth' })
    if (fill === 0 && scroll.current) scroll.current.scrollTo({ top: 0 })
  }, [fill])
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: '#fff' }}>
      <div ref={scroll} className="absolute inset-0 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="flex items-center justify-between px-4 pb-2 pt-[12%]">
          <IconBtn k="back" label="Back" />
          <span className="flex items-center" style={{ height: 32, padding: '0 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, background: 'rgba(255,255,255,0.82)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.85), 0 4px 14px rgba(0,0,0,0.06)' }}>Save</span>
        </div>
        <div className="px-4">
          <Hero item={item} cut={cut} onMagic={onMagic} pulse={pulse} />
          <div className="mt-1.5 flex gap-1">
            {[1, 2, 3].map(n => {
              const id = selected[n]
              return (
                <div key={n} className="relative flex-1 overflow-hidden" style={{ aspectRatio: '1 / 1', borderRadius: 12, background: cut && id ? SOFT : '#E5E5E5' }}>
                  {id ? (cut ? <div className="absolute inset-[10%]"><Cut id={id} /></div> : <Photo src={byId[id].src} sizes="110px" />) : (
                    <div className="flex h-full flex-col items-center justify-center" style={{ color: '#AAA', fontSize: 11, fontWeight: 500 }}><Glyph k="add" color="#AAA" size={18} />Image {n + 1}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        <DetailsForm item={item} fill={fill} />
      </div>
      {/* the glass bar (GlassBar) with Close and Save */}
      <div className="absolute inset-x-2 bottom-2 z-10 flex items-center gap-2.5" style={{ padding: 8, borderRadius: 28, background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(20px)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.85), 0 10px 30px rgba(0,0,0,0.12)' }}>
        <span className="flex items-center justify-center" style={{ height: 44, padding: '0 20px', borderRadius: 999, background: FILL, fontSize: 14, fontWeight: 600 }}>Close</span>
        <motion.button type="button" onClick={onSave} disabled={!onSave} className="flex flex-1 items-center justify-center gap-2" animate={fill >= 6 && onSave ? { scale: [1, 1.03, 1] } : { scale: 1 }} transition={{ duration: 1.2, repeat: Infinity }} style={{ height: 44, borderRadius: 999, background: INK, color: '#fff', fontSize: 14, fontWeight: 600, border: 0, cursor: onSave ? 'pointer' : 'default', opacity: onSave ? 1 : 0.5 }}>
          <Glyph k="sparkle" color="#fff" size={15} />Save
        </motion.button>
      </div>
      <AnimatePresence>
        {studio ? <Studio key="studio" selected={selected} onApply={onApply} onClose={onCloseStudio} /> : null}
        {saved ? <SavedAlert key="saved" item={item} onOk={onOk} /> : null}
      </AnimatePresence>
    </div>
  )
}

/* ── 4. My Closet (app/(tabs)/closet.tsx) ────────────────────────────────── */

const HUB = [['images', 'Batch add'], ['body', 'Fit check'], ['water', 'Laundry'], ['calendar', 'Events'], ['stats', 'Insights']]

export function ClosetScreen({ selected, onNext, label = 'added to My Closet', animate = true }) {
  const { play } = useSound()
  useEffect(() => {
    if (!animate) return
    const ts = selected.map((_, n) => setTimeout(() => play('tick', { gain: 0.6, rate: 1 + n * 0.08 }), 160 + n * 110))
    return () => ts.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#fff' }}>
      <div className="flex items-center px-4 pt-[12%]">
        <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>My Closet</span>
        <span className="ml-auto flex gap-2">{['search', 'scan', 'calendar'].map(k => <span key={k} className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 999, background: '#F3F4F7' }}><Glyph k={k} size={17} sw={2} /></span>)}</span>
      </div>
      <div className="mt-2 flex gap-2 overflow-hidden px-4">
        {HUB.map(([k, t]) => <span key={t} className="flex shrink-0 items-center gap-1.5" style={{ height: 30, padding: '0 11px', borderRadius: 999, background: FILL, fontSize: 11.5, fontWeight: 500 }}><Glyph k={k} size={13} />{t}</span>)}
      </div>
      <div className="mt-3 flex gap-4 overflow-hidden px-4">
        <div className="flex w-[62px] flex-col items-center">
          <span className="flex items-center justify-center" style={{ width: 58, height: 58, borderRadius: 999, border: '1px solid #CCC', padding: 2 }}><span className="flex h-full w-full items-center justify-center" style={{ borderRadius: 999, background: '#999' }}><Glyph k="add" color="#fff" size={26} sw={2} /></span></span>
          <span className="mt-1.5 text-center" style={{ fontSize: 10, fontWeight: 600, color: 'rgba(10,10,10,0.5)', lineHeight: 1.15 }}>Create Collection</span>
        </div>
        {COLLECTIONS.map((c, i) => (
          <div key={c} className="flex w-[62px] flex-col items-center">
            <span className="flex items-center justify-center overflow-hidden" style={{ width: 58, height: 58, borderRadius: 999, border: i === 0 ? `2px solid ${INK}` : '1px solid #CCC', padding: 2 }}>
              <span className="relative flex h-full w-full items-center justify-center overflow-hidden" style={{ borderRadius: 999, background: '#EFEFEF' }}>
                {i === 0 && selected[0] ? <div className="absolute inset-[12%]"><Cut id={selected[0]} /></div> : <Glyph k="closet" color="#AAA" size={22} />}
              </span>
            </span>
            <span className="mt-1.5 truncate text-center" style={{ fontSize: 10, fontWeight: i === 0 ? 800 : 600, color: i === 0 ? INK : 'rgba(10,10,10,0.5)', maxWidth: 62 }}>{c}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex" style={{ borderBottom: '1px solid #EBEBEB' }}>
        {['Everyone', 'Followers', 'Friends', 'Only Me'].map((t, i) => <span key={t} className="flex-1 text-center" style={{ padding: '10px 0', fontSize: 12, fontWeight: i ? 500 : 700, color: i ? '#AAA' : INK, borderBottom: `2px solid ${i ? 'transparent' : INK}`, marginBottom: -1 }}>{t}</span>)}
      </div>
      <div className="grid grid-cols-2 gap-2 px-2 pt-2">
        {selected.map((id, n) => (
          <motion.div key={id} className="relative overflow-hidden" style={{ aspectRatio: '1 / 1', borderRadius: 12, background: SOFT }} initial={animate ? { scale: 0.6, opacity: 0, y: 10 } : false} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.15 + n * 0.11 }}>
            <div className="absolute" style={{ left: 12, right: 12, top: 10, bottom: 12 }}><Cut id={id} /></div>
            <span className="absolute right-1.5 top-1.5 flex items-center justify-center" style={{ width: 24, height: 24, borderRadius: 999, background: 'rgba(0,0,0,0.5)' }}><Glyph k="more" color="#fff" size={13} /></span>
          </motion.div>
        ))}
      </div>
      {animate ? (
        <motion.div className="absolute left-1/2 -translate-x-1/2" style={{ top: '18%', borderRadius: 999, padding: '7px 13px', fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(14px)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.9), 0 10px 30px rgba(0,0,0,0.12)' }} initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
          + {selected.length} {label}
        </motion.div>
      ) : null}
      {onNext ? <div className="absolute inset-x-0 z-20 flex justify-center" style={{ bottom: '14%' }}><Pill dark onClick={onNext}>See it in the feed →</Pill></div> : null}
      <TabBar active="closet" />
    </div>
  )
}

/* ── 5. the feed (app/(tabs)/index.tsx, FeedItem.tsx) ────────────────────── */

export function FeedScreen({ item, onAsk }) {
  const reduce = useReducedMotion()
  const [likes, setLikes] = useState(0)
  useEffect(() => {
    if (reduce) { setLikes(142); return }
    let n = 0
    const t = setInterval(() => { n += 7; setLikes(Math.min(142, n)); if (n >= 142) clearInterval(t) }, 40)
    return () => clearInterval(t)
  }, [reduce])
  const friends = [['A', '#F28C38'], ['R', '#2E8FA3'], ['S', '#7B6CF6'], ['M', '#4F9D6B']]
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#fff' }}>
      <div className="flex items-center justify-between px-4 pt-[12%]">
        <Glyph k="bell" size={22} sw={2} />
        <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.02em' }}>Fluntr</span>
        <Glyph k="chat" size={22} sw={2} />
      </div>
      <div className="mt-3 flex gap-3 overflow-hidden px-4">
        <div className="flex w-[62px] flex-col items-center">
          <span className="flex items-center justify-center" style={{ width: 58, height: 58, borderRadius: 999, border: '2px dashed #BBB', background: '#F5F5F7' }}><Glyph k="add" size={24} sw={2} /></span>
          <span className="mt-1.5" style={{ fontSize: 10.5, fontWeight: 500 }}>Your Mirror</span>
        </div>
        {friends.map(([l, c]) => (
          <div key={l} className="flex w-[62px] flex-col items-center">
            <span className="flex items-center justify-center" style={{ width: 58, height: 58, borderRadius: 999, border: `2px solid ${INK}`, padding: 2 }}><span className="flex h-full w-full items-center justify-center" style={{ borderRadius: 999, background: c, color: '#fff', fontSize: 18, fontWeight: 700 }}>{l}</span></span>
            <span className="mt-1.5" style={{ fontSize: 10.5, fontWeight: 500 }}>{{ A: 'Ananya', R: 'Rahul', S: 'Sana', M: 'Meera' }[l]}</span>
          </div>
        ))}
      </div>
      <motion.div className="relative mx-3 mt-3 overflow-hidden" style={{ aspectRatio: '1 / 1.18', borderRadius: 24, background: '#E6E7EA' }} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 24 }}>
        <div className="absolute inset-[9%] top-[16%]"><Cut id={item.id} style={{ filter: 'drop-shadow(0 20px 26px rgba(10,10,10,0.18))' }} /></div>
        <div className="absolute left-3 top-3 flex items-center gap-2" style={{ background: 'rgba(90,90,92,0.85)', borderRadius: 999, padding: '4px 12px 4px 4px', color: '#fff' }}>
          <span className="flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 999, background: '#C9C9CC', color: INK, fontSize: 12, fontWeight: 700 }}>Y</span>
          <span className="leading-tight"><span className="block" style={{ fontSize: 11.5, fontWeight: 700 }}>You</span><span className="block" style={{ fontSize: 9.5, opacity: 0.8 }}>@you</span></span>
        </div>
        <span className="absolute right-3 top-3 flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 999, background: 'rgba(90,90,92,0.85)' }}><Glyph k="morev" color="#fff" size={14} /></span>
        <span className="absolute left-3 flex items-center gap-1" style={{ top: 52, background: 'rgba(0,0,0,0.55)', color: '#fff', borderRadius: 8, padding: '3px 7px', fontSize: 9.5, fontWeight: 700 }}><Glyph k="shirt" color="#fff" size={11} />Closet item</span>
        <div className="absolute bottom-3 left-3 flex items-center gap-3" style={{ background: 'rgba(90,90,92,0.85)', borderRadius: 999, padding: '8px 14px', color: '#fff', fontSize: 11, fontWeight: 600 }}>
          <span className="flex items-center gap-1"><Glyph k="heart" color="#fff" size={15} />{likes}</span>
          <span className="flex items-center gap-1"><Glyph k="comment" color="#fff" size={15} />8</span>
          <span className="flex items-center gap-1"><Glyph k="send" color="#fff" size={15} />3</span>
        </div>
        <span className="absolute bottom-3 right-3 flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 999, background: 'rgba(60,60,62,0.9)' }}><Glyph k="bookmark" color="#fff" size={18} sw={2} /></span>
      </motion.div>
      <div className="mt-2 flex items-center gap-1.5 px-4" style={{ fontSize: 10.5, color: '#767A85' }}><Glyph k="sparkle" color="#767A85" size={11} />Suggested for you · {item.name}</div>
      {onAsk ? <div className="absolute inset-x-0 z-20 flex justify-center" style={{ bottom: '14%' }}><Pill dark onClick={onAsk}>Ask Kween what goes with it</Pill></div> : null}
      <TabBar active="home" />
    </div>
  )
}

/* ── 6. Kween ────────────────────────────────────────────────────────────── */

export function KweenScreen({ onRestart, setMood, setTalking, mood, talking, preset = null }) {
  const reduce = useReducedMotion()
  const { play } = useSound()
  const [asked, setAsked] = useState(preset)
  const [typed, setTyped] = useState(preset == null ? '' : QA[preset].a)
  const timer = useRef(null)
  function ask(i) {
    const qa = QA[i]
    play('pop')
    setAsked(i); setTyped(''); setMood(qa.mood); setTalking(true)
    clearInterval(timer.current)
    if (reduce) { setTyped(qa.a); setTalking(false); return }
    let n = 0
    timer.current = setInterval(() => {
      n += 1; setTyped(qa.a.slice(0, n))
      if (n % 3 === 0) play('tick', { gain: 0.35, rate: 1.4 + Math.random() * 0.5 })
      if (n >= qa.a.length) { clearInterval(timer.current); setTalking(false) }
    }, 28)
  }
  useEffect(() => () => clearInterval(timer.current), [])
  const qa = asked == null ? null : QA[asked]
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: 'linear-gradient(180deg, #FFEBD9 0%, #fff 42%)' }}>
      <div className="flex items-center justify-between px-4 pt-[12%]"><IconBtn k="back" label="Back" /><span style={{ fontSize: 15, fontWeight: 700 }}>Kween</span><span style={{ width: 36 }} /></div>
      <div className="relative mx-auto mt-[1%]" style={{ width: '36%' }}>
        <Kween expression={mood} talking={talking} size="100%" onClick={() => ask(asked == null ? 0 : (asked + 1) % QA.length)} />
      </div>
      <div className="px-4">
        <AnimatePresence mode="wait">
          {qa ? (
            <motion.div key={asked} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="ml-auto w-max max-w-[85%]" style={{ background: INK, color: '#fff', borderRadius: '16px 16px 4px 16px', padding: '8px 12px', fontSize: 12.5, fontWeight: 500 }}>{qa.q}</div>
              <div className="mt-2 w-max max-w-[88%]" style={{ background: '#F0F0F0', borderRadius: '16px 16px 16px 4px', padding: '8px 12px', fontSize: 12.5, fontWeight: 500, minHeight: 34 }}>{typed}<span style={{ opacity: talking ? 1 : 0 }}>▍</span></div>
              {!talking ? (
                <motion.div className="mt-3 flex gap-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  {qa.picks.map(id => (<div key={id} className="relative overflow-hidden" style={{ width: '30%', aspectRatio: '1 / 1.1', borderRadius: 12, background: SOFT, boxShadow: '0 8px 18px rgba(18,19,23,0.1)' }}><div className="absolute inset-[9%]"><Cut id={id} /></div></div>))}
                </motion.div>
              ) : null}
            </motion.div>
          ) : (
            <motion.div key="hint" className="text-center" style={{ fontSize: 12, color: MUTED }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Pick a question, or tap Kween.</motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-auto px-4 pb-[14%]">
        <div className="flex flex-wrap gap-1.5">
          {QA.map((x, i) => (
            <button key={x.q} type="button" onClick={() => ask(i)} style={{ background: i === asked ? INK : '#fff', color: i === asked ? '#fff' : INK, border: `1px solid ${i === asked ? INK : 'rgba(18,19,23,0.14)'}`, borderRadius: 999, padding: '7px 11px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{x.q}</button>
          ))}
        </div>
      </div>
      {onRestart ? <button type="button" onClick={onRestart} className="absolute right-[6%]" style={{ bottom: '4.5%', background: 'none', border: 0, fontSize: 11, color: MUTED, cursor: 'pointer', textDecoration: 'underline' }}>Start over</button> : null}
    </div>
  )
}

/* ── the demo ────────────────────────────────────────────────────────────── */

export default function Demo() {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState([])
  const [studio, setStudio] = useState(false)
  const [cut, setCut] = useState(false)
  const [fill, setFill] = useState(0)
  const [saved, setSaved] = useState(false)
  const [mood, setMood] = useState('idle')
  const [talking, setTalking] = useState(false)
  const reduce = useReducedMotion()
  const { play } = useSound()

  // Each step, Kween says its line (through the shared store, so the roaming
  // mascot says it from wherever she is standing).
  useEffect(() => {
    const m = step === 3 ? 'happy' : step === 2 ? 'smug' : 'idle'
    if (step !== 5) setMood(m)
    kweenSay(STEPS[step].line, step === 5 ? 'idle' : m, { talkMs: reduce ? 0 : 1100, perch: 'demo' })
  }, [step, reduce])
  useEffect(() => { if (studio) kweenSay('Hold on. Doing the boring part.', 'idle', { talkMs: reduce ? 0 : 1000, perch: 'demo' }) }, [studio, reduce])
  // the in-phone Kween's feelings reach the roamer too
  useEffect(() => { if (step === 5) kweenMood(mood, talking) }, [mood, talking, step])
  // on the details step she fills the form in, one field at a time
  useEffect(() => {
    if (step !== 2) { setFill(0); return }
    const gap = reduce ? 120 : 520
    const ts = [1, 2, 3, 4, 5, 6].map(n => setTimeout(() => { setFill(n); play('tick', { gain: 0.5, rate: 1 + n * 0.07 }) }, 500 + n * gap))
    return () => ts.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  function go(n, sound) { if (sound) play(sound); setStep(n) }
  function toggle(id) {
    setSelected(s => {
      const on = s.includes(id)
      if (!on && s.length >= 4) return s
      play(on ? 'tick' : 'pop', { rate: on ? 0.9 : 1 + s.length * 0.06 })
      return on ? s.filter(x => x !== id) : [...s, id]
    })
  }
  function restart() { play('swish', { gain: 0.6 }); setSelected([]); setCut(false); setStudio(false); setSaved(false); setMood('idle'); setStep(0) }
  function jump(i) {
    if (i === step) return
    if (i === 0) return go(0, 'tick')
    if (!selected.length) return
    if (i >= 2) setCut(true)
    setStudio(false); setSaved(false)
    go(i, 'tick')
  }
  const first = byId[selected[0]] || GALLERY[0]
  const screens = [
    <PickScreen key="pick" selected={selected} toggle={toggle} onNext={() => go(1, 'whoosh')} />,
    <AddItemScreen key="add" selected={selected} cut={cut} fill={0} pulse={!studio} studio={studio} onMagic={() => { play('pop'); setStudio(true) }} onApply={() => { setCut(true); setStudio(false); kweenSay('Ta-da. Look at that.', 'happy', { talkMs: 900, perch: 'demo' }); go(2, 'swish') }} onCloseStudio={() => setStudio(false)} />,
    <AddItemScreen key="add" selected={selected} cut={cut} fill={fill} saved={saved} onMagic={() => {}} onSave={fill >= 6 ? () => { play('hanger'); setSaved(true) } : null} onOk={() => { setSaved(false); go(3, 'swish') }} />,
    <ClosetScreen key="closet" selected={selected} onNext={() => go(4, 'swish')} />,
    <FeedScreen key="feed" item={first} onAsk={() => go(5, 'pop')} />,
    <KweenScreen key="kween" onRestart={restart} mood={mood} talking={talking} setMood={setMood} setTalking={setTalking} />,
  ]
  // steps 1 and 2 are the same screen; keep it mounted so the hero does not flash
  const screenKey = step === 1 || step === 2 ? 'add' : STEPS[step].k

  return (
    <div id="how" className="relative mx-auto w-full max-w-6xl scroll-mt-28">
      {/* the stage */}
      <div className="relative overflow-hidden" style={{ borderRadius: 40, background: '#F5F6F8', border: '1px solid rgba(18,19,23,0.08)', boxShadow: '0 40px 100px -40px rgba(18,19,23,0.25)' }}>
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 50% at 70% 20%, rgba(242,140,56,0.10), transparent 60%), radial-gradient(50% 40% at 15% 90%, rgba(46,143,163,0.10), transparent 60%)' }} />
        <div className="relative grid items-center gap-10 px-6 py-10 md:px-12 md:py-14 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-16">
          {/* left: what is happening, and the step list */}
          <div className="order-2 lg:order-1">
            <p className="text-eyebrow mb-4">How it works · try it</p>
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                <h2 className="h-display" style={{ fontSize: 'clamp(30px,3.8vw,52px)', color: '#121317' }}>{STEPS[step].title}</h2>
                <p className="mt-4 max-w-md text-[17px] leading-relaxed" style={{ color: MUTED }}>{STEPS[step].body}</p>
              </motion.div>
            </AnimatePresence>
            <ol className="mt-8 flex flex-col gap-1">
              {STEPS.map((s, i) => (
                <li key={s.k}>
                  <button type="button" onClick={() => jump(i)} className="flex w-full items-center gap-4 rounded-full px-3 py-2 text-left transition-colors" style={{ background: i === step ? '#fff' : 'transparent', cursor: i === 0 || selected.length ? 'pointer' : 'default', boxShadow: i === step ? '0 1px 2px rgba(18,19,23,0.06)' : 'none' }}>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center" style={{ borderRadius: 999, background: i <= step ? '#121317' : '#E8E9EC', color: i <= step ? '#fff' : MUTED, fontSize: 11, fontWeight: 600 }}>
                      {i < step ? <Glyph k="check" color="#fff" size={12} /> : i + 1}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: i === step ? 600 : 500, color: i === step ? '#121317' : MUTED }}>{s.title}</span>
                  </button>
                </li>
              ))}
            </ol>
            {step > 0 ? <button type="button" onClick={restart} className="mt-5 text-[13px] font-medium underline" style={{ color: MUTED, background: 'none', border: 0, cursor: 'pointer' }}>Start over</button> : null}

            {/* where Kween stands while she walks you through this: the roamer comes here */}
            <KweenPerch name="demo" className="mt-10 hidden md:block" width="clamp(96px, 9vw, 120px)" />
          </div>

          {/* right: the phone */}
          <div className="order-1 flex flex-col items-center lg:order-2">
            {/* on phones she stands just above the demo phone, where you can see them both */}
            <div className="flex w-full justify-start md:hidden" style={{ maxWidth: 360 }}><KweenPerch name="demo" className="mb-2 ml-3" width="72px" /></div>
            <div className="relative" style={{ width: 'min(84vw, 360px)' }}>
              <Device>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={screenKey} className="absolute inset-0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                    {screens[step]}
                  </motion.div>
                </AnimatePresence>
              </Device>
              {/* floating props around the phone, per step */}
              <AnimatePresence>
                {step === 1 && !studio ? <Prop key="p1" text="✦ on your phone, offline" tone="#121317" left="-30%" top="14%" /> : null}
                {step === 2 ? <Prop key="p2" text="✨ filled by Kween" tone="#F28C38" left="-26%" top="62%" /> : null}
                {step === 3 ? <Prop key="p3" text={`+ ${selected.length} ${selected.length === 1 ? 'piece' : 'pieces'}`} tone="#4F9D6B" left="-18%" top="18%" /> : null}
                {step === 4 ? <Prop key="p4" text="♥ 142" tone="#F28C38" left="78%" top="30%" /> : null}
                {step === 5 ? <Prop key="p5" text="Saturday · Wedding" tone="#7B6CF6" left="-24%" top="22%" /> : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Prop({ text, tone, left, top }) {
  return (
    <motion.div
      className="pointer-events-none absolute z-20 hidden whitespace-nowrap md:block"
      style={{ left, top, background: tone, color: '#fff', borderRadius: 999, padding: '8px 14px', fontSize: 13, fontWeight: 700, boxShadow: `0 14px 30px -10px ${tone}aa` }}
      initial={{ opacity: 0, scale: 0.6, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{ opacity: { duration: 0.3 }, scale: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }, y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
    >
      {text}
    </motion.div>
  )
}
