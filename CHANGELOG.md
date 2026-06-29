# Changelog

All notable changes to this project are documented in this file.

## 1.0.0

Initial release.

- Editing-view downcast converter that wraps every regular space in a `<simple-space class="ck-simple-space">`
  element. The content data (`editor.getData()`) is left untouched.
- `simpleSpace` command and a toggleable **Show spaces** toolbar button.
- Visibility driven entirely from the editor: the command toggles the `ck-show-simple-spaces` class on the
  editing root; the bundled stylesheet keys the markers off that class.
- Configurable wrapper element name and class via `config.simpleSpace`.
- Spaces inside `mention` text (from `@ckeditor/ckeditor5-mention`) are left untouched.
- No runtime dependencies. Compatible with CKEditor 5 v47.3+ (new installation method).
- `npm run sample` starts a Vite dev server on `http://localhost:8000/sample/` for manual rendering checks.
  The demo bundles CKEditor self-hosted and pins a non-LTS **v48** build so that `licenseKey: 'GPL'` is
  accepted (the v47 LTS line and the CDN both reject the GPL key — see the README for details).
- Demo video: [`docs/demo.mp4`](https://github.com/oumarkonate/ckeditor5-simple-space/raw/main/docs/demo.mp4).
