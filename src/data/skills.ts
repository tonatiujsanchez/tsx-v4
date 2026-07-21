import type { Skill, TechName } from '../types/index';

export const skills: Skill[] = [
    { name: 'Javascript' },
    { name: 'Typescript' },
    { name: 'React.js' },
    { name: 'Next.js' },
    { name: 'Node.js' },
    { name: 'Socket.IO' },
    { name: 'Docker' },
    { name: 'Jest' },
    { name: 'Redux' },
    { name: 'TanStack Query' },
    { name: 'Zustand' },
    { name: 'MongoDB' },
    { name: 'PostgreSQL' },
    { name: 'My SQL' },
    { name: 'Firebase' },
    { name: 'Java' },
    { name: 'Python' },
    { name: 'Angular' },
    { name: 'Ionic' },
    { name: 'GIT' },
    { name: 'GitHub' },
    { name: 'Sass' },
    { name: 'Styled Components' },
    { name: 'Bootstrap' },
    { name: 'TailwindCSS' },
    { name: 'Figma' },
    { name: 'Photoshop' },
];

export interface SkillGroup {
    title: string;
    skills: TechName[];
}

export const skillGroups: SkillGroup[] = [
    {
        title: 'Lenguajes',
        skills: ['Javascript', 'Typescript', 'Java', 'Python'],
    },
    {
        title: 'Frontend',
        skills: ['React.js', 'Next.js', 'Angular', 'Ionic', 'Redux', 'Zustand', 'TanStack Query'],
    },
    {
        title: 'Estilos y UI',
        skills: ['Sass', 'Styled Components', 'TailwindCSS', 'Bootstrap'],
    },
    {
        title: 'Backend y datos',
        skills: ['Node.js', 'Socket.IO', 'MongoDB', 'PostgreSQL', 'My SQL', 'Firebase'],
    },
    {
        title: 'Herramientas',
        skills: ['Docker', 'Jest', 'GIT', 'GitHub', 'Figma', 'Photoshop'],
    },
];
