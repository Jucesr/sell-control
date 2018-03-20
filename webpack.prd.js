//TODO:
//Check if there is a stable version of ExtractTextPlugin since webpack 4.0 is not working

const path = require('path');
const webpack = require('webpack');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CSSExtract = new ExtractTextPlugin('master.css');

module.exports = {
  entry: {
    app: './src/app.js'
  },
  output: {
    path: path.join(__dirname, 'public', 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },{
      test: /\.s?css$/,
      exclude: /node_modules/,
      use: CSSExtract.extract ({
        use: [{
                  loader: "css-loader" // translates CSS into CommonJS
              }, {
                  loader: "sass-loader" // compiles Sass to CSS
              }]
      })
    }]
  },
  plugins: [
    CSSExtract,
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js',
            minChunks (module) {
                return module.context && module.context.indexOf('node_modules') >= 0;
            }
        })
  ],
  devtool: 'source-map',
  devServer: {
      contentBase: path.join(__dirname, 'public'),
      historyApiFallback: true,
      publicPath: '/dist/'
    }

}
