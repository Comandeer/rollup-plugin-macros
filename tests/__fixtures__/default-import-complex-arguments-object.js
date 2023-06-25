import doSomethingOnArrayAndObject from './macros/do-something-on-array-and-object.js' with { type: 'macro' };

console.log( doSomethingOnArrayAndObject( [ 2, true ], {
	a: 1,
	b: [ 1 ],
	c: {}
} ) );
