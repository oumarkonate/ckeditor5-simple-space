import { ClassicEditor, Essentials, Paragraph } from 'ckeditor5';
import SimpleSpace from '../../src/simplespace.js';

/**
 * Creates a ClassicEditor instance (in jsdom) loaded with the Simple Space feature.
 *
 * @param {Object} [config] Extra editor configuration merged over the defaults.
 * @returns {Promise<module:core/editor/editor~Editor>}
 */
export async function createEditor( config = {} ) {
	const element = document.createElement( 'div' );
	document.body.appendChild( element );

	const editor = await ClassicEditor.create( element, {
		licenseKey: 'GPL',
		plugins: [ Essentials, Paragraph, SimpleSpace ],
		toolbar: [ 'simpleSpace' ],
		...config
	} );

	editor._domElement = element;

	return editor;
}

/**
 * Destroys an editor created with {@link createEditor} and removes its DOM element.
 *
 * @param {module:core/editor/editor~Editor} editor
 */
export async function destroyEditor( editor ) {
	const element = editor._domElement;

	await editor.destroy();

	if ( element && element.parentNode ) {
		element.parentNode.removeChild( element );
	}
}
