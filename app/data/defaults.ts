// One place that lists every editable content document and its default value.
// Keys here = rows in the Supabase `content` table.
import { deriv, depositSteps, faqs, features, site, stats, withdrawSteps } from './site'
import { payServices } from './pay'
import { guideDefaults } from './guides'
import { aboutDefaults, announcementDefaults, homeDefaults, imagesDefaults, pagesDefaults } from './content'

export const settingsDefaults = {
  name: site.name,
  tagline: site.tagline,
  contact: { ...site.contact },
  socials: site.socials.map((s) => ({ ...s })),
  registration: { legalName: site.registration.legalName, rcNumber: site.registration.rcNumber, licences: [...site.registration.licences] },
  deriv: {
    signupUrl: deriv.signupUrl,
    agentName: deriv.agent.name,
    agentLoginId: deriv.agent.loginId,
    agentEmail: deriv.agent.email,
    speed: deriv.speed,
  },
}

/** Text for each Plero Pay service (rates are edited separately under Rates). */
export const payTextDefaults = Object.fromEntries(
  payServices.map((s) => [
    s.id,
    s.kind === 'trade'
      ? {
          name: s.name,
          short: s.short,
          tagline: s.tagline,
          description: s.description,
          speed: s.speed,
          networks: [...(s.networks ?? [])],
          buySteps: s.buySteps.map((x) => ({ ...x })),
          sellSteps: s.sellSteps.map((x) => ({ ...x })),
          needs: [...s.needs],
          safety: [...s.safety],
          faqs: s.faqs.map((x) => ({ ...x })),
        }
      : {
          name: s.name,
          short: s.short,
          tagline: s.tagline,
          description: s.description,
          speed: s.speed,
          methods: [...s.methods],
          steps: s.steps.map((x) => ({ ...x })),
          needs: [...s.needs],
          safety: [...s.safety],
          faqs: s.faqs.map((x) => ({ ...x })),
        },
  ]),
) as Record<string, Record<string, unknown>>

export const contentDefaults = {
  settings: settingsDefaults,
  announcement: announcementDefaults,
  home: homeDefaults,
  pages: pagesDefaults,
  about: aboutDefaults,
  features: { items: features.map((f) => ({ ...f })) },
  stats: { items: stats.map((s) => ({ ...s })) },
  steps: { deposit: depositSteps.map((s) => ({ ...s })), withdraw: withdrawSteps.map((s) => ({ ...s })) },
  faqs: { items: faqs.map((f) => ({ ...f })) },
  guides: { items: guideDefaults },
  pay: payTextDefaults,
  images: imagesDefaults,
}

export type ContentKey = keyof typeof contentDefaults
