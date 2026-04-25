'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  let rx = 0, ry = 0

  useEffect(() => {
    const onMove = (e) => {
      if (dot.current) {
        dot.current.style.left = e.clientX + 'px'
        dot.current.style.top = e.clientY + 'px'
      }
    }

    let mx = 0, my = 0
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY })
    document.addEventListener('mousemove', onMove)

    const animRing = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      if (ring.current) {
        ring.current.style.left = rx + 'px'
        ring.current.style.top = ry + 'px'
      }
      requestAnimationFrame(animRing)
    }
    animRing()

    const interactives = document.querySelectorAll('a, button, input, select, textarea')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (ring.current) { ring.current.style.width = '52px'; ring.current.style.height = '52px'; ring.current.style.opacity = '0.8' }
      })
      el.addEventListener('mouseleave', () => {
        if (ring.current) { ring.current.style.width = '32px'; ring.current.style.height = '32px'; ring.current.style.opacity = '0.45' }
      })
    })

    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  )
}
