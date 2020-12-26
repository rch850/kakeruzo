module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/kakeruzo/' : '/',
  devServer: {
    port: 9981,
    disableHostCheck: true
  },
  lintOnSave: false,
  outputDir: 'docs',
  assetsDir: './',
  publicPath: './'
}
