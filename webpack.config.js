const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const srcDir = __dirname + '/src'
const distDir = __dirname + '/dist'

var config = {
    context: srcDir,
    entry: {
        app: './app.js',
    },
    output: {
        path: distDir,
        filename: 'bundle.js',
    },
    devServer: {
        contentBase: srcDir,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }]
            },
            {
                test:/\.(s*)css$/,
                use: ExtractTextPlugin.extract({
                    fallback:'style-loader',
                    use:['css-loader','sass-loader'],
                })
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            filename: 'index.html',
            template: srcDir + '/index.html',
        }),
        new CopyWebpackPlugin([
            {
                from: {
                    glob: srcDir + '/assets/shapefiles/**/*',
                    dot: true
                },
                to: distDir
            }
        ]),
        new ExtractTextPlugin({ filename: 'assets/css/app.css' })
    ]
}

module.exports = config
