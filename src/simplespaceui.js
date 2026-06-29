/**
 * @module simple-space/simplespaceui
 */

import { Plugin, ButtonView } from 'ckeditor5';

// Inline icon (two dots between baselines) — avoids depending on a specific icon export.
const SIMPLE_SPACE_ICON =
	'<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">' +
	'<path d="M3 3v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3h-1.5v9a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V3H3z" ' +
	'fill-opacity=".7"/>' +
	'<circle cx="7.5" cy="9.5" r="1.1"/><circle cx="12.5" cy="9.5" r="1.1"/></svg>';

/**
 * The UI part of the Simple Space feature.
 *
 * Registers the `simpleSpace` toolbar button, a toggleable switch wired to the
 * {@link module:simple-space/simplespacecommand~SimpleSpaceCommand}.
 */
export default class SimpleSpaceUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'SimpleSpaceUI';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		editor.ui.componentFactory.add( 'simpleSpace', locale => {
			const command = editor.commands.get( 'simpleSpace' );
			const button = new ButtonView( locale );

			button.set( {
				label: t( 'Show spaces' ),
				icon: SIMPLE_SPACE_ICON,
				tooltip: true,
				isToggleable: true
			} );

			// The button reflects and drives the command state.
			button.bind( 'isOn' ).to( command, 'value' );
			button.bind( 'isEnabled' ).to( command, 'isEnabled' );

			this.listenTo( button, 'execute', () => {
				editor.execute( 'simpleSpace' );
				editor.editing.view.focus();
			} );

			return button;
		} );
	}
}
