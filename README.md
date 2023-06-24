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
import macros from '@comandeer/rollup-plugin-macros;

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

## How does it work?

## License

See [LICENSE](./LICENSE) file for details.
