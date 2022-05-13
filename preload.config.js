const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env) => ({
    mode: env.isProduction ? 'production' : 'development',
    entry: {
      'user': path.resolve(__dirname, 'src/preload/user.ts'),
    },
    output: {
      path: path.resolve(__dirname, 'build/preload'),
      filename: '[name].js'
    },    
    target: 'electron-preload',
    module: {
      rules: [{
        test: /\.ts$/,
        exclude: ['/node_modules/'],
        loader: 'ts-loader'
      }]
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },    
  devtool: false,
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    modules: ['src', 'node_modules'],    
  }    
})
;