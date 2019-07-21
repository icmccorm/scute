const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var paths = require('./paths.js');

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: '[name].[contentHash].js',
        path: paths.dist
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Title',
            template: './public/index.html'
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
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                include: paths.src,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                include: paths.src,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(jpg|gif|png|svg)$/,
                include: paths.src,
                use: ['file-loader']
            },
            {
                test: /\.tsx?$/,
                include: paths.src,
                exclude: /node-modules/,
                use: 'babel-loader',

            }
        ],
    },
    resolve: {
        extensions: ['*', '.js', '.ts', '.tsx', '.jsx']
    }
}