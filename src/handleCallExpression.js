import { writeFile } from 'node:fs/promises';
import { Worker } from 'node:worker_threads';
import { generate } from 'escodegen';
import {  walk } from 'estree-walker';
import { temporaryFile } from 'tempy';

/**
 *
 * @param {import( 'rollup' ).AcornNode} node
 * @param {import( './index.js' ).MacroMap} macros
 * @param {import( 'rollup' ).TransformPluginContext[ 'parse' ]} parse
 * @returns {Promise<void>}
 */
async function handleCallExpression( node, macros, parse ) {
	const allowedArgNodeTypes = [
		'Literal',
		'ObjectExpression',
		'ArrayExpression'
	];
	const name = node.callee.name;
	if ( !macros.has( name ) ) {
		return;
	}

	const macro = macros.get( name );
	const args = node.arguments;
	const isSupported = args.every( ( { type } ) => {
		return allowedArgNodeTypes.includes( type );
	} );

	if ( !isSupported ) {
		throw new Error( 'Only macros with arguments of primitive types, object and arrays are supported currently.' );
	}

	const macroResult = await executeMacro( macro, args );
	const macroResultAST = parse( `( ${ JSON.stringify( macroResult ) } )` );
	const expression = getValueNode( macroResultAST );

	this.replace( expression );
}

/**
 * @param {import( './index.js' ).Macro} macro
 * @param {Array<unknown>} args
 * @returns {Promise<unknown>}
 */
async function executeMacro( { name, path }, args ) {
	const alias = name === 'default' ? 'tempName' : name;
	const formattedArgs = args.map( ( node ) => {
		return generate( node );
	} ).join( ', ' );
	const code = `import { parentPort } from 'node:worker_threads';
	import { ${ name } as ${ alias } } from '${ path }';

	const result = await ${ alias }( ${ formattedArgs } );

	parentPort.postMessage( result );`;

	const workerFilePath = temporaryFile( {
		extension: 'mjs'
	} );

	await writeFile( workerFilePath, code, 'utf-8' );

	return new Promise( ( resolve, reject ) => {
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

/**
 *
 * @param {import( 'rollup' ).AcornNode} node
 * @returns {import( 'rollup' ).AcornNode | null}
 */
function getValueNode( node ) {
	const allowedNodeTypes = [
		'Literal',
		'ObjectExpression',
		'ArrayExpression'
	];
	let valueNode;

	walk( node, {
		enter( node ) {
			if ( !allowedNodeTypes.includes( node.type ) ) {
				return;
			}

			valueNode = node;
			this.skip();
		}
	} );

	return valueNode;
}

export default handleCallExpression;
