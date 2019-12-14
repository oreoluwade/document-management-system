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
        new webpack.optimize.UglifyJsPlugin()
    ],

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel']
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
            },
            {
                test: /\.(jpg|png|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 25000
                }
            },
            {
                test: /materialize-css\/bin\//,
                loader: 'imports?jQuery=jquery,$=jquery,hammerjs'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('css?sourceMap')
            }
        ]
    }
};
