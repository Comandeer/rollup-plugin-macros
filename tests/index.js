import { resolve as resolvePath } from 'node:path';
import test from 'ava';
import plugin from '../src/index.js';
import getDirName from './__helpers__/getDirName.js';
import assertBundle from './__helpers__/assertBundle.js';

const __dirname = getDirName( import.meta.url );

test( 'is a function', ( t ) => {
	t.is( typeof plugin, 'function' );
} );

test( 'inlining result of a single named import without arguments', assertBundle, {
	fixture: resolvePath( __dirname, './__fixtures__/named-export-no-arguments.js' ),
	expected: 'console.log(42);'
} );
