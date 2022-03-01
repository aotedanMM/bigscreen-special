// const globalPathEnv = require('./env');
// const globalPathBuild = require('./build');

// 为解决ie不支持 ，改成目前这么方式
if (process.env.NODE_ENV === 'production') {
    module.exports = {
        jsonPath: './',
        servePath: "http://172.17.38.79:8081/",
        webSocketServer: 'ws://172.17.38.79:8080/ws'
    }
} else {
    module.exports = {
        jsonPath: '/',
        servePath: 'http://172.17.38.79:8081/',
        webSocketServer: 'ws://172.17.38.79:8080/ws'
    }
}