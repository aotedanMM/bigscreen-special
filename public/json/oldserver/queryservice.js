(function (window) {
    var service = {};
    var DefenceObjConfig = {
        "development": {
            "table": "BAS_DEVELOPMENT",
            "fieldMap": {
                "name": "DEFOBJNAME",
                "phone": "RESPOTEL",
                "address": "ADDRESS",
                "respper": "RESPPER"
            }
        },
        "school": {
            "table": "BAS_SCHOOL",
            "fieldMap": {
                "name": "SCHOOLNAME",
                "SCHOOLTYPENAME": {
                    "from": "user_safety_CODE_SCHOOL_TYPE",
                    "localField": "tag.DEFOBJTYPECODE",
                    "foreignField": "tag.SCHOOLTYPECODE",
                    "as": "DEFOBJTYPECODE"
                },
                "address": "ADDRESS",
                "CONTACTPER": "RESPPER",
                "CONTACTMTEL": "RESPMTEL",
                "STUDENTNUM": "STUDENTNUM",
                "FACULTYNUM": "FACULTYNUM",
                "BUILDAREA": "BUILDAREA",
                "district": "COUNTY",
                "districtname": "COUNTY.tag.FULLNAME",
                "objecttype": "DEFOBJTYPECODE",
                "DEFOBJTYPECODE": "DEFOBJTYPECODE.tag.SCHOOLTYPENAME"
            },
            "relations": [{
                    "table": "CODE_BAS_DISTRICT",
                    "localField": "COUNTY",
                    "foreignField": "DISTRICTCODE"
                },
                {
                    "table": "CODE_SCHOOL_TYPE",
                    "localField": "DEFOBJTYPECODE",
                    "foreignField": "SCHOOLTYPECODE"
                }
            ]
        },
        "hospital": {
            "table": "BAS_HEALTHORG",
            "fieldMap": {
                "name": "ORGNAME",
                "phone": "RESPOTEL",
                "address": "ADDRESS",
                "respper": "RESPPER"
            }
        }
    };
    var QueryConfig = {};
    $.ajax({
        url: './json/oldserver/queryservice.json',
        type: 'get',
        dataType: "json",
        async: false,
        success: function (res) {
            QueryConfig = res;
        },
        error: function (res) {
        }})
    //人口热力
    service.getpeopleInforData = function (point, dataA, EventTime, cb) {
        this.servicemodule = new window.EMapServerV2.ServiceModule({
            server: EMAP_CONFIG.common.mongoService
        })
        var peopletable = "POPU_FEVER";

        if (EventTime.indexOf('时') != -1) {
            var currenttime = EventTime.split('日')[1].split('时')[0] * 1;
            if (currenttime >= 6 && currenttime <= 18) {
                peopletable = "POPU_FEVER";
            } else {
                peopletable = "POPU_FEVER_NIGHT";
            }
        }
        var queryOpts = {
            point: point,
            //指定每类最多返回的记录数
            limit: 999999,
            //查询的表配置
            querys: {
                "POPU_DISTPOPU": {
                    "table": peopletable,
                    "//": "默认过滤条件",
                    "//": "字段映射，需要查询的字段都在这里写",
                    "fieldMap": {
                        "poptotal": "POPTOTAL",
                        "district": "DISTRICT",
                        "downtow": "DISTNAME",
                        "distcode": "DISTCODE"
                    }
                }
            },
            //缓冲区
            buffer: dataA
        }
        this.servicemodule.bufferQuery(queryOpts, function (err, data) {
            if (err == null) {
                cb(data);
            } else {
                console.error('查询失败：' + err.message)
            }
        })
    };
    //人口总数
    service._querypeopleTotaldata = function (dataA, districtCode, callback) {
        var self = this;
        // self.querypeopleTotalData = null;
        var callBackGetData = function (data) {
            var people = 0;
            if (data.length > 0) {
                people = parseInt(data[0].POPU_DISTPOPU.POPTOTAL); //查询到的数据
                callback(people);
            }
        }
        service.bufferStatistics(callBackGetData, dataA, districtCode);
    };

    //查询乡镇区县
    service.getDistrictInforData = function (cb, dataA, point) {
        this.servicemodule = new window.EMapServerV2.ServiceModule({
            server: EMAP_CONFIG.common.mongoService
        })

        var queryOpts = {
            point: point,
            //指定每类最多返回的记录数
            limit: 9999,
            //查询的表配置
            querys: {
                "POPU_DISTPOPU": {
                    "table": "POPU_DISTPOPU",
                    "fieldMap": {
                        "poptotal": "POPTOTAL",
                        "district": "DISTRICT",
                        "downtow": "DISTNAME",
                        "distcode": "DISTCODE"
                    }
                }
            },
            //缓冲区
            buffer: dataA,
        }
        this.servicemodule.bufferQuery(queryOpts, function (err, data) {
            if (err == null) {
                cb(data);
            } else {
                console.error('查询失败：' + err.message)
            }
        })
    };

    /**
     * 查询多个类型的数据
     * @param param  typecode 编码  dataA为polygon point为事件点
     * @param cb
     */
    service.getCurrencyData = function (param, cb) {
        this.servicemodule = new window.EMapServerV2.ServiceModule({
            server: EMAP_CONFIG.common.mongoService
        })
        var id = param.id;
        var typecode = param.typecode;
        var dataA = param.dataA;
        var point = param.point;
        var near = param.near;
        var distanceField = param.distanceField;
        var paging = param.paging;
        var pageIndex = param.pageIndex;
        var pageSize = param.pageSize;
        var keyWord = param.keyWord;
        var districtCode = param.districtCode;
        var query = {};
        if (typecode == "enterprise" || typecode == "derivativerisk") //重点企业和地质灾害
        {
            query = QueryConfig[typecode];
        } else {
            query[typecode] = QueryConfig[typecode];
        }
        if (param.query) {
            if (query[typecode].query) {
                Object.assign(query[typecode].query, param.query);
            } else {
                query[typecode].query = param.query;
            }
        } else {
            if (!param.rescueTypecodes && typecode == 'RescueTeam※03') { //解决赋值rescuetypecode后，再次查询由于没有清空类型筛选导致救援队伍详情出不来
                query[typecode].query = {}
            } else {
                query[typecode].query = query[typecode].query || {};
                Object.assign(query[typecode].query, param.query);
            }
        }
        if (keyWord) {
            var fbsArr = ["\\", "$", "(", ")", "*", "+", ".", "[", "]", "?", "^", "{", "}", "|"];
            for (var key in fbsArr) {
                for (var kw in keyWord) {
                    if (keyWord[kw].indexOf(fbsArr[key]) != -1) {
                        keyWord[kw] = keyWord[kw].replace(fbsArr[key], "\\" + fbsArr[key]);
                    }
                }
            }
        }
        var queryOpts = {
            id: id,
            keyWord: keyWord,
            districtCode: districtCode,
            point: point,
            near: near,
            distanceField: distanceField,
            paging: paging,
            pageIndex: pageIndex,
            pageSize: pageSize,
            //指定每类最多返回的记录数
            limit: 99999,
            //缓冲区
            buffer: dataA,
            //查询的表配置
            querys: query
        }
        //危化企业烈度圈标志位
        if (param.earthLevel) var earthLevel = param.earthLevel;
        this.servicemodule.bufferQuery(queryOpts, function (err, data) {
            if (err == null) {
                if (cb) {
                    //危化企业烈度圈标志位
                    if (earthLevel) data['level'] = earthLevel;
                    if (!data[typecode]) {
                        var typecodeArr = ["collapse", "mudslide", "falldown", "landslide"];
                        for (var i in typecodeArr) {
                            var code = typecodeArr[i];
                            for (var kk in data[code]) {
                                data[code][kk].level = earthLevel;
                            }
                        }
                    } else {
                        for (var kk in data[typecode]) {
                            data[typecode][kk].level = earthLevel;
                        }
                    }
                    cb(data);
                }
            } else {
                console.error('查询失败：' + err.message)
            }
        })
    }
    // 查询多个类型的统计数量
    service.getCurrencyCount = function (cb, dataA) {
        this.servicemodule = new window.EMapServerV2.ServiceModule({
            server: EMAP_CONFIG.common.mongoService
        })
        var queryOpts = {
            //查询的表配置
            querys: {
                "居民区": {
                    "table": "BAS_DEVELOPMENT",
                    "fieldMap": {
                        "name": "DEFOBJNAME",
                        "phone": "RESPOTEL",
                        "address": "ADDRESS",
                        "respper": "RESPPER"
                    }
                },
                "学校": {
                    "table": "BAS_SCHOOL",
                    "fieldMap": {
                        "name": "SCHOOLNAME",
                        "phone": "RESPOTEL",
                        "address": "ADDRESS",
                        "respper": "RESPPER"
                    }
                },
                "医院": {
                    "table": "BAS_HEALTHORG",
                    "fieldMap": {
                        "name": "ORGNAME",
                        "phone": "RESPOTEL",
                        "address": "ADDRESS",
                        "respper": "RESPPER"
                    }
                },
                "灾情信息员": {
                    "table": "JC_DISINFOPER",
                    "//": "灾情信息员",
                    "fieldMap": {
                        "name": "DISINFOPERNAME",
                        "phone": "MOBPHONE",
                        "districtname": "DISTRICTNAME",
                        "post": "POST"
                    }
                }
            },
            //缓冲区
            bufferList: [dataA]
        }
        this.servicemodule.bufferStatistics(queryOpts, function (err, data) {
            if (err == null) {
                if (cb) {
                    cb(data);
                }
            } else {
                console.error('查询失败：' + err.message)
            }
        })
    }
    /**
     * 获取资源统计
     * @param opts
     * @param opts.level
     * @param opts.typecodes
     * @param opts.geometry [Array]  //[{level:"Ⅵ级", geometry:{}},{level:"Ⅶ级", geometry:{}}}
     * @param [opts.query]
     */
    service.getStatistics = function (opts, callback) {
        var servicemodule = new window.EMapServerV2.ServiceModule({
            server: EMAP_CONFIG.common.mongoService,
        });
        //var deffered = jQuery.Deferred();
        // return new Promise((resolve, reject) => {
        var queries = {};
        var result = {};
        let counter = 0;
        opts.typecodes.forEach(function (typecode) {
            queries[typecode] = QueryConfig[typecode];
            // if (opts.query) {
            if (queries[typecode].query) {
                Object.assign(queries[typecode].query, opts.query);
            } else {
                queries[typecode].query = opts.query;
            }
        });
        var level = opts.level;
        var geometry = opts.geometry;
        var queryOpts = {
            querys: queries,
            bufferList: [geometry],
        };
        servicemodule.bufferStatistics(queryOpts, function (err, data) {
            if (err) {
                //deffered.reject(err);
                callback(err);
            }
            result[level] = {};
            result[level].data = data[0];
            result[level].total = 0;
            for (var typecode in result[level].data) {
                result[level].total += result[level].data[typecode].count;
            }
            // if (counter === opts.typecodes.length - 1) {
            // deffered.resolve(result);
            callback(result);
            // }
            // counter++;
        });
        // return deffered.promise();
        // });
    }
    service.bufferStatistics = function (callback, dataA, districtCode) {
        var self = this;
        self.dataA = dataA;
        this.servicemodule = new window.EMapServerV2.ServiceModule({
            server: EMAP_CONFIG.common.mongoService
        })
        var bufferList = dataA ? [dataA] : [];
        var statisticsOpts = {
            querys: {
                "POPU_DISTPOPU": {
                    "table": "POPU_FEVER",
                    "///": "计数类型，1=按照记录数统计，2=按照记录某些数值属性统计",
                    "sumType": 2,
                    "//": "统计人口的字段，可以指定多个数字类型的字段",
                    "sumFields": ["POPTOTAL"]
                }
            },
            districtCode: districtCode,
            codes: districtCode,
            districtField: 'DISTCODE',
            bufferList: bufferList
        }
        this.servicemodule.bufferStatistics(statisticsOpts, function (err, data) {
            if (err == null) {
                // var text = '统计结果：' + JSON.stringify(data, null, 4) ;
                // console.log(text)
                if (callback) {
                    callback(data, self.dataA);
                }
            } else {
                // console.error('查询失败：' + err.message)
                callback([]);
            }
        })
    };

    //受灾区县
    service._queryDistricts = function (point, dataA, cb) {
        var callback1 = function (data) {
            cb(data);
        }
        service.getDistrictInforData(callback1, dataA, point)
    }
    //受灾区县的多边形
    service._queryDistrictPolygon = function (point, dataA, cb) {
        this.servicemodule = new window.EMapServerV2.ServiceModule({
            server: EMAP_CONFIG.common.mongoService
        })
        var queryOpts = {
            point: point,
            //指定每类最多返回的记录数
            limit: 9999,
            eId: 'siptea',
            //查询的表配置
            querys: {
                "COUNTY": {
                    "table": "county0.06",
                    "fieldMap": {
                        "name": "name",
                        "adcode": "adcode",
                        "gov": "gov"
                    }
                }
            },
            //缓冲区
            buffer: dataA,
        }
        this.servicemodule.bufferQuery(queryOpts, function (err, data) {
            if (err == null) {
                cb(data);
            } else {
                console.error('查询失败：' + err.message)
            }
        })
    }

    //查询乡镇面
    service._queryTownPolygon = function (url, point, dataA, cb) {
        var geom = g2.sfs.GeometryFactory.createGeometryFromGeoJson(dataA).asWkt();

        $.ajax({
            url: url + '/api/public/dlgbouaxiang/list/v1',
            type: 'POST',
            dataType: "json",
            async: false,
            contentType: "application/json",
            data: '{"polygon":"' + geom + '"}',
            // data: JSON.stringify({
            //     "polygon": geom
            // }),
            success: function (res) {
                if (res.success || res.code === 0) {
                    var dataArr = res.data;
                    var result = []
                    for (var i in dataArr) {
                        if (dataArr[i].centerid) {
                            var tmpitem = {};
                            tmpitem.tag = {};
                            tmpitem.tag.name = dataArr[i].name;
                            tmpitem.tag.adcode = dataArr[i].pac;
                            tmpitem.shape_area = dataArr[i].shapeArea;
                            if (g2.sfs.GeometryFactory.createGeometryFromWkt(dataArr[i].centerid, 4326)) { //
                                var startpoint = new g2.sfs.Point({
                                    x: point[0],
                                    y: point[1],
                                    spatialReference: 4326
                                });
                                var endpoint = g2.sfs.GeometryFactory.createGeometryFromWkt(dataArr[i].centerid, 4326)

                                var polyline = new g2.sfs.Polyline({
                                    spatialReference: 4326
                                });
                                var path = new g2.sfs.Path({
                                    spatialReference: 4326
                                });
                                path.addPoint(startpoint);
                                path.addPoint(endpoint);
                                polyline.addGeometry(path);
                                var projectService = new g2.sfs.CoordinateTransform();
                                var measureService = new g2.sfs.MeasureService({
                                    projectService: projectService
                                });
                                var length = measureService.length(polyline);
                                tmpitem._distance = length;
                                tmpitem._id = dataArr[i].objectid;
                                tmpitem.centerid = dataArr[i].centerid;
                                result.push(tmpitem);
                            }
                        }
                    }


                    result.sort(function (a, b) {
                        if (a._distance < b._distance) {
                            return -1;
                        } else if (a._distance == b._distance) {
                            return 0;
                        } else {
                            return 1;
                        }
                    })
                    cb(result);
                }
            },
            error: function (err) {

            }
        })

        // this.servicemodule = new ServiceModule({
        //     server: EMAP_CONFIG.common.mongoService
        // })
        // var queryOpts = {
        //     point: point,
        //     //指定每类最多返回的记录数
        //     limit: 9999,
        //     eId: 'safety',
        //     //查询的表配置
        //     querys: {
        //         "TOWN": {
        //             "table": "BAS_TOWN",
        //             "fieldMap": {
        //                 "name": "TOWN",
        //                 "adcode":"TOWN_CODE"
        //             }
        //         }
        //     },
        //     //缓冲区
        //     buffer: dataA,
        // }
        // this.servicemodule.bufferQuery(queryOpts, function (err, data) {
        //     if (err == null) {
        //         cb(data);
        //     } else {
        //         console.error('查询失败：' + err.message)
        //     }
        // })
    }

    //查询城市
    service._queryCity = function (point, dataA, cb) {
        this.servicemodule = new window.EMapServerV2.ServiceModule({
            server: EMAP_CONFIG.common.mongoService
        })

        var queryOpts = {
            point: point,
            //指定每类最多返回的记录数
            limit: 9999,
            eId: "siptea",
            //查询的表配置
            querys: {
                "city0.03": {
                    "table": "city0.03",
                    "fieldMap": {
                        "name": "name",
                        "adcode": "adcode",
                        "gov": "gov"
                    }
                }
            },
            //缓冲区
            buffer: dataA,
        }
        this.servicemodule.bufferQuery(queryOpts, function (err, data) {
            if (err == null) {
                cb(data["city0.03"]);
            } else {
                console.error('查询失败：' + err.message)
            }
        })
    }

    //查询防护目标
    service.getProctectObjectDatacount = function (cb, dataA, point) {
        this.servicemodule = new window.EMapServerV2.ServiceModule({
            server: EMAP_CONFIG.common.mongoService
        })
        var queryOpts = {
            //查询的表配置
            querys: DefenceObjConfig,
            //缓冲区
            bufferList: [dataA]
        }
        this.servicemodule.bufferStatistics(queryOpts, function (err, data) {
            if (err == null) {
                if (cb) {
                    cb(data);
                }
            } else {
                console.error('查询失败：' + err.message)
            }
        })
    }
    /**
     * 查询列表数据
     * @param opts
     * @param opts.keyWord
     * @param opts.level
     * @param opts.typecode
     * @param opts.geometry 几何对象（geojson）
     * @param [opts.fields] 字段列表（筛选字段）
     * @param [opts.query] 参数查询
     * @param callback
     * @param ctx
     */
    service.getMapDataList = function (opts, callback, ctx) {
        var self = this;
        var typeCodeQuery = QueryConfig[opts.typecode];
        var param = {};
        if (typeCodeQuery) {


            var tableName = typeCodeQuery.table;
            var config = this.getSelectColumn(typeCodeQuery, opts.fields);
            var fieldProject = config.fieldProject;
            var query = {};
            query.$and = [];
            if (opts.geometry) {
                var geom = {
                    $geoIntersects: {
                        $geometry: opts.geometry,
                    },
                };
                query.$and.push({
                    geom: geom
                });
            }
            if (opts.query) {
                query.$and.push(opts.query);
            }
            if (opts.keyWord) {
                var keyWords = [];
                if (Array.isArray(opts.keyWord)) {
                    keyWords = opts.keyWord;
                } else if (typeof (opts.keyWord) == 'string') {
                    keyWords.push(opts.keyWord);
                }
                var self = this;
                keyWords.forEach(function (keyWord) {
                    var kwMatch = self.getSearchMatch(keyWord, typeCodeQuery);
                    query.$and.push(kwMatch);
                });
            }
            if (opts.districtCode) {
                typeCodeQuery.districtField = typeCodeQuery.districtField || 'DISTRICTCODE';
                var districtMatch = this.getDistrictMatch(opts.districtCode, typeCodeQuery);
                if (districtMatch && districtMatch.length > 0) {
                    query.$and = query.$and.concat(districtMatch);
                }
            }
            if (query.$and.length === 0) {
                delete query.$and;
            }
            param[tableName] = {
                query: query,
                select: config.select
            }
            $.ajax({
                url: EMAP_CONFIG.common.mongoService + '/dataOperate/queryMulti',
                dataType: 'json',
                type: 'post',
                data: {
                    eId: 'safety',
                    data: JSON.stringify(param),
                },
                success: function (data) {
                    var res = self.formatResultColumns(data.data[tableName], fieldProject)
                    callback && callback.call(ctx, null, res);
                },
                error: function (err) {
                    callback && callback.call(ctx, err);
                }
            });
        }
    }
    /**
     * 拼接关键字条件--预留方法
     * @param kw
     * @param resource
     */
    service.getSearchMatch = function (kw, resource) {
        if (kw) {
            var query = {};
            var filter = {};
            filter['$regex'] = "^.*" + kw + ".*$";
            query['tag.' + resource.keyWordFields] = filter;
            return query;
        } else {
            return null;
        }
    }
    service.getDistrictMatch = function (districtCode, resource) {
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
            var eachFilter = {};
            const regStrArr = [];
            for (var i = 0; i < districtCodes.length; i++) {
                var districtCode = districtCodes[i];
                if (districtCode) {
                    regStrArr.push(getDistrictRegex(districtCode));

                }
            }
            eachFilter[districtKey] = {
                $regex: regStrArr.join('|')
            };
            or.push(eachFilter);
            match = or;
        } else {
            var matchObj = {};
            // matchObj['tag.'+resource.districtField] = {
            //     $regex: '.*',
            // };
            match = []
            console.debug('ignore district filter');
        }
        return match;

        function getDistrictRegex(code) {
            var c = code.substr(0, 6);
            if ('000000' == c) { //全国不过滤
                c = '.*';
            } else if (/^\d{2}0000$/.test(c)) {
                c = c.substr(0, 2) + '.*';
            } else if (/^\d{4}00$/.test(c)) {
                c = c.substr(0, 4) + '.*';
            } else { //灾情信息员code都是12位
                c = c + '.*'
            }
            return '^' + c + '$';
        }
    }
    service.getSelectColumn = function (resource, fields) {
        var fieldMap = resource.fieldMap;
        var selectArr = [];
        var fieldProject = {};
        selectArr.push("_id");
        selectArr.push("geom");
        for (var key in fieldMap) {
            if (fieldMap.hasOwnProperty(key)) {
                var originalField = fieldMap[key]
                if (fields.includes(key)) {
                    fieldProject[originalField] = key;
                    selectArr.push("tag." + originalField);
                }
            }
        }
        var result = {};

        result.select = selectArr.join(" ");
        result.fieldProject = fieldProject;
        return result;
    }
    service.formatResultColumns = function (data, fieldProject) {
        data.forEach(function (element) {
            var tag = element.tag;
            Object.keys(tag).forEach(function (key) {
                element[key] = tag[key];
            });
            for (var key in element) {
                if (element.hasOwnProperty(key)) {
                    if (fieldProject[key]) {
                        element[fieldProject[key]] = element[key];
                    }
                }
            }
        });
        return data;
    }
    window.EMapServerV2 = window.EMapServerV2 || {};
    // 参考
    window.EMapServerV2.queryservice = service;
})(window);