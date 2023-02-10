// webpack.config.js
const { VueLoaderPlugin } = require('vue-loader')
const rules = require('./webpack.rules')

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin(),
  ],
}
