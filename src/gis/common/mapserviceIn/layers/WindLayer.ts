import BaseLayer from './BaseLayer';
import { weatherServer, newWeatherServer, districtServer } from '@/api/installServer';
/**
 * 风图层
 */
export default class WindLayer extends BaseLayer {
    public addgetWeatherDataInterval: any | undefined;
    public point: any;
    public load(params: any): void {
        this.removeLayerIfExist();
        this.getWeatherData(params, true);
        // 暂时注释掉定时器，后面放开定时器的时候需要验证定时更新的时候，不更新地图视野
        // this.addgetWeatherDataInterval = setInterval(() => {
        //     // params.Interval = true;
        //     if ((window as any).windLayer) {
        //         (window as any).map.removeLayer((window as any).windLayer);
        //     }
        //     // console.debug('>>>>>>>>>风向定时器' + flag);
        //     // flag++;
        //     this.getWeatherData(params, false);
        // }, 60000);
    }
    /**
     * 清除定时器
     */
    public clearWeatherDataInterval() {
        // console.debug('>>>>>>>>>清除风向定时器');
        if (this.addgetWeatherDataInterval) {
            clearTimeout(this.addgetWeatherDataInterval);
        }
        this.addgetWeatherDataInterval = undefined;
    }
    /**
     * 获取风向数据
     * @param params 事件信息
     * @param autoPan 是否自动调整视野
     */
    public getWeatherData(params: any, autoPan: boolean = false) {
        const longitude = params.point[0];
        const latitude = params.point[1];
        // weatherServer.getWeatherDataFn(latitude, longitude).then((res: any) => {
            // const deriction = res.data[0].winDAvg2mi;
            // const windpower = res.data[0].windpower;
        const param = {
            location: [longitude, latitude],
            level: '3',
        };
        districtServer.getDistrictByLonLat(param).then((res: any) => {
            const code = res.data[0].code;
            newWeatherServer
                .getJXYBDatas('3D', code)
                .then((data: any) => {
                    if (data && JSON.stringify(data.message) !== '{}') {
                        for (const iterator of JSON.parse(data.message)) {
                            if (iterator.RQTJ === 'today') {
                                params.deriction = iterator.FX;
                                params.windpower = iterator.FL;
                                if (this.isLoaded()) {
                                    this.addwindSpeedDirection(params, autoPan);
                                }
                            }
                        }
                    }
                });

        });
    }
    public meter2degree(meters: any) {
        const cliometter = 0.0089932202929999989;
        const dis = meters / 1000 * cliometter;
        return dis;
    }

    public unload(): void {
        this.removeLayerIfExist();
        this.clearWeatherDataInterval();
    }

    public setVisible(visible: boolean): void {
        if (this.layer) {
            this.layer.setVisible(visible);
        }
    }

    // 移除图层
    private removeLayerIfExist() {
        if (this.layer) {
            this.map.removeLayer(this.layer);
        }
        this.layer = null;
    }

    private addwindSpeedDirection(params: any, autoPan: boolean = false) {
        const r = params.affactRadius[params.affactRadius.length - 1];
        const base64 = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNy4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjU1cHgiIGhlaWdodD0iNTVweCIgdmlld0JveD0iMCAwIDU1IDU1IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1NSA1NSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8dGl0bGU+NjwvdGl0bGU+DQoJPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQoJPGcgaWQ9Iumhtemdoi0xXzFfIj4NCgkJPGcgaWQ9IuahjOmdouerr18xXyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwNDYuMDAwMDAwLCAtNzEuMDAwMDAwKSI+DQoJCQk8ZyBpZD0iX3gzNl9fMV8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwNTkuMDAwMDAwLCA3Mi4wMDAwMDApIj4NCgkJCQk8ZyBpZD0i57yW57uEXzFfIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgMjAuMDAwMDAwKSI+DQoJCQkJCQ0KCQkJCQkJPGxpbmVhckdyYWRpZW50IGlkPSLnn6nlvaJfMV8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iLTc0LjU3OTIiIHkxPSIzNjIuOTMxNyIgeDI9Ii03NC41NzkyIiB5Mj0iMzYzLjg2MjUiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTMwLjEgODEuMSAxMDk1My4zMjAzKSI+DQoJCQkJCQk8c3RvcCAgb2Zmc2V0PSIwLjI1NjIiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkZGRkY7c3RvcC1vcGFjaXR5OjAiLz4NCgkJCQkJCTxzdG9wICBvZmZzZXQ9IjAuNCIgc3R5bGU9InN0b3AtY29sb3I6I0ZGRkZGRjtzdG9wLW9wYWNpdHk6MC4yNDU3Ii8+DQoJCQkJCQk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZGRkZGIi8+DQoJCQkJCTwvbGluZWFyR3JhZGllbnQ+DQoJCQkJCTxyZWN0IGlkPSLnn6nlvaJfOV8iIHg9IjUuNTE4IiB5PSIxLjA3NyIgZmlsbD0idXJsKCPnn6nlvaJfMV8pIiB3aWR0aD0iMi4wMDUiIGhlaWdodD0iMjguMDU5Ii8+DQoJCQkJCQ0KCQkJCQkJPGxpbmVhckdyYWRpZW50IGlkPSLnn6nlvaJfMl8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iLTc0LjIyNTQiIHkxPSIzNjIuOTM0MiIgeDI9Ii03NC4yMjU0IiB5Mj0iMzYzLjg2NSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMzAuMSA3Ni4yIDEwOTU1LjMyMDMpIj4NCgkJCQkJCTxzdG9wICBvZmZzZXQ9IjAuMjU2MiIgc3R5bGU9InN0b3AtY29sb3I6I0ZGRkZGRjtzdG9wLW9wYWNpdHk6MCIvPg0KCQkJCQkJPHN0b3AgIG9mZnNldD0iMC40IiBzdHlsZT0ic3RvcC1jb2xvcjojRkZGRkZGO3N0b3Atb3BhY2l0eTowLjI0NTciLz4NCgkJCQkJCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkZGRkYiLz4NCgkJCQkJPC9saW5lYXJHcmFkaWVudD4NCgkJCQkJPHJlY3QgaWQ9IuefqeW9ol84XyIgeD0iMC45NDkiIHk9IjIuOTQxIiBmaWxsPSJ1cmwoI+efqeW9ol8yXykiIHdpZHRoPSIyLjA1MSIgaGVpZ2h0PSIyOC4wNTkiLz4NCgkJCQkJDQoJCQkJCQk8bGluZWFyR3JhZGllbnQgaWQ9IuefqeW9ol8zXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSItNzQuODYwNSIgeTE9IjM1OS4yMjMxIiB4Mj0iLTc0Ljg2MDUiIHkyPSIzNjAuMTU1MiIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMjcuNSA4NS45IDk5MDMuNzE5NykiPg0KCQkJCQkJPHN0b3AgIG9mZnNldD0iMC4yNTYyIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZGRkZGO3N0b3Atb3BhY2l0eTowIi8+DQoJCQkJCQk8c3RvcCAgb2Zmc2V0PSIwLjQiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkZGRkY7c3RvcC1vcGFjaXR5OjAuMjQ1NyIvPg0KCQkJCQkJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGRkZGRiIvPg0KCQkJCQk8L2xpbmVhckdyYWRpZW50Pg0KCQkJCQk8cmVjdCBpZD0i55+p5b2iXzdfIiB4PSI5Ljk5NiIgeT0iLTAuNjAxIiBmaWxsPSJ1cmwoI+efqeW9ol8zXykiIHdpZHRoPSIyLjA4NyIgaGVpZ2h0PSIyNS42MzUiLz4NCgkJCQkJDQoJCQkJCQk8bGluZWFyR3JhZGllbnQgaWQ9IuefqeW9ol80XyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSItNzUuMTk1MiIgeTE9IjM2Mi45MzE3IiB4Mj0iLTc1LjE5NTIiIHkyPSIzNjMuODYyNSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMzAuMSA5MC44IDEwOTUzLjMyMDMpIj4NCgkJCQkJCTxzdG9wICBvZmZzZXQ9IjAuMjU2MiIgc3R5bGU9InN0b3AtY29sb3I6I0ZGRkZGRjtzdG9wLW9wYWNpdHk6MCIvPg0KCQkJCQkJPHN0b3AgIG9mZnNldD0iMC40IiBzdHlsZT0ic3RvcC1jb2xvcjojRkZGRkZGO3N0b3Atb3BhY2l0eTowLjI0NTciLz4NCgkJCQkJCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkZGRkYiLz4NCgkJCQkJPC9saW5lYXJHcmFkaWVudD4NCgkJCQkJPHJlY3QgaWQ9IuefqeW9ol82XyIgeD0iMTQuNTY0IiB5PSIxLjA3NyIgZmlsbD0idXJsKCPnn6nlvaJfNF8pIiB3aWR0aD0iMi4wODIiIGhlaWdodD0iMjguMDU5Ii8+DQoJCQkJCQ0KCQkJCQkJPGxpbmVhckdyYWRpZW50IGlkPSLnn6nlvaJfMTBfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii03NS41MDgyIiB5MT0iMzYyLjkzNDIiIHgyPSItNzUuNTA4MiIgeTI9IjM2My44NjUiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTMwLjEgOTUuNiAxMDk1NS4zMjAzKSI+DQoJCQkJCQk8c3RvcCAgb2Zmc2V0PSIwLjI1NjIiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkZGRkY7c3RvcC1vcGFjaXR5OjAiLz4NCgkJCQkJCTxzdG9wICBvZmZzZXQ9IjAuNCIgc3R5bGU9InN0b3AtY29sb3I6I0ZGRkZGRjtzdG9wLW9wYWNpdHk6MC4yNDU3Ii8+DQoJCQkJCQk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZGRkZGIi8+DQoJCQkJCTwvbGluZWFyR3JhZGllbnQ+DQoJCQkJCTxyZWN0IGlkPSLnn6nlvaJfNV8iIHg9IjE5LjAzOSIgeT0iMi45NDEiIGZpbGw9InVybCgj55+p5b2iXzEwXykiIHdpZHRoPSIyLjEwNiIgaGVpZ2h0PSIyOC4wNTkiLz4NCgkJCQk8L2c+DQoJCQkJPHBvbHlnb24gaWQ9Iui3r+W+hF8xXyIgZmlsbD0iI0ZGRkZGRiIgcG9pbnRzPSIxNC40NTMsMi4yODkgMS40MDMsMjYuNzEyIDE0LjI2NywyMS4xMTkgMjcuNTk3LDI2LjcxMiAJCQkJIi8+DQoJCQkJPHBvbHlnb24gaWQ9Iui3r+W+hF8yXyIgZmlsbD0iI0ZGRkZGRiIgcG9pbnRzPSIxNC40NTMsMi4yODkgMS40MDMsMjYuNzEyIDE0LjI2NywyMS4xMTkgMjcuNTk3LDI2LjcxMiAJCQkJIi8+DQoJCQk8L2c+DQoJCTwvZz4NCgk8L2c+DQoJPGcgaWQ9Iumhtemdoi0xIj4NCgkJPGc+DQoJCQk8ZyBpZD0i5qGM6Z2i56uvXzhfIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA0Ni4wMDAwMDAsIC03MS4wMDAwMDApIj4NCgkJCQk8ZyBpZD0iX3gzNl9fOF8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwNTkuMDAwMDAwLCA3Mi4wMDAwMDApIj4NCgkJCQkJPGcgaWQ9Iue8lue7hF84XyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNC4wMDAwMDAsIDIwLjAwMDAwMCkiPg0KCQkJCQkJDQoJCQkJCQkJPGxpbmVhckdyYWRpZW50IGlkPSLnn6nlvaJfMTFfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii03NC44NzU1IiB5MT0iMzYyLjkyOTUiIHgyPSItNzQuODc1NSIgeTI9IjM2My44NjAzIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0zMC4xIDgxLjEgMTA5NTMuMzIwMykiPg0KCQkJCQkJCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDBGRkY7c3RvcC1vcGFjaXR5OjAuMSIvPg0KCQkJCQkJCTxzdG9wICBvZmZzZXQ9IjAuMjA2OSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMEZGRjtzdG9wLW9wYWNpdHk6MC4yODYyIi8+DQoJCQkJCQkJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMEZGRiIvPg0KCQkJCQkJPC9saW5lYXJHcmFkaWVudD4NCgkJCQkJCTxyZWN0IGlkPSLnn6nlvaJfNDRfIiB4PSI1LjM1NCIgeT0iMS4xNDQiIGZpbGw9InVybCgj55+p5b2iXzExXykiIHdpZHRoPSIxLjc0MiIgaGVpZ2h0PSIyOC4wNTkiLz4NCgkJCQkJCQ0KCQkJCQkJCTxsaW5lYXJHcmFkaWVudCBpZD0i55+p5b2iXzEyXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSItNzQuNTI4IiB5MT0iMzYyLjkzMiIgeDI9Ii03NC41MjgiIHkyPSIzNjMuODYyOCIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMzAuMSA3Ni4yIDEwOTU1LjMyMDMpIj4NCgkJCQkJCQk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwRkZGO3N0b3Atb3BhY2l0eTowLjEiLz4NCgkJCQkJCQk8c3RvcCAgb2Zmc2V0PSIwLjIwNjkiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDBGRkY7c3RvcC1vcGFjaXR5OjAuMjg2MiIvPg0KCQkJCQkJCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDBGRkYiLz4NCgkJCQkJCTwvbGluZWFyR3JhZGllbnQ+DQoJCQkJCQk8cmVjdCBpZD0i55+p5b2iXzQzXyIgeD0iMC43ODEiIHk9IjMuMDA5IiBmaWxsPSJ1cmwoI+efqeW9ol8xMl8pIiB3aWR0aD0iMS43ODEiIGhlaWdodD0iMjguMDU5Ii8+DQoJCQkJCQkNCgkJCQkJCQk8bGluZWFyR3JhZGllbnQgaWQ9IuefqeW9ol8xM18iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iLTc1LjE4ODUiIHkxPSIzNTkuMjIwNiIgeDI9Ii03NS4xODg1IiB5Mj0iMzYwLjE1MjgiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTI3LjUgODUuOSA5OTAzLjcxOTcpIj4NCgkJCQkJCQk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwRkZGO3N0b3Atb3BhY2l0eTowLjEiLz4NCgkJCQkJCQk8c3RvcCAgb2Zmc2V0PSIwLjIwNjkiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDBGRkY7c3RvcC1vcGFjaXR5OjAuMjg2MiIvPg0KCQkJCQkJCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDBGRkYiLz4NCgkJCQkJCTwvbGluZWFyR3JhZGllbnQ+DQoJCQkJCQk8cmVjdCBpZD0i55+p5b2iXzQyXyIgeD0iOS44MjgiIHk9Ii0wLjUzNCIgZmlsbD0idXJsKCPnn6nlvaJfMTNfKSIgd2lkdGg9IjEuNzY2IiBoZWlnaHQ9IjI1LjYzNSIvPg0KCQkJCQkJDQoJCQkJCQkJPGxpbmVhckdyYWRpZW50IGlkPSLnn6nlvaJfMTRfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii03NS41MjMyIiB5MT0iMzYyLjkyOTUiIHgyPSItNzUuNTIzMiIgeTI9IjM2My44NjAzIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0zMC4xIDkwLjggMTA5NTMuMzIwMykiPg0KCQkJCQkJCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDBGRkY7c3RvcC1vcGFjaXR5OjAuMSIvPg0KCQkJCQkJCTxzdG9wICBvZmZzZXQ9IjAuMjA2OSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMEZGRjtzdG9wLW9wYWNpdHk6MC4yODYyIi8+DQoJCQkJCQkJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMEZGRiIvPg0KCQkJCQkJPC9saW5lYXJHcmFkaWVudD4NCgkJCQkJCTxyZWN0IGlkPSLnn6nlvaJfNDFfIiB4PSIxNC4zOTYiIHk9IjEuMTQ0IiBmaWxsPSJ1cmwoI+efqeW9ol8xNF8pIiB3aWR0aD0iMS43NjEiIGhlaWdodD0iMjguMDU5Ii8+DQoJCQkJCQkNCgkJCQkJCQk8bGluZWFyR3JhZGllbnQgaWQ9IuefqeW9ol8xNV8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iLTc1Ljg1MTciIHkxPSIzNjIuOTMyIiB4Mj0iLTc1Ljg1MTciIHkyPSIzNjMuODYyOCIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMzAuMSA5NS42IDEwOTU1LjMyMDMpIj4NCgkJCQkJCQk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwRkZGO3N0b3Atb3BhY2l0eTowLjEiLz4NCgkJCQkJCQk8c3RvcCAgb2Zmc2V0PSIwLjIwNjkiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDBGRkY7c3RvcC1vcGFjaXR5OjAuMjg2MiIvPg0KCQkJCQkJCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDBGRkYiLz4NCgkJCQkJCTwvbGluZWFyR3JhZGllbnQ+DQoJCQkJCQk8cmVjdCBpZD0i55+p5b2iXzQwXyIgeD0iMTguODciIHk9IjMuMDA5IiBmaWxsPSJ1cmwoI+efqeW9ol8xNV8pIiB3aWR0aD0iMS43NTYiIGhlaWdodD0iMjguMDU5Ii8+DQoJCQkJCTwvZz4NCgkJCQkJPHBvbHlnb24gaWQ9Iui3r+W+hF84XyIgZmlsbD0iIzAwMEZGRiIgcG9pbnRzPSIxNC40NTEsMS43MjkgMS40LDI2LjE1MyAxNC4yNjQsMjAuNTYgMjcuNTk1LDI2LjE1MyAJCQkJCSIvPg0KCQkJCTwvZz4NCgkJCTwvZz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K';
        // const base64=res.data.icons['markPoint'];
        // 0 南 80 100 x50 y-80,45西南80 100  120 -90，90 西100 -10 50 -80，135 西北 50 -70 50 -80，180 北-10 -60 50 -80 ，225 东北 -50 -5 50 -80，270 东 -50 60 50 -80，315 东南 0 110 50 -80
        // const derictiondata = params.deriction;
        const speeddata = params.windpower;
        // const directions = ['北风', '东北风', '东风', '东南风', '南风', '西南风', '西风', '西北风', '北风'];
        const direction = params.deriction;
        let rotations = 0;
        let xX = 0;
        let yY = 0;
        let radius = r * 1000 + 2500;
        let textAligna = 'center';
        let offsetYa = 55 / 2;
        let offsetXa = 55 / 2;
        let height45 = radius * Math.sin((Math.PI * 2 / 360) * 45);
        if (direction === '南风') { // 0 南 80 100 x50 y-80
            radius = r * 1000 + 1500;
            rotations = 0;
            offsetYa = -20;
            textAligna = 'end';
            xX = params.point[0];
            yY = params.point[1] - this.meter2degree(radius);

        } else if (direction === '西南风') { // 45西南80 100  120 -90
            rotations = 45;
            height45 = radius * Math.sin((Math.PI * 2 / 360) * 45);
            xX = params.point[0] - this.meter2degree(height45);
            yY = params.point[1] - this.meter2degree(height45);
        } else if (direction === '西风') { // 90 西100 -10 50 -80
            rotations = 90;
            offsetXa = -10;
            xX = params.point[0] - this.meter2degree(radius);
            yY = params.point[1];
        } else if (direction === '西北风') {// 135 西北 50 -70 50 -80
            rotations = 135;
            offsetYa = -20;
            textAligna = 'end';
            height45 = radius * Math.sin((Math.PI * 2 / 360) * 45);
            xX = params.point[0] - this.meter2degree(height45);
            yY = params.point[1] + this.meter2degree(height45);
        } else if (direction === '北风') {// 180 北-10 -60 50 -80
            rotations = 180;
            offsetYa = -20;
            radius = r * 1000 + 1500;
            textAligna = 'end';
            xX = params.point[0];
            yY = params.point[1] + this.meter2degree(radius);

        } else if (direction === '东北风') {// 225 东北 -50 -5 50 -80
            rotations = 225;
            // textAlign='end';
            offsetYa = 40;
            height45 = radius * Math.sin((Math.PI * 2 / 360) * 45);
            xX = params.point[0] + this.meter2degree(height45);
            yY = params.point[1] + this.meter2degree(height45);
        } else if (direction === '东风') {// 270 东 -50 60 50 -80
            rotations = 270;
            xX = params.point[0] + this.meter2degree(radius);
            yY = params.point[1];
        } else if (direction === '东南风') {// 315 东南 0 110 50 -80
            rotations = 315;
            height45 = radius * Math.sin((Math.PI * 2 / 360) * 45);
            xX = params.point[0] + this.meter2degree(height45);
            yY = params.point[1] - this.meter2degree(height45);
        }
        // if (derictiondata === -1 || derictiondata === 0) {
        //     direction = '北风';
        //     rotations = 90;
        //     textAligna = 'end';
        //     radius = r * 1000 + 1500;
        //     offsetYa = -20;
        //     xX = params.point[0];
        //     yY = params.point[1] + this.meter2degree(radius);

        // } else {
        //     const index = Math.ceil(derictiondata / 40);
        //     direction = directions[index - 1];
        //     // if (params.Interval) {
        //     //     direction = '东风';
        //     // } else {
        //     //     direction = direction;
        //     // }
        //     if (direction === '南风') { // 0 南 80 100 x50 y-80
        //         radius = r * 1000 + 1500;
        //         rotations = 0;
        //         offsetYa = -20;
        //         textAligna = 'end';
        //         xX = params.point[0];
        //         yY = params.point[1] - this.meter2degree(radius);

        //     } else if (direction === '西南风') { // 45西南80 100  120 -90
        //         rotations = 45;
        //         height45 = radius * Math.sin((Math.PI * 2 / 360) * 45);
        //         xX = params.point[0] - this.meter2degree(height45);
        //         yY = params.point[1] - this.meter2degree(height45);
        //     } else if (direction === '西风') { // 90 西100 -10 50 -80
        //         rotations = 90;
        //         offsetXa = -10;
        //         xX = params.point[0] - this.meter2degree(radius);
        //         yY = params.point[1];
        //     } else if (direction === '西北风') {// 135 西北 50 -70 50 -80
        //         rotations = 135;
        //         offsetYa = -20;
        //         textAligna = 'end';
        //         height45 = radius * Math.sin((Math.PI * 2 / 360) * 45);
        //         xX = params.point[0] - this.meter2degree(height45);
        //         yY = params.point[1] + this.meter2degree(height45);
        //     } else if (direction === '北风') {// 180 北-10 -60 50 -80
        //         rotations = 180;
        //         offsetYa = -20;
        //         radius = r * 1000 + 1500;
        //         textAligna = 'end';
        //         xX = params.point[0];
        //         yY = params.point[1] + this.meter2degree(radius);

        //     } else if (direction === '东北风') {// 225 东北 -50 -5 50 -80
        //         rotations = 225;
        //         // textAlign='end';
        //         offsetYa = 40;
        //         height45 = radius * Math.sin((Math.PI * 2 / 360) * 45);
        //         xX = params.point[0] + this.meter2degree(height45);
        //         yY = params.point[1] + this.meter2degree(height45);
        //     } else if (direction === '东风') {// 270 东 -50 60 50 -80
        //         rotations = 270;
        //         xX = params.point[0] + this.meter2degree(radius);
        //         yY = params.point[1];
        //     } else if (direction === '东南风') {// 315 东南 0 110 50 -80
        //         rotations = 315;
        //         height45 = radius * Math.sin((Math.PI * 2 / 360) * 45);
        //         xX = params.point[0] + this.meter2degree(height45);
        //         yY = params.point[1] - this.meter2degree(height45);
        //     }
        // }
        const symbols = new g2.sfs.PictureMarkerSymbol({
            source: base64,
            width: 55,
            height: 55,
            rotation: rotations,
            opacity: 1,
            offsetX: 55 / 2,
            offsetY: 55 / 2,
            scale: 2,
        });
        const texsymbol = new g2.sfs.TextSymbol({
            text: direction + speeddata,
            borderColor: new g2.sfs.Color({
                alpha: 255, r: 0, g: 0, b: 0,
            }),
            borderThickness: 2,
            fontSize: 28,
            fontWeight: 'Yes',
            fontFamilyName: '微软雅黑',
            foreground: new g2.sfs.Color({ alpha: 255, r: 255, g: 255, b: 255 }),
            offsetX: offsetXa,
            offsetY: offsetYa,
            textAlign: textAligna,
            textBaseline: 'top',
        });
        const currencySymbol = new g2.sfs.CurrencySymbol({
            markerSymbol: symbols,
            textSymbol: texsymbol,
        });

        const elementLayer = new g2.carto.ElementLayer({
            id: 'WindLayer',
            map: this.map,
        });
        let point: any;
        point = new g2.sfs.Point({
            x: xX,
            y: yY,
            spatialReference: this.map.spatialReference,
        });
        this.point = point;
        const ele = new g2.sfs.Element({ geometry: point, symbol: currencySymbol });
        elementLayer.add(ele);
        this.layer = elementLayer;
        this.map.addLayer(elementLayer);
        elementLayer.setZIndex(9999);
        if (autoPan) {
            // 适配视野，保证能看见箭头
            try {
                const maxRange: any = this.options.eventInfo.getMaxRangeGeometry();
                const fitOpts = {
                    type: 'geojson',
                    geom: maxRange,
                };
                this.options.featureLocate.clear();
                this.options.featureLocate.fit(fitOpts, {
                    // top, right, bottom and left
                    padding: [150 + 55, 500 + 55, 50 + 55, 500 + 55],
                    duration: {
                        move: 0,
                        zoom: 0,
                    },
                });
            } catch (e) {
                console.debug(e);
            }
        }
    }
}
