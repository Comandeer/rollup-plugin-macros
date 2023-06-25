function doSomethingOnArrayAndObject( array, object ) {
	return {
		array: array.length,
		object: Object.keys( object ).length
	};
}

export default doSomethingOnArrayAndObject;
