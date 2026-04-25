import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&display=swap" rel="stylesheet" />
        <meta name="description" content="Flauntr — Your Wardrobe. Your Runway. The social commerce app that digitises your closet and turns every outfit into a shoppable moment." />
        <meta property="og:title" content="Flauntr — Your Wardrobe. Your Runway." />
        <meta property="og:description" content="Digitise your closet, plan every occasion, and never open your wardrobe clueless again." />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#09090b" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
