(function(window) {
    window.EMapServerV2 = window.EMapServerV2 || {};
    // 参考
    window.EMapServerV2.bufferService = {};
    var EID = 'safety'
    var CONSTS = {
        "EMPTY_STR": "-",
        "TEAM": "队伍",
        "EQUIPMENT": "装备",
        "CONTACT": "CONTACT",
        "CONTACT_LABEL": "负责人",
        "TEL": "TEL",
        "TEL_LABEL": "负责人电话",
        "BELONG_RESCUE": "所属救援队伍"
    }
    var util = {
        /**
         * 获取元数据
         * @param opts
         * @param opts
         * @param opts.server
         * @param opts.eId
         * @param opts.tableNames {Array}
         * @param cb
         * @param ctx
         */
        queryDataSet: function(opts, cb, ctx) {
            var query = {
                "dataSetId": {
                    "$in": opts.tableNames
                }
            };
            jQuery.ajax({
                url: opts.server + '/dataSet/query',
                type: 'post',
                data: {
                    eId: opts.eId,
                    query: JSON.stringify(query)
                },
                dataType: 'json',
                success: function(data) {
                    if (data.success) {
                        cb && cb.call(ctx, null, data.data);
                    } else {
                        cb && cb.call(ctx, new Error(data.msg))
                    }
                },
                error: function(xhr, msg, err) {
                    cb && cb.call(ctx, new Error(err))
                }
            });

        },
        /**
         * @param opts
         * @param opts.server
         * @param opts.eId
         * @param opts.data
         * @param cb
         * @param ctx
         */
        aggregateMulti: function(opts, cb, ctx) {
            jQuery.ajax({
                url: opts.server + '/dataStatics/aggregateMulti',
                type: 'post',
                data: {
                    eId: opts.eId,
                    data: JSON.stringify(opts.data)
                },
                dataType: 'json',
                success: function(data) {
                    if (data.success) {
                        cb && cb.call(ctx, null, data.data);
                    } else {
                        cb && cb.call(ctx, new Error(data.msg))
                    }
                },
                error: function(xhr, msg, err) {
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
        queryMulti: function(opts, cb, ctx) {
            jQuery.ajax({
                url: opts.server + '/dataOperate/queryMulti',
                type: 'post',
                data: {
                    eId: opts.eId,
                    data: JSON.stringify(opts.data)
                },
                dataType: 'json',
                success: function(data) {
                    if (data.success) {
                        cb && cb.call(ctx, null, data.data);
                    } else {
                        cb && cb.call(ctx, new Error(data.msg))
                    }
                },
                error: function(xhr, msg, err) {
                    cb && cb.call(ctx, new Error(err))
                }
            })
        },
        //计算经纬度距离
        caculateDistancePoints: function(pt1, pt2) {
            var R = 6378137,
                rad = Math.PI / 180,
                lat1 = pt1[1] * rad,
                lat2 = pt2[1] * rad,
                a = Math.sin(lat1) * Math.sin(lat2) +
                Math.cos(lat1) * Math.cos(lat2) * Math.cos((pt2[0] - pt1[0]) * rad);
            return R * Math.acos(Math.min(a, 1));
        },
        //计算距离
        caculateDistance: function(point, geojson) {
            var geom = g2.sfs.GeometryFactory.createGeometryFromGeoJson(geojson);
            geom.spatialReference = 4326;
            var point2d = util.projectService.transform(
                new g2.sfs.Point({
                    x: point[0],
                    y: point[1],
                    spatialReference: 4326
                }), 3857);
            var geom2d = util.projectService.transform(geom, 3857);
            var jtsPoint = util.geoJsonReader.read(point2d.asGeoJson())
            var jtsGeom = util.geoJsonReader.read(geom2d.asGeoJson())
            return jtsPoint.distance(jtsGeom)
        },
        isObject: function(obj) {
            return Object.prototype.toString.call(obj) == '[object Object]'
        },
        isString: function(obj) {
            return Object.prototype.toString.call(obj) == '[object String]'
        },
        //处理空值
        handleEmptyValue: function(obj) {
            if (obj) {
                for (var attrName in obj) {
                    var attrVal = obj[attrName];
                    obj[attrName] = util.isEmptyValue(attrVal) ? CONSTS.EMPTY_STR : attrVal;
                }
            }
        },
        //是否为空
        isEmptyValue: function(value) {
            return value == null ||
                value == undefined ||
                value == "" ||
                value == " ";
        },
        /**
         * 提取关联项字段
         * @param showField
         * @param data
         */
        extractDictShowField: function(localField, showField, data) {
            if (data[localField]) {
                if (util.isObject(showField)) {
                    var tag = data[localField].tag;
                    delete data[localField];
                    for (var k in showField) {
                        if (k == '//') {
                            continue;
                        }
                        data[showField[k]] = util.isEmptyValue(tag[k]) ? CONSTS.EMPTY_STR : tag[k];
                    }
                } else {
                    data[localField] =
                        data[localField].tag[showField];
                }
            }
        },
        /**
         * 处理联系人电话
         * @param type
         * @param data
         */
        handleContactTel: function(type, data) {
            if (type === CONSTS.EQUIPMENT || type === CONSTS.TEAM) {
                var count = 4,
                    i = 1,
                    n = 0;
                for (; i <= count; i++) {
                    if (n == 2) {
                        break;
                    }
                    if (data.hasOwnProperty('C' + i) &&
                        data['C' + i] != CONSTS.EMPTY_STR) {
                        data[CONSTS.CONTACT] = data['C' + i];
                        n++;
                    }
                    if (data.hasOwnProperty('T' + i) &&
                        data['T' + i] != CONSTS.EMPTY_STR) {
                        data[CONSTS.TEL] = data['T' + i];
                        n++;
                    }
                }
                if (n < 2) {
                    data[CONSTS.CONTACT] = data[CONSTS.CONTACT] || CONSTS.EMPTY_STR;
                    data[CONSTS.TEL] = data[CONSTS.TEL] || CONSTS.EMPTY_STR;
                }
            }
        },
        //关键字过滤
        filterByKw: function(kw, data, kwFields) {
            if (kw) {
                var flag = false;
                for (var i = 0; i < kwFields.length; i++) {
                    var kwField = kwFields[i];
                    if (util.isObject(kwField.relShowField)) {
                        for (var relField in kwField.relShowField) {
                            var fieldName = kwField.relShowField[relField];
                            if (data[fieldName] && (data[fieldName] + '').indexOf(kw) >= 0) {
                                flag = true;
                                break;
                            }
                        }
                        if (flag) {
                            break;
                        }
                    } else {
                        var fieldName = kwField.mapName || kwField.name;
                        if (data[fieldName] && (data[fieldName] + '').indexOf(kw) >= 0) {
                            flag = true;
                            break;
                        }
                    }
                }
                return flag;
            } else {
                return true;
            }
        }
    };
    util.projectService = new g2.sfs.CoordinateTransform();
    util.geoJsonReader = new jsts.io.GeoJSONReader();
    //
    /**
     *
     * @param opts
     * @param opts.server
     * @param opts.resourceConfig
     */
    window.EMapServerV2.bufferService = function(opts) {
        this.options = {
            server: opts.server,
            eId: EID,
            resourceConfig: jQuery.extend(true, {}, opts.resourceConfig)
        }
        this.initialize();
    };

    /**
     * 初始化
     * @param cb
     * @param ctx
     */
    window.EMapServerV2.bufferService.prototype.initialize = function() {
        var resources = this.options.resourceConfig.resources;
        var tableNames = [];
        for (var i = 0; i < resources.length; i++) {
            var resourceObj = resources[i];
            resourceObj.tableIdSet = {};
            var resourceTables = resourceObj.tables;
            for (var j = 0; j < resourceTables.length; j++) {
                var tableObj = resourceTables[j];
                tableNames.push(tableObj.name)
                    //
                resourceObj.tableIdSet[tableObj.name] = true;
                //
                var listFields = tableObj.list;
                var kwFields = [];
                var listFieldMap = {};
                var listRelations = [];
                for (var k = 0; k < listFields.length; k++) {
                    var fieldObj = listFields[k];
                    if (fieldObj.match) {
                        kwFields.push(listFields[k]);
                    }
                    if (fieldObj.mapName) {
                        listFieldMap[fieldObj.name] = fieldObj.mapName;
                    }
                    //关联
                    if (fieldObj.relShowField) {
                        listRelations.push({
                            localField: fieldObj.name,
                            showField: fieldObj.relShowField
                        })
                    }
                }
                //
                var detailFields = tableObj.detail;
                var detailFieldMap = {};
                var detailRelations = [];
                for (var k = 0; k < detailFields.length; k++) {
                    var fieldObj = detailFields[k];
                    if (fieldObj.mapName) {
                        detailFieldMap[fieldObj.name] = fieldObj.mapName;
                    }
                    //关联
                    if (fieldObj.relShowField) {
                        detailRelations.push({
                            localField: fieldObj.name,
                            showField: fieldObj.relShowField
                        })
                    }
                }
                //
                var relateTables = tableObj.relateTables || [];
                for (var k = 0; k < relateTables.length; k++) {
                    var relateTable = relateTables[k];
                    var fields = relateTable.fields || [];
                    var relateFieldMap = {};
                    var relateRelations = [];
                    for (var kk = 0; kk < fields.length; kk++) {
                        var fieldObj = fields[kk];
                        if (fieldObj.mapName) {
                            relateFieldMap[fieldObj.name] = fieldObj.mapName;
                        }
                        //关联
                        if (fieldObj.relShowField) {
                            relateRelations.push({
                                localField: fieldObj.name,
                                showField: fieldObj.relShowField
                            })
                        }
                    }
                    relateTable.fieldMap = relateFieldMap;
                    relateTable.relations = relateRelations;
                }
                //
                tableObj.listFieldMap = listFieldMap;
                tableObj.listKw = kwFields;
                tableObj.listRelations = listRelations;
                tableObj.detailFieldMap = detailFieldMap;
                tableObj.detailRelations = detailRelations;
            }
        }
    }

    /**
     * 缓冲查或者范围查询
     * @param opts
     * @param opts.point {Array} 事发地点经纬度坐标 [x,y]
     * @param opts.radius　{Number} 缓冲距离，单位公里，与geometry互斥
     * @param opts.geometry　{Number} 查询多边形，优先于radius
     * @param opts.distanceField {String} 距离属性名
     * @param opts.keyword　{String} 模糊匹配
     * @param opts.resources {Array} 资源数组
     * @param cb
     * @param ctx
     */
    window.EMapServerV2.bufferService.prototype.bufferOrPolygonQuery = function(opts, cb, ctx) {
        var polygon = null;
        if (opts.geometry) {
            if (util.isString(opts.geometry)) {
                var jtsGeom = G.utils.GeometryUtil.getWktReader().read(opts.geometry);
                polygon = G.utils.GeometryUtil.getGeoJSONWriter().write(jtsGeom);
            } else {
                polygon = opts.geometry;
            }
        } else {
            var projService = new g2.sfs.CoordinateTransform();
            var pointGeom = new g2.sfs.Point({
                x: opts.point[0],
                y: opts.point[1],
                spatialReference: 4326
            })
            var pointGeom3857 = projService.transform(pointGeom, 3857);
            polygon = G.utils.SpatialOPUtil.getBuffer({
                geometry: {
                    type: "Point",
                    coordinates: [pointGeom3857.x, pointGeom3857.y]
                },
                radius: opts.radius * 1000,
                spatialReference: 3857
            });
            var polygonGeom = g2.sfs.GeometryFactory.createGeometryFromGeoJson(polygon);
            polygonGeom.spatialReference = 3857;
            polygon = projService.transform(polygonGeom, 4326).asGeoJson();
        }
        return this._query({
            geometry: polygon,
            point: opts.point,
            distanceField: opts.distanceField,
            keyword: opts.keyword,
            resources: opts.resources
        }, cb, ctx);
    }

    /**
     * 查询行政区划内的数据，并计算到指定点距离，由近到远排序
     * @param opts
     * @param opts.point {Array} 事发地点经纬度坐标 [x,y]
     * @param opts.districtCode　{String} 行政区划编码
     * @param opts.distanceField {String} 距离属性名
     * @param opts.keyword　{String} 模糊匹配
     * @param opts.resources {Array} 资源数组
     * @param opts.resources[i].tables {Array} 查询的条件
     * @param opts.resources[i].tables[j].table {String} 查询的表
     * @param opts.resources[i].tables[j].query {Object} 查询条件
     * @param cb
     * @param ctx
     */
    window.EMapServerV2.bufferService.prototype.districtQuery = function(opts, cb, ctx) {
            var queryCol = {},
                queryItem = {},
                districtCodes = opts.districtCode.split(',');
            for (var i = 0; i < districtCodes.length; i++) {
                var districtCode = districtCodes[i];
                var districtTable = "province0.01";
                if (districtCode.endsWith('0000')) {
                    districtTable = 'province0.01';
                } else if (districtCode.endsWith('00')) {
                    districtTable = 'city0.03';
                } else {
                    districtTable = 'county0.06';
                }
                if (queryCol.hasOwnProperty(districtTable)) {
                    queryItem.query['$or'].push({
                        "tag.adcode": districtCode
                    });
                } else {
                    queryItem.query = {
                        "$or": [{
                            "tag.adcode": districtCode
                        }]
                    }
                    queryCol[districtTable] = queryItem;
                }
            }
            util.queryMulti({
                server: this.options.server,
                eId: 'siptea',
                data: queryCol
            }, function(err, data) {
                if (err == null) {
                    var geojsonList = [];
                    for (var table in data) {
                        var list = data[table];
                        for (var i = 0; i < list.length; i++) {
                            if (list[i] && list[i].geom) {
                                geojsonList.push(list[i].geom);
                            }
                        }
                    }
                    var geometry = null;
                    if (geojsonList.length > 1) {
                        var tempCoordinates = [];
                        console.debug(JSON.stringify(geojsonList, null, 4))
                        for (var k = 0; k < geojsonList.length; k++) {
                            var geoJsonItem = geojsonList[k];
                            if (geoJsonItem.type === 'MultiPolygon') {
                                for (var kk = 0; kk < geoJsonItem.coordinates.length; kk++) {
                                    tempCoordinates.push(geoJsonItem.coordinates[kk]);
                                }
                            } else {
                                tempCoordinates.push(geoJsonItem.coordinates);
                            }
                        }
                        geometry = {
                            type: 'MultiPolygon',
                            coordinates: tempCoordinates
                        };
                    } else {
                        geometry = geojsonList[0];
                    }
                    this._query({
                        geometry: geometry,
                        point: opts.point,
                        distanceField: opts.distanceField,
                        keyword: opts.keyword,
                        resources: opts.resources
                    }, cb, ctx);
                } else {
                    cb && cb.call(ctx, err)
                }
            }, this)
        }
        /**
         * 查询范围内的数据，并计算到指定点距离，由近到远排序
         * @param opts
         * @param opts.tableName　{String} 表名
         * @param opts.dataId {String} 数据id
         * @param cb
         * @param ctx
         */
    window.EMapServerV2.bufferService.prototype.queryDetail = function(opts, cb, ctx) {
            var tableObj = null;
            var resources = this.options.resourceConfig.resources;
            var thisResourceObj = null;
            for (var i = 0; i < resources.length; i++) {
                var resourceObj = resources[i];
                for (var j = 0; j < resourceObj.tables.length; j++) {
                    var thisTable = resourceObj.tables[j];
                    if (thisTable.name === opts.tableName) {
                        tableObj = thisTable;
                        thisResourceObj = resourceObj;
                        break;
                    }
                }
            }
            if (tableObj == null) {
                cb && cb.call(ctx, new Error('表不存在！'))
                return;
            }
            var queryCol = {},
                relationTableNames = [];
            //关联数据
            var relationTables = tableObj.relateTables || [];
            for (var r = 0; r < relationTables.length; r++) {
                var relation = relationTables[r];
                var qItem = {};
                var fields = relation.fields || [];
                if (fields.length > 0) {
                    var select = {
                        _id: true,
                        geom: true
                    };
                    for (var s = 0; s < fields.length; s++) {
                        select['tag.' + fields[s].name] = true;
                    }
                    qItem = this._makeQuery(relation.relations, relation.fieldMap, fields);
                    qItem.select = Object.keys(select).join(' ');
                } else {
                    qItem.select = '';
                }
                qItem.query = {};
                qItem.query['tag.' + relation.relField] = opts.dataId;
                queryCol[relation.table] = qItem;
                relationTableNames.push(relation.table)
            }
            this._getTableMeta(
                [tableObj.name].concat(relationTableNames),
                function(err, tableMetaSet) {
                    if (err == null) {
                        //
                        var relations = tableObj.listRelations,
                            fieldMap = tableObj.fieldMap;
                        var queryItem = this._makeQuery(relations, fieldMap, tableObj.detail);
                        queryItem.query = {
                                '_id': opts.dataId
                            }
                            //救援队跟储备库的关联装备查询 add by lsl
                        if (opts.equConfig) {
                            for (var key in queryCol) {
                                opts.equConfig[tableObj.name] = queryItem;
                                queryCol = opts.equConfig;
                            }
                        } else {
                            queryCol[tableObj.name] = queryItem;
                        }
                        //查询
                        util.queryMulti({
                            server: this.options.server,
                            eId: this.options.eId,
                            data: queryCol
                        }, function(err, dataSet) {
                            if (err == null) {
                                var dataList = dataSet[tableObj.name];
                                if (dataList && dataList.length == 1) {
                                    var tableMeta = tableMetaSet[tableObj.name];
                                    var dataItem = dataList[0],
                                        attrObj = dataItem.tag;
                                    var metaFields = tableMeta.model,
                                        detailFields = tableObj.detail;
                                    var fieldMap = tableObj.detailFieldMap || {};
                                    var attributes = [],
                                        result = {
                                            id: dataItem._id,
                                            attributes: attributes
                                        };
                                    for (var i = 0; i < detailFields.length; i++) {
                                        var fieldObj = detailFields[i];
                                        if (util.isObject(fieldObj.relShowField)) {
                                            var relObj = {};
                                            relObj[fieldObj.name] = dataItem['tag'][fieldObj.name];
                                            util.extractDictShowField(fieldObj.name, fieldObj.relShowField, relObj);
                                            util.handleContactTel(thisResourceObj.name, relObj);
                                            for (var kk in fieldObj.relShowField) {
                                                var kkVv = fieldObj.relShowField[kk];
                                                if (kk == '//' || /^C\d$/.test(kkVv) || /^T\d$/.test(kkVv)) {
                                                    continue;
                                                }
                                                var attribute = {};
                                                attribute.name = kkVv;
                                                attribute.label = kkVv === "RESCUENAME" ? CONSTS.BELONG_RESCUE : "";
                                                attribute.value = relObj[attribute.name];
                                                attributes.push(attribute);
                                            }
                                            if (thisResourceObj.name === CONSTS.EQUIPMENT) { //装备
                                                var attribute1 = {};
                                                attribute1.name = CONSTS.CONTACT;
                                                attribute1.label = CONSTS.CONTACT_LABEL;
                                                attribute1.value = relObj[CONSTS.CONTACT];
                                                attributes.push(attribute1);
                                                var attribute2 = {};
                                                attribute2.name = CONSTS.TEL;
                                                attribute2.label = CONSTS.TEL_LABEL;
                                                attribute2.value = relObj[CONSTS.TEL];
                                                attributes.push(attribute2);
                                            }
                                        } else {
                                            var itemObj = {};
                                            itemObj.name = fieldObj.name;
                                            itemObj.label = "";
                                            itemObj.value = attrObj[fieldObj.name];
                                            itemObj.value = util.isEmptyValue(itemObj.value) ? CONSTS.EMPTY_STR : itemObj.value;
                                            if (fieldObj.relShowField) {
                                                if (util.isObject(itemObj.value)) {
                                                    itemObj.value = attrObj[fieldObj.name].tag[fieldObj.relShowField]
                                                } else {
                                                    itemObj.value = CONSTS.EMPTY_STR;
                                                }
                                            }
                                            if (fieldMap.hasOwnProperty(itemObj.name)) {
                                                itemObj.name = fieldMap[itemObj.name]
                                            }
                                            if (fieldObj.label) {
                                                itemObj.label = fieldObj.label;
                                            } else {
                                                for (var j = 0; j < metaFields.length; j++) {
                                                    var metaField = metaFields[j];
                                                    if (metaField.fieldName === fieldObj.name) {
                                                        itemObj.label = metaField.fieldDesc;
                                                        break;
                                                    }
                                                }
                                            }
                                            attributes.push(itemObj)
                                        }
                                    }
                                    if (opts.equConfig) {
                                        result.equTable = {};
                                        for (var key in dataSet) {
                                            if (dataSet[key].length > 0 &&
                                                key != "EQUIP_TEA_RESCUE"
                                                // &&key!="JC_FIRETEAMSTA"
                                            ) {
                                                result.equTable[key] = dataSet[key];
                                            }
                                        }
                                        cb && cb.call(ctx, null, result);
                                    } else {
                                        //relations
                                        for (var r = 0; r < relationTables.length; r++) {
                                            var relationObj = relationTables[r];
                                            var relationData = dataSet[relationObj.table];
                                            var metaFields = tableMetaSet[relationObj.table].model,
                                                metaFieldsLen = metaFields.length,
                                                fields = relationObj.fields || [],
                                                fieldsLen = fields.length,
                                                fieldMap = relationObj.fieldMap,
                                                relations = relationObj.relations;
                                            for (var kk = 0; kk < relationData.length; kk++) {
                                                var dataItem = relationData[kk];
                                                var attributes = [],
                                                    dataObj = {
                                                        attributes: attributes
                                                    };
                                                dataObj.id = dataItem._id;
                                                dataObj.geom = dataItem.geom;
                                                for (var kkk = 0; kkk < metaFieldsLen; kkk++) {
                                                    var metaField = metaFields[kkk];
                                                    var fieldObj = {};
                                                    for (var k4 = 0; k4 < fieldsLen; k4++) {
                                                        if (fields[k4].name === metaField.fieldName) {
                                                            fieldObj = fields[k4];
                                                            break;
                                                        }
                                                    }
                                                    if (dataItem.tag.hasOwnProperty(metaField.fieldName)) {
                                                        var attribute = {};
                                                        attribute.name = metaField.fieldName;
                                                        attribute.value = dataItem.tag[metaField.fieldName];
                                                        attributes.push(attribute);
                                                        //
                                                        if (fieldObj.relShowField) {
                                                            if (dataItem.tag[fieldObj.name]) { //党未查询到
                                                                attribute.value = dataItem.tag[fieldObj.name].tag[fieldObj.relShowField]
                                                            } else {
                                                                attribute.value = "";
                                                            }
                                                        }
                                                        if (fieldMap.hasOwnProperty(itemObj.name)) {
                                                            attribute.name = fieldMap[attribute.name]
                                                        }
                                                        if (fieldObj.label) {
                                                            attribute.label = fieldObj.label;
                                                        } else {
                                                            attribute.label = metaField.fieldDesc;
                                                        }
                                                    }
                                                }
                                                relationData[kk] = dataObj;
                                            }
                                            result[relationObj.as || relationObj.table] = relationData;
                                        }
                                        cb && cb.call(ctx, null, result);
                                    }
                                } else {
                                    cb && cb.call(ctx, new Error('查询失败！'));
                                }
                            } else {
                                cb && cb.call(ctx, err)
                            }
                        }, this)
                    } else {
                        cb && cb.call(ctx, err)
                    }
                }, this)
        }
        /**
         * 查询装备的详情框
         * @param opts 查询参数
         * @opts.param：参数集
         * @param cb：回调函数
         * @param ctx
         */
    window.EMapServerV2.bufferService.prototype.queryEquDetail = function(opts, cb, ctx) {
            //查询
            util.queryMulti({
                server: this.options.server,
                eId: this.options.eId,
                data: opts
            }, function(err, dataSet) {
                if (err == null) {
                    for (var key in dataSet) {
                        var dataList = dataSet[key];
                        if (dataList && dataList.length == 1) {
                            cb && cb.call(ctx, null, dataList);
                        } else {
                            cb && cb.call(ctx, new Error('查询失败！'));
                        }
                    }
                } else {
                    cb && cb.call(ctx, err)
                }
            }, this)
        }
        /**
         * 获取分类列表
         * @param opts
         * @param opts.resources {Array} 资源序号数组
         * @param cb
         * @param ctx
         */
    window.EMapServerV2.bufferService.prototype.getTypeList = function(opts, cb, ctx) {
        // var dataParam={};
        // dataParam.EQUIP_EQU_TYPE={};
        // dataParam.EQUIP_EQU_TYPE.query={"tag.PARENTCODE":"0"};
        // dataParam.EQUIP_EQU_TYPE.select="_id tag.EQUIPTYPECODE tag.EQUIPTYPENAME tag.PARENTCODE tag.SHORTNAME";
        // dataParam.EQUIP_EQU_TYPE.sort="tag.ORDERBY";
        // util.queryMulti({
        //     server: this.options.server,
        //     eId: this.options.eId,
        //     data:dataParam
        // }, function (err, data) {
        //     for(var i=0;i<data.length;i++){
        //         let eleData=data[i];
        //         resourceTypes[i] = {
        //             label: eleData.tag.EQUIPTYPENAME,
        //             field: null,
        //             value: eleData.tag.SHORTNAME,
        //             id:eleData.tag.EQUIPTYPECODE,
        //             pId:eleData.tag.PARENTCODE
        //         };
        //     }
        // })

        var configResources = this.options.resourceConfig.resources,
            resourceCount = opts.resources.length;
        var resultSet = [];
        if (opts.resources.length == 0) {
            cb && cb.call(ctx, null, resultSet);
            return;
        }
        var tempSet = {};
        for (var i = 0; i < resourceCount; i++) {
            var resourceIndex = opts.resources[i],
                index = parseInt(resourceIndex) - 1;
            var resourceObj = configResources[index];
            if (!resourceObj) {
                continue;
            }
            /*
            /此处处理装备的字典查询
             */
            var tables = resourceObj.tables;
            var resourceTypes = new Array(tables.length);
            if (resourceObj.classification && resourceObj.classification.type == "dict") {
                tempSet[i + '_0'] = {};
                tempSet[i + '_0'].classification = resourceObj.classification;
            } else {
                for (var j = 0; j < tables.length; j++) {
                    var table = tables[j];
                    var classification = table.classification || {};
                    if (classification.type == 'dict') {
                        resourceTypes[j] = {};
                        tempSet[i + '_' + j] = table;
                    } else {
                        resourceTypes[j] = {
                            label: table.label || table.name,
                            table: table.name,
                            field: null,
                            value: null,
                            id: G.utils.CommonUtil.newUUID(),
                            pId: '0'
                        };
                    }
                }
                resultSet.push(resourceTypes);
            }
        }
        if (Object.keys(tempSet).length == 0) {
            cb && cb.call(ctx, null, resultSet);
            return;
        }
        var queryCol = {};
        for (var idx in tempSet) {
            var tempObj = tempSet[idx],
                classification = tempObj.classification;
            var queryItem = {};
            if (classification.pId) {
                queryItem.select = ['_id', 'tag.' + classification.showField, 'tag.' + classification.pId].join(' ');
            } else {
                queryItem.select = ['_id', 'tag.' + classification.showField].join(' ');
            }
            queryItem.query = classification.query || {};
            if (classification.sortField) {
                var sort = classification.sortDirection === 'DESC' ? '-' : '';
                queryItem.sort = sort + 'tag.' + classification.sortField;
            }
            queryCol[classification.dictTable] = queryItem;
        }

        util.queryMulti({
            server: this.options.server,
            eId: this.options.eId,
            data: queryCol
        }, function(err, data) {
            if (err == null) {
                for (var idx in tempSet) {
                    var tempObj = tempSet[idx],
                        classification = tempObj.classification;
                    var dataList = data[classification.dictTable];
                    var list = [];
                    for (var k = 0; k < dataList.length; k++) {
                        var dataItem = dataList[k];
                        var dataObj = {};
                        dataObj.label = dataItem.tag[classification.showField];
                        dataObj.value = dataItem._id;
                        dataObj.table = tempObj.name;
                        dataObj.field = classification.localField;
                        dataObj.id = G.utils.CommonUtil.newUUID();
                        if (classification.pId) {
                            dataObj.pId = dataItem.tag[classification.pId];;
                        } else {
                            dataObj.pId = '0';
                        }
                        list.push(dataObj);
                    }
                    var idxArr = idx.split('_');
                    if (resultSet[idxArr[0]]) {
                        resultSet[idxArr[0]][idxArr[1]] = list;
                    } else {
                        resultSet[idxArr[0]] = list;
                    }

                }
                for (var m = 0; m < resultSet.length; m++) {
                    var resultItem = resultSet[m];
                    var list = [];
                    for (var n = 0; n < resultItem.length; n++) {
                        list = list.concat(resultItem[n])
                    }
                    resultSet[m] = list;
                }
                cb && cb.call(ctx, null, resultSet)
            } else {
                cb && cb.call(ctx, err);
            }
        }, this)
    }


    /**
     *
     * @param opts.point {Array} 事发地点经纬度坐标 [x,y]
     * @param opts.geometry　{GeoJson} 筛选范围
     * @param opts.caculateDistance {Boolean} 是否计算距离并排序
     * @param opts.distanceField {String} 距离属性名
     * @param opts.keyword　{String} 模糊匹配
     * @param opts.resources　{Array} 资源id
     * @param cb
     * @param ctx
     * @private
     */
    window.EMapServerV2.bufferService.prototype._query = function(opts, cb, ctx) {
            var resourcesOpt = jQuery.extend(true, {}, opts.resources);
            var queryCol = {};
            var distanceField = opts.distanceField || 'dis';
            var keyword = opts.keyword ? (opts.keyword + '').trim() : '';
            var resourceConfig = jQuery.extend(true, {}, this.options.resourceConfig.resources);
            var queryResurces = [];
            for (var resourceId in resourcesOpt) {
                var resourceIndex = parseInt(resourceId) - 1;
                var resourceObj = resourceConfig[resourceIndex];
                if (!resourceObj) {
                    continue;
                }
                var resourceQueryTables = resourcesOpt[resourceId] || [],
                    queryAllTable = resourceQueryTables.length == 0;
                //处理每类数据的筛选条件
                var resourceQueryTableSet = {};
                for (var i = 0; i < resourceQueryTables.length; i++) {
                    var queryTable = resourceQueryTables[i];
                    var tableQueryObj = resourceQueryTableSet[queryTable.table];
                    if (tableQueryObj) {
                        if (queryTable.field) {
                            tableQueryObj['tag.' + queryTable.field]["$in"].push(queryTable.value)
                        }
                    } else {
                        tableQueryObj = {};
                        if (queryTable.field) {
                            tableQueryObj['tag.' + queryTable.field] = {
                                "$in": [queryTable.value]
                            }
                        }
                        resourceQueryTableSet[queryTable.table] = tableQueryObj;
                    }
                }
                var filteredQueryTable = [];
                for (var j = 0; j < resourceObj.tables.length; j++) {
                    var tableObj = resourceObj.tables[j];
                    if (!(queryAllTable ||
                            resourceQueryTableSet.hasOwnProperty(tableObj.name))) {
                        continue;
                    }
                    var andList = [];
                    if (resourceQueryTableSet.hasOwnProperty(tableObj.name) &&
                        Object.keys(resourceQueryTableSet[tableObj.name]).length > 0) {
                        andList.push(resourceQueryTableSet[tableObj.name]);
                    }
                    if (opts.geometry) {
                        andList.push({
                            "geom": {
                                "$geoIntersects": {
                                    "$geometry": opts.geometry
                                }
                            }
                        })
                    }
                    //模糊匹配
                    var shouldFilterOnServer = this._kwFilterOnServer(tableObj.list);
                    tableObj.shouldFilterOnServer = shouldFilterOnServer;
                    if (opts.keyword && shouldFilterOnServer) {
                        var kwFields = tableObj.listKw;
                        var orList = [];
                        for (var j1 = 0; j1 < kwFields.length; j1++) {
                            var or = {};
                            or["tag." + kwFields[j1].name] = {
                                $regex: "^.*" + keyword + ".*$"
                            };
                            orList.push(or);
                        }
                        andList.push({
                            "$or": orList
                        });
                    }
                    var relations = tableObj.listRelations,
                        fieldMap = tableObj.fieldMap;
                    var queryItem = this._makeQuery(relations, fieldMap, tableObj.list);
                    queryItem.query = {
                        "$and": andList
                    }
                    queryCol[tableObj.name] = queryItem;
                    //
                    filteredQueryTable.push(tableObj)
                }
                //
                if (!queryAllTable) {
                    resourceObj.tables = filteredQueryTable;
                }
                queryResurces.push(resourceObj);
            }
            console.debug('> 查询的表名：' + JSON.stringify(Object.keys(queryCol)));
            util.queryMulti({
                server: this.options.server,
                eId: this.options.eId,
                data: queryCol
            }, function(err, dataSet) {
                if (err == null) {
                    var resultSet = {},
                        caculateDistance = opts.caculateDistance;
                    for (var i = 0; i < queryResurces.length; i++) {
                        var resourceObj = queryResurces[i];
                        var resourceDataList = [];
                        for (var j = 0; j < resourceObj.tables.length; j++) {
                            var tableObj = resourceObj.tables[j],
                                relations = tableObj.listRelations,
                                relationsLen = relations.length,
                                fieldMap = tableObj.listFieldMap || {},
                                shouldMap = Object.keys(fieldMap).length > 0;
                            var dataList = dataSet[tableObj.name],
                                dataTempList = [];
                            for (var k = 0, dataCount = dataList.length; k < dataCount; k++) {
                                var dataItem = dataList[k],
                                    attrObj = dataItem.tag;
                                var tempItem = attrObj;
                                tempItem.id = dataItem._id;
                                if (relationsLen > 0) {
                                    for (var rIdx = 0; rIdx < relationsLen; rIdx++) {
                                        var relationObj = relations[rIdx];
                                        if (tempItem[relationObj.localField]) {
                                            tempItem[relationObj.localField + '_'] = tempItem[relationObj.localField]._id;
                                            util.extractDictShowField(relationObj.localField, relationObj.showField, tempItem);
                                        }
                                    }
                                }
                                if (shouldMap) {
                                    for (var mapField in fieldMap) {
                                        tempItem[fieldMap[mapField]] = tempItem[mapField]
                                        delete tempItem[mapField]
                                    }
                                }
                                //关键字过滤
                                if (!(tableObj.shouldFilterOnServer || util.filterByKw(opts.keyword, tempItem, tableObj.listKw))) {
                                    continue;
                                }
                                if (dataItem.geom) {
                                    tempItem['longitude'] = dataItem.geom.coordinates[0]
                                    tempItem['latitude'] = dataItem.geom.coordinates[1]
                                    if (caculateDistance !== false) {
                                        tempItem[distanceField] = util.caculateDistance(opts.point, dataItem.geom)
                                    }
                                }
                                tempItem.table_name = tableObj.name;
                                tempItem.table_label = tableObj.label;
                                //替换空值
                                util.handleEmptyValue(tempItem)
                                util.handleContactTel(resourceObj.name, tempItem);
                                dataTempList.push(tempItem);
                            }
                            resourceDataList = resourceDataList.concat(dataTempList);
                        }
                        resourceDataList.sort(function(a, b) {
                            return a[distanceField] - b[distanceField];
                        })
                        resultSet[resourceObj.name] = resourceDataList;
                    }
                    cb && cb.call(ctx, null, resultSet);
                } else {
                    cb && cb.call(ctx, err)
                }
            }, this)
        }
        /**
         *
         * @param relations
         * @param fieldMap
         * @param fieldList
         * @return {{}}
         * @private
         */
    window.EMapServerV2.bufferService.prototype._makeQuery = function(relations, fieldMap, fieldList) {
            var queryItem = {};
            fieldMap = fieldMap || {};
            var populate = [],
                select = {
                    _id: true,
                    geom: true
                }
            if (relations.length > 0) {
                for (var kk = 0; kk < relations.length; kk++) {
                    var relationObj = relations[kk];
                    select[relationObj.localField] = true;
                    for (var fieldAlias in fieldMap) {
                        select["tag." + fieldMap[fieldAlias]] = true;
                        if (fieldMap[fieldAlias] == relationObj.localField) {
                            relationObj.alias = fieldAlias;
                            break;
                        }
                    }
                    select["tag." + relationObj.localField] = true;
                    populate.push(["tag." + relationObj.localField])
                }
                queryItem.populate = populate;
            }
            for (var j2 = 0; j2 < fieldList.length; j2++) {
                select["tag." + fieldList[j2].name] = true;
            }
            queryItem.select = Object.keys(select).join(' ');
            return queryItem;
        }
        /**
         *
         * @param dataSetIds
         * @param cb
         * @param ctx
         * @private
         */
    window.EMapServerV2.bufferService.prototype._getTableMeta = function(dataSetIds, cb, ctx) {
        this.dataSetCache = this.dataSetCache || {};
        var dataSetIds2Query = [];
        var resultSet = {};
        for (var i = 0; i < dataSetIds.length; i++) {
            var dataSetId = dataSetIds[i];
            if (this.dataSetCache[dataSetId]) {
                resultSet[dataSetId] = this.dataSetCache[dataSetId]
            } else {
                dataSetIds2Query.push(dataSetId)
            }
        }
        if (dataSetIds2Query.length == 0) {
            cb && cb.call(ctx, null, resultSet)
        } else {
            util.queryDataSet({
                server: this.options.server,
                eId: this.options.eId,
                tableNames: dataSetIds2Query
            }, function(err, data) {
                if (err == null) {
                    if (data.result && data.result.length > 0) {
                        for (var j = 0; j < data.result.length; j++) {
                            resultSet[data.result[j].dataSetId] = data.result[j]
                        }
                        cb && cb.call(ctx, null, resultSet)
                    } else {
                        cb && cb.call(ctx, new Error('查询元数据失败！'));
                    }
                } else {
                    cb && cb.call(ctx, err)
                }
            }, this)
        }
    }

    /**
     * 是否服务端关键子过滤，对于装备（因为关联救援队伍的名称）类型前端过滤
     * @param fieldList
     * @private
     */
    window.EMapServerV2.bufferService.prototype._kwFilterOnServer = function(fieldList) {
        var flag = true;
        for (var i = 0; i < fieldList.length; i++) {
            if (util.isObject(fieldList[i].relShowField)) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    /****
     * 行政区划统计
     * @param opts
     * @param opts.table 表名
     * @param opts.districtField 行政区划字段名
     * @param opts.districtCode 行政区划编码
     * @param opts.useCache 使用缓存
     * @param cb
     * @param ctx
     */
    window.EMapServerV2.bufferService.prototype.statisticByDistrict = function(opts, cb, ctx) {
        var url = this.options.server + '/biz/district/statistics'
        var data = {
            eId: this.options.eId,
            dataSetId: opts.table,
            districtField: opts.districtField,
            districtTable: 'CODE_BAS_DISTRICT',
            districtCode: opts.districtCode,
            useCache: !!opts.useCache
        };
        if (opts.districtCode === '000000') {
            data.useCache = true;
        }
        jQuery.ajax({
            url: url,
            type: 'get',
            data: data,
            success: function(data) {
                cb && cb.call(ctx, null, data.data)
            },
            error: function(x, msg, err) {
                cb && cb.call(ctx, err);
            }
        })
    }

    /**
     * 按行政区划查询
     * @param opts
     * @param opts.dataSetId
     * @param opts.districtField
     * @param opts.districtCode
     *
     */
    window.EMapServerV2.bufferService.prototype.queryByDistrict = function(opts, cb, ctx) {
            var queryCol = {},
                queryItem = opts;
            queryItem.query = {};
            queryItem.query['tag.' + opts.districtField] = {
                "$regex": opts.districtCode + ".*"
            }
            queryCol[opts.dataSetId] = queryItem;
            util.queryMulti({
                server: this.options.server,
                eId: this.options.eId,
                data: queryCol
            }, function(err, data) {
                if (err == null) {
                    cb && cb.call(ctx, null, data[opts.dataSetId])
                } else {
                    cb && cb.call(ctx, err)
                }
            }, this)
        }
        /**
         * 查询所有装备的展示字段
         * @opts 参数
         */
    window.EMapServerV2.bufferService.prototype.queryAllField = function(opts, cb, ctx) {
        util.queryMulti({
            server: this.options.server,
            eId: this.options.eId,
            data: opts
        }, function(err, data) {
            if (err == null) {
                cb && cb(data);
            } else {
                cb && cb(ctx, err)
            }
        }, this)
    }
    window.EMapServerV2.bufferService.Util = util;
})(window);