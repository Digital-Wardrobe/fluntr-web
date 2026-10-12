/**
 * The Fluntr mark, drawn from the app icon: a four-point sparkle whose arms
 * taper to needles with concave sides, plus two small satellite dots at the
 * upper right and lower left. The wordmark is lowercase serif, as it is in the
 * app's own logo asset.
 */
export function Mark({ size = 22, color = 'currentColor', className = '' }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden style={{ display: 'block', overflow: 'visible' }}>
      <path d="M50 1 C50.6 36 58 44.4 99 50 C58 55.6 50.6 64 50 99 C49.4 64 42 55.6 1 50 C42 44.4 49.4 36 50 1 Z" fill={color} />
      <circle cx="86" cy="14" r="6" fill={color} opacity="0.45" />
      <circle cx="13" cy="87" r="4.2" fill={color} opacity="0.45" />
    </svg>
  )
}

export default function Logo({ size = 22, color = '#15171B', wordmark = true, className = '' }) {
  return (
    <span className={`inline-flex items-center ${className}`} style={{ gap: size * 0.5, color }}>
      <Mark size={size} color={color} />
      {wordmark ? (
        <span className="font-serif-display" style={{ fontSize: size * 1.25, lineHeight: 1, letterSpacing: '-0.01em', color }}>
          fluntr
        </span>
      ) : null}
    </span>
  )
}
