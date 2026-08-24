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
