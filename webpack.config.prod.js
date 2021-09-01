let path = require('path');
let webpack = require('webpack');
let CleanPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    mode: 'production',
    entry:  {
        bundle : [
            './src/front/index'
        ],
        admin: [
            './src/admin/index'
        ],
        admin_css:[
            './static/css/admin.less'
        ],
        front_css:[
            './static/css/front.less'
        ]
    },
    output: {
        path: path.resolve(__dirname, './static/dist'),
        filename: "[name].js",
        publicPath: '/dist/'
    },
    plugins: [
        new CleanPlugin('./static/dist', {verbose: true}),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new MiniCssExtractPlugin({
            filename: '[name].min.css',
            chunkFilename: '[id].min.css',
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    ecma: 6,
                },
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
    },
    module: {
        noParse: [/jszip.js$/],
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                include: [path.resolve(__dirname, './src/admin'),path.resolve(__dirname, './src/front')],
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {loader: "style-loader"}, {loader: "css-loader"}
                ]
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?[\s\S]+)?$/,
                loader: "url-loader?limit=10000&name=fonts/[name].[ext]"
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            }
        ]
    }
};
