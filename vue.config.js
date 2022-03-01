const globalPath = require("./src/config/index.js");
const HappyPack = require("happypack");
const ModuleConcationPlugin = require("webpack/lib/optimize/ModuleConcatenationPlugin");
let path = require("path");

function resolve(dir) {
    return path.join(__dirname, "..", dir);
}

/**
 *
 *  配置前端代理，以及开发环境配置
 */
module.exports = {
    publicPath: globalPath.jsonPath,
    productionSourceMap: true,
    /**
     * 打包优化
     */
    configureWebpack: {
        plugins: [
            new HappyPack({
                id: "tsHappy",
                loaders: [{
                    loader: "ts-loader?cacheDirectory = true",
                }],
            }),
            new HappyPack({
                id: "vueHappy",
                loaders: [{
                    loader: "vue-loader?cacheDirectory = true",
                }],
            }),
            // new HappyPack({
            //     id: "fileHappy",
            //     loaders: [{
            //         loader: "file-loader?cacheDirectory = true",
            //     }],
            // }),
            new ModuleConcationPlugin(),
        ],
    },
    chainWebpack(config) {

        // const obj = config.module.rule('ts');
        // console.log(obj)
        console.log(config.module)
        config.module.rule("ts").use("ts-loader").loader("ts-loader?id=tsHappy");
        config.module.rule("vue").use("vue-loader").loader("vue-loader?id=vueHappy");
        // config.module.rule("images").use("file-loader").loader("file-loader?id=vueHappy");
        config.optimization.splitChunks({
            chunks: "all",
            maxInitialRequests: Infinity,
            minSize: 30000,
            automaticNameDelimiter: "-",
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        return `chunk.${packageName.replace("@", "")}`;
                    },
                    priority: 10,
                },
                commons: {
                    name: "chunk-commons",
                    test: path.resolve(__dirname, "src/components/common"),
                    priority: 5,
                },
                feature: {
                    name: "chunk-feature",
                    test: path.resolve(__dirname, "src/components/feature"),
                    priority: 6,
                },
            },
        });
        config.optimization.runtimeChunk("single");
    },
    devServer: {
        port: "8888",
        open: true,
        // proxy: {
        //     "/apis/*": {
        //         target: "http://172.17.38.202:8081",
        //         pathRewrite: {
        //             "/apis": "",
        //         },
        //     },
        //     "/mock/*": {
        //         target: "http://mock.gsafety.com/mock/",
        //         changeOrigin: true,
        //         pathRewrite: {
        //             "/mock": "",
        //         },
        //     },
        //     "/pushApi/*": {
        //         target: "http://192.168.0.138:8081",
        //         changeOrigin: true,
        //         pathRewrite: {
        //             "/pushApi": "",
        //         },
        //     },
        // },
    },
};