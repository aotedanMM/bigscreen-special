(function(window) {
    window.EMapServerV2 = window.EMapServerV2 || {};
    // 参考
    window.EMapServerV2.DistrictUtil = {};

    window.EMapServerV2.DistrictUtil.getDistrict = function(districtCodes, callback, context) {
        var requestHandler = function(data, status, xhr) {
            if (data == null) {
                console.error('请求后台出错！' + status);
            } else {
                if (data && data.success) {
                    if (G.utils.CommonUtil.isFunction(callback)) {
                        context = context || window;
                        callback.call(context, data.data.result);
                    }
                } else {
                    //alert(data.msg);
                    console.info('DistrictUtil.getDistrict data.msg=' + data.msg);
                }
            }
        }
        var districtCodeArr = districtCodes.split(','),
            districtCode = districtCodeArr[0];
        var query = {},
            or = [];
        for (var k = 0, len = districtCodeArr.length; k < len; k++) {
            or.push({
                "tag.adcode": districtCodeArr[k]
            });
        }
        query['$or'] = or;
        //
        var table = '';
        query = JSON.stringify(query);
        if (districtCode == '000000') {
            table = window.EMapServerV2.DistrictUtil._getDicTableName('country');
            query = '';
        } else if (districtCode.endsWith('0000')) {
            table = window.EMapServerV2.DistrictUtil._getDicTableName('province');
        } else if (districtCode.endsWith('00')) {
            table = window.EMapServerV2.DistrictUtil._getDicTableName('city');
        } else {
            table = window.EMapServerV2.DistrictUtil._getDicTableName('county');
        }
        var ajax = G.utils.CommonUtil.ajaxGetData({
            url: this._getQueryUrl(),
            data: {
                query: query,
                dataSetId: table,
                limit: 100,
                eId: 'siptea'
            }
        }, requestHandler);
        return ajax;
    }

    /***
     * 获取政区表配置
     * @param key
     * @param evacuationIndex
     * @param fullName true要表名；false要查询名；
     * @returns {*}
     * @private
     */
    window.EMapServerV2.DistrictUtil._getDicTableName = function(key, evacuationIndex, fullName) {
        var districtTables = G.static.districtTables,
            tableCfg = districtTables[key],
            tableName;
        if (tableCfg) {
            tableName = fullName ? tableCfg.fullName : tableCfg.shortName;
            if (tableCfg.evacuationParams && tableCfg.evacuationParams.length > 0) {
                evacuationIndex = isNaN(evacuationIndex) ? 0 : evacuationIndex;
                tableName += tableCfg.evacuationParams[evacuationIndex];
            }
        }
        return tableName;
    }

    /***
     * 获取政区统计
     * @param options
     * options.tableName 表名
     * options.districtKey 政区字段名
     * options.classifyKey 分类统计的字段名
     * options.statisticsLevel : 政区统计的级别 'province':省;'city':市;'county':县
     * options.query 过滤条件如
     * options.aggregate 管道
     * "query":{"tag.EXPERTTYPECODE":"1"}
     * options.extra 需要在回调传回的参数
     * @param callback
     * @param context
     */
    window.EMapServerV2.DistrictUtil.getStatistics = function(options, callback, context) {;
        var url = this._getStaticsQueryUrl(),
            aggregate;
        if (options.aggregate) {
            aggregate = jQuery.extend(true, [], options.aggregate);
        } else {
            aggregate = [];
        }
        //添加管道；
        getDistrictPipline(aggregate, options);
        aggregate = JSON.stringify(aggregate);
        aggregate = replaceStrs(aggregate, [/\$\{districtKey\}/g], [options.districtKey]);
        aggregate = replaceStrs(aggregate, [/\$\{classifyKey\}/g], [options.classifyKey]);
        var query = {
            "tag.${districtKey}": {
                "$regex": ".*"
            }
        };
        //接收过滤条件
        if (typeof options.query == 'string') {
            try {
                options.query = JSON.parse(options.query);
            } catch (e) {
                options.query = {};
            }
        }
        jQuery.extend(query, options.query || {});
        query = replaceStrs(JSON.stringify(query), [/\$\{districtKey\}/g], [options.districtKey]);
        //
        var data = {
            eId: G.utils.CommonUtil.eId,
            dataSetId: options.tableName,
            query: query,
            aggregate: aggregate
        };
        G.utils.CommonUtil.showLoading(true);
        return G.utils.CommonUtil.ajaxGet({
            url: url,
            data: data,
            dataType: 'jsonp'
        }, function(d, s, f, opts) {
            var results = window.EMapServerV2.DistrictUtil.refineStatisticsData(d.data, opts.classifyKey);
            if ((Object.prototype.toString.call(callback) === '[object Function]')) {
                callback.call(context || this, results, opts.extra);
            }
            G.utils.CommonUtil.showLoading(false);
        }, null, options);
        /**
         *  获取查询管道
         */
        function getDistrictPipline(agg, opts) {
            var statisticsLevel = opts.statisticsLevel || 'province';
            var strOper,
                tableCfgs = G.static.districtTables,
                tableCfg, dicTable;
            tableCfg = tableCfgs[statisticsLevel];
            dicTable = window.EMapServerV2.DistrictUtil._getDicTableName(statisticsLevel, 0, true);
            switch (statisticsLevel) {
                case 'province':
                    {
                        strOper = {
                            "$concat": [{
                                    "$substr": [
                                        "$tag.${districtKey}", 0, 2
                                    ]
                                },
                                "0000"
                            ]
                        };
                        break;
                    }
                case 'city':
                    {
                        strOper = {
                            "$concat": [{
                                    "$substr": [
                                        "$tag.${districtKey}", 0, 4
                                    ]
                                },
                                "00"
                            ]
                        };
                        break;
                    }
                case 'county':
                    {
                        break;
                    }
            }
            if (options.classifyKey) { //是否有分类统计
                if (strOper) {
                    agg.push({
                        "$project": {
                            "tag.${districtKey}": strOper,
                            "tag.${classifyKey}": "$tag.${classifyKey}"
                        }
                    });
                }
                agg.push({
                    "$group": {
                        "_id": {
                            "district": "$tag.${districtKey}",
                            "${classifyKey}": "$tag.${classifyKey}"
                        },
                        "count": {
                            "$sum": 1
                        }
                    }
                });
            } else {
                if (strOper) {
                    agg.push({
                        "$project": {
                            "tag.${districtKey}": strOper
                        }
                    });
                }
                agg.push({
                    "$group": {
                        "_id": {
                            "district": "$tag.${districtKey}"
                        },
                        "count": {
                            "$sum": 1
                        }
                    }
                });
            }
            //配置字典项
            var lookup = {
                "$lookup": {
                    "from": dicTable,
                    "localField": "_id.district",
                    "foreignField": "tag.adcode",
                    "as": "_id.district"
                }
            }
            agg.push(lookup);
        }

        /**
         *
         * @param src
         * @param regexs arr
         * @param replaces arr
         */
        function replaceStrs(src, regexs, replaces) {
            var i = 0,
                len = regexs.length;
            for (; i < len; i++) {
                var regex = regexs[i],
                    replace = replaces[i] || '';
                while (regex.test(src)) {
                    src = src.replace(regex, replace);
                }
            }
            return src;
        }
    }

    /**
     * 组装统计数据
     * @param dataArr
     * @param classifyKey 非空 =按行政区划&分类统计的字段名；空值表示只按行政区划统计;
     *已知验证模块：可视化模块（危化品,大喇叭）
     */
    window.EMapServerV2.DistrictUtil.refineStatisticsData = function(dataArr, classifyKey) {
        var i = 0,
            len = dataArr.length,
            results = {};
        //两对象取一个有意义的值
        function getTwoObjHas(oneObj, twoObj) {
            return oneObj || twoObj;
        }
        //处理分类为空的方法
        function doClassifyKeyUndefined() {
            for (; i < len; i++) {
                var d = dataArr[i];
                if (d) {
                    var obj = {},
                        dicts = getTwoObjHas(d._id.district, []),
                        dict = getTwoObjHas(dicts[0], {});
                    obj.value = d.count;
                    jQuery.extend(obj, getTwoObjHas(dict.tag, {}));
                    var gov = getTwoObjHas(obj.gov, ''),
                        lnglats = gov.trim().split(',');
                    if (gov) {
                        obj.longitude = lnglats[0];
                        obj.latitude = lnglats[1];
                        delete obj.gov;
                    }
                    results[obj.adcode] = obj;
                }
            }
            return results
        };
        //处理分类不为空的方法
        function doClassifyKeyHas() {
            var itemKeys = {},
                resultObj = {},
                keys = '';
            for (; i < len; i++) {
                var d = dataArr[i];
                if (d) {
                    var dicts = getTwoObjHas(d._id.district, []),
                        dict = getTwoObjHas(dicts[0], {});
                    if (!(dict && dict.tag)) {
                        continue;
                    }
                    var obj = resultObj[dict.tag.adcode],
                        classifyVal = d._id[classifyKey];
                    //政区统计
                    if (!obj) {
                        obj = {
                            items: {}
                        };
                        jQuery.extend(obj, getTwoObjHas(dict.tag, {}));
                        var gov = getTwoObjHas(obj.gov, ''),
                            lnglats = gov.trim().split(',');
                        if (gov) {
                            obj.longitude = lnglats[0];
                            obj.latitude = lnglats[1];
                            delete obj.gov;
                        }
                        resultObj[obj.adcode] = obj;
                    }
                    obj.items[classifyVal] = d.count;
                    itemKeys[classifyVal] = true;
                }
            }
            for (var key0 in itemKeys) {
                if (key0 != null) {
                    keys += key0 + ',';
                }
            }
            if (keys && keys.endsWith(',')) {
                keys = keys.substr(0, keys.length - 1);
            }
            results[keys] = resultObj;
            return results;
        };

        if (classifyKey) {
            results = doClassifyKeyHas();
        } else {
            results = doClassifyKeyUndefined();
        }
        return results;
    }

    /**
     * 获取查询路径
     * @returns {*}
     * @private
     */
    window.EMapServerV2.DistrictUtil._getQueryUrl = function() {
            var service = G.utils.CommonUtil.getServiceConfig() || {};
            return service.dataServerIP + '/' + service.dataServerPageQuery;
        }
        /**
         * 获取多表查询路径
         * @returns {*}
         * @private
         */
    window.EMapServerV2.DistrictUtil._getMultiQueryUrl = function() {
            var service = G.utils.CommonUtil.getServiceConfig() || {};
            return service.dataServerIP + '/' + service.dataServerQuery;
        }
        /**
         * 获取统计查询路径
         * @returns {*}
         * @private
         */
    window.EMapServerV2.DistrictUtil._getStaticsQueryUrl = function() {
        var service = G.utils.CommonUtil.getServiceConfig() || {};
        return service.dataServerIP + '/' + service.dataServerStatistics;
    }
    window.EMapServerV2.DistrictUtil.search = function(options, callback) {
        options.eId = 'siptea';
        // var ajax = window.EMapServerV2.DistrictUtil.ajaxPostData({
        //     url: EMAP_CONFIG.common.mongoService + '/biz/district/search',
        //     data: options,
        //     showLoading: false,
        //     async: true
        // }, window.EMapServerV2.DistrictUtil.search._callback, null, callback);
        // return ajax;
    }
    window.EMapServerV2.DistrictUtil.search._callback = function(data, status, xhr, callback) {
        if (data == null) {
            console.error('请求后台出错！' + status);
        } else {
            if (data && data.success) {
                callback(data.data);
            } else {
                //alert(data.msg);
                console.info('DistrictUtil.search._callback data.msg= ' + data.msg);
            }
        }
    }
    window.EMapServerV2.DistrictUtil.ajaxPostData = function(options, callback, context, param) {
            var opts = jQuery.extend({}, options);

            // console.log(options.data.data)
            if (opts.url && !opts.url.startsWith('http')) {
                if (!opts.url.startsWith('/')) {
                    opts.url = '/' + opts.url;
                }
                opts.url = EMAP_CONFIG.common.mongoService;
            }
            opts.type = 'post';
            opts.dataType = 'json';
            opts.async = options.async === false ? false : true;
            //添加参数
            opts.data = opts.data || {};
            opts.data.eId = opts.data.eId || window.EMapServerV2.DistrictUtil.eId;
            //
            opts.success = function(data, status, xhr) {
                window.EMapServerV2.DistrictUtil.isFunction(callback) && callback.call(context || window, data, status, xhr, param);
                // if (options.showLoading) {
                //     window.EMapServerV2.DistrictUtil.showLoading(false);
                // }
            }
            opts.error = function(xhr, status, msg) {
                    console.error(options.url + " request failed!");
                    window.EMapServerV2.DistrictUtil.isFunction(callback) && callback.call(context || window, null, status, msg, param);
                    // if (options.showLoading) {
                    //     window.EMapServerV2.DistrictUtil.showLoading(false);
                    // }
                }
                // if (options.showLoading) {
                //     window.EMapServerV2.DistrictUtil.showLoading(true);
                // }
            return jQuery.ajax(opts);
        }
        /**
         * 是否是函数
         * @param obj {Object} 必填，需要判断的参数
         * @returns {boolean}
         */
    window.EMapServerV2.DistrictUtil.isFunction = function(obj) {
            return (Object.prototype.toString.call(obj) === '[object Function]');
        }
        /**
         * 聚合管道查询
         * @param obj.dataSetId 数据集ID(表名)
         * @param obj.query 查询条件对象
         * @param obj.fieldMap key:表字段名 value:别名
         * @param obj.pipeline 管道数组
         * @parma callback 回调函数
         * @example
         * G.utils.DistrictUtil.aggregate({
                eId:'siptea',
                dataSetId:'province0.01',
                fieldMap:{
                    adcode:'a',
                    name:'b'
                }
            },function(){
                console.info(arguments);
            });
         */
        /**
         *叠加行政区划面数据
         * @param districCodes 行政区划对象集合 包含level id
         * @param drawLayer 标绘的图岑
         * @param districEles 存储element的对象
         * @param districGeoJsons 存储geojson的对象
         * @param symbol 标绘的样式
         * @private
         */

    window.EMapServerV2.DistrictUtil._addDistricPolygonToLayer_ProcessData = function(data, param, drawLayer) {
        if (data == undefined) return;
        if (data.length < 1) return;
        for (var i = 0; i < data.length > 0; i++) {
            if (!param.districEles[data[i].adcode]) {
                var polygonGeometry = g2.sfs.GeometryFactory.createGeometryFromGeoJson(data[i].geom,
                    param.map.spatialReference);
                var ring = new g2.sfs.Ring({ spatialReference: param.map.spatialReference });
                polygonGeometry.addGeometry(ring);
                var polygonEle = new g2.sfs.Element({
                    geometry: polygonGeometry,
                    symbol: symbol,
                    id: data[i].adcode
                });
                drawLayer.add(polygonEle);
                param.districEles[data[i].adcode] = polygonEle;
            }
            param.districGeoJsons[data[i].adcode] = data[i].geom;
        }

    }
})(window);