const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const precss = require("precss");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

const pkg = require('./package.json');
const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
    src: path.join(__dirname, 'src'),
    dist: path.join(__dirname, 'dist'),
    style: path.join(__dirname, 'src/styles/main.scss'),
    build: path.join(__dirname, 'build')
};

const common = {
    entry: {
        src: PATHS.src,
        style: PATHS.style,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    "file-loader?hash=sha512&digest=hex&name=assets/[hash].[ext]",
                    {
                        loader: 'image-webpack-loader',
                        query: {
                            mozjpeg: {
                                progressive: true,
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            optipng: {
                                optimizationLevel: 4,
                            },
                            pngquant: {
                                quality: '75-90',
                                speed: 3,
                            },
                        },
                    }
                ]
            },
            {
                test: /\.scss|css$/,
                loader: "style-loader!css-loader!postcss-loader!resolve-url-loader!sass-loader?sourceMap"
            },
            {
                'test': /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?/,
                loader: 'url-loader',
                query: {
                    prefix: 'font/',
                    limit: 10000,
                    mimetype: 'application/font-woff',
                },
                // include: PATHS.fonts,
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?/,
                loader: 'url-loader',
                // include: PATHS.fonts,
            },
        ],
    },
    output: {
        path: PATHS.dist,
        filename: '[name].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'tdrocks mobx',
        }),
        new webpack.LoaderOptionsPlugin({
            test: /\.scss$/,
            debug: true,
            options: {
                postcss: function () {
                    return [precss, autoprefixer];
                },
                context: path.join(__dirname, "src"),
                output: { path: path.join(__dirname, "dist") }
            }
        }),
        new ForkCheckerPlugin()
    ],
};

// Default Config
if (TARGET === 'start' || !TARGET) {
    module.exports = merge(common, {
        devtool: 'eval-source-map',
        devServer: {
            contentBase: PATHS.dist,

            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,

            stats: 'errors-only',

            host: process.env.HOST,
            port: process.env.PORT,
        },
        module: {
            rules: [
                // Define dev-specific CSS setup
                {
                    test: /\.css$/,
                    loader: ['style-loader', 'css-loader'],
                    include: PATHS.src,
                },
                {
                    test: /\.tsx?$/,
                    loader: [
                        'react-hot-loader',
                        'awesome-typescript-loader',
                    ],
                    include: PATHS.src,
                },
            ],
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            // new NpmInstallPlugin({
            //     save: true,
            // }),
        ],
    });
}

if (TARGET === 'build') {
    module.exports = merge(common, {
        devtool: 'false',
        entry: {
            // flag all `package.json` dependencies as vendor files
            //BEWARE WHATS IN dependencies => NO @types etc 
            vendor: Object.keys(pkg.dependencies),
        },
        output: {
            path: PATHS.build,
            // filename: '[name].js',
            // Create a hash for each file in the build so we can detect which files have changed
            filename: '[name].[chunkhash].js',
            chunkFilename: '[chunkhash].js',
        },
        module: {
            rules: [
                // Extract CSS during the build process
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }),
                    include: PATHS.src,
                },
                {
                    test: /\.tsx?$/,
                    loader: 'awesome-typescript-loader',
                    include: PATHS.src,
                },
            ],
        },
        plugins: [
            // Clear the contents of the build directory before re-building
            new CleanWebpackPlugin(PATHS.dist),
            // Output extracted CSS to its own file
            // new ExtractTextPlugin('[name].css'),
            new ExtractTextPlugin('[name].[chunkhash].css'),
            // Split dependencies into a `vendor` file and provide a manifest

            // Use the `production` flag so we get full optimization from React when building
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"',
            }),
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false,
            }),

            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest'],
            }),
            // Minify the resulting bundle
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    screw_ie8: true,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true,
                },
                output: {
                    comments: false,
                },
            }),
        ]
    });
}
