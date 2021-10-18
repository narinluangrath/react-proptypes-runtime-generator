// https://github.com/rollup/rollup-starter-lib/blob/typescript/rollup.config.js

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import pkg from './package.json';

export default [
	// Server
	{
		input: 'src/server.ts',
		plugins: [
			nodeResolve(),   // so Rollup can find node modules
			commonjs(),      // so Rollup can convert node modules to an ES modules
			typescript(),    // so Rollup can convert TypeScript to JavaScript
			babel({ babelHelpers: 'inline' }),
		],
		output: [
			{ file: pkg.bin['rprg-server'], format: 'cjs', banner: '#!/usr/bin/env node' },
		],
		external: [],
	},
	// Post install
	{
		input: 'src/post-install.ts',
		plugins: [
			nodeResolve(),   // so Rollup can find node modules
			commonjs(),      // so Rollup can convert node modules to an ES modules
			typescript(),    // so Rollup can convert TypeScript to JavaScript
			babel({ babelHelpers: 'inline' }),
		],
		output: [
			{ file: pkg.bin['rprg-post-install'], format: 'cjs', banner: '#!/usr/bin/env node' },
		],
		external: [],
	},
	// ETL
	{
		input: 'src/data-etl.ts',
		plugins: [
			nodeResolve(),   // so Rollup can find node modules
			commonjs(),      // so Rollup can convert node modules to an ES modules
			typescript(),    // so Rollup can convert TypeScript to JavaScript
			babel({ babelHelpers: 'inline' }),
		],
		output: [
			{ file: pkg.bin['rprg-data-etl'], format: 'cjs', banner: '#!/usr/bin/env node' },
		],
		external: [],
	},
	// React component
	{
		input: 'src/index.ts',
		plugins: [
			nodeResolve(),   // so Rollup can find node modules
			commonjs(),      // so Rollup can convert node modules to an ES modules
			typescript(),    // so Rollup can convert TypeScript to JavaScript
			babel({ babelHelpers: 'bundled' }),
		],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
		external: ['react'],
	},
];