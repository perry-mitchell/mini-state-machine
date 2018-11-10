const path = require("path");

const SOURCE = path.resolve(__dirname, "./source");
const DIST = path.resolve(__dirname, "./dist");
const ENTRY = path.join(SOURCE, "index.js");

module.exports = [
    {
        entry: ENTRY,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        debug: true,
                                        targets: {
                                            node: 6
                                        }
                                    }
                                ]
                            ]
                        }
                    }
                }
            ]
        },
        output: {
            filename: "msm.node.js",
            path: DIST,
            libraryTarget: "commonjs"
        },
        target: "node"
    },
    {
        entry: ENTRY,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        debug: true,
                                        targets: {
                                            chrome: "58",
                                            ie: "11"
                                        }
                                    }
                                ]
                            ]
                        }
                    }
                }
            ]
        },
        output: {
            filename: "msm.web.js",
            path: DIST,
            library: "MSM",
            libraryTarget: "umd"
        },
        target: "web"
    }
];
