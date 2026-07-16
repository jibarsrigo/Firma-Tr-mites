/* =====================================================
           FUNCIONALIDADES IMPLEMENTADAS
   =====================================================

VERSION 1.0     - Se valida que la traza y el método de firma sean correctos antes de analizar 
                - Se muestran paneles informativos para errores de acceso (SAML y página en blanco) 
                - Se normaliza la traza a mayúsculas para evitar problemas en la detección 
                - Se detectan los eventos TR_ principales dentro de la traza 
                - Se genera un diagnóstico técnico dinámico en función de los TR_ detectados 
                - Se genera diagnóstico + acción basada en flujo TR_ 

VERSION 1.1     - Se muestra lectura html, json y js en panel superior (editable desde código)

VERSION 1.1.1   - Se añade DETECCIÓN DE REGLAS (PATRONES) con la primera regla para el Formulario

VERSION 1.1.2   - MOTOR BASE DE ANÁLISIS TR_ → detección → ID regla → control → salida personalizada

VERSION 1.2.0   - Introducción de contexto de flujo estructurado (objeto contexto)
                    - Modelización de estados: pre_firma / error_firma / firma_ok
                    - Simplificación del árbol de decisión basado en fase del flujo
                    - Mejora de robustez ante trazas incompletas o con orden irregular

VERSION 1.2.1   - Detección avanzada de errores técnicos: FLUXE, SESSION, EXCEPTION, SAF_
                    - Detección específica de Autofirma (SAF_27)
                    - Detección básica de Cl@ve por patrón "CODI ERROR"
                    - Separación proveedor firma: Cl@ve / Autofirma / FIRE                

VERSION 1.2.2   - Mejora del análisis en pre_firma: fallo formulario vs Portafib
                - Lógica de reintentos (contadores TR_FRI / TR_FRF)
                    - Detección de errores reales de sesión (Portafib/Soffid)
                - Primer separación conceptual CAU: error ciudadano vs error plataforma

VERSION 1.2.3   - Limpieza avanzada de literales de error (cabeceras, excepciones, ruido técnico)
                    - Extracción del literal funcional real del formulario
                - Patrones de corte contextual (DOMINI, LES, EL, LA, ES)

VERSION 1.2.4   - Separación definitiva Portafib vs formulario; prioridad absoluta del error de sesión
                - Detección de errores funcionales SIN prefijo "ERROR" (Debe ser…, Campo obligatorio…)
                - Motor alineado con diagnóstico real CAU: flujo + proveedor + literal interpretado

VERSION 1.2.5   - Presentación estilo V5: tarjetas Flujo / Acción / Literales detectados
                - Flujo visual con píldoras de colores (TR_FRI, TR_SGI, TR_SGX, TR_SGO, TR_FIN…)
                - Cartel azul de veredicto + frase explicativa integrados en la tarjeta de flujo

VERSION 1.2.6   - Errores Cl@ve con presentación completa: cartel + frase + acción + mail
                - Reglas activas: códigos 8–15, 101, 103, 103-15 y 104
                - Literal técnico reconstruido (CODI ERROR, PROVEÏDOR CLAVEFIRMA, TIPUS RESULTAT)

VERSION 1.2.7   - Literales agrupados con contador (xN) por clave normalizada
                - Caso especial dinámico: 103-15 precedido de 8–15 en la misma traza
                - Preservación del formato original al mostrar literales (escape HTML)

VERSION 1.2.8   - Caso firma_correcta_portafib (trámite OK con error Portafib previo en traza)
                - Acción Portafib dinámica con marcador {lit} editable en acciones.json
                - Portafib real vs falso positivo (SesionFirmaClienteException ya no dispara Portafib)

VERSION 1.2.9   - Enlace «Reportar análisis incorrecto» al final de cada análisis
                - PWA: manifest, iconos y favicon; atajos Ctrl+V / Ctrl+Enter
                - Cl@ve marcado por defecto al iniciar y al pulsar Limpiar

VERSION 1.3.0   - Prioridad TR_FIN / TR_SGO sobre TR_SGX previo (cómo acabó el trámite manda)
                - Detección Cl@ve FASE 10 PRO: orden real, CODI ERROR + TIPUS RESULTAT
                - Validación método + sistema antes de analizar; acciones desde acciones.json

VERSION 1.3.1   - Autofirma ampliado: error_autofirma_servidor, cancelada, entorno y cliente por SO
                - Árbol de decisión en fase error_firma con prioridades Autofirma → Cl@ve → FIRE
                - Reglas error_autofirma_cliente: Windows, Mac, Linux, Android, iPhone, móvil genérico

VERSION 1.3.2   - Cl@ve móvil: error_clave_movil (solo TR_SGI) y error_clave_movil_no_permitida
                - Detección acceso CLAVE_MOVIL en TR_INI / TR_CAR
                - Desempate por método marcado (acceso Cl@ve vs certificado local)

VERSION 1.3.3   - Literales de firma en TR_SGX / TR_SGO: cancelada, timeout, Cl@ve, Cliente de Firma
                - Extracción mensaje funcional desde campo 10+ (tabuladores SistraHelp)
                - Helpers extraerMensajeEventoTraza y claveLiteralParaAgrupacion

VERSION 1.3.4   - resolverReglaAutofirmaCliente(): SO del técnico + pistas en traza
                - error_autofirma_cliente_generico si Cl@ve marcado pero traza apunta a Autofirma
                - Acciones y mails específicos por SO desde acciones.json

VERSION 1.3.5   - Autofirma explícito fuerte vs débil (timeout sin «cliente de firma» solo con certificado)
                - Discrepancia acceso Cl@ve + firma Autofirm@ (Método de firma o literales fuertes)
                - fitxer signat buit / plugin AutoFirma; cancelada Autofirma sin código Cl@ve

VERSION 1.3.6   - Cliente de Firma Móvil + servidor intermedio (Android/iPhone aunque marquen Ordenador)
                - Corrección patrón MÓVIL (MÓVIL con V, no MÓBIL) en literales catalán/castellano
                - Prioridad literal Cliente Móvil sobre selector PC en resolverReglaAutofirmaCliente

VERSION 1.3.7   - Filtrado líneas SistraHelp (TR_ / ERROR -): ignora notas del agente pegadas en la traza
                - Orden cronológico por fecha/hora (SistraHelp pega lo más reciente arriba)
                - Último evento y detección «intentos posteriores sin KO» tras el último TR_SGX

VERSION 1.3.8   - Frases refinadas: múltiples Firma KO, intentos solo en Inicio firma post-KO
                - Omitir «Confirmar Cl@ve» en disp. móvil cuando literales son inequívocos de móvil
                - Aviso «no Autofirma de escritorio» si Ordenador marcado pero KO apunta a móvil

VERSION 1.3.9   - error_validacion_certificado: InvalidNotSignerCertificate / VALIDATION certificado firmante
                - Método de firma en Firma KO: Autofirm@ (certificado local) vs Cl@veFirm@ (Cl@ve Permanente)
                - Escalado Portafib (PENDENTS 012); frase vs acción separadas; mail problema general
                - Detección Cl@veFirm@ con @ (CL@VEFIRM@ tras normalizar mayúsculas)

VERSION 1.3.10  - error_clave_firma_cancelada: Signatura cancel·lada + Cl@veFirm@ sin código 8–15
                - Caso emisión/renovación certificado Cl@ve el mismo día en móvil (ventana no carga)
                - Aviso error QAA (QaaRecargaTramiteException) como incidencia acceso/recarga aparte
                - El KO Cl@veFirm@ manda sobre selector Ordenador (no cae en Autofirma Windows)

VERSION 1.3.11  - Cartel «Cl@ve» en cancelada Cl@ve Permanente; frase diagnóstico sin duplicar acción
                - Acción operativa: probar desde PC, CLAVE_MOVIL en SistraHelp, ventanas emergentes
                - Nota «no reinstalar AutoFirma» solo si marcado certificado/PC con KO Cl@ve

VERSION 1.3.12  - hayTimeoutClienteFirmaEnKo: temps/tiempo per a firmar + client de firma en KO
                - Autofirm@ + timeout sin SO escritorio en traza → acción iPhone (no Windows)
                - Ordenador marcado erróneamente: frase «confirmar iPhone/móvil antes de pasos Windows»

VERSION 1.3.13  - Cl@ve marcado + KO inequívoco Autofirm@/timeout → acción iPhone directa (no genérica)
                - Frase azul sin «Solicitar PDF» duplicado cuando acción SO ya es específica
                - Acción iPhone con prefijo discrepancia si acceso Cl@ve y firma certificado en KO
                - Criterio CAU: Método de firma del KO > selector; acceso ≠ firma; trazas antiguas sin campo KO

VERSION 1.3.14  - Autofirma CAU y discrepancias acceso/firma (antes 1.3.14–17)
                - SAF_27: flujo y acción alineados con criterio CAU (cliente local primero; servidor si masivo)
                - Solo TR_SGI sin KO: Posible Autofirma Android; Linux en traza → acción/mail Android
                - Flujo Autofirma: no «Confirmar Cl@ve» si certificado + Autofirm@ en Firma KO
                - Discrepancia Cl@ve marcado + Autofirm@ en KO: texto en flujo/acción; sin PDF duplicado

VERSION 1.3.15  - Paneles Info/Reglas y ayuda contextual (antes 1.3.18–21)
                - Detalles y Reglas alineados con criterio CAU
                - Ayuda (Detalles/Reglas/SAML/blanco): oculta análisis al abrir; al cerrar re-analiza si hubo resultado
                - Sin análisis previo: oculta «Pega traza» al abrir ayuda; al cerrar la restaura
                - Corrección: al cerrar ayuda sin análisis, «Pega traza» visible aunque haya traza pegada

VERSION 1.3.16  - Literales con color y validación previa (antes 1.3.22–23)
                - «Firma OK» verde; «Firma KO», fluxe inválido y códigos Cl@ve 8/101/103/104 en rojo
                - Validación método/sistema/traza: oculta resultado anterior como la ayuda

VERSION 1.3.17  - Flujo de Firma por intento (antes 1.3.24–27, 36)
                - Subapartado plegable; agrupación consecutiva ×N; mini-píldoras SGI→cierre; badge acceso≠firma
                - Colores taxonomía; sin log consola; docs panel y carpeta trazas_prueba
                - Nota intro «Detalles por cada intento de firma»

VERSION 1.3.18  - Pistas SO en flujo y frase Cl@ve (antes 1.3.28–31)
                - Diagnóstico global Cl@ve con código sin repetir literal CODI ERROR (queda en Literales)
                - Pistas Posible Cl@ve móvil / Autofirma Android / iPhone por intento
                - Etiquetas Cliente firma móvil (Android) y Client de firma (iPhone) en KO
                - Literales: resaltado Cliente de Firma Móvil / client de firma

VERSION 1.3.19  - Revisar Acceso en Flujo de Firma (antes 1.3.32–35)
                - Chip «Revisar Acceso» con tooltip (método acceso y SO/dispositivo en TR_CAR)
                - Tooltip «Sin cierre (Solo Inicio Firma)» en intentos sin KO/OK
                - Sin chip acceso en KO Cl@ve con código (8–15, 101, 103, 104…); basta Método Cl@veFirm@

VERSION 1.3.20  - Refactor Autofirma cliente: literal KO no indica SO (antes 1.3.37–43)
                POR QUÉ: «Cliente de Firma Móvil» / «client de firma» también en Windows/Mac; KO→cancel→OK suele ser transitorio
                · Flujo de Firma → Servidor intermedio / Timeout firma (tooltips TR_CAR); etiquetas neutras
                · Literales → avisos neutros; cartel → Problema Autofirma (tipo de fallo)
                · Acción/mail → selector + TR_CAR, bloque TR_CAR + pasos SO; intro «Habitualmente Android/iPhone…» según KO

VERSION 1.3.21  - Documentación Info/Reglas (antes 1.3.44)
                - Paneles Detalles y Reglas reescritos con criterio Autofirma v1.3.20
                - Nombre «Analizador de Trazas SISTRA» en ayuda embebida

VERSION 1.3.22  - Trazas mixtas y formulario sin Inicio (antes 1.3.45–47)
                - Traza Cl@ve + Autofirma posterior: manda el último Firma KO (p. ej. 8–15 y luego cancelada Autofirm@)
                - Sin TR_FRI → fallo_formulario (ignora «El fluxe no es vàlid»); Portafib solo si hubo Inicio formulario
                - 403 Forbidden en formulario externo: enriquece acción/mail; sin nota de literales al ciudadano en ese caso

VERSION 1.3.23  - Cierre administrativo del trámite (TR_FIN / TR_REG)
                - TR_SGO (Firma OK) ya no implica «trámite finalizado»; hace falta TR_FIN y/o TR_REG según el caso
                - tramite_completo (TR_FIN + TR_REG), tramite_finalizado, tramite_registrado, firma_correcta (solo Firma OK)
                - TR_RGI en flujo visual; fase firma_ok también si hay TR_REG sin TR_FIN ni TR_SGO

VERSION 1.3.24  - Aviso traza mixta (búsqueda por DNI)
                - Detecta TR_INI en fechas/horas distintas (duplicados mismo momento no cuentan) o IDs expediente distintos
                - Recomienda pegar traza filtrada por ID de trámite en SistraHelp
                - Nota carpeta ciudadana + Cl@ve móvil: SGI sin cierre puede ocultar selector de método (Autofirma/Cl@ve)

VERSION 1.3.25  - Cartel Autofirma cliente: tipo de fallo KO más frecuente (cronológico), no el primero pegado
                - Si hay varios tipos de Firma KO, frase con recuento (p. ej. fitxer buit + cancelada + servidor intermedio)

VERSION 1.3.26  - Literales detectados: Autofirm@ y Cl@veFirm@ (ClaveFirma@) en rojo, mismo estilo que Firma KO

VERSION 1.3.27  - Cartel azul ambiguo: «Cl@ve móvil o Autofirma Android» cuando solo hay TR_SGI sin cierre y sin método de acceso en la traza (antes fijaba «Cl@ve móvil»)
                - Nota «error de portafib previo» también en tramite_finalizado y tramite_registrado (antes solo en tramite_completo)

VERSION 1.3.28  - Nueva regla error_firma_fitxers_500: KO "Error general durant el procés de firma dels fitxers: 500" (o servei de custòdia) sin VALIDATION ni código Cl@ve
                - Error puntual del servicio/proveedor de firma (no ciudadano, no Portafib); cartel «Servicio de firma» + acción reintentar
                - Prioridad: tras VALIDATION y códigos Cl@ve (8-15 manda si aparece), antes del catch-all error_clave_movil

VERSION 1.3.29  - Nueva regla error_cadena_certificacion: KO "La cadena de certificación del certificado firmante no es válida" (resultminor SignerCertificate:InvalidCertificateChain)
                - Problema del certificado del ciudadano (CA no reconocida / intermedios ausentes / revocación / vigencia), NO de reinstalar Autofirma
                - Prioridad: tras error_validacion_certificado y ANTES de la rama de cliente Autofirma (aunque el KO diga «Método de firma: Autofirm@»)
                - Acción con 5 puntos a revisar del certificado en el equipo; cartel «Certificado (cadena)»; etiqueta de flujo «Cadena certificación»

VERSION 1.3.30  - Nota común antivirus/firewall/proxy añadida solo a fallos del CLIENTE de firma: error_autofirma_cliente_* (windows/mac/linux/android/iphone/movil/generico), error_autofirma_cancelada, error_autofirma_entorno, error_autofirma, error_fire
                - Distingue equipo particular (pausar antivirus/inspección SSL y reintentar) vs equipo de trabajo (firewall/proxy corporativo: lo revisa su informática; indicárselo)
                - NO se añade a códigos Cl@ve, formulario, Portafib, validación en servidor (500/@firma) ni cierres de trámite

VERSION 1.3.31  - Nueva regla error_certificado_nif_no_coincide: KO "S'ha firmat amb un certificat on el nif associat és X, però es requeria el nif Y" (firma con certificado de otro NIF)
                - Prioridad ALTA: tras SAF_27 y ANTES de validación/cadena de certificado (manda aunque haya InvalidCertificateChain en la misma traza)
                - Extrae los dos NIF (certificado vs requerido) para el mensaje; cartel «Certificado de otro NIF»; etiqueta de flujo «Certificado de otro NIF»
                - Acción: seleccionar el certificado propio (típico en equipos compartidos); no es plataforma ni Portafib

VERSION 1.3.32  - error_certificado_nif_no_coincide: ajuste de prioridad. Ya NO manda por el mero hecho de aparecer: solo si es el ÚLTIMO Firma KO o si no hay cadena/validación en la traza.
                - Si el NIF fue un intento puntual y el último KO es de cadena, gana error_cadena_certificacion (problema persistente/actual) y el NIF se muestra como aviso en la acción.

VERSION 1.3.33  - Panel Reglas reescrito: guía CAU (qué lee, qué muestra, catálogo por familia con “se detecta cuando / por qué”, prioridad actualizada).
                - Pendientes Info/Reglas: CAI-2643553 / Cl@ve 500 marcado como hecho (regla error_firma_fitxers_500 + fixtures).

VERSION 1.3.34  - Acciones cadena/NIF reformateadas (acciones.json v1.3.19): secciones, negritas clave, lenguaje accesible; aviso NIF con negritas.
*/
  
// CÓMO AÑADIR REGLAS:
// 1. Añadir condición en “DETECCIÓN DE REGLAS” → idReglaDetectada = "nombre_regla"
// 2. Añadir la acción en acciones.json con el mismo id
// 3. La regla tiene prioridad y sustituye la lógica estándar



// 🔹 VERSION JS (editable manual) 
// Cambios 2026-06-12: flujo visual, marco blanco compacto y mostrar solo tras analizar
const VERSION_JS = "1.3.34";

// Variable global donde se guarda el contenido de acciones.json
let accionesJSON = null;

// =====================================
// 🔹 CONSTANTES CENTRALIZADAS
// =====================================
// Valores importantes que se usan en varias partes del código

const LITERAL_FIELD_INDEX = 10;           // Estructura de traza: la primera información funcional empieza en el campo 10
                                           // (después de fecha, hora, ID y 7 campos técnicos iniciales)
const MIN_LITERAL_LENGTH = 20;            // Longitud mínima para considerar una línea como posible error (evitar ruido)
const MAIL_AUTOFIRMA_BASE = "https://cau.fundaciobit.org/firmawiki/index.php/Mails#Autofirma";
const COLOR_CLIENTE_FIRMA_MOVIL = "#a12c7b";

const INTRO_ACCION_AUTOFIRMA_CLIENTE_RESTO =
  "Revisar en SistraHelp la Carga del trámite (TR_CAR) anterior al inicio de firma para confirmar si el acceso fue desde Ordenador (Windows/Mac) o dispositivo móvil (Android/iPhone).\n\n" +
  "Si ya se conoce el sistema: marcar Certificado local + sistema en el analizador antes de pulsar Analizar.";

const INTRO_ACCION_AUTOFIRMA_KO_SERVIDOR =
  "Problema con el cliente de firma Autofirma. Habitualmente desde Android, pero no siempre.";

const INTRO_ACCION_AUTOFIRMA_KO_TIMEOUT =
  "Problema con el cliente de firma Autofirma. Habitualmente desde iPhone, pero no siempre.";

const INTRO_ACCION_AUTOFIRMA_CLIENTE_GENERICO =
  "Problema con el cliente de firma Autofirma.";

const NOTA_CARPETA_CLAVE_MOVIL_SIN_SELECTOR =
  "Si se accede desde carpeta ciudadana con Cl@ve móvil, puede que al firmar no salga el selector de método (Autofirma/Cl@ve) y dé error. "
  + "Probar acceder de nuevo con certificado o Cl@ve Permanente, no con Cl@ve móvil.";

function esReglaAutofirmaClienteConIntro(idRegla) {
  return !!idRegla && idRegla.indexOf("error_autofirma_cliente_") === 0;
}

function introAccionAutofirmaCliente(lineas) {
  const tipo = etiquetaTipoFalloAutofirmaClienteEnTraza(lineas);
  let primera = INTRO_ACCION_AUTOFIRMA_CLIENTE_GENERICO;
  if (tipo === "servidor intermedio") primera = INTRO_ACCION_AUTOFIRMA_KO_SERVIDOR;
  else if (tipo === "timeout") primera = INTRO_ACCION_AUTOFIRMA_KO_TIMEOUT;
  return primera + "\n\n" + INTRO_ACCION_AUTOFIRMA_CLIENTE_RESTO;
}

function aplicarIntroAccionAutofirmaCliente(textoAccion, lineas) {
  const t = String(textoAccion || "");
  if (/^Problema con el cliente de firma Autofirma/i.test(t)) return textoAccion;
  return introAccionAutofirmaCliente(lineas) + "\n\n" + t;
}

// 👉 Nota común: antivirus / firewall / proxy solo tiene sentido en fallos del CLIENTE de firma
//    (invocación/comunicación de AutoFirma, certificado local, FIRE), NO en códigos Cl@ve,
//    formulario, Portafib, validación en servidor ni cierres de trámite.
//    Distingue equipo particular (pausar antivirus) vs equipo de trabajo (lo revisa su informática).
const NOTA_SEGURIDAD_EQUIPO =
  "Antivirus / Firewall / Proxy: si el fallo continúa con varios navegadores y tras reinstalar AutoFirma, "
  + "la seguridad del equipo puede estar bloqueando la invocación o la comunicación de AutoFirma "
  + "(antivirus con inspección SSL/HTTPS, proxy o firewall).\n"
  + "- Equipo particular / casa: es poco frecuente; pausar un momento el antivirus (y su inspección SSL/HTTPS) y reintentar.\n"
  + "- Equipo de trabajo / oficina: el firewall/proxy corporativo lo gestiona su departamento de informática y el usuario no puede desactivarlo; "
  + "indicarle que lo revise con la informática de su organización (permitir AutoFirma y su comunicación).";

function reglaAplicaNotaSeguridadEquipo(idRegla) {
  if (!idRegla) return false;
  if (idRegla.indexOf("error_autofirma_cliente_") === 0) return true;
  return idRegla === "error_autofirma_cancelada" ||
    idRegla === "error_autofirma_entorno" ||
    idRegla === "error_autofirma" ||
    idRegla === "error_fire";
}

function etiquetaTipoFalloDesdeLineaKo(linea) {
  const s = String(linea || "");
  if (/SERVIDOR INTERMEDI|NO SE PUDO CONECTAR|NO S['']HA POGUT CONNECTAR.*SERVIDOR INTERMEDI/i.test(s) ||
      /CLIENT(E)? DE FIRMA M[ÒOÓ]?VIL|ERROR DE AUTOFIRMA O DEL CLIENTE DE FIRMA/i.test(s)) {
    return "servidor intermedio";
  }
  if (/TIEMPO PARA FIRMAR|TEMPS PER A FIRMAR|EL TEMPS PER A FIRMAR/i.test(s) &&
      /CLIENT(E)? DE FIRMA|client de firma/i.test(s)) {
    return "timeout";
  }
  if (/FITXER SIGNAT.*BUIT|FICHIERO SIGNAT.*VAC|PLUGIN.*AUTOFIRMA|SIGNAT EST[AÁ] BUIT/i.test(s)) {
    return "fitxer buit";
  }
  if (/SIGNATURA CANCEL|FIRMA CANCEL/i.test(s)) return "firma cancelada";
  if (/MODUL.*FIRMA FINALITZAT|MODULO DE FIRMA FINALIZADO/i.test(s)) return "módulo finalizado";
  return null;
}

function analizarTiposFalloKoAutofirma(lineas) {
  const counts = {};
  const kos = lineasFirmaKoCronologicas(lineas);
  let ultimoTipo = null;

  for (const linea of kos) {
    const tipo = etiquetaTipoFalloDesdeLineaKo(linea);
    if (!tipo) continue;
    counts[tipo] = (counts[tipo] || 0) + 1;
    ultimoTipo = tipo;
  }

  if (!kos.length) {
    const texto = (lineas || []).join("\n");
    if (hayLiteralServidorIntermedioAutofirma(texto)) {
      return { etiqueta: "servidor intermedio", counts: { "servidor intermedio": 1 }, ultimoTipo: "servidor intermedio", totalKo: 0 };
    }
    if (hayLiteralTimeoutFirmaCliente(texto)) {
      return { etiqueta: "timeout", counts: { timeout: 1 }, ultimoTipo: "timeout", totalKo: 0 };
    }
    if (/FITXER SIGNAT.*BUIT|PLUGIN.*AUTOFIRMA|SIGNAT EST[AÁ] BUIT/i.test(texto)) {
      return { etiqueta: "fitxer buit", counts: { "fitxer buit": 1 }, ultimoTipo: "fitxer buit", totalKo: 0 };
    }
    if (/SIGNATURA CANCEL|FIRMA CANCEL/i.test(texto)) {
      return { etiqueta: "firma cancelada", counts: { "firma cancelada": 1 }, ultimoTipo: "firma cancelada", totalKo: 0 };
    }
    return { etiqueta: "cliente local", counts: {}, ultimoTipo: null, totalKo: 0 };
  }

  let maxCount = 0;
  let predominante = ultimoTipo;
  for (const [tipo, n] of Object.entries(counts)) {
    if (n > maxCount) {
      maxCount = n;
      predominante = tipo;
    }
  }
  const empatados = Object.keys(counts).filter(t => counts[t] === maxCount);
  if (empatados.length > 1 && ultimoTipo && empatados.includes(ultimoTipo)) {
    predominante = ultimoTipo;
  }

  return {
    etiqueta: predominante || ultimoTipo || "cliente local",
    counts,
    ultimoTipo,
    totalKo: kos.length
  };
}

function etiquetaTipoFalloAutofirmaClienteEnTraza(lineas) {
  return analizarTiposFalloKoAutofirma(lineas).etiqueta;
}

function textoResumenTiposFalloKoAutofirma(counts) {
  const orden = ["fitxer buit", "firma cancelada", "servidor intermedio", "timeout", "módulo finalizado", "cliente local"];
  const partes = [];
  const vistos = new Set();
  for (const tipo of orden) {
    if (counts[tipo]) {
      partes.push(counts[tipo] + "× " + tipo);
      vistos.add(tipo);
    }
  }
  for (const [tipo, n] of Object.entries(counts)) {
    if (!vistos.has(tipo)) partes.push(n + "× " + tipo);
  }
  return partes.join(", ");
}

function esLineaFirmaKoHelper(linea) {
  return /TR_SGX|FI FIRMA KO|FIN FIRMA KO/i.test(String(linea || ""));
}

function lineasFirmaKoCronologicas(lineasTraza) {
  return (lineasTraza || [])
    .filter(esLineaFirmaKoHelper)
    .map(linea => ({ linea, ts: extraerTimestampLineaTraza(linea) }))
    .sort((a, b) => {
      if (a.ts != null && b.ts != null) return a.ts - b.ts;
      if (a.ts != null) return -1;
      if (b.ts != null) return 1;
      return 0;
    })
    .map(entry => entry.linea);
}

function obtenerUltimaLineaFirmaKoCronologica(lineasTraza) {
  const kos = lineasFirmaKoCronologicas(lineasTraza);
  return kos.length ? kos[kos.length - 1] : null;
}

function inferirReglaDesdeLineaKo(lineaKo) {
  if (!lineaKo || !esLineaFirmaKoHelper(lineaKo)) return null;
  if (/SAF_27|SAF27\b/i.test(lineaKo)) return "error_autofirma_servidor";
  if (esErrorNifCertificadoNoCoincideHelper(lineaKo)) return "error_certificado_nif_no_coincide";
  if (esErrorCadenaCertificacionHelper(lineaKo)) return "error_cadena_certificacion";
  if (esErrorValidacionCertificadoFirmanteHelper(lineaKo)) return "error_validacion_certificado";
  if (/CLAVE[_\s]?MOVIL.*NO.*PERM[EE]|M[ÈE]TODE.*CLAVE.*MOVIL.*NO/i.test(lineaKo)) {
    return "error_clave_movil_no_permitida";
  }
  if (lineaKo.includes("CLAVEFIRMA") && /ERROR:\s*\d+/.test(lineaKo)) {
    const matchCodigo = lineaKo.match(/ERROR:\s*(\d+)/);
    const matchTipus = lineaKo.match(/(?:TIPUS\s+)?RESULTAT\s*:\s*(\d+)/i)
      || lineaKo.match(/RESULTAD[OA]?\s*:\s*(\d+)/i);
    const codigo = matchCodigo ? matchCodigo[1] : null;
    const tipus = matchTipus ? matchTipus[1] : null;
    if (codigo === "103") return tipus === "15" ? "error_clave_103_15" : "error_clave_103";
    if (/^(8|9|10|11|12|13|14|15)$/.test(codigo)) return "error_clave_8_15";
    if (codigo === "101") return "error_clave_101";
    if (codigo === "104") return "error_clave_104";
  }
  if (/SIGNATURA CANCEL|FIRMA CANCEL/i.test(lineaKo)) {
    if (esMetodoFirmaAutofirmaEnLineaHelper(lineaKo)) return "error_autofirma_cancelada";
    if (esMetodoFirmaClaveEnLineaHelper(lineaKo)) return "error_clave_firma_cancelada";
  }
  return null;
}

function textoResumenCodigoClaveDetectado(codigo, tipus) {
  if (codigo === "103" && tipus === "15") return "103-15";
  if (/^(8|9|10|11|12|13|14|15)$/.test(codigo)) return "8–15";
  if (codigo === "103") return "103";
  if (codigo === "101") return "101";
  if (codigo === "104") return "104";
  return codigo || "?";
}

function esLineaIniCarHelper(linea) {
  return /^TR_INI\s+-/.test(String(linea || "")) || /^TR_CAR\s+-/.test(String(linea || ""));
}

function textoLineasTrazaSinKo(lineas) {
  return (lineas || []).filter(l => !esLineaFirmaKoHelper(l)).join("\n");
}

function textoLineasIniCar(lineas) {
  return (lineas || []).filter(esLineaIniCarHelper).join("\n");
}

function detectarSoEnTextoTraza(texto) {
  const t = String(texto || "").toUpperCase();
  if (/IPHONE|IPAD\b|\bIOS\b/.test(t)) return "iphone";
  if (/ANDROID/.test(t)) return "android";
  if (/LINUX|UBUNTU|DEBIAN|FEDORA/.test(t)) return "linux";
  if (/MACOS|\bMAC\b|DARWIN|OS X/.test(t)) return "mac";
  if (/WINDOWS|WIN32/.test(t)) return "windows";
  return null;
}

function reglaAutofirmaClientePorSo(so) {
  switch (so) {
    case "iphone": return "error_autofirma_cliente_iphone";
    case "android": return "error_autofirma_cliente_android";
    case "linux": return "error_autofirma_cliente_linux";
    case "mac": return "error_autofirma_cliente_mac";
    case "windows": return "error_autofirma_cliente_windows";
    default: return null;
  }
}

function detectarSoMovilDesdePistas(soIniCar, soSinKo) {
  if (soIniCar === "iphone" || soIniCar === "android") return soIniCar;
  if (soSinKo === "iphone" || soSinKo === "android") return soSinKo;
  // Linux en acceso/traza sin KO suele ser Android con user-agent de escritorio
  if (soIniCar === "linux" || soSinKo === "linux") return "android";
  return null;
}

function detectarSoEscritorioDesdePistas(soIniCar, soSinKo) {
  const so = soIniCar || soSinKo;
  if (so === "linux" || so === "mac" || so === "windows") return so;
  return null;
}

// 👉 Método de firma en KO (Cl@ve → CL@VEFIRM@ al normalizar mayúsculas)
function esMetodoFirmaClaveEnLineaHelper(linea) {
  return /CL@VEFIRM@|CLAVEFIRMA@|M[EÈ]TODE DE FIRMA:\s*CL@VE/i.test(String(linea || ""));
}

function esMetodoFirmaAutofirmaEnLineaHelper(linea) {
  return /AUTOFIRM@|M[EÈ]TODE DE FIRMA:\s*AUTOFIRM@/i.test(String(linea || ""));
}

// 👉 Error @firma: validación del certificado del firmante (Cl@ve Permanente o certificado local)
function esErrorValidacionCertificadoFirmanteHelper(linea) {
  const s = String(linea || "");
  return /INVALIDNOTSIGNERCERTIFICATE/i.test(s) ||
    (/VALIDATION/i.test(s) &&
      /VALIDACI[OÓN].*CERTIFICADO.*FIRMANTE|VALIDACI[OÓ].*CERTIFICAT.*FIRMANT/i.test(s)) ||
    (/LA FIRMA NO [ÉE]S V[AÀ]LIDA|LA SIGNATURA NO [ÉE]S V[AÀ]LIDA/i.test(s) &&
      /VALIDATION|INVALIDNOTSIGNERCERTIFICATE/i.test(s));
}

// 👉 Error @firma: la CADENA DE CERTIFICACIÓN del certificado firmante no es válida
//    (resultminor SignerCertificate:InvalidCertificateChain). A diferencia de InvalidNotSignerCertificate,
//    apunta al propio certificado del ciudadano (CA no reconocida / intermedios ausentes / revocación),
//    NO a reinstalar Autofirma. Revisar el certificado en el equipo.
function esErrorCadenaCertificacionHelper(linea) {
  const s = String(linea || "");
  return /INVALIDCERTIFICATECHAIN/i.test(s) ||
    (/CADENA DE CERTIFICACI[OÓ]|CADENA DE CONFIAN[ZÇ]A/i.test(s) &&
      /NO [EÉ]S V[AÀÁ]LIDA/i.test(s));
}

// 👉 KO: se firmó con un certificado de un NIF distinto al requerido por el trámite.
//    "S'ha firmat amb un certificat on el nif associat és X, però es requeria el nif Y" (o variante ES).
//    Causa: el ciudadano selecciona otro certificado (equipo compartido / varios certificados en el almacén).
function esErrorNifCertificadoNoCoincideHelper(linea) {
  const s = String(linea || "");
  return /S['´`]?HA FIRMAT AMB UN CERTIFICAT ON EL NIF/i.test(s) ||
    (/NIF ASSOCIAT/i.test(s) && /REQUERIA EL NIF/i.test(s)) ||
    (/NIF ASOCIADO/i.test(s) && /REQUER[IÍ]A EL NIF/i.test(s));
}

// 👉 Extrae {cert, requerido} de la línea del KO de NIF no coincidente (para el mensaje).
function extraerNifsCertificadoNoCoincide(linea) {
  const s = String(linea || "");
  const mCert = s.match(/NIF AS[SO]OCIA[TD][OA]?\s*[ÉE]?S?\s*(\d{7,8}[A-Z])/i);
  const mReq = s.match(/REQUER[IÍ]?A?\s*EL\s*NIF\s*(\d{7,8}[A-Z])/i);
  return {
    cert: mCert ? mCert[1].toUpperCase() : null,
    requerido: mReq ? mReq[1].toUpperCase() : null
  };
}

// 👉 ¿Es una línea informativa de método de firma (no un error)?
function esLineaMetodoFirma(texto) {
  return /^M[EÈ]TODE DE FIRMA:/i.test(String(texto || "").trim());
}

// 👉 Error puntual del servicio/proveedor de firma en el TR_SGX:
//    "Error general durant el proces de firma dels fitxers: 500" (o variante "servei de custodia ... error").
//    No es del ciudadano ni de Portafib; suele ser transitorio (reintentar).
function esLinea500FitxersHelper(linea) {
  const s = String(linea || "");
  return /ERROR GENERAL.*PROC[EÉ]S DE FIRMA DELS FITXERS/i.test(s) ||
    /SERVEI DE CUST[OÒ]DIA|SERVICIO DE CUSTODIA|CUSTODIA DEVOLVI[OÓ] UN ERROR/i.test(s);
}

// 👉 Línea con formato SistraHelp (evento TR_ o ERROR estructurado), no notas del agente
function esLineaFormatoTrazaSistraHelp(linea) {
  return /^TR_[A-Z]+\s+-/.test(linea) || /^ERROR\s+-/.test(linea);
}

// 👉 Fecha/hora de una línea de traza para orden cronológico (SistraHelp pega lo más reciente arriba)
function extraerTimestampLineaTraza(linea) {
  const m = String(linea || "").match(/(\d{2}\/\d{2}\/\d{4})\s+(\d{2}:\d{2}:\d{2})/);
  if (!m) return null;
  const [, fecha, hora] = m;
  const [dd, mm, yyyy] = fecha.split("/");
  return new Date(`${yyyy}-${mm}-${dd}T${hora}`).getTime();
}

// 👉 Campos tabulados SistraHelp tras el literal del evento (fecha, sesión, NIF, IDs…)
function parseCamposEventoTraza(linea) {
  const s = String(linea || "");
  const tabIdx = s.indexOf("\t");
  if (tabIdx === -1) return null;
  const campos = s.slice(tabIdx + 1).split("\t");
  if (campos.length < 2) return null;
  return {
    fechaHora: campos[0]?.trim() || null,
    sesion: campos[1]?.trim() || null,
    nif: campos[2]?.trim() || null,
    idExpediente: campos[7]?.trim() || null,
    idSecundario: campos[8]?.trim() || null,
    ts: extraerTimestampLineaTraza(linea)
  };
}

function claveInstanciaTramite(campos) {
  if (!campos) return null;
  if (campos.idExpediente && campos.idSecundario) {
    return campos.idExpediente + " / " + campos.idSecundario;
  }
  if (campos.sesion) return campos.sesion;
  return null;
}

// 👉 Búsqueda por DNI en SistraHelp puede mezclar varios trámites.
// Varios TR_INI con la misma fecha/hora no son error (duplicado al pegar); sí lo son en momentos distintos.
function detectarTrazaMultiTramite(lineasTraza) {
  const lineasIni = (lineasTraza || []).filter(l => /^TR_INI\s+-/.test(l));
  const instanciasIni = lineasIni.map(linea => {
    const c = parseCamposEventoTraza(linea);
    const fechaHora = c?.fechaHora || linea.match(/\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2}/)?.[0] || null;
    return {
      fechaHora,
      sesion: c?.sesion || null,
      clave: claveInstanciaTramite(c),
      ts: c?.ts ?? extraerTimestampLineaTraza(linea)
    };
  });

  const iniPorMomento = new Map();
  instanciasIni.forEach(ini => {
    const key = ini.fechaHora || (ini.ts != null ? "ts:" + ini.ts : null);
    if (!key) return;
    if (!iniPorMomento.has(key)) iniPorMomento.set(key, ini);
  });

  const iniMomentosDistintos = [...iniPorMomento.values()].sort((a, b) => {
    if (a.ts != null && b.ts != null) return a.ts - b.ts;
    if (a.ts != null) return -1;
    if (b.ts != null) return 1;
    return 0;
  });

  const clavesExpediente = new Set();
  for (const linea of lineasTraza || []) {
    if (!/^TR_[A-Z]+\s+-/.test(linea)) continue;
    const c = parseCamposEventoTraza(linea);
    const clave = claveInstanciaTramite(c);
    if (clave && c?.idExpediente) clavesExpediente.add(clave);
  }

  const clavesIniDistintas = [...new Set(iniMomentosDistintos.map(i => i.clave).filter(Boolean))];
  const motivos = [];

  if (iniMomentosDistintos.length > 1) {
    motivos.push(
      iniMomentosDistintos.length + " × TR_INI (Inici del tràmit) en fechas u horas distintas: "
      + "solo debe haber un inicio por trámite (varios momentos → trazas mezcladas)."
    );
  }
  if (iniMomentosDistintos.length > 1 && clavesIniDistintas.length > 1) {
    motivos.push(clavesIniDistintas.length + " identificadores de expediente distintos en esos TR_INI.");
  } else if (clavesExpediente.size > 1) {
    motivos.push(clavesExpediente.size + " identificadores de expediente distintos en la traza.");
  }

  return {
    esMulti: motivos.length > 0,
    motivos,
    numIni: lineasIni.length,
    numIniMomentosDistintos: iniMomentosDistintos.length,
    instanciasIni: iniMomentosDistintos,
    clavesExpediente: [...clavesExpediente]
  };
}

function escHtmlAviso(texto) {
  return String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function htmlListaInstanciasIni(instanciasIni) {
  if (!instanciasIni.length) return "";
  const items = instanciasIni.map(ini => {
    const det = [
      ini.fechaHora ? escHtmlAviso(ini.fechaHora) : null,
      ini.clave ? "ID " + escHtmlAviso(ini.clave) : null,
      ini.sesion ? "sesión " + escHtmlAviso(ini.sesion) : null
    ].filter(Boolean).join(" · ");
    return "<li>" + (det || "TR_INI") + "</li>";
  }).join("");
  return "<ul style=\"margin:8px 0 0 18px;padding:0;font-size:13px;line-height:1.45;\">" + items + "</ul>";
}

function htmlAvisoTrazaMultiTramite(info) {
  if (!info?.esMulti) return "";
  const motivos = info.motivos.map(m => "<li>" + escHtmlAviso(m) + "</li>").join("");
  return "<div class=\"panel-card\" style=\"margin-top:22px;border:2px solid #c0392b;\">"
    + "<div class=\"panel-card__head\" style=\"text-transform:none;background:#fdecea;color:#922b21;\">⚠ Traza mixta — varios trámites</div>"
    + "<div class=\"panel-card__body\" style=\"font-size:14px;color:#1e1c17;\">"
    + "<p style=\"margin:0 0 8px;\"><b>La traza pegada parece mezclar más de un trámite</b> (habitual si en SistraHelp se busca por DNI en lugar de por ID de trámite). "
    + "El análisis siguiente puede ser <b>incorrecto</b>.</p>"
    + "<p style=\"margin:0 0 6px;\"><b>Indicios detectados:</b></p>"
    + "<ul style=\"margin:0 0 8px 18px;padding:0;font-size:13px;\">" + motivos + "</ul>"
    + (info.instanciasIni.length ? "<p style=\"margin:0 0 4px;\"><b>TR_INI en momentos distintos (orden cronológico):</b></p>" + htmlListaInstanciasIni(info.instanciasIni) : "")
    + "<p style=\"margin:12px 0 0;font-size:13px;color:#666;\">Acción recomendada: en SistraHelp, localizar el trámite concreto y volver a pegar <b>solo</b> la traza de ese ID (doble clic en Inicio trámite → copiar eventos).</p>"
    + "</div></div>";
}

function htmlAvisoTrazaMultiTramiteCompacto(info) {
  if (!info?.esMulti) return "";
  return "<div style=\"margin-bottom:12px;padding:10px 12px;background:#fdecea;border:1px solid #c0392b;border-radius:8px;font-size:13px;color:#922b21;\">"
    + "<b>⚠ Traza mixta:</b> " + escHtmlAviso(info.motivos[0] || "Varios trámites en la traza")
    + " — el veredicto puede ser incorrecto. Pegar solo la traza del ID de trámite objetivo."
    + "</div>";
}

function ordenarEventosTrazaCronologicamente(lineasTraza) {
  return lineasTraza
    .map(linea => ({
      linea,
      evento: linea.match(/TR_[A-Z]+/)?.[0] || null,
      ts: extraerTimestampLineaTraza(linea)
    }))
    .filter(entry => entry.evento)
    .sort((a, b) => {
      if (a.ts != null && b.ts != null) return a.ts - b.ts;
      if (a.ts != null) return -1;
      if (b.ts != null) return 1;
      return 0;
    });
}

// 👉 Mensaje funcional en eventos TR_SGX / TR_SGO (campo 10+ de la traza pegada)
function normalizarSeparadoresTraza(linea) {
  return String(linea || "")
    .replace(/[\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u00a0]/g, "\t");
}

function extraerMensajeEventoTraza(linea) {
  const s = normalizarSeparadoresTraza(linea).trim();

  if (s.includes("\t")) {
    const partes = s.split(/\t+/).map(p => p.trim()).filter(Boolean);
    if (partes.length > LITERAL_FIELD_INDEX) {
      const msg = partes.slice(LITERAL_FIELD_INDEX).join(" ").trim();
      if (msg) return msg;
    }
    if (partes.length >= 2) {
      const last = partes[partes.length - 1];
      if (last && !/^\d+$/.test(last) && !/^TR_/.test(last)) return last;
    }
  }

  // Mensajes conocidos embebidos (copia sin tabuladores / desde SistraHelp web)
  if (/SIGNATURA CANCEL|FIRMA CANCELADA|FIRMA CANCEL·LADA/i.test(s)) {
    const m = s.match(/SIGNATURA CANCEL[·\.\-]?LADA|FIRMA CANCELADA|FIRMA CANCEL·LADA/i);
    if (m) return m[0].trim();
  }
  if (/TIEMPO PARA FIRMAR|TEMPS PER A FIRMAR/i.test(s)) {
    const m = s.match(/EL TIEMPO PARA FIRMAR HA EXPIRADO[^]*|EL TEMPS PER A FIRMAR[^]*/i);
    if (m) return m[0].trim();
  }

  const mNum = s.match(/\d{5,}\s+\d{5,}\s+(.+)$/i);
  if (mNum && mNum[1].trim()) return mNum[1].trim();

  return null;
}

// 👉 ¿TR_SGX / TR_SGO con texto de error en el detalle (cancelada, timeout, Cl@ve…)?
function esLiteralFirmaEnEventoHelper(linea) {
  if (!/TR_SGX|TR_SGO|FI FIRMA KO|FIN FIRMA KO|FI FIRMA OK|FIN FIRMA OK/i.test(linea)) return false;
  if (/SIGNATURA CANCEL|FIRMA CANCEL|TIEMPO PARA FIRMAR|TEMPS PER A FIRMAR|CLAVEFIRMA|CODI ERROR|CLIENTE DE FIRMA|M[EÈ]TODE DE FIRMA|INVALIDNOTSIGNERCERTIFICATE|\(VALIDATION\)/i.test(linea)) {
    return true;
  }
  const msg = extraerMensajeEventoTraza(linea);
  return !!msg && msg.length > 2;
}

function claveLiteralParaAgrupacion(linea) {
  let k = extraerMensajeEventoTraza(linea) || linea;
  k = k.replace(/^ERROR\s*-\s*/i, "");
  k = k.replace(/\d{1,2}\/\d{1,2}\/\d{2,4}/g, "");
  k = k.replace(/\d{1,2}:\d{2}:\d{2}/g, "");
  k = k.replace(/\b[A-Z0-9]{5,}-[A-Z0-9]{5,}-[A-Z0-9]{5,}\b/g, "");
  k = k.replace(/\b\d{5,}\b/g, "");
  k = k.replace(/\s+/g, " ").trim();
  return k;
}

function htmlLiteralDetectado(texto) {
  const spanOk = '<span style="color:#2e6e14;font-weight:600">';
  const spanKo = '<span style="color:#c0392b;font-weight:600">';
  let html = String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
  html = html.replace(/\b(Firma\s+OK)\b/gi, spanOk + "$1</span>");
  html = html.replace(/\b(Firma\s+KO)\b/gi, spanKo + "$1</span>");
  html = html.replace(
    /(El\s+fluxe\s+no\s+(?:es|és)\s+v(?:à|a|á)?lid)/gi,
    spanKo + "$1</span>"
  );
  html = html.replace(
    /(Error:\s*(?:103|101|104|8)(?!\d))/gi,
    spanKo + "$1</span>"
  );
  html = html.replace(
    /(Autofirm@|Cl@veFirm@|ClaveFirma@)/gi,
    spanKo + "$1</span>"
  );
  html = resaltarClienteFirmaEnLiteral(html);
  return html;
}

function hayLiteralClienteFirmaMovilAndroid(texto) {
  return /CLIENT(E)? DE FIRMA M[ÒOÓ]?VIL|ERROR DE AUTOFIRMA O DEL CLIENTE DE FIRMA M[ÒOÓ]?VIL/i.test(String(texto || ""));
}

function hayLiteralServidorIntermedioAutofirma(texto) {
  return /SERVIDOR INTERMEDIO|CLIENT(E)? DE FIRMA M[ÒOÓ]?VIL|ERROR DE AUTOFIRMA O DEL CLIENTE DE FIRMA M[ÒOÓ]?VIL/i.test(String(texto || ""));
}

function hayLiteralTimeoutFirmaCliente(texto) {
  const t = String(texto || "");
  return (
    (/TIEMPO PARA FIRMAR|TEMPS PER A FIRMAR/i.test(t) && /CLIENT(E)? DE FIRMA|client de firma/i.test(t)) ||
    (/\bclient de firma\b/i.test(t) && !hayLiteralClienteFirmaMovilAndroid(t))
  );
}

function detectarAvisosClienteFirmaLiterales(lineasTraza) {
  const texto = lineasTraza.join("\n");
  const avisos = [];
  if (hayLiteralServidorIntermedioAutofirma(texto)) {
    avisos.push("*Cliente Autofirma / servidor intermedio — confirmar SO en TR_CAR");
  }
  if (hayLiteralTimeoutFirmaCliente(texto)) {
    avisos.push("*Timeout firma / cliente Autofirma — confirmar SO en TR_CAR");
  }
  return avisos;
}

function resaltarClienteFirmaEnLiteral(html) {
  const cls = "literal-cliente-firma";
  html = html.replace(
    /(Error de Autofirma o del Cliente de Firma M[óoò]vil|Cliente de Firma M[óoò]vil|CLIENTE DE FIRMA M[ÓOÒ]VIL)/gi,
    `<span class="${cls}">$1</span>`
  );
  html = html.replace(
    /(servidor intermedio)/gi,
    `<span class="${cls}">$1</span>`
  );
  html = html.replace(
    /(El temps per a firmar ha expirat|El tiempo para firmar ha expirado|tiempo para firmar|temps per a firmar)/gi,
    `<span class="${cls}">$1</span>`
  );
  html = html.replace(
    /(client de firma|cliente de firma)/gi,
    `<span class="${cls}">$1</span>`
  );
  return html;
}

function htmlAperturaLiteralesDetectados(lineasTraza) {
  let html = "<div class='literal-pequeno'>";
  const avisos = detectarAvisosClienteFirmaLiterales(lineasTraza);
  if (avisos.length) {
    avisos.forEach(aviso => {
      html += `<div class="literal-aviso-cliente-firma">${aviso.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</div>`;
    });
    html += "<br>";
  }
  return html;
}

const RE_FECHA_CABECERA = /^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2}\s+[^\s]+\s+[^\s]+\s+/; // Patrón: elimina cabecera de fecha/hora


// Espera a que el HTML esté completamente cargado antes de ejecutar
document.addEventListener("DOMContentLoaded", () => {

console.log("HTML v" + VERSION_HTML);
console.log("JS v" + VERSION_JS);

  
document.getElementById("versionHTML").innerText =
  "html " + VERSION_HTML;

document.getElementById("versionJS").innerText =
  "js " + VERSION_JS;

const versionBadge = document.getElementById("versionBadge");
if (versionBadge) versionBadge.innerText = "v " + VERSION_JS;




// =====================================
// REFERENCIAS A ELEMENTOS HTML
// =====================================
// Guardamos todos los elementos que se van a usar

const btnDetalles = document.getElementById("btnDetalles");
const btnTabla = document.getElementById("btnTabla");
const checkSaml = document.getElementById("checkSaml");
const checkBlanco = document.getElementById("checkBlanco");
const btnAnalizar = document.getElementById("btnAnalizar");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnActualizar = document.getElementById("btnActualizar");
const placeholder = document.getElementById("placeholder");
const metodoClave = document.getElementById("metodoClave");
const metodoCert = document.getElementById("metodoCert");
const bloqueSistema = document.getElementById("bloqueSistema");
const sisPC = document.getElementById("sisPC");
const sisMovil = document.getElementById("sisMovil");


// =====================================
// PANEL POPUP (mensajes informativos)
// =====================================

const panel = document.getElementById("panel");
const panelTitulo = document.getElementById("panelTitulo");
const panelContenido = document.getElementById("panelContenido");

function abrirPanel(titulo, contenido) {      // Abre un panel con título + contenido. 👉 Muestra panel con información
  panel.classList.remove("hidden");
  panelTitulo.innerText = titulo;
  panelContenido.innerHTML = contenido;
}

function cerrarPanelFunc() {      // 👉 Oculta panel
  panel.classList.add("hidden");
  if (analisisOcultoPorAyuda) {
    analisisOcultoPorAyuda = false;
    const texto = document.getElementById("inputTraza").value.trim();
    if (texto && texto.toUpperCase().includes("TR_")) {
      btnAnalizar.click();
      return;
    }
  }
  // Sin análisis previo: volver a pantalla inicial (aunque haya traza pegada sin analizar)
  if (!ultimoAnalisisValido) {
    placeholder.style.display = "";
  } else {
    actualizarPlaceholderSegunTraza();
  }
}

// 👉 Ayuda (Detalles, Reglas, SAML, blanco): oculta análisis; al cerrar panel re-analiza con método actual
let analisisOcultoPorAyuda = false;
let ultimoAnalisisValido = false;

function actualizarPlaceholderSegunTraza() {
  const hayTraza = document.getElementById("inputTraza").value.trim().length > 0;
  placeholder.style.display = hayTraza ? "none" : "";
}

function ocultarResultadosAnalisis() {
  document.getElementById("resultado").innerText = "";
  document.getElementById("resultado").style.maxWidth = "";
  document.getElementById("resultado").style.display = "none";
  const flujoCard = document.getElementById("flujoVisualCard");
  const flujo = document.getElementById("flujoVisual");
  if (flujo) {
    flujo.innerHTML = "";
    flujo.style.display = "none";
  }
  const flujoDiag = document.getElementById("flujoDiagnostico");
  if (flujoDiag) {
    flujoDiag.innerHTML = "";
    flujoDiag.style.display = "none";
  }
  const flujoFirma = document.getElementById("flujoFirmaDetalle");
  if (flujoFirma) {
    flujoFirma.innerHTML = "";
    flujoFirma.style.display = "none";
  }
  if (flujoCard) flujoCard.style.display = "none";
}

function abrirPanelAyuda(titulo, contenido) {
  if (ultimoAnalisisValido) analisisOcultoPorAyuda = true;
  ocultarResultadosAnalisis();
  placeholder.style.display = "none";
  abrirPanel(titulo, contenido);
}

const TITULO_PANEL_INFO = "Información del analizador";
const TITULO_PANEL_REGLAS = "Motor de análisis (reglas)";

function panelAyudaEstaAbierto(titulo) {
  return !panel.classList.contains("hidden") && panelTitulo.innerText === titulo;
}

function abrirPanelValidacion(contenido) {
  ocultarResultadosAnalisis();
  ultimoAnalisisValido = false;
  placeholder.style.display = "none";
  abrirPanel("Validación", contenido);
}

// Botón cerrar panel
document.getElementById("btnCerrarPanel").onclick = cerrarPanelFunc;

// =====================================
// 🔴 BOTÓN DETALLES - Muestra información de la versión
// =====================================

btnDetalles.onclick = () => {
  if (panelAyudaEstaAbierto(TITULO_PANEL_INFO)) {
    cerrarPanelFunc();
    return;
  }
  const vJson = accionesJSON?.version || "—";
  abrirPanelAyuda(TITULO_PANEL_INFO, `
<ul>
  <li><b>Analizador de Trazas SISTRA</b> — trazas SistraHelp, orientado a soporte técnico CAU.</li>
  <li>Versión actual: <b>js v ${VERSION_JS}</b> · reglas <b>acciones.json v ${vJson}</b> · interfaz <b>html v ${typeof VERSION_HTML !== "undefined" ? VERSION_HTML : "—"}</b>.</li>

  <br>

  <li><b>Qué hace al analizar una traza:</b></li>
  <li>Muestra el <b>flujo del trámite</b> (eventos TR_) con píldoras de colores y etiquetas.</li>
  <li>Subapartado <b>Flujo de Firma</b> (plegable): detalle por intento TR_SGI, acceso, método, mini-píldoras y resumen.</li>
  <li>Indica el <b>diagnóstico</b> (cartel azul + frase explicativa en la tarjeta de flujo).</li>
  <li>Propone la <b>acción recomendada</b> y el enlace <b>Mail</b> cuando existe.</li>
  <li>Lista los <b>literales detectados</b> con contador (xN).</li>
  <li>Enlace <b>Reportar análisis incorrecto</b> al final del resultado.</li>

  <br>

  <li><b>Refactor Autofirma cliente (v1.3.20) — por qué:</b></li>
  <li>SistraHelp envuelve muchos fallos en textos genéricos («Cliente de Firma Móvil», «client de firma» en catalán) que también salen en <b>Windows/Mac</b>. Inferir Android/iPhone desde el KO desorientaba al técnico.</li>
  <li>Separación de capas (cada apartado dice una cosa distinta):</li>
  <li>· <b>Flujo de Firma</b> → tipo de fallo neutro: <i>Servidor intermedio</i>, <i>Timeout firma</i> (+ tooltips TR_CAR).</li>
  <li>· <b>Literales</b> → avisos/resaltado neutros; confirmar SO en TR_CAR.</li>
  <li>· <b>Cartel</b> → «Problema con el cliente de firma Autofirma (servidor intermedio / timeout / …)».</li>
  <li>· <b>Acción/mail</b> → SO concreto: selector Certificado + Ordenador/móvil y TR_CAR; bloque TR_CAR + pasos por SO.</li>
  <li>· <b>Intro Acción</b> → «Habitualmente desde Android/iPhone, pero no siempre» según tipo KO (solo pista CAU, no regla rígida).</li>

  <br>

  <li><b>Estado actual (completado y validado):</b></li>
  <li>✔ Interfaz estilo V5: tarjetas Flujo / Acción / Literales.</li>
  <li>✔ <b>Pre-firma:</b> fallo formulario (sin TR_FRI) y fallo Portafib (acción dinámica con {lit}).</li>
  <li>✔ <b>Cierre trámite:</b> TR_SGO (firma OK) ≠ finalizado; TR_FIN (finalizado), TR_REG (registrado), tramite_completo (ambos).</li>
  <li>✔ <b>firma_correcta_portafib</b> — error Portafib previo en traza con firma/cierre.</li>
  <li>✔ <b>Cl@ve:</b> 8–15, 101, 103, 103-15, 104; Cl@ve móvil; CLAVE_MOVIL no permitida; cancelada Cl@veFirm@.</li>
  <li>✔ <b>error_firma_fitxers_500</b> — KO «Error general… fitxers: 500» / custodia (CAI-2643553 y similares).</li>
  <li>✔ <b>Validación @firma</b> (InvalidNotSignerCertificate) → escalado Portafib.</li>
  <li>✔ <b>Cadena / NIF certificado:</b> InvalidCertificateChain; NIF distinto (prioridad por último KO).</li>
  <li>✔ <b>Autofirma:</b> SAF_27, cancelada, entorno sin cierre, cliente por SO (selector + TR_CAR); nota antivirus/proxy/firewall en fallos de cliente.</li>
  <li>✔ <b>Método de firma en Firma KO</b> (Autofirm@ / Cl@veFirm@) manda sobre selector del técnico.</li>
  <li>✔ Discrepancia Cl@ve marcado + KO Autofirm@ (flujo y acción).</li>
  <li>✔ <b>Flujo de Firma:</b> agrupación, Revisar Acceso (TR_CAR), sin chip acceso en KO Cl@ve con código.</li>
  <li>✔ Fixtures de prueba en <b>trazas_prueba/</b>.</li>

  <br>

  <li><b>Pendiente de mejora (UX / mails, no reglas nuevas):</b></li>
  <li>🔧 Limpieza de literales: mensaje útil arriba, traza completa debajo.</li>
  <li>🔧 Aviso Firma KO previo en tarjeta Acción cuando el trámite acaba OK.</li>
  <li>🔧 Mails Autofirma con anclas específicos por SO.</li>

  <br>

  <li><b>Traza mixta:</b> TR_INI en fechas/horas distintas o IDs expediente distintos (búsqueda por DNI). Duplicados TR_INI mismo momento no avisan.</li>

  <br>

  <li><b>Nota:</b> La herramienta evoluciona por fases. Cada cambio se prueba antes de pasar al siguiente.</li>
</ul>
`);
};


// =====================================
// 🔴 BOTÓN TABLA - De momento informativo
// =====================================

btnTabla.onclick = (e) => {
  e.preventDefault();
  if (panelAyudaEstaAbierto(TITULO_PANEL_REGLAS)) {
    cerrarPanelFunc();
    return;
  }
  const vJson = accionesJSON?.version || "—";
  abrirPanelAyuda(TITULO_PANEL_REGLAS, `
<ul>
  <li><b>Guía del motor de análisis</b> (js v ${VERSION_JS} · acciones.json v ${vJson})</li>
  <li>Sirve para que un técnico CAU, al pegar una traza de SistraHelp, sepa <b>dónde falló el trámite</b>, <b>por qué el analizador ha elegido esa regla</b> y <b>qué acción/mail</b> abrir. No sustituye el criterio humano: orienta.</li>

  <br>

  <li><b>1. Cómo lee la traza</b></li>
  <li>Usa líneas <b>TR_…</b> y <b>ERROR -</b> (ignora notas del agente u otras columnas pegadas).</li>
  <li>SistraHelp pega lo <b>más reciente arriba</b>; el motor ordena por fecha/hora para reconstruir el flujo real.</li>
  <li>Eventos clave: <b>TR_INI</b> inicio trámite · <b>TR_CAR</b> carga (acceso/SO) · <b>TR_FRI/FRF</b> formulario · <b>TR_SGI</b> inicio firma · <b>TR_SGX</b> Firma KO · <b>TR_SGO</b> Firma OK · <b>TR_RGI/REG</b> registro · <b>TR_FIN</b> fin trámite.</li>
  <li>Clasifica en fase: <b>pre-firma</b> (aún no hay inicio de firma), <b>error en firma</b>, o <b>firma/cierre OK</b>.</li>
  <li>Si hay <b>TR_SGO / TR_REG / TR_FIN</b> posteriores, el cierre manda sobre KO antiguos (el ciudadano pudo recuperar).</li>

  <br>

  <li><b>2. Qué verás tras Analizar</b></li>
  <li><b>Flujo del trámite</b> — píldoras de eventos; cartel azul con el diagnóstico corto.</li>
  <li><b>Flujo de Firma</b> — cada intento (TR_SGI→SGX/SGO); método del KO; acceso; no decide la regla, la explica.</li>
  <li><b>Acción</b> — texto de <b>acciones.json</b> (pasos CAU) + enlace <b>Mail</b> si existe.</li>
  <li><b>Literales</b> — fragmentos de error de la traza (con ×N si se repiten).</li>

  <br>

  <li><b>3. Catálogo: qué se detecta y por qué</b></li>

  <li style="margin-top:8px"><b>A) Antes de firmar (pre-firma)</b></li>
  <li>✔ <b>fallo_formulario</b> — No llega a firma y no hay (o falla) el formulario (sin TR_FRI, reintentos FRI/FRF, 403…). <i>Por qué:</i> el problema es del formulario / datos, no del proveedor de firma.</li>
  <li>✔ <b>fallo_portafib</b> — Hay Inicio formulario y literales de sesión/flujo («El fluxe no es vàlid», sesión firma, Timestamp…). <i>Por qué:</i> fallo técnico de Portafib/plataforma, no del ciudadano.</li>

  <br>

  <li><b>B) Cl@ve Firma (códigos y móvil)</b></li>
  <li>✔ <b>error_clave_8_15</b> — Código Error 8 + Tipo Resultado 15 (pasarela externa). Renovar/acreditar Cl@ve Permanente; escalar si hay muchos casos a la vez.</li>
  <li>✔ <b>error_clave_101</b> — Nivel de registro insuficiente.</li>
  <li>✔ <b>error_clave_103</b> — Contraseña bloqueada.</li>
  <li>✔ <b>error_clave_103_15</b> — Certificados del usuario bloqueados (103 + Tipo 15).</li>
  <li>✔ <b>error_clave_104</b> — Registro débil.</li>
  <li>✔ <b>error_clave_firma_cancelada</b> — «Signatura cancel·lada» + Cl@veFirm@ (sin código). Suele ser ventana/emisión; probar desde ordenador.</li>
  <li>✔ <b>error_clave_movil</b> — Solo inicios de firma sin cierre, o KO sin código Cl@ve, con contexto Cl@ve. Cartel puede ser «Cl@ve móvil o Autofirma Android» si la traza no aclara el método.</li>
  <li>✔ <b>error_clave_movil_no_permitida</b> — ERROR «CLAVE_MOVIL no està permés al tràmit». Debe acceder con Cl@ve Permanente o certificado, no con móvil.</li>
  <li>✔ <b>error_firma_fitxers_500</b> — «Error general durant el proces de firma dels fitxers: 500» (o custodia) sin VALIDATION ni código Cl@ve. <i>Por qué:</i> fallo transitorio del servicio de firma; pedir reintento (no es el certificado del ciudadano).</li>

  <br>

  <li><b>C) Certificado local / Autofirma / @firma</b></li>
  <li>✔ <b>error_autofirma_servidor</b> — SAF_27. Fallo del servidor Autofirma (prioridad máxima en firma).</li>
  <li>✔ <b>error_certificado_nif_no_coincide</b> — «nif associat és X, però es requeria el nif Y». Eligió otro certificado (equipo compartido). <i>Prioridad:</i> solo si es el <b>último</b> Firma KO o no hay cadena/validación en la traza.</li>
  <li>✔ <b>error_validacion_certificado</b> — (VALIDATION) InvalidNotSignerCertificate. Validador @firma; suele escalarse a Portafib (no es “reinstalar Autofirma”).</li>
  <li>✔ <b>error_cadena_certificacion</b> — InvalidCertificateChain («cadena de certificación no válida»). Revisar certificado/cadena CA / VALIDe; si el NIF aparece en un intento puntual, gana la cadena y se avisa del NIF. Casuística rara: llamar y probar (sin mail dedicado).</li>
  <li>✔ <b>error_autofirma_cancelada</b> — Firma cancelada con Autofirm@ (timeout/SSL/comunicación).</li>
  <li>✔ <b>error_autofirma_entorno</b> — Solo TR_SGI sin KO/OK y el técnico marcó certificado. No se invocó bien el cliente (FIRE/Autofirma).</li>
  <li>✔ <b>error_autofirma_cliente_*</b> (windows / mac / linux / android / iphone / movil / generico) — KO de cliente Autofirma (servidor intermedio, timeout, fitxer buit…). El <b>literal</b> dice el <b>tipo de fallo</b>; el <b>SO</b> para mail/acción sale del selector Ordenador/móvil + TR_CAR. Incluyen nota antivirus/proxy/firewall.</li>
  <li>⚙ <b>error_fire</b> / <b>error_autofirma</b> — reserva / legacy.</li>

  <br>

  <li><b>D) Cierre correcto</b></li>
  <li>✔ <b>firma_correcta</b> — hay TR_SGO (firmó OK).</li>
  <li>✔ <b>tramite_registrado</b> / <b>tramite_finalizado</b> / <b>tramite_completo</b> — TR_REG y/o TR_FIN.</li>
  <li>✔ <b>firma_correcta_portafib</b> — firmó/cerró pero en la traza hubo error Portafib previo (útil para no reabrir incidencia de firma).</li>

  <br>

  <li><b>4. Prioridad en fase «error en firma» (por qué gana una regla y no otra)</b></li>
  <li>1. SAF_27 · 2. NIF de otro certificado <i>(solo si es el último KO)</i> · 3. VALIDATION InvalidNotSigner · 4. Cadena InvalidCertificateChain</li>
  <li>5. CLAVE_MOVIL no permitida · 6. Último KO tipado (si reintento cambió de método) · 7. Códigos Cl@ve (8–15, 101, 103, 103-15, 104)</li>
  <li>8. Cancelada Cl@veFirm@ · 9. Error 500 de firma/custodia · 10. Autofirma cliente (literal fuerte / método Autofirm@)</li>
  <li>11. Cancelada Autofirma · 12. Cl@ve móvil (KO sin código) · 13. Solo TR_SGI sin cierre → entorno certificado o Cl@ve móvil (desempate por selector)</li>
  <li><i>Idea clave:</i> si la traza mezcla varios KO, manda el <b>problema persistente / último intento relevante</b>, no un error puntual aislado.</li>

  <br>

  <li><b>5. Método Cl@ve / Certificado y Ordenador / móvil</b></li>
  <li>Si el Firma KO trae <b>Método de firma: Autofirm@ o Cl@veFirm@</b>, ese dato <b>manda</b> sobre lo marcado en la UI.</li>
  <li>El selector sirve sobre todo de <b>desempate</b> (SGI sin cierre, SO para mail Autofirma) y para detectar <b>acceso ≠ firma</b>.</li>
  <li>Con certificado local, Ordenador/móvil afina la acción (Windows vs Android/iPhone). El KO «Cliente de Firma Móvil» <b>no implica</b> siempre móvil.</li>

  <br>

  <li><b>6. Autofirma cliente — capas (para no liar SO y fallo)</b></li>
  <li><b>Flujo de Firma / cartel:</b> tipo de fallo neutro (servidor intermedio, timeout…).</li>
  <li><b>Acción / mail:</b> SO concreto (selector + TR_CAR).</li>

  <br>

  <li><b>7. Pruebas</b></li>
  <li>Casuísticas reales y sintéticas en carpeta <b>trazas_prueba/</b> (ver README.txt).</li>

  <br>

  <li><b>Pendiente (mejora UX, no reglas):</b> literales más limpios · mails Autofirma con ancla por SO · aviso de KO previos cuando el trámite acaba OK.</li>
  <li><b>Nota:</b> ✔ = regla activa y usada en CAU. ⚙ = reserva / legacy.</li>
</ul>
`);
};



// =====================================
// PROBLEMAS DE ACCESO — SAML y página en blanco
// =====================================

checkSaml.onchange = () => {
  if (checkSaml.checked) {
    checkBlanco.checked = false;
    abrirPanelAyuda("El ciudadano ve error SAML", `
<b>SAML 003002 (Authentication Failed: Detalle error: no certificate has been submitted)</b><br>
La pasarela de acceso no ha recibido un certificado digital válido para autenticarse. Causas habituales:<br><br>

No se ha seleccionado ningún certificado al acceder o el navegador no envía correctamente el certificado.<br><br>
El certificado está caducado, revocado o no es válido.<br><br>
El equipo no detecta correctamente el DNIe o el lector no funciona bien.<br><br>
Algún proxy, firewall o antivirus está bloqueando la comunicación con la pasarela.<br><br>

<b>SAML (Response is fail: Contraseña incorrecta. Si no recuerda su contraseña, acceda al servicio de “Olvido de contraseña”.)</b><br>
La autenticación con Cl@ve no se ha completado correctamente porque la contraseña introducida no es válida. Causas habituales:<br><br>

La contraseña de Cl@ve Permanente es incorrecta.<br>
Es necesario restablecerla desde la opción “Olvido de contraseña”.
    `);
  }
};

checkBlanco.onchange = () => {
  if (checkBlanco.checked) {
    checkSaml.checked = false;
    abrirPanelAyuda("La página queda en blanco", `
La página queda en blanco<br><br>

Si al acceder el ciudadano ve la página en blanco, debe considerarse primero como un posible problema de acceso o de pasarela. En estos casos, es posible que el ciudadano no llegue a entrar realmente en el trámite y que no se genere traza útil en SistraHelp.<br><br>

Qué revisar:<br>
- Puede estar fallando la pasarela de acceso.<br>
- Puede haberse producido una redirección incompleta o fallida tras la identificación.<br>
- El navegador, una extensión, un proxy, firewall o antivirus pueden estar bloqueando la carga correcta de la página.<br><br>

Prueba recomendada:<br>
Conviene probar a acceder a Carpeta Ciudadana GOB para comprobar si la pasarela carga correctamente allí. Si tampoco carga o el comportamiento es similar, la orientación principal debe ser problema de acceso/pasarela, más que de firma o del trámite.
    `);
  }
};
  

// =====================================
// 🔹 PLEGAR "PROBLEMAS DE ACCESO"
// =====================================
// 👉 Al contraer el apartado, limpiamos la selección y cerramos el panel mostrado
const cardAcceso = document.getElementById("cardAcceso");
if (cardAcceso) {
  cardAcceso.addEventListener("toggle", () => {
    if (!cardAcceso.open) {
      checkSaml.checked = false;
      checkBlanco.checked = false;
      cerrarPanelFunc();
    }
  });
}

// =====================================
// 🔴 BOTÓN ANALIZAR 
// =====================================

btnAnalizar.onclick = () => {      // 👉 Inicia el análisis completo de la traza y genera resultados

  // Oculta resultados anteriores


  // ✅ 1. VALIDACIÓN MÉTODO
  if (!metodoClave.checked && !metodoCert.checked) {
    abrirPanelValidacion("Debe seleccionar método");
    return;
  }

  const texto = document.getElementById("inputTraza").value.trim();

  // ✅ 2. VALIDACIÓN SISTEMA (ANTES que la traza)
  if (metodoCert.checked && !sisPC.checked && !sisMovil.checked) {
    abrirPanelValidacion(
      texto ? "Debe seleccionar sistema" : "Debe seleccionar sistema y pegar una traza"
    );
    return;
  }

  // ✅ 3. VALIDACIÓN TRAZA
  // 👉 IMPORTANTE: Guardar líneas originales ANTES de convertir a mayúsculas.
  // Esto preserva el formato original (tabuladores, espacios, caracteres especiales) 
  // para mostrar los literales de error exactamente como el usuario los pegó.
const lineasOriginales = texto.split(/\r?\n/);

  // 👉 Se convierte todo a mayúsculas. Evita errores al buscar textos (TR_, literales, etc.)
const traza = texto.toUpperCase();

  // 👉 Si no hay texto → error
if (!texto) {
  abrirPanelValidacion("Todavía no ha pegado trazas");
  return;
}
  
// 👉 Si no contiene TR_ → no es traza válida
if (!traza.includes("TR_")) {
  abrirPanelValidacion("Esto no es una traza válida");
  return;
}


// =====================================
// 🔴 DETECCIÓN DE EVENTOS TR_
// =====================================

// 👉 Paso 0: dividimos la traza en líneas (ANTES de usarla)
// 🔹 necesario para fase 9 (orden real)
const lineas = traza.split(/\r?\n/);

// 👉 Solo líneas SistraHelp: ignora notas del agente pegadas encima o entre eventos
const lineasTraza = lineas.filter(esLineaFormatoTrazaSistraHelp);
const trazaEstructurada = lineasTraza.join("\n");
const avisoMultiTramite = detectarTrazaMultiTramite(lineasTraza);

// 👉 Eventos TR_ ordenados cronológicamente (SistraHelp muestra lo más reciente primero)
const eventosCronologicos = ordenarEventosTrazaCronologicamente(lineasTraza);
const eventos = eventosCronologicos.map(entry => entry.evento);

// 👉 Último evento real del flujo (cronológico, no orden de pegado)
const ultimoEvento = eventos.length > 0
  ? eventos[eventos.length - 1]
  : null;


// 👉 Detectamos presencia básica (seguimos usando lógica actual)
const hayFRI = eventos.includes("TR_FRI");
const hayFRF = eventos.includes("TR_FRF");
const haySGI = eventos.includes("TR_SGI");
const haySGX = eventos.includes("TR_SGX");
const haySGO = eventos.includes("TR_SGO");
const hayREG = eventos.includes("TR_REG"); // 🔹 Registre tràmit (registrado)
const hayRGI = eventos.includes("TR_RGI"); // 🔹 Inici registre tràmit
const hayFIN = eventos.includes("TR_FIN"); // 🔹 Fi de tràmit (finalizado)

// 🔹 NUEVO: eventos para flujo visual
const eventosFlujo = {
  TR_FRI: hayFRI,
  TR_FRF: hayFRF,
  TR_SGI: haySGI,
  TR_SGX: haySGX,
  TR_SGO: haySGO,
  TR_RGI: hayRGI,
  TR_REG: hayREG,
  TR_FIN: hayFIN
};

  // =====================================
// 🔴 CONTEXTO DE FLUJO (PASO 1)
// =====================================
// 👉 NO sustituye lógica actual
// 👉 Solo encapsula el flujo en un objeto reutilizable

const contexto = {
  llegaFirma: haySGI,
  errorPreFirma: hayFRF && !haySGI,
  errorFirma: haySGX,
  firmaOK: haySGO,
  hayFinFormulario: hayFRF
};


// ─────────────────────────────
// 🔹 FASE DEL FLUJO (PASO 3)
// ─────────────────────────────
// Aquí damos un paso más: no solo booleanos,
// ahora clasificamos el estado del trámite en una "fase"
// Esto nos permitirá simplificar el árbol en siguientes versiones

// 👉 Fase basada en último evento (seguro)

// 🔹 PRIORIDAD: cómo ACABÓ el trámite manda sobre intentos previos de firma.
//    TR_SGO = firma OK (no implica trámite finalizado).
//    TR_FIN = fi de tràmit; TR_REG = registre tràmit (registrado).
if (hayFIN || haySGO || hayREG) {
  contexto.fase = "firma_ok";
}
else if (!ultimoEvento) {

  // 👉 No hay eventos → tratamos como pre_firma
  contexto.fase = "pre_firma";
}
else if (ultimoEvento === "TR_FRF") {
  contexto.fase = "pre_firma";
}
else if (ultimoEvento === "TR_SGX") {
  contexto.fase = "error_firma";
}
else if (ultimoEvento === "TR_SGI" && !haySGO && !hayFIN) {
  // 👉 Firma iniciada pero no completada (sin KO ni OK registrados)
  contexto.fase = "error_firma";
}
else {
  // 👉 fallback seguridad
  if (!contexto.llegaFirma) {
    contexto.fase = "pre_firma";
  } else if (contexto.errorFirma) {
    contexto.fase = "error_firma";
  } else {
    contexto.fase = "desconocida";
  }
}


  

// DEBUG para ver claramente en qué fase está cada traza
console.log("FASE:", contexto.fase);

  
  

// 🔍 DEBUG
console.log("CONTEXTO:", contexto);


// =====================================
// � HELPERS PUROS (sin duplicación)
// =====================================
// Funciones reutilizables para detectar tipos de error

const esErrorTecnicoHelper = (linea) => {
  return linea.includes("FLUXE") ||
         linea.includes("SESSIÓ") ||
         linea.includes("SESSION") ||
         linea.includes("EXCEPCIÓ") ||
         linea.includes("EXCEPTION") ||
         linea.includes("SAF_") ||
         linea.includes("ERROR") ||
         linea.includes("CLAVEFIRMA") ||
         linea.includes("CODI ERROR") ||
         linea.includes("PROVEÏDOR: CLAVEFIRMA") ||
         /403\s*FORBIDDEN/i.test(linea);
};

const esPosibleErrorFormularioHelper = (linea) => {
  return !linea.includes("TR_") &&
         !linea.includes("HTTP") &&
         !linea.includes("HTTPS") &&
         linea.length > MIN_LITERAL_LENGTH &&
         /[A-ZÀ-Ú]{3,}/.test(linea);
};


// =====================================
// 🔴 DETECCIÓN DE LITERALES (ERRORES)
// =====================================
// 👉 AQUÍ es donde se añaden nuevos textos de error
// 👉 SOLO modificar aquí para añadir nuevos literales
// 👉 NO tocar el resto del código

// 👉 Paso 1: filtramos solo líneas que contienen errores reales
// 🔹 ampliamos detección para cubrir casos de sesión, firma y técnicos

const lineasErrorEntries = lineasTraza
  .map(linea => {
    const indice = lineas.indexOf(linea);
    return { linea, original: lineasOriginales[indice] || linea };
  })
  .filter(entry => {
    if (esLineaMetodoFirma(entry.linea)) return false;
    const esErrorTecnico = esErrorTecnicoHelper(entry.linea);
    const esPosibleErrorFormulario = esPosibleErrorFormularioHelper(entry.linea);
    const esLiteralFirmaEnEvento = esLiteralFirmaEnEventoHelper(entry.linea);
    return esErrorTecnico || esPosibleErrorFormulario || esLiteralFirmaEnEvento;
  });

const lineasError = lineasErrorEntries.map(entry => entry.linea);

// 👉 Paso 2: eliminamos duplicados
// 🔹 nos quedamos solo con errores únicos
const erroresUnicos = [...new Set(lineasError)];
const erroresUnicosOriginales = [];
const seenLineas = new Set();
lineasErrorEntries.forEach(entry => {
  if (!seenLineas.has(entry.linea)) {
    seenLineas.add(entry.linea);
    erroresUnicosOriginales.push(entry.original);
  }
});


                                        

// ======================================================
// 👉 DETECCIÓN AVANZADA DE ERRORES REALES (FASE 10)
// ======================================================

// 👉 Detectamos Autofirma: subtipos (servidor, cliente, cancelada, entorno)
const hayAutofirmaFitxerBuit = lineasTraza.some(linea =>
  /FITXER SIGNAT.*BUIT|FICHIERO SIGNAT.*VAC|PLUGIN.*AUTOFIRMA|SIGNAT EST[AÁ] BUIT/i.test(linea)
);

const hayAutofirmaServidor = lineasTraza.some(linea => linea.includes("SAF_27"));

const hayMetodoFirmaAutofirmaEnKo = lineasTraza.some(linea =>
  esLineaFirmaKoHelper(linea) && esMetodoFirmaAutofirmaEnLineaHelper(linea)
);

const hayMetodoFirmaClaveEnKo = lineasTraza.some(linea =>
  esLineaFirmaKoHelper(linea) && esMetodoFirmaClaveEnLineaHelper(linea)
);

const hayErrorValidacionCertificado = lineasTraza.some(esErrorValidacionCertificadoFirmanteHelper);

// 👉 Cadena de certificación del certificado firmante no válida (InvalidCertificateChain).
//    Es del certificado del ciudadano (no de reinstalar Autofirma) -> revisar certificado en el equipo.
const hayErrorCadenaCertificacion = lineasTraza.some(esErrorCadenaCertificacionHelper);

// 👉 Firmó con un certificado de un NIF distinto al requerido (seleccionó otro certificado).
const hayErrorNifNoCoincide = lineasTraza.some(esErrorNifCertificadoNoCoincideHelper);
const lineaNifNoCoincide = hayErrorNifNoCoincide
  ? lineasTraza.find(esErrorNifCertificadoNoCoincideHelper)
  : null;
const nifsNoCoincide = lineaNifNoCoincide
  ? extraerNifsCertificadoNoCoincide(lineaNifNoCoincide)
  : { cert: null, requerido: null };

// 👉 Error "500 / servei de custodia" del proveedor de firma en un Firma KO (puntual, reintentar)
const hayFirma500Fitxers = lineasTraza.some(linea =>
  esLineaFirmaKoHelper(linea) && esLinea500FitxersHelper(linea)
);

// 👉 KO: timeout + cliente de firma no invocado (Autofirm@; frecuente iPhone/Safari)
const hayTimeoutClienteFirmaEnKo = lineasTraza.some(linea =>
  esLineaFirmaKoHelper(linea) &&
  /TIEMPO PARA FIRMAR|TEMPS PER A FIRMAR|EL TEMPS PER A FIRMAR/i.test(linea) &&
  /CLIENTE DE FIRMA|CLIENT DE FIRMA/i.test(linea)
);

const textoTrazaSinKo = textoLineasTrazaSinKo(lineasTraza);
const textoTrazaIniCar = textoLineasIniCar(lineasTraza);

const hayAutofirmaExplicitoFuerte = lineasTraza.some(linea =>
  /CLIENT(E)? DE FIRMA M[ÒOÓ]?VIL|FIRMA MOVIL|ERROR DE AUTOFIRMA O DEL CLIENTE DE FIRMA/i.test(linea) ||
  (/TIEMPO PARA FIRMAR|TEMPS PER A FIRMAR/i.test(linea) && /CLIENTE DE FIRMA|CLIENT DE FIRMA/i.test(linea)) ||
  /NO SE HA PODIDO ESTABLECER LA COMUNICACI|NO S['']HA POGUT ESTABLIR/i.test(linea) ||
  /NO SE PUDO CONECTAR CON EL SERVIDOR INTERMEDIO/i.test(linea) ||
  /ERROR DE AUTOFIRMA|ERROR D['']AUTOFIRMA|REBUT UN ERROR D['']AUTOFIRMA|RECIBIDO UN ERROR DE AUTOFIRMA/i.test(linea) ||
  /AI500001|OPERACI[OÓ]N CANCELADA POR EL USUARIO/i.test(linea) ||
  hayAutofirmaFitxerBuit && /AUTOFIRMA|PLUGIN/i.test(linea)
);

// Timeout sin mención a «cliente de firma», o módulo finalizado → solo si marcó certificado local
const hayAutofirmaExplicitoDebil = lineasTraza.some(linea =>
  (/TIEMPO PARA FIRMAR HA EXPIRADO|EL TEMPS PER A FIRMAR|TEMPS PER A FIRMAR/i.test(linea) &&
   !/CLIENTE DE FIRMA|CLIENT DE FIRMA/i.test(linea)) ||
  /MODUL.*FIRMA FINALITZAT INESPERADAMENT|MODULO DE FIRMA FINALIZADO/i.test(linea)
);

const hayAutofirmaExplicito = hayAutofirmaExplicitoFuerte || hayAutofirmaExplicitoDebil;

const hayClienteFirmaMovilEnTraza =
  /CLIENT(E)? DE FIRMA M[ÒOÓ]?VIL|FIRMA MOVIL|ERROR DE AUTOFIRMA O DEL CLIENTE DE FIRMA/i.test(trazaEstructurada);

const haySignaturaCancelada = lineasTraza.some(linea =>
  /SIGNATURA CANCEL|FIRMA CANCELADA|FIRMA CANCEL·LADA/i.test(linea)
);

const hayCanceladaConClave = lineasTraza.some(linea =>
  /SIGNATURA CANCEL|FIRMA CANCEL/i.test(linea) && esMetodoFirmaClaveEnLineaHelper(linea)
);

// hayCanceladaClaveFirmaEnKo se calcula más abajo (tras hayErrorClaveReal)

function resolverReglaAutofirmaCliente() {
  const soIniCar = detectarSoEnTextoTraza(textoTrazaIniCar);
  const soSinKo = detectarSoEnTextoTraza(textoTrazaSinKo);

  // 👉 Prioridad 1: selector del técnico + SO en TR_INI / TR_CAR (no en literal KO)
  if (metodoCert.checked && sisMovil && sisMovil.checked) {
    const soMovil = detectarSoMovilDesdePistas(soIniCar, soSinKo);
    if (soMovil) return reglaAutofirmaClientePorSo(soMovil);
    return "error_autofirma_cliente_movil";
  }
  if (metodoCert.checked && sisPC && sisPC.checked) {
    const soPc = detectarSoEscritorioDesdePistas(soIniCar, soSinKo);
    if (soPc) return reglaAutofirmaClientePorSo(soPc);
    return "error_autofirma_cliente_windows";
  }

  // 👉 Acceso Cl@ve marcado: SO desde acceso/traza sin KO; si no, acción genérica
  if (metodoClave.checked && !metodoCert.checked) {
    const so = soIniCar || soSinKo;
    const regla = reglaAutofirmaClientePorSo(so);
    if (regla) return regla;
    return "error_autofirma_cliente_generico";
  }

  // 👉 Sin selector: TR_CAR/INI, luego traza sin KO; Linux+solo SGI → Android mal reportado
  const so = soIniCar || soSinKo;
  if (so) return reglaAutofirmaClientePorSo(so);
  if (hayPatronSgiSinCierre && hayLinuxPosibleAndroid) {
    return "error_autofirma_cliente_android";
  }
  return "error_autofirma_cliente_windows";
}

// 👉 Cl@ve móvil explícitamente rechazada (literal en traza)
const hayClaveMovilNoPermitida = lineasTraza.some(linea =>
  /CLAVE[_\s]?MOVIL.*NO.*PERM[EE]/i.test(linea) ||
  /M[ÈE]TODE.*AUTENTICACI[OÓ].*CLAVE.*MOVIL.*NO/i.test(linea) ||
  (linea.includes("METODOAUTENTICACIONEXCEPTION") && /CLAVE.*MOVIL|CLAVE_MOVIL/i.test(linea))
);

// 👉 Acceso con Cl@ve móvil (si el detalle TR_INI/TR_CAR viene en la traza pegada)
const hayAccesoClaveMovilEnTraza =
  /CLAVE[_\s]?MOVIL/i.test(trazaEstructurada) &&
  (trazaEstructurada.includes("TR_INI") || trazaEstructurada.includes("TR_CAR"));

const numSGI = lineasTraza.filter(linea => /TR_SGI/.test(linea)).length;
const numSGX = lineasTraza.filter(linea => /TR_SGX/.test(linea)).length;

// 👉 Tras el último Firma KO cronológico, hay Inicio firma sin nuevo KO/OK/Fin
const hayIntentosPosterioresSinCierre = (() => {
  if (!eventosCronologicos.length) return false;
  let ultimoSgxTs = null;
  for (const entry of eventosCronologicos) {
    if (entry.evento === "TR_SGX" && entry.ts != null) ultimoSgxTs = entry.ts;
  }
  if (ultimoSgxTs == null) return false;
  const posteriores = eventosCronologicos.filter(e => e.ts != null && e.ts > ultimoSgxTs);
  return posteriores.some(e => e.evento === "TR_SGI") &&
    !posteriores.some(e => e.evento === "TR_SGX" || e.evento === "TR_SGO" || e.evento === "TR_FIN");
})();

// 👉 Firma iniciada pero sin Firma KO ni Firma OK ni Fin trámite (patrón típico Cl@ve móvil o FIRE no invoca)
const hayPatronSgiSinCierre = haySGI && !haySGX && !haySGO && !hayFIN;

// 👉 Linux en traza sin KO ni ANDROID explícito: en móvil suele reportarse como Linux (TR_CAR / Inicio firma)
const hayLinuxPosibleAndroid =
  /LINUX|UBUNTU|DEBIAN|FEDORA/.test(textoTrazaSinKo) && !/ANDROID/.test(textoTrazaSinKo);

// 👉 Detectamos códigos reales de Cl@ve
// 🔹 estos SIEMPRE indican proveedor Cl@ve

// 👉 Detectamos códigos reales de Cl@ve (FASE 10)
// 🔹 patrón completo: Codi Error + Proveedor clavefirma + Tipus Resultat

// ======================================================
// 👉 DETECCIÓN REAL CL@VE CON ORDEN (FASE 10 PRO)
// ======================================================


// 👉 Buscamos la PRIMERA aparición real en la traza
// 🔹 usamos lineas (NO erroresUnicos) para respetar orden real

let lineaErrorClave = null;

// 👉 recorrer desde el final (último evento real)
for (let i = 0; i < lineasTraza.length; i++) {
  const linea = lineasTraza[i];

  if (
    linea.includes("CLAVEFIRMA") &&
    linea.includes("ERROR")
  ) {
    lineaErrorClave = linea;
    break;
  }
}



// 👉 Extraemos código real detectado
let codigoClaveDetectado = null;
let tipusResultatDetectado = null;

if (lineaErrorClave) {
console.log("LINEA:", lineaErrorClave);
console.log("CODIGO:", codigoClaveDetectado);
console.log("TIPO:", tipusResultatDetectado);

const matchCodigo = lineaErrorClave.match(/ERROR:\s*(\d+)/);
const matchTipus = lineaErrorClave.match(/(?:TIPUS\s+)?RESULTAT\s*:\s*(\d+)/i)
  || lineaErrorClave.match(/RESULTAD[OA]?\s*:\s*(\d+)/i);
           
if (matchCodigo) {
  codigoClaveDetectado = matchCodigo[1];
}

if (matchTipus) {
  tipusResultatDetectado = matchTipus[1];
}
}


// 👉 Flag final
const hayErrorClaveReal = !!codigoClaveDetectado;

// 👉 Firma KO cancelada con Cl@veFirm@ (sin código 8–15): no es Autofirma
const hayCanceladaClaveFirmaEnKo =
  haySGX && !hayErrorClaveReal &&
  (hayCanceladaConClave || (haySignaturaCancelada && hayMetodoFirmaClaveEnKo));

const hayErrorQaaRecarga = lineasTraza.some(linea =>
  /QAARECARGATRAMITE|NIVELL DE QAA|NIVEL DE QAA/i.test(linea)
);


// 👉 403 en formulario externo: no define la regla; solo enriquece acción/mail si hay fallo_formulario
const hayError403FormularioExterno = lineasTraza.some(linea =>
  /403\s*FORBIDDEN/i.test(linea)
);

// 👉 Detectamos errores reales de Portafib / sesión (solo literales acordados, no sesión cliente)
const hayErrorPortafibReal = erroresUnicos.some(linea =>
  /FLUXE NO ES V[ÀA]LID/i.test(linea) ||
  /EXCEPCI[ÓO].*GENERAR SESSI[ÓO].*FIRMA/i.test(linea) ||
  /EXCEPCI[ÓO]\s+SESSI[ÓO]\s+FIRMA/i.test(linea) ||
  linea.includes("TIMESTAMPINVALIDEXCEPTION") ||
  linea.includes("TRASLLAT NO")
);

  

 
// =====================================
// 🔴 MÉTODO UTILIZADO (selector UI)
// =====================================
// 👉 Desempate y SO para mails Autofirma. Si el Firma KO trae
//    «Método de firma: Autofirm@ / Cl@veFirm@», ese literal manda sobre el selector.
// 👉 Los códigos Cl@ve (8-15, 101, 103…) se detectan por literales del KO, no por este selector.

const esClave = metodoClave.checked;
const esCert = metodoCert.checked;

const hayDiscrepanciaAccesoClaveFirmaAutofirma =
  (esClave && !esCert && hayMetodoFirmaAutofirmaEnKo) ||
  /ACCEDE.*CLAVE.*AUTOFIRMA|ACCESO.*CLAVE.*AUTOFIRMA|CLAVE PERMANENT.*AUTOFIRMA|CLAVE PERMANENT.*FIRM.*AUTOFIRMA/i.test(trazaEstructurada);

function textoDiscrepanciaClaveAutofirmaEnFlujo() {
  if (esClave && !esCert && hayMetodoFirmaAutofirmaEnKo) {
    return " El técnico ha marcado Método Cl@ve, pero la firma se intentó con certificado/AutoFirma.";
  }
  if (hayDiscrepanciaAccesoClaveFirmaAutofirma) {
    return " Acceso con Cl@ve, firma con certificado/AutoFirma.";
  }
  return "";
}

// Cancelada sin código Cl@ve → entorno Autofirma (certificado local), no Cl@ve Firma
const hayCanceladaAutofirma = haySignaturaCancelada && !hayCanceladaConClave && !hayErrorClaveReal &&
  (hayMetodoFirmaAutofirmaEnKo || esCert ||
   lineasTraza.some(l => /SIGNATURA CANCEL|FIRMA CANCEL/i.test(l) && /AUTOFIRM@/i.test(l)));

const hayIndiciosAutofirma = hayAutofirmaServidor || hayAutofirmaExplicitoFuerte ||
  hayMetodoFirmaAutofirmaEnKo || hayCanceladaAutofirma || hayAutofirmaFitxerBuit ||
  (hayAutofirmaExplicitoDebil && esCert && !esClave);

const hayAutofirmaError = hayAutofirmaServidor;


  
// ==========================================================================
// 🔴 ÁRBOL DE DECISIÓN DEL FLUJO
// ==========================================================================
// 👉 EL CEREBRO - AQUÍ se decide qué regla aplicar en función del flujo + contexto
// 👉 Para añadir nuevas reglas:
//    1. Añadir condición en este árbol
//    2. Crear la regla correspondiente en acciones.json con el mismo id

let idReglaDetectada = null;


// ===============================
// 🔹 NIVEL 1 → ¿LLEGA A FIRMA?
// ===============================

// ===============================
// 🔹 DECISIÓN POR FASE (PASO 4)
// ===============================
// Ahora el árbol deja de depender de mil condiciones
// y pasa a trabajar por "fase del flujo"
// → más claro, más mantenible, menos errores

if (contexto.fase === "pre_firma") {

  // ======================================================
  // FASE: PRE_FIRMA (antes de invocar el sistema de firma)
  // ======================================================
  // Detecta: problemas de formulario o errores de sesión/Portafib
  // Ejemplos: validación fallida, error de sesión, flujo incorrecto
  // 👉 MEJORA FORMULARIO vs PORTAFIB (FASE 10)


// 👉 Contamos intentos de formulario
// 🔹 si hay varios TR_FRI o TR_FRF → el usuario está reintentando

const numFRI = eventos.filter(e => e === "TR_FRI").length;
const numFRF = eventos.filter(e => e === "TR_FRF").length;


// 👉 Caso: NO llega a firma (pre_firma)
// 🔹 Sin TR_FRI → formulario (aunque aparezca «El fluxe no es vàlid»); Portafib solo si hubo Inicio formulario

if (!haySGI && !hayFRI) {

  idReglaDetectada = "fallo_formulario";

}
else if (!haySGI && hayErrorPortafibReal){

  // 👉 Error técnico REAL de sesión/flujo (Portafib)
  // 🔹 hay literales tipo FLUXE, SESSION, 227, timestamp…
  idReglaDetectada = "fallo_portafib";

}
else if (!haySGI && (numFRI > 1 || numFRF > 1)) {

  // 👉 Reintentos de formulario SIN errores técnicos
  // 🔹 el usuario vuelve atrás o intenta varias veces
  // 🔹 esto es fallo funcional del formulario (NO Portafib)
  idReglaDetectada = "fallo_formulario";

}
else {

  // 👉 Caso base: no llega a firma sin errores claros
  // 🔹 se trata también como formulario
  idReglaDetectada = "fallo_formulario";
}

} else if (contexto.fase === "error_firma") {

  // ======================================================
  // FASE: ERROR_FIRMA (llegó a firma pero falló)
  // ======================================================
  // Detecta: qué proveedor causó el fallo (Autofirma, Cl@ve, FIRE)
  // Ejemplos: certificado bloqueado, contraseña incorrecta, error técnico
  // 👉 Prioridad: Autofirma > Cl@ve > FIRE

 // 👉 Primero comprobamos si el error es de Autofirma (SAF_27)
// 🔹 PRIORIDAD: si aparece SAF_27, SIEMPRE es Autofirma
// 🔹 aunque el técnico haya marcado Cl@ve

// 👉 PRIORIDAD REAL DE ERRORES (FASE 10)
  const ultimaLineaKo = obtenerUltimaLineaFirmaKoCronologica(lineasTraza);
  const reglaUltimoKo = ultimaLineaKo ? inferirReglaDesdeLineaKo(ultimaLineaKo) : null;
  const koPosteriorDistintoDeClaveCodigo =
    hayErrorClaveReal &&
    reglaUltimoKo &&
    (/^error_autofirma/.test(reglaUltimoKo) || reglaUltimoKo === "error_clave_firma_cancelada");

// 👉 Autofirma servidor (SAF_27) SIEMPRE gana
if (hayAutofirmaError) {

  idReglaDetectada = "error_autofirma_servidor";

}
else if (hayErrorNifNoCoincide &&
         (reglaUltimoKo === "error_certificado_nif_no_coincide" ||
          (!hayErrorCadenaCertificacion && !hayErrorValidacionCertificado))) {

  // 👉 Firmó con un certificado de OTRO NIF (seleccionó el certificado equivocado).
  //    Solo manda si es el ÚLTIMO Firma KO, o si no hay cadena/validación en la traza.
  //    Si el NIF fue un intento puntual y el último KO es de cadena/validación, gana ese
  //    (problema persistente/actual); el NIF se refleja como nota en la acción de cadena.
  idReglaDetectada = "error_certificado_nif_no_coincide";

}
else if (hayErrorValidacionCertificado) {

  // 👉 @firma no validó el certificado (InvalidNotSignerCertificate). Escala Portafib, no entorno local.
  idReglaDetectada = "error_validacion_certificado";

}
else if (hayErrorCadenaCertificacion) {

  // 👉 Cadena de certificación del certificado firmante no válida (InvalidCertificateChain).
  //    Va ANTES de la rama de cliente Autofirma: aunque el KO diga "Método de firma: Autofirm@",
  //    reinstalar Autofirma no lo arregla; el problema es el certificado del ciudadano.
  idReglaDetectada = "error_cadena_certificacion";

}
else if (hayClaveMovilNoPermitida) {

  idReglaDetectada = "error_clave_movil_no_permitida";

}
else if (koPosteriorDistintoDeClaveCodigo) {

  // 👉 Tras un error Cl@ve con código, reintento con otro método: manda el último Firma KO
  idReglaDetectada = reglaUltimoKo;

}
else if (hayErrorClaveReal) {

// 🔹 PRIORIDAD: 103 SIEMPRE por encima de 8–15
if (codigoClaveDetectado === "103") {

  // 🔹 103-15 → certificado bloqueado
  if (tipusResultatDetectado === "15") {
    idReglaDetectada = "error_clave_103_15";
  }

  // 🔹 103 → contraseña bloqueada
  else {
    idReglaDetectada = "error_clave_103";
  }

}

// 🔹 Códigos 8–15 → error Cl@ve individual
else if (/^(8|9|10|11|12|13|14|15)$/.test(codigoClaveDetectado)) {

  idReglaDetectada = "error_clave_8_15";

}
  // 🔹 101 → nivel insuficiente / registro no válido
  else if (codigoClaveDetectado === "101") {

    idReglaDetectada = "error_clave_101";

  }

  // 🔹 104 → registro débil
  else if (codigoClaveDetectado === "104") {

    idReglaDetectada = "error_clave_104";

  }

}

else if (hayCanceladaClaveFirmaEnKo) {

  idReglaDetectada = "error_clave_firma_cancelada";

}
else if (hayFirma500Fitxers) {

  // 👉 Solo "500 / servei de custodia" (VALIDATION y codigos Cl@ve ya se resolvieron antes):
  //    error puntual del servicio de firma. No es del ciudadano ni Portafib -> reintentar.
  idReglaDetectada = "error_firma_fitxers_500";

}
else if (hayAutofirmaFitxerBuit) {

  idReglaDetectada = resolverReglaAutofirmaCliente();

}
else if (hayAutofirmaExplicitoFuerte || hayMetodoFirmaAutofirmaEnKo) {

  idReglaDetectada = resolverReglaAutofirmaCliente();

}
else if (esCert && !esClave && hayAutofirmaExplicitoDebil) {

  idReglaDetectada = resolverReglaAutofirmaCliente();

}
else if (hayCanceladaAutofirma) {

  idReglaDetectada = "error_autofirma_cancelada";

}
else if (esClave && !esCert && haySGX && !hayErrorClaveReal) {

  // 👉 KO en firma sin código Cl@ve: desempate por método marcado (no Autofirma por timeout ambiguo)
  idReglaDetectada = "error_clave_movil";

}
else if (hayPatronSgiSinCierre) {

  // 👉 Solo TR_SGI (reintentos) sin TR_SGX ni TR_SGO: Cl@ve móvil o entorno FIRE/Autofirma.
  //    Desempate: método marcado por el técnico (acceso ≠ firma, pero orienta el mail).
  if (esCert && !esClave) {
    idReglaDetectada = "error_autofirma_entorno";
  } else {
    idReglaDetectada = "error_clave_movil";
  }

}
else if (esCert && !hayMetodoFirmaClaveEnKo && !hayCanceladaConClave) {

  idReglaDetectada = resolverReglaAutofirmaCliente();

}
  
}

// 👉 Fase firma incompleta aunque el último evento no sea TR_SGI (p. ej. varios SGI al final)
else if (contexto.fase === "desconocida" && hayPatronSgiSinCierre) {

  if (esCert && !esClave) {
    idReglaDetectada = "error_autofirma_entorno";
  } else if (esClave) {
    idReglaDetectada = "error_clave_movil";
  }

}


else if (contexto.fase === "firma_ok") {

  // ======================================================
  // FASE: FIRMA_OK / CIERRE (firma OK y/o registro y/o fin trámite)
  // ======================================================
  // TR_SGO → firma correcta; TR_REG → registrado; TR_FIN → finalizado; ambos → completo

  if (hayFIN && hayREG) {
    idReglaDetectada = "tramite_completo";
  } else if (hayFIN) {
    idReglaDetectada = "tramite_finalizado";
  } else if (hayREG) {
    idReglaDetectada = "tramite_registrado";
  } else if (hayErrorPortafibReal) {
    idReglaDetectada = "firma_correcta_portafib";
  } else if (haySGO) {
    idReglaDetectada = "firma_correcta";
  } else {
    idReglaDetectada = "firma_correcta";
  }

}



// ==========================================================================
// ✅ FIN ÁRBOL DE DECISIÓN DEL FLUJO
// ==========================================================================


// 🔎 DEBUG FINAL (NO TOCAR)
console.log("Regla detectada:", idReglaDetectada);

  

// =====================================
// 🔴 TODO OK - MOSTRAR RESULTADOS EN PANTALLA
// =====================================

  cerrarPanelFunc();                                                           // 👉 Se oculta el panel de validación
  placeholder.style.display = "none";                                          // 👉 Se oculta el mensaje inicial
  document.getElementById("resultado").style.display = "block";

  

  
// =====================================
// 🔴 GENERACIÓN DE RESULTADOS
// =====================================
// 👉 A partir de aquí se muestra la información al usuario
// 👉 Incluye:
//    - diagnóstico técnico (TR_)
//    - acción recomendada
//    - texto para CAI

// ✅ VERIFICACIÓN JSON para comprobar en consola que el JSON se ha cargado correctamente
console.log("JSON disponible:", accionesJSON);



// =====================================
// 🔴 DIAGNÓSTICO TÉCNICO (TR_)
// =====================================

// 👉 Muestra el estado de cada evento TR_. SOLO diagnóstico técnico, NO interpretación funcional
// 👉 SOLO diagnóstico técnico (lo que ha pasado en el sistema) 👉 NO interpreta el error (eso se hace en el árbol)


// =====================================
// 🔴 DIAGNÓSTICO TÉCNICO (TR_)
// =====================================

let diagnosticoTexto = "";

// 🔹 Frase explicativa del diagnóstico (se muestra dentro del recuadro de la acción)
let fraseDiagnostico = "";

// 🔹 Cartel del veredicto (Fallo Formulario / Fallo Portafib / Error Cl@ve…) dentro de la tarjeta del flujo
let cartelDiagnostico = "";

// Helper: cartel azul estándar (mismo estilo en todos los casos)
function cartelAzul(texto) {
  return "<div style=\"display:inline-block;background:#e7f0fb;color:#1456b8;border:1px solid #1456b8;border-radius:8px;padding:5px 12px;font-weight:600;font-size:13px;\">" + texto + "</div>";
}

// Helper: literal técnico en gris pequeño (dentro de la frase del flujo)
function literalFlujo(texto) {
  return "<span style=\"color:#9a9890;font-size:11px;\">\"" + texto + "\"</span>";
}

// 🔹 El flujo en texto se eliminó: ahora el flujo se muestra solo con el flujo visual (píldoras).


           
           
// 👉 Interpretación técnica del fallo
// 🔹 Añadimos caso especial: SAF_27 SIEMPRE es Autofirma

if (!haySGI) {

  if (idReglaDetectada === "fallo_portafib") {

    cartelDiagnostico = cartelAzul("Fallo Portafib");
    fraseDiagnostico = "La firma no se inicia por un error de flujo.";

  } else if (!hayFRI) {

    cartelDiagnostico = cartelAzul("Fallo Formulario");
    fraseDiagnostico = "No hay Inicio formulario en la traza: el trámite no llega a abrir el formulario.";
    if (hayError403FormularioExterno) {
      fraseDiagnostico += " Error al cargar el formulario externo ("
        + literalFlujo("403 Forbidden") + ").";
    }

  } else {

    cartelDiagnostico = cartelAzul("Fallo Formulario");
    fraseDiagnostico = "La firma no se inicia, y no hay errores de flujo " + literalFlujo("Fluxe no vàlid") + ".";
  }

}
else if (idReglaDetectada === "error_clave_movil" || idReglaDetectada === "error_clave_movil_no_permitida") {

  if (idReglaDetectada === "error_clave_movil" && haySGX) {
    cartelDiagnostico = cartelAzul("Cl@ve");
  } else if (
    idReglaDetectada === "error_clave_movil" &&
    hayPatronSgiSinCierre &&
    !hayAccesoClaveMovilEnTraza
  ) {
    // Patrón SGI sin cierre sin método en la traza: ambiguo Cl@ve móvil / Autofirma Android
    cartelDiagnostico = cartelAzul("Cl@ve móvil o Autofirma Android");
  } else {
    cartelDiagnostico = cartelAzul("Cl@ve móvil");
  }

  if (idReglaDetectada === "error_clave_movil_no_permitida") {
    fraseDiagnostico = "Cl@ve Móvil no está permitida para firmar en este trámite.";
  } else {
    const reintentos = numSGI > 1 ? " (" + numSGI + " intentos)" : "";
    let frase = "La firma se inicia" + reintentos + " pero no se completa: no hay Firma KO ni Firma OK en la traza.";
    if (haySGX && haySignaturaCancelada && !hayErrorClaveReal) {
      frase = "La firma se inicia pero falla con Signatura cancel·lada, sin código de error Cl@ve (8–15, 101, 103…).";
      if (/TIEMPO PARA FIRMAR|TEMPS PER A FIRMAR/i.test(trazaEstructurada)) {
        frase += " La traza también menciona timeout o cliente de firma: valorar si el método de firma real fue certificado (AutoFirma).";
      }
    } else if (haySGX && !haySGO && !hayFIN) {
      frase = "La firma se inicia pero falla en Cl@ve sin código de error reconocido en la traza.";
    }
    if (hayAccesoClaveMovilEnTraza) {
      frase += " Se detecta acceso con " + literalFlujo("CLAVE_MOVIL") + ".";
    } else if (haySGX && !haySignaturaCancelada) {
      frase += " Revisar en SistraHelp el último acceso al trámite (doble clic en Inicio trámite o Carga del trámite): si figura CLAVE_MOVIL.";
    }
    if (esCert && !esClave) {
      frase += " Si el acceso fue con certificado, valorar entorno Autofirma/FIRE.";
    }
    if (ultimoEvento === "TR_SGI" && !haySGO && !hayFIN && haySGX) {
      frase += " Los últimos intentos quedaron solo en Inicio firma.";
    }
    if (hayPatronSgiSinCierre && !haySGX) {
      frase += " " + NOTA_CARPETA_CLAVE_MOVIL_SIN_SELECTOR;
    }
    fraseDiagnostico = frase;
  }

}
else if (idReglaDetectada === "error_clave_firma_cancelada") {

  cartelDiagnostico = cartelAzul("Cl@ve");
  let frase = "Signatura cancel·lada con Cl@ve Permanente ("
    + literalFlujo("Método de firma: Cl@veFirm@") + " en el Firma KO). "
    + "Sin código Cl@ve (8–15 u otro) en la traza.";
  if (hayAccesoClaveMovilEnTraza) {
    frase += " Acceso con " + literalFlujo("CLAVE_MOVIL") + " en la traza.";
  }
  if (esCert && !esClave) {
    frase += " El KO indica Cl@ve, no certificado local / AutoFirma.";
  }
  if (hayIntentosPosterioresSinCierre) {
    frase += " Tras el Firma KO, los intentos posteriores quedaron solo en Inicio firma.";
  }
  if (hayErrorQaaRecarga) {
    frase += " También aparece error de nivel QAA superior al del usuario autenticado.";
  }
  fraseDiagnostico = frase;

}
else if (idReglaDetectada && idReglaDetectada.indexOf("error_clave") === 0) {

  // 👉 Errores de Cl@ve con código (8–15, 101, 103, 103-15, 104)
  cartelDiagnostico = cartelAzul("Error Cl@ve");

  // Texto del código según la regla detectada
  let codigoTexto;
  switch (idReglaDetectada) {
    case "error_clave_8_15":   codigoTexto = "código 8–15"; break;
    case "error_clave_101":    codigoTexto = "código 101"; break;
    case "error_clave_103":    codigoTexto = "código 103"; break;
    case "error_clave_103_15": codigoTexto = "código 103-15"; break;
    case "error_clave_104":    codigoTexto = "código 104"; break;
    default:                   codigoTexto = "código " + (codigoClaveDetectado || "?");
  }

  fraseDiagnostico = "La firma se inicia pero falla en Cl@ve (" + codigoTexto + ").";

}
else if (idReglaDetectada === "error_validacion_certificado") {

  const firmaClaveEnKo = hayMetodoFirmaClaveEnKo;
  const firmaCertEnKo = hayMetodoFirmaAutofirmaEnKo;
  cartelDiagnostico = cartelAzul(firmaClaveEnKo ? "Validación @firma / Cl@ve" :
    firmaCertEnKo ? "Validación @firma / FIRE" : "Validación @firma");
  let motivo = "Fallo en la validación del certificado del firmante (@firma). "
    + literalFlujo("InvalidNotSignerCertificate") + ". ";
  if (firmaClaveEnKo) {
    motivo += literalFlujo("Método de firma: Cl@veFirm@") + " en el Firma KO. "
      + "Firma con Cl@ve Permanente: el fallo está en la validación del certificado en servidor (@firma), no en las credenciales Cl@ve del ciudadano.";
    if (esCert && !esClave) {
      motivo += " El KO indica Cl@ve Permanente, no certificado local / FIRE.";
    }
  } else if (firmaCertEnKo) {
    motivo += literalFlujo("Método de firma: Autofirm@") + " en el Firma KO. "
      + "Certificado local (FIRE): no orientar reinstalar AutoFirma como primera acción.";
    if (esClave && !esCert) {
      motivo += " El KO indica certificado local, no Cl@ve Permanente.";
    }
  } else if (esClave && !esCert) {
    motivo += "Contexto Cl@ve Permanente. Confirmar método en el detalle del Firma KO si no aparece al pegar la traza.";
  } else if (esCert && !esClave) {
    motivo += "Contexto certificado local / FIRE. Confirmar método en el detalle del Firma KO si no aparece al pegar la traza.";
  } else {
    motivo += "Confirmar método de firma en el detalle del Firma KO (doble clic en SistraHelp).";
  }
  fraseDiagnostico = motivo;

}
else if (idReglaDetectada === "error_certificado_nif_no_coincide") {

  cartelDiagnostico = cartelAzul("Certificado de otro NIF");
  let frase = "Firma KO: se firmó con un certificado de un NIF distinto al requerido por el trámite";
  if (nifsNoCoincide.cert && nifsNoCoincide.requerido) {
    frase += " (certificado: " + nifsNoCoincide.cert + " · requerido: " + nifsNoCoincide.requerido + ")";
  }
  frase += ". El ciudadano ha seleccionado otro certificado (típico en equipos compartidos o con varios certificados en el almacén). "
    + "No es un problema de la plataforma ni de Portafib: indicar que elija su propio certificado al firmar.";
  fraseDiagnostico = frase;

}
else if (idReglaDetectada === "error_cadena_certificacion") {

  const firmaCertEnKo = hayMetodoFirmaAutofirmaEnKo;
  cartelDiagnostico = cartelAzul(firmaCertEnKo ? "Certificado (cadena)" : "Certificado (cadena)");
  let frase = "Firma KO por "
    + literalFlujo("La cadena de certificación del certificado firmante no es válida")
    + " (InvalidCertificateChain). El problema está en el certificado del ciudadano, no en Autofirma: "
    + "revisar el certificado en el equipo (cadena de CA completa, CA reconocida, vigencia, revocación y almacén correcto). "
    + "No orientar a reinstalar AutoFirma como primera acción.";
  if (firmaCertEnKo) {
    frase += " El KO indica " + literalFlujo("Método de firma: Autofirm@") + " (certificado local).";
  }
  fraseDiagnostico = frase;

}
else if (idReglaDetectada === "error_firma_fitxers_500") {

  cartelDiagnostico = cartelAzul("Servicio de firma");
  let frase = "Firma KO con "
    + literalFlujo("Error general durant el procés de firma dels fitxers: 500")
    + ": error puntual del servicio / proveedor de firma. No es de las credenciales del ciudadano ni de Portafib.";
  if (numSGX > 1) {
    frase += " Se repite en " + numSGX + " intentos de firma.";
  }
  frase += " Indicar al ciudadano que reintente pasados unos minutos (o más tarde con Cl@ve Permanente).";
  fraseDiagnostico = frase;

}
else if (idReglaDetectada === "error_autofirma_servidor") {

  cartelDiagnostico = cartelAzul("Autofirma");
  fraseDiagnostico = "Hay un Firma KO con SAF_27 (error durante la firma del lote): problema en fase de firma. "
    + "En la mayoría de casos es un problema de AutoFirma (instalación defectuosa, no accede a clave privada). "
    + "Pocas veces suele ser problema de Portafib o del proveedor de firma.";

}
else if (idReglaDetectada === "error_autofirma_cancelada") {

  cartelDiagnostico = cartelAzul("Autofirma");
  fraseDiagnostico = "Problema con el cliente de firma Autofirma (firma cancelada). "
    + "Suele deberse a timeout, SSL o fallo de comunicación con AutoFirma.";
  if (hayErrorClaveReal) {
    fraseDiagnostico += " En intentos anteriores apareció error Cl@ve (código "
      + textoResumenCodigoClaveDetectado(codigoClaveDetectado, tipusResultatDetectado) + ").";
  }

}
else if (idReglaDetectada === "error_autofirma_entorno") {

  cartelDiagnostico = cartelAzul("Autofirma / FIRE");
  const reintentos = numSGI > 1 ? " (" + numSGI + " intentos)" : "";
  fraseDiagnostico = "Problema con el cliente de firma Autofirma (sin cierre). La firma se inicia"
    + reintentos + " pero no se completa: no hay Firma KO ni Firma OK. "
    + "Posible bloqueo de invocación FIRE/AutoFirma (proxy, VPN, navegador).";
  if (hayPatronSgiSinCierre) {
    fraseDiagnostico += " " + NOTA_CARPETA_CLAVE_MOVIL_SIN_SELECTOR;
  }

}
else if (idReglaDetectada && idReglaDetectada.indexOf("error_autofirma_cliente") === 0) {

  cartelDiagnostico = cartelAzul("Autofirma");
  const analisisKoAutofirma = analizarTiposFalloKoAutofirma(lineasTraza);
  let motivo = "Problema con el cliente de firma Autofirma ("
    + analisisKoAutofirma.etiqueta + ").";
  const numTiposDistintos = Object.keys(analisisKoAutofirma.counts).length;
  if (numTiposDistintos > 1) {
    motivo += " Varios tipos de Firma KO en la traza ("
      + textoResumenTiposFalloKoAutofirma(analisisKoAutofirma.counts)
      + "): se indica el más frecuente.";
    if (analisisKoAutofirma.ultimoTipo && analisisKoAutofirma.ultimoTipo !== analisisKoAutofirma.etiqueta) {
      motivo += " El último Firma KO cronológico es " + analisisKoAutofirma.ultimoTipo + ".";
    }
  }
  if (hayMetodoFirmaAutofirmaEnKo) {
    motivo += " " + literalFlujo("Método de firma: Autofirm@") + " en el Firma KO.";
  }
  if (hayDiscrepanciaAccesoClaveFirmaAutofirma) {
    motivo += textoDiscrepanciaClaveAutofirmaEnFlujo();
  }
  if (!hayMetodoFirmaAutofirmaEnKo && haySignaturaCancelada && !/timeout/i.test(motivo)) {
    motivo += " También aparecen firmas canceladas en la traza.";
  } else if (!hayMetodoFirmaAutofirmaEnKo && haySignaturaCancelada) {
    motivo += " También hubo firmas canceladas en otros intentos.";
  }
  if (hayPatronSgiSinCierre) {
    motivo += " Los intentos quedaron solo en Inicio firma, sin Firma KO ni Firma OK.";
  } else if (hayIntentosPosterioresSinCierre) {
    if (numSGX > 1) {
      motivo += " Hubo " + numSGX + " Firma KO con el mismo error.";
    }
    motivo += " Tras el último Firma KO, los intentos posteriores quedaron solo en Inicio firma, sin Firma KO ni Firma OK.";
  } else if (ultimoEvento === "TR_SGI" && !haySGO && !hayFIN && numSGI > 1) {
    motivo += " Los últimos intentos quedaron solo en Inicio firma, sin Firma KO ni Firma OK.";
  }
  if (
    haySignaturaCancelada &&
    !hayMetodoFirmaAutofirmaEnKo &&
    !hayMetodoFirmaClaveEnKo &&
    esCert &&
    !esClave
  ) {
    motivo += " Confirmar método de firma en el detalle del Firma KO (doble clic en SistraHelp).";
  } else if (
    hayAccesoClaveMovilEnTraza &&
    hayMetodoFirmaAutofirmaEnKo &&
    esCert &&
    !esClave
  ) {
    motivo += " Acceso con Cl@ve móvil en Inicio/Carga del trámite; firma con certificado (Autofirm@).";
  }
  if (hayClienteFirmaMovilEnTraza && metodoCert.checked && sisPC && sisPC.checked) {
    motivo += " Confirmar SO en TR_CAR (el literal KO puede decir «móvil» aunque firme desde ordenador).";
  }
  if (esClave && !esCert && hayAutofirmaExplicitoFuerte && !hayDiscrepanciaAccesoClaveFirmaAutofirma) {
    motivo += " La traza apunta a certificado/AutoFirma aunque el acceso marcado sea Cl@ve.";
  }
  fraseDiagnostico = motivo;

}
else if (idReglaDetectada === "error_fire") {

  cartelDiagnostico = cartelAzul("FIRE / certificado");
  fraseDiagnostico = "La firma se inicia pero falla con certificado local (FIRE), sin literales de Cl@ve ni Autofirma.";

}
else if (idReglaDetectada === "tramite_completo") {

  cartelDiagnostico = cartelAzul("Trámite completo");
  fraseDiagnostico = "Consta registro ("
    + literalFlujo("TR_REG — Registre tràmit") + ") y fin de trámite ("
    + literalFlujo("TR_FIN — Fi de tràmit") + ") en la traza.";
  if (haySGO) {
    fraseDiagnostico += " También aparece Firma OK (TR_SGO).";
  }
  if (hayRGI) {
    fraseDiagnostico += " Inicio de registro (TR_RGI) presente.";
  }

}
else if (idReglaDetectada === "tramite_finalizado") {

  cartelDiagnostico = cartelAzul("Fin trámite");
  fraseDiagnostico = "Aparece "
    + literalFlujo("TR_FIN — Fi de tràmit") + " en la traza.";
  if (!hayREG) {
    fraseDiagnostico += " No consta "
      + literalFlujo("TR_REG — Registre tràmit") + " (registro).";
  }
  if (haySGO) {
    fraseDiagnostico += " Firma OK (TR_SGO) presente.";
  }

}
else if (idReglaDetectada === "tramite_registrado") {

  cartelDiagnostico = cartelAzul("Registro OK");
  fraseDiagnostico = "Aparece "
    + literalFlujo("TR_REG — Registre tràmit") + " en la traza.";
  if (!hayFIN) {
    fraseDiagnostico += " No consta "
      + literalFlujo("TR_FIN — Fi de tràmit") + " (finalizado).";
  }
  if (haySGO) {
    fraseDiagnostico += " Firma OK (TR_SGO) presente.";
  }

}
else if (idReglaDetectada === "firma_correcta") {

  cartelDiagnostico = cartelAzul("Firma OK");
  fraseDiagnostico = "Aparece Firma OK (TR_SGO) en la traza.";
  if (!hayFIN && !hayREG) {
    fraseDiagnostico += " No consta fin de trámite (TR_FIN) ni registro (TR_REG): el trámite no aparece cerrado administrativamente.";
  }

}
else if (idReglaDetectada === "firma_correcta_portafib") {

  cartelDiagnostico = cartelAzul("Firma OK / Portafib");
  fraseDiagnostico = "Aparece Firma OK (TR_SGO) en la traza, con error de Portafib previo.";
  if (!hayFIN && !hayREG) {
    fraseDiagnostico += " No consta TR_FIN ni TR_REG en la traza.";
  }

}
else if (haySGX && !haySGO && !hayFIN && !cartelDiagnostico) {

  // 👉 Error proveedor genérico (solo si no hay cartel ya asignado, p. ej. Cl@ve)
  // 🔹 Solo si la firma NO acabó OK y el trámite NO se finalizó: así un TR_SGX
  //    que fue solo un reintento cancelado no se diagnostica como fallo.
  diagnosticoTexto += "- La firma se inicia pero falla en el sistema de firma.\n";

}
else if (haySGO && !cartelDiagnostico) {

  cartelDiagnostico = cartelAzul("Firma OK");
  fraseDiagnostico = "Aparece Firma OK (TR_SGO) en la traza.";

}
 


  
  

// =====================================
// 🔴 ACCIÓN RECOMENDADA
// =====================================


  console.log("haySGI:", haySGI, "haySGX:", haySGX, "haySGO:", haySGO);    // 🔍 DEBUG DEL FLUJO 👉 Permite ver en consola qué está pasando


// =====================================
// 🔴 CONTROL POR REGLA (GENÉRICO)
// =====================================
// 👉 Aplica automáticamente cualquier acción definida en acciones.json

// 👉 Construimos la salida final partiendo del diagnóstico
let salidaFinal = diagnosticoTexto;

// 👉 Si hay una acción detectada, la añadimos
if (idReglaDetectada && accionesJSON && accionesJSON.acciones) {

  const accionData = accionesJSON.acciones.find(r => r.id === idReglaDetectada);

if (accionData && accionData.accion) {

  // El cartel azul (Fallo Formulario / Fallo Portafib) y la frase explicativa ya no van aquí:
  // ahora se muestran dentro de la tarjeta del flujo, debajo de las píldoras
  // (ver el bloque que rellena #flujoDiagnostico).
  // 🔹 Cambios 2026-06-16: la acción usa el mismo formato de tarjeta V5 (cabecera gris + cuerpo blanco).
  salidaFinal += "<div class=\"panel-card\" style=\"margin-top:22px;\">";
  salidaFinal += "<div class=\"panel-card__head\"><svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#01696f\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><polyline points=\"13 17 18 12 13 7\"/><polyline points=\"6 17 11 12 6 7\"/></svg>Acción</div>";
  salidaFinal += "<div class=\"panel-card__body\">";
  // Las líneas que empiezan por "*" (notas) se muestran más grises y un poco más pequeñas.
  // 🔹 Casos especiales Portafib → texto dinámico según literales detectados en la traza.
  let textoAccion = accionData.accion;
  if (avisoMultiTramite.esMulti) {
    textoAccion = "⚠ TRAZA MIXTA: la traza pegada mezcla varios trámites (p. ej. búsqueda por DNI en SistraHelp). "
      + "El análisis siguiente puede ser incorrecto — pegar solo la traza del ID de trámite objetivo.\n\n"
      + textoAccion;
  }
  const trazaCompleta = lineas.join("\n");
  const hayFluxe = /fluxe no es v[àa]lid/i.test(trazaCompleta);
  const hayExcepcioSessio = /excepci[oó]\s+al\s+generar\s+sessi[oó]\s+firma/i.test(trazaCompleta);
  const literalGris = (texto, cursiva) =>
    "<span style=\"color:#9a9890;font-size:12px" + (cursiva ? ";font-style:italic" : "") + "\">\"" + texto + "\"</span>";

  if (idReglaDetectada === "error_validacion_certificado") {
    let prefijoValidacion;
    if (hayMetodoFirmaClaveEnKo) {
      prefijoValidacion = "Se detecta un problema de validación (@firma) al firmar con Cl@ve Permanente.";
    } else if (hayMetodoFirmaAutofirmaEnKo) {
      prefijoValidacion = "Se detecta un problema de validación (@firma) al firmar con certificado local.";
    } else if (esClave && !esCert) {
      prefijoValidacion = "Se detecta un problema de validación (@firma) al firmar con Cl@ve Permanente.";
    } else if (esCert && !esClave) {
      prefijoValidacion = "Se detecta un problema de validación (@firma) al firmar con certificado local.";
    } else {
      prefijoValidacion = "Se detecta un problema de validación (@firma). Confirmar método de firma en el Firma KO (doble clic en SistraHelp).";
    }
    textoAccion = prefijoValidacion + "\n" + textoAccion;
  }

  // 👉 Cadena de certificación pero además, en algún intento, se firmó con un certificado de otro NIF:
  //    el problema persistente/actual es la cadena, pero avisamos del certificado equivocado.
  if (idReglaDetectada === "error_cadena_certificacion" && hayErrorNifNoCoincide) {
    const nifTxt = nifsNoCoincide.cert ? " (" + nifsNoCoincide.cert + ")" : "";
    textoAccion = "<b>Aviso (otro NIF):</b> en uno de los intentos se firmó con un certificado de <b>otro NIF</b>" + nifTxt
      + ". Confirmar que usa <b>su propio certificado</b>.\n"
      + "Aun así, el error persistente y más reciente es la <b>cadena de certificación</b> (InvalidCertificateChain):\n\n"
      + textoAccion;
  }

  // 🔹 Portafib: el texto base se edita en acciones.json. Aquí solo sustituimos el
  // marcador {lit} por los literales detectados en la traza (en gris pequeño).
  // En "firma_correcta_portafib" los literales van sin cursiva; en el resto, en cursiva.
  if (textoAccion.indexOf("{lit}") !== -1) {
    const usarCursiva = (idReglaDetectada !== "firma_correcta_portafib");
    let lits;
    if (hayFluxe && hayExcepcioSessio) {
      lits = literalGris("El fluxe no es vàlid", usarCursiva) + " / "
           + literalGris("Excepció al generar sessió firma", usarCursiva);
    } else {
      lits = literalGris("El fluxe no es vàlid", usarCursiva);
    }
    textoAccion = textoAccion.replace("{lit}", lits);
  } else if (
    (idReglaDetectada === "tramite_completo" ||
     idReglaDetectada === "tramite_finalizado" ||
     idReglaDetectada === "tramite_registrado") &&
    hayErrorPortafibReal
  ) {
    textoAccion = "Se detecta error de portafib previo en la traza.\n\n" + textoAccion;
  } else if (idReglaDetectada === "fallo_formulario" && !hayFRI) {
    textoAccion = "Remitir al ciudadano a formulario de incidencias / dudas funcionales.";
    if (hayError403FormularioExterno) {
      textoAccion += "\nIndicar en el mail que el formulario de este trámite no se abre (403 Forbidden al cargar el formulario externo a SISTRA2).";
    }
  } else if (idReglaDetectada === "error_clave_103_15") {
    // 🔹 Caso especial: 103-15 precedido por un error 8-15 en la misma traza.
    const hayClave8_15 = lineasTraza.some(l =>
      l.includes("CLAVEFIRMA") &&
      /ERROR:\s*8\b/.test(l) &&
      /RESULTA[TD][OA]?\s*:\s*15\b/.test(l)
    );
    if (hayClave8_15) {
      textoAccion = "Se detecta uno o varios Error Cl@ve (código 8-15) y posteriormente uno o varios Errores Cl@ve (código 103-15).\nCertificado bloqueado. Indicar revocación y emisión de nuevo certificado en Cl@ve.";
    }
  } else if (
    idReglaDetectada === "error_autofirma_cliente_iphone" &&
    esClave && !esCert && hayMetodoFirmaAutofirmaEnKo
  ) {
    textoAccion = "Acceso marcado como Cl@ve; el Firma KO indica certificado local (Autofirm@).\n\n" + textoAccion;
  } else if (idReglaDetectada === "error_autofirma_cliente_generico" && hayMetodoFirmaAutofirmaEnKo && haySignaturaCancelada) {
    textoAccion = "Firma cancelada (Método de firma Autofirm@).\n"
      + "El técnico ha marcado Método Cl@ve, pero la firma se intentó con certificado/AutoFirma.\n\n"
      + accionData.accion;
  } else if (idReglaDetectada === "error_autofirma_cancelada" && hayErrorClaveReal) {
    textoAccion = "En intentos anteriores falló Cl@ve (código "
      + textoResumenCodigoClaveDetectado(codigoClaveDetectado, tipusResultatDetectado)
      + "); después el ciudadano intentó con certificado (Autofirm@) y la firma quedó cancelada.\n\n"
      + textoAccion;
  } else if (idReglaDetectada === "error_clave_firma_cancelada") {
    if (esCert && !esClave) {
      textoAccion += "\n*No orientar reinstalar AutoFirma: el KO indica Cl@ve, no certificado local.";
    }
  } else if (idReglaDetectada === "error_clave_movil" && haySGX) {
    // 🔹 Hay Firma KO en la traza: no usar el texto de «solo Inicio firma».
    if (haySignaturaCancelada && !hayErrorClaveReal) {
      textoAccion = "La firma se inicia pero falla con Signatura cancel·lada, sin código de error Cl@ve (8–15, 101, 103…).\n"
        + "Posible: Cl@ve móvil.\n"
        + "Posible: La ventana de elegir certificado no carga, se bloquea o el usuario la cierra → la firma queda cancelada.\n"
        + "Posible: acceso con nivel insuficiente.\n"
        + "Revisar en SistraHelp el último acceso al trámite (doble clic en Inicio trámite o Carga del trámite): si figura CLAVE_MOVIL.\n"
        + "Si el acceso fue con certificado, valorar entorno Autofirma/FIRE.";
    } else {
      textoAccion = "La firma se inicia pero falla en Cl@ve sin código de error reconocido en la traza (aparece Firma KO).\n"
        + "Revisar en SistraHelp el último acceso al trámite (doble clic en Inicio trámite o Carga del trámite): si figura CLAVE_MOVIL.\n"
        + "*Si el acceso fue con certificado (AUT), valorar entorno Autofirma/FIRE (wiki Autofirma).";
    }
  }

  if (esReglaAutofirmaClienteConIntro(idReglaDetectada)) {
    textoAccion = aplicarIntroAccionAutofirmaCliente(textoAccion, lineasTraza);
  }

  // 👉 Nota antivirus/firewall/proxy: solo en fallos del cliente de firma (Autofirma/certificado/FIRE)
  if (reglaAplicaNotaSeguridadEquipo(idReglaDetectada)) {
    textoAccion += "\n\n" + NOTA_SEGURIDAD_EQUIPO;
  }

  const accionHtml = textoAccion.split("\n").map(linea => {
    if (linea.trim().startsWith("*")) {
      return "<span style=\"color:#9a9890;font-size:12px;\">" + linea + "</span>";
    }
    return linea;
  }).join("<br>");
  salidaFinal += "<div style=\"font-size:14px;color:#1e1c17;\">" + accionHtml + "</div>";

  // 🔹 enlace del mail DENTRO del cuerpo, debajo de la acción
  let mailUrl = accionData.mail;
  if (idReglaDetectada === "error_autofirma_cancelada" || idReglaDetectada === "error_autofirma_entorno") {
    const reglaSo = resolverReglaAutofirmaCliente();
    const accionSo = accionesJSON.acciones.find(r => r.id === reglaSo);
    if (accionSo && accionSo.mail) mailUrl = accionSo.mail;
  }
  if (mailUrl) {
    salidaFinal += '<div style="margin-top:10px;"><a href="' + mailUrl + '" target="_blank" rel="noopener" style="color:#1e1c17;text-decoration:underline;">Mail</a></div>';
  }

  salidaFinal += "</div></div>";

} else {

  salidaFinal += "<br>- Acción recomendada: No definida<br>";

}
}

// 👉 Primero ocultamos el placeholder (mensaje inicial)
placeholder.style.display = "none";

// 👉 Si hay errores reales, los añadimos al diagnóstico
// 🔹 mostramos solo errores detectados (sin duplicados)

// 🔹 Cambios 2026-06-16: icono para la cabecera de la tarjeta de literales (formato V5)
const iconoLiterales = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#01696f\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><line x1=\"8\" y1=\"6\" x2=\"21\" y2=\"6\"/><line x1=\"8\" y1=\"12\" x2=\"21\" y2=\"12\"/><line x1=\"8\" y1=\"18\" x2=\"21\" y2=\"18\"/><line x1=\"3\" y1=\"6\" x2=\"3.01\" y2=\"6\"/><line x1=\"3\" y1=\"12\" x2=\"3.01\" y2=\"12\"/><line x1=\"3\" y1=\"18\" x2=\"3.01\" y2=\"18\"/></svg>";

// 👉 Mostramos errores si existen
if (erroresUnicos.length > 0) {

  // 🔥 PRIMERO: si hay error de flujo (Portafib)
  if (hayErrorPortafibReal) {

    salidaFinal += "<div class=\"panel-card\" style=\"margin-top:22px;\">";
    salidaFinal += "<div class=\"panel-card__head\" style=\"text-transform:none;\">" + iconoLiterales + "Literales detectados</div>";
    salidaFinal += "<div class=\"panel-card__body\">";
    salidaFinal += htmlAperturaLiteralesDetectados(lineasError);

    const literalCounts = {};
    const literalOrder = [];
    const literalOriginal = {};

    // Normalizar el literal: extrae el mensaje real eliminando campos técnicos y espacios redundantes
    // Esto permite agrupar y deduplicar correctamente los literales similares pero con formatos diferentes
    const normalizarAgrupacion = (linea) => claveLiteralParaAgrupacion(linea);

    lineasErrorEntries.forEach(entry => {
      const clave = normalizarAgrupacion(entry.linea);
      if (!clave) return;
      if (/^TR_[A-Z_]+\s*-/.test(clave)) return;
      if (!literalCounts[clave]) {
        literalCounts[clave] = 0;
        literalOrder.push(clave);
        literalOriginal[clave] = entry.original;
      }
      literalCounts[clave]++;
    });

    literalOrder.forEach((clave, index) => {
      // Construir el prefijo: si el literal aparece múltiples veces, mostrar (Nx)
      // Esto ayuda al técnico a identificar rápidamente errores repetidos
      const cnt = literalCounts[clave] || 0;
      const pref = '(x' + cnt + ') ';
      const textoLiteral = literalOriginal[clave] || clave;
      salidaFinal += pref + htmlLiteralDetectado(textoLiteral) + '<br>';
      if (index < literalOrder.length - 1) salidaFinal += '<br>';
    });

    salidaFinal += '</div></div></div>';

  }

// 🔥 SEGUNDO: caso formulario REAL (versión final sin pérdida de datos)
else if (contexto.fase === "pre_firma") {

  salidaFinal += "<div class=\"panel-card\" style=\"margin-top:22px;\">";
  salidaFinal += "<div class=\"panel-card__head\" style=\"text-transform:none;\">" + iconoLiterales + "Literales detectados</div>";
  salidaFinal += "<div class=\"panel-card__body\">";
  salidaFinal += htmlAperturaLiteralesDetectados(lineasError);

  // Agrupar literales limpiando cada línea original y contando repeticiones
  const literalCounts = {};
  const literalOrder = [];

  lineasError.forEach(orig => {
    let limpio = orig;
    // quitar cabecera ERROR
    limpio = limpio.replace(/^ERROR\s*-\s*/i, "");
    limpio = limpio.replace(/^ERROR\s*/i, "");
    // quitar fecha + hora + ids iniciales (cabecera típica)
    limpio = limpio.replace(/^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2}\s+[^\s]+\s+[^\s]+\s+/, "");
    limpio = limpio.trim();
    if (!limpio) return;
    if (limpio.includes("TR_")) return; // ignorar eventos
    // mantener orden de primera aparición
    if (!literalCounts[limpio]) {
      literalCounts[limpio] = 0;
      literalOrder.push(limpio);
    }
    literalCounts[limpio]++;
  });

  // Imprimir literales respetando orden; si aparecen varias veces, prefijar con xN
  for (let i = 0; i < literalOrder.length; i++) {
    const lit = literalOrder[i];
    const cnt = literalCounts[lit] || 0;
    const pref = '(x' + cnt + ') ';
    salidaFinal += pref + htmlLiteralDetectado(lit) + "<br>";
    // salto extra entre literales diferentes
    if (i < literalOrder.length - 1) salidaFinal += "<br>";
  }

  salidaFinal += "</div></div></div>";

}

  // 🔹 resto casos (error_firma, firma_ok con errores, Autofirma, Cl@ve, FIRE…)
  else {

salidaFinal += "<div class=\"panel-card\" style=\"margin-top:22px;\">";
salidaFinal += "<div class=\"panel-card__head\" style=\"text-transform:none;\">" + iconoLiterales + "Literales detectados</div>";
salidaFinal += "<div class=\"panel-card__body\">";
salidaFinal += htmlAperturaLiteralesDetectados(lineasError);

// Agrupamos contando repeticiones y mostramos el texto original una sola vez.
// No filtramos por "TR_": en Cl@ve el error suele ir en la misma línea que el evento TR_SGX.
// Para agrupar líneas equivalentes que solo difieren en datos volátiles
// (fecha, hora, IDs de sesión/expediente), normalizamos la clave de agrupación:
//   - quitamos fechas (dd/mm/aaaa) y horas (hh:mm:ss)
//   - quitamos tokens de sesión tipo XXXX-XXXX-XXXX
//   - quitamos números largos (5+ dígitos) → conservamos códigos como 8 o 15
const normalizarClave = (linea) => claveLiteralParaAgrupacion(linea);

const literalCounts = {};
const literalOrder = [];
const literalOriginal = {};

lineasErrorEntries.forEach(entry => {
  if (!entry.linea || !entry.linea.trim()) return;
  const clave = normalizarClave(entry.linea);
  if (!clave) return;
  if (!literalCounts[clave]) {
    literalCounts[clave] = 0;
    literalOrder.push(clave);
    literalOriginal[clave] = entry.original;
  }
  literalCounts[clave]++;
});

for (let i = 0; i < literalOrder.length; i++) {
  const lit = literalOrder[i];
  const cnt = literalCounts[lit] || 0;
  const pref = '(x' + cnt + ') ';
  salidaFinal += pref + htmlLiteralDetectado(literalOriginal[lit] || lit) + "<br>";
  if (i < literalOrder.length - 1) salidaFinal += "<br>";
}

salidaFinal += "</div></div></div>";

  }

} else {

  // 🔹 Cambios 2026-06-16: aunque no haya literales, mostramos la tarjeta con el aviso.
  salidaFinal += "<div class=\"panel-card\" style=\"margin-top:22px;\">";
  salidaFinal += "<div class=\"panel-card__head\" style=\"text-transform:none;\">" + iconoLiterales + "Literales detectados</div>";
  salidaFinal += "<div class=\"panel-card__body\">";
  salidaFinal += "<div class='literal-pequeno'>Sin literales de error en la traza</div>";
  salidaFinal += "</div></div>";
}
  

// 🔹 Cambios 2026-06-16: enlace discreto para reportar un análisis incorrecto.
// Aparece siempre al final de cualquier análisis y lleva al formulario de Google.
const URL_REPORTE = "https://docs.google.com/forms/d/e/1FAIpQLScmWTRYanI4PYO_1EL18g_PVbY2Nfway4FWnHrshj5hNf_zMw/viewform";
salidaFinal += "<div style=\"margin-top:18px;text-align:center;\">"
  + "<a href=\"" + URL_REPORTE + "\" target=\"_blank\" rel=\"noopener\" style=\"color:#9a9890;font-size:12px;text-decoration:underline;\">Reportar análisis incorrecto</a>"
  + "</div>";

  

if (avisoMultiTramite.esMulti) {
  salidaFinal = htmlAvisoTrazaMultiTramite(avisoMultiTramite) + salidaFinal;
}

// 🔹 NUEVO: pintar flujo visual encima
renderFlujoVisual(eventosFlujo);

// 🔹 Flujo de Firma — motor por ventanas + UI (#flujoFirmaDetalle)
const flujoFirmaAnalisis = analizarFlujoFirma(lineasTraza);
renderFlujoFirmaUI(flujoFirmaAnalisis);

// Cambios 2026-06-12: mostrar el card del flujo solo cuando hay resultado
const flujoCard = document.getElementById("flujoVisualCard");
if (flujoCard) {
  flujoCard.style.display = "block";
}
document.getElementById("flujoVisual").style.display = "flex";

// 🔹 Cambios 2026-06-16: dentro de la tarjeta del flujo, debajo de las píldoras y
// separada por una línea fina, mostramos el cartel del veredicto (azul) seguido
// de la frase explicativa (⚠ ...).
const flujoDiag = document.getElementById("flujoDiagnostico");
if (flujoDiag) {
  let contenidoDiag = "";
  if (avisoMultiTramite.esMulti) {
    contenidoDiag += htmlAvisoTrazaMultiTramiteCompacto(avisoMultiTramite);
  }
  if (cartelDiagnostico || fraseDiagnostico) {
    contenidoDiag += "<div style=\"display:flex;align-items:center;gap:10px;flex-wrap:wrap;\">";
    if (cartelDiagnostico) {
      contenidoDiag += cartelDiagnostico;
    }
    if (fraseDiagnostico) {
      contenidoDiag += "<span>⚠ " + fraseDiagnostico + "</span>";
    }
    contenidoDiag += "</div>";
  }
  if (contenidoDiag) {
    flujoDiag.innerHTML = contenidoDiag;
    flujoDiag.style.display = "block";
  } else {
    flujoDiag.innerHTML = "";
    flujoDiag.style.display = "none";
  }
}

// Función auxiliar para escapar texto antes de mostrarlo como HTML
// IMPORTANTE: convierte caracteres especiales (< > & " ') para evitar que se interpreten como HTML
// Esto garantiza que los literales se muestren como texto plano, no como código HTML renderizado
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 🔹 Convertir automáticamente cualquier URL en enlace HTML clicable
// 🔹 Evitar reemplazar URLs que ya están dentro de un atributo href de un enlace
salidaFinal = salidaFinal.replace(
  /(https?:\/\/[^\s"<>]+)/g,
  (match, url, offset, str) => {
    const before = str.slice(0, offset);
    const hrefDbl = before.lastIndexOf('href="');
    const hrefSgl = before.lastIndexOf("href='");
    const tagA = before.lastIndexOf('<a ');
    if ((hrefDbl > tagA) || (hrefSgl > tagA)) {
      return match;
    }
    return '<a href="' + url + '" target="_blank" rel="noopener">' + url + '</a>';
  }
);
// 👉 Mostramos SIEMPRE el resultado final
document.getElementById("resultado").innerHTML = salidaFinal;

// 👉 Nos aseguramos de que el bloque resultado esté visible
document.getElementById("resultado").style.display = "block";

// 🔹 Cambios 2026-06-16: el ancho de "Acción" y "Literales" se limita al ancho
// de la tarjeta del flujo, para que todas las tarjetas tengan el mismo ancho máximo.
const flowCardEl = document.getElementById("flujoVisualCard");
const resultadoEl = document.getElementById("resultado");
if (flowCardEl && resultadoEl) {
  const anchoFlujo = flowCardEl.offsetWidth;
  if (anchoFlujo > 0) {
    resultadoEl.style.maxWidth = anchoFlujo + "px";
  }
}

ultimoAnalisisValido = true;
analisisOcultoPorAyuda = false;

};




// =====================================
// 🔴 BOTÓN LIMPIAR
// =====================================
// 👉 Reinicia la interfaz al estado inicial

btnLimpiar.onclick = () => {

  ultimoAnalisisValido = false;
  analisisOcultoPorAyuda = false;

  // ─────────────────────────────
  // 🔹 LIMPIEZA DE CHECKS DE ERROR VISUAL
  // ─────────────────────────────
  checkSaml.checked = false;
  checkBlanco.checked = false;

  document.getElementById("inputTraza").value = "";
 
  metodoClave.checked = true;
  metodoCert.checked = false;

  sisPC.checked = false;
  sisMovil.checked = false;

  bloqueSistema.style.display = "none";

  cerrarPanelFunc();

  ocultarResultadosAnalisis();
placeholder.style.display = "";

  console.log("Sistema reiniciado (limpiar)");

};




  

// =====================================
// 🔴 BOTÓN ACTUALIZAR
// =====================================
// 👉 Fuerza recarga completa de la página
// 👉 Evita caché del navegador
// 👉 Útil cuando:
//    - Se han subido cambios a GitHub Pages
//    - No se ven cambios en HTML, JS o JSON
// 👉 Alternativa manual:
//    - Ctrl + F5 (recarga completa)
// 👉 Nota:
//    - HTML suele quedarse en caché
//    - JS/JSON ya usan timestamp internamente

btnActualizar.onclick = () => {
  location.href = location.pathname + "?v=" + Date.now();
};



// =====================================
// 🔴 CARGAR acciones DESDE JSON
// =====================================
// 👉 Trae el archivo acciones.json y lo guarda en memoria
// 👉 Este archivo contiene solo acciones del sistema

async function cargarAcciones() {

  try {

    // 👉 Se añade timestamp para evitar que el navegador use caché
    const r = await fetch("acciones.json?v=" + Date.now());

    // 👉 Convierte la respuesta a objeto JSON
    const d = await r.json();

    // 👉 Guarda las acciones en variable global
    accionesJSON = d;

    // 👉 Debug en consola (ver contenido completo)
    console.log("acciones JSON:", d);

    // 👉 Muestra versión del JSON en cabecera
    document.getElementById("versionJSON").innerText =
      "json " + d.version;

    console.log("JSON v" + d.version);

  } catch {

    // 👉 Si falla la carga, se indica en pantalla
    document.getElementById("versionJSON").innerText =
      "json ?";
  }
}


cargarAcciones();      // 👉 Ejecuta la carga al iniciar la aplicación
// =====================================
// 🔴 CAMBIO DE MÉTODO (Cl@ve)
// =====================================
// 👉 Oculta selector de sistema
// 👉 Limpia selección PC/móvil

metodoClave.onchange = () => {
  bloqueSistema.style.display = "none";
  sisPC.checked = false;
  sisMovil.checked = false;
};

// =====================================
// 🔴 CAMBIO DE MÉTODO (Certificado)
// =====================================
// 👉 Muestra selector de sistema (PC / móvil)

metodoCert.onchange = () => {
  bloqueSistema.style.display = "block";
};
});

// =====================================
// 🔹 FLUJO DE FIRMA — motor por ventanas + UI
// Cada TR_SGI abre un intento; ventana = hasta el siguiente TR_SGI (timestamps).
// Clasificación por ventana (no reutiliza flags globales del árbol idReglaDetectada).
// =====================================

const ETIQUETA_RESULTADO_FIRMA = {
  firma_ok: "Firma OK",
  sin_cierre: "Sin cierre",
  saf_27: "SAF_27",
  validacion_certificado: "Validación certificado",
  cadena_certificacion: "Cadena certificación",
  nif_no_coincide: "Certificado de otro NIF",
  clave_movil_no_permitida: "Cl@ve móvil no permitida",
  ko_clave_8_15: "Cl@ve 8–15",
  ko_clave_103: "Cl@ve 103",
  ko_clave_103_15: "Cl@ve 103-15",
  ko_clave_101: "Cl@ve 101",
  ko_clave_104: "Cl@ve 104",
  ko_clave_otro: "Cl@ve (otro código)",
  cancelada_clave: "Cancelada (Cl@ve)",
  ko_clave_sin_codigo: "KO Cl@ve sin código",
  timeout_firma: "Timeout firma",
  fitxer_buit: "Fitxer buit",
  cliente_firma_movil: "Servidor intermedio",
  servidor_intermedio: "Servidor intermedio",
  cancelada_autofirma: "Cancelada (Autofirm@)",
  cancelada_sin_metodo: "Cancelada (sin método)",
  ko_autofirma_otro: "KO Autofirma (otro)",
  ko_generico: "KO genérico",
  ko_sin_detalle: "KO sin detalle"
};

const TOOLTIP_RESULTADO_FIRMA = {
  sin_cierre: "Sin cierre (Solo Inicio Firma)",
  cliente_firma_movil: "Fallo de comunicación con Autofirma (servidor intermedio). No indica Android ni iPhone; revisar TR_CAR anterior al SGI.",
  servidor_intermedio: "Fallo de comunicación con Autofirma (servidor intermedio). No indica Android ni iPhone; revisar TR_CAR anterior al SGI.",
  timeout_firma: "Tiempo de firma agotado o Autofirma no invocado o no instalado. No implica solo iPhone; confirmar SO en TR_CAR.",
  cadena_certificacion: "Cadena de certificación del certificado del ciudadano no válida (InvalidCertificateChain). Revisar el certificado en el equipo (cadena de CA, CA reconocida, vigencia, revocación, almacén). No es reinstalar Autofirma.",
  nif_no_coincide: "Se firmó con un certificado de un NIF distinto al requerido. El ciudadano seleccionó otro certificado (equipo compartido / varios certificados). Indicar que elija su propio certificado."
};

function tooltipResultadoFlujoFirma(resultado) {
  return TOOLTIP_RESULTADO_FIRMA[resultado] || "";
}

function htmlEtiquetaResultadoFlujoFirma(resultado, etiqueta) {
  const color = colorResultadoFlujoFirma(resultado);
  const tooltip = tooltipResultadoFlujoFirma(resultado);
  const cls = tooltip
    ? ` class="flujo-firma-resultado flujo-firma-resultado--con-tooltip"`
    : ` class="flujo-firma-resultado"`;
  const title = tooltip ? ` title="${escapeHtmlFlujoFirma(tooltip)}"` : "";
  return `<span${cls}${title} style="color:${color}">${escapeHtmlFlujoFirma(etiqueta)}</span>`;
}

function esLineaInicioFirmaHelper(linea) {
  return /^TR_SGI\s+-/.test(String(linea || ""));
}

function formatearTsTraza(ts) {
  if (ts == null) return "—";
  const d = new Date(ts);
  const pad = n => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function detectarAccesoEnLineaIniCar(linea) {
  const t = String(linea || "").toUpperCase();
  if (/CLAVE[_\s]?MOVIL|CLAVEMOVIL|M[ÈE]TODE.*CLAVE.*MOVIL/.test(t)) return "clave_movil";
  if (/CLAVE[_\s]?PERMANENT|CLAVEPERMANENT|CLAVEFIRMA/.test(t)) return "clave_permanente";
  if (/\bAUT\b|CERTIFICAD|AUTOFIRMA|FNMT|DNIe/.test(t)) return "certificado";
  return "desconocido";
}

function detectarAccesoPrevioIntento(lineasTraza, tsSgi, indiceSgi) {
  // Acceso = TR_INI/CAR cronológicamente anterior al SGI (no depende del orden de pegado)
  if (tsSgi != null) {
    let mejorLinea = null;
    let mejorTs = -Infinity;
    for (const linea of lineasTraza) {
      if (!/^TR_INI\s+-/.test(linea) && !/^TR_CAR\s+-/.test(linea)) continue;
      const ts = extraerTimestampLineaTraza(linea);
      if (ts == null || ts >= tsSgi) continue;
      if (ts > mejorTs) {
        mejorTs = ts;
        mejorLinea = linea;
      }
    }
    if (mejorLinea) return detectarAccesoEnLineaIniCar(mejorLinea);
  }
  // Respaldo sin timestamp: buscar hacia arriba en el pegado
  for (let i = indiceSgi - 1; i >= 0; i--) {
    const linea = lineasTraza[i];
    if (/^TR_INI\s+-/.test(linea) || /^TR_CAR\s+-/.test(linea)) {
      return detectarAccesoEnLineaIniCar(linea);
    }
  }
  return null;
}

// 👉 Ventana del intento: desde ts del SGI hasta el siguiente SGI (excl.).
// SistraHelp pega lo más reciente arriba → TR_SGX puede ir ANTES que su TR_SGI en el array.
function lineasEnVentanaIntento(lineasTraza, lineaSgi, tsSgi, tsSiguienteSgi) {
  if (tsSgi == null) {
    // Sin timestamps: recorte por índices (comportamiento anterior)
    const indiceSgi = lineasTraza.indexOf(lineaSgi);
    const sgis = lineasTraza.map((l, i) => esLineaInicioFirmaHelper(l) ? i : -1).filter(i => i >= 0);
    const pos = sgis.indexOf(indiceSgi);
    const indiceFin = pos >= 0 && pos < sgis.length - 1 ? sgis[pos + 1] : lineasTraza.length;
    return lineasTraza.slice(indiceSgi, indiceFin);
  }

  const ventana = lineasTraza.filter(linea => {
    const ts = extraerTimestampLineaTraza(linea);
    if (ts == null) return linea === lineaSgi;
    return ts >= tsSgi && (tsSiguienteSgi == null || ts < tsSiguienteSgi);
  });

  if (!ventana.includes(lineaSgi)) ventana.push(lineaSgi);
  return ventana;
}

function detectarMetodoFirmaEnLineas(lineas) {
  for (const linea of lineas) {
    if (esMetodoFirmaClaveEnLineaHelper(linea)) return "clave";
    if (esMetodoFirmaAutofirmaEnLineaHelper(linea)) return "autofirma";
  }
  return null;
}

function extraerCodigoClaveEnLineas(lineas) {
  for (const linea of lineas) {
    if (linea.includes("CLAVEFIRMA") && /ERROR:\s*\d+/.test(linea)) {
      const matchCodigo = linea.match(/ERROR:\s*(\d+)/);
      const matchTipus = linea.match(/(?:TIPUS\s+)?RESULTAT\s*:\s*(\d+)/i)
        || linea.match(/RESULTAD[OA]?\s*:\s*(\d+)/i);
      return {
        codigo: matchCodigo ? matchCodigo[1] : null,
        tipus: matchTipus ? matchTipus[1] : null
      };
    }
  }
  return null;
}

function lineasKoOrdenadasCronologicamente(lineas) {
  return lineas
    .filter(esLineaFirmaKoHelper)
    .map(linea => ({ linea, ts: extraerTimestampLineaTraza(linea) }))
    .sort((a, b) => {
      if (a.ts != null && b.ts != null) return a.ts - b.ts;
      if (a.ts != null) return -1;
      if (b.ts != null) return 1;
      return 0;
    })
    .map(entry => entry.linea);
}

function clasificarResultadoVentana(lineasVentana) {
  const textoVentana = lineasVentana.join("\n");
  const haySgo = lineasVentana.some(l => /^TR_SGO\s+-/.test(l));
  const kos = lineasKoOrdenadasCronologicamente(lineasVentana);
  const koAnteriores = kos.length > 1 ? kos.length - 1 : 0;
  const ultimoKo = kos[kos.length - 1] || null;
  const metodoFirma = detectarMetodoFirmaEnLineas(lineasVentana);

  if (haySgo && kos.length === 0) {
    return { resultado: "firma_ok", metodoFirma, koAnteriores: 0, mensajeKo: null };
  }

  if (!haySgo && kos.length === 0) {
    return { resultado: "sin_cierre", metodoFirma, koAnteriores: 0, mensajeKo: null };
  }

  let resultado = "ko_sin_detalle";

  if (/SAF_27|SAF27\b/i.test(textoVentana)) {
    resultado = "saf_27";
  } else if (lineasVentana.some(esErrorNifCertificadoNoCoincideHelper)) {
    resultado = "nif_no_coincide";
  } else if (lineasVentana.some(esErrorCadenaCertificacionHelper)) {
    resultado = "cadena_certificacion";
  } else if (lineasVentana.some(esErrorValidacionCertificadoFirmanteHelper)) {
    resultado = "validacion_certificado";
  } else if (/CLAVE[_\s]?MOVIL.*NO.*PERM[EE]|M[ÈE]TODE.*CLAVE.*MOVIL.*NO/i.test(textoVentana)) {
    resultado = "clave_movil_no_permitida";
  } else {
    const clave = extraerCodigoClaveEnLineas(lineasVentana);
    if (clave && clave.codigo === "103") {
      resultado = clave.tipus === "15" ? "ko_clave_103_15" : "ko_clave_103";
    } else if (clave && /^(8|9|10|11|12|13|14|15)$/.test(clave.codigo)) {
      resultado = "ko_clave_8_15";
    } else if (clave && clave.codigo === "101") {
      resultado = "ko_clave_101";
    } else if (clave && clave.codigo === "104") {
      resultado = "ko_clave_104";
    } else if (clave && clave.codigo) {
      resultado = "ko_clave_otro";
    } else if (/SIGNATURA CANCEL|FIRMA CANCEL/i.test(textoVentana)) {
      if (metodoFirma === "clave" || lineasVentana.some(l => /SIGNATURA CANCEL|FIRMA CANCEL/i.test(l) && esMetodoFirmaClaveEnLineaHelper(l))) {
        resultado = "cancelada_clave";
      } else if (metodoFirma === "autofirma" || lineasVentana.some(l => /SIGNATURA CANCEL|FIRMA CANCEL/i.test(l) && esMetodoFirmaAutofirmaEnLineaHelper(l))) {
        resultado = "cancelada_autofirma";
      } else {
        resultado = "cancelada_sin_metodo";
      }
    } else if (/TIEMPO PARA FIRMAR|TEMPS PER A FIRMAR|EL TEMPS PER A FIRMAR/i.test(textoVentana)) {
      resultado = "timeout_firma";
    } else if (/FITXER SIGNAT.*BUIT|FICHIERO SIGNAT.*VAC|SIGNAT EST[AÁ] BUIT/i.test(textoVentana)) {
      resultado = "fitxer_buit";
    } else if (/CLIENT(E)? DE FIRMA M[ÒOÓ]?VIL|FIRMA MOVIL|ERROR DE AUTOFIRMA O DEL CLIENTE DE FIRMA/i.test(textoVentana)) {
      resultado = "cliente_firma_movil";
    } else if (/SERVIDOR INTERMEDI|NO SE PUDO CONECTAR CON EL SERVIDOR INTERMEDIO|NO S['']HA POGUT CONNECTAR.*SERVIDOR INTERMEDI/i.test(textoVentana)) {
      resultado = "servidor_intermedio";
    } else if (/ERROR DE AUTOFIRMA|ERROR D['']AUTOFIRMA|AUTOFIRMA|PLUGIN.*AUTOFIRMA|AI500001/i.test(textoVentana) || metodoFirma === "autofirma") {
      resultado = "ko_autofirma_otro";
    } else if (metodoFirma === "clave") {
      resultado = "ko_clave_sin_codigo";
    } else if (ultimoKo && extraerMensajeEventoTraza(ultimoKo)) {
      resultado = "ko_generico";
    }
  }

  const mensajeKo = ultimoKo ? (extraerMensajeEventoTraza(ultimoKo) || ultimoKo.slice(0, 120)) : null;
  return { resultado, metodoFirma, koAnteriores, mensajeKo };
}

function segmentarIntentosFirma(lineasTraza) {
  const sgis = lineasTraza
    .map((linea, idx) => ({ linea, idx, ts: extraerTimestampLineaTraza(linea) }))
    .filter(entry => esLineaInicioFirmaHelper(entry.linea))
    .sort((a, b) => {
      if (a.ts != null && b.ts != null) return a.ts - b.ts;
      if (a.ts != null) return -1;
      if (b.ts != null) return 1;
      return b.idx - a.idx; // pegado nuevo→viejo: idx menor = más reciente
    });

  return sgis.map((sgi, i) => {
    const tsSiguienteSgi = i < sgis.length - 1 ? sgis[i + 1].ts : null;
    const lineasVentana = lineasEnVentanaIntento(lineasTraza, sgi.linea, sgi.ts, tsSiguienteSgi);
    const clasificacion = clasificarResultadoVentana(lineasVentana);

    return {
      numIntento: i + 1,
      indiceSgi: sgi.idx,
      lineaSgi: sgi.linea,
      tsSgi: sgi.ts,
      tsSgiTexto: formatearTsTraza(sgi.ts),
      acceso: detectarAccesoPrevioIntento(lineasTraza, sgi.ts, sgi.idx),
      lineasVentana,
      etiqueta: ETIQUETA_RESULTADO_FIRMA[clasificacion.resultado] || clasificacion.resultado,
      ...clasificacion
    };
  });
}

function agruparResumenFlujoFirma(intentos) {
  const resumen = {};
  intentos.forEach(intento => {
    const key = intento.resultado;
    if (!resumen[key]) {
      resumen[key] = { resultado: key, etiqueta: intento.etiqueta, count: 0 };
    }
    resumen[key].count++;
  });
  return Object.values(resumen).sort((a, b) => b.count - a.count);
}

function agruparConsecutivosFlujoFirma(intentos) {
  const grupos = [];
  intentos.forEach(intento => {
    const key = `${intento.resultado}|${intento.metodoFirma || ""}`;
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.key === key && intento.numIntento === ultimo.hasta + 1) {
      ultimo.hasta = intento.numIntento;
      ultimo.cantidad++;
    } else {
      grupos.push({
        key,
        resultado: intento.resultado,
        etiqueta: intento.etiqueta,
        metodoFirma: intento.metodoFirma,
        desde: intento.numIntento,
        hasta: intento.numIntento,
        cantidad: 1
      });
    }
  });
  return grupos;
}

function marcarSeparadoresFase(intentos) {
  intentos.forEach((intento, i) => {
    intento.separadorFaseAntes = i > 0 && intentos[i - 1].resultado === "firma_ok";
  });
  return intentos;
}

function analizarFlujoFirma(lineasTraza) {
  const intentos = marcarSeparadoresFase(segmentarIntentosFirma(lineasTraza));
  const notaQaa = lineasTraza.some(l => /QAARECARGATRAMITE|NIVELL DE QAA|NIVEL DE QAA/i.test(l));

  if (intentos.length === 0) {
    return {
      hayFaseFirma: false,
      motivo: "sin_inicio_firma",
      intentos: [],
      resumen: [],
      gruposConsecutivos: [],
      notaQaa
    };
  }

  return {
    hayFaseFirma: true,
    totalIntentos: intentos.length,
    intentos,
    resumen: agruparResumenFlujoFirma(intentos),
    gruposConsecutivos: agruparConsecutivosFlujoFirma(intentos),
    notaQaa
  };
}

function escapeHtmlFlujoFirma(texto) {
  return String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function etiquetaAccesoFlujoFirma(acceso) {
  const map = {
    clave_movil: "Cl@ve móvil",
    clave_permanente: "Cl@ve permanente",
    certificado: "Certificado local"
  };
  return acceso ? (map[acceso] || acceso) : "—";
}

function htmlAccesoFlujoFirma(acceso) {
  if (acceso === "desconocido") {
    return '<span class="flujo-firma-acceso flujo-firma-acceso--revisar" title="Revisar TR_CAR (Carga del trámite) anterior al inicio de firma — ahí suele constar el método de acceso (Cl@ve, Certificado) y el SO/dispositivo (Windows, Mac, Android, iPhone).">Revisar Acceso</span>';
  }
  return `<span class="flujo-firma-acceso">${escapeHtmlFlujoFirma(etiquetaAccesoFlujoFirma(acceso))}</span>`;
}

function accesoDesconocidoOmitidoPorKoClave(intento) {
  return /^ko_clave/.test(intento.resultado) || intento.resultado === "cancelada_clave";
}

function debeMostrarAccesoFlujoFirma(intento) {
  if (intento.acceso && intento.acceso !== "desconocido") return true;
  if (intento.acceso === "desconocido" && accesoDesconocidoOmitidoPorKoClave(intento)) return false;
  return intento.acceso === "desconocido";
}

function etiquetaMetodoFlujoFirma(metodo) {
  if (metodo === "clave") return "Cl@veFirm@";
  if (metodo === "autofirma") return "Autofirm@";
  return null;
}

function colorResultadoFlujoFirma(resultado) {
  if (resultado === "firma_ok") return "#2e6e14";
  if (resultado === "sin_cierre") return "#888";
  if (/^ko_clave|^clave_movil|cancelada_clave|ko_clave_sin/.test(resultado)) return "#c0392b";
  if (/^cancelada/.test(resultado)) return "#b7770d";
  if (resultado === "validacion_certificado") return "#8e44ad";
  if (resultado === "cadena_certificacion") return "#7d3c98";
  if (resultado === "nif_no_coincide") return "#b03a2e";
  if (resultado === "timeout_firma") return "#d35400";
  if (resultado === "cliente_firma_movil") return COLOR_CLIENTE_FIRMA_MOVIL;
  return "#a12c7b";
}

function hayDiscrepanciaAccesoFirmaIntento(intento) {
  const acc = intento.acceso;
  const met = intento.metodoFirma;
  if ((acc === "clave_movil" || acc === "clave_permanente") && met === "autofirma") return true;
  if (acc === "certificado" && met === "clave") return true;
  return false;
}

function metaIntentoFlujoFirma(intento) {
  const partes = [];
  if (debeMostrarAccesoFlujoFirma(intento)) {
    partes.push(htmlAccesoFlujoFirma(intento.acceso));
  }
  const metodoTxt = etiquetaMetodoFlujoFirma(intento.metodoFirma);
  if (metodoTxt) partes.push(`Método: ${escapeHtmlFlujoFirma(metodoTxt)}`);
  if (hayDiscrepanciaAccesoFirmaIntento(intento)) {
    partes.push('<span class="flujo-firma-discrepancia">acceso ≠ firma</span>');
  }
  return partes.join(" · ");
}

function metaGrupoFlujoFirma(intentos) {
  const accesos = [...new Set(
    intentos.filter(debeMostrarAccesoFlujoFirma).map(i => i.acceso).filter(Boolean)
  )];
  const metodos = [...new Set(intentos.map(i => i.metodoFirma).filter(Boolean))];
  const partes = [];
  if (accesos.length === 1) {
    partes.push(htmlAccesoFlujoFirma(accesos[0]));
  } else if (accesos.length > 1) {
    partes.push("Acceso: varios");
  }
  if (metodos.length === 1) {
    partes.push(`Método: ${escapeHtmlFlujoFirma(etiquetaMetodoFlujoFirma(metodos[0]))}`);
  } else if (metodos.length > 1) {
    partes.push("Método: varios");
  }
  if (intentos.some(hayDiscrepanciaAccesoFirmaIntento)) {
    partes.push('<span class="flujo-firma-discrepancia">acceso ≠ firma</span>');
  }
  return partes.join(" · ");
}

function htmlMiniFlujoIntento(intento) {
  const haySgo = intento.lineasVentana.some(l => /^TR_SGO\s+-/.test(l));
  const haySgx = intento.lineasVentana.some(esLineaFirmaKoHelper);
  const colorSgi = "#2e6e14";

  let html = '<span class="flujo-firma-mini" aria-label="Mini flujo del intento">';
  html += `<span class="flujo-firma-mini-pill" style="border-color:${colorSgi};color:${colorSgi}" title="Inicio firma">TR_SGI</span>`;
  html += '<span class="flujo-firma-mini-flecha">→</span>';

  if (intento.resultado === "firma_ok" || haySgo) {
    html += '<span class="flujo-firma-mini-pill" style="border-color:#2e6e14;color:#2e6e14" title="Firma OK">TR_SGO</span>';
  } else if (haySgx || (intento.resultado !== "sin_cierre" && intento.resultado !== "firma_ok")) {
    const cKo = colorResultadoFlujoFirma(intento.resultado);
    html += `<span class="flujo-firma-mini-pill" style="border-color:${cKo};color:${cKo}" title="Firma KO">TR_SGX</span>`;
  } else {
    html += `<span class="flujo-firma-mini-pill flujo-firma-mini-pill--pendiente" style="border-color:#ccc;color:#999" title="${escapeHtmlFlujoFirma(tooltipResultadoFlujoFirma("sin_cierre"))}">···</span>`;
  }

  html += "</span>";
  return html;
}

function htmlLineaIntentoFlujoFirma(intento, opts = {}) {
  const compacto = opts.compacto === true;
  const koExtra = intento.koAnteriores
    ? ` <span class="flujo-firma-ko-prev">(+${intento.koAnteriores} KO anterior/es)</span>`
    : "";

  return `<li class="flujo-firma-item">
    <div class="flujo-firma-item-fila">
      <span class="flujo-firma-num">#${intento.numIntento}</span>
      ${htmlMiniFlujoIntento(intento)}
      <span class="flujo-firma-ts">${escapeHtmlFlujoFirma(intento.tsSgiTexto)}</span>
      ${htmlEtiquetaResultadoFlujoFirma(intento.resultado, intento.etiqueta)}${koExtra}
    </div>
    ${compacto ? "" : `<span class="flujo-firma-meta">${metaIntentoFlujoFirma(intento)}</span>`}
  </li>`;
}

function construirFilasUiFlujoFirma(data) {
  const map = new Map(data.intentos.map(i => [i.numIntento, i]));
  return [...data.gruposConsecutivos].reverse().map(g => ({
    esGrupo: g.cantidad > 1,
    grupo: g,
    intentos: Array.from({ length: g.cantidad }, (_, idx) => map.get(g.desde + idx)).filter(Boolean)
  }));
}

function renderFlujoFirmaUI(data) {
  const contenedor = document.getElementById("flujoFirmaDetalle");
  if (!contenedor) return;

  if (!data.hayFaseFirma) {
    const msg = data.motivo === "sin_inicio_firma"
      ? "Sin inicio de firma (TR_SGI) en la traza."
      : "Sin fase de firma.";
    contenedor.innerHTML = `
      <details class="flujo-firma-details">
        <summary class="flujo-firma-summary">Flujo de Firma <span class="flujo-firma-badge">0 intentos</span></summary>
        <p class="flujo-firma-nota">${escapeHtmlFlujoFirma(msg)}</p>
        ${data.notaQaa ? '<p class="flujo-firma-nota-gris">Nota: incidencia QAA detectada en la traza (ver análisis global).</p>' : ""}
      </details>`;
    contenedor.style.display = "block";
    return;
  }

  const filas = construirFilasUiFlujoFirma(data);
  let listaHtml = '<ul class="flujo-firma-lista">';

  filas.forEach(fila => {
    const primero = fila.intentos[0];
    if (primero && primero.separadorFaseAntes) {
      listaHtml += '<li class="flujo-firma-separador">✓ Firma OK — nueva fase de firma</li>';
    }

    if (!fila.esGrupo) {
      listaHtml += htmlLineaIntentoFlujoFirma(fila.intentos[0]);
      return;
    }

    const g = fila.grupo;
    const rango = g.desde === g.hasta ? `#${g.desde}` : `#${g.desde}–#${g.hasta}`;
    const inner = [...fila.intentos].reverse()
      .map(intento => htmlLineaIntentoFlujoFirma(intento, { compacto: true }))
      .join("");

    listaHtml += `<li class="flujo-firma-grupo">
      <details class="flujo-firma-grupo-details">
        <summary class="flujo-firma-grupo-summary">
          <span class="flujo-firma-grupo-mult">${rango} (${g.cantidad}×)</span>
          ${htmlMiniFlujoIntento(fila.intentos[fila.intentos.length - 1])}
          ${htmlEtiquetaResultadoFlujoFirma(g.resultado, g.etiqueta)}
          <span class="flujo-firma-meta">${metaGrupoFlujoFirma(fila.intentos)}</span>
        </summary>
        <ul class="flujo-firma-lista-anidada">${inner}</ul>
      </details>
    </li>`;
  });
  listaHtml += "</ul>";

  const resumenHtml = data.resumen.length
    ? `<div class="flujo-firma-resumen"><span class="flujo-firma-resumen-titulo">Resumen:</span>${data.resumen.map(r => {
        const c = colorResultadoFlujoFirma(r.resultado);
        const tooltip = tooltipResultadoFlujoFirma(r.resultado);
        const clsTooltip = tooltip ? " flujo-firma-resultado--con-tooltip" : "";
        const titleAttr = tooltip ? ` title="${escapeHtmlFlujoFirma(tooltip)}"` : "";
        return `<span class="flujo-firma-resumen-chip${clsTooltip}" style="border-left-color:${c}"${titleAttr}>${escapeHtmlFlujoFirma(r.etiqueta)} ×${r.count}</span>`;
      }).join("")}</div>`
    : "";

  contenedor.innerHTML = `
    <details class="flujo-firma-details">
      <summary class="flujo-firma-summary">Flujo de Firma <span class="flujo-firma-badge">${data.totalIntentos} intento${data.totalIntentos !== 1 ? "s" : ""}</span></summary>
      <p class="flujo-firma-nota-gris">Detalles por cada intento de firma</p>
      ${listaHtml}
      ${resumenHtml}
      ${data.notaQaa ? '<p class="flujo-firma-nota-gris">Nota: QAA detectado en la traza.</p>' : ""}
    </details>`;
  contenedor.style.display = "block";
}

// =====================================
// 🔹 NUEVO: FUNCIÓN FLUJO VISUAL
// Cambios 2026-06-12: renderiza los pasos TR_ con etiquetas de estado y color
// =====================================

function renderFlujoVisual(eventos) {

  const contenedor = document.getElementById("flujoVisual");
  if (!contenedor) return;

  const pasos = ["TR_FRI","TR_FRF","TR_SGI","TR_SGX","TR_SGO","TR_RGI","TR_FIN","TR_REG"];

  let html = "<div style='display:flex;gap:6px;margin-bottom:2px;flex-wrap:wrap;align-items:center;'>";

  pasos.forEach((p, i) => {

    let color = "#ccc"; // gris por defecto (el evento no aparece en la traza)

    // 🔹 Cada paso se colorea por sí mismo según haya ocurrido o no.
    //    Antes, un TR_SGX (firma KO) "apagaba" en gris los pasos siguientes
    //    aunque sí hubieran ocurrido (firma OK, registro, fin de trámite).
    if (eventos[p]) {
      color = (p === "TR_SGX") ? "#a12c7b" : "#2e6e14"; // rojo si firma KO, verde el resto
    }

    html += `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
      <div style="padding:4px 10px;border-radius:20px;border:1px solid ${color};color:${color};font-size:11px;font-family: monospace;background:#fff;">
        ${p}
      </div>`;

    // Mostramos SIEMPRE la etiqueta; en gris cuando el evento no aparece en la traza.
    const nombrePaso = p === 'TR_FRI' ? 'Inicio formulario' : p === 'TR_FRF' ? 'Fin formulario' : p === 'TR_SGI' ? 'Inicio firma' : p === 'TR_SGX' ? 'Firma KO' : p === 'TR_SGO' ? 'Firma OK' : p === 'TR_RGI' ? 'Inicio registro' : p === 'TR_REG' ? 'Registro trámite' : 'Fin trámite';
    const labelText = `(${nombrePaso})`;
    const labelColor = eventos[p] ? color : '#ccc';
    html += `<div style="font-size:9px;color:${labelColor};line-height:1.2;">${labelText}</div>`;

    html += `</div>`;

    if (i < pasos.length - 1) {
      html += "<span style='color:#999;'>→</span>";
    }

  });

  html += "</div>";

  contenedor.innerHTML = html;
}


// =====================================
// 🔹 ATAJOS DE TECLADO Y FOCO (Cambios 2026-06-17)
// =====================================
// #4 Auto-focus: al abrir la app, el cursor ya está en el textarea de la traza
//    (abres → pegas → analizas, sin clics extra).
// #5 Ctrl+Enter dentro del textarea ejecuta "Analizar".
(function inicializarAtajos() {
  const areaTraza = document.getElementById("inputTraza");
  if (!areaTraza) return;

  // #4 — foco automático al cargar
  areaTraza.focus();

  // #5 — Ctrl+Enter = Analizar
  areaTraza.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      if (btnAnalizar) btnAnalizar.click();
    }
  });
})();
