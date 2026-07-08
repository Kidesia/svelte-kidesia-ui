import { fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import storybook from 'eslint-plugin-storybook';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		plugins: {
			['import']: fixupPluginRules(importPlugin),
			['simple-import-sort']: simpleImportSort
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', '.pnpm-store/', 'storybook-static/']
	},
	{
		rules: {
			'no-console': ['error', { allow: ['warn', 'error'] }],
			'consistent-return': 'error',
			'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
			'@typescript-eslint/consistent-type-assertions': 'error',
			'@typescript-eslint/consistent-type-imports': 'error',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }
			],
			'@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
			'svelte/require-store-reactive-access': 'off',
			'svelte/prefer-svelte-reactivity': 'off',
			// Library links are plain hrefs the consuming app resolves.
			'svelte/no-navigation-without-resolve': 'off',
			'import/no-duplicates': 'error',
			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						['^\\u0000'],
						['^node:', '^@?\\w', '^\\$app', '^~icons'],
						['^\\$lib', '^\\$ui'],
						['^\\.']
					]
				}
			],
			'simple-import-sort/exports': 'error'
		}
	},
	...storybook.configs['flat/recommended']
];
