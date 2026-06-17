/* =====================================================
           FUNCIONALIDADES IMPLEMENTADAS
   =====================================================

VERSION 1.0     - Se valida que la traza y el método de firma sean correctos antes de analizar 
                - Se muestran paneles informativos para errores de acceso (SAML y página en blanco) 
                - Se normaliza la traza a mayúsculas para evitar problemas en la detección 
                - Se detectan los eventos TR_ principales dentro de la traza 
                - Se genera un diagnóstico técnico dinámico en función de los TR_ detectados 
                - Se genera diagnóstico + acción basada en flujo TR_ 
 VERSION 1.1    - Se muestra lectura html json y js panel superior html y editable desde codigo 
 VERSION 1.1.1  - Se Añade 🔴 DETECCIÓN DE REGLAS (PATRONES) con la primera regla par el Formulario
 VERSION 1.1.2  - MOTOR BASE DE ANÁLISIS TR_ → detección → ID regla → control → salida personalizada → stop 
 VERSION 1.2.0  - Introducción de contexto de flujo estructurado (objeto contexto)
                    - Modelización de estados: pre_firma / error_firma / firma_ok
                    - Simplificación del árbol de decisión basado en fase del flujo
                    - Mejora de robustez ante trazas incompletas o con orden irregular
 VERSION 1.2.1  - Detección avanzada de errores técnicos:
                         FLUXE, SESSION, EXCEPTION, SAF_
                    - Detección específica de Autofirma (SAF_27)
                    - Detección básica de Cl@ve por patrón "CODI ERROR"
                    - Separación proveedor firma: Cl@ve / Autofirma / FIRE                
 VERSION 1.2.2  - Mejora del análisis en pre_firma:
                        diferenciación entre fallo formulario vs Portafib
                    - Introducción de lógica de reintentos (contadores TR_FRI / TR_FRF)
                    - Detección de errores reales de sesión (Portafib/Soffid)
                    - Primer separación conceptual CAU:error ciudadano vs error plataforma
 VERSION 1.2.3  - Limpieza avanzada de literales de error:
                        eliminación de cabeceras "ERROR"
                        eliminación de trazas técnicas (Exception, Script, Unknown source…)
                    - Eliminación de ruido inicial (fechas, IDs, NIF, etc.)
                    - Extracción del literal funcional real del formulario
                    - Introducción de patrones de corte (DOMINI, LES, EL, LA, ES)

 VERSION 1.2.4  - Separación definitiva de tipos de error: ✔ Error de sesión / flujo (Portafib) y ✔ Error de formulario (usuario)
                    - Prioridad absoluta del error de sesión sobre el resto
                    - Implementación FASE 2:
                        detección de errores SIN "ERROR"
                        (mensajes funcionales tipo "Debe ser...", "Campo obligatorio…")
                    - Limpieza contextual inteligente:
                        solo se aplica recorte si la línea contiene "ERROR"
                    - Integración final:
                        detección + clasificación + limpieza coherente según tipo de error
                    - Motor alineado con diagnóstico real CAU:
                        flujo + proveedor + literal interpretado correctamente
*/
  
// CÓMO AÑADIR REGLAS:
// 1. Añadir condición en “DETECCIÓN DE REGLAS” → idReglaDetectada = "nombre_regla"
// 2. Añadir la acción en acciones.json con el mismo id
// 3. La regla tiene prioridad y sustituye la lógica estándar



// 🔹 VERSION JS (editable manual) 
// Cambios 2026-06-12: flujo visual, marco blanco compacto y mostrar solo tras analizar
const VERSION_JS = "1.3.0";

// Variable global donde se guarda el contenido de acciones.json
let accionesJSON = null;

// =====================================
// 🔹 CONSTANTES CENTRALIZADAS
// =====================================
// Valores importantes que se usan en varias partes del código

const LITERAL_FIELD_INDEX = 10;           // Estructura de traza: la primera información funcional empieza en el campo 10
                                           // (después de fecha, hora, ID y 7 campos técnicos iniciales)
const MIN_LITERAL_LENGTH = 20;            // Longitud mínima para considerar una línea como posible error (evitar ruido)
const RE_FECHA_CABECERA = /^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2}\s+[^\s]+\s+[^\s]+\s+/; // Patrón: elimina cabecera de fecha/hora


// Espera a que el HTML esté completamente cargado antes de ejecutar
document.addEventListener("DOMContentLoaded", () => {

console.log("HTML v" + VERSION_HTML);
console.log("JS v" + VERSION_JS);

  
document.getElementById("versionHTML").innerText =
  "html " + VERSION_HTML;

document.getElementById("versionJS").innerText =
  "js " + VERSION_JS;




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
  abrirPanel("Detalles del analizador", `
<ul>
  <li><b>Analizador de trazas SistraHelp</b> orientado a soporte técnico CAU.</li>
  <li>Versión actual: <b>v 1.2.9</b> (interfaz <b>index.html</b>).</li>

  <br>

  <li><b>Qué hace al analizar una traza:</b></li>
  <li>Muestra el <b>flujo del trámite</b> (eventos TR_) con píldoras de colores y etiquetas.</li>
  <li>Indica el <b>diagnóstico</b> (cartel + frase explicativa dentro del flujo, cuando aplica).</li>
  <li>Propone la <b>acción recomendada</b> y el enlace <b>Mail</b> cuando existe.</li>
  <li>Lista los <b>literales detectados</b> con contador de repeticiones (xN), o avisa si no hay literales.</li>

  <br>

  <li><b>Estado actual (completado y validado):</b></li>
  <li>✔ Interfaz estilo V5: tarjetas con cabecera gris (Flujo del trámite, Acción, Literales detectados).</li>
  <li>✔ Apartados laterales plegables (Problemas de acceso, Traza SistraHelp, Método).</li>
  <li>✔ <b>Fallo formulario</b>: presentación completa (flujo + acción + literales + mail).</li>
  <li>✔ <b>Fallo Portafib</b>: presentación completa, con acción dinámica según literales
      (<i>El fluxe no es vàlid</i> y/o <i>Excepció al generar sessió firma</i>).</li>
  <li>✔ <b>Trámite finalizado OK</b> sin incidencias.</li>
  <li>✔ <b>Trámite finalizado OK con incidencia Portafib</b> en la traza (caso especial).</li>

  <br>

  <li><b>Pendiente de mejora:</b></li>
  <li>🔧 Misma presentación visual del flujo (cartel + frase) para Autofirma, Cl@ve y FIRE.</li>
  <li>🔧 Limpieza de literales: mostrar solo el mensaje útil, sin ruido técnico (fechas, IDs, excepciones).</li>
  <li>🔧 Ajustes menores en casos de firma (Cl@ve, Autofirma, certificado local).</li>

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
  abrirPanel("Motor de análisis (reglas)", `
<ul>
  <li><b>Funcionamiento del analizador:</b></li>
  <li>Lee la traza completa de SistraHelp respetando el orden real de ejecución.</li>
  <li>Reconstruye el flujo con eventos TR_: TR_FRI → TR_FRF → TR_SGI → TR_SGX / TR_SGO → TR_REG → TR_FIN.</li>
  <li>Clasifica el caso en una de tres fases: <b>pre-firma</b>, <b>error en firma</b> o <b>firma correcta</b>.</li>
  <li>Aplica la regla correspondiente de <b>acciones.json</b> (v 1.1.6) y muestra acción + mail cuando existe.</li>

  <br>

  <li><b>Reglas activas y estado de presentación:</b></li>
  <li>✔ <b>fallo_formulario</b> — No llega a firma, sin error de flujo Portafib. Presentación completa.</li>
  <li>✔ <b>fallo_portafib</b> — No llega a firma por error de flujo/sesión. Presentación completa; acción dinámica si aparecen
      <i>El fluxe no es vàlid</i> y/o <i>Excepció al generar sessió firma</i>.</li>
  <li>✔ <b>firma_correcta</b> — Trámite finalizado correctamente, sin incidencias Portafib.</li>
  <li>✔ <b>firma_correcta_portafib</b> — Trámite OK pero con error Portafib en la traza. Acción dinámica según literales.</li>
  <li>⚙ <b>error_clave_8_15</b> — Cl@ve códigos 8–15. Lógica activa; presentación visual del flujo pendiente.</li>
  <li>⚙ <b>error_clave_103</b> — Cl@ve contraseña bloqueada. Lógica activa; presentación visual pendiente.</li>
  <li>⚙ <b>error_clave_103_15</b> — Cl@ve certificado bloqueado. Lógica activa; presentación visual pendiente.</li>
  <li>⚙ <b>error_clave_101</b> — Cl@ve nivel de registro insuficiente. Lógica activa; presentación visual pendiente.</li>
  <li>⚙ <b>error_clave_104</b> — Cl@ve registro débil. Lógica activa; presentación visual pendiente.</li>
  <li>⚙ <b>error_autofirma</b> — Error SAF_27 (Autofirma). Lógica activa; presentación visual pendiente.</li>
  <li>⚙ <b>error_fire</b> — Certificado local (FIRE). Lógica activa; presentación visual pendiente.</li>

  <br>

  <li><b>Criterios clave de decisión:</b></li>
  <li>Si hay <b>TR_FRF</b> pero no <b>TR_SGI</b> → no llega a firma (formulario o Portafib).</li>
  <li>Si aparece literal de flujo (<i>El fluxe no es vàlid</i>, sesión firma, etc.) → Portafib.</li>
  <li>Si no hay error de flujo → formulario.</li>
  <li>Si hay <b>TR_SGO</b> → firma correcta (con o sin incidencia Portafib previa).</li>
  <li>En fase de firma: prioridad Autofirma (SAF_27) → Cl@ve → FIRE.</li>

  <br>

  <li><b>Pendiente:</b></li>
  <li>🔧 Cartel + frase en el flujo para casos de firma (Cl@ve, Autofirma, FIRE).</li>
  <li>🔧 Limpieza estructural de literales (mostrar mensaje útil sin ruido técnico).</li>

  <br>

  <li><b>Nota:</b> ✔ = regla con presentación completa validada. ⚙ = regla detectada, presentación visual en progreso.</li>
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

// 👉 Extraemos eventos TR_ en ORDEN REAL
// 🔹 esto nos permite saber cuál es el último evento válido
const eventos = lineas
  .filter(linea => linea.includes("TR_"))
  .map(linea => linea.match(/TR_[A-Z]+/)?.[0])
  .filter(Boolean);

// 👉 Último evento real del flujo
// 🔹 controlamos caso sin eventos para evitar error

const ultimoEvento = eventos.length > 0
  ? eventos[eventos.length - 1]
  : null;


// 👉 Detectamos presencia básica (seguimos usando lógica actual)
const hayFRI = eventos.includes("TR_FRI");
const hayFRF = eventos.includes("TR_FRF");
const haySGI = eventos.includes("TR_SGI");
const haySGX = eventos.includes("TR_SGX");
const haySGO = eventos.includes("TR_SGO");

// 🔹 NUEVO: eventos para flujo visual
const eventosFlujo = {
  TR_FRI: hayFRI,
  TR_FRF: hayFRF,
  TR_SGI: haySGI,
  TR_SGX: haySGX,
  TR_SGO: haySGO,
  TR_REG: eventos.includes("TR_REG"),
  TR_FIN: eventos.includes("TR_FIN")
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

if (!ultimoEvento) {

  // 👉 No hay eventos → tratamos como pre_firma
  contexto.fase = "pre_firma";
}
else if (ultimoEvento === "TR_FRF") {
  contexto.fase = "pre_firma";
}
else if (ultimoEvento === "TR_SGX") {
  contexto.fase = "error_firma";
}
else if (ultimoEvento === "TR_SGO") {
  contexto.fase = "firma_ok";
}
else {
  // 👉 fallback seguridad
  if (!contexto.llegaFirma) {
    contexto.fase = "pre_firma";
  } else if (contexto.errorFirma) {
    contexto.fase = "error_firma";
  } else if (contexto.firmaOK) {
    contexto.fase = "firma_ok";
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

const lineasErrorEntries = lineas
  .map((linea, indice) => ({ linea, original: lineasOriginales[indice] || linea }))
  .filter(entry => {
    const esErrorTecnico = esErrorTecnicoHelper(entry.linea);
    const esPosibleErrorFormulario = esPosibleErrorFormularioHelper(entry.linea);
    return esErrorTecnico || esPosibleErrorFormulario;
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

// 👉 Detectamos Autofirma (caso prioritario)
const hayAutofirmaError =
  erroresUnicos.some(linea =>
    linea.includes("SAF_27")
  );

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
for (let i = 0; i < lineas.length; i++) {
  const linea = lineas[i];

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


// 👉 Detectamos errores reales de Portafib / sesión
// 🔹 típicos antes de invocar firma
const hayErrorPortafibReal = erroresUnicos.some(linea =>
  linea.includes("FLUXE") ||
  linea.includes("SESSIÓ FIRMA") ||
  linea.includes("SESION FIRMA") ||
  linea.includes("SESSION") ||
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

// 👉 Autofirma SIEMPRE gana
if (hayAutofirmaError) {

  idReglaDetectada = "error_autofirma";

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

else if (esCert) {

  idReglaDetectada = "error_fire";

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
else if (idReglaDetectada && idReglaDetectada.indexOf("error_clave") === 0) {

  // 👉 Errores de Cl@ve (8–15, 101, 103, 103-15, 104): mismo formato visual que formulario / Portafib
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
else if (hayAutofirmaError) {

  // 👉 SAF_27 → Autofirma SIEMPRE
  diagnosticoTexto += "- El error corresponde a Autofirma (certificado local), no a Cl@ve.\n";

}
else if (haySGX && !cartelDiagnostico) {

  // 👉 Error proveedor genérico (solo si no hay cartel ya asignado, p. ej. Cl@ve)
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

  if (idReglaDetectada === "fallo_portafib") {
    if (hayFluxe && hayExcepcioSessio) {
      textoAccion = "Asignar CAI a Aplicacions31 - Pendents Tramitació Sistra2.   Error de flujo / Portafib."
        + literalGris("El fluxe no es vàlid", true) + " / "
        + literalGris("Excepció al generar sessió firma", true) + ".";
    } else {
      textoAccion = "Asignar CAI a Aplicacions31 - Pendents Tramitació Sistra2.   Error de flujo / Portafib."
        + literalGris("El fluxe no es vàlid", true);
    }
  } else if (idReglaDetectada === "firma_correcta_portafib") {
    let lineaPortafib;
    if (hayFluxe && hayExcepcioSessio) {
      lineaPortafib = "Se detecta error de portafib en la traza "
        + literalGris("El fluxe no es valid", false) + " / "
        + literalGris("Excepció al generar sessió firma", false);
    } else {
      lineaPortafib = "Se detecta error de portafib en la traza. "
        + literalGris("El fluxe no es vàlid", true);
    }
    textoAccion = lineaPortafib + "\nEl trámite está finalizado correctamente.";
  } else if (idReglaDetectada === "error_clave_103_15") {
    // 🔹 Caso especial: 103-15 precedido por un error 8-15 en la misma traza.
    const hayClave8_15 = lineas.some(l =>
      l.includes("CLAVEFIRMA") &&
      /ERROR:\s*8\b/.test(l) &&
      /RESULTA[TD][OA]?\s*:\s*15\b/.test(l)
    );
    if (hayClave8_15) {
      textoAccion = "Se detecta uno o varios Error Cl@ve (código 8-15) y posteriormente uno o varios Errores Cl@ve (código 103-15).\nCertificado bloqueado. Indicar revocación y emisión de nuevo certificado en Cl@ve.";
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
  if (accionData.mail) {
    salidaFinal += '<div style="margin-top:10px;"><a href="' + accionData.mail + '" target="_blank" rel="noopener" style="color:#1e1c17;text-decoration:underline;">Mail</a></div>';
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
    const normalizarAgrupacion = (linea) => {
      let key = linea.replace(/^ERROR\s*-\s*/i, "");
      const partes = key.split(/\t+/).map(p => p.trim()).filter(Boolean);
      if (partes.length > LITERAL_FIELD_INDEX) {
        key = partes.slice(LITERAL_FIELD_INDEX).join(" ");
      }
      key = key.replace(/\s+/g, ' ').trim();
      return key;
    };

    lineasErrorEntries.forEach(entry => {
      const clave = normalizarAgrupacion(entry.linea);
      if (!clave) return;
      if (clave.includes("TR_")) return;
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
const normalizarClave = (linea) => {
  let k = linea;
  k = k.replace(/\d{1,2}\/\d{1,2}\/\d{2,4}/g, "");
  k = k.replace(/\d{1,2}:\d{2}:\d{2}/g, "");
  k = k.replace(/\b[A-Z0-9]{5,}-[A-Z0-9]{5,}-[A-Z0-9]{5,}\b/g, "");
  k = k.replace(/\b\d{5,}\b/g, "");
  k = k.replace(/\s+/g, " ").trim();
  return k;
};

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

  let fallo = false;

  pasos.forEach((p, i) => {

    let color = "#ccc"; // gris por defecto

    if (p === "TR_SGX" && eventos[p]) {
      color = "#a12c7b"; // rojo error
      fallo = true;
    } else if (!fallo && eventos[p]) {
      color = "#2e6e14"; // verde OK
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
