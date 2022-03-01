export default {
    namespaced: true,
    state: {
        topToolbarLocation: {
          ToolbarLocation: '', // 设置顶部工具条的位置
          experienceCirclePosition: '', // 设置经验圈面板的位置
          cityListLocation: '', // 城市列表的弹框位置
          peripheralQueryLocation: '', // 周边查询弹框的位置
          isShowquanjing: '', // 百度全景按钮
          RegionSelection: '', // 图层选择的面板的位置
        },
        botLegendLocation: '', // 设置底部图例的位置
        rightPanelPosition: {
          windFieldLegendLocation: '', // 风场图例
          historicalEarthquakeLocation: '', // 历史地震图例
          TyphoonLocation: '', // 台风图例的位置
        },
    },
    mutations: {
       // 设置顶部右侧面板消失时其他所有面板的位置
      settopToolbarLocation(state: any, data: any) {
        state.topToolbarLocation = data;
      },
       // 设置底部图例的位置
      setbotLegendLocation(state: any, data: any) {
        state.botLegendLocation = data;
      },
      // 设置左侧面板消失相应图例的位置
      setrightPanelPosition(state: any, data: any) {
        state.rightPanelPosition = data;
      },
    },
};
