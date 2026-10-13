import { TOPICS, ALL_QA, UPDATED, topicUrl } from '../content/questions'

/** Every page worth indexing, with the date its content last changed. */
export async function getServerSideProps({ res }) {
  const base = 'https://www.fluntr.com'
  const urls = [
    { loc: `${base}/`, lastmod: UPDATED, priority: '1.0', changefreq: 'weekly' },
    { loc: `${base}/questions`, lastmod: UPDATED, priority: '0.9', changefreq: 'weekly' },
    { loc: `${base}/pricing`, lastmod: '2026-10-14', priority: '0.9', changefreq: 'monthly' },
    ...TOPICS.map(t => ({ loc: base + topicUrl(t), lastmod: UPDATED, priority: '0.8', changefreq: 'monthly' })),
    ...ALL_QA.map(q => ({ loc: `${base}/questions/${q.slug}`, lastmod: UPDATED, priority: '0.7', changefreq: 'monthly' })),
    { loc: `${base}/privacy`, lastmod: '2026-10-10', priority: '0.3', changefreq: 'yearly' },
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`
  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.write(xml)
  res.end()
  return { props: {} }
}
export default function Sitemap() { return null }
