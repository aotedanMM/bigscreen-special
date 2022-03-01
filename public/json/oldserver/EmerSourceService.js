(function(window) {
    var Service = function(opts) {
        var options = {
            //资源类型
            resourceKeys: [
                'RescueTeam※03', //救援队
                'floodteam',
                'fireteam',
                'transportationteam',
                'forestfireteam',
                'hazardousteam',
                'mineteam',
                'nonmineteam',
                'corecompetenceteam',
                'transportationteam',
                'powerteam',
                'mobileteam',
                'gasteam',
                'environmentteam',
                'salvageteam',
                'searescueteam',
                'shipspillteam',
                'healthyteam',
                'portrescueteam',
                'portpassengerteam',
                'portconstructionteam',
                'buildingemergencyteam',
                'passengeremergencyteam',
                'emergencytransportteam',
                'snowteam',
                'equipteam',
                'civilianteam',
                'equipment', //救援装备
                'v_equipment※02',
                'v_equipment※03',
                'v_equipment※04',
                'v_equipment※05',
                'v_equipment※06',
                'v_equipment※07',
                'v_equipment※08',
                'v_equipment※09',
                'v_equipment※10',
                'v_equipment※11',
                'v_equipment※12',
                'v_equipment※13',
                'v_equipment※14',
                'v_equipment※15',
                'v_equipment※16',
                'v_equipment※17',
                'v_equipment※18',
                'v_equipment※19',
                'v_equipment※20',
                'v_equipment※21',
                'v_equipment※22',
                'v_equipment※23',
                'v_equipment※24',
                'v_equipment※25',
                'v_equipment※26',
                'v_equipment※27',
                'v_equipment※28',
                'v_equipment※29',
                'v_equipment※30',
                'v_equipment※31',
                'v_equipment※32',
                'v_equipment※33',
                'v_equipment※34',
                'v_equipment※35',
                'v_equipment※36',
                'v_equipment※37',
                'v_equipment※38',
                'v_equipment※39',
                'v_equipment※40',
                'v_equipment※41',
                'v_equipment※42',
                'v_equipment※43',
                'v_equipment※44',
                'v_equipment※45',
                'v_equipment※46',
                'v_equipment※47',
                'v_equipment※48',
                'v_equipment※49',
                'v_equipment_list※01', //救援装备
                'v_equipment_list※02',
                'v_equipment_list※03',
                'v_equipment_list※04',
                'v_equipment_list※05',
                'v_equipment_list※06',
                'v_equipment_list※07',
                'v_equipment_list※08',
                'v_equipment_list※09',
                'v_equipment_list※10',
                'v_equipment_list※11',
                'v_equipment_list※12',
                'v_equipment_list※13',
                'v_equipment_list※14',
                'v_equipment_list※15',
                'v_equipment_list※16',
                'v_equipment_list※17',
                'v_equipment_list※18',
                'v_equipment_list※19',
                'v_equipment_list※20',
                'v_equipment_list※21',
                'v_equipment_list※22',
                'v_equipment_list※23',
                'v_equipment_list※24',
                'v_equipment_list※25',
                'v_equipment_list※26',
                'v_equipment_list※27',
                'v_equipment_list※28',
                'v_equipment_list※29',
                'v_equipment_list※30',
                'v_equipment_list※31',
                'v_equipment_list※32',
                'v_equipment_list※33',
                'v_equipment_list※34',
                'v_equipment_list※35',
                'v_equipment_list※36',
                'v_equipment_list※37',
                'v_equipment_list※38',
                'v_equipment_list※39',
                'v_equipment_list※40',
                'v_equipment_list※41',
                'v_equipment_list※42',
                'v_equipment_list※43',
                'v_equipment_list※44',
                'v_equipment_list※45',
                'v_equipment_list※46',
                'v_equipment_list※47',
                'v_equipment_list※48',
                'v_equipment_list※49',
                'ANJIAN_REPERTORY※01', //物资储备库
                'generalrepository',
                'floodrepository',
                'cityrepository',
                'firerepository',
                'firepreventionrepository',
                'powerrepository',
                'communicationrepository',
                'biologyrepository',
                'airrepository',
                'oilrepository',
                'earthrepository',
                'pottrepository',
                'Expert※01', //专家
                'nonmineexpert',
                'chemicalexpert',
                'tradexpert',
                'emergenceexpert',
                'fireexpert',
                'floodexpert',
                'earthquakeexpert',
                'fireworkexpert',
                'lawexpert',
                'infomationexpert',
                'Expert※12',
                'Expert※13',
                'Expert※14',
                'Expert※15',
                'Expert※16',
                'Expert※17',
                'Expert※18',
                'Expert※19',
                'Expert※20',
                'Expert※21',
                'Expert※22',
                'Expert※23',
                'Expert※24',
                'Expert※25',
                'Expert※26',
                'Expert※27',
                'Expert※28',
                'Expert※29',
                'Expert※30',
                'Expert※31',
                'for_watersourceport',
                'for_waterport',
                'for_watersource',
                'FOR_WATERSOURCE※04',
                'forestfireteam',
                'firepreventionrepository',
                'airport', // 机场
                'shelter', //避难场所
                'JC_WARBASE※01',
                'for_forestfarm', //全国国有林场
                'for_naturalreserve' //自然保护区
            ]
        };
        this.opts = jQuery.extend(true, options, opts);
        // this.commonService = window.EMapServerV2.CommonService.getInstance(opts);
        this.commonService = new window.EMapServerV2.CommonService(opts);
    };

    /**
     *
     * @param opts
     * @param opts.resourceKeys
     * @param callback
     * @param ctx
     */
    Service.prototype.getStatistics = function(opts, callback, ctx) {
        opts = opts || {};
        var resourceKeys = opts.resourceKeys || this.opts.resourceKeys.slice(0);
        this.commonService.getStatistics(resourceKeys, {}, function(err, data) {
            callback.call(ctx, null, data);
        }, this);
    };

    /**
     * 按条件统计
     * @param opts
     * @param opts.districtCode
     * @param callback
     * @param ctx
     */
    Service.prototype.getStatisticsByFilter = function(opts, callback, ctx) {
        var filter = {};
        opts = opts || {};
        filter.districtCode = opts.districtCode;
        this.commonService.getStatistics(this.opts.resourceKeys, filter, function(err, data) {
            callback.call(ctx, null, data);
        }, this);
    };

    /**
     * 查询列表数据
     * @param opts
     * @param opts.keyword 关键字
     * @param opts.resourceKey，多个逗号分隔
     * @param opts.pageSize
     * @param opts.pageIndex
     * @param opts.districtCode
     * @param opts.fields 字段列表（筛选字段）
     * @param opts.id 主键筛选
     * @param opts.filter
     * @param callback
     * @param ctx
     */
    Service.prototype.getDataList = function(opts, callback, ctx) {
        opts = opts || {};
        opts.flatTag = true;
        this.commonService.getDataList(opts, function(err, data) {
            callback.call(ctx, null, data);
        }, this);
    };

    Service.prototype.getNearbyList = function(opts, callback, ctx) {
        opts = opts || {};
        opts.flatTag = true;
        // opts.resourceKeys = this.opts.resourceKeys;
        var radius = opts.radius;
        this.commonService.getEventData(opts.eventType, function(err, data) {
            var config = opts.config || {};
            //读取默认距离配置、传参的距离
            // var configRadius = data.tag.SEARCH_DIST;
            // if (configRadius != null && configRadius != '' && !isNaN(configRadius)) {
            //   configRadius = parseFloat(configRadius) * 1000;
            // } else {
            //   configRadius = 1000 * 1000;
            // }
            // for (var i = 0; i < this.opts.resourceKeys.length; i++) {
            //   var resourceKey = this.opts.resourceKeys[i];
            //   if (config.hasOwnProperty(resourceKey)) {
            //     if (!config[resourceKey].radius) {
            //       config[resourceKey].radius = opts.radius;
            //     }
            //   } else {
            //     config[resourceKey] = {
            //       radius: opts.radius
            //     }
            //   }
            // }
            this.commonService.getNearbyList(opts, function(err, resultSet) {
                var list = resultSet.list;
                resultSet.radius = list[0] ? list[0].radius : radius;
                //危化企业根据产量分类
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    if (item && item.codeKey === this.opts.resourceKeys[0]) {
                        var itemList = item.data;
                        var rangeMap = {
                            '1000': {
                                range: [1000, Number.MAX_VALUE],
                                list: []
                            },
                            '100': {
                                range: [100, 1000],
                                list: []
                            },
                            '0': {
                                range: [0, 100],
                                list: []
                            }
                        }
                        var itemCount = itemList.length;
                        for (var j = 0; j < itemCount; j++) {
                            var rowObj = itemList[j],
                                sumCount = rowObj.SUMOUTPUT;
                            for (var rangeKey in rangeMap) {
                                var rangeObj = rangeMap[rangeKey],
                                    rangeArr = rangeObj.range;
                                if (sumCount >= rangeArr[0] && sumCount < rangeArr[1]) {
                                    rangeObj.list.push(rowObj);
                                    break;
                                }
                            }
                        }
                        var newData = {};
                        for (var k in rangeMap) {
                            newData[k] = rangeMap[k].list;
                        }
                        item.data = newData;
                    }
                }
                callback.call(ctx, null, resultSet);
            }, this);
        }, this);
    };
    window.EMapServerV2 = window.EMapServerV2 || {};
    // 参考
    window.EMapServerV2.EmerSourceService = Service;

})(window);