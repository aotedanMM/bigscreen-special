(function (window) {
  /**
   *
   * @param opts
   * @param opts.server
   * @constructor
   */
  var Service = function (opts) {
    this.opts = opts;
    //
    this.store = {
      rescueWorker: null,//救援力量
      resuceNeed: null,//救援需求
      materialNeed: null,//物资需求
      placement: null,//安置
    };
    //
    this.materialSet = {
      "TP001": {
        "label": "救灾帐篷",
        "code": "TP001",
        "unit": "顶"
      },
      "TP002": {
        "label": "救灾被服",
        "code": "TP002",
        "unit": "件"
      },
      "TP003": {
        "label": "救灾食品",
        "code": "TP003",
        "unit": "件"
      },
      "TP004": {
        "label": "生活用品",
        "code": "TP004",
        "unit": "件"
      },
      "TP005": {
        "label": "照明用具",
        "code": "TP005",
        "unit": "件"
      },
      "TP006": {
        "label": "能源动力",
        "code": "TP006",
        "unit": "件"
      },
      "TP007": {
        "label": "应急救生",
        "code": "TP007",
        "unit": "件"
      },
      "TP008": {
        "label": "交通工具",
        "code": "TP008",
        "unit": "台"
      },
      "TP009": {
        "label": "彩条苫布",
        "code": "TP009",
        "unit": "件"
      },
      "TP010": {
        "label": "卫生设施",
        "code": "TP010",
        "unit": "件"
      },
      "TP011": {
        "label": "生活家具",
        "code": "TP011",
        "unit": "件"
      },
      "TP012": {
        "label": "装备工具",
        "code": "TP012",
        "unit": "件"
      },
      "TP013": {
        "label": "个体防护",
        "code": "TP013",
        "unit": "件"
      },
      "TP014": {
        "label": "侦测与搜寻",
        "code": "TP014",
        "unit": "件"
      }
    };
  }
  /**
   * 获取救援力量
   * @param opts
   * @param cb
   * @param ctx
   */
  Service.prototype.getRescueWorker = function (opts, cb, ctx) {
    // let data = {
    //   total: 1,//总队伍数目
    //   totalNum: 12,//总人数
    //   //救援队伍列表
    //   list: [
    //     {
    //       "id": 1559460642167,
    //       "name": "XX救援队",//名称
    //       "typeCode": "T005",//类型
    //       "typeName": "地震救援队",//类型名称
    //       "num": 12,//人数
    //       "unit": "人",//单位
    //       "x": 116.92704975,//经度
    //       "y": 40.28975715,//纬度
    //     }
    //   ]
    // }
    // cb && cb.call(ctx, null, data);
    cb && cb.call(ctx, null, this.store.rescueWorker);
  }
  /**
   * 基于消息更新救援力量
   * @param data
   */
  Service.prototype.updateRescueWorker = function (data, cb, ctx) {
    data = data || {};
    if (Object.keys(data).length == 0) {//test data
      {
        return
      }
    }
    //   data = {
    //     total: 1,//总队伍数目
    //     totalNum: 12,//总人数
    //     //救援队伍列表
    //     list: [
    //       {
    //         "id": 1559460642167,
    //         "name": "XX救援队",//名称
    //         "typeCode": "T005",//类型
    //         "typeName": "地震救援队",//类型名称
    //         "num": 12,//人数
    //         "unit": "人",//单位
    //         "x": 116.92704975,//经度
    //         "y": 40.28975715,//纬度
    //       }
    //     ]
    //   }
    // }
    this.store.rescueWorker = data;
    cb && cb.call(ctx, null, data);
  }

  /**
   * 查询灾损区的区县
   * @param opts
   * @param opts.geometry {GeoJSON} 可选，地震灾损区，geojson格式
   * @param opts.codeList {Array} 可选，行政区划编码
   * @param cb
   * @param ctx
   */
  Service.prototype.getCounties = function (opts, cb, ctx) {
    var query = {};
    if (opts.geometry) {
      query['geom'] = {
        '$geoIntersects': {
          '$geometry': opts.geometry
        }
      }
    }
    if (opts.codeList) {
      query['tag.adcode'] = {
        $in: opts.codeList
      }
    }
    jQuery.ajax({
      url: EMAP_CONFIG.common.mongoService + '/dataOperate/queryMulti',
      dataType: 'json',
      type: 'POST',
      data: {
        eId: 'siptea',
        data: JSON.stringify({
          'county0.06': {
            'query': query,
            'select': '_id geom tag.name tag.adcode tag.gov'
          }
        })
      },
      success: function (data) {
        var data = data.data;
        var list = data[Object.keys(data)[0]];
        var newList = [];
        for (var i = 0; i < list.length; i++) {
          var itemObj = list[i];
          var tempObj = {};
          tempObj.geom = itemObj.geom;
          tempObj.name = itemObj.tag.name;
          tempObj.code = itemObj.tag.adcode;
          var xy = itemObj.tag.gov.split(",");
          tempObj.x = parseFloat(xy[0]);
          tempObj.y = parseFloat(xy[1]);
          newList.push(tempObj);
        }
        cb && cb.call(ctx, null, newList);
      },
      error: function (err) {
        cb && cb.call(ctx, err);
      }
    });
  }

  /**
   * 获取救援力量需求
   * @param opts
   * @param cb
   * @param ctx
   */
  Service.prototype.getRescueNeed = function (opts, cb, ctx) {
    cb && cb.call(ctx, null, this.store.resuceNeed);
  }

  /**
   * 基于消息更新救援力量需求
   * @param data
   */
  Service.prototype.updateRescueNeed = function (data, cb, ctx) {
    data = data || {};
    if (Object.keys(data).length == 0) {//test data
      return
    }
    //   data = {
    //     list: [
    //       {
    //         "district": "xx县",
    //         "x": 116.92704975,//经度
    //         "y": 40.28975715,//纬度
    //         //救援队需求
    //         workers: [
    //           {
    //             "typeCode": "T005",
    //             "typeName": "地震救援队",
    //             "num": 100
    //           },
    //
    //           {
    //             "typeCode": "T002",
    //             "typeName": "xx救援队",
    //             "num": 200
    //           }
    //         ]
    //       }
    //     ]
    //   }
    // }
    data.total = data.total || 0;
    for (var i = 0; i < data.list.length; i++) {
      var tlist = data.list[i].workers;
      for (var j = 0; j < tlist.length; j++) {
        data.total += parseInt(tlist[j].num);
      }
    }
    this.store.resuceNeed = data;
    cb && cb.call(ctx, null, data);
  }

  /**
   * 获取三个梯队的救援队
   * @param opts
   * @param opts.point {Array} 必填，事故点
   * @param opts.typeList {Array} 可选，救援队类型过滤
   * @param opts.limit {Num} 可选，数据量限制
   * @param cb
   * @param ctx
   */
  Service.prototype.getRescueCol = function (opts, cb, ctx) {
    var resultCol = {
      total: 0,
      list: [
        {
          total: 0,
          title: '第一梯队',
          list: []
        },
        {
          total: 0,
          title: '第二梯队',
          list: []
        },
        {
          total: 0,
          title: '第三梯队',
          list: [
            {
              name: '中部战区',
              x: 116.3590,
              y: 39.9110
            }, {
              name: '北部战区',
              x: 123.4116,
              y: 41.7966
            }, {
              name: '西部战区',
              x: 104.0817,
              y: 30.6610
            }, {
              name: '南部战区',
              x: 113.2614,
              y: 23.1189
            }, {
              name: '东部战区',
              x: 118.7727,
              y: 32.0476
            }
          ]
        }
      ]
    };
    var limit = opts.limit || 10000,
      radius = 200000;
    var queryCol = [];
    opts.typeList = opts.typeList || [
      'T001', 'T002', 'T003', 'T004', 'T005', 'T006', 'T008',
      'T009', 'T010', 'T011', 'T014'
    ]
    //第一梯队
    var bufferGeom1 = G.utils.SpatialOPUtil.getBuffer({
      geometry: {
        type: 'Point',
        coordinates: opts.point
      },
      radius: radius,
      spatialReference: 4326
    });
    resultCol.list[0].geometry = bufferGeom1;
    resultCol.list[0].titlePoint = [opts.point[0], opts.point[1] + radius / (Math.PI * 6378137 / 180)];
    queryCol.push({
      point: opts.point,
      typeList: opts.typeList,
      limit: limit,
      geometry: bufferGeom1
    })
    //第二梯队
    var chinaRange = {
      type: 'Polygon',
      coordinates: [
        [
          [70, 3],
          [70, 55],
          [136, 55],
          [136, 3],
          [70, 3]
        ]
      ]
    }
    var bufferGeom2 = G.utils.SpatialOPUtil.differGeom(chinaRange, [bufferGeom1]);
    queryCol.push({
      point: opts.point,
      typeList: opts.typeList,
      limit: limit,
      geometry: bufferGeom2
    })
    return this._getRescue({
      querys: queryCol
    }, function (err, data) {
      if (err == null) {
        for (var i = 0; i < data.length; i++) {
          resultCol.list[i].list = data[i];
          var total = 0;
          for (var j = 0, len = data[i].length; j < len; j++) {
            total += data[i][j].num;
          }
          resultCol.list[i].total = total;
          resultCol.total += total;
        }
        //缺口人数
        let resuceNeed = 0;
        if(this.store.resuceNeed&&this.store.resuceNeed.total){
          resuceNeed = his.store.resuceNeed.total;
        }
        resultCol.needNum = Math.max(resuceNeed - resultCol.total, 0);
        cb && cb.call(ctx, null, resultCol);
      } else {
        cb && cb.call(ctx, err);
      }
    }, this);
  }

  /**
   * 获取需求点周边的指定类型的救援队
   * @param opts
   * @param opts.point {Array} 必填，如[116,39]
   * @param opts.typeList {Array} 必填，类型编码，如['T002']
   * @param opts.num {Number} 必填，人数需求
   * @param cb
   * @param ctx
   */
  Service.prototype.getRescueByTypeAndNeedLoc = function (opts, cb, ctx) {
    var options = {};
    options.point = opts.point;
    options.typeList = opts.typeList;
    options.limit = 5000;
    options.byDistance = true;
    return this._getRescue({
      querys: [options]
    }, function (err, data) {
      if (err == null) {
        var provideList = this._caculateDispatchResult(opts.num, data[0], {
          numKey: 'num',
          codeKey: 'typeCode'
        })
        cb && cb.call(ctx, null, provideList);
      } else {
        cb && cb.call(ctx, err);
      }
    }, this);
  }


  /**
   * 提取调配，如救援队
   * @param needCount
   * @param list
   * @param opts
   * @param opts.numKey
   * @private
   */
  Service.prototype._caculateDispatchResult = function (needCount, list, opts) {
    var provideList = [],
      fulfillCount = 0,
      total = list.length,
      numKey = opts.numKey;
    for (var i = 0; i < total; i++) {
      var item = list[i];
      var thisItem = item;
      var attachNum = item[numKey],
        promiseCount = fulfillCount + attachNum;
      if (!attachNum || isNaN(attachNum)) {
        continue;
      }
      if (promiseCount < needCount) {
        thisItem.num = attachNum;
      } else {
        thisItem.num = needCount - fulfillCount;
      }
      fulfillCount += thisItem.num;
      provideList.push(thisItem);
      if (fulfillCount >= needCount) {
        break;
      }
    }
    return provideList;
  };

  /**
   * 提取调配，如关联形式，如储备库物资
   * @param needSet {Object} 需求对象
   * @param list
   * @param opts
   * @param opts.numKey
   * @param opts.attachKey {String} 附属集合的key
   * @param opts.codeKey {String} 类型字段的key，与needSet里对应
   * @param opts.nameKey {String} 类型名称字段key
   * @param opts.numKey {String} 数量的key
   * @private
   */
  Service.prototype._caculateDispatchAttachResult = function (needSet, list, opts) {
    var total = list.length,
      maxReposityCount = 0;
    var dispatchSet = {};
    for (var codeKey in needSet) {
      var provideList = [];
      var needCount = needSet[codeKey];
      var fulfillCount = 0;
      for (var i = 0; i < total; i++) {
        var item = list[i];
        var provideItem = {
          num: 0
        };
        for (var kk in item) {
          if (kk == opts.attachKey) {
            continue;
          }
          provideItem[kk] = item[kk];
        }
        var attachList = item[opts.attachKey];
        for (var j = 0; j < attachList.length; j++) {
          var attachItem = attachList[j].tag;
          if (!(attachItem[opts.codeKey] == codeKey)) {
            continue;
          }
          var attachNum = attachItem[opts.numKey],
            promiseCount = fulfillCount + attachNum;
          if (!attachNum || isNaN(attachNum)) {
            continue;
          }
          var addNum = 0;
          if (promiseCount < needCount) {
            addNum = attachNum;
          } else {
            addNum = needCount - fulfillCount;
          }
          fulfillCount += addNum;
          provideItem.num += addNum;
          if (fulfillCount >= needCount) {
            break;
          }
        }
        if (provideItem.num > 0) {
          provideList.push(provideItem);
        }
        if (fulfillCount >= needCount) {
          break;
        }
      }
      dispatchSet[codeKey] = provideList;
      maxReposityCount = Math.max(maxReposityCount, provideList.length);
    }
    return {
      dispatchSet: dispatchSet,
      list: list.slice(0, maxReposityCount)
    };
  };
  /**
   * 查询救援队
   * @param opts
   * @param opts.querys
   * @param opts.querys[i].point {Array} 必填，如[116,39]
   * @param opts.querys[i].typeList {Array} 必填，类型编码，如['T002']
   * @param opts.querys[i].query {Object} 可选，自定义查询条件
   * @param opts.querys[i].geometry {GeoJSON} 必填，地震灾损区，geojson格式
   * @param opts.querys[i].bufferMeter {Number} 可选，缓冲距离/米
   * @param opts.querys[i].limit {Number} 可选，返回数据数量
   * @param opts.querys[i].byDistance {Boolean} 可选，
   * @param cb
   * @param ctx
   */
  Service.prototype._getRescue = function (opts, cb, ctx) {
    var aggregateList = [];
    for (var i = 0; i < opts.querys.length; i++) {
      var aggregateObj = {},
        aggregate = [];
      var queryObj = opts.querys[i];
      //
      var geometry = queryObj.geometry;
      if (queryObj.bufferMeter && geometry) {
        geometry = G.utils.SpatialOPUtil.getBuffer({
          geometry: queryObj.geometry,
          radius: queryObj.bufferMeter,
          spatialReference: 4326
        });
      }
      var query = {
        'tag.RESCUETYPECODE': {
          $in: queryObj.typeList
        }
      }
      if (geometry) {
        query['geom'] = {
          $geoIntersects: {
            $geometry: geometry
          }
        }
      }
      if (queryObj.query) {
        for (var kk in queryObj.query) {
          query[kk] = queryObj.query[kk];
        }
      }
      aggregate.push({
        $geoNear: {
          limit: 100000,
          maxDistance: 5000 * 1000,
          spherical: true,
          includeLocs: 'geom',
          distanceField: 'distance',
          near: {
            type: 'Point',
            coordinates: queryObj.point
          }
        }
      })
      aggregate.push({
        $lookup: {
          from: 'user_safety_EQUIP_RESCUETYPE',
          localField: 'tag.RESCUETYPECODE',
          foreignField: '_id',
          as: 'type'
        }
      })
      aggregate.push({
        $unwind: {
          path: '$type',
          "preserveNullAndEmptyArrays": false
        }
      })
      if (queryObj.byDistance) {
        aggregate.push({
          $limit: queryObj.limit || 150
        })
      } else {
        aggregate.push({
          $sort: {
            _id: 1
          }
        })
        aggregate.push({
          $limit: queryObj.limit || 150
        })
      }
      aggregate.push({
        $project: {
          name: '$tag.RESCUENAME',
          typeCode: '$tag.RESCUETYPECODE',
          typeName: '$type.tag.SHORTNAME',
          num: '$tag.TOTALPERNUM',
          geom: '$geom',
          distance: '$distance',
          address: '$tag.ADDRESS',
          carNum: '$tag.CARNUM',
          contact: '$tag.CHARGER',
          tel: '$tag.CHARGERMTEL',
        }
      })
      aggregateObj.aggregate = aggregate;
      aggregateObj.query = query;
      aggregateObj.searchId = i;
      aggregateObj.dataSetId = 'JYXX_TEA_RESCUE';
      aggregateObj.queryIndex = 1;
      aggregateList.push(aggregateObj)
    }
    this.aggregateMulti(aggregateList, function (err, data) {
      if (err == null) {
        var resultCol = [];
        for (var j = 0; j < aggregateList.length; j++) {
          var list = data[j]['JYXX_TEA_RESCUE'];
          // var measureService = new g2.sfs.MeasureService({
          //   projectService: new g2.sfs.CoordinateTransform()
          // });
          for (var i = 0; i < list.length; i++) {
            var itemObj = list[i];
            if (!itemObj.geom) {
              continue;
            }
            itemObj.x = itemObj.geom.coordinates[0];
            itemObj.y = itemObj.geom.coordinates[1];
            delete itemObj.geom;
            itemObj.id = itemObj._id;
            delete itemObj._id;
            //
            // var line = g2.sfs.GeometryFactory.createGeometryFromGeoJson({
            //   type: 'LineString',
            //   coordinates: [
            //     opts.querys[j].point,
            //     [itemObj.x, itemObj.y]
            //   ]
            // });
            // line.spatialReference = 4326;
            // itemObj.distance = measureService.length(line);
          }
          // list.sort(function (a, b) {
          //   return a.distance - b.distance;
          // })
          resultCol.push(list);
        }
        cb && cb.call(ctx, null, resultCol);
      } else {
        cb && cb.call(ctx, err);
      }
    })

  }

  /**
   * 扩展
   */
  for (var k in window.EMapServerV2.RescueAssistanceServiceExt) {
    Service.prototype[k] = window.EMapServerV2.RescueAssistanceServiceExt[k];
  }
  for (var k in window.EMapServerV2.RescueAssistanceServiceChartExt) {
    Service.prototype[k] = window.EMapServerV2.RescueAssistanceServiceChartExt[k];
  }

  window.EMapServerV2 = window.EMapServerV2 || {};
  // 参考
  window.EMapServerV2.RescueAssistanceService = Service;
})(window);  