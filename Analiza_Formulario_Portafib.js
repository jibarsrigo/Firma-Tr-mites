// ==========================
// VERSIONES
// ==========================
const VERSION_JS = "1.0.1";

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("versionHTML").innerText = "html " + VERSION_HTML;
  document.getElementById("versionJS").innerText = "js " + VERSION_JS;

});


// ==========================
// CARGAR JSON (solo versión)
// ==========================
fetch("Analiza_Formulario_Portafib.json?v=" + Date.now())
  .then(r => r.json())
  .then(d => {
    document.getElementById("versionJSON").innerText = "json " + d.version;
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
// VER DETALLES (MISMO TEXTO ORIGINAL)
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
// TABLA REGLAS (MISMO COMPORTAMIENTO)
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
// ERROR SAML (TEXTO ORIGINAL)
// =====================================
const checkSaml = document.getElementById("checkSaml");
const checkBlanco = document.getElementById("checkBlanco");

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

  } else {
    cerrarPanel();
  }
};


// =====================================
// PÁGINA EN BLANCO (TEXTO ORIGINAL)
// =====================================
checkBlanco.onchange = () => {
  if (checkBlanco.checked) {

    checkSaml.checked = false;

    abrirPanel("La página queda en blanco", `
La página queda en blanco<br><br>

Si al acceder el ciudadano ve la página en blanco, debe considerarse primero como un posible problema de acceso o de pasarela. En estos casos, es posible que el ciudadano no llegue a entrar realmente en el trámite y que no se genere traza útil.<br><br>

Qué revisar:<br>
- Puede estar fallando la pasarela de acceso.<br>
- Puede haberse producido una redirección incompleta o fallida tras la identificación.<br>
- El navegador, una extensión, proxy, firewall o antivirus pueden estar bloqueando la carga correcta.<br><br>

Prueba recomendada:<br>
Acceder a Carpeta Ciudadana para comprobar si la pasarela carga correctamente.
    `);

  } else {
    cerrarPanel();
  }
};


// =====================================
// BOTÓN ACTUALIZAR (IGUAL QUE TUYA)
// =====================================
document.getElementById("btnActualizar").onclick = () => {
  location.href = location.pathname + "?v=" + Date.now();
};


// ==========================
// ANALIZAR (FORMULARIO / PORTAFIB)
// ==========================
document.getElementById("btnAnalizar").onclick = () => {

  const texto = document.getElementById("inputTraza").value.toUpperCase();

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

    if (hayFluxe || haySesion) {

      document.getElementById("resultado").textContent = `
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

      document.getElementById("resultado").textContent = `
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


// ==========================
// EXTRAER LITERAL
// ==========================
function extraerLiteral(texto) {

  const errores = texto.split("\n")
    .filter(l => l.includes("ERROR"))
    .map(l => l.split("\t").pop());

  const unico = [...new Set(errores)];

  return unico[0] || "No identificado";
}


// ==========================
// FILTRO CLAVE MOVIL
// ==========================
function filtrarLiteralAccion(literal) {
  if (literal.includes("CLAVE_MOVIL")) return "";
  return literal;
}


// ==========================
// LIMPIAR
// ==========================
document.getElementById("btnLimpiar").onclick = () => {
  document.getElementById("inputTraza").value = "";
  document.getElementById("resultado").textContent = "Pega una traza y pulsa Analizar";
};
