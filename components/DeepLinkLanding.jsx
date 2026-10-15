import Head from 'next/head'
import { useEffect, useState } from 'react'
import { APP_STORE_URL, playStoreUrl, sharedRef } from '../lib/storeLinks'

export default function DeepLinkLanding({ kind, id, title, subtitle }) {
  const [platform, setPlatform] = useState('other')
  const [ref, setRef] = useState(null)

  useEffect(() => {
    const ua = navigator.userAgent || ''
    const isIOS = /iPad|iPhone|iPod/.test(ua)
    const isAndroid = /Android/.test(ua)
    setPlatform(isIOS ? 'ios' : isAndroid ? 'android' : 'other')
    setRef(sharedRef())

    if (!isIOS && !isAndroid) return

    // Try the app once. If it opens, this tab is backgrounded and the timer
    // below never matters; if it doesn't, the user sees the store prompt.
    const appUrl = `dwapp://${kind}/${id}`
    const timer = setTimeout(() => {
      window.location.href = appUrl
    }, 50)

    return () => clearTimeout(timer)
  }, [kind, id])

  const storeUrl = platform === 'android' ? playStoreUrl(kind, ref) : APP_STORE_URL

  return (
    <>
      <Head>
        <title>{title} · Fluntr</title>
        <meta name="description" content={subtitle} />
        <meta property="og:title" content={`${title} · Fluntr`} />
        <meta property="og:description" content={subtitle} />
        <meta property="og:type" content="website" />
        {/* Lets Safari offer the native "Open" banner on iOS. */}
        <meta name="apple-itunes-app" content="app-id=000000000" />
      </Head>

      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0A0A',
          color: '#fff',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <h1 style={{ fontSize: 'clamp(28px, 6vw, 44px)', margin: 0, letterSpacing: '-0.02em' }}>fluntr</h1>

        <p style={{ marginTop: 28, fontSize: 18, fontWeight: 600 }}>{title}</p>
        <p style={{ marginTop: 8, color: '#9A9A9A', fontSize: 15, maxWidth: 420 }}>{subtitle}</p>

        <a
          href={`dwapp://${kind}/${id}`}
          style={{
            marginTop: 32,
            background: '#fff',
            color: '#000',
            padding: '14px 32px',
            borderRadius: 999,
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Open in Fluntr
        </a>

        <a
          href={storeUrl}
          style={{ marginTop: 16, color: '#9A9A9A', fontSize: 14, textDecoration: 'underline' }}
        >
          Don&apos;t have the app? Get Fluntr
        </a>
      </main>
    </>
  )
}
