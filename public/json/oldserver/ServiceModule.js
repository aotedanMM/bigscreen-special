(function (window) {
   var util = {
        /**
         * @param opts
         * @param opts.server
         * @param opts.eId
         * @param opts.data
         * @param cb
         * @param ctx
         */
        aggregateMulti: function (opts, cb, ctx) {
            var url = opts.server + '/dataStatics/aggregateMulti';
            var confs = opts.data;
            var isNearbyQuery = false;
            if (confs && confs.length === 1) {
                var conf = confs[0];
                if (conf.near) {
                    isNearbyQuery = true;
                    url = opts.server + '/dataStatics/aggregatePageNear';
                }
            }
            jQuery.ajax({
                url: url,
                type: 'post',
                data: {
                    eId: opts.eId,
                    data: JSON.stringify(opts.data)
                },
                dataType: 'json',
                success: function (data) {
                    if (data.success) {
                        var result = null;
                        if (isNearbyQuery) {
                            var searchId = conf.searchId;
                            var datasetId = conf.dataSetId;
                            if (Array.isArray(data.data) && searchId && datasetId) {
                                result = {};
                                result[searchId] = {};
                                result[searchId][datasetId] = data.data;
                            }
                        } else {
                            result = data.data;
                        }
                        cb && cb.call(ctx, null, result);
                    } else {
                        cb && cb.call(ctx, new Error(data.msg))
                    }
                },
                error: function (xhr, msg, err) {
                    cb && cb.call(ctx, new Error(err))
                }
            })
        }      
    };
    //
    var TABLE_PREFIX = 'user_safety_'
    var DICT_SUFFIX = '_OBJ';
    var EID = 'safety'
    /**
     *
     * @param opts
     * @param opts.server
     */
    var service = function (opts) {
        this.options = {
            server: opts.server,
            eId: EID
        }
    };
    /**
     * @private
     */
    service.prototype.aggregateMulti = util.aggregateMulti;
    /**
     * 缓冲区范围内的总数统计
     * @param opts
     * @param [opts.districtCode] {string} 行政区划编码
     * @param [opts.districtField] {string} 行政区划编码字段
     * @param opts.keyWord
     * @param opts.bufferList {Array} 缓冲范围，geojson格式数组，4326坐标系
     * @param opts.querys {Object} 统计的数据集合
     * @param opts.querys[i].table {String}  表名
     * @param opts.querys[i].query {String} 属性过滤
     * @param opts.querys[i].sumType {String} 计数类型，1=按照记录数统计，2=按照记录某些数值属性统计，默认为1
     * @param opts.querys[i].sumFields {Array} 用于统计总和的字段名数组（数字类型），当sumType=2时必填
     */
    service.prototype.bufferStatistics = function (opts, cb, ctx) {
        var bufferList = opts.bufferList || [],
            bufferCount = bufferList.length,
            querys = opts.querys || {};
        var queryCol = [];
        for (var queryId in querys) {
            var queryObj = querys[queryId];
            if(bufferCount>0)
            {
                for (var j = 0; j < bufferCount; j++) {
                    var queryItem = {};
                    queryItem.query = queryObj.query || {};
                    queryItem.dataSetId = queryObj.table;
                    queryItem.queryIndex = 1;
                    queryItem.searchId = [queryId, j].join('_');
                    var aggregates = [
                        {
                            "$match": {
                                "geom": {
                                    "$geoIntersects": {
                                        "$geometry": bufferList[j]
                                    }
                                }
                            }
                        }
                    ]
                    var keyWords = [];
                    if (Array.isArray(opts.keyWord)) {
                        keyWords = opts.keyWord;
                    } else if (typeof(opts.keyWord)=='string') {
                        keyWords.push(opts.keyWord);
                    }
                    var self = this;
                    keyWords.forEach(function(keyWord) {
                        var kwMatch = self.getSearchMatch(keyWord, queryObj);
                        if (kwMatch) {
                            aggregates.push(kwMatch);
                        }                     
                    });
                    queryObj.districtField = (queryObj.districtField || opts.districtField) || 'DISTRICTCODE';
                    var districtMatch = this.getDistrictMatch(opts.districtCode, queryObj);
                    if (districtMatch) {
                        aggregates.push(districtMatch);
                    }
                    queryObj.defaultSumObj = {};
                    if (queryObj.sumType == 2) {//按照字段统计
                        if (queryObj.sumFields && queryObj.sumFields.length > 0) {
                            var groupObj = {
                                _id: null
                            };
                            var defaultSumObj = {};
                            for (var q = 0; q < queryObj.sumFields.length; q++) {
                                var sumField = queryObj.sumFields[q];
                                groupObj[sumField] = {
                                    $sum: '$tag.' + sumField
                                }
                                defaultSumObj[sumField] = 0;
                            }
                            aggregates.push({
                                $group: groupObj
                            })
                            queryObj.defaultSumObj = defaultSumObj;
                        } else {
                            throw(new Error(queryObj.table + '：sumFields必须为正确的字段名数组！'))
                        }
                    } else {
                        queryObj.defaultSumObj.count = 0;
                        aggregates.push({
                            $count: 'count'
                        })
                    }
                    queryItem.aggregate = aggregates;
                    queryCol.push(queryItem)
                }
            }
            else
            {
                if(opts.codes&&opts.codes.length>0)
                {
                    var queryItem = {};
                    // queryItem.query = queryObj.query || {};
                    queryItem.dataSetId = queryObj.table;
                    queryItem.queryIndex = 0;
                    queryItem.searchId = [queryId, 0].join('_');
                    var aggregates = [];
                    if (queryObj.query) {
                        aggregates.push({
                            $match: queryObj.query,
                        });
                    }
                    queryObj.districtField = (queryObj.districtField || opts.districtField) || 'DISTRICTCODE';
                    var districtMatch = this.getDistrictMatch(opts.codes, queryObj);
                    if (districtMatch) {
                        aggregates.push(districtMatch);
                    }

                    var keyWords = [];
                    if (Array.isArray(opts.keyWord)) {
                        keyWords = opts.keyWord;
                    } else if (typeof(opts.keyWord)=='string') {
                        keyWords.push(opts.keyWord);
                    }
                    var self = this;
                    keyWords.forEach(function(keyWord) {
                        var kwMatch = self.getSearchMatch(keyWord, queryObj);
                        if (kwMatch) {
                            aggregates.push(kwMatch);
                        }                     
                    }); 
                                      
                    queryObj.defaultSumObj = {};
                    if (queryObj.sumType == 2) {//按照字段统计
                        if (queryObj.sumFields && queryObj.sumFields.length > 0) {
                            var groupObj = {
                                _id: null
                            };
                            var defaultSumObj = {};
                            for (var q = 0; q < queryObj.sumFields.length; q++) {
                                var sumField = queryObj.sumFields[q];
                                groupObj[sumField] = {
                                    $sum: '$tag.' + sumField
                                }
                                defaultSumObj[sumField] = 0;
                            }
                            aggregates.push({
                                $group: groupObj
                            })
                            queryObj.defaultSumObj = defaultSumObj;
                        } else {
                            throw(new Error(queryObj.table + '：sumFields必须为正确的字段名数组！'))
                        }
                    } else {
                        queryObj.defaultSumObj.count = 0;
                        aggregates.push({
                            $count: 'count'
                        })
                    }
                    queryItem.aggregate = aggregates;
                    queryCol.push(queryItem)
                }
            }
        }
        util.aggregateMulti({
            server: this.options.server,
            eId: this.options.eId,
            async : false,
            data: queryCol
        }, function (err, data) {
            if (err == null) {
                var dataSet = data;
                var resultSet = [];
                if(bufferCount>0)
                {
                    for (var j = 0; j < bufferCount; j++) {
                        var bufferResult = {};
                        for (var queryId in querys) {
                            var searchId = [queryId, j].join('_');
                            var countResult = dataSet[searchId];
                            if (countResult) {
                                var sumObj = countResult[Object.keys(countResult)[0]][0] || querys[queryId].defaultSumObj;
                                delete sumObj._id;
                                bufferResult[queryId] = sumObj;
                            } else {
                                bufferResult[queryId] = 0
                            }
                        }
                        resultSet.push(bufferResult);
                    }
                }
                else
                {
                    var bufferResult = {};
                    for (var queryId in querys) {
                        var searchId = [queryId, 0].join('_');
                        var countResult = dataSet[searchId];
                        if (countResult) {
                            var sumObj = countResult[Object.keys(countResult)[0]][0] || querys[queryId].defaultSumObj;
                            delete sumObj._id;
                            bufferResult[queryId] = sumObj;
                        } else {
                            bufferResult[queryId] = 0
                        }
                    }
                    resultSet.push(bufferResult);
                }
                cb && cb.call(ctx, null, resultSet);
            } else {
                cb && cb.call(ctx, err)
            }
        }, this)
    };

    /**
     * 缓冲区范围内的数据查询
     * @param opts
     * @param opts.id id
     * @param opts.keyWord 关键字
     * @param opts.point {Array} 事发地点经纬度坐标 [x,y]
     * @param opts.maxDistance {Number} 查询的范围半径，单位米，当buffer指定时，此属性无效
     * @param opts.buffer {Object} 指定缓冲范围，geojson格式，4326坐标系
     * @param opts.limit {Number} 每类数据查询结果记录数量限制，默认为100000
     * @param opts.distanceField {String} 距离属性名
     * @param opts.querys {Array} 查询的数据集合
     * @param opts.querys[i].table {String}  表名
     * @param opts.querys[i].maxDistance {Number} 当前数据查询的范围半径，单位米，默认等于opts.maxDistance
     * @param opts.querys[i].limit {Number} 当前数据查询的记录数量限制，默认等于opts.limit
     * @param opts.querys[i].query {String} 属性过滤
     * @param opts.querys[i].fieldMap {String} 字段映射
     * @param cb
     * @param ctx
     */
    service.prototype.bufferQuery = function (opts, cb, ctx) {
        var defaultLimit = 400000;
        var defaults = {
            limit: defaultLimit,
            distanceField: '_distance'
        }
        var options = jQuery.extend(true, defaults, opts || {});
        if (options.buffer) {
            options.maxDistance = 3000 * 1000;
        }
        var limit = options.limit,
            maxDistance = options.maxDistance,
            distanceField = options.distanceField;
        var queryCol = [];
        for (var queryId in options.querys) {
            var queryObj = options.querys[queryId];
            var queryItem = {};
            var aggregates = [];
            //geonear
            //去除geonear条件，改用aggregatePageNear接口，解决mongo管道限制
            
            // if (options.point) {
            //     var geoNear = {
            //         "spherical": true,
            //         "near": {
            //             "type": "Point",
            //             "coordinates": options.point
            //         },
            //         "limit": queryObj.limit || limit || defaultLimit,
            //         "maxDistance": queryObj.maxDistance || maxDistance,
            //         "distanceField": distanceField,
            //         "includeLocs": "geom"
            //     };
            //     aggregates.push({
            //         "$geoNear": geoNear
            //     });                
            // }
            if (options.id) {
                aggregates.push(this.getIdMatch(opts.id));
            }
            queryObj.districtField = queryObj.districtField || 'DISTRICTCODE';
            var districtMatch = this.getDistrictMatch(opts.districtCode, queryObj);
            if (districtMatch) {
                aggregates.push(districtMatch);
            }        
            var keyWords = [];
            if (Array.isArray(opts.keyWord)) {
                keyWords = opts.keyWord;
            } else if (typeof(opts.keyWord)=='string') {
                keyWords.push(opts.keyWord);
            }
            var self = this;
            keyWords.forEach(function(keyWord) {
                var kwMatch = self.getSearchMatch(keyWord, queryObj);
                if (kwMatch) {
                    aggregates.push(kwMatch);
                }                     
            });            
            if (options.near) {
                queryItem.near = options.near;
                queryItem.distanceField = options.distanceField;
            }
            if (options.paging && options.pageSize && options.pageIndex) {
                queryItem.paging = options.paging;
                queryItem.pageSize = options.pageSize;
                queryItem.pageIndex = options.pageIndex;
            }               
            //属性过滤
            if (queryObj.query && Object.keys(queryObj.query).length > 0) {
                aggregates.push({
                    "$match": queryObj.query
                })
            }
            //缓冲过滤
            if (options.buffer) {
                aggregates.push({
                    "$match": {
                        "geom": {
                            "$geoIntersects": {
                                "$geometry": options.buffer
                            }
                        }
                    }
                })
            }
            //
            var projectMap = {
                'geom': '$geom'
            };
            projectMap[distanceField] = '$' + distanceField;
            //排序
            var sorts=queryObj.sorts;
            if (sorts) {
                    aggregates.push({
                        "$sort": sorts
                    });
            }
            //关联
            var relations = queryObj.relations || [];
            var relProjectSet = {};
            if (relations.length > 0) {
                for (var kk = 0; kk < relations.length; kk++) {
                    var relationObj = relations[kk]
                    aggregates.push({
                        "$lookup": {
                            "from": TABLE_PREFIX + relationObj.table,
                            "localField": "tag." + relationObj.localField,
                            "foreignField": "tag." + relationObj.foreignField,
                            "as": relationObj.localField
                        }
                    });
                    aggregates.push({
                        "$unwind": {
                            "path": "$" + relationObj.localField,
                            "preserveNullAndEmptyArrays": true
                        }
                    });
                    relProjectSet[relationObj.localField] = '$' + relationObj.localField + '.tag'
                }
            }
            //字段映射
            var fieldMap = queryObj.fieldMap || {};
            for (var relField in relProjectSet) {
                var alias = 'tag.' + relField;
                for (var fieldName in fieldMap) {
                    if (fieldMap[fieldName] === relField) {
                        alias = 'tag.' + fieldName + DICT_SUFFIX
                    }
                }
                projectMap[alias] = relProjectSet[relField]
            }
            for (var fieldName in fieldMap) {
                if (fieldMap[fieldName].indexOf('.')>=0){
                    projectMap['tag.' + fieldName] = '$' + fieldMap[fieldName];
                } else{
                    projectMap['tag.' + fieldName] = '$tag.' + fieldMap[fieldName];
                }
            }
            aggregates.push({
                "$project": projectMap
            })
            //
            queryItem.dataSetId = queryObj.table;
            queryItem.queryIndex = 1;
            queryItem.searchId = queryId;
            queryItem.aggregate = aggregates;
            //重大风险加筛选 by lsl
            if(queryObj.query){
                queryItem.query = queryObj.query;
            }
            queryCol.push(queryItem);
        }
        var eId;
        if(options.eId)
        {
            eId=options.eId;
        }
        else
        {
            eId=this.options.eId;
        }
        util.aggregateMulti({
            server: this.options.server,
            eId: eId,
            data: queryCol
        }, function (err, dataSet) {
            if (err == null) {
                var resultSet = {};
                for (var queryId in options.querys) {
                    var eachData = dataSet[queryId];
                    var list = eachData[Object.keys(eachData)[0]];
                    resultSet[queryId] = list;
                }
                cb && cb.call(ctx, null, resultSet);
            } else {
                cb && cb.call(ctx, err)
            }
        }, this)
    };
    /**
     * 主键（id）筛选
     * @param id
     * @param [idField]
     */
    service.prototype.getIdMatch = function (id, idField) {
        if (!idField) {
        idField = '_id';
        }
        if(id)
        {
            var query={};
            var filter={};
            filter['$regex'] = "^" + id + "$";
            query[idField]=filter;
            var idquery={
                $match: query
            };
            return idquery;
        }
        else
        {
        return null;
        }
    }
  /**
   * 拼接关键字条件--预留方法
   * @param kw
   * @param resource
   */
  service.prototype.getSearchMatch = function (kw, resource) {
    if(kw)
    {
        var query={};
        var filter={};
        filter['$regex']="^.*" + kw + ".*$";
        query['tag.' + resource.keyWordFields]=filter;
        var kwquery={
            $match: query
        };
        return kwquery;
    }
    else
    {
      return null;
    }
  }    
    /**
     * 查询详情
     * @param opts
     * @param opts.table {String} 表名
     * @param opts.dataId {String} 数据id
     * @param opts.relations {Array} 关联
     * @param cb
     * @param ctx
     */
    service.prototype.queryById = function (opts, cb, ctx) {
        var queryCol = [],
            queryItem = {},
            aggregates = [];
        //
        aggregates.push({
            $match: {
                "_id": opts.dataId
            }
        })
        //
        var projectMap = {
            'geom': '$geom',
            'tag': '$tag'
        };
        //关联
        var relations = opts.relations || [];
        if (relations.length > 0) {
            for (var kk = 0; kk < relations.length; kk++) {
                var relationObj = relations[kk];
                aggregates.push({
                    "$lookup": {
                        "from": TABLE_PREFIX + relationObj.table,
                        "localField": "tag." + relationObj.localField,
                        "foreignField": "tag." + relationObj.foreignField,
                        "as": relationObj.localField
                    }
                });
                aggregates.push({
                    "$unwind": {
                        "path": "$" + relationObj.localField,
                        "preserveNullAndEmptyArrays": true
                    }
                });
                projectMap[relationObj.localField] = '$' + relationObj.localField + '.tag'
            }
            aggregates.push({
                '$project': projectMap
            })
        }
        //
        queryItem.dataSetId = opts.table;
        queryItem.queryIndex = 1;
        queryItem.searchId = 'query';
        queryItem.aggregate = aggregates;
        queryCol.push(queryItem)
        util.aggregateMulti({
            server: this.options.server,
            eId: this.options.eId,
            data: queryCol
        }, function (err, dataSet) {
            if (err == null) {
                var resultObj = dataSet.query;
                var resultSet = resultObj[opts.table][0];
                var tag = resultSet.tag;
                for (var kk in tag) {
                    if (resultSet.hasOwnProperty(kk)) {
                        tag[kk + DICT_SUFFIX] = resultSet[kk];
                        delete resultSet[kk];
                    }
                }
                cb && cb.call(ctx, null, resultSet);
            } else {
                cb && cb.call(ctx, err)
            }
        }, this)
    };

    service.prototype.queryByAttr = function (opts, cb, ctx) {
        var queryCol = [],
            queryItem = {},
            aggregates = [];
        //
        if(opts.dataId)
        {
            aggregates.push({
                $match: {
                    "tag.CLASID": opts.dataId
                }
            })
        }

        //
        var projectMap = {
            'geom': '$geom',
            'tag': '$tag'
        };
        //关联
        var relations = opts.relations || [];
        if (relations.length > 0) {
            for (var kk = 0; kk < relations.length; kk++) {
                var relationObj = relations[kk];
                aggregates.push({
                    "$lookup": {
                        "from": TABLE_PREFIX + relationObj.table,
                        "localField": "tag." + relationObj.localField,
                        "foreignField": "tag." + relationObj.foreignField,
                        "as": relationObj.localField
                    }
                });
                aggregates.push({
                    "$unwind": {
                        "path": "$" + relationObj.localField,
                        "preserveNullAndEmptyArrays": true
                    }
                });
                projectMap[relationObj.localField] = '$' + relationObj.localField + '.tag'
            }
            aggregates.push({
                '$project': projectMap
            })
        }
        //
        queryItem.dataSetId = opts.table;
        queryItem.queryIndex = 10;
        queryItem.searchId = 'query';
        queryItem.aggregate = aggregates;
        queryCol.push(queryItem)
        util.aggregateMulti({
            server: this.options.server,
            eId: this.options.eId,
            data: queryCol
        }, function (err, dataSet) {
            if (err == null) {
                var resultObj = dataSet.query;
                var resultSet = resultObj[opts.table];
                // var tag = resultSet.tag;
                // for (var kk in tag) {
                //     if (resultSet.hasOwnProperty(kk)) {
                //         tag[kk + DICT_SUFFIX] = resultSet[kk];
                //         delete resultSet[kk];
                //     }
                // }
                cb && cb.call(ctx, null, resultSet);
            } else {
                cb && cb.call(ctx, err)
            }
        }, this)
    };


    /**
     * 缓冲区范围内的数据查询
     * @param opts
     * @param opts.point {Array} 事发地点经纬度坐标 [x,y]
     * @param opts.distanceField {String} 距离属性名
     * @param opts.materialNeed　{Object} 物资需求
     * @param cb
     * @param ctx
     */
    service.prototype.bufferQueryMaterial = function (opts, cb, ctx) {
        opts.distanceField = opts.distanceField || '_distance'
        var queryCol = [],
            queryItem = {};
        var aggregates = [
            {
                "$geoNear": {
                    "spherical": true,
                    "near": {
                        "type": "Point",
                        "coordinates": opts.point
                    },
                    "limit": 100000,
                    "maxDistance": 10000000,
                    "distanceField": opts.distanceField,
                    "includeLocs": "geom"
                }
            },
            {
                $lookup: {
                    "from": "user_safety_JC_MATERIAL_INFO",
                    "localField": "_id",
                    "foreignField": "tag.REPERTORYID",
                    "as": "materials"
                }
            }
        ]
        queryItem.dataSetId = 'JC_REPERTORY';
        queryItem.queryIndex = 1;
        queryItem.searchId = 'query';
        queryItem.aggregate = aggregates;
        queryCol.push(queryItem)
        util.aggregateMulti({
            server: this.options.server,
            eId: this.options.eId,
            data: queryCol
        }, function (err, dataSet) {
            if (err == null) {
                var reposityList = dataSet.query[Object.keys(dataSet.query)[0]];
                var resultSet = {};
                //计算提取物资提取
                var materialNeed = opts.materialNeed || {};
                for (var materialId in materialNeed) {
                    var dispatchResult = this._caculateDispatchResult(
                        materialId,
                        materialNeed[materialId],
                        reposityList,
                        {
                            attachKey: 'materials',
                            codeKey: 'MATERIALTYPE',
                            numKey: 'MATERIALNUM',
                            distanceField: opts.distanceField
                        }
                    )
                    resultSet[materialId] = dispatchResult;
                }
                cb && cb.call(ctx, null, resultSet);
            } else {
                cb && cb.call(ctx, err)
            }
        }, this)
    };

    /**
     * 提取调配
     * @param code
     * @param needCount
     * @param list
     * @private
     */
    service.prototype._caculateDispatchResult = function (code, needCount, list, opts) {
        var provideList = [],
            fulfillCount = 0,
            total = list.length,
            attachKey = opts.attachKey,
            codeKey = opts.codeKey,
            numKey = opts.numKey;
        for (var i = 0; i < total; i++) {
            var item = list[i];
            var attachList = item[attachKey] || [],
                attachCount = attachList.length,
                thisItem = {
                    _id: item._id,
                    geom: item.geom,
                    dis: item[opts.distanceField],
                    tag: item.tag
                };
            //遍历装备物资
            for (var j = 0; j < attachCount; j++) {
                var attachItem = attachList[j];
                if (attachItem && attachItem.tag
                    && attachItem.tag[codeKey] == code) {
                    var attachNum = attachItem.tag[numKey],
                        promiseCount = fulfillCount + attachNum;
                    if (!attachNum || isNaN(attachNum)) {
                        continue;
                    }
                    if (promiseCount < needCount) {
                        thisItem.num = attachNum;
                    } else {
                        thisItem.num = needCount - fulfillCount;
                    }
                    fulfillCount += thisItem.num;
                    provideList.push(thisItem);
                    break;
                }
            }
            if (fulfillCount >= needCount) {
                break;
            }
        }
        var result={
            num:fulfillCount,
            list:provideList
        };
        return result;
    };

    /**
     * 拼接行政区划条件
     * @param districtCode
     * @param resource
     * @param resource.districtField 行政区划字段名
     * @param resource.districtKey 可选，默认为空
     */
    service.prototype.getDistrictMatch = function (districtCode, resource) {
        var match = null;
        if (districtCode && districtCode !== '000000' && resource.districtField) {
            var districtCodes = districtCode.split(','),
                districtField = resource.districtField;
            var or = [],
                districtKey = null;
            if (resource.districtKey) {
                districtKey = resource.districtKey;
            } else {
                districtKey = 'tag.' + districtField;
            }
            for (var i = 0; i < districtCodes.length; i++) {
                var districtCode = districtCodes[i];
                if (districtCode) {
                    var eachFilter = {};
                    eachFilter[districtKey] = {
                        $regex: getDistrictRegex(districtCode)
                    };
                    or.push(eachFilter);
                }
            }
            match = {
                $match: {
                    $or: or
                }
            }
        } else {
            var matchObj = {};
            // matchObj['tag.'+resource.districtField] = {
            //     $regex: '.*',
            // };
            match = {
                $match: matchObj,
            }
            console.debug('ignore district filter');
        }
        return match;

        function getDistrictRegex(code) {
            var c = code.substr(0, 6);
            if ('000000' == c) {//全国不过滤
                c = '.*';
            } else if (/^\d{2}0000$/.test(c)) {
                c = c.substr(0, 2) + '.*';
            } else if (/^\d{4}00$/.test(c)) {
                c = c.substr(0, 4) + '.*';
            } else {//灾情信息员code都是12位
                c = c + '.*'
            }
            return '^' + c + '$';
        }
    }    
    window.EMapServerV2 = window.EMapServerV2 || {};
    // 参考
    window.EMapServerV2.ServiceModule = service;
})(window);