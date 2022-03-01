// 灾情研判人口热力
import PopHeatCompnent from '../../common/popheat/PopHeatCompnent';
const component = PopHeatCompnent.extend({
  // 属性
  options: {
    levelArr: null,
  },
  // 初始化
  initialize(options: any) {
    PopHeatCompnent.prototype.initialize.call(this, options);
  },
  //  销毁
  destroy() {
    PopHeatCompnent.prototype.destroy.call(this);
  },
  /**
   * 加载
   * @param opts 勾选的级别列表
   * @param [opts.levelArr] 勾选的级别列表
   * @param [opts.isNight] {boolean} 是否为晚上，默认为false
   */
  load(opts: any) {
    G.base.ComponentBase.prototype.load.call(this);
    return new Promise(async (resolve, reject) => {
      this._createLayer();
      // levelArr = ['5', '10']; // 经验圈
      // levelArr = [6, 7]; // 烈度圈
      opts = opts || {};
      let currentLevelArr = opts.levelArr;
      if (!currentLevelArr) {
        currentLevelArr = this.options.levelArr;
      }
      if (currentLevelArr) {
        const ranges = this.options.eventInfo.getRangesByLevel(currentLevelArr);
        const type = this.options.eventInfo.getCurrentRangeType();
        let geometry: any = null;
        switch (type) {
          case 0: // 经验圈，取最大的
            geometry = ranges[ranges.length - 1].geometry;
            if (geometry.coordinates.length > 0) {
              geometry = {
                type: 'Polygon',
                coordinates: [geometry.coordinates[0]],
              };
            }
            break;
          case 1: // 烈度圈，合并
            geometry = {
              type: 'MultiPolygon',
              coordinates: [],
            };
            for (const range of ranges) {
              geometry.coordinates.push([range.geometry.coordinates[0]]);
            }
            break;
        }
        this.getHeats(geometry, opts.isNight);
      } else {
        if (opts.geo) {
          this.getHeats(this.options.eventInfo.getMaxRangeGeometry(), opts.isNight);
        } else {
          this.getHeats(this.options.eventInfo.getMaxRangeGeometry(), opts.isNight);
        }
      }
    });
  },

  reload() {
    if (this.isLoaded()) {
      this.unload();
      this.load();
    }
  },
  /**
   * 设置levelArr
   */
  setLevelArr(levelArr: any) {
    this.options.levelArr = levelArr;
  },
  /**
   * 卸载
   */
  unload() {
    //
    this.options.levelArr = null;
    PopHeatCompnent.prototype.unload.call(this);
  },

  getEventInfo() {
    return this.options.eventInfo;
  },

});
export default component;
