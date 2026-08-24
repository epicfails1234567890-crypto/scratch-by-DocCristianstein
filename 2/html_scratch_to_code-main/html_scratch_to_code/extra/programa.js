// ================== CONVERTER ==================
function getCurrentSelectedLanguage() {
    const activeTab = document.querySelector('.tab-btn.active');
    return activeTab ? activeTab.dataset.lang : 'python';
}

function setCodeArea(text) {
    document.getElementById('codeArea').value = text;
}

function getCodeAreaText() {
    return document.getElementById('codeArea').value;
}

function updateStatusIcon(ctx, lang, success) {
    const btn = document.querySelector(`.tab-btn[data-lang="${lang}"]`);
    if (!btn) return;
    let span = btn.querySelector('.status-icon');
    if (!span) {
        span = document.createElement('span');
        span.className = 'status-icon';
        btn.appendChild(span);
    }
    span.textContent = success ? '✓' : '✗';
    span.style.marginLeft = '4px';
    span.style.color = success ? '#2ecc71' : '#e74c3c';
    span.style.fontWeight = 'bold';
}

async function internalConvertScratchToCode(ctx) {
    if (ctx.isConverting) return;
    ctx.isConverting = true;

    const languages = ['bash', 'batch', 'c', 'cpp', 'webjs', 'nodejs', 'python'];
    if (!ctx.generatedCode) ctx.generatedCode = {};
    if (!ctx.conversionStatus) ctx.conversionStatus = {};

    // Limpiar indicadores previos
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        const span = btn.querySelector('.status-icon');
        if (span) span.remove();
    });

    if (ctx.blocks.length === 0) {
        setCodeArea('No hay bloques para convertir.');
        mostrarMensaje(ctx, 'No hay bloques para convertir.', true);
        ctx.isConverting = false;
        return;
    }

    for (const lang of languages) {
        try {
            const code = generateCode(ctx, ctx.blocks, lang);
            ctx.generatedCode[lang] = code;
            ctx.conversionStatus[lang] = true;
            updateStatusIcon(ctx, lang, true);
        } catch (error) {
            ctx.generatedCode[lang] = '';
            ctx.conversionStatus[lang] = false;
            updateStatusIcon(ctx, lang, false);
        }
        await new Promise(resolve => setTimeout(resolve, 20));
    }

    const currentLang = getCurrentSelectedLanguage();
    if (ctx.generatedCode[currentLang]) {
        setCodeArea(ctx.generatedCode[currentLang]);
    } else {
        setCodeArea('');
    }

    ctx.isConverting = false;
    mostrarMensaje(ctx, 'Conversión completada para todos los lenguajes.');
}

function internalConvertCodeToScratch(ctx) {
    const lang = getCurrentSelectedLanguage();
    const code = getCodeAreaText();
    let newBlocks;
    try {
        newBlocks = parseCodeToBlocks(ctx, code, lang);
    } catch (e) {
        mostrarMensaje(ctx, 'Error al parsear el código: ' + e.message, true);
        return;
    }
    ctx.blocks = newBlocks;
    ctx.generatedCode = {};
    ctx.conversionStatus = {};
    // Limpiar indicadores
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        const span = btn.querySelector('.status-icon');
        if (span) span.remove();
    });
    internalRenderProgram(ctx);
    mostrarMensaje(ctx, 'Programa convertido a bloques Scratch.');
}

// ================== GENERACIÓN DE CÓDIGO ==================
function generateCode(ctx, blockList, lang) {
    let code = '';
    for (const block of blockList) {
        code += generateBlockCode(ctx, block, lang, 0) + '\n';
    }
    return code;
}

function generateBlockCode(ctx, block, lang, indent) {
    const ind = '  '.repeat(indent);
    switch (block.type) {
        case 'assign':
            return assignToCode(ctx, block, lang, indent);
        case 'say':
            return sayToCode(ctx, block, lang, indent);
        case 'ask':
            return askToCode(ctx, block, lang, indent);
        case 'repeat':
            return repeatToCode(ctx, block, lang, indent);
        case 'while':
            return whileToCode(ctx, block, lang, indent);
        case 'if':
            return ifToCode(ctx, block, lang, indent);
        case 'forever':
            return foreverToCode(ctx, block, lang, indent);
        case 'listCreate':
            return listCreateToCode(ctx, block, lang, indent);
        case 'listAdd':
            return listAddToCode(ctx, block, lang, indent);
        case 'listGet':
            return listGetToCode(ctx, block, lang, indent);
        case 'listLength':
            return listLengthToCode(ctx, block, lang, indent);
        case 'functionDef':
            return functionDefToCode(ctx, block, lang, indent);
        case 'functionCall':
            return functionCallToCode(ctx, block, lang, indent);
        case 'return':
            return returnToCode(ctx, block, lang, indent);
        default:
            return '';
    }
}

function assignToCode(ctx, block, lang, indent) {
    const ind = '  '.repeat(indent);
    switch (lang) {
        case 'python':
            return `${ind}${block.varName} = ${block.value}`;
        case 'nodejs':
        case 'webjs':
            return `${ind}let ${block.varName} = ${block.value};`;
        case 'bash':
            return `${ind}${block.varName}=${block.value}`;
        case 'batch':
            return `${ind}set ${block.varName}=${block.value}`;
        case 'c':
            return `${ind}int ${block.varName} = ${block.value};`;
        case 'cpp':
            return `${ind}auto ${block.varName} = ${block.value};`;
        default:
            return `${ind}${block.varName} = ${block.value}`;
    }
}

function sayToCode(ctx, block, lang, indent) {
    const ind = '  '.repeat(indent);
    switch (lang) {
        case 'python':
            return `${ind}print(${block.text})`;
        case 'nodejs':
        case 'webjs':
            return `${ind}console.log(${block.text});`;
        case 'bash':
            return `${ind}echo ${block.text}`;
        case 'batch':
            return `${ind}echo ${block.text}`;
        case 'c':
            return `${ind}printf("%s\\n", ${block.text});`;
        case 'cpp':
            return `${ind}std::cout << ${block.text} << std::endl;`;
        default:
            return `${ind}print(${block.text})`;
    }
}

function askToCode(ctx, block, lang, indent) {
    const ind = '  '.repeat(indent);
    switch (lang) {
        case 'python':
            return `${ind}${block.varName} = input(${block.question})`;
        case 'nodejs':
        case 'webjs':
            return `${ind}${block.varName} = prompt(${block.question});`;
        case 'bash':
            return `${ind}read -p "${block.question}" ${block.varName}`;
        case 'batch':
            return `${ind}set /p ${block.varName}="${block.question}"`;
        case 'c':
            return `${ind}scanf("%s", ${block.varName});`;
        case 'cpp':
            return `${ind}std::cin >> ${block.varName};`;
        default:
            return `${ind}${block.varName} = input(${block.question})`;
    }
}

function repeatToCode(ctx, block, lang, indent) {
    const ind = '  '.repeat(indent);
    let code = '';
    switch (lang) {
        case 'python':
            code = `${ind}for _ in range(${block.times}):\n`;
            break;
        case 'nodejs':
        case 'webjs':
            code = `${ind}for (let i = 0; i < ${block.times}; i++) {\n`;
            break;
        case 'bash':
            code = `${ind}for ((i=0; i<${block.times}; i++)); do\n`;
            break;
        case 'batch':
            code = `${ind}for /l %%i in (1,1,${block.times}) do (\n`;
            break;
        case 'c':
        case 'cpp':
            code = `${ind}for (int i = 0; i < ${block.times}; i++) {\n`;
            break;
        default:
            code = `${ind}for (let i = 0; i < ${block.times}; i++) {\n`;
    }
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, lang, indent + 1) + '\n';
    }
    if (lang === 'python') {
        code += `${ind}    pass\n`;
    } else {
        code += `${ind}}`;
    }
    return code;
}

function whileToCode(ctx, block, lang, indent) {
    const ind = '  '.repeat(indent);
    let code = '';
    switch (lang) {
        case 'python':
            code = `${ind}while ${block.condition}:\n`;
            break;
        case 'nodejs':
        case 'webjs':
            code = `${ind}while (${block.condition}) {\n`;
            break;
        case 'bash':
            code = `${ind}while [ ${block.condition} ]; do\n`;
            break;
        case 'batch':
            code = `${ind}:while_loop\n`;
            code += `${ind}if not ${block.condition} goto end_while\n`;
            break;
        case 'c':
        case 'cpp':
            code = `${ind}while (${block.condition}) {\n`;
            break;
        default:
            code = `${ind}while (${block.condition}) {\n`;
    }
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, lang, indent + 1) + '\n';
    }
    if (lang === 'python') {
        code += `${ind}    pass\n`;
    } else if (lang === 'batch') {
        code += `${ind}goto while_loop\n`;
        code += `${ind}:end_while\n`;
    } else {
        code += `${ind}}`;
    }
    return code;
}

function ifToCode(ctx, block, lang, indent) {
    const ind = '  '.repeat(indent);
    let code = '';
    switch (lang) {
        case 'python':
            code = `${ind}if ${block.condition}:\n`;
            break;
        case 'nodejs':
        case 'webjs':
            code = `${ind}if (${block.condition}) {\n`;
            break;
        case 'bash':
            code = `${ind}if [ ${block.condition} ]; then\n`;
            break;
        case 'batch':
            code = `${ind}if ${block.condition} (\n`;
            break;
        case 'c':
        case 'cpp':
            code = `${ind}if (${block.condition}) {\n`;
            break;
        default:
            code = `${ind}if (${block.condition}) {\n`;
    }
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, lang, indent + 1) + '\n';
    }
    if (lang === 'python') {
        code += `${ind}    pass\n`;
    } else if (lang === 'batch') {
        code += `${ind})`;
    } else {
        code += `${ind}}`;
    }
    return code;
}

function foreverToCode(ctx, block, lang, indent) {
    const ind = '  '.repeat(indent);
    let code = '';
    switch (lang) {
        case 'python':
            code = `${ind}while True:\n`;
            break;
        case 'nodejs':
        case 'webjs':
            code = `${ind}while (true) {\n`;
            break;
        case 'bash':
            code = `${ind}while true; do\n`;
            break;
        case 'batch':
            code = `${ind}:forever_loop\n`;
            break;
        case 'c':
        case 'cpp':
            code = `${ind}while (1) {\n`;
            break;
        default:
            code = `${ind}while (true) {\n`;
    }
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, lang, indent + 1) + '\n';
    }
    if (lang === 'python') {
        code += `${ind}    pass\n`;
    } else if (lang === 'batch') {
        code += `${ind}goto forever_loop\n`;
    } else {
        code += `${ind}}`;
    }
    return code;
}

function listCreateToCode(ctx, block, lang, indent) {
    const ind = '  '.repeat(indent);
    switch (lang) {
        case 'python':
            return `${ind}${block.varName} = ${block.value}`;
        case 'nodejs':
        case 'webjs':
            return `${ind}let ${block.varName} = ${block.value};`;
        case 'bash':
            return `${ind}${block.varName}=(${block.value})`;
        case 'batch':
            return `${ind}set ${block.varName}=${block.value}`;
        case 'c':
            return `${ind}int ${block.varName}[] = ${block.value};`;
        case 'cpp':
            return `${ind}std::vector<int> ${block.varName} = ${block.value};`;
        default:
            return `${ind}${block.varName} = ${block.value}`;
    }
}

function listAddToCode(ctx, block, lang, indent) {
    const ind = '  '.repeat(indent);
    switch (lang) {
        case 'python':
            return `${ind}${block.varName}.append(${block.value})`;
        case 'nodejs':
        case 'webjs':
            return `${ind}${block.varName}.push(${block.value});`;
        case 'bash':
            return `${ind}${block.varName}+=(${block.value})`;
        case 'batch':
            return `${ind}set ${block.varName}=%${block.varName}% ${block.value}`;
        case 'c':
            return `${ind}// No soportado directamente, usar realloc`;
        case 'cpp':
            return `${ind}${block.varName}.push_back(${block.value});`;
        default:
            return `${ind}${block.varName}.push(${block.value});`;
    }
}

function listGetToCode(ctx, block, lang, indent) {
    const ind = '  '.repeat(indent);
    if (block.target) {
        switch (lang) {
            case 'python':
                return `${ind}${block.target} = ${block.varName}[${block.index}]`;
            case 'nodejs':
            case 'webjs':
                return `${ind}${block.target} = ${block.varName}[${block.index}];`;
            case 'bash':
                return `${ind}${block.target}=${block.varName}[${block.index}]`;
            case 'batch':
                return `${ind}set ${block.target}=${block.varName}[${block.index}]`;
            case 'c':
            case 'cpp':
                return `${ind}${block.target} = ${block.varName}[${block.index}];`;
            default:
                return `${ind}${block.target} = ${block.varName}[${block.index}];`;
        }
    } else {
        return sayToCode(ctx, { text: `${block.varName}[${block.index}]` }, lang, indent);
    }
}

function listLengthToCode(ctx, block, lang, indent) {
    const ind = '  '.repeat(indent);
    if (block.target) {
        switch (lang) {
            case 'python':
                return `${ind}${block.target} = len(${block.varName})`;
            case 'nodejs':
            case 'webjs':
                return `${ind}${block.target} = ${block.varName}.length;`;
            case 'bash':
                return ind + block.target + '=${#' + block.varName + '[@]}';
            case 'batch':
                return `${ind}set ${block.target}=...`;
            case 'c':
            case 'cpp':
                return `${ind}${block.target} = sizeof(${block.varName})/sizeof(${block.varName}[0]);`;
            default:
                return `${ind}${block.target} = ${block.varName}.length;`;
        }
    } else {
        return sayToCode(ctx, { text: `len(${block.varName})` }, lang, indent);
    }
}

function functionDefToCode(ctx, block, lang, indent) {
    const ind = '  '.repeat(indent);
    let code = '';
    switch (lang) {
        case 'python':
            code = `${ind}def ${block.name}(${block.params}):\n`;
            break;
        case 'nodejs':
        case 'webjs':
            code = `${ind}function ${block.name}(${block.params}) {\n`;
            break;
        case 'bash':
            code = `${ind}function ${block.name} {\n`;
            code += `${ind}  local ${block.params.replace(/,/g, ' ')}\n`;
            break;
        case 'batch':
            code = `${ind}:${block.name}\n`;
            break;
        case 'c':
        case 'cpp':
            code = `${ind}void ${block.name}(${block.params}) {\n`;
            break;
        default:
            code = `${ind}function ${block.name}(${block.params}) {\n`;
    }
    for (const child of block.children || []) {
        code += generateBlockCode(ctx, child, lang, indent + 1) + '\n';
    }
    if (lang === 'python') {
        code += `${ind}    pass\n`;
    } else {
        code += `${ind}}`;
    }
    return code;
}

function functionCallToCode(ctx, block, lang, indent) {
    const ind = '  '.repeat(indent);
    if (block.target) {
        switch (lang) {
            case 'python':
                return `${ind}${block.target} = ${block.name}(${block.args})`;
            case 'nodejs':
            case 'webjs':
                return `${ind}${block.target} = ${block.name}(${block.args});`;
            case 'bash':
                return `${ind}${block.target}=${block.name} ${block.args}`;
            case 'batch':
                return `${ind}set ${block.target}=${block.name} ${block.args}`;
            case 'c':
            case 'cpp':
                return `${ind}${block.target} = ${block.name}(${block.args});`;
            default:
                return `${ind}${block.target} = ${block.name}(${block.args});`;
        }
    } else {
        switch (lang) {
            case 'python':
                return `${ind}${block.name}(${block.args})`;
            case 'nodejs':
            case 'webjs':
                return `${ind}${block.name}(${block.args});`;
            case 'bash':
                return `${ind}${block.name} ${block.args}`;
            case 'batch':
                return `${ind}${block.name} ${block.args}`;
            case 'c':
            case 'cpp':
                return `${ind}${block.name}(${block.args});`;
            default:
                return `${ind}${block.name}(${block.args});`;
        }
    }
}

function returnToCode(ctx, block, lang, indent) {
    const ind = '  '.repeat(indent);
    switch (lang) {
        case 'python':
            return `${ind}return ${block.value}`;
        case 'nodejs':
        case 'webjs':
            return `${ind}return ${block.value};`;
        case 'bash':
            return `${ind}return ${block.value}`;
        case 'batch':
            return `${ind}exit /b ${block.value}`;
        case 'c':
        case 'cpp':
            return `${ind}return ${block.value};`;
        default:
            return `${ind}return ${block.value};`;
    }
}

// ================== PARSEO DE CÓDIGO A SCRATCH ==================
// Versión mejorada y segura
function parseCodeToBlocks(ctx, code, lang) {
    const lines = code.split('\n');
    const blocks = [];
    let parentStack = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const indent = line.match(/^\s*/)[0].length;

        switch (lang) {
            case 'python':
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
                    const text = trimmed.slice(6, -1);
                    const newBlock = { type: 'say', text };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.includes('= input(')) {
                    const varName = trimmed.split('=')[0].trim();
                    const question = trimmed.split('= input(')[1].slice(0, -1);
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

            // Para los demás lenguajes, detección genérica básica
            default:
                if (trimmed.startsWith('function ') || trimmed.startsWith('void ')) {
                    const rest = trimmed.replace('function', '').replace('void', '').trim();
                    if (!rest.includes('(')) continue;
                    const name = rest.split('(')[0].trim();
                    const params = rest.split('(')[1].split(')')[0].trim() || '';
                    const newBlock = { type: 'functionDef', name, params, children: [] };
                    blocks.push(newBlock);
                    parentStack = [{ block: newBlock, indent }];
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
                } else if (trimmed.startsWith('console.log(') || trimmed.startsWith('printf(')) {
                    const text = trimmed.slice(trimmed.indexOf('(') + 1, -1).replace(';', '');
                    const newBlock = { type: 'say', text };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('let ') || trimmed.startsWith('int ')) {
                    const parts = trimmed.split('=');
                    const varName = parts[0].replace('let', '').replace('int', '').trim();
                    const value = parts[1] ? parts[1].replace(';', '').trim() : '';
                    const newBlock = { type: 'assign', varName, value };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                } else if (trimmed.startsWith('return ')) {
                    const value = trimmed.slice(7).replace(';', '').trim();
                    const newBlock = { type: 'return', value };
                    addBlockToCurrentParent(blocks, parentStack, newBlock, indent);
                }
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


// ============================================================
// ARCHIVO FINAL: core.js
// ============================================================
// ============================================================
// core.js - Funciones principales (bloques, renderizado, ejecución)
// Generado automáticamente por dividir.js
// ============================================================

// ================== EXCEPCIÓN DE RETORNO ==================
function ReturnSignal(value) {
    this.returnValue = value;
}

// ================== FUNCIONES AUXILIARES (internas) ==================
function internalGetBlockByPath(ctx, path) {
    let current = ctx.blocks;
    for (let i = 0; i < path.length; i++) {
        if (i === path.length - 1) {
            return current[path[i]];
        } else {
            if (!current[path[i]] || !current[path[i]].children) return null;
            current = current[path[i]].children;
        }
    }
    return null;
}

function internalGetParentList(ctx, path) {
    if (path.length === 0) return ctx.blocks;
    let parent = ctx.blocks;
    for (let i = 0; i < path.length - 1; i++) {
        parent = parent[path[i]].children;
    }
    return parent;
}

function internalUpdateBlockByPath(ctx, path, key, value) {
    const block = internalGetBlockByPath(ctx, path);
    if (block) {
        block[key] = value;
    }
}

function internalDeleteBlockByPath(ctx, path) {
    if (path.length === 0) return;
    const parentList = internalGetParentList(ctx, path);
    const index = path[path.length - 1];
    parentList.splice(index, 1);
    internalRenderProgram(ctx);
}

function internalMoveBlockByPath(ctx, path, direction) {
    if (path.length === 0) return;
    const parentList = internalGetParentList(ctx, path);
    const index = path[path.length - 1];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= parentList.length) return;
    [parentList[index], parentList[newIndex]] = [parentList[newIndex], parentList[index]];
    internalRenderProgram(ctx);
}

function internalAddBlockToParent(ctx, type, parentPath) {
    const newBlock = createBlock(ctx, type);
    const parentList = internalGetParentList(ctx, parentPath);
    parentList.push(newBlock);
    internalRenderProgram(ctx);
}

function internalAddBlockToContainer(ctx, containerPath, type) {
    const containerBlock = internalGetBlockByPath(ctx, containerPath);
    if (containerBlock && ['repeat', 'while', 'if', 'functionDef', 'forever'].includes(containerBlock.type)) {
        const newBlock = createBlock(ctx, type);
        containerBlock.children.push(newBlock);
        internalRenderProgram(ctx);
    }
}

function createBlock(ctx, type) {
    if (type === 'say') {
        return { type: 'say', text: '"hola mundo"' };
    } else if (type === 'assign') {
        return { type: 'assign', varName: 'veces', value: '1' };
    } else if (type === 'repeat') {
        return { type: 'repeat', times: '10', children: [] };
    } else if (type === 'while') {
        return { type: 'while', condition: 'veces < 3', children: [] };
    } else if (type === 'if') {
        return { type: 'if', condition: 'veces === 1', children: [] };
    } else if (type === 'forever') {
        return { type: 'forever', children: [] };
    } else if (type === 'ask') {
        return { type: 'ask', question: '""', varName: 'nombre' };
    } else if (type === 'listCreate') {
        return { type: 'listCreate', varName: 'miLista', value: '[1, 2, 3]' };
    } else if (type === 'listAdd') {
        return { type: 'listAdd', varName: 'miLista', value: '4' };
    } else if (type === 'listGet') {
        return { type: 'listGet', varName: 'miLista', index: '0', target: 'elemento' };
    } else if (type === 'listLength') {
        return { type: 'listLength', varName: 'miLista', target: 'longitud' };
    } else if (type === 'functionDef') {
        return { type: 'functionDef', name: 'miFuncion', params: 'a, b', children: [] };
    } else if (type === 'functionCall') {
        return { type: 'functionCall', name: 'miFuncion', args: '1, 2', target: '' };
    } else if (type === 'return') {
        return { type: 'return', value: '""' };
    }
    return null;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ================== MENSAJES EN CONSOLA ==================
function mostrarMensaje(ctx, texto, esError = false) {
    const outputDiv = document.getElementById('outputArea');
    if (!outputDiv) {
        console.log(texto);
        return;
    }
    const div = document.createElement('div');
    div.className = 'output-msg';
    div.textContent = texto;
    div.style.color = esError ? '#ff6b6b' : '#6a9955';
    outputDiv.appendChild(div);
    outputDiv.scrollTop = outputDiv.scrollHeight;
}

// ================== RENDERIZADO ==================
function internalRenderProgram(ctx) {
    const list = document.getElementById('programList');
    const emptyHint = document.getElementById('emptyHint');
    list.innerHTML = '';

    list.dataset.listPath = '';
    list.ondragover = handleDragOverList;
    list.ondrop = handleDropOnList;
    list.classList.remove('drop-zone-highlight');

    if (ctx.blocks.length === 0) {
        emptyHint.style.display = 'block';
        return;
    } else {
        emptyHint.style.display = 'none';
    }

    renderBlockList(ctx, list, ctx.blocks, []);
}

function renderBlockList(ctx, container, blockList, parentPath) {
    blockList.forEach((block, index) => {
        const currentPath = parentPath.concat(index);
        const div = document.createElement('div');
        let classNames = ['block'];
        if (block.type === 'assign') classNames.push('block-assign');
        else if (block.type === 'repeat') classNames.push('block-repeat');
        else if (block.type === 'while') classNames.push('block-while');
        else if (block.type === 'if') classNames.push('block-if');
        else if (block.type === 'forever') classNames.push('block-forever');
        else if (block.type === 'ask') classNames.push('block-ask');
        else if (['listCreate','listAdd','listGet','listLength'].includes(block.type)) classNames.push('block-list');
        else if (block.type === 'functionDef') classNames.push('block-function');
        else if (block.type === 'functionCall') classNames.push('block-function');
        else if (block.type === 'return') classNames.push('block-return');
        div.className = classNames.join(' ');
        div.draggable = true;
        div.dataset.path = currentPath.join(',');
        div.addEventListener('dragstart', (event) => handleDragStart(ctx, event));
        div.addEventListener('dragover', (event) => handleDragOverBlock(ctx, event));
        div.addEventListener('drop', (event) => handleDropOnBlock(ctx, event));
        div.addEventListener('dragend', (event) => handleDragEnd(ctx, event));

        if (block.type === 'say') {
            div.innerHTML = `
                <span class="block-label">💬 decir</span>
                <input type="text" value="${escapeHtml(block.text)}" placeholder="Expresión JS" 
                       onchange="updateBlockByPath([${currentPath.join(',')}], 'text', this.value)">
                <button title="Subir" onclick="moveBlockByPath([${currentPath.join(',')}], -1)">↑</button>
                <button title="Bajar" onclick="moveBlockByPath([${currentPath.join(',')}], 1)">↓</button>
                <button title="Eliminar" onclick="deleteBlockByPath([${currentPath.join(',')}])">✖</button>
            `;
        } else if (block.type === 'assign') {
            div.innerHTML = `
                <span class="block-label">📦 asignar</span>
                <input type="text" value="${escapeHtml(block.varName)}" placeholder="Variable" 
                       onchange="updateBlockByPath([${currentPath.join(',')}], 'varName', this.value)">
                <span>=</span>
                <input type="text" value="${escapeHtml(block.value)}" placeholder="Expresión JS" 
                       onchange="updateBlockByPath([${currentPath.join(',')}], 'value', this.value)">
                <button title="Subir" onclick="moveBlockByPath([${currentPath.join(',')}], -1)">↑</button>
                <button title="Bajar" onclick="moveBlockByPath([${currentPath.join(',')}], 1)">↓</button>
                <button title="Eliminar" onclick="deleteBlockByPath([${currentPath.join(',')}])">✖</button>
            `;
        } else if (block.type === 'repeat' || block.type === 'while' || block.type === 'if' || block.type === 'forever' || block.type === 'functionDef') {
            let headerHtml = '';
            let bodyClass = '';
            let addButtonsHtml = '';
            const typeName = block.type;
            if (typeName === 'repeat') {
                headerHtml = `
                    <div class="repeat-header">
                        <span class="block-label">🔁 repetir</span>
                        <input type="text" value="${escapeHtml(block.times)}" placeholder="Número o expresión" 
                               onchange="updateBlockByPath([${currentPath.join(',')}], 'times', this.value)">
                        <span>veces</span>
                        <button title="Subir" onclick="moveBlockByPath([${currentPath.join(',')}], -1)">↑</button>
                        <button title="Bajar" onclick="moveBlockByPath([${currentPath.join(',')}], 1)">↓</button>
                        <button title="Eliminar" onclick="deleteBlockByPath([${currentPath.join(',')}])">✖</button>
                    </div>
                `;
                bodyClass = 'repeat-body';
            } else if (typeName === 'while') {
                headerHtml = `
                    <div class="while-header">
                        <span class="block-label">🔁 mientras</span>
                        <input type="text" value="${escapeHtml(block.condition)}" placeholder="Condición JS" 
                               onchange="updateBlockByPath([${currentPath.join(',')}], 'condition', this.value)">
                        <span>hacer</span>
                        <button title="Subir" onclick="moveBlockByPath([${currentPath.join(',')}], -1)">↑</button>
                        <button title="Bajar" onclick="moveBlockByPath([${currentPath.join(',')}], 1)">↓</button>
                        <button title="Eliminar" onclick="deleteBlockByPath([${currentPath.join(',')}])">✖</button>
                    </div>
                `;
                bodyClass = 'while-body';
            } else if (typeName === 'if') {
                headerHtml = `
                    <div class="if-header">
                        <span class="block-label">🔀 si</span>
                        <input type="text" value="${escapeHtml(block.condition)}" placeholder="Condición JS" 
                               onchange="updateBlockByPath([${currentPath.join(',')}], 'condition', this.value)">
                        <span>entonces</span>
                        <button title="Subir" onclick="moveBlockByPath([${currentPath.join(',')}], -1)">↑</button>
                        <button title="Bajar" onclick="moveBlockByPath([${currentPath.join(',')}], 1)">↓</button>
                        <button title="Eliminar" onclick="deleteBlockByPath([${currentPath.join(',')}])">✖</button>
                    </div>
                `;
                bodyClass = 'if-body';
            } else if (typeName === 'forever') {
                headerHtml = `
                    <div class="forever-header">
                        <span class="block-label">🔁 siempre</span>
                        <span>repetir a 60 FPS</span>
                        <button title="Subir" onclick="moveBlockByPath([${currentPath.join(',')}], -1)">↑</button>
                        <button title="Bajar" onclick="moveBlockByPath([${currentPath.join(',')}], 1)">↓</button>
                        <button title="Eliminar" onclick="deleteBlockByPath([${currentPath.join(',')}])">✖</button>
                    </div>
                `;
                bodyClass = 'forever-body';
            } else if (typeName === 'functionDef') {
                headerHtml = `
                    <div class="function-header">
                        <span class="block-label">🔧 función</span>
                        <input type="text" value="${escapeHtml(block.name)}" placeholder="Nombre de función" 
                               onchange="updateBlockByPath([${currentPath.join(',')}], 'name', this.value)">
                        <span>parámetros:</span>
                        <input type="text" value="${escapeHtml(block.params)}" placeholder="a, b, c" 
                               onchange="updateBlockByPath([${currentPath.join(',')}], 'params', this.value)">
                        <button title="Subir" onclick="moveBlockByPath([${currentPath.join(',')}], -1)">↑</button>
                        <button title="Bajar" onclick="moveBlockByPath([${currentPath.join(',')}], 1)">↓</button>
                        <button title="Eliminar" onclick="deleteBlockByPath([${currentPath.join(',')}])">✖</button>
                    </div>
                `;
                bodyClass = 'function-body';
            }
            addButtonsHtml = `
                <div class="add-inside">
                    <button onclick="addBlockToContainer([${currentPath.join(',')}], 'say')">➕ Decir</button>
                    <button onclick="addBlockToContainer([${currentPath.join(',')}], 'assign')">➕ Asignar</button>
                    <button onclick="addBlockToContainer([${currentPath.join(',')}], 'repeat')">➕ Repetir</button>
                    <button onclick="addBlockToContainer([${currentPath.join(',')}], 'while')">➕ Mientras</button>
                    <button onclick="addBlockToContainer([${currentPath.join(',')}], 'if')">➕ Si</button>
                    <button onclick="addBlockToContainer([${currentPath.join(',')}], 'forever')">➕ Siempre</button>
                    <button onclick="addBlockToContainer([${currentPath.join(',')}], 'ask')">➕ Preguntar</button>
                    <button onclick="addBlockToContainer([${currentPath.join(',')}], 'listCreate')">➕ Crear lista</button>
                    <button onclick="addBlockToContainer([${currentPath.join(',')}], 'listAdd')">➕ Añadir</button>
                    <button onclick="addBlockToContainer([${currentPath.join(',')}], 'listGet')">➕ Obtener</button>
                    <button onclick="addBlockToContainer([${currentPath.join(',')}], 'listLength')">➕ Longitud</button>
                    <button onclick="addBlockToContainer([${currentPath.join(',')}], 'functionDef')">➕ Función</button>
                    <button onclick="addBlockToContainer([${currentPath.join(',')}], 'functionCall')">➕ Llamar función</button>
                    <button onclick="addBlockToContainer([${currentPath.join(',')}], 'return')">➕ Retornar</button>
                </div>
            `;
            div.innerHTML = `
                ${headerHtml}
                <div class="${bodyClass}">
                    <div class="nested-list" data-list-path="${currentPath.join(',')}"></div>
                    ${addButtonsHtml}
                </div>
            `;
            const nestedList = div.querySelector('.nested-list');
            nestedList.ondragover = handleDragOverList;
            nestedList.ondrop = handleDropOnList;
            renderBlockList(ctx, nestedList, block.children || [], currentPath);
        } else if (block.type === 'ask') {
            div.innerHTML = `
                <div class="ask-header">
                    <span class="block-label">❓ preguntar</span>
                    <span>y guardar en</span>
                    <input type="text" value="${escapeHtml(block.varName)}" placeholder="Variable" 
                           onchange="updateBlockByPath([${currentPath.join(',')}], 'varName', this.value)">
                    <button title="Subir" onclick="moveBlockByPath([${currentPath.join(',')}], -1)">↑</button>
                    <button title="Bajar" onclick="moveBlockByPath([${currentPath.join(',')}], 1)">↓</button>
                    <button title="Eliminar" onclick="deleteBlockByPath([${currentPath.join(',')}])">✖</button>
                </div>
            `;
        } else if (block.type === 'listCreate') {
            div.innerHTML = `
                <span class="block-label">📋 crear lista</span>
                <input type="text" value="${escapeHtml(block.varName)}" placeholder="Variable" 
                       onchange="updateBlockByPath([${currentPath.join(',')}], 'varName', this.value)">
                <span>=</span>
                <input type="text" value="${escapeHtml(block.value)}" placeholder="Expresión JS (ej. [1,2,3])" 
                       onchange="updateBlockByPath([${currentPath.join(',')}], 'value', this.value)">
                <button title="Subir" onclick="moveBlockByPath([${currentPath.join(',')}], -1)">↑</button>
                <button title="Bajar" onclick="moveBlockByPath([${currentPath.join(',')}], 1)">↓</button>
                <button title="Eliminar" onclick="deleteBlockByPath([${currentPath.join(',')}])">✖</button>
            `;
        } else if (block.type === 'listAdd') {
            div.innerHTML = `
                <span class="block-label">➕ añadir a</span>
                <input type="text" value="${escapeHtml(block.varName)}" placeholder="Variable (array)" 
                       onchange="updateBlockByPath([${currentPath.join(',')}], 'varName', this.value)">
                <span>el valor</span>
                <input type="text" value="${escapeHtml(block.value)}" placeholder="Expresión JS" 
                       onchange="updateBlockByPath([${currentPath.join(',')}], 'value', this.value)">
                <button title="Subir" onclick="moveBlockByPath([${currentPath.join(',')}], -1)">↑</button>
                <button title="Bajar" onclick="moveBlockByPath([${currentPath.join(',')}], 1)">↓</button>
                <button title="Eliminar" onclick="deleteBlockByPath([${currentPath.join(',')}])">✖</button>
            `;
        } else if (block.type === 'listGet') {
            div.innerHTML = `
                <span class="block-label">🔍 obtener</span>
                <input type="text" value="${escapeHtml(block.varName)}" placeholder="Variable (array)" 
                       onchange="updateBlockByPath([${currentPath.join(',')}], 'varName', this.value)">
                <span>en índice</span>
                <input type="text" value="${escapeHtml(block.index)}" placeholder="Expresión numérica" 
                       onchange="updateBlockByPath([${currentPath.join(',')}], 'index', this.value)">
                <span>guardar en</span>
                <input type="text" value="${escapeHtml(block.target || '')}" placeholder="Variable destino (opcional)" 
                       onchange="updateBlockByPath([${currentPath.join(',')}], 'target', this.value)">
                <button title="Subir" onclick="moveBlockByPath([${currentPath.join(',')}], -1)">↑</button>
                <button title="Bajar" onclick="moveBlockByPath([${currentPath.join(',')}], 1)">↓</button>
                <button title="Eliminar" onclick="deleteBlockByPath([${currentPath.join(',')}])">✖</button>
            `;
        } else if (block.type === 'listLength') {
            div.innerHTML = `
                <span class="block-label">📏 longitud de</span>
                <input type="text" value="${escapeHtml(block.varName)}" placeholder="Variable (array)" 
                       onchange="updateBlockByPath([${currentPath.join(',')}], 'varName', this.value)">
                <span>guardar en</span>
                <input type="text" value="${escapeHtml(block.target || '')}" placeholder="Variable destino (opcional)" 
                       onchange="updateBlockByPath([${currentPath.join(',')}], 'target', this.value)">
                <button title="Subir" onclick="moveBlockByPath([${currentPath.join(',')}], -1)">↑</button>
                <button title="Bajar" onclick="moveBlockByPath([${currentPath.join(',')}], 1)">↓</button>
                <button title="Eliminar" onclick="deleteBlockByPath([${currentPath.join(',')}])">✖</button>
            `;
        } else if (block.type === 'functionCall') {
            div.innerHTML = `
                <span class="block-label">📞 llamar función</span>
                <input type="text" value="${escapeHtml(block.name)}" placeholder="Nombre de función" 
                       onchange="updateBlockByPath([${currentPath.join(',')}], 'name', this.value)">
                <span>con argumentos:</span>
                <input type="text" value="${escapeHtml(block.args)}" placeholder="exp1, exp2, ..." 
                       onchange="updateBlockByPath([${currentPath.join(',')}], 'args', this.value)">
                <span>guardar en</span>
                <input type="text" value="${escapeHtml(block.target || '')}" placeholder="Variable (opcional)" 
                       onchange="updateBlockByPath([${currentPath.join(',')}], 'target', this.value)">
                <button title="Subir" onclick="moveBlockByPath([${currentPath.join(',')}], -1)">↑</button>
                <button title="Bajar" onclick="moveBlockByPath([${currentPath.join(',')}], 1)">↓</button>
                <button title="Eliminar" onclick="deleteBlockByPath([${currentPath.join(',')}])">✖</button>
            `;
        } else if (block.type === 'return') {
            div.innerHTML = `
                <span class="block-label">↩️ retornar</span>
                <input type="text" value="${escapeHtml(block.value)}" placeholder="Expresión JS" 
                       onchange="updateBlockByPath([${currentPath.join(',')}], 'value', this.value)">
                <button title="Subir" onclick="moveBlockByPath([${currentPath.join(',')}], -1)">↑</button>
                <button title="Bajar" onclick="moveBlockByPath([${currentPath.join(',')}], 1)">↓</button>
                <button title="Eliminar" onclick="deleteBlockByPath([${currentPath.join(',')}])">✖</button>
            `;
        }
        container.appendChild(div);
    });
}

// ================== DRAG & DROP ==================
function handleDragStart(ctx, event) {
    ctx.dragSourcePath = event.currentTarget.dataset.path.split(',').filter(s => s !== '').map(Number);
    event.dataTransfer.setData('text/plain', event.currentTarget.dataset.path);
    event.dataTransfer.effectAllowed = 'move';
    event.currentTarget.style.opacity = '0.5';
}

function handleDragEnd(ctx, event) {
    event.currentTarget.style.opacity = '1';
    document.querySelectorAll('.drop-zone-highlight').forEach(el => el.classList.remove('drop-zone-highlight'));
    ctx.dragSourcePath = null;
}

function handleDragOverBlock(ctx, event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    event.currentTarget.classList.add('drop-zone-highlight');
}

function handleDropOnBlock(ctx, event) {
    event.preventDefault();
    event.stopPropagation();
    const targetPath = event.currentTarget.dataset.path.split(',').filter(s => s !== '').map(Number);
    if (ctx.dragSourcePath) {
        internalMoveBlockBefore(ctx, ctx.dragSourcePath, targetPath);
    }
    event.currentTarget.classList.remove('drop-zone-highlight');
}

function handleDragOverList(ctx, event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    event.currentTarget.classList.add('drop-zone-highlight');
}

function handleDropOnList(ctx, event) {
    event.preventDefault();
    event.stopPropagation();
    const listPath = event.currentTarget.dataset.listPath || '';
    const targetParentPath = listPath === '' ? [] : listPath.split(',').map(Number);
    if (ctx.dragSourcePath) {
        internalMoveBlockToEnd(ctx, ctx.dragSourcePath, targetParentPath);
    }
    event.currentTarget.classList.remove('drop-zone-highlight');
}

function internalMoveBlockBefore(ctx, sourcePath, targetPath) {
    if (isDescendant(ctx, targetPath, sourcePath)) return;
    const sourceBlock = internalGetBlockByPath(ctx, sourcePath);
    if (!sourceBlock) return;
    const sourceParentList = internalGetParentList(ctx, sourcePath);
    const sourceIndex = sourcePath[sourcePath.length - 1];
    sourceParentList.splice(sourceIndex, 1);
    const targetParentList = internalGetParentList(ctx, targetPath);
    const targetIndex = targetPath[targetPath.length - 1];
    targetParentList.splice(targetIndex, 0, sourceBlock);
    internalRenderProgram(ctx);
}

function internalMoveBlockToEnd(ctx, sourcePath, targetParentPath) {
    if (isDescendant(ctx, targetParentPath, sourcePath)) return;
    const sourceBlock = internalGetBlockByPath(ctx, sourcePath);
    if (!sourceBlock) return;
    const sourceParentList = internalGetParentList(ctx, sourcePath);
    const sourceIndex = sourcePath[sourcePath.length - 1];
    sourceParentList.splice(sourceIndex, 1);
    let targetListRef;
    if (targetParentPath.length === 0) {
        targetListRef = ctx.blocks;
    } else {
        const parentBlock = internalGetBlockByPath(ctx, targetParentPath);
        targetListRef = parentBlock.children;
    }
    targetListRef.push(sourceBlock);
    internalRenderProgram(ctx);
}

function isDescendant(ctx, candidatePath, ancestorPath) {
    if (ancestorPath.length === 0) return false;
    if (candidatePath.length <= ancestorPath.length) return false;
    for (let i = 0; i < ancestorPath.length; i++) {
        if (candidatePath[i] !== ancestorPath[i]) return false;
    }
    return true;
}

// ================== EVALUACIÓN DE EXPRESIONES ==================
function evalExpression(ctx, expr, vars) {
    try {
        const keys = Object.keys(vars);
        const values = Object.values(vars);
        const func = new Function(...keys, `"use strict"; return (${expr});`);
        return func(...values);
    } catch (e) {
        return expr;
    }
}

// ================== ENTRADA EN CONSOLA ==================
function askInConsole(ctx, question, outputDiv) {
    return new Promise((resolve) => {
        const line = document.createElement('div');
        line.className = 'output-input-line';
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Escribe tu respuesta y pulsa Enter';
        line.appendChild(document.createTextNode(question + ' '));
        line.appendChild(input);
        outputDiv.appendChild(line);
        input.focus();

        input.addEventListener('keydown', function handler(e) {
            if (e.key === 'Enter') {
                const answer = input.value;
                input.disabled = true;
                input.style.borderBottom = 'none';
                input.removeEventListener('keydown', handler);
                resolve(answer);
            }
        });
    });
}

// ================== RECOPILACIÓN DE FUNCIONES ==================
function collectFunctionDefinitions(ctx, blockList) {
    for (const block of blockList) {
        if (block.type === 'functionDef') {
            ctx.functions[block.name.trim()] = block;
        }
        if (block.children && block.children.length > 0) {
            collectFunctionDefinitions(ctx, block.children);
        }
    }
}

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

// ================== EJECUCIÓN PRINCIPAL ==================
async function internalRunProgram(ctx) {
    if (ctx.isRunning) return;
    ctx.isRunning = true;
    ctx.variables = {};
    ctx.functions = {};
    ctx.callDepth = 0;
    ctx.activeIntervals.forEach(id => clearInterval(id));
    ctx.activeIntervals = [];
    const outputDiv = document.getElementById('outputArea');
    outputDiv.innerHTML = '';
    if (ctx.blocks.length === 0) {
        outputDiv.innerHTML = '<div class="output-msg">No hay bloques para ejecutar.</div>';
        ctx.isRunning = false;
        return;
    }
    collectFunctionDefinitions(ctx, ctx.blocks);
    try {
        await executeBlockList(ctx, ctx.blocks, outputDiv);
    } catch (e) {
        if (e instanceof ReturnSignal) {
            const warnDiv = document.createElement('div');
            warnDiv.className = 'output-msg';
            warnDiv.textContent = '⚠️ Advertencia: bloque "retornar" usado fuera de una función.';
            outputDiv.appendChild(warnDiv);
        } else {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'output-msg';
            errorDiv.textContent = `⚠️ Error: ${e.message}`;
            outputDiv.appendChild(errorDiv);
            console.error('Error:', e);
        }
    }
    ctx.isRunning = false;
}

async function executeBlockList(ctx, blockList, outputDiv) {
    for (const block of blockList) {
        try {
            if (block.type === 'assign') {
                const varName = block.varName.trim();
                if (!varName) throw new Error('Nombre de variable vacío');
                const value = evalExpression(ctx, block.value, ctx.variables);
                ctx.variables[varName] = value;
            } else if (block.type === 'say') {
                const message = evalExpression(ctx, block.text, ctx.variables);
                const msgDiv = document.createElement('div');
                msgDiv.className = 'output-msg';
                msgDiv.textContent = String(message);
                outputDiv.appendChild(msgDiv);
                console.log(message);
            } else if (block.type === 'ask') {
                const question = evalExpression(ctx, block.question, ctx.variables);
                const answer = await askInConsole(ctx, String(question), outputDiv);
                const varName = block.varName.trim();
                if (varName) {
                    ctx.variables[varName] = answer;
                } else {
                    throw new Error('Nombre de variable vacío para preguntar');
                }
            } else if (block.type === 'repeat') {
                const times = evalExpression(ctx, block.times, ctx.variables);
                const num = Number(times);
                if (isNaN(num)) throw new Error('Número de repeticiones no válido');
                if (num > 10000) throw new Error('Demasiadas repeticiones (máx. 10000)');
                for (let i = 0; i < num; i++) {
                    await executeBlockList(ctx, block.children || [], outputDiv);
                }
            } else if (block.type === 'while') {
                const maxIterations = 10000;
                let iterations = 0;
                while (evalExpression(ctx, block.condition, ctx.variables) && iterations < maxIterations) {
                    await executeBlockList(ctx, block.children || [], outputDiv);
                    iterations++;
                }
                if (iterations >= maxIterations) {
                    throw new Error('Bucle mientras superó el máximo de iteraciones (10000)');
                }
            } else if (block.type === 'if') {
                const condition = evalExpression(ctx, block.condition, ctx.variables);
                if (condition) {
                    await executeBlockList(ctx, block.children || [], outputDiv);
                }
            } else if (block.type === 'forever') {
                let isForeverRunning = false;
                const intervalId = setInterval(async () => {
                    if (!isForeverRunning) {
                        isForeverRunning = true;
                        try {
                            await executeBlockList(ctx, block.children || [], outputDiv);
                        } catch (err) {
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'output-msg';
                            errorDiv.textContent = `⚠️ Error: ${err.message}`;
                            outputDiv.appendChild(errorDiv);
                            console.error('Error:', err);
                        } finally {
                            isForeverRunning = false;
                        }
                    }
                }, 1000 / 60);
                ctx.activeIntervals.push(intervalId);
            } else if (block.type === 'listCreate') {
                const varName = block.varName.trim();
                if (!varName) throw new Error('Nombre de variable vacío para lista');
                const value = evalExpression(ctx, block.value, ctx.variables);
                if (!Array.isArray(value)) {
                    throw new Error(`El valor para "${varName}" no es un array. Usa [1,2,3] para crear una lista.`);
                }
                ctx.variables[varName] = value;
            } else if (block.type === 'listAdd') {
                const varName = block.varName.trim();
                if (!varName) throw new Error('Nombre de variable de lista vacío');
                const arr = ctx.variables[varName];
                if (!Array.isArray(arr)) {
                    throw new Error(`La variable "${varName}" no es un array.`);
                }
                const value = evalExpression(ctx, block.value, ctx.variables);
                arr.push(value);
            } else if (block.type === 'listGet') {
                const varName = block.varName.trim();
                if (!varName) throw new Error('Nombre de variable de lista vacío');
                const arr = ctx.variables[varName];
                if (!Array.isArray(arr)) {
                    throw new Error(`La variable "${varName}" no es un array.`);
                }
                const index = Number(evalExpression(ctx, block.index, ctx.variables));
                if (isNaN(index) || index < 0 || index >= arr.length) {
                    throw new Error(`Índice ${index} fuera de rango para "${varName}" (longitud ${arr.length}).`);
                }
                const element = arr[index];
                const target = block.target ? block.target.trim() : '';
                if (target) {
                    ctx.variables[target] = element;
                } else {
                    const msgDiv = document.createElement('div');
                    msgDiv.className = 'output-msg';
                    msgDiv.textContent = String(element);
                    outputDiv.appendChild(msgDiv);
                    console.log(element);
                }
            } else if (block.type === 'listLength') {
                const varName = block.varName.trim();
                if (!varName) throw new Error('Nombre de variable de lista vacío');
                const arr = ctx.variables[varName];
                if (!Array.isArray(arr)) {
                    throw new Error(`La variable "${varName}" no es un array.`);
                }
                const length = arr.length;
                const target = block.target ? block.target.trim() : '';
                if (target) {
                    ctx.variables[target] = length;
                } else {
                    const msgDiv = document.createElement('div');
                    msgDiv.className = 'output-msg';
                    msgDiv.textContent = String(length);
                    outputDiv.appendChild(msgDiv);
                    console.log(length);
                }
            } else if (block.type === 'functionDef') {
                continue;
            } else if (block.type === 'functionCall') {
                const fnName = block.name.trim();
                if (!fnName) throw new Error('Nombre de función vacío');
                const fnDef = ctx.functions[fnName];
                if (!fnDef) throw new Error(`La función "${fnName}" no está definida`);
                const args = parseArguments(ctx, block.args, ctx.variables);
                const result = await callFunction(ctx, fnDef, args, outputDiv);
                if (block.target && block.target.trim()) {
                    ctx.variables[block.target.trim()] = result;
                }
            } else if (block.type === 'return') {
                const value = evalExpression(ctx, block.value, ctx.variables);
                throw new ReturnSignal(value);
            }
        } catch (err) {
            if (err instanceof ReturnSignal) {
                throw err;
            }
            const errorDiv = document.createElement('div');
            errorDiv.className = 'output-msg';
            errorDiv.textContent = `⚠️ Error: ${err.message}`;
            outputDiv.appendChild(errorDiv);
            console.error('Error:', err);
        }
    }
}

function internalClearOutput(ctx) {
    document.getElementById('outputArea').innerHTML = '';
    console.clear();
}

// ================== LIMPIAR SCRATCH ==================
function internalClearScratch(ctx) {
    ctx.activeIntervals.forEach(id => clearInterval(id));
    ctx.activeIntervals = [];
    ctx.blocks = [];
    ctx.variables = {};
    ctx.functions = {};
    ctx.callDepth = 0;
    ctx.dragSourcePath = null;
    ctx.generatedCode = {};
    ctx.conversionStatus = {};
    document.getElementById('outputArea').innerHTML = '';
    console.clear();
    // Limpiar indicadores visuales
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        const span = btn.querySelector('.status-icon');
        if (span) span.remove();
    });
    internalRenderProgram(ctx);
}

// ================== GUARDAR Y CARGAR ==================
function internalSaveProgram(ctx) {
    const data = JSON.stringify(ctx.blocks, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'programa_scratch.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function internalLoadProgram(ctx, event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (Array.isArray(data) && validateBlocks(ctx, data)) {
                ctx.blocks = data;
                ctx.generatedCode = {};
                ctx.conversionStatus = {};
                // Limpiar indicadores visuales
                const tabBtns = document.querySelectorAll('.tab-btn');
                tabBtns.forEach(btn => {
                    const span = btn.querySelector('.status-icon');
                    if (span) span.remove();
                });
                internalRenderProgram(ctx);
                internalClearOutput(ctx);
                mostrarMensaje(ctx, 'Programa cargado correctamente.');
            } else {
                mostrarMensaje(ctx, 'Formato de archivo no válido. Debe ser un array de bloques con estructura válida.', true);
            }
        } catch (err) {
            mostrarMensaje(ctx, 'Error al leer el archivo: ' + err.message, true);
        }
        event.target.value = '';
    };
    reader.readAsText(file);
}

function validateBlocks(ctx, blockList) {
    if (!Array.isArray(blockList)) return false;
    return blockList.every(b => {
        if (b.type === 'say') {
            return typeof b.text === 'string';
        } else if (b.type === 'assign') {
            return typeof b.varName === 'string' && typeof b.value === 'string';
        } else if (b.type === 'repeat') {
            return typeof b.times === 'string' && validateBlocks(ctx, b.children);
        } else if (b.type === 'while') {
            return typeof b.condition === 'string' && validateBlocks(ctx, b.children);
        } else if (b.type === 'if') {
            return typeof b.condition === 'string' && validateBlocks(ctx, b.children);
        } else if (b.type === 'forever') {
            return validateBlocks(ctx, b.children || []);
        } else if (b.type === 'ask') {
            return typeof b.question === 'string' && typeof b.varName === 'string';
        } else if (b.type === 'listCreate') {
            return typeof b.varName === 'string' && typeof b.value === 'string';
        } else if (b.type === 'listAdd') {
            return typeof b.varName === 'string' && typeof b.value === 'string';
        } else if (b.type === 'listGet') {
            return typeof b.varName === 'string' && typeof b.index === 'string' && (typeof b.target === 'string' || b.target === undefined);
        } else if (b.type === 'listLength') {
            return typeof b.varName === 'string' && (typeof b.target === 'string' || b.target === undefined);
        } else if (b.type === 'functionDef') {
            return typeof b.name === 'string' && typeof b.params === 'string' && validateBlocks(ctx, b.children);
        } else if (b.type === 'functionCall') {
            return typeof b.name === 'string' && typeof b.args === 'string' && (typeof b.target === 'string' || b.target === undefined);
        } else if (b.type === 'return') {
            return typeof b.value === 'string';
        }
        return false;
    });
}

// ================== LIMPIAR CÓDIGO DEL CONVERSOR ==================
function limpiarCodigo() {
    const codeArea = document.getElementById('codeArea');
    if (codeArea) codeArea.value = '';

    // Resetear códigos generados y estado de conversión
    if (ctx) {
        ctx.generatedCode = {};
        ctx.conversionStatus = {};
    }

    // Limpiar indicadores visuales de las pestañas
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        const span = btn.querySelector('.status-icon');
        if (span) span.remove();
    });

    // Mostrar mensaje en la consola
    if (typeof mostrarMensaje === 'function') {
        mostrarMensaje(ctx, 'Código del conversor limpiado.');
    }
}

// ================== CARGAR PROGRAMA DE EJEMPLO ==================
function cargarEjemplo() {
    // Vaciar bloques actuales
    if (ctx) ctx.blocks = [];

    // Cargar bloques de ejemplo
    if (typeof cargarEjemplo === 'function') {
        cargarEjemplo();
    }

    // Limpiar estado de conversión
    if (ctx) {
        ctx.generatedCode = {};
        ctx.conversionStatus = {};
    }

    // Limpiar indicadores de pestañas
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        const span = btn.querySelector('.status-icon');
        if (span) span.remove();
    });

    // Limpiar consola y mostrar mensaje
    if (typeof internalClearOutput === 'function') {
        internalClearOutput(ctx);
    }
    if (typeof mostrarMensaje === 'function') {
        mostrarMensaje(ctx, 'Programa de ejemplo cargado.');
    }

    // Renderizar
    if (typeof internalRenderProgram === 'function') {
        internalRenderProgram(ctx);
    }
}

// ================== PROGRAMA PRINCIPAL ==================
function programa() {
    const ctx = {
        blocks: [],
        variables: {},
        functions: {},
        dragSourcePath: null,
        isRunning: false,
        callDepth: 0,
        MAX_CALL_DEPTH: 50,
        activeIntervals: [],
        generatedCode: {},
        conversionStatus: {},
        isConverting: false
    };

    // Exponer funciones para los onclick del HTML
    window.addBlockToParent = (type, parentPath) => internalAddBlockToParent(ctx, type, parentPath);
    window.addBlockToContainer = (containerPath, type) => internalAddBlockToContainer(ctx, containerPath, type);
    window.updateBlockByPath = (path, key, value) => internalUpdateBlockByPath(ctx, path, key, value);
    window.moveBlockByPath = (path, direction) => internalMoveBlockByPath(ctx, path, direction);
    window.deleteBlockByPath = (path) => internalDeleteBlockByPath(ctx, path);
    window.runProgram = () => internalRunProgram(ctx);
    window.saveProgram = () => internalSaveProgram(ctx);
    window.loadProgram = (event) => internalLoadProgram(ctx, event);
    window.clearOutput = () => internalClearOutput(ctx);
    window.clearScratch = () => internalClearScratch(ctx);

    // Funciones del conversor (se definen en converter.js)
    window.convertScratchToCode = () => internalConvertScratchToCode(ctx);
    window.convertCodeToScratch = () => internalConvertCodeToScratch(ctx);

    // Manejo de pestañas
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const lang = this.dataset.lang;
            if (ctx.generatedCode && ctx.generatedCode[lang]) {
                setCodeArea(ctx.generatedCode[lang]);
            } else {
                setCodeArea('');
            }
        });
    });

    // ----- Inicialización de bloques de ejemplo -----
    internalAddBlockToParent(ctx, 'assign', []);
    const askBlock = createBlock(ctx, 'ask');
    askBlock.question = "''";
    askBlock.varName = 'nombre';
    ctx.blocks.push(askBlock);

    const sayHello = createBlock(ctx, 'say');
    sayHello.text = "'¡Hola ' + nombre + '!'";
    ctx.blocks.push(sayHello);

    const functionDef = createBlock(ctx, 'functionDef');
    functionDef.name = 'sumar';
    functionDef.params = 'a, b';
    const returnInsideFunc = createBlock(ctx, 'return');
    returnInsideFunc.value = 'a + b';
    functionDef.children.push(returnInsideFunc);
    ctx.blocks.push(functionDef);

    const functionCall = createBlock(ctx, 'functionCall');
    functionCall.name = 'sumar';
    functionCall.args = '3, 4';
    functionCall.target = 'resultado';
    ctx.blocks.push(functionCall);

    const sayResult = createBlock(ctx, 'say');
    sayResult.text = "'El resultado es ' + resultado";
    ctx.blocks.push(sayResult);

    const listCreate = createBlock(ctx, 'listCreate');
    listCreate.varName = 'numeros';
    listCreate.value = '[1, 2, 3]';
    ctx.blocks.push(listCreate);

    const listAdd = createBlock(ctx, 'listAdd');
    listAdd.varName = 'numeros';
    listAdd.value = '4';
    ctx.blocks.push(listAdd);

    const listLength = createBlock(ctx, 'listLength');
    listLength.varName = 'numeros';
    listLength.target = 'longitud';
    ctx.blocks.push(listLength);

    const sayLength = createBlock(ctx, 'say');
    sayLength.text = "'La lista tiene ' + longitud + ' elementos'";
    ctx.blocks.push(sayLength);

    const whileBlock = createBlock(ctx, 'while');
    whileBlock.condition = 'contador < 3';
    const incBlock = createBlock(ctx, 'assign');
    incBlock.varName = 'contador';
    incBlock.value = 'contador + 1';
    whileBlock.children.push(incBlock);
    whileBlock.children.push(createBlock(ctx, 'say'));
    whileBlock.children[1].text = "'contador es ' + contador";
    ctx.blocks.push(whileBlock);

    const ifBlock = createBlock(ctx, 'if');
    ifBlock.condition = 'contador === 3';
    const sayInsideIf = createBlock(ctx, 'say');
    sayInsideIf.text = "'El contador llegó a 3!'";
    ifBlock.children.push(sayInsideIf);
    ctx.blocks.push(ifBlock);

    internalRenderProgram(ctx);
}
