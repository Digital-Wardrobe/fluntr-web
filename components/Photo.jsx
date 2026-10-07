import Image from 'next/image'

/** Editorial photography. Fills its parent; the parent sets the crop. */
export default function Photo({ src, alt, w, h, priority = false, className = '', style }) {
  return (
    <Image
      src={`/images/${src}.webp`}
      alt={alt}
      width={w}
      height={h}
      priority={priority}
      sizes="(max-width: 768px) 100vw, 50vw"
      className={className}
      style={{ display: 'block', ...style }}
    />
  )
}
