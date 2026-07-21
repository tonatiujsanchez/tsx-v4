---
title: "Cómo usar Claude Code sin gastar tantos tokens"
description: "Cómo mantener contexto entre sesiones, controlar el alcance y evitar que Claude reanalice el repositorio completo cada vez que inicias una nueva tarea."
excerpt: "Cada sesión de Claude Code empieza sin memoria. Si no le das contexto estructurado, se lo construye solo leyendo archivos. Aquí está el sistema que usé para completar más de 20 fases de migración sin perder el hilo."
publishedAt: 2026-05-31
updatedAt: 2026-05-31
draft: false
category: tutoriales
tags:
  - claude-code
  - ia-generativa
  - productividad
  - workflow
  - herramientas
featured: true
author: Tonatiuj Sánchez
cover:
  src: /img/blog/claude-code-sin-gastar-tantos-tokens/cover.webp
  alt: Ilustración técnica sobre cómo usar Claude Code con contexto persistente para reducir consumo de tokens.
  caption: Un flujo de trabajo por fases ayuda a reducir reanálisis innecesarios y mantener control del contexto.
ogImage: /img/blog/claude-code-sin-gastar-tantos-tokens/cover.webp
---

Cada sesión de Claude Code empieza sin memoria. No recuerda qué archivos modificaste ayer, qué decisiones técnicas tomaste la semana pasada ni qué convenciones sigue el proyecto. Si no tienes una estrategia para entregar ese contexto de forma eficiente, terminas repitiendo las mismas instrucciones en cada sesión, o peor: pidiéndole que "analice todo el proyecto" antes de poder empezar.

Este artículo documenta el flujo que usé para migrar un portafolio completo de vanilla JS/HTML a Astro + TypeScript, distribuido en más de 20 fases, sin perder contexto entre sesiones y sin que Claude leyera archivos que no necesitaba en cada turno.

---

## El problema: sin estructura, Claude explora de más

Cuando inicias una sesión y le dices "continúa la migración", Claude necesita saber el estado del proyecto, qué se hizo y qué sigue. Si no hay una respuesta lista en texto, tiene dos opciones: preguntarte o explorar el repositorio por su cuenta. Ambas consumen contexto. La exploración puede escalar rápido en proyectos con muchos archivos.

El patrón más caro es este:

```
"Analiza el proyecto completo y dime qué falta."
```

Ese prompt dispara lecturas de decenas de archivos antes de que Claude dé una respuesta útil. Si lo repites en cada sesión, el costo se acumula fase a fase.

La diferencia está en **quién construye el contexto**. Si no lo defines tú en texto, Claude lo construye leyendo archivos. Si lo defines tú, Claude trabaja con ese texto directamente y solo pide los archivos que realmente necesita.

> **Nota:** pedirle a Claude que "revise todo el proyecto para ver si algo está mal" no solo gasta tokens, también genera ruido. El modelo puede encontrar patrones sin relación con la tarea actual y proponer cambios fuera de alcance.

---

## La solución: tres archivos de contexto persistente

La estrategia es simple: mantener tres archivos de texto que Claude lee al inicio de cada sesión. Cada uno tiene un rol específico y no se solapan.

Los nombres que uso aquí son los de este proyecto. Puedes adaptarlos a cualquier convención que tenga sentido para ti.

### `CLAUDE.md` — reglas del proyecto

Claude Code lo lee automáticamente al iniciar sesión si está en la raíz del proyecto. Contiene las reglas que cambian poco: stack, convenciones, arquitectura de carpetas, restricciones.

Un ejemplo mínimo:

```markdown
## Stack
- Astro + TypeScript
- CSS scoped por componente
- Sin React ni frameworks adicionales

## Reglas
- Cero `any`
- No hardcodear datos en componentes
- Mantener BEM donde aplique

## Antes de cada tarea
1. Leer `MIGRATION_STATUS.md`
2. Leer `MIGRATION_TASK.md`
```

> **Tip:** mantén `CLAUDE.md` enfocado en reglas que cambian poco. No pongas estado del proyecto aquí; ese va en el siguiente archivo.

### `MIGRATION_STATUS.md` — historial de fases

El historial vivo del proyecto. Cada fase completada deja una entrada con lo que se creó, lo que se modificó, las decisiones técnicas tomadas y los pendientes conocidos.

Estructura básica por fase:

```markdown
### Fase BLOG-3

**Creados:**
- `src/pages/blog/index.astro` — filtra drafts en producción
- `src/pages/blog/[slug].astro` — detalle de artículo

**Decisiones:**
- `getStaticPaths` incluye drafts en dev, los excluye en build

**Validaciones:**
- `pnpm astro check`: 0 errores
- `pnpm build`: 7 páginas
```

Este archivo no es documentación para humanos: es el contexto que le permite a Claude entrar en cualquier sesión sin explorar el repo. Un `MIGRATION_STATUS.md` bien mantenido es la diferencia entre una sesión de 3 mensajes y una de 12.

### `MIGRATION_TASK.md` — tarea actual

El archivo más importante para controlar el alcance. Define qué debe hacer Claude en esta sesión: qué archivos puede leer, qué puede editar y qué está explícitamente fuera de alcance.

```markdown
## Tarea actual

Fase BLOG-5 — Categorías, tags y RSS

## Archivos permitidos para lectura

- `src/content.config.ts`
- `src/utils/blog.ts` (si existe)

## Archivos permitidos para edición

- `src/utils/blog.ts`
- `src/pages/blog/categoria/[category].astro`
- `src/pages/rss.xml.ts`

## Fuera de alcance

- No modificar páginas existentes de blog
- No modificar componentes
- No instalar dependencias
```

La lista de archivos para edición es la parte más crítica. Sin ella, Claude puede proponer "mientras estoy aquí, también mejoraría este componente..." y antes de notarlo tienes cambios en archivos que no querías tocar.

---

## Cómo ejecutar una fase con un prompt corto

Con los tres archivos listos, el prompt de inicio puede ser muy conciso:

```
Lee únicamente:
1. `CLAUDE.md`
2. `MIGRATION_STATUS.md`
3. `MIGRATION_TASK.md`

Ejecuta solo la tarea actual definida en `MIGRATION_TASK.md`.
No avances a la siguiente fase.
```

Claude lee los tres archivos, entiende el estado del proyecto, ejecuta solo lo que está en scope y actualiza los archivos de estado al terminar. No necesita explorar el repositorio. No necesitas explicarle la arquitectura desde cero.

---

## Cuándo usar `/clear`

`/clear` limpia el historial de la conversación. Úsalo:

- Entre fases sin relación directa (pasar de migrar componentes a configurar SEO).
- Cuando el contexto acumuló lecturas de archivos que ya no son relevantes.
- Al iniciar una sesión nueva con una tarea diferente.

No lo uses en medio de una tarea en progreso. Si Claude tiene contexto útil del trabajo actual, limpiarlo obliga a rehidratarlo desde cero.

> **Nota:** `/clear` no borra `CLAUDE.md`, `MIGRATION_STATUS.md` ni `MIGRATION_TASK.md`. Solo limpia la conversación. Claude los vuelve a leer en la siguiente sesión.

---

## Cuándo usar `/compact`

`/compact` comprime el historial sin descartarlo del todo. Úsalo cuando:

- La sesión lleva muchos turnos y el contexto está lleno de respuestas largas que ya procesaste.
- Quieres continuar la misma tarea pero el modelo responde más lento.
- Antes de pedir una revisión que necesita contexto más fresco.

La diferencia práctica: `/compact` conserva un resumen de lo que pasó; `/clear` borra todo. Para tareas largas dentro de una misma fase, `/compact` es la mejor opción.

---

## Skills locales en `.claude/skills/`

Los skills son fragmentos de instrucciones que se invocan con un comando `/nombre`. Se guardan como archivos Markdown en `.claude/skills/` en la raíz del proyecto.

Un skill útil para reducir verbosidad en las respuestas:

```markdown
<!-- .claude/skills/conciso.md -->
Responde de forma muy concisa.
Elimina frases de relleno y saludos.
Mantén toda la sustancia técnica.
Código sin cambios.
```

Otros skills útiles en proyectos largos:

- **`/phase-commit`**: crea un commit con el formato estándar del proyecto.
- **`/status-update`**: actualiza `MIGRATION_STATUS.md` con el formato correcto de la fase.
- **`/scope-check`**: revisa que los cambios propuestos estén dentro del alcance de `MIGRATION_TASK.md`.

Los skills no reemplazan los archivos de contexto, pero evitan repetir las mismas instrucciones en cada sesión.

---

## Flujo completo por fase

```
1. Definir la fase en MIGRATION_TASK.md
   — tarea, archivos permitidos, fuera de alcance

2. Iniciar sesión con prompt corto
   — "Lee CLAUDE.md, MIGRATION_STATUS.md, MIGRATION_TASK.md.
      Ejecuta solo la tarea actual."

3. Revisar diff antes de aceptar cambios
   — git diff --stat
   — git diff src/

4. Ejecutar validaciones
   — pnpm astro check (o el equivalente del proyecto)
   — pnpm build

5. Actualizar MIGRATION_STATUS.md
   — Claude lo hace como parte de la tarea; confirmar que quedó correcto

6. Actualizar MIGRATION_TASK.md con la siguiente fase
   — sin ejecutarla todavía

7. Commit por fase completada
   — no acumular varias fases en un solo commit

8. /clear antes de empezar la siguiente fase
   — sesión nueva, contexto limpio
```

---

## Checklist de buenas prácticas

| Práctica | Por qué importa |
|---|---|
| `CLAUDE.md` en la raíz | Claude lo lee automáticamente al iniciar sesión |
| `MIGRATION_TASK.md` con lista explícita de archivos editables | Evita cambios no solicitados fuera de alcance |
| Prompt corto al iniciar fase | Reduce exploración innecesaria del repositorio |
| `/clear` entre fases distintas | Contexto viejo puede generar sugerencias irrelevantes |
| Commit por fase | Fácil identificar y revertir por fase si algo sale mal |
| Validaciones al terminar cada fase | Detecta errores antes de acumularlos |
| `MIGRATION_STATUS.md` actualizado siempre | Hace la siguiente sesión más barata en contexto |

---

## Conclusión

Claude Code no necesita leer todo el repositorio para trabajar bien. Necesita el contexto correcto, delimitado, en el momento correcto.

Los tres archivos (`CLAUDE.md`, `MIGRATION_STATUS.md`, `MIGRATION_TASK.md`) son ese sistema. No son documentación de proyecto: son el mecanismo que convierte sesiones largas y dispersas en sesiones cortas y enfocadas.

El flujo descrito aquí se usó para completar más de 20 fases en este portafolio, desde el setup inicial hasta el sistema de blog con RSS, categorías y feeds por taxonomía. La mayoría de las sesiones terminaron con el diff exacto esperado, sin cambios no solicitados.

El token más barato es el que no se gasta.
