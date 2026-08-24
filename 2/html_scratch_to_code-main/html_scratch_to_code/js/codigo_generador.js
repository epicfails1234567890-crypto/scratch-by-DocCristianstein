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
