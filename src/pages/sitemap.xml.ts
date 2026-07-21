import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { siteConfig } from '@data/site'
import { getAllCategories, getAllTags } from '../utils/blog'

export const GET: APIRoute = async () => {
  const projects = await getCollection('projects')
  const blogPosts = await getCollection('blog', ({ data }) => !data.draft)

  const categories = getAllCategories(blogPosts)
  const tags = getAllTags(blogPosts)

  const urls = [
    `  <url><loc>${siteConfig.url}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>`,
    `  <url><loc>${siteConfig.url}/sobre-mi</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
    ...projects.map(
      (p) =>
        `  <url><loc>${siteConfig.url}/projects/${p.id}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`
    ),
    `  <url><loc>${siteConfig.url}/blog</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    ...blogPosts.map(
      (p) =>
        `  <url><loc>${siteConfig.url}/blog/${p.id}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`
    ),
    ...categories.map(
      (c) =>
        `  <url><loc>${siteConfig.url}/blog/categoria/${c}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`
    ),
    ...tags.map(
      (t) =>
        `  <url><loc>${siteConfig.url}/blog/tag/${t}</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>`
    ),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
