import webpack from 'webpack';
import path from 'path';

export default {
  devtool: 'eval',
  entry: [
    path.resolve(__dirname, 'client/index.js')
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'client'),
    hot: true,
    noInfo: true,
    historyApiFallback: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Hammer: 'hammerjs/hammer'
    }),
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
      },
      {
        test: /materialize-css\/bin\//,
        use: [
          { loader: 'imports?jQuery=jquery,$=jquery,hammerjs' }
        ]
      },
    ]
  }
};
