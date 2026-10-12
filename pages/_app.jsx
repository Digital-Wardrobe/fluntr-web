import '../styles/globals.css'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Toaster } from 'react-hot-toast'
import { SoundProvider } from '../components/motion/Sound'
import { startAnalytics, trackPageview } from '../lib/analytics'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  useEffect(() => {
    startAnalytics()
    router.events.on('routeChangeComplete', trackPageview)
    return () => router.events.off('routeChangeComplete', trackPageview)
  }, [router.events])
  return (
    <SoundProvider>
      <Toaster
        position="bottom-center"
        toastOptions={{ style: { background: '#121317', color: '#fff', borderRadius: 999, fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, padding: '10px 16px' } }}
      />
      <Component {...pageProps} />
    </SoundProvider>
  )
}
