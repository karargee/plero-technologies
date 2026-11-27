import { guides } from '../../app/data/guides'

const pages = [
  '/',
  '/deriv',
  '/plero-pay',
  '/plero-pay/usdt',
  '/plero-pay/airtm',
  '/plero-pay/china',
  '/markets',
  '/tools',
  '/guides',
  '/gift-cards',
  '/about',
  '/support',
]

export default defineEventHandler((event) => {
  const origin = getRequestURL(event).origin
  const urls = [...pages, ...guides.map((g) => `/guides/${g.slug}`)]
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${origin}${u}</loc></url>`).join('\n') +
    '\n</urlset>\n'
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return body
})
