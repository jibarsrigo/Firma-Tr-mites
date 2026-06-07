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
const VERSION_JS = "1.2.6";

// Variable global donde se guarda el contenido de acciones.json
let accionesJSON = null;

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

  <li>Identifica automáticamente el flujo del trámite mediante eventos TR_ (inicio de formulario, firma, resultado).</li>

  <li>Genera un diagnóstico técnico basado en el flujo real del proceso (formulario, firma y registro).</li>

  <li>Extrae y muestra los literales de error directamente desde la traza, manteniendo el contexto real de ejecución.</li>

  <br>

  <li><b>Estado actual:</b></li>
  <li>✔ Casos de error de formulario definidos y validados.</li>
  <li>✔ Casos de error técnico de sesión / Portafib identificados correctamente.</li>

  <br>

  <li><b>Pendiente de mejora:</b></li>
  <li>🔧 Análisis detallado de errores en Autofirma y certificados locales (FIRE).</li>
  <li>🔧 Clasificación completa de códigos de error de Cl@ve (paso de firma).</li>
  <li>🔧 Mejora del diagnóstico en fase de proveedor de firma.</li>

  <br>

  <li><b>Nota:</b> La herramienta se encuentra en evolución continua para cubrir todos los escenarios reales de firma electrónica en CAIB.</li>
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
  <li>Analiza la traza completa en bruto (SistraHelp) respetando el orden real de ejecución.</li>
  <li>Normaliza el contenido (mayúsculas) para garantizar detección consistente.</li>
  <li>Identifica eventos clave TR_ para reconstruir el flujo del trámite:</li>
  <li>TR_FRI (inicio formulario) → TR_FRF (fin formulario) → TR_SGI (inicio firma) → TR_SGX / TR_SGO</li>

  <br>

  <li><b>Análisis por fases del flujo:</b></li>
  <li>✔ Pre-firma → validación de formulario y sesión</li>
  <li>✔ Error en firma → fallo en proveedor (Cl@ve, Autofirma, FIRE)</li>
  <li>✔ Firma correcta → validación de registro</li>

  <br>

  <li><b>Casos actualmente cubiertos:</b></li>
  <li>✔ Fallos de formulario (errores funcionales del ciudadano)</li>
  <li>✔ Fallos de sesión / Portafib (errores técnicos previos a firma)</li>
  <li>✔ Detección de reintentos (TR_FRI / TR_FRF repetidos)</li>
  <li>✔ Extracción de literales reales desde la traza</li>

  <br>

  <li><b>Pendiente de implementación:</b></li>
  <li>🔧 Clasificación completa de errores en Autofirma (SAF_xx)</li>
  <li>🔧 Diagnóstico detallado de certificados locales (FIRE)</li>
  <li>🔧 Interpretación de códigos reales de Cl@ve (8–15, 101, 103...)</li>
  <li>🔧 Mejora del análisis en fase de firma (proveedor)</li>

  <br>

  <li><b>Nota técnica:</b></li>
  <li>El motor prioriza errores de sesión (Portafib) sobre errores funcionales, siguiendo el flujo real de ejecución del sistema.</li>
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
const lineas = traza.split("\n");

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
// 🔴 DETECCIÓN DE LITERALES (ERRORES)
// =====================================
// 👉 AQUÍ es donde se añaden nuevos textos de error
// 👉 SOLO modificar aquí para añadir nuevos literales
// 👉 NO tocar el resto del código

// 👉 Detectamos errores de flujo típicos (Portafib)
// 🔹 No usamos texto exacto para evitar fallos
// 🔹 Detectamos cualquier referencia a "FLUXE"

// 👉 Paso 1: filtramos solo líneas que contienen errores reales
// 🔹 ampliamos detección para cubrir casos de sesión, firma y técnicos

const lineasError = lineas.filter(linea => {

  // 👉 errores técnicos existentes (igual que antes)
  const esErrorTecnico =
    linea.includes("FLUXE") ||
    linea.includes("SESSIÓ") ||
    linea.includes("SESSION") ||
    linea.includes("EXCEPCIÓ") ||
    linea.includes("EXCEPTION") ||
    linea.includes("SAF_") ||
    (linea.includes("ERROR") && !linea.includes("CLAVEFIRMA"));

  // 🔥 NUEVO: detectar posibles errores de formulario sin "ERROR"
  const esPosibleErrorFormulario =
    !linea.includes("TR_") &&            // no es evento
    !linea.includes("HTTP") &&          // evitar ruido técnico
    !linea.includes("HTTPS") &&
    linea.length > 20 &&                // evitar basura corta
    /[A-ZÀ-Ú]{3,}/.test(linea);         // contiene texto real

  // 👉 devolver cualquiera de los dos
  return esErrorTecnico || esPosibleErrorFormulario;

});

  
// 👉 Paso 2: eliminamos duplicados
// 🔹 nos quedamos solo con errores únicos
const erroresUnicos = [...new Set(lineasError)];


                                        

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

const lineasClave = lineas.filter(linea =>
  linea.includes("CLAVEFIRMA") &&
  linea.includes("CODI ERROR") &&
  linea.includes("TIPUS RESULTAT")
);

// 👉 coger la última línea (la más reciente en el flujo, para detecar bien 8-15 + 103-15)
const lineaErrorClave = lineasClave.length > 0
  ? lineasClave[lineasClave.length - 1]
  : null;



// 👉 Extraemos código real detectado
let codigoClaveDetectado = null;
let tipusResultatDetectado = null;

if (lineaErrorClave) {

  const matchCodigo = lineaErrorClave.match(/CODI ERROR:\s*(\d+)/);
  const matchTipus = lineaErrorClave.match(/TIPUS RESULTAT:\s*(\d+)/);

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
// 👉 MEJORA FORMULARIO vs PORTAFIB (FASE 10)
// ======================================================


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


  // ─────────────────────────────
  // Ha llegado a firma pero ha fallado
  // Aquí diferenciamos proveedor
  // ─────────────────────────────

 // 👉 Primero comprobamos si el error es de Autofirma (SAF_27)
// 🔹 PRIORIDAD: si aparece SAF_27, SIEMPRE es Autofirma
// 🔹 aunque el técnico haya marcado Cl@ve

// 👉 PRIORIDAD REAL DE ERRORES (FASE 10)

// 👉 Autofirma SIEMPRE gana
if (hayAutofirmaError) {

  idReglaDetectada = "error_autofirma";

}
else if (hayErrorClaveReal) {

  // 🔹 Códigos 8–15 → error Cl@ve individual
  if (/^(8|9|10|11|12|13|14|15)$/.test(codigoClaveDetectado)) {

  idReglaDetectada = "error_clave_8_15";

}

 else if (codigoClaveDetectado === "103") {

  // 🔹 103-15 → certificado bloqueado
  if (tipusResultatDetectado === "15") {
    idReglaDetectada = "error_clave_103_15";
  }

  // 🔹 103 → contraseña bloqueada
  else {
    idReglaDetectada = "error_clave_103";
  }

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

  // ─────────────────────────────
  // Firma correcta
  // OJO: no implica registro correcto
  // ─────────────────────────────

  idReglaDetectada = "firma_correcta";

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


let diagnosticoTexto = "";

// 👉 Mostramos la traza como flujo real (ordenado y claro)
diagnosticoTexto += "- Flujo -\n\n";

// FORMULARIO
diagnosticoTexto += "TR_FRI (Inicio formulario) → " + (hayFRI ? "OK" : "NO aparece") + "\n";
diagnosticoTexto += "TR_FRF (Fin formulario) → " + (hayFRF ? "OK" : "NO aparece") + "\n";

// FIRMA
diagnosticoTexto += "TR_SGI (Inicio firma) → " + (haySGI ? "OK" : "NO aparece") + "\n";

// 👉 Interpretamos estado de firma
if (haySGX) {
  diagnosticoTexto += "TR_SGX (Firma KO) → ERROR\n";
}

if (haySGO) {
  diagnosticoTexto += "TR_SGO (Firma OK) → OK\n";
}


// 👉 Añadimos una conclusión técnica de flujo
diagnosticoTexto += "\n- Interpretación: ";

// 👉 Interpretación técnica del fallo
// 🔹 Añadimos caso especial: SAF_27 SIEMPRE es Autofirma

if (!haySGI) {

  // 👉 No llega a firma
  if (hayErrorPortafibReal) {

    // 👉 Error de sesión / flujo (Portafib)
    diagnosticoTexto += "La firma NO se inicia por error de sesión/flujo (Portafib).\n";

  } else {

    // 👉 Sin errores técnicos → problema de formulario
    diagnosticoTexto += "La firma NO se inicia (probable fallo en el formulario).\n";
  }

}
else if (hayAutofirmaError) {

  // 👉 SAF_27 → Autofirma SIEMPRE
  diagnosticoTexto += "El error corresponde a Autofirma (certificado local), no a Cl@ve.\n";

}
else if (haySGX) {

  // 👉 Error proveedor genérico
  diagnosticoTexto += "La firma se inicia pero falla en el proveedor.\n";

}
else if (haySGO) {

  // 👉 Firma correcta
  diagnosticoTexto += "La firma se completa correctamente.\n";

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

  salidaFinal += "\n- Acción recomendada: ";
  salidaFinal += accionData.accion + "\n\n";

} else {

  salidaFinal += "\n- Acción recomendada: No definida\n";

}
}

// 👉 Primero ocultamos el placeholder (mensaje inicial)
placeholder.style.display = "none";

// 👉 Si hay errores reales, los añadimos al diagnóstico
// 🔹 mostramos solo errores detectados (sin duplicados)

// 👉 Mostramos errores si existen
if (erroresUnicos.length > 0) {

  // 🔥 PRIMERO: si hay error de flujo (Portafib)
  if (hayErrorPortafibReal) {

    salidaFinal += "\n\nErrores de sesión / flujo:\n";
    salidaFinal += "Se detecta error técnico de Portafib previo a la firma.\n";

    erroresUnicos.forEach(err => {
      salidaFinal += err + "\n";
    });

  }

// 🔥 SEGUNDO: caso formulario REAL (versión final sin pérdida de datos)
else if (contexto.fase === "pre_firma") {

  salidaFinal += "* Literal del error que aparece en el formulario:\n\n";

  erroresUnicos.forEach(err => {

    let limpio = err;

// 👉 quitar cabecera ERROR
limpio = limpio.replace(/^ERROR\s*-\s*/i, "");
limpio = limpio.replace(/^ERROR\s*/i, "");

// 👉 quitar fecha + hora + ids iniciales (cabecera típica)
limpio = limpio.replace(/^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2}\s+[^\s]+\s+[^\s]+\s+/, "");

// 👉 SOLO excluir eventos TR_, mostrar TODO lo demás
if (!limpio.includes("TR_")) {
  salidaFinal += limpio + "\n";
}

  });

}

  // 🔹 resto casos
  else {

    salidaFinal += "\n\nLiterales de Errores Detectados:\n";

    erroresUnicos.forEach(err => {
      salidaFinal += "- " + err + "\n";
    });

  }

} else {

  salidaFinal += "\n\n*Sin Literales de Errores Detectados\n";
}
  

  

// 👉 Mostramos SIEMPRE el resultado final
// 🔹 diagnóstico técnico + acción + errores reales
document.getElementById("resultado").innerText = salidaFinal;

// 👉 Nos aseguramos de que el bloque resultado esté visible
document.getElementById("resultado").style.display = "block";
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
  // Quitamos selección de Cl@ve / certificado
  metodoClave.checked = false;
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
