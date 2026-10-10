'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Kween, { Bubble } from './Kween'
import { useSound } from './Sound'

/**
 * How it works, as a demo you drive. This is also the hero's stage.
 *
 * Six screens in a phone. You pick a few photos, press upload, watch the
 * processing, check the details Kween filled in, see the piece in your closet,
 * then in the feed, then ask Kween what to wear. Every screen waits for you,
 * and each step has its sound: a shutter for each photo processed, a hanger
 * clink when a piece is saved, a chime when the closet is ready, a tick under
 * Kween's words as she types.
 *
 * The screens are exported so the feature cards further down the page can show
 * them at rest, at a larger size, without a second implementation.
 */

const INK = '#121317'
const MUTED = '#6B7080'
const LINE = 'rgba(18,19,23,0.08)'
const TANG = '#F28C38'

export const GALLERY = [
  { id: 'teal', src: 'teal-shirt', name: 'Teal linen shirt', category: 'Tops', colour: 'Teal', hex: '#3F8FA3', occasion: ['Casual', 'Work'], cutout: true },
  { id: 'plaid', src: 'denim-plaid', name: 'Denim jacket', category: 'Outerwear', colour: 'Indigo', hex: '#2F4A7A', occasion: ['Casual'] },
  { id: 'white', src: 'white-shirts', name: 'White shirt', category: 'Tops', colour: 'White', hex: '#F2EFE8', occasion: ['Work', 'Formal'] },
  { id: 'jeans', src: 'jeans-folded', name: 'Blue jeans', category: 'Bottoms', colour: 'Denim', hex: '#4A6FA5', occasion: ['Casual'] },
  { id: 'chinos', src: 'chinos-folded', name: 'Sand chinos', category: 'Bottoms', colour: 'Sand', hex: '#C9B18F', occasion: ['Casual', 'Work'] },
  { id: 'knit', src: 'knit-folded', name: 'Cream knit', category: 'Tops', colour: 'Cream', hex: '#E6DCC8', occasion: ['Casual'] },
  { id: 'rail', src: 'knits-rail', name: 'Chestnut cardigan', category: 'Outerwear', colour: 'Chestnut', hex: '#7A4A2E', occasion: ['Casual', 'Party'] },
  { id: 'snake', src: 'snake-cardigan', name: 'Snake-print cardigan', category: 'Outerwear', colour: 'Taupe', hex: '#A89478', occasion: ['Party'] },
]
export const byId = Object.fromEntries(GALLERY.map(g => [g.id, g]))

export const QA = [
  { q: 'What goes with this?', a: 'Easy. Sand chinos, white shirt. Done before chai.', mood: 'smug', picks: ['chinos', 'white'] },
  { q: 'Wedding on Saturday. Help.', a: 'Snake print over the white shirt. Arre, iconic.', mood: 'love', picks: ['snake', 'white', 'chinos'] },
  { q: 'Too much for office?', a: 'The teal? No. The snake print? Yes. Obviously.', mood: 'smug', picks: ['teal', 'chinos'] },
  { q: "What haven't I worn lately?", a: "That cream knit hasn't seen daylight in 3 weeks.", mood: 'shock', picks: ['knit'] },
]

const STEPS = [
  { k: 'pick', title: 'Pick a few photos.', body: 'Anything from your camera roll. A mirror shot, a flat lay, a pile on the bed.', line: 'Pick a few. Any photo works.' },
  { k: 'process', title: 'The boring part happens on the phone.', body: 'Background out, colour read, category guessed. Nothing waits on a server.', line: 'Hold on. Doing the boring part.' },
  { k: 'detail', title: 'Check what Kween filled in.', body: 'Category, colour, occasion. Fix anything, or just save.', line: 'I filled it in. Fix anything I got wrong.' },
  { k: 'closet', title: 'It lands in your closet.', body: 'Every piece you own, in a grid you can actually look through.', line: 'That’s your closet. Finally.' },
  { k: 'feed', title: 'Post it, or ask first.', body: 'Put a look up and see what people think while you still have time to change.', line: 'Now post it. Or ask me.' },
  { k: 'kween', title: 'Ask Kween.', body: 'Short answers, from the clothes you actually own.', line: 'Go on. Ask me something.' },
]

/* ── small parts ─────────────────────────────────────────────────────────── */

export function Photo({ src, alt = '', sizes = '160px', className = '', style }) {
  return (
    <Image src={`/images/gallery/${src}.webp`} alt={alt} width={480} height={600} sizes={sizes} className={className} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }} />
  )
}

function Pill({ children, dark = false, small = false, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center transition-transform active:scale-[0.97] disabled:opacity-40"
      style={{
        background: dark ? INK : '#F0F0F0', color: dark ? '#fff' : INK,
        borderRadius: 999, padding: small ? '7px 12px' : '11px 18px', fontSize: small ? 11 : 13, fontWeight: 600, border: 0, cursor: disabled ? 'default' : 'pointer',
        boxShadow: dark ? '0 10px 24px rgba(18,19,23,0.22)' : 'none',
      }}
    >
      {children}
    </button>
  )
}

export function Glyph({ k, color = INK, size = 13 }) {
  const s = { width: size, height: size, display: 'block' }
  const p = { fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
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
    default: return null
  }
}

export function TabBar({ active = 'closet' }) {
  const items = ['home', 'closet', 'add', 'search', 'me']
  return (
    <div className="absolute inset-x-[6%] bottom-[3.5%] flex items-center justify-around" style={{ background: '#2E2E30', borderRadius: 999, padding: '7px 8px' }}>
      {items.map(k => (
        <span key={k} className="flex items-center justify-center" style={{ width: 26, height: 26, borderRadius: 999, background: k === active ? '#fff' : 'transparent' }}>
          <Glyph k={k} color={k === active ? INK : '#fff'} />
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

/* ── screens ─────────────────────────────────────────────────────────────── */

function PickScreen({ selected, toggle, onUpload }) {
  return (
    <div className="absolute inset-0" style={{ background: '#fff' }}>
      <div className="flex items-center justify-between px-[6%] pt-[14%] pb-[3%]">
        <span style={{ fontSize: 18, lineHeight: 1 }}>×</span>
        <span style={{ background: '#F0F0F0', borderRadius: 999, padding: '6px 14px', fontSize: 12, fontWeight: 600 }}>Recents ▾</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: selected.length ? INK : '#B8BBC2' }}>Next</span>
      </div>
      <div className="grid grid-cols-3 gap-[2%] px-[2%]">
        {GALLERY.map(g => {
          const i = selected.indexOf(g.id)
          const on = i >= 0
          return (
            <button key={g.id} type="button" onClick={() => toggle(g.id)} className="relative overflow-hidden" style={{ aspectRatio: '1 / 1', border: 0, padding: 0, background: '#eee', cursor: 'pointer', borderRadius: 4 }} aria-pressed={on} aria-label={g.name}>
              <motion.div className="h-full w-full" animate={{ scale: on ? 0.9 : 1 }} transition={{ type: 'spring', stiffness: 400, damping: 26 }}>
                <Photo src={g.src} sizes="110px" />
              </motion.div>
              <motion.span
                className="absolute right-[7%] top-[7%] flex items-center justify-center"
                style={{ width: 20, height: 20, borderRadius: 999, background: on ? INK : 'rgba(255,255,255,0.75)', border: on ? 0 : '1.5px solid rgba(18,19,23,0.5)', color: '#fff', fontSize: 11, fontWeight: 700 }}
                animate={{ scale: on ? [1, 1.25, 1] : 1 }}
              >
                {on ? i + 1 : ''}
              </motion.span>
            </button>
          )
        })}
      </div>
      <AnimatePresence>
        {selected.length ? (
          <motion.div key="up" className="absolute inset-x-0 flex justify-center" style={{ bottom: '13%' }} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 18, opacity: 0 }}>
            <Pill dark onClick={onUpload}>Upload {selected.length} {selected.length === 1 ? 'photo' : 'photos'}</Pill>
          </motion.div>
        ) : (
          <motion.div key="hint" className="absolute inset-x-0 text-center" style={{ bottom: '15%', fontSize: 12, color: MUTED }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            Tap up to four photos
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-x-[14%] bottom-[3.5%] flex items-center justify-between" style={{ background: '#2E2E30', borderRadius: 999, padding: 5 }}>
        {['Post', 'Closet', 'Mirror'].map(t => (
          <span key={t} style={{ flex: 1, textAlign: 'center', fontSize: 12, fontWeight: 600, padding: '8px 0', borderRadius: 999, background: t === 'Closet' ? '#fff' : 'transparent', color: t === 'Closet' ? INK : '#fff' }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

const STAGES = ['Finding the garment', 'Removing the background', 'Reading the colour', 'Guessing the category']

function ProcessScreen({ selected, onDone }) {
  const reduce = useReducedMotion()
  const { play } = useSound()
  const [i, setI] = useState(0)
  const [stage, setStage] = useState(0)
  const per = reduce ? 600 : 1400
  // The parent re-renders while this runs (Kween's line changes), which hands
  // down a new onDone each time. Read it through a ref so the per-photo timer
  // and its shutter fire exactly once per photo.
  const onDoneRef = useRef(onDone); onDoneRef.current = onDone
  const playRef = useRef(play); playRef.current = play
  useEffect(() => {
    const t = setInterval(() => setStage(s => (s + 1) % STAGES.length), per / STAGES.length)
    return () => clearInterval(t)
  }, [per])
  useEffect(() => {
    if (i >= selected.length) { playRef.current('chime'); const t = setTimeout(() => onDoneRef.current(), 650); return () => clearTimeout(t) }
    playRef.current('shutter', { gain: 0.8 })
    const z = setTimeout(() => playRef.current('zip', { gain: 0.5 }), per * 0.45)
    const t = setTimeout(() => setI(i + 1), per)
    return () => { clearTimeout(t); clearTimeout(z) }
  }, [i, selected.length, per])
  const done = Math.min(i, selected.length)
  return (
    <div className="absolute inset-0 flex flex-col items-center" style={{ background: '#fff' }}>
      <div className="pt-[16%] text-center" style={{ fontSize: 12, fontWeight: 600, color: MUTED }}>{done} of {selected.length}</div>
      <div className="relative mt-[8%]" style={{ width: '58%', aspectRatio: '4 / 5' }}>
        {selected.slice(Math.max(0, i), i + 3).map((id, n) => (
          <motion.div key={id} className="absolute inset-0 overflow-hidden" style={{ borderRadius: 16, boxShadow: '0 20px 40px rgba(18,19,23,0.16)', zIndex: 3 - n }} initial={{ rotate: (n + 1) * 5, y: n * 8, scale: 1 - n * 0.05 }} animate={{ rotate: n * 5, y: n * 8, scale: 1 - n * 0.05 }}>
            <Photo src={byId[id].src} sizes="200px" />
            {n === 0 && !reduce ? (
              <motion.div aria-hidden className="absolute inset-x-0" style={{ height: '26%', background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0) 100%)' }} animate={{ top: ['-26%', '100%'] }} transition={{ duration: per / 1000 * 0.9, repeat: Infinity, ease: 'linear' }} />
            ) : null}
            {n === 0 ? <div aria-hidden className="absolute inset-[8%]" style={{ border: '1.5px dashed rgba(255,255,255,0.9)', borderRadius: 10 }} /> : null}
          </motion.div>
        ))}
        {i >= selected.length ? (
          <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <span className="flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: 999, background: INK }}><Glyph k="check" color="#fff" size={26} /></span>
          </motion.div>
        ) : null}
      </div>
      <div className="mt-[10%] flex items-center gap-2" style={{ fontSize: 13, fontWeight: 500, color: INK }}>
        <motion.span style={{ width: 7, height: 7, borderRadius: 999, background: TANG, display: 'inline-block' }} animate={reduce ? undefined : { opacity: [1, 0.2, 1] }} transition={{ duration: 0.9, repeat: Infinity }} />
        {i >= selected.length ? 'Done' : `${STAGES[stage]}…`}
      </div>
      <div className="mt-3 overflow-hidden" style={{ width: '58%', height: 4, borderRadius: 999, background: '#F0F0F0' }}>
        <motion.div style={{ height: '100%', background: INK, borderRadius: 999 }} animate={{ width: `${(done / selected.length) * 100}%` }} transition={{ duration: 0.5 }} />
      </div>
      <div className="mt-auto pb-[6%]" style={{ fontSize: 11, color: MUTED }}>On your phone. Nothing uploaded yet.</div>
    </div>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between py-[3.2%]" style={{ borderBottom: `1px solid ${LINE}`, fontSize: 12 }}>
      <span style={{ color: MUTED }}>{label}</span>
      <span className="flex items-center gap-1.5" style={{ fontWeight: 600, color: INK }}>{children}</span>
    </div>
  )
}

export function DetailScreen({ item, onSave }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: '#fff' }}>
      <div className="flex items-center justify-between px-[6%] pt-[14%] pb-[2%]">
        <span style={{ fontSize: 18 }}>‹</span><span style={{ fontSize: 13, fontWeight: 600 }}>Item details</span><span style={{ width: 18 }} />
      </div>
      <div className="relative mx-[6%] overflow-hidden" style={{ aspectRatio: '4 / 3.4', borderRadius: 16, background: 'radial-gradient(80% 70% at 50% 40%, #F7F7F8, #ECEDF0)' }}>
        {item.cutout ? (
          <motion.img src="/images/g/teal-shirt.webp" alt="" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ height: '92%', width: 'auto', filter: 'drop-shadow(0 16px 20px rgba(18,19,23,0.18))' }} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 22 }} />
        ) : (
          <motion.div className="absolute inset-[7%] overflow-hidden" style={{ borderRadius: 12, boxShadow: '0 16px 30px rgba(18,19,23,0.16)' }} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><Photo src={item.src} sizes="220px" /></motion.div>
        )}
        <span className="glass absolute left-[5%] top-[5%]" style={{ borderRadius: 999, padding: '4px 9px', fontSize: 9.5, fontWeight: 600 }}>{item.cutout ? 'Background removed' : 'Saved as photo'}</span>
      </div>
      <div className="px-[6%] pt-[4%]">
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>{item.name}</div>
        <div style={{ fontSize: 11, color: MUTED }}>Kween filled these in. Tap any to change.</div>
        <div className="mt-[3%]">
          <Row label="Category">{item.category}</Row>
          <Row label="Colour"><span style={{ width: 12, height: 12, borderRadius: 999, background: item.hex, border: '1px solid rgba(18,19,23,0.12)', display: 'inline-block' }} />{item.colour}</Row>
          <Row label="Occasion">{item.occasion.map(o => <span key={o} style={{ background: '#F0F0F0', borderRadius: 999, padding: '2px 8px', fontSize: 11 }}>{o}</span>)}</Row>
          <Row label="Brand"><span style={{ color: '#B8BBC2', fontWeight: 400 }}>Add</span></Row>
          <Row label="Size">M</Row>
        </div>
      </div>
      {onSave ? <div className="mt-auto flex justify-center pb-[8%]"><Pill dark onClick={onSave}>Save to closet</Pill></div> : null}
    </div>
  )
}

export function ClosetScreen({ selected, onNext, label = 'added to Everyone' }) {
  const { play } = useSound()
  useEffect(() => {
    const ts = selected.map((_, n) => setTimeout(() => play('tick', { gain: 0.6, rate: 1 + n * 0.08 }), 120 + n * 90))
    return () => ts.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="absolute inset-0" style={{ background: '#fff' }}>
      <Image src="/images/app-closet-empty.webp" alt="" width={620} height={1262} sizes="380px" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <div className="absolute inset-x-0" style={{ top: '26%', bottom: '12%', background: '#fff' }} />
      <div className="absolute inset-x-[4%] grid grid-cols-3 gap-[3%]" style={{ top: '27.5%' }}>
        {selected.map((id, n) => (
          <motion.div key={id} className="overflow-hidden" style={{ borderRadius: 10, background: '#F4F5F7' }} initial={{ scale: 0.6, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.1 + n * 0.09 }}>
            <div style={{ aspectRatio: '3 / 4' }}><Photo src={byId[id].src} sizes="120px" /></div>
            <div className="truncate px-1.5 py-1" style={{ fontSize: 9, fontWeight: 600 }}>{byId[id].name}</div>
          </motion.div>
        ))}
      </div>
      <motion.div className="glass absolute left-1/2 -translate-x-1/2" style={{ top: '19%', borderRadius: 999, padding: '6px 12px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
        + {selected.length} {label}
      </motion.div>
      {onNext ? <div className="absolute inset-x-0 flex justify-center" style={{ bottom: '14%' }}><Pill dark onClick={onNext}>See it in the feed</Pill></div> : null}
      <TabBar active="closet" />
    </div>
  )
}

export function FeedScreen({ item, onAsk }) {
  const reduce = useReducedMotion()
  const [likes, setLikes] = useState(0)
  useEffect(() => {
    if (reduce) { setLikes(142); return }
    let n = 0
    const t = setInterval(() => { n += 7; setLikes(Math.min(142, n)); if (n >= 142) clearInterval(t) }, 40)
    return () => clearInterval(t)
  }, [reduce])
  return (
    <div className="absolute inset-0" style={{ background: '#fff' }}>
      <div className="flex items-center justify-between px-[6%] pt-[13%]" style={{ fontSize: 13, fontWeight: 700 }}><span style={{ width: 16 }} /><span>Fluntr</span><span style={{ width: 16 }} /></div>
      <div className="flex gap-2 px-[6%] pt-[3%]">
        <span style={{ background: INK, color: '#fff', borderRadius: 999, padding: '4px 10px', fontSize: 10, fontWeight: 600 }}>For you</span>
        <span style={{ background: '#F0F0F0', borderRadius: 999, padding: '4px 10px', fontSize: 10, fontWeight: 600 }}>Following</span>
      </div>
      <motion.div className="relative mx-[4%] mt-[5%] overflow-hidden" style={{ aspectRatio: '4 / 5', borderRadius: 16 }} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 24 }}>
        <Photo src={item.src} sizes="340px" />
        <div className="absolute left-[4%] top-[4%] flex items-center gap-1.5" style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 999, padding: '4px 9px 4px 4px', color: '#fff' }}>
          <span style={{ width: 18, height: 18, borderRadius: 999, background: '#fff', display: 'inline-block' }} /><span style={{ fontSize: 10, fontWeight: 600 }}>You</span>
        </div>
        <span className="absolute left-[4%]" style={{ top: '15%', background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: 6, padding: '2px 6px', fontSize: 8.5, fontWeight: 600 }}>Closet Item</span>
        <div className="absolute bottom-[4%] left-[4%] flex items-center gap-3" style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 999, padding: '6px 10px', color: '#fff', fontSize: 10, fontWeight: 600 }}>
          <span className="flex items-center gap-1"><Glyph k="heart" color="#fff" size={12} />{likes}</span>
          <span className="flex items-center gap-1"><Glyph k="comment" color="#fff" size={12} />8</span>
          <span className="flex items-center gap-1"><Glyph k="share" color="#fff" size={12} />3</span>
        </div>
      </motion.div>
      <div className="px-[6%] pt-2" style={{ fontSize: 10, color: MUTED }}>From a closet · {item.name}</div>
      {onAsk ? <div className="absolute inset-x-0 flex justify-center" style={{ bottom: '14%' }}><Pill dark onClick={onAsk}>Ask Kween what goes with it</Pill></div> : null}
      <TabBar active="home" />
    </div>
  )
}

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
      <div className="flex items-center justify-between px-[6%] pt-[14%]"><span style={{ fontSize: 18 }}>‹</span><span style={{ fontSize: 13, fontWeight: 600 }}>Kween</span><span style={{ width: 18 }} /></div>
      <div className="relative mx-auto mt-[1%]" style={{ width: '36%' }}>
        <Kween expression={mood} talking={talking} size="100%" onClick={() => ask(asked == null ? 0 : (asked + 1) % QA.length)} />
      </div>
      <div className="px-[6%]">
        <AnimatePresence mode="wait">
          {qa ? (
            <motion.div key={asked} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="ml-auto w-max max-w-[85%]" style={{ background: INK, color: '#fff', borderRadius: '16px 16px 4px 16px', padding: '8px 12px', fontSize: 12, fontWeight: 500 }}>{qa.q}</div>
              <div className="mt-2 w-max max-w-[88%]" style={{ background: '#F0F0F0', borderRadius: '16px 16px 16px 4px', padding: '8px 12px', fontSize: 12, fontWeight: 500, minHeight: 34 }}>{typed}<span style={{ opacity: talking ? 1 : 0 }}>▍</span></div>
              {!talking ? (
                <motion.div className="mt-3 flex gap-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  {qa.picks.map(id => (<div key={id} className="overflow-hidden" style={{ width: '28%', aspectRatio: '3 / 4', borderRadius: 8, boxShadow: '0 8px 18px rgba(18,19,23,0.14)' }}><Photo src={byId[id].src} sizes="90px" /></div>))}
                </motion.div>
              ) : null}
            </motion.div>
          ) : (
            <motion.div key="hint" className="text-center" style={{ fontSize: 12, color: MUTED }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Pick a question, or tap Kween.</motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-auto px-[5%] pb-[14%]">
        <div className="flex flex-wrap gap-1.5">
          {QA.map((x, i) => (
            <button key={x.q} type="button" onClick={() => ask(i)} style={{ background: i === asked ? INK : '#fff', color: i === asked ? '#fff' : INK, border: `1px solid ${i === asked ? INK : 'rgba(18,19,23,0.14)'}`, borderRadius: 999, padding: '6px 10px', fontSize: 10.5, fontWeight: 600, cursor: 'pointer' }}>{x.q}</button>
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
  const [mood, setMood] = useState('idle')
  const [talking, setTalking] = useState(false)
  const [line, setLine] = useState(STEPS[0].line)
  const reduce = useReducedMotion()
  const { play } = useSound()

  useEffect(() => {
    setLine(STEPS[step].line)
    if (step === 5) return
    setMood(step === 3 ? 'happy' : step === 2 ? 'smug' : 'idle')
    if (reduce) return
    setTalking(true)
    const t = setTimeout(() => setTalking(false), 1100)
    return () => clearTimeout(t)
  }, [step, reduce])

  function go(n, sound) { if (sound) play(sound); setStep(n) }
  function toggle(id) {
    setSelected(s => {
      const on = s.includes(id)
      if (!on && s.length >= 4) return s
      play(on ? 'tick' : 'pop', { rate: on ? 0.9 : 1 + s.length * 0.06 })
      return on ? s.filter(x => x !== id) : [...s, id]
    })
  }
  function restart() { play('swish', { gain: 0.6 }); setSelected([]); setMood('idle'); setStep(0) }
  const first = byId[selected[0]] || GALLERY[0]
  const screens = [
    <PickScreen key="pick" selected={selected} toggle={toggle} onUpload={() => go(1, 'whoosh')} />,
    <ProcessScreen key="process" selected={selected} onDone={() => setStep(2)} />,
    <DetailScreen key="detail" item={first} onSave={() => go(3, 'hanger')} />,
    <ClosetScreen key="closet" selected={selected} onNext={() => go(4, 'swish')} />,
    <FeedScreen key="feed" item={first} onAsk={() => go(5, 'pop')} />,
    <KweenScreen key="kween" onRestart={restart} mood={mood} talking={talking} setMood={setMood} setTalking={setTalking} />,
  ]

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
                <h2 className="h-display" style={{ fontSize: 'clamp(30px,3.8vw,52px)', color: INK }}>{STEPS[step].title}</h2>
                <p className="mt-4 max-w-md text-[17px] leading-relaxed" style={{ color: MUTED }}>{STEPS[step].body}</p>
              </motion.div>
            </AnimatePresence>
            <ol className="mt-8 flex flex-col gap-1">
              {STEPS.map((s, i) => (
                <li key={s.k}>
                  <button type="button" onClick={() => (i === 1 ? null : i === 0 || selected.length ? go(i, 'tick') : null)} className="flex w-full items-center gap-4 rounded-full px-3 py-2 text-left transition-colors" style={{ background: i === step ? '#fff' : 'transparent', cursor: i === 1 ? 'default' : 'pointer', boxShadow: i === step ? '0 1px 2px rgba(18,19,23,0.06)' : 'none' }}>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center" style={{ borderRadius: 999, background: i <= step ? INK : '#E8E9EC', color: i <= step ? '#fff' : MUTED, fontSize: 11, fontWeight: 600 }}>
                      {i < step ? <Glyph k="check" color="#fff" size={12} /> : i + 1}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: i === step ? 600 : 500, color: i === step ? INK : MUTED }}>{s.title}</span>
                  </button>
                </li>
              ))}
            </ol>
            {step > 0 ? <button type="button" onClick={restart} className="mt-5 text-[13px] font-medium underline" style={{ color: MUTED, background: 'none', border: 0, cursor: 'pointer' }}>Start over</button> : null}

            {/* Kween, in the layout: on the stage floor, beside the steps, talking */}
            <div className="mt-8 flex items-end gap-3 md:mt-10">
              <div className="w-[96px] shrink-0 md:w-[120px]">
                <Kween expression={mood} talking={talking} size="100%" onClick={() => { play('pop', { rate: 1.2 }); setTalking(true); setTimeout(() => setTalking(false), 900) }} />
              </div>
              <div className="pb-5 md:pb-7">
                <AnimatePresence mode="wait">
                  <motion.div key={line} initial={{ opacity: 0, scale: 0.7, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}>
                    <Bubble text={line} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* right: the phone */}
          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative" style={{ width: 'min(84vw, 360px)' }}>
              <Device>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={step} className="absolute inset-0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                    {screens[step]}
                  </motion.div>
                </AnimatePresence>
              </Device>
              {/* floating props around the phone, per step */}
              <AnimatePresence>
                {step === 3 ? <Prop key="p3" text="+ 3 pieces" tone="#4F9D6B" left="-18%" top="18%" /> : null}
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
