// jsdom lacks a few browser APIs that CKEditor's UI relies on (mainly the toolbar's responsive
// grouping). Provide minimal no-op polyfills so a full ClassicEditor can boot under Jest.

if ( typeof globalThis.ResizeObserver === 'undefined' ) {
	globalThis.ResizeObserver = class ResizeObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
}

// jsdom does not implement scrollTo; CKEditor calls it when focusing the editing view.
window.scrollTo = () => {};

if ( typeof window.HTMLElement !== 'undefined' && !window.HTMLElement.prototype.scrollTo ) {
	window.HTMLElement.prototype.scrollTo = () => {};
}

if ( typeof window.matchMedia === 'undefined' ) {
	window.matchMedia = query => ( {
		matches: false,
		media: query,
		onchange: null,
		addListener() {},
		removeListener() {},
		addEventListener() {},
		removeEventListener() {},
		dispatchEvent() {
			return false;
		}
	} );
}
