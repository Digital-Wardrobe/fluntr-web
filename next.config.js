/** @type {import('next').NextConfig} */
const WEEK = 'public, max-age=604800, stale-while-revalidate=86400'

const nextConfig = {
  reactStrictMode: true,
  // PostHog posts to paths ending in a slash (/ingest/e/); do not redirect them
  skipTrailingSlashRedirect: true,

  images: {
    // optimised images are cached for a month instead of re-made on every miss
    minimumCacheTTL: 2678400,
  },

  async headers() {
    return [
      // fonts never change under the same name; everything else in public/ is
      // cached for a week (Next serves public files with max-age=0 otherwise)
      { source: '/fonts/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: WEEK }] },
      { source: '/mascot/:path*', headers: [{ key: 'Cache-Control', value: WEEK }] },
      { source: '/sounds/:path*', headers: [{ key: 'Cache-Control', value: WEEK }] },
      { source: '/icons/:path*', headers: [{ key: 'Cache-Control', value: WEEK }] },
      { source: '/og/:path*', headers: [{ key: 'Cache-Control', value: WEEK }] },
      {
        // Apple requires this file to be served as application/json with no
        // redirects. Next serves files from public/ verbatim, but the
        // extension-less AASA file needs the content type set explicitly.
        source: '/.well-known/apple-app-site-association',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
      {
        source: '/.well-known/assetlinks.json',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
