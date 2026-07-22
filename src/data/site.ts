import type { SiteConfig, SocialLink } from '../types/index';

export const siteConfig: SiteConfig = {
    title: 'Tonatiuj Sánchez | FullStack, Next.js, Node.js, Typescript, MongoDB, PostgreSQL',
    description: 'Software Engineer con más de 5 años de experiencia en desarrollo de software, construyendo productos web, APIs y servicios backend. En la etapa más reciente de mi carrera me he especializado en inteligencia artificial aplicada, integrando interfaces, backend y modelos para llevar soluciones reales a producción, sin perder de vista la arquitectura, el rendimiento y la experiencia de usuario.',
    author: 'Tonatiuj Sánchez',
    role: 'Software Engineer',
    email: 'tonatiujsanchez@gmail.com',
    cvPath: '/docs/TONATIUJ_SANCHEZ_JIMENEZ_CV.pdf',
    url: 'https://tonatiujsanchez.com',
    siteName: 'Tonatiuj Sánchez Portfolio',
    locale: 'es_MX',
    defaultOgImage: '/img/profile/tsj.webp',
    twitterHandle: '@tonatiujsanchez',
    keywords: 'desarrollador fullstack, Next.js, Node.js, TypeScript, React, MongoDB, PostgreSQL, JavaScript',
};

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
