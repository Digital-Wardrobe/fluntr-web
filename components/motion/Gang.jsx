'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Kween, { Bubble, PLUSH, COLORS } from './Kween'
import { Glyph } from './Demo'
import { KweenPerch } from './KweenRoamer'
import { kweenReact, onKweenTap, useLooks, setLook } from './kweenStore'
import { useSound } from './Sound'
import { track } from '../../lib/analytics'

/**
 * Meet the gang: Kween and her friends Teddy and Mochi, the three plushes you
 * can pick from in the app, in the app's eight colours. A little game to meet
 * them by: tap a plush and the hanger passes to it; the others notice.
 *
 * Kween here is the roaming Kween herself, seated on a perch in the middle of
 * the stage, so there is only ever one of her on the page. Teddy and Mochi
 * live in the stage.
 */

const INK = '#121317'
const MUTED = '#6B7080'
const FRIENDS = ['teddy', 'plain']
const SAYS = {
  teddy: ['Got it! Now what?', 'Cosy. Mine now.', 'I’ll hold it. Carefully.'],
  plain: ['mochi.', 'Ooh. Shiny.', 'Okay, okay, I’ve got it.'],
}
const KWEEN_GETS = ['Mine! Obviously.', 'Finally. Good taste.', 'Thank you, darling.']
const KWEEN_SEES = { teddy: 'Teddy, pass it back!', plain: 'Mochi, don’t sit on it.' }
const pick = a => a[Math.floor(Math.random() * a.length)]

export default function Gang() {
  const reduce = useReducedMotion()
  const { play } = useSound()
  const looks = useLooks()
  const [holder, setHolder] = useState('kween')
  const [faces, setFaces] = useState({ teddy: 'idle', plain: 'idle' })
  const [lines, setLines] = useState({ teddy: null, plain: null })
  const [hops, setHops] = useState({ teddy: 0, plain: 0 })
  const [chosen, setChosen] = useState('kween') // whose colour the swatches change
  const [passes, setPasses] = useState(0)
  const timers = useRef([])
  const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)) }
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const face = (who, f, ms) => { setFaces(x => ({ ...x, [who]: f })); if (ms) later(() => setFaces(x => (x[who] === f ? { ...x, [who]: 'idle' } : x)), ms) }
  const say = (who, line, ms = 2200) => { setLines(x => ({ ...x, [who]: line })); later(() => setLines(x => (x[who] === line ? { ...x, [who]: null } : x)), ms) }

  // the game: the hanger goes to whoever you tap; the other two react
  const pass = to => {
    if (to === holder) { if (to !== 'kween') { setHops(h => ({ ...h, [to]: h[to] + 1 })); say(to, 'Already mine!') } return }
    const from = holder
    setHolder(to); setPasses(n => n + 1); play('pop', { gain: 0.5, rate: 1.15 })
    track('gang_pass', { to })
    if (to === 'kween') kweenReact(pick(KWEEN_GETS), 'love', 2200)
    else {
      setHops(h => ({ ...h, [to]: h[to] + 1 })); face(to, 'happy', 2200); later(() => say(to, pick(SAYS[to])), 500)
      kweenReact(KWEEN_SEES[to], 'smug', 2000)
    }
    // the one who lost it, and the one watching
    FRIENDS.filter(f => f !== to).forEach((f, n) => {
      face(f, 'shock', 520)
      later(() => face(f, f === from ? 'content' : 'happy', 1600), 520 + n * 80)
    })
  }
  // a tap on the roaming Kween counts, while she is here
  useEffect(() => onKweenTap(() => {
    const k = document.querySelector('[data-kween-state]')
    if (k && k.dataset.kweenOn === 'gang') pass('kween')
  }))

  const slot = 'clamp(84px, 14vw, 136px)'
  const Hanger = () => (
    <motion.span layoutId="hanger" aria-hidden className="absolute left-1/2 flex items-center justify-center" style={{ top: -14, marginLeft: -19, width: 38, height: 38, borderRadius: 999, background: '#FFD700', boxShadow: '0 8px 18px rgba(255,215,0,0.5), 0 0 0 3px #fff' }} transition={{ type: 'spring', stiffness: 320, damping: 22 }}>
      <Glyph k="closet" color={INK} size={20} sw={2.2} />
    </motion.span>
  )

  return (
    <section id="gang" className="cv-auto relative scroll-mt-20 px-4 py-14 md:px-6 md:py-24" style={{ containIntrinsicSize: 'auto 900px' }}>
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-eyebrow mb-5">Meet the gang</p>
          <h2 className="h-display" style={{ fontSize: 'clamp(32px,4.4vw,60px)', color: INK }}>
            Kween, Teddy and <span className="serif-accent">Mochi</span>.
          </h2>
          <p className="mt-5 max-w-2xl text-[18px] leading-relaxed md:text-[20px]" style={{ color: MUTED }}>
            Pick your plush. Any name, eight colours.
          </p>
        </div>

        {/* the stage */}
        <div className="relative mt-10 overflow-hidden" style={{ borderRadius: 40, background: 'linear-gradient(180deg, #FFF4EC 0%, #FDEFF3 60%, #F5F6F8 100%)', border: '1px solid rgba(18,19,23,0.06)' }}>
          <p className="absolute right-5 top-5 m-0 flex items-center gap-2 text-[13px] font-semibold" style={{ color: MUTED }}>
            <span className="flex h-6 w-6 items-center justify-center" style={{ borderRadius: 999, background: '#FFD700' }}><Glyph k="closet" color={INK} size={13} sw={2.2} /></span>
            Tap a plush to pass the hanger{passes ? ` · ${passes}` : ''}
          </p>
          <div className="grid grid-cols-3 items-end px-4 pb-6 pt-28 md:px-12 md:pb-10 md:pt-32">
            {['teddy', 'kween', 'plain'].map(who => (
              <div key={who} className="flex flex-col items-center">
                <div className="relative" style={{ width: slot }}>
                  {/* the bubble, above the head */}
                  <AnimatePresence>
                    {who !== 'kween' && lines[who] ? (
                      <motion.div key={lines[who]} className="absolute bottom-[96%] z-10" style={who === 'teddy' ? { left: '70%' } : { right: '70%' }} initial={{ opacity: 0, scale: 0.7, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}>
                        <Bubble text={lines[who]} side={who === 'teddy' ? 'left' : 'right'} style={{ fontSize: 13, width: 'max-content', maxWidth: 'min(170px, 38vw)' }} />
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                  {holder === who ? <Hanger /> : null}
                  {who === 'kween'
                    ? <KweenPerch name="gang" line="These two? Family." mood="love" width="100%" />
                    : (
                      <button type="button" onClick={() => pass(who)} aria-label={`Pass the hanger to ${PLUSH[who].name}`} className="block w-full" style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer' }}>
                        <Kween persona={who} color={looks[who]} expression={faces[who]} talking={!!lines[who] && !reduce} hopKey={hops[who]} follow={false} size="100%" />
                      </button>
                    )}
                </div>
                <span className="mt-2 text-[14px] font-bold" style={{ color: INK }}>{PLUSH[who].name}</span>
              </div>
            ))}
          </div>
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'rgba(18,19,23,0.06)' }} />
        </div>

        {/* who they are, and your colour */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {['kween', 'teddy', 'plain'].map(who => {
            const on = chosen === who
            return (
              <button key={who} type="button" onClick={() => { setChosen(who); play('tick', { gain: 0.3 }) }} aria-pressed={on} className="flex items-start gap-4 text-left" style={{ borderRadius: 22, padding: '14px 16px', background: on ? '#fff' : '#F5F6F8', border: `1.5px solid ${on ? INK : 'rgba(18,19,23,0.06)'}`, cursor: 'pointer', transition: 'border-color .2s, background .2s' }}>
                <span className="block shrink-0" style={{ width: 44 }}><Kween persona={who} color={looks[who]} expression={who === 'kween' ? 'wink' : 'happy'} follow={false} size="100%" /></span>
                <span className="min-w-0">
                  <span className="block text-[15.5px] font-bold" style={{ color: INK }}>{PLUSH[who].name}</span>
                  <span className="block text-[13.5px] leading-snug" style={{ color: MUTED }}>{PLUSH[who].desc}</span>
                </span>
              </button>
            )
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-[13.5px] font-semibold" style={{ color: MUTED }}>{PLUSH[chosen].name}’s colour</span>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={`${PLUSH[chosen].name}'s colour`}>
            {COLORS.map(([key, label, hex]) => {
              const on = looks[chosen] === key
              return (
                <button key={key} type="button" role="radio" aria-checked={on} aria-label={label} title={label} onClick={() => { setLook(chosen, key); play('pop', { gain: 0.35, rate: 1.3 }); track('gang_colour', { who: chosen, colour: key }) }} className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 999, border: `2px solid ${on ? INK : 'transparent'}`, padding: 3, background: 'transparent', cursor: 'pointer' }}>
                  <span className="block h-full w-full" style={{ borderRadius: 999, background: hex, boxShadow: 'inset 0 0 0 1px rgba(18,19,23,0.12)' }} />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
