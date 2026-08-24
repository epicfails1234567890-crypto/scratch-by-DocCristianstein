#!/usr/bin/env node
/**
 * Script Node.js para dividir el código de script.js en múltiples archivos.
 * Extrae cada sección detectando los encabezados automáticamente,
 * omite las secciones que solo contienen comentarios,
 * y genera un cargador dinámico (script.js) con los archivos resultantes.
 */

const fs = require('fs');
const path = require('path');

// ------------------------------------------------------------
// Configuración
// ------------------------------------------------------------
const DEFAULT_INPUT = 'script.js';
const OUTPUT_DIR = 'js';
const OUTPUT_LOADER = 'script.js'; // Sobrescribirá el archivo original con el cargador

// ------------------------------------------------------------
// Funciones auxiliares
// ------------------------------------------------------------
function log(message) {
  console.log(`[dividir] ${message}`);
}

function error(message) {
  console.error(`[dividir] ERROR: ${message}`);
  process.exit(1);
}

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    log(`Directorio creado: ${OUTPUT_DIR}/`);
  }
}

// Verifica si un texto contiene código real (ignorando comentarios y espacios)
function tieneCodigo(texto) {
  if (!texto) return false;
  // Remover comentarios de bloque /* ... */ y de línea // ...
  const sinComentarios = texto.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
  // Verificar si queda algo más que solo espacios/saltos de línea
  return sinComentarios.trim().length > 0;
}

// ------------------------------------------------------------
// LÓGICA DE TRANSFORMACIÓN DE NOMBRES DE ARCHIVO
// ------------------------------------------------------------
function formatearNombre(marcador) {
  let nombre = marcador.replace(/\/\/\s*={3,}/g, '').trim();
  nombre = nombre.toLowerCase();
  nombre = nombre.replace(/drag/g, 'arrastrar');
  nombre = nombre.replace(/&/g, 'y');
  nombre = nombre.replace(/drop/g, 'soltar');
  nombre = nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  nombre = nombre.replace(/[^\w\s]/gi, '');
  nombre = nombre.trim().replace(/\s+/g, '_');
  return nombre + '.js';
}

// ------------------------------------------------------------
// Proceso principal
// ------------------------------------------------------------
function main() {
  const inputFile = process.argv[2] || DEFAULT_INPUT;

  if (!fs.existsSync(inputFile)) {
    error(`No se encontró el archivo ${inputFile}`);
  }

  // Leer y guardar el código original en memoria
  const fullCode = fs.readFileSync(inputFile, 'utf8');
  log(`Archivo de entrada leído: ${inputFile} (${fullCode.length} caracteres)`);

  ensureOutputDir();

  const regexMarcador = /(\/\/\s*={3,}.+?={3,})/g;
  const partes = fullCode.split(regexMarcador);
  
  // Aquí guardaremos las rutas de los scripts que realmente se generaron
  const scriptsGenerados = [];

  // Procesar código inicial (antes del primer marcador)
  const contenidoInicial = partes[0].trim();
  if (tieneCodigo(contenidoInicial)) {
    const fileInicio = '00_inicio_globals.js';
    const rutaDestino = path.join(OUTPUT_DIR, fileInicio);
    fs.writeFileSync(rutaDestino, contenidoInicial + '\n', 'utf8');
    scriptsGenerados.push(`${OUTPUT_DIR}/${fileInicio}`);
    log(`Archivo generado: ${rutaDestino} (Código base / globales)`);
  }

  // Procesar las secciones marcadas
  for (let i = 1; i < partes.length; i += 2) {
    const textoMarcador = partes[i];
    let contenidoSeccion = partes[i + 1] || '';

    // Si la sección no tiene código real, la saltamos
    if (!tieneCodigo(contenidoSeccion)) {
      log(`Omitiendo sección sin código real: ${textoMarcador.trim()}`);
      continue;
    }

    const archivoDestino = formatearNombre(textoMarcador);
    
    // Filtro de seguridad por si el nombre quedó completamente vacío
    if (archivoDestino === '.js') {
      log(`Omitiendo marcador no válido: ${textoMarcador.trim()}`);
      continue;
    }

    const rutaDestino = path.join(OUTPUT_DIR, archivoDestino);

    // Limpiar la ejecución principal para que la lance el loader
    if (archivoDestino === 'programa_principal.js') {
      contenidoSeccion = contenidoSeccion.replace(/\n\s*programa\(\);\s*$/g, '\n');
    }

    const cabecera = `// ============================================================\n// ${archivoDestino}\n// Generado automáticamente por dividir.js\n// ============================================================\n\n`;

    fs.writeFileSync(rutaDestino, cabecera + textoMarcador + '\n' + contenidoSeccion.replace(/^\s+/, ''), 'utf8');
    scriptsGenerados.push(`${OUTPUT_DIR}/${archivoDestino}`);
    log(`Archivo generado: ${rutaDestino}`);
  }

  // ------------------------------------------------------------
  // Generar el archivo script.js (Cargador dinámico)
  // ------------------------------------------------------------
  
  // Formatear el array de scripts para inyectarlo en el template
  const listaScriptsFormat = scriptsGenerados.map(src => `'${src}'`).join(',\n        ');

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

    // Todas las funciones están cargadas, ahora inicializar la aplicación
    if (typeof programa === 'function') {
        programa();
    } else {
        console.error('La función programa() no está definida');
    }
}

// Llamada inicial
cargar_scripts();
`;

  fs.writeFileSync(OUTPUT_LOADER, loaderTemplate, 'utf8');
  log(`\nCargador dinámico generado exitosamente en: ${OUTPUT_LOADER}`);
  log('División completada.');
}

main();
