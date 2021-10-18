// https://github.com/rollup/rollup-starter-lib/blob/typescript/rollup.config.js
// https://rollupjs.org/guide/en/#--configplugin-plugin
// https://rollupjs.org/guide/en/#:~:text=plugins%3A%20%5Bresolve()%2C%20babel(%7B%20babelHelpers%3A%20%27bundled%27%20%7D)%5D
// https://rollupjs.org/guide/en/#:~:text=Note%20that%20most,the%20commonjs%20one.

import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import pkg from './package.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default defineConfig([
	// React component
	{
		input: 'src/index.ts',
		plugins: [
			typescript(),
			nodeResolve({ extensions }),   // so Rollup can find node modules
			commonjs({ extensions }),      // so Rollup can convert node modules to an ES modules
			babel({ babelHelpers: 'bundled', extensions }),
		],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
		external: ['react'],
	},
	// Server
	{
		input: 'src/backend/server.ts',
		plugins: [
			typescript(),
			nodeResolve({ extensions }),   // so Rollup can find node modules
			commonjs({ extensions }),      // so Rollup can convert node modules to an ES modules
			babel({ babelHelpers: 'bundled', extensions }),
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
			typescript(),
			nodeResolve(),   // so Rollup can find node modules
			commonjs(),      // so Rollup can convert node modules to an ES modules
			babel({ babelHelpers: 'inline' }),
		],
		output: [
			{ file: pkg.bin['rprg-post-install'], format: 'cjs', banner: '#!/usr/bin/env node' },
		],
		external: [],
	},
	// ETL
	{
		input: 'src/backend/data-etl.ts',
		plugins: [
			typescript(),
			json(),
			nodeResolve({ extensions }),   // so Rollup can find node modules
			commonjs({ extensions }),      // so Rollup can convert node modules to an ES modules
			babel({ babelHelpers: 'bundled', extensions }),
		],
		output: [
			{ file: pkg.bin['rprg-data-etl'], format: 'cjs', banner: '#!/usr/bin/env node' },
		],
		external: [],
	},
]);