// ============================================================
// generacion_python.js
// Genera Python válido
// ============================================================

// Convierte una expresión con concatenación de cadenas a Python
// Ejemplo: 'El resultado es ' + resultado  ->  'El resultado es ' + str(resultado)
function pyStringConcat(expr) {
    const parts = expr.split('+').map(s => s.trim()).filter(s => s.length > 0);
    let result = '';
    for (let part of parts) {
        // Si es literal de cadena (con comillas simples o dobles)
        if ((part.startsWith("'") && part.endsWith("'")) || (part.startsWith('"') && part.endsWith('"'))) {
            result += part;
        }
        // Si es un número literal
        else if (/^-?\d+\.?\d*$/.test(part)) {
            result += part;
        }
        // Si es una variable simple
        else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(part)) {
            result += 'str(' + part + ')';
        }
        // Cualquier otra expresión compleja, la envolvemos en str()
        else {
            result += 'str(' + part + ')';
        }
        result += ' + ';
    }
    return result.slice(0, -3); // quitar el último ' + '
}

// Convierte condiciones de JavaScript a Python
function conditionToPython(cond) {
    if (!cond) return cond;
    let c = cond;
    c = c.replace(/===/g, ' == ');
    c = c.replace(/!==/g, ' != ');
    c = c.replace(/<=/g, ' <= ');
    c = c.replace(/>=/g, ' >= ');
    c = c.replace(/\s+<\s+/g, ' < ');
    c = c.replace(/\s+>\s+/g, ' > ');
    c = c.replace(/&&/g, ' and ');
    c = c.replace(/\|\|/g, ' or ');
    c = c.replace(/!/g, ' not ');
    c = c.replace(/\s+/g, ' ').trim();
    return c;
}

// ================== FUNCIONES INDIVIDUALES ==================
function assignToCodePython(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let valor = block.value;
    // Si la asignación involucra concatenación de cadenas con variables, convertir
    if (valor.includes('+') && (valor.includes("'") || valor.includes('"'))) {
        valor = pyStringConcat(valor);
    }
    return `${ind}${block.varName} = ${valor}`;
}

function sayToCodePython(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let text = block.text;
    // Si es concatenación con variables, convertir a str()
    if (text.includes('+') && (text.includes("'") || text.includes('"'))) {
        text = pyStringConcat(text);
    }
    return `${ind}print(${text})`;
}

function askToCodePython(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}${block.varName} = input(${block.question})`;
}

function repeatToCodePython(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}for _ in range(${block.times}):\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'python', indent + 1) + '\n';
    }
    return code;
}

function whileToCodePython(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const cond = conditionToPython(block.condition);
    let code = `${ind}while ${cond}:\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'python', indent + 1) + '\n';
    }
    return code;
}

function ifToCodePython(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const cond = conditionToPython(block.condition);
    let code = `${ind}if ${cond}:\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'python', indent + 1) + '\n';
    }
    return code;
}

function foreverToCodePython(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}while True:\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'python', indent + 1) + '\n';
    }
    return code;
}

function listCreateToCodePython(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}${block.varName} = ${block.value}`;
}

function listAddToCodePython(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}${block.varName}.append(${block.value})`;
}

function listGetToCodePython(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const v = block.varName;
    const idx = block.index;
    const target = block.target;
    if (target) {
        return `${ind}${target} = ${v}[${idx}]`;
    } else {
        return `${ind}print(${v}[${idx}])`;
    }
}

function listLengthToCodePython(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const v = block.varName;
    const target = block.target;
    if (target) {
        return `${ind}${target} = len(${v})`;
    } else {
        return `${ind}print(len(${v}))`;
    }
}

function functionDefToCodePython(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}def ${block.name}(${block.params}):\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'python', indent + 1) + '\n';
    }
    return code;
}

function functionCallToCodePython(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const target = block.target;
    if (target) {
        return `${ind}${target} = ${block.name}(${block.args})`;
    } else {
        return `${ind}${block.name}(${block.args})`;
    }
}

function returnToCodePython(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}return ${block.value}`;
}
