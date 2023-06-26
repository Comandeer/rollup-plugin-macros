import { dirname, resolve as resolvePath } from 'pathe';

/**
 *
 * @param {import( 'rollup' ).AcornNode} node
 * @param {import( './index.js' ).MacroMap} macros
 * @param {string} path Path of the current module.
 * @returns {void}
 */
function handleImportDeclaration( node, macros, path ) {
	if ( !isMacroImport( node ) ) {
		return;
	}

	extractMacros( macros, node, path );
	this.remove();
}

/**
 * @param {import( 'rollup' ).AcornNode} node
 * @returns {boolean}
 */
function isMacroImport( node ) {
	if ( !node.assertions ) {
		return false;
	}

	const [ assertion ] = node.assertions;

	return assertion.key.name === 'type' && assertion.value.value === 'macro';
}

/**
 *
 * @param {import( './index.js' ).MacroMap} macros
 * @param {import( 'rollup' ).AcornNode} node
 * @param {string} modulePath The path of the current module.
 * @returns {void}
 */
function extractMacros( macros, node, modulePath ) {
	const moduleDirPath = dirname( modulePath );
	const macroPath = resolvePath( moduleDirPath, node.source.value );

	node.specifiers.forEach( ( specifier ) => {
		const originalName = specifier.type === 'ImportDefaultSpecifier' ?
			'default' :
			specifier.imported.name;

		macros.set( specifier.local.name, {
			name: originalName,
			path: macroPath
		} );
	} );
}

export default handleImportDeclaration;
