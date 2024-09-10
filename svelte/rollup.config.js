import { spawn } from 'child_process';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';  // Asegúrate de importar correctamente
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = spawn('npm', ['run', 'start', '--', '--dev'], {
                stdio: ['ignore', 'inherit', 'inherit'],
                shell: true
            });

            process.on('SIGTERM', toExit);
            process.on('exit', toExit);
        }
    };
}

export default {
    input: 'src/main.js',
    output: {
        sourcemap: !production,
        format: 'esm',
        dir: 'public/build',
        entryFileNames: 'bundle.js'
    },
    plugins: [
        svelte({
            compilerOptions: {
                dev: !production
            }
        }),
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),
        css({ output: 'bundle.css' }),
        !production && serve(),
        !production && livereload('public'),
        production && terser({
            output: {
                comments: false  // Eliminar comentarios
            },
            compress: {
                drop_console: true  // Elimina llamadas a console.*
            },
            mangle: {
                properties: {
                    regex: /^_/  // Ofuscar propiedades que empiezan con '_'
                }
            }
        })
    ],
    watch: {
        clearScreen: false
    }
};
