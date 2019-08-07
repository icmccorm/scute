const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var paths = require('./paths.js');

module.exports = {
    entry: ["./src/index.tsx"],
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
                test: /\.css$/,
                include: paths.src,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.tsx?$/,
                exclude: [/node-modules/, /\.(js|jsx)$/],
                use: 'babel-loader',
            }
        ],
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    }
}