// https://github.com/rollup/rollup-starter-lib/blob/typescript/rollup.config.js

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import autoExternal from 'rollup-plugin-auto-external';
import { babel } from '@rollup/plugin-babel';
import pkg from './package.json';

export default [
	// browser-friendly UMD build
	{
		input: 'src/index.ts',
		output: {
			name: 'reactProptypesRuntimeGenerator',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			nodeResolve(),   // so Rollup can find `ms`
			commonjs(),      // so Rollup can convert `ms` to an ES module
			typescript(),    // so Rollup can convert TypeScript to JavaScript
			babel({ babelHelpers: 'bundled' }),
      autoExternal(),
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify 
	// `file` and `format` for each target)
	{
		input: 'src/index.ts',
		plugins: [
			typescript(), // so Rollup can convert TypeScript to JavaScript
			babel({ babelHelpers: 'bundled' }),
      autoExternal(),
		],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	},

	// Server
	{
		input: 'src/server.ts',
		plugins: [
			typescript(), // so Rollup can convert TypeScript to JavaScript
			babel({ babelHelpers: 'bundled' }),
		],
		output: [
			{ file: pkg.bin['rprg-server'], format: 'cjs', banner: '#!/usr/bin/env node' },
		],
	}
];