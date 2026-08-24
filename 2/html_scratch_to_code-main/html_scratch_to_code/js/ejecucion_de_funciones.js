// ============================================================
// ejecucion_de_funciones.js
// Generado automáticamente por dividir.js
// ============================================================

// ================== EJECUCIÓN DE FUNCIONES ==================
function parseArguments(ctx, argsString, vars) {
    if (!argsString.trim()) return [];
    const parts = argsString.split(',').map(s => s.trim()).filter(s => s.length > 0);
    return parts.map(part => evalExpression(ctx, part, vars));
}

async function callFunction(ctx, fnDef, args, outputDiv) {
    if (ctx.callDepth >= ctx.MAX_CALL_DEPTH) {
        throw new Error('Máxima profundidad de llamadas a funciones alcanzada');
    }
    const paramNames = fnDef.params.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const savedVars = {};
    paramNames.forEach(name => {
        if (ctx.variables.hasOwnProperty(name)) {
            savedVars[name] = ctx.variables[name];
        }
    });
    paramNames.forEach((name, i) => {
        ctx.variables[name] = args[i] !== undefined ? args[i] : null;
    });
    ctx.callDepth++;
    let returnValue;
    try {
        try {
            await executeBlockList(ctx, fnDef.children || [], outputDiv);
        } catch (e) {
            if (e instanceof ReturnSignal) {
                returnValue = e.returnValue;
            } else {
                throw e;
            }
        }
    } finally {
        paramNames.forEach(name => {
            if (savedVars.hasOwnProperty(name)) {
                ctx.variables[name] = savedVars[name];
            } else {
                delete ctx.variables[name];
            }
        });
        ctx.callDepth--;
    }
    return returnValue;
}

