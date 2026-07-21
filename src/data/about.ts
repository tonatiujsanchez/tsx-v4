export interface AboutTag {
    label: string;
}

export interface GalleryPhoto {
    src: string;
    alt: string;
    caption: string;
    tag: string;
    width: number;
    height: number;
    /** Aspect for desktop card (width / height) */
    ratio: string;
}

export const aboutTags: AboutTag[] = [
    { label: 'Software' },
    { label: 'Full Stack' },
    { label: 'Inteligencia artificial' },
    { label: 'Experiencia de usuario' },
    { label: 'Taekwondo' },
    { label: 'Aprendizaje continuo' },
];

export const galleryPhotos: GalleryPhoto[] = [
    {
        src: '/img/about/about-taekwondo-02.webp',
        alt: 'Momento de entrenamiento de Taekwondo',
        caption: 'Una vida de disciplina constante.',
        tag: 'DISIPLINA',
        width: 1080,
        height: 1080,
        ratio: '1 / 1',
    },
    {
        src: '/img/about/about-setup.webp',
        alt: 'Espacio de trabajo con monitor y notas',
        caption: 'El escritorio como laboratorio diario.',
        tag: 'SETUP',
        width: 1440,
        height: 1440,
        ratio: '1 / 1',
    },
    {
        src: '/img/about/about-coffee.webp',
        alt: 'Taza de café sobre la mesa de trabajo',
        caption: 'Una buena taza siempre acompaña el proceso.',
        tag: 'CAFÉ',
        width: 1080,
        height: 1440,
        ratio: '3 / 4',
    },
    {
        src: '/img/about/about-field.webp',
        alt: 'Escena al aire libre en el campo',
        caption: 'Salir a caminar, reiniciar la señal.',
        tag: 'CAMPO',
        width: 968,
        height: 968,
        ratio: '1 / 1',
    },
    {
        src: '/img/about/about-casual.webp',
        alt: 'Retrato casual fuera del contexto de trabajo',
        caption: 'Un momento pausado entre proyectos.',
        tag: 'MOMENTO',
        width: 1439,
        height: 859,
        ratio: '5 / 3',
    },
    {
        src: '/img/about/about-taekwondo-01.webp',
        alt: 'Momento de entrenamiento de Taekwondo',
        caption: 'Disciplina y concentración sobre el tatami.',
        tag: 'TAEKWONDO',
        width: 1440,
        height: 1920,
        ratio: '3 / 4',
    },
    {
        src: '/img/about/about-technology.webp',
        alt: 'Detalle de un equipo tecnológico',
        caption: 'La tecnología que inspira el trabajo.',
        tag: 'TECNOLOGÍA',
        width: 1440,
        height: 1920,
        ratio: '3 / 4',
    },
    {
        src: '/img/about/about-setup-02.webp',
        alt: 'Vista del área de trabajo desde otro ángulo',
        caption: 'Herramientas, cables y calma.',
        tag: 'SETUP',
        width: 1440,
        height: 1920,
        ratio: '3 / 4',
    },
    {
        src: '/img/about/about-portrait.webp',
        alt: 'Retrato personal editorial',
        caption: 'La persona detrás del código.',
        tag: 'RETRATO',
        width: 1200,
        height: 1600,
        ratio: '3 / 4',
    },
];
