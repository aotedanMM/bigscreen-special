const componentBase = (G as any).base.ComponentBase;
const SlopeMeasure = componentBase.extend({
    options: {
        // 二维地图
        map: null,
        // 三维地图
        globe: null,
    },
    // 坡度测量-测量图层
    measureSlopeLayer: null,
    //
    slopeAnalysis3D: null,
    // 是否开启
    slopeAnalysis3DActive: false,
    // 测量任务
    measureSlopeTask: null,
    // 元素映射
    markerElementKV: {},
    // 初始化
    initialize(options: any) {
        const self = this;
        componentBase.prototype.initialize.call(this, options);
        this._onMouseUp = async (button: any, shift: any, screenX: any, screenY: any, mapX: any, mapY: any, handle: any) => {
            const data: any = {
                x: mapX,
                y: mapY,
            };
            data.z = await self.getAltitude([mapX, mapY]);
            // 测量点击事件
            self._measureSlopeIfActive({
                x: mapX,
                y: mapY,
                z: data.z,
                spatialReference: self.getGlobe().getSrid(),
            });
            // 关闭按钮点击事件
            self._closeHandler({
                screenX,
                screenY,
            });
        };
    },
    /**
     * 加载
     * @param opts {Object}
     * @param opts.globe {Object}
     */
    load(opts: any) {
        const self = this;
        if (!this.isLoaded()) {
            if (opts.globe) {
                this.options.globe = opts.globe;
                this.loaded = true;
            }
            if (!this.toolTipWare) {
                this.toolTipWare = new g2.widget.TooltipWare3D({
                    map: {
                        map: self.getGlobe(),
                    },
                });
            }
            this.addListeners();
        }
    },
    // 卸载
    unload() {
        if (this.isLoaded()) {
            this.removeListeners();
            componentBase.prototype.unload.call(this);
        }
    },

    addListeners() {
        console.debug('监听三维坡度');
        if (this.map) {
            this.map.listen(G.misc.AppEvents.CLEAR_MAP, this.onClearMap, this);
        }
        if (this.getGlobe()) {
            this.getGlobe().on('mouseup', this._onMouseUp);
        }
    },

    removeListeners() {
        console.debug('取消监听三维坡度');
        if (this.map) {
            this.map.off(G.misc.AppEvents.CLEAR_MAP, this.onClearMap, this);
        }
        if (this.getGlobe()) {
            this.getGlobe().un('mouseup', this._onMouseUp);
        }
    },
    // 清屏事件
    onClearMap() {
        this.clearMeasureSlope();
    },
    getGlobe() {
        return this.options.globe;
    },
    // 开始坡度测量，【命名保持跟高度测量一致】
    initMeasureSlope() {
        if (!this.isLoaded()) {
            return;
        }
        this.removeMeasureSlope();
        if (this.measureSlopeLayer === null) {
            this.measureSlopeLayer = new g2.carto.ElementLayer3D({
                id: '3dmeasureSlopeLayer',
                opacity: 1,
                visible: true,
            });
            this.getGlobe().addLayer(this.measureSlopeLayer);
            this.slopeAnalysis3D = new g2.analyst.SlopeAnalysis3D({globe: this.getGlobe()});
        }
        this.slopeAnalysis3DActive = true;
    },
    // 关闭坡度测量，【命名保持跟高度测量一致】
    removeMeasureSlope() {
        this.slopeAnalysis3DActive = false;
        this.measureSlopeTask = null;
    },
    // 清除坡度测量，【命名保持跟高度测量一致】
    clearMeasureSlope() {
        if (this.measureSlopeLayer) {
            this.measureSlopeLayer.clear();
        }
        if (this.toolTipWare) {
            this.toolTipWare.clear();
        }
    },
    getAltitude(point: any) {
        return new Promise((resolve, reject) => {
            const position: any = new g2.sfs.Point({
                x: point[0],
                y: point[1],
                z: 0,
                spatialReference: this.getGlobe().getSrid(),
            });
            this.getGlobe().getAltitude([position]).then((points: any[]) => {
                const pos: any = points[0];
                resolve(parseFloat(pos.z.toFixed(2)));
            });
        });
    },
    _measureSlopeIfActive(data: any) {
        const self: any = this;
        if (this.slopeAnalysis3DActive && this.measureSlopeTask === null) {
            const point = new g2.sfs.Point(data);
            const taskId: any = G.utils.CommonUtil.newUUID32();
            this.measureSlopeTask = taskId;
            this.slopeAnalysis3D.slopeAnalysis(point).then((result: any) => {
                if (self.slopeAnalysis3DActive) {
                    const uuid = G.utils.CommonUtil.newUUID32();
                    data.uuid = uuid;
                    self._addMarker(data);
                    self._addLabel(result, data);
                    self._addClose(data);
                }
                self.slopeAnalysis3DActive = false;
                self.measureSlopeTask = null;
            });
        }
    },

    _addMarker(data: any) {
        const egis: any = g2;
        const markerSymbol = new g2.sfs.PictureMarkerSymbol({
            width: 17,
            height: 17,
            offsetX: 8,
            offsetY: 8,
            opacity: 1,
            rotation: 0,
            source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAABCUlEQVQ4ja2UMW7CQBBFP1tTREoqrkCE3SAOgYRdE3IDGk7AObB8CSQqquQOSYtcAUV8AJp9KbCt9cZytuBLU/zZ2aeRdnYEyIshsAE+gJK7yspvqvPWHR+wBC7061LVdUK2/1z2tfUhy9bx7QZZhk1T7GyGTVPI83u+rVUNGQLXJl0U2CjCGvM3ogiKwoX8AE8C1m4HNo67AXXEsd/RWsCxsXneD6iC3c6FHI2ksSqx3ytEHA6ufTWSXhp7PgdBvLpnI6ls7GgUBmnXlUbSV+0Gi0UQYzCfu/b7Ya8TPieTCZxOnXMi4K1zYpMEO51ikwSyrGti33n033E7CvnFK3pWgbtPPgncJ78BFOQPNLR5rgAAAABJRU5ErkJggg==',
        });
        const geom: any = new egis.sfs.Point(jQuery.extend(true, {}, data));
        const markerElement: any = new egis.sfs.Element({
            geometry: geom,
            symbol: markerSymbol,
        });
        this.measureSlopeLayer.add(markerElement);
        this.markerElementKV[data.uuid] = markerElement;
    },
    _addLabel(result: any, data: any) {
        const egis: any = g2;
        let avgSlope = '';
        let unit = '';
        if (result && result.length > 0) {
            avgSlope = result[0].avg;
            unit = result[0].unit;
        }
        const textPre = '坡度：';
        const textAfter = avgSlope;
        const textUnit = unit;
        const geomJson = jQuery.extend(true, {}, data);
        geomJson.z = geomJson.z + 10;
        const geom1: any = new egis.sfs.Point(geomJson);

        const contentTemplate = '<div>' +
            '<label style=" width:auto; text-align: center;height: 45px; font-weight:bold; padding: 1px 10px 1px 10px; background: rgba(254,254,254, 1); border: solid 2px red; border-radius: 5px;font-size: 32px;font-family: "Microsoft Yahei" , "Arial", "Simsun";">' +
            textPre + '<span style= "color: orange">' + textAfter +  '</span>' + textUnit +
            '</label>' +
            '</div>';
        // 创建提示框
        const tooltip = new egis.widget.Tooltip({
            id: data.uuid,
            anchor: geom1, // 提示工具在地图上停靠的位置
            content: contentTemplate, // 提示的内容
            layerId: '3dmeasureSlopeLayer', // this.getGlobe(), // 提示工具所在图层ID
            offset: [0, 10], // 位置偏移量
            className: 'slopeTipware',
        });
        // 将提示框加入到信息管理类对象中，显示提示信息
        this.toolTipWare.add(tooltip);
    },
    _addClose(data: any) {
        const egis: any = g2;
        const markerSymbol = new g2.sfs.PictureMarkerSymbol({
            width: 28,
            height: 28,
            offsetX: -14,
            offsetY: 14,
            opacity: 1,
            rotation: 0,
            source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAACKklEQVRIib2WvU7jQBSFz1ybFIi3QAIkN4AIuKGhpOE5Yinsc2SLaNcQmwehoQHRIYEEDUKyBG8ADUQ0cO8WY2NPxk4mgeyRLHky4/ly7s9owEQtJvrLRM9MJHN6XnJGSzHRHwC/AABbW8DGBn5Ut7fAzU0x6qFwJv2+zE39fuH0GUwkHIbzg+XinR1hIiEAdhjf3oDTUyDLpg9hlgFnZ3qPqjY3AQAaqFQ58f4OCUPIwQEkCIA0dYelKSQIIPv7kHYbGA7LuZxB1keXl8DDg35nhnS7btAk0WuZ9TjLgPNza5kNXF4GfL8ci0yGJgnk8BAQKX/zPL3XqJhIOIrMDKepsOeZveR5IkliV8NgUL/2+NgsmigSJpJ64LiNqtAkqV8zGNhVmgN923OuKIICzFDl4S1KTLpdM4xKQcUxEEXN4W90OMGpqzN3hxOcGnJxlsuu0iZoHJv9OgPMHZhvPNPcTMA0tQukkEufTgWsgyllupoCOh7YAFNxbOfUFdrYFi5N7XI4OJ00JyffP9pG1jYDs0y41XKDjYMuLIjc31tAO4ePj8DHh5mzoyOg02nOS12ffn7qvSbmcDgUDgL9L31/vLNRJYmw7+tv19ZEXl8th35RYV9aXIS6ugIuLoCVFWB1dXzVVdXpQO3tAU9PwO4usLRUzhUMJhLe3hZhdncygzgMv4pGXxN7vfnRKtdE8yLcbgPr6+4hdNHdHXB9XYx+o3LVf/kfV/1/DcDnNpE1jrsAAAAASUVORK5CYII=',
        });
        const geom: any = new egis.sfs.Point(jQuery.extend(true, {}, data));
        const markerElement: any = new egis.sfs.Element({
            geometry: geom,
            symbol: markerSymbol,
        });
        markerElement.uuid = data.uuid;
        markerElement.busitype = 'closeBtn';
        this.measureSlopeLayer.add(markerElement);
    },
    _closeHandler(event: any) {
        const screenX = event.screenX;
        const screenY = event.screenY;
        const ele = this.measureSlopeLayer.hitTest(screenX, screenY);
        if (ele && ele.element && ele.element.busitype === 'closeBtn') {
            this.measureSlopeLayer.remove(ele.element);
            this.measureSlopeLayer.remove(this.markerElementKV[ele.element.uuid]);
            this.toolTipWare.remove(ele.element.uuid);
        }
    },
});
export default SlopeMeasure;

