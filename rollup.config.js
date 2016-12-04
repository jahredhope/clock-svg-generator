const babel = require('rollup-plugin-babel')

module.exports = {
  entry: 'index.js',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ],
  dest: 'output.js'
};
