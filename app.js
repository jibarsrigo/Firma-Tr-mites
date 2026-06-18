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
*/
  
// CÓMO AÑADIR REGLAS:
// 1. Añadir condición en “DETECCIÓN DE REGLAS” → idReglaDetectada = "nombre_regla"
// 2. Añadir la acción en acciones.json con el mismo id
// 3. La regla tiene prioridad y sustituye la lógica estándar



// 🔹 VERSION JS (editable manual) 
// Cambios 2026-06-12: flujo visual, marco blanco compacto y mostrar solo tras analizar
const VERSION_JS = "1.3.13";

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

function esLineaFirmaKoHelper(linea) {
  return /TR_SGX|FI FIRMA KO|FIN FIRMA KO/i.test(String(linea || ""));
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

// 👉 ¿Es una línea informativa de método de firma (no un error)?
function esLineaMetodoFirma(texto) {
  return /^M[EÈ]TODE DE FIRMA:/i.test(String(texto || "").trim());
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
}

// Botón cerrar panel
document.getElementById("btnCerrarPanel").onclick = cerrarPanelFunc;

// =====================================
// 🔴 BOTÓN DETALLES - Muestra información de la versión
// =====================================

btnDetalles.onclick = () => {
  const vJson = accionesJSON?.version || "—";
  abrirPanel("Detalles del analizador", `
<ul>
  <li><b>Analizador de trazas SistraHelp</b> orientado a soporte técnico CAU.</li>
  <li>Versión actual: <b>js v ${VERSION_JS}</b> · reglas <b>acciones.json v ${vJson}</b> (interfaz <b>index.html</b>).</li>

  <br>

  <li><b>Qué hace al analizar una traza:</b></li>
  <li>Muestra el <b>flujo del trámite</b> (eventos TR_) con píldoras de colores y etiquetas.</li>
  <li>Indica el <b>diagnóstico</b> (cartel azul + frase explicativa dentro del flujo, cuando aplica).</li>
  <li>Propone la <b>acción recomendada</b> y el enlace <b>Mail</b> cuando existe.</li>
  <li>Lista los <b>literales detectados</b> con contador de repeticiones (xN), o avisa si no hay literales.</li>
  <li>Enlace <b>Reportar análisis incorrecto</b> al final del resultado.</li>

  <br>

  <li><b>Estado actual (completado y validado):</b></li>
  <li>✔ Interfaz estilo V5: tarjetas Flujo / Acción / Literales; apartados laterales plegables.</li>
  <li>✔ <b>Pre-firma:</b> fallo formulario y fallo Portafib (acción dinámica con {lit}).</li>
  <li>✔ <b>Firma OK:</b> trámite finalizado; caso especial <b>firma_correcta_portafib</b>.</li>
  <li>✔ <b>Cl@ve:</b> códigos 8–15, 101, 103, 103-15, 104; Cl@ve móvil; CLAVE_MOVIL no permitida.</li>
  <li>✔ <b>Cl@ve Permanente cancelada</b> (Signatura cancel·lada + Cl@veFirm@ sin código).</li>
  <li>✔ <b>Validación @firma</b> (InvalidNotSignerCertificate) → escalado Portafib.</li>
  <li>✔ <b>Autofirma:</b> servidor (SAF_27), cancelada, entorno FIRE; cliente por SO (Windows, Mac, Linux, Android, iPhone, móvil).</li>
  <li>✔ <b>Método de firma en Firma KO</b> (Autofirm@ / Cl@veFirm@); orden cronológico; ignora notas del agente.</li>
  <li>✔ Discrepancia acceso Cl@ve vs firma certificado; Cliente de Firma Móvil + servidor intermedio.</li>

  <br>

  <li><b>Pendiente de mejora:</b></li>
  <li>🔧 Limpieza de literales: mensaje útil arriba, traza completa debajo (sin ruido técnico).</li>
  <li>🔧 Mostrar aviso de Firma KO previo también en tarjeta Acción cuando el trámite acaba OK.</li>
  <li>🔧 Versión del badge desde acciones.json automáticamente; botón Actualizar solo icono.</li>
  <li>🔧 Más trazas Cl@ve reales para validar casos 8–15, 101, 103 y móvil.</li>

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
  const vJson = accionesJSON?.version || "—";
  abrirPanel("Motor de análisis (reglas)", `
<ul>
  <li><b>Funcionamiento del analizador (js v ${VERSION_JS}):</b></li>
  <li>Lee la traza de SistraHelp filtrando solo líneas TR_ / ERROR - (ignora notas del agente).</li>
  <li>Ordena eventos por fecha/hora (SistraHelp pega lo más reciente arriba).</li>
  <li>Reconstruye el flujo: TR_FRI → TR_FRF → TR_SGI → TR_SGX / TR_SGO → TR_REG → TR_FIN.</li>
  <li>Clasifica en fase: <b>pre-firma</b>, <b>error en firma</b> o <b>firma correcta</b>.</li>
  <li>Prioridad de cierre: <b>TR_FIN / TR_SGO</b> sobre TR_SGX previo (cómo acabó el trámite manda).</li>
  <li>Aplica la regla de <b>acciones.json v ${vJson}</b> y muestra acción + mail cuando existe.</li>

  <br>

  <li><b>Reglas activas (estado de presentación):</b></li>
  <li>✔ <b>fallo_formulario</b> — No llega a firma, sin error de flujo Portafib.</li>
  <li>✔ <b>fallo_portafib</b> — No llega a firma por error de sesión/flujo; acción dinámica {lit}.</li>
  <li>✔ <b>firma_correcta</b> — Trámite finalizado correctamente.</li>
  <li>✔ <b>firma_correcta_portafib</b> — Trámite OK con error Portafib previo en traza.</li>
  <li>✔ <b>error_clave_8_15</b> — Cl@ve códigos 8–15 (cartel Cl@ve + frase + acción + mail).</li>
  <li>✔ <b>error_clave_103</b> — Contraseña bloqueada.</li>
  <li>✔ <b>error_clave_103_15</b> — Certificado bloqueado (103 + tipus 15; también tras 8–15 previo).</li>
  <li>✔ <b>error_clave_101</b> — Nivel de registro insuficiente.</li>
  <li>✔ <b>error_clave_104</b> — Registro débil.</li>
  <li>✔ <b>error_clave_firma_cancelada</b> — Signatura cancel·lada + Cl@veFirm@ sin código 8–15.</li>
  <li>✔ <b>error_clave_movil</b> — Solo TR_SGI o KO Cl@ve sin código; desempate por método marcado.</li>
  <li>✔ <b>error_clave_movil_no_permitida</b> — Literal CLAVE_MOVIL no permitida.</li>
  <li>✔ <b>error_validacion_certificado</b> — InvalidNotSignerCertificate / validación @firma → Portafib.</li>
  <li>✔ <b>error_autofirma_servidor</b> — SAF_27 (proveedor Autofirma).</li>
  <li>✔ <b>error_autofirma_cancelada</b> — Signatura cancelada + Autofirm@ (sin Cl@ve).</li>
  <li>✔ <b>error_autofirma_entorno</b> — Solo TR_SGI con certificado (FIRE no invoca).</li>
  <li>✔ <b>error_autofirma_cliente_generico</b> — Cl@ve marcado pero traza Autofirma; confirmar SO y método real.</li>
  <li>✔ <b>error_autofirma_cliente_*</b> — windows, mac, linux, android, iphone, movil (resolverReglaAutofirmaCliente).</li>
  <li>⚙ <b>error_fire</b> — Reserva certificado local sin literales Autofirma concluyentes.</li>
  <li>⚙ <b>error_autofirma</b> — Regla legacy de respaldo (no usada en árbol principal).</li>

  <br>

  <li><b>Prioridad en fase error_firma:</b></li>
  <li>1. SAF_27 (Autofirma servidor) → 2. Validación certificado (@firma) → 3. CLAVE_MOVIL no permitida</li>
  <li>4. Códigos Cl@ve (103 &gt; 8–15 &gt; 101 &gt; 104) → 5. Cancelada Cl@veFirm@ sin código</li>
  <li>6. Autofirma fuerte (fitxer buit / Método Autofirm@ / timeout+cliente móvil) → resolverReglaAutofirmaCliente</li>
  <li>7. Autofirma débil (solo certificado marcado) → 8. Cancelada Autofirma → 9. Cl@ve móvil (KO sin código)</li>
  <li>10. Solo TR_SGI sin cierre → entorno FIRE (certificado) o Cl@ve móvil (Cl@ve) → 11. Cliente Autofirma genérico</li>

  <br>

  <li><b>Criterios clave CAU:</b></li>
  <li><b>Método de firma del Firma KO</b> (Autofirm@ / Cl@veFirm@) manda sobre selector del técnico.</li>
  <li><b>Acceso ≠ firma:</b> Cl@ve en acceso orienta discrepancia; KO elige la acción.</li>
  <li>Sin <b>TR_SGI</b> → pre-firma (Portafib si literal de flujo; si no, formulario).</li>
  <li><b>TR_SGO / TR_FIN</b> → firma correcta (con o sin Portafib previo).</li>
  <li>Cliente de Firma Móvil + servidor intermedio → Android/iPhone aunque marquen Ordenador.</li>
  <li>Autofirm@ + timeout + client de firma en KO → iPhone si no hay SO escritorio en traza.</li>

  <br>

  <li><b>Pendiente:</b></li>
  <li>🔧 Limpieza estructural de literales (mensaje útil vs traza completa).</li>
  <li>🔧 Mails Autofirma con anclas específicos por SO (ahora #Autofirma genérico).</li>
  <li>🔧 Validar más trazas Cl@ve y FIRE sin Método de firma en KO (trazas antiguas).</li>

  <br>

  <li><b>Nota:</b> ✔ = regla con presentación completa validada. ⚙ = reserva o legacy.</li>
</ul>
`);
};



// =====================================
// CHECK SAML - Muestra ayuda sobre error SAM
// =====================================

checkSaml.onchange = () => {
  if (checkSaml.checked) {
    checkBlanco.checked = false;
    abrirPanel("El ciudadano ve error SAML", `
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
  } else cerrarPanelFunc();
};


// =====================================
// CHECK PÁGINA EN BLANCO
// =====================================

checkBlanco.onchange = () => {
  if (checkBlanco.checked) {
    checkSaml.checked = false;
    abrirPanel("La página queda en blanco", `
La página queda en blanco<br><br>

Si al acceder el ciudadano ve la página en blanco, debe considerarse primero como un posible problema de acceso o de pasarela. En estos casos, es posible que el ciudadano no llegue a entrar realmente en el trámite y que no se genere traza útil en SistraHelp.<br><br>

Qué revisar:<br>
- Puede estar fallando la pasarela de acceso.<br>
- Puede haberse producido una redirección incompleta o fallida tras la identificación.<br>
- El navegador, una extensión, un proxy, firewall o antivirus pueden estar bloqueando la carga correcta de la página.<br><br>

Prueba recomendada:<br>
Conviene probar a acceder a Carpeta Ciudadana GOB para comprobar si la pasarela carga correctamente allí. Si tampoco carga o el comportamiento es similar, la orientación principal debe ser problema de acceso/pasarela, más que de firma o del trámite.
    `);
  } else cerrarPanelFunc();
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
    abrirPanel("Validación", "Debe seleccionar método");
    return;
  }

  // ✅ 2. VALIDACIÓN SISTEMA (ANTES que la traza)
  if (metodoCert.checked && !sisPC.checked && !sisMovil.checked) {
    abrirPanel("Validación", "Debe seleccionar sistema");
    return;
  }

  // ✅ 3. VALIDACIÓN TRAZA
  // 👉 Se obtiene la traza pegada por el usuario
const texto = document.getElementById("inputTraza").value.trim();

  // 👉 IMPORTANTE: Guardar líneas originales ANTES de convertir a mayúsculas.
  // Esto preserva el formato original (tabuladores, espacios, caracteres especiales) 
  // para mostrar los literales de error exactamente como el usuario los pegó.
const lineasOriginales = texto.split(/\r?\n/);

  // 👉 Se convierte todo a mayúsculas. Evita errores al buscar textos (TR_, literales, etc.)
const traza = texto.toUpperCase();

  // 👉 Si no hay texto → error
if (!texto) {
  abrirPanel("Validación", "Todavía no ha pegado trazas");
  return;
}
  
// 👉 Si no contiene TR_ → no es traza válida
if (!traza.includes("TR_")) {
  abrirPanel("Validación", `Esto no es una traza válida`);
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
const hayREG = eventos.includes("TR_REG"); // 🔹 registro del trámite
const hayFIN = eventos.includes("TR_FIN"); // 🔹 fin de trámite (finalizado)

// 🔹 NUEVO: eventos para flujo visual
const eventosFlujo = {
  TR_FRI: hayFRI,
  TR_FRF: hayFRF,
  TR_SGI: haySGI,
  TR_SGX: haySGX,
  TR_SGO: haySGO,
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

// 🔹 PRIORIDAD: cómo ACABÓ el trámite manda sobre intentos previos.
//    Si el trámite se finalizó (TR_FIN) o la firma acabó OK (TR_SGO),
//    eso gana aunque antes hubiera un TR_SGX (firma cancelada/KO en un reintento).
if (hayFIN || haySGO) {
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
         linea.includes("PROVEÏDOR: CLAVEFIRMA");
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

// 👉 KO: timeout + cliente de firma no invocado (Autofirm@; frecuente iPhone/Safari)
const hayTimeoutClienteFirmaEnKo = lineasTraza.some(linea =>
  esLineaFirmaKoHelper(linea) &&
  /TIEMPO PARA FIRMAR|TEMPS PER A FIRMAR|EL TEMPS PER A FIRMAR/i.test(linea) &&
  /CLIENTE DE FIRMA|CLIENT DE FIRMA/i.test(linea)
);

const hayIndiciosEscritorioEnTraza =
  /WINDOWS|WIN32|LINUX|UBUNTU|DEBIAN|FEDORA|MACOS|\bMAC\b|DARWIN|OS X/i.test(trazaEstructurada);

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

const hayErrorServidorIntermedioEnTraza =
  /SERVIDOR INTERMEDI|NO SE PUDO CONECTAR CON EL SERVIDOR INTERMEDIO|NO S['']HA POGUT CONNECTAR.*SERVIDOR INTERMEDI/i.test(trazaEstructurada);

const haySignaturaCancelada = lineasTraza.some(linea =>
  /SIGNATURA CANCEL|FIRMA CANCELADA|FIRMA CANCEL·LADA/i.test(linea)
);

const hayCanceladaConClave = lineasTraza.some(linea =>
  /SIGNATURA CANCEL|FIRMA CANCEL/i.test(linea) && esMetodoFirmaClaveEnLineaHelper(linea)
);

// hayCanceladaClaveFirmaEnKo se calcula más abajo (tras hayErrorClaveReal)

function resolverReglaAutofirmaCliente() {
  // 👉 Prioridad 0: literal Cliente de Firma Móvil en la traza (Android/iOS, aunque marquen Ordenador/Linux)
  if (hayClienteFirmaMovilEnTraza) {
    if (/IPHONE|IPAD\b|\bIOS\b/.test(trazaEstructurada)) return "error_autofirma_cliente_iphone";
    return "error_autofirma_cliente_android";
  }
  // 👉 Prioridad 1: SO marcado por el técnico (certificado local)
  if (metodoCert.checked && sisMovil && sisMovil.checked) {
    if (/IPHONE|IPAD\b|\bIOS\b/.test(trazaEstructurada)) return "error_autofirma_cliente_iphone";
    if (/ANDROID/.test(trazaEstructurada)) return "error_autofirma_cliente_android";
    if (hayTimeoutClienteFirmaEnKo) return "error_autofirma_cliente_iphone";
    return "error_autofirma_cliente_movil";
  }
  if (metodoCert.checked && sisPC && sisPC.checked) {
    if (/LINUX|UBUNTU|DEBIAN|FEDORA/.test(trazaEstructurada)) return "error_autofirma_cliente_linux";
    if (/MACOS|\bMAC\b|DARWIN|OS X/.test(trazaEstructurada)) return "error_autofirma_cliente_mac";
    if (hayTimeoutClienteFirmaEnKo && !hayIndiciosEscritorioEnTraza) {
      if (/ANDROID/.test(trazaEstructurada)) return "error_autofirma_cliente_android";
      return "error_autofirma_cliente_iphone";
    }
    return "error_autofirma_cliente_windows";
  }
  // 👉 Acceso Cl@ve marcado: si el KO es Autofirm@ + timeout/cliente firma → acción concreta (p. ej. iPhone)
  if (metodoClave.checked && !metodoCert.checked) {
    if (/IPHONE|IPAD\b|\bIOS\b/.test(trazaEstructurada)) return "error_autofirma_cliente_iphone";
    if (/ANDROID/.test(trazaEstructurada)) return "error_autofirma_cliente_android";
    if (hayTimeoutClienteFirmaEnKo && hayMetodoFirmaAutofirmaEnKo && !hayIndiciosEscritorioEnTraza) {
      return "error_autofirma_cliente_iphone";
    }
    if (hayClienteFirmaMovilEnTraza) {
      if (/IPHONE|IPAD\b|\bIOS\b/.test(trazaEstructurada)) return "error_autofirma_cliente_iphone";
      return "error_autofirma_cliente_android";
    }
    return "error_autofirma_cliente_generico";
  }
  // 👉 Prioridad 2: pistas en la traza (sin método/SO marcado)
  if (/IPHONE|IPAD\b|\bIOS\b/.test(trazaEstructurada)) return "error_autofirma_cliente_iphone";
  if (/ANDROID/.test(trazaEstructurada)) return "error_autofirma_cliente_android";
  if (/LINUX|UBUNTU|DEBIAN|FEDORA/.test(trazaEstructurada)) return "error_autofirma_cliente_linux";
  if (/MACOS|\bMAC\b|DARWIN|OS X/.test(trazaEstructurada)) return "error_autofirma_cliente_mac";
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


// 👉 Detectamos errores reales de Portafib / sesión (solo literales acordados, no sesión cliente)
const hayErrorPortafibReal = erroresUnicos.some(linea =>
  /FLUXE NO ES V[ÀA]LID/i.test(linea) ||
  /EXCEPCI[ÓO].*GENERAR SESSI[ÓO].*FIRMA/i.test(linea) ||
  /EXCEPCI[ÓO]\s+SESSI[ÓO]\s+FIRMA/i.test(linea) ||
  linea.includes("TIMESTAMPINVALIDEXCEPTION") ||
  linea.includes("TRASLLAT NO")
);

  

 
// 👉 Cl@ve no se detecta por texto (por ahora)
// 👉 Se identifica por el método seleccionado por el usuario
// const hayClaveError = ... → pendiente definir con ejemplos reales
  

// =====================================
// 🔴 MÉTODO UTILIZADO
// =====================================
// 👉 Método seleccionado manualmente por el técnico
// 👉 Tiene prioridad sobre cualquier dato que pudiera inferirse de la traza
// 👉 En el futuro se podrá leer automáticamente desde el formulario pegado

const esClave = metodoClave.checked;
const esCert = metodoCert.checked;

const hayDiscrepanciaAccesoClaveFirmaAutofirma =
  (esClave && !esCert && hayMetodoFirmaAutofirmaEnKo) ||
  /ACCEDE.*CLAVE.*AUTOFIRMA|ACCESO.*CLAVE.*AUTOFIRMA|CLAVE PERMANENT.*AUTOFIRMA|CLAVE PERMANENT.*FIRM.*AUTOFIRMA/i.test(trazaEstructurada);

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

if (!haySGI && hayErrorPortafibReal){

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

// 👉 Autofirma servidor (SAF_27) SIEMPRE gana
if (hayAutofirmaError) {

  idReglaDetectada = "error_autofirma_servidor";

}
else if (hayErrorValidacionCertificado) {

  // 👉 @firma no validó el certificado (InvalidNotSignerCertificate). Escala Portafib, no entorno local.
  idReglaDetectada = "error_validacion_certificado";

}
else if (hayClaveMovilNoPermitida) {

  idReglaDetectada = "error_clave_movil_no_permitida";

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
  // FASE: FIRMA_OK (firma completada correctamente)
  // ======================================================
  // Detecta: firma exitosa (posibles errores posteriores: registro, archivo, etc.)
  // Nota: firma OK no garantiza que el trámite se haya completado correctamente.

  // 🔹 Cambios 2026-06-16: si el trámite finaliza OK pero por el camino hubo
  // un error de Portafib ("El fluxe no es vàlid"), lo indicamos aparte.
  if (hayErrorPortafibReal) {
    idReglaDetectada = "firma_correcta_portafib";
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

  // 👉 No llega a firma
  if (hayErrorPortafibReal) {

    // 👉 Error de sesión / flujo (Portafib)
    cartelDiagnostico = cartelAzul("Fallo Portafib");
    fraseDiagnostico = "La firma no se inicia por un error de flujo.";

  } else {

    // 👉 Sin errores técnicos → problema de formulario
    cartelDiagnostico = cartelAzul("Fallo Formulario");
    fraseDiagnostico = "La firma no se inicia, y no hay errores de flujo " + literalFlujo("Fluxe no vàlid") + ".";
  }

}
else if (idReglaDetectada === "error_clave_movil" || idReglaDetectada === "error_clave_movil_no_permitida") {

  cartelDiagnostico = cartelAzul(idReglaDetectada === "error_clave_movil" && haySGX ? "Cl@ve" : "Cl@ve móvil");

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
    } else if (!haySGX || !haySignaturaCancelada) {
      frase += " Posible Cl@ve móvil: revisar acceso en Inicio trámite o Carga (doble clic en SistraHelp).";
    }
    if (esCert && !esClave) {
      frase += " Si el acceso fue con certificado, valorar entorno Autofirma/FIRE.";
    }
    if (ultimoEvento === "TR_SGI" && !haySGO && !hayFIN) {
      frase += " Los últimos intentos quedaron solo en Inicio firma.";
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

  // Literal técnico (gris pequeño) reconstruido desde la traza
  let literalClave = "CODI ERROR: " + (codigoClaveDetectado || "?")
    + " - PROVEÏDOR: CLAVEFIRMA";
  if (tipusResultatDetectado) {
    literalClave += " - TIPUS RESULTAT: " + tipusResultatDetectado;
  }

  fraseDiagnostico = "La firma se inicia pero falla en Cl@ve (" + codigoTexto + "). " + literalFlujo(literalClave);

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
else if (idReglaDetectada === "error_autofirma_servidor") {

  cartelDiagnostico = cartelAzul("Autofirma servidor");
  fraseDiagnostico = "Fallo del servicio Autofirma (SAF_27). Es incidencia de proveedor, no del entorno local del ciudadano.";

}
else if (idReglaDetectada === "error_autofirma_cancelada") {

  cartelDiagnostico = cartelAzul("Autofirma");
  fraseDiagnostico = "Firma cancelada con Autofirm@ sin código Cl@ve. Suele deberse a timeout, SSL o fallo de comunicación con AutoFirma.";

}
else if (idReglaDetectada === "error_autofirma_entorno") {

  cartelDiagnostico = cartelAzul("Autofirma / FIRE");
  const reintentos = numSGI > 1 ? " (" + numSGI + " intentos)" : "";
  fraseDiagnostico = "La firma se inicia" + reintentos + " pero no se completa: no hay Firma KO ni Firma OK. Posible bloqueo de invocación FIRE/AutoFirma (proxy, VPN, navegador).";

}
else if (idReglaDetectada && idReglaDetectada.indexOf("error_autofirma_cliente") === 0) {

  cartelDiagnostico = cartelAzul("Autofirma");
  let motivo = "Error en el entorno local de firma con certificado (AutoFirma / Cliente de Firma).";
  if (hayClienteFirmaMovilEnTraza && hayErrorServidorIntermedioEnTraza) {
    motivo = "Error del Cliente de Firma Móvil: no se pudo conectar con el servidor intermedio de firma.";
    if (hayMetodoFirmaAutofirmaEnKo) {
      motivo += " " + literalFlujo("Método de firma: Autofirm@") + " en el Firma KO.";
    }
    if (hayDiscrepanciaAccesoClaveFirmaAutofirma) {
      motivo += " Acceso con Cl@ve, firma con certificado/AutoFirma.";
    }
  } else if (hayClienteFirmaMovilEnTraza) {
    motivo = "Error del Cliente de Firma Móvil (componente AutoFirma en dispositivo móvil).";
    if (hayMetodoFirmaAutofirmaEnKo) {
      motivo += " " + literalFlujo("Método de firma: Autofirm@") + " en el Firma KO.";
    }
    if (hayDiscrepanciaAccesoClaveFirmaAutofirma) {
      motivo += " Acceso con Cl@ve, firma con certificado/AutoFirma.";
    }
  } else if (hayTimeoutClienteFirmaEnKo && hayMetodoFirmaAutofirmaEnKo) {
    motivo = "Tiempo de firma expirado o cliente de firma no invocado/instalado (AutoFirma / FIRE). "
      + literalFlujo("Método de firma: Autofirm@") + " en el Firma KO.";
    if (hayDiscrepanciaAccesoClaveFirmaAutofirma) {
      motivo += " Acceso con Cl@ve, firma con certificado/AutoFirma.";
    }
    if (metodoCert.checked && sisPC && sisPC.checked && !hayIndiciosEscritorioEnTraza) {
      motivo += " Sin indicios de SO de escritorio en la traza: confirmar si firmó desde iPhone/móvil antes de pasos Windows.";
    }
  } else if (hayMetodoFirmaAutofirmaEnKo && haySignaturaCancelada) {
    motivo = "Firma cancelada. " + literalFlujo("Método de firma: Autofirm@") + " confirmado en el Firma KO.";
    if (hayDiscrepanciaAccesoClaveFirmaAutofirma) {
      motivo += " El acceso al trámite fue con Cl@ve, pero la firma se intentó con certificado/AutoFirma.";
    }
  } else if (hayMetodoFirmaAutofirmaEnKo) {
    motivo = "Error de firma con Autofirm@ (" + literalFlujo("Método de firma: Autofirm@") + " en el Firma KO).";
    if (hayDiscrepanciaAccesoClaveFirmaAutofirma) {
      motivo += " Acceso con Cl@ve, firma con certificado/AutoFirma.";
    }
  } else if (hayAutofirmaFitxerBuit) {
    motivo = "El fichero firmado llega vacío (fitxer signat buit / plugin AutoFirma).";
  } else if (/TIEMPO PARA FIRMAR|TEMPS PER A FIRMAR/i.test(trazaEstructurada)) {
    motivo = "Tiempo de firma expirado (timeout AutoFirma / Cliente de Firma).";
  } else if (/CLIENT(E)? DE FIRMA M[ÒOÓ]?VIL|FIRMA MOVIL|ERROR DE AUTOFIRMA O DEL CLIENTE DE FIRMA/i.test(trazaEstructurada)) {
    motivo = "Error del Cliente de Firma Móvil (componente intermedio AutoFirma).";
  } else if (/SERVIDOR INTERMEDI|NO SE PUDO CONECTAR|NO S['']HA POGUT CONNECTAR/i.test(trazaEstructurada)) {
    motivo = "No se pudo conectar con el servidor intermedio de firma (entorno local).";
  } else if (/MODUL.*FIRMA FINALITZAT|MODULO DE FIRMA FINALIZADO/i.test(trazaEstructurada)) {
    motivo = "El módulo de firma finalizó inesperadamente.";
  }
  if (!hayMetodoFirmaAutofirmaEnKo && haySignaturaCancelada && !/TIEMPO PARA FIRMAR|TEMPS PER A FIRMAR/i.test(trazaEstructurada)) {
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
  const esCertificadoMovilMarcado = esCert && sisMovil && sisMovil.checked;
  if (
    hayMetodoFirmaAutofirmaEnKo &&
    !hayDiscrepanciaAccesoClaveFirmaAutofirma &&
    esCert &&
    !(esCertificadoMovilMarcado && (hayClienteFirmaMovilEnTraza || hayTimeoutClienteFirmaEnKo))
  ) {
    motivo += " Confirmar en SistraHelp si el acceso fue Cl@ve (Inicio trámite o Carga del trámite).";
  }
  if (hayClienteFirmaMovilEnTraza && metodoCert.checked && sisPC && sisPC.checked) {
    motivo += " Los literales apuntan a Cliente de Firma Móvil (Android), no Autofirma de escritorio.";
  }
  if (esClave && !esCert && hayAutofirmaExplicitoFuerte && !hayDiscrepanciaAccesoClaveFirmaAutofirma) {
    motivo += " La traza apunta a certificado/AutoFirma aunque el acceso marcado sea Cl@ve.";
  }
  const reglasAutofirmaClienteConAccion = [
    "error_autofirma_cliente_windows", "error_autofirma_cliente_mac",
    "error_autofirma_cliente_linux", "error_autofirma_cliente_android",
    "error_autofirma_cliente_iphone", "error_autofirma_cliente_movil"
  ];
  fraseDiagnostico = reglasAutofirmaClienteConAccion.includes(idReglaDetectada)
    ? motivo
    : motivo + " Solicitar prueba de firma local con PDF antes de escalar.";

}
else if (idReglaDetectada === "error_fire") {

  cartelDiagnostico = cartelAzul("FIRE / certificado");
  fraseDiagnostico = "La firma se inicia pero falla con certificado local (FIRE), sin literales de Cl@ve ni Autofirma.";

}
else if (haySGX && !haySGO && !hayFIN && !cartelDiagnostico) {

  // 👉 Error proveedor genérico (solo si no hay cartel ya asignado, p. ej. Cl@ve)
  // 🔹 Solo si la firma NO acabó OK y el trámite NO se finalizó: así un TR_SGX
  //    que fue solo un reintento cancelado no se diagnostica como fallo.
  diagnosticoTexto += "- La firma se inicia pero falla en el sistema de firma.\n";

}
else if (haySGO) {

  // 👉 Firma correcta: el mensaje se muestra en la tarjeta de Acción (ver acciones.json),
  // ya no como texto suelto fuera de las tarjetas.

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
  const trazaCompleta = lineas.join("\n");
  const hayFluxe = /fluxe no es v[àa]lid/i.test(trazaCompleta);
  const hayExcepcioSessio = /excepci[oó]\s+al\s+generar\s+sessi[oó]\s+firma/i.test(trazaCompleta);
  const literalGris = (texto, cursiva) =>
    "<span style=\"color:#9a9890;font-size:12px" + (cursiva ? ";font-style:italic" : "") + "\">\"" + texto + "\"</span>";

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
    textoAccion = "Acceso marcado como Cl@ve; el Firma KO indica certificado local (Autofirm@).\n" + textoAccion;
  } else if (idReglaDetectada === "error_autofirma_cliente_generico" && hayMetodoFirmaAutofirmaEnKo && haySignaturaCancelada) {
    textoAccion = "Firma cancelada con Autofirm@ (Método de firma confirmado en el Firma KO).\n"
      + "El acceso al trámite fue con Cl@ve, pero la firma se intentó con certificado/AutoFirma.\n"
      + "Solicitar prueba de firma local con PDF antes de indicar pasos concretos de instalación.\n"
      + "*Seleccione Certificado local + Sistema si conoce el SO para obtener la acción y el mail específicos.";
  } else if (idReglaDetectada === "error_clave_firma_cancelada") {
    if (esCert && !esClave) {
      textoAccion += "\n*No orientar reinstalar AutoFirma: el KO indica Cl@ve, no certificado local.";
    }
  } else if (idReglaDetectada === "error_clave_movil" && haySGX) {
    // 🔹 Hay Firma KO en la traza: no usar el texto de «solo Inicio firma».
    if (haySignaturaCancelada && !hayErrorClaveReal) {
      textoAccion = "La firma se inicia pero falla con Signatura cancel·lada, sin código de error Cl@ve (8–15, 101, 103…).\n"
        + "Posible Cl@ve móvil, ventana de certificado o acceso con nivel insuficiente.\n"
        + "Revisar en SistraHelp el último acceso al trámite (doble clic en Inicio trámite o Carga del trámite): si figura CLAVE_MOVIL, indicar usar Cl@ve Permanente o certificado si el trámite lo permite.\n"
        + "*Si el acceso fue con certificado (AUT), valorar entorno Autofirma/FIRE (wiki Autofirma).";
    } else {
      textoAccion = "La firma se inicia pero falla en Cl@ve sin código de error reconocido en la traza (aparece Firma KO).\n"
        + "Revisar en SistraHelp el último acceso al trámite (doble clic en Inicio trámite o Carga del trámite): si figura CLAVE_MOVIL, indicar usar Cl@ve Permanente o certificado si el trámite lo permite.\n"
        + "*Si el acceso fue con certificado (AUT), valorar entorno Autofirma/FIRE (wiki Autofirma).";
    }
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
    salidaFinal += "<div class='literal-pequeno'>";

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
      salidaFinal += pref + escapeHtml(textoLiteral) + '<br>';
      if (index < literalOrder.length - 1) salidaFinal += '<br>';
    });

    salidaFinal += '</div></div></div>';

  }

// 🔥 SEGUNDO: caso formulario REAL (versión final sin pérdida de datos)
else if (contexto.fase === "pre_firma") {

  salidaFinal += "<div class=\"panel-card\" style=\"margin-top:22px;\">";
  salidaFinal += "<div class=\"panel-card__head\" style=\"text-transform:none;\">" + iconoLiterales + "Literales detectados</div>";
  salidaFinal += "<div class=\"panel-card__body\">";
  salidaFinal += "<div class='literal-pequeno'>";

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
    salidaFinal += pref + lit + "<br>";
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
salidaFinal += "<div class='literal-pequeno'>";

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
  salidaFinal += pref + escapeHtml(literalOriginal[lit] || lit) + "<br>";
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

  

// 🔹 NUEVO: pintar flujo visual encima
renderFlujoVisual(eventosFlujo);

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
  if (cartelDiagnostico || fraseDiagnostico) {
    let contenidoDiag = "<div style=\"display:flex;align-items:center;gap:10px;flex-wrap:wrap;\">";
    if (cartelDiagnostico) {
      contenidoDiag += cartelDiagnostico;
    }
    if (fraseDiagnostico) {
      contenidoDiag += "<span>⚠ " + fraseDiagnostico + "</span>";
    }
    contenidoDiag += "</div>";
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

};




// =====================================
// 🔴 BOTÓN LIMPIAR
// =====================================
// 👉 Reinicia la interfaz al estado inicial

btnLimpiar.onclick = () => {

  // ─────────────────────────────
  // 🔹 LIMPIEZA DE CHECKS DE ERROR VISUAL
  // ─────────────────────────────
  // Quitamos los radios de SAML / página en blanco
  // (esto es solo ayuda visual, no afecta al análisis)
  checkSaml.checked = false;
  checkBlanco.checked = false;


  // ─────────────────────────────
  // 🔹 LIMPIEZA DE CAMPOS DE TEXTO
  // ─────────────────────────────
  // Aquí realmente limpiamos lo importante:
  // la traza pegada por el técnico
  document.getElementById("inputTraza").value = "";
 

  // ─────────────────────────────
  // 🔹 RESET DE MÉTODO DE FIRMA
  // ─────────────────────────────
  // Volvemos al método por defecto: Cl@ve marcado (Cambios 2026-06-17)
  metodoClave.checked = true;
  metodoCert.checked = false;

  // También limpiamos selección de sistema
  sisPC.checked = false;
  sisMovil.checked = false;

  // Y ocultamos el bloque de sistema (como si empezaras de cero)
  bloqueSistema.style.display = "none";


  // ─────────────────────────────
  // 🔹 LIMPIEZA DE RESULTADOS EN PANTALLA
  // ─────────────────────────────
  // Cerramos panel si está abierto (SAML, blanco, etc.)
  cerrarPanelFunc();


  // 👉 Volvemos al estado inicial
placeholder.style.display = "";

// 👉 Limpiamos el contenido del resultado
document.getElementById("resultado").innerText = "";

// 🔹 Cambios 2026-06-16: quitamos el ancho máximo fijado al analizar
document.getElementById("resultado").style.maxWidth = "";

// 🔹 NUEVO: limpiar y ocultar flujo visual
// Cambios 2026-06-12: ocultar el marco del flujo al pulsar Limpiar o al volver al estado inicial
const flujoCard = document.getElementById("flujoVisualCard");
const flujo = document.getElementById("flujoVisual");
if (flujo) {
  flujo.innerHTML = "";
  flujo.style.display = "none";
}
// 🔹 Cambios 2026-06-16: limpiar también la frase del diagnóstico del flujo
const flujoDiag = document.getElementById("flujoDiagnostico");
if (flujoDiag) {
  flujoDiag.innerHTML = "";
  flujoDiag.style.display = "none";
}
if (flujoCard) {
  flujoCard.style.display = "none";
}

// 👉 Ocultamos el bloque de resultado
document.getElementById("resultado").style.display = "none";

  // ─────────────────────────────
  // 🔹 INFO EN CONSOLA (PARA DEBUG)
  // ─────────────────────────────
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
// 🔹 NUEVO: FUNCIÓN FLUJO VISUAL
// Cambios 2026-06-12: renderiza los pasos TR_ con etiquetas de estado y color
// =====================================

function renderFlujoVisual(eventos) {

  const contenedor = document.getElementById("flujoVisual");
  if (!contenedor) return;

  const pasos = ["TR_FRI","TR_FRF","TR_SGI","TR_SGX","TR_SGO","TR_REG","TR_FIN"];

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
    const nombrePaso = p === 'TR_FRI' ? 'Inicio formulario' : p === 'TR_FRF' ? 'Fin formulario' : p === 'TR_SGI' ? 'Inicio firma' : p === 'TR_SGX' ? 'Firma KO' : p === 'TR_SGO' ? 'Firma OK' : p === 'TR_REG' ? 'Registro' : 'Fin trámite';
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
