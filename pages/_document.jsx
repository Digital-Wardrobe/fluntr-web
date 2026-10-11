import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* the three weights above the fold, fetched alongside the CSS instead of after it */}
        <link rel="preload" href="/fonts/inter-latin-800.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter-latin-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter-latin-600.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/instrument-serif-latin-400-italic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <meta name="theme-color" content="#121317" />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta property="og:site_name" content="Fluntr" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:site" content="@fluntr" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
