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
