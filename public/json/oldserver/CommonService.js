(function(window) {

    /**
     *
     * @param opts
     * @constructor
     */
    var Service = function(opts) {
            this.opts = {
                configUrl: './json/oldserver/nearby.json',
                serverUrl: EMAP_CONFIG.common.mongoService,
            };
            //
            this._resourceTemp = null;
            //
            this._configTemp = null;
            //
            this.seperator = '※';
            //事件类型
            this.eventTypeList = null;
        }
        /**
         * 获取资源类型
         * @param callback
         * @param ctx
         */
    Service.prototype.getResources = function(callback, ctx) {
        if (this._resourceTemp == null) {
            var self = this;
            var aggregate = [{
                    "$lookup": {
                        //字典表需要加上user_safety_前缀；
                        "from": "user_safety_REL_RESOURCE_EMTYPE",
                        //主表里的关联字段
                        "localField": "tag.NODEID",
                        //字典表的关联字段
                        "foreignField": "tag.NODEID",
                        //结果信息存放属性
                        "as": "REL"
                    }
                },
                {
                    //展开数组
                    "$unwind": {
                        path: "$REL",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$lookup": {
                        //字典表需要加上user_safety_前缀；
                        "from": "user_safety_JC_RESTEAMCFG",
                        //主表里的关联字段
                        "localField": "tag.NODEID",
                        //字典表的关联字段
                        "foreignField": "tag.FIRETEAMTYPECODE",
                        //结果信息存放属性
                        "as": "CFG"
                    }
                },
                {
                    //展开数组
                    "$unwind": {
                        path: "$CFG",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        "tag": "$tag",
                        "type": "$REL.tag.TYPECODE",
                        "orderNum": "$REL.tag.ORDERNUM",
                        "config": "$CFG.tag"
                    }
                },
                {
                    $sort: {
                        "tag.ORDERNUM": 1
                    }
                }
            ]
            var query = {};
            var data = {};
            data.dataSetId = 'RESOURCE_CATALOG';
            data.query = JSON.stringify(query);
            data.aggregate = JSON.stringify(aggregate);
            data.eId = 'safety';
            var opts = {};
            opts.url = this.opts.serverUrl + '/dataStatics/aggregate';
            opts.data = data;
            opts.type = 'get';
            opts.dataType = 'json';
            opts.success = function(data) {
                self._resourceTemp = data.data;
                callback && callback.call(ctx, null, jQuery.extend(true, [], self._resourceTemp));
            }
            opts.error = function(err) {
                callback && callback.call(ctx, new Error('服务器问题'));
            }
            return jQuery.ajax(opts);
        } else {
            callback && callback.call(ctx, null, jQuery.extend(true, [], this._resourceTemp));
            return null;
        }
    }

    /**
     * 获取资源配置
     * @param callback
     * @param ctx
     */
    Service.prototype.getResourceConfig = function(callback, ctx) {
        if (this._configTemp == null) {
            var self = this;
            var opts = {};
            opts.url = this.opts.configUrl;
            opts.dataType = 'json';
            opts.success = function(data) {
                self._configTemp = plainConfig.call(self, data.resources);
                callback && callback.call(ctx, null, jQuery.extend(true, {}, self._configTemp));
            }
            opts.error = function(err) {
                callback && callback.call(ctx, new Error('服务器问题'));
            }
            jQuery.ajax(opts);
        } else {
            callback && callback.call(ctx, null, jQuery.extend(true, {}, this._configTemp));
        }
        //
        function plainConfig(resources) {
            var resourceSet = {};
            var seperator = this.seperator;
            for (var resourceKey in resources) {
                var resource = resources[resourceKey];
                var serviceObj = resource.service || {};
                if (resource.children && Object.keys(resource.children).length > 0) {
                    for (var childKey in resource.children) {
                        var resourceId = resourceKey + seperator + childKey,
                            childResource = resource.children[childKey];
                        var serviceObjClone = jQuery.extend(true, {}, serviceObj);
                        childResource.service = jQuery.extend(true, serviceObjClone, childResource.service || {});
                        childResource.id = resourceId;
                        childResource.tableFields = childResource.tableFields || resource.tableFields;
                        childResource.tableName = childResource.tableName || resource.tableName;
                        childResource.districtField = childResource.districtField || resource.districtField;
                        childResource.keyWordFields = childResource.keyWordFields || resource.keyWordFields;
                        childResource.keyField = childResource.keyField || resource.keyField;
                        childResource.idKey = childResource.idKey || resource.idKey;
                        childResource.fieldMap = childResource.fieldMap || resource.fieldMap;
                        childResource.sort = childResource.sort || resource.sort;
                        childResource.sumField = childResource.sumField || resource.sumField;
                        resourceSet[resourceId] = childResource;
                    }
                } else {
                    var resourceId = resourceKey;
                    resource.id = resourceId;
                    resourceSet[resourceId] = resource;
                }
            }
            return resourceSet;
        }
    }


    /**
     * 根据事件类型，获取相关联的资源类型树
     * @param eventType
     * @param cb
     * @param ctx
     */
    Service.prototype.getResourceTreeByEventType = function(eventType, cb, ctx) {
        this.getResources(function(err, data) {
            var allList = [];
            var rootId = 'c_root';
            var nodeMap = {},
                matchNodeMap = {},
                filterType = !(eventType == null || eventType == '');
            //
            var index = 0;
            for (var i = 0; i < data.length; i++) {
                var item = data[i],
                    tag = item.tag,
                    itemId = tag.NODEID,
                    tempObj = {};
                nodeMap[itemId] = tempObj;
                tempObj.id = itemId;
                tempObj.name = tag.NAME;
                tempObj.parentId = tag.PARENTID;
                tempObj.resourceTag = tag.NODEKEY || null;
                tempObj.e_orderNum = item.orderNum;
                tempObj.orderNum = tag.ORDERNUM;
                if (item.config) {
                    tempObj.allCount = item.config.ALLTEAMNUM;
                    tempObj.limit = [item.config.NEARBYTEAMNUM, item.config.READYTEANUM];
                    // console.log(JSON.stringify(item),'  ',tempObj.limit)
                }
                if (!filterType || item.type == eventType) {
                    matchNodeMap[itemId] = tempObj;
                }
                allList.push(tempObj);
            }
            //
            var resultMap = {};
            resultMap[rootId] = nodeMap[rootId];
            for (var nodeId in matchNodeMap) {
                var matchNode = matchNodeMap[nodeId];
                handleEachNode(matchNode, resultMap, matchNodeMap, nodeMap);
            }
            var newList = [];
            for (var nId in resultMap) {
                newList.push(resultMap[nId]);
            }
            //排序
            if (eventType == null) {
                //深度优先遍历排序
                var treeData = this.formatTree(newList, {
                    pIdField: 'parentId',
                    idField: 'id'
                });
                visitAndSortByDepth(treeData[0], {
                    idx: 1
                }, nodeMap);
                newList.sort(function(a, b) {
                    return a._order_num - b._order_num;
                });
            } else {
                newList.sort(function(a, b) {
                    var aN = a.e_orderNum || 10000,
                        bN = b.e_orderNum || 10000;
                    return aN - bN;
                });
            }
            // console.log('>>', newList.length);
            cb && cb.call(ctx, null, newList);
        }, this);

        function handleEachNode(node, resultMap, matchMap, fullMap) {
            resultMap[node.id] = node;
            visitParent(node, fullMap, resultMap);
            visitChildren(node, fullMap, resultMap);
        }

        function visitParent(node, fullMap, resultMap) {
            var parent = fullMap[node.parentId];
            if (parent) {
                if (!node.limit && parent.limit) {
                    node.limit = parent.limit;
                }
                ensureOrderNum(node, parent);
                resultMap[parent.id] = parent;
                visitParent(parent, fullMap, resultMap);
            }
        }

        function visitChildren(node, fullMap, resultMap) {
            var nodeId = node.id;
            for (var kk in fullMap) {
                var tempNode = fullMap[kk];
                if (tempNode.parentId == nodeId) {
                    ensureOrderNum(tempNode, node);
                    if (!tempNode.limit && node.limit) {
                        tempNode.limit = node.limit;
                    }
                    resultMap[tempNode.id] = tempNode;
                    visitChildren(tempNode.id, fullMap, resultMap);
                }
            }
        }

        function ensureOrderNum(node, parent) {
            if (isNaN(node.e_orderNum) && !isNaN(parent.e_orderNum)) {
                node.e_orderNum = parent.e_orderNum;
            }
            if (isNaN(node.orderNum) && !isNaN(parent.orderNum)) {
                node.orderNum = parent.orderNum;
            }
        }

        //
        function visitAndSortByDepth(node, obj, fullNodeSet) {
            var nodeTemp = fullNodeSet[node.id] || {};
            nodeTemp._order_num = obj.idx++;
            var children = node.children || [];
            if (children.length > 0) {
                for (var j = 0; j < children.length; j++) {
                    visitAndSortByDepth(children[j], obj, fullNodeSet);
                }
            }
        }
    }

    /**
     * 根据类型获取资源
     * @param eventType
     * @param cb
     * @param ctx
     */
    Service.prototype.getResourcesByEventType = function(eventType, cb, ctx) {
        this.getResourceConfig(function(err, resources) {
            //this.getResourceTreeByEventType(eventType, function (err, data) {
            if (err == null) {
                var resourceNodeMap = {};
                var regex = /^(.*)\_([^\_]*)$/;
                for (var i = 0; i < data.length; i++) {
                    var item = data[i],
                        resourceTag = item.resourceTag;
                    if (resourceTag) {
                        if (regex.test(resourceTag)) {
                            var groups = regex.exec(resourceTag);
                            resourceTag = groups[1] + this.seperator + groups[2];
                        }
                        var resource = resources[resourceTag];
                        if (resource && item.limit) {
                            resource.limit = item.limit;
                        }
                        if (resource) {
                            resource._order_num = item._order_num;
                        }
                        resourceNodeMap[resourceTag] = resource;
                    }
                }
                cb.call(ctx, null, resourceNodeMap);
            } else {
                cb.call(ctx, err);
            }
            //}, this);
        }, this);
    }

    /**
     * 获取事件类型
     * @param cb
     * @param ctx
     */
    Service.prototype.getEventType = function(cb, ctx) {
        if (this.eventTypeList == null) {
            var self = this;
            jQuery.ajax({
                url: this.opts.serverUrl + '/dataOperate/queryMulti',
                dataType: 'json',
                data: {
                    eId: 'safety',
                    data: JSON.stringify({
                        'CODE_EMERGENCY_CLASS': {
                            'query': {},
                            'sort': '_id'
                        }
                    })
                },
                success: function(data) {
                    var data = data.data;
                    var list = data[Object.keys(data)[0]];
                    self.eventTypeList = list;
                    cb && cb.call(ctx, null, list);
                },
                error: function(err) {
                    cb && cb.call(ctx, err);
                }
            });
        } else {
            cb && cb.call(ctx, null, jQuery.extend(true, [], this.eventTypeList));
        }
    }


    /**
     * 获取事件类型信息
     * @param eventType
     * @param cb
     * @param ctx
     */
    Service.prototype.getEventData = function(eventType, cb, ctx) {
        this.getEventType(function(err, data) {
            var obj = null;
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (item && item.tag.TYPECODE === eventType) {
                    obj = item;
                    break;
                }
            }
            cb && cb.call(ctx, null, obj);
        }, this)
    }

    /**
     * 格式化为树形式
     * @param nodes {Array} 节点数组
     * @param opts {Object}
     * @param opts.idField {String} id字段名
     * @param opts.pIdField {String} pId字段名
     */
    Service.prototype.formatTree = function(nodes, opts) {
        if (!(nodes && opts && opts.idField &&
                opts.pIdField)) {
            return null;
        }
        var nodeList = jQuery.extend(true, [], nodes || []),
            idField = opts.idField,
            pIdField = opts.pIdField;
        //
        var nodeMap = {};
        for (var i = 0; i < nodeList.length; i++) {
            var node = nodeList[i];
            var temp = {};
            temp.id = node[idField];
            temp.pId = node[pIdField];
            temp.orig = node;
            nodeMap[temp.id] = temp;
        }
        //
        var treeData = [];
        var visitMap = {};
        for (var k in nodeMap) {
            var node = nodeMap[k];
            if (visitMap.hasOwnProperty(k)) {
                continue;
            }
            visitNode(node, nodeMap, visitMap, treeData);
        }
        return treeData;

        function visitNode(node, nodeMap, visitMap, treeData) {
            if (nodeMap.hasOwnProperty(node.pId)) {
                var parentNode = nodeMap[node.pId];
                if (!visitMap.hasOwnProperty(parentNode.id)) {
                    arguments.callee(parentNode, nodeMap, visitMap, treeData);
                }
                var treeNode = visitMap[parentNode.id];
                var children = treeNode.children || [];
                children.push(node.orig);
                treeNode.children = children;
                visitMap[node.id] = node.orig;
            } else { //is root
                treeData.push(node.orig);
                visitMap[node.id] = node.orig;
            }
        }
    }

    /**
     * 统计资源
     * @param resourceKeys 资源
     * @param filter 过滤条件
     * @param filter.districtCode
     * @param filter.keyword
     * @param callback
     * @param ctx
     */
    Service.prototype.getStatistics = function(resourceKeys, filter, callback, ctx) {
        this.getFilterResources(null, resourceKeys, function(err, resources) {
            var aggregateList = [];
            for (var resourceKey in resources) {
                var resource = resources[resourceKey];
                if (resource) {
                    var aggregateObj = this.getStatisticsAggregate(resources[resourceKey], filter);
                    aggregateList.push(aggregateObj);
                }
            }
            this.statisticsMulti(aggregateList, function(err, data) {
                var resultList = [];
                var total = 0;
                var resourceList = [];
                for (var k in resources) {
                    var r = resources[k];
                    resourceList.push(r);
                }
                //排序
                resourceList.sort(function(a, b) {
                    return a._order_num - b._order_num;
                });
                for (var i = 0; i < resourceList.length; i++) {
                    var resource = resourceList[i] || {},
                        rk = resource.id;
                    var count = (isNaN(data[rk]) || isNaN(parseInt(data[rk]))) ? 0 : parseInt(data[rk]);
                    total += count;
                    var title = resource.title;
                    resultList.push({
                        codeKey: rk,
                        tabTitle: title,
                        tabNumber: count
                    });
                }
                // for (var k in resources) {
                //   var count = (isNaN(data[k]) || isNaN(parseInt(data[k]))) ? 0 : parseInt(data[k]);
                //   total += count;
                //   if (k) {
                //     var title = resources[k].title;
                //     resultList.push({
                //       codeKey: k,
                //       tabTitle: title,
                //       tabNumber: count
                //     });
                //   }
                // }
                callback && callback.call(ctx, null, {
                    total: total,
                    list: resultList
                });
            }, this);
        }, this);
    }

    /**
     *  拼接统计管道
     * @param resource
     * @param opts
     */
    Service.prototype.getStatisticsAggregate = function(resource, opts) {
            var aggregateObj = {},
                resourceId = resource.id,
                tableName = resource.tableName,
                serviceObj = resource.service;
            opts = opts || {};
            var aggregate = [];
            //行政区划过滤
            var districtMatch = this.getDistrictMatch(opts.districtCode, resource);
            if (districtMatch) {
                aggregate.push(districtMatch);
            }
            if (serviceObj.queryParams) {
                var query = serviceObj.queryParams[tableName].query || {};
                aggregate.push({
                    $match: query
                });
            }
            // 支撑配置计数字段
            if (resource.sumField) {
                var or=[];
                var gte = {};
                gte["tag." + resource.sumField] = {
                    "$gte":0,
                }
                or.push(gte);
                var lte = {};
                lte["tag." + resource.sumField] = {
                    "$lte":0,
                }
                or.push(lte);
                aggregate.push({
                    $match:{
                        "$or": or 
                    }
                },);
                aggregate.push({
                    $project:{
                        "type":"$_id",
                        "num":"$tag." + resource.sumField,
                    }
                });
                aggregate.push({
                    "$group":{
                        "_id":null,
                        "_count":{
                            "$sum":"$num"
                        }
                    }
                });
            } else {
                aggregate.push({
                    $count: '_count'
                });
            }
            aggregateObj.aggregate = aggregate;
            aggregateObj.query = {};
            aggregateObj.searchId = resourceId;
            aggregateObj.dataSetId = tableName;
            aggregateObj.queryIndex = 1;
            return aggregateObj;
        }
        /**
         * 查询列表数据
         * @param opts
         * @param opts.resourceKey
         * @param opts.flatTag 是否平铺tag属性
         * @param opts.fields 字段列表（筛选字段）
         * @param [opts.geometry] 几何对象（geojson）
         * @param [opts.keyWord] 关键字
         * @param [opts.districtCode] 行政区划编码,以逗号隔开
         * @param callback
         * @param ctx
         */
    Service.prototype.getMapDataList = function(opts, callback, ctx) {
        var self = this;
        this.getResourceConfig(function(err, resources) {
            if (err == null) {
                var resource = resources[opts.resourceKey];
                var param = {};
                if (resource) {
                    var serviceObj = resource.service;
                    var tableName = resource.tableName;
                    var config = this.getSelectColumn(resource, opts.fields);
                    var fieldProject = config.fieldProject;
                    var query = {};
                    query.$and = [];
                    if (opts.geometry) {
                        var geom = {
                            $geoIntersects: {
                                $geometry: opts.geometry,
                            },
                        };
                        query.$and.push({ geom: geom });
                    }
                    if (serviceObj.queryParams) {
                        var con = serviceObj.queryParams[tableName].query || {};
                        query.$and.push(con);
                    }
                    if (opts.districtCode) {
                        var districtMatch = this.getDistrictMatch(opts.districtCode, resource);
                        var $or = districtMatch.$match;
                        query.$and.push($or);
                    }
                    if (opts.keyWord) {
                        var keywordMatch = this.getSearchMatch(opts.keyWord, resource);
                        query.$and.push(keywordMatch.$match);
                    }
                    if (query.$and.length === 0) {
                        delete query.$and;
                    }
                    param[tableName] = {
                            query: query,
                            select: config.select
                        }
                        // query = {
                        //   $and:[
                        //     {
                        //       name:'1',
                        //     },
                        //     {
                        //       $or:[]
                        //     },
                        //     {

                    //     }
                    //   ]
                    // }

                    $.ajax({
                        url: this.opts.serverUrl + '/dataOperate/queryMulti',
                        dataType: 'json',
                        type: 'post',
                        data: {
                            eId: 'safety',
                            data: JSON.stringify(param),
                        },
                        success: function(data) {
                            var res = self.formatResultColumns(data.data[tableName], fieldProject)
                            callback && callback.call(ctx, null, res);
                        },
                        error: function(err) {
                            callback && callback.call(ctx, err);
                        }
                    });
                }
            } else {
                callback.call(ctx, err);
            }
        }, this);
    }

    Service.prototype.formatResultColumns = function(data, fieldProject) {
        var self = this;
        data.forEach(function(element) {
            element = self.flatObject(element);
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
    Service.prototype.flatObject = function(element) {
        var tag = element.tag;
        if (tag) {
            for (var key in tag) {
                if (tag.hasOwnProperty(key)) {
                    var value = tag[key];
                    element[key] = value;
                }
            }
            delete element.tag;
        }
        return element;
    }
    Service.prototype.getSelectColumn = function(resource, fields) {
            var fieldMap = resource.fieldMap;
            var fieldProject = {};
            var selectArr = [];
            selectArr.push("_id");
            selectArr.push("geom");
            for (var key in fieldMap) {
                if (fieldMap.hasOwnProperty(key)) {
                    var originField = key;
                    var projectedField = fieldMap[key]
                    if (fields.includes(projectedField)) {
                        fieldProject[originField] = projectedField;
                        selectArr.push("tag." + originField);
                    }
                }
            }
            var result = {};
            result.select = selectArr.join(" ");
            result.fieldProject = fieldProject;
            return result;
        }
        /**
         * 查询列表数据
         * @param opts
         * @param opts.resourceKey，多个逗号分隔
         * @param opts.pageSize
         * @param opts.pageIndex
         * @param opts.districtCode 政区过滤编码
         * @param opts.keyword 关键字-预留参数
         * @param opts.flatTag 是否平铺tag属性
         * @param opts.fields 字段列表（筛选字段）
         * @param opts.id 主键筛选
         * @param opts.filter
         * @param callback
         * @param ctx
         */
    Service.prototype.getDataList = function(opts, callback, ctx) {
        if (opts.keyword) {
            var fbsArr = ["\\", "$", "(", ")", "*", "+", ".", "[", "]", "?", "^", "{", "}", "|"];
            for (var key in fbsArr) {
                if (opts.keyword.indexOf(fbsArr[key]) != -1) {
                    opts.keyword = opts.keyword.replace(fbsArr[key], "\\" + fbsArr[key]);
                }
            }
        }
        opts.filter = opts.filter || {};
        this.getResourceConfig(function(err, resources) {
            if (err == null) {
                var resourceList = [],
                    resourceKey = opts.resourceKey,
                    resourceKeyList = resourceKey.split(',');
                var aggregateList = [];
                for (var i = 0; i < resourceKeyList.length; i++) {
                    var resource = resources[resourceKeyList[i]];
                    if (resource) {
                        var aggregateObj = this.getAllListAggregate(resource, {
                            pageSize: opts.pageSize,
                            pageIndex: opts.pageIndex,
                            flatTag: opts.flatTag,
                            districtCode: opts.districtCode,
                            keyword: opts.keyword,
                            fields: opts.fields,
                            id: opts.id,
                        });
                        var resourceFilter = opts.filter[resourceKeyList[i]];
                        if (resourceFilter) {
                            if (aggregateObj.query && Object.keys(aggregateObj.query).length >0){
                                aggregateObj.query = {
                                    $and: [
                                        aggregateObj.query,
                                        resourceFilter
                                    ]
                                };
                            } else {
                                aggregateObj.query = resourceFilter;
                            }
                        }
                        aggregateList.push(aggregateObj);
                    }
                }
                this.aggregateMulti(aggregateList, null, function(err, data) {
                    if (err == null) {
                        var resultSet = {};
                        for (var k in data) {
                            try {
                                var itemData = data[k];
                                resultSet[k] = itemData[Object.keys(itemData)[0]];
                            } catch (e) {}
                        }
                        callback.call(ctx, null, resultSet);
                    } else {
                        callback.call(ctx, err);
                    }
                }, this);

            } else {
                callback.call(ctx, err);
            }
        }, this);
    }

    /**
     * 拼接查询管道
     * @param resource
     * @param opts
     */
    Service.prototype.getAllListAggregate = function(resource, opts) {
        var aggregateObj = {},
            resourceId = resource.id,
            tableName = resource.tableName,
            serviceObj = resource.service,
            pageSize = opts.pageSize,
            pageIndex = opts.pageIndex,
            flatTag = !!opts.flatTag,
            skipVal = null,
            limitVal = null;
        if (pageSize !== null && pageSize !== '' && pageIndex !== null && pageIndex !== '') {
            pageSize = parseInt(pageSize);
            pageIndex = parseInt(pageIndex);
            skipVal = (pageIndex - 1) * pageSize;
            // limitVal = pageSize * (1 + pageIndex);
            limitVal = pageSize;
        } else {
            //todo 暂时最多查询
            limitVal = 50 * 1000;
        }
        var aggregate = [];
        //灾情信息员
        if (resource.id === 'JC_DISINFOPER※01' ||
            resource.id === 'BAS_bas_school' || resource.id === 'BAS_shelter') {
            aggregate.push({
                $limit: 10000
            });
        }
        //行政区划过滤
        var districtMatch = this.getDistrictMatch(opts.districtCode, resource);
        if (districtMatch) {
            aggregate.push(districtMatch);
        }
        //关键字过滤
        var kwMatch = this.getSearchMatch(opts.keyword, resource);
        if (kwMatch) {
            aggregate.push(kwMatch);
        }
        if (serviceObj.queryParams) {
            var query = serviceObj.queryParams[tableName].query || {};
            aggregate.push({
                $match: query
            });
        }
        if (opts.id) {
            aggregate.push(this.getIdMatch(opts.id, resource.idKey));
        }
        if (resource.sort) {
            aggregate.push({
                $sort: resource.sort
            });
        }
        if (!isNaN(skipVal) && skipVal != null) {
            aggregate.push({
                $skip: skipVal
            });
        }
        if (!isNaN(limitVal) && limitVal != null) {
            aggregate.push({
                $limit: limitVal
            });
        }
        var fieldMap = resource.fieldMap,
            project = {},
            projectSuffix = flatTag ? '' : 'tag.';
        for (var field in fieldMap) {
            if (Object.prototype.toString.call(fieldMap[field]) == '[object Object]') {
                var lookUpObj = fieldMap[field],
                    lookupAlias = field + '_rel';
                var as = lookUpObj.as;
                if (opts.fields) {
                    if (opts.fields.includes(as)) {
                        lookUpObj.as = lookupAlias;
                        aggregate.push({
                            $lookup: lookUpObj
                        });
                        aggregate.push({
                            $unwind: {
                                "path": "$" + lookupAlias,
                                "preserveNullAndEmptyArrays": true
                            }
                        });
                        var _key = as ? as : field
                        project[projectSuffix + _key] = '$' + lookupAlias + '.tag.' + field;
                    }
                } else {
                    lookUpObj.as = lookupAlias;
                    aggregate.push({
                        $lookup: lookUpObj
                    });
                    aggregate.push({
                        $unwind: {
                            "path": "$" + lookupAlias,
                            "preserveNullAndEmptyArrays": true
                        }
                    });
                    var _key = as ? as : field
                    project[projectSuffix + _key] = '$' + lookupAlias + '.tag.' + field;
                }
            } else {
                project[projectSuffix + fieldMap[field]] = '$tag.' + field;
            }
        }
        //对字段进行自定义筛选
        if (opts.fields) {
            for (var key in project) {
                if (project.hasOwnProperty(key)) {
                    if (!opts.fields.includes(key)) {
                        delete project[key];
                    }
                }
            }
        }
        project['geom'] = '$geom';
        aggregate.push({
            $project: project
        });

        aggregateObj.aggregate = aggregate;
        aggregateObj.query = {};
        aggregateObj.searchId = resourceId;
        aggregateObj.dataSetId = tableName;
        aggregateObj.queryIndex = 1;
        return aggregateObj;
    }

    /**
     * 拼接行政区划条件
     * @param districtCode
     * @param resource
     * @param resource.districtField 行政区划字段名
     * @param resource.districtKey 可选，默认为空
     */
    Service.prototype.getDistrictMatch = function(districtCode, resource) {
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
        } else {}
        return match;

        function getDistrictRegex(code) {
            var c = code.substr(0, 6);
            if ('000000' == c) { //全国不过滤
                c = '.*';
            } else if (/^\d{2}0000$/.test(c)) {
                c = c.substr(0, 2) + '.*';
            } else if (/^\d{4}00$/.test(c)) {
                c = c.substr(0, 4) + '.*';
            } else if (/^\d{6}$/.test(c)) {
                c = c.substr(0, 6) + '.*';
            }
            return '^' + c + '$';
        }
    }


    /**
     * 根据政区等获取数据id--暂时用于物资/储备库、战勤基地/装备的过滤
     * @param opts
     * @param opts.districtCode
     * @param opts.tables
     * @param opts.tables[n].tableName
     * @param opts.tables[n].districtField 行政区划字段名
     * @param callback
     * @param ctx
     * @private
     */
    Service.prototype.getRecordIdListByFilter = function(opts, callback, ctx) {
        opts = opts || {};
        var tables = opts.tables || [],
            tableCount = tables.length,
            districtCode = opts.districtCode;
        var aggregateList = [];
        for (var i = 0; i < tableCount; i++) {
            var tableObj = tables[i];
            var aggregateObj = {},
                aggregate = [];
            var districtMatch = this.getDistrictMatch(districtCode, tableObj);
            if (districtMatch) {
                aggregate.push(districtMatch);
            }
            aggregate.push({
                $project: {
                    "_id": "$_id"
                }
            });
            aggregateObj.aggregate = aggregate;
            aggregateObj.query = {};
            aggregateObj.searchId = i;
            aggregateObj.dataSetId = tableObj.tableName;
            aggregateList.push(aggregateObj);
        }
        if (aggregateList.length == 0) {
            callback.call(ctx, null, []);
        } else {
            this.aggregateMulti(aggregateList, null, function(err, data) {
                var resultList = [];
                for (var i = 0; i < tableCount; i++) {
                    var itemResult = data[i] || {},
                        itemList = itemResult[Object.keys(itemResult)[0]];
                    var idList = [];
                    for (var j = 0; j < itemList.length; j++) {
                        idList.push(itemList[j]._id);
                    }
                    resultList.push({
                        tableName: tables[i].tableName,
                        idList: idList
                    });
                }
                callback.call(ctx, null, resultList);
            }, this);
        }
    }

    /**
     * 拼接关键字条件--预留方法
     * @param kw
     * @param resource
     */
    Service.prototype.getSearchMatch = function(kw, resource) {
            if (kw) {
                var query = {};
                var filter = {};
                filter['$regex'] = "^.*" + kw + ".*$";
                query[resource.keyWordFields] = filter;
                var kwquery = {
                    $match: query
                };
                return kwquery;
            } else {
                return null;
            }
        }
        /**
         * 主键（id）筛选
         * @param id
         * @param [idField]
         */
    Service.prototype.getIdMatch = function(id, idField) {
            if (!idField) {
                idField = '_id';
            }
            if (id) {
                var query = {};
                var filter = {};
                filter['$regex'] = "^" + id + "$";
                query[idField] = filter;
                var idquery = {
                    $match: query
                };
                return idquery;
            } else {
                return null;
            }
        }
        /**
         * 多个管道执行方法-公共
         * @param aggregateList 管道列表
         * @param cb
         * @param ctx
         * @returns {*}
         */
    Service.prototype.aggregateMulti = function(aggregateList, options, cb, ctx) {
            var opts = {},
                data = {};
            var searchid = null;
            var datasetid = null;
            if (aggregateList.length === 1) {
                var agregate = aggregateList[0];
                searchid = agregate.searchId;
                datasetid = agregate.dataSetId;
            }
            if (options) {
                aggregateList.forEach(function(element) {
                    Object.assign(element, options);
                });
                // Object.assign(data, options);
            }
            if (options && options.near) {
                opts.url = this.opts.serverUrl + '/dataStatics/aggregatePageNear';
            } else {
                opts.url = this.opts.serverUrl + '/dataStatics/aggregateMulti';
            }

            opts.dataType = 'json';
            opts.type = 'POST';
            data.data = JSON.stringify(aggregateList);
            data.eId = 'safety';
            opts.data = data;
            opts.success = function(d) {
                var data = d.data;
                let result = {};
                if (Array.isArray(data) && searchid && datasetid) {
                    result[searchid] = {};
                    result[searchid][datasetid] = data;
                } else {
                    result = data;
                }
                cb && cb.call(ctx, null, result);
            }
            opts.error = function(err) {
                cb && cb.call(ctx, new Error(err));
            }
            return jQuery.ajax(opts);
        }
        /**
         * 多个管道统计
         * @param aggregateList
         * @param cb
         * @param ctx
         */
    Service.prototype.statisticsMulti = function(aggregateList, cb, ctx) {
        this.aggregateMulti(aggregateList, null, function(err, data) {
            for (var k in data) {
                var item = data[k],
                    itemData = item[Object.keys(item)[0]];
                if (itemData.length == 0) {
                    data[k] = 0;
                } else {
                    data[k] = itemData[0]._count;
                }
            }
            cb && cb.call(ctx, null, data);
        }, this);
    }


    /**
     * 周边列表查询
     * @param opts
     * @param opts.eventType 事件类型
     * @param opts.resourceKeys 资源key值
     * @param opts.pageSize
     * @param opts.pageIndex
     * @param opts.districtCode
     * @param opts.point
     * @param opts.buffer
     * @param opts.config
     * @param opts.config.limit {Array/Number} 可选 返回记录的限制数 数组或者数字，数组形式对应救援力量的[就近数，增援数]
     * @param opts.config.radius {Number} 可选 查询半径
     * @param opts.config.idList {Array} 可选 id数组，用于过滤
     * @param opts.flatTag
     * @param callback
     * @param ctx
     */
    Service.prototype.getNearbyList = function(opts, callback, ctx) {
        var eventType = opts.eventType,
            config = opts.config || {};
        this.getFilterResources(eventType, opts.resourceKeys, function(err, resources) {
            if (err == null) {
                var aggregateList = [];
                for (var resourceKey in resources) {
                    var resourceObj = resources[resourceKey],
                        thisConfig = config[resourceKey] || {};
                    if (resourceObj.id.indexOf('v_equipment') != -1 || !opts.point) {
                        var aggregateObj = this.getAllListAggregate(resourceObj, {
                            pageSize: opts.pageSize,
                            pageIndex: opts.pageIndex,
                            flatTag: opts.flatTag,
                            districtCode: opts.districtCode,
                            keyword: opts.Keyword
                        });
                    } else {
                        var aggregateObj = this.getNearbyAggregate(resourceObj, {
                            pageSize: opts.pageSize,
                            pageIndex: opts.pageIndex,
                            limit: thisConfig.limit || resourceObj.limit,
                            buffer: opts.buffer,
                            radius: thisConfig.radius,
                            point: opts.point,
                            flatTag: !!opts.flatTag,
                            Keyword: opts.Keyword,
                            districtCode: opts.districtCode
                        });
                    }
                    aggregateList.push(aggregateObj);
                }
                var options = {};
                if (opts.pageSize && opts.pageIndex) {
                    options.pageIndex = opts.pageIndex;
                    options.pageSize = opts.pageSize;
                    options.paging = true;
                }
                if (opts.point) {
                    options.near = JSON.stringify(opts.point);
                    options.distanceField = 'dis';
                }
                this.aggregateMulti(aggregateList, options, function(err, data) {
                    if (err == null) {
                        var resultSet = {},
                            resultArr = [],
                            total = 0;
                        for (var rk in data) {
                            var itemObj = data[rk],
                                itemList = itemObj[Object.keys(itemObj)[0]] || [],
                                itemConfig = config[rk] || {},
                                limit = itemConfig.limit || resourceObj.limit;
                            total += itemList.length;
                            // var listArr = [];
                            // listArr.push(itemList.slice(0, limit[0]));
                            // listArr.push(itemList.slice(limit[0]));
                            var resultObj = {};
                            resultObj.data = itemList;
                            resultObj.codeKey = rk;
                            resultObj.tabTitle = resources[rk].title;
                            resultObj.limit = limit;
                            resultObj.radius = itemConfig.radius;
                            resultObj.tabNumber = itemList.length;
                            resultArr.push(resultObj);
                        }
                        resultSet.list = resultArr;
                        resultSet.total = total;
                        callback.call(ctx, null, resultSet);
                    } else {
                        callback.call(ctx, err);
                    }

                }, this);
            } else {
                callback.call(ctx, err);
            }
        }, this);
    }


    /**
     * 拼接周边查询管道
     * @param resource
     * @param opts
     * @param opts.buffer 缓冲区
     * @param opts.point 中心点
     * @param opts.radius 缓冲半径
     * @param opts.limit {Array[2]}
     * @param opts.idList Id过滤数组
     * @param opts.flatTag
     */
    Service.prototype.getNearbyAggregate = function(resource, opts) {
        var aggregateObj = {},
            resourceId = resource.id,
            tableName = resource.tableName,
            flatTag = !!opts.flatTag,
            serviceObj = resource.service;
        pageSize = opts.pageSize,
            pageIndex = opts.pageIndex,
            skipVal = null,
            limitVal = null;

        if (pageSize !== null && pageSize !== '' && pageIndex !== null && pageIndex !== '') {
            pageSize = parseInt(pageSize);
            pageIndex = parseInt(pageIndex);
            skipVal = (pageIndex - 1) * pageSize;
            // limitVal = pageSize * (1 + pageIndex);
            limitVal = pageSize;
        } else {
            //todo 暂时最多查询
            limitVal = 50 * 1000;
        }
        var aggregate = [];
        //geonear
        var geoNear = {};
        geoNear.limit = 1000 * 1000;
        geoNear.maxDistance = opts.radius ? parseFloat(opts.radius) : 5000 * 1000;
        geoNear.spherical = true;
        geoNear.near = {
            type: 'Point',
            coordinates: opts.point
        };
        geoNear.includeLocs = "geom";
        geoNear.distanceField = "dis";
        // if(opts.point){
        //   aggregate.push({
        //     $geoNear: geoNear
        //   });
        // }
        //geometry 过滤
        if (opts.buffer) {
            aggregate.push({
                $match: {
                    "geom": {
                        "$geoIntersects": {
                            "$geometry": opts.buffer
                        }
                    }
                }
            });
        }
        if (opts.Keyword) { //关键字过滤
            var query = {};
            var filter = {};
            filter['$regex'] = "^.*" + opts.Keyword + ".*$";
            query[resource.keyWordFields] = filter;
            aggregate.push({
                $match: query
            });
        }
        //行政区划过滤
        var districtMatch = this.getDistrictMatch(opts.districtCode, resource);
        if (districtMatch) {
            aggregate.push(districtMatch);
        }
        if (serviceObj.queryParams) {
            var query = serviceObj.queryParams[tableName].query || {};
            aggregate.push({
                $match: query
            });
        }
        // if (!isNaN(skipVal) && skipVal != null) {
        //   aggregate.push({
        //     $skip: skipVal
        //   });
        // }
        // if (!isNaN(limitVal) && limitVal != null) {
        //   aggregate.push({
        //     $limit: limitVal
        //   });
        // }     
        var project = this.parseProject(aggregate, resource.fieldMap, flatTag);
        project['geom'] = '$geom';
        project['dis'] = '$dis';
        aggregate.push({
            $project: project
        });
        // if (Object.prototype.toString.call(opts.limit) == '[object Array]' && opts.limit.length == 2) {
        //   aggregate.push({
        //     $limit: opts.limit[0] + opts.limit[1]
        //   });
        // } else if (!isNaN(opts.limit)) {
        //   aggregate.push({
        //     $limit: parseInt(opts.limit)
        //   });
        // }    

        aggregateObj.aggregate = aggregate;
        aggregateObj.query = {};
        aggregateObj.searchId = resourceId;
        aggregateObj.dataSetId = tableName;
        aggregateObj.queryIndex = 1;
        return aggregateObj;
    }

    /**
     * 过滤获取列表
     * @param queryResources
     * @param queryResources[key].idList {Array}
     * @param queryResources[key].districtCode 行政区划编码，多个逗号分隔
     * @param callback
     * @param ctx
     */
    Service.prototype.getListByFilter = function(queryResources, callback, ctx) {
        var resourceKeys = Object.keys(queryResources || {});
        this.getFilterResources(null, resourceKeys, function(err, resources) {
            var aggregateList = [];
            for (var rk in queryResources) {
                var resource = resources[rk],
                    qResource = queryResources[rk];
                var aggregateObj = this.getListByFilterAggregate(resource, {
                    idList: qResource.idList,
                    flatTag: false,
                    districtCode: qResource.districtCode
                });
                aggregateList.push(aggregateObj);
            }
            this.aggregateMulti(aggregateList, null, function(err, resultSet) {
                var resultList = [];
                for (var resultKey in resultSet) {
                    var resultObj = resultSet[resultKey] || {},
                        tempObj = {};
                    tempObj.codeKey = resultKey;
                    tempObj.data = resultObj[Object.keys(resultObj)[0]];
                    tempObj.tabTitle = resources[resultKey].title;
                    tempObj.tabNumber = tempObj.data.length;
                    resultList.push(tempObj);
                }
                callback.call(ctx, null, resultList);
            }, this);
        }, this);
    }

    /**
     *
     * @param resource
     * @param opts
     * @param opts.idList
     * @param opts.flatTag
     * @returns {{}}
     */
    Service.prototype.getListByFilterAggregate = function(resource, opts) {
        var aggregateObj = {},
            resourceId = resource.id,
            tableName = resource.tableName,
            flatTag = !!opts.flatTag,
            serviceObj = resource.service;
        var aggregate = [];
        //传递的id
        if (opts.idList && opts.idList.length > 0) {
            aggregate.push({
                $match: {
                    _id: {
                        $in: opts.idList
                    }
                }
            });
        }
        //行政区划过滤
        var districtMatch = this.getDistrictMatch(opts.districtCode, resource);
        if (districtMatch) {
            aggregate.push(districtMatch);
        }
        if (serviceObj.queryParams) {
            var query = serviceObj.queryParams[tableName].query || {};
            aggregate.push({
                $match: query
            });
        }
        var project = this.parseProject(aggregate, resource.fieldMap, flatTag);
        project['geom'] = '$geom';
        project['dis'] = '$dis';
        aggregate.push({
            $project: project
        });
        aggregateObj.aggregate = aggregate;
        aggregateObj.query = {};
        aggregateObj.searchId = resourceId;
        aggregateObj.dataSetId = tableName;
        return aggregateObj;
    }

    /**
     *  获取指定事件类型关联的资源
     * @param eventType 事件类型
     * @param resourceKeys {Array} 匹配的资源key
     * @param callback
     * @param ctx
     * @private
     */
    Service.prototype.getFilterResources = function(eventType, resourceKeys, callback, ctx) {
        // this.getResourcesByEventType(eventType, function (err, resources) {
        //   var resourceKeyMatches = resourceKeys,
        //     matchLength = resourceKeyMatches.length,
        //     resourceMap = {};
        //   for (var resourceKey in resources) {
        //     var flag = false;
        //     for (var j = 0; j < matchLength; j++) {
        //       if (resourceKey.indexOf(resourceKeyMatches[j]) == 0) {
        //         flag = true;
        //         break;
        //       }
        //     }
        //     if (flag) {
        //       resourceMap[resourceKey] = resources[resourceKey];
        //     }
        //   }
        //   callback.call(ctx, null, resourceMap);
        // }, this);
        this.getResourceConfig(function(err, resources) {
            if (err == null) {
                var resourceNodeMap = {};
                for (var i = 0; i < resourceKeys.length; i++) {
                    var resourceTag = resourceKeys[i];
                    if (resourceTag) {
                        var resource = resources[resourceTag];

                        resourceNodeMap[resourceTag] = resource;
                    }
                }
                callback.call(ctx, null, resourceNodeMap);
            } else {
                callback.call(ctx, err);
            }
        }, this);
    }

    /**
     * 拼接project
     * @param aggregate
     * @param fieldMap
     * @param flatTag
     * @returns {{}}
     */
    Service.prototype.parseProject = function(aggregate, fieldMap, flatTag) {
        var project = {},
            projectSuffix = flatTag ? '' : 'tag.';
        for (var field in fieldMap) {
            if (Object.prototype.toString.call(fieldMap[field]) == '[object Object]') {

                var lookUpObj = fieldMap[field],
                    lookupAlias = field + '_rel';

                var as = lookUpObj.as;
                lookUpObj.as = lookupAlias;
                aggregate.push({
                    $lookup: lookUpObj
                });
                aggregate.push({
                    $unwind: {
                        "path": "$" + lookupAlias,
                        "preserveNullAndEmptyArrays": true
                    }
                });
                var _key = as ? as : field
                project[projectSuffix + _key] = '$' + lookupAlias + '.tag.' + field;
            } else {
                project[projectSuffix + fieldMap[field]] = '$tag.' + field;
            }
        }
        return project;
    }

    window.EMapServerV2 = window.EMapServerV2 || {};
    window.EMapServerV2.CommonService = Service;
})(window);
