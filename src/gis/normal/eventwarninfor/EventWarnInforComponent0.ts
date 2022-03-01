// 事件预警信息
const componentBase = (G as any).base.ComponentBase;
const TownType: string = '';
const CountyType: string = '';
const component = componentBase.extend({
    options: {
        service: null,
        eventInfo: null,
        simpleRenderMgr: null,
        popupManager: null,
        featureLocate: null,
        featureHighlight: null,
        radius: {
            town: 20,
            county: 50,
        },
    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        this.currrentDistrictData = null;
        this.districtList = null;
        // do sth
        window.test = this;
    },
    // 加载
    load() {
        componentBase.prototype.load.call(this);
        this._showDistricts();
        // this.locateToAccidentPoint();
    },
    // 定位到事故点
    locateToAccidentPoint() {
        const point = this.options.eventInfo.getPoint(); // 事故点
        const locatedata: any = {
            x: point[0][0],
            y: point[0][1],
        };
        this.options.locateComponent.locate(locatedata);
    },
    // 卸载
    unload() {
        // todo 清除所有图层
        this._removeDistritPoints(); // 移除行政区划点
        this._removeDistricts(); // 移除行政区划
        componentBase.prototype.unload.call(this);
    },

    setRadius(radiusObj: any) {
        // 更新缓冲区半径值
        this.options.radius = radiusObj;
    },

    // 获取并且显示指定行政区范围内的行政区划点
    _showPointsInDis(district: any) {
        const self = this;
        // 定义样式
        const symbolObj: any = {
            width: 44,
            height: 44,
            offsetX: '11',
            offsetY: '11',
            opacity: '1',
            rotation: '0',
            source: this.options.symbolConfig.icons.rescueArea_disoatch_town_img,
        };
        this.options.service.getTownListByCounty({
            geometry: district,
        }).then((data: any) => {
            // 显示行政区划点
            const opts1array: any[] = ['pointsInDis', '行政区划范围内的点', 'id', data, 1, symbolObj];
            const opts1 = this._showPoints(opts1array);
            opts1.listeners = {
                click: (clickdata: any) => {
                    // this指向监听时的context变量
                    const center = clickdata[0].element.geometry;
                    self.options.popupManager.clear();
                    const transferData: any[] = [clickdata];
                    self.options.popupManager.addSimple({
                        id: 'popup_PointsInDis',
                        anchor: [center.x, center.y],
                        className: 'PointsInDis-tooltip',
                    }).then((content: any) => {
                        transferData.push(content);
                        self.fire('Pointspopup', {
                            data: transferData,
                        });
                    });
                },
            },
            this.options.simpleRenderMgr.add(opts1);
        });
    },

    // 显示点数据
    _showPoints(attribute: any) {
        const opts1: any = {};
        opts1.featureType = attribute[0]; // 指定数据类型
        opts1.featureName = attribute[1]; // 数据类型说明
        opts1.idField = attribute[2]; // 数据唯一标识的属性
        opts1.list = attribute[3]; // 数据列表
        opts1.type = attribute[4]; // 使用feature渲染
        opts1.geometryBuilder = new (G as any).utils.GeometryBuilder({ geometryField: ['geometry'] });
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (builddata: any) => {
                // 根据数据属性控制不同的显示效果
                return G.utils.RenderUtil.object2Symbol('PictureMarkerSymbol', attribute[5]);
            },
        });
        opts1.symbolBuilder = new SymbolBuilder();
        return opts1;
    },
    // 加载行政区划边界
    _showDistricts() {
        const self = this;
        this.options.service.getCounties({
            geometry: this.options.eventInfo.getMaxRangeGeometry(),
        }).then((data: any) => {
            // 叠加行政区划
            this._showPolygon(data);
            this._showPolygonName(data);
        });
    },

    // 加载面数据
    _showPolygon(districts: any) {
        const self = this;
        this.options.simpleRenderMgr.remove('district');
        const dataList = districts;
        this.districtList = districts;
        const symbolObj = {
            borderColor: {
                a: 255,
                r: 255,
                g: 181,
                b: 177,
            },
            fillColor: {
                a: 122,
                r: 255,
                g: 0,
                b: 0,
            },
            borderThickness: 2,
            opacity: 0.5,
        };
        const updateSymbolObj = {
            borderColor: {
                a: 255,
                r: 255,
                g: 181,
                b: 177,
            },
            fillColor: {
                a: 122,
                r: 0,
                g: 0,
                b: 255,
            },
            borderThickness: 2,
            opacity: 1,
        };
        const symbol = (G as any).utils.RenderUtil.object2Symbol('SimpleFillSymbol', symbolObj);
        const updateSymbol = (G as any).utils.RenderUtil.object2Symbol('SimpleFillSymbol', updateSymbolObj);
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (data: any) => {
                if (this.currrentDistrictData
                    && this.currrentDistrictData.id === data.id) {
                    return updateSymbol;
                } else {
                    return symbol;
                }
            },
        });
        const opts = {
            featureType: 'district',
            featureName: '区划边界',
            idField: 'id',
            list: dataList,
            geometryBuilder: new (G as any).utils.GeometryBuilder({ geometryField: ['geometry'] }),
            symbolBuilder:  new SymbolBuilder(),
            listeners: {
                click: (clickdata: any) => {
                    // 点击时高亮显示面数据
                    this._addDistrictHl(clickdata[0].element.id);
                    // 点击时显示位于行政区划范围内的点数据
                    // this._showPointsInDis(clickdata);
                },
            },
        };
        this.options.simpleRenderMgr.add(opts);
        // 显示面数据的name名称
    },

    // 显示面数据的name名称
    _showPolygonName(polygons: any) {
        for ( let i = 0 , len = polygons.length; i < len; i++) {
            let sumX: number = 0;
            let sumY: number = 0;
            const coordinatesLen: number = polygons[i].geometry.coordinates[0].length;
            for ( let j = 0 ; j < coordinatesLen; j++) {
                const x: number = polygons[i].geometry.coordinates[0][j][0];
                const y: number = polygons[i].geometry.coordinates[0][j][1];
                sumX += x;
                sumY += y;
            }
            const center = {x: sumX / coordinatesLen, y: sumY / coordinatesLen};
            const name = polygons[i].tag.district;
            const contentTemplate = '<div>' +
            '<label style=" width:auto; text-align: center;height: 45px;color: #fefefe;padding: 1px 10px 1px 10px; background: rgba(24, 62, 80, 0.60); border: solid 2px #37e0f5; border-radius: 5px;font-size: 24px;font-family: "Microsoft Yahei" , "Arial", "Simsun";">' +
            name +
            '</label>' +
            '</div>';
            // 创建提示框
            const tooltip = new g2.widget.Tooltip({
                anchor: center, // 提示工具在地图上停靠的位置
                content: contentTemplate, // 提示的内容
                layerId: this.map, // 提示工具所在图层ID
                offset: [0, 0], // 位置偏移量
            });
            // 创建一个信息管理类对象，绑定地图对象
            const toolTipWare = new g2.widget.TooltipWare({
                map: this.map,
            });
            // 将提示框加入到信息管理类对象中，显示提示信息
            toolTipWare.add(tooltip);
        }

    },

    // 高亮行政区划
    _addDistrictHl(districtId: string) {
        this._clearDistrictHl(); // 清除高亮显示
        let data = null;
        // 获取指定id的面数据
        for ( let i = 0 , len = this.districtList.length; i < len; i++) {
            if ( this.districtList[i].id === districtId) {
                data = this.districtList[i];
                break;
            }
        }
        this.currrentDistrictData = data || null;
        // 更新面数据的样式
        if (data) {
            this.options.simpleRenderMgr.update({
                featureType: 'district',
                list: [data],
            });
        }
    },
    // 清除行政区划高亮
    _clearDistrictHl() {
        if (this.currrentDistrictData) {
            const data = this.currrentDistrictData;
            this.currrentDistrictData = null;
            this.options.simpleRenderMgr.update({
                featureType: 'district',
                list: [data],
            });
        }
    },
    /**
     * 切换乡镇点
     * @param visible 是否显示
     */
    toggleTownLayer(visible: any) {
        this._removeDistritPoints();
        if (visible === true) {
            //
            this.options.service.getTownList({
                geometry: this._getBuffer(),
            }).then((data: any) => {
                // 叠加行政区划
                this._showDistrictPoints(data, 'town');
                this.TownType = 'town';
            });
        }
    },

    /**
     * 切换区县点
     * @param visible 是否显示
     */
    toggleCountyLayer(visible: boolean) {
        this._removeDistritPoints();
        if (visible === true) {
            // 获取区县点
            this.options.service.getCountyList({
                geometry: this._getBuffer(),
            }).then((data: any) => {
                // 叠加行政区划，并且显示区县点、以及区县点与事故点之间的连线
                this._showDistrictPoints(data, 'county');
                this.CountyType = 'county';
            });
        }
    },

    // 移除行政区划点
    _removeDistritPoints() {
        // 移除图层,将行政区划点的显示状态设置为false
        // todo
        this.options.simpleRenderMgr.remove(this.TownType);
        this.options.simpleRenderMgr.remove(this.CountyType);
        this.options.simpleRenderMgr.remove('LineString');
    },

    // 移除行政区划面
    _removeDistricts() {
        // 移除图层
        // todo
        this.options.simpleRenderMgr.remove('district');
    },

    _getBuffer() {
        const bufferGeom =  G.utils.SpatialOPUtil.getBuffer({
            geometry: {
                type: 'Point',
                coordinates: this.options.eventInfo.getPoint(),
            },
            spatialReference: 4326,
            // 50公里
            radius: 50 * 1000,
        });
        return bufferGeom;
    } ,

    // 显示行政区划点
    _showDistrictPoints(data: any, type: string) {
        // 显示行政区划点、显示行政区划点到事故点的连线
        const self = this;
        const point = this.options.eventInfo.getPoint(); // 事故点
        this.options.simpleRenderMgr.remove(type);
        let symbolObj: any = {};
        if (type === 'county') {
            symbolObj = {
                width: 44,
                    height: 44,
                    offsetX: '11',
                    offsetY: '11',
                    opacity: '1',
                    rotation: '0',
                    source: this.options.symbolConfig.icons.rescueArea_disoatch_county_img,
            };
        } else {
            symbolObj = {
                width: 44,
                    height: 44,
                    offsetX: '11',
                    offsetY: '11',
                    opacity: '1',
                    rotation: '0',
                    source: this.options.symbolConfig.icons.rescueArea_disoatch_town_img,
            };
        }
        const opts1array: any[] = [type, '行政区划点', 'id', data, 1, symbolObj];
        const opts1 = self._showPoints(opts1array);
        opts1.listeners = {
            click: (clickdata: any) => {
                // this指向监听时的context变量
                const center = clickdata[0].element.geometry;
                self.options.popupManager.clear();
                self.options.popupManager.addSimple({
                    id: 'popup_DistrictPoints',
                    anchor: [center.x, center.y],
                    className: 'DistrictPoints-tooltip',
                }).then((content: any) => {
                    self.fire('Pointspopup', {
                        data: content,
                    });
                });
            },
        },
        this.options.simpleRenderMgr.add(opts1);
        const lineData: any[] = [];
        // 显示行政区划点到事故点的连线
        const pointx = point[0][0];
        const pointy = point[0][1];
        for (let i = 0, len = data.length; i < len ; i++) {
            const x = data[i].geometry.coordinates[0];
            const y = data[i].geometry.coordinates[1];
            const lineCoorObj = {
                id: '1',
                 geometry: {
                     type: 'LineString',
                     coordinates: [
                         [x, y],
                         [pointx, pointy],
                    ],
                 },
            };
            lineData.push(lineCoorObj);
        }
        self._showPolyline(lineData);
    },
    _showPolyline(data: any) {
        this.options.simpleRenderMgr.remove('LineString');
        const dataList = data;
        const symbolObj = {
            color: {
                a: 153,
                r: 255,
                g: 0,
                b: 0,
            },
            style: 5,
            width: 2,
        };
        const symbol = (G as any).utils.RenderUtil.object2Symbol('SimpleLineSymbol', symbolObj);
        const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
            build: (builddata: any) => {
                return symbol;
            },
        });
        const opts = {
            featureType: 'LineString',
            featureName: '点之间连线',
            idField: 'id',
            list: dataList,
            geometryBuilder: new (G as any).utils.GeometryBuilder({ geometryField: ['geometry'] }),
            symbolBuilder:  new SymbolBuilder(),
        };
        this.options.simpleRenderMgr.add(opts);
    },
});
export default component;
