import BaseLayer from './BaseLayer';
// egis矢量瓦片接入
export default class EISVectorTile extends BaseLayer {
    private styleCache: any = {};
    private restHttp: any;
    private mvtTreeConfig: any;
    private layerKeys: any = [];
    /**
     * 加载
     * @param params {Object}
     * @param params.serviceConfig {Object} 服务配置文件
     * @param params.nodeNames {Array} 显示的节点名，用于过滤
     * @param params.styleFunc {Function} 样式函数
     * @param params.zIndex {number} 图层zIndex
     * @param params.layerId {String} 图层名称
     * @param params.layerName {String} 图层名称
     */
    public load(params: any): void {
        this.removeLayer();
        const self = this;
        const styleUrl: any = `${params.serviceConfig.egis.server}egis/base/v1/wvts/styles/1`;
        const egis: any = (window as any).egis;
        this.restHttp = new egis.core.RestHttp({
            client_id: params.serviceConfig.egis.clientId,
            client_secret: params.serviceConfig.egis.clientSecret,
        });
        const config: any = {};
        config.id = params.layerId || 'egis-vector-layer';
        config.name = params.layerName || '矢量瓦片';
        config.glStyle = styleUrl;
        const replaceStr: any = config.glStyle.split('?')[0].replace(/styles\/\d{1,}/, '');
        config.transformRequest = (url: any, requestType: any) => {
            let result: any;
            // 处理请求里的ip地址
            const regex: any = /(http:\/\/.*\/api\/v1\/)|(http:\/\/.*\/egis\/base\/v1\/wvts\/)|(https:\/\/.*\/api\/v1\/)|(https:\/\/.*\/egis\/base\/v1\/wvts\/)/;
            switch (requestType) {
                case 'Style': {
                    result = {};
                    result.url = url;
                    break;
                }
                case 'Glyphs': {
                    // http://10.18.1.185:80/api/v1/fonts/SimHei Regular/0-255
                }
                case 'SpriteJSON': {
                    // http://10.18.1.139:8089/egis/base/v1/wvts/sprites/1/sprite.json
                }
                case 'SpriteImage': {
                    result = {};
                    result.url = url.replace(regex, replaceStr);
                    break;
                }
                case 'Tile': {
                    // http://10.18.1.185:80/api/v1/tiles/14/2/6/1.pbf
                    // http://10.18.1.139:8089/egis/base/v1/wvts/tiles/12/9/841/141.pbf
                    let replaceStrTmp = replaceStr;
                    if (replaceStrTmp.indexOf('http') < 0) {
                        replaceStrTmp = location.protocol + '//' + location.host + replaceStrTmp;
                    }
                    result = {};
                    result.url = url.replace(regex, replaceStrTmp);
                    break;
                }
                default: {
                    break;
                }
            }
            if (result && this.restHttp) {
                result.headers = {
                    Authorization: this.restHttp.getToken(),
                };
            }
            return result;
        };
        this.getStyle(styleUrl).then((style: any) => { // 图层style信息
            const layerMap = style.metadata.layerIDMap;
            self.getMvtTree().then((treeData: any) => {// 图层配置树
                const nodeLabels: any = params.nodeNames;
                self.getIdsByLabel(nodeLabels, treeData, layerMap).then((nodeLayerIds: any) => { // 根据图层名称获取所有图层id（向下递归）
                    for (const layer of style.layers) {
                        if (nodeLayerIds.indexOf(layer.id) < 0) { // 非必要图层信息隐藏
                            layer.layout = layer.layout || {};
                            layer.layout.visibility = 'none';
                        } else {
                            if (params.styleFunc) { // 图层样式修改
                                params.styleFunc.call(this, layer);
                            }
                        }
                    }
                    config.glStyle = style;
                    self.layer = new egis.carto.MVTVectorTileLayer(config);
                    if (params.zIndex) { // 图层zindex设置
                        self.layer.setZIndex(params.zIndex);
                    }
                    self.map.addLayer(self.layer);
                    self.layer.setVisible(true);
                });
            });
        });
    }
    public unload(): void {
        this.removeLayer();
    }

    public setVisible(visible: boolean): void {
        if (this.layer) {
            this.layer.setVisible(visible);
        }
    }

    protected removeLayer() {
        if (this.layer) {
            this.map.removeLayer(this.layer);
        }
        this.layer = null;
    }

    /**
     *
     * @param url
     */
    protected getStyle(url: string) {
        return new Promise((resolve, reject) => {
            let currentStyle: any = null;
            if (this.styleCache.hasOwnProperty(url)) {
                currentStyle = this.styleCache[url];
                resolve(currentStyle);
            } else {
                jQuery.ajax({
                    url,
                    type: 'GET',
                    dataType: 'json',
                    beforeSend: (request) => {
                        request.setRequestHeader('Authorization', this.restHttp.getToken());
                    },
                    success: (data) => {
                        const styleData = data;
                        const layerMap: any = [];
                        for (let i = 0, len = styleData.layers.length; i < len; i++) {
                            const id = styleData.layers[i].id;
                            layerMap[id] = styleData.layers[i];
                            styleData.layers[i].index = i;
                        }
                        styleData.layers = layerMap;
                        this.styleCache[url] = styleData;
                        currentStyle = styleData;
                        resolve(currentStyle);
                    },
                    error: (e) => {
                        console.error(e);
                    },
                });
            }
        });
    }
    // 获取图层树配置
    protected getMvtTree() {
        const self = this;
        return new Promise((resolve, reject) => {
            if (!self.mvtTreeConfig) {
            const url = './json/mvtTree.json';
            jQuery.ajax({
                url,
                type: 'GET',
                dataType: 'json',
                success: (data) => {
                    self.mvtTreeConfig = data;
                    resolve(this.mvtTreeConfig);
                },
            });
            } else {
                resolve(this.mvtTreeConfig);
            }
        });
    }
    // 根据图层名称获取所有图层id（向下递归）
    protected getIdsByLabel(lables: any, treeData: any, layerMap: any) {
        return new Promise((resolve, reject) => {
            lables.forEach((lable: any) => {
                this.getKeysByLabel(lable, treeData);
            });
            const layerIds: any = [];
            this.layerKeys.forEach((key: string) => {
                const ids = layerMap[key];
                if (ids) {
                    ids.forEach((id: any) => {
                        if (!layerIds.includes(id)) {
                            layerIds.push(id);
                        }
                    });
                }
            });
            resolve(layerIds);
        });
    }
    // 根据节点label获取所有key（向下递归）
    protected getKeysByLabel(lable: any, treeData: any) {
        for (const key in treeData) {
            if (treeData.hasOwnProperty(key)) {
                const layer = treeData[key];
                if (lable) {
                    if (layer && layer.label ) {
                        if ((layer.label + '') === lable) {
                            if (layer.key) {
                                this.layerKeys.push(layer.key);
                            } else if (layer.children) {
                                this.getKeysByLabel(null, layer.children);
                            }
                        }
                        if (layer.children) {
                            this.getKeysByLabel(lable, layer.children);
                        }
                    }
                } else {
                    if (layer.key) {
                        this.layerKeys.push(layer.key);
                    }
                    if (layer.children) {
                        this.getKeysByLabel(null, layer.children);
                    }
                }
            }
        }
    }
}
