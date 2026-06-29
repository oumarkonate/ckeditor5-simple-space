import { ButtonView } from 'ckeditor5';
import SimpleSpaceUI from '../src/simplespaceui.js';
import { createEditor, destroyEditor } from './_utils/editor.js';

describe( 'SimpleSpaceUI', () => {
	let editor;
	let button;
	let command;

	beforeEach( async () => {
		editor = await createEditor();
		command = editor.commands.get( 'simpleSpace' );
		button = editor.ui.componentFactory.create( 'simpleSpace' );
	} );

	afterEach( async () => {
		button.destroy();
		await destroyEditor( editor );
	} );

	it( 'is loaded', () => {
		expect( editor.plugins.has( SimpleSpaceUI ) ).toBe( true );
	} );

	it( 'registers a toggleable button in the component factory', () => {
		expect( editor.ui.componentFactory.has( 'simpleSpace' ) ).toBe( true );
		expect( button ).toBeInstanceOf( ButtonView );
		expect( button.isToggleable ).toBe( true );
		expect( button.label ).toBe( 'Show spaces' );
	} );

	it( 'reflects the command value through isOn', () => {
		expect( button.isOn ).toBe( false );

		command.value = true;
		expect( button.isOn ).toBe( true );

		command.value = false;
		expect( button.isOn ).toBe( false );
	} );

	it( 'executes the simpleSpace command when fired', () => {
		const spy = jest.spyOn( editor, 'execute' );

		button.fire( 'execute' );

		expect( spy ).toHaveBeenCalledWith( 'simpleSpace' );
		expect( command.value ).toBe( true );
	} );
} );
