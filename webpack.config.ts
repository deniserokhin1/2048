import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import { buildDevServer } from './src/build/buildDevServer'
import { IBuildEnv } from './src/build/type'

export default (env: IBuildEnv) => {
    const port = env.port || 3000
    const isDev = env.mode || 'development' === 'development'

    console.log('isDev:', isDev)

    const config: webpack.Configuration = {
        entry: './src/index.ts',
        module: {
            rules: [
                {
                    test: /\.ts/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        output: {
            filename: '[name].[contenthash].js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
        },
        plugins: [
            new HtmlWebpackPlugin({ template: './src/index.html' }),
            new webpack.ProgressPlugin(),
        ],
        devtool: isDev ? 'inline-source-map' : undefined,
        devServer: isDev ? buildDevServer(port) : undefined,
        mode: env.mode || 'development',
    }
    return config
}
