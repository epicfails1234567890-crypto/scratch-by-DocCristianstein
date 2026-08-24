// ================== CARGA DINÁMICA DE SCRIPTS ==================
async function cargar_scripts() {
    const scripts = [
        'js/funciones_globales.js',
        'js/inicializacion_ejemplo.js',
        'js/redimensionamiento.js',
        'js/generacion_bash.js',
        'js/generacion_batch.js',
        'js/generacion_c.js',
        'js/generacion_cpp.js',
        'js/generacion_webjs.js',
        'js/generacion_nodejs.js',
        'js/generacion_python.js',
        'js/codigo_generador.js',
        'js/converter.js',
        'js/parseo_de_codigo_a_scratch.js',
        'js/excepcion_de_retorno.js',
        'js/funciones_auxiliares_internas.js',
        'js/mensajes_en_consola.js',
        'js/renderizado.js',
        'js/arrastrar_y_soltar.js',
        'js/evaluacion_de_expresiones.js',
        'js/entrada_en_consola.js',
        'js/recopilacion_de_funciones.js',
        'js/ejecucion_de_funciones.js',
        'js/ejecucion_principal.js',
        'js/limpiar_scratch.js',
        'js/guardar_y_cargar.js',
        'js/programa.js'
    ];

    for (const src of scripts) {
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Error al cargar ${src}`));
            document.head.appendChild(script);
        });
    }

    if (typeof programa === 'function') {
        programa();
    } else {
        console.error('La función programa() no está definida');
    }
}

cargar_scripts();
