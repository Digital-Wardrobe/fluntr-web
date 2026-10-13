import Logo from './Logo'

/**
 * Every page links to the guides from here, so search engines and agents
 * find them from anywhere on the site. Kept as a short literal list (not
 * imported from content/questions) so the question data is not shipped to the
 * browser with every page; the paths match the topics' `path` there.
 */
const GUIDES = [
  ['What to wear today', '/questions/topic/what-to-wear'],
  ['Indian wedding guest outfits', '/questions/topic/indian-wedding-guest-outfits'],
  ['Festival outfit ideas', '/questions/topic/festival-outfit-ideas'],
  ['Interviews, temples, pujas', '/questions/topic/occasion-outfits'],
  ['Men’s outfit ideas', '/questions/topic/mens-outfit-ideas'],
  ['Monsoon, summer, winter, travel', '/questions/topic/outfits-for-weather-and-travel'],
  ['Trends and personal style', '/questions/topic/fashion-trends-and-personal-style'],
  ['Which colours suit me', '/questions/topic/which-colours-suit-me'],
  ['What to buy', '/questions/topic/what-to-buy'],
  ['When to buy, and will it arrive', '/questions/topic/when-to-buy-and-shopping-assistant'],
  ['AI stylist app', '/questions/topic/ai-stylist'],
]

export default function Footer() {
  return (
    <footer className="px-6 py-12 md:px-16" style={{ borderTop: '1px solid rgba(21,23,27,0.08)' }}>
      <nav aria-label="Guides" className="mb-10">
        <p className="mb-3" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9AA0A6' }}>Guides</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {GUIDES.map(([label, href]) => (
            <li key={href}><a href={href} className="no-underline transition-colors hover:text-[#15171B]" style={{ fontSize: 13.5, fontWeight: 500, color: '#5A5F6B' }}>{label}</a></li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <Logo size={16} color="#3A3D45" />
        <p style={{ fontSize: 12, color: '#9AA0A6' }}>© 2026 Fluntr. All rights reserved.</p>
        <div className="flex gap-6">
          {[['Pricing', '/pricing'], ['All questions', '/questions'], ['Privacy', '/privacy']].map(([link, href]) => (
            <a key={link} href={href} className="no-underline transition-colors hover:text-[#15171B]" style={{ fontSize: 12.5, fontWeight: 500, color: '#767A85' }}>
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
