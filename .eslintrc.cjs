module.exports = {
	root: true,
	env: {
		browser: true,
		es2022: true,
		node: true,
		jest: true
	},
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module'
	},
	extends: 'eslint:recommended',
	rules: {
		'no-unused-vars': [ 'error', { args: 'none' } ]
	}
};
