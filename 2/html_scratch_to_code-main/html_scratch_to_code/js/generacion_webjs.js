// ============================================================
// generacion_webjs.js
// Genera webJS válido
// ============================================================

function esNumeroWebJS(expr) {
    return /^[0-9]+$/.test(expr.trim());
}

function esExpresionNumericaWebJS(expr) {
    return /^[a-zA-Z_][a-zA-Z0-9_]*(\s*[+\-*\/]\s*[a-zA-Z0-9_]+)*$/.test(expr.trim());
}

// ================== FUNCIONES INDIVIDUALES ==================
function assignToCodeWebjs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const v = block.varName;
    const valor = block.value.replace(/'/g, '"');

    if (!ctx._declaredWebJS.has(v)) {
        ctx._declaredWebJS.add(v);
        return `${ind}let ${v} = ${valor};`;
    } else {
        return `${ind}${v} = ${valor};`;
    }
}

function sayToCodeWebjs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}console.log(${block.text});`;
}

function askToCodeWebjs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const v = block.varName;
    if (!ctx._declaredWebJS.has(v)) {
        ctx._declaredWebJS.add(v);
        return `${ind}let ${v} = prompt(${block.question});`;
    } else {
        return `${ind}${v} = prompt(${block.question});`;
    }
}

function repeatToCodeWebjs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}for (let i = 0; i < ${block.times}; i++) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'webjs', indent + 1) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function whileToCodeWebjs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}while (${block.condition}) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'webjs', indent + 1) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function ifToCodeWebjs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}if (${block.condition}) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'webjs', indent + 1) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function foreverToCodeWebjs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}while (true) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'webjs', indent + 1) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function listCreateToCodeWebjs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const v = block.varName;
    if (!ctx._declaredWebJS.has(v)) {
        ctx._declaredWebJS.add(v);
        return `${ind}let ${v} = ${block.value};`;
    } else {
        return `${ind}${v} = ${block.value};`;
    }
}

function listAddToCodeWebjs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}${block.varName}.push(${block.value});`;
}

function listGetToCodeWebjs(ctx, block, indent) {
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

function listLengthToCodeWebjs(ctx, block, indent) {
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

function functionDefToCodeWebjs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}function ${block.name}(${block.params}) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, 'webjs', indent + 1) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function functionCallToCodeWebjs(ctx, block, indent) {
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

function returnToCodeWebjs(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}return ${block.value};`;
}
