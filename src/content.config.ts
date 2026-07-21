import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { TECH_NAMES } from './types/index';

const BLOG_CATEGORIES = ['ia', 'tutoriales', 'desarrollo', 'herramientas', 'novedades', 'prompt-engineering'] as const;

const projects = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        summary: z.string(),
        order: z.number(),
        cover: z.string(),
        year: z.number().optional(),
        tech: z.array(z.enum(TECH_NAMES)),
        coverCaption: z.string().optional(),
        demo: z.url().optional(),
        github: z.url().optional(),
        githubFrontend: z.url().optional(),
        githubBackend: z.url().optional(),
        gallery: z.array(z.object({ src: z.string(), caption: z.string() })).optional(),
    }),
});

const blog = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
    schema: z.object({
        // required
        title: z.string(),
        description: z.string(),
        excerpt: z.string(),
        publishedAt: z.coerce.date(),
        category: z.enum(BLOG_CATEGORIES),
        cover: z.object({
            src: z.string(),
            alt: z.string(),
            caption: z.string().optional(),
        }),
        draft: z.boolean().default(true),
        tags: z.array(z.string()).default([]),
        // optional
        updatedAt: z.coerce.date().optional(),
        author: z.string().optional(),
        featured: z.boolean().default(false),
        series: z.string().optional(),
        canonical: z.url().optional(),
        ogImage: z.string().optional(),
    }),
});

export const collections = { projects, blog };
