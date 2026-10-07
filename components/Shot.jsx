import Image from 'next/image'

/** A real screen from the running app, in a light device frame. */
export default function Shot({ src, alt, width = 300, priority = false, className = '' }) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden ${className}`}
      style={{
        width,
        borderRadius: 32,
        background: '#fff',
        border: '1px solid rgba(21,23,27,0.14)',
        boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.9), inset 0 0 0 3px rgba(21,23,27,0.06), 0 30px 70px rgba(21,23,27,0.18)',
      }}
    >
      <Image src={`/images/${src}.webp`} alt={alt} width={620} height={1344} priority={priority} sizes={`${width}px`} style={{ width: '100%', height: 'auto', display: 'block' }} />
    </div>
  )
}
