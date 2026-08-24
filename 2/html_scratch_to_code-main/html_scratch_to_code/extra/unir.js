#!/usr/bin/env node
/**
 * Script Node.js para procesar scripts de una carpeta.
 * 1. Une todos los archivos en 'unido.js'.
 * 2. Genera 'script.js' con un cargador dinámico (async/await).
 * 3. Genera 'index_unido.html' combinando HTML, CSS (styles.css) y JS (unido.js) en un solo archivo.
 *
 * Uso:
 *   node unir.js [nombre_de_la_carpeta]
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_UNIDO = 'unido.js';
const OUTPUT_LOADER = 'script.js';
const OUTPUT_HTML = 'index_unido.html';
const CSS_FILE = 'styles.css';

// ------------------------------------------------------------
// Funciones auxiliares
// ------------------------------------------------------------
function log(message) {
  console.log(`[unir] ${message}`);
}

function error(message) {
  console.error(`[unir] ERROR: ${message}`);
  process.exit(1);
}

// Escapar etiquetas </script> dentro del JS para que no rompan el HTML inline
function escaparScriptTag(jsCode) {
  return jsCode.replace(/<\/script>/g, '<\\/script>');
}

// ------------------------------------------------------------
// Proceso principal
// ------------------------------------------------------------
function main() {
  const folder = process.argv[2];

  if (!folder) {
    console.log("Uso incorrecto. Ejemplo: node unir.js js");
    error("Debes proporcionar el nombre de la carpeta que contiene los scripts.");
  }

  if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
    error(`La carpeta '${folder}' no existe o no es un directorio válido.`);
  }

  const files = fs.readdirSync(folder)
    .filter(file => file.endsWith('.js'))
    .sort();

  if (files.length === 0) {
    error(`No se encontraron archivos .js en la carpeta '${folder}'.`);
  }

  log(`Procesando ${files.length} archivos en '${folder}'...`);

  let contenidoRegular = [];
  let contenidoFinal = "";
  let archivoFinalNombre = "";
  let archivosRegularesNombres = [];

  const regexDefinicion = /\bfunction\s+programa\s*\(|\bprograma\s*=\s*(?:async\s+)?(?:function\s*\(|\()/;

  for (const file of files) {
    const filePath = path.join(folder, file);
    const content = fs.readFileSync(filePath, 'utf8');

    if (regexDefinicion.test(content)) {
      if (archivoFinalNombre) {
        log(`ADVERTENCIA: Se encontró definición de 'programa' en más de un archivo. Usando ${file} como final.`);
      }
      archivoFinalNombre = file;
      contenidoFinal = `\n// ============================================================\n// ARCHIVO FINAL (Contiene la función programa): ${file}\n// ============================================================\n${content}`;
    } else {
      archivosRegularesNombres.push(file);
      contenidoRegular.push(`\n// --- INICIO DE: ${file} ---\n${content}`);
    }
  }

  // ============================================================
  // 1. GENERAR UNIDO.JS
  // ============================================================
  let codigoUnido = contenidoRegular.join('\n');
  if (archivoFinalNombre) {
    codigoUnido += '\n' + contenidoFinal;
  }

  let sinComentarios = codigoUnido.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
  sinComentarios = sinComentarios.replace(/\bfunction\s+programa\s*\(/g, '');
  sinComentarios = sinComentarios.replace(/\bprograma\s*=\s*(?:async\s+)?(?:function\s*\(|\()/g, '');

  const regexLlamada = /\bprograma\s*\(\s*\)/;
  if (!regexLlamada.test(sinComentarios)) {
    log("Añadiendo llamada a 'programa()' al final de unido.js...");
    codigoUnido += `\n\n// ============================================================
// LLAMADA INICIAL
// ============================================================
if (typeof programa === 'function') {
    programa();
} else {
    console.error('La función programa() no está definida.');
}\n`;
  }

  fs.writeFileSync(OUTPUT_UNIDO, codigoUnido.trim() + '\n', 'utf8');
  log(`¡Éxito! Archivo unificado guardado en '${OUTPUT_UNIDO}'.`);

  // ============================================================
  // 2. GENERAR SCRIPT.JS (Cargador dinámico)
  // ============================================================
  const rutasScripts = archivosRegularesNombres.map(f => `'${folder}/${f}'`);
  if (archivoFinalNombre) {
    rutasScripts.push(`'${folder}/${archivoFinalNombre}'`);
  }

  const listaScriptsFormat = rutasScripts.join(',\n        ');
  const loaderTemplate = `// ================== CARGA DINÁMICA DE SCRIPTS ==================
async function cargar_scripts() {
    const scripts = [
        ${listaScriptsFormat}
    ];

    for (const src of scripts) {
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(\`Error al cargar \${src}\`));
            document.head.appendChild(script);
        });
    }

    if (typeof programa === 'function') {
        programa();
    } else {
        console.error('La función programa() no está definida');
    }
}

cargar_scripts();
`;
  fs.writeFileSync(OUTPUT_LOADER, loaderTemplate, 'utf8');
  log(`¡Éxito! Cargador dinámico generado en '${OUTPUT_LOADER}'.`);

  // ============================================================
  // 3. GENERAR INDEX_UNIDO.HTML (Standalone)
  // ============================================================
  let cssContent = "";
  if (fs.existsSync(CSS_FILE)) {
    cssContent = fs.readFileSync(CSS_FILE, 'utf8');
    log(`Se leyó el archivo CSS: '${CSS_FILE}'.`);
  } else {
    log(`ADVERTENCIA: No se encontró '${CSS_FILE}'. El HTML no tendrá estilos.`);
  }

  const htmlStandalone = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scratch-like Console con Conversor a Lenguajes</title>
    <style>
/* ================= ESTILOS INYECTADOS DESDE ${CSS_FILE} ================= */
${cssContent}
    </style>
</head>
<body>
    <div id="app">
        <!-- Barra de herramientas -->
        <div id="toolbar">
            <div class="main-buttons">
                <button id="greenFlag" title="Ejecutar programa" onclick="runProgram()">🏳️</button>
                <button class="palette-btn" id="btnSay" onclick="addBlockToParent('say', [])">➕ Decir</button>
                <button class="palette-btn" id="btnAssign" onclick="addBlockToParent('assign', [])">➕ Asignar</button>
                <button class="palette-btn" id="btnRepeat" onclick="addBlockToParent('repeat', [])">➕ Repetir</button>
                <button class="palette-btn" id="btnWhile" onclick="addBlockToParent('while', [])">➕ Mientras</button>
                <button class="palette-btn" id="btnIf" onclick="addBlockToParent('if', [])">➕ Si</button>
                <button class="palette-btn" id="btnAsk" onclick="addBlockToParent('ask', [])">➕ Preguntar</button>
                <button class="palette-btn" id="btnListCreate" onclick="addBlockToParent('listCreate', [])">➕ Crear lista</button>
                <button class="palette-btn" id="btnListAdd" onclick="addBlockToParent('listAdd', [])">➕ Añadir a lista</button>
                <button class="palette-btn" id="btnListGet" onclick="addBlockToParent('listGet', [])">➕ Obtener de lista</button>
                <button class="palette-btn" id="btnListLength" onclick="addBlockToParent('listLength', [])">➕ Longitud de lista</button>
                <button class="palette-btn" id="btnFunctionDef" onclick="addBlockToParent('functionDef', [])">➕ Función</button>
                <button class="palette-btn" id="btnFunctionCall" onclick="addBlockToParent('functionCall', [])">➕ Llamar función</button>
                <button class="palette-btn" id="btnForever" onclick="addBlockToParent('forever', [])">➕ Siempre</button>
                <button class="palette-btn" id="btnReturn" onclick="addBlockToParent('return', [])">➕ Retornar</button>
                <button class="palette-btn" id="btnSave" onclick="saveProgram()">💾 Guardar</button>
                <button class="palette-btn" id="btnLoad" onclick="document.getElementById('loadFileInput').click()">📂 Cargar</button>
                <input type="file" id="loadFileInput" accept=".json" style="display:none" onchange="loadProgram(event)">
            </div>
            <div class="right-buttons">
                <button class="palette-btn" id="btnLimpiarScratch" onclick="clearScratch()">🗑️ Limpiar Scratch</button>
                <button class="palette-btn" id="btnLimpiarConsola" onclick="clearOutput()">🧹 Limpiar consola</button>
                <button class="palette-btn" id="btnCargarEjemplo" onclick="cargarEjemplo()">📂 Cargar ejemplo</button>
                <button class="palette-btn" id="btnLimpiarCodigo" onclick="limpiarCodigo()">🧹 Limpiar código</button>
            </div>
        </div>

        <!-- Columna 1: Programación (bloques) -->
        <div id="programArea">
            <div id="programList"></div>
            <p class="empty-hint" id="emptyHint" style="display:none;">No hay bloques. Añade algunos desde la paleta o arrastra aquí.</p>
        </div>

        <!-- Divisor entre programArea y outputArea -->
        <div class="resizer" id="resizer1"></div>

        <!-- Columna 2: Consola de salida -->
        <div id="outputArea">
            <div class="output-msg">Consola lista. Pulsa la bandera verde para ejecutar.</div>
        </div>

        <!-- Divisor entre outputArea y converterArea -->
        <div class="resizer" id="resizer2"></div>

        <!-- Columna 3: Conversor de lenguajes -->
        <div id="converterArea">
            <h3>Conversor Scratch ↔ Lenguaje</h3>
            <div class="tabs">
                <button class="tab-btn active" data-lang="bash">Bash</button>
                <button class="tab-btn" data-lang="batch">Batch</button>
                <button class="tab-btn" data-lang="c">C</button>
                <button class="tab-btn" data-lang="cpp">C++</button>
                <button class="tab-btn" data-lang="webjs">webJS</button>
                <button class="tab-btn" data-lang="nodejs">NodeJS</button>
                <button class="tab-btn" data-lang="python">Python</button>
            </div>
            <textarea id="codeArea" placeholder="Aquí aparecerá el código generado o escribe código para convertir a Scratch..."></textarea>
            <div class="converter-buttons">
                <button class="convert-btn" onclick="convertScratchToCode()">Scratch ➜ Lenguaje</button>
                <button class="convert-btn" onclick="convertCodeToScratch()">Lenguaje ➜ Scratch</button>
            </div>
        </div>
    </div>

    <script>
/* ================= SCRIPTS INYECTADOS DESDE ${OUTPUT_UNIDO} ================= */
${escaparScriptTag(codigoUnido)}
    </script>
</body>
</html>`;

  fs.writeFileSync(OUTPUT_HTML, htmlStandalone, 'utf8');
  log(`¡Éxito! Archivo HTML unificado (standalone) guardado en '${OUTPUT_HTML}'.`);
}

main();
