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
    //????????????
    service.getpeopleInforData = function (point, dataA, EventTime, cb) {
        this.servicemodule = new window.EMapServerV2.ServiceModule({
            server: EMAP_CONFIG.common.mongoService
        })
        var peopletable = "POPU_FEVER";

        if (EventTime.indexOf('???') != -1) {
            var currenttime = EventTime.split('???')[1].split('???')[0] * 1;
            if (currenttime >= 6 && currenttime <= 18) {
                peopletable = "POPU_FEVER";
            } else {
                peopletable = "POPU_FEVER_NIGHT";
            }
        }
        var queryOpts = {
            point: point,
            //????????????????????????????????????
            limit: 999999,
            //??????????????????
            querys: {
                "POPU_DISTPOPU": {
                    "table": peopletable,
                    "//": "??????????????????",
                    "//": "???????????????????????????????????????????????????",
                    "fieldMap": {
                        "poptotal": "POPTOTAL",
                        "district": "DISTRICT",
                        "downtow": "DISTNAME",
                        "distcode": "DISTCODE"
                    }
                }
            },
            //?????????
            buffer: dataA
        }
        this.servicemodule.bufferQuery(queryOpts, function (err, data) {
            if (err == null) {
                cb(data);
            } else {
                console.error('???????????????' + err.message)
            }
        })
    };
    //????????????
    service._querypeopleTotaldata = function (dataA, districtCode, callback) {
        var self = this;
        // self.querypeopleTotalData = null;
        var callBackGetData = function (data) {
            var people = 0;
            if (data.length > 0) {
                people = parseInt(data[0].POPU_DISTPOPU.POPTOTAL); //??????????????????
                callback(people);
            }
        }
        service.bufferStatistics(callBackGetData, dataA, districtCode);
    };

    //??????????????????
    service.getDistrictInforData = function (cb, dataA, point) {
        this.servicemodule = new window.EMapServerV2.ServiceModule({
            server: EMAP_CONFIG.common.mongoService
        })

        var queryOpts = {
            point: point,
            //????????????????????????????????????
            limit: 9999,
            //??????????????????
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
            //?????????
            buffer: dataA,
        }
        this.servicemodule.bufferQuery(queryOpts, function (err, data) {
            if (err == null) {
                cb(data);
            } else {
                console.error('???????????????' + err.message)
            }
        })
    };

    /**
     * ???????????????????????????
     * @param param  typecode ??????  dataA???polygon point????????????
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
        if (typecode == "enterprise" || typecode == "derivativerisk") //???????????????????????????
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
            if (!param.rescueTypecodes && typecode == 'RescueTeam???03') { //????????????rescuetypecode?????????????????????????????????????????????????????????????????????????????????
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
            //????????????????????????????????????
            limit: 99999,
            //?????????
            buffer: dataA,
            //??????????????????
            querys: query
        }
        //??????????????????????????????
        if (param.earthLevel) var earthLevel = param.earthLevel;
        this.servicemodule.bufferQuery(queryOpts, function (err, data) {
            if (err == null) {
                if (cb) {
                    //??????????????????????????????
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
                console.error('???????????????' + err.message)
            }
        })
    }
    // ?????????????????????????????????
    service.getCurrencyCount = function (cb, dataA) {
        this.servicemodule = new window.EMapServerV2.ServiceModule({
            server: EMAP_CONFIG.common.mongoService
        })
        var queryOpts = {
            //??????????????????
            querys: {
                "?????????": {
                    "table": "BAS_DEVELOPMENT",
                    "fieldMap": {
                        "name": "DEFOBJNAME",
                        "phone": "RESPOTEL",
                        "address": "ADDRESS",
                        "respper": "RESPPER"
                    }
                },
                "??????": {
                    "table": "BAS_SCHOOL",
                    "fieldMap": {
                        "name": "SCHOOLNAME",
                        "phone": "RESPOTEL",
                        "address": "ADDRESS",
                        "respper": "RESPPER"
                    }
                },
                "??????": {
                    "table": "BAS_HEALTHORG",
                    "fieldMap": {
                        "name": "ORGNAME",
                        "phone": "RESPOTEL",
                        "address": "ADDRESS",
                        "respper": "RESPPER"
                    }
                },
                "???????????????": {
                    "table": "JC_DISINFOPER",
                    "//": "???????????????",
                    "fieldMap": {
                        "name": "DISINFOPERNAME",
                        "phone": "MOBPHONE",
                        "districtname": "DISTRICTNAME",
                        "post": "POST"
                    }
                }
            },
            //?????????
            bufferList: [dataA]
        }
        this.servicemodule.bufferStatistics(queryOpts, function (err, data) {
            if (err == null) {
                if (cb) {
                    cb(data);
                }
            } else {
                console.error('???????????????' + err.message)
            }
        })
    }
    /**
     * ??????????????????
     * @param opts
     * @param opts.level
     * @param opts.typecodes
     * @param opts.geometry [Array]  //[{level:"??????", geometry:{}},{level:"??????", geometry:{}}}
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
                    "///": "???????????????1=????????????????????????2=????????????????????????????????????",
                    "sumType": 2,
                    "//": "???????????????????????????????????????????????????????????????",
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
                // var text = '???????????????' + JSON.stringify(data, null, 4) ;
                // console.log(text)
                if (callback) {
                    callback(data, self.dataA);
                }
            } else {
                // console.error('???????????????' + err.message)
                callback([]);
            }
        })
    };

    //????????????
    service._queryDistricts = function (point, dataA, cb) {
        var callback1 = function (data) {
            cb(data);
        }
        service.getDistrictInforData(callback1, dataA, point)
    }
    //????????????????????????
    service._queryDistrictPolygon = function (point, dataA, cb) {
        this.servicemodule = new window.EMapServerV2.ServiceModule({
            server: EMAP_CONFIG.common.mongoService
        })
        var queryOpts = {
            point: point,
            //????????????????????????????????????
            limit: 9999,
            eId: 'siptea',
            //??????????????????
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
            //?????????
            buffer: dataA,
        }
        this.servicemodule.bufferQuery(queryOpts, function (err, data) {
            if (err == null) {
                cb(data);
            } else {
                console.error('???????????????' + err.message)
            }
        })
    }

    //???????????????
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
        //     //????????????????????????????????????
        //     limit: 9999,
        //     eId: 'safety',
        //     //??????????????????
        //     querys: {
        //         "TOWN": {
        //             "table": "BAS_TOWN",
        //             "fieldMap": {
        //                 "name": "TOWN",
        //                 "adcode":"TOWN_CODE"
        //             }
        //         }
        //     },
        //     //?????????
        //     buffer: dataA,
        // }
        // this.servicemodule.bufferQuery(queryOpts, function (err, data) {
        //     if (err == null) {
        //         cb(data);
        //     } else {
        //         console.error('???????????????' + err.message)
        //     }
        // })
    }

    //????????????
    service._queryCity = function (point, dataA, cb) {
        this.servicemodule = new window.EMapServerV2.ServiceModule({
            server: EMAP_CONFIG.common.mongoService
        })

        var queryOpts = {
            point: point,
            //????????????????????????????????????
            limit: 9999,
            eId: "siptea",
            //??????????????????
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
            //?????????
            buffer: dataA,
        }
        this.servicemodule.bufferQuery(queryOpts, function (err, data) {
            if (err == null) {
                cb(data["city0.03"]);
            } else {
                console.error('???????????????' + err.message)
            }
        })
    }

    //??????????????????
    service.getProctectObjectDatacount = function (cb, dataA, point) {
        this.servicemodule = new window.EMapServerV2.ServiceModule({
            server: EMAP_CONFIG.common.mongoService
        })
        var queryOpts = {
            //??????????????????
            querys: DefenceObjConfig,
            //?????????
            bufferList: [dataA]
        }
        this.servicemodule.bufferStatistics(queryOpts, function (err, data) {
            if (err == null) {
                if (cb) {
                    cb(data);
                }
            } else {
                console.error('???????????????' + err.message)
            }
        })
    }
    /**
     * ??????????????????
     * @param opts
     * @param opts.keyWord
     * @param opts.level
     * @param opts.typecode
     * @param opts.geometry ???????????????geojson???
     * @param [opts.fields] ??????????????????????????????
     * @param [opts.query] ????????????
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
     * ?????????????????????--????????????
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
            if ('000000' == c) { //???????????????
                c = '.*';
            } else if (/^\d{2}0000$/.test(c)) {
                c = c.substr(0, 2) + '.*';
            } else if (/^\d{4}00$/.test(c)) {
                c = c.substr(0, 4) + '.*';
            } else { //???????????????code??????12???
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
    // ??????
    window.EMapServerV2.queryservice = service;
})(window);