import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { siteConfig } from '../data/site'
import { sortPostsByDate } from '../utils/blog'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export const GET: APIRoute = async () => {
  const allPosts = await getCollection('blog', ({ data }) => !data.draft)
  const posts = sortPostsByDate(allPosts)

  const items = posts.map(post => {
    const link = `${siteConfig.url}/blog/${post.id}`
    return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(post.data.description)}</description>
      <pubDate>${post.data.publishedAt.toUTCString()}</pubDate>
    </item>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.siteName)}</title>
    <link>${siteConfig.url}/blog</link>
    <description>Notas sobre IA, desarrollo web y herramientas para ingenieros de software.</description>
    <language>es-mx</language>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
