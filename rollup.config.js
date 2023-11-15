/* eslint-disable no-restricted-syntax */
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import terser from '@rollup/plugin-terser';

import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default [
  {
    input: 'src/base.ts',
    output: [
      {
        file: 'lib/sdk.js',
        format: 'iife',
        name: 'ApptentiveBase',
        sourcemap: true,
      },
      {
        file: 'lib/sdk.min.mjs',
        format: 'es',
        name: 'ApptentiveBase',
        sourcemap: false,
        plugins: [
          terser({
            keep_classnames: true,
            keep_fnames: true,
          }),
        ],
      },
      {
        file: 'lib/sdk.min.js',
        format: 'iife',
        name: 'ApptentiveBase',
        sourcemap: false,
        plugins: [
          terser({
            keep_classnames: true,
            keep_fnames: true,
          }),
        ],
      },
    ],
    plugins: [
      nodeResolve({ extensions }),
      commonjs(),
      json({
        exclude: ['node_modules/**'],
      }),
      babel({
        babelHelpers: 'bundled',
        extensions,
        include: ['src/**/*', 'node_modules/localstorage-fifo/**/*', 'node_modules/ky/**/*'],
        plugins: [],
      }),
      cleanup({
        comments: 'none',
      }),
    ],
  },
  {
    input: 'init/init.js',
    output: [
      {
        file: 'lib/init.js',
        format: 'es',
        name: 'ApptentiveBase',
      },
      {
        file: 'lib/init.min.js',
        format: 'es',
        name: 'ApptentiveBase',
        plugins: [terser()],
      },
    ],
    plugins: [
      json({
        exclude: ['node_modules/**'],
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        plugins: [],
      }),
    ],
  },
];
