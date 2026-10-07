import Image from 'next/image'

/**
 * A real screen from the running app, captured against a seeded database.
 * Not a div dressed up as a phone.
 */
export default function Shot({ src, alt, width = 300, priority = false, className = '' }) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden ${className}`}
      style={{
        width,
        borderRadius: 30,
        border: '1px solid rgba(201,168,76,0.22)',
        boxShadow: '0 34px 80px rgba(0,0,0,0.6)',
      }}
    >
      <Image
        src={`/images/${src}.webp`}
        alt={alt}
        width={620}
        height={1344}
        priority={priority}
        sizes={`${width}px`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </div>
  )
}
