// Drop into: flauntr-web/components/Nav.jsx
'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Sparkle from './Sparkle'

export default function Nav() {
  const [visible, setVisible] = useState(true)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (y < 80) {
        // Always show when near the top
        setVisible(true)
      } else if (y > lastY.current) {
        // Scrolling DOWN — hide
        setVisible(false)
      } else {
        // Scrolling UP — show
        setVisible(true)
      }
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-16 py-6 max-md:px-6"
      style={{
        borderBottom: '0.5px solid rgba(201,168,76,0.08)',
        backdropFilter: 'blur(16px)',
        background: 'rgba(9,9,11,0.88)',
        transform: visible ? 'translateY(0)' : 'translateY(-110%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        willChange: 'transform',
      }}
    >
      <Link href="/" className="flex items-center gap-3 no-underline">
        <Sparkle size={24} />
        <span className="font-cormorant text-xl font-normal tracking-widest text-white">fluntr</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {[['#features', 'Features'], ['#how', 'How it Works'], ['#app', 'The App']].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="text-xs tracking-widest uppercase no-underline transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => e.target.style.color = '#C9A84C'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
          >
            {label}
          </Link>
        ))}
        <Link
          href="#waitlist"
          className="px-6 py-2.5 text-xs tracking-widest uppercase no-underline transition-all"
          style={{ border: '0.5px solid #C9A84C', color: '#C9A84C' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#C9A84C'; e.currentTarget.style.color = '#09090b' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C9A84C' }}
        >
          Join Waitlist
        </Link>
      </div>
    </nav>
  )
}
