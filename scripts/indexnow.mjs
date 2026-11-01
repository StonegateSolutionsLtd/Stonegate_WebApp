// Tells Bing (and Copilot), Yandex, Naver, Seznam and other IndexNow engines which pages were added, changed or deleted.
// IndexNow is for those engines only - Google still finds changes through the sitemap and Search Console.
//
//   npm run indexnow -- --all                      every page in the live sitemap (first moving-only deploy only)
//   npm run indexnow -- /moving /pricing/moving    only the pages a deploy added, changed or deleted
//   npm run indexnow -- --retired                  the deleted junk removal URLs (scripts/retired-urls.txt), once
//
// Deleted pages are not in the sitemap, so they must be passed by path (or listed in retired-urls.txt).
// The key is public on purpose: it is served at /<key>.txt to prove the site owns it.
// A 200/202 response means the URLs were received, not that they will be indexed.

import { readFile } from 'node:fs/promises'

const SITE = 'https://www.stonegatemoving.com'
const KEY = '189a2109f40040c62686cae731d04c99'
const BATCH = 10000 // IndexNow's limit per request

async function sitemapUrls() {
  const r = await fetch(`${SITE}/sitemap.xml`)
  if (!r.ok) throw new Error(`Sitemap request failed: ${r.status} ${r.statusText}`)
  return [...(await r.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim())
}

async function retiredUrls() {
  const text = await readFile(new URL('./retired-urls.txt', import.meta.url), 'utf8')
  return text.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(toUrl)
}

function toUrl(pathOrUrl) {
  const url = new URL(pathOrUrl, SITE)
  if (url.origin !== new URL(SITE).origin) throw new Error(`Not a ${SITE} URL: ${pathOrUrl}`)
  return url.href
}

const args = process.argv.slice(2)
let urlList
if (args[0] === '--all') urlList = await sitemapUrls()
else if (args[0] === '--retired') urlList = await retiredUrls()
else if (args.length > 0 && !args.some(a => a.startsWith('--'))) urlList = args.map(toUrl)
else {
  console.error('Usage: npm run indexnow -- --all | --retired | <path> [<path> ...]')
  process.exit(1)
}

urlList = [...new Set(urlList)]
if (urlList.length === 0) {
  console.error('No URLs to submit')
  process.exit(1)
}

let failed = false
for (let i = 0; i < urlList.length; i += BATCH) {
  const batch = urlList.slice(i, i + BATCH)
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: batch }),
  })
  // 200 = received, 202 = received and the key is still being checked
  if (res.ok) {
    console.log(`IndexNow: ${res.status} ${res.statusText} - ${batch.length} URLs received`)
  } else {
    failed = true
    console.error(`IndexNow: ${res.status} ${res.statusText} - ${batch.length} URLs rejected`)
    console.error((await res.text()) || '(no response body)')
  }
}
if (failed) process.exit(1)
