/**

 * ESLint configuration for TypeScript files in the project.
 * This configuration uses typescript-eslint for TypeScript support,
 * extends the 'love' ESLint configuration, and includes stylistic rules.
 * Rules can be found here:
 * - https://eslint.org/docs/latest/rules/
 * - https://typescript-eslint.io/rules/
 * - https://eslint.style/rules
 */

import tseslint from 'typescript-eslint'
import love from 'eslint-config-love'
import stylistic from '@stylistic/eslint-plugin'
import jsdoc from 'eslint-plugin-jsdoc'

export default tseslint.config(
    // Global ignores
    {
        ignores: [
            '__mocks__/**',
            '**/*.js',  // Ignore all JS files (transpiled from TS)
            '**/*.mjs', // Ignore all MJS files (including this config)
            '**/*.d.ts',
            '**/*Test.spec.ts',
            '**/*.config.js',
            '**/*.rs',
            '**/*.toml',
            '**/*.config.ts'
        ]
    },
    {
        ...love,
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            '@stylistic': stylistic,
            '@typescript-eslint': tseslint.plugin,
            'jsdoc': jsdoc
        },
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                // prevents the @typescript-eslint/parser from displaying the big unsupported TS version warning.
                warnOnUnsupportedTypeScriptVersion: false
            }
        },
        settings: {
            jsdoc: {
                mode: 'typescript',
                skipInvokedExpressionsForCommentFinding: true
            }
        },
        rules: {
            // Custom overrides
            // we do not pollute code with return types because our IDE is great at showing it.
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/naming-convention': ['error',
                {
                    selector: 'variable',
                    format: ['camelCase'],
                    trailingUnderscore: 'allow'
                }],
            // NetSuite often blurs strings and numbers so allow for double equals even though we don't like it.
            'eqeqeq': 'off',
            // namespaces are ok in our guidelines
            '@typescript-eslint/no-namespace': 'off',
            // allow throwing things like native N/error.create(...)
            'no-throw-literal': 'off',
            // allow if (someobject) { ... } and treating nulls and empty strings as equal (since NS still spits
            // out '' instead of null in some cases, both meaning no value set.
            '@typescript-eslint/strict-boolean-expressions': ['error', {
                allowNullableObject: true,
                allowNullableString: true
            }],
            // this rule is borked https://github.com/typescript-eslint/typescript-eslint/issues/1824
            // it forces unwanted indentation on our RecordType class property decorators
            'prefer-const': ['error', {
                'destructuring': 'any',
                'ignoreReadBeforeAssign': true
            }],
            '@stylistic/function-call-spacing': ['error', 'never'],
            '@stylistic/space-before-function-paren': ['error', 'always'],
            '@stylistic/space-in-parens': ['error', 'never'],
            '@stylistic/no-multiple-empty-lines': ['error', {'max': 1, 'maxEOF': 0}],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/arrow-parens': ['error', 'always'],
            '@stylistic/padded-blocks': ['error', 'never'],
            '@stylistic/comma-dangle': ['error', 'never'],
            '@stylistic/quote-props': ['error', 'consistent-as-needed'],
            '@stylistic/brace-style': ['error', '1tbs'],
            '@stylistic/semi': ['error', 'never'],
            '@stylistic/indent': ['error', 4],
            '@stylistic/linebreak-style': ['error', 'unix'],
            '@stylistic/object-curly-newline': ['error', {
                multiline: true,
                consistent: true,

            }],
            '@stylistic/max-len': ['error', {
                code: 150
            }],
            '@stylistic/curly-newline': ['error', {
                multiline: true,
                consistent: true
            }],
            // 'jsdoc/require-jsdoc': ['error', {
            //     checkAllFunctionExpressions: true,
            //     contexts: ['FunctionDeclaration', 'MethodDefinition', 'ClassDeclaration', 'TSDeclareFunction'],
            //     require: {
            //         FunctionExpression: true
            //     }
            // }],
            // 'jsdoc/require-description': ['error', {
            //     checkConstructors: true,
            //     checkGetters: true,
            //     checkSetters: true
            // }],
            // 'jsdoc/require-param': ['error', {
            //     checkGetters: true,
            //     checkSetters: true,
            //     enableFixer: true
            // }],
            // 'jsdoc/require-param-description': ['error', {
            //     contexts: ['any', 'comment']
            // }],
            // 'jsdoc/require-returns': ['error', {
            //     checkGetters: true,
            //     enableFixer: true
            // }],
            // 'jsdoc/require-returns-description': ['error', {
            //     contexts: ['any', 'comment']
            // }],
            // 'jsdoc/check-param-names': 'error',
        }
    }
);