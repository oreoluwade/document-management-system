import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production')
};

export default {
  devtool: 'source-map',
  entry: {
    bundle: path.resolve(__dirname, 'client/index')
  },
  target: 'web',
  output: {
    path: `${__dirname}/dist/`,
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new ExtractTextPlugin('styles.css'),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Hammer: 'hammerjs/hammer'
    })
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
          { loader: 'url?limit=10000&mimetype=application/font-woff' }
        ]
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: [
          { loader: 'url-loader' }
        ]
      }, {
        test: /materialize-css\/bin\//,
        use: [
          { loader: 'imports?jQuery=jquery,$=jquery,hammerjs' }
        ]
      },
     {
        test: /materialize-css\/bin\//,
        loader: 'imports?jQuery=jquery,$=jquery,hammerjs'
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css?sourceMap')
      }
    ]
  }
};
