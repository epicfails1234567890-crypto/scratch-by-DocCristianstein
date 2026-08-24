// ============================================================
// parseo_de_codigo_a_scratch.js
// ============================================================

// ================== UTILIDADES DE CONVERSIÓN PARA BASH ==================
function bashExprToJS(expr) {
    if (!expr) return expr;
    // Convertir $(( expresion )) a expresion
    expr = expr.replace(/\$\(\(\s*(.*?)\s*\)\)/g, '$1');
    // Convertir $variable a ' + variable + '
    expr = expr.replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g, "' + $1 + '");
    // Convertir ${#array[@]} a array.length
    expr = expr.replace(/\$\{#([a-zA-Z_][a-zA-Z0-9_]*)\[@\]\}/g, "$1.length");
    // Convertir ${array[indice]} a array[indice]
    expr = expr.replace(/\$\{([a-zA-Z_][a-zA-Z0-9_]*)\[([^\]]+)\]\}/g, "$1[$2]");
    // Convertir $( comando ) a comando (para llamadas a función)
    expr = expr.replace(/\$\(\s*(.*?)\s*\)/g, '$1');
    // Quitar comillas dobles envolventes si quedaron
    expr = expr.replace(/^"(.*)"$/g, '$1');
    return expr;
}

function bashConditionToJS(cond) {
    if (!cond) return cond;
    // Convertir [ a -lt 3 ] a a < 3
    cond = cond.replace(/\[/g, '').replace(/\]/g, '').trim();
    cond = cond.replace(/\s+-lt\s+/g, ' < ');
    cond = cond.replace(/\s+-gt\s+/g, ' > ');
    cond = cond.replace(/\s+-le\s+/g, ' <= ');
    cond = cond.replace(/\s+-ge\s+/g, ' >= ');
    cond = cond.replace(/\s+-eq\s+/g, ' === ');
    cond = cond.replace(/\s+-ne\s+/g, ' !== ');
    // Quitar $ de variables
    cond = cond.replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g, '$1');
    return cond;
}

function bashListToJS(listStr) {
    if (!listStr) return '';
    // Convertir (1 2 3) a [1, 2, 3]
    listStr = listStr.replace(/\(/g, '[').replace(/\)/g, ']');
    listStr = listStr.replace(/\s+/g, ', ');
    return listStr;
}

function bashArgsToJS(argsStr) {
    if (!argsStr) return '';
    return argsStr.replace(/\s+/g, ', ');
}

// ================== FUNCIÓN PRINCIPAL ==================
function parseCodeToBlocks(ctx, code, lang) {
    const lines = code.split('\n');
    const blocks = [];
    let parentStack = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const indent = line.match(/^\s*/)[0].length;

        switch (lang) {
            case 'bash':
                if (trimmed.startsWith('echo ')) {
                    let rawText = trimmed.slice(5).trim();
                    let text;
                    if (rawText === '') {
                        text = '""';
                    } else if ((rawText.startsWith('"') && rawText.endsWith('"')) || (rawText.startsWith("'") && rawText.endsWith("'"))) {
                        // Mantener entre comillas dobles
                        text = rawText;
                    } else {
                        text = '"' + rawText + '"';
                    }
                    // Convertir variables interpoladas a expresión JS
                    text = bashExprToJS(text);
                    const newBlock = { type: 'say', text };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('read -p ')) {
                    const parts = trimmed.split('"');
                    const question = parts.length > 1 ? '"' + parts[1] + '"' : '""';
                    const varName = parts.length > 2 ? parts[2].trim() : '';
                    const newBlock = { type: 'ask', question, varName };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('function ')) {
                    const name = trimmed.slice(9).trim();
                    const params = '';
                    const newBlock = { type: 'functionDef', name, params, children: [] };
                    blocks.push(newBlock);
                    parentStack = [{ block: newBlock, indent }];
                } else if (trimmed.startsWith('local ')) {
                    // local a=$1 b=$2 -> extraer los nombres de variables para los parámetros
                    const paramsLine = trimmed.slice(6).trim();
                    const paramNames = paramsLine.split(/\s+/).map(p => p.split('=')[0]);
                    if (parentStack.length > 0) {
                        parentStack[parentStack.length - 1].block.params = paramNames.join(', ');
                    }
                } else if (trimmed.startsWith('for ')) {
                    const times = trimmed.match(/\d+/)?.[0] || '1';
                    const newBlock = { type: 'repeat', times, children: [] };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('while ')) {
                    const condPart = trimmed.slice(6).trim().replace('; do', '').trim();
                    const condition = bashConditionToJS(condPart);
                    const newBlock = { type: 'while', condition, children: [] };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('if ')) {
                    const condPart = trimmed.slice(3).trim().replace('; then', '').trim();
                    const condition = bashConditionToJS(condPart);
                    const newBlock = { type: 'if', condition, children: [] };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('done') || trimmed.startsWith('fi') || trimmed.startsWith('}')) {
                    // Cerrar bloques contenedores
                    if (parentStack.length > 0) {
                        parentStack.pop();
                    }
                } else if (trimmed.includes('=')) {
                    const parts = trimmed.split('=');
                    const varName = parts[0].trim();
                    let value = parts.slice(1).join('=').trim();
                    // Detectar listas (1 2 3) -> [1, 2, 3]
                    if (value.startsWith('(') && value.endsWith(')')) {
                        value = bashListToJS(value);
                        const newBlock = { type: 'listCreate', varName, value };
                        addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                    } else if (value.startsWith('$(') && value.endsWith(')')) {
                        // Llamada a función: resultado=$(sumar 3 4)
                        const callParts = value.slice(2, -1).trim().split(/\s+/);
                        const fnName = callParts[0];
                        const args = callParts.slice(1).join(' ');
                        const newBlock = { type: 'functionCall', name: fnName, args: bashArgsToJS(args), target: varName };
                        addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                    } else if (value.startsWith('${#') && value.endsWith('[@]}')) {
                        // long=${#array[@]}
                        const listName = value.slice(3, -3);
                        const newBlock = { type: 'listLength', varName: listName, target: varName };
                        addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                    } else {
                        value = bashExprToJS(value);
                        const newBlock = { type: 'assign', varName, value };
                        addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                    }
                } else if (trimmed.startsWith('return ')) {
                    const value = bashExprToJS(trimmed.slice(7).trim());
                    const newBlock = { type: 'return', value };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                }
                break;

            case 'batch':
                // ... lógica existente ...
                if (trimmed.startsWith('echo ')) {
                    let rawText = trimmed.slice(5).trim();
                    let text;
                    if (rawText === '') {
                        text = '""';
                    } else if ((rawText.startsWith('"') && rawText.endsWith('"')) || (rawText.startsWith("'") && rawText.endsWith("'"))) {
                        text = rawText;
                    } else {
                        text = '"' + rawText + '"';
                    }
                    const newBlock = { type: 'say', text };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('set /p ')) {
                    const parts = trimmed.split('=');
                    const varName = parts[0].replace('set /p', '').trim();
                    const question = parts.length > 1 ? '"' + parts[1] + '"' : '""';
                    const newBlock = { type: 'ask', question, varName };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('set ')) {
                    const parts = trimmed.split('=');
                    const varName = parts[0].replace('set', '').trim();
                    const value = parts.length > 1 ? parts.slice(1).join('=').trim() : '';
                    const newBlock = { type: 'assign', varName, value };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('for ')) {
                    const times = trimmed.match(/\d+/)?.[0] || '1';
                    const newBlock = { type: 'repeat', times, children: [] };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('if ')) {
                    const condition = trimmed.slice(3).trim();
                    const newBlock = { type: 'if', condition, children: [] };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('exit /b ')) {
                    const value = trimmed.slice(8).trim();
                    const newBlock = { type: 'return', value };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                }
                break;

            case 'c':
            case 'cpp':
                // ... lógica existente ...
                if (trimmed.startsWith('printf(')) {
                    const text = trimmed.slice(trimmed.indexOf('(') + 1, -1).replace(';', '').trim() || '""';
                    const newBlock = { type: 'say', text };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('scanf(')) {
                    const parts = trimmed.split(',');
                    const varName = parts.length > 1 ? parts[1].replace(';', '').trim() : '';
                    const question = parts[0].replace('scanf(', '').trim() || '""';
                    const newBlock = { type: 'ask', question, varName };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('for ')) {
                    const times = trimmed.match(/\d+/)?.[0] || '1';
                    const newBlock = { type: 'repeat', times, children: [] };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('while ')) {
                    const condition = trimmed.slice(6).replace(';', '').trim();
                    const newBlock = { type: 'while', condition, children: [] };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('if ')) {
                    const condition = trimmed.slice(3).replace('{', '').trim();
                    const newBlock = { type: 'if', condition, children: [] };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('int ') || trimmed.startsWith('auto ')) {
                    const parts = trimmed.split('=');
                    const varName = parts[0].replace('int', '').replace('auto', '').trim();
                    const value = parts.length > 1 ? parts[1].replace(';', '').trim() : '';
                    const newBlock = { type: 'assign', varName, value };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('return ')) {
                    const value = trimmed.slice(7).replace(';', '').trim();
                    const newBlock = { type: 'return', value };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                }
                break;

            case 'nodejs':
            case 'webjs':
                // ... lógica existente ...
                if (trimmed.startsWith('console.log(')) {
                    const text = trimmed.slice(12, -2).trim() || '""';
                    const newBlock = { type: 'say', text };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('prompt(')) {
                    const question = trimmed.slice(7, -2).trim() || '""';
                    const varName = trimmed.split('=')[0].trim();
                    const newBlock = { type: 'ask', question, varName };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('for ')) {
                    const times = trimmed.match(/\d+/)?.[0] || '1';
                    const newBlock = { type: 'repeat', times, children: [] };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('while ')) {
                    const condition = trimmed.slice(6).replace('{', '').trim();
                    const newBlock = { type: 'while', condition, children: [] };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('if ')) {
                    const condition = trimmed.slice(3).replace('{', '').trim();
                    const newBlock = { type: 'if', condition, children: [] };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('let ') || trimmed.startsWith('var ')) {
                    const parts = trimmed.split('=');
                    const varName = parts[0].replace('let', '').replace('var', '').trim();
                    const value = parts.length > 1 ? parts.slice(1).join('=').replace(';', '').trim() : '';
                    const newBlock = { type: 'assign', varName, value };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('return ')) {
                    const value = trimmed.slice(7).replace(';', '').trim();
                    const newBlock = { type: 'return', value };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                }
                break;

            case 'python':
                // ... lógica existente ...
                if (trimmed.startsWith('def ')) {
                    const rest = trimmed.slice(4).trim();
                    if (!rest.includes('(')) continue;
                    const name = rest.split('(')[0].trim();
                    const params = rest.split('(')[1].split(')')[0].trim() || '';
                    const newBlock = { type: 'functionDef', name, params, children: [] };
                    blocks.push(newBlock);
                    parentStack = [{ block: newBlock, indent }];
                } else if (trimmed.startsWith('for ')) {
                    const rest = trimmed.slice(4).trim();
                    if (!rest.includes('range(')) continue;
                    const times = rest.split('range(')[1].split(')')[0].trim() || '1';
                    const newBlock = { type: 'repeat', times, children: [] };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('while ')) {
                    const condition = trimmed.slice(6).trim().replace(':', '');
                    const newBlock = { type: 'while', condition, children: [] };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('if ')) {
                    const condition = trimmed.slice(3).replace(':', '').trim();
                    const newBlock = { type: 'if', condition, children: [] };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('print(')) {
                    const text = trimmed.slice(6, -1) || '""';
                    const newBlock = { type: 'say', text };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.includes('= input(')) {
                    const varName = trimmed.split('=')[0].trim();
                    const question = trimmed.split('= input(')[1].slice(0, -1) || '""';
                    const newBlock = { type: 'ask', varName, question };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.includes('= ')) {
                    const parts = trimmed.split('=');
                    const varName = parts[0].trim();
                    const value = parts.slice(1).join('=').trim();
                    const newBlock = { type: 'assign', varName, value };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('return ')) {
                    const value = trimmed.slice(7).trim();
                    const newBlock = { type: 'return', value };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                }
                break;

            default:
                break;
        }
    }

    return blocks;
}

function addBlockToCurrentParent(blocks, parentStack, newBlock, indent) {
    if (parentStack.length === 0) {
        blocks.push(newBlock);
        return;
    }
    const top = parentStack[parentStack.length - 1];
    if (indent > top.indent) {
        top.block.children.push(newBlock);
        if (['repeat', 'while', 'if', 'functionDef', 'forever'].includes(newBlock.type)) {
            parentStack.push({ block: newBlock, indent });
        }
    } else {
        while (parentStack.length > 0 && indent <= parentStack[parentStack.length - 1].indent) {
            parentStack.pop();
        }
        if (parentStack.length === 0) {
            blocks.push(newBlock);
        } else {
            const newTop = parentStack[parentStack.length - 1];
            newTop.block.children.push(newBlock);
            if (['repeat', 'while', 'if', 'functionDef', 'forever'].includes(newBlock.type)) {
                parentStack.push({ block: newBlock, indent });
            }
        }
    }
}
