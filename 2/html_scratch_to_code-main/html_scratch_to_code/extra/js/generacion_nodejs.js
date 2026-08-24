// ============================================================
// generacion_nodejs.js
// Genera JavaScript válido para Node.js
// ============================================================

function esNumeroNodeJS(expr) {
    return /^[0-9]+$/.test(expr.trim());
}

function esExpresionNumericaNodeJS(expr) {
    return /^[a-zA-Z_][a-zA-Z0-9_]*(\s*[+\-*\/]\s*[a-zA-Z0-9_]+)*$/.test(expr.trim());
}

// ================== FUNCIONES INDIVIDUALES ==================
function assignToCodeNodejs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const v = block.varName;
    const valor = block.value.replace(/'/g, '"');

    // Solo usa let la primera vez que se declara la variable
    if (!ctx._declaredWebJS.has(v)) {
        ctx._declaredWebJS.add(v);
        return `${ind}let ${v} = ${valor};`;
    } else {
        return `${ind}${v} = ${valor};`;
    }
}

function sayToCodeNodejs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}console.log(${block.text});`;
}

function askToCodeNodejs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const v = block.varName;

    // En Node.js no existe prompt; usamos el argumento de línea de comandos
    if (!ctx._declaredWebJS.has(v)) {
        ctx._declaredWebJS.add(v);
        return `${ind}let ${v} = process.argv[2] || '';`;
    } else {
        return `${ind}${v} = process.argv[2] || '';`;
    }
}

function repeatToCodeNodejs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}for (let i = 0; i < ${block.times}; i++) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'nodejs', indent + 1) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function whileToCodeNodejs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}while (${block.condition}) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'nodejs', indent + 1) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function ifToCodeNodejs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}if (${block.condition}) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'nodejs', indent + 1) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function foreverToCodeNodejs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}while (true) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'nodejs', indent + 1) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function listCreateToCodeNodejs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const v = block.varName;
    if (!ctx._declaredWebJS.has(v)) {
        ctx._declaredWebJS.add(v);
        return `${ind}let ${v} = ${block.value};`;
    } else {
        return `${ind}${v} = ${block.value};`;
    }
}

function listAddToCodeNodejs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}${block.varName}.push(${block.value});`;
}

function listGetToCodeNodejs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const v = block.varName;
    const idx = block.index;
    const target = block.target;
    if (target) {
        if (!ctx._declaredWebJS.has(target)) {
            ctx._declaredWebJS.add(target);
            return `${ind}let ${target} = ${v}[${idx}];`;
        } else {
            return `${ind}${target} = ${v}[${idx}];`;
        }
    } else {
        return `${ind}console.log(${v}[${idx}]);`;
    }
}

function listLengthToCodeNodejs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const v = block.varName;
    const target = block.target;
    if (target) {
        if (!ctx._declaredWebJS.has(target)) {
            ctx._declaredWebJS.add(target);
            return `${ind}let ${target} = ${v}.length;`;
        } else {
            return `${ind}${target} = ${v}.length;`;
        }
    } else {
        return `${ind}console.log(${v}.length);`;
    }
}

function functionDefToCodeNodejs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}function ${block.name}(${block.params}) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'nodejs', indent + 1) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function functionCallToCodeNodejs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const target = block.target;
    if (target) {
        if (!ctx._declaredWebJS.has(target)) {
            ctx._declaredWebJS.add(target);
            return `${ind}let ${target} = ${block.name}(${block.args});`;
        } else {
            return `${ind}${target} = ${block.name}(${block.args});`;
        }
    } else {
        return `${ind}${block.name}(${block.args});`;
    }
}

function returnToCodeNodejs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}return ${block.value};`;
}
