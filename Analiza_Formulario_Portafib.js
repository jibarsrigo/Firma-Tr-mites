// ==========================
// VERSIONES
// ==========================
const VERSION_JS = "1.0.2";

document.addEventListener("DOMContentLoaded", () => {

  // ✅ QUITAMOS duplicación
  document.getElementById("versionHTML").innerText = VERSION_HTML;
  document.getElementById("versionJS").innerText = VERSION_JS;

});


// ==========================
// CARGAR JSON (solo versión)
// ==========================
fetch("Analiza_Formulario_Portafib.json?v=" + Date.now())
  .then(r => r.json())
  .then(d => {
    document.getElementById("versionJSON").innerText = d.version;
  });


// =====================================
// PANEL (MISMO QUE TU VERSIÓN ORIGINAL)
// =====================================
const panel = document.getElementById("panel");
const panelTitulo = document.getElementById("panelTitulo");
const panelContenido = document.getElementById("panelContenido");

function abrirPanel(titulo, contenido) {
  panel.classList.remove("hidden");
  panelTitulo.innerText = titulo;
  panelContenido.innerHTML = contenido;
}

function cerrarPanel() {
  panel.classList.add("hidden");
}

document.getElementById("btnCerrarPanel").onclick = cerrarPanel;


// =====================================
// VER DETALLES
// =====================================
document.getElementById("btnDetalles").onclick = () => {
  abrirPanel("Novedades BETA", `
  <ul>
    <li>Nuevo panel único sin conflictos</li>
    <li>Base limpia para motor</li>
    <li>UI mejorada progresivamente</li>
  </ul>
  `);
};


// =====================================
// TABLA REGLAS
// =====================================
document.getElementById("btnTabla").onclick = (e) => {
  e.preventDefault();
  abrirPanel("Tabla reglas", `
  <ul>
    <li>Reglas en desarrollo</li>
    <li>Motor pendiente</li>
  </ul>
  `);
};


// =====================================
// ERROR SAML
// =====================================
const checkSaml = document.getElementById("checkSaml");
const checkBlanco = document.getElementById("checkBlanco");

checkSaml.onchange = () => {
  if (checkSaml.checked) {

    checkBlanco.checked = false;

    abrirPanel("El ciudadano ve error SAML", `
<b>SAML 003002 (Authentication Failed: Detalle error: no certificate has been submitted)</b><br><br>
La pasarela de acceso no ha recibido un certificado digital válido...
    `);

  } else cerrarPanel();
};


// =====================================
// PÁGINA EN BLANCO
// =====================================
checkBlanco.onchange = () => {
  if (checkBlanco.checked) {

    checkSaml.checked = false;

    abrirPanel("La página queda en blanco", `
La página queda en blanco...
    `);

  } else cerrarPanel();
};


// =====================================
// BOTÓN ACTUALIZAR
// =====================================
document.getElementById("btnActualizar").onclick = () => {
  location.href = location.pathname + "?v=" + Date.now();
};


// =====================================
// 🔴 MÉTODO → MOSTRAR PC / MOVIL
// =====================================
const metodoCert = document.getElementById("metodoCert");
const metodoClave = document.getElementById("metodoClave");
const bloqueSistema = document.getElementById("bloqueSistema");
const sisPC = document.getElementById("sisPC");
const sisMovil = document.getElementById("sisMovil");

metodoCert.onchange = () => {
  bloqueSistema.style.display = "block";
};

metodoClave.onchange = () => {
  bloqueSistema.style.display = "none";
  sisPC.checked = false;
  sisMovil.checked = false;
};


// =====================================
// ELEMENTOS VISUALES
// =====================================
const placeholder = document.getElementById("placeholder");
const resultado = document.getElementById("resultado");


// =====================================
// ANALIZAR
// =====================================
document.getElementById("btnAnalizar").onclick = () => {

  const texto = document.getElementById("inputTraza").value.toUpperCase();

  if (!texto) return;

  // ✅ Ocultar placeholder
  placeholder.style.display = "none";

  // ✅ Limpiar resultado antes
  resultado.innerText = "";

  const hayFRI = texto.includes("TR_FRI");
  const hayFRF = texto.includes("TR_FRF");
  const haySGI = texto.includes("TR_SGI");

  const hayFluxe = texto.includes("FLUXE NO VÀLID") || texto.includes("FLUXE NO ES VÀLID");
  const haySesion = texto.includes("EXCEPCIÓ AL GENERAR SESSIÓ FIRMA");

  const literal = extraerLiteral(texto);

  if (hayFRF && !haySGI) {

    if (hayFluxe || haySesion) {

      resultado.innerText = `
Diagnóstico:
TR_FRI (Inicio formulario) → OK
TR_FRF (Fin formulario) → OK
TR_SGI (Inicio firma) → NO aparece TR_SGI

La firma no se inicia debido a un error de flujo (Portafib), con los siguientes literales:
• ${literal}

Acción recomendada:
Escalar a SEG-012 (Aplicacions\\31) por error de sesión de firma (Portafib), con literal de error:
"${literal}"
`;

    } else {

      resultado.innerText = `
Diagnóstico:
TR_FRI (Inicio formulario) → OK
TR_FRF (Fin formulario) → OK
TR_SGI (Inicio firma) → NO aparece TR_SGI

Fallo en formulario del trámite. No hay errores de flujo (no Portafib), con los siguientes Errores literales:
• "${literal}"

Acción recomendada:
Derivar a soporte funcional del trámite por problemas con el formulario, e indicar que el formulario tiene este error:
"${filtrarLiteralAccion(literal)}"
`;

    }

  }
};


// =====================================
// EXTRAER LITERAL
// =====================================
function extraerLiteral(texto) {

  const errores = texto.split("\n")
    .filter(l => l.includes("ERROR"))
    .map(l => l.split("\t").pop());

  const unico = [...new Set(errores)];

  return unico[0] || "No identificado";
}


// =====================================
// FILTRO CLAVE MOVIL
// =====================================
function filtrarLiteralAccion(literal) {
  if (literal.includes("CLAVE_MOVIL")) return "";
  return literal;
}


// =====================================
// LIMPIAR
// =====================================
document.getElementById("btnLimpiar").onclick = () => {

  document.getElementById("inputTraza").value = "";

  resultado.innerText = "";

  // ✅ Volver a mostrar mensaje inicial
  placeholder.style.display = "";

};
