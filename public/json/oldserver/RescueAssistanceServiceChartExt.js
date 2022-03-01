(function (window) {
  var ext = {
    /**
     * 获取队伍需求图表数据
     * @param opts
     * @param cb
     * @param ctx
     */
    getTeamNeedSta: function(opts, cb, ctx) {
      this.getRescueNeed({}, function (err, data) {
        if (err == null) {
          var resultObj = {};
          var textList = [];
          var chartData = [];
          var list = [];
          if (data) {
            list = data.list;
            chartData.push({
              "name": "需要队伍人数",
              "value": 0
            });
            for (var i = 0; i < list.length; i++) {
              var workers = list[i].workers;
              for (var j = 0; j < workers.length; j++) {
                textList.push(workers[j].typetitle + '急需' + parseInt(workers[j].num) + '人' + workers[j].typeName);
                chartData[0].value += parseInt(workers[j].num);
              }
            }
          }
          //
          if (this.store.rescueWorker) {
            chartData.push({
              "name": "现场队伍人数",
              "value": 0
            })
            chartData[chartData.length - 1].value = this.store.rescueWorker.totalNum || 0;
          }
          resultObj.textList = textList;
          resultObj.chartData = chartData;
          cb && cb.call(ctx, null, resultObj);
        } else {
          cb && cb.call(ctx, err)
        }
      }, this)
    },
    /**
     * 获取现场队伍图表数据
     * @param opts
     * @param cb
     * @param ctx
     */
    getRescueWorkerSta: function (opts, cb, ctx) {
      this.getRescueWorker({}, function (err, data) {
        if (err == null) {
          var dataObj = {
            team: {
              title: "队伍数量",
              value: 0,
              unit: "支",
              ydata: [],
              xdata: []
            },
            person: {
              title: "队伍人数",
              value: 0,
              unit: "人",
              ydata: [],
              xdata: []
            }
          }
          var typeMap = {
            '社会救援': {
              teamValue: 0,
              personValue: 0,
              list: ['T011']
            },
            '应急搜救': {
              teamValue: 0,
              personValue: 0,
              list: ['T005', 'T003', 'T004', 'T001', 'T002']
            },
            '医疗防疫': {
              teamValue: 0,
              personValue: 0,
              list: ['T014', 'T006']
            },
            '抢通抢修': {
              teamValue: 0,
              personValue: 0,
              list: ['T008', 'T009', 'T010']
            }
          }
          if (data != null) {
            dataObj.team.value = data.total;
            dataObj.person.value = data.totalNum || 0;
            //
            //
            for (var i = 0; i < data.list.length; i++) {
              var item = data.list[i];
              var matchedType = null;
              for (var typeName in typeMap) {
                var typeList = typeMap[typeName].list;
                for (var j = 0; j < typeList.length; j++) {
                  if (typeList[j] == item.typeCode) {
                    matchedType = typeName;
                    break;
                  }
                }
                if (matchedType) {
                  break;
                }
              }
              if (matchedType) {
                typeMap[typeName].teamValue++;
                var val = isNaN(parseInt(item.num)) ? 0 : parseInt(item.num);
                typeMap[typeName].personValue += val;
              }
            }
          }
          dataObj.team.ydata = Object.keys(typeMap);
          dataObj.team.xdata = [];
          dataObj.person.ydata = Object.keys(typeMap);
          dataObj.person.xdata = [];
          for (var typeName in typeMap) {
            dataObj.team.xdata.push(typeMap[typeName].teamValue);
            dataObj.person.xdata.push(typeMap[typeName].personValue);
          }
          cb && cb.call(ctx, null, dataObj);
        } else {
          cb && cb.call(ctx, err);
        }
      }, this)
    },

    /**
     * 获取物资需求图表数据
     * @param opts
     * @param cb
     * @param ctx
     */
    getMaterialNeedSta: function (opts, cb, ctx) {
      this.getMaterialNeed({}, function (err, data) {
        if (err == null) {
          var materialSet = {
            'TP001': {
              "code": "TP001",
              "name": "救灾帐篷",
              "iconClass": "tentIcon",
              unit: "顶",
              total: 0,
              transfering: 0,
              onArrival: 0
            },
            'TP002': {
              "code": "TP002",
              "name": "救灾被服",
              "iconClass": "tentIcon",
              unit: "件",
              total: 0,
              transfering: 0,
              onArrival: 0
            },
            'TP003': {
              "code": "TP003",
              "name": "救灾食品",
              "iconClass": "tentIcon",
              unit: "件",
              total: 0,
              transfering: 0,
              onArrival: 0
            },
            'TP004': {
              "code": "TP004",
              "name": "生活用品",
              "iconClass": "tentIcon",
              unit: "件",
              total: 0,
              transfering: 0,
              onArrival: 0
            },
            'TP005': {
              "code": "TP005",
              "name": "照明用具",
              "iconClass": "tentIcon",
              unit: "件",
              total: 0,
              transfering: 0,
              onArrival: 0
            },
            'TP006': {
              "code": "TP006",
              "name": "能源动力",
              "iconClass": "tentIcon",
              unit: "件",
              total: 0,
              transfering: 0,
              onArrival: 0
            },
            'TP007': {
              "code": "TP007",
              "name": "应急救生",
              "iconClass": "tentIcon",
              unit: "件",
              total: 0,
              transfering: 0,
              onArrival: 0
            },
            'TP008': {
              "code": "TP008",
              "name": "交通工具",
              "iconClass": "tentIcon",
              unit: "件",
              total: 0,
              transfering: 0,
              onArrival: 0
            }
          }
          if (data != null) {
            var list = data.list;
            if (!list) list = [];
            for (var i = 0; i < list.length; i++) {
              var itemObj = list[i];
              var placed = itemObj.placed,
                placing = itemObj.placing,
                unplaced = itemObj.unplaced;
              for (var j = 0; j < placed.length; j++) {
                var mObj = placed[j];
                if (materialSet.hasOwnProperty(mObj.code)) {
                  materialSet[mObj.code].total += parseInt(mObj.num);
                  materialSet[mObj.code].unit = materialSet[mObj.code].unit || mObj.unit;
                }
              }
              for (var j = 0; j < placing.length; j++) {
                var mObj = placing[j];
                if (materialSet.hasOwnProperty(mObj.code)) {
                  materialSet[mObj.code].total += parseInt(mObj.num);
                  materialSet[mObj.code].transfering += parseInt(mObj.num);
                  materialSet[mObj.code].unit = materialSet[mObj.code].unit || mObj.unit;
                }
              }
              for (var j = 0; j < unplaced.length; j++) {
                var mObj = unplaced[j];
                if (materialSet.hasOwnProperty(mObj.code)) {
                  materialSet[mObj.code].total += parseInt(mObj.num);
                  materialSet[mObj.code].onArrival += parseInt(mObj.num);
                  materialSet[mObj.code].unit = materialSet[mObj.code].unit || mObj.unit;
                }
              }
            }
          }
          var list = [];
          for (var kk in materialSet) {
            //只提供有数据的物资
            if (materialSet[kk].total > 0) {
              list.push(materialSet[kk]);
            }
          }
          cb && cb.call(ctx, null, list);
        } else {
          cb && cb.call(ctx, err);
        }
      }, this)
    },
    /**
     * 获取安置点图表数据
     * @param opts
     * @param cb
     * @param ctx
     */
    getPlacementSta: function (opts, cb, ctx) {
      this.getPlacement({}, function (err, data) {
        if (err == null) {
          var dataObj = {
            name: ['未安置人数', '剩余安置容量', '安置率'],
            value: [0, 0, 0],
            total: 0,
            notPlacedNum: 0,
            capacity: 0
          };
          if (data != null) {
            dataObj.value[0] = data.totalPlacementLeft;
            dataObj.value[1] = data.totalCapacityLeft;
            dataObj.value[2] = parseFloat((100 * data.totalPlacementVictims / data.totalPlacement).toFixed(2));
            dataObj.notPlacedNum = Math.max(0, dataObj.value[0] - dataObj.value[1]);
            dataObj.capacity = data.totalCapacity;
            dataObj.total = data.totalPlacement;
          }
          cb && cb.call(ctx, null, dataObj);
        } else {
          cb && cb.call(ctx, err);
        }
      }, this)
    }
  }
  window.EMapServerV2 = window.EMapServerV2 || {};
  // 参考
  window.EMapServerV2.RescueAssistanceServiceChartExt = ext;
})(window);  