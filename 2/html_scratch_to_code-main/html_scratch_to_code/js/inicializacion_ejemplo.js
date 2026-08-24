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
