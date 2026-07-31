import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { canonicalUrl } from '@data/site'
import { getTotalPages, sortPostsByDate } from '../utils/blog'

const POSTS_PER_PAGE = 10

interface SitemapEntry {
  path: string
  changefreq: string
  priority: string
}

export const GET: APIRoute = async () => {
  const projects = await getCollection('projects')
  const blogPosts = await getCollection('blog', ({ data }) => !data.draft)
  const sortedPosts = sortPostsByDate(blogPosts)

  const totalPages = getTotalPages(sortedPosts.length, POSTS_PER_PAGE)
  const paginationPages = Array.from(
    { length: Math.max(0, totalPages - 1) },
    (_, i) => i + 2
  )

  const entries: SitemapEntry[] = [
    { path: '/', changefreq: 'monthly', priority: '1.0' },
    { path: '/sobre-mi', changefreq: 'monthly', priority: '0.7' },
    ...projects.map((p) => ({
      path: `/projects/${p.id}`,
      changefreq: 'monthly',
      priority: '0.8',
    })),
    { path: '/blog', changefreq: 'weekly', priority: '0.8' },
    ...paginationPages.map((page) => ({
      path: `/blog/page/${page}`,
      changefreq: 'weekly',
      priority: '0.5',
    })),
    ...sortedPosts.map((p) => ({
      path: `/blog/${p.id}`,
      changefreq: 'weekly',
      priority: '0.7',
    })),
  ]

  const seen = new Set<string>()
  const urls: string[] = []

  for (const entry of entries) {
    const loc = canonicalUrl(entry.path)
    if (seen.has(loc)) continue
    seen.add(loc)
    urls.push(
      `  <url><loc>${loc}</loc><changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>`
    )
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
