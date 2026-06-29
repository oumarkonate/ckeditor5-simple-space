import { ClassicEditor, Essentials, Paragraph, Bold, Italic } from 'ckeditor5';
import SimpleSpace from '../src/simplespace.js';

// CKEditor core styles + the Simple Space markers styles.
import 'ckeditor5/ckeditor5.css';
import '../theme/simplespace.css';

ClassicEditor
	.create( document.querySelector( '#editor' ), {
		licenseKey: 'GPL', // valid here because CKEditor is bundled self-hosted (not from the CDN)
		plugins: [ Essentials, Paragraph, Bold, Italic, SimpleSpace ],
		toolbar: [ 'bold', 'italic', '|', 'simpleSpace', '|', 'undo', 'redo' ]
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( error => {
		// eslint-disable-next-line no-console
		console.error( error );
	} );
