(function (window) {
  var Service = function (opts) {
    var options = {
      //资源类型
      resourceKeys: [
        'portwharf', //港口码头
        'bas_school', //学校
        'hospital', //医院
        'culturalrelicunit', //文物保护单位
        'Hotel※00',
        'hotel', //宾馆
        'airport', //机场
        'railwaystation', //火车站
        'coachstation', //汽车站
        'government※00',
        'government', //政府机关
        'archives', //档案馆
        'Newscast※00',
        'tvcast', //电视台
        'newscast', //广播电台
        'Resins※00',
        'researchinstitution', //国防科研
        'Resins※02', //科研单位
        'financialins', //银行金融机构
        'market', //大型商贸
        'bazaar', //集贸市场
        'Gymnasium', //大型文化体育场所
        'tourist', //旅游景区
        'culturalvenues', //文化场馆
        'gasfacil', //大型能源动力设施
        'powerfacil', //燃气供应设施
        'supwatfacil', //供水设施
        'Powerfacilities※00',
        'powerfacilities', //供电设施
        'Communication※01',//通讯社
        'sluice',//水闸
        'ocepasture',//海阳牧场
        'farm',
        'gasstation',
        'monitorstation',//地震监测站台
      ]
    }
    this.opts = jQuery.extend(true, options, opts);
    // this.commonService = window.EMapServerV2.CommonService.getInstance(opts);
    this.commonService = new window.EMapServerV2.CommonService(opts);
  }

  /**
   *
   * @param opts.resourceKeys
   * @param callback
   * @param ctx
   */
  Service.prototype.getStatistics = function (opts, callback, ctx) {
    //去掉最后一类地质隐患点
    var resourceKeys = opts.resourceKeys || this.opts.resourceKeys.slice(0);
    this.commonService.getStatistics(resourceKeys, {}, function (err, data) {
      callback.call(ctx, null, data);
    }, this);
  }

  /**
   * 按条件统计
   * @param opts
   * @param opts.districtCode
   * @param callback
   * @param ctx
   */
  Service.prototype.getStatisticsByFilter = function (opts, callback, ctx) {
    var filter = {};
    opts = opts || {};
    filter.districtCode = opts.districtCode;
    this.commonService.getStatistics(this.opts.resourceKeys, filter, function (err, data) {
      callback.call(ctx, null, data);
    }, this);
  }

  /**
   * 查询列表数据
   * @param opts
   * @param opts.resourceKey，多个逗号分隔
   * @param opts.pageSize
   * @param opts.pageIndex
   * @param opts.districtCode
   * @param callback
   * @param ctx
   */
  Service.prototype.getDataList = function (opts, callback, ctx) {
    opts = opts || {};
    opts.flatTag = true;
    this.commonService.getDataList(opts, function (err, data) {
      callback.call(ctx, null, data);
    }, this);
  }

  Service.prototype.getNearbyList = function (opts, callback, ctx) {
    opts = opts || {};
    opts.flatTag = true;
    opts.resourceKeys = this.opts.resourceKeys;
    var radius = opts.config["ANJIAN_DAGCHEMENT※DangerousChemical"].radius;
    this.commonService.getEventData(opts.eventType, function (err, data) {
      var config = opts.config || {};
      //读取默认距离配置、传参的距离
      var configRadius = data.tag.SEARCH_DIST;
      if (configRadius != null && configRadius != '' && !isNaN(configRadius)) {
        configRadius = parseFloat(configRadius) * 1000;
      } else {
        configRadius = 1000 * 1000;
      }
      for (var i = 0; i < this.opts.resourceKeys.length; i++) {
        var resourceKey = this.opts.resourceKeys[i];
        if (config.hasOwnProperty(resourceKey)) {
          if (!config[resourceKey].radius) {
            config[resourceKey].radius = configRadius;
          }
        } else {
          config[resourceKey] = {
            radius: configRadius
          }
        }
      }
      this.commonService.getNearbyList(opts, function (err, resultSet) {
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
  }
  window.EMapServerV2 = window.EMapServerV2 || {};
  // 参考
  window.EMapServerV2.BaseDataService = Service;

})(window);
