import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { canonicalUrl, siteConfig, socialLinks } from '@data/site'
import { sortPostsByDate } from '../utils/blog'

export const prerender = true

/** Deja el texto en una sola línea, sin HTML ni espacios duplicados. */
function oneLine(value?: string): string {
  return (value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function link(label: string, path: string, note: string): string {
  const description = oneLine(note)
  return `- [${oneLine(label)}](${canonicalUrl(path)})${description ? `: ${description}` : ''}`
}

function profileUrl(label: string): string | undefined {
  return socialLinks.find((l) => l.label === label)?.href
}

export const GET: APIRoute = async () => {
  const projects = await getCollection('projects')
  const publishedProjects = [...projects].sort((a, b) => a.data.order - b.data.order)

  const posts = await getCollection('blog', ({ data }) => !data.draft)
  const publishedPosts = sortPostsByDate(posts)

  const twitterUrl = `https://x.com/${siteConfig.twitterHandle.replace(/^@/, '')}`
  const officialProfiles = [
    { label: 'LinkedIn', href: profileUrl('LinkedIn') },
    { label: 'GitHub', href: profileUrl('GitHub') },
    { label: 'X', href: twitterUrl },
    { label: 'Instagram', href: profileUrl('Instagram') },
  ].filter((p): p is { label: string; href: string } => Boolean(p.href))

  const lines = [
    `# ${oneLine(siteConfig.author)}`,
    '',
    `> ${oneLine(siteConfig.description)}`,
    '',
    `Portafolio profesional oficial de ${oneLine(siteConfig.author)}, ${oneLine(siteConfig.role)}.`,
    '',
    '## Perfil',
    '',
    link('Portafolio principal', '/', 'Inicio: experiencia, proyectos, tecnologías y contacto.'),
    link('Sobre mí', '/sobre-mi', 'Trayectoria, forma de trabajar y contexto personal.'),
    link('Currículum', siteConfig.cvPath, 'CV en PDF.'),
    '',
    '## Proyectos',
    '',
    ...publishedProjects.map((project) =>
      link(
        project.data.title,
        `/projects/${project.id}`,
        project.data.summary || project.data.description
      )
    ),
    '',
    '## Blog',
    '',
    link('Blog', '/blog', 'Notas sobre IA, desarrollo web y herramientas para ingenieros de software.'),
    ...publishedPosts.map((post) =>
      link(post.data.title, `/blog/${post.id}`, post.data.excerpt)
    ),
    '',
    '## Perfiles oficiales',
    '',
    ...officialProfiles.map((p) => `- [${p.label}](${p.href})`),
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
