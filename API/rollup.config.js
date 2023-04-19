const typescript = require('@rollup/plugin-typescript');
const nodeResolve = require('@rollup/plugin-node-resolve');
const commonJS = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
// import { terser } from 'rollup-plugin-terser';

module.exports = {
  input: 'index.ts',
  output: {
    file: 'dist/bundle.mjs',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    commonJS(),
    typescript({
      target: 'es6',
      sourceMap: true,
    }),
    json(),
    // terser(),
  ],
  external: [],
};
