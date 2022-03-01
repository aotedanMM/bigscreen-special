(function (window) {
    var util = {
        /**
         * @param opts
         * @param opts.server
         * @param opts.data
         * @param cb
         * @param ctx
         */
        aggregateMulti: function (opts, cb, ctx) {
            jQuery.ajax({
                url: opts.server + '/dataStatics/aggregateMulti',
                type: 'post',
                data: {
                    eId: 'safety',
                    data: JSON.stringify(opts.data)
                },
                dataType: 'json',
                success: function (data) {
                    if (data.success) {
                        cb && cb.call(ctx, null, data.data);
                    } else {
                        cb && cb.call(ctx, new Error(data.msg))
                    }
                },
                error: function (xhr, msg, err) {
                    cb && cb.call(ctx, new Error(err))
                }
            })
        },
        /**
         * @param opts
         * @param opts.server
         * @param opts.eId
         * @param opts.data
         * @param cb
         * @param ctx
         */
        queryMulti: function (opts, cb, ctx) {
            jQuery.ajax({
                url: opts.server + '/dataOperate/queryMulti',
                type: 'post',
                data: {
                    eId: opts.eId||'safety',
                    data: JSON.stringify(opts.data)
                },
                dataType: 'json',
                success: function (data) {
                    if (data.success) {
                        cb && cb.call(ctx, null, data.data);
                    } else {
                        cb && cb.call(ctx, new Error(data.msg))
                    }
                },
                error: function (xhr, msg, err) {
                    cb && cb.call(ctx, new Error(err))
                }
            })
        },
        //是否为空
        isEmptyValue: function (value) {
            return value == null
                || value == undefined
                || value == ""
                || value == " ";
        },
        R:6378137,
        fullRange:{
            type: 'Polygon',
            coordinates: [
                [
                    [0, 0],
                    [180, 0],
                    [180, 90],
                    [0, 90],
                    [0, 0]
                ]
            ]
        },
        //计算经纬度距离
        caculateDistancePoints: function (pt1, pt2) {
            var R = util.R,
                rad = Math.PI / 180,
                lat1 = pt1[1] * rad,
                lat2 = pt2[1] * rad,
                a = Math.sin(lat1) * Math.sin(lat2) +
                    Math.cos(lat1) * Math.cos(lat2) * Math.cos((pt2[0] - pt1[0]) * rad);
            return R * Math.acos(Math.min(a, 1));
        },
        levelFn: function(opts) {
            var ratio = opts.data.distance / opts.maxDistance;
            var levelCode = null;
            for (var k in opts.levels) {
                if (ratio > opts.levels[k][0] && ratio <= opts.levels[k][1]) {
                    levelCode = k;
                    break;
                }
            }
            return {
                level:levelCode
            };
        },
    };
    /**
     *
     * @param opts
     * @param opts.server
     * @constructor
     */
    var Service = function (opts) {
        this.opts = {
            server: EMAP_CONFIG.common.mongoService,
          };
    }
    /**
     * 地震烈度范围的地质隐患统计
     * @param opts
     * @param opts.point {Array} [x,y] 事故点
     * @param opts.geometry {GeoJSON} 烈度范围
     * @param opts.resources {Object}
     * @param opts.resources[k] {Object}
     * @param opts.resources[k].tables {Array}
     * @param opts.resources[k].tables[i].table
     * @param opts.resources[k].tables[i].query
     * @param opts.resources[k].tables[i].fieldMap
     * @param opts.levels {Object} 级别映射表
     * @param opts.levelFn {Function} 计算等级的方法
     * @param cb
     * @param ctx
     */
    Service.prototype.getEqStatistics=function (opts, cb, ctx) {
        var seperator='_ss_',
            geoJsonReader=G.utils.GeometryUtil.getGeoJSONReader();
        //aggregate
        var jtsGeometry=geoJsonReader.read(util.fullRange).difference(
                geoJsonReader.read(opts.geometry)),
            pointJson={
                "type": "Point",
                "coordinates": opts.point
            },
            jtsPoint=geoJsonReader.read(pointJson);
        var distanceLimit=jtsGeometry.distance(jtsPoint)*Math.PI*util.R/180;
        var geoNear={
            "$geoNear":{
                "spherical": true,
                "near": pointJson,
                "limit": 1000*10000,
                "maxDistance": distanceLimit,
                "distanceField": "distance",
                "includeLocs": "geom"
            }
        }
        var resourceCol=jQuery.extend(true,{},opts.resources);
        var aggregateList=[];
        for(var resourceKey in resourceCol){
            var resourceTables=resourceCol[resourceKey].tables;
            for(var i=0;i<resourceTables.length;i++){
                var tableObj=resourceTables[i];
                var aggregateObj={},
                    aggregate=[];
                aggregate.push(geoNear);
                aggregate.push({
                    $match:{
                        "geom":{
                            "$geoIntersects":{
                                "$geometry":opts.geometry
                            }
                        }
                    }
                })
                if(tableObj.query&&Object.keys(tableObj.query).length>0){
                    aggregate.push({
                        $match:tableObj.query
                    })
                }
                aggregate.push({
                    "$project":{
                        "distance":"$distance"
                    }
                })
                aggregateObj.aggregate = aggregate;
                aggregateObj.queryIndex=1;
                aggregateObj.searchId = [resourceKey,tableObj.id].join(seperator);
                aggregateObj.dataSetId = tableObj.table;
                aggregateList.push(aggregateObj);
            }
        }
        util.aggregateMulti({
            server:this.opts.server,
            data:aggregateList
        },function (err, data) {
            var resultObj={};
            for(var resourceKey in resourceCol){
                var resourceObj=resourceCol[resourceKey];
                var resourceResult={
                    total:0,
                    levels:new Array(4)
                }
                for(var kk=0;kk<resourceResult.levels.length;kk++){
                    resourceResult.levels[kk]={
                        value:0
                    }
                }
                resultObj[resourceKey]=resourceResult;
                var resourceTables=resourceObj.tables;
                for(var i=0;i<resourceTables.length;i++){
                    var dataList=data[[resourceKey,resourceTables[i].id].join(seperator)][resourceTables[i].table];
                    for(var j=0,dataLen=dataList.length;j<dataLen;j++){
                        var levelResult=opts.levelFn({
                            data:dataList[j],
                            maxDistance:distanceLimit,
                            levels:opts.levels
                        })
                        resourceResult.levels[levelResult.level].value++;
                    }
                    resourceResult.total+=dataLen;
                }
            }
            cb&&cb.call(ctx,null,resultObj)
        },this)
    }

    /**
     * 地震烈度范围的地质隐患查询
     * @param opts
     * @param opts.point {Array} [x,y] 事故点
     * @param opts.geometry {GeoJSON} 烈度范围
     * @param opts.resources {Object}
     * @param opts.resources[k] {Object}
     * @param opts.resources[k].tables {Array}
     * @param opts.resources[k].tables[i].table
     * @param opts.resources[k].tables[i].query
     * @param opts.resources[k].tables[i].fieldMap
     * @param opts.levels {Object} 级别映射表
     * @param opts.levelFn {Function} 计算等级的方法
     * @param cb
     * @param ctx
     */
    Service.prototype.getEqData=function (opts, cb, ctx) {
        var geoJsonReader=G.utils.GeometryUtil.getGeoJSONReader();
        //aggregate
        var jtsGeometry=geoJsonReader.read(util.fullRange).difference(
            geoJsonReader.read(opts.geometry)),
            pointJson={
                "type": "Point",
                "coordinates": opts.point
            },
            jtsPoint=geoJsonReader.read(pointJson);
        var distanceLimit=jtsGeometry.distance(jtsPoint)*Math.PI*util.R/180;
        var resourceCol=jQuery.extend(true,{},opts.resources);
        var queryCol={};
        for(var resourceKey in resourceCol){
            var resourceTables=resourceCol[resourceKey].tables;
            for(var i=0;i<resourceTables.length;i++){
                var tableObj=resourceTables[i];
                var queryItem={},
                    query={
                        $and:[
                            {
                                "geom":{
                                    "$geoIntersects":{
                                        "$geometry":opts.geometry
                                    }
                                }
                            }
                        ]
                    };
                queryItem.query=query;
                if(tableObj.query){
                    query.$and.push(tableObj.query)
                }
                var selectList=['geom','_id'];
                if(tableObj.fieldMap){
                    for(var field in tableObj.fieldMap){
                        selectList.push('tag.'+tableObj.fieldMap[field])
                    }
                }
                queryItem.select=selectList.join(' ');
                queryCol[tableObj.table]=queryItem;
            }
        }
        var resultHandler=function(resultdata){
            var resultCol={};
            for(var resourceKey in resourceCol){
                var resultObj={};
                resultCol[resourceKey]=resultObj;
                for(var levelCode in opts.levels){
                    resultObj[levelCode]=[];
                }
                var resourceTables=resourceCol[resourceKey].tables;
                for(var i=0;i<resourceTables.length;i++){
                    var tableObj=resourceTables[i];
                    var dataList=resultdata[tableObj.table];
                    for(var j=0,dataLen=dataList.length;j<dataLen;j++){
                        var dataItem=dataList[j];
                        var dataTemp={};
                        dataTemp.id=dataItem._id;
                        dataTemp.geom=dataItem.geom;
                        dataTemp._table=tableObj.table;
                        dataTemp._type=tableObj.id;
                        //attributes
                        if(tableObj.fieldMap){
                            for(var field in tableObj.fieldMap){
                                dataTemp[field]=dataItem.tag[tableObj.fieldMap[field]]||'';
                            }
                        }
                        //
                        dataTemp.distance=util.caculateDistancePoints(opts.point,dataItem.geom.coordinates);
                        var levelResult=opts.levelFn({
                            data:dataTemp,
                            maxDistance:distanceLimit,
                            levels:opts.levels
                        })
                        resultObj[levelResult.level].push(dataTemp);
                    }
                }
            }
            return resultCol;
        }
        util.queryMulti({
            server:this.opts.server,
            data:queryCol
        },function (err, data) {
            if(err==null){
                cb&&cb.call(ctx,null,resultHandler(data,opts));
            }else{
                cb&&cb.call(ctx,err);
            }
        },this)
    }
    /**
     * opts
     * opts.type 
     * opts.point 
     * opts.geometry 
     */
    Service.prototype.queryData=function (opts,cb) {
        //按照类型查询数据
        var query={};
        query[opts.type] = window.EMapServerV2.RiskQueryServiceConfig[opts.type];
        this.getEqData({
            point: opts.point,
            geometry: opts.geometry,
            levelFn: util.levelFn,
            levels:{
                3: [0.7, 100000],//最大距离的0.7倍以上
                2: [0.4, 0.7],//最大距离的0.4-0.7倍
                1: [0.2, 0.4],//最大距离的0.2-0.4倍
                0: [0, 0.2]//最大距离的0.2倍
            },
            resources: query
        }, function (err, data) {
            if (err == null) {
                console.log('隐患点统计')
                cb(data);
            } else {
                console.error(err);
            }
        })
    }
    window.EMapServerV2 = window.EMapServerV2 || {};
    window.EMapServerV2.RiskTroubleQueryService = Service;
})(window);