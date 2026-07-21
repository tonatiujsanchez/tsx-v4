export const TECH_NAMES = [
    'Javascript', 'Typescript', 'React.js', 'Next.js', 'Node.js',
    'Socket.IO', 'Docker', 'Jest', 'Redux', 'TanStack Query', 'Zustand',
    'MongoDB', 'PostgreSQL', 'My SQL', 'Firebase', 'Java', 'Python',
    'Angular', 'Ionic', 'GIT', 'GitHub', 'Sass', 'Styled Components',
    'Bootstrap', 'TailwindCSS', 'Figma', 'Photoshop',
    'Mongoose', 'Emotion', 'Vite', 'Express',
] as const;

export type TechName = (typeof TECH_NAMES)[number];

export interface NavItem {
    label: string;
    href: string;
    icon: string;
    ariaLabel: string;
    mobileOnly?: boolean;
    desktopOnly?: boolean;
}

export interface Job {
    title: string;
    company: string;
    period: string;
    logo: string;
}

export interface Skill {
    name: TechName;
}

export interface SocialLink {
    label: string;
    href: string;
    icon: string;
}

export type BlogCategory =
    | 'ia'
    | 'tutoriales'
    | 'desarrollo'
    | 'herramientas'
    | 'novedades'
    | 'prompt-engineering';

export interface BlogCover {
    src: string;
    alt: string;
    caption?: string;
}

export interface SiteConfig {
    title: string;
    description: string;
    author: string;
    role: string;
    email: string;
    cvPath: string;
    url: string;
    siteName: string;
    locale: string;
    defaultOgImage: string;
    twitterHandle: string;
    keywords: string;
}
