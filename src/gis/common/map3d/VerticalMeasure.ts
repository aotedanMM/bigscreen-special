const componentBase = (G as any).base.ComponentBase;
const VerticalMeasure = componentBase.extend({
    options: {
        // 二维地图
        map: null,
        // 三维地图
        globe: null,
    },
    // 高差测量-测量图层
    measureLayer: null,
    // 高差测量-元素模板
    templateElement: null,
    // 高差测量-文字标注
    textElement: null,
    // 起点
    startPoint: null,
    // 终点
    endPoint: null,
    // 平行线
    parallelLine: null,
    // 连线
    linkLine: null,
    // 高差测量-绘制复合元素
    drawElement: null,
    // 高差测量-工具
    modelVerticalMeasureTool: null,
    // 高差测量-命令通知器
    commandNotify: null,
    lastTool: null,
    tooltipWare: null,
    // 关闭按钮
    closeElement: null,
    // 元素映射
    elementArr: [],
    elementKV: {},
    layerKV: {},

    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
        const self = this;
        this._onMouseUp = async (button: any, shift: any, screenX: any, screenY: any, mapX: any, mapY: any, handle: any) => {
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
        if (!this.isLoaded()) {
            if (opts.globe) {
                this.options.globe = opts.globe;
                this.loaded = true;
            }
            // if (this.measureLayer === null) {
            //     this._initMeasureLayer(); // 测量图层
            // }
            if (this.tooltipWare === null) {
                this._initTooltipWare();
            }
            this.addListeners();
        }
    },
    // 卸载
    unload() {
        this.removeListeners();
        componentBase.prototype.unload.call(this);
    },

    addListeners() {
        if (this.map) {
            this.map.listen(G.misc.AppEvents.CLEAR_MAP, this.onClearMap, this);
        }
        if (this.getGlobe()) {
            this.getGlobe().on('mouseup', this._onMouseUp);
        }
    },

    removeListeners() {
        if (this.map) {
            this.map.off(G.misc.AppEvents.CLEAR_MAP, this.onClearMap, this);
        }
        if (this.getGlobe()) {
            this.getGlobe().un('mouseup', this._onMouseUp);
        }
    },
    // 清屏事件
    onClearMap() {
        this.clearVerticalMeasure();
    },
    getGlobe() {
        return this.options.globe;
    },
    /**
     * 初始化高差测量
     */
    initVerticalMeasure() {
        if (!this.isLoaded()) {
            return;
        }
        // this.removeMeasureSlope();
        const uuid: any = G.utils.CommonUtil.newUUID32();
        this.elementKV[uuid] = [];
        this._initMeasureLayer(uuid);
        this._initStartPoint(uuid);
        this._initEndPoints(uuid);
        this._initVerticalLine(uuid);
        this._initLinkLine(uuid);
        this._initParallelLine(uuid);
        this._initDrawElement(uuid); // 绘制元素
        this._initTool(uuid); // 工具
        //
        this._initCommand(); // 命令管理
        this.lastTool = this.getGlobe().tool;
        this.commandNotify.activeCommand('ModelVerticalMeasure');
    },
    /**
     * 清除高差测量图层
     */
    clearVerticalMeasure() {
        this._deactiveVerticalMeasure();
        // if (this.measureLayer) {
        //     this.measureLayer.clear();
        // }
        for (const key in this.layerKV) {
            if (this.layerKV.hasOwnProperty(key)) {
                const layer = this.layerKV[key];
                layer.clear();
                this.getGlobe().removeLayer(layer);
            }
        }
        if (this.tooltipWare) {
            this.tooltipWare.clear();
        }
    },
    /**
     * 移除高差测量
     */
    removeVerticalMeasure() {
        this.clearVerticalMeasure();
        this._deactiveVerticalMeasure();
    },
    _deactiveVerticalMeasure() {
        this.getGlobe().currentTool(this.lastTool || null);
    },
    _initMeasureLayer(uuid: string) {
        // if (!this.measureLayer) {
            this.measureLayer = new g2.carto.ElementLayer3D({
                id: uuid,
                opacity: 1,
                visible: true,
            });
            this.getGlobe().addLayer(this.measureLayer);
            this.layerKV[uuid] = this.measureLayer;
        // }
    },
    _initStartPoint(uuid: string) {
        const srid = this.getGlobe().getSrid() || 4490;
        const center = new g2.sfs.Point({ x: 0, y: 0, spatialReference: srid });
        const markerSymbol = new g2.sfs.PictureMarkerSymbol({
            width: 17,
            height: 17,
            offsetX: 8,
            offsetY: 8,
            opacity: 1,
            rotation: 0,
            source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAABCUlEQVQ4ja2UMW7CQBBFP1tTREoqrkCE3SAOgYRdE3IDGk7AObB8CSQqquQOSYtcAUV8AJp9KbCt9cZytuBLU/zZ2aeRdnYEyIshsAE+gJK7yspvqvPWHR+wBC7061LVdUK2/1z2tfUhy9bx7QZZhk1T7GyGTVPI83u+rVUNGQLXJl0U2CjCGvM3ogiKwoX8AE8C1m4HNo67AXXEsd/RWsCxsXneD6iC3c6FHI2ksSqx3ytEHA6ufTWSXhp7PgdBvLpnI6ls7GgUBmnXlUbSV+0Gi0UQYzCfu/b7Ya8TPieTCZxOnXMi4K1zYpMEO51ikwSyrGti33n033E7CvnFK3pWgbtPPgncJ78BFOQPNLR5rgAAAABJRU5ErkJggg==',
        });
        this.startPoint = new g2.sfs.Element({
            geometry: center,
            symbol: markerSymbol,
        });
        this.startPoint.id = uuid;
        this.elementArr.push(this.startPoint);
    },
    _initEndPoints(uuid: string) {
        const srid = this.getGlobe().getSrid() || 4490;
        const center = new g2.sfs.Point({ x: 0, y: 0, spatialReference: srid });
        const markerSymbol = new g2.sfs.PictureMarkerSymbol({
            width: 17,
            height: 17,
            offsetX: 8,
            offsetY: 8,
            opacity: 1,
            rotation: 0,
            source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAABCUlEQVQ4ja2UMW7CQBBFP1tTREoqrkCE3SAOgYRdE3IDGk7AObB8CSQqquQOSYtcAUV8AJp9KbCt9cZytuBLU/zZ2aeRdnYEyIshsAE+gJK7yspvqvPWHR+wBC7061LVdUK2/1z2tfUhy9bx7QZZhk1T7GyGTVPI83u+rVUNGQLXJl0U2CjCGvM3ogiKwoX8AE8C1m4HNo67AXXEsd/RWsCxsXneD6iC3c6FHI2ksSqx3ytEHA6ufTWSXhp7PgdBvLpnI6ls7GgUBmnXlUbSV+0Gi0UQYzCfu/b7Ya8TPieTCZxOnXMi4K1zYpMEO51ikwSyrGti33n033E7CvnFK3pWgbtPPgncJ78BFOQPNLR5rgAAAABJRU5ErkJggg==',
        });
        this.endPoint = new g2.sfs.Element({
            id: uuid,
            geometry: center,
            symbol: markerSymbol,
        });
        this.endPoint.id = uuid;
        this.elementArr.push(this.endPoint);
    },
    _initVerticalLine(uuid: string) {
        const srid = this.getGlobe().getSrid() || 4490;
        // 垂直线模板
        if (!this.templateElement) {
            const extrutedLine = new g2.sfs.ExtrudedLine({ spatialReference: srid });
            const lineSymbol = new g2.sfs.PolylineArrow3DSymbol({
                color: new g2.sfs.Color({ a: 255, r: 254, g: 2, b: 2 }),
                width: 10,
            });
            this.templateElement = new g2.sfs.Element({
                geometry: extrutedLine,
                symbol: lineSymbol,
            });
        }
        this.templateElement.id = uuid;
        this.elementArr.push(this.templateElement);
    },
    _initLinkLine(uuid: string) {
        // 连线
        const srid = this.getGlobe().getSrid() || 4490;
        const extrutedLine = new g2.sfs.ExtrudedLine({ spatialReference: srid });
        const lineSymbol = new g2.sfs.SimpleLineSymbol({
            color: new g2.sfs.Color({ a: 255, r: 0, g: 255, b: 228}),
            style: 3,
        });
        this.linkLine = new g2.sfs.Element({
            geometry: extrutedLine,
            symbol: lineSymbol,
        });
        this.linkLine.id = uuid;
        this.elementArr.push(this.linkLine);
    },
    _initParallelLine(uuid: string) {
        // 平行线
        const srid = this.getGlobe().getSrid() || 4490;
        const extrutedLine = new g2.sfs.ExtrudedLine({ spatialReference: srid });
        const lineSymbol = new g2.sfs.SimpleLineSymbol({
            color: new g2.sfs.Color({ a: 255, r: 254, g: 2, b: 2 }),
            style: 3,
        });
        this.parallelLine = new g2.sfs.Element({
            geometry: extrutedLine,
            symbol: lineSymbol,
        });
        this.parallelLine.id = uuid;
        this.elementArr.push(this.parallelLine);
    },
    _initDrawElement(uuid: string) {
        // 复合模板
        // if (!this.drawElement) {
            this.drawElement = new (window as any).egis.sfs.CompositeElement();
            this.drawElement.add(this.startPoint);
            this.drawElement.add(this.endPoint);
            this.drawElement.add(this.templateElement);
            this.drawElement.add(this.templateElement.copy());
            this.drawElement.add(this.parallelLine);
            this.drawElement.add(this.linkLine);
            this.elementArr.push(this.drawElement);
            // this.drawElement.add(this.textElement);
        // }
    },
    _initTooltipWare() {
        this.tooltipWare = new g2.widget.TooltipWare3D({
            map: {
                map: this.getGlobe(),
            },
        });
    },
    _initTool(uuid: string) {
        const self = this;
        // if (!this.modelVerticalMeasureTool) {
        if (this.commandManager && this.modelVerticalMeasureTool) {
            this.commandManager.remove('ModelVerticalMeasure');
        }
        this.modelVerticalMeasureTool = new (window as any).egis.basic.ModelVerticalMeasureTool({
            id: 'ModelVerticalMeasure',
            layer: this.measureLayer,
            templateElement: this.templateElement,
            drawElementTemplate: this.drawElement,
            textPosition: 'top',
            globe: this.getGlobe(),
            addTooltip: (drawElement: any) => {
                self.elementKV[uuid] = drawElement.elements;
                self._addClose(drawElement.elements[1], uuid);
                self._addLabel(drawElement.elements, uuid);
            },
            updateTooltip: (drawElement: any) => {
                self.elementKV[uuid] = drawElement.elements;
                self._addClose(drawElement.elements[1], uuid);
                self._addLabel(drawElement.elements, uuid);
            },
        });
        const oldFinished: any = this.modelVerticalMeasureTool.finished;
        this.modelVerticalMeasureTool.finished = function(...arg: any) {
            oldFinished.apply(self.modelVerticalMeasureTool, arg);
            self._deactiveVerticalMeasure();
        };
        if (this.commandManager && this.modelVerticalMeasureTool) {
            this.commandManager.add(this.modelVerticalMeasureTool);
        }
        // }
    },
    _addClose(element: any, uuid: string) {
        const egis: any = g2;
        if (this.closeElement && this.closeElement.id === uuid && this.closeElement.busitype === 'closeBtn') {
            this.measureLayer.remove(this.closeElement);
        }
        const markerSymbol = new g2.sfs.PictureMarkerSymbol({
            width: 28,
            height: 28,
            offsetX: -14,
            offsetY: 14,
            opacity: 1,
            rotation: 0,
            source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAACKklEQVRIib2WvU7jQBSFz1ybFIi3QAIkN4AIuKGhpOE5Yinsc2SLaNcQmwehoQHRIYEEDUKyBG8ADUQ0cO8WY2NPxk4mgeyRLHky4/ly7s9owEQtJvrLRM9MJHN6XnJGSzHRHwC/AABbW8DGBn5Ut7fAzU0x6qFwJv2+zE39fuH0GUwkHIbzg+XinR1hIiEAdhjf3oDTUyDLpg9hlgFnZ3qPqjY3AQAaqFQ58f4OCUPIwQEkCIA0dYelKSQIIPv7kHYbGA7LuZxB1keXl8DDg35nhnS7btAk0WuZ9TjLgPNza5kNXF4GfL8ci0yGJgnk8BAQKX/zPL3XqJhIOIrMDKepsOeZveR5IkliV8NgUL/2+NgsmigSJpJ64LiNqtAkqV8zGNhVmgN923OuKIICzFDl4S1KTLpdM4xKQcUxEEXN4W90OMGpqzN3hxOcGnJxlsuu0iZoHJv9OgPMHZhvPNPcTMA0tQukkEufTgWsgyllupoCOh7YAFNxbOfUFdrYFi5N7XI4OJ00JyffP9pG1jYDs0y41XKDjYMuLIjc31tAO4ePj8DHh5mzoyOg02nOS12ffn7qvSbmcDgUDgL9L31/vLNRJYmw7+tv19ZEXl8th35RYV9aXIS6ugIuLoCVFWB1dXzVVdXpQO3tAU9PwO4usLRUzhUMJhLe3hZhdncygzgMv4pGXxN7vfnRKtdE8yLcbgPr6+4hdNHdHXB9XYx+o3LVf/kfV/1/DcDnNpE1jrsAAAAASUVORK5CYII=',
        });
        const geom: any = new egis.sfs.Point(jQuery.extend(true, {}, element.geometry));
        this.closeElement = new egis.sfs.Element({
            geometry: geom,
            symbol: markerSymbol,
        });
        this.closeElement.id = uuid;
        this.closeElement.busitype = 'closeBtn';
        this.measureLayer.add(this.closeElement);
    },
    _addLabel(elements: any, uuid: string) {
        this.tooltipWare.remove(uuid);
        const starter = elements[0];
        const ender = elements[1];
        const srid = this.getGlobe().getSrid() || 4490;
        const center = new g2.sfs.Point({
            x: starter.geometry.x,
            y: starter.geometry.y,
            z: (starter.geometry.z + ender.geometry.z) / 2,
            spatialReference: srid,
        });
        const egis: any = g2;
        const height = (Math.abs(ender.geometry.z - starter.geometry.z) / 1000).toFixed(2);
        const unit = 'km';
        const textPre = '高度：';
        const textAfter = height;
        const textUnit = unit;
        const contentTemplate = '<div>' +
            '<label style=" width:auto; text-align: center;height: 45px; font-weight:bold; padding: 1px 10px 1px 10px; background: rgba(254,254,254, 1); border: solid 2px red; border-radius: 5px;font-size: 32px;font-family: "Microsoft Yahei" , "Arial", "Simsun";">' +
            textPre + '<span style= "color: orange">' + textAfter +  '</span>' + textUnit +
            '</label>' +
            '</div>';
        // 创建提示框
        const tooltip = new egis.widget.Tooltip({
            id: uuid,
            anchor: center, // 提示工具在地图上停靠的位置
            content: contentTemplate, // 提示的内容
            layerId: '3dmeasureLayer', // this.getGlobe(), // 提示工具所在图层ID
            offset: [0, -10], // 位置偏移量
        });
        // 将提示框加入到信息管理类对象中，显示提示信息
        this.tooltipWare.add(tooltip);
    },
    /**
     * 命令管理机制
     */
    _initCommand() {
        // if (!this.commandNotify) {
        // 创建 命令管理器，用于管理命令
        this.commandManager = new (window as any).egis.gdm.CommandManager();
        // 创建命令通知器，用于命令之间的相互通知
        this.commandNotify = new (window as any).egis.gdm.CommandNotify({
            manager: this.commandManager,
        });
        // 添加命令 至命令管理器
        this.commandManager.add(this.modelVerticalMeasureTool);
        // 标绘编辑采用的选中绘制集合
        const graphicSet = new (window as any).egis.carto.GraphicSelectionSet();
        // 命令构造
        this.commandManager.onCreate({
            map: this.getGlobe(),
            commandNotify: this.commandNotify,
            graphicSelectionSet: graphicSet,
        });
    },
    _closeHandler(event: any) {
        const screenX = event.screenX;
        const screenY = event.screenY;
        const ele = this._getHit(screenX, screenY);
        if (ele) {
            this.measureLayer.remove(ele.element);
            // this.elementArr.forEach((element: any) => {
            //     this.measureLayer.remove(element);
            // });
            // this.elementKV[ele.element.id].forEach((element: any) => {
            //     this.measureLayer.remove(element);
            // });
            this.layerKV[ele.element.id].clear();
            this.getGlobe().removeLayer(this.layerKV[ele.element.id]);
            // this.measureLayer.remove(this.drawElement);
            this.tooltipWare.remove(ele.element.id);
        }
    },
    _getHit(screenX: any, screenY: any) {
        let res: any = null;
        for (const key in this.layerKV) {
            if (this.layerKV.hasOwnProperty(key)) {
                const layer = this.layerKV[key];
                const ele = layer.hitTest(screenX, screenY);
                if (ele && ele.element && ele.element.busitype === 'closeBtn') {
                    res = ele;
                    break;
                }
            }
        }
        return res;
    },
});
export default VerticalMeasure;

