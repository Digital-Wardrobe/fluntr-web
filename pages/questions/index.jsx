import Head from 'next/head'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import KweenRoamer, { KweenPerch } from '../../components/motion/KweenRoamer'
import { TOPICS, ALL_QA, slugOf } from '../../content/questions'

/**
 * Every question people ask about getting dressed, answered plainly, with how
 * Fluntr helps where it does. Light on styling on purpose: this page exists to
 * be read, indexed and quoted.
 */

const INK = '#121317'
const MUTED = '#6B7080'

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: ALL_QA.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
}

export default function Questions() {
  return (
    <>
      <Head>
        <title>What to wear, how to shop, how to organise your closet - Fluntr answers</title>
        <meta name="description" content="Plain answers to the questions people actually ask: what to wear today, Diwali and wedding outfits, shopping without buying twice, mirror selfies and fit checks, digitising your wardrobe, and what Fluntr and Kween do." />
        <link rel="canonical" href="https://fluntr.com/questions" />
        <meta property="og:title" content="What to wear, how to shop, how to organise your closet - Fluntr answers" />
        <meta property="og:description" content="Outfit, shopping, festival, Instagram and closet questions, answered. Plus what Fluntr is and how Kween, its stylist, works." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://fluntr.com/questions" />
        <meta property="og:image" content="https://fluntr.com/og/questions.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      </Head>
      <Nav />
      <main className="px-6 pb-28 pt-32 md:px-12 md:pt-40 lg:px-16">
        <header className="mx-auto max-w-3xl">
          <p className="text-eyebrow mb-5">Questions</p>
          <h1 className="h-display" style={{ fontSize: 'clamp(36px,5.6vw,72px)', color: INK }}>
            Everything people ask about getting dressed.
          </h1>
          <p className="mt-6 max-w-2xl text-[18px] leading-relaxed" style={{ color: MUTED }}>
            What to wear, what to buy, how to photograph it and how to find it again. Short answers, from people building a closet app, with how Fluntr helps where it actually does. Fluntr is pre-launch; nothing here is a promise.
          </p>
          <nav aria-label="Topics" className="mt-8 flex flex-wrap gap-2">
            {TOPICS.map(t => (
              <a key={t.id} href={`#${t.id}`} className="no-underline" style={{ background: '#F3F4F6', color: INK, borderRadius: 999, padding: '8px 14px', fontSize: 13.5, fontWeight: 600 }}>{t.title}</a>
            ))}
          </nav>
          <KweenPerch name="questions" line="Ask me anything. Well, anything about clothes." mood="happy" className="mt-8 hidden md:block" width="clamp(84px, 7vw, 100px)" />
        </header>

        <div className="mx-auto mt-16 flex max-w-3xl flex-col gap-16">
          {TOPICS.map(t => (
            <section key={t.id} id={t.id} className="scroll-mt-28">
              <h2 className="h-display" style={{ fontSize: 'clamp(26px,3.4vw,40px)', color: INK }}>{t.title}</h2>
              <p className="mt-2 text-[16px]" style={{ color: MUTED }}>{t.blurb}</p>
              <dl className="mt-8 flex flex-col gap-8">
                {t.qa.map(([q, a]) => (
                  <div key={q} id={slugOf(q)} className="scroll-mt-28">
                    <dt className="text-[19px] font-semibold tracking-tight" style={{ color: INK }}>
                      <Link href={`/questions/${slugOf(q)}`} className="no-underline hover:underline" style={{ color: INK }}>{q}</Link>
                    </dt>
                    <dd className="mt-2 text-[16px] leading-relaxed" style={{ color: '#3A3D45' }}>{a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <aside className="mx-auto mt-20 max-w-3xl glass px-7 py-9 md:px-10" style={{ borderRadius: 28 }}>
          <h2 className="h-display" style={{ fontSize: 'clamp(26px,3vw,36px)', color: INK }}>Still wondering what to wear?</h2>
          <p className="mt-3 text-[16px]" style={{ color: MUTED }}>Join the waitlist and Kween will answer from your own closet when Fluntr opens.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/#waitlist" className="btn-primary">Join the waitlist →</Link>
            <Link href="/#how" className="btn-glass glass">Try the demo</Link>
          </div>
        </aside>
      </main>
      <Footer />
      <KweenRoamer />
    </>
  )
}

