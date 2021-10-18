// https://github.com/rollup/rollup-starter-lib/blob/typescript/rollup.config.js
import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import pkg from './package.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default defineConfig([
	// Server
	{
		input: 'src/backend/server.ts',
		plugins: [
			nodeResolve({ extensions }),   // so Rollup can find node modules
			babel({ babelHelpers: 'bundled', extensions }),
			commonjs({ extensions }),      // so Rollup can convert node modules to an ES modules
		],
		output: [
			{ file: pkg.bin['rprg-server'], format: 'cjs', banner: '#!/usr/bin/env node' },
		],
		external: [],
	},
	// ETL
	{
		input: 'src/backend/data-etl.ts',
		plugins: [
			nodeResolve({ extensions }),   // so Rollup can find node modules
			babel({ babelHelpers: 'bundled', extensions }),
			commonjs({ extensions }),      // so Rollup can convert node modules to an ES modules
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
			nodeResolve({ extensions }),   // so Rollup can find node modules
			babel({ babelHelpers: 'bundled', extensions }),
			commonjs({ extensions }),      // so Rollup can convert node modules to an ES modules
		],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
		external: ['react'],
	},
]);