---
title: "Agentes de IA desde cero: qué son, cómo funcionan y cuándo usarlos"
description: "Una guía clara para entender qué es un agente de inteligencia artificial, cómo utiliza herramientas, memoria y ciclos de decisión, y cuándo realmente conviene construir uno."
excerpt: "Un agente de IA no es solo un chatbot con un nombre. En esta guía explico desde cero cómo funciona, qué componentes necesita, cómo se relaciona con Claude y qué debes considerar antes de darle autonomía."
publishedAt: 2026-06-17
category: "tutoriales"
cover:
  src: "/img/blog/agentes-ia-desde-cero/cover.webp"
  alt: "Agente de inteligencia artificial conectado con herramientas, memoria y sistemas externos"
  caption: "Un agente combina un modelo de lenguaje con herramientas, contexto, reglas y un ciclo de decisión."
draft: false
tags:
  - "agentes-de-ia"
  - "claude"
  - "llm"
  - "herramientas"
  - "automatizacion"
author: "Tonatiuj Sánchez"
featured: false
ogImage: "/img/blog/agentes-ia-desde-cero/og.jpg"
---

Durante los últimos meses, la palabra **agente** empezó a aparecer en prácticamente cualquier producto de inteligencia artificial.

Hay agentes para programar, investigar, responder correos, analizar documentos, atender clientes, crear reportes y automatizar procesos completos.

El problema es que muchas veces se utiliza la palabra para describir cosas muy diferentes.

A veces se llama agente a un chatbot con un prompt largo.

En otros casos se trata de un flujo automático con varios pasos.

Y en los sistemas más completos, el modelo realmente puede decidir qué hacer, utilizar herramientas, revisar resultados y continuar trabajando hasta alcanzar un objetivo.

Entonces, ¿qué es realmente un agente de IA?

La idea principal puede resumirse así:

> Un agente de IA es un sistema que utiliza un modelo para tomar decisiones, ejecutar acciones mediante herramientas y avanzar hacia un objetivo con cierto nivel de autonomía.

No es solamente el modelo.

Tampoco es únicamente una colección de funciones.

El agente aparece cuando combinamos razonamiento, herramientas, contexto, reglas y un ciclo que le permite observar lo que ocurrió y decidir cuál es el siguiente paso.

En este artículo vamos a entenderlo desde cero, con ejemplos cercanos a Claude y Claude Code, pero sin asumir que ya conoces arquitecturas de agentes.

## Primero: un modelo no es lo mismo que un agente

Un modelo de lenguaje recibe una entrada y genera una salida.

Por ejemplo:

```text
Entrada:
Explícame qué es una API.

Salida:
Una API es una interfaz que permite...
```

El modelo interpreta el texto y responde.

Eso, por sí solo, no es un agente.

También podemos pedirle que redacte un correo, resuma un documento o proponga código. Sigue siendo una interacción donde recibe contexto y devuelve una respuesta.

Un agente agrega algo más:

- Tiene un objetivo.
- Puede elegir acciones.
- Tiene acceso a herramientas.
- Observa los resultados.
- Decide si ya terminó o necesita continuar.
- Puede ejecutar varios pasos antes de entregar una respuesta final.

Por ejemplo, si le pedimos:

> Revisa por qué falló el build, encuentra el problema, corrígelo y valida que el proyecto compile.

Un sistema agente podría:

1. Inspeccionar el repositorio.
2. Ejecutar el build.
3. Leer el error.
4. Buscar el archivo relacionado.
5. Modificar el código.
6. Ejecutar las pruebas.
7. Revisar el nuevo resultado.
8. Continuar si algo sigue fallando.
9. Entregar un resumen cuando termine.

El modelo participa en las decisiones, pero las herramientas y el ciclo de ejecución convierten esa capacidad en un sistema agente.

## Automatización, workflow y agente no son exactamente lo mismo

Antes de construir un agente, conviene distinguir tres conceptos.

### Automatización tradicional

Una automatización sigue reglas fijas.

Por ejemplo:

```text
Cuando llegue un formulario:
1. Guardar los datos.
2. Enviar un correo.
3. Crear una tarea.
```

El flujo está definido de antemano.

No necesita un modelo para decidir qué hacer.

Es predecible, fácil de probar y, para muchos procesos, sigue siendo la mejor opción.

### Workflow con IA

Un workflow puede incluir uno o varios modelos, pero sus pasos principales están definidos por nosotros.

Por ejemplo:

```text
1. Clasificar el documento.
2. Extraer datos.
3. Validar el resultado.
4. Guardarlo en la base de datos.
```

El modelo puede tomar decisiones dentro de cada paso, pero la ruta general sigue siendo conocida.

Otro ejemplo:

```text
Si la consulta es técnica:
    enviarla al modelo especializado.
Si es comercial:
    enviarla al asistente de ventas.
```

Hay inteligencia en ciertas partes, pero el sistema todavía sigue una orquestación explícita.

### Agente

En un agente, el modelo tiene mayor control sobre el camino que seguirá.

Puede decidir:

- Qué herramienta utilizar.
- En qué orden.
- Cuándo repetir una acción.
- Cuándo buscar más información.
- Cuándo cambiar de estrategia.
- Cuándo pedir ayuda.
- Cuándo considerar que la tarea terminó.

Esto ofrece flexibilidad, pero también introduce variabilidad.

Por eso no conviene utilizar un agente cuando un flujo fijo resuelve el problema de forma más simple y segura.

## Un ejemplo sencillo

Imagina que quieres investigar una tecnología y preparar un reporte.

### Como workflow

El sistema podría ejecutar siempre:

1. Buscar cinco fuentes.
2. Resumir cada una.
3. Comparar resultados.
4. Generar un reporte.

Los pasos son los mismos para cualquier tema.

### Como agente

El sistema recibe el objetivo:

> Investiga esta tecnología y prepara un reporte con los puntos más importantes.

Después podría decidir:

1. Comenzar por la documentación oficial.
2. Detectar que existe una versión reciente.
3. Buscar notas de migración.
4. Consultar ejemplos.
5. Comparar dos implementaciones.
6. Identificar una contradicción.
7. Buscar una fuente adicional.
8. Redactar el reporte.
9. Revisar si respondió todas las preguntas.

El agente puede adaptar el proceso según lo que encuentre.

Esa capacidad es útil cuando no conocemos de antemano todos los pasos necesarios.

## El ciclo básico de un agente

Aunque existen muchas arquitecturas, gran parte de los agentes siguen un ciclo parecido:

```text
Objetivo
   ↓
Analizar la situación
   ↓
Elegir una acción
   ↓
Usar una herramienta
   ↓
Observar el resultado
   ↓
Decidir el siguiente paso
   ↓
Terminar o continuar
```

Este patrón suele llamarse **agent loop** o ciclo del agente.

Veamos cada parte.

### 1. Recibir un objetivo

El agente necesita saber qué debe lograr.

Un objetivo puede ser:

```text
Encontrar la causa del error y corregirla.
```

o:

```text
Preparar un resumen de las ventas del mes y señalar anomalías.
```

Un objetivo claro reduce decisiones ambiguas.

“Analiza este sistema” es demasiado abierto.

“Identifica por qué aumentó la tasa de errores desde el último despliegue y prepara un reporte con evidencia” es mucho más útil.

### 2. Interpretar el estado actual

El agente revisa el contexto disponible:

- Instrucciones.
- Conversación.
- Archivos.
- Resultados anteriores.
- Datos del sistema.
- Restricciones.
- Herramientas disponibles.

Con esa información decide qué acción tiene más sentido.

### 3. Elegir una herramienta

El agente puede seleccionar una función como:

```text
leer_archivo
buscar_en_la_web
consultar_base_de_datos
ejecutar_pruebas
crear_ticket
enviar_correo
```

Cada herramienta debe tener una descripción clara y parámetros bien definidos.

### 4. Ejecutar la acción

La aplicación recibe la solicitud del modelo, ejecuta la herramienta y devuelve el resultado.

Por ejemplo:

```text
Herramienta:
leer_archivo

Entrada:
src/config/database.ts

Resultado:
Contenido del archivo...
```

El modelo no accede mágicamente al archivo.

La aplicación es responsable de ejecutar la operación real.

### 5. Observar el resultado

El agente incorpora el resultado a su contexto.

Puede descubrir que:

- Encontró la información necesaria.
- La herramienta devolvió un error.
- Necesita consultar otro archivo.
- La hipótesis inicial era incorrecta.
- Falta una credencial.
- La tarea requiere autorización humana.

### 6. Continuar o terminar

El modelo decide si debe realizar otra acción o entregar una respuesta final.

El ciclo puede repetirse varias veces.

Por eso es importante establecer límites como:

- Número máximo de pasos.
- Tiempo máximo.
- Presupuesto de tokens.
- Herramientas permitidas.
- Operaciones que requieren aprobación.

Sin límites, un agente puede continuar intentando resolver una tarea sin lograr un resultado útil.

## Los componentes de un agente

Un agente completo suele combinar varios elementos.

### Modelo de lenguaje

Es el componente que interpreta el objetivo y toma decisiones.

No todos los modelos tienen la misma capacidad para:

- Seguir instrucciones largas.
- Elegir herramientas.
- Planear tareas.
- Trabajar con código.
- Mantener contexto.
- Detectar errores.
- Evaluar resultados.

El modelo es importante, pero no compensa una arquitectura mal diseñada.

### Instrucciones

Las instrucciones definen:

- El rol del agente.
- Su objetivo.
- Reglas.
- Restricciones.
- Formato esperado.
- Acciones prohibidas.
- Condiciones para terminar.

Por ejemplo:

```text
Trabaja únicamente en modo lectura.
No modifiques archivos.
Usa fuentes oficiales.
Si no encuentras evidencia suficiente, indícalo.
```

Las instrucciones no garantizan por sí solas que el agente nunca se equivoque, pero reducen la ambigüedad.

### Herramientas

Las herramientas permiten que el agente haga algo fuera del modelo.

Pueden ser de lectura:

- Consultar archivos.
- Buscar documentos.
- Leer correos.
- Obtener métricas.
- Consultar una API.

O de escritura:

- Editar código.
- Crear un registro.
- Enviar un mensaje.
- Eliminar un archivo.
- Desplegar una aplicación.

Las herramientas de escritura requieren controles más estrictos.

### Memoria y estado

Un agente necesita conservar información mientras trabaja.

Puede existir memoria de distintos tipos:

- Contexto de la conversación actual.
- Estado temporal de una tarea.
- Resultados de herramientas.
- Resúmenes de pasos anteriores.
- Memoria persistente entre sesiones.
- Información recuperada desde una base de conocimiento.

No toda memoria debe ser permanente.

Guardar demasiado puede introducir datos desactualizados, ruido o riesgos de privacidad.

### Recuperación de información

Un agente puede utilizar RAG, búsqueda web, bases de datos o APIs para obtener información que no está en el prompt.

La recuperación le permite trabajar con datos recientes o privados.

Pero también necesita evaluar la calidad de lo recuperado.

Un agente con una mala búsqueda puede tomar decisiones incorrectas con mucha seguridad.

### Planificación

Algunos agentes generan un plan antes de actuar.

Por ejemplo:

```text
1. Revisar configuración.
2. Ejecutar build.
3. Analizar error.
4. Aplicar corrección mínima.
5. Validar.
```

Otros planifican paso a paso y cambian de estrategia según los resultados.

Un plan puede ayudar en tareas largas, pero también puede volverse obsoleto después de la primera observación.

Por eso conviene permitir que el agente lo actualice.

### Guardrails

Los guardrails son controles que limitan acciones o validan resultados.

Pueden incluir:

- Validación de entrada.
- Lista de herramientas permitidas.
- Límites de permisos.
- Confirmación antes de operaciones sensibles.
- Filtros de datos.
- Validación de salida.
- Reglas de negocio.
- Restricciones por usuario o entorno.

Los guardrails no deben depender únicamente del prompt.

Las operaciones críticas también deben protegerse en código y en infraestructura.

### Evaluación

Un agente necesita una forma de saber si hizo bien su trabajo.

Puede utilizar:

- Pruebas automatizadas.
- Esquemas de validación.
- Comparación con resultados esperados.
- Revisores humanos.
- Modelos evaluadores.
- Reglas deterministas.
- Métricas de calidad.

Por ejemplo, un agente que modifica código no debería considerar terminada la tarea solo porque guardó un archivo.

También debería ejecutar:

```text
type check
tests
build
lint
```

La capacidad de verificar el resultado suele ser más importante que la capacidad de generar rápidamente una solución.

## Herramientas y agentes en Claude

Claude puede utilizar herramientas definidas por una aplicación.

Cada herramienta incluye normalmente:

- Nombre.
- Descripción.
- Esquema de entrada.
- Parámetros requeridos.

Claude analiza la solicitud y puede decidir que necesita llamar una herramienta.

La aplicación ejecuta la operación y devuelve el resultado a Claude.

El flujo puede verse así:

```text
Usuario
   ↓
Claude analiza la tarea
   ↓
Claude solicita una herramienta
   ↓
La aplicación ejecuta la herramienta
   ↓
Claude recibe el resultado
   ↓
Claude responde o solicita otra herramienta
```

Claude Code es un ejemplo cercano de una herramienta agente.

Puede:

- Leer un repositorio.
- Buscar referencias.
- Editar archivos.
- Ejecutar comandos.
- Revisar diffs.
- Correr pruebas.
- Trabajar durante varios pasos.

No significa que siempre tome la decisión correcta.

Por eso sigue siendo importante:

- Definir bien el alcance.
- Revisar el plan.
- Limitar archivos.
- Exigir validaciones.
- Inspeccionar el diff.
- Hacer commits pequeños.

## La relación entre agentes, MCP y RAG

Estos tres conceptos están relacionados, pero no son lo mismo.

### RAG

RAG ayuda a recuperar información relevante.

Responde a la pregunta:

> ¿Qué información necesita el modelo para responder?

### MCP

MCP define una forma estandarizada de conectar aplicaciones de IA con herramientas y fuentes externas.

Responde a la pregunta:

> ¿Cómo conectamos el modelo con esas capacidades?

### Agente

El agente decide cómo utilizar el contexto y las herramientas para avanzar hacia un objetivo.

Responde a la pregunta:

> ¿Qué acción conviene realizar ahora y qué hacemos después?

Un agente puede utilizar:

- MCP para conectarse con herramientas.
- RAG para recuperar conocimiento.
- APIs para ejecutar acciones.
- Memoria para conservar estado.
- Guardrails para limitar permisos.

Pero también puede existir un agente sin MCP o sin RAG.

## Un ejemplo que combina los tres

Imagina un agente de soporte técnico.

El usuario pregunta:

> Mi aplicación dejó de sincronizar después de la última actualización. ¿Puedes revisar qué ocurrió?

El agente podría:

1. Consultar mediante RAG la documentación del producto.
2. Usar MCP para conectarse al sistema de tickets.
3. Consultar logs mediante una herramienta.
4. Comparar la versión instalada.
5. Buscar incidentes recientes.
6. Proponer una solución.
7. Crear un ticket si necesita escalarse.

RAG aporta información.

MCP facilita conexiones.

El agente coordina las decisiones.

## ¿Qué nivel de autonomía debe tener un agente?

No todos los agentes deben tener libertad completa.

Podemos pensar en varios niveles.

### Nivel 1: solo recomienda

El agente analiza y propone acciones, pero no ejecuta nada.

Ejemplo:

> Encontré tres archivos que podrían estar causando el error. Recomiendo revisar primero `config.ts`.

Es el nivel más seguro.

### Nivel 2: ejecuta acciones de lectura

Puede consultar información, pero no modificarla.

Ejemplo:

- Leer archivos.
- Consultar métricas.
- Buscar tickets.
- Revisar documentos.

### Nivel 3: escribe con confirmación

Puede preparar cambios, pero requiere aprobación antes de aplicarlos.

Ejemplo:

> Preparé este correo. ¿Deseas enviarlo?

o:

> Estos son los cambios propuestos. ¿Confirmas que los aplique?

### Nivel 4: ejecuta dentro de límites definidos

Puede actuar sin aprobación en un espacio controlado.

Ejemplo:

- Modificar una rama temporal.
- Crear un borrador.
- Actualizar un entorno de prueba.
- Etiquetar documentos.

### Nivel 5: alta autonomía

Puede completar procesos largos con poca intervención.

Esto requiere:

- Permisos mínimos.
- Monitoreo.
- Auditoría.
- Límites.
- Reversión.
- Evaluaciones.
- Manejo de errores.
- Escalamiento humano.

En muchos productos, el nivel correcto no es el más autónomo.

Es el nivel más bajo que resuelve bien el problema.

## Human in the loop

**Human in the loop** significa que una persona participa en ciertos momentos del proceso.

Puede intervenir para:

- Aprobar una acción.
- Elegir entre alternativas.
- Revisar una salida.
- Resolver una ambigüedad.
- Proporcionar información.
- Confirmar una operación sensible.

Por ejemplo, un agente puede investigar candidatos y preparar un resumen, pero una persona toma la decisión final.

O puede redactar una respuesta a un cliente, pero no enviarla sin aprobación.

La intervención humana no significa que el agente haya fallado.

Puede ser una parte intencional del diseño.

## Cuándo conviene construir un agente

Un agente tiene sentido cuando:

- La tarea requiere varios pasos.
- No conocemos de antemano el camino exacto.
- El sistema debe reaccionar a resultados intermedios.
- Necesita utilizar varias herramientas.
- El trabajo cambia según el contexto.
- Es posible verificar el resultado.
- El costo de una decisión incorrecta es controlable.
- Existe una forma clara de detener o escalar la tarea.

Ejemplos:

- Investigar un tema usando varias fuentes.
- Analizar un repositorio y proponer cambios.
- Resolver incidencias técnicas.
- Clasificar y procesar documentos variados.
- Preparar reportes a partir de sistemas distintos.
- Automatizar soporte con acceso a herramientas.
- Coordinar tareas dentro de un entorno controlado.

## Cuándo no necesitas un agente

No todo problema necesita autonomía.

Probablemente no necesitas un agente cuando:

- Los pasos siempre son los mismos.
- Una función determinista resuelve el problema.
- Una consulta SQL devuelve el dato.
- Una automatización tradicional es suficiente.
- La tarea es sensible y difícil de verificar.
- El costo de un error es muy alto.
- No existe forma de limitar permisos.
- El agente no tiene señales claras para saber cuándo terminó.

Por ejemplo, calcular un impuesto mediante reglas conocidas no debería depender de que un agente “razone” libremente.

Tampoco conviene permitir que un agente elimine datos en producción solo porque interpretó una solicitud.

## Errores comunes al construir agentes

### Llamar agente a cualquier chatbot

Un chatbot que responde preguntas no necesariamente es un agente.

### Darle demasiadas herramientas

Más herramientas no siempre significan más capacidad.

También aumentan las posibilidades de elegir mal.

### Descripciones ambiguas

Si dos herramientas parecen hacer lo mismo, el modelo puede seleccionar la incorrecta.

### Permisos excesivos

Un agente de lectura no necesita credenciales para eliminar registros.

### No limitar el número de pasos

Puede entrar en ciclos, repetir acciones o consumir recursos innecesariamente.

### No validar resultados

El agente puede considerar exitosa una operación que realmente falló.

### Confiar únicamente en el prompt

Las restricciones importantes deben existir también en el código.

### No registrar acciones

Sin logs es difícil entender qué hizo, por qué lo hizo y dónde falló.

### Probar solo el caso ideal

Los agentes deben evaluarse con errores de herramientas, datos incompletos, permisos insuficientes y entradas ambiguas.

### Intentar demasiada autonomía desde el inicio

Conviene comenzar con una tarea limitada y ampliar capacidades después de medir resultados.

## Seguridad

Un agente tiene acceso a capacidades que pueden causar cambios reales.

Por eso la seguridad debe diseñarse desde el principio.

### Principio de mínimo privilegio

El agente solo debe tener los permisos necesarios.

### Separación de entornos

No debería comenzar trabajando directamente en producción.

### Confirmación para acciones sensibles

Eliminar, publicar, enviar, pagar o modificar datos importantes debería requerir aprobación.

### Validación de herramientas

La aplicación debe validar parámetros antes de ejecutar una acción.

### Protección de secretos

Las credenciales no deben incluirse en prompts, logs o respuestas.

### Defensa frente a prompt injection

Un agente que lee contenido externo puede encontrar instrucciones maliciosas dentro de documentos, páginas o correos.

No debe tratar automáticamente todo el contenido recuperado como una instrucción confiable.

### Trazabilidad

Debemos poder reconstruir:

- Qué objetivo recibió.
- Qué herramientas utilizó.
- Qué resultados obtuvo.
- Qué decisiones tomó.
- Qué cambios realizó.

## Cómo evaluar un agente

Evaluar un agente es más complejo que revisar una sola respuesta.

También debemos medir el proceso.

### Éxito de la tarea

¿Logró el objetivo?

### Calidad del resultado

¿La salida es correcta, útil y completa?

### Uso de herramientas

¿Eligió las herramientas adecuadas?

### Eficiencia

¿Cuántos pasos, tokens y llamadas necesitó?

### Seguridad

¿Respetó permisos y restricciones?

### Recuperación ante errores

¿Pudo adaptarse cuando una herramienta falló?

### Necesidad de intervención

¿Cuántas veces tuvo que pedir ayuda?

### Trazabilidad

¿Podemos explicar el proceso seguido?

Un agente no es mejor solo porque haga más cosas sin preguntar.

También importa que sea confiable.

## Cómo empezar a construir uno

Una forma práctica de comenzar es:

1. Elegir una tarea concreta.
2. Definir qué significa éxito.
3. Identificar las herramientas mínimas.
4. Empezar con acceso de solo lectura.
5. Limitar el número de pasos.
6. Agregar logs.
7. Construir casos de prueba reales.
8. Revisar los errores.
9. Añadir permisos gradualmente.
10. Mantener una forma de intervención humana.

Por ejemplo, en lugar de comenzar con:

> Crear un agente que administre toda la operación de una empresa.

Puedes comenzar con:

> Crear un agente que consulte tickets, documentación y logs para preparar un diagnóstico, sin modificar nada.

Ese alcance es más fácil de evaluar y controlar.

## Entonces, ¿qué es un agente de IA?

Podemos resumirlo así:

> Un agente de IA es un sistema que utiliza un modelo para decidir qué acciones realizar, ejecutarlas mediante herramientas, observar los resultados y continuar hasta alcanzar un objetivo o necesitar ayuda.

Sus componentes pueden incluir:

- Un modelo.
- Instrucciones.
- Herramientas.
- Memoria.
- Recuperación.
- Estado.
- Guardrails.
- Evaluación.
- Supervisión humana.

Los agentes pueden resolver tareas que no encajan bien en un flujo rígido.

Pero también son más difíciles de probar, controlar y mantener.

La pregunta no debería ser:

> ¿Cómo agrego un agente a mi producto?

La pregunta más útil es:

> ¿Este problema realmente necesita que un modelo decida los pasos?

Si la respuesta es sí, un agente puede ser una buena arquitectura.

Si la respuesta es no, una automatización o un workflow probablemente será más simple, barato y confiable.

## Para profundizar

- Anthropic, *Building Effective AI Agents*.
- Claude Platform Docs, *Tool use with Claude*.
- Claude Code Docs, *Agent SDK overview*.
