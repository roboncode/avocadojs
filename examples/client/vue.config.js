// const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
module.exports = {
  devServer: {
    proxy: 'http://localhost:3000'
  },
  // runtimeCompiler: true,
  // configureWebpack: {
  //   plugins: [
  //     new VuetifyLoaderPlugin()
  //   ]
  // }
}