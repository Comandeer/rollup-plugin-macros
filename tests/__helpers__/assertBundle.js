import { rollup } from 'rollup';
import plugin from '../../src/index.js';

/**
 * @typedef {Object} BundleAssertionOptions
 * @property {string} fixture Test fixture's path.
 * @property {string | RegExp} expected Expected code after bundling.
 */
/**
 *
 * @param {import( 'ava' ).ExecutionContext} t
 * @param {BundleAssertionOptions} options
 */
async function assertBundle( t, { fixture, expected } ) {
	const bundle = await rollup( {
		input: fixture,
		plugins: [
			plugin()
		]
	} );
	const bundledCode = await getCode( bundle );

	if ( typeof expected === 'string' ) {
		t.is( bundledCode, expected );
	} else {
		t.regex( bundledCode, expected );
	}
}

async function getCode( bundle ) {
	const { output } = await bundle.generate( {
		compact: true
	} );

	return output[ 0 ].code;
}

export default assertBundle;
