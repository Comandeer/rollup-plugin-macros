import { generate } from 'escodegen';
import { asyncWalk } from 'estree-walker';
import handleCallExpression from './handleCallExpression.js';
import handleImportDeclaration from './handleImportDeclaration.js';

/**
 * @typedef {Object} Macro
 * @property {string} name The name of the export in the macro module.
 * @property {string} path The path of the macro module.
 */

/**
 * @typedef {string & {}} MacroLocalName
 *
 * The name of the import in the module that use the macro.
 */

/**
 * @typedef {Map<MacroLocalName, Macro>} MacroMap
 */

/**
 * @returns {import( 'rollup' ).Plugin}
 */
function plugin() {
	return {
		name: '@comandeer/rollup-plugin-macros',
		resolveId( importee, importer, { assertions } ) {
			if ( assertions && assertions.type === 'macro' ) {
				return {
					id: importee,
					external: true
				};
			}

			return null;
		},
		async transform( code, path ) {
			const parse = this.parse;
			const ast = parse( code );
			/** @type {MacroMap} */
			const macros = new Map();

			await asyncWalk( ast, {
				async enter( node ) {
					switch ( node.type ) {
					case 'ImportDeclaration':
						return handleImportDeclaration.call( this, node, macros, path );
					case 'CallExpression':
						return handleCallExpression.call( this, node, macros, parse );
					}
				}
			} );

			return {
				code: generate( ast )
			};
		}
	};
}

export default plugin;
