import { createEditor, destroyEditor } from './_utils/editor.js';

describe( 'SimpleSpaceCommand', () => {
	let editor;
	let command;

	beforeEach( async () => {
		editor = await createEditor();
		command = editor.commands.get( 'simpleSpace' );
	} );

	afterEach( async () => {
		await destroyEditor( editor );
	} );

	function rootHasShowClass() {
		return editor.editing.view.document.getRoot().hasClass( 'ck-show-simple-spaces' );
	}

	it( 'is always enabled and does not affect data', () => {
		expect( command.isEnabled ).toBe( true );
		expect( command.affectsData ).toBe( false );
	} );

	it( 'starts with markers hidden', () => {
		expect( command.value ).toBe( false );
		expect( rootHasShowClass() ).toBe( false );
	} );

	it( 'toggles the value and the root class on execute', () => {
		editor.execute( 'simpleSpace' );

		expect( command.value ).toBe( true );
		expect( rootHasShowClass() ).toBe( true );

		editor.execute( 'simpleSpace' );

		expect( command.value ).toBe( false );
		expect( rootHasShowClass() ).toBe( false );
	} );

	it( 'respects an explicit forceValue', () => {
		command.execute( { forceValue: true } );
		expect( command.value ).toBe( true );

		// Forcing the same value again keeps it on (no toggle).
		command.execute( { forceValue: true } );
		expect( command.value ).toBe( true );
		expect( rootHasShowClass() ).toBe( true );

		command.execute( { forceValue: false } );
		expect( command.value ).toBe( false );
		expect( rootHasShowClass() ).toBe( false );
	} );
} );
