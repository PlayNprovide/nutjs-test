// trim out what you don't need
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


// const isProduction = process.env.NODE_ENV === 'production'

module.exports = (env) => {
  const stylesHandler = env.isProduction ? MiniCssExtractPlugin.loader : 'style-loader'

  const config = {
    mode: env.isProduction ? 'production' : 'development',
    entry: {
      index: path.resolve(__dirname, 'src/renderer/index.tsx')
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      // publicPath: '/',
      filename: '[name]-[contenthash].js'
    },
    // target: 'electron-renderer',
    plugins: [
      // new webpack.ExternalsPlugin('commonjs', ['win-select-folder']),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            globOptions: {
              // glob pattern
              ignore: ['**/index.html']
            }
          }
        ]
      }),
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        filename: 'index.html'
      }),
      new CleanWebpackPlugin()
      // new CopyWebpackPlugin({
      //   patterns: [{ from: 'public' }],
      // }),
      // Add your plugins here
      // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
      rules: [
        {
          test: /\.m?jsx?/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: ['@babel/plugin-proposal-object-rest-spread']
            }
          }
        },
        {
          test: /\.(ts|tsx)$/i,
          loader: 'ts-loader',
          exclude: ['/node_modules/']
        },
        {
          test: /\.css$/i,
          use: [stylesHandler, 'css-loader']
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
          type: 'asset'
        },
        {
          type: 'asset',
          resourceQuery: /url/ // *.svg?url
        },
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: ['@svgr/webpack']
        }

        // Add your rules for custom modules here
        // Learn more about loaders from https://webpack.js.org/loaders/
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      modules: ['src', 'node_modules'],
      alias: {
        '@Home': path.resolve(__dirname, 'src/views/home/'),
        '@Login': path.resolve(__dirname, 'src/views/login/'),
        '@Service': path.resolve(__dirname, 'src/views/service/')
      }
    },
    optimization: {
      nodeEnv: env.isProduction ? 'production' : 'development',
      // Setting optimization.runtimeChunk to true or 'multiple' adds an additional chunk containing only the runtime to each entrypoint.
      // The value 'single' instead creates a runtime file to be shared for all generated chunks.
      // https://webpack.js.org/configuration/optimization/#optimizationruntimechunk
      minimizer: [new UglifyJsPlugin()],
      runtimeChunk: {
        name: 'runtime'
      },
      // https://webpack.js.org/plugins/split-chunks-plugin/
      splitChunks: {
        chunks: 'all',
        // Minimum size, in bytes, for a chunk to be generated.
        minSize: 0,
        // By default webpack will generate names using origin and name of the chunk (e.g. vendors~main.js).
        automaticNameDelimiter: '~',
        cacheGroups: {
          // nm stands for node module which is custom
          nm: {
            test: /[/\\]node_modules[/\\]/,
            name: (module, chunks, cacheGroupKey) => {
              const packageName = module.context
                .match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                .replace('@', '')
              return `${cacheGroupKey}-${packageName}`
            }
          }
        }
      }
    }
  }

  if (env.isProduction) {
    config.plugins.push(new MiniCssExtractPlugin())
  } else {
    // https://webpack.js.org/configuration/devtool/#root
    config.devtool = 'inline-source-map'
    config.devServer = {
      // static: {
      //   directory: path.join(__dirname, 'dist'),
      // },
      historyApiFallback: { index: '/', disableDotRule: true },
      compress: true,
      // HMR
      hot: true,
      open: true,
      host: 'localhost',
      // headers: [
      //   {
      //     key: 'CUSTOM-COOKIE',
      //     value: '1'
      //   }
      // ]
    }
  }
  return config
}
