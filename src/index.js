/* eslint-disable */
import { dirname, resolve as resolvePath } from 'node:path';
import { Worker } from 'node:worker_threads';
import { generate } from 'escodegen';
import { asyncWalk, walk } from 'estree-walker';
import { temporaryFile } from 'tempy';
import { writeFile } from 'node:fs/promises';

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
			const macros = new Map();

			await asyncWalk( ast, {
				async enter( node ) {
					switch( node.type ) {
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

function handleImportDeclaration( node, macros, path ) {
	if ( !isMacroImport( node ) ) {
		return;
	}

	extractMacros( macros, node, path );
	this.remove();
}

async function handleCallExpression( node, macros, parse ) {
	const name = node.callee.name;

	if ( !macros.has( name ) ) {
		return;
	}

	const macro = macros.get( name );
	const macroResult = await executeMacro( macro );
	const macroResultAST = parse( JSON.stringify( macroResult ) );
	const expression = getValueNode( macroResultAST );

	this.replace( expression );
}

function isMacroImport( node ) {
	if ( node.type !== 'ImportDeclaration' ) {
		return false;
	}

	if ( !node.assertions ) {
		return false;
	}

	const [ assertion ] = node.assertions;

	return assertion.key.name === 'type' && assertion.value.value === 'macro';
}

function extractMacros( macros, node, modulePath ) {
	const moduleDirPath = dirname( modulePath );
	const macroPath = resolvePath( moduleDirPath, node.source.value );

	node.specifiers.forEach( ( specifier ) => {
		macros.set( specifier.local.name, {
			name: specifier.imported.name,
			path: macroPath
		} );
	} );
}

function executeMacro( { name, path } ) {
	return new Promise( async ( resolve, reject ) => {
		const code = `import { parentPort } from 'node:worker_threads';
		import { ${ name } } from '${ path }';

		const result = await ${ name }();

		parentPort.postMessage( result );`

		const workerFilePath = temporaryFile( {
			extension: 'mjs'
		} );

		await writeFile( workerFilePath, code, 'utf-8' );

		const worker = new Worker( workerFilePath );

		worker.on( 'message', resolve );
		worker.on( 'error', reject );
		worker.on( 'exit', ( exitCode ) => {
			if ( exitCode !== 0 ) {
				reject( exitCode );
			}
		} );
	} );
}

function getValueNode( node ) {
	let valueNode;

	walk( node, {
		enter( node ) {
			if ( node.type !== 'Literal' && node.type !== 'ObjectExpression' ) {
				return;
			}

			valueNode = node;
			this.skip();
		}
	} )

	return valueNode;
}

export default plugin;
