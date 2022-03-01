'use strict'
const path = require('path')
const webpack = require('webpack')

/**
 * 打包文件前言
 * @param obj {Object} 说明，key-value形式
 * @returns {string}
 */
function getPreamble(obj) {
    var preamble = '\r\n';
    var date = new Date().toString();
    // 默认
    const blank = ' ';
    preamble += blank + date + '\r\n';
    for (let k in obj) {
        preamble += blank;
        if (k !== '//') {
            preamble += k + '：';
        }
        preamble += obj[k] + '\r\n';
    }
    return preamble;
}

// 输出文件描述

const description = getPreamble({
    'desc': '第一条线迁移的服务代码',
    'tag': new Date().getTime()
});

module.exports = {
    entry: [
        './public/json/oldserver/index.js'
    ],
    devtool: 'source-map',
    mode: 'development',
    // mode: 'production',
    output: {
        path: path.resolve(__dirname, './public/json/oldserver'),
        filename: 'oldserver.js',
        // 输出的形式
        libraryTarget: 'umd',
    },
    target: 'web',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    "presets": [
                        [
                          "@babel/preset-env",
                          {
                            "targets": {
                              "edge": "17",
                              "firefox": "60",
                              "chrome": "67",
                              "safari": "11.1",
                              "ie": "10"
                            }
                          }
                        ]
                      ]
                  }
                }
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: description
        })
    ],
    watch: false,
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1500
    }
}