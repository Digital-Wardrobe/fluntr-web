import Link from 'next/link'
import Sparkle from './Sparkle'

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-16 py-6"
      style={{ borderBottom: '0.5px solid rgba(201,168,76,0.08)', backdropFilter: 'blur(16px)', background: 'rgba(9,9,11,0.85)' }}>
      
      <Link href="/" className="flex items-center gap-3 no-underline">
        <Sparkle size={26} />
        <span className="font-cormorant text-xl font-normal tracking-widest text-white">flauntr</span>
      </Link>

      <div className="hidden md:flex items-center gap-9">
        <Link href="#features" className="text-xs tracking-widest text-white/40 uppercase no-underline hover:text-gold transition-colors">Features</Link>
        <Link href="#how" className="text-xs tracking-widest text-white/40 uppercase no-underline hover:text-gold transition-colors">How it Works</Link>
        <Link href="#waitlist" className="text-xs tracking-widest text-white/40 uppercase no-underline hover:text-gold transition-colors">Waitlist</Link>
        <Link href="#waitlist"
          className="px-6 py-2.5 text-xs tracking-widest uppercase no-underline transition-all"
          style={{ border: '0.5px solid #C9A84C', color: '#C9A84C' }}
          onMouseEnter={e => { e.target.style.background = '#C9A84C'; e.target.style.color = '#09090b' }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#C9A84C' }}>
          Join Waitlist
        </Link>
      </div>
    </nav>
  )
}
