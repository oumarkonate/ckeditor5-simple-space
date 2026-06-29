module.exports = {
	// CKEditor renders into the DOM, so the editing-view assertions need a browser-like environment.
	testEnvironment: 'jsdom',
	// `ckeditor5` only exposes an `import` export condition; make the resolver honour it. `browser`
	// steers dual packages (e.g. `blurhash`) to their plain-`.js` ESM build, which Babel can transform
	// (unlike `.mjs` files, which Jest insists on treating as native ESM).
	testEnvironmentOptions: {
		customExportConditions: [ 'browser', 'import', 'node', 'default' ]
	},
	testMatch: [ '<rootDir>/tests/**/*.test.js' ],
	setupFiles: [ '<rootDir>/tests/_utils/setup.js' ],
	moduleFileExtensions: [ 'js', 'mjs', 'cjs', 'json' ],
	transform: {
		'^.+\\.[mc]?js$': 'babel-jest'
	},
	// `ckeditor5` and its dependencies ship ESM. Transform the whole tree (default ignores node_modules).
	transformIgnorePatterns: [ '\\.pnp\\.[^\\/]+$' ],
	moduleNameMapper: {
		'\\.(css|svg)$': '<rootDir>/tests/_utils/empty.js',
		// `dedent` resolves to a `.mjs` build under our export conditions. Jest always treats `.mjs` as
		// native ESM (and so skips Babel), which breaks in CommonJS mode. Pin it to its CJS build.
		'^dedent$': '<rootDir>/node_modules/dedent/dist/dedent.js'
	}
};
