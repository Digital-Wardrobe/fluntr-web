import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { background: '#15171B', color: '#fff', borderRadius: 999, fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, padding: '10px 16px' },
        }}
      />
      <Component {...pageProps} />
    </>
  )
}
