import path from 'path'
import babel from '@rollup/plugin-babel'
import resolve from "@rollup/plugin-node-resolve";
import json from '@rollup/plugin-json'
import multiInput from 'rollup-plugin-multi-input'
import terser from "@rollup/plugin-terser";
import glslify from 'rollup-plugin-glslify'
import copy from 'rollup-plugin-copy'

const root = process.platform === 'win32' ? path.resolve('/') : '/'
const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json']
const external = (id) => !id.startsWith('.') && !id.startsWith(root)

const getBabelOptions = ({ useESModules }) => ({
  babelrc: false,
  extensions,
  exclude: '**/node_modules/**',
  babelHelpers: 'runtime',
  presets: [
    [
      '@babel/preset-env',
      {
        include: [
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-nullish-coalescing-operator',
          '@babel/plugin-proposal-numeric-separator',
          '@babel/plugin-proposal-logical-assignment-operators',
        ],
        bugfixes: true,
        loose: true,
        modules: false,
        targets: '> 1%, not dead, not ie 11, not op_mini all',
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-proposal-nullish-coalescing-operator',
    ['@babel/transform-runtime', { regenerator: false, useESModules }],
  ],
})

export default [
  {
    input: ['src/**/*.ts', 'src/**/*.tsx', '!src/index.ts'],
    output: { dir: `dist`, format: 'esm' },
    external,
    plugins: [
      multiInput.default(),
      json(),
      glslify(),
      babel.default(getBabelOptions({ useESModules: true }, '>1%, not dead, not ie 11, not op_mini all')),
      resolve({ extensions },
        copy({
          targets: [{ src: 'assets/models', dest: 'dist/public' }]
        })),
    ],
  },
  {
    input: `./src/index.ts`,
    output: { dir: `dist`, format: 'esm' },
    external,
    plugins: [
      json(),
      glslify(),
      babel.default(getBabelOptions({ useESModules: true }, '>1%, not dead, not ie 11, not op_mini all')),
      resolve({ extensions },
        copy({
          targets: [{ src: 'assets/models', dest: 'dist/public' }]
        })),
    ],
    preserveModules: true,
  },
  {
    input: ['src/**/*.ts', 'src/**/*.tsx', '!src/index.ts'],
    output: { dir: `dist`, format: 'cjs' },
    external,
    plugins: [
      multiInput.default({
        transformOutputPath: (output) => output.replace(/\.[^/.]+$/, '.cjs.js'),
      }),
      json(),
      glslify(),
      babel.default(getBabelOptions({ useESModules: false })),
      resolve({ extensions }),
      terser(),
      copy({
        targets: [{ src: 'assets/models', dest: 'dist/public' }]
      })
    ],
  },
  {
    input: `./src/index.ts`,
    output: { file: `dist/index.cjs.js`, format: 'cjs' },
    external,
    plugins: [json(), glslify(), babel.default(getBabelOptions({ useESModules: false })), resolve({ extensions }), terser(),
      copy({
        targets: [{ src: 'assets/models', dest: 'dist/public' }]
      })],
  },
]