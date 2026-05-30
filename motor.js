// =============================================================
// 🔹 MOTOR DE DETECCIÓN DE PATRONES v1.0
// =============================================================
// 
// Propósito:
//   Buscar automáticamente qué patrón de patrones.json
//   coincide con una traza determinada
// 
// Entrada:
//   - traza: texto de la traza a analizar
//   - metodo: "clave" o "certificado"
//   - patrones: objeto JSON cargado desde patrones.json
// 
// Salida:
//   - el objeto patrón completo (si coincide)
//   - null (si no coincide ninguno)
// 
// Uso:
//   const patron = buscarPatron(traza, metodo, patronesJSON);
//   if (patron) { mostrar(patron.resultado); }
//
// =============================================================

function buscarPatron(traza, metodo, patrones) {
  
  // 🔍 Convertir a mayúsculas para búsqueda consistente
  const trazaMayus = traza.toUpperCase();
  
  // 🔄 Recorrer CADA patrón en orden
  // (el primero que coincida es el que se usa)
  for (let patron of patrones.patrones) {
    
    let cumpleTodos = true; // bandera de coincidencia
    
    // ✅ CONDICIÓN 1: Eventos que DEBEN estar presentes
    // Si "debe_tener" está definido, la traza DEBE contener TODOS esos eventos
    if (patron.detectar.debe_tener && patron.detectar.debe_tener.length > 0) {
      for (let evento of patron.detectar.debe_tener) {
        if (!trazaMayus.includes(evento)) {
          // Falta este evento → no coincide este patrón
          cumpleTodos = false;
          break;
        }
      }
    }
    
    // Si ya no cumple, pasar al siguiente patrón
    if (!cumpleTodos) {
      continue;
    }
    
    // ✅ CONDICIÓN 2: Eventos que NO deben estar
    // Si "no_debe_tener" está definido, la traza NO DEBE contener NINGUNO de esos eventos
    if (patron.detectar.no_debe_tener && patron.detectar.no_debe_tener.length > 0) {
      for (let evento of patron.detectar.no_debe_tener) {
        if (trazaMayus.includes(evento)) {
          // Tiene este evento que no debería → no coincide
          cumpleTodos = false;
          break;
        }
      }
    }
    
    // Si ya no cumple, pasar al siguiente patrón
    if (!cumpleTodos) {
      continue;
    }
    
    // ✅ CONDICIÓN 3: Literales específicos que DEBEN estar
    // Búsqueda de palabras clave exactas en la traza
    if (patron.detectar.literales && patron.detectar.literales.length > 0) {
      let tieneAlguno = false;
      for (let literal of patron.detectar.literales) {
        if (trazaMayus.includes(literal.toUpperCase())) {
          tieneAlguno = true;
          break;
        }
      }
      // Si no tiene ninguno de los literales, no coincide
      if (!tieneAlguno) {
        cumpleTodos = false;
      }
    }
    
    // Si ya no cumple, pasar al siguiente patrón
    if (!cumpleTodos) {
      continue;
    }
    
    // ✅ CONDICIÓN 4: Método específico
    // Si el patrón es específico de un método (clave o certificado),
    // solo coincide si el método seleccionado coincide
    if (patron.detectar.metodo !== null && patron.detectar.metodo !== metodo) {
      cumpleTodos = false;
    }
    
    // Si ya no cumple, pasar al siguiente patrón
    if (!cumpleTodos) {
      continue;
    }
    
    // 🎯 SI LLEGAMOS AQUÍ, TODAS LAS CONDICIONES COINCIDEN
    // Devolver este patrón
    return patron;
  }
  
  // ❌ Ningún patrón coincidió
  return null;
}

// =============================================================
// 🔹 VERSION DEL MOTOR (para debug en consola)
// =============================================================
const VERSION_MOTOR = "1.0";