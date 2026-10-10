'use client'
import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/** A word that types itself, holds, deletes, and moves to the next. */
export default function Typed({ words, className = '', style }) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [n, setN] = useState(reduce ? words[0].length : 0)
  const [del, setDel] = useState(false)

  useEffect(() => {
    if (reduce) return
    const w = words[i]
    let t
    if (!del && n < w.length) t = setTimeout(() => setN(n + 1), 55 + Math.random() * 40)
    else if (!del && n === w.length) t = setTimeout(() => setDel(true), 1500)
    else if (del && n > 0) t = setTimeout(() => setN(n - 1), 30)
    else { setDel(false); setI((i + 1) % words.length) }
    return () => clearTimeout(t)
  }, [n, del, i, words, reduce])

  return (
    <span className={className} style={style}>
      {words[i].slice(0, n)}
      <span aria-hidden className="typed-cursor" />
    </span>
  )
}
