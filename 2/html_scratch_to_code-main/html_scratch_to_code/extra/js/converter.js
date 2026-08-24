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
