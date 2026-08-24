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

