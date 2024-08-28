const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
// crypto problem solved here

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin()
    ]
  }

})