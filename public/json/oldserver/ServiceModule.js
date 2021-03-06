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
     * ?????????????????????????????????
     * @param opts
     * @param [opts.districtCode] {string} ??????????????????
     * @param [opts.districtField] {string} ????????????????????????
     * @param opts.keyWord
     * @param opts.bufferList {Array} ???????????????geojson???????????????4326?????????
     * @param opts.querys {Object} ?????????????????????
     * @param opts.querys[i].table {String}  ??????
     * @param opts.querys[i].query {String} ????????????
     * @param opts.querys[i].sumType {String} ???????????????1=????????????????????????2=????????????????????????????????????????????????1
     * @param opts.querys[i].sumFields {Array} ????????????????????????????????????????????????????????????sumType=2?????????
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
                    if (queryObj.sumType == 2) {//??????????????????
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
                            throw(new Error(queryObj.table + '???sumFields????????????????????????????????????'))
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
                    if (queryObj.sumType == 2) {//??????????????????
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
                            throw(new Error(queryObj.table + '???sumFields????????????????????????????????????'))
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
     * ?????????????????????????????????
     * @param opts
     * @param opts.id id
     * @param opts.keyWord ?????????
     * @param opts.point {Array} ??????????????????????????? [x,y]
     * @param opts.maxDistance {Number} ???????????????????????????????????????buffer???????????????????????????
     * @param opts.buffer {Object} ?????????????????????geojson?????????4326?????????
     * @param opts.limit {Number} ??????????????????????????????????????????????????????100000
     * @param opts.distanceField {String} ???????????????
     * @param opts.querys {Array} ?????????????????????
     * @param opts.querys[i].table {String}  ??????
     * @param opts.querys[i].maxDistance {Number} ????????????????????????????????????????????????????????????opts.maxDistance
     * @param opts.querys[i].limit {Number} ??????????????????????????????????????????????????????opts.limit
     * @param opts.querys[i].query {String} ????????????
     * @param opts.querys[i].fieldMap {String} ????????????
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
            //??????geonear???????????????aggregatePageNear???????????????mongo????????????
            
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
            //????????????
            if (queryObj.query && Object.keys(queryObj.query).length > 0) {
                aggregates.push({
                    "$match": queryObj.query
                })
            }
            //????????????
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
            //??????
            var sorts=queryObj.sorts;
            if (sorts) {
                    aggregates.push({
                        "$sort": sorts
                    });
            }
            //??????
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
            //????????????
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
            //????????????????????? by lsl
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
     * ?????????id?????????
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
   * ?????????????????????--????????????
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
     * ????????????
     * @param opts
     * @param opts.table {String} ??????
     * @param opts.dataId {String} ??????id
     * @param opts.relations {Array} ??????
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
        //??????
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
        //??????
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
     * ?????????????????????????????????
     * @param opts
     * @param opts.point {Array} ??????????????????????????? [x,y]
     * @param opts.distanceField {String} ???????????????
     * @param opts.materialNeed???{Object} ????????????
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
                //????????????????????????
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
     * ????????????
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
            //??????????????????
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
     * ????????????????????????
     * @param districtCode
     * @param resource
     * @param resource.districtField ?????????????????????
     * @param resource.districtKey ?????????????????????
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
            if ('000000' == c) {//???????????????
                c = '.*';
            } else if (/^\d{2}0000$/.test(c)) {
                c = c.substr(0, 2) + '.*';
            } else if (/^\d{4}00$/.test(c)) {
                c = c.substr(0, 4) + '.*';
            } else {//???????????????code??????12???
                c = c + '.*'
            }
            return '^' + c + '$';
        }
    }    
    window.EMapServerV2 = window.EMapServerV2 || {};
    // ??????
    window.EMapServerV2.ServiceModule = service;
})(window);