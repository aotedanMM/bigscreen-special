// 存放地震模型缓存
export default {
  namespaced: true,
  state: {
    clickFirePoint: false,
    firePointXY: [],
  },
  mutations: {
    setClickFirePoint(state: any, data: any) {
      state.clickFirePoint = data;
    },
    setFirePointXY(state: any, data: any) {
      state.firePointXY = data;
    },
  },
  actions: {
  },
};
