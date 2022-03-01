export default {
  namespaced: true,
  state: {
      // 全国森林火险气象预报图
      showCastModel: true,
      curEventId: '',
      // 蔓延分析时间轴显示
      showSpreadTimeBar: false,
      // 当前时间轴数据信息
      currentInfo: {
        times: -1, //  时间轴下标
      },
      spreadData: {
        location: '',
        weatherInfo: {
          windInfo: {
            windArr: [],
            windArrOld: [
              {
                windType: '无风',
                windSpeed: 0,
                windStartTime: null,
                windEndTime: null,
                windLast: 0,
              },
            ],
          },
        },
        analysisTimeH: 24,
        analysisStepH: 0.5,
        analysisTime: 0,
        analysisStep: 0,
        sourceInfo: [
          {
            startTime: '',
            fireSourceInfo: {
              geoType: 0,
              geometry:  [],
              geometryString: '',
            },
          },
        ],
        isolationInfo: [],
      },
      spreadResultData: {},
      ProjectType: '',
      SpecailType: '',
  },
  mutations: {
    // 设置森火全局模式和烟台模式状态
    setShowCastModel(state: any, data: any) {
      state.showCastModel = data;
    },
    // 设置当前选择的森火接报事件id态
    setCurEventId(state: any, data: any) {
      state.curEventId = data;
    },
    // 设置蔓延分析时间轴显示状态
    setShowSpreadTimeBar(state: any, data: any) {
      state.showSpreadTimeBar = data;
    },
    // 设置蔓延分析时间轴显示状态
    setSpreadData(state: any, data: any) {
      state.spreadData = data;
    },
    setSpreadResultData(state: any, data: any) {
      state.spreadResultData = data;
    },
    // 对应专题的 themecode 值
    setProjectType(state: any, data: any) {
      state.ProjectType = data;
    },
    // 对应专题的 districtCode 值
    setSpecailType(state: any, data: any) {
      state.SpecailType = data;
    },
    // 当前时间轴数据信息
    setCurrentInfo(state: any, data: any) {
      state.currentInfo = data;
    },
  },
};

