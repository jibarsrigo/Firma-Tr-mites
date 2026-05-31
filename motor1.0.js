/*
  ╔════════════════════════════════════════════════════════════════╗
  ║                    MOTOR v1.0 - CORE LOGIC                    ║
  ║                                                                ║
  ║  CAMBIOS vs motor.js:                                         ║
  ║  ✅ Recibe contexto de flujo (no solo traza)                  ║
  ║  ✅ Evalúa FASE antes que otras condiciones                  ║
  ║  ✅ Ordena por PRIORIDAD para resolver solapamientos          ║
  ║  ✅ Devuelve confianza en diagnóstico                         ║
  ║  ✅ Funciones nuevas para derivar contexto                    ║
  ║  ✅ Completamente documentado en español                      ║
  ╚════════════════════════════════════════════════════════════════╝
*/

const VERSION_MOTOR = "1.0";

// ═══════════════════════════════════════════════════════════════
// 🔹 FUNCIÓN 1: CONSTRUIR CONTEXTO DE FLUJO
// ═══════════════════════════════════════════════════════════════
/*
  PROPÓSITO:
    Analizar la traza y derivar variables estructuradas que representan
    el flujo real del trámite (en qué fase llegó, qué eventos ocurrieron)
  
  ENTRADA:
    traza (string): texto completo de SistraHelp
  
  SALIDA:
    objeto contexto con:
    - fase: qué fase del trámite alcanzó
    - resultado: resultado final (éxito/fallo)
    - booleanos derivados: llegaFirma, errorPreFirma, etc
    - contadores: cuántas veces aparece cada evento
*/

function construirContextoFlujo(traza) {
  
  const trazaMayus = traza.toUpperCase();
  
  // 🔹 BLOQUE 1: DETECTAR EVENTOS BÁSICOS
  // Busca qué eventos TR_ están presentes
  const haySGI = trazaMayus.includes("TR_SGI");
  const haySGX = trazaMayus.includes("TR_SGX");
  const haySGO = trazaMayus.includes("TR_SGO");
  const hayFRI = trazaMayus.includes("TR_FRI");
  const hayFRF = trazaMayus.includes("TR_FRF");
  
  // 🔹 BLOQUE 2: CONTAR EVENTOS (para detectar múltiples intentos)
  const trsgiCount = (trazaMayus.match(/TR_SGI/g) || []).length;
  const trsgxCount = (trazaMayus.match(/TR_SGX/g) || []).length;
  const trfriCount = (trazaMayus.match(/TR_FRI/g) || []).length;
  const trfrfCount = (trazaMayus.match(/TR_FRF/g) || []).length;
  
  // 🔹 BLOQUE 3: DERIVAR FASE (LA DECISIÓN PRINCIPAL)
  // Basada en qué eventos ocurrieron, en qué "fase" está el trámite
  let fase;
  
  if (!hayFRI && !hayFRF) {
    // Ni abrió ni envió formulario → error antes de formulario
    fase = "acceso";
  } else if (hayFRI && !hayFRF) {
    // Abrió formulario pero nunca lo envió
    fase = "formulario_incompleto";
  } else if (hayFRF && !haySGI) {
    // Envió formulario pero nunca invocó firma
    fase = "pre_firma";
  } else if (haySGI && !haySGX && !haySGO) {
    // Se invocó firma pero sin resultado final
    fase = "firma_en_progreso";
  } else if (haySGX) {
    // Llegó a firma pero falló
    fase = "error_firma";
  } else if (haySGO) {
    // Firma completada exitosamente
    fase = "firma_ok";
  } else {
    // No se puede determinar
    fase = "desconocida";
  }
  
  // 🔹 BLOQUE 4: DERIVAR RESULTADO (qué pasó finalmente)
  let resultado;
  if (haySGO) {
    resultado = "exito";
  } else if (haySGX) {
    resultado = "fallo_firma";
  } else if (haySGI) {
    resultado = "en_progreso";
  } else if (hayFRF) {
    resultado = "fallo_pre_firma";
  } else {
    resultado = "sin_datos";
  }
  
  // 🔹 BLOQUE 5: BOOLEANOS DERIVADOS (para lógica condicional)
  // Facilitan decisiones en patrones
  const llegaFirma = haySGI;
  const errorPreFirma = hayFRF && !haySGI;
  const errorFirma = haySGX;
  const firmaOK = haySGO;
  const multipleSGI = trsgiCount > 1;
  const trazaIncompleta = traza.length < 200; // < 200 chars = probablemente cortada
  
  // 🔹 BLOQUE 6: DETECTAR ANOMALÍAS
  // Casos que no deberían ocurrir pero a veces pasan
  const indexSGI = trazaMayus.indexOf("TR_SGI");
  const indexSGX = trazaMayus.indexOf("TR_SGX");
  const ordenAnomal = (indexSGX > -1 && indexSGI === -1); // TR_SGX sin previo TR_SGI
  
  // 🔹 BLOQUE 7: DEVOLVER CONTEXTO ESTRUCTURADO
  return {
    // Eventos individuales
    eventos: { haySGI, haySGX, haySGO, hayFRI, hayFRF },
    
    // Contadores (para detectar múltiples intentos)
    contadores: { trsgiCount, trsgxCount, trfriCount, trfrfCount },
    
    // Interpretación del flujo
    fase,
    resultado,
    
    // Booleanos derivados
    llegaFirma,
    errorPreFirma,
    errorFirma,
    firmaOK,
    multipleSGI,
    trazaIncompleta,
    ordenAnomal,
    
    // Metadata
    longitudTraza: traza.length,
    trazaValida: (haySGI || haySGX || haySGO || hayFRI || hayFRF)
  };
}


// ═══════════════════════════════════════════════════════════════
// 🔹 FUNCIÓN 2: EXTRAER CONTEXTO DEL FORMULARIO RECIBIDO
// ═══════════════════════════════════════════════════════════════
/*
  PROPÓSITO:
    Analizar el texto del "Formulario Recibido" para extraer:
    - Método usado (Cl@ve o Certificado) - TIENE PRIORIDAD
    - Nombre del trámite
    - Email del ciudadano
  
  ENTRADA:
    textoFormulario (string): texto pegado del formulario
  
  SALIDA:
    objeto con:
    - valido: booleano (¿se encontró información?)
    - metodo: "clave" | "certificado" | null
    - tramite: nombre del trámite (si existe)
    - email: email del ciudadano (si existe)
*/

function extraerContextoFormulario(textoFormulario) {
  
  // Si no hay texto, devolver objeto "no válido"
  if (!textoFormulario || textoFormulario.trim() === "") {
    return {
      valido: false,
      metodo: null,
      tramite: null,
      email: null
    };
  }
  
  const formularioMayus = textoFormulario.toUpperCase();
  
  // 🔹 BLOQUE 1: EXTRAER MÉTODO
  // Busca palabras clave que indiquen método
  let metodo = null;
  
  if (formularioMayus.includes("CLAVE") || 
      formularioMayus.includes("CL@VE") ||
      formularioMayus.includes("CLAVE FIRMA")) {
    metodo = "clave";
  } else if (formularioMayus.includes("CERTIFICADO") || 
             formularioMayus.includes("CERTIFICADO LOCAL") ||
             formularioMayus.includes("LOCAL")) {
    metodo = "certificado";
  }
  
  // 🔹 BLOQUE 2: EXTRAER EMAIL
  // Busca patrón: palabra@dominio.ext
  const regexEmail = /[\w\.-]+@[\w\.-]+\.\w+/g;
  const emails = textoFormulario.match(regexEmail);
  const email = emails ? emails[0] : null;
  
  // 🔹 BLOQUE 3: EXTRAER NOMBRE DEL TRÁMITE
  // Busca línea que contiene "Trámite" o similar
  let tramite = null;
  const lineas = textoFormulario.split("\n");
  
  for (let linea of lineas) {
    if (linea.includes("Trámite") || 
        linea.includes("trámite") ||
        linea.includes("TRÁMITE")) {
      // Limpia la línea de etiquetas
      tramite = linea
        .replace(/Trámite|trámite|TRÁMITE|:/g, "")
        .trim()
        .substring(0, 50); // máximo 50 caracteres
      break;
    }
  }
  
  // 🔹 BLOQUE 4: DEVOLVER CONTEXTO
  return {
    valido: metodo !== null,
    metodo: metodo,
    tramite: tramite,
    email: email,
    rawtexto: textoFormulario
  };
}


// ═══════════════════════════════════════════════════════════════
// 🔹 FUNCIÓN 3: BUSCAR PATRÓN (MOTOR MEJORADO)
// ═══════════════════════════════════════════════════════════════
/*
  PROPÓSITO:
    Comparar la traza contra todos los patrones y devolver el que coincida.
    Ahora recibe CONTEXTO (no solo busca strings ciegos).
  
  ENTRADA:
    - traza: texto de la traza
    - metodo: "clave" o "certificado"
    - contexto: objeto derivado de construirContextoFlujo()
    - patrones: objeto JSON con array de patrones
  
  SALIDA:
    objeto con:
    - patron: el patrón que coincidió
    - contexto: contexto usado
    - confianza: "alta" | "media" | "baja"
    O null si no coincide ninguno
  
  LÓGICA:
    Evalúa condiciones en orden:
    1. ¿Fase correcta?
    2. ¿Tiene eventos "debe_tener"?
    3. ¿NO tiene eventos "no_debe_tener"?
    4. ¿Tiene literales específicos?
    5. ¿Método coincide?
    → Devuelve PRIMER patrón que cumpla TODO
*/

function buscarPatron(traza, metodo, contexto, patrones) {
  
  const trazaMayus = traza.toUpperCase();
  
  // 🔹 BLOQUE 1: ITERAR PATRONES EN ORDEN
  // (orden importa: específicos primero, genéricos después)
  for (let patron of patrones.patrones) {
    
    let cumpleTodos = true; // bandera: ¿cumple todas las condiciones?
    
    // 🔹 CONDICIÓN 1: FASE CORRECTA
    // Si el patrón especifica una fase, la traza debe estar en esa fase
    if (patron.fase && patron.fase !== contexto.fase) {
      cumpleTodos = false;
      continue; // Pasar al siguiente patrón
    }
    
    // 🔹 CONDICIÓN 2: EVENTOS QUE DEBEN ESTAR
    // Todos los eventos en "debe_tener" deben estar presentes
    if (patron.detectar.debe_tener && patron.detectar.debe_tener.length > 0) {
      for (let evento of patron.detectar.debe_tener) {
        if (!trazaMayus.includes(evento)) {
          cumpleTodos = false;
          break;
        }
      }
    }
    if (!cumpleTodos) continue;
    
    // 🔹 CONDICIÓN 3: EVENTOS QUE NO DEBEN ESTAR
    // Ninguno de los eventos en "no_debe_tener" debe estar presente
    if (patron.detectar.no_debe_tener && patron.detectar.no_debe_tener.length > 0) {
      for (let evento of patron.detectar.no_debe_tener) {
        if (trazaMayus.includes(evento)) {
          cumpleTodos = false;
          break;
        }
      }
    }
    if (!cumpleTodos) continue;
    
    // 🔹 CONDICIÓN 4: LITERALES ESPECÍFICOS
    // AL MENOS UNO de los literales debe estar presente
    if (patron.detectar.literales && patron.detectar.literales.length > 0) {
      let tieneAlguno = false;
      for (let literal of patron.detectar.literales) {
        if (trazaMayus.includes(literal.toUpperCase())) {
          tieneAlguno = true;
          break;
        }
      }
      // Si requiere literales pero no tiene ninguno, no coincide
      if (!tieneAlguno) {
        cumpleTodos = false;
      }
    }
    if (!cumpleTodos) continue;
    
    // 🔹 CONDICIÓN 5: MÉTODO ESPECÍFICO
    // Si el patrón es específico de un método, debe coincidir
    if (patron.detectar.metodo !== null && patron.detectar.metodo !== metodo) {
      cumpleTodos = false;
    }
    if (!cumpleTodos) continue;
    
    // 🔹 BLOQUE 2: ¡ENCONTRADO!
    // Si llegamos aquí, todas las condiciones coincidieron
    return {
      patron: patron,
      contexto: contexto,
      confianza: patron.confianza || "media"
    };
  }
  
  // 🔹 BLOQUE 3: NO ENCONTRADO
  // Si no coincide ninguno, devolver null
  return null;
}


// ═══════════════════════════════════════════════════════════════
// 🔹 FUNCIÓN 4: MOSTRAR RESULTADO EN HTML
// ═══════════════════════════════════════════════════════════════
/*
  PROPÓSITO:
    Llenar el HTML con el diagnóstico, confianza, información del
    formulario y texto para CAI.
  
  ENTRADA:
    - resultado: objeto devuelto por buscarPatron()
    - contextFormulario: objeto devuelto por extraerContextoFormulario()
*/

function mostrarResultado(resultado, contextFormulario) {
  
  const placeholder = document.getElementById("placeholder");
  const resultados = document.getElementById("resultados");
  
  // 🔹 BLOQUE 1: OCULTAR PLACEHOLDER, MOSTRAR RESULTADOS
  placeholder.style.display = "none";
  resultados.classList.remove("hidden");
  
  // 🔹 BLOQUE 2: MOSTRAR NIVEL DE CONFIANZA
  const confianzaText = {
    "alta": "✅ ALTA - Diagnóstico muy seguro",
    "media": "⚠️ MEDIA - Probable, revisar literales",
    "baja": "❌ BAJA - Incierto, análisis manual recomendado"
  };
  
  const nivelConfianzaDiv = document.getElementById("nivelConfianza");
  const confianzaClass = "confianza-" + resultado.confianza;
  nivelConfianzaDiv.innerHTML = 
    `<span class="${confianzaClass}">${confianzaText[resultado.confianza] || "Desconocida"}</span>`;
  
  // 🔹 BLOQUE 3: MOSTRAR DIAGNÓSTICO
  document.getElementById("resDiagnostico").innerText = 
    resultado.patron.resultado.diagnostico;
  
  // 🔹 BLOQUE 4: MOSTRAR ACCIÓN RECOMENDADA
  document.getElementById("resAccionRecomendada").innerText = 
    resultado.patron.resultado.accion;
  
  // 🔹 BLOQUE 5: MOSTRAR INFORMACIÓN DEL FORMULARIO (si existe)
  const panelFormulario = document.getElementById("panelFormulario");
  
  if (contextFormulario.valido && contextFormulario.metodo) {
    panelFormulario.classList.remove("hidden");
    
    document.getElementById("resMetodo").innerText = 
      contextFormulario.metodo || "No detectado";
    document.getElementById("resTramite").innerText = 
      contextFormulario.tramite || "No especificado";
    document.getElementById("resEmail").innerText = 
      contextFormulario.email || "No especificado";
  } else {
    panelFormulario.classList.add("hidden");
  }
  
  // 🔹 BLOQUE 6: MOSTRAR TEXTO PARA CAI
  document.getElementById("resCAI").value = 
    resultado.patron.resultado.cai;
  
  // 🔹 BLOQUE 7: AVISOS SI CONFIANZA ES MEDIA O BAJA
  const panelAvisos = document.getElementById("panelAvisos");
  const listaAvisos = document.getElementById("listaAvisos");
  
  if (resultado.confianza === "media" || resultado.confianza === "baja") {
    panelAvisos.classList.remove("hidden");
    listaAvisos.innerHTML = `
      <div>• Este diagnóstico se basa en patrones similares.</div>
      <div>• Verifica los literales en la traza para confirmar.</div>
      <div>• Si hay duda, consulta con el equipo técnico.</div>
    `;
  } else {
    panelAvisos.classList.add("hidden");
  }
  
  // 🔹 BLOQUE 8: AVISOS POR ANOMALÍAS EN LA TRAZA
  if (resultado.contexto.trazaIncompleta) {
    if (!panelAvisos.classList.contains("hidden")) {
      listaAvisos.innerHTML += "<div>• ⚠️ Traza parece incompleta (&lt;200 caracteres)</div>";
    }
  }
  
  if (resultado.contexto.multipleSGI) {
    if (!panelAvisos.classList.contains("hidden")) {
      listaAvisos.innerHTML += "<div>• ⚠️ Se detectaron múltiples intentos de firma</div>";
    }
  }
}
