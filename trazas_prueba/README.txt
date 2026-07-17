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

C-linares_8-15_sgi_autofirma_completo.txt
  Marta Linares Oliver · EB0006OPOS · SGI sin cierre + QAA + 8-15 Cl@veFirm@ → SGO Autofirm@ → TR_REG+TR_FIN
  Global: tramite_completo (cierre manda; no error_clave_8_15)
  Acción (js v1.3.73): Qué pasa con Cl@ve 8-15 previos + Firma OK Autofirm@ + QAA + nota SGI sin cierre

C-rasero_8-15_portafib_autofirma_completo.txt
  Catalina Rasero Genovart · AJUDA_ESTUDIS · CLAVE_MOVIL no permès + 8-15/cancelada Cl@veFirm@ + Portafib 502 → SGO Autofirm@ → TR_REG+TR_FIN
  Global: tramite_completo
  Acción (js v1.3.74): Portafib + Cl@ve 8-15 + Autofirm@ OK + CLAVE_MOVIL + QAA; NO «Autofirma previos» (canceladas son Cl@veFirm@)

F-crespi_nif_es_tras_firma_ok.txt
  Juan Crespi Aguilo · IG_SUBVEN_EN_CERTEN · pago → Firma OK Autofirm@ → KO NIF ES («nif associado» + NIE X…)
  Global (js v1.3.76): error_certificado_nif_no_coincide (NO firma_correcta ni Autofirma cliente)
  Valida: literal ES/associado; KO tras SGO manda; extracción cert 78202240D / requerido X2007278E

P-formulario_403_externo.txt
  Mar López Navarro · EBAP · sin TR_FRI · 403 Forbidden formulario externo
  ERROR: 403 Forbidden (×2) + El fluxe no es vàlid (ignorado para la regla)
  Global: fallo_formulario por ausencia de Inicio formulario
  Acción (js v1.3.50): Qué pasa/Qué hacer + paso 403 en el mail

P-formulario_dominio_remoto_marc.txt
  Marc Ramirez Marquez · OPOS_SECTORES (IBSALUT) · DominioErrorException REMOTE.CONNECT (SC_FC_PES)
  Hay TR_FRI (formulario arranca pero falla el dominio) + QAA
  Global: fallo_formulario
  Acción (json v1.3.26): Qué pasa / Qué hacer — incidencias + literal legible

P-tabasco_502_proxy_fluxe.txt
  Carmen Tabasco Hidalgo · IG_SUBVEN_COTAUT · pre-firma (FRI/FRF, sin SGI)
  502 Proxy + SesionFirmaClienteConnectException (×N) + El fluxe no es vàlid
  Global: fallo_portafib
  Acción (json v1.3.32 / js v1.3.66): Qué pasa/Qué hacer; {lit} muestra fluxe + 502 Proxy

P-registro_presentador_distribuidora.txt
  Distribuidora Alimentaria Mallorquina SA · DGFPEAS_DEP_AJEDUAL
  Firma OK (Autofirm@) → TR_RGI → ERROR «El tràmit ha de ser registrat pel presentador (43059175R)»
  Sin TR_REG / TR_FIN
  Global: error_registro_presentador (no firma_correcta)
  Acción (json v1.3.33 / js v1.3.67): Qué pasa/Qué hacer → incidencias con literal

F-luengo_saf27_solo_ko.txt
  (Sustituye F-saf27_sintetico.txt) Fernando Luengo · IG_SUBVEN_TRANS_VEHIC · solo KO
  Qué pasó: selector AutoFirma con muchos certificados inválidos → SAF_27×N + cancelada;
    cerró navegador, eligió el certificado correcto → firmó (cierre en F-luengo_…_luego_ok)
  Global: error_autofirma_servidor (SAF_27)
  Cl@ve marcado: aviso «no es Cl@ve» (js ≥1.3.82). Acción: selector antes de reinstalar

F-luengo_saf27_cancelada_luego_ok.txt
  Misma llamada, traza completa: SAF_27 + cancelada → SGO Autofirm@ → REG+FIN
  Global: tramite_completo (+ Autofirma previos)

F-entorno_sgi_sin_cierre.txt
  Sintética · 3× TR_SGI sin KO/OK/FIN · TR_CAR con CERTIFICADO
  Global (js ≥1.3.80): error_autofirma_entorno por TR_CAR (no hace falta cambiar el selector)
  Acción: Qué pasa/Qué hacer FIRE; sin pistas Cl@ve móvil contradiciendo el CAR

T2-A_grupo_4_sin_cierre.txt
  4 intentos · sin cierre · CLAVE_PERMANENTE en cada CAR
  UI: #1–#4 (4×) expandible · mini SGI → ···
  Global con Cl@ve marcado: error_clave_movil
  Global con Certificado marcado: error_autofirma_entorno (mejor usar F-entorno_sgi_sin_cierre.txt)
  Cartel/frase: «Problema con el cliente de firma Autofirma (sin cierre)…»

T2-B_mixta_discrepancia.txt
  2 intentos · #1 Cancelada Autofirm@ · #2 SAF_27
  Badge acceso ≠ firma (Cl@ve permanente + Autofirm@)
  Global: error_autofirma_servidor (último KO)

T0-A_francisca_15_sgi_minimo.txt
  Plantilla 3× sin cierre · sustituir por traza real de 15 SGI si se dispone.

F-carreras_cancelada_autofirma.txt
  Francisco de Asis Carreras Costa · INS_ALE_PART · 4× Signatura cancel·lada Autofirm@
  Marcar: Certificado + Ordenador → windows · Certificado + móvil → movil · Cl@ve → generico
  Acción (json v1.3.29 / js v1.3.52): Qué pasa/Qué hacer en las tres variantes
  Nota: Método Autofirm@ en KO → rama cliente (no error_autofirma_cancelada)

F-victum_autofirma_luego_ok.txt
  Victum Sports SL · INS_ALE_PART · servidor intermedio + cancelada → SGO Autofirm@ → TR_REG+TR_FIN
  SistraHelp TR_INI: Mac — pero CAU: Mac puede ser iPhone/iPad vista escritorio (paralelo Linux→Android).
    No reasignar automático a iPhone (Mac real es habitual). Pegado sin literal Mac.
  Valida (js v1.3.60): tramite_completo + Autofirma previos + *SO SistraHelp (Linux≈Android / Mac≈posible iOS)
    aunque el método marcado sea Cl@ve u otro (el pegado no trae Mac)

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
  Valida (js v1.3.46): Flujo de Firma grupo Sin cierre + «Posible Cl@ve móvil o Autofirma Android» junto a Revisar Acceso;
    Acción 8-15 Qué pasa menciona también esos intentos sin cierre.
  8 intentos: #1–#7 (7×) Sin cierre + Revisar Acceso · #8 Cl@ve 8–15 + Cl@veFirm@
  Marcar: Cl@ve
  Global: error_clave_8_15
  CAR pegado sin literal CLAVE (Revisar Acceso en sin cierre; no en #8)

C-estrada_cancelada_clave_qaa.txt
  Joan Estrada Marin · IG_DGTMA_DRE_XAR · CAI-2638138
  Signatura cancel·lada + Cl@veFirm@ (sin 8-15) · SGI sin cierre ×2 · QAA posterior
  CAU: Permanente emitido/renovado mismo día + móvil → ventana emisión; probar ordenador
  Marcar: Cl@ve
  Global: error_clave_firma_cancelada
  Acción (json v1.3.34 / js v1.3.68): Qué pasa/Qué hacer + nota QAA + sin cierre

C-varela_validation_clave.txt
  Luis Giovanni Varela Benvenuto · IG_SUBVEN_EN_DESB25
  1 KO: VALIDATION InvalidNotSignerCertificate + Cl@veFirm@ (caso limpio)
  Marcar: Cl@ve
  Global: error_validacion_certificado
  Acción (json v1.3.35 / js v1.3.69): Qué pasa/Qué hacer; método Cl@ve inyectado en Qué pasa

C-8-15_luego_103-15_forteza.txt
  Maria Victoria Forteza Ferrer · IG_DGDEPEN_RECO · Cl@veFirm@ · 8-15 + 103-15 (mismo segundo)
  1 intento: 1× TR_SGI + 4× TR_SGX (2× 8-15 + 2× 103-15)
  Marcar: Cl@ve
  Global: error_clave_103_15 + Acción override mixto 8-15 → 103-15 (Qué pasa/Qué hacer)
  Flujo de Firma (js v1.3.48): «Cl@ve 103-15 (también 8-15 ×2)» — desglosa tipos distintos; si todos son iguales sigue «(+N KO)»

C-sastre_500_transaccion_ok_8-15_103-15.txt
  Bartomeu Sastre Vidal · IG_AJD_AUDM · Cl@veFirm@
  Cronología: fitxers 500 + transacción caducada → Firma OK → 8-15 → 103-15
  CAU: 500/caducada = servicio Cl@ve Firma (NO Portafib, NO @firma); manda 103-15
  Global (js v1.3.65): error_clave_103_15 (KO tras SGO; no firma_correcta) + override 8-15; Acción explica servicio previo

C-8-15_luego_autofirma_cancelada.txt
  Álvaro Pérez González · RESIDUS · Cl@ve 8–15 → cancelada Cl@ve → cancelada Autofirm@ (×2)
  Reintentos SGI posteriores sin KO (varios Sin cierre)
  Marcar: Certificado local (o Cl@ve: cartel Autofirma + nota Cl@ve anterior)
  Global: error_autofirma_cancelada (último KO Autofirm@; menciona Cl@ve 8–15 previo)
  Acción (json v1.3.24 / js v1.3.49): Qué pasa (Cl@ve previo + cancelada Autofirm@ + nota sin cierre) / Qué hacer (+ antivirus)
  Flujo de Firma: Cl@ve 8–15, cancelada Cl@ve, cancelada Autofirm@, Sin cierre

F-lelek_timeout_cancelada_sin_cierre.txt
  Kamila Lelek · IG_SUBVEN_COTAUT · timeout/cliente de firma + cancelada ×N + SGI sin cierre
  Sin «Método de firma» al pegar; SesionFirmaClienteException
  Valida (js v1.3.63): pista iPhone/Android unificada; sin cierre no contradice con «solo Android»

F-palou_fitxer_buit.txt
  Miguel Palou Bosch · INSTANCIA_GENERICA_SR · solo fitxer buit (PluginAutofirmaBatch vacío) ×6
  Marcar: Certificado + Ordenador → error_autofirma_cliente_windows
  Acción (json v1.3.31): instalación limpia Autofirma + nota wiki; Qué pasa matiz fitxer buit (js v1.3.62)
  CAU: suele ser instalación corrupta/incompleta (no solo «reinstalar encima»)

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
  Global (js v1.3.72): error_clave_8_15 (CLAVE_MOVIL acceso ya no tapa el Firma KO) + nota en Qué pasa
  Valida: (1) el 500 precede al 8-15; (2) acceso CLAVE_MOVIL no permès no secuestra el veredicto

C-perez_8-15_luego_clave_movil_no_permitida.txt
  Alejandro Jose Perez Santiago · INS_ALE_PART · 8-15 → SGI sin cierre → ERROR CLAVE_MOVIL no permès
  Marcar: Cl@ve
  Global (js v1.3.72): error_clave_8_15; Qué pasa menciona Cl@ve Móvil posterior (carpeta ciudadana)
  Contraste limpio: C-clave_movil_no_permitida.txt (sin SGX → sí manda móvil no permitida)

C-clave_movil_no_permitida.txt
  Mercedes (recorte) · IG_SOL_CERTIF_PROF · solo literal CLAVE_MOVIL no permès + TR_SGI (sin SGX/SGO/FIN)
  Marcar: Cl@ve
  Global: error_clave_movil_no_permitida
  Acción (json v1.3.39): Qué pasa/Qué hacer
  Para probar Acción limpia; no usar Mercedes/Javier/Pérez completas (mixtas)

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
  Global esperado: error_firma_fitxers_500 · cartel "Servicio de firma"
  Acción (json v1.3.25): Qué pasa / Qué hacer (reintentar; escalar si persiste o es masivo)

F-artigues_cadena_certificacion.txt
  Juan Jose Artigues Mesquida (18233778E) · 00-SOLGEN (INDUSTRIA) · certificado local (Autofirm@) · Windows
  Traza completa: ~11 TR_SGX en 1h30 (09:40-11:04), MUCHOS "InvalidCertificateChain"
    + 1 KO distinto (10:48): "nif associat és 43219044C, però es requeria el nif 18233778E" (firma con cert de OTRA persona)
  Marcar: Certificado local + Ordenador
  Global esperado (app.js v1.3.32): error_cadena_certificacion  (NO error_certificado_nif_no_coincide)
    El NIF (10:48) es un intento PUNTUAL; el ULTIMO KO (12:06) y la mayoria son de cadena -> gana cadena.
    La accion de cadena muestra ademas un AVISO: "en uno de los intentos se firmo con un certificado de otro NIF (43219044C)".
  Valida: la regla del NIF NO manda por el mero hecho de aparecer; solo si es el ULTIMO KO o si no hay cadena/validacion.
  Lectura CAU: ACCV valido en VALIDe (+ firma prueba) y AutoFirma local OK, falla en varios equipos => servicio @firma/FIRE -> Portafib.

T-nif_no_coincide.txt
  Sintetica (datos ficticios) · NIF no coincidente como UNICO/ULTIMO Firma KO
  Marcar: Certificado local + Ordenador
  Global esperado (app.js v1.3.32): error_certificado_nif_no_coincide · cartel "Certificado de otro NIF" · extrae cert=43219044C / requerido=18233778E
  Valida: que el NIF SI manda cuando es el ultimo KO (o no hay cadena/validacion). Complementa a F-artigues (donde el NIF es puntual y gana cadena).

F-accv_cadena_servicio_validacion.txt
  Caso documentado por telefono (anonimizado) · certificado ACCV · Autofirm@ · Windows
  1x TR_SGX representativo "InvalidCertificateChain" (identificadores sinteticos; no hubo traza SistraHelp real)
  Marcar: Certificado local + Ordenador
  Global esperado: error_cadena_certificacion · cartel "Certificado (cadena)"
  ESCENARIO CLAVE: certificado BIEN (VALIDe + local OK + varios equipos) → SERVICIO @firma
  Confirmado CAI-2646080 (ejemplo): ACCV fallaba en el servicio de validación; tras pruebas → escalar Portafib; workaround Cl@ve.

Notas
-----
- SistraHelp pega lo más reciente arriba; el motor ordena por timestamp.
- SAF_27: F-luengo_saf27_solo_ko.txt (KO) y F-luengo_saf27_cancelada_luego_ok.txt (cierre). Sin sintético.
- Acceso sin literal en traza: chip «Revisar Acceso» (tooltip TR_CAR: acceso + SO/dispositivo). No se muestra en KO Cl@ve con código (8–15, 101, 103, 104…): basta «Método: Cl@veFirm@».
- Acción Autofirma cliente: intro según KO — servidor intermedio → «Habitualmente desde Android…»; timeout/client de firma → «Habitualmente desde iPhone…»; + TR_CAR + pasos SO.
- Cartel Autofirma cliente: frase «Problema con el cliente de firma Autofirma (tipo de fallo)» — sin inferir Android/iPhone; tipo = el más frecuente entre Firma KO cronológicos (v1.3.25); si hay varios tipos, recuento en la frase.
- Literales: aviso y resaltado rosa neutros (*Cliente Autofirma / servidor intermedio* o *Timeout firma / cliente Autofirma*); confirmar SO en TR_CAR.

Pendiente de fixture (mencionados en CAU, sin traza guardada aún)
------------------------------------------------------------------
  Cl@ve 101 · Cl@ve 104 · Francisca 15× SGI · Benito 101/104 · Vanesa 8-15
  (103-15 tras 8-15: Forteza + Sastre)

Implementado (app.js v1.3.28 / acciones.json v1.3.4)
----------------------------------------------------
  Regla error_firma_fitxers_500: KO "Error general durant el proces de firma dels fitxers: 500" (o "servei de custodia ... error")
    SIN VALIDATION ni codigo Cl@ve en el desempate. Error puntual del servicio/proveedor de firma (no ciudadano, no Portafib) -> reintentar.
  Prioridad: tras VALIDATION (error_validacion_certificado) y codigos Cl@ve (8-15/101/103/104 mandan si aparecen),
    antes del catch-all error_clave_movil. Cartel azul "Servicio de firma".
  Casos ya correctos sin regla nueva:
    - 500 + VALIDATION -> error_validacion_certificado (dice: problema de servicio, reintentar mas tarde).
    - 500 antes de 8-15 (8-15 es el KO que manda) -> error_clave_8_15.
    - 500 con cierre posterior (TR_RGI/TR_REG/TR_FIN, sin KO tras el último SGO) -> tramite_completo.
    - 500 + SGO sin TR_RGI -> firma_correcta (fase de firma abierta; no dar por cerrado).
    - 500 + SGO + KO posterior (multi-firma) -> manda el último KO (no firma_correcta).
  Trazas relacionadas: C-consuelo_500_custodia_recupera.txt, C-javier_500_validation_completo.txt (ambas -> tramite_completo),
    C-mercedes_500_luego_8-15.txt (acaba en 8-15), C-sastre_… / F-crespi_… (KO tras SGO).

Pendiente (gap detectado, sin implementar)
------------------------------------------
  Prioridad CLAVE_MOVIL no permès (Mercedes / Pérez · js v1.3.72): si hay Firma KO (TR_SGX), manda el KO
    (p. ej. 8-15); el ERROR de acceso CLAVE_MOVIL se anota en Qué pasa y no secuestra el veredicto.
    Sin SGX → sí error_clave_movil_no_permitida (fixture C-clave_movil_no_permitida.txt).
  Objetivo: que el ultimo KO de firma mande sobre errores de acceso previos.

  SO en SistraHelp engañoso (documentado, sin auto-remap agresivo):
    Linux → siempre Android (js ≥1.3.81; ya no existe regla cliente_linux).
    Mac → puede ser Mac real o iPhone/iPad vista escritorio; solo aviso en Acción (Victum), no remap a iPhone.

  Enlace wiki «instalación limpia Autofirma»: ahora nota en Acción Windows; sustituir por URL del artículo cuando exista.

  Revisar Acción error_autofirma_cancelada (Álvaro / C-8-15_luego_autofirma_cancelada.txt):
    asegurar que en «Qué pasa» quede explícito que la firma cancelada con Autofirm@ también puede deberse
    a antivirus / firewall / proxy (hoy la nota NOTA_SEGURIDAD_EQUIPO se añade al final; valorar si basta
    o hay que mencionarlo también en Qué pasa junto a timeout/SSL/comunicación).

