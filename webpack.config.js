const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = (env, argv) => {
  return {
    entry: './src/index.js',
    output: { path: path.resolve(__dirname, 'build'), filename: '[name].bundle.js' },
    performance: { hints: false },
    module: {
      rules: [
        { test: /\.html$/, loader: 'html-loader' },
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          // query: {
          //   cacheDirectory: true,
          //   presets: ['@babel/preset-react'],
          //   plugins: ['@babel/plugin-transform-runtime']
          // }
        },
        {
          test: /\.s?[ac]ss$/,
          use: [
            'style-loader',
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { sourceMap: true, esModule: false } },
            { loader: 'sass-loader', options: { sourceMap: true, esModule: false   } }
          ]
        },
        {
          test: /\.css$/i,
          exclude: /node_modules/,
          loader: 'css-loader',
          options: { modules: { localIdentName: '../public/img--./img' } }
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          use: [{ loader: 'file-loader', options: { name: './img/[name].[hash].[ext]' } }]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: { name: '[name].[hash].[ext]' }
        }
      ]
    },
    resolve: { extensions: ['.js', '.jsx'] },
    devtool: argv.mode === 'development' ? 'eval-source-map' : '',
    devServer: {
      'static': {
        directory: './dist'
      }
    },
    plugins: [
      new LodashModuleReplacementPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
        'process.env.active': `${JSON.stringify(env)}`
      }),
      // new webpack.DefinePlugin({ 'process.env.NODE_ENV': `${JSON.stringify(argv.mode)}` }),

      new MiniCssExtractPlugin({ filename: '[name].css' }),
      new HtmlWebpackPlugin({
        inject: true,
        filename: 'index.html',
        template: './public/index.html'
      })
    ],
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: { test: /[\\\/]node_modules[\\\/]/, name: 'vendors', chunks: 'all' }
        }
      }
    }
  };
};
