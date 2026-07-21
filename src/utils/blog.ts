import type { CollectionEntry } from 'astro:content'

type BlogEntry = CollectionEntry<'blog'>

export function getVisiblePosts(posts: BlogEntry[], isDev: boolean): BlogEntry[] {
  return posts.filter(p => isDev || !p.data.draft)
}

export function sortPostsByDate(posts: BlogEntry[]): BlogEntry[] {
  return [...posts].sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  )
}

export function getAllTags(posts: BlogEntry[]): string[] {
  const tags = new Set<string>()
  for (const post of posts) {
    for (const tag of post.data.tags ?? []) {
      tags.add(tag)
    }
  }
  return [...tags].sort()
}

export function getAllCategories(posts: BlogEntry[]): string[] {
  const cats = new Set<string>()
  for (const post of posts) {
    cats.add(post.data.category)
  }
  return [...cats].sort()
}

export function getTotalPages(total: number, perPage = 10): number {
  return Math.max(1, Math.ceil(total / perPage))
}

export function paginatePosts(posts: BlogEntry[], page: number, perPage = 10): BlogEntry[] {
  const start = (page - 1) * perPage
  return posts.slice(start, start + perPage)
}

export function getRelatedPosts(
  currentId: string,
  posts: BlogEntry[],
  limit = 3
): BlogEntry[] {
  const current = posts.find(p => p.id === currentId)
  if (!current) return []

  const currentTags = new Set(current.data.tags ?? [])
  const currentCategory = current.data.category

  return posts
    .filter(p => p.id !== currentId)
    .map(p => {
      const sharedTags = (p.data.tags ?? []).filter(t => currentTags.has(t)).length
      const sameCategory = p.data.category === currentCategory ? 1 : 0
      return { post: p, score: sharedTags * 2 + sameCategory }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post)
}
