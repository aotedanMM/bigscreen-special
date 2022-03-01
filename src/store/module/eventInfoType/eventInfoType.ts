export default {
    namespaced: true,
    state: {
        eventInfoType: [],
    },
    mutations: {
       // 设置半屏状态
      seeventInfoType(state: any, data: any) {
        state.eventInfoType = data;
      },
    },
  };

