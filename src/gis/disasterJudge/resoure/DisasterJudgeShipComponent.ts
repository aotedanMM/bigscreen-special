import Util from '../../Util';
/**
 * 灾情研判单类资源展示
 */
import componentBase from './DisasterJudgeResourceComponent';
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
    popupId: 'disasterJudge_resource_popup',
  },
  // 初始化
  initialize(options: any) {
    componentBase.prototype.initialize.call(this, options);
  },
  load(typeArr: any) {
    componentBase.prototype.load.call(this);
    // do sth
    return new Promise( async (resolve, reject) => {
      this.dataCol = {};
      const result: any = await this._loadDataCol(typeArr);
      const item: any = result[0].data[0];
      item.level = '';
      item.title = '影响';
      const temp: any = {
        total: 1,
        data: [
          item,
        ],
      };
      resolve([temp]);
    });
  },
  _addResource(type: any, level: any) {
    const dataCol = this.dataCol[type];
    const featureType = this._getFeatureType(type, level);
    const symbolMap: any = {
      客船: 'ship_red',
      货船: 'ship_aure',
      油轮: 'ship_guy',
      拖轮: 'ship_aure',
      执法: 'ship_blue',
      游艇: 'ship_red',
      其它: 'ship_red',
      default: 'ship_green',
    };
    const SymbolBuilder = (G as any).utils.SymbolBuilder.extend({
      build: (data: any) => {
        const iconKey: any = symbolMap[data.shipType] || symbolMap.default;
        const symbolObj = {
          width: 34,
          height: 46,
          offsetX: '17',
          offsetY: '23',
          opacity: '1',
          rotation: '0',
          source: this.options.symbolConfig.icons[iconKey],
        };
        const symbol = new (G as any).utils.RenderUtil.object2Symbol(
          'PictureMarkerSymbol',
          symbolObj,
        );
        return symbol;
      },
    });
    const opts = {
      featureType,
      featureName: '船舶',
      idField: 'id',
      list: dataCol.data[0].list,
      type: 0,
      geometryBuilder: new (G as any).utils.GeometryBuilder({
        geometryField: ['longitude', 'latitude'],
      }),
      symbolBuilder: new SymbolBuilder(),
      listeners: {
        click: (data: any) => {
          const dataObj = data[0];
          this._clearPopup(dataObj.featureType);
          this._addPopup(dataObj.featureType, dataObj.element);
        },
      },
    };
    this.simpleRenderMgr.add(opts);
    this.featureTypeSet[featureType] = true;
  },
  _adjustView() {
    //
  },
});
export default component;
