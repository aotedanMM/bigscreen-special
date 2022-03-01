export default {
  namespaced: true,
  state: {
    config: {},
    fastSearchPosition: 0, // fastSearchPosition:左侧一键搜索的位置。
    contListAll: [],
    FireContListAll: [],
    videoShow: false,
    ischeck: '',
  },
  mutations: {
     // 当事件变换包括：常态、处置态任意切换时，都会触发，把json文件存到vuex
    setConfig(state: any, data: any) {
      state.config = data;
    },
    setContListAll(state: any, data: any) {
      state.contListAll = data;
    },
    setFireContListAll(state: any, data: any) {
      state.FireContListAll = data;
    },
    setVideoShow(state: any, data: any) {
      state.videoShow = data;
    },
    setIsCheck(state: any, data: any) {
      state.ischeck = data;
    },
  },
};
