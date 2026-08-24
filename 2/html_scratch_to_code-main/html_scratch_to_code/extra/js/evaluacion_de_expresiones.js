// ============================================================
// evaluacion_de_expresiones.js
// ============================================================

function evalExpression(ctx, expr, vars) {
    if (!expr) return expr;
    if (typeof expr !== 'string') return expr;

    try {
        const keys = Object.keys(vars || {});
        const values = Object.values(vars || {});
        const func = new Function(...keys, `"use strict"; return (${expr});`);
        return func(...values);
    } catch (e) {
        // Si falla, devolver la expresión original para que se muestre literal
        return expr;
    }
}
