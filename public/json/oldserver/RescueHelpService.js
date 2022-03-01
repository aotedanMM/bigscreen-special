(function (window) {
    /**
     * @param opts
     * @param opts.server
     * @constructor
     */
    var Service = function (opts) {
        this.opts = opts;
        //
        this.materialSet ={
            "TP001": {
                "label": "救灾帐篷",
                "code": "TP001",
                "unit": "顶"
            },
            "TP002": {
                "label": "救灾被服",
                "code": "TP002",
                "unit": "件"
            },
            "TP003": {
                "label": "救灾食品",
                "code": "TP003",
                "unit": "件"
            },
            "TP004": {
                "label": "生活用品",
                "code": "TP004",
                "unit": "件"
            },
            "TP005": {
                "label": "照明用具",
                "code": "TP005",
                "unit": "件"
            },
            "TP006": {
                "label": "能源动力",
                "code": "TP006",
                "unit": "件"
            },
            "TP007": {
                "label": "应急救生",
                "code": "TP007",
                "unit": "件"
            },
            "TP008": {
                "label": "交通工具",
                "code": "TP008",
                "unit": "台"
            },
            "TP009": {
                "label": "彩条苫布",
                "code": "TP009",
                "unit": "件"
            },
            "TP010": {
                "label": "卫生设施",
                "code": "TP010",
                "unit": "件"
            },
            "TP011": {
                "label": "生活家具",
                "code": "TP011",
                "unit": "件"
            },
            "TP012": {
                "label": "装备工具",
                "code": "TP012",
                "unit": "件"
            },
            "TP013":{
                "label": "个体防护",
                "code": "TP013",
                "unit": "件"
            },
            "TP014":{
                "label": "侦测与搜寻",
                "code": "TP014",
                "unit": "件"
            }
        };
    };
    /**
     * 多个管道执行方法-公共
     * @param aggregateList 管道列表
     * @param cb
     * @param ctx
     * @returns {*}
     */
    Service.prototype.aggregateMulti=function (aggregateList, cb, ctx) {
        var opts = {},
            data = {};
        opts.url = EMAP_CONFIG.common.mongoService + '/dataStatics/aggregateMulti';
        opts.dataType = 'json';
        opts.type = 'POST';
        data.data = JSON.stringify(aggregateList);
        data.eId = 'safety';
        opts.data = data;
        opts.success = function (d) {
            cb && cb.call(ctx, null, d.data);
        }
        opts.error = function (err) {
            cb && cb.call(ctx, new Error(err));
        }
        return jQuery.ajax(opts);
    };
    /**
     * 查询救援队
     * @param opts
     * @param opts.querys
     * @param opts.querys[i].point {Array} 必填，如[116,39]
     * @param opts.querys[i].typeList {Array} 必填，类型编码，如['T002']
     * @param opts.querys[i].query {Object} 可选，自定义查询条件
     * @param opts.querys[i].geometry {GeoJSON} 必填，地震灾损区，geojson格式
     * @param opts.querys[i].limit {Number} 可选，返回数据数量
     * @param opts.querys[i].sortByDistance {Boolean} 可选，默认为true
     * @param cb
     * @param ctx
     */
    Service.prototype.getRescueTeam=function (opts, cb, ctx) {
        var aggregateList = [];
        for (var i = 0; i < opts.querys.length; i++) {
            var aggregateObj = {},
                aggregate = [];
            var queryObj = opts.querys[i];
            //
            var geometry = queryObj.geometry;
            var nearQuery = {
                'tag.RESCUETYPECODE': {
                    $in: queryObj.typeList
                }
            }
            var query={};
            if (geometry) {
                query['geom'] = {
                    $geoIntersects: {
                        $geometry: geometry
                    }
                }
            }
            if (queryObj.query) {
                for (var kk in queryObj.query) {
                    query[kk] = queryObj.query[kk];
                }
            }
            aggregate.push({
                $geoNear: {
                    limit: 100000,
                    maxDistance: 500000 * 1000,
                    spherical: true,
                    includeLocs: 'geom',
                    distanceField: 'distance',
                    near:{
                        type:'Point',
                        coordinates:queryObj.point
                    },
                    query:nearQuery
                }
            })
            aggregate.push({
                $lookup: {
                    from: 'user_safety_EQUIP_RESCUETYPE',
                    localField: 'tag.RESCUETYPECODE',
                    foreignField: '_id',
                    as: 'type'
                }
            })
            aggregate.push({
                $unwind: {
                    path: '$type',
                    "preserveNullAndEmptyArrays": false
                }
            })
            if(queryObj.sortByDistance==false){aggregate.push({
                $sort: {
                    _id:1
                }
            })
                aggregate.push({
                    $limit: queryObj.limit || 150
                })
            }else{
                aggregate.push({
                    $limit: queryObj.limit || 150
                })
            }
            aggregate.push({
                $project: {
                    name: '$tag.RESCUENAME',
                    typeCode: '$tag.RESCUETYPECODE',
                    typeName: '$type.tag.SHORTNAME',
                    num: '$tag.TOTALPERNUM',
                    geom: '$geom',
                    distance:'$distance'
                }
            })
            aggregateObj.aggregate = aggregate;
            aggregateObj.query = query;
            aggregateObj.searchId = i;
            aggregateObj.dataSetId = 'JYXX_TEA_RESCUE';
            aggregateObj.queryIndex = 1;
            aggregateList.push(aggregateObj)
        }
        this.aggregateMulti(aggregateList, function (err, data) {
            if (err == null) {
                var resultCol = [];
                for (var j = 0; j < aggregateList.length; j++) {
                    var list = data[j]['JYXX_TEA_RESCUE'];
                    // var measureService = new g2.sfs.MeasureService({
                    //   projectService: new g2.sfs.CoordinateTransform()
                    // });
                    for (var i = 0; i < list.length; i++) {
                        var itemObj = list[i];
                        if (!itemObj.geom) {
                            continue;
                        }
                        itemObj.x = itemObj.geom.coordinates[0];
                        itemObj.y = itemObj.geom.coordinates[1];
                        delete itemObj.geom;
                        itemObj.id = itemObj._id;
                        delete itemObj._id;
                        //
                        // var line = g2.sfs.GeometryFactory.createGeometryFromGeoJson({
                        //   type: 'LineString',
                        //   coordinates: [
                        //     opts.querys[j].point,
                        //     [itemObj.x, itemObj.y]
                        //   ]
                        // });
                        // line.spatialReference = 4326;
                        // itemObj.distance = measureService.length(line);
                    }
                    // list.sort(function (a, b) {
                    //   return a.distance - b.distance;
                    // })
                    resultCol.push(list);
                }
                cb && cb.call(ctx, null, resultCol);
            } else {
                cb && cb.call(ctx, err);
            }
        })
    };
    /**
     * 获取储备库
     * @param opts
     * @param opts.point
     * @param opts.query
     * @param cb
     * @param ctx
     */
    Service.prototype.getReposity=function(opts,cb,ctx){
        var point = opts.point;
        var aggregate = [];
        var geoNear = {
            limit: 1000000,
            maxDistance: 5000 * 1000,
            spherical: true,
            includeLocs: 'geom',
            distanceField: 'distance'
        };
        geoNear.near = {
            type: 'Point',
            coordinates: [point[0], point[1]]
        };
        aggregate.push({
            $geoNear: geoNear
        });
        aggregate.push(
            {
                "$lookup": {
                    "from": "user_safety_JC_MATERIAL_INFO",
                    "localField": "_id",
                    "foreignField": "tag.REPERTORYID",
                    "as": "materials"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_BAS_DISTRICT",
                    "localField": "tag.DISTRICTCODE",
                    "foreignField": "_id",
                    "as": "districts"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_REP_LEVEL",
                    "localField": "tag.LEVELCODE_",
                    "foreignField": "id",
                    "as": "levels"
                }
            },
            {
                "$project": {
                    "materials": "$materials",
                    "districts": "$districts",
                    "levels": "$levels",
                    "orgname": "$tag.ORGNAME",
                    "name": "$tag.REPERTORYNAME",
                    "address": "$tag.ADDRESS",
                    "contact": "$tag.CONCATEPER",
                    "phone": "$tag.CONCATEMOBTEL",
                    "tel": "$tag.CONCATEOFFTEL",
                    "distance": "$distance",
                    "geom": "$geom"
                }
            }
        )
        var aggregateObj = {};
        aggregateObj.aggregate = aggregate;
        aggregateObj.query = opts.query||{};
        aggregateObj.searchId = 0;
        aggregateObj.dataSetId = "JC_REPERTORY";
        aggregateObj.queryIndex = 1;
        var aggregateList = [aggregateObj];
        this.aggregateMulti(aggregateList,function (err, data) {
            if(err==null){
                var list=data[0]['JC_REPERTORY'];
                cb&&cb.call(ctx,null,list)
            }else{
                cb&&cb.call(ctx,err);
            }
        },this)
    };
    /**
     * 根据物资需求获取储备库列表
     * @param opts
     * @param opts.point
     * @param opts.materialSet {Object} 必填
     * @param opts.materialSet[key] key为物资类型编码，value为物资需求
     * @param cb
     * @param ctx
     */
    Service.prototype.getNearbyReposity= function (opts, cb, ctx) {
        var point = opts.point;
        var aggregate = [];
        var geoNear = {
            limit: 1000000,
            maxDistance: 5000 * 1000,
            spherical: true,
            includeLocs: 'geom',
            distanceField: 'distance'
        };
        geoNear.near = {
            type: 'Point',
            coordinates: [point[0], point[1]]
        };
        aggregate.push({
            $geoNear: geoNear
        });
        aggregate.push(
            {
                "$lookup": {
                    "from": "user_safety_JC_MATERIAL_INFO",
                    "localField": "_id",
                    "foreignField": "tag.REPERTORYID",
                    "as": "materials"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_BAS_DISTRICT",
                    "localField": "tag.DISTRICTCODE",
                    "foreignField": "_id",
                    "as": "districts"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_REP_LEVEL",
                    "localField": "tag.LEVELCODE_",
                    "foreignField": "id",
                    "as": "levels"
                }
            },
            {
                "$project": {
                    "materials": "$materials",
                    "districts": "$districts",
                    "levels": "$levels",
                    "orgname": "$tag.ORGNAME",
                    "name": "$tag.REPERTORYNAME",
                    "address": "$tag.ADDRESS",
                    "contact": "$tag.CONCATEPER",
                    "phone": "$tag.CONCATEMOBTEL",
                    "tel": "$tag.CONCATEOFFTEL",
                    "distance": "$distance",
                    "geom": "$geom"
                }
            }
        )
        var aggregateObj = {};
        aggregateObj.aggregate = aggregate;
        aggregateObj.query = {};
        aggregateObj.searchId = 0;
        aggregateObj.dataSetId = "JC_REPERTORY";
        aggregateObj.queryIndex = 1;
        var aggregateList = [aggregateObj];
        aggregateList.push({
            aggregate: [
                {
                    $project: {
                        "name": "$tag.MATERIALTYPENAME",
                        "code": "$tag.MATERIALTYPECOE"
                    }
                }
            ],
            query: {},
            searchId: 1,
            dataSetId: 'JC_MATERIAL_TYPE'
        })
        this.aggregateMulti(aggregateList, function (err, data) {
            if (err == null) {
                var list = data[aggregateObj.searchId][aggregateObj.dataSetId];
                var dispatchResult = this._caculateDispatchAttachResult(opts.materialSet, list, {
                    attachKey: 'materials',
                    codeKey: 'MATERIALTYPE',
                    // nameKey: 'MATERIALNAME',
                    numKey: 'MATERIALNUM'
                });
                var list = dispatchResult.list;
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    var materials = item.materials;
                    delete item.materials;
                    var newList = [];
                    for (var j = 0; j < materials.length; j++) {
                        var materialObj = materials[j].tag;
                        newList.push({
                            name: materialObj.MATERIALNAME,
                            code: materialObj.MATERIALTYPE,
                            num: materialObj.MATERIALNUM,
                            unit: materialObj.MEASUREUNIT||
                            (this.materialSet[materialObj.MATERIALTYPE]?this.materialSet[materialObj.MATERIALTYPE].unit:'件')
                        })
                    }
                    item.material = newList;
                    item.x = item.geom.coordinates[0];
                    item.y = item.geom.coordinates[1];
                    item.district = '';
                    item.level = '';
                    if (item.districts && item.districts.length > 0) {
                        item.district = item.districts[0].tag.DISTRICTNAME;
                        delete item.districts;
                    }
                    if (item.levels && item.levels.length > 0) {
                        item.level = item.levels[0].tag.LEVELNAME;
                        delete item.levels;
                    }
                    delete item.geom;
                }
                //
                dispatchResult.typeList = data[1]['JC_MATERIAL_TYPE'];
                cb.call(ctx, null, dispatchResult);
            } else {
                cb && cb.call(ctx, err)
            }
        }, this);
    };
    /**
     * 提取调配，如关联形式，如储备库物资
     * @param needSet {Object} 需求对象
     * @param list
     * @param opts
     * @param opts.numKey
     * @param opts.attachKey {String} 附属集合的key
     * @param opts.codeKey {String} 类型字段的key，与needSet里对应
     * @param opts.nameKey {String} 类型名称字段key
     * @param opts.numKey {String} 数量的key
     * @private
     */
    Service.prototype._caculateDispatchAttachResult = function (needSet, list, opts) {
        var total = list.length,
            maxReposityCount = 0;
        var dispatchSet = {};
        for (var codeKey  in needSet) {
            var provideList = [];
            var needCount = needSet[codeKey];
            var fulfillCount = 0;
            for (var i = 0; i < total; i++) {
                var item = list[i];
                var provideItem = {
                    num: 0
                };
                for (var kk in item) {
                    if (kk == opts.attachKey) {
                        continue;
                    }
                    provideItem[kk] = item[kk];
                }
                var attachList = item[opts.attachKey];
                for (var j = 0; j < attachList.length; j++) {
                    var attachItem = attachList[j].tag;
                    if (!(attachItem[opts.codeKey] == codeKey)) {
                        continue;
                    }
                    var attachNum = attachItem[opts.numKey],
                        promiseCount = fulfillCount + attachNum;
                    if (!attachNum || isNaN(attachNum)) {
                        continue;
                    }
                    var addNum = 0;
                    if (promiseCount < needCount) {
                        addNum = attachNum;
                    } else {
                        addNum = needCount - fulfillCount;
                    }
                    fulfillCount += addNum;
                    provideItem.num += addNum;
                    if (fulfillCount >= needCount) {
                        break;
                    }
                }
                if(provideItem.num>0){
                    provideList.push(provideItem);
                }
                if (fulfillCount >= needCount) {
                    break;
                }
            }
            dispatchSet[codeKey] = provideList;
            maxReposityCount = Math.max(maxReposityCount, provideList.length);
        }
        return {
            dispatchSet: dispatchSet,
            list: list.slice(0, maxReposityCount)
        };
    };
  window.EMapServerV2 = window.EMapServerV2 || {};
  // 参考
  window.EMapServerV2.RescueHelpService = Service;
})(window);  