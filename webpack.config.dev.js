import webpack from 'webpack';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

console.log('What environment', isDevelopment);

export default {
    devtool: 'inline-source-map',
    mode: 'development',
    entry: [
        // 'babel-polyfill',
        'webpack-hot-middleware/client?reload=true', // note that it reloads the page if hot module reloading fails.
        path.resolve(__dirname, 'client/index')
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
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new webpack.DefinePlugin({
            'process.env.SECRET': JSON.stringify(process.env.SECRET)
        })
    ],

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    plugins: [
                        '@babel/plugin-syntax-dynamic-import',
                        '@babel/plugin-proposal-class-properties'
                    ]
                }
            },
            {
                // Apply rule for .sass, .scss or .css files
                test: /\.(sa|sc|c)ss$/,

                // Set loaders to transform files.
                // Loaders are applying from right to left(!)
                // The first loader will be applied after others
                loader: [
                    'style-loader',
                    'css-loader',
                    // MiniCssExtractPlugin.loader,
                    'sass-loader'
                ]
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader'
            },
            {
                test: /\.(jpe?g|png|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 25000
                }
            }
        ]
    }
};
