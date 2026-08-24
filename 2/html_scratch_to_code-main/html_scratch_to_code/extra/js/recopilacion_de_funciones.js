// ============================================================
// recopilacion_de_funciones.js
// Generado automáticamente por dividir.js
// ============================================================

// ================== RECOPILACIÓN DE FUNCIONES ==================
function collectFunctionDefinitions(ctx, blockList) {
    for (const block of blockList) {
        if (block.type === 'functionDef') {
            ctx.functions[block.name.trim()] = block;
        }
        if (block.children && block.children.length > 0) {
            collectFunctionDefinitions(ctx, block.children);
        }
    }
}

