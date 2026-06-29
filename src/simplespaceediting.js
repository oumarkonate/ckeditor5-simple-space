/**
 * @module simple-space/simplespaceediting
 */

import { Plugin } from 'ckeditor5';
import SimpleSpaceCommand from './simplespacecommand.js';

// Attribute set by the official `@ckeditor/ckeditor5-mention` plugin on mention text.
const MENTION_ATTRIBUTE = 'mention';

const DEFAULT_CONFIG = {
	// Name of the view element each space gets wrapped into (editing view only).
	elementName: 'simple-space',
	// Class added on that wrapper element.
	className: 'ck-simple-space'
};

/**
 * The editing part of the Simple Space feature.
 *
 * It registers an editing-downcast converter that wraps every space character in a dedicated
 * inline view element (`<simple-space class="ck-simple-space">`). The wrapper lives ONLY in the
 * editing view, so `editor.getData()` stays completely untouched. Visibility of the markers is
 * controlled by the {@link module:simple-space/simplespacecommand~SimpleSpaceCommand}, which
 * toggles the `ck-show-simple-spaces` class on the editing root.
 */
export default class SimpleSpaceEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'SimpleSpaceEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const config = { ...DEFAULT_CONFIG, ...editor.config.get( 'simpleSpace' ) };

		editor.commands.add( 'simpleSpace', new SimpleSpaceCommand( editor ) );

		// Monotonic counter used to give each wrapper a unique `id`. Without distinct ids, CKEditor
		// would merge adjacent attribute elements into a single one, and consecutive spaces (e.g.
		// `foo  bar`) would share one wrapper instead of getting one marker each. A simple counter
		// keeps the plugin dependency-free (no `uuid` package needed).
		let spaceId = 0;

		const downcastSpaces = ( evt, data, conversionApi ) => {
			// Skip text that is part of a mention (set by `@ckeditor/ckeditor5-mention`). A mention such
			// as `@John Doe` must stay a single, indivisible widget, so we never split/wrap the spaces
			// it contains — otherwise its inner spacing would be decorated and the mention broken apart.
			if ( data.item.textNode && data.item.textNode.hasAttribute( MENTION_ATTRIBUTE ) ) {
				return;
			}

			if ( !conversionApi.consumable.consume( data.item, 'insert' ) ) {
				return;
			}

			const dataChunks = data.item.data.split( ' ' );
			const viewWriter = conversionApi.writer;

			let modelPosition = data.range.start;
			let viewPosition = conversionApi.mapper.toViewPosition( modelPosition );

			for ( let i = 0; i < dataChunks.length; i += 1 ) {
				const chunk = dataChunks[ i ];

				// Chunks may be empty (consider `'foo '.split( ' ' )`).
				// Thankfully, `'foo  bar'.split( ' ' )` returns `[ 'foo', '', 'bar' ]`,
				// which is perfect for this algorithm.
				if ( chunk !== '' ) {
					viewWriter.insert( viewPosition, viewWriter.createText( chunk ) );

					// Recalculate `viewPosition` after every inserted item.
					modelPosition = modelPosition.getShiftedBy( chunk.length );
					viewPosition = conversionApi.mapper.toViewPosition( modelPosition );
				}

				// Do not insert a wrapper after the last chunk.
				if ( i === dataChunks.length - 1 ) {
					break;
				}

				// Insert the space and wrap it in its own `<simple-space>` element.
				viewWriter.insert( viewPosition, viewWriter.createText( ' ' ) );

				const viewSpaceContainer = viewWriter.createAttributeElement(
					config.elementName,
					{ class: config.className },
					// A unique id forces each space into a separate wrapper instead of merging.
					{ id: spaceId++ }
				);
				const modelWrapRange = editor.model.createRange( modelPosition, modelPosition.getShiftedBy( 1 ) );
				const viewWrapRange = conversionApi.mapper.toViewRange( modelWrapRange );

				viewWriter.wrap( viewWrapRange, viewSpaceContainer );

				// Recalculate `viewPosition` after every inserted item.
				modelPosition = modelPosition.getShiftedBy( 1 );
				viewPosition = conversionApi.mapper.toViewPosition( modelPosition );
			}
		};

		// The converter is always active: `<simple-space>` elements are permanently present in the
		// editing view. Their visibility is purely a CSS concern, toggled by the command.
		editor.editing.downcastDispatcher.on( 'insert:$text', downcastSpaces, { priority: 'high' } );
	}
}
