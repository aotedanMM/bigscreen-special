export default {
  state: {
  showPathPanel: false,
  },
  mutations: {
    updateShowPathPanel(state: any, data: any) {
      state.showPathPanel = data;
    },
  },
  actions: {},
  getters: {
    getShowPathPanel(state: any) {
      return state.showPathPanel;
    },
  },
};
