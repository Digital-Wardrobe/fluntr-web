/**
 * Soft colour behind a section: three tinted clouds, drifting.
 *
 * Each cloud is a radial gradient rather than a blurred circle: a 70px blur on
 * a 600px element is one of the most expensive things a phone can paint, and
 * the gradient looks the same. The drift is a CSS animation.
 */
export default function Blobs({ tones = ['#FFE3CC', '#DDEFF3', '#ECE9FF'], opacity = 0.9 }) {
  const spots = [
    { left: '8%', top: '10%', size: 640, d: 26 },
    { left: '62%', top: '-6%', size: 720, d: 32 },
    { left: '40%', top: '46%', size: 600, d: 28 },
  ]
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity }}>
      {spots.map((s, i) => {
        const t = tones[i % tones.length]
        return (
          <div
            key={i}
            className="blob"
            style={{ left: s.left, top: s.top, width: s.size, height: s.size, background: `radial-gradient(closest-side, ${t} 0%, ${t} 45%, ${t}00 100%)`, animation: `blob-${i} ${s.d}s ease-in-out infinite` }}
          />
        )
      })}
    </div>
  )
}
