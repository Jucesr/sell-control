const path = require('path');

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.join(__dirname, 'public', 'dist'),
    filename: 'app.js',
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
      use: [{
                loader: "style-loader" // translates CSS into CommonJS
            },{
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]
    }]
  },
  devtool: 'inline-source-map',
  devServer: {
      contentBase: path.join(__dirname, 'public'),
      historyApiFallback: true,
      publicPath: '/dist/'
    }

}
