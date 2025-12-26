import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import url from '@rollup/plugin-url';
import postcss from 'rollup-plugin-postcss';
import postcssUrl from 'postcss-url';
import postcssImport from 'postcss-import';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: false,
        exports: 'named',
        inlineDynamicImports: true, // Inline dynamic imports để dùng single file
      },
      {
        file: 'dist/index.mjs',
        format: 'esm',
        sourcemap: false,
        exports: 'named',
        inlineDynamicImports: true, // Inline dynamic imports để dùng single file
      },
    ],
    plugins: [
      url({
        include: ['**/*.svg', '**/*.png', '**/*.jpg'],
        limit: 0,
        destDir: 'dist/assets',
      }),
      peerDepsExternal(),
      resolve({
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false, // Type definitions sẽ build riêng
        declarationMap: false,
      }),
      postcss({
        extract: true,
        minimize: true,
        sourceMap: false, // Tắt sourcemap cho CSS
        plugins: [
          postcssImport(),
          postcssUrl({
            url: 'inline',
          }),
        ],
      }),
      terser({
        compress: {
          drop_console: true, // Remove console.log
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info'],
        },
        format: {
          comments: false, // Remove comments
        },
      }),
    ],
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      // External các Lexical packages để không bundle
      /@lexical\/.*/,
      'lexical',
    ],
    onwarn(warning, warn) {
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
        return;
      }
      warn(warning);
    },
  },
  {
    input: 'src/index.ts',
    output: [{ dir: 'dist', entryFileNames: 'index.d.ts' }],
    plugins: [dts.default()],
    external: [/\.css$/],
  },
];
