import { resolve as resolvePath } from 'node:path';
import test from 'ava';
import plugin from '../src/index.js';
import getDirName from './__helpers__/getDirName.js';
import assertBundle from './__helpers__/assertBundle.js';

const __dirname = getDirName( import.meta.url );
const fixturesPath = resolvePath( __dirname, '__fixtures__' );

test( 'is a function', ( t ) => {
	t.is( typeof plugin, 'function' );
} );

test( 'inlining result of a single named import without arguments', assertBundle, {
	fixture: resolvePath( fixturesPath, 'named-export-no-arguments.js' ),
	expected: 'console.log(42);'
} );

test( 'inlining results of several named imports without arguments', assertBundle, {
	fixture: resolvePath( fixturesPath, 'multiple-named-exports-no-arguments.js' ),
	expected: `console.log(1);
console.log(true);`
} );

test( 'old assert syntax is correctly recognized', assertBundle, {
	fixture: resolvePath( fixturesPath, 'old-syntax.js' ),
	expected: 'console.log(42);'
} );
