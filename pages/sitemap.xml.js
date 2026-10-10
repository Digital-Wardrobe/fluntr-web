import { TOPICS } from '../content/questions'

/** Static sitemap: the pages worth indexing, and the question topics as anchors are left to the page itself. */
export async function getServerSideProps({ res }) {
  const base = 'https://fluntr.com'
  const urls = [
    { loc: `${base}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${base}/questions`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${base}/privacy`, priority: '0.3', changefreq: 'yearly' },
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`
  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.write(xml)
  res.end()
  return { props: {} }
}
export default function Sitemap() { return null }
