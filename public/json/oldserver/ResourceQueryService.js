(function (window) {
  var Service = function (opts) {
    var options = {
    }
    this.opts = jQuery.extend(true, options, opts);
    this.commonService = new window.EMapServerV2.CommonService(opts);
  }

  /**
   *
   * @param callback
   * @param ctx
   */
  Service.prototype.getStatistics = function (callback, ctx) {
    //去掉最后一类地质隐患点
    var resourceKeys = this.opts.resourceKeys;
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
    // opts.resourceKeys = this.opts.resourceKeys;
    this.commonService.getNearbyList(opts, function (err, resultSet) {
      callback.call(ctx, null, resultSet);
    }, this);
  }
    //查询企业、防护目标、重要设施 2019年12月17日14:25:48
    Service.prototype.getGroupCounts=function (dataA,types,cb) {
        var queryOpts = {
            //查询的表配置
            querys: BigTypeCountQueryConfig[types],
            //缓冲区
            bufferList: [dataA]
        }
        this.servicemodule.bufferStatistics(queryOpts, function (err, data) {
            if (err == null) {
                if(cb){
                    cb(data);
                }
            } else {
                console.error('查询失败：' + err.message)
            }
        })
    }
    
    //查询企业、防护目标、重要设施 2019年12月31日16:03:03
    Service.prototype.getGroupCountsNoPoly=function (codes,types,cb) {
      var queryOpts = {
          //查询的表配置
          querys: BigTypeCountQueryConfig[types],
          //缓冲区
          bufferList: [],
          codes:codes
      }
      this.servicemodule.bufferStatistics(queryOpts, function (err, data) {
          if (err == null) {
              if(cb){
                  cb(data);
              }
          } else {
              console.error('查询失败：' + err.message)
          }
      })
  }    
  window.EMapServerV2 = window.EMapServerV2 || {};
  window.EMapServerV2.ResourceQueryService = Service;
})(window);