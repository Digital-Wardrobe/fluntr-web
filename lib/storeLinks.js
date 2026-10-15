export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.mtpl.fluntr'
export const APP_STORE_URL = 'https://apps.apple.com/app/fluntr/id000000000'

/**
 * Play Store link that hands `referrer` to the app on its first launch (Install Referrer API).
 * Share links carry ?ref=<username of whoever shared>; passing it on is how the app knows who
 * invited a new account (the admin dashboards count invites and the k-factor). Nothing else is passed.
 */
export function playStoreUrl(campaign, ref) {
  const params = new URLSearchParams({ utm_source: ref ? 'share' : 'web', utm_medium: 'link', utm_campaign: campaign })
  if (ref) params.set('ref', ref)
  return `${PLAY_STORE_URL}&referrer=${encodeURIComponent(params.toString())}`
}

/** The ?ref on this page, if it looks like a username. Browser only. */
export function sharedRef() {
  const ref = new URLSearchParams(window.location.search).get('ref')
  return ref && /^[A-Za-z0-9._]{1,30}$/.test(ref) ? ref : null
}
