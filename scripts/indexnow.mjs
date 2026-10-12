/**
 * Tell Bing (and through it ChatGPT search and Copilot), Yandex, Seznam and
 * Naver about every page on the site, straight away, via IndexNow.
 *
 * Run after a deploy that adds or changes pages:
 *   node scripts/indexnow.mjs
 *
 * It reads the live sitemap, so it only submits pages that are really live.
 * The key file public/7707012521a09c7fd56d6ec0ea731c02.txt must be deployed first; that is how the
 * search engines know the request comes from the site's owner.
 */
const HOST = 'www.fluntr.com'
const KEY = '7707012521a09c7fd56d6ec0ea731c02'

const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text()
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
if (!urlList.length) { console.error('No URLs found in the live sitemap.'); process.exit(1) }

const keyCheck = await fetch(`https://${HOST}/${KEY}.txt`)
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  console.error('The key file is not live yet. Deploy first, then run this again.')
  process.exit(1)
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
})
console.log(`Submitted ${urlList.length} URLs: HTTP ${res.status} ${res.status === 200 || res.status === 202 ? '(accepted)' : await res.text()}`)
