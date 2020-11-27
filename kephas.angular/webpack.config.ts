import * as webpack from 'webpack'
import * as path from 'path';
import DtsBundlePlugin from 'webpack-dts-bundle';

const config: webpack.Configuration = {
    entry: {
        'index': './src/index.ts'
    },
    externals: {
        '@angular/common': '@angular/common',
        '@angular/common/http': '@angular/common/http',
        '@angular/core': '@angular/core',
        '@angular/forms': '@angular/forms',
        '@angular/platform-browser': '@angular/platform-browser',
        '@kephas/commands': '@kephas/commands',
        '@kephas/core': '@kephas/core',
        '@kephas/messaging': '@kephas/messaging',
        '@kephas/reflection': '@kephas/reflection',
        '@kephas/ui': '@kephas/ui',
        'reflect-metadata': 'reflect-metadata',
        'rxjs': 'rxjs',
        'rxjs/operators': 'rxjs/operators',
        'zone.js': 'zone.js',
        'tslib': 'tslib'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: '@kephas/angular',
        umdNamedDefine: true,
        globalObject: 'this'
    },
    mode: 'production',
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js']
    },
    optimization: {
        minimize: false,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader', // 'awesome-typescript-loader',
                exclude: [
                    /node_modules/,
                    /webpack/
                ]
            }
        ]
    },
    plugins: [
        new DtsBundlePlugin({
            name: '@kephas/angular',
            main: path.resolve(__dirname, './src/index.d.ts'),
            out: path.resolve(__dirname, './dist/index.d.ts'),
            verbose: true
        })
    ]
};

export default config;