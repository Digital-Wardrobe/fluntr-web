/**
 * Plans for the website. Mirrors dw-backend/src/config/plans.js (the numbers the
 * app enforces). If the API is reachable at build time, pages/pricing.jsx uses
 * GET /api/billing/plans instead, so the two can't drift.
 *
 * Final pricing (Oct 2026): Free / Pro / Studio. Kween and the Planner lead.
 * A limit is { value, window }: value null = unlimited, 0 = not included;
 * window = day | week | month | life (once, to try) | total. bonus = a one-time extra.
 */
const L = (value, window, bonus) => ({ value, window, ...(bonus ? { bonus } : {}) })

export const PLANS = [
  {
    plan: 'FREE', name: 'Free', tagline: 'Kween picks your outfit every morning.', trialDays: null,
    prices: null,
    limits: {
      kween: L(3, 'day'), reroll: L(5, 'day'), fitcheck: L(1, 'week'), scan: L(5, 'month', 10),
      pieces: L(20, 'month'), piecesDaily: L(3, 'day'), items: L(50, 'total'), collections: L(5, 'total'),
      beautify: L(1, 'month'), beautifyPro: L(0, 'month'), tryon: L(1, 'life'),
    },
    settings: { plannerDays: 2, historyDays: 30, badge: false },
  },
  {
    plan: 'PRO', name: 'Pro', tagline: 'Never stand in front of the wardrobe again.', recommended: true, trialDays: 7,
    prices: { MONTHLY: { inr: 129, usd: 4.99 }, QUARTERLY: { inr: 299, usd: 11.99 }, HALF_YEARLY: { inr: 549, usd: 19.99 }, ANNUAL: { inr: 999, usd: 34.99 } },
    limits: {
      kween: L(15, 'day'), reroll: L(null, 'day'), fitcheck: L(3, 'day'), scan: L(80, 'month'),
      pieces: L(80, 'month'), piecesDaily: L(null, 'day'), items: L(null, 'total'), collections: L(null, 'total'),
      beautify: L(30, 'month'), beautifyPro: L(5, 'month'), tryon: L(5, 'month'),
    },
    settings: { plannerDays: 30, historyDays: null, badge: true },
  },
  {
    plan: 'STUDIO', name: 'Studio', tagline: 'For creators and wedding season.', trialDays: null,
    prices: { MONTHLY: { inr: 299, usd: 9.99 }, QUARTERLY: { inr: 749, usd: 24.99 }, HALF_YEARLY: { inr: 1299, usd: 44.99 }, ANNUAL: { inr: 1999, usd: 79.99 } },
    limits: {
      kween: L(null, 'day'), reroll: L(null, 'day'), fitcheck: L(6, 'day'), scan: L(300, 'month'),
      pieces: L(null, 'month'), piecesDaily: L(null, 'day'), items: L(null, 'total'), collections: L(null, 'total'),
      beautify: L(150, 'month'), beautifyPro: L(25, 'month'), tryon: L(20, 'month'),
    },
    settings: { plannerDays: 60, historyDays: null, badge: true },
  },
]

export const PERIOD_DAYS = { MONTHLY: 30, QUARTERLY: 91, HALF_YEARLY: 182, ANNUAL: 365 }
export const PERIOD_MONTHS = { MONTHLY: 1, QUARTERLY: 3, HALF_YEARLY: 6, ANNUAL: 12 }

/** Turn the API's catalogue shape into the shape above (plans on sale only). */
export function fromApi(plans) {
  return plans.filter(p => p.plan !== 'PLUS').map(p => ({
    plan: p.plan, name: p.name, tagline: p.tagline, recommended: !!p.recommended, trialDays: p.trialDays || null,
    prices: p.prices ? Object.fromEntries(Object.entries(p.prices).map(([k, v]) => [k, { inr: v.inr, usd: v.usd }])) : null,
    limits: Object.fromEntries(Object.entries(p.limits).map(([k, v]) => [k, L(v.value, v.window, v.bonus)])),
    settings: { plannerDays: p.settings.plannerDays, historyDays: p.settings.historyDays, badge: !!p.settings.badge },
  }))
}
