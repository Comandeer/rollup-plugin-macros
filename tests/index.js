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
	fixture: resolvePath( fixturesPath, 'named-import-no-arguments.js' ),
	expected: 'console.log(42);'
} );

test( 'inlining results of several named imports without arguments', assertBundle, {
	fixture: resolvePath( fixturesPath, 'multiple-named-imports-no-arguments.js' ),
	expected: `console.log(1);
console.log(true);`
} );

test(
	'inlining an object result of a single named import without arguments',
	assertBundle,
	{
		fixture: resolvePath( fixturesPath, 'named-import-no-arguments-object.js' ),
		expected: 'console.log({ \'a\': true });'
	}
);

test( 'inlining result of a default import without arguments', assertBundle, {
	fixture: resolvePath( fixturesPath, 'default-import-no-arguments.js' ),
	expected: 'console.log(42);'
} );

test( 'old assert syntax is correctly recognized', assertBundle, {
	fixture: resolvePath( fixturesPath, 'old-syntax.js' ),
	expected: 'console.log(42);'
} );
