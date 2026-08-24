// ============================================================
// funciones_globales.js
// ============================================================

// ================== FUNCIONES GLOBALES PARA WINDOW ==================
function windowAddBlockToParent(type, parentPath) {
    internalAddBlockToParent(window._ctx, type, parentPath);
}

function windowAddBlockToContainer(containerPath, type) {
    internalAddBlockToContainer(window._ctx, containerPath, type);
}

function windowUpdateBlockByPath(path, key, value) {
    internalUpdateBlockByPath(window._ctx, path, key, value);
}

function windowMoveBlockByPath(path, direction) {
    internalMoveBlockByPath(window._ctx, path, direction);
}

function windowDeleteBlockByPath(path) {
    internalDeleteBlockByPath(window._ctx, path);
}

function windowRunProgram() {
    internalRunProgram(window._ctx);
}

function windowSaveProgram() {
    internalSaveProgram(window._ctx);
}

function windowLoadProgram(event) {
    internalLoadProgram(window._ctx, event);
}

function windowClearOutput() {
    internalClearOutput(window._ctx);
}

function windowClearScratch() {
    internalClearScratch(window._ctx);
}

function windowConvertScratchToCode() {
    internalConvertScratchToCode(window._ctx);
}

function windowConvertCodeToScratch() {
    internalConvertCodeToScratch(window._ctx);
}

// ================== ACTUALIZAR NOTA DE COMPILACIÓN ==================
function actualizarCompileHint(lang) {
    const hint = document.getElementById('compileHint');
    if (!hint) return;

    const comandos = {
        bash: '<code>bash ejemplo.sh</code>',
        batch: '<code>ejemplo.bat</code>',
        c: '<code>gcc ejemplo.c -o ejemplo</code>',
        cpp: '<code>g++ ejemplo.cpp -o ejemplo</code>',
        webjs: '<code>abrir en navegador</code>',
        nodejs: '<code>node ejemplo.js</code>',
        python: '<code>python3 ejemplo.py</code>'
    };

    hint.innerHTML = 'Compila con: ' + (comandos[lang] || '');
}

// ================== CARGA DE EJEMPLO ==================
function cargarEjemplo() {
    if (!window._ctx) return;
    inicializarBloquesEjemplo();

    window._ctx.generatedCode = {};
    window._ctx.conversionStatus = {};

    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        const span = btn.querySelector('.status-icon');
        if (span) span.remove();
    });

    internalClearOutput(window._ctx);
    mostrarMensaje(window._ctx, 'Programa de ejemplo cargado.');
    internalRenderProgram(window._ctx);
}

// ================== LIMPIAR CÓDIGO DEL CONVERSOR ==================
function limpiarCodigo() {
    const codeArea = document.getElementById('codeArea');
    if (codeArea) codeArea.value = '';
    if (window._ctx) {
        window._ctx.generatedCode = {};
        window._ctx.conversionStatus = {};
    }
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        const span = btn.querySelector('.status-icon');
        if (span) span.remove();
    });
    if (typeof mostrarMensaje === 'function') {
        mostrarMensaje(window._ctx, 'Código del conversor limpiado.');
    }
}

// ================== MANEJO DE PESTAÑAS ==================
function handleTabClick(event) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    const lang = event.currentTarget.dataset.lang;
    if (window._ctx.generatedCode && window._ctx.generatedCode[lang]) {
        setCodeArea(window._ctx.generatedCode[lang]);
    } else {
        setCodeArea('');
    }
    // Actualizar la nota de compilación según el lenguaje
    actualizarCompileHint(lang);
}
