import Head from 'next/head'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import KweenRoamer, { KweenPerch } from '../../components/motion/KweenRoamer'
import { TOPICS, ALL_QA } from '../../content/questions'

/**
 * One question, one URL. The same answer as on the index, with its own title,
 * description, share image and breadcrumb, and links to the rest of its topic.
 */

const INK = '#121317'
const MUTED = '#6B7080'

export async function getStaticPaths() {
  return { paths: ALL_QA.map(x => ({ params: { slug: x.slug } })), fallback: false }
}
export async function getStaticProps({ params }) {
  const i = ALL_QA.findIndex(x => x.slug === params.slug)
  const item = ALL_QA[i]
  const topic = TOPICS.find(t => t.id === item.topic)
  const siblings = topic.qa.filter(([q]) => q !== item.q).map(([q]) => ({ q, slug: ALL_QA.find(x => x.q === q).slug }))
  const next = ALL_QA[(i + 1) % ALL_QA.length]
  return { props: { item, topic: { id: topic.id, title: topic.title, blurb: topic.blurb }, siblings, next: { q: next.q, slug: next.slug } } }
}

export default function Question({ item, topic, siblings, next }) {
  const url = `https://fluntr.com/questions/${item.slug}`
  const description = item.a.length > 158 ? item.a.slice(0, 155).replace(/\s+\S*$/, '') + '…' : item.a
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } }] },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Fluntr', item: 'https://fluntr.com/' },
        { '@type': 'ListItem', position: 2, name: 'Questions', item: 'https://fluntr.com/questions' },
        { '@type': 'ListItem', position: 3, name: topic.title, item: `https://fluntr.com/questions#${topic.id}` },
        { '@type': 'ListItem', position: 4, name: item.q, item: url },
      ] },
    ],
  }
  return (
    <>
      <Head>
        <title>{`${item.q} - Fluntr`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={item.q} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`https://fluntr.com/og/${topic.id}.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </Head>
      <Nav />
      <main className="px-6 pb-28 pt-32 md:px-12 md:pt-40 lg:px-16">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-[13px]" style={{ color: MUTED }}>
            <Link href="/" className="no-underline hover:underline" style={{ color: MUTED }}>Fluntr</Link><span>/</span>
            <Link href="/questions" className="no-underline hover:underline" style={{ color: MUTED }}>Questions</Link><span>/</span>
            <Link href={`/questions#${topic.id}`} className="no-underline hover:underline" style={{ color: MUTED }}>{topic.title}</Link>
          </nav>
          <h1 className="h-display" style={{ fontSize: 'clamp(32px,4.8vw,60px)', color: INK }}>{item.q}</h1>
          <p className="mt-7 text-[19px] leading-relaxed" style={{ color: '#3A3D45' }}>{item.a}</p>

          <div className="mt-10 flex flex-wrap items-end gap-6">
            <div className="glass flex-1 px-6 py-6" style={{ borderRadius: 24, minWidth: 260 }}>
              <p className="text-eyebrow mb-2">Fluntr</p>
              <p className="text-[15px] leading-relaxed" style={{ color: MUTED }}>Photograph the clothes you own; Kween, the in-app stylist, answers this from your own closet. Pre-launch, waitlist open.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/#waitlist" className="btn-primary" style={{ padding: '12px 20px', fontSize: 14 }}>Join the waitlist →</Link>
                <Link href="/#how" className="btn-glass glass" style={{ padding: '12px 20px', fontSize: 14 }}>Try the demo</Link>
              </div>
            </div>
            <KweenPerch name={`q-${item.slug}`} line={item.q.length < 40 ? `Ah, "${item.q}" That one again.` : 'Good question. Read on.'} mood="smug" className="hidden md:block" width="clamp(84px, 7vw, 100px)" />
          </div>

          <section className="mt-14">
            <h2 className="h-display" style={{ fontSize: 'clamp(22px,2.6vw,30px)', color: INK }}>More on {topic.title.toLowerCase()}</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {siblings.map(s => (
                <li key={s.slug}><Link href={`/questions/${s.slug}`} className="text-[16px] font-medium no-underline hover:underline" style={{ color: INK }}>{s.q}</Link></li>
              ))}
            </ul>
            <p className="mt-8 text-[15px]" style={{ color: MUTED }}>
              Next: <Link href={`/questions/${next.slug}`} className="font-medium no-underline hover:underline" style={{ color: INK }}>{next.q}</Link>
            </p>
          </section>
        </article>
      </main>
      <Footer />
      <KweenRoamer />
    </>
  )
}
