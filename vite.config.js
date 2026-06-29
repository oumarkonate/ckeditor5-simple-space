// Dev server for the demo (`npm run sample`). Vite resolves the bare `ckeditor5` /
// `@ckeditor/*` imports from node_modules — i.e. the self-hosted distribution — which is what
// makes `licenseKey: 'GPL'` valid (the CDN/cloud channel rejects it).
export default {
	server: {
		port: 8000,
		open: '/sample/'
	}
};
