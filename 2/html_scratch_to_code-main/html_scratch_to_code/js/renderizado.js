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
