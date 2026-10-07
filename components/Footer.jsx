import Sparkle from './Sparkle'

export default function Footer() {
  return (
    <footer
      className="flex flex-wrap items-center justify-between gap-6 px-6 py-12 md:px-16"
      style={{ borderTop: '1px solid rgba(21,23,27,0.08)' }}
    >
      <div className="flex items-center gap-2.5">
        <Sparkle size={16} color="#767A85" />
        <span className="text-[15px] font-semibold tracking-tight" style={{ color: '#3A3D45' }}>fluntr</span>
      </div>
      <p style={{ fontSize: 12, color: '#9AA0A6' }}>© 2026 Fluntr. All rights reserved.</p>
      <div className="flex gap-6">
        {[['Instagram', '#'], ['Twitter', '#'], ['Privacy', '/privacy']].map(([link, href]) => (
          <a key={link} href={href} className="no-underline transition-colors hover:text-[#0047FF]" style={{ fontSize: 12.5, fontWeight: 500, color: '#767A85' }}>
            {link}
          </a>
        ))}
      </div>
    </footer>
  )
}
