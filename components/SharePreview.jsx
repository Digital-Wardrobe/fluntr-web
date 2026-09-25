import Head from 'next/head'

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fluntr.com'

// Opens the installed app via its URL scheme; falls back to the home page
export function OpenInApp({ path }) {
  return (
    <div className="flex flex-col items-center gap-3 mt-8">
      <a
        href={`dwapp://${path}`}
        className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:opacity-90"
      >
        Open in Fluntr
      </a>
      <a href="/" className="text-sm text-neutral-400 underline">Don’t have the app? Get Fluntr</a>
    </div>
  )
}

export function PreviewHead({ title, description, image, url }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Fluntr" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
    </Head>
  )
}

export function Unavailable({ what }) {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <PreviewHead title="Fluntr" description={`This ${what} isn’t available.`} />
      <h1 className="text-2xl font-bold">This {what} isn’t available</h1>
      <p className="text-neutral-400 mt-2">It may be private, or it was removed.</p>
      <OpenInApp path="" />
    </main>
  )
}
