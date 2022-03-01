export default {
  namespaced: true,
  state: {
    //   largeLeftPanel: '', // 设置左侧面板显隐
    //   largeRightPanel: '', // 设置右侧面板显隐
    //   leftMapPanelMutex: '', // 设置地图面板显隐
    //   EventlistPanel: ', // 事件列表面板
    //   EventCollection:'', // 事件收藏面板
    //   comprehensiveQuery: ', // 综合查询球
    panelMutualExclusion: {
      largeLeftPanel: {
        showFlag: false,
        width: '',
      },
      largeRightPanel: {
        showFlag: false,
        width: '',
      },
      leftMapPanelMutex: {
        showFlag: false,
        width: '',
      },
      EventlistPanel: {
        showFlag: false,
        width: '',
      },
      EventCollection: {
        showFlag: false,
        width: '',
      },
      comprehensiveQuery: {
        showFlag: false,
        width: '',
      },
    },
},
mutations: {
   // 设置面板互斥
  setpanelMutualExclusion(state: any, data: any) {
    const targetKey = Object.keys(data)[0]; // 现在已知data中永远只有一个key
    if ( data[targetKey].showFlag ) { // 目标是要展开的，那么就要关闭掉其它互斥的。
      state.panelMutualExclusion[targetKey].showFlag = true;
      for (const key in state.panelMutualExclusion) { // 这个key的数组是当前store的对象key
        if (key !== targetKey) { // 要互斥的那些面板
          state.panelMutualExclusion[key].showFlag = false;
        }
      }
    } else { // 目标是要关闭的，那么就只关闭自己就好了
      state.panelMutualExclusion[targetKey].showFlag = false;
    }
  },
},
};
