import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import isBuiltinModule from 'is-builtin-module';

const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies);

process.env.BABEL_ENV = 'rollup';

const base = {
  external: id => isBuiltinModule(id) || external.some(m => id.split('/')[0] === m),
  plugins: [
    babel(),
    nodeResolve(),
  ],
};

const plugin = {
  ...base,
  input: 'src/index.js',
  output: [{
    file: pkg.main,
    exports: 'default',
    format: 'cjs',
    sourcemap: true,
  }, {
    file: pkg.module,
    format: 'es',
    sourcemap: true,
  }],
};

const client = {
  ...base,
  input: 'src/client.js',
  output: [{
    file: `dist/${pkg.name}.client.js`,
    exports: 'default',
    format: 'cjs',
    sourcemap: true,
  }, {
    file: `dist/${pkg.name}.client.es.js`,
    format: 'es',
    sourcemap: true,
  }],
};

const bin = {
  ...base,
  input: 'src/bin.js',
  output: [{
    file: `dist/${pkg.name}.bin.js`,
    format: 'cjs',
    sourcemap: true,
  }],
};

export default [plugin, client, bin];
