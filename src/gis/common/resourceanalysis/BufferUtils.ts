// 缓冲区工具
const componentBase = (G as any).base.ComponentBase;
const bufferUtils = componentBase.extend({
    options: {

    },
    // 初始化
    initialize(options: any) {
        componentBase.prototype.initialize.call(this, options);
    },
    // 加载
    load() {
        componentBase.prototype.load.call(this);
        this.initBufferutils();
    },
    // 销毁
    destroy() {
        this.bufferDraw.destroy();
        componentBase.prototype.destroy.call(this);
    },
    // 卸载
    unload() {
        componentBase.prototype.unload.call(this);
    },
     // 初始化buffer工具
     initBufferutils() {
        this.bufferDraw = new (G as any).interact.Buffer({
            map: this.map,
        });
        this.bufferDraw.load();
    },
    // 线缓冲
    drawbufferPolyline(geom: any, distance: any, callback: (data: any) => {}) {
        const param = {
            id: 'test00',
            name: 'test00',
            data: {
                type: 'wkt',
                geom, // "LINESTRING(115.42341096 39.44275803,115.42341096 41.0608160100001,113.51462504 39.44275803)"
            },
            buffer: {
                radius: distance, // 30000,
                callback(bufferGeom: any, radius: any) {
                    if ( callback) {
                        callback.call(null, bufferGeom);
                    }
                },
                // 控制按钮
                drag: {
                    visible: true,
                    style: {
                        type: 'SimpleMarkerSymbol',
                        options: {
                            borderColor: {
                                a: 200,
                                r: 125,
                                g: 125,
                                b: 125,
                            },
                            fillColor: {
                                a: 200,
                                r: 125,
                                g: 225,
                                b: 125,
                            },
                            borderThickness: 2,
                            size: 8,
                            offsetX: '2',
                            offsetY: '5',
                        },
                    },
                },
                // 半径轴线
                axis: {
                    visible: true,
                    style: {
                        type: 'SimpleLineSymbol',
                        options: {
                            color: {
                                a: 153,
                                r: 0,
                                g: 0,
                                b: 255,
                            },
                            style: 5,
                            width: 2,
                        },
                    },
                },
                // 距离标识
                label: {
                    visible: true,
                    position: 'right',
                    style: {
                        type: 'TextSymbol',
                        options: {
                            text: '距离',
                            fontFamilyName: '黑体',
                            fontSize: 14,
                            foreground: {
                                a: 255,
                                r: 255,
                                g: 125,
                                b: 125,
                            },
                            borderColor: {
                                a: 255,
                                r: 122,
                                g: 122,
                                b: 122,
                            },
                            borderThickness: 0,
                            rotation: 0,
                            offsetX: 50,
                            offsetY: 0,
                        },
                    },
                },
                // 面填充
                fill: {
                    visible: true,
                    style: {
                        type: 'SimpleFillSymbol',
                        options: {
                            borderColor: {
                                a: 153,
                                r: 0,
                                g: 0,
                                b: 255,
                            },
                            fillColor: {
                                a: 150,
                                r: 19,
                                g: 181,
                                b: 177,
                            },
                            borderThickness: 0,
                            opacity: 1,
                        },
                    },
                },
            },
        };
        this.clearBuffer();
        this.bufferDraw.buffer(param);

    },
    // 面缓冲
    drawbufferPolygon(geom: any, distance: any, callback: (data: any) => {}) {
        const param = {
            id: 'test01',
            name: 'test01',
            data: {
                type: 'wkt',
                geom, // "POLYGON((115.42341096 39.44275803,115.42341096 41.0608160100001,117.51462504 41.0608160100001,117.51462504 39.44275803,115.42341096 39.44275803))"
            },
            buffer: {
                radius: distance, // 100000,
                callback(bufferGeom: any, radius: any) {
                    if (callback) {
                        callback.call(null, bufferGeom);
                    }
                },
                // 控制按钮
                drag: {
                    visible: true,
                    style: {
                        type: 'SimpleMarkerSymbol',
                        options: {
                            borderColor: {
                                a: 200,
                                r: 125,
                                g: 125,
                                b: 125,
                            },
                            fillColor: {
                                a: 200,
                                r: 125,
                                g: 225,
                                b: 125,
                            },
                            borderThickness: 2,
                            size: 8,
                            offsetX: '2',
                            offsetY: '5',
                        },
                    },
                },
                // 半径轴线
                axis: {
                    visible: true,
                    style: {
                        type: 'SimpleLineSymbol',
                        options: {
                            color: {
                                a: 153,
                                r: 0,
                                g: 0,
                                b: 255,
                            },
                            style: 5,
                            width: 2,
                        },
                    },
                },
                // 距离标识
                label: {
                    visible: true,
                    position: 'right',
                    style: {
                        type: 'TextSymbol',
                        options: {
                            text: '距离',
                            fontFamilyName: '黑体',
                            fontSize: 14,
                            foreground: {
                                a: 255,
                                r: 255,
                                g: 125,
                                b: 125,
                            },
                            borderColor: {
                                a: 255,
                                r: 122,
                                g: 122,
                                b: 122,
                            },
                            borderThickness: 0,
                            rotation: 0,
                            offsetX: 50,
                            offsetY: 0,
                        },
                    },
                },
                // 面填充
                fill: {
                    visible: true,
                    style: {
                        type: 'SimpleFillSymbol',
                        options: {
                            borderColor: {
                                a: 153,
                                r: 0,
                                g: 0,
                                b: 255,
                            },
                            fillColor: {
                                a: 150,
                                r: 19,
                                g: 181,
                                b: 177,
                            },
                            borderThickness: 0,
                            opacity: 1,
                        },
                    },
                },
            },
        };
        this.clearBuffer();
        this.bufferDraw.buffer(param);
    },
    // 点缓冲
    drawBufferPoint(geom: any, distance: any, callback: (data: any) => {}) {
        const param = {
            id: 'test03',
            name: 'test03',
            data: {
                type: 'wkt',
                geom, // "POINT(117.3 35.5)"
            },
            buffer: {
                radius: distance, // 100000,
                callback(bufferGeom: any, radius: any) {
                    if (callback) {
                        callback.call(null, bufferGeom);
                    }
                },
                drag: {
                    visible: true,
                    style: {
                        type: 'PictureMarkerSymbol',
                        options: {
                            source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAUCAYAAADskT9PAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzdCRTQ5OTYzRkFFMTFFNDk1NTE5ODREMUQwMDhDMzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzdCRTQ5OTczRkFFMTFFNDk1NTE5ODREMUQwMDhDMzMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDN0JFNDk5NDNGQUUxMUU0OTU1MTk4NEQxRDAwOEMzMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDN0JFNDk5NTNGQUUxMUU0OTU1MTk4NEQxRDAwOEMzMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpA7b9wAAAPDSURBVHjarFZbTxNREJ7d7ba7lbaAgqBUMETEW9OggCYiYIyKJhp+gA/6B4wPhGhMjET9CaivXggxXogkaqLxQXxofCCKFRSjQohRgZa2WLbXXWfWs02tB2ONk3xJe2Z25pvvzDm7Ql9fH3BMQEigaeWQTu8Cw9iB/0sQ1fA3ZhgGCMIs/gojXiGeg8czzwu1cQrbIJWqhETiOOj6YX9LS+X6hga3Q1Gk0rIyB/ylLcZiqaV4PPN5evr7i5GROYhEhpDUFSQS/qVgngJUXIFkcgsWP9dx4IC/pa2t2m63S8bPrqBoEwQzKT5pvHj27Mvj4eGXuHYKSUwWKkBxKmQyjVj8Uld397amnTurdF2HbDYL/8GE5ra2NStcLnloYKAfotFjSOJLPgHZ3F9NO7m3q2uzv7W1KpPJwH81bGaTz1eRTCS2PLx79yKunKBlkaEU9313jdfb3NrevjaLxal7Hvb1BE0U6yNkUE2cqaqtTU17UIUOi4AdUYkE9qCznDon2XkJ9veO5zX0u98yiuOSwLyU37d9+0qcqSMWAdUkoOt1NXV1nmw6bQYW4uDpt7kCDy5s4MbQumUUz4shdau9XjeGNFsEFEQZMnKqTqecpcErwKGz73OJh/vqgRdjgfyW0XOFftoGUZJErFWC2+CysQFUkIAoCoJAAcYfjpxe5KngxRtIRLbbRS2RUMTcMRTFBF4caYPtVT7unfXmHj56foorrQXyW0bPFfpZfiMWiWjgdoeIAFFMIoHw/Oxs3MDLgyft7TNrc4m7L8xwY2jdMornxZC2USouCNMkhmgWx5sTZHn6XTC4INtswFOBcKu36hdpC2EZxfH8lNeG+SffvAkhgadEgGZgCTEHDsfE2Oior76hwbOmtnYVXhjcWRjsqcwdw2J8OF5gk2UIzc1FR548mQRFGbJOASnwDfEVVDVwb2DgYyQcjuKQmHItd6kUA2qEiqeSyaWbV6++B0m6jA2HiIDU2dlJdTLmIEqSDanqrwMBtaa21rGyosJpsARFg3UtoeSKqkIkFIpc6+9/h1t9HUpK7rDGc++CBGLGvBUd+MYVxfjQ4GB8q9+/rtHnK3N7PKq7tFQ1ONIu+/YRRdDi8eRiNKqNjo8vjAYCnzD3DVT5Ptt2I5+Abg4iwAdEClnGaCiDExMbg2Nj61FHD8L9D6/jRWwmhJM3Bi7XI/xN+SPs5P32QUKLMUZiAbEaGU8h3Oy2lIq5f5iq1FTInK+fX0dLzLfsF5HOgpLsASfCweKEIghYc5VCaAzcK/SHAAMA4XIlf6DGCVoAAAAASUVORK5CYII=',
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
                            color: {
                                a: 153,
                                r: 123,
                                g: 0,
                                b: 11,
                            },
                            style: 5,
                            width: 2,
                        },
                    },
                },
                label: {
                    visible: true,
                    position: 'middle',
                    style: {
                        type: 'TextSymbol',
                        options: {
                            text: '距离',
                            fontFamilyName: '黑体',
                            fontSize: 16,
                            foreground: {
                                a: 255,
                                r: 0,
                                g: 0,
                                b: 0,
                            },
                            borderColor: {
                                a: 255,
                                r: 255,
                                g: 0,
                                b: 0,
                            },
                            borderThickness: 0,
                            rotation: 0,
                            offsetX: -40,
                            offsetY: -20,
                        },
                    },
                },
                fill: {
                    visible: true,
                    style: {
                        type: 'SimpleFillSymbol',
                        options: {
                            borderColor: {
                                a: 153,
                                r: 0,
                                g: 0,
                                b: 255,
                            },
                            fillColor: {
                                a: 150,
                                r: 19,
                                g: 181,
                                b: 177,
                            },
                            borderThickness: 0,
                            opacity: 1,
                        },
                    },
                },
            },
        };
        this.clearBuffer();
        this.bufferDraw.buffer(param);
    },
    // 清除缓冲区
    clearBuffer() {
        this.bufferDraw.clearBuffer();
    },
});
export default bufferUtils;
