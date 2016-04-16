const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

const env = process.env.NODE_ENV || 'development'
const __DEV__ = env === 'development'
const __STAG__ = env === 'staging'
const __TEST__ = env === 'test'
const __PROD__ = env === 'production'

const __BASE__ = __PROD__ ? '/arena/' : '/'

const rootPath = (...paths) => path.resolve(__dirname, ...paths)
const srcPath = (...paths) => rootPath('src', ...paths)
const assetsPath = (...paths) => srcPath('assets', ...paths)

const config = {
  entry: __DEV__ ? [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'webpack/hot/only-dev-server',
    srcPath('index.js'),
  ] : [
    srcPath('index.js'),
  ],
  output: {
    publicPath: __BASE__,
    path: 'dist',
    pathinfo: true,
    filename: '[name].[hash].js',
  },
  module: {},
}

// ----------------------------------------
// Loaders
// ----------------------------------------
config.module.loaders = [
  {
    test: /\.js[x]?$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    query: {
      presets: [
        'es2015',
        'stage-0',
        'react',
      ],
      plugins: [
        'transform-decorators-legacy',
      ],
    }
  },
  {
    test: /\.json$/,
    exclude: /node_modules/,
    loader: 'json'
  },
  {
    test: /\.(otf|eot|ttf|woff|png|jpe?g|txt)/i,
    loader: 'url-loader?limit=8192'
  },
  {
    test: /\.svg$/,
    exclude: /node_modules/,
    loader: 'raw-loader'
  },
  {
    test: /\.[s]?css$/,
    exclude: /node_modules/,
    loader: 'style-loader!css-loader!sass-loader'
  }
]

// ----------------------------------------
// Plugins
// ----------------------------------------
config.plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(env)
    },
    __BASE__: JSON.stringify(__BASE__),
    __DEV__,
    __STAG__,
    __TEST__,
    __PROD__,
  }),
  new HtmlWebpackPlugin({
    template: srcPath('index.html'),
    filename: 'index.html',
    inject: 'body'
  }),
  new FaviconsWebpackPlugin({
    logo: assetsPath('logo.png'),     // Your source logo
    emitStats: false,                 // Emit all stats of the generated icons
    persistentCache: true,            // Generate cache with control hashes, don't rebuild favicons until hashes change
    inject: true,                     // Inject the html into the html-webpack-plugin
    background: '#fff',               // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
    title: 'Arena',                   // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
    icons: {
      android: false,                 // Create Android homescreen icon
      appleIcon: false,               // Create Apple touch icons
      appleStartup: false,            // Create Apple startup images
      coast: false,                   // Create Opera Coast icon
      favicons: true,                 // Create regular favicons
      firefox: false,                 // Create Firefox OS icons
      opengraph: false,               // Create Facebook OpenGraph image
      twitter: true,                  // Create Twitter Summary Card image
      windows: false,                 // Create Windows 8 tile icons
      yandex: false,                  // Create Yandex browser icon
    }
  }),
]

if (__DEV__) {
  config.plugins = [
    ...config.plugins,
    new webpack.HotModuleReplacementPlugin(),
  ]
}

if (__PROD__) {
  config.plugins = [
    ...config.plugins,
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      }
    })
  ]
}
// ----------------------------------------
// Devtool
// ----------------------------------------
if (__DEV__) {
  config.devtool = 'cheap-eval-module-source-map'
}

// ----------------------------------------
// DevServer
// ----------------------------------------
if (__DEV__) {
  config.devServer = {
    contentBase: config.output.path,
    stats: {
      hash: false,            // the hash of the compilation
      version: false,         // webpack version info
      timings: true,          // timing info
      assets: true,           // assets info
      chunks: false,          // chunk info
      colors: true,           // with console colors
      chunkModules: false,    // built modules info to chunk info
      modules: false,         // built modules info
      cached: false,          // also info about cached (not built) modules
      reasons: false,         // info about the reasons modules are included
      source: false,          // the source code of modules
      errorDetails: true,     // details to errors (like resolving log)
      chunkOrigins: false,    // the origins of chunks and chunk merging info
      modulesSort: '',        // (string) sort the modules by that field
      chunksSort: '',         // (string) sort the chunks by that field
      assetsSort: '',         // (string) sort the assets by that field
    },
    historyApiFallback: {
      index: '/',
    },
    hot: true,
  }
}

module.exports = config
