const path = require('path');

const { NODE_ENV } = process.env;

if (NODE_ENV !== 'development') {
  throw new Error(`
  NODE_ENV is not in development!

  NODE_ENV === ${NODE_ENV}
  `);
}

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'devApp.js'),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '../', 'devServer/build/public')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|dist)/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
      }
    ]
  }
};
