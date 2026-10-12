import Head from 'next/head'
import Link from 'next/link'
import Nav from '../../../components/Nav'
import Footer from '../../../components/Footer'
import KweenRoamer, { KweenPerch } from '../../../components/motion/KweenRoamer'
import { TOPICS, ALL_QA } from '../../../content/questions'
import { UPDATED, UPDATED_LABEL, topicUrl } from '../../../content/meta'

/**
 * One topic, one page: every question in it with its full answer. These are
 * the pages built to rank for the broad searches ("Indian wedding guest
 * outfits", "festival outfit ideas", "men's outfit ideas") and to be quoted
 * whole by answer engines, while each question keeps its own page for the
 * exact phrasing.
 */

const INK = '#121317'
const MUTED = '#6B7080'
const BASE = 'https://www.fluntr.com'

export async function getStaticPaths() {
  return { paths: TOPICS.map(t => ({ params: { path: t.path } })), fallback: false }
}
export async function getStaticProps({ params }) {
  const i = TOPICS.findIndex(t => t.path === params.path)
  const t = TOPICS[i]
  const items = ALL_QA.filter(x => x.topic === t.id)
  const others = TOPICS.filter(x => x.id !== t.id).map(x => ({ title: x.title, url: topicUrl(x) }))
  return { props: { topic: { id: t.id, title: t.title, heading: t.heading, blurb: t.blurb, url: topicUrl(t) }, items, others } }
}

export default function Topic({ topic, items, others }) {
  const url = BASE + topic.url
  const description = `${topic.blurb} ${items.length} questions answered: ${items.slice(0, 3).map(x => x.q.replace(/\?$/, '')).join('; ')}, and more.`.slice(0, 300)
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage', '@id': `${url}#page`, url, name: topic.heading, description: topic.blurb,
        inLanguage: 'en-IN', dateModified: UPDATED, isPartOf: { '@id': `${BASE}/#site` }, publisher: { '@id': `${BASE}/#org` },
        mainEntity: { '@type': 'ItemList', itemListElement: items.map((x, n) => ({ '@type': 'ListItem', position: n + 1, url: `${BASE}/questions/${x.slug}`, name: x.q })) },
      },
      {
        '@type': 'FAQPage',
        mainEntity: items.map(x => ({ '@type': 'Question', name: x.q, ...(x.also.length ? { alternateName: x.also } : null), acceptedAnswer: { '@type': 'Answer', text: x.a } })),
      },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Fluntr', item: `${BASE}/` },
        { '@type': 'ListItem', position: 2, name: 'Questions', item: `${BASE}/questions` },
        { '@type': 'ListItem', position: 3, name: topic.title, item: url },
      ] },
    ],
  }
  return (
    <>
      <Head>
        <title>{`${topic.heading} - Fluntr`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={topic.heading} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${BASE}/og/${topic.id}.jpg`} />
        <meta property="article:modified_time" content={UPDATED} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </Head>
      <Nav />
      <main className="px-6 pb-28 pt-32 md:px-12 md:pt-40 lg:px-16">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-[13px]" style={{ color: MUTED }}>
            <Link href="/" className="no-underline hover:underline" style={{ color: MUTED }}>Fluntr</Link><span>/</span>
            <Link href="/questions" className="no-underline hover:underline" style={{ color: MUTED }}>Questions</Link><span>/</span>
            <span>{topic.title}</span>
          </nav>
          <h1 className="h-display" style={{ fontSize: 'clamp(32px,4.8vw,58px)', color: INK }}>{topic.heading}</h1>
          <p className="mt-5 text-[18px] leading-relaxed" style={{ color: MUTED }}>{topic.blurb}</p>
          <p className="mt-3 text-[13px]" style={{ color: MUTED }}>Updated <time dateTime={UPDATED}>{UPDATED_LABEL}</time> · {items.length} questions</p>

          <nav aria-label="Questions in this topic" className="mt-8 rounded-3xl p-6" style={{ background: '#F5F6F8' }}>
            <p className="text-eyebrow mb-3">In this guide</p>
            <ol className="flex list-decimal flex-col gap-2 pl-5 text-[15px]" style={{ color: INK }}>
              {items.map(x => <li key={x.slug}><a href={`#${x.slug}`} className="no-underline hover:underline" style={{ color: INK }}>{x.q}</a></li>)}
            </ol>
          </nav>

          <div className="mt-14 flex flex-col gap-12">
            {items.map(x => (
              <section key={x.slug} id={x.slug} className="scroll-mt-28">
                <h2 className="h-display" style={{ fontSize: 'clamp(22px,2.6vw,30px)', color: INK }}>
                  <Link href={`/questions/${x.slug}`} className="no-underline hover:underline" style={{ color: INK }}>{x.q}</Link>
                </h2>
                <p className="mt-3 text-[17px] leading-relaxed" style={{ color: '#3A3D45' }}>{x.a}</p>
                {x.also.length ? <p className="mt-3 text-[13.5px]" style={{ color: MUTED }}>Also asked as: {x.also.join(' · ')}</p> : null}
              </section>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-end gap-6">
            <div className="glass flex-1 px-6 py-6" style={{ borderRadius: 24, minWidth: 260 }}>
              <p className="text-eyebrow mb-2">Fluntr</p>
              <p className="text-[15px] leading-relaxed" style={{ color: MUTED }}>One app for everything you wear, buy or plan, with Kween, the most personal AI stylist: she answers these from the clothes you own, in your colours, and shops with you when you ask. Pre-launch, waitlist open.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/#waitlist" className="btn-primary" style={{ padding: '12px 20px', fontSize: 14 }}>Join the waitlist →</Link>
                <Link href="/#how" className="btn-glass glass" style={{ padding: '12px 20px', fontSize: 14 }}>Try the demo</Link>
              </div>
            </div>
            <KweenPerch name={`topic-${topic.id}`} line="Every one of these, from your own closet. That’s my job." mood="happy" className="hidden md:block" width="clamp(84px, 7vw, 100px)" />
          </div>

          <section className="mt-16">
            <h2 className="h-display" style={{ fontSize: 'clamp(22px,2.6vw,30px)', color: INK }}>More guides</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {others.map(o => (
                <li key={o.url}><Link href={o.url} className="no-underline" style={{ display: 'inline-block', background: '#F3F4F6', color: INK, borderRadius: 999, padding: '8px 14px', fontSize: 13.5, fontWeight: 600 }}>{o.title}</Link></li>
              ))}
            </ul>
          </section>
        </article>
      </main>
      <Footer />
      <KweenRoamer />
    </>
  )
}
