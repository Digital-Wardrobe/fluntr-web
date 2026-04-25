export default function Sparkle({ size = 32, color = '#C9A84C', animate = false, className = '' }) {
  return (
    <svg
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={`${animate ? 'animate-sparkle' : ''} ${className}`}
      style={{ filter: animate ? `drop-shadow(0 0 16px ${color}66)` : undefined }}
    >
      <path
        d="M40 5 L44.5 35.5 L75 40 L44.5 44.5 L40 75 L35.5 44.5 L5 40 L35.5 35.5 Z"
        fill={color}
      />
      <circle cx="70" cy="12" r="4" fill={color} opacity="0.4" />
      <circle cx="12" cy="70" r="3" fill={color} opacity="0.22" />
    </svg>
  )
}
