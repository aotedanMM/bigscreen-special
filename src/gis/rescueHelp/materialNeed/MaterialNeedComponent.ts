// 物资需求
const ComponentBase = (G as any).base.ComponentBase;
const component = ComponentBase.extend({
  options: {
    service: null,
    eventInfo: null,
    simpleRenderMgr: null,
    popupManager: null,
    featureLocate: null,
    featureHighlight: null,
    symbolConfig: null,
    highLightId: 'rescue_help_material_ndeed', // 高亮id
    popupEventId: 'popup', // 添加弹窗后执行事件id
  },
  // 初始化
  initialize(options: any) {
    ComponentBase.prototype.initialize.call(this, options);
  },
  //  销毁
  destroy() {
    ComponentBase.prototype.destroy.call(this);
  },

  /**
   * 加载
   */
  load() {
    // todo
  },

  /**
   * 卸载
   */
  unload() {
    // todo
  },
});
export default component;
