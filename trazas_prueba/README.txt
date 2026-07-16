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

P-formulario_403_externo.txt
  Mar López Navarro · EBAP · sin TR_FRI · 403 Forbidden formulario externo
  ERROR: 403 Forbidden (×2) + El fluxe no es vàlid (ignorado para la regla)
  Global: fallo_formulario por ausencia de Inicio formulario
  Acción/mail: texto extra si aparece 403 Forbidden

F-saf27_sintetico.txt
  1 intento · TR_SGI → TR_SGX · SAF_27 · acceso certificado · Autofirm@
  Global: error_autofirma_servidor

T2-A_grupo_4_sin_cierre.txt
  4 intentos · sin cierre · CLAVE_PERMANENTE en cada CAR
  UI: #1–#4 (4×) expandible · mini SGI → ···
  Global con Cl@ve marcado: error_clave_movil
  Global con Certificado marcado: error_autofirma_entorno
  Cartel/frase: «Problema con el cliente de firma Autofirma (sin cierre)…»

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
  Global: error_autofirma_cliente_movil (o android/iphone si consta SO en TR_CAR)
  Flujo de Firma: «Servidor intermedio» en KO
  Literales: aviso «*Cliente Autofirma / servidor intermedio…» (sin Android en aviso)
  Cartel/frase: «Problema con el cliente de firma Autofirma (servidor intermedio)…»

F-iphone_timeout.txt
  Maria Jose Lopez · iPhone · certificado / Autofirm@
  3 intentos: 2 sin cierre + 1 KO timeout/client de firma (catalán) + 1 sin cierre
  Marcar: Certificado local + Dispositivo móvil (o traza con IPHONE/IOS en TR_CAR)
  Global: error_autofirma_cliente_movil (o iphone si consta SO en TR_CAR)
  Flujo de Firma: «Timeout firma» en KO (literal temps per a firmar…)
  Literales: aviso «*Timeout firma / cliente Autofirma…» (sin iPhone en aviso)
  Cartel/frase: «Problema con el cliente de firma Autofirma (timeout)…»

C-8-15_reiente_maria-soledad.txt
  Maria Soledad Gonzalez · trámite REIENTE · Cl@ve móvil (sin KO) → Cl@ve permanente 8-15
  8 intentos: #1–#7 (7×) Sin cierre + Revisar Acceso · #8 Cl@ve 8–15 + Cl@veFirm@
  Marcar: Cl@ve
  Global: error_clave_8_15
  CAR pegado sin literal CLAVE (Revisar Acceso en sin cierre; no en #8)

C-8-15_luego_autofirma_cancelada.txt
  Álvaro Pérez González · RESIDUS · Cl@ve 8–15 → cancelada Cl@ve → cancelada Autofirm@ (×2)
  Reintentos SGI posteriores sin KO
  Marcar: Certificado local (o Cl@ve: cartel Autofirma + nota Cl@ve anterior)
  Global: error_autofirma_cancelada (último KO Autofirm@; menciona Cl@ve 8–15 previo)
  Flujo de Firma: Cl@ve 8–15, cancelada Cl@ve, cancelada Autofirm@

F-marianela_fitxer_buit_windows.txt
  Marianela Ramirez · CAI 2641203 · Windows · sin TR_CAR antes del 1.er KO
  1× servidor intermedio + 5× fitxer buit + 2× cancelada (Autofirm@)
  Marcar: Certificado local + Ordenador
  Global: error_autofirma_cliente_windows
  Cartel v1.3.25: tipo predominante fitxer buit + recuento multi-KO (no el primer KO pegado)

C-consuelo_500_custodia_recupera.txt
  Consuelo Esmeralda Martin Navarro · EB0006OPOS (EBAP) · Cl@ve Permanente (Cl@veFirm@)
  2× TR_SGX "Error general durant el proces de firma dels fitxers: 500" (Cl@veFirm@, sin codigo Cl@ve)
    + errores Portafib sesion (SesionFirmaClienteException / El fluxe no es valid) + QAA; reintento tarde OK
  Marcar: Cl@ve
  Global (HOY): tramite_completo (TR_REG + TR_FIN) + nota "error de portafib previo"
  Valida: el 500 / servei de custodia es TRANSITORIO (mismo ciudadano firma horas despues)
  Relacion: variante que RECUPERA del 500 (contraparte de C-mercedes_500_luego_8-15.txt)

C-mercedes_500_luego_8-15.txt
  Mercedes Suero Garcia · IG_SOL_CERTIF_PROF (IGOIB) · CAI-2643553 · Cl@ve Permanente (Cl@veFirm@)
  03/07: 2× TR_SGX "500" + 1× KO solo metodo · 06/07: 4× ERROR CLAVE_MOVIL no permès (acceso) · 07/07: TR_SGX 8-15
  Ultimo KO cronologico: 8-15 (Codigo Error 8 / Tipo Resultado 15)
  Marcar: Cl@ve
  Global (HOY): error_clave_movil_no_permitida  <-- DESACERTADA (los ERROR CLAVE_MOVIL de acceso tapan el ultimo KO)
  Objetivo: que mande el ultimo KO de firma -> error_clave_8_15
  Valida: (1) el 500 precede al 8-15 dias despues; (2) acceso CLAVE_MOVIL no permès no debe secuestrar el veredicto
    del ultimo TR_SGX; (3) error_clave_proveedor_500 solo si el ULTIMO KO es el 500

C-javier_500_validation_completo.txt
  Javier Saenz de Tejada · IG_DGDEPEN_RECO (IGOIB) · Cl@ve Permanente (Cl@veFirm@)
  13-19/05: decenas de TR_SGX (Proveedor clavefirma): VALIDATION (InvalidNotSignerCertificate) mayoritario,
    500 (x2), 8-15, 101, 103-15, 1x cancelada · 19/05 TR_SGO (firma OK) · 21/05 CLAVE_MOVIL no permès · 23/05 TR_RGI+TR_REG+TR_FIN
  Marcar: Cl@ve
  Global (HOY): tramite_completo (TR_SGO + TR_REG + TR_FIN) — CORRECTO (acabo bien)
  Valida: (1) el 500 aparece JUNTO a VALIDATION y a 8-15/101/103-15, todos "Proveedor: clavefirma" + Cl@veFirm@
    -> misma familia proveedor Cl@ve Firma; (2) todos transitorios (recupera); (3) con cierre, tramite_completo prima sobre el ruido de KO

T-500_puro.txt
  Sintetica (datos ficticios) · 1x TR_SGX "500" (Cl@veFirm@) sin VALIDATION ni codigo Cl@ve ni cierre
  Marcar: Cl@ve
  Global esperado: error_firma_fitxers_500 · cartel "Servicio de firma" · accion reintentar
  Valida en pantalla la regla nueva (app.js v1.3.28)

F-artigues_cadena_certificacion.txt
  Juan Jose Artigues Mesquida · 00-SOLGEN (INDUSTRIA) · certificado local (Autofirm@) · Windows
  1x TR_SGX "La cadena de certificación del certificado firmante no es válida" (InvalidCertificateChain) · Autofirm@
  Marcar: Certificado local + Ordenador
  Global (HOY): error_autofirma_cliente_windows  <-- DESACERTADO (reinstalar Autofirma no arregla cadena de cert. invalida)
  Objetivo: familia validacion certificado (hermana de InvalidNotSignerCertificate); helper no detecta InvalidCertificateChain
  Pendiente de decidir: extender error_validacion_certificado o nueva regla error_cadena_certificacion

Notas
-----
- SistraHelp pega lo más reciente arriba; el motor ordena por timestamp.
- SAF_27 real: sustituir F-saf27_sintetico cuando se tenga traza CAU completa.
- Acceso sin literal en traza: chip «Revisar Acceso» (tooltip TR_CAR: acceso + SO/dispositivo). No se muestra en KO Cl@ve con código (8–15, 101, 103, 104…): basta «Método: Cl@veFirm@».
- Acción Autofirma cliente: intro según KO — servidor intermedio → «Habitualmente desde Android…»; timeout/client de firma → «Habitualmente desde iPhone…»; + TR_CAR + pasos SO.
- Cartel Autofirma cliente: frase «Problema con el cliente de firma Autofirma (tipo de fallo)» — sin inferir Android/iPhone; tipo = el más frecuente entre Firma KO cronológicos (v1.3.25); si hay varios tipos, recuento en la frase.
- Literales: aviso y resaltado rosa neutros (*Cliente Autofirma / servidor intermedio* o *Timeout firma / cliente Autofirma*); confirmar SO en TR_CAR.

Pendiente de fixture (mencionados en CAU, sin traza guardada aún)
------------------------------------------------------------------
  Cl@ve 101 · Cl@ve 104 · 103-15 tras 8-15 · Francisca 15× SGI · Benito 101/104 · Vanesa 8-15

Implementado (app.js v1.3.28 / acciones.json v1.3.4)
----------------------------------------------------
  Regla error_firma_fitxers_500: KO "Error general durant el proces de firma dels fitxers: 500" (o "servei de custodia ... error")
    SIN VALIDATION ni codigo Cl@ve en el desempate. Error puntual del servicio/proveedor de firma (no ciudadano, no Portafib) -> reintentar.
  Prioridad: tras VALIDATION (error_validacion_certificado) y codigos Cl@ve (8-15/101/103/104 mandan si aparecen),
    antes del catch-all error_clave_movil. Cartel azul "Servicio de firma".
  Casos ya correctos sin regla nueva:
    - 500 + VALIDATION -> error_validacion_certificado (dice: problema de servicio, reintentar mas tarde).
    - 500 antes de 8-15 (8-15 es el KO que manda) -> error_clave_8_15.
    - 500 con cierre posterior (TR_REG/TR_FIN o TR_SGO) -> tramite_completo / firma_correcta.
  Trazas relacionadas: C-consuelo_500_custodia_recupera.txt, C-javier_500_validation_completo.txt (ambas -> tramite_completo),
    C-mercedes_500_luego_8-15.txt (acaba en 8-15).

Pendiente (gap detectado, sin implementar)
------------------------------------------
  Prioridad CLAVE_MOVIL no permès (Mercedes / CAI-2643553): un ERROR de acceso "CLAVE_MOVIL no permès" (de otro dia)
    secuestra el veredicto y tapa el ultimo TR_SGX de firma (hoy -> error_clave_movil_no_permitida en vez del ultimo KO real, p. ej. 8-15).
  Objetivo: que el ultimo KO de firma mande sobre errores de acceso previos.

