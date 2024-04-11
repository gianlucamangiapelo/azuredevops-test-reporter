import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'

const esmConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/esm/index.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: './config/tsconfig.esm.json',
    }),
  ],
  external: (id) => /node_modules/.test(id),
}

const cjsConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
    },
  ],
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: './config/tsconfig.cjs.json',
    }),
  ],
  external: (id) => /node_modules/.test(id),
}

export default [esmConfig, cjsConfig]
