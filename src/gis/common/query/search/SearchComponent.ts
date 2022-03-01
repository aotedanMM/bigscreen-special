
import SymbolMap from './SymbolMap';
import Util from '../../../Util';
// 搜索功能，地名搜索、输入经纬度、选点对应的地图功能
//
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    // 属性
    options: {
        map: null,
        type: null,
        clickHighlightId: '',
        server: null,
        highLightId: 'searchPiontHL', // 高亮id
        featureHighlight: null,
        popupId: 'Search_popup', // 弹窗唯一标识
        currentPopupId: '',
        fireAddPopupEventId: 'Search_popupEvent', // 添加弹窗后执行事件id
        bufferComponent: null,
        bufferId: 'bufferDrawTool',
        bufferEventName: 'buffer',
        buffer: {
            // 缓冲参数
            drag: {
                visible: true,
                style: {
                    type: 'PictureMarkerSymbol',
                    options: {
                        width: 32,
                        height: 20,
                        opacity: 1,
                        rotation: 0,
                    },
                },
            },
            axis: {
                visible: true,
                style: {
                    type: 'SimpleLineSymbol',
                    options: {
                        color: { r: 255, g: 0, b: 0, a: 255 },
                        style: 5,
                        width: 2,
                    },
                },
            },
            label: {
                visible: true,
                position: 'center',
                style: {
                    type: 'TextSymbol',
                    options: {
                        text: '距离',
                        fontFamilyName: '黑体',
                        fontSize: 16,
                        fontWeight: 500,
                        foreground: {
                            r: 255, g: 0, b: 0, a: 255,
                        },
                        borderColor: {
                            r: 150, g: 0, b: 0, a: 255,
                        },
                        borderThickness: 0,
                        rotation: 0,
                        offsetX: 0,
                        offsetY: 10,
                    },
                },
            },
            fill: {
                visible: true,
                style: {
                    type: 'SimpleFillSymbol',
                    options: {
                        borderColor: {
                            a: 255, r: 255, g: 0, b: 0,
                        },
                        fillColor: {
                            a: 40, r: 144, g: 247, b: 227,
                        },
                        borderThickness: 2,
                        style: 5,
                        opacity: 0.9,
                    },
                },
            },
            draw: {
                visible: true,
                style: {
                    type: 'SimpleFillSymbol',
                    options: {
                        borderColor: {
                            a: 255, r: 255, g: 0, b: 0,
                        },
                        fillColor: {
                            a: 40, r: 144, g: 247, b: 227,
                        },
                        borderThickness: 2,
                        style: 5,
                        opacity: 0.9,
                    },
                },
            },
            close: {
                visible: false,
                style: {
                    type: 'PictureMarkerSymbol',
                    options: {
                        width: 41,
                        height: 41,
                        opacity: 1,
                        rotation: 0,
                        offsetX: 0,
                        offsetY: 0,
                    },
                },
            },
        },
    },

    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.map = options.map;
        this._initMouseMoveOverlay();
        this._initLayers();
        this._initSymbols();
        // this._initPlot();
        this.featureHighlight = this.options.featureHighlight;
        this._initBuffer();
        this._initService();
        // this.addListeners();
        // 监听清屏
        this.map.listen(window.G.misc.AppEvents.CLEAR_MAP, this.clearAll, this);
        this.toolTipWare = new g2.widget.TooltipWare({ map: this.map });
    },
    _initMouseMoveOverlay() {
        this.mousemoveOverlay = new G.interact.MousemoveOverlay({
            map: this.map,
            content: '<img src= "' + this.options.symbolConfig.icons.markPoint + '" />',
            clearlast: true,
            keep: true,
            offset: [-16, -49], // [-22, -52],
            callback: (evt: any) => {
                const point = new g2.sfs.Point({
                    x: evt.mapX,
                    y: evt.mapY,
                    spatialReference: this.map.getSrid(),
                });
                // this.commandNotify.activeCommand('NoopTool');
                // this.mousemoveOverlay.unload();
                this.options.filterInfo.setEventPoint(point);
                const coords = [point.x, point.y];
                this.options.currentData = {};
                this.options.type = 'searchpoi';
                this.geocodePoint(coords);
            },
        });
    },
    _initBuffer() {
        this.bufferDraw = new G.interact.Buffer({
            map: this.map,
        });
        this.bufferDraw.load();
    },
    _initLayers() {
        // 绘制的点 放在this.layer
        this.layer = new g2.carto.ElementLayer({
            id: 'search-layer',
            zIndex: 20,
        });
        this.map.addLayer(this.layer);
        // 行政区划，放在this.districtlayer
        this.districtlayer = new g2.carto.ElementLayer({
            id: 'search-district-layer',
            zIndex: 20,
        });
        this.map.addLayer(this.districtlayer);
    },
    _initService() {
        const serviceConfig = this.options.publishObjectPath.value;
        this.WRGSService = new g2.ews.RestWRGSService({
            url: serviceConfig.egis.server + 'egis/base/v1',
            authType: 'Token',
            tokenUrl: serviceConfig.egis.tokenServer,
            clientId: serviceConfig.egis.clientId,
            clientSecret: serviceConfig.egis.clientSecret,
            deserializer: new g2.core.Deserializer(),
        });
    },
    _initSymbols() {
        this.options.pictureMarkerSymbol = new g2.sfs.PictureMarkerSymbol({
            source: this.options.symbolConfig.icons.markPoint,
            width: 32,
            height: 49,
            rotation: 0,
            opacity: 1,
            offsetX: 16,
            offsetY: 49,
        });
        this.options.pictureMarkerSymbolHL = new g2.sfs.PictureMarkerSymbol({
            source: this.options.symbolConfig.icons.markPoint_hover,
            width: 64,
            height: 70,
            offsetX: 32,
            offsetY: 64,
            opacity: 1,
            rotation: 0,
        });
        // 线symbol
        this.options.simpleLineSymbol = new g2.sfs.SimpleLineSymbol({
            color: new g2.sfs.Color({ a: 255, r: 51, g: 255, b: 173 }),
        });
        // 绘制图形symbol
        this.options.plotFillSymbol = new g2.sfs.SimpleFillSymbol({
            fillColor: new g2.sfs.Color({ a: 40, r: 144, g: 247, b: 227 }),
            borderColor: new g2.sfs.Color({ a: 255, r: 51, g: 255, b: 173 }),
            borderThickness: 2,
        });
        this.options.drawButtonStyle = {
            type: 'PictureMarkerSymbol',
            options: {
                source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAUCAYAAADskT9PAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzdCRTQ5OTYzRkFFMTFFNDk1NTE5ODREMUQwMDhDMzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzdCRTQ5OTczRkFFMTFFNDk1NTE5ODREMUQwMDhDMzMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDN0JFNDk5NDNGQUUxMUU0OTU1MTk4NEQxRDAwOEMzMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDN0JFNDk5NTNGQUUxMUU0OTU1MTk4NEQxRDAwOEMzMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpA7b9wAAAPDSURBVHjarFZbTxNREJ7d7ba7lbaAgqBUMETEW9OggCYiYIyKJhp+gA/6B4wPhGhMjET9CaivXggxXogkaqLxQXxofCCKFRSjQohRgZa2WLbXXWfWs02tB2ONk3xJe2Z25pvvzDm7Ql9fH3BMQEigaeWQTu8Cw9iB/0sQ1fA3ZhgGCMIs/gojXiGeg8czzwu1cQrbIJWqhETiOOj6YX9LS+X6hga3Q1Gk0rIyB/ylLcZiqaV4PPN5evr7i5GROYhEhpDUFSQS/qVgngJUXIFkcgsWP9dx4IC/pa2t2m63S8bPrqBoEwQzKT5pvHj27Mvj4eGXuHYKSUwWKkBxKmQyjVj8Uld397amnTurdF2HbDYL/8GE5ra2NStcLnloYKAfotFjSOJLPgHZ3F9NO7m3q2uzv7W1KpPJwH81bGaTz1eRTCS2PLx79yKunKBlkaEU9313jdfb3NrevjaLxal7Hvb1BE0U6yNkUE2cqaqtTU17UIUOi4AdUYkE9qCznDon2XkJ9veO5zX0u98yiuOSwLyU37d9+0qcqSMWAdUkoOt1NXV1nmw6bQYW4uDpt7kCDy5s4MbQumUUz4shdau9XjeGNFsEFEQZMnKqTqecpcErwKGz73OJh/vqgRdjgfyW0XOFftoGUZJErFWC2+CysQFUkIAoCoJAAcYfjpxe5KngxRtIRLbbRS2RUMTcMRTFBF4caYPtVT7unfXmHj56foorrQXyW0bPFfpZfiMWiWjgdoeIAFFMIoHw/Oxs3MDLgyft7TNrc4m7L8xwY2jdMornxZC2USouCNMkhmgWx5sTZHn6XTC4INtswFOBcKu36hdpC2EZxfH8lNeG+SffvAkhgadEgGZgCTEHDsfE2Oior76hwbOmtnYVXhjcWRjsqcwdw2J8OF5gk2UIzc1FR548mQRFGbJOASnwDfEVVDVwb2DgYyQcjuKQmHItd6kUA2qEiqeSyaWbV6++B0m6jA2HiIDU2dlJdTLmIEqSDanqrwMBtaa21rGyosJpsARFg3UtoeSKqkIkFIpc6+9/h1t9HUpK7rDGc++CBGLGvBUd+MYVxfjQ4GB8q9+/rtHnK3N7PKq7tFQ1ONIu+/YRRdDi8eRiNKqNjo8vjAYCnzD3DVT5Ptt2I5+Abg4iwAdEClnGaCiDExMbg2Nj61FHD8L9D6/jRWwmhJM3Bi7XI/xN+SPs5P32QUKLMUZiAbEaGU8h3Oy2lIq5f5iq1FTInK+fX0dLzLfsF5HOgpLsASfCweKEIghYc5VCaAzcK/SHAAMA4XIlf6DGCVoAAAAASUVORK5CYII=',
                width: 32,
                height: 20,
                opacity: 1,
                rotation: 0,
            },
        };
        this.options.axisStyle = {
            type: 'SimpleLineSymbol',
            options: {
                color: { r: 255, g: 0, b: 0, a: 255 },
                style: 5,
                width: 2,
            },
        };
        this.options.labelStyle = {
            type: 'TextSymbol',
            options: {
                text: '距离',
                fontFamilyName: '黑体',
                fontSize: 20,
                fontWeight: 500,
                foreground: {
                    r: 255, g: 0, b: 0, a: 255,
                },
                borderColor: {
                    r: 150, g: 0, b: 0, a: 255,
                },
                borderThickness: 0,
                rotation: 0,
                offsetX: 100,
                offsetY: 0,
            },
        };
        this.options.bufferFillStyle = {
            type: 'SimpleFillSymbol',
            options: {
                borderColor: {
                    a: 255, r: 51, g: 255, b: 173,
                },
                fillColor: {
                    a: 40, r: 144, g: 247, b: 227,
                },
                borderThickness: 2,
                style: 5,
                opacity: 0.9,
            },
        };
    },

    load() {
        componentBase.prototype.load.call(this);
    },

    addListeners() {
        // 监听周边查询打开关闭
        if (this.options.nearbyQuery) {
            this.options.nearbyQuery.off('load', this._onNearByLoad, this);
            this.options.nearbyQuery.off('unload', this._onNearByUnLoad, this);
            this.options.nearbyQuery.on('load', this._onNearByLoad, this);
            this.options.nearbyQuery.on('unload', this._onNearByUnLoad, this);
        }
    },
    removeListeners() {
        // 监听周边查询打开关闭
        if (this.options.nearbyQuery) {
            this.options.nearbyQuery.off('load', this._onNearByLoad, this);
            this.options.nearbyQuery.off('unload', this._onNearByUnLoad, this);
        }
    },
    _onNearByLoad() {
        // console.log('监听周边查询加载！');
        // this.clearPopup();;
        this.districtlayer.setVisible(false);
        // this.provincelayer.setVisible(false);
        // this._unbindEvents();
        // Object.keys(this.options.typeList).map((key, item) => {// 已加载过的所有类型
        this.options.simpleRenderMgr.setVisible('search_result', false);
        this.removeHighlight();
        // });
    },
    _onNearByUnLoad() {
        // console.log('监听周边查询卸载！');
        this.districtlayer.setVisible(true);
        this.options.simpleRenderMgr.setVisible('search_result', true);
        // this._bindEvents('all');
        // for (const featureType of Object.keys(this.featureTypeSet)) {
        //   this.simpleRenderMgr.setVisible(featureType, true);
        // }
        // this._clearHighLight();
    },
    queryDistrict(code: string) {
        this.options.filterInfo.setFilterType(2); // 2是行政区划
        this.options.filterInfo.setDistrictCode(code);
        const opts = {
            districtcode: code,
        };
        this.options.districtServer.getDistrictByCode(opts).then((data: any) => {
            // this.clearLine();
            this.clearBuffer();
            const geometry = g2.sfs.GeometryFactory.createGeometryFromWkt(data.data.wkt);
            const textSym = new (g2 as any).sfs.TextSymbol({
                text: data.data.districtname,
                fontFamilyName: 'Microsoft Yahei',
                fontSize: 24,
                textAlign: 'center',
                textBaseline: 'middle',
                borderThickness: 2,
                textBackgroundColor: new (g2 as any).sfs.Color({ a: 153, r: 24, g: 62, b: 80 }),
                textBackgroundBorderColor: new (g2 as any).sfs.Color({ a: 255, r: 55, g: 224, b: 245 }),
                foreground: new (g2 as any).sfs.Color({ a: 255, r: 254, g: 254, b: 254 }),
                padding: [2, 10, 2, 10],
            });
            const currencySymbol = new (g2 as any).sfs.CurrencySymbol({
                textSymbol: textSym,
                fillSymbol: this.options.plotFillSymbol,
            });
            const element = new g2.sfs.Element({
                id: 'district_' + code,
                geometry,
                symbol: currencySymbol,
            });
            this.queryResouece();
            this.districtlayer.add(element);
            const geojson = geometry.asWkt();
            setTimeout(() => {
                this.locateGeometry({ geometry: geojson }, 'wkt');
            }, 500);
        });
    },
    // 设置当前缓冲区半径
    setRadius(radius: number) {
        this.options.filterInfo.setBufferRadius(radius);
        this.bufferDraw.setRadius(radius, this.options.bufferId);
    },
    // 根据输入坐标，定位点，查询地址
    queryPoint(opts: any) {
        return new Promise((resolve, reject) => {
            console.log('以下为加载点之前先clearALl');
            this.clearAll();
            let x;
            let y;
            if (opts.x.indexOf('°') !== -1 && opts.y.indexOf('°') !== -1) {// 经纬度
                x = this._degreeConvert(opts.x);
                y = this._degreeConvert(opts.y);
            } else {
                x = parseFloat(opts.x);
                y = parseFloat(opts.y);
            }
            if (-89.9999 < y && y < 89.9999 && -179.9999 < x && x < 179.9999) {
                this.options.currentData = opts.data || {};
                this.options.type = this.options.currentData.layercode;
                if (!this.options.type) {
                    this.options.type = 'searchpoi';
                }
                this.geocodePoint([x, y]);
                resolve({ status: 'success', type: this.options.type });
            } else {
                this.fire('searchComponentMapInfo', { text: '请输入正确的经纬度！经度：-179.9999～179.9999 纬度：-89.9999～89.9999' });
                resolve({ status: 'error', text: '请输入正确的经纬度！经度：-179.9999～179.9999 纬度：-89.9999～89.9999' });
            }
        });
    },
    // 移除高亮
    removeHighlight() {
        clearTimeout(this.timeout);
        this.timeout = null;
        this.featureHighlight.removeHighlight(this.options.highLightId);
    },
    _addHighlight(element: any) {
        const self = this;
        this.featureHighlight.removeHighlight(this.options.highLightId);
        const options = {
            data: {
                type: 'wkt',
                geom: 'POINT(' + element.x + ' ' + element.y + ')',
            },
            style: {
                type: 'PictureMarkerSymbol',
                options: this.options.pictureMarkerSymbolHL,
            },
            blink: {
                enable: true,
            },
        };
        this.featureHighlight.addHighlight(this.options.highLightId, options);
        this.timeout = setTimeout(() => {
            _setbink();
        }, 3500);
        function _setbink() {
            self.removeHighlight();
            const options2 = options;
            options2.blink.enable = false;
            self.featureHighlight.addHighlight(self.options.highLightId, options2);
        }
    },
    // 创建点
    createPoint(coords: any) {
        const self = this;
        const cData = this.options.currentData;
        this.hovername = cData.name;
        cData.searchType = this.options.type;
        cData.x = coords.x;
        cData.y = coords.y;
        let type: any = '';
        if (cData.tablename) {
            const opts1: any = {};
            opts1.url = './json/oldserver/nearby.json';
            opts1.dataType = 'json';
            opts1.async = false;
            opts1.success = (near: any) => {
                for (const item in near.resources) {
                    if (near.resources[item].tableName === cData.tablename && item !== 'v_equipment_list') {
                        type = item + '※' + cData.typecodegis;
                    }
                }
            };
            jQuery.ajax(opts1);
        }
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                let symbol = null;
                if (data && type !== '') {
                    let symbolMapper: any = null;
                    if (SymbolMap[type]) {
                        symbolMapper = SymbolMap[type];
                    } else {
                        symbolMapper = SymbolMap.default;
                    }
                    let symbolObj: any = null;
                    symbolObj = Util.toJSON(symbolMapper.symbol);
                    if (type === 'forestfireteam') { // 特殊处理国家森防
                        symbolObj = Util.toJSON(symbolMapper.countrySymbol);
                    }
                    symbolObj.options.source = this.options.symbolConfig.icons[symbolMapper.iconFn(type, data)];
                    symbol = new (G as any).utils.RenderUtil.object2Symbol(symbolObj);
                    if (symbolObj.options.source) {
                        return symbol;
                    } else {
                        return this.options.pictureMarkerSymbol;
                    }
                } else {
                    return this.options.pictureMarkerSymbol;
                }
            },
        });
        const opts = {
            featureType: 'search_result'/*  + this.options.type */,
            featureName: 'search_result'/*  + this.options.type */,
            // idField: fieldConfig.idField,
            list: [cData],
            type: 0,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['x', 'y'],
            }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {
                click: (result: any) => {
                    if (type) {
                        // 针对es查询结果
                        self.options.server.getDetailInfo({
                            id: cData.rid,
                            resourceKey: type,
                        }).then((res: any) => {
                            const popupOptions: any = {
                                id: 'normal_resource',
                                anchor: [coords.x, coords.y],
                                className: 'g2-tooltip',
                            };
                            self.options.popupManager
                            .addSimple(popupOptions)
                            .then((content: any) => {
                                self.fire('popup', {
                                    data: res,
                                    content,
                                    type,
                                });
                            });
                        });
                    }
                },
            },
        };
        this.options.simpleRenderMgr.add(opts);
        // this._addHighlight(cData);
        // this.layer.clear();
        const point = new g2.sfs.Point({
            x: coords.x,
            y: coords.y,
            spatialReference: this.map.spatialReference,
        });
        this.options.filterInfo.setEventPoint(point);
        if (this.hovername) {
            // this.options.popupManager.addSimple({
            //     id: 'search_popup_EventPoints',
            //     anchor: [point.x, point.y],
            //     className: '',
            //     zIndex: 20,
            //     autoPan: false,
            // }).then((content: any) => {
            //     const dom: any = document.getElementById(content.containerId);
            //     dom.innerHTML = `<div class="hover-title"><div><span class="hover-title_txt"><i>${this.hovername}</i></span></div></div>`;
            // });
            const html = '';
            const tooltip = new g2.widget.Tooltip({
                id: 'search_popup_EventPoints',
                anchor: new g2.sfs.Point({
                    x: point.x,
                    y: point.y,
                }),
                content: `<div id="search_popup_EventPoints"><div class="hover-title"><div><span class="hover-title_txt"><i>${this.hovername}</i></span></div></div></div>`,
                layerId: 'search_result',
                offset: [3, -20],
                className: '',
                // 新增tooltip参数
                autoPan: false,
                autoPanMargin: 10,
            });
            this.toolTipWare.add(tooltip);
        }
        this.drawBufferPoint({
            x: point.x,
            y: point.y,
        });
        if (this.options.type !== 'searchpoi') {
            console.log('自动出弹窗，清除弹窗：');
            setTimeout(() => {
                this.clearPopup();
                this.addPopup({ geometry: point }, cData, cData.searchType);
            }, 3000);
        }
        // const ele = new g2.sfs.Element({ geometry: point, symbol });
        // this.layer.add(ele);
    },
    addPopup(ele: any, item: any, type: any) {
        switch (type) {
            case 'searchpoi':
                const wrgsInput = new g2.ews.WRGSInput({
                    location: ele.geometry.x + ',' + ele.geometry.y,
                });
                this.WRGSService.regeocode(wrgsInput).then((result: any) => {
                    const opts = {
                        x: result.location.x,
                        y: result.location.y,
                    };
                    const returnData = {
                        address: result.formatted_address,
                        coords: opts,
                    };
                    this.fire('searchPointAddress', returnData);
                });
                break;
            default:
                const self = this;
                this.getDetailInfo(type, item).then((data: any) => {
                    if (data) {
                        this.options.currentPopupId = this.options.popupId + '_' + type;
                        this.options.popupManager.clear();
                        this.options.popupManager.addSimple({
                            id: this.options.currentPopupId,
                            anchor: [ele.geometry.x, ele.geometry.y],
                            className: 'default-detail-popup',
                            autoPanTimeout: 1000,
                            autoPanMargin: 100,
                        }).then((content: any) => {
                            console.debug(data);
                            self.fire(self.options.fireAddPopupEventId, {
                                type,
                                isEventBtn: true,
                                data: data || {},
                                content,
                            });
                        });
                    } else {
                        console.debug('获取详情失败 ', item);
                    }
                });
                break;
        }
    },
    getDetailInfo(key: string, item: any) {
        return new Promise((resolve, reject) => {
            if (key === 'searchpoi') {
                resolve(item);
            }
            const opt = {
                resourceKey: key,
                id: item.id,
            };
            this.options.normalResourceServer.getDetailInfo(opt).then((res: any) => {
                resolve(res);
            });
        });
    },
    // 定位到信息点并弹框显示信息
    locateGeometry(opts: any, type: string) {
        let level = this.map.getZoomLevel();
        level = Math.max(level, 16);
        const options = {
            padding: [100, 59, 50, 100],
            maxZoom: level,
            duration: {
                move: 1500,
                zoom: 2000,
            },
        };
        let geometry: any = null;
        switch (type) {
            case 'point':
                geometry = {
                    type: 'geojson',
                    geom: {
                        type: 'Point',
                        coordinates: [parseFloat(opts.x), parseFloat(opts.y)],
                    },
                };
                break;
            case 'polygon':
                geometry = {
                    type: 'geojson',
                    geom: opts.geometry,
                };
                break;
            case 'wkt':
                geometry = {
                    type: 'wkt',
                    geom: opts.geometry,
                };
                break;
        }
        this.options.featureLocate.fit(geometry, options);
    },
    // 逆地理编码
    geocodePoint(coords: any) {
        if (this.options.type === 'searchpoi') {
            const wrgsInput = new g2.ews.WRGSInput({
                location: coords.join(','),
            });
            this.WRGSService.regeocode(wrgsInput).then((result: any) => {
                const opts = {
                    x: result.location.x,
                    y: result.location.y,
                };
                this._updatePoint(opts);
                const returnData = {
                    address: result.formatted_address,
                    coords: opts,
                };
                this.fire('searchPointAddress', returnData);
            }, (err: any) => {
                console.debug(err.response.msg, '逆地理编码服务错误');
                this._updatePoint({ x: coords[0], y: coords[1] });
                const opts = {
                    x: coords[0],
                    y: coords[1],
                };
                const returnData = {
                    address: '未找到最近的道路或距离太远',
                    coords: opts,
                };
                this.fire('searchPointAddress', returnData);
            });
        } else {
            this._updatePoint({ x: coords[0], y: coords[1] });
        }
    },
    // 更新点
    _updatePoint(opts: any) {
        this.layer.clear();
        this.locateGeometry(opts, 'point');
        this.createPoint(opts);
        // setTimeout(() => {
        // }, 500);
    },
    startPlot(type: string) {
        this.clearBuffer();
        if (type === 'point') {
            this.clearAll();
            this.mousemoveOverlay.load();
        } else {
            this.drawBuffer({ type }, true);
        }
    },
    /**
     * 绘制缓冲区
     * @param opts 参数
     * @param plot 是否手动绘制
     */
    drawBuffer(opts: any, plot: boolean, coords?: any) {
        const options: any = {};
        options.type = opts.type;
        options.buffer = {};
        if (opts.data) {
            options.data = opts.data;
        }
        options.buffer.radius = this.options.filterInfo.getBufferRadius() || 10000;
        for (const key of Object.keys(this.options.buffer)) {
            options.buffer[key] = this.options.buffer[key];
        }
        options.id = this.options.bufferId;
        options.buffer.close.visible = true;
        // 关闭按钮点击
        options.buffer.onClose = () => {
            this.fire('clearSearchGeometry');
            this.clearAll();
        },
        options.buffer.callback = (bufferGeom: any, r: any, drag: boolean) => {
            this.fire('searchDrawOver', {
                // 资源点
                point: {
                    log: coords.x,
                    lat: coords.y,
                },
                // 缓冲区的geojson，对象
                geometry: bufferGeom,
            });
            // this.options.filterInfo.setFilterType(1); // 1是缓冲
            setTimeout(() => {
                this.locateGeometry({ geometry: bufferGeom }, 'polygon');
            }, 500);
            // this.options.filterInfo.setFilterGeometry(bufferGeom);
            // this.queryResouece();
        };
        if (options.type === 'polygon') { // 多边形
            options.buffer.radius = 0;
            options.buffer.draw = {
                visible: false,
                style: this.options.buffer.draw.style,
            };
            options.buffer.drag = {
                visible: false,
            };
            options.buffer.axis = {
                visible: false,
            };
            options.buffer.label = {
                visible: false,
            };
            options.buffer.close = {
                visible: false,
            };
        }
        console.log(options);
        if (plot) {
            this.bufferDraw.drawBuffer(options);
        } else {
            this.bufferDraw.buffer(options);
        }
    },
    drawBufferPoint(coords: any) {
        this.options.filterInfo.setFilterType(1); // 1是缓冲
        // this.clearLine();
        this.clearBuffer();
        const opts = {
            type: 'point',
            data: {
                type: 'wkt',
                geom: 'POINT(' + coords.x + ' ' + coords.y + ')',
            },
        };
        this.drawBuffer(opts, false, coords);
    },
    getBufferGeom() {
        const geometry = this.bufferDraw.getBufferGeometry();
        return geometry;
    },
    // 查询资源
    queryResouece() {
        const type = this.options.filterInfo.getFilterType();
        let opts;
        switch (type) {
            case 1:
                opts = {
                    type: 'buffer',
                    buffer: this.options.filterInfo.getFilterGeometry(),
                };
                break;
            case 2:
                opts = {
                    type: 'districtCode',
                    districtCode: this.options.filterInfo.getDistrictCode().join(','),
                };
                break;
        }
        this.fire('searchComponentQueryResource', opts);
    },
    // 度数转换
    _degreeConvert(value: any) {
        var du = value.split('°')[0];
        var fen = 0;
        var miao = 0;
        try {
            if (value.split('°')[1] && value.split('°')[1].indexOf('′') !== -1) { // 有分
                fen = value.split('°')[1].split('′')[0];
                if (value.indexOf('″') !== -1) {  // 有秒
                    miao = value.split('°')[1].split('′')[1].split('″')[0];
                } else {
                    miao = value.split('°')[1].split('′')[1];
                }
            } else {
                if (value.indexOf('″') !== -1) { // 有秒
                    miao = value.split('°')[1].split('′')[1].split('″')[0];
                }
            }
        } catch (error) {
            du = 0;
        }
        // var miao = value.split('°')[1].split("'")[1].split('"')[0];
        return Math.abs(du) + (Math.abs(fen) / 60 + Math.abs(miao) / 3600);
    },
    /**
     * 移除行政区划结果
     * @param code {String} 可选 不填的时候清除全部
     */
    clearDistrict(code: string) {
        if (code) {
            const element = this.districtlayer.find('district_' + code);
            if (element) {
                this.districtlayer.remove(element);
                this.options.filterInfo.removeDistricCode(code);
            }
        } else {
            this.districtlayer.clear();
            this.options.filterInfo.resetDistriCode();
        }
    },
    clear() {
        console.log('clear');
        this.options.filterInfo.reset();
        // this.clearLine();
        this.clearBuffer();
        this.clearDistrict();
        // this.commandNotify.activeCommand('NoopTool');
    },
    clearAll() {
        // console.log('clearAll');
        this.clear();
        this.mousemoveOverlay.unload();
        this.layer.clear();
        this.clearPopup();
        this.options.simpleRenderMgr.remove('search_result');
        this.removeHighlight();
    },
    clearBuffer() {
        if (this.bufferDraw) {
            this.bufferDraw.cancelDraw();
            this.bufferDraw.clearBuffer();
        }
    },
    closePopup() {
        // console.log('closePopup');
        this.options.popupManager.remove(this.options.currentPopupId);
    },
    clearPopup() {
        // console.log('clearpopup');
        this.options.popupManager.clear();
        this.toolTipWare.clear();
        this.options.popupManager.remove(this.options.currentPopupId);
    },
    unload() {
        componentBase.prototype.unload.call(this);
        // this.removeListeners();
    },
    //  销毁
    destroy() {
        componentBase.prototype.destroy.call(this);
    },
});

export default component;
