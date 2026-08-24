// --- INICIO DE: arrastrar_y_soltar.js ---
// ============================================================
// arrastrar_y_soltar.js
// Generado automáticamente por dividir.js
// ============================================================

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



// --- INICIO DE: codigo_generador.js ---
// ============================================================
// codigo_generador.js
// Orquestador de generación de código para múltiples lenguajes
// ============================================================

// Mapa de generadores por lenguaje (verifica existencia con typeof)
const GENERADORES = {
    bash: {
        assign: typeof assignToCodeBash === 'function' ? assignToCodeBash : null,
        say: typeof sayToCodeBash === 'function' ? sayToCodeBash : null,
        ask: typeof askToCodeBash === 'function' ? askToCodeBash : null,
        repeat: typeof repeatToCodeBash === 'function' ? repeatToCodeBash : null,
        while: typeof whileToCodeBash === 'function' ? whileToCodeBash : null,
        if: typeof ifToCodeBash === 'function' ? ifToCodeBash : null,
        forever: typeof foreverToCodeBash === 'function' ? foreverToCodeBash : null,
        listCreate: typeof listCreateToCodeBash === 'function' ? listCreateToCodeBash : null,
        listAdd: typeof listAddToCodeBash === 'function' ? listAddToCodeBash : null,
        listGet: typeof listGetToCodeBash === 'function' ? listGetToCodeBash : null,
        listLength: typeof listLengthToCodeBash === 'function' ? listLengthToCodeBash : null,
        functionDef: typeof functionDefToCodeBash === 'function' ? functionDefToCodeBash : null,
        functionCall: typeof functionCallToCodeBash === 'function' ? functionCallToCodeBash : null,
        return: typeof returnToCodeBash === 'function' ? returnToCodeBash : null
    },
    batch: {
        assign: typeof assignToCodeBatch === 'function' ? assignToCodeBatch : null,
        say: typeof sayToCodeBatch === 'function' ? sayToCodeBatch : null,
        ask: typeof askToCodeBatch === 'function' ? askToCodeBatch : null,
        repeat: typeof repeatToCodeBatch === 'function' ? repeatToCodeBatch : null,
        while: typeof whileToCodeBatch === 'function' ? whileToCodeBatch : null,
        if: typeof ifToCodeBatch === 'function' ? ifToCodeBatch : null,
        forever: typeof foreverToCodeBatch === 'function' ? foreverToCodeBatch : null,
        listCreate: typeof listCreateToCodeBatch === 'function' ? listCreateToCodeBatch : null,
        listAdd: typeof listAddToCodeBatch === 'function' ? listAddToCodeBatch : null,
        listGet: typeof listGetToCodeBatch === 'function' ? listGetToCodeBatch : null,
        listLength: typeof listLengthToCodeBatch === 'function' ? listLengthToCodeBatch : null,
        functionDef: typeof functionDefToCodeBatch === 'function' ? functionDefToCodeBatch : null,
        functionCall: typeof functionCallToCodeBatch === 'function' ? functionCallToCodeBatch : null,
        return: typeof returnToCodeBatch === 'function' ? returnToCodeBatch : null
    },
    c: {
        assign: typeof assignToCodeC === 'function' ? assignToCodeC : null,
        say: typeof sayToCodeC === 'function' ? sayToCodeC : null,
        ask: typeof askToCodeC === 'function' ? askToCodeC : null,
        repeat: typeof repeatToCodeC === 'function' ? repeatToCodeC : null,
        while: typeof whileToCodeC === 'function' ? whileToCodeC : null,
        if: typeof ifToCodeC === 'function' ? ifToCodeC : null,
        forever: typeof foreverToCodeC === 'function' ? foreverToCodeC : null,
        listCreate: typeof listCreateToCodeC === 'function' ? listCreateToCodeC : null,
        listAdd: typeof listAddToCodeC === 'function' ? listAddToCodeC : null,
        listGet: typeof listGetToCodeC === 'function' ? listGetToCodeC : null,
        listLength: typeof listLengthToCodeC === 'function' ? listLengthToCodeC : null,
        functionDef: typeof functionDefToCodeC === 'function' ? functionDefToCodeC : null,
        functionCall: typeof functionCallToCodeC === 'function' ? functionCallToCodeC : null,
        return: typeof returnToCodeC === 'function' ? returnToCodeC : null
    },
    cpp: {
        assign: typeof assignToCodeCpp === 'function' ? assignToCodeCpp : null,
        say: typeof sayToCodeCpp === 'function' ? sayToCodeCpp : null,
        ask: typeof askToCodeCpp === 'function' ? askToCodeCpp : null,
        repeat: typeof repeatToCodeCpp === 'function' ? repeatToCodeCpp : null,
        while: typeof whileToCodeCpp === 'function' ? whileToCodeCpp : null,
        if: typeof ifToCodeCpp === 'function' ? ifToCodeCpp : null,
        forever: typeof foreverToCodeCpp === 'function' ? foreverToCodeCpp : null,
        listCreate: typeof listCreateToCodeCpp === 'function' ? listCreateToCodeCpp : null,
        listAdd: typeof listAddToCodeCpp === 'function' ? listAddToCodeCpp : null,
        listGet: typeof listGetToCodeCpp === 'function' ? listGetToCodeCpp : null,
        listLength: typeof listLengthToCodeCpp === 'function' ? listLengthToCodeCpp : null,
        functionDef: typeof functionDefToCodeCpp === 'function' ? functionDefToCodeCpp : null,
        functionCall: typeof functionCallToCodeCpp === 'function' ? functionCallToCodeCpp : null,
        return: typeof returnToCodeCpp === 'function' ? returnToCodeCpp : null
    },
    webjs: {
        assign: typeof assignToCodeWebjs === 'function' ? assignToCodeWebjs : null,
        say: typeof sayToCodeWebjs === 'function' ? sayToCodeWebjs : null,
        ask: typeof askToCodeWebjs === 'function' ? askToCodeWebjs : null,
        repeat: typeof repeatToCodeWebjs === 'function' ? repeatToCodeWebjs : null,
        while: typeof whileToCodeWebjs === 'function' ? whileToCodeWebjs : null,
        if: typeof ifToCodeWebjs === 'function' ? ifToCodeWebjs : null,
        forever: typeof foreverToCodeWebjs === 'function' ? foreverToCodeWebjs : null,
        listCreate: typeof listCreateToCodeWebjs === 'function' ? listCreateToCodeWebjs : null,
        listAdd: typeof listAddToCodeWebjs === 'function' ? listAddToCodeWebjs : null,
        listGet: typeof listGetToCodeWebjs === 'function' ? listGetToCodeWebjs : null,
        listLength: typeof listLengthToCodeWebjs === 'function' ? listLengthToCodeWebjs : null,
        functionDef: typeof functionDefToCodeWebjs === 'function' ? functionDefToCodeWebjs : null,
        functionCall: typeof functionCallToCodeWebjs === 'function' ? functionCallToCodeWebjs : null,
        return: typeof returnToCodeWebjs === 'function' ? returnToCodeWebjs : null
    },
    nodejs: {
        assign: typeof assignToCodeNodejs === 'function' ? assignToCodeNodejs : null,
        say: typeof sayToCodeNodejs === 'function' ? sayToCodeNodejs : null,
        ask: typeof askToCodeNodejs === 'function' ? askToCodeNodejs : null,
        repeat: typeof repeatToCodeNodejs === 'function' ? repeatToCodeNodejs : null,
        while: typeof whileToCodeNodejs === 'function' ? whileToCodeNodejs : null,
        if: typeof ifToCodeNodejs === 'function' ? ifToCodeNodejs : null,
        forever: typeof foreverToCodeNodejs === 'function' ? foreverToCodeNodejs : null,
        listCreate: typeof listCreateToCodeNodejs === 'function' ? listCreateToCodeNodejs : null,
        listAdd: typeof listAddToCodeNodejs === 'function' ? listAddToCodeNodejs : null,
        listGet: typeof listGetToCodeNodejs === 'function' ? listGetToCodeNodejs : null,
        listLength: typeof listLengthToCodeNodejs === 'function' ? listLengthToCodeNodejs : null,
        functionDef: typeof functionDefToCodeNodejs === 'function' ? functionDefToCodeNodejs : null,
        functionCall: typeof functionCallToCodeNodejs === 'function' ? functionCallToCodeNodejs : null,
        return: typeof returnToCodeNodejs === 'function' ? returnToCodeNodejs : null
    },
    python: {
        assign: typeof assignToCodePython === 'function' ? assignToCodePython : null,
        say: typeof sayToCodePython === 'function' ? sayToCodePython : null,
        ask: typeof askToCodePython === 'function' ? askToCodePython : null,
        repeat: typeof repeatToCodePython === 'function' ? repeatToCodePython : null,
        while: typeof whileToCodePython === 'function' ? whileToCodePython : null,
        if: typeof ifToCodePython === 'function' ? ifToCodePython : null,
        forever: typeof foreverToCodePython === 'function' ? foreverToCodePython : null,
        listCreate: typeof listCreateToCodePython === 'function' ? listCreateToCodePython : null,
        listAdd: typeof listAddToCodePython === 'function' ? listAddToCodePython : null,
        listGet: typeof listGetToCodePython === 'function' ? listGetToCodePython : null,
        listLength: typeof listLengthToCodePython === 'function' ? listLengthToCodePython : null,
        functionDef: typeof functionDefToCodePython === 'function' ? functionDefToCodePython : null,
        functionCall: typeof functionCallToCodePython === 'function' ? functionCallToCodePython : null,
        return: typeof returnToCodePython === 'function' ? returnToCodePython : null
    }
};

// ================== FUNCIÓN GLOBAL DE GENERACIÓN DE BLOQUES ==================
function generateBlockCode(ctx, block, lang, indent) {
    const gen = GENERADORES[lang];
    if (!gen) return '';
    const func = gen[block.type];
    if (!func) return '';
    return func(ctx, block, indent);
}

// ================== GENERACIÓN DE CÓDIGO PRINCIPAL ==================
function generateCode(ctx, blockList, lang) {
    const checkbox = document.getElementById('chkHashbang');
    const withHashbang = checkbox ? checkbox.checked : true;
    let code = '';
    const hashbang = getHashbang(lang);
    if (withHashbang && hashbang) {
        code += hashbang + '\n';
    }

    // Resetear variables declaradas para webJS y nodeJS
    if (lang === 'webjs' || lang === 'nodejs') {
        ctx._declaredWebJS = new Set();
    }

    // Caso especial para C: usar generateCodeC (genera programa completo)
    if (lang === 'c' && typeof generateCodeC === 'function') {
        return generateCodeC(ctx, blockList);
    }

    // Caso especial para C++: usar generateCodeCpp (genera programa completo)
    if (lang === 'cpp' && typeof generateCodeCpp === 'function') {
        return generateCodeCpp(ctx, blockList);
    }

    // Para Batch: separar funciones y código principal
    if (lang === 'batch') {
        let mainBlocks = [];
        let functionBlocks = [];
        for (const block of blockList) {
            if (block.type === 'functionDef') {
                functionBlocks.push(block);
            } else {
                mainBlocks.push(block);
            }
        }

        code += 'goto :main\n\n';
        code += ':main\n';
        for (const block of mainBlocks) {
            code += generateBlockCode(ctx, block, lang, 0) + '\n';
        }
        code += '\n';
        code += 'exit /b\n\n';
        for (const block of functionBlocks) {
            code += generateBlockCode(ctx, block, lang, 0) + '\n';
        }
    } else {
        for (const block of blockList) {
            code += generateBlockCode(ctx, block, lang, 0) + '\n';
        }
    }

    code = code.trimEnd() + '\n';
    return code;
}

// ================== HASHBANG ==================
function getHashbang(lang) {
    switch (lang) {
        case 'bash': return '#!/bin/bash';
        case 'batch': return '@echo off\r\nchcp 65001 >nul\r\nsetlocal disabledelayedexpansion';
        case 'python': return '#!/usr/bin/env python3';
        case 'nodejs': return '#!/usr/bin/env node';
        default: return '';
    }
}


// --- INICIO DE: converter.js ---
// ============================================================
// converter.js
// ============================================================

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

function actualizarHashbang() {
    const ctx = window._ctx;
    if (!ctx) return;
    if (!ctx.blocks) return;

    const languages = ['bash', 'batch', 'c', 'cpp', 'webjs', 'nodejs', 'python'];
    const checkbox = document.getElementById('chkHashbang');
    const withHashbang = checkbox ? checkbox.checked : true;

    ctx.generatedCode = {};
    ctx.generationWarnings = {}; // Limpiar advertencias

    for (const lang of languages) {
        if (ctx.blocks.length === 0) {
            ctx.generatedCode[lang] = '';
        } else {
            ctx.generatedCode[lang] = generateCode(ctx, ctx.blocks, lang);
        }
    }

    const currentLang = getCurrentSelectedLanguage();
    setCodeArea(ctx.generatedCode[currentLang] || '');
}

function quitarHashbang(code, lang) {
    if (!code) return code;
    const lines = code.split('\n');
    const hashbangs = {
        bash: '#!/bin/bash',
        python: '#!/usr/bin/env python3',
        nodejs: '#!/usr/bin/env node',
        batch: '@echo off'
    };
    const hash = hashbangs[lang];
    if (hash && lines.length > 0 && lines[0].trim() === hash) {
        lines.shift();
    }
    return lines.join('\n');
}

async function internalConvertScratchToCode(ctx) {
    if (ctx.isConverting) return;
    ctx.isConverting = true;

    const languages = ['bash', 'batch', 'c', 'cpp', 'webjs', 'nodejs', 'python'];
    if (!ctx.generatedCode) ctx.generatedCode = {};
    if (!ctx.conversionStatus) ctx.conversionStatus = {};

    // Limpiar advertencias
    ctx.generationWarnings = {};

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

            // Verificar si hubo advertencias para este lenguaje
            const warnings = ctx.generationWarnings[lang] || [];
            const hasWarnings = warnings.length > 0;

            if (hasWarnings) {
                ctx.conversionStatus[lang] = false;
                updateStatusIcon(ctx, lang, false);
            } else {
                ctx.conversionStatus[lang] = true;
                updateStatusIcon(ctx, lang, true);
            }
        } catch (error) {
            ctx.generatedCode[lang] = '';
            ctx.conversionStatus[lang] = false;
            updateStatusIcon(ctx, lang, false);
            console.error(`Error generando código para ${lang}:`, error);
        }
        await new Promise(resolve => setTimeout(resolve, 20));
    }

    // Mostrar advertencias acumuladas
    let allWarnings = [];
    for (const lang of languages) {
        const warnings = ctx.generationWarnings[lang] || [];
        if (warnings.length > 0) {
            allWarnings.push(`${lang}: ${warnings.join(', ')}`);
        }
    }

    if (allWarnings.length > 0) {
        const warningsText = 'Advertencias: ' + allWarnings.join('; ');
        mostrarMensaje(ctx, warningsText, true);
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
    let code = getCodeAreaText();

    code = quitarHashbang(code, lang);

    let newBlocks;
    try {
        newBlocks = parseCodeToBlocks(ctx, code, lang);
    } catch (e) {
        mostrarMensaje(ctx, 'Error al parsear el código: ' + e.message, true);
        return;
    }

    if (!newBlocks || newBlocks.length === 0) {
        mostrarMensaje(ctx, 'No se pudo reconocer el código. Revisa que sea válido para el lenguaje seleccionado.', true);
        return;
    }

    ctx.blocks = newBlocks;
    ctx.generatedCode = {};
    ctx.conversionStatus = {};
    ctx.generationWarnings = {};

    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        const span = btn.querySelector('.status-icon');
        if (span) span.remove();
    });

    internalRenderProgram(ctx);
    mostrarMensaje(ctx, 'Programa convertido a bloques Scratch.');
}


// --- INICIO DE: ejecucion_de_funciones.js ---
// ============================================================
// ejecucion_de_funciones.js
// Generado automáticamente por dividir.js
// ============================================================

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



// --- INICIO DE: ejecucion_principal.js ---
// ============================================================
// ejecucion_principal.js
// Generado automáticamente por dividir.js
// ============================================================

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



// --- INICIO DE: entrada_en_consola.js ---
// ============================================================
// entrada_en_consola.js
// Generado automáticamente por dividir.js
// ============================================================

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



// --- INICIO DE: evaluacion_de_expresiones.js ---
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


// --- INICIO DE: excepcion_de_retorno.js ---
// ============================================================
// excepcion_de_retorno.js
// Generado automáticamente por dividir.js
// ============================================================

// ================== EXCEPCIÓN DE RETORNO ==================
function ReturnSignal(value) {
    this.returnValue = value;
}



// --- INICIO DE: funciones_auxiliares_internas.js ---
// ============================================================
// funciones_auxiliares_internas.js
// Generado automáticamente por dividir.js
// ============================================================

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



// --- INICIO DE: funciones_globales.js ---
// ============================================================
// funciones_globales.js
// ============================================================

// ================== FUNCIONES GLOBALES PARA WINDOW ==================
function windowAddBlockToParent(type, parentPath) {
    internalAddBlockToParent(window._ctx, type, parentPath);
}

function windowAddBlockToContainer(containerPath, type) {
    internalAddBlockToContainer(window._ctx, containerPath, type);
}

function windowUpdateBlockByPath(path, key, value) {
    internalUpdateBlockByPath(window._ctx, path, key, value);
}

function windowMoveBlockByPath(path, direction) {
    internalMoveBlockByPath(window._ctx, path, direction);
}

function windowDeleteBlockByPath(path) {
    internalDeleteBlockByPath(window._ctx, path);
}

function windowRunProgram() {
    internalRunProgram(window._ctx);
}

function windowSaveProgram() {
    internalSaveProgram(window._ctx);
}

function windowLoadProgram(event) {
    internalLoadProgram(window._ctx, event);
}

function windowClearOutput() {
    internalClearOutput(window._ctx);
}

function windowClearScratch() {
    internalClearScratch(window._ctx);
}

function windowConvertScratchToCode() {
    internalConvertScratchToCode(window._ctx);
}

function windowConvertCodeToScratch() {
    internalConvertCodeToScratch(window._ctx);
}

// ================== ACTUALIZAR NOTA DE COMPILACIÓN ==================
function actualizarCompileHint(lang) {
    const hint = document.getElementById('compileHint');
    if (!hint) return;

    const comandos = {
        bash: '<code>bash ejemplo.sh</code>',
        batch: '<code>ejemplo.bat</code>',
        c: '<code>gcc ejemplo.c -o ejemplo</code>',
        cpp: '<code>g++ ejemplo.cpp -o ejemplo</code>',
        webjs: '<code>abrir en navegador</code>',
        nodejs: '<code>node ejemplo.js</code>',
        python: '<code>python3 ejemplo.py</code>'
    };

    hint.innerHTML = 'Compila con: ' + (comandos[lang] || '');
}

// ================== CARGA DE EJEMPLO ==================
function cargarEjemplo() {
    if (!window._ctx) return;
    inicializarBloquesEjemplo();

    window._ctx.generatedCode = {};
    window._ctx.conversionStatus = {};

    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        const span = btn.querySelector('.status-icon');
        if (span) span.remove();
    });

    internalClearOutput(window._ctx);
    mostrarMensaje(window._ctx, 'Programa de ejemplo cargado.');
    internalRenderProgram(window._ctx);
}

// ================== LIMPIAR CÓDIGO DEL CONVERSOR ==================
function limpiarCodigo() {
    const codeArea = document.getElementById('codeArea');
    if (codeArea) codeArea.value = '';
    if (window._ctx) {
        window._ctx.generatedCode = {};
        window._ctx.conversionStatus = {};
    }
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        const span = btn.querySelector('.status-icon');
        if (span) span.remove();
    });
    if (typeof mostrarMensaje === 'function') {
        mostrarMensaje(window._ctx, 'Código del conversor limpiado.');
    }
}

// ================== MANEJO DE PESTAÑAS ==================
function handleTabClick(event) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    const lang = event.currentTarget.dataset.lang;
    if (window._ctx.generatedCode && window._ctx.generatedCode[lang]) {
        setCodeArea(window._ctx.generatedCode[lang]);
    } else {
        setCodeArea('');
    }
    // Actualizar la nota de compilación según el lenguaje
    actualizarCompileHint(lang);
}


// --- INICIO DE: generacion_bash.js ---
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


// --- INICIO DE: generacion_batch.js ---
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


// --- INICIO DE: generacion_c.js ---
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


// --- INICIO DE: generacion_cpp.js ---
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


// --- INICIO DE: generacion_nodejs.js ---
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


// --- INICIO DE: generacion_python.js ---
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


// --- INICIO DE: generacion_webjs.js ---
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


// --- INICIO DE: guardar_y_cargar.js ---
// ============================================================
// guardar_y_cargar.js
// Generado automáticamente por dividir.js
// ============================================================

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



// --- INICIO DE: inicializacion_ejemplo.js ---
// ============================================================
// inicializacion_ejemplo.js
// ============================================================

function inicializarBloquesEjemplo() {
    const ctx = window._ctx;
    ctx.blocks = [];

    // Asignar veces
    const assignBlock = createBlock(ctx, 'assign');
    assignBlock.varName = 'veces';
    assignBlock.value = '1';
    ctx.blocks.push(assignBlock);

    // Preguntar nombre
    const askBlock = createBlock(ctx, 'ask');
    askBlock.question = "''";
    askBlock.varName = 'nombre';
    ctx.blocks.push(askBlock);

    // Decir hola
    const sayHello = createBlock(ctx, 'say');
    sayHello.text = "'¡Hola ' + nombre + '!'";
    ctx.blocks.push(sayHello);

    // Función sumar
    const functionDef = createBlock(ctx, 'functionDef');
    functionDef.name = 'sumar';
    functionDef.params = 'a, b';
    const returnInsideFunc = createBlock(ctx, 'return');
    returnInsideFunc.value = 'a + b';
    functionDef.children.push(returnInsideFunc);
    ctx.blocks.push(functionDef);

    // Llamar a sumar
    const functionCall = createBlock(ctx, 'functionCall');
    functionCall.name = 'sumar';
    functionCall.args = '3, 4';
    functionCall.target = 'resultado';
    ctx.blocks.push(functionCall);

    // Decir resultado
    const sayResult = createBlock(ctx, 'say');
    sayResult.text = "'El resultado es ' + resultado";
    ctx.blocks.push(sayResult);

    // Lista numeros
    const listCreate = createBlock(ctx, 'listCreate');
    listCreate.varName = 'numeros';
    listCreate.value = '[1, 2, 3]';
    ctx.blocks.push(listCreate);

    // Añadir a la lista
    const listAdd = createBlock(ctx, 'listAdd');
    listAdd.varName = 'numeros';
    listAdd.value = '4';
    ctx.blocks.push(listAdd);

    // Longitud de la lista
    const listLength = createBlock(ctx, 'listLength');
    listLength.varName = 'numeros';
    listLength.target = 'longitud';
    ctx.blocks.push(listLength);

    // Decir longitud
    const sayLength = createBlock(ctx, 'say');
    sayLength.text = "'La lista tiene ' + longitud + ' elementos'";
    ctx.blocks.push(sayLength);

    // Inicializar contador (IMPORTANTE para que el bucle funcione)
    const contadorInit = createBlock(ctx, 'assign');
    contadorInit.varName = 'contador';
    contadorInit.value = '0';
    ctx.blocks.push(contadorInit);

    // Bucle mientras
    const whileBlock = createBlock(ctx, 'while');
    whileBlock.condition = 'contador < 3';
    const incBlock = createBlock(ctx, 'assign');
    incBlock.varName = 'contador';
    incBlock.value = 'contador + 1';
    whileBlock.children.push(incBlock);
    const sayInsideWhile = createBlock(ctx, 'say');
    sayInsideWhile.text = "'contador es ' + contador";
    whileBlock.children.push(sayInsideWhile);
    ctx.blocks.push(whileBlock);

    // Si contador === 3
    const ifBlock = createBlock(ctx, 'if');
    ifBlock.condition = 'contador === 3';
    const sayInsideIf = createBlock(ctx, 'say');
    sayInsideIf.text = "'El contador llegó a 3!'";
    ifBlock.children.push(sayInsideIf);
    ctx.blocks.push(ifBlock);
}


// --- INICIO DE: limpiar_scratch.js ---
// ============================================================
// limpiar_scratch.js
// Generado automáticamente por dividir.js
// ============================================================

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



// --- INICIO DE: mensajes_en_consola.js ---
// ============================================================
// mensajes_en_consola.js
// ============================================================

function mostrarMensaje(ctx, texto, esError = false) {
    const outputDiv = document.getElementById('outputArea');
    if (!outputDiv) {
        console.log(texto);
        return;
    }

    const div = document.createElement('div');
    div.className = 'output-msg';

    // Forzar color según el tipo de mensaje
    if (esError) {
        div.style.color = '#ff6b6b'; // rojo para errores/advertencias
    } else {
        div.style.color = '#6a9955'; // verde para info
    }

    div.textContent = texto;
    outputDiv.appendChild(div);
    outputDiv.scrollTop = outputDiv.scrollHeight;
}


// --- INICIO DE: parseo_de_codigo_a_scratch.js ---
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


// --- INICIO DE: recopilacion_de_funciones.js ---
// ============================================================
// recopilacion_de_funciones.js
// Generado automáticamente por dividir.js
// ============================================================

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



// --- INICIO DE: redimensionamiento.js ---
// ============================================================
// redimensionamiento.js
// ============================================================

// ================== REDIMENSIONAMIENTO DE COLUMNAS INTERNAS ==================
function obtenerAnchosColumnas(app) {
    const programArea = document.getElementById('programArea');
    const outputArea = document.getElementById('outputArea');
    const converterArea = document.getElementById('converterArea');

    if (!programArea || !outputArea || !converterArea) return [1, 1, 1];

    const w1 = programArea.getBoundingClientRect().width;
    const w2 = outputArea.getBoundingClientRect().width;
    const w3 = converterArea.getBoundingClientRect().width;

    return [w1, w2, w3];
}

function initResizers(state) {
    const app = document.getElementById('app');
    if (!app) return;
    app._resizerState = state;

    const resizer1 = document.getElementById('resizer1');
    const resizer2 = document.getElementById('resizer2');
    const leftResizer = document.getElementById('left-resizer');
    const rightResizer = document.getElementById('right-resizer');

    if (resizer1) resizer1.addEventListener('mousedown', handleMouseDown);
    if (resizer2) resizer2.addEventListener('mousedown', handleMouseDown);
    if (leftResizer) leftResizer.addEventListener('mousedown', handleExternalResizerDown);
    if (rightResizer) rightResizer.addEventListener('mousedown', handleExternalResizerDown);
}

function handleMouseDown(event) {
    const app = document.getElementById('app');
    const state = app._resizerState;
    if (!state) return;

    state.activeResizer = event.currentTarget;
    state.startX = event.clientX;
    state.startWidths = obtenerAnchosColumnas(app);

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    state.activeResizer.classList.add('active');

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseMove(event) {
    const app = document.getElementById('app');
    const state = app._resizerState;
    if (!state || !state.activeResizer) return;

    const dx = event.clientX - state.startX;
    const minSize = 150;
    let newWidths = state.startWidths.slice();

    if (state.activeResizer.id === 'resizer1') {
        newWidths[0] = state.startWidths[0] + dx;
        newWidths[1] = state.startWidths[1] - dx;
    } else if (state.activeResizer.id === 'resizer2') {
        newWidths[1] = state.startWidths[1] + dx;
        newWidths[2] = state.startWidths[2] - dx;
    }

    for (let i = 0; i < 3; i++) {
        if (newWidths[i] < minSize) {
            const deficit = minSize - newWidths[i];
            newWidths[i] = minSize;
            if (i === 0) newWidths[1] -= deficit;
            else if (i === 1) {
                if (state.activeResizer.id === 'resizer1') newWidths[0] -= deficit;
                else newWidths[2] -= deficit;
            } else if (i === 2) newWidths[1] -= deficit;
        }
    }

    const total = newWidths[0] + newWidths[1] + newWidths[2];
    if (total <= 0) return;

    const frac1 = newWidths[0] / total;
    const frac2 = newWidths[1] / total;
    const frac3 = newWidths[2] / total;

    app.style.setProperty('--col1', frac1 + 'fr');
    app.style.setProperty('--col2', frac2 + 'fr');
    app.style.setProperty('--col3', frac3 + 'fr');
}

function handleExternalResizerDown(event) {
    const app = document.getElementById('app');
    if (!app) return;
    app._externalResizerState = {
        activeResizer: event.currentTarget,
        startX: event.clientX,
        startWidth: app.getBoundingClientRect().width
    };

    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
    event.currentTarget.classList.add('active');

    document.addEventListener('mousemove', handleExternalResizerMove);
    document.addEventListener('mouseup', handleExternalResizerUp);
}

function handleExternalResizerMove(event) {
    const app = document.getElementById('app');
    const state = app._externalResizerState;
    if (!state || !state.activeResizer) return;

    const dx = event.clientX - state.startX;
    let newWidth = state.startWidth;

    if (state.activeResizer.id === 'left-resizer') {
        newWidth = state.startWidth - dx; // arrastrar a la izquierda reduce el ancho
    } else if (state.activeResizer.id === 'right-resizer') {
        newWidth = state.startWidth + dx; // arrastrar a la derecha aumenta el ancho
    }

    // Limitamiento de ancho de pixeles
    newWidth = Math.max(600, Math.min(3000, newWidth));

    app.style.width = newWidth + 'px';
}

function handleExternalResizerUp() {
    const app = document.getElementById('app');
    const state = app._externalResizerState;
    if (!state || !state.activeResizer) return;

    state.activeResizer.classList.remove('active');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', handleExternalResizerMove);
    document.removeEventListener('mouseup', handleExternalResizerUp);
    state.activeResizer = null;
}

function handleMouseUp() {
    const app = document.getElementById('app');
    const state = app._resizerState;
    if (!state || !state.activeResizer) return;

    state.activeResizer.classList.remove('active');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    state.activeResizer = null;
}


// --- INICIO DE: renderizado.js ---
// ============================================================
// renderizado.js
// ============================================================

// ================== RENDERIZADO PRINCIPAL ==================
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
        const div = renderBlock(ctx, block, currentPath);
        container.appendChild(div);
    });
}

// ================== RENDERIZADO DE UN BLOQUE ==================
function renderBlock(ctx, block, currentPath) {
    const div = document.createElement('div');
    const classNames = getBlockClassNames(block);
    div.className = classNames.join(' ');
    div.draggable = true;
    div.dataset.path = currentPath.join(',');
    div.addEventListener('dragstart', (event) => handleDragStart(ctx, event));
    div.addEventListener('dragover', (event) => handleDragOverBlock(ctx, event));
    div.addEventListener('drop', (event) => handleDropOnBlock(ctx, event));
    div.addEventListener('dragend', (event) => handleDragEnd(ctx, event));

    // Botones de acción SIEMPRE como primer hijo del bloque
    div.appendChild(createActionButtons(currentPath));

    switch (block.type) {
        case 'say':
            buildSayBlock(div, block, currentPath);
            break;
        case 'assign':
            buildAssignBlock(div, block, currentPath);
            break;
        case 'repeat':
            buildRepeatBlock(div, block, currentPath);
            break;
        case 'while':
            buildWhileBlock(div, block, currentPath);
            break;
        case 'if':
            buildIfBlock(div, block, currentPath);
            break;
        case 'forever':
            buildForeverBlock(div, block, currentPath);
            break;
        case 'functionDef':
            buildFunctionDefBlock(div, block, currentPath);
            break;
        case 'ask':
            buildAskBlock(div, block, currentPath);
            break;
        case 'listCreate':
            buildListCreateBlock(div, block, currentPath);
            break;
        case 'listAdd':
            buildListAddBlock(div, block, currentPath);
            break;
        case 'listGet':
            buildListGetBlock(div, block, currentPath);
            break;
        case 'listLength':
            buildListLengthBlock(div, block, currentPath);
            break;
        case 'functionCall':
            buildFunctionCallBlock(div, block, currentPath);
            break;
        case 'return':
            buildReturnBlock(div, block, currentPath);
            break;
        default:
            const unknownLabel = document.createElement('span');
            unknownLabel.className = 'block-label';
            unknownLabel.textContent = 'Bloque desconocido';
            div.appendChild(unknownLabel);
    }

    // Renderizar hijos de bloques contenedores
    if (['repeat', 'while', 'if', 'forever', 'functionDef'].includes(block.type)) {
        const bodyDiv = div.querySelector('.repeat-body, .while-body, .if-body, .forever-body, .function-body');
        if (bodyDiv) {
            const children = block.children || [];
            renderNestedBlocks(ctx, bodyDiv, children, currentPath);
        }
    }

    return div;
}

// ================== CLASES DE BLOQUE ==================
function getBlockClassNames(block) {
    const classNames = ['block'];
    switch (block.type) {
        case 'assign': classNames.push('block-assign'); break;
        case 'repeat': classNames.push('block-repeat'); break;
        case 'while': classNames.push('block-while'); break;
        case 'if': classNames.push('block-if'); break;
        case 'forever': classNames.push('block-forever'); break;
        case 'ask': classNames.push('block-ask'); break;
        case 'listCreate': case 'listAdd': case 'listGet': case 'listLength':
            classNames.push('block-list'); break;
        case 'functionDef': case 'functionCall': classNames.push('block-function'); break;
        case 'return': classNames.push('block-return'); break;
        default: break;
    }
    return classNames;
}

// ================== BOTONES DE ACCIÓN ==================
function createActionButtons(currentPath) {
    const buttons = document.createElement('div');
    buttons.className = 'block-actions';

    const upBtn = document.createElement('button');
    upBtn.title = 'Subir';
    upBtn.textContent = '↑';
    upBtn.onclick = () => moveBlockByPath(currentPath, -1);

    const downBtn = document.createElement('button');
    downBtn.title = 'Bajar';
    downBtn.textContent = '↓';
    downBtn.onclick = () => moveBlockByPath(currentPath, 1);

    const deleteBtn = document.createElement('button');
    deleteBtn.title = 'Eliminar';
    deleteBtn.textContent = '✖';
    deleteBtn.onclick = () => deleteBlockByPath(currentPath);

    buttons.appendChild(upBtn);
    buttons.appendChild(downBtn);
    buttons.appendChild(deleteBtn);

    return buttons;
}

// ================== BOTONES PARA AÑADIR BLOQUES ==================
function createAddButtons(currentPath) {
    const addContainer = document.createElement('div');
    addContainer.className = 'add-inside';

    const addBlockTypes = [
        { type: 'say', label: 'Decir' },
        { type: 'assign', label: 'Asignar' },
        { type: 'repeat', label: 'Repetir' },
        { type: 'while', label: 'Mientras' },
        { type: 'if', label: 'Si' },
        { type: 'forever', label: 'Siempre' },
        { type: 'ask', label: 'Preguntar' },
        { type: 'listCreate', label: 'Crear lista' },
        { type: 'listAdd', label: 'Añadir' },
        { type: 'listGet', label: 'Obtener' },
        { type: 'listLength', label: 'Longitud' },
        { type: 'functionDef', label: 'Función' },
        { type: 'functionCall', label: 'Llamar función' },
        { type: 'return', label: 'Retornar' }
    ];

    addBlockTypes.forEach(({ type, label }) => {
        const btn = document.createElement('button');
        btn.textContent = `➕ ${label}`;
        btn.onclick = () => addBlockToContainer(currentPath, type);
        addContainer.appendChild(btn);
    });

    return addContainer;
}

// ================== RENDERIZADO DE BLOQUES ANIDADOS ==================
function renderNestedBlocks(ctx, bodyDiv, children, parentPath) {
    const nestedList = document.createElement('div');
    nestedList.className = 'nested-list';
    nestedList.dataset.listPath = parentPath.join(',');
    nestedList.ondragover = handleDragOverList;
    nestedList.ondrop = handleDropOnList;
    bodyDiv.appendChild(nestedList);

    renderBlockList(ctx, nestedList, children, parentPath);
}

// ================== FUNCIONES AUXILIARES ==================
function createInput(value, placeholder, onchange) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = (typeof value === 'string') ? value : '';
    input.placeholder = placeholder || '';
    input.onchange = onchange;
    return input;
}

function createLabel(text) {
    const span = document.createElement('span');
    span.className = 'block-label';
    span.textContent = text;
    return span;
}

// ================== CONSTRUCTORES DE BLOQUES ==================

// ----- SAY -----
function buildSayBlock(div, block, currentPath) {
    div.appendChild(createLabel('💬 decir'));
    div.appendChild(createInput(block.text, 'Expresión JS', (e) => {
        updateBlockByPath(currentPath, 'text', e.target.value);
    }));
}

// ----- ASSIGN -----
function buildAssignBlock(div, block, currentPath) {
    div.appendChild(createLabel('📦 asignar'));
    div.appendChild(createInput(block.varName, 'Variable', (e) => {
        updateBlockByPath(currentPath, 'varName', e.target.value);
    }));
    const eqSpan = document.createElement('span');
    eqSpan.textContent = '=';
    div.appendChild(eqSpan);
    div.appendChild(createInput(block.value, 'Expresión JS', (e) => {
        updateBlockByPath(currentPath, 'value', e.target.value);
    }));
}

// ----- REPEAT -----
function buildRepeatBlock(div, block, currentPath) {
    const header = document.createElement('div');
    header.className = 'repeat-header';
    header.appendChild(createLabel('🔁 repetir'));
    header.appendChild(createInput(block.times, 'Número o expresión', (e) => {
        updateBlockByPath(currentPath, 'times', e.target.value);
    }));
    const vecesSpan = document.createElement('span');
    vecesSpan.textContent = 'veces';
    header.appendChild(vecesSpan);
    div.appendChild(header);

    const body = document.createElement('div');
    body.className = 'repeat-body';
    div.appendChild(body);

    div.appendChild(createAddButtons(currentPath));
}

// ----- WHILE -----
function buildWhileBlock(div, block, currentPath) {
    const header = document.createElement('div');
    header.className = 'while-header';
    header.appendChild(createLabel('🔁 mientras'));
    header.appendChild(createInput(block.condition, 'Condición JS', (e) => {
        updateBlockByPath(currentPath, 'condition', e.target.value);
    }));
    const hacerSpan = document.createElement('span');
    hacerSpan.textContent = 'hacer';
    header.appendChild(hacerSpan);
    div.appendChild(header);

    const body = document.createElement('div');
    body.className = 'while-body';
    div.appendChild(body);

    div.appendChild(createAddButtons(currentPath));
}

// ----- IF -----
function buildIfBlock(div, block, currentPath) {
    const header = document.createElement('div');
    header.className = 'if-header';
    header.appendChild(createLabel('🔀 si'));
    header.appendChild(createInput(block.condition, 'Condición JS', (e) => {
        updateBlockByPath(currentPath, 'condition', e.target.value);
    }));
    const entoncesSpan = document.createElement('span');
    entoncesSpan.textContent = 'entonces';
    header.appendChild(entoncesSpan);
    div.appendChild(header);

    const body = document.createElement('div');
    body.className = 'if-body';
    div.appendChild(body);

    div.appendChild(createAddButtons(currentPath));
}

// ----- FOREVER -----
function buildForeverBlock(div, block, currentPath) {
    const header = document.createElement('div');
    header.className = 'forever-header';
    header.appendChild(createLabel('🔁 siempre'));
    const fpsSpan = document.createElement('span');
    fpsSpan.textContent = 'repetir a 60 FPS';
    header.appendChild(fpsSpan);
    div.appendChild(header);

    const body = document.createElement('div');
    body.className = 'forever-body';
    div.appendChild(body);

    div.appendChild(createAddButtons(currentPath));
}

// ----- FUNCTION DEFINITION -----
function buildFunctionDefBlock(div, block, currentPath) {
    const header = document.createElement('div');
    header.className = 'function-header';
    header.appendChild(createLabel('🔧 función'));
    header.appendChild(createInput(block.name, 'Nombre de función', (e) => {
        updateBlockByPath(currentPath, 'name', e.target.value);
    }));
    const paramsLabel = document.createElement('span');
    paramsLabel.textContent = 'parámetros:';
    header.appendChild(paramsLabel);
    header.appendChild(createInput(block.params, 'a, b, c', (e) => {
        updateBlockByPath(currentPath, 'params', e.target.value);
    }));
    div.appendChild(header);

    const body = document.createElement('div');
    body.className = 'function-body';
    div.appendChild(body);

    div.appendChild(createAddButtons(currentPath));
}

// ----- ASK -----
function buildAskBlock(div, block, currentPath) {
    const header = document.createElement('div');
    header.className = 'ask-header';
    header.appendChild(createLabel('❓ preguntar'));
    const yGuardarSpan = document.createElement('span');
    yGuardarSpan.textContent = 'y guardar en';
    header.appendChild(yGuardarSpan);
    header.appendChild(createInput(block.varName, 'Variable', (e) => {
        updateBlockByPath(currentPath, 'varName', e.target.value);
    }));
    div.appendChild(header);
}

// ----- LIST CREATE -----
function buildListCreateBlock(div, block, currentPath) {
    div.appendChild(createLabel('📋 crear lista'));
    div.appendChild(createInput(block.varName, 'Variable', (e) => {
        updateBlockByPath(currentPath, 'varName', e.target.value);
    }));
    const eqSpan = document.createElement('span');
    eqSpan.textContent = '=';
    div.appendChild(eqSpan);
    div.appendChild(createInput(block.value, 'Expresión JS (ej. [1,2,3])', (e) => {
        updateBlockByPath(currentPath, 'value', e.target.value);
    }));
}

// ----- LIST ADD -----
function buildListAddBlock(div, block, currentPath) {
    div.appendChild(createLabel('➕ añadir a'));
    div.appendChild(createInput(block.varName, 'Variable (array)', (e) => {
        updateBlockByPath(currentPath, 'varName', e.target.value);
    }));
    const elValorSpan = document.createElement('span');
    elValorSpan.textContent = 'el valor';
    div.appendChild(elValorSpan);
    div.appendChild(createInput(block.value, 'Expresión JS', (e) => {
        updateBlockByPath(currentPath, 'value', e.target.value);
    }));
}

// ----- LIST GET -----
function buildListGetBlock(div, block, currentPath) {
    div.appendChild(createLabel('🔍 obtener'));
    div.appendChild(createInput(block.varName, 'Variable (array)', (e) => {
        updateBlockByPath(currentPath, 'varName', e.target.value);
    }));
    const enIndiceSpan = document.createElement('span');
    enIndiceSpan.textContent = 'en índice';
    div.appendChild(enIndiceSpan);
    div.appendChild(createInput(block.index, 'Expresión numérica', (e) => {
        updateBlockByPath(currentPath, 'index', e.target.value);
    }));
    const guardarEnSpan = document.createElement('span');
    guardarEnSpan.textContent = 'guardar en';
    div.appendChild(guardarEnSpan);
    div.appendChild(createInput(block.target, 'Variable destino (opcional)', (e) => {
        updateBlockByPath(currentPath, 'target', e.target.value);
    }));
}

// ----- LIST LENGTH -----
function buildListLengthBlock(div, block, currentPath) {
    div.appendChild(createLabel('📏 longitud de'));
    div.appendChild(createInput(block.varName, 'Variable (array)', (e) => {
        updateBlockByPath(currentPath, 'varName', e.target.value);
    }));
    const guardarEnSpan = document.createElement('span');
    guardarEnSpan.textContent = 'guardar en';
    div.appendChild(guardarEnSpan);
    div.appendChild(createInput(block.target, 'Variable destino (opcional)', (e) => {
        updateBlockByPath(currentPath, 'target', e.target.value);
    }));
}

// ----- FUNCTION CALL -----
function buildFunctionCallBlock(div, block, currentPath) {
    div.appendChild(createLabel('📞 llamar función'));
    div.appendChild(createInput(block.name, 'Nombre de función', (e) => {
        updateBlockByPath(currentPath, 'name', e.target.value);
    }));
    const conArgsSpan = document.createElement('span');
    conArgsSpan.textContent = 'con argumentos:';
    div.appendChild(conArgsSpan);
    div.appendChild(createInput(block.args, 'exp1, exp2, ...', (e) => {
        updateBlockByPath(currentPath, 'args', e.target.value);
    }));
    const guardarEnSpan = document.createElement('span');
    guardarEnSpan.textContent = 'guardar en';
    div.appendChild(guardarEnSpan);
    div.appendChild(createInput(block.target, 'Variable (opcional)', (e) => {
        updateBlockByPath(currentPath, 'target', e.target.value);
    }));
}

// ----- RETURN -----
function buildReturnBlock(div, block, currentPath) {
    div.appendChild(createLabel('↩️ retornar'));
    div.appendChild(createInput(block.value, 'Expresión JS', (e) => {
        updateBlockByPath(currentPath, 'value', e.target.value);
    }));
}


// ============================================================
// ARCHIVO FINAL (Contiene la función programa): programa.js
// ============================================================
// ============================================================
// programa.js
// ============================================================

function programa() {
    // Contexto como propiedad de window
    window._ctx = {
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
    window.addBlockToParent = windowAddBlockToParent;
    window.addBlockToContainer = windowAddBlockToContainer;
    window.updateBlockByPath = windowUpdateBlockByPath;
    window.moveBlockByPath = windowMoveBlockByPath;
    window.deleteBlockByPath = windowDeleteBlockByPath;
    window.runProgram = windowRunProgram;
    window.saveProgram = windowSaveProgram;
    window.loadProgram = windowLoadProgram;
    window.clearOutput = windowClearOutput;
    window.clearScratch = windowClearScratch;
    window.convertScratchToCode = windowConvertScratchToCode;
    window.convertCodeToScratch = windowConvertCodeToScratch;
    window.cargarEjemplo = cargarEjemplo;
    window.limpiarCodigo = limpiarCodigo;

    // Manejo de pestañas
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', handleTabClick);
    });

    // Inicializar bloques de ejemplo
    inicializarBloquesEjemplo();

    // Mostrar nota de compilación inicial (Bash)
    actualizarCompileHint('bash');

    // Inicializar redimensionamiento
    const resizerState = { activeResizer: null, startX: 0, startWidths: [1, 1, 1] };
    initResizers(resizerState);

    // Renderizar
    internalRenderProgram(window._ctx);
}


// ============================================================
// LLAMADA INICIAL
// ============================================================
if (typeof programa === 'function') {
    programa();
} else {
    console.error('La función programa() no está definida.');
}
