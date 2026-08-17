import type { SiteConfig, SocialLink } from '../types/index';

export const siteConfig: SiteConfig = {
    title: 'Tonatiuj Sánchez — Software Engineer | Full Stack e IA aplicada',
    description: 'AI Software Engineer con más de 5 años de experiencia en desarrollo de software, construyendo productos web, APIs y servicios backend. En la etapa más reciente de mi carrera me he especializado en inteligencia artificial aplicada, integrando interfaces, backend y modelos para llevar soluciones reales a producción, sin perder de vista la arquitectura, el rendimiento y la experiencia de usuario.',
    author: 'Tonatiuj Sánchez',
    role: 'Software Engineer',
    email: 'tonatiujsanchez@gmail.com',
    cvPath: '/docs/TONATIUJ_SANCHEZ_JIMENEZ_CV.pdf',
    url: 'https://tonatiujsanchez.com',
    siteName: 'Tonatiuj Sánchez Portfolio',
    locale: 'es_MX',
    defaultOgImage: '/img/og/default.png',
    twitterHandle: '@tonatiujsanchez',
    keywords: 'desarrollador fullstack, Next.js, Node.js, TypeScript, React, MongoDB, PostgreSQL, JavaScript',
};

/** Origen canónico único del sitio (https, sin www, sin barra final). */
export const SITE_ORIGIN = 'https://tonatiujsanchez.com';

const OWN_HOSTS = ['tonatiujsanchez.com', 'www.tonatiujsanchez.com'];

/**
 * Normaliza cualquier ruta o URL a su forma canónica:
 * absoluta, https, sin www, sin barra final (salvo la raíz) y sin barras dobles.
 * Las URLs de otros dominios (canonical cruzado) conservan su origen.
 */
export function canonicalUrl(input: string | URL = '/'): string {
    const raw = String(input).trim();
    const originMatch = raw.match(/^https?:\/\/[^/?#]+/i);

    let origin = SITE_ORIGIN;
    let rest = raw;

    if (originMatch) {
        const parsed = new URL(originMatch[0]);
        origin = OWN_HOSTS.includes(parsed.hostname.toLowerCase())
            ? SITE_ORIGIN
            : `${parsed.protocol}//${parsed.host}`;
        rest = raw.slice(originMatch[0].length);
    }

    const hashIndex = rest.indexOf('#');
    const hash = hashIndex >= 0 ? rest.slice(hashIndex) : '';
    if (hashIndex >= 0) rest = rest.slice(0, hashIndex);

    const queryIndex = rest.indexOf('?');
    const query = queryIndex >= 0 ? rest.slice(queryIndex) : '';
    if (queryIndex >= 0) rest = rest.slice(0, queryIndex);

    const pathname = `/${rest}`.replace(/\/{2,}/g, '/').replace(/\/+$/, '');

    return `${origin}${pathname}${query}${hash}`;
}

export const socialLinks: SocialLink[] = [
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/tonatiujsanchez/',
        icon: 'bxl-linkedin-square',
    },
    {
        label: 'GitHub',
        href: 'https://github.com/tonatiujsanchez',
        icon: 'bxl-github',
    },
    {
        label: 'Instagram',
        href: 'https://www.instagram.com/tonatiujsanchez/',
        icon: 'bxl-instagram',
    },

];
