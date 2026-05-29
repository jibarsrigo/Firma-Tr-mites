
<!-- FUNCIONALIDADES IMPLEMENTADAS -->

<!-- VERSION 1.0    - Se valida que la traza y el método de firma sean correctos antes de analizar -->
<!--                - Se muestran paneles informativos para errores de acceso (SAML y página en blanco) -->
<!--                - Se normaliza la traza a mayúsculas para evitar problemas en la detección -->
<!--                - Se detectan los eventos TR_ principales dentro de la traza -->
<!--                - Se genera un diagnóstico técnico dinámico en función de los TR_ detectados -->
<!--                - Se construye automáticamente un texto base para CAI incluyendo el formulario si existe -->
<!-- VERSION 1.1    - Se muestra lectura html json y js panel superior html y editable desde codigo -->
<!-- VERSION 1.1.1  - Se Añade 🔴 DETECCIÓN DE REGLAS (PATRONES) con la primera regla par el Formulario-->


  
// 🔹 VERSION JS (editable manual)
const VERSION_JS = "1.1.1";

document.addEventListener("DOMContentLoaded", () => {

console.log("HTML v" + VERSION_HTML);
console.log("JS v" + VERSION_JS);

  // Mostrar versión HTML JS
document.getElementById("versionHTML").innerText =
  "html " + VERSION_HTML;
  document.getElementById("versionJS").innerText =
  "js " + VERSION_JS;



/* FIX CRÍTICO */
const btnDetalles = document.getElementById("btnDetalles");
const btnTabla = document.getElementById("btnTabla");
const checkSaml = document.getElementById("checkSaml");
const checkBlanco = document.getElementById("checkBlanco");
const btnAnalizar = document.getElementById("btnAnalizar");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnActualizar = document.getElementById("btnActualizar");
const placeholder = document.getElementById("placeholder");
const resultados = document.getElementById("resultados");
const metodoClave = document.getElementById("metodoClave");
const metodoCert = document.getElementById("metodoCert");
const bloqueSistema = document.getElementById("bloqueSistema");
const sisPC = document.getElementById("sisPC");
const sisMovil = document.getElementById("sisMovil");

/* PANEL */
const panel = document.getElementById("panel");
const panelTitulo = document.getElementById("panelTitulo");
const panelContenido = document.getElementById("panelContenido");

function abrirPanel(titulo, contenido) {
  panel.classList.remove("hidden");
  panelTitulo.innerText = titulo;
  panelContenido.innerHTML = contenido;
}

function cerrarPanelFunc() {
  panel.classList.add("hidden");
}

/* CERRAR */
document.getElementById("btnCerrarPanel").onclick = cerrarPanelFunc;

/* DETALLES */
btnDetalles.onclick = () => {
  abrirPanel("Novedades BETA", `
  <ul>
    <li>Nuevo panel único sin conflictos</li>
    <li>Base limpia para motor</li>
    <li>UI mejorada progresivamente</li>
  </ul>
  `);
};

/* TABLA */
btnTabla.onclick = (e) => {
  e.preventDefault();
  abrirPanel("Tabla reglas", `
  <ul>
    <li>Reglas en desarrollo</li>
    <li>Motor pendiente</li>
  </ul>
  `);
};

/* SAML */
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

/* BLANCO */
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
  
/* ANALIZAR */
btnAnalizar.onclick = () => {

  // ocultar resultados previos
  resultados.classList.add("hidden");

  // 1. validar método
  if (!metodoClave.checked && !metodoCert.checked) {
    abrirPanel("Validación", "Debe seleccionar método");
    return;
  }

  // 2. validar sistema (ANTES que la traza)
  if (metodoCert.checked && !sisPC.checked && !sisMovil.checked) {
    abrirPanel("Validación", "Debe seleccionar sistema");
    return;
  }

  // 3. validar traza
const texto = document.getElementById("inputTraza").value.trim();

// pasar a mayúsculas para evitar problemas
const traza = texto.toUpperCase();

if (!texto) {
  abrirPanel("Validación", "Todavía no ha pegado trazas");
  return;
}

if (!traza.includes("TR_")) {
  abrirPanel("Validación", `Esto no es una traza válida`);
  return;
}

// 🔍 DETECCIÓN DE EVENTOS TR_
const hayFRI = traza.includes("TR_FRI");
const hayFRF = traza.includes("TR_FRF");
const haySGI = traza.includes("TR_SGI");
const haySGX = traza.includes("TR_SGX");
const haySGO = traza.includes("TR_SGO");


// =====================================
// 🔴 DETECCIÓN DE REGLAS (PATRONES)
// =====================================

// Aquí se decidee QUÉ tipo de error es, usando los TR_
// SOLO lógica (NO textos, eso va en JSON)

let idReglaDetectada = null;

// ✅ REGLA 1 - FALLO FORMULARIO
// Condición:
// - Hay fin de formulario (TR_FRF)
// - NO hay inicio de firma (TR_SGI)
//
// Interpretación:
// El ciudadano termina el formulario pero la firma no empieza

if (hayFRF && !haySGI) {
  idReglaDetectada = "fallo_formulario";
}


// 🔎 DEBUG - ver qué regla se ha detectado
console.log("Regla detectada:", idReglaDetectada);



  


  
  
// TODO OK
  cerrarPanelFunc();
  placeholder.style.display = "none";
  resultados.classList.remove("hidden");
  const formulario = document.getElementById("inputFormulario").value.trim();

// 🔴 DIAGNÓSTICO
let diagnosticoTexto = "";

// FORMULARIO
diagnosticoTexto += "TR_FRI (Inicio formulario) → " + (hayFRI ? "OK" : "NO aparece") + "\n";
diagnosticoTexto += "TR_FRF (Fin formulario) → " + (hayFRF ? "OK" : "NO aparece") + "\n";

// FIRMA
diagnosticoTexto += "TR_SGI (Inicio firma) → " + (haySGI ? "OK" : "NO aparece") + "\n";

if (haySGX) {
  diagnosticoTexto += "TR_SGX (Firma KO) → ERROR\n";
}

if (haySGO) {
  diagnosticoTexto += "TR_SGO (Firma OK) → OK\n";
}

document.getElementById("resDiagnostico").innerText = diagnosticoTexto;

// 🔴 ACCIÓN RECOMENDADA

let accionTexto = "";

// 🔍 INTERPRETACIÓN BÁSICA DEL FLUJO

// DEBUG 
  console.log("haySGI:", haySGI, "haySGX:", haySGX, "haySGO:", haySGO);

//  PRUEBA CONTROL POR REGLA

if (idReglaDetectada === "fallo_formulario") {

  console.log("CONTROL POR REGLA ACTIVO");

  document.getElementById("resAccionRecomendada").innerText =
    "[Acceso-Sesión] – No se inicia firma (desde regla)";

  return; // 🔥 clave: evita que siga ejecutando lo de abajo
}


  
if (!haySGI) {
  accionTexto = "Error de acceso o sesión antes de la firma";
}
else if (haySGI && haySGX) {
  accionTexto = "Error en el proceso de firma";
}
else if (haySGI && haySGO) {
  accionTexto = "Firma completada correctamente";
}
else {
  accionTexto = "Caso no identificado";
}

console.log("ACCION FINAL:", accionTexto);

document.getElementById("resAccionRecomendada").innerText = accionTexto;

let clasificacion = "";

// 🔴 CLASIFICACIÓN CAU

if (!haySGI) {
  clasificacion = "[Acceso-Sesión] – Portafib/Soffid (pre-proveedor)";
}
else if (haySGI && haySGX) {
  clasificacion = "[Firma] – proveedor de firma (Cl@ve / Autofirma / FIRE)";
}
else if (haySGI && haySGO) {
  clasificacion = "[Correcto] – Firma completada";
}
else {
  clasificacion = "[Caso no identificado]";
}  


// 🔴 TEXTO CAI
document.getElementById("resCAI").value =
  (formulario ? formulario + "\n\n" : "") +
  "[Diagnóstico pendiente de análisis]\n\n" +
  "Se ha enviado correo al ciudadano:\n\n" +
  "[Correo pendiente]";

};


/* LIMPIAR */
btnLimpiar.onclick = () => {
  checkSaml.checked = false;
  checkBlanco.checked = false;
  cerrarPanelFunc();
  resultados.classList.add("hidden");
  placeholder.style.display = "";
};

/* ACTUALIZAR */
btnActualizar.onclick = () => {
  location.href = location.pathname + "?v=" + Date.now();
};

/* REGLAS */
async function cargarReglas() {
  try {
    const r = await fetch("reglas.json?v=" + Date.now());
    const d = await r.json();

    document.getElementById("versionJSON").innerText =
      "json " + d.version;
       console.log("JSON v" + d.version);

  } catch {
    document.getElementById("versionJSON").innerText =
      "json ?";
  }
}

cargarReglas();
metodoClave.onchange = () => {
  bloqueSistema.style.display = "none";
  sisPC.checked = false;
  sisMovil.checked = false;
};

metodoCert.onchange = () => {
  bloqueSistema.style.display = "block";
};
});

