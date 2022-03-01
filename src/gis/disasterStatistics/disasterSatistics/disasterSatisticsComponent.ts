// 灾损统计行政区划
import Util from '../../Util';
import publishObjectPath from '@/util/configRegistry';
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
    options: {
        map: null,
        service: null,
        currentHlId: null, // 最
        simpleRenderMgr: null,
        popupManager: null,
        featureLocate: null,
        featureHighlight: null,
        symbolConfig: null,
        featureType: 'disasterStatics_district',
        featureType_boder: 'disasterStatics_districtBorder',
        featureName: '烟台市行政区划图层',
        popupId: 'disasterStatics_popup_id', // 弹窗唯一标识
        highLightId: 'disasterStatics_hl', // 高亮id
        popupEventId: 'disasterStatics_popup', // 添加弹窗后执行事件id
        status: 'add', // add|remove，此时是添加数据状态还是移除数据状态。
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.map = options.map;
        this.mapConfig = options.mapConfig;
        this.symbolConfig = options.symbolConfig;
        this.toolTipWare = new g2.widget.TooltipWare({
            map: this.map,
        });
        this.service = options.service;
        this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
        this.popupManager = options.GISComponents.popupManager;
        this.featureLocate = options.GISComponents.featureLocate;
        this.featureHighlight = options.GISComponents.featureHighlight;
        this.districtsList = [];
    },
    //  销毁
    destroy() {
        this.unload();
        this.simpleRenderMgr = null;
        this.symbolConfig = null;
        this.featureLocate = null;
        this.featureHighlight.clearHighlight();
        this.featureHighlight = null;
        componentBase.prototype.destroy.call(this);
    },

    /**
     * 加载
     */
    load() {
        componentBase.prototype.load.call(this);
        this.simpleRenderMgr.off('click', this._onMouseClick, this);
        this.simpleRenderMgr.on('click', this._onMouseClick, this);
        if (this.options.districtHome) {
            this.options.districtHome.setCountyVisible(false);
        }
        // this.addDistrict();
    },

    /**
     * 卸载
     */
    unload() {
        componentBase.prototype.unload.call(this);
        this.simpleRenderMgr.off('click', this._onMouseClick, this);
        this.removeDistrict();
        if (this.options.districtHome) {
            this.options.districtHome.setCountyVisible(true);
        }
    },
    // 添加烟台市行政区划
    addDistrict(data: any) {
        this.options.status = 'add';
        this.load();
        this.analysisData(data);
        this.service.getDistrictTreeByCode({ districtcode: [publishObjectPath.value.district.root] }).then((res: any) => {
            if (this.options.status === 'add') {
                const districts = res.data.children;
                this.getDistrictCorrd(districts);
                this._showDistrict(districts);
                this._showDistrict_border(districts);
            }
        });
        return this.arrBreakNote;
    },
    // 解析数据
    analysisData(data: any) {
        const self = this;
        this.disasterData = {};
        const arrColor: any = [{ r: 33, g: 196, b: 243, a: 173 }, { r: 254, g: 242, b: 96, a: 153 }, { r: 242, g: 138, b: 36, a: 153 }, { r: 244, g: 61, b: 66, a: 153 }];
        // const arrColor: any = [{ r: 0, g: 255, b: 255, a: 30 }, { r: 0, g: 255, b: 255, a: 30 }, { r: 0, g: 255, b: 255, a: 30 }, { r: 0, g: 255, b: 255, a: 30 }];
        const tempArr: any = [];
        data.counties.forEach((itme: any) => {
            tempArr.push(parseInt(itme.renkou.shouzai, 10));
        });
        this.getArrBreaks(tempArr);
        data.counties.forEach((itme: any) => {
            self.disasterData[itme.code] = {};
            self.disasterData[itme.code].num = parseInt(itme.renkou.shouzai, 10);
            const tempNum: number = self.disasterData[itme.code].num;
            if (tempNum <= self.arrBreak[0]) {
                self.disasterData[itme.code].color = arrColor[0];
            } else if (self.arrBreak[0] < tempNum && tempNum <= self.arrBreak[1]) {
                self.disasterData[itme.code].color = arrColor[1];
            } else if (self.arrBreak[1] < tempNum && tempNum <= self.arrBreak[2]) {
                self.disasterData[itme.code].color = arrColor[2];
            } else if (self.arrBreak[2] < tempNum) {
                self.disasterData[itme.code].color = arrColor[3];
            }
        });
    },
    // 根据行政区code，存储行政区划坐标
    getDistrictCorrd(districts: any) {
        this.ditrictCode = {};
        districts.forEach((item: any) => {
            this.ditrictCode[item.districtcode] = item;
        });
    },
    // 行政区划定位
    locateBycode(code: any) {
        const districtItem = this.ditrictCode[code];
        const point = new g2.sfs.Point({
            x: districtItem.longitude,
            y: districtItem.latitude,
            spatialReference: this.map.spatialReference,
        });
        this.map.pan(point);
        this.map.zoomTo(11);
    },
    // 数组分组
    arrKmeans(arrayToProcess: any, clusters: number) {
        this.arrBreak = [];
        this.arrBreakNote = [];
        if (arrayToProcess.length !== 0) {
            // 返回的分组值
            const self = this;
            const groups: any = new Array();
            // 分组节点
            const centroids: any = new Array();
            let oldcentroids: any = new Array();
            // 分组节点变更flag
            let changed = false;

            // 排序
            arrayToProcess.sort(function(a: any, b: any) { return a - b; });
            // 初始化分组数组
            let initgroups = 0;
            while (initgroups < clusters) {
                groups[initgroups] = new Array();
                initgroups++;
            }
            // 初始确定一个平均分组间距
            const initialcentroids = Math.round(arrayToProcess.length / (clusters + 1));
            // 构造分组点数组
            let i = 0;
            while (i < clusters) {
                centroids[i] = arrayToProcess[(initialcentroids * (i + 1))];
                i++;
            }
            do {
                let j = 0;
                while (j < clusters) {
                    groups[j] = [];
                    j++;
                }
                changed = false;
                let newGroup: any;
                // 待分组数据进入距离最近的分组
                let g = 0;
                while (g < arrayToProcess.length) {
                    let oldDistance = -1;
                    let n = 0;
                    while (n < clusters) {
                        const distance = Math.abs(centroids[n] - arrayToProcess[g]);
                        if (oldDistance === -1) {
                            oldDistance = distance;
                            newGroup = n;
                        } else if (distance <= oldDistance) {
                            newGroup = n;
                            oldDistance = distance;
                        }
                        n++;
                    }
                    groups[newGroup].push(arrayToProcess[g]);
                    g++;
                }
                oldcentroids = centroids;
                // 根据分组重新定义分组节点
                let jj = 0;
                while (jj < clusters) {
                    var total = 0;
                    var newCentroid = 0;
                    let ii = 0;
                    while (ii < groups[jj].length) {
                        total += groups[jj][ii];
                        ii++;
                    }

                    newCentroid = total / groups[newGroup].length;
                    centroids[jj] = newCentroid;
                    jj++;
                }
                let jjj = 0;
                while (jjj < clusters) {
                    var total = 0;
                    var newCentroid = 0;
                    let ii = 0;
                    while (ii < groups[jjj].length) {
                        total += groups[jjj][ii];
                        ii++;
                    }

                    newCentroid = total / groups[newGroup].length;
                    centroids[jjj] = newCentroid;
                    jjj++;
                }
                // 循环至最小距离
                let m = 0;
                while (m < clusters) {
                    if (centroids[m] !== oldcentroids[m]) {
                        changed = true;
                    }
                    m++;
                }
            }
            while (changed === true);

            groups.forEach((itme: any) => {
                self.arrBreak.push(itme[itme.length - 1]);
            });
        } else {
            this.arrBreak = [100, 200, 300, 400];
        }
        this.arrBreak.splice(this.arrBreak.length - 1, 1);
        if (this.arrBreak[0]) {
            this.arrBreakNote[0] = 0 + '-' + this.arrBreak[0];
        } else {
            this.arrBreak[0] = 100;
            this.arrBreakNote[0] = 0 + '-' + this.arrBreak[0];
        }
        if (this.arrBreak[1]) {
            this.arrBreakNote[1] = this.arrBreak[0] + '-' + this.arrBreak[1];
        } else {
            this.arrBreak[1] = this.arrBreak[0] + 100;
            this.arrBreakNote[1] = this.arrBreak[0] + '-' + this.arrBreak[1];
        }
        if (this.arrBreak[2]) {
            this.arrBreakNote[2] = this.arrBreak[1] + '-' + this.arrBreak[2];
        } else {
            this.arrBreak[2] = this.arrBreak[1] + 100;
            this.arrBreakNote[2] = this.arrBreak[1] + '-' + this.arrBreak[2];
        }
        if (this.arrBreak[3]) {
            this.arrBreakNote[3] = '>' + this.arrBreak[2];
        } else {
            this.arrBreak[3] = this.arrBreak[2] + 100;
            this.arrBreakNote[3] = '>' + this.arrBreak[2];
        }

    },
    getArrBreaks(arrayToProcess: any) {
        this.arrBreak = [];
        this.arrBreakNote = [];
        let sum: number = 0;
        arrayToProcess.forEach((item: any) => {
            sum += item;
        });
        if (sum !== 0) {
            const average: any = parseInt((sum / arrayToProcess.length).toString(), 10);
            const lowAg = parseInt((average / 2).toString(), 10);
            const topAg = average + lowAg;
            this.arrBreak = [lowAg, average, topAg];
        } else {
            this.arrBreak = [100, 200, 300];
        }
        this.arrBreakNote[0] = 0 + '-' + this.arrBreak[0];
        this.arrBreakNote[1] = this.arrBreak[0] + '-' + this.arrBreak[1];
        this.arrBreakNote[2] = this.arrBreak[1] + '-' + this.arrBreak[2];
        this.arrBreakNote[3] = '>' + this.arrBreak[2];
    },
    // 移除行政区划
    removeDistrict() {
        this.options.status = 'remove';
        this.simpleRenderMgr.remove(this.options.featureType);
        this.simpleRenderMgr.remove(this.options.featureType_boder);
        this.closePopup();
    },
    // 绘制行政区划
    _showDistrict(district: any) {
        const self = this;
        this.districtsList = district;
        const borderColor = new (g2 as any).sfs.Color({ r: 0, g: 255, b: 219, a: 128 });
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                let color: any = {};
                if (!self.disasterData[data.districtcode]) {
                    color = { r: 33, g: 196, b: 243, a: 1 };
                } else {
                    color = self.disasterData[data.districtcode].color;
                }
                const symbol = new (g2 as any).sfs.SimpleFillSymbol({
                    borderColor,
                    fillColor: new (g2 as any).sfs.Color({ r: color.r, g: color.g, b: color.b, a: color.a }),
                    opacity: 0.9,
                    borderThickness: 1,
                    style: 5,
                });
                const updateSymbolObj = {
                    borderColor,
                    fillColor: { r: color.r, g: color.g, b: color.b, a: color.a + 30 },
                    opacity: 1,
                    borderThickness: 1,
                    style: 5,
                };
                const hlSymbol = (G as any).utils.RenderUtil.object2Symbol('SimpleFillSymbol', updateSymbolObj);
                const textSym = new (g2 as any).sfs.TextSymbol({
                    text: data.districtname,
                    fontFamilyName: 'Microsoft Yahei',
                    fontSize: 24,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    textBackgroundBorderThickness: 2,
                    textBackgroundColor: new (g2 as any).sfs.Color({ a: 153, r: 24, g: 62, b: 80 }),
                    textBackgroundBorderColor: new (g2 as any).sfs.Color({ a: 255, r: 55, g: 224, b: 245 }),
                    foreground: new (g2 as any).sfs.Color({ a: 255, r: 254, g: 254, b: 254 }),
                    padding: [2, 10, 2, 10],
                });
                if (data.districtcode === self.currentHlId) {
                    const h1CurrencySymbol = new (g2 as any).sfs.CurrencySymbol({
                        textSymbol: textSym,
                        fillSymbol: hlSymbol,
                    });
                    return h1CurrencySymbol;
                } else {
                    const currencySymbol = new (g2 as any).sfs.CurrencySymbol({
                        textSymbol: textSym,
                        fillSymbol: symbol,
                    });
                    return currencySymbol;
                }
            },
        });
        const opts = {
            featureType: this.options.featureType,
            featureName: this.options.featureName,
            idField: 'districtcode',
            list: district,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['wkt'],
                geometryType: 'Polygon',
            }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {
                mouseover: (data: any) => {
                    // self._clearHighlight();
                    // self._highlight(data[0].element);
                },
            },
        };
        this.simpleRenderMgr.add(opts);
        this._fitBounds();
    },
    // 绘制行政区划
    _showDistrict_border(district: any) {
        const self = this;
        this.districtsList = district;
        const ploylineSymbolRed1: any = {
            type: 'SimpleLineSymbol',
            options: {
                color: {
                    a: 255,
                    r: 18,
                    g: 171,
                    b: 199,
                },
                width: 3,
            },
        };
        const ploylineSymbolHighLight1 = {
            type: 'SimpleLineSymbol',
            options: {
                color: {
                    a: 255,
                    r: 255,
                    g: 255,
                    b: 255,
                },
                style: 5,
                width: 7,
            },
        };
        const ploylineSymbolHighLight = (G as any).utils.RenderUtil.object2Symbol(ploylineSymbolHighLight1);
        const ploylineSymbolRed = (G as any).utils.RenderUtil.object2Symbol(ploylineSymbolRed1);
        const ploylineCombSymbolRed = new (g2 as any).sfs.LineCombinedSymbol({
            lineSymbols: [ploylineSymbolHighLight, ploylineSymbolRed],
        });
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: () => {
                return ploylineCombSymbolRed;
            },
        });
        const opts = {
            featureType: this.options.featureType_boder,
            featureName: this.options.featureName,
            idField: 'districtcode',
            list: district,
            geometryBuilder: new (G as any).utils.GeometryBuilder({
                geometryField: ['wkt'],
            }),
            symbolBuilder: new SymbolBuilder(),
            listeners: {
            },
        };
        this.simpleRenderMgr.add(opts);
    },
    _onMouseClick(event: any) {
        const self = this;
        console.log(event);
        const list = event.list;
        let flag: boolean = false; // 记录是否有点图层
        let i = 0;
        while (i < list.length) {
            const element: any = list[i].element;
            if (element.geometry.getGeometryType() === 1) {
                flag = true;
                break;
            }
            i++;
        }
        if (!flag) {
            list.forEach((item: any) => {
                const element: any = item.element;
                if (item.featureType === this.options.featureType) {
                    // self._removeHighlight();
                    // self._addHighlight(element);
                    const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
                    self.locateBycode(attributeObj.districtcode);
                    self.addPopup(attributeObj, [attributeObj.longitude, attributeObj.latitude], false);
                }
            });
        }

    },
    // 关闭信息框
    closePopup() {
        this.popupManager.remove(this.options.popupId);
        this._removeHighlight();
        this._clearHighlight();
    },
    // 添加弹窗
    addPopup(data: any, coordinate: any, noneMouseClick: any = true) {
        this.fire(this.options.popupEventId, {
            data,
            id: this.options.popupId,
        });
    },
    // 视野定位
    _fitBounds() {
        const extent: any = this.simpleRenderMgr.getExtent(this.options.featureType);
        this.options.featureLocate.fit({
            type: 'geojson',
            geom: extent.asGeoJson(),
        });
    },
    // 面高亮
    _highlight(element: any) {
        this.currentHlId = element.id;
        this._updateForHl(element.id);
    },
    // 清除面高亮，恢复图层原有的渲染
    _clearHighlight() {
        if (this.currentHlId) {
            const id: any = this.currentHlId;
            this.currentHlId = null;
            this._updateForHl(id);
        }
    },

    // 更新面
    _updateForHl(id: any) {
        let data: any = null;
        for (const item of this.districtsList) {
            if (item.districtcode === id) {
                data = item;
                break;
            }
        }
        const opts: any = {};
        opts.featureType = this.options.featureType;
        opts.list = [data];
        this.simpleRenderMgr.update(opts);
    },
    // 添加高亮
    _addHighlight(element: any) {
        const borderColor = new (g2 as any).sfs.Color({ r: 0, g: 255, b: 219, a: 128 });
        const updateSymbolObj = {
            type: 'SimpleFillSymbol',
            borderColor,
            fillColor: { r: 46, g: 239, b: 255, a: 70 },
            opacity: 1,
            borderThickness: 3,
            style: 5,
        };
        const options = {
            data: {
                type: 'geojson',
                geom: element.geometry.asGeoJson(),
            },
            style: updateSymbolObj,
            blink: {
                enable: false,
            },
        };
        this.featureHighlight.addHighlight(this.options.highLightId, options);
    },
    // 移除高亮
    _removeHighlight() {
        this.featureHighlight.removeHighlight(this.options.highLightId);
    },
});
export default component;
