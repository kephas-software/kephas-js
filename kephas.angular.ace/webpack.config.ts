import * as webpack from 'webpack'
import * as path from 'path'
import DtsBundlePlugin from 'webpack-dts-bundle'

const config: webpack.Configuration = {
    entry: {
        'index': './src/index.ts'
    },
    externals: {
        "@angular/common": "@angular/common",
        "@angular/core": "@angular/core",
        "@angular/forms": "@angular/forms",
        "@angular/platform-browser": "@angular/platform-browser",
        "@kephas/angular": "@kephas/angular",
        "@kephas/core": "@kephas/core",
        "@kephas/reflection": "@kephas/reflection",
        "@kephas/ui": "@kephas/ui",
        "rxjs": "rxjs",
        "rxjs/operators": "rxjs/operators",
        "zone.js": "zone.js",
        "brace": "brace",
        "brace/theme/monokai": "brace/theme/monokai",
        "brace/mode/abap": "brace/mode/abap",
        "brace/mode/lua": "brace/mode/lua",
        "brace/mode/sh": "brace/mode/sh",
        "brace/mode/sql": "brace/mode/sql",
        "brace/mode/powershell": "brace/mode/powershell",
        "brace/mode/text": "brace/mode/text",
        "brace/mode/json": "brace/mode/json",
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: '@kephas/angular-ace',
        umdNamedDefine: true,
        globalObject: 'this'
    },
    mode: "production",
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
            name: '@kephas/angular-ace',
            main: path.resolve(__dirname, './src/index.d.ts'),
            out: path.resolve(__dirname, './dist/index.d.ts'),
            verbose: true
        })
    ]
};

export default config;