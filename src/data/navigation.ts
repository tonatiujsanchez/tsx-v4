import type { NavItem } from '../types/index';

export const navItems: NavItem[] = [
    {
        label: 'Inicio',
        href: '#',
        icon: 'bxs-home',
        ariaLabel: 'Inicio',
        mobileOnly: true,
    },
    {
        label: 'Sobre mí',
        href: '/sobre-mi',
        icon: 'bx-user',
        ariaLabel: 'Sobre mí',
    },
    {
        label: 'Experiencia',
        href: '#experiencia',
        icon: 'bx-laptop',
        ariaLabel: 'Experiencia',
    },
    {
        label: 'Proyectos',
        href: '#proyectos',
        icon: 'bxs-briefcase-alt-2',
        ariaLabel: 'Proyectos',
    },
    {
        label: 'Habilidades',
        href: '#habilidades',
        icon: 'bx-code-alt',
        ariaLabel: 'Habilidades',
        desktopOnly: true,
    },
    {
        label: 'Contacto',
        href: '#contacto',
        icon: 'bxs-envelope',
        ariaLabel: 'Contacto',
    },
    {
        label: 'Blog',
        href: '/blog',
        icon: 'bx-book-open',
        ariaLabel: 'Blog',
    },
];
