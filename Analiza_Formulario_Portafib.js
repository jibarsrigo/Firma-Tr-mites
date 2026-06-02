const VERSION_JS = "1.0.0";

document.getElementById("versionHTML").innerText = VERSION_HTML;
document.getElementById("versionJS").innerText = VERSION_JS;

let versionJSON = "?";

// ======================
// CARGAR JSON
// ======================
fetch("Analiza_Formulario_Portafib.json?v=" + Date.now())
  .then(r => r.json())
  .then(d => {
    versionJSON = d.version;
    document.getElementById("versionJSON").innerText = versionJSON;
  });


// ======================
// PANEL REUTILIZABLE (igual que tenías)
// ======================
function abrirPanel(t, c) {
  document.getElementById("panel").style.display = "block";
  document.getElementById("panelTitulo").innerText = t;
  document.getElementById("panelContenido").innerHTML = c;
}

function cerrarPanel() {
  document.getElementById("panel").style.display = "none";
}

// MISMO CONTENIDO que tu versión anterior
document.getElementById("btnDetalles").onclick = () => {
  abrirPanel("Novedades BETA", `
  <ul>
    <li>Motor simplificado</li>
    <li>Solo reglas Formulario y Portafib</li>
  </ul>
  `);
};

document.getElementById("btnTabla").onclick = (e) => {
  e.preventDefault();
  abrirPanel("Tabla reglas", `
  <ul>
    <li>Formulario</li>
    <li>Portafib</li>
  </ul>
  `);
};

document.getElementById("checkSaml").onclick = () => {
  abrirPanel("Error SAML", "Error de autenticación en pasarela.");
};

document.getElementById("checkBlanco").onclick = () => {
  abrirPanel("Página en blanco", "Problema de acceso o carga.");
};


// ======================
// BOTÓN ACTUALIZAR
// ======================
document.getElementById("btnActualizar").onclick = () => {
  location.href = location.pathname + "?v=" + Date.now();
};


// ======================
// ANALIZAR
// ======================
document.getElementById("btnAnalizar").onclick = () => {

  const texto = document.getElementById("traza").value.toUpperCase();
  if (!texto) return;

  const hayFRI = texto.includes("TR_FRI");
  const hayFRF = texto.includes("TR_FRF");
  const haySGI = texto.includes("TR_SGI");

  const hayFluxe = texto.includes("FLUXE NO VÀLID") || texto.includes("FLUXE NO ES VÀLID");
  const haySesion = texto.includes("EXCEPCIÓ AL GENERAR SESSIÓ FIRMA");

  const literal = extraerLiteral(texto);

  // ======================
  // FORMULARIO / PORTAFIB
  // ======================
  if (hayFRF && !haySGI) {

    // PORTAFIB
    if (hayFluxe || haySesion) {

      document.getElementById("resultado").textContent = `Diagnóstico:
TR_FRI (Inicio formulario) → OK
TR_FRF (Fin formulario) → OK
TR_SGI (Inicio firma) → NO aparece TR_SGI

La firma no se inicia debido a un error de flujo (Portafib), con los siguientes literales:
• ${literal}

Acción recomendada:
Escalar a SEG-012 (Aplicacions\\31) por error de sesión de firma (Portafib), con literal de error:
“${literal}”`;

    } else {

      // FORMULARIO
      document.getElementById("resultado").textContent = `Diagnóstico:
TR_FRI (Inicio formulario) → OK
TR_FRF (Fin formulario) → OK
TR_SGI (Inicio firma) → NO aparece TR_SGI

Fallo en formulario del trámite. No hay errores de flujo (no Portafib), con los siguientes Errores literales:
• "${literal}"

Acción recomendada:
Derivar a soporte funcional del trámite por problemas con el formulario, e indicar que el formulario tiene este error:
"${filtrarLiteralAccion(literal)}"`;

    }
  }
};


// ======================
// EXTRAER LITERAL
// ======================
function extraerLiteral(texto) {

  const errores = texto.split("\n")
    .filter(l => l.includes("ERROR"))
    .map(l => l.split("\t").pop());

  const unico = [...new Set(errores)];

  return unico[0] || "No identificado";
}


// ======================
// FILTRO ACCIÓN (CLAVE MOVIL)
// ======================
function filtrarLiteralAccion(literal) {
  if (literal.includes("CLAVE_MOVIL")) return "";
  return literal;
}


// ======================
// LIMPIAR
// ======================
document.getElementById("btnLimpiar").onclick = () => {
  document.getElementById("traza").value = "";
  document.getElementById("resultado").textContent = "Pega una traza y pulsa Analizar";
};
