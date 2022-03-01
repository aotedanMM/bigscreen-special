import WMSLayer from './WMSLayer';

/**
 * 降水图层
 */
export default class RainfallBefore24Layer extends WMSLayer {
    public load(params: any): void {
        const url = this.options.serviceConfig.weatherMms;
        this.layer = this.createLayer(url);
        this.map.addLayer(this.layer);
        this.layer.setVisible(true);
        this.layer.setZIndex(9);
    }
    public createLayer(url: string) {
        const time = new Date();
        time.setMinutes(time.getMinutes() - 30);
        const dimbatch = this.dateFtt('yyyyMMdd', time) + '01';
        const tomorrowtime = new Date(time.setDate(time.getDate()));
        const Timestr0 = this.dateFtt('yyyy-MM-dd', tomorrowtime) + 'T01:00:00Z';
        const params =             {
            LAYERS: 'before_china',
            time: Timestr0,
            dimbatch,
            dim_type: 'before24',
            styles: 'rain24',
        };
        url = url + '?time=' + params.time + '&dim_batch=' + params.dimbatch + '&dim_type=' + params.dim_type + '&styles=' + params.styles;
        // 创建WMS服务
        const wmsLayer = new (window as any).egis.carto.TileLayer({
            id: 'rainfall',
            url,
            layers: params.LAYERS,
            projection: 'EPSG:' + this.map.spatialReference,
            format: 'image/png',
            opacity: 0.5,
            tileType: (window as any).egis.carto.TileType.WMS,
        });
        return wmsLayer;
    }

    private dateFtt(fmt: string, date: Date) {
        const o: any = {
            'M+': date.getMonth() + 1,                 // 月份
            'd+': date.getDate(),                    // 日
            'h+': date.getHours(),                   // 小时
            'm+': date.getMinutes(),                 // 分
            's+': date.getSeconds(),                 // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
            'S': date.getMilliseconds(),            // 毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (const k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            }
        }
        return fmt;
    }
}
