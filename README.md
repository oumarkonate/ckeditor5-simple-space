# ckeditor5-simple-space

[![npm version](https://img.shields.io/npm/v/ckeditor5-simple-space.svg)](https://www.npmjs.com/package/ckeditor5-simple-space)
[![license: MIT](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/oumarkonate/ckeditor5-simple-space/blob/main/LICENSE.md)
[![CKEditor 5](https://img.shields.io/badge/CKEditor%205-v47.3%2B-blue.svg)](https://ckeditor.com/ckeditor-5/)
[![dependencies: none](https://img.shields.io/badge/dependencies-none-brightgreen.svg)](package.json)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/oumarkonate/ckeditor5-simple-space/pulls)

A small **CKEditor 5** plugin that makes regular **space characters visible** in the editing area, with a
toolbar button to toggle them on and off — similar to the "formatting marks" feature of a word processor.

It only decorates the **editing view**: your content data (`editor.getData()`) is **never** modified, and
copy‑paste keeps working normally. The plugin has **no runtime dependencies**.

> This is a modernized, self‑contained take (CKEditor 5 v47.3, new installation method) on the proof of
> concept shared by [@scofalik](https://github.com/scofalik) in
> [ckeditor/ckeditor5#1700](https://github.com/ckeditor/ckeditor5/issues/1700).

---

## How it looks

https://github.com/user-attachments/assets/6d6985c1-55ca-40a3-b92c-9a905628304e

▶ [Watch the demo](docs/demo.mp4)

When the **Show spaces** button is on, each space is rendered with a small blue marker:

```
This·is·some·text          ← every "·" is a space marker (rendered via CSS)
```

The markers live purely in the editing view. The saved HTML stays clean:

```html
<p>This is some text</p>
```

---

## Requirements

- **CKEditor 5 v47.3 or newer** (the single‑package "new installation method", i.e. `import … from 'ckeditor5'`).

### CKEditor version & license (important)

CKEditor 5 is published on **two release lines**, and which one you install determines whether the free
**`'GPL'`** license key is accepted:

| Line | Example | npm dist‑tag | `licenseKey: 'GPL'` |
| ---- | ------- | ------------ | ------------------- |
| **Regular** | `48.x` | `latest` | ✅ allowed (open‑source, self‑hosted) |
| **LTS** (Long‑Term Support) | `47.x` | `lts-v47` | ❌ requires a **commercial** key |

So if you install a v47 (LTS) build and pass `licenseKey: 'GPL'`, CKEditor throws
[`license-key-lts-not-allowed`](https://ckeditor.com/docs/ckeditor5/latest/support/error-codes.html#error-license-key-lts-not-allowed)
(and loading from the CDN throws `license-key-invalid-distribution-channel`, because GPL is self‑hosted only).

**For GPL / open‑source usage, install a non‑LTS release (v48+) and bundle it self‑hosted.** That is exactly
why this repository's demo and dev setup pin **`ckeditor5@^48`** — it lets the demo run with the `'GPL'` key.
The plugin code itself is API‑compatible with **CKEditor 5 v47.3+**, regardless of the license line you
choose (use a commercial key if you're on the v47 LTS line).

## Installation

```bash
npm install ckeditor5-simple-space
```

## Usage

Follow these five steps:

1. **Import the plugin** from `ckeditor5-simple-space`.
2. **Import the stylesheet** — without it the markers are invisible (the JS only adds the wrapper elements;
   the CSS draws the markers).
3. Add **`SimpleSpace`** to the editor's `plugins`.
4. Add **`'simpleSpace'`** to the editor's `toolbar`.
5. Run the editor and click the **Show spaces** button to toggle the markers.

```js
import { ClassicEditor, Essentials, Paragraph, Bold, Italic } from 'ckeditor5';
import { SimpleSpace } from 'ckeditor5-simple-space';

// Core CKEditor styles + the Simple Space markers styles.
import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-simple-space/theme/simplespace.css';

ClassicEditor
	.create( document.querySelector( '#editor' ), {
		licenseKey: 'GPL', // or your commercial license key
		plugins: [ Essentials, Paragraph, Bold, Italic, SimpleSpace ],
		toolbar: [ 'bold', 'italic', '|', 'simpleSpace', '|', 'undo', 'redo' ]
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( console.error );
```

That's it. A **Show spaces** button appears in the toolbar; toggling it shows or hides the markers.

A ready‑to‑run example is provided in [`sample/index.html`](sample/index.html) (loads CKEditor from the CDN).

---

## Configuration

The wrapper element and its class can be customized via `config.simpleSpace`:

```js
ClassicEditor.create( element, {
	plugins: [ /* … */ SimpleSpace ],
	toolbar: [ /* … */ 'simpleSpace' ],
	simpleSpace: {
		elementName: 'simple-space',  // view element each space is wrapped into
		className: 'ck-simple-space'  // class added on that element
	}
} );
```

| Option        | Type     | Default            | Description                                            |
| ------------- | -------- | ------------------ | ------------------------------------------------------ |
| `elementName` | `string` | `'simple-space'`   | Name of the inline view element wrapping each space.   |
| `className`   | `string` | `'ck-simple-space'`| Class set on the wrapper element.                      |

If you change these, update your CSS selectors accordingly (see below).

---

## How it works

The plugin registers a single **editing downcast** converter on `insert:$text`. For each text node it splits
the text on spaces, re‑inserts the words, and wraps **every** space in its own
`<simple-space class="ck-simple-space">` view element. Because this happens only in the editing pipeline:

- `editor.getData()` returns plain HTML with no extra markup;
- consecutive spaces each get their own marker (a per‑space id prevents the elements from merging).

The **`simpleSpace` command** controls visibility by toggling the `ck-show-simple-spaces` class on the
editing root. The bundled stylesheet only shows markers while that class is present, so the feature is
entirely driven from within the editor (no external CSS toggling required). The command does not affect
data and stays available in read‑only mode.

---

## Customizing the marker

The shipped stylesheet ([`theme/simplespace.css`](theme/simplespace.css)) draws a small vertical blue bar,
absolutely centered over each space so it stays visible at any line height without shifting the text.
Markers are only visible under the `.ck-show-simple-spaces` root class:

```css
.ck-show-simple-spaces simple-space {
	position: relative; /* containing block for the marker */
}

.ck-show-simple-spaces simple-space::after {
	background: url("data:image/svg+xml,%3Csvg width='4' height='9' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h4v9H0z' fill='%234A90E2'/%3E%3C/svg%3E") no-repeat center / contain;
	content: '';
	height: 9px;
	left: 50%;
	pointer-events: none;
	position: absolute;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 4px;
}
```

Prefer a middle dot (`·`)? Replace the `::after` rule with (keep the `position: relative` rule above):

```css
.ck-show-simple-spaces simple-space::after {
	color: #b3b3b3;
	content: '\00B7';
	left: 50%;
	pointer-events: none;
	position: absolute;
	top: 50%;
	transform: translate(-50%, -50%);
}
```

---

## Mentions

If you use `@ckeditor/ckeditor5-mention`, spaces **inside** a mention (e.g. `@John Doe`) are intentionally
left undecorated so the mention stays a single, indivisible unit.

---

## Try it locally (in a browser)

The Jest tests run in **jsdom** and cover the logic (converter, command, button binding, clean
`getData()`), but not the **actual rendering**. To check the markers really show up, the toggle works and
focus behaves, run the bundled demo in a real browser:

```bash
npm install
npm run sample          # Vite dev server → opens http://localhost:8000/sample/
```

> The demo is bundled with **Vite**, which loads CKEditor **self‑hosted** from `node_modules`, and pins a
> **non‑LTS v48** build (see [CKEditor version & license](#ckeditor-version--license-important)). Both are
> required for `licenseKey: 'GPL'` to be accepted: the CDN ("cloud" channel) and the v47 LTS line each
> reject the GPL key.

Validation checklist:

- the **Show spaces** button appears in the toolbar;
- toggling it **on** shows one blue marker per space — including between several consecutive spaces;
- toggling it **off** hides the markers;
- in the console, `editor.getData()` contains no `<simple-space>` markup;
- copying text and pasting it elsewhere produces no stray markup.

## Development

```bash
npm install
npm test       # Jest unit tests (editing converter, command, UI)
npm run lint   # ESLint
npm run sample # Vite dev server for the demo on http://localhost:8000/sample/
```

## Keywords

`ckeditor` · `ckeditor5` · `ckeditor 5` · `ckeditor5-plugin` · `ckeditor5-feature` · `ckeditor5-dll` ·
`whitespace` · `spaces` · `invisible-characters` · `formatting-marks`

These mirror the `keywords` field in [`package.json`](package.json) — used by npm search and to help others
discover the plugin.

## Credits

Based on the original proof of concept by [@scofalik](https://github.com/scofalik) in
[ckeditor/ckeditor5#1700](https://github.com/ckeditor/ckeditor5/issues/1700).

## License

[MIT](LICENSE.md)
