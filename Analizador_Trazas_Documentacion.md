# Analizador de Trazas — Documentación de trabajo v1

Este documento recoge el estado actual del proyecto del analizador de trazas, el alcance de la primera versión y las decisiones funcionales acordadas hasta el momento. Su objetivo es dejar una base clara para continuar el trabajo más adelante dentro del repositorio `Firma-Tr-mites`.

## Situación actual

La idea no es construir desde el principio un analizador “completo” o demasiado ambicioso, sino una primera versión básica, prudente y útil.

La v1 debe centrarse solo en los casos que están bien acotados y que se pueden diagnosticar con reglas claras, evitando diagnósticos falsamente precisos.

También se ha acordado separar:

- La **documentación** del proyecto, en un archivo Markdown como este.
- La **herramienta** propiamente dicha, en `Analizador_Trazas.html`.

Esto permitirá mantener mejor el proyecto:

- El archivo `.md` servirá como fuente de verdad funcional.
- El archivo `.html` será el analizador interactivo real.

## Objetivo del analizador

El analizador debe servir para pegar una traza o indicar un contexto de error y obtener una salida útil para trabajo de CAU.

La salida deseada no debe limitarse a “detectar un fallo”, sino ofrecer tres niveles de utilidad:

1. **Diagnóstico técnico**.
2. **Texto corto para pegar en el ticket**.
3. **Correo sugerido** listo para copiar.

A futuro, el analizador podrá crecer, pero la primera versión debe ser conservadora y centrarse solo en reglas seguras.

## Filosofía de la v1

La v1 no debe intentar “adivinar” demasiado.

Principios acordados:

- Diagnosticar solo lo que esté bien acotado.
- No usar señales débiles como si fueran prueba concluyente.
- Si la evidencia no es suficiente, no forzar una clasificación incorrecta.
- Diferenciar claramente entre problema técnico confirmado y simple indicio.
- Dejar preparado el sistema para crecer con más reglas reales más adelante.

## Casos que se quieren cubrir en la v1

La v1 debe cubrir inicialmente estos grupos de casos:

- Fallo pasarela / SAML.
- Fallo Portafib / sesión.
- Fallo formulario / pre-firma.

Más adelante se prevé ampliar el analizador con otros ámbitos, como por ejemplo:

- Revisiones de entorno local de Autofirma.
- Errores conocidos de Cl@ve.
- Certificado local / FIRE.
- Registro.

## Reglas acordadas hasta ahora

## 1. Fallo pasarela / SAML

### Idea general

Cuando el ciudadano indica que la página queda en blanco o ve un error SAML, el problema puede estar en la pasarela de acceso o autenticación.

En estos casos puede no existir traza útil en SistraHelp.

### Consecuencia funcional

El analizador no debe depender solo de la traza para este caso.

Debe existir un campo adicional de contexto, porque muchas veces el error SAML no queda reflejado en la traza útil de SistraHelp.

### Regla funcional deseada

- Si el ciudadano indica error SAML o página en blanco antes de entrar en el flujo normal,
- y no hay una traza útil que apunte a firma,
- el caso debe orientarse a **pasarela / SAML**.

### Requisito de interfaz

Se quiere un check específico del tipo:

- `El ciudadano ve error SAML`

Y ese check podrá mostrar una ayuda desplegable con:

- ejemplos de textos que puede ver el ciudadano,
- posibles detalles del error SAML,
- explicación breve de qué significa,
- indicación de que normalmente no habrá traza útil en SistraHelp.

## 2. Portafib / sesión

### Regla cerrada acordada

Portafib se considera bien acotado cuando se cumple lo siguiente:

- **No aparece inicio firma**.
- Sí aparecen errores de flujo concretos.

### Literales que sí se deben usar

Por ahora solo se tomarán como errores válidos de flujo para esta regla:

- `Fluxe no vàlid`
- `Excepció sessió firma`

### Diagnóstico esperado

Si no aparece `TR_SGI` y sí aparece alguno de esos literales, el analizador debe concluir algo equivalente a:

- `[Error Acceso-Sesión] – Portafib/Soffid pre-proveedor`

## 3. Formulario / pre-firma

### Regla funcional

Si no aparece `TR_SGI` y tampoco aparecen los errores de flujo válidos de Portafib, el caso no debe atribuirse automáticamente al proveedor de firma.

En esa situación, la clasificación deseada es:

- fallo de formulario,
- o incidencia previa al inicio de firma.

### Importante

En estos casos no se debe señalar de forma automática a:

- Cl@ve,
- Autofirma,
- FIRE,
- ni Portafib.

El analizador debe ser prudente y asumir que el fallo está antes del inicio real de firma.

## Reglas y matices importantes

### Orden de las trazas

Se ha señalado expresamente que las trazas suelen venir en orden:

- **más reciente → más antiguo**

Esto es importante porque la lógica futura no debe asumir cronología ascendente.

### Tratamiento del error 227

Se ha acordado que el `227` **no** debe usarse como evidencia fuerte de Portafib.

Motivo:

- es un error genérico,
- lo puede ver el ciudadano,
- puede estar relacionado con saturación puntual,
- puede resolverse simplemente recargando la página.

Por tanto, el 227 no debe disparar por sí solo un diagnóstico de Portafib.

### Mensajes tipo “Cargando el asistente”

También se ha comentado que el error que ve el ciudadano relacionado con “Cargando el asistente” puede ser transitorio y resolverse recargando.

Por eso tampoco debe tratarse como prueba diagnóstica fuerte.

### Literales descartados por ahora

Se ha acordado no ampliar todavía la lista de errores de flujo más allá de los dos literales considerados sólidos para la v1.

Esto se hace para evitar ruido y diagnósticos demasiado abiertos.

## Cómo se quiere que funcione el analizador

El analizador debe estar pensado como una página HTML sencilla, usable desde GitHub Pages, sin necesidad de backend.

La idea es que `Analizador_Trazas.html` sea la herramienta real.

### Entradas previstas

El analizador deberá tener un formulario simple con estos campos:

- Área de texto grande para pegar la traza.
- Opción para indicar si se usa:
  - certificado local,
  - Cl@ve,
  - o no informado.
- Selección de sistema operativo:
  - Windows,
  - Mac,
  - iPad,
  - iPhone,
  - Android,
  - no informado.
- Checks adicionales de contexto, por ejemplo:
  - `El ciudadano ve error SAML`
  - `La página queda en blanco`
  - `Traza en orden reciente → antiguo`

### Salidas previstas

La herramienta deberá devolver como mínimo:

- eventos o señales detectadas,
- regla aplicada,
- diagnóstico,
- nivel de confianza,
- texto corto para ticket,
- correo sugerido.

## Estructura deseada de la salida

La idea acordada es que la salida tenga tres bloques de utilidad:

### 1. Diagnóstico

Debe decir qué patrón ha detectado y cuál es la conclusión técnica propuesta.

### 2. Texto corto para ticket

Debe generar un texto breve, listo para pegar en un ticket o CAU, sin tener que redactarlo manualmente cada vez.

### 3. Correo sugerido

Debe ofrecer un correo listo para copiar.

Ya existen correos definidos en la wiki, por lo que lo ideal es que el analizador termine asociando cada diagnóstico a una plantilla concreta.

## Nivel de confianza

Se considera muy buena idea que la salida indique un nivel de confianza, por ejemplo:

- alta,
- media,
- baja.

Esto permitiría diferenciar:

- diagnósticos muy cerrados,
- casos probables,
- casos no concluyentes.

## Enfoque técnico recomendado

No se quiere un sistema “mágico” que improvise, sino un motor de reglas simples y mantenibles.

La lógica ideal sería:

1. Normalizar el texto pegado.
2. Buscar eventos y literales relevantes.
3. Aplicar reglas por prioridad.
4. Devolver un diagnóstico solo si las condiciones están claras.
5. Asociar el resultado a un texto de ticket y a una plantilla de correo.

## Organización recomendada del repositorio

Se considera recomendable separar documentación y herramienta:

- `Analizador_Trazas.html` → herramienta interactiva.
- `Analizador_Trazas_Documentacion.md` → documentación funcional y estado del proyecto.

Más adelante se podrían añadir otros ficheros, como por ejemplo:

- `docs/reglas.md`
- `docs/correos.md`

Pero por ahora este archivo puede servir como documento base principal.

## Próximo paso recomendado

Antes de desarrollar la herramienta completa, conviene cerrar una tabla de reglas v1 con estos campos:

- nombre de la regla,
- condiciones exactas,
- diagnóstico resultante,
- texto corto para ticket,
- plantilla de correo asociada,
- nivel de confianza.

Después de eso, el siguiente paso natural será convertir `Analizador_Trazas.html` en el analizador real.

## Resumen operativo

Estado actual del proyecto:

- Ya se ha definido la orientación general.
- Ya se ha decidido separar documentación y herramienta.
- Ya están claras las primeras reglas base de la v1.
- Ya está acordado que la salida debe incluir diagnóstico, ticket y correo.
- Ya está decidido que el enfoque debe ser prudente, basado en reglas y no excesivamente ambicioso en la primera fase.

Este documento queda como base para retomar el trabajo más adelante y seguir construyendo el analizador dentro del repositorio.
