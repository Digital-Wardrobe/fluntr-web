import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Instrument+Serif&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#F6F7F9" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
