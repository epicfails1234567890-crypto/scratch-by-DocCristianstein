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

