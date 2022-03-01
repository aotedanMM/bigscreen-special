export default {
  state: {
  showWeatherPanel: false,
  code: 110000,
  },
  mutations: {
    updateShowWeatherPanel(state: any, data: any) {
      state.showWeatherPanel = data;
    },
    updateCode(state: any, data: any) {
      state.code = data;
    },
  },
  actions: {},
  getters: {
    getShowWeatherPanel(state: any) {
      return state.showWeatherPanel;
    },
    getCode(state: any) {
      return state.code;
    },
  },
};
