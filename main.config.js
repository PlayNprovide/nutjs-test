const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env) => ({
    mode: env.isProduction ? 'production' : 'development',
    entry: {
      main : path.resolve(__dirname, 'src/main/index.ts')
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].js'
    },    
    target: 'electron-main',
    plugins: [
        // This is the important part for onoff to work
        new webpack.ExternalsPlugin('commonjs', [
          '@nut-tree/nut-js',
          '@nut-tree/template-matcher'
        ])
    ],    
    module: {
      rules: [{
        test: /\.ts$/,
        exclude: ['/node_modules/'],
        loader: 'ts-loader'
      }]
    },
    devtool: false,
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      modules: ['src', 'node_modules'],    
  },
  optimization: {
    // minimizer: [new UglifyJsPlugin()],
  },    
  })
;