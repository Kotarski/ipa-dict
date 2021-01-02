
const nodeExternals = require('webpack-node-externals');
const glob = require("glob");
const path = require("path");

const entries = Object.fromEntries(glob.sync("./generated_entries/*.js").map(entryPath => [path.basename(entryPath, '.js'), entryPath]));;

module.exports = {
    mode: "production",
    entry: entries,
    output: {
        path: `${__dirname}/lib`,
        publicPath: `${__dirname}/lib`,
        filename: '[name].js',
        library: 'ipa-dict',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    resolve: {
        extensions: [".js"]
    },
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: [nodeExternals()],
    target: "node",
    optimization: {
        minimize: false,
    },
};