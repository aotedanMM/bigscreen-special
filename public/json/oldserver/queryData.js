(function (window) {
    window.EMapServerV2 = window.EMapServerV2 || {};
    // 参考
    window.EMapServerV2.queryData = {};
    window.EMapServerV2.queryData.getConfig = function (cb) {
        var self = this;
        $.ajax({
            url: './json/oldserver/queryData/resourceQueryConfig.json',
            dataType: "json",
            success: function (resourceConfig) {
                self.service = new window.EMapServerV2.bufferService({
                    server: EMAP_CONFIG.common.mongoService,
                    resourceConfig: resourceConfig
                });
                cb&&cb();
            }
        })
        $.ajax( "./json/oldserver/queryData/equTableCorCode.json").then(function (data) {
            self.equTableAndCodeConfig = data;
        })
    }
    /**
     * 通过缓冲区查询
     * @param param
     */
    window.EMapServerV2.queryData.bufferOrPolygonQuery = function (param, callBack) {
        var self = this;
        self.service.bufferOrPolygonQuery(param, function (err, data) {
            if (err == null) {
                $("#loadingnewoverlay").hide();
                self.addTypeNameToEqu(data);
                callBack(data);
            } else {
                $("#loadingnewoverlay").hide();
                console.error(err)
            }
        })
    }
    /**
     * 装备的返回数据添加装备类型
     */
    window.EMapServerV2.queryData.addTypeNameToEqu = function (data) {
        var self = this;
        if ($(".requeryBox-inner-tap1").find(".active").attr("listcode") == 2) {//当展示装备列表时
            for (var key in data) {
                var EquInfArr = data[key];
                for (var i = 0; i < EquInfArr.length; i++) {
                    var tagInf = EquInfArr[i];
                    var equTypeCode = "";
                    if (tagInf.hasOwnProperty("EQUIPTYPECODE")) {
                        equTypeCode = tagInf.EQUIPTYPECODE;
                    } else {
                        var equTableNameConfig = self.equTableAndCodeConfig;
                        a: for (var keyTwo in equTableNameConfig) {
                            if (equTableNameConfig[keyTwo].code == tagInf.table_name) {
                                equTypeCode = keyTwo;
                                break a;
                            }
                        }
                    }
                    var equTypeName = G.equConfigInf.equContrast[equTypeCode];
                    tagInf.EQUIPTYPENAME = equTypeName;
                }
            }
        }
    }

    /**
     * 通过缓冲区查询
     * @param param
     */
    window.EMapServerV2.queryData.queryDataByBuffer = function (param, callBack) {
        var self = this;
        self.service.bufferOrPolygonQuery(param, function (err, data) {
            if (err == null) {
                callBack(data);
                // console.log(data)
            } else {
                // console.error(err)
            }
        })

    }
    /**
     * 行政区划查询
     * @param param
     */
    window.EMapServerV2.queryData.queryDataByDis = function (param, callBackFun) {
        var self = this;
        //行政区划查询
        // var param = {
        //     //1=队伍 2=装备 …… 跟原来一致
        //     "resources": [1],
        //     "point": point,
        //     "districtCode": "530000",//多个逗号分隔
        //     "keyword": "大"
        // }
        self.service.districtQuery(param, function (err, data) {
            if (err == null) {
                // console.log(data);
                callBackFun(data);
            } else {
                // console.error(err)
            }
        })
    }
    /**
     * 查询详情
     * @param param
     * @param callBack
     */
    window.EMapServerV2.queryData.queryDetail = function (param, callBack) {
        var self = this;
        //查询详情
        // var param = {
        //     tableName: "EQUIP_EQU_WATERTANKCAR",
        //     dataId: "RFSGXFBU0001"
        // }
        // var param = {
        //     tableName: param.tableName,
        //     dataId: param.dataId
        // }
        self.service.queryDetail(param, function (err, data) {
            if (err == null) {
                if (data.equTable) {
                    self.getRelevnceEquTypeName(data.equTable);
                }
                callBack(data);
            } else {
                console.error(err)
            }
        });
    }
    /**
     * 救援队关联装备的装备类型
     */
    window.EMapServerV2.queryData.getRelevnceEquTypeName = function (data) {
        var self = this;
        for (var key in data) {
            var EquInfArr = data[key];
            for (var i = 0; i < EquInfArr.length; i++) {
                var tagInf = EquInfArr[i].tag;
                var equTypeCode = "";
                if (tagInf.hasOwnProperty("EQUIPTYPECODE")) {
                    equTypeCode = tagInf.EQUIPTYPECODE;
                } else {
                    var equTableNameConfig = self.equTableAndCodeConfig;
                    a: for (var keyTwo in equTableNameConfig) {
                        if (equTableNameConfig[keyTwo].code == key) {
                            equTypeCode = keyTwo;
                            break a;
                        }
                    }
                }
                var equTypeName = G.equConfigInf.equContrast[equTypeCode];
                tagInf.EQUIPTYPENAME = equTypeName;
            }
        }
    }
    /**
     *装备的详情框
     */
    window.EMapServerV2.queryData.queryEquDetail = function (param, callBack) {
        var self = this;
        self.service.queryEquDetail(param, function (err, data) {
            if (err == null) {
                for (var key in param) {
                    self.getDetailEquTypeName(data, key);
                    callBack(data);
                }
            } else {
                console.error(err)
            }
        });
    }

    /**
     * 装备的详情框的装备类型转换
     * @param param
     * @param callBackFun
     */
    window.EMapServerV2.queryData.getDetailEquTypeName = function (data, tableName) {
        var self = this;
        var tagInf = data[0].tag;
        var equTypeCode = "";
        for (var key in tagInf) {
            if (key == "EQUIPTYPECODE") {
                equTypeCode = tagInf[key];
            }
        }
        if (!equTypeCode) {
            var equTableNameConfig = self.equTableAndCodeConfig;
            a: for (var keyTwo in equTableNameConfig) {
                if (equTableNameConfig[keyTwo].code == tableName) {
                    equTypeCode = keyTwo;
                    break a;
                }
            }
        }
        var equTypeName = G.equConfigInf.equContrast[equTypeCode];
        var newTypeName = "";
        if (equTypeName && equTypeName != "-") {//如果能在类型字典表找到名称
            newTypeName = equTypeName;
        } else {//之前表中有code表示name的
            newTypeName = equTypeCode;
        }
        tagInf.EQUIPTYPENAME = newTypeName;
    }
    //获取救援队类型
    window.EMapServerV2.queryData.queryTree = function (param, callBackFun) {
        var self = this;
        this.getConfig(function(){
            var param = {
                resources: [1, 2]
            };
            self.service.getTypeList(param, function (err, data) {
                if (err == null) {
                    callBackFun &&callBackFun(data);
                } else {
                }
            })
        });
    };
    //查询关联装备
    window.EMapServerV2.queryData.queryEquById = function (param, callBackFun) {
        var self = this;
        self.service.getTypeList(param, function (err, data) {
            if (err == null) {
                console.log('获取救援队类型 ', data);
                callBackFun(data);
            } else {
                console.error(err)
            }
        })
    };
    //查询所有装备的展示字段
    window.EMapServerV2.queryData.queryAllEquField = function (param, callBackFun) {
        var self = this;
        self.service.queryAllField(param, function (data) {
            callBackFun(data);
        })
    };
})(window);    