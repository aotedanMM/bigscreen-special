/**
 *  台风事件信息
 */

export default {
  namespaced : true,
  state: {
    isShow: false, // 影响范围列表是否显示
    content: '', // "黄蜂" 中文名
    ename: '', // "VONGFONG" 英文名
    end: '', // "2020-5-16T17:00:00" 结束时间
    id: '', // 202001 编号
    is_current: '', // 0
    start: '', // "2020-5-12T20:00:00" // 开始时间
    geoms: '', // 台风三个面
    viewConfig: { // 页面弹窗状态
      /**
       * 台风事件进入初步研判 打开人口热力(暂时没写)
       * */
      isTyphoonShow: '', // 左侧面板初步研判是否显示(与影响区域互斥)
      /**
       * 风圈查询的时候隐藏初步研判返回按钮
       * */
      tabChooseValue: '1', // 周边查询id 1:行政区划查询 2:风圈查询 3:周边查询
      /**
       * loading完成显示风圈查询按钮 防止未加载完成切换报错
       * */
      AreaInfluenceListLoading: true, // 左侧 影响区域loading
    },
  },
  mutations: {
    SET_TYPHOON_STATE(content: any, data: any): void {
      content.content = data.content;
      content.ename = data.ename;
      content.end = data.end;
      content.id = data.id;
      content.is_current = data.is_current;
      content.start = data.start;
    },
    SET_TYPHOON_GEOMS(content: any, data: any): void {
      content.geoms = data;
    },
    SET_ISSHOW(content: any, data: any): void {
      content.isShow = data;
    },
    SET_TYPHOON_ISSHOW(content: any, data: any): void {
      content.viewConfig.isTyphoonShow = data;
    },
    SET_TAB_CHOOSE_VALUE(content: any, data: string): void {
      content.viewConfig.tabChooseValue = data;
    },
    SET_LOADING(content: any, data: boolean): void {
      content.viewConfig.AreaInfluenceListLoading = data;
    },
  },
  actions: {
    setTyphoon(content: any, data: any): void {
      content.commit('SET_TYPHOON_STATE', data);
    },
    setTyphoongeoms(content: any, data: any): void {
      content.commit('SET_TYPHOON_GEOMS', data);
    },
    setIsShow(content: any, data: any): void {
      content.commit('SET_ISSHOW', data);
    },
    setTyphoonIsShow(content: any, data: any): void {
      content.commit('SET_TYPHOON_ISSHOW', data);
    },
    setTabChooseValue(content: any, data: string): void {
      content.commit('SET_TAB_CHOOSE_VALUE', data);
    },
    setAreaInfluenceListLoading(content: any, data: boolean): void {
      content.commit('SET_LOADING', data);
    },
  },
};
