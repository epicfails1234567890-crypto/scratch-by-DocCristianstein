// ============================================================
// guardar_y_cargar.js
// Generado automáticamente por dividir.js
// ============================================================

// ================== GUARDAR Y CARGAR ==================
function internalSaveProgram(ctx) {
    const data = JSON.stringify(ctx.blocks, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'programa_scratch.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function internalLoadProgram(ctx, event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (Array.isArray(data) && validateBlocks(ctx, data)) {
                ctx.blocks = data;
                ctx.generatedCode = {};
                ctx.conversionStatus = {};
                // Limpiar indicadores visuales
                const tabBtns = document.querySelectorAll('.tab-btn');
                tabBtns.forEach(btn => {
                    const span = btn.querySelector('.status-icon');
                    if (span) span.remove();
                });
                internalRenderProgram(ctx);
                internalClearOutput(ctx);
                mostrarMensaje(ctx, 'Programa cargado correctamente.');
            } else {
                mostrarMensaje(ctx, 'Formato de archivo no válido. Debe ser un array de bloques con estructura válida.', true);
            }
        } catch (err) {
            mostrarMensaje(ctx, 'Error al leer el archivo: ' + err.message, true);
        }
        event.target.value = '';
    };
    reader.readAsText(file);
}

function validateBlocks(ctx, blockList) {
    if (!Array.isArray(blockList)) return false;
    return blockList.every(b => {
        if (b.type === 'say') {
            return typeof b.text === 'string';
        } else if (b.type === 'assign') {
            return typeof b.varName === 'string' && typeof b.value === 'string';
        } else if (b.type === 'repeat') {
            return typeof b.times === 'string' && validateBlocks(ctx, b.children);
        } else if (b.type === 'while') {
            return typeof b.condition === 'string' && validateBlocks(ctx, b.children);
        } else if (b.type === 'if') {
            return typeof b.condition === 'string' && validateBlocks(ctx, b.children);
        } else if (b.type === 'forever') {
            return validateBlocks(ctx, b.children || []);
        } else if (b.type === 'ask') {
            return typeof b.question === 'string' && typeof b.varName === 'string';
        } else if (b.type === 'listCreate') {
            return typeof b.varName === 'string' && typeof b.value === 'string';
        } else if (b.type === 'listAdd') {
            return typeof b.varName === 'string' && typeof b.value === 'string';
        } else if (b.type === 'listGet') {
            return typeof b.varName === 'string' && typeof b.index === 'string' && (typeof b.target === 'string' || b.target === undefined);
        } else if (b.type === 'listLength') {
            return typeof b.varName === 'string' && (typeof b.target === 'string' || b.target === undefined);
        } else if (b.type === 'functionDef') {
            return typeof b.name === 'string' && typeof b.params === 'string' && validateBlocks(ctx, b.children);
        } else if (b.type === 'functionCall') {
            return typeof b.name === 'string' && typeof b.args === 'string' && (typeof b.target === 'string' || b.target === undefined);
        } else if (b.type === 'return') {
            return typeof b.value === 'string';
        }
        return false;
    });
}

