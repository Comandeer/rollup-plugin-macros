import test from 'ava';
import plugin from '../src/index.js';

test( 'is a function', ( t ) => {
	t.is( typeof plugin, 'function' );
} );
