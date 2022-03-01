// 模块的GIS逻辑
const componentBase = (G as any).base.ComponentBase;
const component = componentBase.extend({
  // 属性
  options: {
    popupId: 'popup_EventPoints', // 弹窗唯一标识
    personnelKey: [
      'school',
      'hospital',
      'airport',
      'railwaystation',
      'hazardous',
      'coalMine',
      'metalnonmetal',
      'mine',
      'explosive',
      'reservoir',
      'portwharf',
      'nuclear',
      'landslide',
      'emptysubside',
      'debrisflow',
      'mountaincollapse',
      'bottomcollapse',
      'groundfissure',
      'landsubsidence',
      'unstableslopes',
      'disinfoper',
      'emergencypart',
      'MON_MONITORSTATION_EARTHQUAKE',
      'EAR_HISTORY',
      'hotel',
      'market',
      'bazaar',
      'Gymnasium',
      'culturalvenues',
      'metallurgical',
      'shelter',
      'gasstation',
      'sluice',
      'powerfacilities',
      'supwatfacil',
      'gasfacil',
      'powerfacil',
      'emergenceexpert',
      'generalrepository',
      'v_equipment※02',
    ],
  },
  // 初始化
  initialize(options: any) {
    componentBase.prototype.initialize.call(this, options);
    //
    this.featureType = 'influence';
    this.reset();
  },
  //  销毁
  destroy() {
    // dosth
    this.simpleRenderMgr = null;
    this.featureLocate = null;
    this.cache = null;
    componentBase.prototype.destroy.call(this);
  },

  /**
   * 加载
   * @param type 0 = 影响圈  1 = 模型服务烈度圈  2 = 上传烈度文件
   * @param noFitView 是否不调整视野，默认为false
   */
  load(type: any = 0, noFitView: boolean = false) {
    componentBase.prototype.load.call(this);
    this.type = type;
    this.addListener();
    this._doLoad(noFitView);
  },
  addListener() {
    this.map.on('mousemove', this.getInfo, this);
    G.that1 = this;
  },
  removeListener() {
    this.map.off('feature-change', this.getInfo, this);
  },
  // 监听方法，弹出面板
  getInfo(button: any, shift: any, screenX: any, screenY: any, mapX: any, mapY: any, handle: any) {
    let elelayer;
    let tempLayer;
    G.that1._clearHoverTip();
    const allLayer = G.that1.map.getLayers();
    for (const j in allLayer) {
      if (allLayer[j].id === 'default-point-group') {
        tempLayer = allLayer[j];
      }
    }
    // tslint:disable-next-line:forin
    for (const j in tempLayer.groupLayers) {
      const ele = tempLayer.groupLayers[j].hitTest(screenX, screenY);
      if (ele) {
        for (const k in G.that1.options.personnelKey) {
          // tslint:disable-next-line:no-bitwise
          if (tempLayer.groupLayers[j].id.indexOf(G.that1.options.personnelKey[k]) >= 0) {
            return;
          }
        }
      }
    }
    for (const i in allLayer) {
      if (allLayer[i].id === 'default-polygon-group') {
        elelayer = allLayer[i];
      }
    }
    if (elelayer) {
      // tslint:disable-next-line: forin
      for (const i in elelayer.groupLayers) {
        const ele = elelayer.groupLayers[i].hitTest(screenX, screenY);
        if (ele && elelayer.groupLayers[i].id === 'influence') {
          const point = { x: mapX, y: mapY };
          const name = ele.element.attributeSet.attributes[0].value + 'KM';
          G.that1._doAddHoverTip(point, name, 70, 'influence');
        }
      }
    } else {
      $('.RiskAnalysis-tooltip').remove();
      G.that1.closePopup();
    }
  },
  unload() {
    this.clear();
    this.removeListeners();
    componentBase.prototype.unload.call(this);
  },
  // 添加提示文本
  _doAddHoverTip(geometry: any, name: string, marginbottom: string) {
    const point: any = geometry;
    this.options.popupManager.addSimple({
      id: this.options.popupId,
      anchor: [point.x, point.y],
      className: '',
      zIndex: 20,
      autoPan: false,
    }).then((content: any) => {
      const dom: any = document.getElementById(content.containerId);
      if (marginbottom) {
        dom.innerHTML = `<div class='hover-title'><div style='transform: translateY(-${marginbottom}%);'><span class='hover-title_txt'><i>${name}</i></span></div></div>`;
      } else {
        dom.innerHTML = `<div class='hover-title'><div><span class='hover-title_txt'><i>${name}</i></span></div></div>`;
      }
    });
  },
  _clearHoverTip() {
    this.options.popupManager.remove(this.options.popupId);
  },

  reload(noFitView: boolean = false) {
    let type: any = null;
    if (this.isLoaded()) {
      type = this._doLoad(noFitView);
    }
    return type;
  },

  reset() {
    this.type = 0;
  },

  _doLoad(noFitView: boolean = false) {
    let type: any = null;
    console.debug('刷新影响圈 ', this.type);
    // 如果有上报的烈度圈，且当前显示的是烈度圈，则默认重新加载上报的烈度圈
    if (this.options.eventInfo.getEventInfo()
      && this.options.eventInfo.getRanges(2).length > 0
      && this.type === 1) {
      this.type = 2;
      this.options.eventInfo.setCurrentRangeType(this.type);
    }
    this.clear();
    this._render(this.type, noFitView);
    type = this.type;
    return type;
  },

  /**
   * 调用烈度模型计算
   */
  executeModel() {
    return new Promise(async (resolve, reject) => {
      const level: any = this.options.eventInfo.getLevel();
      const ranges: any = [];
      // 调用模型算法
      try {
        console.debug('计算模型烈度圈 >>>>>>>>>>>>>>>>>>');
        const modelResult: any = await this.options.service.executeModel({
          // 测试，获取模型样例json数据
          // const modelResult: any = await this.options.service.getModelData({
          point: this.options.eventInfo.getPoint(),
          level,
          date: new Date(),
        });
        this.fire('getIntensityData', modelResult);
        const resultInfo: any = modelResult.Model_Infos.GModel_EQ_Intensity.Result_Info;
        const prefixArr: any = resultInfo.Indexes.Vector_Perfix;
        const infix: any = resultInfo.Indexes.Vector_Infix;
        for (const key of prefixArr) {
          const rangeKey: any = key + infix + '0';
          if (resultInfo.hasOwnProperty(rangeKey)) {
            const item: any = resultInfo[rangeKey];
            const temp: any = {};
            temp.geometry = item.GeoJson;
            temp.level = item.Attribute.Level;
            temp.title = item.Attribute.Level_Tag;
            // 处理坐标
            if (temp.geometry.type === 'Polyline' || temp.geometry.type === 'LineString') {
              temp.geometry.type = 'Polygon';
              temp.geometry.coordinates = [temp.geometry.coordinates];
            }
            ranges.push(temp);
          }
        }
        ranges.reverse();
        const jsonReader: any = G.utils.GeometryUtil.getGeoJSONReader();
        const jsonWriter: any = G.utils.GeometryUtil.getGeoJSONWriter();
        let tempGeometry: any = null;
        for (const range of ranges) {
          const jtsGeom: any = jsonReader.read(range.geometry);
          if (tempGeometry) {
            const newGeo: any = jtsGeom.difference(tempGeometry);
            range.geometry = jsonWriter.write(newGeo);
          }
          //
          tempGeometry = jtsGeom;
        }
        // 转换格式
        this.options.eventInfo.setModelRanges(ranges);
        resolve({ optionData: this.options.eventInfo.getRanges(), dataAll: modelResult });
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  },

  /**
   * 请求并设置上报范围
   * @param opts 参数
   */
  fetchAndSetReportRanges(opts: any) {
    return new Promise(async (resolve, reject) => {
      const result: any = await this.options.service.getReportRanges(this.options.eventInfo.getId());
      this.setReportRanges(result.data);
      resolve(this.options.eventInfo);
    });
  },
  clear() {
    this.options.simpleRenderMgr.remove(this.featureType);
    this.options.simpleRenderMgr.remove('indensity' + this.featureType);
  },
  setVisible(visible: boolean) {
    this.options.simpleRenderMgr.setVisible(this.featureType, visible);
  },
  /**
   * 设置上报的范围
   * @param features
   */
  setReportRanges(features: any) {
    // 转换格式
    const ranges: any = [];
    const romaMap: any = {
      5: 'Ⅴ',
      6: 'Ⅵ',
      7: 'Ⅶ',
      8: 'Ⅷ',
      9: 'Ⅸ',
      10: 'Ⅹ',
      11: 'Ⅺ',
      12: 'ⅩⅡ',
    };
    for (const feature of features) {
      const temp: any = {};
      temp.geometry = feature.geometry;
      temp.level = feature.properties.INTENSITY;
      // temp.title = feature.properties.INTENSHOW;
      temp.title = romaMap[temp.level] + '度';
      ranges.push(temp);
    }
    this.options.eventInfo.setReportRanges(ranges);
  },


  _render(type: any, noFitView: boolean = false) {
    if (this.options.eventInfo.getEventInfo()) {
      this.options.eventInfo.setCurrentRangeType(type);
      this.options.simpleRenderMgr.remove(this.featureType);
      const drawFn: any = (this as any)[`_drawRangesType_${type}`];
      if (drawFn) {
        drawFn.call(this);
      }
      if (noFitView !== true && this.options.eventInfo.getMaxRangeGeometry(type)) {
        // fit view
        this.options.featureLocate.fit({
          type: 'geojson',
          geom: this.options.eventInfo.getMaxRangeGeometry(type),
        });
      }
    }
  },

  /**
   * 绘制影响圈
   */
  _drawRangesType_0() {
    const ranges: any = this.options.eventInfo.getRanges();
    ranges.reverse();
    const affectSymbol: any = this.options.symbolConfig.symbols.common
      .affectRadius;
    // 区分影响圈、烈度样式符号
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (content: any) => {
        return G.utils.RenderUtil.object2Symbol(affectSymbol);
      },
    });
    const opts = {
      featureType: this.featureType,
      featureName: '地震烈度',
      idField: 'level',
      list: ranges,
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['geometry'],
        geometryType: 'polygon',
      }),
      symbolBuilder: new SymbolBuilder(),
    };
    this.options.simpleRenderMgr.add(opts);
  },
  /**
   * 绘制模型的烈度圈
   */
  _drawRangesType_1() {
    const ranges: any = this.options.eventInfo.getModelRanges();
    // ranges.reverse();
    const list = [];
    for (const item of ranges) {
      const temp: any = {};
      temp.geometry = item.geometry;
      const symbolObj: any = this.options.symbolConfig.symbols.common.influence['Symbol' + item.level];
      const symbol = (G as any).utils.RenderUtil.object2Symbol(symbolObj);
      temp.symbol = symbol;
      const level = item.title.replace('级', '度').replace('烈度', '');
      // 文字
      const textSymbol = G.utils.RenderUtil.object2Symbol({
        type: 'TextSymbol',
        options: {
          text: '',
          fontFamilyName: '微软雅黑',
          fontWeight: 3,
          fontSize: 30,
          foreground: {
            alpha: 255,
            r: 255,
            g: 255,
            b: 255,
          },
        },
      });
      textSymbol.text = level;
      //
      const textTemp: any = {};
      textTemp.id = item.title + '_text';
      textTemp.geometry = {
        type: 'Point',
        coordinates: item.geometry.coordinates[0][0],
      };
      textTemp.symbol = textSymbol;
      //
      list.push(temp);
      list.push(textTemp);
    }
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (content: any) => {
        return content.symbol;
      },
    });
    const opts = {
      featureType: 'indensity' + this.featureType,
      featureName: '地震烈度',
      idField: 'level',
      list,
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['geometry'],
        geometryType: 'polygon',
      }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {},
    };
    this.options.simpleRenderMgr.add(opts);
  },
  /**
   * 绘制上传的烈度圈
   */
  _drawRangesType_2() {
    const ranges: any = this.options.eventInfo.getReportRanges();
    const list: any = [];
    ranges.forEach((range: any) => {
      const symbolObj =
        this.options.symbolConfig.symbols.common.influence[
        'Symbol' + range.level
        ];
      const symbol = (G as any).utils.RenderUtil.object2Symbol(symbolObj);

      list.push({
        title: range.level,
        geometry: range.geometry,
        level: range.level,
        symbol,
      });
      // 文字
      const textSymbol = G.utils.RenderUtil.object2Symbol({
        type: 'TextSymbol',
        options: {
          text: range.title,
          fontFamilyName: '微软雅黑',
          fontWeight: 3,
          fontSize: 30,
          foreground: {
            alpha: 255,
            r: 255,
            g: 255,
            b: 255,
          },
        },
      });
      //
      const textTemp: any = {};
      textTemp.id = range.title + '_text';
      textTemp.geometry = {
        type: 'Point',
        coordinates: range.geometry.type === 'MultiPolygon' ?
          range.geometry.coordinates[0][0][0] : range.geometry.coordinates[0][0],
      };
      textTemp.symbol = textSymbol;
      list.push(textTemp);
    });
    // 区分影响圈、烈度样式符号
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (content: any) => {
        return content.symbol;
      },
    });
    const opts = {
      featureType: 'indensity' + this.featureType,
      featureName: '上报地震烈度',
      idField: 'level',
      list,
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['geometry'],
        geometryType: 'polygon',
      }),
      symbolBuilder: new SymbolBuilder(),
    };
    this.options.simpleRenderMgr.add(opts);
  },
  unionGeometry(geometries: any) {
    return G.utils.SpatialOPUtil.unionGeometry(geometries);
  },
});
export default component;
