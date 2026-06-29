// Babel is only used by Jest to transpile ESM (the plugin sources and the `ckeditor5` package)
// down to something the Node-based test runner can execute.
module.exports = {
	presets: [
		// `modules: 'commonjs'` forces ESM (incl. `.mjs` deps such as `dedent`) down to CommonJS so the
		// Node-based Jest runtime can execute them; without it, preset-env's `auto` mode leaves `.mjs`
		// files as ESM and the runtime throws "Unexpected token 'export'".
		[ '@babel/preset-env', { targets: { node: 'current' }, modules: 'commonjs' } ]
	]
};
