import webpack from 'webpack';
import path from 'path';
// import HtmlWebpackPlugin from 'html-webpack-plugin';
// // import CleanWebpackPlugin from 'clean-webpack-plugin';

// const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
//   template: `${__dirname}/client/index.html`,
//   filename: 'index.html',
//   inject: 'body',
// });

export default {
  devtool: 'eval',
  entry: [
    path.resolve(__dirname, 'client/index.js')
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'client'),
    hot: true,
    historyApiFallback: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ],
      },
      {
        test: /(\.css)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          { loader: 'file-loader' }
        ]
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          { loader: 'url-loader?limit=10000&mimetype=application/font-woff' }
        ]
      },
      {
        test: /\.(jpg|png|svg|ttf)$/,
        use: [
          { loader: 'url-loader' }
        ]
      }, {
        test: /materialize-css\/bin\//,
        use: [
          { loader: 'imports?jQuery=jquery,$=jquery,hammerjs' }
        ]
      },
    ]
  }
};
