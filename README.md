# @comandeer/rollup-plugin-macros

[![Build Status](https://github.com/Comandeer/rollup-plugin-macros/workflows/CI/badge.svg)](https://github.com/Comandeer/rollup-plugin-macros/actions) [![codecov](https://codecov.io/gh/Comandeer/rollup-plugin-macros/branch/main/graph/badge.svg)](https://codecov.io/gh/Comandeer/rollup-plugin-macros) [![npm (scoped)](https://img.shields.io/npm/v/@comandeer/rollup-plugin-macros.svg)](https://npmjs.com/package/@comandeer/rollup-plugin-macros)

Experimental port of [Bun macros](https://bun.sh/blog/bun-macros) into [Rollup.js](https://rollupjs.org/).

## Installation

```bash
npm install @comandeer/rollup-plugin-macros --save-dev
```

## Usage

Add it to your Rollup.js configuration:

```javascript
import macros from '@comandeer/rollup-plugin-macros';

export default {
    input: './src/index.js',
    output: [
		{ file: './dist/bundle.js', format: 'es' }
	],
    plugins: [
		macros()
	],
};

export default config;
```

Now you can create a module with a macro, e.g. `random.js`:

```javascript
function random() {
	return Math.random();
}

export { random };
```

And then import it in your code with appropriate import attribute:

```javascript
import { random } from './random.js' with { type: 'macro' };
// or using the older syntax
// import { random } from './random.js' assert { type: 'macro' };

console.log( random() );
```

After bundling the code with Rollup the import will be removed and the `random()` call replaced with an actual value returned by the macro:

```javascript
console.log(0.7507075485199182);
```

## How does it work?

I've written a [detailed article in Polish](https://blog.comandeer.pl/makrony.html) about inner workings of this package.

## License

See [LICENSE](./LICENSE) file for details.
