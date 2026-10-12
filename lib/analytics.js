/**
 * Product analytics, loaded off the critical path.
 *
 * PostHog (free up to 1M events a month) records page views, clicks, scroll
 * depth, UTM sources and session replays, plus the events below. It loads
 * after the page is interactive, so it never slows the first paint, and talks
 * to /ingest on our own domain (rewritten to PostHog's US cloud in
 * vercel.json, at the edge), so ad blockers do not drop most of the data.
 *
 * Nothing loads unless NEXT_PUBLIC_POSTHOG_KEY is set. Events fired before
 * PostHog has loaded are queued and sent once it has.
 *
 * Never send personal data here: no names, no phone numbers.
 */

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY

let ph = null
const queue = []

/** Record an event. Safe to call anywhere, any time, with or without a key. */
export function track(event, props) {
  if (!KEY) return
  if (ph) ph.capture(event, props)
  else if (queue.length < 200) queue.push([event, props])
}

/** Start analytics once the page has loaded and the main thread is idle. */
export function startAnalytics() {
  if (!KEY || typeof window === 'undefined' || window.__fluntrAnalytics) return
  window.__fluntrAnalytics = true
  const boot = () => {
    import('posthog-js').then(({ default: posthog }) => {
      posthog.init(KEY, {
        api_host: '/ingest',
        ui_host: 'https://us.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false, // sent below, and on every client-side route change
        capture_pageleave: true, // gives time on page and scroll depth
        autocapture: true,
        respect_dnt: true, // the privacy policy promises this
        session_recording: { maskAllInputs: true },
        capture_performance: { web_vitals: true }, // real visitors' LCP, CLS and INP, by device
        loaded: p => {
          ph = p
          p.capture('$pageview')
          queue.splice(0).forEach(([e, pr]) => p.capture(e, pr))
        },
      })
    }).catch(() => {})
  }
  const idle = cb => (window.requestIdleCallback ? window.requestIdleCallback(cb, { timeout: 3000 }) : setTimeout(cb, 1200))
  if (document.readyState === 'complete') idle(boot)
  else window.addEventListener('load', () => idle(boot), { once: true })
}

/** A client-side navigation finished (pages router). */
export function trackPageview() {
  if (ph) ph.capture('$pageview')
}
