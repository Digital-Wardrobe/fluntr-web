import { GALLERY, Photo } from './Demo'

/**
 * Two rows of real pieces drifting in opposite directions, the way the
 * reference runs its company logos. Pure CSS animation, paused on hover,
 * feathered at both ends.
 */
export default function Ticker() {
  const rowA = [...GALLERY, ...GALLERY, ...GALLERY]
  const rowB = [...GALLERY.slice(4), ...GALLERY.slice(0, 4)]
  const rowBx = [...rowB, ...rowB, ...rowB]
  return (
    <section aria-label="Pieces in Fluntr closets" className="py-16 md:py-20" style={{ background: '#fff' }}>
      <p className="mb-8 text-center text-[17px] md:text-[20px]" style={{ color: '#9AA0A6', letterSpacing: '-0.01em' }}>
        What ends up in a Fluntr closet:
      </p>
      <div className="ticker-mask flex flex-col gap-4">
        <div className="ticker-track">
          {rowA.map((g, i) => <Chip key={`${g.id}-${i}`} g={g} />)}
        </div>
        <div className="ticker-track ticker-track--rev">
          {rowBx.map((g, i) => <Chip key={`${g.id}-${i}`} g={g} />)}
        </div>
      </div>
    </section>
  )
}

function Chip({ g }) {
  return (
    <div className="flex shrink-0 items-center gap-3 pr-10">
      <div className="overflow-hidden" style={{ width: 56, height: 56, borderRadius: 16, boxShadow: '0 6px 16px rgba(18,19,23,0.08)', border: '1px solid rgba(18,19,23,0.06)' }}>
        <Photo src={g.src} sizes="56px" />
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#121317', lineHeight: 1.2 }}>{g.name}</div>
        <div className="mt-1 inline-flex items-center gap-1.5" style={{ fontSize: 11, color: '#6B7080', background: '#F3F4F6', borderRadius: 999, padding: '2px 8px' }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: g.hex, border: '1px solid rgba(18,19,23,0.1)', display: 'inline-block' }} />
          {g.category}
        </div>
      </div>
    </div>
  )
}
