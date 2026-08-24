// ============================================================
// generacion_batch.js
// ============================================================

// Utilidades para traducir expresiones de Scratch a Batch
function exprToBatch(expr) {
    if (!expr) return '';
    // Si hay comillas simples, es concatenación de cadenas
    if (expr.includes("'")) {
        let result = '';
        const parts = expr.split('+');
        for (let part of parts) {
            part = part.trim();
            if (part.startsWith("'") && part.endsWith("'")) {
                result += part.slice(1, -1); // extraer texto entre comillas
            } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(part)) {
                result += '%' + part + '%'; // variable Batch
            } else {
                result += part;
            }
        }
        return result;
    }
    // Si es una operación aritmética simple (ej. contador + 1)
    if (/^[a-zA-Z0-9_\s]+\s*[+\-*\/]\s*[a-zA-Z0-9_\s]+$/.test(expr)) {
        return expr;
    }
    return expr;
}

function conditionToBatch(cond) {
    let c = cond;
    // Usar marcadores numéricos para evitar que se agregue % a los operadores
    c = c.replace(/===/g, ' ~1~ ');
    c = c.replace(/!==/g, ' ~2~ ');
    c = c.replace(/<=/g, ' ~3~ ');
    c = c.replace(/>=/g, ' ~4~ ');
    c = c.replace(/\s+<\s+/g, ' ~5~ ');
    c = c.replace(/\s+>\s+/g, ' ~6~ ');
    c = c.replace(/\s+==\s+/g, ' ~1~ ');
    c = c.replace(/\s+!=\s+/g, ' ~2~ ');
    // Envolver variables con %
    c = c.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g, '%$1%');
    // Restaurar operadores
    c = c.replace(/~1~/g, ' EQU ');
    c = c.replace(/~2~/g, ' NEQ ');
    c = c.replace(/~3~/g, ' LEQ ');
    c = c.replace(/~4~/g, ' GEQ ');
    c = c.replace(/~5~/g, ' LSS ');
    c = c.replace(/~6~/g, ' GTR ');
    c = c.replace(/\s+/g, ' ').trim();
    return c;
}

// ================== FUNCIONES INDIVIDUALES ==================
function assignToCodeBatch(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const value = exprToBatch(block.value);
    // Si es una expresión aritmética, usar set /a
    if (/^[a-zA-Z0-9_%\s]+\s*[+\-*\/]\s*[a-zA-Z0-9_%\s]+$/.test(value)) {
        return `${ind}set /a ${block.varName}=${value.replace(/%/g, '')}`;
    }
    return `${ind}set ${block.varName}=${value}`;
}

function sayToCodeBatch(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}echo ${exprToBatch(block.text)}`;
}

function askToCodeBatch(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const question = exprToBatch(block.question);
    return `${ind}set /p ${block.varName}="${question}"`;
}

function repeatToCodeBatch(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}for /l %%i in (1,1,${block.times}) do (\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'batch', indent + 1) + '\n';
    }
    code += `${ind})`;
    return code;
}

function whileToCodeBatch(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}:while_loop\n`;
    code += `${ind}if not ${conditionToBatch(block.condition)} goto end_while\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'batch', indent + 1) + '\n';
    }
    code += `${ind}goto while_loop\n`;
    code += `${ind}:end_while`;
    return code;
}

function ifToCodeBatch(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}if ${conditionToBatch(block.condition)} (\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'batch', indent + 1) + '\n';
    }
    code += `${ind})`;
    return code;
}

function foreverToCodeBatch(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}:forever_loop\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'batch', indent + 1) + '\n';
    }
    code += `${ind}goto forever_loop`;
    return code;
}

function listCreateToCodeBatch(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const list = block.value.replace(/[\[\]]/g, '').replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
    return `${ind}set ${block.varName}=${list}`;
}

function listAddToCodeBatch(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}set ${block.varName}=%${block.varName}% ${block.value}`;
}

function listGetToCodeBatch(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}set ${block.target}=${block.varName}[${block.index}]`;
}

function listLengthToCodeBatch(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}set /a ${block.target}=0\n`;
    code += `${ind}for %%i in (%${block.varName}%) do set /a ${block.target}+=1`;
    return code;
}

function functionDefToCodeBatch(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}:${block.name}\n`;
    const params = block.params.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (params.length > 0) {
        params.forEach((p, i) => {
            code += `${ind}set ${p}=%${i + 1}%\n`;
        });
    }
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'batch', indent + 1) + '\n';
    }
    code += `${ind}goto :eof`;
    return code;
}

function functionCallToCodeBatch(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const args = block.args.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
    if (block.target) {
        return `${ind}call :${block.name} ${args}\n${ind}set ${block.target}=%__retval%`;
    }
    return `${ind}call :${block.name} ${args}`;
}

function returnToCodeBatch(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const value = exprToBatch(block.value);
    // Si es una expresión aritmética, usar set /a
    if (/^[a-zA-Z0-9_%\s]+\s*[+\-*\/]\s*[a-zA-Z0-9_%\s]+$/.test(value)) {
        return `${ind}set /a __retval=${value.replace(/%/g, '')}`;
    }
    return `${ind}set __retval=${value}`;
}
