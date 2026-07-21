import type { APIRoute } from 'astro'
import { siteConfig } from '@data/site'

export const GET: APIRoute = () => {
  return new Response(
    `User-agent: *\nAllow: /\nSitemap: ${siteConfig.url}/sitemap.xml`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  )
}
