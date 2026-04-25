import Sparkle from './Sparkle'

export default function Footer() {
  return (
    <footer className="flex items-center justify-between flex-wrap gap-6 px-16 py-14"
      style={{ borderTop: '0.5px solid rgba(201,168,76,0.08)' }}>
      <div className="flex items-center gap-3">
        <Sparkle size={18} color="rgba(201,168,76,0.4)" />
        <span className="font-cormorant text-base tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>flauntr</span>
      </div>
      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.08em' }}>
        © 2025 Flauntr. All rights reserved.
      </p>
      <div className="flex gap-7">
        {['Instagram', 'Twitter', 'Privacy'].map(link => (
          <a key={link} href="#"
            className="no-underline transition-colors"
            style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}
            onMouseEnter={e => e.target.style.color = '#C9A84C'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.25)'}>
            {link}
          </a>
        ))}
      </div>
    </footer>
  )
}
