// ============================================================
// limpiar_scratch.js
// Generado automáticamente por dividir.js
// ============================================================

// ================== LIMPIAR SCRATCH ==================
function internalClearScratch(ctx) {
    ctx.activeIntervals.forEach(id => clearInterval(id));
    ctx.activeIntervals = [];
    ctx.blocks = [];
    ctx.variables = {};
    ctx.functions = {};
    ctx.callDepth = 0;
    ctx.dragSourcePath = null;
    ctx.generatedCode = {};
    ctx.conversionStatus = {};
    document.getElementById('outputArea').innerHTML = '';
    console.clear();
    // Limpiar indicadores visuales
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        const span = btn.querySelector('.status-icon');
        if (span) span.remove();
    });
    internalRenderProgram(ctx);
}

