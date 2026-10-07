/**
 * The Fluntr mark. A single four-point star, used as the logo glyph in the nav
 * and once in the waitlist success state.
 *
 * Kept as hand-drawn SVG because it is the brand mark, not decoration: it is one
 * simple geometric form, and it has to match the wordmark exactly.
 */
export default function Sparkle({ size = 24, color = '#C9A84C', animate = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={animate ? { animation: 'sparkle 8s ease-in-out infinite' } : undefined}
    >
      <path
        d="M12 0.5 C12 7 12 7 23.5 12 C12 17 12 17 12 23.5 C12 17 12 17 0.5 12 C12 7 12 7 12 0.5 Z"
        fill={color}
      />
    </svg>
  )
}
