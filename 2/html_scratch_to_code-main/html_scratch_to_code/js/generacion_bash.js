// ============================================================
// generacion_bash.js
// ============================================================

// ================== UTILIDADES DE TRADUCCIÓN ==================
function exprToBash(expr) {
    if (!expr) return expr;
    // Si tiene comillas simples, es concatenación de cadenas
    if (expr.includes("'")) {
        let result = '';
        const parts = expr.split('+');
        for (let part of parts) {
            part = part.trim();
            if (part.startsWith("'") && part.endsWith("'")) {
                result += part.slice(1, -1); // extraer contenido de la cadena
            } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(part)) {
                result += '$' + part; // convertir variable a $variable
            } else {
                result += part;
            }
        }
        return '"' + result + '"'; // envolver en comillas dobles
    }
    // Si es una operación aritmética simple (ej. contador + 1)
    if (/^[a-zA-Z0-9_\s]+\s*\+\s*[a-zA-Z0-9_\s]+$/.test(expr)) {
        return `$(( ${expr} ))`;
    }
    // Si es una cadena con comillas dobles, dejarla igual
    if (expr.startsWith('"') && expr.endsWith('"')) return expr;
    return expr;
}

function conditionToBash(cond) {
    if (!cond) return cond;
    let c = cond;
    // Reemplazar operadores por marcadores numéricos (evita añadir $ a los operadores)
    c = c.replace(/===/g, ' ~1~ ');
    c = c.replace(/!==/g, ' ~2~ ');
    c = c.replace(/<=/g, ' ~3~ ');
    c = c.replace(/>=/g, ' ~4~ ');
    c = c.replace(/\s+<\s+/g, ' ~5~ ');
    c = c.replace(/\s+>\s+/g, ' ~6~ ');
    c = c.replace(/\s+==\s+/g, ' ~1~ ');
    c = c.replace(/\s+!=\s+/g, ' ~2~ ');
    // Añadir $ a las variables (los marcadores numéricos no se tocan)
    c = c.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g, '$$$1');
    // Restaurar operadores
    c = c.replace(/~1~/g, '-eq');
    c = c.replace(/~2~/g, '-ne');
    c = c.replace(/~3~/g, '-le');
    c = c.replace(/~4~/g, '-ge');
    c = c.replace(/~5~/g, '-lt');
    c = c.replace(/~6~/g, '-gt');
    // Limpiar espacios
    c = c.replace(/\s+/g, ' ').trim();
    return `[ ${c} ]`;
}

function listToBash(listStr) {
    if (!listStr) return '';
    // Convertir [1, 2, 3] a (1 2 3)
    return listStr.replace(/\[/g, '(').replace(/\]/g, ')').replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
}

function argsToBash(argsStr) {
    if (!argsStr) return '';
    // Reemplazar comas por espacios y colapsar espacios
    return argsStr.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
}

// ================== FUNCIONES DE GENERACIÓN ==================
function assignToCodeBash(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const value = exprToBash(block.value);
    return `${ind}${block.varName}=${value}`;
}

function sayToCodeBash(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}echo ${exprToBash(block.text)}`;
}

function askToCodeBash(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}read -p "${block.question}" ${block.varName}`;
}

function repeatToCodeBash(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}for ((i=0; i<${block.times}; i++)); do\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'bash', indent + 1) + '\n';
    }
    code += `${ind}done`;
    return code;
}

function whileToCodeBash(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const cond = conditionToBash(block.condition);
    let code = `${ind}while ${cond}; do\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'bash', indent + 1) + '\n';
    }
    code += `${ind}done`;
    return code;
}

function ifToCodeBash(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const cond = conditionToBash(block.condition);
    let code = `${ind}if ${cond}; then\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'bash', indent + 1) + '\n';
    }
    code += `${ind}fi`;
    return code;
}

function foreverToCodeBash(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}while true; do\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'bash', indent + 1) + '\n';
    }
    code += `${ind}done`;
    return code;
}

function listCreateToCodeBash(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}${block.varName}=${listToBash(block.value)}`;
}

function listAddToCodeBash(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}${block.varName}+=(${block.value})`;
}

function listGetToCodeBash(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    if (block.target) {
        return `${ind}${block.target}=${block.varName}[${block.index}]`;
    } else {
        return `${ind}echo ${block.varName}[${block.index}]`;
    }
}

function listLengthToCodeBash(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    if (block.target) {
        return ind + block.target + '=${#' + block.varName + '[@]}';
    } else {
        return ind + 'echo ${#' + block.varName + '[@]}';
    }
}

function functionDefToCodeBash(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}function ${block.name} {\n`;
    const params = block.params.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (params.length > 0) {
        code += `${ind}  local ${params.map((p, i) => `${p}=$${i + 1}`).join(' ')}\n`;
    }
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'bash', indent + 1) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function functionCallToCodeBash(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const args = argsToBash(block.args);
    if (block.target) {
        return `${ind}${block.target}=$(${block.name} ${args})`;
    } else {
        return `${ind}${block.name} ${args}`;
    }
}

function returnToCodeBash(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const value = block.value;
    if (/^[a-zA-Z0-9_\s+\-*\/()]+$/.test(value) && /[+\-*\/]/.test(value)) {
        return `${ind}echo $(( ${value} ))`;
    } else {
        return `${ind}echo ${value}`;
    }
}
