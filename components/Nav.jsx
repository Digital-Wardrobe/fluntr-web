'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Logo from './Logo'
import { SoundToggle } from './motion/Sound'

const LINKS = [['/#what', 'What is it'], ['/#why', 'Why Fluntr'], ['/#stylist', 'Kween'], ['/#shop', 'Shopping'], ['/pricing', 'Pricing'], ['/#how', 'Try it'], ['/questions', 'Questions']]

/**
 * Floating pill bar: glass once you scroll, hides on the way down, back on the
 * way up. On phones and tablets the links live behind a menu button, in a
 * sheet that drops from the bar.
 */
export default function Nav() {
  const [visible, setVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const lastY = useRef(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      if (y < 80) setVisible(true)
      else if (y > lastY.current) setVisible(false)
      else setVisible(true)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // while the menu is open: the page behind does not scroll, Escape closes, the bar stays
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <>
      {/* tap outside to close: outside the sliding bar, so it covers the whole screen */}
      <AnimatePresence>
        {open ? (
          <motion.button
            key="scrim"
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ background: 'rgba(18,19,23,0.28)', border: 0, cursor: 'default' }}
          />
        ) : null}
      </AnimatePresence>
    <div
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      style={{ transform: visible || open ? 'translateY(0)' : 'translateY(-130%)', transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)', pointerEvents: 'none' }}
    >
      <nav
        className={`${scrolled || open ? 'glass' : ''} relative flex w-full max-w-6xl items-center justify-between px-4 py-2 md:px-5`}
        style={{ borderRadius: open ? 28 : 999, pointerEvents: 'auto', transition: 'background 0.3s, border-radius 0.3s' }}
        aria-label="Main"
      >
        <Link href="/" className="flex items-center no-underline" onClick={() => setOpen(false)}>
          <Logo size={20} />
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className="text-[14px] font-medium no-underline transition-colors hover:text-[#121317]" style={{ color: '#3A3D45' }}>
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <SoundToggle />
          <Link href="/#waitlist" className="btn-primary" style={{ padding: '10px 18px', fontSize: 13.5 }} onClick={() => setOpen(false)}>
            Join the waitlist
          </Link>
          {/* the menu button: phones and tablets only */}
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-10 w-10 items-center justify-center lg:hidden"
            style={{ borderRadius: 999, border: 0, background: open ? '#121317' : 'rgba(18,19,23,0.06)', color: open ? '#fff' : '#121317', cursor: 'pointer', transition: 'background 0.2s' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <motion.path d="M2 5h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" animate={open ? { d: 'M3 3l12 12' } : { d: 'M2 5h14' }} transition={{ duration: reduce ? 0 : 0.2 }} />
              <motion.path d="M2 9h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.15 }} />
              <motion.path d="M2 13h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" animate={open ? { d: 'M3 15l12-12' } : { d: 'M2 13h14' }} transition={{ duration: reduce ? 0 : 0.2 }} />
            </svg>
          </button>
        </div>

        {/* the sheet, dropping out of the bar */}
        <AnimatePresence>
          {open ? (
            <motion.div
              id="site-menu"
              key="menu"
              className="absolute inset-x-0 top-full mt-2 overflow-hidden lg:hidden"
              initial={reduce ? false : { opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{ borderRadius: 28, background: '#fff', border: '1px solid rgba(18,19,23,0.08)', boxShadow: '0 30px 70px -30px rgba(18,19,23,0.35)' }}
            >
              <ul className="m-0 list-none p-2">
                {LINKS.map(([href, label], n) => (
                  <li key={href}>
                    <Link href={href} onClick={() => setOpen(false)} className="flex items-center justify-between no-underline" style={{ padding: '14px 16px', borderRadius: 18, fontSize: 17, fontWeight: 600, color: '#121317' }}>
                      {label}
                      <span aria-hidden style={{ color: '#9AA0A6' }}>→</span>
                    </Link>
                    {n < LINKS.length - 1 ? <div aria-hidden style={{ height: 1, margin: '0 16px', background: 'rgba(18,19,23,0.06)' }} /> : null}
                  </li>
                ))}
              </ul>
              <div className="px-4 pb-4 pt-1">
                <Link href="/#waitlist" onClick={() => setOpen(false)} className="btn-primary flex w-full justify-center" style={{ padding: '14px 18px', fontSize: 15 }}>
                  Join the waitlist <span aria-hidden>→</span>
                </Link>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </nav>
    </div>
    </>
  )
}
