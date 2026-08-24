// ============================================================
// generacion_c.js
// Genera C válido y compilable
// ============================================================

// Utilidades de análisis
function esNumero(expr) {
    return /^[0-9]+$/.test(expr.trim());
}

function esExpresionNumerica(expr) {
    // Acepta variables y operadores + - * / paréntesis
    return /^[a-zA-Z_][a-zA-Z0-9_]*(\s*[+\-*\/]\s*[a-zA-Z0-9_]+)*$/.test(expr.trim());
}

// Recolectar variables y sus tipos
function analizarTipos(blockList) {
    const tipos = {};
    for (const b of blockList) {
        if (b.type === 'assign') {
            const v = b.varName;
            if (!tipos[v]) {
                if (esNumero(b.value) || esExpresionNumerica(b.value)) {
                    tipos[v] = 'int';
                } else {
                    tipos[v] = 'char[100]';
                }
            }
        } else if (b.type === 'ask') {
            tipos[b.varName] = 'char[100]';
        } else if (b.type === 'listCreate') {
            tipos[b.varName] = 'int[]';
        } else if (b.type === 'functionCall' && b.target) {
            tipos[b.target] = 'int';
        } else if (b.type === 'listGet' && b.target) {
            tipos[b.target] = 'int';
        } else if (b.type === 'listLength' && b.target) {
            tipos[b.target] = 'int';
        }
    }
    return tipos;
}

// Función para manejar concatenaciones de cadenas en expresiones
// Ej: "¡Hola " + nombre + "!" -> format: "¡Hola %s!", args: nombre
function formatConcatenacion(expr, tipos) {
    const parts = expr.split('+').map(p => p.trim()).filter(p => p.length > 0);
    let format = '';
    let args = [];
    for (let part of parts) {
        if (part.startsWith('"') && part.endsWith('"')) {
            format += part.slice(1, -1);
        } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(part)) {
            const tipo = tipos[part] || 'int';
            if (tipo === 'char[100]') {
                format += '%s';
                args.push(part);
            } else {
                format += '%d';
                args.push(part);
            }
        } else {
            format += part;
        }
    }
    return { format, args };
}

// ================== FUNCIONES INDIVIDUALES (para el mapa) ==================
function assignToCodeC(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const tipos = ctx._tiposC || {};
    const v = block.varName;
    const tipo = tipos[v] || 'int';
    let valor = block.value.replace(/'/g, '"');

    if (tipo === 'char[100]') {
        if (block.value.includes('+')) {
            const { format, args } = formatConcatenacion(valor, tipos);
            return `${ind}snprintf(${v}, sizeof(${v}), "${format}", ${args.join(', ')});`;
        } else {
            return `${ind}strcpy(${v}, ${valor});`;
        }
    } else {
        return `${ind}${v} = ${valor};`;
    }
}

function sayToCodeC(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const tipos = ctx._tiposC || {};
    const texto = block.text.replace(/'/g, '"');
    if (texto.includes('+') && texto.includes('"')) {
        const { format, args } = formatConcatenacion(texto, tipos);
        return `${ind}snprintf(__buffer, sizeof(__buffer), "${format}", ${args.join(', ')});\n${ind}printf("%s\\n", __buffer);`;
    } else {
        if ((texto.startsWith('"') && texto.endsWith('"')) || esNumero(texto)) {
            return `${ind}printf("%s\\n", ${texto});`;
        }
        return `${ind}printf("%s\\n", ${texto});`;
    }
}

function askToCodeC(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}scanf("%s", ${block.varName});`;
}

function repeatToCodeC(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}for (int i = 0; i < ${block.times}; i++) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCodeC(ctx, child, indent + 1, ctx._tiposC || {}) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function whileToCodeC(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const cond = block.condition.replace(/===/g, ' == ').replace(/!==/g, ' != ').replace(/\s+/g, ' ').trim();
    let code = `${ind}while (${cond}) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCodeC(ctx, child, indent + 1, ctx._tiposC || {}) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function ifToCodeC(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const cond = block.condition.replace(/===/g, ' == ').replace(/!==/g, ' != ').replace(/\s+/g, ' ').trim();
    let code = `${ind}if (${cond}) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCodeC(ctx, child, indent + 1, ctx._tiposC || {}) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function foreverToCodeC(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}while (1) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCodeC(ctx, child, indent + 1, ctx._tiposC || {}) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function listCreateToCodeC(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const v = block.varName;
    const valores = block.value.replace(/\[/g, '{').replace(/\]/g, '}').replace(/,/g, ', ');
    return `${ind}int ${v}[] = ${valores};`;
}

function listAddToCodeC(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}// ListAdd no soportado en C sin realloc`;
}

function listGetToCodeC(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const v = block.varName;
    const idx = block.index;
    const target = block.target;
    if (target) {
        return `${ind}${target} = ${v}[${idx}];`;
    } else {
        return `${ind}printf("%d\\n", ${v}[${idx}]);`;
    }
}

function listLengthToCodeC(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const v = block.varName;
    const target = block.target;
    if (target) {
        return `${ind}${target} = sizeof(${v}) / sizeof(${v}[0]);`;
    } else {
        return `${ind}printf("%zu\\n", sizeof(${v}) / sizeof(${v}[0]));`;
    }
}

function functionDefToCodeC(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const nombre = block.name;
    const params = block.params.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const paramDefs = params.map(p => `int ${p}`).join(', ');
    let code = `${ind}int ${nombre}(${paramDefs}) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCodeC(ctx, child, indent + 1, ctx._tiposC || {}) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function functionCallToCodeC(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const nombre = block.name;
    const args = block.args.replace(/,/g, ', ').trim();
    const target = block.target;
    if (target) {
        return `${ind}${target} = ${nombre}(${args});`;
    } else {
        return `${ind}${nombre}(${args});`;
    }
}

function returnToCodeC(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}return ${block.value};`;
}

// ================== FUNCIÓN AUXILIAR PARA GENERAR BLOQUES ANIDADOS ==================
function generateBlockCodeC(ctx, block, indent, tipos) {
    const ind = '  '.repeat(indent);
    switch (block.type) {
        case 'assign': return assignToCodeC(ctx, block, indent);
        case 'say': return sayToCodeC(ctx, block, indent);
        case 'ask': return askToCodeC(ctx, block, indent);
        case 'repeat': return repeatToCodeC(ctx, block, indent);
        case 'while': return whileToCodeC(ctx, block, indent);
        case 'if': return ifToCodeC(ctx, block, indent);
        case 'forever': return foreverToCodeC(ctx, block, indent);
        case 'listCreate': return listCreateToCodeC(ctx, block, indent);
        case 'listAdd': return listAddToCodeC(ctx, block, indent);
        case 'listGet': return listGetToCodeC(ctx, block, indent);
        case 'listLength': return listLengthToCodeC(ctx, block, indent);
        case 'functionDef': return functionDefToCodeC(ctx, block, indent);
        case 'functionCall': return functionCallToCodeC(ctx, block, indent);
        case 'return': return returnToCodeC(ctx, block, indent);
        default: return '';
    }
}

// ================== GENERADOR PRINCIPAL (para el orquestador) ==================
function generateCodeC(ctx, blockList) {
    // Separar funciones y resto
    const funciones = blockList.filter(b => b.type === 'functionDef');
    const cuerpo = blockList.filter(b => b.type !== 'functionDef');

    // Analizar tipos
    const tipos = analizarTipos(cuerpo);
    ctx._tiposC = tipos;

    // Generar declaraciones de variables en main
    let declarations = '';
    const varsUsadas = new Set();
    for (const b of cuerpo) {
        if (b.type === 'assign') varsUsadas.add(b.varName);
        if (b.type === 'ask') varsUsadas.add(b.varName);
        if (b.type === 'listCreate') varsUsadas.add(b.varName);
        if (b.type === 'functionCall' && b.target) varsUsadas.add(b.target);
        if (b.type === 'listGet' && b.target) varsUsadas.add(b.target);
        if (b.type === 'listLength' && b.target) varsUsadas.add(b.target);
    }
    varsUsadas.add('__buffer');

    for (const v of varsUsadas) {
        const tipo = tipos[v] || (v === '__buffer' ? 'char[100]' : 'int');
        if (tipo === 'char[100]') {
            declarations += `  char ${v}[100];\n`;
        } else if (tipo === 'int[]') {
            // No declarar aquí, se hace en listCreate
        } else {
            declarations += `  int ${v};\n`;
        }
    }

    // Generar funciones primero
    let code = '#include <stdio.h>\n#include <string.h>\n#include <stdlib.h>\n\n';
    for (const fn of funciones) {
        code += generateBlockCodeC(ctx, fn, 0, tipos) + '\n\n';
    }

    // Generar main
    code += 'int main() {\n';
    code += declarations;
    for (const b of cuerpo) {
        code += generateBlockCodeC(ctx, b, 1, tipos) + '\n';
    }
    code += '  return 0;\n}\n';

    return code;
}
