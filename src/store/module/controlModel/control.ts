export default {
  namespaced: true,
  state: {
    // 默认：default  全屏：full  半屏：2rd
    gisMapScreenState: '2rd',
    // 是否是半屏
    screen2rdFlag: true,
    // 是否是全屏
    screenfullFlag: false,
    // 0：经验圈 1：烈度
    mapCircleQueryType: 0,
    // 当前地图是二维 2d 还是三维 3d
    mapDimensionality: '2d', // 这个现在在layoutMain中用到了
    // 经验圈
    exprienceCircle: 3, // 0-3
  },
  mutations: {
     // 设置半屏状态
    setScreen2rdFlag(state: any, data: boolean) {
      state.screen2rdFlag = data;
    },
    setMapCircleQueryType(state: any, num: number) {
      state.mapCircleQueryType = num;
    },
    setGisMapScreenState(state: any, str: string) {
      state.gisMapScreenState = str;
      if ( str === 'default') {
          state.screen2rdFlag = false;
          state.screenfullFlag = false;
      }
      if ( str === 'full') {
          state.screenfullFlag = true;
      }
      if ( str === '2rd' ) {
          state.screen2rdFlag = true;
      }
    },
    // 设置二维三维
    setMapDimensionality(state: any, str: string) {
      state.mapDimensionality = str;
    },
    setCircleQueryTypeAnd(state: any, num: number) {
      state.mapCircleQueryType = num;
    },
  },
};
