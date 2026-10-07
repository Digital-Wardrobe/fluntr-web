'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Logo from './Logo'

/** Floating glass bar. Hides on scroll-down, returns on scroll-up. */
export default function Nav() {
  const [visible, setVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const lastY = useRef(0)

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

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(-130%)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        pointerEvents: 'none',
      }}
    >
      <nav
        className={`${scrolled ? 'glass' : ''} flex w-full max-w-6xl items-center justify-between px-5 py-2.5 md:px-6`}
        style={{ borderRadius: 999, pointerEvents: 'auto', transition: 'background 0.3s' }}
      >
        <Link href="/" className="flex items-center no-underline">
          <Logo size={20} />
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {[['#features', 'Features'], ['#how', 'How it works'], ['#app', 'The app']].map(([href, label]) => (
            <Link key={href} href={href} className="text-[13.5px] font-medium no-underline transition-colors hover:text-[#15171B]" style={{ color: '#3A3D45' }}>
              {label}
            </Link>
          ))}
        </div>

        <Link href="#waitlist" className="btn-primary" style={{ padding: '10px 18px', fontSize: 13 }}>
          Join the waitlist
        </Link>
      </nav>
    </div>
  )
}
