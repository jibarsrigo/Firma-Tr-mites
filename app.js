
<!-- FUNCIONALIDADES IMPLEMENTADAS -->

<!-- VERSION 1.0    - Se valida que la traza y el método de firma sean correctos antes de analizar -->
<!--                - Se muestran paneles informativos para errores de acceso (SAML y página en blanco) -->
<!--                - Se normaliza la traza a mayúsculas para evitar problemas en la detección -->
<!--                - Se detectan los eventos TR_ principales dentro de la traza -->
<!--                - Se genera un diagnóstico técnico dinámico en función de los TR_ detectados -->
<!--                - Se construye automáticamente un texto base para CAI incluyendo el formulario si existe -->
<!-- VERSION 1.1    - Se muestra lectura html json y js panel superior html y editable desde codigo -->
<!-- VERSION 1.1.1  - Se Añade 🔴 DETECCIÓN DE REGLAS (PATRONES) con la primera regla par el Formulario-->
<!-- VERSION 1.1.2  - MOTOR BASE DE ANÁLISIS TR_ → detección → ID regla → control → salida personalizada → stop -->
  
// CÓMO AÑADIR REGLAS:
// 1. Añadir condición en “DETECCIÓN DE REGLAS” → idReglaDetectada = "nombre_regla"
// 2. Añadir la regla en reglas.json con mismo id (clasificación, acción, CAI)
// 3. La regla tiene prioridad y sustituye la lógica estándar







  
// 🔹 VERSION JS (editable manual) 
const VERSION_JS = "1.1.3";

// Variable global donde se guarda el contenido de reglas.json
let reglasJSON = null;

// Espera a que el HTML esté completamente cargado antes de ejecutar
document.addEventListener("DOMContentLoaded", () => {

console.log("HTML v" + VERSION_HTML);
console.log("JS v" + VERSION_JS);

  // Mostrar versión HTML y JS en la cabecera
document.getElementById("versionHTML").innerText =
  "html " + VERSION_HTML;
  document.getElementById("versionJS").innerText =
  "js " + VERSION_JS;




// =====================================
// REFERENCIAS A ELEMENTOS HTML
// =====================================
// Guardamos todos los elementos que vamos a usar

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


// =====================================
// PANEL POPUP (mensajes informativos)
// =====================================

const panel = document.getElementById("panel");
const panelTitulo = document.getElementById("panelTitulo");
const panelContenido = document.getElementById("panelContenido");

// Abre un panel con título + contenido
function abrirPanel(titulo, contenido) {
  panel.classList.remove("hidden");
  panelTitulo.innerText = titulo;
  panelContenido.innerHTML = contenido;
}

// Cierra el panel
function cerrarPanelFunc() {
  panel.classList.add("hidden");
}

// Botón cerrar panel
document.getElementById("btnCerrarPanel").onclick = cerrarPanelFunc;

// =====================================
// 🔴 BOTÓN DETALLES - Muestra información de la versión
// =====================================

btnDetalles.onclick = () => {
  abrirPanel("Novedades BETA", `
  <ul>
    <li>Nuevo panel único sin conflictos</li>
    <li>Base limpia para motor</li>
    <li>UI mejorada progresivamente</li>
  </ul>
  `);
};


// =====================================
// 🔴 BOTÓN TABLA - De momento informativo
// =====================================

btnTabla.onclick = (e) => {
  e.preventDefault();
  abrirPanel("Tabla reglas", `
  <ul>
    <li>Reglas en desarrollo</li>
    <li>Motor pendiente</li>
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

btnAnalizar.onclick = () => {

  // Oculta resultados anteriores
  resultados.classList.add("hidden");

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
// 👉 Aquí se detecta en qué punto del flujo está el trámite
// 👉 NO modificar salvo que aparezcan nuevos TR_

const hayFRI = traza.includes("TR_FRI"); // Inicio formulario
const hayFRF = traza.includes("TR_FRF"); // Fin formulario
const haySGI = traza.includes("TR_SGI"); // Inicio firma
const haySGX = traza.includes("TR_SGX"); // Firma KO
const haySGO = traza.includes("TR_SGO"); // Firma OK


// =====================================
// 🔴 DETECCIÓN DE LITERALES (ERRORES)
// =====================================
// 👉 AQUÍ es donde se añaden nuevos textos de error
// 👉 SOLO modificar aquí para añadir nuevos literales
// 👉 NO tocar el resto del código


const hayErrorFlujo =
  traza.includes("FLUXE NO VÀLID") ||   // error típico de sesión/flujo
  traza.includes("EXCEPCIÓ");           // excepciones generales


const hayAutofirmaError =
  traza.includes("SAF_27");

  
// 👉 Cl@ve no se detecta por texto (por ahora)
// 👉 Se identifica por el método seleccionado por el usuario
// const hayClaveError = ... → pendiente definir con ejemplos reales
  

// =====================================
// 🔴 MÉTODO UTILIZADO
// =====================================
// 👉 Se usa SOLO en la fase de firma

const esClave = metodoClave.checked;
const esCert = metodoCert.checked;





  
// ==========================================================================
// 🔴 ÁRBOL DE DECISIÓN DEL FLUJO
// ==========================================================================
// 👉 EL CEREBRO - AQUÍ se decide qué regla aplicar en función del flujo + contexto
// 👉 Para añadir nuevas reglas:
//    1. Añadir condición en este árbol
//    2. Crear la regla correspondiente en reglas.json con el mismo id

let idReglaDetectada = null;

// ===============================
// 🔹 NIVEL 1 → ¿LLEGA A FIRMA?
// ===============================

if (!haySGI) {

  // 🔸 NO se llega a invocar la firma

  if (hayFRF && !hayErrorFlujo) {
    // ✅ FORMULARIO TERMINA PERO NO INICIA FIRMA
    idReglaDetectada = "fallo_formulario";
  }

  else if (hayFRF && hayErrorFlujo) {
    // ✅ ERROR DE SESIÓN / FLUJO (PORTAFIB)
    idReglaDetectada = "fallo_portafib";
  }

} else {

  // ===============================
  // 🔹 SÍ LLEGA A FIRMA
  // ===============================

  // ===========================
  // 🔸 NIVEL 2 → RESULTADO FIRMA
  // ===========================

  if (haySGX) {

    // 🔻 FIRMA KO

    // =======================
    // 🔹 NIVEL 3 → PROVEEDOR
    // =======================
    // 👉 Aquí diferenciamos el origen del error

    if (esClave) {
      // ✅ ERROR EN CL@VE FIRMA
      idReglaDetectada = "error_clave";

    } else if (esCert) {

      if (hayAutofirmaError) {
        // ✅ ERROR EN AUTOFIRMA (cliente local)
        idReglaDetectada = "error_autofirma";

      } else {
        // ✅ ERROR EN FIRE / CERTIFICADO (navegador / DNIe)
        idReglaDetectada = "error_fire";
      }
    }
  }
  else if (haySGO) {
    // 🔻 FIRMA OK
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
  resultados.classList.remove("hidden");                                       // 👉 Se muestran los resultados
  const formulario = document.getElementById("inputFormulario").value.trim();  // 👉 Se obtiene el formulario pegado (si existe)
  
// ✅ VERIFICACIÓN JSON
console.log("JSON disponible:", reglasJSON);


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
if (idReglaDetectada === "fallo_formulario" && reglasJSON) {

  console.log("CONTROL POR REGLA ACTIVO (JSON)");

  const regla = reglasJSON.reglas.find(r => r.id === "fallo_formulario");

  if (regla) {

    document.getElementById("resAccionRecomendada").innerText =
      regla.clasificacion + "\n\n" + regla.accion;

    document.getElementById("resCAI").value =
      (formulario ? formulario + "\n\n" : "") +
      regla.clasificacion + "\n\n" +
      regla.cai + "\n\n" +
      "Se ha informado al ciudadano.";
  }

  return;
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
    reglasJSON = d;
    console.log("REGLAS JSON:", d);

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

