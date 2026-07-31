---
title: "MCP desde cero: qué es, cómo funciona y para qué sirve en Claude"
description: "Una guía clara para entender qué es Model Context Protocol, cómo conecta Claude con herramientas y datos externos, y cuándo conviene utilizarlo."
excerpt: "MCP permite conectar Claude con archivos, APIs, bases de datos y otras herramientas. En esta guía explico desde cero cómo funciona y para qué puede servirte."
publishedAt: 2026-07-31
category: "tutoriales"
cover:
  src: "/img/blog/mcp-desde-cero-claude/cover.webp"
  alt: "Claude conectado mediante MCP con herramientas, archivos, APIs y bases de datos"
  caption: "MCP crea una forma estandarizada de conectar aplicaciones de IA con sistemas externos."
draft: true
tags:
  - "mcp"
  - "claude"
  - "claude-code"
  - "inteligencia-artificial"
  - "herramientas"
author: "Tonatiuj Sánchez"
featured: false
---

Si has utilizado Claude o Claude Code recientemente, probablemente ya encontraste las siglas **MCP** en alguna configuración, herramienta o documentación.

Al principio puede sonar como otra tecnología complicada dentro del ecosistema de inteligencia artificial. A mí también me pasó. Lees frases como “servidor MCP”, “cliente MCP” o “conectar una herramienta mediante MCP”, pero no siempre queda claro qué significa todo eso ni por qué debería importarte.

La idea central, en realidad, es bastante sencilla:

> MCP es una forma estandarizada de conectar una aplicación de inteligencia artificial con herramientas, datos y sistemas externos.

Gracias a MCP, Claude puede dejar de trabajar únicamente con el contexto que escribimos o pegamos en el chat y comenzar a consultar información o ejecutar acciones en otros sistemas, siempre dentro de los permisos que tenga disponibles.

En este artículo vamos a entenderlo desde cero, sin asumir que ya conoces protocolos, agentes o arquitecturas complejas.

## MCP, explicado sin vueltas

MCP significa **Model Context Protocol**, o Protocolo de Contexto para Modelos.

Es un estándar abierto que define una forma común para que aplicaciones como Claude se comuniquen con sistemas externos.

Esos sistemas pueden ser, por ejemplo:

- Archivos locales.
- Bases de datos.
- APIs.
- Repositorios de código.
- Sistemas de tickets.
- Herramientas de monitoreo.
- Servicios internos de una empresa.
- Aplicaciones como Jira, Slack o Google Drive.
- Herramientas creadas por nosotros mismos.

La documentación de MCP utiliza una comparación bastante útil: pensar en MCP como una especie de **USB-C para aplicaciones de inteligencia artificial**.

Antes de USB-C, cada dispositivo podía necesitar un conector diferente. Con un estándar común, distintos fabricantes pueden crear dispositivos compatibles sin diseñar una conexión completamente nueva para cada combinación.

MCP intenta resolver un problema parecido en inteligencia artificial.

En lugar de construir una integración diferente para conectar Claude con cada aplicación, MCP define una estructura común que pueden utilizar tanto Claude como los sistemas externos.

## ¿Qué problema resuelve?

Imagina que estás trabajando con Claude Code y necesitas revisar un ticket de un proyecto.

Sin una integración, probablemente harías algo como esto:

1. Abrir el sistema de tickets.
2. Buscar la tarea.
3. Copiar la descripción.
4. Pegarla en Claude.
5. Buscar información adicional.
6. Copiarla también.
7. Pedirle a Claude que analice todo.
8. Volver al sistema original para aplicar los cambios.

Funciona, pero implica cambiar constantemente entre herramientas y copiar contexto de un lugar a otro.

Con un servidor MCP correctamente configurado, Claude podría consultar directamente la información disponible en ese sistema.

Por ejemplo, podrías pedirle:

> Revisa el ticket PROJ-128, analiza el código relacionado y propón un plan de implementación.

Claude podría utilizar una herramienta expuesta por el servidor MCP para consultar el ticket, recuperar sus datos y utilizar esa información dentro de la tarea.

La diferencia importante es que ya no tendrías que copiar manualmente toda la información al chat.

## Cómo funciona MCP

Para entender MCP no necesitas memorizar toda su especificación. Basta con conocer cuatro partes:

1. La aplicación host.
2. El cliente MCP.
3. El servidor MCP.
4. El sistema externo.

El flujo general se puede visualizar así:

```text
Claude
  ↓
Cliente MCP
  ↓
Servidor MCP
  ↓
Archivos, APIs, bases de datos o herramientas
```

Veamos cada parte.

### 1. La aplicación host

El host es la aplicación donde estás utilizando el modelo.

En este caso podría ser:

- Claude Code.
- Claude Desktop.
- Una aplicación propia construida con la API de Claude.
- Otra herramienta compatible con MCP.

El host administra la conversación, presenta las capacidades disponibles y coordina la conexión con los servidores MCP.

### 2. El cliente MCP

El cliente es la parte que mantiene la comunicación con un servidor MCP.

Normalmente no necesitas interactuar directamente con él. La aplicación host se encarga de crear y administrar estos clientes.

Su función es enviar solicitudes al servidor y recibir sus respuestas utilizando el protocolo definido por MCP.

### 3. El servidor MCP

El servidor MCP es el componente que expone capacidades concretas.

Por ejemplo, un servidor podría ofrecer funciones para:

- Leer archivos.
- Consultar una base de datos.
- Buscar tickets.
- Obtener información de un repositorio.
- Ejecutar una consulta.
- Crear o actualizar un registro.
- Consumir una API interna.

El servidor funciona como una capa controlada entre Claude y el sistema externo.

Claude no necesita conocer todos los detalles internos del servicio. Solo necesita saber qué capacidades están disponibles, qué parámetros requieren y qué información devuelven.

### 4. El sistema externo

Finalmente está el sistema real con el que queremos trabajar.

Puede ser una base de datos PostgreSQL, una carpeta local, un repositorio, un servicio web o una plataforma empresarial.

El servidor MCP traduce las solicitudes realizadas desde Claude en operaciones que ese sistema pueda entender.

## ¿Qué puede ofrecer un servidor MCP?

Un servidor MCP puede exponer principalmente tres tipos de capacidades:

- Herramientas.
- Recursos.
- Prompts.

Cada una resuelve un tipo de necesidad diferente.

### Herramientas

Las herramientas son funciones que Claude puede ejecutar.

Por ejemplo:

```text
buscar_ticket
consultar_base_de_datos
crear_issue
leer_archivo
obtener_estado_del_servidor
```

Una herramienta define:

- Su nombre.
- Qué hace.
- Qué parámetros recibe.
- Qué resultado devuelve.

Claude puede elegir una herramienta cuando considera que la necesita para completar una tarea.

Por ejemplo:

> Consulta las órdenes pendientes de esta semana y genera un resumen.

Claude podría llamar a una herramienta que consulte la base de datos y después utilizar el resultado para redactar el resumen.

Dependiendo de la herramienta y sus permisos, algunas operaciones solo leen información y otras pueden modificarla.

### Recursos

Los recursos proporcionan información que puede utilizarse como contexto.

Pueden representar:

- El contenido de un archivo.
- La estructura de una base de datos.
- Documentación.
- Configuraciones.
- Información de una aplicación.
- Datos relacionados con un proyecto.

A diferencia de una herramienta, un recurso no representa necesariamente una acción. Su función principal es ofrecer información que Claude pueda consultar y utilizar.

### Prompts

Los prompts son plantillas de instrucciones o flujos preparados por el servidor.

Por ejemplo, un servidor podría ofrecer un prompt para:

- Revisar una incidencia.
- Analizar un documento.
- Preparar un reporte.
- Ejecutar un proceso habitual del equipo.

Esto permite convertir procedimientos repetitivos en flujos reutilizables.

## Un ejemplo práctico con Claude Code

Supongamos que trabajas en un proyecto de software y tienes información repartida entre:

- El repositorio.
- Un sistema de tickets.
- Documentación.
- Una base de datos.
- Un panel de monitoreo.

Sin MCP, debes abrir cada plataforma, recopilar la información y entregársela manualmente a Claude.

Con MCP, Claude Code podría tener acceso a servidores especializados:

```text
Servidor MCP de repositorio
Servidor MCP de tickets
Servidor MCP de documentación
Servidor MCP de base de datos
Servidor MCP de monitoreo
```

Entonces podrías pedir algo como:

> Revisa el error reportado en el ticket 246, busca el código relacionado, consulta los últimos registros y dime cuál podría ser la causa.

Claude podría:

1. Consultar el ticket.
2. Identificar archivos relacionados.
3. Leer el código.
4. Consultar registros.
5. Relacionar la información.
6. Proponer una explicación.
7. Preparar un plan de corrección.

MCP no hace que Claude conozca mágicamente todos los sistemas. Lo que hace es ofrecer una forma ordenada y estandarizada para conectarlos.

## Servidores locales y servidores remotos

Un servidor MCP puede ejecutarse localmente o estar disponible de forma remota.

### Servidor local

Un servidor local corre en tu propia computadora.

Claude Code puede comunicarse con él como un proceso del sistema. Este enfoque suele utilizarse para trabajar con:

- Archivos locales.
- Herramientas instaladas en el equipo.
- Scripts propios.
- Repositorios.
- Entornos de desarrollo.

Una forma común de comunicación local es mediante `stdio`, es decir, la entrada y salida estándar del proceso.

### Servidor remoto

Un servidor remoto se ejecuta fuera de tu computadora y se consulta mediante una conexión de red.

Puede utilizarse para:

- Servicios empresariales.
- APIs compartidas.
- Herramientas disponibles para varios usuarios.
- Plataformas alojadas en la nube.
- Integraciones administradas por terceros.

Para estos casos, MCP contempla conexiones mediante HTTP.

Los servidores remotos normalmente también necesitan mecanismos de autenticación y autorización para controlar quién puede utilizarlos y qué operaciones puede ejecutar.

## Lo que MCP no es

También es importante entender qué cosas no hace MCP.

### MCP no es un modelo de inteligencia artificial

MCP no reemplaza a Claude ni mejora por sí mismo el razonamiento del modelo.

Claude sigue siendo el modelo que interpreta la tarea y decide qué hacer. MCP únicamente le proporciona una forma de comunicarse con capacidades externas.

### MCP no es una base de datos

Puede conectar Claude con una base de datos, pero MCP no almacena automáticamente la información.

El almacenamiento sigue perteneciendo al sistema externo.

### MCP no es una API específica

Una API define cómo interactuar con un servicio concreto.

MCP es un protocolo general que puede utilizarse para presentar muchas APIs y herramientas mediante una estructura común.

Un servidor MCP incluso puede funcionar como una capa encima de una API que ya existe.

### MCP no concede acceso automático

Claude solo puede utilizar las capacidades que el servidor expone y que la configuración autoriza.

Si un servidor únicamente permite leer tickets, Claude no debería poder modificar uno.

Los permisos, credenciales y restricciones siguen siendo responsabilidad de la integración.

### MCP no elimina la necesidad de revisar lo que hace un agente

Aunque Claude pueda utilizar herramientas, sigue siendo importante revisar acciones sensibles, especialmente cuando pueden:

- Modificar archivos.
- Eliminar información.
- Ejecutar comandos.
- Actualizar bases de datos.
- Publicar contenido.
- Enviar mensajes.

MCP facilita la conexión. No reemplaza los controles de seguridad.

## ¿Para qué sirve MCP en Claude?

En la práctica, MCP puede servirte para cuatro cosas principales.

### Darle contexto actualizado

Claude puede consultar información en el momento en que la necesita, en lugar de depender únicamente de datos pegados previamente en la conversación.

### Reducir trabajo manual

Evita copiar y pegar información constantemente entre herramientas.

### Permitir acciones

Cuando un servidor expone herramientas de escritura, Claude puede realizar operaciones, no solo consultar datos.

### Reutilizar integraciones

Un servidor MCP puede funcionar con diferentes aplicaciones compatibles con el protocolo, sin tener que reconstruir toda la integración para cada una.

## ¿Cuándo vale la pena utilizar MCP?

MCP tiene sentido cuando:

- Copias constantemente información desde otra herramienta hacia Claude.
- Necesitas datos actualizados.
- Quieres conectar varias fuentes de información.
- Tienes procesos repetitivos.
- Estás construyendo un agente que necesita utilizar herramientas.
- Quieres exponer una API interna a Claude de una forma estructurada.
- Necesitas separar la lógica de integración de la conversación con el modelo.

También puede ser útil cuando una empresa quiere controlar exactamente qué herramientas puede utilizar un asistente y bajo qué condiciones.

## ¿Cuándo probablemente no lo necesitas?

No todo necesita un servidor MCP.

Puede ser innecesario cuando:

- Solo necesitas proporcionar un documento una vez.
- La tarea puede resolverse pegando un pequeño fragmento de información.
- No necesitas consultar datos actualizados.
- La integración será utilizada por una sola función muy sencilla.
- Una llamada directa a una API es suficiente.
- El costo de mantener el servidor supera el beneficio.

MCP es una herramienta de integración. No debería añadirse únicamente porque sea una tecnología popular.

## Seguridad: lo que debes revisar antes de conectar un servidor

Conectar un servidor MCP significa darle a Claude acceso a ciertas capacidades.

Por eso no conviene instalar cualquier servidor sin revisar:

- Quién lo desarrolló.
- Qué permisos solicita.
- Qué herramientas expone.
- Qué información puede consultar.
- Si puede modificar o eliminar datos.
- Cómo administra las credenciales.
- Si se ejecuta localmente o envía información a un servicio remoto.

Una práctica razonable es comenzar con herramientas de solo lectura.

Por ejemplo:

```text
leer_archivo
consultar_ticket
listar_registros
obtener_documentacion
```

Después, si realmente lo necesitas, puedes habilitar acciones que modifiquen información.

También es recomendable:

- No escribir secretos directamente en archivos de configuración públicos.
- Utilizar variables de entorno.
- Revisar las acciones antes de confirmarlas.
- Conectar únicamente servidores confiables.
- Mantener actualizadas las dependencias.
- Limitar el acceso al mínimo necesario.

MCP facilita que Claude interactúe con otros sistemas, pero esa capacidad también amplía la superficie de riesgo.

## Cómo empezar a utilizar MCP con Claude

Una forma sencilla de comenzar es seguir este proceso:

1. Identifica una tarea en la que estés copiando información repetidamente.
2. Busca un servidor MCP confiable para esa herramienta.
3. Revisa su documentación y sus permisos.
4. Conéctalo a Claude Code siguiendo las instrucciones del proveedor.
5. Comprueba su estado desde Claude Code.
6. Empieza con una operación sencilla y de solo lectura.
7. Revisa el resultado antes de habilitar acciones más sensibles.

Claude Code incluye herramientas para consultar el estado de las conexiones MCP. Si una integración no funciona, puedes revisar los servidores disponibles y detectar errores de conexión antes de utilizarla en una tarea importante.

## Entonces, ¿qué es MCP?

Podemos resumirlo así:

> MCP es un estándar que permite que Claude se conecte con herramientas y fuentes de datos externas mediante una interfaz común.

Claude sigue siendo quien interpreta, razona y decide cuándo necesita una capacidad.

El servidor MCP define qué información o acciones están disponibles.

El sistema externo continúa siendo responsable de sus datos, permisos y operaciones.

MCP simplemente crea el puente entre esas partes.

No convierte automáticamente a Claude en un agente completamente autónomo, pero sí resuelve una pieza fundamental: permitir que el modelo trabaje con información y herramientas que existen fuera de la conversación.

Y esa es la razón por la que MCP se ha vuelto tan relevante dentro del ecosistema de Claude y de los agentes de inteligencia artificial.
