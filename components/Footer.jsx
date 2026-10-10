import Logo from './Logo'

export default function Footer() {
  return (
    <footer
      className="flex flex-wrap items-center justify-between gap-6 px-6 py-12 md:px-16"
      style={{ borderTop: '1px solid rgba(21,23,27,0.08)' }}
    >
      <Logo size={16} color="#3A3D45" />
      <p style={{ fontSize: 12, color: '#9AA0A6' }}>© 2026 Fluntr. All rights reserved.</p>
      <div className="flex gap-6">
        {[['Questions', '/questions'], ['Instagram', '#'], ['Twitter', '#'], ['Privacy', '/privacy']].map(([link, href]) => (
          <a key={link} href={href} className="no-underline transition-colors hover:text-[#15171B]" style={{ fontSize: 12.5, fontWeight: 500, color: '#767A85' }}>
            {link}
          </a>
        ))}
      </div>
    </footer>
  )
}
