import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { canonicalUrl } from '@data/site'
import { getAllCategories, getTotalPages, sortPostsByDate } from '../utils/blog'

const POSTS_PER_PAGE = 10

/**
 * Umbral de artículos publicados para que una categoría entre al sitemap.
 * Debe coincidir con el de `blog/categoria/[category].astro`: solo se listan
 * aquí las categorías que además se sirven con `index,follow`.
 */
const MIN_POSTS_TO_INDEX = 3

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

  // `sortedPosts` ya excluye borradores, así que el conteo es de publicados.
  const postsByCategory = new Map<string, number>()
  for (const post of sortedPosts) {
    const category = post.data.category
    postsByCategory.set(category, (postsByCategory.get(category) ?? 0) + 1)
  }

  const indexableCategories = getAllCategories(sortedPosts).filter(
    (category) => (postsByCategory.get(category) ?? 0) >= MIN_POSTS_TO_INDEX
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
    ...indexableCategories.map((category) => ({
      path: `/blog/categoria/${category}`,
      changefreq: 'weekly',
      priority: '0.6',
    })),
    ...sortedPosts.map((p) => ({
      path: `/blog/${p.id}`,
      changefreq: 'weekly',
      priority: '0.7',
    })),
    { path: '/privacidad', changefreq: 'yearly', priority: '0.3' },
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
