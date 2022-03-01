(function (window) {
    var Service = function (options) {
        this.opts = options;
    };
    /**
     * 查询队站详情-消防
     * @param id
     * @param cb
     * @param ctx
     */
    Service.prototype.getFireTeamDetail = function (id, cb, ctx) {
        var aggregate = [
            {
                $match: {
                    _id: id
                }
            },
            {
                "$lookup": {
                    //字典表需要加上user_safety_前缀；
                    "from": "user_safety_CODE_BAS_DISTRICT",
                    //主表里的关联字段
                    "localField": "tag.RESCOUNTY",
                    //字典表的关联字段
                    "foreignField": "tag.DISTRICTCODE",
                    //结果信息存放属性
                    "as": "district"
                }
            },
            {
                "$lookup": {
                    //字典表需要加上user_safety_前缀；
                    "from": "user_safety_RESOURCE_CATALOG",
                    //主表里的关联字段
                    "localField": "tag.TEAMSTATYPECODE",
                    //字典表的关联字段
                    "foreignField": "tag.NODEID",
                    //结果信息存放属性
                    "as": "teamstatype"
                }
            },
            {
                "$lookup": {
                    //字典表需要加上user_safety_前缀；
                    "from": "user_safety_JC_FIRETEAMPERSON",
                    //主表里的关联字段
                    "localField": "_id",
                    //字典表的关联字段
                    "foreignField": "tag.TEAMSTAID",
                    //结果信息存放属性
                    "as": "person"
                }
            },
            {
                "$lookup": {
                    //字典表需要加上user_safety_前缀；
                    "from": "user_safety_JC_EQUIPMENT",
                    //主表里的关联字段
                    "localField": "_id",
                    //字典表的关联字段
                    "foreignField": "tag.TEAMSTAID",
                    //结果信息存放属性
                    "as": "equipments"
                }
            },
            {
                //展开数组
                "$unwind": {
                    path: "$district",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                //展开数组
                "$unwind": {
                    path: "$teamstatype",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "district": "$district",
                    "teamstatype": "$teamstatype",
                    "persons": "$person",
                    "equipments": "$equipments",
                    "tag": "$tag"
                }
            }
        ];
        var aggregateObj = {};
        aggregateObj.aggregate = aggregate;
        aggregateObj.query = {};
        aggregateObj.searchId = "query";
        aggregateObj.dataSetId = "JYXX_TEA_RESCUE";
        aggregateObj.queryIndex = 1;
        this.aggregateMulti([aggregateObj], function (err, data) {
            var obj = data.query[Object.keys(data.query)[0]][0];
            var resultSet = {};
            resultSet["result"] = obj;
            cb.call(ctx, resultSet);
        }, this);
    };
    /**
     * 查询救援队详情
     * @param id
     * @param cb
     * @param ctx
     */
    Service.prototype.getRescueTeamDetail = function (id, cb, ctx) {
        var aggregate = [
            {
                $match: {
                    _id: id
                }
            },
            {
                "$lookup": {
                    //字典表需要加上user_safety_前缀；
                    "from": "user_safety_CODE_BAS_DISTRICT",
                    //主表里的关联字段
                    "localField": "tag.RESCOUNTY",
                    //字典表的关联字段
                    "foreignField": "tag.DISTRICTCODE",
                    //结果信息存放属性
                    "as": "district"
                }
            },
            {
                "$lookup": {
                    //字典表需要加上user_safety_前缀；
                    "from": "user_safety_EQUIP_RESCUETYPE",
                    //主表里的关联字段
                    "localField": "tag.RESCUETYPECODE",
                    //字典表的关联字段
                    "foreignField": "tag.RESCUETYPECODE",
                    //结果信息存放属性
                    "as": "teamstatype"
                }
            },
            {
                "$lookup": {
                    //字典表需要加上user_safety_前缀；
                    "from": "user_safety_V_EQUIPMENT",
                    //主表里的关联字段
                    "localField": "_id",
                    //字典表的关联字段
                    "foreignField": "tag.RESCUEID",
                    //结果信息存放属性
                    "as": "equipments"
                }
            },
            {
                //展开数组
                "$unwind": {
                    path: "$district",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                //展开数组
                "$unwind": {
                    path: "$teamstatype",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "district": "$district",
                    "teamstatype": "$teamstatype",
                    "equipments": "$equipments",
                    "tag": "$tag"
                }
            }
        ];
        var aggregateObj = {};
        aggregateObj.aggregate = aggregate;
        aggregateObj.query = {};
        aggregateObj.searchId = "query";
        aggregateObj.dataSetId = "JYXX_TEA_RESCUE";
        aggregateObj.queryIndex = 1;
        this.aggregateMulti([aggregateObj], function (err, data) {
            var obj = data.query[Object.keys(data.query)[0]][0];
            var resultSet = {};
            resultSet["result"] = obj;
            cb.call(ctx, resultSet);
        }, this);
    };
    /**
     * 查询物资储备库
     * @param id
     * @param cb
     * @param ctx
     */
    Service.prototype.getReposityDetail = function (id, cb, ctx) {
        var aggregate = [
            {
                $match: {
                    _id: id
                }
            },
            {
                "$lookup": {
                    //字典表需要加上user_safety_前缀；
                    "from": "user_safety_JC_MATERIAL_INFO",
                    //主表里的关联字段
                    "localField": "_id",
                    //字典表的关联字段
                    "foreignField": "tag.REPERTORYID",
                    //结果信息存放属性
                    "as": "materials"
                }
            },
            {
                "$lookup": {
                    //字典表需要加上user_safety_前缀；
                    "from": "user_safety_CODE_BAS_DISTRICT",
                    //主表里的关联字段
                    "localField": "tag.DISTRICTCODE",
                    //字典表的关联字段
                    "foreignField": "tag.DISTRICTCODE",
                    //结果信息存放属性
                    "as": "district"
                }
            },
            {
                "$lookup": {
                    //字典表需要加上user_safety_前缀；
                    "from": "user_safety_CODE_REP_LEVEL",
                    //主表里的关联字段
                    "localField": "tag.LEVELCODE",
                    //字典表的关联字段
                    "foreignField": "tag.LEVELCODE",
                    //结果信息存放属性
                    "as": "level"
                }
            },
            {
                //展开数组
                "$unwind": {
                    path: "$district",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "tag": "$tag",
                    "materials": "$materials",
                    "district": "$district",
                    "level":"$level"
                }
            }
        ];
        var aggregateObj = {};
        aggregateObj.aggregate = aggregate;
        aggregateObj.query = {};
        aggregateObj.searchId = "query";
        aggregateObj.dataSetId = "JC_REPERTORY";
        aggregateObj.queryIndex = 1;
        this.aggregateMulti([aggregateObj], function (err, data) {
            var obj = data.query[Object.keys(data.query)[0]][0];
            var resultSet = {};
            resultSet["result"] = obj;
            cb.call(ctx, resultSet);
        }, this);
    };
    /**
     * 获取战勤保障详情
     * @param id
     * @param cb
     * @param ctx
     */
    Service.prototype.getWarBaseDetail = function (id, cb, ctx) {
        var aggregate = [
            {
                $match: {
                    _id: id
                }
            },
            {
                "$lookup": {
                    //字典表需要加上user_safety_前缀；
                    "from": "user_safety_JC_FIRETEAMPERSON",
                    //主表里的关联字段
                    "localField": "_id",
                    //字典表的关联字段
                    "foreignField": "tag.TEAMSTAID",
                    //结果信息存放属性
                    "as": "persons"
                }
            },
            {
                "$lookup": {
                    //字典表需要加上user_safety_前缀；
                    "from": "user_safety_JC_EQUIPMENT",
                    //主表里的关联字段
                    "localField": "_id",
                    //字典表的关联字段
                    "foreignField": "tag.TEAMSTAID",
                    //结果信息存放属性
                    "as": "equipments"
                }
            },
            {
                "$lookup": {
                    //字典表需要加上user_safety_前缀；
                    "from": "user_safety_CODE_BAS_DISTRICT",
                    //主表里的关联字段
                    "localField": "tag.DISTRICTCODE",
                    //字典表的关联字段
                    "foreignField": "tag.DISTRICTCODE",
                    //结果信息存放属性
                    "as": "district"
                }
            },
            {
                //展开数组
                "$unwind": {
                    path: "$district",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "name": "$tag.WARBASENAME",
                    "address": "$tag.ADDRESS",
                    "pernum": "$tag.PERNUM",
                    "carnum" : "$tag.CARNUM",
                    "infoMan":"$tag.CONCATE",
                    "infoTel":"$tag.CONCATETEL",
                    "position":"$tag.POSITION",
                    "latitude": "$tag.LATITUDE",
                    "longitude": "$tag.LONGITUDE",
                    "persons": "$persons",
                    "equipments": "$equipments",
                    "district": "$district"
                }
            }
        ];
        var aggregateObj = {};
        aggregateObj.aggregate = aggregate;
        aggregateObj.query = {};
        aggregateObj.searchId = "query";
        aggregateObj.dataSetId = "JC_WARBASE";
        aggregateObj.queryIndex = 1;
        this.aggregateMulti([aggregateObj], function (err, data) {
            var obj = data.query[Object.keys(data.query)[0]][0];
            var resultSet = {};
            resultSet["result"] = obj;
            cb.call(ctx, resultSet);
        }, this);
    };
    /**
     * 查询专家详情
     * @param id
     * @param cb
     * @param ctx
     */
    Service.prototype.getExpertDataDetail = function (id, cb, ctx) {
        var aggregate = [
            {
                $match: {
                    _id: id
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_JC_EXPERT_EVENTREL",
                    "localField": "tag.EXPERTID",
                    "foreignField": "tag.EXPERTID",
                    "as": "EXPERT"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_BAS_DISTRICT",
                    "localField": "tag.DISTRICT",
                    "foreignField": "tag.DISTRICTCODE",
                    "as": "DIST"
                }
            },
            {
                "$unwind": "$EXPERT"
            },
            {
                "$unwind": "$DIST"
            }
        ];
        var aggregateObj = {};
        aggregateObj.aggregate = aggregate;
        aggregateObj.query = {};
        aggregateObj.searchId = "query";
        aggregateObj.dataSetId = "JC_EXPERT";
        aggregateObj.queryIndex = 1;
        this.aggregateMulti([aggregateObj], function (err, data) {
            var obj = data.query[Object.keys(data.query)[0]][0];
            var resultSet = {};
            resultSet["result"] = obj;
            cb.call(ctx, resultSet);
        }, this);
    };
    /**
     * 查询避难场所详情
     * @param id
     * @param cb
     * @param ctx
     */
    Service.prototype.getShelterDataDetail = function (id, cb, ctx) {
        var aggregate = [
            {
                $match: {
                    _id: id
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_BAS_DISTRICT",
                    "localField": "tag.DISTRICTCODE",
                    "foreignField": "tag.DISTRICTCODE",
                    "as": "DIST"
                }
            },
            {
                "$unwind": "$DIST"
            }
        ];
        var aggregateObj = {};
        aggregateObj.aggregate = aggregate;
        aggregateObj.query = {};
        aggregateObj.searchId = "query";
        aggregateObj.dataSetId = "BAS_SHELTER";
        aggregateObj.queryIndex = 1;
        this.aggregateMulti([aggregateObj], function (err, data) {
            var obj = data.query[Object.keys(data.query)[0]][0];
            var resultSet = {};
            resultSet["result"] = obj;
            cb.call(ctx, resultSet);
        }, this);
    };
    /**
     * 多个管道执行方法-公共
     * @param aggregateList 管道列表
     * @param cb
     * @param ctx
     * @returns {*}
     */
    Service.prototype.aggregateMulti = function (aggregateList, cb, ctx) {
        var opts = {},
            data = {};
        opts.url = EMAP_CONFIG.common.mongoService + '/dataStatics/aggregateMulti';
        opts.dataType = 'json';
        opts.type = 'post';
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
     * 获取危化企业详情
     * @param id
     * @param cb
     * @param ctx
     */
    Service.prototype.getDangerQYDetail = function (id, cb, ctx) {

        var aggregate = [
            {
                $match: {
                    _id: id
                }
            },
            {
                "$lookup": {
                    //字典表需要加上user_safety_前缀；
                    "from": "user_safety_CODE_BAS_DISTRICT",
                    //主表里的关联字段
                    "localField": "tag.COUNTY",
                    //字典表的关联字段
                    "foreignField": "tag.DISTRICTCODE",
                    //结果信息存放属性
                    "as": "district"
                }
            },
            {
                "$lookup": {
                    //字典表需要加上user_safety_前缀；
                    "from": "user_safety_CODE_DAGCHEM_PROPERTY",
                    //主表里的关联字段
                    "localField": "tag.PROPERTYCODE",
                    //字典表的关联字段
                    "foreignField": "tag.PROPERTYCODE",
                    //结果信息存放属性
                    "as": "property"
                }
            },
            {
                "$lookup": {
                    //字典表需要加上user_safety_前缀；
                    "from": "user_safety_CODE_DAGCHEM_ECONOMYTYPE",
                    //主表里的关联字段
                    "localField": "tag.ECONOMYTYPECODE",
                    //字典表的关联字段
                    "foreignField": "tag.ECONOMYTYPECODE",
                    //结果信息存放属性
                    "as": "economy"
                }
            },

            {
                "$lookup": {
                    //字典表需要加上user_safety_前缀；
                    "from": "user_safety_ANJIAN_DAGCHEM_TECH",
                    //主表里的关联字段
                    "localField": "tag.DAGCHEMENTID",
                    //字典表的关联字段
                    "foreignField": "tag.DAGCHEMENTID",
                    //结果信息存放属性
                    "as": "tech"
                }
            },
            {
                "$lookup": {
                    //字典表需要加上user_safety_前缀；
                    "from": "user_safety_ANJIAN_DAGCHEM_CHEM",
                    //主表里的关联字段
                    "localField": "tag.DAGCHEMENTID",
                    //字典表的关联字段
                    "foreignField": "tag.DAGCHEMENTID",
                    //结果信息存放属性
                    "as": "chem"
                }
            },
            {
                "$unwind": {
                    path: "$district",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$property",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$economy",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$tech",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$chem",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "tag": "$tag",

                    "district": "$district",
                    "property": "$property",
                    "economy": "$economy",
                    "tech": "$tech",
                    "chem": "$chem",
                    "geom":"$geom"
                }
            }
        ];
        var opts = {};
        opts.url = EMAP_CONFIG.common.mongoService + '/' + EMAP_CONFIG.common.dataServerStatistics;
        var data = {};
        data.dataSetId = 'ANJIAN_DAGCHEMENT';
        data.eId = 'safety';
        data.query = JSON.stringify({});
        data.aggregate = JSON.stringify(aggregate);
        opts.data = data;
        opts.type = 'post';
        opts.success = function (data) {
            cb && cb.call(ctx, null, data.data);
        }
        opts.error = function (err) {
            cb && cb.call(ctx, new Error(err));
        }
        jQuery.ajax(opts);
    }

    /**
     * 获取工贸企业详情
     * @param id
     * @param cb
     * @param ctx
     */
    Service.prototype.getGMQYDetail = function (id, cb, ctx) {

        var aggregate = [
            {
                $match: {
                    _id: id
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_BAS_DISTRICT",
                    "localField": "tag.COUNTY",
                    "foreignField": "tag.DISTRICTCODE",
                    "as": "district"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_ENTERPRISE_INDUSTRY",
                    "localField": "tag.INDUSTRYCODE",
                    "foreignField": "tag.INDUSTRYCODE",
                    "as": "industry"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_ENTERPRISE_NATURE",
                    "localField": "tag.ENTNATURECODE",
                    "foreignField": "tag.ENTNATURECODE",
                    "as": "nature"
                }
            },
            {
                "$unwind": {
                    path: "$district",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$industry",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$nature",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "tag": "$tag",
                    "district": "$district",
                    "industry": "$industry",
                    "nature": "$nature",
                    "geom":"$geom"
                }
            }
        ];
        var opts = {};
        opts.url = EMAP_CONFIG.common.mongoService + '/' + EMAP_CONFIG.common.dataServerStatistics;
        var data = {};
        data.dataSetId = 'ANJIAN_ENT_WHSMYHBZ';
        data.eId = 'safety';
        data.query = JSON.stringify({});
        data.aggregate = JSON.stringify(aggregate);
        opts.data = data;
        opts.type = 'post';
        opts.success = function (data) {
            cb && cb.call(ctx, null, data.data);
        }
        opts.error = function (err) {
            cb && cb.call(ctx, new Error(err));
        }
        jQuery.ajax(opts);
    }

    /**
     * 获取煤矿企业详情
     * @param id
     * @param cb
     * @param ctx
     */
    Service.prototype.getMKQYDetail = function (id, cb, ctx) {

        var aggregate = [
            {
                $match: {
                    _id: id
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_BAS_DISTRICT",
                    "localField": "tag.COUNTY",
                    "foreignField": "tag.DISTRICTCODE",
                    "as": "district"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_COAL_STATE",
                    "localField": "tag.COALSTATECODE",
                    "foreignField": "tag.COALSTATECODE",
                    "as": "state"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_COAL_TYPE",
                    "localField": "tag.COALTYPECODE",
                    "foreignField": "tag.COALTYPECODE",
                    "as": "type"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_COAL_DEPTCLASS",
                    "localField": "tag.DEPTCLASS",
                    "foreignField": "tag.DEPTCLASS",
                    "as": "dept"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_COAL_WSGRADE",
                    "localField": "tag.WS_GRADE",
                    "foreignField": "tag.WS_GRADE",
                    "as": "ws"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_COAL_MINESTYLE",
                    "localField": "tag.MINESTYLE",
                    "foreignField": "tag.MINESTYLE",
                    "as": "mine"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_COAL_TRANSMITSTYLE",
                    "localField": "tag.TRANSMITSTYLE",
                    "foreignField": "tag.TRANSMITSTYLE",
                    "as": "transmit"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_COAL_POWERSTYLE",
                    "localField": "tag.OWERSTYLE",
                    "foreignField": "tag.OWERSTYLE",
                    "as": "power"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_COAL_HYDROGEOLOGICAL",
                    "localField": "tag.HYDROGEOLOGICAL",
                    "foreignField": "tag.HYDROGEOLOGICAL",
                    "as": "hydro"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_COAL_VENTILATESTYLE",
                    "localField": "tag.VENTILATESTYLE",
                    "foreignField": "tag.VENTILATESTYLE",
                    "as": "vent"
                }
            },
            {
                "$unwind": {
                    path: "$district",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$state",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$type",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$dept",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$ws",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$mine",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$transmit",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$power",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$hydro",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$vent",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "tag": "$tag",
                    "district": "$district",
                    "state": "$state",
                    "type": "$type",
                    "dept": "$dept",
                    "ws": "$ws",
                    "mine": "$mine",
                    "transmit": "$transmit",
                    "power": "$power",
                    "hydro": "$hydro",
                    "vent": "$vent",
                    "geom":"$geom"
                }
            }
        ];
        var opts = {};
        opts.url = EMAP_CONFIG.common.mongoService + '/' + EMAP_CONFIG.common.dataServerStatistics;
        var data = {};
        data.dataSetId = 'ANJIAN_COAL';
        data.eId = 'safety';
        data.query = JSON.stringify({});
        data.aggregate = JSON.stringify(aggregate);
        opts.data = data;
        opts.type = 'post';
        opts.success = function (data) {
            cb && cb.call(ctx, null, data.data);
        }
        opts.error = function (err) {
            cb && cb.call(ctx, new Error(err));
        }
        jQuery.ajax(opts);
    }
    /**
     * 获取非煤矿企业详情
     * @param id
     * @param cb
     * @param ctx
     */
    Service.prototype.getFMKQYDetail = function (id, cb, ctx) {

        var aggregate = [
            {
                $match: {
                    _id: id
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_BAS_DISTRICT",
                    "localField": "tag.COUNTY",
                    "foreignField": "tag.DISTRICTCODE",
                    "as": "district"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_TAILINGPOND_RUNSTATUS",
                    "localField": "tag.RUNSTATUSCODE",
                    "foreignField": "tag.RUNSTATUSCODE",
                    "as": "state"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_TAILINGPOND_TYPE",
                    "localField": "tag.TAILINGPONDTYPE",
                    "foreignField": "tag.TAILINGPONDTYPE",
                    "as": "type"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_TAILINGPOND_GRADE",
                    "localField": "tag.WKKDBCODE",
                    "foreignField": "tag.WKKDBCODE",
                    "as": "dept"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_TAILINGPOND_GRADE",
                    "localField": "tag.WKKDBCODE",
                    "foreignField": "tag.WKKDBCODE",
                    "as": "ws"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_TAILINGPOND_SAFETY",
                    "localField": "tag.WKKAQDCODE",
                    "foreignField": "tag.WKKAQDCODE",
                    "as": "mine"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_TAILINGPOND_INDUSTRY",
                    "localField": "tag.WKKSSHYCODE",
                    "foreignField": "tag.WKKSSHYCODE",
                    "as": "transmit"
                }
            },
            {
                "$unwind": {
                    path: "$district",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$state",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$type",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$dept",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$ws",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$mine",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$transmit",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "tag": "$tag",
                    "district": "$district",
                    "state": "$state",
                    "type": "$type",
                    "dept": "$dept",
                    "ws": "$ws",
                    "mine": "$mine",
                    "transmit": "$transmit",
                    "geom":"$geom"
                }
            }
        ];
        var opts = {};
        opts.url = EMAP_CONFIG.common.mongoService + '/' + EMAP_CONFIG.common.dataServerStatistics;
        var data = {};
        data.dataSetId = 'ANJIAN_TAILINGPOND';
        data.eId = 'safety';
        data.query = JSON.stringify({});
        data.aggregate = JSON.stringify(aggregate);
        opts.data = data;
        opts.type = 'post';
        opts.success = function (data) {
            cb && cb.call(ctx, null, data.data);
        }
        opts.error = function (err) {
            cb && cb.call(ctx, new Error(err));
        }
        jQuery.ajax(opts);
    }

    /**
     * 获取地质灾害详情
     * @param id
     * @param cb
     * @param ctx
     */
    Service.prototype.getGEODISASTERDetail = function (id, cb, ctx) {

        var aggregate = [
            {
                $match: {
                    _id: id
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_BAS_DISTRICT",
                    "localField": "tag.DISTRICTCODE",
                    "foreignField": "tag.DISTRICTCODE",
                    "as": "district"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_GEOLOGICHAZARD_TYPE",
                    "localField": "tag.GEOHAZARDTYPECODE",
                    "foreignField": "tag.GEOHAZARDTYPECODE",
                    "as": "geohazardtype"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_BAS_HAZARDLEVEL",
                    "localField": "tag.HAZARDLEVELCODE",
                    "foreignField": "tag.HAZARDLEVELCODE",
                    "as": "hazardlevel"
                }
            },
            {
                "$unwind": {
                    path: "$district",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$geohazardtype",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$hazardlevel",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "tag": "$tag",
                    "district": "$district",
                    "geohazardtype": "$geohazardtype",
                    "hazardlevel": "$hazardlevel",
                    "geom":"$geom"
                }
            }
        ];
        var opts = {};
        opts.url = EMAP_CONFIG.common.mongoService + '/' + EMAP_CONFIG.common.dataServerStatistics;
        var data = {};
        data.dataSetId = 'BAS_GEOLOGICHAZARD';
        data.eId = 'safety';
        data.query = JSON.stringify({});
        data.aggregate = JSON.stringify(aggregate);
        opts.data = data;
        opts.type = 'post';
        opts.success = function (data) {
            cb && cb.call(ctx, null, data.data);
        }
        opts.error = function (err) {
            cb && cb.call(ctx, new Error(err));
        }
        jQuery.ajax(opts);
    }
    /**
     * 获取烟花爆竹企业详情
     * @param id
     * @param cb
     * @param ctx
     */
    Service.prototype.getYHBZQYDetail = function (id, cb, ctx) {

        var aggregate = [
            {
                $match: {
                    _id: id
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_BAS_DISTRICT",
                    "localField": "tag.COUNTY",
                    "foreignField": "tag.DISTRICTCODE",
                    "as": "district"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_FIRENT_DEPTTYPE",
                    "localField": "tag.DEPTTYPECODE",
                    "foreignField": "tag.DEPTTYPECODE",
                    "as": "dept"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_ANJIAN_FIRENT_CREDTYPE",
                    "localField": "tag.CREDTYPECODE",
                    "foreignField": "tag.CREDTYPECODE",
                    "as": "cred"
                }
            },
            {
                "$unwind": {
                    path: "$district",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$dept",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$cred",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "tag": "$tag",
                    "dept": "$dept",
                    "cred": "$cred",
                    "district": "$district",
                    "geom":"$geom"
                }
            }
        ];
        var opts = {};
        opts.url = EMAP_CONFIG.common.mongoService + '/' + EMAP_CONFIG.common.dataServerStatistics;
        var data = {};
        data.dataSetId = 'ANJIAN_FIREWORKENT';
        data.eId = 'safety';
        data.query = JSON.stringify({});
        data.aggregate = JSON.stringify(aggregate);
        opts.data = data;
        opts.type = 'post';
        opts.success = function (data) {
            cb && cb.call(ctx, null, data.data);
        }
        opts.error = function (err) {
            cb && cb.call(ctx, new Error(err));
        }
        jQuery.ajax(opts);
    }

    /**
     * 获取重大危险源详情
     * @param id
     * @param cb
     * @param ctx
     */
    Service.prototype.getDangerDetail = function (id, cb, ctx) {

        var aggregate = [
            {
                $match: {
                    _id: id
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_BAS_HAZARDLEVEL",
                    "localField": "tag.HAZARDLEVELCODE",
                    "foreignField": "tag.HAZARDLEVELCODE",
                    "as": "hazardlevel"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_BAS_DANGERTYPE",
                    "localField": "tag.DANGERTYPECODE",
                    "foreignField": "tag.DANGERTYPECODE",
                    "as": "dangertype"
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_BAS_DISTRICT",
                    "localField": "tag.COUNTY",
                    "foreignField": "tag.DISTRICTCODE",
                    "as": "district"
                }
            },
            {
                "$unwind": {
                    path: "$district",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$hazardlevel",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$unwind": {
                    path: "$dangertype",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "tag": "$tag",
                    "dangertype": "$dangertype",
                    "hazardlevel": "$hazardlevel",
                    "district": "$district",
                    "geom":"$geom"
                }
            }
        ];
        var opts = {};
        opts.url = EMAP_CONFIG.common.mongoService + '/' + EMAP_CONFIG.common.dataServerStatistics;
        var data = {};
        data.dataSetId = 'ANJIAN_DANGER';
        data.eId = 'safety';
        data.query = JSON.stringify({});
        data.aggregate = JSON.stringify(aggregate);
        opts.data = data;
        opts.type = 'post';
        opts.success = function (data) {
            cb && cb.call(ctx, null, data.data);
        }
        opts.error = function (err) {
            cb && cb.call(ctx, new Error(err));
        }
        jQuery.ajax(opts);
    }
    /**
     * 获取基础数据详情
     * @param id
     * @param cb
     * @param ctx
     */
    Service.prototype.getBaseDataDetail = function (id,tablename, cb, ctx) {

        var aggregate = [
            {
                $match: {
                    _id: id
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_BAS_DISTRICT",
                    "localField": "tag.DISTRICTCODE",
                    "foreignField": "tag.DISTRICTCODE",
                    "as": "district"
                }
            },
            {
                "$unwind": {
                    path: "$district",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "tag": "$tag",
                    "district": "$district",
                    "geom":"$geom"
                }
            }
        ];
        var opts = {};
        opts.url = EMAP_CONFIG.common.mongoService + '/' + EMAP_CONFIG.common.dataServerStatistics;
        var data = {};
        data.dataSetId = tablename;
        data.eId = 'safety';
        data.query = JSON.stringify({});
        data.aggregate = JSON.stringify(aggregate);
        opts.data = data;
        opts.type = 'post';
        opts.success = function (data) {
            cb && cb.call(ctx, null, data.data);
        }
        opts.error = function (err) {
            cb && cb.call(ctx, new Error(err));
        }
        jQuery.ajax(opts);
    }
    /**
     * 获取装备数据详情
     * @param id
     * @param cb
     * @param ctx
     */
    Service.prototype.getEquipDataDetail = function (id, cb, ctx) {

        var aggregate = [
            {
                $match: {
                    _id: id
                }
            },
            {
                "$lookup": {
                    "from": "user_safety_CODE_BAS_DISTRICT",
                    "localField": "tag.RESCOUNTY",
                    "foreignField": "tag.DISTRICTCODE",
                    "as": "district"
                }
            },
            {
                "$unwind": {
                    path: "$district",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "tag": "$tag",
                    "district": "$district",
                    "geom":"$geom"
                }
            }
        ];
        var opts = {};
        opts.url = EMAP_CONFIG.common.mongoService + '/' + EMAP_CONFIG.common.dataServerStatistics;
        var data = {};
        data.dataSetId = "V_EQUIPMENT";
        data.eId = 'safety';
        data.query = JSON.stringify({});
        data.aggregate = JSON.stringify(aggregate);
        opts.data = data;
        opts.type = 'post';
        opts.success = function (data) {
            cb && cb.call(ctx, null, data.data);
        }
        opts.error = function (err) {
            cb && cb.call(ctx, new Error(err));
        }
        jQuery.ajax(opts);
    }
  window.EMapServerV2 = window.EMapServerV2 || {};
  // 参考
  window.EMapServerV2.DetailInfoServices = Service;
})(window);