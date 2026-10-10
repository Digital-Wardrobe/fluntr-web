import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { SoundProvider } from '../components/motion/Sound'

export default function App({ Component, pageProps }) {
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
