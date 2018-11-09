const hash = require('hash-sum')

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const GasPlugin = require('gas-webpack-plugin')
const Es3ifyPlugin = require('es3ify-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const loaders = [
  { loader: 'thread-loader' },
  {
    loader: 'ts-loader',
    options: {
      configFile: 'tsconfig.gas.json',
      transpileOnly: true,
      happyPackMode: true
    }
  }
]

const cacheIdentifier = hash([
  require('typescript/package.json').version,
  require('ts-loader/package.json').version,
  require('cache-loader/package.json').version,
  require('./tsconfig.gas.json'),
  loaders,
  process.env.NODE_ENV
])

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: ['./script/Code.ts'],
  output: {
    path: __dirname + '/dist',
    filename: 'Code.js'
  },
  resolve: {
    extensions: ['.js', '.json', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: __dirname + '/node_modules/.cache/gas',
              cacheIdentifier
            }
          },
          ...loaders
        ]
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      tslint: false,
      formatter: 'codeframe',
      checkSyntacticErrors: true
    }),
    new GasPlugin(),
    new Es3ifyPlugin(),
    // copy appsscript.json to dist dir
    new CopyWebpackPlugin([__dirname + '/script/appsscript.json'])
  ],
  optimization: {
    minimize: false
  }
}