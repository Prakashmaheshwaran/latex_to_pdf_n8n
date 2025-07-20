module.exports = {
	root: true,

	env: {
		browser: false,
		es6: true,
		node: true,
	},

	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
		sourceType: 'module',
		extraFileExtensions: ['.json'],
	},

	ignorePatterns: [
		'.eslintrc.js',
		'**/*.js',
		'**/node_modules/**',
		'**/dist/**',
	],

	overrides: [
		{
			files: ['**/*.ts'],
			plugins: [
				'@typescript-eslint',
			],
			extends: [
				'plugin:n8n-nodes-base/nodes',
				'@n8n/eslint-config/node',
			],
			rules: {
				'@typescript-eslint/no-unused-vars': 'error',
				'@typescript-eslint/no-explicit-any': 'warn',
			},
		},
	],
}; 