const items = [
  'Fluntr', 'Social Fashion', 'Outfit Polls', 'Shoppable Looks',
  'Vibes & Mirrors', 'Borrow from Friends', 'Auto Closet', 'Occasion Planning',
  'Your Style. Your Stage.', 'Fluntr', 'Social Fashion', 'Outfit Polls',
  'Shoppable Looks', 'Vibes & Mirrors', 'Borrow from Friends', 'Auto Closet',
  'Occasion Planning', 'Your Style. Your Stage.',
]

export default function Marquee() {
  return (
    <div className="overflow-hidden py-8" style={{
      borderTop: '0.5px solid rgba(201,168,76,0.08)',
      borderBottom: '0.5px solid rgba(201,168,76,0.08)',
      background: '#111113'
    }}>
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} className="font-cormorant text-sm font-light whitespace-nowrap px-8"
            style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>
            {item} <span style={{ color: '#C9A84C', opacity: 0.6 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
