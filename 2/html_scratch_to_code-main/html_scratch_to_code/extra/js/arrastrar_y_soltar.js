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

