/**
 * Plans for the website. Mirrors dw-backend/src/config/plans.js (the numbers the
 * app enforces). If the API is reachable at build time, pages/pricing.jsx uses
 * GET /api/billing/plans instead, so the two can't drift.
 */
export const PLANS = [
  {
    plan: 'FREE', name: 'Free', tagline: 'Your closet, organised.',
    prices: null,
    limits: { items: 50, collections: 5, scan: 60, beautify: 5, beautifyPro: 0, tryon: 0, fitcheck: 0, kween: 3 },
    settings: { plannerDays: 2, historyDays: 30 },
  },
  {
    plan: 'PLUS', name: 'Plus', tagline: 'For the everyday rotation.',
    prices: { MONTHLY: { inr: 49, usd: 2.99 }, QUARTERLY: { inr: 129, usd: 7.99 }, ANNUAL: { inr: 549, usd: 19.99 } },
    limits: { items: 200, collections: 25, scan: 150, beautify: 30, beautifyPro: 0, tryon: 0, fitcheck: 1, kween: 10 },
    settings: { plannerDays: 7, historyDays: 180 },
  },
  {
    plan: 'PRO', name: 'Pro', tagline: 'Never stand in front of the wardrobe again.', recommended: true,
    prices: { MONTHLY: { inr: 99, usd: 5.99 }, QUARTERLY: { inr: 249, usd: 14.99 }, ANNUAL: { inr: 899, usd: 39.99 } },
    limits: { items: 1000, collections: null, scan: 400, beautify: 100, beautifyPro: 8, tryon: 5, fitcheck: 3, kween: 30 },
    settings: { plannerDays: 30, historyDays: null },
  },
  {
    plan: 'STUDIO', name: 'Studio', tagline: 'For creators and wedding season.',
    prices: { MONTHLY: { inr: 399, usd: 11.99 }, QUARTERLY: { inr: 999, usd: 29.99 }, ANNUAL: { inr: 3499, usd: 99.99 } },
    limits: { items: 5000, collections: null, scan: 1000, beautify: 300, beautifyPro: 25, tryon: 20, fitcheck: 5, kween: 100 },
    settings: { plannerDays: 60, historyDays: null },
  },
]

export const PERIOD_DAYS = { MONTHLY: 30, QUARTERLY: 91, ANNUAL: 365 }

/** Turn the API's catalogue shape into the shape above. */
export function fromApi(plans) {
  return plans.map(p => ({
    plan: p.plan, name: p.name, tagline: p.tagline, recommended: !!p.recommended,
    prices: p.prices ? Object.fromEntries(Object.entries(p.prices).map(([k, v]) => [k, { inr: v.inr, usd: v.usd }])) : null,
    limits: Object.fromEntries(Object.entries(p.limits).map(([k, v]) => [k, v.value])),
    settings: { plannerDays: p.settings.plannerDays, historyDays: p.settings.historyDays },
  }))
}
