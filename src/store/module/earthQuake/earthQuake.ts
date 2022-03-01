// 存放地震模型缓存
export default {
  namespaced: true,
  state: {
    isShowChemicalBlastLegend: false, // 是否显示压力容器爆炸物灾损分析图例
    chemicalBlastLegend: {
      data: [],
      color: [],
    }, // 压力容器爆炸物灾损分析图例数据
    earthQuakeIntensityData: {}, // 存放地震烈度模型数据
    substanceData: {}, // 存放地震烈度模型数据
    currentSelectLegend: '',
    substanceWeather: '雨天', // 物资信息天气
    substanceBefore: 5, // 物资信息提前期
    substanceUseNum: [], // 物资信息使用量
  },
  mutations: {
    setIsShowChemicalBlastLegend(state: any, data: any) {
      state.isShowChemicalBlastLegend = data;
    },
    setChemicalBlastLegend(state: any, data: any) {
      state.chemicalBlastLegend = data;
    },
    setEarthQuakeIntensityData(state: any, data: any) {
      state.earthQuakeIntensityData = data;
    },
    setCurrentSelectLegend(state: any, data: any) {
      state.currentSelectLegend = data;
    },
    setSubstanceType(state: any, data: any) {
      state.substanceType = data;
    },
    setSubstanceArea(state: any, data: any) {
      state.subsubstanceArea = data;
    },
    setSubstanceMonth(state: any, data: any) {
      state.substanceMonth = data;
    },
    setStanceWeather(state: any, data: any) {
      state.substanceWeather = data;
    },
    setStanceBefore(state: any, data: any) {
      state.substanceBefore = data;
    },
    setStanceUseNum(state: any, data: any) {
      state.substanceUseNum = data;
    },
    setSubstanceData(state: any, data: any) {
      state.substanceData = data;
    },
  },
  actions: {
  },
};
