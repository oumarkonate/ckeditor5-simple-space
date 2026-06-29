import { _setModelData, _getViewData } from 'ckeditor5';
import SimpleSpaceEditing from '../src/simplespaceediting.js';
import SimpleSpaceCommand from '../src/simplespacecommand.js';
import { createEditor, destroyEditor } from './_utils/editor.js';

describe( 'SimpleSpaceEditing', () => {
	let editor;

	beforeEach( async () => {
		editor = await createEditor();
	} );

	afterEach( async () => {
		await destroyEditor( editor );
	} );

	// Inserts a paragraph holding the given literal text (preserving repeated spaces, which
	// `_setModelData` would otherwise collapse).
	function setParagraphText( text ) {
		editor.model.change( writer => {
			const root = editor.model.document.getRoot();
			const paragraph = writer.createElement( 'paragraph' );

			writer.append( paragraph, root );
			writer.appendText( text, paragraph );
		} );
	}

	// Counts how many `<simple-space …>` wrappers are present in the editing view.
	function countWrappers() {
		const view = _getViewData( editor.editing.view, { withoutSelection: true } );

		return ( view.match( /<simple-space\b/g ) || [] ).length;
	}

	it( 'is loaded with the SimpleSpace glue plugin', () => {
		expect( editor.plugins.has( 'SimpleSpace' ) ).toBe( true );
		expect( editor.plugins.has( SimpleSpaceEditing ) ).toBe( true );
	} );

	it( 'registers the simpleSpace command', () => {
		expect( editor.commands.get( 'simpleSpace' ) ).toBeInstanceOf( SimpleSpaceCommand );
	} );

	it( 'does not leak markup into the editor data', () => {
		_setModelData( editor.model, '<paragraph>foo bar baz</paragraph>' );

		expect( editor.getData() ).not.toContain( 'simple-space' );
		expect( editor.getData() ).toContain( 'foo' );
		expect( editor.getData() ).toContain( 'baz' );
	} );

	it( 'wraps a single space in one <simple-space> element in the editing view', () => {
		setParagraphText( 'foo bar' );

		const view = _getViewData( editor.editing.view, { withoutSelection: true } );

		expect( view ).toContain( '<simple-space class="ck-simple-space">' );
		expect( countWrappers() ).toBe( 1 );
	} );

	it( 'wraps each of several consecutive spaces in its own element', () => {
		// Three spaces between the words → three separate wrappers (thanks to the unique-id counter).
		setParagraphText( 'foo' + '   ' + 'bar' );

		expect( countWrappers() ).toBe( 3 );
	} );

	it( 'does not decorate spaces inside a mention', () => {
		// Allow a `mention` attribute on text without pulling the full Mention plugin/converters.
		editor.model.schema.extend( '$text', { allowAttributes: 'mention' } );

		editor.model.change( writer => {
			const root = editor.model.document.getRoot();
			const paragraph = writer.createElement( 'paragraph' );

			writer.append( paragraph, root );
			writer.appendText( '@John Doe', { mention: 'john' }, paragraph );
			writer.appendText( ' said', paragraph );
		} );

		const view = _getViewData( editor.editing.view, { withoutSelection: true } );

		// The space inside the mention ("@John Doe") is preserved (not wrapped); only the space in
		// " said" is decorated → exactly one wrapper.
		expect( view ).toContain( '@John Doe' );
		expect( countWrappers() ).toBe( 1 );
	} );
} );
