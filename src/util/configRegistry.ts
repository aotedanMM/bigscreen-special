
import $ from 'jquery';

const publishObjectPath: any = {
    serverPath: '',
};

Object.defineProperty(publishObjectPath, 'serverPath', {
    set(data: any) {
        this.value = data;
    },
});

const publicPath = require('../config/index').jsonPath;

function pathCallback() {
    $.ajax({
        url: publicPath + 'json/publishObjectPath.json',
        async: false,
        success(data: any) {
            publishObjectPath.serverPath = data;
            /**
             * 适配第一条线服务所依赖的全局变量
             */
            (window as any).EMAP_CONFIG = {
                common: {
                    mongoService: publishObjectPath.value.emapService,
                    GaoDeService: publishObjectPath.value.amap.server,
                    GaoDeKey: publishObjectPath.value.amap.key,
                    tempurl: publishObjectPath.value.tempurl,
                    urlWeb: publishObjectPath.value.urlWeb, // 在灾情研判指挥调度中有看到
                    Schedulurl: publishObjectPath.value.Schedulurl,
                    baidulabel: publishObjectPath.value.baidulabel,
                    resourceServer: publishObjectPath.value.floodServerPath,
                    socketRestUrl: publishObjectPath.value.socketRestUrl, // 为了适配二线展示屏回显到一线上操作屏
                    taijiQyhqUrl: publishObjectPath.value.taijiQyhqUrl, // 太极企业画像
                    videoService: publishObjectPath.value.videoService, // 海康视频播放地址
                    // downloadWordfile: publishObjectPath.value.downloadWordfile, //下载word文件
                    // weihuawulianIframe: publishObjectPath.value.weihuawulianIframe, // 危化物联
                },
            };
            // cb();
        },
    });
}
pathCallback();

export default publishObjectPath;
