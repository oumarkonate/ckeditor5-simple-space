/**
 * @module simple-space/simplespace
 */

import { Plugin } from 'ckeditor5';
import SimpleSpaceEditing from './simplespaceediting.js';
import SimpleSpaceUI from './simplespaceui.js';

/**
 * The Simple Space feature.
 *
 * Visualizes regular space characters in the editing area as small markers, with a toolbar button
 * to toggle them on and off. The content data (`editor.getData()`) is never modified.
 *
 * This is a "glue" plugin that loads:
 *
 * * {@link module:simple-space/simplespaceediting~SimpleSpaceEditing},
 * * {@link module:simple-space/simplespaceui~SimpleSpaceUI}.
 */
export default class SimpleSpace extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ SimpleSpaceEditing, SimpleSpaceUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'SimpleSpace';
	}
}
