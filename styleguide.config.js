const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const vueLoader = require("vue-loader");
const path = require("path");
const assetsPath = function(_path) {
    const assetsSubDirectory = "public";
    return path.posix.join(assetsSubDirectory, _path);
};

function resolve(dir) {
    return path.join(__dirname, "..", dir);
}

module.exports = {
    // set your styleguidist configuration here
    title: "组件api文档",
    styles: {
        StyleGuide: {
            root: {
                " & article": {
                    background: "#996",
                },
            },
        },
    },
    pagePerSection: true,
    copyCodeButton: true,
    // gis依赖
    template: {
        head: {
            links: [{
                href: "./public/deps/gis-lib/ol/ol.css",
                rel: "stylesheet",
            }],
            scripts: [{
                src: "./public/deps/jquery-1.11.2.js",
                type: "text/javascript",
            }, {
                src: "./public/deps/echarts.js",
                type: "text/javascript",
            }, {
                src: "./public/deps/gis-lib/proj4.js",
                type: "text/javascript",
            }, {
                src: "./public/deps/gis-lib/ol/ol.js",
                type: "text/javascript",
            }, {
                src: "./public/deps/ts-gis/g2-2d.umd.js",
                type: "text/javascript",
            }, {
                src: "./public/deps/gis-lib/javascript.util.js",
                type: "text/javascript",
            }, {
                src: "./public/deps/gis-lib/jsts.min.js",
                type: "text/javascript",
            }, {
                src: "./public/deps/ts-emap/tsemap.js",
                type: "text/javascript",
            }, {
                src: "./public/configDemo/mapConfig.js",
                type: "text/javascript",
            }, {
                src: "./public/deps/playctrl64/Decoder.js",
                type: "text/javascript",
            }, {
                src: "./public/deps/playctrl32/Decoder.js",
                type: "text/javascript",
            }, {
                src: "./public/deps/h5player.min.js",
                type: "text/javascript",
            }],
        },
    },
    defaultExample: true,
    sections: [{
            name: "基础",
            sections: [{
                    name: "基础UI组件",
                    components: ["src/components/common/vedio/[A-Z]*.vue", "src/components/common/panel/[A-Z]*.vue"],
                },
                {
                    name: "基础GIS组件",
                    components: "src/components/feature/GIS/**/[A-Z]*.vue",
                },
            ],
        },
        {
            name: "通用业务",
            sections: [{
                    name: "通用UI组件",
                    components: "src/components/feature/common/**/[A-Z]*.vue",
                },
                {
                    name: "通用GIS组件",
                    components: "src/components/feature/commonGIS/**/[A-Z]*.vue",
                },
            ],
        },
        {
            name: "台风专题组件",
            sections: [{
                    name: "台风UI组件",
                    components: "src/components/feature/typhoon/**/[A-Z]*.vue",
                },
                {
                    name: "台风GIS组件",
                    components: "src/components/feature/typhoonGIS/**/[A-Z]*.vue",
                },
            ],
        },
        {
            name: "地震专题组件",
            sections: [{
                    name: "地震UI组件",
                    components: "src/components/feature/earthquake/**/[A-Z]*.vue",
                },
                {
                    name: "地震GIS组件",
                    components: "src/components/feature/earthquakeGIS/**/[A-Z]*.vue",
                },
            ],
        },
    ],
    require: [
        path.join(__dirname, "global.requires.js"),
    ],
    // webpackConfig: {
    //     module: {
    //         rules: [{
    //                 test: /\.vue$/,
    //                 loader: "vue-loader",
    //                 options: {
    //                     loaders: {
    //                         scss: ["vue-style-loader", "css-loader", "less-loader"],
    //                     },
    //                 },
    //             },
    //             {
    //                 test: /\.(css?|scss)(\?.*)?$/,
    //                 loader: "style-loader!css-loader!less-loader",
    //             },
    //         ],
    //     },
    //     plugins: [new vueLoader.VueLoaderPlugin()],

    // }, ;
    // webpackConfig: {
    //     module: {
    //         rules: [{
    //                 test: /\.css$/,
    //                 loader: ["vue-style-loader", "style-loader", "css-loader"],
    //             },
    //             {
    //                 test: /\.vue$/,
    //                 loader: "vue-loader",
    //             },
    //             {
    //                 test: /\.svg$/,
    //                 loader: "svg-sprite-loader",
    //                 include: [resolve("src/icons")],
    //                 options: {
    //                     symbolId: "icon-[name]",
    //                 },
    //             },
    //             {
    //                 test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    //                 loader: "url-loader",
    //                 exclude: [resolve("src/icons")],
    //                 options: {
    //                     limit: 10000,
    //                     name: assetsPath("img/[name].[hash:7].[ext]"),
    //                 },
    //             },
    //             {
    //                 test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    //                 loader: "url-loader",
    //                 options: {
    //                     limit: 10000,
    //                     name: assetsPath("media/[name].[hash:7].[ext]"),
    //                 },
    //             },
    //             {
    //                 test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    //                 loader: "url-loader",
    //                 options: {
    //                     limit: 10000,
    //                     name: assetsPath("fonts/[name].[hash:7].[ext]"),
    //                 },
    //             },

    //         ],
    //     },

    // },
};