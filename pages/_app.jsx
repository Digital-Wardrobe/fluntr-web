import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import Cursor from '../components/Cursor'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Cursor />
      <Toaster position="bottom-center" toastOptions={{
        style: { background: '#1a1a1a', color: '#fff', border: '0.5px solid rgba(201,168,76,0.3)', fontFamily: 'Jost, sans-serif', fontSize: '13px' }
      }} />
      <Component {...pageProps} />
    </>
  )
}
