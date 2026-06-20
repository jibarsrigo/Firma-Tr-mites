Trazas de prueba — Flujo de Firma (analizador CAU)
==================================================

Pegar el contenido (sin la línea # de comentario) en el analizador y pulsar Analizar.
Comprobar: cartel/Acción global NO cambian respecto a antes del Flujo de Firma; el detalle está en la tarjeta «Flujo del trámite» → Flujo de Firma.

Convención de nombres
---------------------
  C-   Cl@ve (códigos, móvil, permanente, reiente…)
  F-   Autofirma / certificado / móvil Android-iPhone
  T-   Sintéticas o plantillas UI
  P-   Portafib / pre_firma (reservado)

Al pegar trazas nuevas en el chat con Cursor: se comparan con este catálogo; si la
casuística no existe, se añade un .txt aquí y se actualiza este README.

Archivos
--------

F-saf27_sintetico.txt
  1 intento · TR_SGI → TR_SGX · SAF_27 · acceso certificado · Autofirm@
  Global: error_autofirma_servidor

T2-A_grupo_4_sin_cierre.txt
  4 intentos · sin cierre · CLAVE_PERMANENTE en cada CAR
  UI: #1–#4 (4×) expandible · mini SGI → ···
  Global con Cl@ve marcado: error_clave_movil
  Global con Certificado marcado: error_autofirma_entorno

T2-B_mixta_discrepancia.txt
  2 intentos · #1 Cancelada Autofirm@ · #2 SAF_27
  Badge acceso ≠ firma (Cl@ve permanente + Autofirm@)
  Global: error_autofirma_servidor (último KO)

T0-A_francisca_15_sgi_minimo.txt
  Plantilla 3× sin cierre · sustituir por traza real de 15 SGI si se dispone.

F-android_cliente_movil.txt
  Maria Jesús Martínez · certificado móvil / Autofirm@
  2 KO Cliente de Firma Móvil + servidor intermedio (java.lang) + varios sin cierre
  Marcar: Certificado local + Dispositivo móvil
  Global: error_autofirma_cliente_android
  Flujo de Firma: «Cliente firma móvil - Android» en KO Android

F-iphone_timeout.txt
  Maria Jose Lopez · iPhone · certificado / Autofirm@
  3 intentos: 2 sin cierre + 1 KO timeout/client de firma (catalán) + 1 sin cierre
  Marcar: Certificado local + Dispositivo móvil (o traza con IPHONE si consta)
  Global: error_autofirma_cliente_iphone
  Flujo de Firma: «Client de firma - iPhone» en KO (literal temps per a firmar…)

C-8-15_reiente_maria-soledad.txt
  Maria Soledad Gonzalez · trámite REIENTE · Cl@ve móvil (sin KO) → Cl@ve permanente 8-15
  8 intentos: #1–#7 (7×) Sin cierre + Revisar Acceso · #8 Cl@ve 8–15 + Cl@veFirm@
  Marcar: Cl@ve
  Global: error_clave_8_15
  CAR pegado sin literal CLAVE (Revisar Acceso en sin cierre; no en #8)

Notas
-----
- SistraHelp pega lo más reciente arriba; el motor ordena por timestamp.
- SAF_27 real: sustituir F-saf27_sintetico cuando se tenga traza CAU completa.
- Acceso sin literal en traza: chip «Revisar Acceso» (tooltip TR_CAR: acceso + SO/dispositivo). No se muestra en KO Cl@ve con código (8–15, 101, 103, 104…): basta «Método: Cl@veFirm@».
- Literales: aviso y resaltado rosa «*Cliente de Firma Móvil: Android» / «*Client de firma: iPhone» si aparecen en la traza.

Pendiente de fixture (mencionados en CAU, sin traza guardada aún)
------------------------------------------------------------------
  Cl@ve 101 · Cl@ve 104 · 103-15 tras 8-15 · Francisca 15× SGI · Benito 101/104 · Vanesa 8-15

