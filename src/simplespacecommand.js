/**
 * @module simple-space/simplespacecommand
 */

import { Command } from 'ckeditor5';

// Class added on the editing root(s) while space markers are visible.
const SHOW_CLASS = 'ck-show-simple-spaces';

/**
 * The Simple Space command.
 *
 * Toggles the visibility of the space markers. Markers are always rendered in the editing view by
 * {@link module:simple-space/simplespaceediting~SimpleSpaceEditing}; this command simply adds or
 * removes the `ck-show-simple-spaces` class on every editing root, which the stylesheet keys off.
 *
 *		editor.execute( 'simpleSpace' );
 *
 * @extends module:core/command~Command
 */
export default class SimpleSpaceCommand extends Command {
	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );

		// This command is not tied to the selection/document state, so it is always enabled and
		// must keep working in read-only mode (it only changes how content is displayed).
		this.affectsData = false;

		/**
		 * Whether the space markers are currently visible.
		 *
		 * @observable
		 * @readonly
		 * @member {Boolean} #value
		 */
		this.set( 'value', false );
	}

	/**
	 * @inheritDoc
	 */
	refresh() {
		// The command is always available — toggling markers does not depend on the selection.
		this.isEnabled = true;
	}

	/**
	 * Toggles the visibility of the space markers.
	 *
	 * @param {Object} [options]
	 * @param {Boolean} [options.forceValue] If set, forces the markers on (`true`) or off (`false`)
	 * instead of toggling the current value.
	 */
	execute( options = {} ) {
		const editor = this.editor;
		const newValue = options.forceValue === undefined ? !this.value : options.forceValue;

		this.value = newValue;

		editor.editing.view.change( writer => {
			for ( const root of editor.editing.view.document.roots ) {
				if ( newValue ) {
					writer.addClass( SHOW_CLASS, root );
				} else {
					writer.removeClass( SHOW_CLASS, root );
				}
			}
		} );
	}
}
