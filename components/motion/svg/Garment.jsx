/**
 * Flat garment silhouettes.
 *
 * These exist so the journey animation can move an actual piece of clothing
 * around the screen instead of a grey rectangle. Hand-drawn paths rather than
 * an icon font: they have to sit on a 100x100 box so every one of them lands in
 * a closet cell at the same optical size.
 */

const SHAPES = {
  tee: 'M30,18 L42,11 Q50,20 58,11 L70,18 L79,35 L68,41 L68,87 L32,87 L32,41 L21,35 Z',
  dress: 'M34,16 L44,10 Q50,19 56,10 L66,16 L62,39 L75,89 L25,89 L38,39 Z',
  trousers: 'M32,13 L68,13 L73,89 L55,89 L50,49 L45,89 L27,89 Z',
  jacket: 'M28,18 L42,10 L50,31 L58,10 L72,18 L81,38 L70,43 L70,87 L30,87 L30,43 L19,38 Z',
  skirt: 'M33,19 L67,19 L78,85 L22,85 Z',
  shoe: 'M23,61 L40,61 L45,70 L72,76 Q81,78 81,85 L23,85 Z',
  bag: 'M30,38 L70,38 L74,86 L26,86 Z M38,38 Q38,22 50,22 Q62,22 62,38',
  shirt: 'M31,17 L43,11 L50,22 L57,11 L69,17 L78,36 L69,40 L69,87 L31,87 L31,40 L22,36 Z',
}

export const GARMENTS = Object.keys(SHAPES)

/**
 * `tone` is the fill. Outline is always a hairline of the same hue lifted
 * towards white, which is what keeps these readable at closet-cell size on a
 * near-black page.
 */
export default function Garment({ kind = 'tee', tone = '#C9A84C', size = 64, className = '', style }) {
  const d = SHAPES[kind] || SHAPES.tee
  const isBag = kind === 'bag'
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={{ display: 'block', overflow: 'visible', ...style }}
      aria-hidden
    >
      <path
        d={d}
        fill={tone}
        fillOpacity={0.9}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={1.1}
        strokeLinejoin="round"
        {...(isBag ? { fillRule: 'evenodd' } : null)}
      />
      {kind === 'shirt' ? (
        <path d="M50,22 L50,80" stroke="rgba(255,255,255,0.22)" strokeWidth={1} fill="none" />
      ) : null}
      {kind === 'trousers' ? (
        <path d="M50,49 L50,20" stroke="rgba(255,255,255,0.18)" strokeWidth={1} fill="none" />
      ) : null}
    </svg>
  )
}
