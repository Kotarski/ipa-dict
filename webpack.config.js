const { CheckerPlugin } = require('awesome-typescript-loader')
// const WebpackShellPlugin = require('webpack-shell-plugin')
var nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: "development",
    entry: "./build/dev/generated/main.ts",
    output: {
        filename: "bundle.js",
        path: __dirname + "/build/dist"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                // Include ts, tsx, js, and jsx files.
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.(lz4)$/i,
                loader: 'file-loader',
                options: {
                    name: 'compressed/[name].[ext]',
                    publicPath: __dirname + "/build/dist"
                }
            }
        ]
    },
    plugins: [
        new CheckerPlugin()
        // new WebpackShellPlugin({
        //     onBuildStart: ['node src/generate/compress.js']
        // })
    ],

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: [nodeExternals()],
    target: "node"

};