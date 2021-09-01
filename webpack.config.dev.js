import ExtractTextPlugin from "extract-text-webpack-plugin";
import "babel-polyfill"
import path from "path";

import webpack from "webpack";

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        bundle: [
            'babel-polyfill',
            'webpack-hot-middleware/client',
            path.resolve(__dirname, './src/front/index')
        ],
        admin: [
            'babel-polyfill',
            'webpack-hot-middleware/client',
            path.resolve(__dirname, './src/admin/index')
        ],
        admin_css:[
            path.resolve(__dirname, './static/css/admin.less')
        ],
        front_css:[
            path.resolve(__dirname, './static/css/front.less')
        ]
    },
    output: {
        path: path.resolve(__dirname, './static/dist'),
        filename: "[name].js",
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
            }
        }),
        new ExtractTextPlugin({
            filename: "css/[name].css"
        })
    ],
    module: {
        noParse: [/jszip.js$/],
        rules: [
            {
                test: /\.(js|jsx)?$/,
                include: [path.resolve(__dirname, './src/admin'),path.resolve(__dirname, './src/front')],
                loaders: ['react-hot-loader/webpack', 'babel-loader']
            },
            {
                test: /\.less$/, use: ExtractTextPlugin.extract({
                    use: ["css-loader", {loader: "less-loader", options: {javascriptEnabled: true}}]
                })
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
