import Util from '../../Util';
import SymbolMap from './SymbolMap';
import { realtimeTeam , rescueTeamServer, rescueTeamFakeServer } from '@/api/installServer';
import teamTypeCode from './TeamType';
import publishObjectPath from '@/util/configRegistry';
/**
 *  力量调度资源展示
 */

const componentBase = G.base.ComponentBase;
const component = componentBase.extend({
  // 属性
  options: {
    // 资源类型
    type: null,
    map: null,
    service: null,
    eventInfo: null,
    symbolConfig: null,
    peoplePolyGon: null,
    status: '',
    popupId: 'disasterJudge_resource_popup', // 弹窗唯一标识
    highLightId: 'disasterJudge_resource_hl', // 高亮id
    fireAddPopupEventId: 'Team_popup', // 添加弹窗后执行事件id
    popupEventId: 'dispatchTeam_popup', // 力量调度 驻地详情面板
    disasterRealTimeTeamDealData: null,
    RealTimeTeamInterval: null, // 出动队伍的实时位置和路径规划 定时器
    getAllTeamDataStatus: 'add', // 数据返回情况，防止操作过快，数据还没返回
    getDispatchTeamDataStatus: 'add', // 数据返回情况，防止操作过快，数据还没返回
  },
  // 初始化
  initialize(options: any) {
    componentBase.prototype.initialize.call(this, options);
    // do sth
    this.simpleRenderMgr = options.GISComponents.simpleRenderMgr;
    this.popupManager = options.GISComponents.popupManager;
    this.featureLocate = options.GISComponents.featureLocate;
    this.featureHighlight = options.GISComponents.featureHighlight;
    this.eventInfo = options.eventInfo;
    this.featureTypeSet = {};
    //
    this.dataCol = {};
    this.highlightids = [];
    this.RouteResultSet = {}; // 路径规划结果缓存
    this.TeamRealLocation = {}; // 当前队伍实时位置缓存
    this.trackLayer = {};
    this.dispatchServer = (publishObjectPath.value.practice === true) ? rescueTeamFakeServer : rescueTeamServer;
  },
  load() {
    componentBase.prototype.load.call(this);
    this.dataCol = {};
  },
  unload() {
    this.clear();
    this.dataCol = {};
    this.highlightids = [];
    componentBase.prototype.unload.call(this);
  },

  /**
   * 显示对应级别的数据
   * @param opts.typeArr 资源类型
   * @param opts.keyWord 关键字
   * @param opts.districtCode 行政区划逗号隔开
   */
  showResource(opts: any) {
    this.clearDispatchTeamLayer();
    this.options.getAllTeamDataStatus = 'add';
    this.status = 'all';
    this._getDataCol(opts).then((dataCol: any) => {
      if (this.status !== 'all') {
        return;
      }
      const list = dataCol.list;
      if (this.options.getAllTeamDataStatus === 'add') {
        this._addResource('allTeam', list, '所有队伍图层');
      }
    });
  },
  /**
   * 查询救援队伍列表
   * @param optt 查询列表
   * @param optt.typeArr 资源类型
   * @param optt.keyWord 关键字
   * @param optt.districtCode 行政区划逗号隔开
   * @param optt.pageSize
   * @param optt.pageIndex
   */
  getDataList(optss: any) {
    return new Promise((resolve, reject) => {
      const optt = optss;
      const pageSize = optt.pageSize ? optt.pageSize : 100000;
      const pageIndex = optt.pageIndex ? optt.pageIndex : 1;
      const keyWord = optt.keyWord ? optt.keyWord : '';
      const districtCode = optt.districtCode ? optt.districtCode : publishObjectPath.value.district.root;
      if (optt.typeArr.length === 0 || optt.typeArr.length === 25 ) {
        optt.typeArr = [];
        Object.keys(teamTypeCode).map((key: any) => {
          optt.typeArr.push(key);
        });
      }
      if (!this.options.eventInfo) {
        const ranges = this.options.eventInfo.getRanges();
        const point = this.options.eventInfo.getPoint();
        const opts = {
          point,
          level: ranges[ranges.length - 1].level,
          geometry: ranges[ranges.length - 1].geometry,
          rescueTypecodes: optt.typeArr,
          pageSize,
          pageIndex,
          keyWord,
          districtCode,
        };
        if (optt.geometry) {
          opts.geometry = optt.geometry;
        }
        this.options.service.getRescueTeamDataList(opts).then((data: any) => {
          resolve(data);
        });
      } else {
        const opts: any = {
          point: [120, 35],
          level: '6级',
          rescueTypecodes: optt.typeArr,
          keyWord,
          pageSize,
          pageIndex,
          districtCode,
        };
        if (optt.geometry) {
          opts.geometry = optt.geometry;
        }
        this.options.service.getRescueTeamDataList(opts).then((dataObj: any) => {
          resolve(dataObj);
        });
      }
    });
  },
  /**
   * 根据队伍类型和关键字 获取出动队伍列表
   * @param {Object} opts
   * @param {String} opts.keyword  关键字，队伍名称，装备名称
   * @param opts.teamType   队伍类型 ，支持多选
   * @param opts.nowPage
   * @param opts.pageSize
   */
  getDispatchTeamList(opts: any) {
    this.clearAllTeamLayer();
    this.options.getDispatchTeamDataStatus = 'add';
    this._showResourcesOnMap(this._setFeatureLayer('startEndLayer'), []);
    return new Promise((resolve, reject) => {
      this.options.service.dispatchTeam(opts).then((dataObj: any) => {
        const list = dataObj.data;
        list.forEach((ele: any) => {
          ele.type = 'zhudi';
        });
        if (this.options.getDispatchTeamDataStatus === 'add') {
          this._updateTeamPointLayer(list, 'startEndLayer');
        }
        resolve(dataObj);
      });
    });
  },
   /**
     * 力量调度：出动情况列表查询
     * @param opts
     * @param opts.eventId  事件ID 可选
     * @param opts.nowPage": 0,
     * @param opts.pageSize": 0,
     * @param opts.teamId": 队伍id 可选
     */
  getDispatchTeamListByteamId(opts: any) {
    const self = this;
    this._showResourcesOnMap(this._setFeatureLayer('dispatchTemaLayer'), []);
    return new Promise((resolve, reject) => {
      this.options.service.dispatchTeamList({
        eventId: 'ff80808172c08b9b0172c173721a0000',
      }).then((dataObj: any) => {
        const list = dataObj.data.list;
        const result: any = [];
        self.processData(list).then((rec: any) => {
          for (const key in self.RouteResultSet) {
            if (self.RouteResultSet[key]) {
              result.push(self.RouteResultSet[key]);
            }
          }
          $('.team_now_Location_div').remove();
          list.forEach((ele: any, index: any) => {
            const route = self.RouteResultSet[ele.dispatchcaseId];
            list[index].type = 'start';
            list[index].route = {distance: (route.route || {}).distance, duration: (route.route || {}).duration, dispatchcaseId: ele.dispatchcaseId };
            self._TeamNowLocation({x: list[index].longitude, y: list[index].latitude}, ele.dispatchcaseId);
          });
          self._updateTeamPointLayer(list, 'dispatchTemaLayer');
          dataObj.data.list = list;
          resolve(dataObj);
        });
      });
    });
  },
  // 清除所有队伍
  clearAllTeamLayer() {
    this.getAllTeamDataStatus = 'remove';
    this.closePopup();
    this._clearLayers();
  },
  // 清除出动队伍
  clearDispatchTeamLayer() {
    this.getDispatchTeamDataStatus = 'remove';
    this.closePopup();
    this.clear();
  },
  clear() {
    this._clearLayers();
    this.closePopup();
    this.clearRealTimeLayer();
  },
  _addResource(type: any, dataCol: any, featureName: any) {
    const featureType = this._getFeatureType(type);
    const self = this;
    let symbolMapper: any = null;
    symbolMapper = SymbolMap.default;
    this.currrentRescueTeamData = null;
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (data: any) => {
        let symbolObj: any = null;
        symbolObj = Util.toJSON(symbolMapper.symbol);
        const teamtypeKey = teamTypeCode[data.rescuetypecode];
        symbolObj.options.source = this.options.symbolConfig.icons[
          symbolMapper.iconFn(teamtypeKey, data)
        ];
        return new (G as any).utils.RenderUtil.object2Symbol(symbolObj);
      },
    });
    const opts = {
      featureType,
      featureName,
      idField: '_id',
      list: dataCol,
      type: 0,
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['geom'],
      }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        click: (data: any) => {
          const dataObj = data[0];
          this._clearPopup(featureType);
          const element: any = dataObj.element;
          const attrObj: any = Util.attributeSet2Object(element.attributeSet);
          this._addPopup(featureType, element, false);
          this._showHighlight(
            type,
            [element.geometry.x, element.geometry.y],
            attrObj,
          );

        },
      },
    };
    this.simpleRenderMgr.add(opts);
    this.featureTypeSet[featureType] = true;
  },

  _removeResource(typeArr: any) {
    typeArr.forEach(async (type: any) => {
      const featureType = this._getFeatureType(type);
      this.simpleRenderMgr.remove(featureType);
      delete this.featureTypeSet[featureType];
    });
  },

  _getFeatureType(type: any) {
    const featureType = `disaster_team_${type}`;
    return featureType;
  },
  // 获取所有队伍
  _getDataCol(optt: any) {
    const opts = optt;
    const keyWord = opts.keyWord ? opts.keyWord : '';
    const districtCode = opts.districtCode ? opts.districtCode : publishObjectPath.value.district.root;
    if (opts.typeArr.length === 0 || opts.typeArr.length === 25 ) {
      opts.typeArr = [];
      Object.keys(teamTypeCode).map((key: any) => {
        opts.typeArr.push(key);
      });
    }
    return new Promise(async (resolve, reject) => {
      if (!this.options.eventInfo) {
        const ranges = this.options.eventInfo.getRanges();
        const point = this.options.eventInfo.getPoint();
        const optMap = {
          point,
          level: ranges[ranges.length - 1].level,
          geometry: ranges[ranges.length - 1].geometry,
          rescueTypecodes: opts.typeArr,
          keyWord,
          districtCode,
        };
        if (opts.geometry) {
          optMap.geometry = opts.geometry;
        }
        this.options.service.getRescueTeamDataList(optMap).then((data: any) => {
          resolve(data);
        });
      } else {
        const optMap: any = {
          level: '6级',
          rescueTypecodes: opts.typeArr,
          keyWord,
          districtCode,
        };
        if (opts.geometry) {
          optMap.geometry = opts.geometry;
        }
        this.options.service.getRescueTeamDataList(optMap).then((data: any) => {
          resolve(data);
        });
      }

    });
  },
  /**
   * 显示资源的弹框
   * @param type 资源类型
   * @param id 资源id
   */
  openPopup(id: any) {
    this._clearPopup();
    let element: any = null;
    const featureType = this._getFeatureType('allTeam');
    this.simpleRenderMgr.visitFeature(featureType, {
      visit: (ele: any, layerTmp: any) => {
        if (ele.id === id) {
          element = ele;
          return false;
        }
        return true;
      },
    });
    if (element) {
      const attrObj: any = Util.attributeSet2Object(element.attributeSet);
      // this._addPopup(featureType, element);
      this._showHighlight(
        featureType,
        [element.geometry.x, element.geometry.y],
        attrObj,
      );
    }
  },
  /**
   * 清除弹出框
   */
  closePopup() {
    // console.log(' clearPopup ');
    this.hideHighlight();
    this._clearPopup();
  },

  /**
   *
   * @param featureType
   * @param element
   * @param noneMouseClick 是否非地图点击触发
   */
  _addPopup(featureType: any, element: any, noneMouseClick: any = true) {
    const geometry = element.geometry;
    const popupOptions: any = {
      id: this.options.popupId,
      anchor: [geometry.x, geometry.y],
      className: '',
    };
    if (noneMouseClick) {
      // 点击列表触发时，设置自动调整视野的延迟
      popupOptions.autoPanTimeout = 1200;
    }
    this.popupManager.clear();
    this.popupManager.addSimple(popupOptions).then((content: any) => {
      const attrObj = Util.attributeSet2Object(element.attributeSet);
      this.fire(this.options.fireAddPopupEventId, {
        featureType,
        type: 'allRealTeamPopup',
        attrObj,
        content,
      });
    });
  },

  _clearPopup(type: any) {
    if (this.popupManager) {
      this.popupManager.remove(this.options.popupId);
    }
  },

  _clearLayers() {
    for (const key of Object.keys(this.featureTypeSet)) {
      this.simpleRenderMgr.remove(key);
      delete this.featureTypeSet[key];
    }
  },
  /**
   * 根据经纬度高亮
   * @param Type 类型
   * @param coordinate 经纬度数组
   * @param data
   */
  _showHighlight(Type: string, coordinate: number[], data: any) {
    const symbolMapper = SymbolMap.default;
    const symbolObj = Util.toJSON(symbolMapper.hlSymbol);
    const teamtypeKey = teamTypeCode[data.rescuetypecode];
    symbolObj.options.source = this.options.symbolConfig.icons[
      symbolMapper.iconHlFn(teamtypeKey, data)
    ];
    const options = {
      data: {
        type: 'wkt',
        geom: 'POINT(' + coordinate[0] + ' ' + coordinate[1] + ')',
      },
      style: symbolObj,
      blink: {
        enable: true,
      },
    };
    this.featureHighlight.addHighlight(this.options.highLightId, options);
    const self = this;
    const point = new g2.sfs.Point({
      x: coordinate[0],
      y: coordinate[1],
      spatialReference: this.map.spatialReference,
    });
    this.map.pan(point);
    this.map.zoomTo(13);
    this.timeout = setTimeout(() => {
      _setbink();
    }, 3500);
    function _setbink() {
      clearTimeout(self.timeout);
      self.timeout = null;
      self.featureHighlight.removeHighlight(self.options.highLightId);
      const options2 = options;
      options2.blink.enable = false;
      self.featureHighlight.addHighlight(self.options.highLightId, options2);
    }
  },
  // 隐藏高亮
  hideHighlight() {
    this.featureHighlight.removeHighlight(this.options.highLightId);
    this.highlightids.forEach((highlightid: any) => {
      this.featureHighlight.removeHighlight(highlightid);
    });
    this.highlightids = [];
  },
  // 已出动队伍实时点位
  _showResourcesOnMap(opt: any, listData: any) {
    const self = this;
    if (this.status !== 'goTeam') {
      return;
    }
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (builddata: any) => {
        const symbolObj = this._getPointSymbol(builddata.type);
        // 根据数据属性控制不同的显示效果
        return G.utils.RenderUtil.object2Symbol('PictureMarkerSymbol', symbolObj);
      },
    });
    const opts = {
      featureType: opt.featureType,
      featureName: opt.featureName,
      idField: opt.idField,
      list: listData,
      type: 0,   // 使用元素图层
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['geom'],
      }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        click: (data: any) => {
          const result: any = data[0];
          const element: any = result.element;
          const attributeObj: any = Util.attributeSet2Object(element.attributeSet);
          if (attributeObj.type === 'zhudi') {
            this.dispatchServer.getDispatchResidenceDetail({teamId: attributeObj.teamId}).then((res: any) => {
              this.fire(this.options.popupEventId, {attributeObj: res.data, type: 'zhudi', visible: true});
            });
          } else if (attributeObj.type === 'start') {
            this.dispatchServer.getDispatchTeamDetail({dispatchcaseId: attributeObj.dispatchcaseId}).then((res: any) => {
              res.data.route = attributeObj.route;
              this.fire(this.options.popupEventId, {attributeObj: res.data, type: 'TeamRealLocation', visible: true});
            });
          }
        },
      },
    };
    opts.geometryBuilder = new (G as any).utils.GeometryBuilder({ geometryField: ['longitude', 'latitude'] });
    this.simpleRenderMgr.add(opts);
    this.featureTypeSet[opt.featureType] = true;
  },
  // 根据类型获取点symbol
  _getPointSymbol(iconClass: any) {
    const symbol: any = {
      width: '25',
      height: '40',
      rotation: '0',
      opacity: '1',
      offsetX: '23',
      offsetY: '72',
    };
    const obj: any = {};
    switch (iconClass) {
      case 'zhudi':
        obj.source = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAABICAYAAABiI3xzAAAIRElEQVRogcWaf3CURxnHP5tcDnLJkYT8LoZAYyRzMAUZqXUimTZOZrToiI10rDpAbYdKfzmVopQOmg6jttqx6qDYSG2rk1aFOLVOtC0KSFor1tSIGCtQiSQlCSEkIeQCyd2tf+z9fO/ufffu3qTfv+7dfXb38+7tPvvusytWtGWRgSqBjwBrgGVADVAM5AfzLwMXgf8C/wGOAX8C+jJpVKQBnQdsBD4L1AMijXa7gf3AT4HBVAunAp0PbAfuBRam2lASTQO/AHYDp3UL6RI3AyeBr2EfMIAT9a/9C3gc9S9aygo6F9gHHECN39mSE9iGGjYftDI2gy4GDgF32MOlpfcCR4EvmBklgy5FzfIbbIbSkRN4Cng4mUF2WXPc5HcBLwPvnz0uLTUCXuDPxoxEPf19NMbVHOkx4FPGRCP0BuDOOcHRkwCeRY31sKKh3cATurV53A3sbzrO/qbj1Bc324OYWG7gGaIWMUdU5oPAIt2alubXUVe6HIBCZ3FcvsfdwNL8Oq26/jZymKHpU2Ym9cBngOchAu0G7tMF1tEjN+wJv5SVdhzeSseAKTTAI6il3xeC/jxQZFai3FnLB4pvCj/XFV1n+L0l/Hzm8ltasCmqFlgPHIiGNtVWzy6aPZ9LmLd51daY5/aeNjYcvC6hbUjrKrfw6E17dWCjdQdwIAuoAD6Uaul3SU3AQgdwIxqfly3dG2np3hh+ju4pNSZbZwczVtlAYxbvzlKdiRocqB2H7Sp31rLVsytpflle2h+NKx0YVptEuq36K9zyvti5mueMfPres/qrbJ6+Nyb/mRN7kk7cDLXEAZRZWS0rWmHqc6sKlpiW7xvvZXJ6MiYtz5lnWS6JyhzAAiurN4ZeTZi+vHRV+GXae9qSlv/hm4/FTVSPu4Fba9RnTop+fb4DtU9zmll1DLTSMdBKfXEzi/NruDQ9RsdAKy2rfhaGjvYsoLyLmXomjtLSfTQV2JCuOlDfrKbQITVVfTI8Tjues8fFbfPsoaZoGZ39B3n+f9/WKTKeBZyzpfU05XYuYG11Izvrv6VbpNeBCqR4UmnIO+ONS9vfdDxS69hpjvS/lEqVCetMom4H0AV8XMc65FvPjp2Jy4vzLv16BEsLa5PWmURHHUCnrnWpqzxpXrT3GJjsj/EI667dkLDMAmchdaUrABj2DulidIagx4ECK+vFhUsB1ased0NMntF7AIx4hyl2lbK2upG11Y2mdf/j/Bs6wF3A2SyUy/u1lbXH3YArxxV+frzhacsWHu68h77xXlMb74yX9p42njy107I+4GmI7FyeBG43s15b8dGY56qCJRS7zBfT10baubmjXQdGR1eA5yCysT0GJF72glpZtgaI9AwQ0/NzoGeBUYjd2H4d+GMi63JnbXhMdp37Cy3dGynLq4wZp8c2TPDW8AnOjFnu9ZLqV2/vo2ci4Sp5FfhG6CEa+hBq4xg31RsrI/GSzv6DANz9WhPbRvdw6/JNuHJcuHJcrL7melZfc33a0Ht7difLaiUqEG+MTy8C/o3ancfoyHoV+77xhYqY9HJnLeurb2dl2RpKXeXaO3Cj3jz3VzYdSbjrGwPqgLBPdBgM3gF2Ad+Lg+59hYHJ+BVjaPqUmvnpjworPUQUMCQ+CRBAB/CxWcPQ1+vAh4FAdGKiAKREReffmQMoM00Dd2EAhuTx6QuoMNT0LEJZ6SHgn4kyzE4CXgW+NCs41noZk2Co1ZnLj1Hx6rnUELAZNUwTSud0axvwok1AVvKjzidNzxZ1oP3Abailfra1HbXImUr3HNELfIIUDijTUBuaQf1UzpiHgXWob2+71UV0rNhCqR6MnwRuwV5X2I+KO2tvEtO5gnAIdTiZdHanoHHgZrR3lErp3ptoQx0nZKLQBE+4gJgpk8seu4HU4gSxug/4fToFM4EOAJuAkTTK7gNSPrsIKaNrNcB54MspljlFhp8HmUID/BzlsnT1RVLwFIlkB7REbRx09CIaK56V7IAGNSG7LWwk0GJHY3ZBS+BHFjavAH+3ozG7oAF+iflYte3Mzk7oSyT3uyPAb+1qyE5ogN8kSX8BmLGrEbuhD5L4m+R3djZiN/QgYDyq8gOH7WzEbmiIvyjVRTBwaJdmA9oYHTeNxqYjY1gsJU3srHIIdZyXg7ohkJ175/ne7Guvhm0CFxw9k9+tLBXglwI/khlg2v3NPt+cQY/vWJQlpMwHXBBwBACBRAICwdRLC07n3z3sC9U9cyL3uAwE5gUkCAFINVMv7VjkQ+KVQl4uePRcXBTJNujRBysKEL6FUorg/RCpLooEH6UEzmRL6RMnhUN6CDA82ZE3IvA5FaxACPV6UkonQrgEsnh0e/nFou8Mae89taGHHygpAV+JUJgSpFCxyrCHUzQg5ZToEW7pkVdEV8CvgI02RC7GSKDywgMlOSVPXLhgG/Tg/UVZAn8lSKGaE0gZbNXALYGZvuzOeZ7Ap2fOZv/B7/M7kcHhIwRSRv074XRAUjl4f9HFih+MWg4VLejAjA8pZI6QZClIAcLYWRH6i3vnvV50l9wx+tT8zoDP5xTG/pWo8qE/S1UR0L3zrn1TvW9L7nuAxUZEEewyGUyMtCuCWDELZPBtpeE1BULKs1U/mdLalQvVWnK55+dGegVZiaAGKRygxoeUIraDYoZ8uBwgIklEdbDAJyRvAwOhnIkrU5lBu5w5BOmCTUmHQFSBrJCIfDVaJEIGHV8UTdjHRA+HUM8LcRnkIJI+wCdE8D+REu+M+beVJfT87OzYrjG8E+rmZGHwdy6IeSCzQGQjpR9BAMRVkFOAF8SYQI5KhDdZvOeK32/K9H+3V4Wg3imG4wAAAABJRU5ErkJggg==';
        break;
      case 'end':
        obj.source = 'data:image/png;base64,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';
        break;
      case 'start':
        obj.source = 'data:image/png;base64,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';
        // obj.source = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAYAAADhu0ooAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEgAACxIB0t1+/AAAACRJREFUaEPtwTEBAAAAwqD1T20KPyAAAAAAAAAAAAAAAACAsxo0ygABfS3nggAAAABJRU5ErkJggg==';
        obj.width = '48';
        obj.height = '48';
        obj.offsetX = '24';
        obj.offsetY = '24';
        break;
    }
    return Object.assign(symbol, obj);
  },
   // 队伍实时位置动态图标
   _TeamNowLocation(point: any, dispatchcaseId: any) {
    const self = this;
    const overlayWare = new g2.widget.OverlayWare({
      map: self.map,
    });
    $('body').append(`<div class="team_now_Location_div" id=${dispatchcaseId}>` +
      `<div style=""  class="team_now_Location"></div>` +
      `</div>`);
    const contentTemplate11 = document.getElementById(dispatchcaseId);
    const positionpoint: any = {
      x: point.x * 1,
      y: point.y * 1,
    };
    const overlay = new g2.widget.OverLay({
      id: 'team_now_Location',
      stopEvent: false,
      element: contentTemplate11, // dom元素对象
      position: positionpoint, // 覆盖物在地图上停靠的位置
      offset: [-34 , -40], // 位置偏移量，根据覆盖物上展示的图标符号的大小来确定
    });
    overlayWare.add(overlay);
  },
  processData(list: any) {
    const self = this;
    let counter = 0;
    return new Promise((resolve, reject) => {
      for (let j = 0, len = list.length; j < len; j++) {
        this.showTrack(list[j].track); // 显示历史轨迹
        const item = list[j];
        const params: any = {
          id: item.dispatchcaseId,
          startPoint: [item.longitude * 1, item.latitude * 1],
          endPoint:  [item.longitudeLast * 1, item.latitudeLast * 1],
        };
        const xy = self.TeamRealLocation[item.dispatchcaseId];
        const route = self.RouteResultSet[item.dispatchcaseId];
        if (xy && route) {
          // 起点没变化，不需要重新计算
          if (xy.x === item.longitude * 1 && xy.y === item.latitude * 1) {
            counter ++;
            if (self.options.getDispatchTeamDataStatus === 'remove') {
              self.clearRealTimeLayer();
            }
            self.options.simpleRouter.DrawRouteLayer(self.RouteResultSet[item.dispatchcaseId].route, item.dispatchcaseId);
            if (counter === list.length) {
              resolve();
            }
            continue;
          }
        }
        self.TeamRealLocation[item.dispatchcaseId] = {x: item.longitude * 1, y: item.latitude * 1};
        self.options.simpleRouter.addRoute(params).then((route2: any) => {
          counter ++;
          if (self.options.getDispatchTeamDataStatus === 'remove') {
            self.clearRealTimeLayer();
          }
          route2.dispatchcaseId = item.dispatchcaseId;
          self.RouteResultSet[item.dispatchcaseId] = route2;
          if (counter === list.length) {
            resolve();
          }
        });
      }
    });
  },
  // 清除实时路径规划图层
  clearRealTimeLayer() {
    this.options.getAllTeamDataStatus = 'remove';
    this.clearAllRoute();
    clearInterval(this.options.RealTimeTeamInterval);
  },
  // 清除所有路径规划结果图层
  clearAllRoute() {
    this.options.simpleRouter.clear();
    $('.team_now_Location_div').remove();
    if (this.map.findLayer('TemaptrackLayer')) {
      const trackLayer = this.map.findLayer('TemaptrackLayer');
      trackLayer.clear();
    }
  },
   // 设置图层参数
   _setFeatureLayer(type: any) {
    if (type === 'dispatchTemaLayer') {
      return {
        featureType: 'dispatchTemaLayer',
        idField: 'dispatchcaseId',
        featureName: '已出动队伍图层',
      };
    } else {
      return {
        featureType: 'startEndLayer',
        idField: 'teamId',
        featureName: '出动队伍起点和终点图层',
      };
    }
  },
  // 更新已出动队伍的点位数据
  _updateTeamPointLayer(dataArr: any, featureType: any) {
    const opt: any = {};
    opt.featureType = featureType;
    opt.list = dataArr;
    this.simpleRenderMgr.update(opt);
  },
   // 显示历史轨迹
   showTrack(dataArr: any) {
    // 实时轨迹图层
    if (this.map.findLayer('TemaptrackLayer')) {
      this.trackLayer = this.map.findLayer('TemaptrackLayer');
    } else {
      this.trackLayer = new g2.carto.ElementLayer({
            id: 'TemaptrackLayer',
            name: '实时轨迹图层',
        });
      this.map.addLayer(this.trackLayer);
    }
    const polylineSymbol = new g2.sfs.SimpleLineSymbol({
      width: 10,
      style: 5,
      color: new g2.sfs.Color({ a: 255, r: 121, g: 121, b: 121 }),
    });
    const polyline = new g2.sfs.Polyline({
      spatialReference: this.map.spatialReference,
    });
    const path = new g2.sfs.Path({
      spatialReference: this.map.spatialReference,
    });
    if (dataArr !== null && dataArr.length > 0) {
      dataArr.forEach((ele: any) => {
        const point1 = new g2.sfs.Point({
          x: ele.longitude,
          y: ele.latitude,
          spatialReference: this.map.spatialReference,
        });
        path.addPoint(point1);
      });
      polyline.addGeometry(path);
      this.trackLayer.add(new g2.sfs.Element({ geometry: polyline, symbol: polylineSymbol }));
    }
  },
});
export default component;
