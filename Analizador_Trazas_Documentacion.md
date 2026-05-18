# Analizador de Trazas — Documentación de trabajo v2

Este documento recoge el estado actualizado del proyecto a **18 de mayo de 2026**, tras la sesión de trabajo del lunes. Refleja todo lo que ya hace el analizador (`Analizador_Trazas.html` v11), las decisiones funcionales tomadas y las reglas activas.

---

## Situación actual

El analizador ha pasado de ser un boceto de interfaz a una herramienta operativa real. La v11 ya diagnostica correctamente la mayoría de casos habituales del CAU, genera texto de ticket y correo listo para copiar.

La separación acordada sigue vigente:

- `Analizador_Trazas.html` → herramienta interactiva.
- `Analizador_Trazas_Documentacion.md` → documentación funcional y estado del proyecto.

---

## Filosofía mantenida

- Diagnosticar solo lo que esté bien acotado.
- No usar señales débiles como prueba concluyente.
- Si la evidencia no es suficiente, no forzar una clasificación incorrecta.
- Dejar el sistema preparado para crecer con más reglas reales.

---

## Interfaz actual

### Entradas

| Campo | Descripción |
|---|---|
| **Traza SistraHelp** | Área de texto grande para pegar la traza completa. |
| **Botón 📋 Pegar** | Pega directamente desde el portapapeles en el textarea. |
| **Botón ✕ Limpiar** | Limpia el textarea y resetea la salida. Ambos botones están junto al textarea. |
| **Tipo de firma** | Radio: Cl@ve / Certificado local / No informado. |
| **Sistema operativo** | Selector: Windows / Mac / iPad / iPhone / Android / No informado. |
| **Checks de contexto** | Traza en orden reciente→antiguo (marcado por defecto), El ciudadano ve error SAML, La página queda en blanco. |
| **Ayuda SAML** | Bloque desplegable `<details>` bajo el check SAML, con espacio para ejemplos de mensajes y su significado. |

### Salida (4 bloques)

1. **Diagnóstico** — conclusión técnica principal.
2. **Señales detectadas** — lista de eventos y literales que han activado la regla.
3. **Texto para ticket** — listo para pegar en CAU.
4. **Correo sugerido** — plantilla completa lista para copiar.

Adicionalmente, si se detecta `InvalidNotSignerCertificate`, se muestra un **aviso destacado** en amarillo independientemente del diagnóstico principal.

---

## Eventos SistraHelp reconocidos

| Evento | Significado |
|---|---|
| `TR_INI` | Inicio del trámite |
| `TR_FRI` | Inicio formulario — el ciudadano abre el formulario |
| `TR_FRF` | Fin formulario — pulsa "Continuar / Firmar" |
| `TR_CAR` | Carga del trámite desde Carpeta |
| `TR_SGI` | Inicio firma — se invoca al proveedor de firma |
| `TR_SGX` | Firma KO — el proveedor devuelve fallo |
| `TR_SGO` | Fin firma OK — firma correcta |
| `TR_REG` | Registro del trámite |
| `TR_FIN` | Fin trámite |

El analizador cuenta las apariciones de cada evento (`trsgiCount`, `trsgxCount`, `trsgoCount`, etc.) para aplicar las reglas. Las trazas suelen venir en **orden reciente → antiguo**.

---

## Reglas activas en la v11

Las reglas se evalúan en orden de prioridad. La primera que se cumple determina el diagnóstico.

---

### Regla 0 — Sin datos

**Condición:** El textarea está vacío.  
**Diagnóstico:** *"Beta sin datos — pega una traza o marca contexto para simular el caso."*  
No genera ticket ni correo.

---

### Regla 1 — Error funcional (no es problema de firma)

**Condición:**
- No hay `TR_SGI`, `TR_SGX` ni `TR_SGO`.
- Aparece `ErrorConfiguracionException` **o** alguna variante de "dades no vàlides / codi camp" (catalán y castellano).

**Diagnóstico:** `Error funcional — No es un problema de firma electrónica.`

**Señales detectadas:**
- Ausencia total de eventos de firma.
- Error de validación de datos en el formulario.
- Si el formulario llegó a `TR_FRF` o no.

**Ticket:** Orientar al equipo funcional del trámite. No es firma.  
**Correo:** Redirigir al ciudadano a Dudas funcionales en el formulario de incidencias, o al 012.

---

### Regla 2 — CLAVE_MOVIL no permitida

**Condición:**
- Aparece el literal `metode de autenticacio clavemovil no esta permes al tramit` o `MetodoAutenticacionException`.

**Diagnóstico:** `[Error Firma-Método] – CLAVE_MOVIL no permitida para el trámite.`

**Señales detectadas:**
- Literal explícito de método no permitido.
- Si hay `TR_SGI` y `TR_SGX`.
- Si además aparece código 101 de Cl@ve.

**Ticket:** Error de método, no caída general del proveedor.  
**Correo:** El ciudadano debe usar un método de firma permitido para el trámite.

---

### Regla 3 — Cl@ve Firma código 8 - tipo 15 (sin 103)

**Condición:**
- `TR_SGI` > 0 y `TR_SGX` > 0.
- Aparece `codi error 8` + `tipus resultat 15` (o variantes castellanas).
- No aparece código 103.

**Diagnóstico:** `[Error Firma-Proveedor] – Cl@ve Firma. Problema de credencial/certificado de firma de Cl@ve Permanente (Código 8 - Tipo 15).`

**Señales detectadas:**
- Inicio de firma y KO en firma.
- Código 8 / tipo 15.
- Si aparece el literal de plazo máximo de personación.

**Ticket:** Credencial o certificado de Cl@ve Permanente con problema. No es Portafib ni Autofirma.  
**Correo:** Explicar código 8-15, indicar que puede aparecer Cl@ve Móvil como alternativa (que no debe seleccionar), instruir revocar certificado desde Gestiones Cl@ve o acudir a oficina de registro.

---

### Regla 4 — Cl@ve Firma registro no fehaciente (código 104)

**Condición:**
- Aparece `codi error 104` o `registro no fehaciente` / `registre no fefaent`.

**Diagnóstico:** `[Error Firma-Proveedor] – Cl@ve Firma. Registro no fehaciente (Código 104).`

**Señales detectadas:**
- Inicio de firma y KO.
- Código 104 y/o literal de registro no fehaciente.

**Ticket:** Limitación del nivel de registro Cl@ve. No se puede resolver online.  
**Correo:** Acudir a oficina de registro Cl@ve con DNI original para completar el registro fehaciente.

---

### Regla 5 — Cl@ve Firma evolución 8→103 (certificados bloqueados tras intentos)

**Condición:**
- Aparece código 8 Y código 103 Y `certificados bloqueados` / `certificats bloquejats`.

**Diagnóstico:** `[Error Firma-Proveedor] – Cl@ve Firma. Evolución 8-15 a 103-15 — credencial bloqueada.`

**Señales detectadas:**
- Código 8-15 en intentos iniciales.
- Código 103-15 en intentos posteriores.

**Ticket:** Caso combinado de credencial que ha terminado bloqueada.  
**Correo:** Revocar certificado desde Gestiones Cl@ve. Si no es posible, acudir a oficina de registro.

---

### Regla 6 — Cl@ve Firma certificados bloqueados (código 103 puro)

**Condición:**
- Aparece `codi error 103` y `certificados bloqueados` / `certificats bloquejats`.
- No se da el caso combinado de la regla 5.

**Diagnóstico:** `[Error Firma-Proveedor] – Cl@ve Firma. Certificados bloqueados (Código 103).`

**Ticket:** Revocar certificado o regenerar desde Gestiones Cl@ve.  
**Correo:** Problema puntual de credencial del ciudadano.

---

### Regla 7 — Cl@ve Firma registro/credencial insuficiente (código 101)

**Condición:**
- Aparece `codi error 101`.
- `TR_SGI` > 0 y `TR_SGX` > 0.

**Diagnóstico:** `[Error Firma-Proveedor] – Cl@ve Firma. Registro o credencial insuficiente/inconsistente (Código 101).`

**Ticket:** No es caída general. Revisar estado del registro Cl@ve.  
**Correo:** Regularizar o renovar registro antes de reintentar.

---

### Regla 8 — Portafib/Soffid pre-proveedor

**Condición:**
- No hay `TR_SGI` (inicio de firma).
- Aparece `Fluxe no vàlid` **o** `Excepció sessió firma`.

**Diagnóstico:** `[Error Acceso-Sesión] – Portafib/Soffid pre-proveedor.`

**Señales detectadas:**
- Ausencia de TR_SGI.
- Literales de error de flujo.

**Ticket:** No consta inicio de firma. Errores de flujo previos al proveedor. Escalar SEG-012 (Aplicacions\31).  
**Correo:** Error de flujo previo al proveedor, compatible con Portafib/Soffid.

> **Nota importante:** El error `227` que ve el ciudadano es un error genérico, posiblemente transitorio (saturación, recarga de página). No se usa como evidencia de Portafib. El mensaje "Cargando el asistente" tampoco es diagnóstico fuerte.

---

### Regla 9 — Formulario / incidencia pre-firma

**Condición:**
- No hay `TR_SGI`.
- No aparecen los literales válidos de Portafib (Fluxe no vàlid / Excepció sessió firma).

**Diagnóstico:** `Fallo de formulario — incidencia previa al inicio de firma.`

**Señales detectadas:**
- Ausencia de TR_SGI.
- Sin errores de flujo concluyentes de Portafib.

**Ticket:** No consta inicio de firma ni errores de flujo de Portafib. Orientar a formulario o incidencia previa.

---

### Regla 10 — Mac + certificado local + múltiples TR_SGI sin cierre

**Condición:**
- `TR_SGI` ≥ 2, sin `TR_SGX` ni `TR_SGO`.
- Tipo de firma = certificado local.
- SO = Mac.

**Diagnóstico:** `[Error Firma-Método] – Revisión de entorno local Mac / certificado local / AutoFirma.`

**Ticket:** Múltiples inicios de firma sin cierre. Revisar AutoFirma, llavero del sistema y navegador compatible en Mac.

---

### Regla 11 — Autofirma / cliente local Windows

**Condición:**
- `TR_SGI` > 0 y `TR_SGX` > 0.
- Tipo de firma = certificado local.
- SO = Windows.
- Aparece alguno de: error de comunicación entre firma y página web, finalización inesperada del módulo, cancelaciones de firma.

**Diagnóstico:** `[Error Firma-Proveedor] – Autofirma / cliente de firma local en Windows.`

**Ticket:** Error de comunicación Autofirma / cliente local. Revisar instalación, navegador, antivirus/firewall.

---

### Regla 12 — Cl@ve Firma KO repetido con validación de certificado

**Condición:**
- `TR_SGI` > 0 y `TR_SGX` > 0.
- Aparecen mensajes de validación del certificado del firmante (`InvalidNotSignerCertificate`, `la firma no és vàlida`, `validació del certificat del firmant`) junto con referencias a Cl@ve Firma (código 8 / tipo 15).

**Diagnóstico:** `[Error Firma-Proveedor] – Cl@ve Firma. KO repetido en fase de firma compatible con problema de certificado, sin causa exacta confirmada.`

**Aviso adicional:** Si aparece `InvalidNotSignerCertificate`, se muestra un aviso destacado en amarillo recordando que este error lleva días apareciendo y que conviene revisar si hay incidencia activa antes de escalar.

---

### Regla 13 — En fase de firma, proveedor no clasificado

**Condición:**
- `TR_SGI` > 0 y `TR_SGX` > 0.
- No encaja en ninguna regla anterior.

**Diagnóstico:** `Caso en fase de firma detectado — pendiente de clasificar proveedor o método.`

---

### Regla 14 — Inicio de firma sin cierre registrado

**Condición:**
- `TR_SGI` > 0.
- Sin `TR_SGX` ni `TR_SGO`.
- No encaja en reglas anteriores.

**Diagnóstico:** `Fase de firma iniciada sin cierre registrado — revisar método o entorno local.`

---

### Regla 15 — Caso no clasificado

**Condición:** Ninguna regla anterior se ha activado.  
**Diagnóstico:** `Caso no clasificado aún en esta beta inicial.`

---

## Matices y decisiones funcionales consolidadas

### Error 227 y "Cargando el asistente"

El `227` es el error genérico que ve el ciudadano. Puede deberse a saturación puntual y resolverse recargando la página. **No se usa como evidencia de Portafib.** Lo mismo aplica al mensaje "Cargando el asistente".

### Literales válidos de Portafib (solo estos dos)

- `Fluxe no vàlid`
- `Excepció sessió firma`

No se amplía esta lista por ahora para evitar diagnósticos demasiado abiertos.

### VALIDe no puede verificar el certificado de Cl@ve Firma

El certificado de Cl@ve Firma es un certificado centralizado custodiado por la DGP en servidores HSM. La clave privada nunca sale del sistema. VALIDe solo puede validar certificados instalados localmente en el navegador. **Es una incompatibilidad estructural**, no un problema de versión o soporte. La validación del estado del certificado ocurre internamente en los sistemas Cl@ve/DGP durante el propio proceso de firma.

Fuentes oficiales:
- `clave.gob.es` — "certificados custodiados por la Administración, sin ningún equipamiento adicional"
- CTT PAe — "la firma se realiza en el servidor y no en el equipo del usuario"
- VALIDe FAQ — "sólo podrá validar los certificados personales instalados en su navegador"

### Orden de las trazas

Las trazas suelen venir en orden **más reciente → más antiguo**. La lógica tiene en cuenta patrones repetidos dentro del texto, no solo el primer o último evento.

---

## Estado del proyecto a 18/05/2026

| Elemento | Estado |
|---|---|
| Interfaz básica (textarea, checks, SO, tipo firma) | ✅ Operativo |
| Botones Pegar / Limpiar junto al textarea | ✅ Operativo desde v11 |
| Diagnóstico + señales + ticket + correo | ✅ Operativo |
| Aviso InvalidNotSignerCertificate | ✅ Operativo |
| Regla Portafib (Fluxe no vàlid / Excepció sessió firma) | ✅ Operativo |
| Regla formulario / pre-firma | ✅ Operativo |
| Regla error funcional (ErrorConfiguracionException / datos no válidos) | ✅ Operativo desde v11 |
| Regla CLAVE_MOVIL no permitida | ✅ Operativo |
| Regla Cl@ve código 8-15 | ✅ Operativo |
| Regla Cl@ve código 101 | ✅ Operativo |
| Regla Cl@ve código 103 | ✅ Operativo |
| Regla Cl@ve código 104 (registro no fehaciente) | ✅ Operativo |
| Regla combinada 8→103 (bloqueado) | ✅ Operativo |
| Regla Mac + certificado local | ✅ Operativo |
| Regla Autofirma Windows | ✅ Operativo |
| Ayuda SAML desplegable | 🔲 Estructura presente, contenido pendiente |
| Correos para todos los casos | ✅ Operativo (plantillas completas) |

---

## Próximos pasos sugeridos

- Completar el contenido de la ayuda SAML con ejemplos reales de mensajes vistos por el ciudadano.
- Revisar si hay casos de registro (TR_REG KO / TR_FIN ausente) que merezca una regla propia.
- Valorar añadir un indicador de nivel de confianza visible en la salida (alta / media / baja).
- Considerar separar las plantillas de correo en un fichero `docs/correos.md` para facilitar su mantenimiento independiente.
