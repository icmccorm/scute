const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const paths = require('./paths.js');
module.exports = merge(common, {
    mode: 'production',
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
})