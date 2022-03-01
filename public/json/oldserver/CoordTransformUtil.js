(function (window) {
    var G = window['G'] || {};
    window['G'] = G;
    G.import = G.import || {};
    //
    var util = {};
    util.x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    util.PI = 3.1415926535897932384626;
    util.a = 6378245.0;
    util.ee = 0.00669342162296594323;

    /**
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
     * 即 百度 转 谷歌、高德
     * @param bd_lon
     * @param bd_lat
     */
    util.bd09togcj02 = function (bd_lonlat) {
        var bd_lon = +bd_lonlat.split(",")[0];
        var bd_lat = +bd_lonlat.split(",")[1];
        var x = bd_lon - 0.0065;
        var y = bd_lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * util.x_PI);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * util.x_PI);
        var gg_lng = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);
        var gcj02_lonlat = gg_lng + ',' + gg_lat;
        return gcj02_lonlat;
    };

    /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * 即谷歌、高德 转 百度
     * @param lng
     * @param lat
     */
    util.gcj02tobd09 = function (gcj_lnglat) {
        var lat = +gcj_lnglat.split(",")[0];
        var lng = +gcj_lnglat.split(",")[1];
        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * util.x_PI);
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * util.x_PI);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return bd_lng + ',' + bd_lat;
    };

    /**
     * WGS84转GCj02
     * @param lng
     * @param lat
     */
    util.wgs84togcj02 = function (wgs_lnglat) {
        var lat = +wgs_lnglat.split(",")[0];
        var lng = +wgs_lnglat.split(",")[1];
        if (util.out_of_china(lng, lat)) {
            //return [lng, lat];
            console.log("超出国界范围!");
            return lng + ',' + lat;
        } else {
            var dlat = util.transformlat(lng - 105.0, lat - 35.0);
            var dlng = util.transformlng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * util.PI;
            var magic = Math.sin(radlat);
            magic = 1 - util.ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((util.a * (1 - util.ee)) / (magic * sqrtmagic) * util.PI);
            dlng = (dlng * 180.0) / (util.a / sqrtmagic * Math.cos(radlat) * util.PI);
            var mglat = lat + dlat;
            var mglng = lng + dlng;
            return mglng + ',' + mglat;
        }
    };

    /**
     * GCJ02 转换为 WGS84
     * @param lng
     * @param lat
     */
    util.gcj02towgs84 = function (gcj_lonlat) {
        var lng = +gcj_lonlat.split(",")[0];
        var lat = +gcj_lonlat.split(",")[1];
        if (util.out_of_china(lng, lat)) {
            //return [lng, lat];
            console.log("超出国界范围!");
            return lng + ',' + lat;
        } else {
            var dlat = util.transformlat(lng - 105.0, lat - 35.0);
            var dlng = util.transformlng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * util.PI;
            var magic = Math.sin(radlat);
            magic = 1 - util.ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((util.a * (1 - util.ee)) / (magic * sqrtmagic) * util.PI);
            dlng = (dlng * 180.0) / (util.a / sqrtmagic * Math.cos(radlat) * util.PI);
            var mglat = lat + dlat;
            var mglng = lng + dlng;
            var wgslng = lng * 2 - mglng;
            var wgslat = lat * 2 - mglat;
            return wgslng + ',' + wgslat;
        }
    };

    util.transformlat = function (lng, lat) {
        var lat = +lat;
        var lng = +lng;
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * util.PI) + 20.0 * Math.sin(2.0 * lng * util.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * util.PI) + 40.0 * Math.sin(lat / 3.0 * util.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * util.PI) + 320 * Math.sin(lat * util.PI / 30.0)) * 2.0 / 3.0;
        return ret
    };

    util.transformlng = function (lng, lat) {
        var lat = +lat;
        var lng = +lng;
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * util.PI) + 20.0 * Math.sin(2.0 * lng * util.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * util.PI) + 40.0 * Math.sin(lng / 3.0 * util.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * util.PI) + 300.0 * Math.sin(lng / 30.0 * util.PI)) * 2.0 / 3.0;
        return ret
    };

    /**
     * 判断是否在国内，不在国内则不做偏移
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    util.out_of_china = function (lng, lat) {
        var lat = +lat;
        var lng = +lng;
        // 纬度3.86~53.55,经度73.66~135.05
        return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
    };

    window.EMapServerV2 = window.EMapServerV2 || {};
    // 参考
    window.EMapServerV2.CoordTransformUtil = util;
})(window);  