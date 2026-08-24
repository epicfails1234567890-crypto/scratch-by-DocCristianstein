// ============================================================
// programa.js
// ============================================================

function programa() {
    // Contexto como propiedad de window
    window._ctx = {
        blocks: [],
        variables: {},
        functions: {},
        dragSourcePath: null,
        isRunning: false,
        callDepth: 0,
        MAX_CALL_DEPTH: 50,
        activeIntervals: [],
        generatedCode: {},
        conversionStatus: {},
        isConverting: false
    };

    // Exponer funciones para los onclick del HTML
    window.addBlockToParent = windowAddBlockToParent;
    window.addBlockToContainer = windowAddBlockToContainer;
    window.updateBlockByPath = windowUpdateBlockByPath;
    window.moveBlockByPath = windowMoveBlockByPath;
    window.deleteBlockByPath = windowDeleteBlockByPath;
    window.runProgram = windowRunProgram;
    window.saveProgram = windowSaveProgram;
    window.loadProgram = windowLoadProgram;
    window.clearOutput = windowClearOutput;
    window.clearScratch = windowClearScratch;
    window.convertScratchToCode = windowConvertScratchToCode;
    window.convertCodeToScratch = windowConvertCodeToScratch;
    window.cargarEjemplo = cargarEjemplo;
    window.limpiarCodigo = limpiarCodigo;

    // Manejo de pestañas
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', handleTabClick);
    });

    // Inicializar bloques de ejemplo
    inicializarBloquesEjemplo();

    // Mostrar nota de compilación inicial (Bash)
    actualizarCompileHint('bash');

    // Inicializar redimensionamiento
    const resizerState = { activeResizer: null, startX: 0, startWidths: [1, 1, 1] };
    initResizers(resizerState);

    // Renderizar
    internalRenderProgram(window._ctx);
}
