---
title: "RAG desde cero: qué es, cómo funciona y para qué sirve"
description: "Una explicación clara de Retrieval-Augmented Generation: cómo permite que un modelo consulte información externa antes de responder y qué necesitas para construir un sistema RAG."
excerpt: "RAG conecta un modelo de lenguaje con documentos, bases de conocimiento y datos propios. En esta guía explico desde cero cómo funciona, qué problema resuelve y cuándo realmente vale la pena utilizarlo."
publishedAt: 2026-06-12
category: "tutoriales"
cover:
  src: "/img/blog/rag-desde-cero-como-funciona/cover.webp"
  alt: "Flujo de un sistema RAG que busca información en documentos antes de responder"
  caption: "Un sistema RAG recupera información relevante y la entrega al modelo como contexto antes de generar una respuesta."
draft: true
tags:
  - "rag"
  - "llm"
  - "inteligencia-artificial"
  - "embeddings"
  - "bases-de-datos-vectoriales"
author: "Tonatiuj Sánchez"
featured: false
---

Cuando alguien comienza a trabajar con modelos de lenguaje, es fácil pensar que el modelo ya conoce toda la información que necesitamos.

Le hacemos una pregunta, responde con seguridad y la conversación se siente natural. El problema aparece cuando necesitamos que responda con datos internos de una empresa, documentos recientes, políticas específicas o información que cambió después de su entrenamiento.

Ahí es donde suele aparecer el término **RAG**.

RAG significa **Retrieval-Augmented Generation**, que normalmente se traduce como **generación aumentada por recuperación**.

El nombre suena técnico, pero la idea principal es sencilla:

> Antes de pedirle al modelo que responda, buscamos información relevante en una fuente externa y se la entregamos como contexto.

Así, el modelo no depende únicamente de lo que aprendió durante su entrenamiento. También puede utilizar documentos, bases de conocimiento o datos propios que recuperamos en el momento de la consulta.

En este artículo vamos a entender qué es RAG, cómo funciona, qué componentes necesita y qué problemas debes cuidar al construir uno.

## El problema que intenta resolver RAG

Un modelo de lenguaje tiene conocimiento almacenado en sus parámetros, pero ese conocimiento tiene límites.

Puede ocurrir que:

- No conozca información privada de una empresa.
- No tenga acceso a documentos internos.
- Sus datos estén desactualizados.
- No recuerde un detalle con suficiente precisión.
- Responda algo plausible, pero incorrecto.
- No pueda indicar de dónde obtuvo una afirmación.

Imagina que una empresa quiere crear un asistente para responder preguntas sobre sus procesos internos.

La información se encuentra en:

- Manuales.
- Contratos.
- Políticas.
- Preguntas frecuentes.
- Documentación técnica.
- Archivos PDF.
- Procedimientos operativos.
- Bases de conocimiento.

El modelo no conoce automáticamente esos documentos.

Una opción sería volver a entrenarlo con toda esa información, pero eso puede ser costoso, difícil de mantener y poco práctico cada vez que cambia un archivo.

RAG propone otra estrategia:

1. Guardar y organizar los documentos.
2. Buscar los fragmentos relacionados con la pregunta.
3. Entregárselos al modelo.
4. Pedirle que responda usando ese contexto.

El conocimiento externo se puede actualizar sin volver a entrenar el modelo completo.

## Una explicación sencilla

Piensa en un examen con dos tipos de estudiante.

El primero responde únicamente con lo que recuerda.

El segundo puede consultar un conjunto de apuntes antes de responder.

El modelo de lenguaje sería el estudiante.

La base de conocimiento serían los apuntes.

El sistema de recuperación sería el proceso de buscar las páginas más relevantes.

RAG no convierte automáticamente al estudiante en experto. Lo que hace es darle acceso a información útil en el momento correcto.

Si los apuntes son malos, están desactualizados o se recupera la página equivocada, la respuesta también puede ser mala.

Por eso un sistema RAG no es solo “conectar un PDF a una IA”. La calidad depende de todo el proceso.

## El flujo general de un sistema RAG

Un flujo básico puede verse así:

```text
Pregunta del usuario
        ↓
Búsqueda de información relevante
        ↓
Fragmentos recuperados
        ↓
Pregunta + contexto
        ↓
Modelo de lenguaje
        ↓
Respuesta
```

Pero antes de poder buscar, necesitamos preparar los documentos.

Por eso normalmente un sistema RAG tiene dos grandes etapas:

1. Ingesta e indexación.
2. Consulta y generación.

Veamos cada una.

## Etapa 1: ingesta e indexación

La ingesta es el proceso mediante el cual incorporamos información a la base de conocimiento.

Puede comenzar con archivos como:

- PDF.
- DOCX.
- Markdown.
- HTML.
- Texto plano.
- Hojas de cálculo.
- Datos obtenidos desde una API.
- Registros de una base de datos.

### Extraer el contenido

Primero necesitamos obtener el texto.

En un PDF digital esto puede ser sencillo. En un documento escaneado quizá necesitemos OCR para reconocer los caracteres de la imagen.

También debemos decidir qué hacer con:

- Tablas.
- Encabezados.
- Pies de página.
- Imágenes.
- Listas.
- Metadatos.
- Secciones repetidas.

Extraer texto no significa necesariamente comprender bien la estructura del documento.

Un PDF puede verse ordenado para una persona y convertirse en texto desorganizado al procesarlo.

### Dividir los documentos

Los modelos y los sistemas de búsqueda no suelen trabajar con un documento completo de cientos de páginas.

Normalmente dividimos el contenido en partes más pequeñas llamadas **chunks** o fragmentos.

Por ejemplo, un manual puede dividirse por:

- Párrafos.
- Secciones.
- Títulos.
- Cantidad de caracteres.
- Cantidad de tokens.
- Estructura semántica.

Un fragmento podría contener algo como:

```text
Las solicitudes de reembolso deben enviarse dentro de los 30 días posteriores a la compra. El comprobante de pago es obligatorio.
```

El tamaño de los fragmentos importa.

Si son demasiado pequeños, pueden perder contexto.

Si son demasiado grandes, pueden contener mucha información irrelevante y dificultar la recuperación.

No existe un tamaño perfecto para todos los proyectos. Depende del tipo de documento, las preguntas esperadas y la forma en que se utilizará la información.

### Crear embeddings

Después, cada fragmento puede convertirse en una representación numérica llamada **embedding**.

Un embedding es un vector que intenta representar el significado del texto.

Dos fragmentos con significados parecidos deberían quedar relativamente cerca dentro de ese espacio vectorial, aunque no utilicen exactamente las mismas palabras.

Por ejemplo:

```text
¿Cómo solicito un reembolso?
```

podría estar cerca de:

```text
Proceso para devolver una compra y recuperar el pago.
```

La coincidencia no depende únicamente de encontrar la palabra “reembolso”. También intenta capturar la relación semántica entre ambos textos.

### Guardar los fragmentos

Los embeddings y sus textos se guardan en un índice o una base preparada para buscarlos.

Puede ser:

- Una base de datos vectorial.
- Un motor de búsqueda.
- Un índice local.
- Una combinación de búsqueda semántica y búsqueda por palabras.

Cada fragmento también debería conservar metadatos, por ejemplo:

```text
documento: politica-reembolsos.pdf
seccion: Solicitudes
pagina: 12
fecha: 2026-04-10
cliente: empresa-a
```

Los metadatos son importantes para filtrar resultados, aplicar permisos y mostrar fuentes.

## Etapa 2: consulta y generación

Cuando el usuario hace una pregunta, comienza la segunda etapa.

### Convertir la pregunta

La pregunta también puede convertirse en un embedding utilizando el mismo modelo empleado durante la indexación.

Después se compara con los fragmentos almacenados.

### Recuperar resultados

El sistema selecciona los fragmentos que parecen más relacionados con la consulta.

Por ejemplo:

```text
Pregunta:
¿Cuánto tiempo tengo para solicitar un reembolso?

Fragmento recuperado:
Las solicitudes de reembolso deben enviarse dentro de los 30 días posteriores a la compra.
```

Normalmente no se recupera un solo fragmento. Se obtienen varios candidatos.

El parámetro que indica cuántos resultados recuperar suele llamarse `top-k`.

Por ejemplo:

```text
top-k = 5
```

significa que el sistema devolverá cinco fragmentos candidatos.

Recuperar más contenido no siempre mejora la respuesta. También puede introducir ruido.

### Reordenar los resultados

En sistemas más completos, los resultados pueden pasar por un **reranker**.

El recuperador inicial busca rápidamente candidatos.

El reranker vuelve a evaluar esos candidatos con mayor precisión y los ordena según su relevancia real para la pregunta.

El flujo sería:

```text
100 fragmentos encontrados
        ↓
10 candidatos recuperados
        ↓
Reranker
        ↓
4 fragmentos finales
```

Esta etapa puede mejorar bastante la calidad cuando los documentos son grandes o las consultas son ambiguas.

### Construir el prompt

Después se crea un prompt que contiene:

- La pregunta original.
- Los fragmentos recuperados.
- Instrucciones sobre cómo utilizar el contexto.
- Reglas para responder cuando la información no aparece.
- Formato de salida.
- Solicitud de citas, cuando corresponda.

Un ejemplo simplificado:

```text
Responde únicamente con base en el contexto proporcionado.

Si la información no aparece en el contexto, indícalo claramente.

Contexto:
[Fragmento 1]
[Fragmento 2]
[Fragmento 3]

Pregunta:
¿Cuánto tiempo tengo para solicitar un reembolso?
```

### Generar la respuesta

Finalmente, el modelo utiliza la pregunta y el contexto para generar una respuesta.

Podría responder:

> Puedes solicitar el reembolso dentro de los 30 días posteriores a la compra. También necesitas presentar el comprobante de pago.

Si el sistema conserva la fuente, también puede indicar:

```text
Fuente: Política de reembolsos, página 12.
```

## Los componentes principales de un RAG

Un sistema RAG puede tener muchas piezas, pero las principales son estas:

### Fuentes de datos

Son los documentos o sistemas que contienen el conocimiento.

### Pipeline de ingesta

Extrae, limpia, divide y prepara la información.

### Modelo de embeddings

Convierte textos en vectores.

### Índice de recuperación

Permite buscar fragmentos relevantes.

### Recuperador

Selecciona candidatos para una consulta.

### Reranker

Reordena resultados para mejorar precisión. Es opcional, pero suele ser útil.

### Modelo de lenguaje

Genera la respuesta final.

### Prompt

Define cómo debe utilizarse el contexto.

### Sistema de evaluación

Mide si la información recuperada y la respuesta son correctas.

## ¿RAG necesita una base de datos vectorial?

No siempre.

Las bases de datos vectoriales son comunes porque permiten buscar similitud semántica de forma eficiente, pero RAG no significa automáticamente “usar vectores”.

También se puede recuperar información mediante:

- Búsqueda por palabras.
- BM25.
- Filtros de metadatos.
- SQL.
- Grafos.
- APIs.
- Búsqueda híbrida.
- Reglas específicas del dominio.

La búsqueda semántica es útil cuando el usuario y el documento expresan una idea con palabras diferentes.

La búsqueda tradicional puede ser mejor para:

- Nombres exactos.
- Códigos.
- Identificadores.
- Fechas.
- Términos técnicos.
- Frases literales.

Por eso muchos sistemas combinan ambas.

## Búsqueda semántica, búsqueda por palabras y búsqueda híbrida

### Búsqueda por palabras

Busca coincidencias entre los términos de la consulta y los documentos.

Es buena para encontrar algo exacto:

```text
PROJ-128
Artículo 47
modelo Qwen3-8B
```

### Búsqueda semántica

Busca cercanía de significado.

Es útil cuando la consulta dice:

```text
¿Cómo recupero mi dinero?
```

y el documento utiliza:

```text
Procedimiento para solicitar un reembolso.
```

### Búsqueda híbrida

Combina ambos enfoques.

En muchos proyectos reales, la búsqueda híbrida funciona mejor que depender de una sola estrategia.

Después, un reranker puede ordenar los resultados combinados.

## RAG no es lo mismo que fine-tuning

Esta confusión es muy común.

### Fine-tuning

El fine-tuning modifica el comportamiento del modelo mediante entrenamiento adicional.

Puede utilizarse para:

- Enseñar un estilo.
- Ajustar formatos.
- Mejorar una tarea específica.
- Modificar patrones de respuesta.

### RAG

RAG entrega información externa durante la consulta.

Puede utilizarse para:

- Consultar documentos actuales.
- Integrar conocimiento privado.
- Mostrar fuentes.
- Actualizar contenido sin reentrenar.

Una forma sencilla de verlo:

```text
Fine-tuning cambia cómo responde el modelo.
RAG cambia qué información tiene disponible al responder.
```

Pueden utilizarse juntos, pero resuelven problemas distintos.

## RAG tampoco elimina las alucinaciones

Un sistema RAG puede reducir respuestas inventadas, pero no garantiza que desaparezcan.

El modelo todavía puede:

- Interpretar mal el contexto.
- Mezclar información.
- Ignorar una instrucción.
- Exagerar una conclusión.
- Responder aunque no tenga evidencia suficiente.

Además, el problema puede ocurrir antes de llegar al modelo.

Tal vez el sistema recuperó fragmentos incorrectos.

En ese caso, el modelo está respondiendo con un contexto defectuoso.

Por eso es útil separar dos preguntas:

1. ¿Recuperamos la información correcta?
2. ¿El modelo respondió correctamente usando esa información?

Ambas partes deben evaluarse.

## Errores comunes al construir un RAG

### Pensar que subir documentos es suficiente

Un RAG necesita decisiones sobre extracción, fragmentación, búsqueda, permisos y evaluación.

### Utilizar fragmentos sin contexto

Un fragmento puede decir:

```text
El límite es de 30 días.
```

Pero quizá no indique si se refiere a devoluciones, garantías o cancelaciones.

### Recuperar demasiados resultados

Más contexto puede significar más ruido, mayor costo y peor respuesta.

### No conservar metadatos

Sin metadatos es difícil filtrar, aplicar permisos o mostrar fuentes.

### No controlar accesos

Un sistema con documentos de varios clientes debe impedir que una consulta recupere información de otra organización.

### Confiar solo en una demostración

Que cinco preguntas funcionen no significa que el sistema sea confiable.

### No evaluar la recuperación

A veces se culpa al modelo cuando el verdadero problema está en el buscador.

### No definir qué hacer cuando falta información

El asistente debería poder responder:

> No encontré esa información en los documentos disponibles.

Eso es mejor que inventar una respuesta.

## Un ejemplo empresarial

Imagina una empresa con manuales de recursos humanos.

Una persona pregunta:

> ¿Cuántos días de vacaciones me corresponden después del primer año?

El sistema podría:

1. Identificar que la consulta pertenece a políticas laborales.
2. Filtrar documentos del país y empresa correctos.
3. Recuperar la sección de vacaciones.
4. Reordenar los fragmentos.
5. Entregar el contexto al modelo.
6. Generar una respuesta.
7. Mostrar la fuente.

El resultado puede ser útil, pero todavía deben considerarse:

- Vigencia del documento.
- Legislación aplicable.
- Rol del usuario.
- Permisos.
- Excepciones.
- Necesidad de revisión humana.

RAG facilita el acceso a la información. No reemplaza el criterio profesional en decisiones sensibles.

## ¿Cuándo vale la pena utilizar RAG?

RAG tiene sentido cuando:

- Necesitas consultar documentos privados.
- La información cambia con frecuencia.
- Quieres mostrar fuentes.
- Tienes una base de conocimiento extensa.
- El modelo no conoce el dominio.
- Necesitas separar información por cliente o usuario.
- Quieres actualizar contenido sin volver a entrenar.
- Las respuestas dependen de datos recientes.

## ¿Cuándo probablemente no lo necesitas?

Puede ser innecesario cuando:

- La información cabe directamente en el prompt.
- Solo existe un documento pequeño.
- La tarea no requiere conocimiento externo.
- Una consulta SQL directa resuelve mejor el problema.
- La respuesta debe calcularse con reglas deterministas.
- Una API ya devuelve exactamente el dato necesario.

RAG no debe utilizarse para reemplazar una solución más simple.

## Cómo evaluar un sistema RAG

Un RAG no debería evaluarse solo por lo bien que “suena” la respuesta.

Conviene medir al menos:

### Calidad de recuperación

- ¿Apareció el fragmento correcto?
- ¿Quedó dentro de los primeros resultados?
- ¿Se recuperaron fuentes irrelevantes?
- ¿Se respetaron filtros y permisos?

### Calidad de respuesta

- ¿La respuesta está respaldada por el contexto?
- ¿Incluye datos inventados?
- ¿Responde realmente la pregunta?
- ¿Reconoce cuando falta información?
- ¿Las citas corresponden con la afirmación?

### Operación

- Latencia.
- Costo.
- Errores.
- Disponibilidad.
- Actualización de documentos.
- Trazabilidad.

La evaluación debería utilizar preguntas reales y respuestas esperadas, no solo ejemplos creados para la demostración.

## Una arquitectura un poco más completa

Un sistema real puede verse así:

```text
Documentos
   ↓
Extracción y limpieza
   ↓
Fragmentación
   ↓
Embeddings
   ↓
Índice vectorial + índice por palabras

Pregunta del usuario
   ↓
Reescritura o clasificación
   ↓
Búsqueda híbrida
   ↓
Filtros de permisos
   ↓
Reranking
   ↓
Selección de contexto
   ↓
Modelo de lenguaje
   ↓
Validación y citas
   ↓
Respuesta
```

No todos los proyectos necesitan cada etapa.

La arquitectura debe crecer según los problemas que realmente aparezcan.

## RAG y Claude

Claude puede utilizarse como modelo generador dentro de un sistema RAG.

El flujo sería:

1. Tu aplicación recupera los fragmentos.
2. Construye el contexto.
3. Envía el contexto y la pregunta a Claude.
4. Claude genera la respuesta.

También puedes utilizar Claude en partes adicionales del pipeline, por ejemplo:

- Clasificar consultas.
- Reescribir preguntas.
- Extraer metadatos.
- Evaluar respuestas.
- Generar contexto adicional para fragmentos.
- Ayudar en el reranking.

Anthropic ha propuesto técnicas como **Contextual Retrieval**, donde se añade contexto específico a cada fragmento antes de generar sus representaciones y combinarlo con búsqueda por palabras y reranking.

La idea vuelve al mismo punto: recuperar bien es tan importante como generar bien.

## Entonces, ¿qué es RAG?

Podemos resumirlo así:

> RAG es una arquitectura que busca información externa relevante y se la entrega a un modelo de lenguaje antes de generar una respuesta.

Sus beneficios principales son:

- Utilizar información privada o reciente.
- Actualizar conocimiento sin reentrenar.
- Mostrar fuentes.
- Reducir trabajo manual.
- Construir asistentes especializados.

Pero un RAG confiable necesita más que embeddings y una base vectorial.

Necesita buenos documentos, una estrategia de fragmentación, recuperación precisa, filtros, permisos, evaluación y reglas claras para cuando la información no existe.

La generación es solo la última parte.

En muchos proyectos, el verdadero trabajo está en lograr que el contexto correcto llegue al modelo en el momento correcto.

## Para profundizar

- Lewis et al. (2020), *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks*.
- Anthropic (2024), *Contextual Retrieval*.
