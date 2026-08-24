// ============================================================
// generacion_cpp.js
// Genera C++ válido y compilable
// ============================================================

function esNumeroCpp(expr) {
    return /^[0-9]+$/.test(expr.trim());
}

function esExpresionNumericaCpp(expr) {
    return /^[a-zA-Z_][a-zA-Z0-9_]*(\s*[+\-*\/]\s*[a-zA-Z0-9_]+)*$/.test(expr.trim());
}

function analizarTiposCpp(blockList) {
    const tipos = {};
    for (const b of blockList) {
        if (b.type === 'assign') {
            const v = b.varName;
            if (!tipos[v]) {
                if (esNumeroCpp(b.value) || esExpresionNumericaCpp(b.value)) {
                    tipos[v] = 'int';
                } else {
                    tipos[v] = 'string';
                }
            }
        } else if (b.type === 'ask') {
            tipos[b.varName] = 'string';
        } else if (b.type === 'listCreate') {
            tipos[b.varName] = 'vector<int>';
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

function formatConcatenacionCpp(expr, tipos) {
    const parts = expr.split('+').map(p => p.trim()).filter(p => p.length > 0);
    let format = '';
    let args = [];
    for (let part of parts) {
        if (part.startsWith('"') && part.endsWith('"')) {
            format += part.slice(1, -1);
        } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(part)) {
            const tipo = tipos[part] || 'int';
            if (tipo === 'string') {
                format += '%s';
                args.push(part + '.c_str()');
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

// ================== FUNCIONES INDIVIDUALES ==================
function assignToCodeCpp(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const tipos = ctx._tiposCpp || {};
    const v = block.varName;
    const tipo = tipos[v] || 'int';
    let valor = block.value.replace(/'/g, '"');

    if (tipo === 'string') {
        if (block.value.includes('+')) {
            const { format, args } = formatConcatenacionCpp(valor, tipos);
            // Usamos __buffer temporal y luego asignamos a la variable
            return `${ind}snprintf(__buffer, sizeof(__buffer), "${format}", ${args.join(', ')});\n${ind}${v} = __buffer;`;
        } else {
            return `${ind}${v} = ${valor};`;
        }
    } else {
        return `${ind}${v} = ${valor};`;
    }
}

function sayToCodeCpp(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const tipos = ctx._tiposCpp || {};
    const texto = block.text.replace(/'/g, '"');
    if (texto.includes('+') && texto.includes('"')) {
        const { format, args } = formatConcatenacionCpp(texto, tipos);
        return `${ind}snprintf(__buffer, sizeof(__buffer), "${format}", ${args.join(', ')});\n${ind}std::cout << __buffer << std::endl;`;
    } else {
        if ((texto.startsWith('"') && texto.endsWith('"')) || esNumeroCpp(texto)) {
            return `${ind}std::cout << ${texto} << std::endl;`;
        }
        return `${ind}std::cout << ${texto} << std::endl;`;
    }
}

function askToCodeCpp(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}std::cin >> ${block.varName};`;
}

function repeatToCodeCpp(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}for (int i = 0; i < ${block.times}; i++) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCodeCpp(ctx, child, indent + 1, ctx._tiposCpp || {}) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function whileToCodeCpp(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const cond = block.condition.replace(/===/g, ' == ').replace(/!==/g, ' != ').replace(/\s+/g, ' ').trim();
    let code = `${ind}while (${cond}) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCodeCpp(ctx, child, indent + 1, ctx._tiposCpp || {}) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function ifToCodeCpp(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const cond = block.condition.replace(/===/g, ' == ').replace(/!==/g, ' != ').replace(/\s+/g, ' ').trim();
    let code = `${ind}if (${cond}) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCodeCpp(ctx, child, indent + 1, ctx._tiposCpp || {}) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function foreverToCodeCpp(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    let code = `${ind}while (1) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCodeCpp(ctx, child, indent + 1, ctx._tiposCpp || {}) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function listCreateToCodeCpp(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const v = block.varName;
    const valores = block.value.replace(/\[/g, '{').replace(/\]/g, '}').replace(/,/g, ', ');
    return `${ind}std::vector<int> ${v} = ${valores};`;
}

function listAddToCodeCpp(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}${block.varName}.push_back(${block.value});`;
}

function listGetToCodeCpp(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const v = block.varName;
    const idx = block.index;
    const target = block.target;
    if (target) {
        return `${ind}${target} = ${v}[${idx}];`;
    } else {
        return `${ind}std::cout << ${v}[${idx}] << std::endl;`;
    }
}

function listLengthToCodeCpp(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const v = block.varName;
    const target = block.target;
    if (target) {
        return `${ind}${target} = ${v}.size();`;
    } else {
        return `${ind}std::cout << ${v}.size() << std::endl;`;
    }
}

function functionDefToCodeCpp(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    const nombre = block.name;
    const params = block.params.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const paramDefs = params.map(p => `int ${p}`).join(', ');
    let code = `${ind}int ${nombre}(${paramDefs}) {\n`;
    for (const child of block.children || []) {
        code += generateBlockCodeCpp(ctx, child, indent + 1, ctx._tiposCpp || {}) + '\n';
    }
    code += `${ind}}`;
    return code;
}

function functionCallToCodeCpp(ctx, block, indent) {
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

function returnToCodeCpp(ctx, block, indent) {
    const ind = '  '.repeat(indent);
    return `${ind}return ${block.value};`;
}

// ================== FUNCIÓN AUXILIAR PARA GENERAR BLOQUES ANIDADOS ==================
function generateBlockCodeCpp(ctx, block, indent, tipos) {
    const ind = '  '.repeat(indent);
    switch (block.type) {
        case 'assign': return assignToCodeCpp(ctx, block, indent);
        case 'say': return sayToCodeCpp(ctx, block, indent);
        case 'ask': return askToCodeCpp(ctx, block, indent);
        case 'repeat': return repeatToCodeCpp(ctx, block, indent);
        case 'while': return whileToCodeCpp(ctx, block, indent);
        case 'if': return ifToCodeCpp(ctx, block, indent);
        case 'forever': return foreverToCodeCpp(ctx, block, indent);
        case 'listCreate': return listCreateToCodeCpp(ctx, block, indent);
        case 'listAdd': return listAddToCodeCpp(ctx, block, indent);
        case 'listGet': return listGetToCodeCpp(ctx, block, indent);
        case 'listLength': return listLengthToCodeCpp(ctx, block, indent);
        case 'functionDef': return functionDefToCodeCpp(ctx, block, indent);
        case 'functionCall': return functionCallToCodeCpp(ctx, block, indent);
        case 'return': return returnToCodeCpp(ctx, block, indent);
        default: return '';
    }
}

// ================== GENERADOR PRINCIPAL ==================
function generateCodeCpp(ctx, blockList) {
    const funciones = blockList.filter(b => b.type === 'functionDef');
    const cuerpo = blockList.filter(b => b.type !== 'functionDef');
    const tipos = analizarTiposCpp(cuerpo);
    ctx._tiposCpp = tipos;

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
        if (tipo === 'string') {
            declarations += `  std::string ${v};\n`;
        } else if (tipo === 'vector<int>') {
            // No declarar aquí, se hace en listCreate
        } else if (v === '__buffer') {
            declarations += `  char ${v}[100];\n`;
        } else {
            declarations += `  int ${v};\n`;
        }
    }

    let code = '#include <iostream>\n#include <string>\n#include <vector>\n#include <cstdio>\n\n';
    for (const fn of funciones) {
        code += generateBlockCodeCpp(ctx, fn, 0, tipos) + '\n\n';
    }

    code += 'int main() {\n';
    code += declarations;
    for (const b of cuerpo) {
        code += generateBlockCodeCpp(ctx, b, 1, tipos) + '\n';
    }
    code += '  return 0;\n}\n';

    return code;
}
