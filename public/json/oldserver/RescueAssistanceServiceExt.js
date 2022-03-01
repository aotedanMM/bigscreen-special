(function (window) {
  var ext = {
    /**
     * 多个管道执行方法-公共
     * @param aggregateList 管道列表
     * @param cb
     * @param ctx
     * @returns {*}
     */
    aggregateMulti: function (aggregateList, cb, ctx) {
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
    },

    /**
     * 获取物资需求
     * @param opts
     * @param cb
     * @param ctx
     */
    getMaterialNeed: function (opts, cb, ctx) {
      cb && cb.call(ctx, null, this.store.materialNeed);
    },
    /**
     *
     * @param data
     * @param cb
     * @param ctx
     */
    updateMaterialNeed: function (data, cb, ctx) {
      data = data || [];
      this.store.materialNeed = data;
      cb && cb.call(ctx, null, data);
    },
    /**
     * 根据物资需求获取储备库列表
     * @param opts
     * @param opts.point
     * @param opts.materialSet {Object} 必填
     * @param opts.materialSet[key] key为物资类型编码，value为物资需求
     * @param cb
     * @param ctx
     */
    getNearbyReposity: function (opts, cb, ctx) {
      return this._getNearbyReposity(opts, function (err, data) {
        if (err == null) {
          cb && cb.call(ctx, null, data.list);
        } else {
          cb && cb.call(ctx, err);
        }
      }, ctx);
    },
    /**
     * 根据物资需求获取储备库列表
     * @param opts
     * @param opts.point
     * @param opts.materialSet {Object} 必填
     * @param opts.materialSet[key] key为物资类型编码，value为物资需求
     * @param cb
     * @param ctx
     */
    _getNearbyReposity: function (opts, cb, ctx) {
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
                unit: materialObj.MEASUREUNIT ||
                  (this.materialSet[materialObj.MATERIALTYPE] ? this.materialSet[materialObj.MATERIALTYPE].unit : '件')
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
    },
    /**
     * 获取储备库调度方案
     * @param opts.point
     * @param opts.materialSet {Object} 必填
     * @param opts.materialSet[key] key为物资类型编码，value为物资需求
     * @param cb
     * @param ctx
     */
    getReposityDispatch: function (opts, cb, ctx) {
      return this._getNearbyReposity(opts, function (err, data) {
        if (err == null) {
          var promise = null;
          var current = 0;
          var self = this;
          var resultList = [];
          var async = function () {
            var dtd = jQuery.Deferred();
            self._pathAnalysis({
              start: [data.list[current].x, data.list[current].y],
              end: opts.point
            }).then(function (data) {
              current++;
              resultList.push(data);
              dtd.resolve();
            })
            return dtd;
          }
          for (var i = 0; i < data.list.length; i++) {
            if (promise == null) {
              promise = async();
            } else {
              promise = promise.then(function () {
                return async();
              });
            }
          }
          if (promise == null) {
            cb && cb.call(ctx, null, []);
          } else {
            promise.done(function () {
              var repositySet = {};
              for (var i = 0; i < data.list.length; i++) {
                data.list[i].duration = parseFloat((resultList[i].duration / 3600).toFixed(2));
                repositySet[data.list[i]._id] = data.list[i];
              }
              var dataList = [];
              for (var type in data.dispatchSet) {
                var reposityList = data.dispatchSet[type];
                var itemObj = {};
                itemObj.list = [];
                //
                for (var j = 0; j < reposityList.length; j++) {
                  var reposity = repositySet[reposityList[j]._id];
                  if (reposity) {
                    delete reposity.material;
                    reposity.num = reposityList[j].num;
                    itemObj.list.push(reposity);
                  }
                }
                //
                for (var k = 0; k < data.typeList.length; k++) {
                  if (data.typeList[k].code == type) {
                    itemObj.name = data.typeList[k].name;
                    itemObj.code = type;
                    itemObj.unit = '件';
                    if (self.materialSet.hasOwnProperty(type)) {
                      itemObj.unit = self.materialSet[type].unit;
                    }
                    break;
                  }
                }
                dataList.push(itemObj);
              }
              cb && cb.call(ctx, null, dataList);
            })
          }
        } else {
          cb && cb.call(ctx, err);
        }
      }, this);
    },
    /**
     * 路径规划
     * @param opts
     * @param opts.start {Array} [116,39]
     * @param opts.end {Array} [117,39]
     * @param cb
     * @param ctx
     * @private
     */
    _pathAnalysis: function (opts, cb, ctx) {
      var promise = jQuery.Deferred();
      var startTemp = opts.start[1] + ',' + opts.start[0];
      var start = window.EMapServerV2.CoordTransformUtil.wgs84togcj02(startTemp);
      var endTemp = opts.end[1] + ',' + opts.end[0];
      var end = window.EMapServerV2.CoordTransformUtil.wgs84togcj02(endTemp);
      var url = EMAP_CONFIG.common.GaoDeService +
        'direction/driving?origin='
        + start + '&destination=' + end +
        '&extensions=all&strategy=10&waypoints=&avoidpolygons=&output=json&key=' +
        EMAP_CONFIG.common.GaoDeKey;
      $.ajax({
        url: url,
        dataType: 'jsonp',
        success: function (res) {
          if (res.route) {
            var dataObj = {};
            dataObj.duration = 0;
            if (res.route.paths.length > 0) {
              dataObj.duration = parseInt(res.route.paths[0].duration);
            } else {
              //根据距离计算
              var measureService = new g2.sfs.MeasureService({
                projectService: new g2.sfs.CoordinateTransform()
              });
              var line = g2.sfs.GeometryFactory.createGeometryFromGeoJson({
                type: 'LineString',
                coordinates: [
                  opts.end,
                  opts.start
                ]
              });
              line.spatialReference = 4326;
              dataObj.duration = parseInt((measureService.length(line) * 3.6 / 60).toFixed(0));
            }
            promise.resolve(dataObj)
          }else{
            promise.reject(res);
          }
        },
        error: function (er) {
          promise.reject(er);
        }
      });
      return promise;

    },
    /**
     * 获取安置信息
     * @param opts
     * @param cb
     * @param ctx
     */
    getPlacement: function (opts, cb, ctx) {
      cb && cb.call(ctx, null, this.store.placement);
    },
    /**
     * 更新安置信息
     * @param data
     * @param cb
     * @param ctx
     */
    updatePlacement: function (data, cb, ctx) {
      data = data || {};
      if (Object.keys(data).length == 0) {//test data
        {
          return
        }
      }
      //   data = {
      //     "list": [
      //       {
      //         "district": "大厂回族自治县",
      //         "districtCode": "320775",//行政区划编码
      //         "id": "131028100",
      //         "x": 116.97272379,
      //         "y": 39.88101247,
      //         "totalCapacity": "200",//总容量
      //         "totalCapacityPlaced": "100",//已安置容量
      //         "totalPlacement": "30",//总安置人数
      //         "totalPlacementVictims": "20"//已安置人数
      //       }, {
      //         "district": "宝坻区",
      //         "districtCode": "320775",//行政区划编码
      //         "x": 117.29933412,
      //         "y": 39.75204604,
      //         "totalCapacity": "2000",
      //         "totalCapacityPlaced": "500",
      //         "totalPlacement": "30",
      //         "totalPlacementVictims": "10"
      //       }
      //     ]
      //   }
      // }
      data.totalCapacity = 0;
      data.totalCapacityPlaced = 0;
      data.totalCapacityLeft = 0;
      data.totalPlacement = 0;
      data.totalPlacementVictims = 0;
      data.totalPlacementLeft = 0;
      //安置点数
      data.placeNum = 100;
      //安置缺口
      data.needNum = Math.max(data.totalPlacementVictims - data.totalCapacity, 0);
      for (var i = 0; i < data.list.length; i++) {
        var item = data.list[i];
        item.totalCapacity = parseInt(item.totalCapacity);//总容量
        item.totalCapacityPlaced = parseInt(item.totalCapacityPlaced);//已用安置容量
        item.totalCapacityLeft = item.totalCapacity - item.totalCapacityPlaced;//剩余安置容量
        item.totalPlacement = parseInt(item.totalPlacement);//总安置灾民
        item.totalPlacementVictims = parseInt(item.totalPlacementVictims);//已安置灾民
        item.totalPlacementLeft = item.totalPlacement - item.totalPlacementVictims;//待安置人数
        item.placementPercentage = (100 * item.totalPlacementVictims / item.totalPlacement).toFixed(2) + '%';//安置率
        //
        data.totalCapacity += item.totalCapacity;
        data.totalCapacityPlaced += item.totalCapacityPlaced;
        data.totalCapacityLeft += item.totalCapacityLeft;
        data.totalPlacement += item.totalPlacement;
        data.totalPlacementVictims += item.totalPlacementVictims;
        data.totalPlacementLeft += item.totalPlacementLeft;
      }
      data.placementPercentage = (100 * data.totalPlacementVictims / data.totalPlacement).toFixed(2) + '%';//安置率
      this.store.placement = data;
      cb && cb.call(ctx, null, data);
    }
  }
  window.EMapServerV2 = window.EMapServerV2 || {};
  // 参考
  window.EMapServerV2.RescueAssistanceServiceExt = ext;
})(window);  