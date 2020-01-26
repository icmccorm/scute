const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var paths = require('./paths.js');
const isDevelopment = process.env.NODE_ENV === 'development'

module.exports = {
    entry: [paths.indexTSX],
    output: {
        filename: '[name].[contentHash].js',
        path: paths.dist
    },
    resolve:{
        extensions: ['.ts', '.tsx', '.js'],
        alias:{
            src: paths.src
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Title',
            template: paths.indexHTML
        })
    ],
    stats: {
        chunks: false,
        chunkOrigins: false,
        chunkGroups: false,
        chunkModules: false,
        children: false,
        env: false,
        performance: false,
        timings: false,
        cached: false,
        depth: false,
        modules: false,
        builtAt: false,
        version: false,
        assets: false,
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                }
            }
        },
        runtimeChunk: 'single',
        moduleIds: 'hashed',
    },
    module: {
        rules: [
            {
                type: "javascript/auto",
                exclude: [/node_modules/],
            },
            {
                test: /.tsx?$/,
                exclude: [/node_modules/],
                use: 'babel-loader',
            },
            {
                test: /\.wasm?$/,
                exclude: [/node_modules/],
                use: 'file-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                include: paths.src,
                use: [
                  // Creates `style` nodes from JS strings
                  'style-loader',
                  // Translates CSS into CommonJS
                  'css-loader',
                  // Compiles Sass to CSS
                  'sass-loader',
                ],
            },
        ],
    },
}