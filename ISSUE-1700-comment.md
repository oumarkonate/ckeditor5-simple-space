<!--
  DRAFT comment for https://github.com/ckeditor/ckeditor5/issues/1700
  Not posted automatically — copy/paste it into the issue yourself.
-->

For anyone landing here who needs to **visualize spaces** today, I packaged an improved, self‑contained
version of @scofalik's proof of concept, updated for **CKEditor 5 v47.3** (new installation method):

👉 **https://github.com/oumarkonate/ckeditor5-simple-space** — `npm i ckeditor5-simple-space` (MIT)

### What it adds on top of the original PoC

- **Editing‑view only** → `editor.getData()` stays completely clean (no markup leaks, copy‑paste unaffected).
- A **`simpleSpace` command + a toggleable "Show spaces" toolbar button** (the PoC was a converter only).
- **Zero runtime dependencies**; works with the single‑package `import … from 'ckeditor5'` setup.
- **Configurable** wrapper element/class, and spaces inside `mention` text are left untouched.
- **Unit‑tested** (Jest) and ships a ready‑to‑use stylesheet.

### Live demo

https://github.com/user-attachments/assets/6d6985c1-55ca-40a3-b92c-9a905628304e

The repo includes a runnable demo under [`sample/`](https://github.com/oumarkonate/ckeditor5-simple-space/tree/main/sample):

```bash
git clone https://github.com/oumarkonate/ckeditor5-simple-space
cd ckeditor5-simple-space
npm install
npm run sample        # Vite dev server → http://localhost:8000/sample/
```

Type some text with single and multiple spaces, then click **Show spaces** to toggle the markers.

> Note for GPL users: the demo bundles CKEditor **self‑hosted** (via Vite) and pins a **non‑LTS** build
> (`ckeditor5@^48`), because `licenseKey: 'GPL'` is rejected on the CDN ("cloud" channel) and on the v47 LTS
> line. The plugin itself works on **CKEditor 5 v47.3+** regardless of the license line.

### How it works

A single editing downcast converter wraps every space in its own `<simple-space>` element. Consecutive
spaces each get their own marker (a per‑space id keeps the attribute elements from merging):

```js
editor.editing.downcastDispatcher.on( 'insert:$text', ( evt, data, conversionApi ) => {
	// Leave mentions (e.g. "@John Doe") intact.
	if ( data.item.textNode && data.item.textNode.hasAttribute( 'mention' ) ) {
		return;
	}
	if ( !conversionApi.consumable.consume( data.item, 'insert' ) ) {
		return;
	}

	const chunks = data.item.data.split( ' ' );
	const writer = conversionApi.writer;
	let modelPosition = data.range.start;
	let viewPosition = conversionApi.mapper.toViewPosition( modelPosition );

	for ( let i = 0; i < chunks.length; i++ ) {
		if ( chunks[ i ] !== '' ) {
			writer.insert( viewPosition, writer.createText( chunks[ i ] ) );
			modelPosition = modelPosition.getShiftedBy( chunks[ i ].length );
			viewPosition = conversionApi.mapper.toViewPosition( modelPosition );
		}
		if ( i === chunks.length - 1 ) {
			break;
		}
		writer.insert( viewPosition, writer.createText( ' ' ) );
		const wrapper = writer.createAttributeElement( 'simple-space', { class: 'ck-simple-space' }, { id: spaceId++ } );
		const range = conversionApi.mapper.toViewRange( editor.model.createRange( modelPosition, modelPosition.getShiftedBy( 1 ) ) );
		writer.wrap( range, wrapper );
		modelPosition = modelPosition.getShiftedBy( 1 );
		viewPosition = conversionApi.mapper.toViewPosition( modelPosition );
	}
}, { priority: 'high' } );
```

Visibility is a pure CSS concern: the command toggles a `ck-show-simple-spaces` class on the editing root,
and the markers are drawn from it:

```css
.ck-show-simple-spaces simple-space {
	position: relative;
}
.ck-show-simple-spaces simple-space::after {
	background: url("data:image/svg+xml,%3Csvg width='4' height='9' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h4v9H0z' fill='%234A90E2'/%3E%3C/svg%3E") no-repeat center / contain;
	content: '';
	height: 9px;
	left: 50%;
	position: absolute;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 4px;
}
```

Hope it helps someone — feedback and PRs welcome. 🙏
