import webpack from 'webpack';
import path from 'path';

export default {
  devtool: 'inline-source-map',
  entry: [
    'babel-polyfill',
    'webpack-hot-middleware/client?reload=true', // note that it reloads the page if hot module reloading fails.
    path.resolve(__dirname, 'client/index.jsx')
  ],
  target: 'web',
  output: {
    path: `${__dirname}/dist`, // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'client')
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Hammer: 'hammerjs/hammer'
    }),
  ],

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: [
          path.join(__dirname, 'client'),
          path.join(__dirname, 'server')],
        loaders: ['babel-loader'],
      },
      {
        test: /(\.css)$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      }, {
        test: /\.(jpg|png|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 25000,
        },
      }, {
        test: /materialize-css\/bin\//,
        loader: 'imports?jQuery=jquery,$=jquery,hammerjs'
      },
    ]
  }
};
