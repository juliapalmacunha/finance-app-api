import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'

export default defineConfig([
    js.configs.recommended,
    prettier,
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        plugins: {
            import: importPlugin,
        },
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        rules: {
            // Exige .js APENAS em imports relativos do seu código, ignorando pacotes do npm
            'import/extensions': ['error', 'ignorePackages', { js: 'always' }],
        },
    },
])
