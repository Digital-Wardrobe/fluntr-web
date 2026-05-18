// Drop into: flauntr-web/components/Nav.jsx
import Link from 'next/link'
import Sparkle from './Sparkle'

export default function Nav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-16 py-6 max-md:px-6"
      style={{
        borderBottom: '0.5px solid rgba(201,168,76,0.08)',
        backdropFilter: 'blur(16px)',
        background: 'rgba(9,9,11,0.88)',
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
