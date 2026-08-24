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

