---
title: "Borrador de prueba — BLOG-4"
description: "Artículo de prueba para validar estilos editoriales del blog. No publicar."
excerpt: "Validación visual de headings, código, callouts, tablas e imágenes. Borrador técnico."
publishedAt: 2026-01-01
category: desarrollo
tags:
  - astro
  - typescript
cover:
  src: /img/blog/primer-borrador-blog/cover.webp
  alt: Portada de prueba del blog
draft: true
---

## Headings y párrafos

Este artículo es un borrador técnico para validar estilos editoriales en BLOG-4.

Un párrafo de texto con **negrita**, *itálica* y un [enlace de ejemplo](#). El espaciado vertical y el ancho de lectura deben sentirse cómodos en pantallas medianas y grandes.

### Subsección nivel 3

Texto debajo de un `h3`. La jerarquía debe ser clara sin parecer una landing page.

#### Subsección nivel 4

Texto debajo de un `h4`. Peso menor, margen menor.

---

## Listas

Lista desordenada:

- Primer elemento de la lista
- Segundo elemento con texto más largo que ocupa espacio en el renglón
- Tercer elemento
  - Elemento anidado
  - Otro anidado

Lista ordenada:

1. Paso uno
2. Paso dos
3. Paso tres

---

## Código

### Inline

Usa `getCollection('blog')` para obtener todos los posts. La función devuelve un `Promise<CollectionEntry<'blog'>[]>` que puedes filtrar con `({ data }) => !data.draft`.

### Bloque

```typescript
export async function getStaticPaths() {
  const isDev = import.meta.env.DEV
  const posts = await getCollection('blog', ({ data }) => {
    return isDev || !data.draft
  })
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }))
}
```

```bash
pnpm astro check
pnpm build
```

---

## Callouts

> **Nota:** los callouts se escriben como blockquotes con un marcador en negrita al inicio. El CSS resalta la etiqueta en color primario.

> **Tip:** este es un tip. Útil para buenas prácticas, atajos o recomendaciones rápidas.

> **Advertencia:** este es un aviso importante. Úsalo para errores comunes o comportamientos inesperados.

---

## Tabla

| Herramienta   | Tipo         | Uso principal           |
|---------------|--------------|-------------------------|
| Astro         | Framework    | Sitios estáticos / SSR  |
| TypeScript    | Lenguaje     | Tipado estático         |
| Zod           | Validación   | Schema runtime          |
| pnpm          | Package mgr  | Gestión de dependencias |

---

## Imagen

![Imagen de ejemplo con ruta futura](/img/blog/primer-borrador-blog/cover.webp)

*La imagen anterior usará la ruta de cover como placeholder. En artículos reales se subirá la imagen correcta.*
