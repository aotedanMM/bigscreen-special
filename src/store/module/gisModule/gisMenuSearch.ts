import { staticDataRequestServer } from '@/api/installServer';

export default {
  namespaced: true,
  state: {
    showResultPanel: false,
    isGisDetail: false,
    nameData: { // 搜索的位置选点后的返回结果。
      address: '',
      geom: {
        coordinates: ['', ''],
      },
      name: '',
      _id: '',
      districtObj: {
        code: '220581',
        name: '梅河口市',
      },
    },
    handResultData : {  // 右侧面板点线面和行政区划的地图执行后的结果
        districtCodeArrStr: '', // 行政区划的code数组的字符串
        curResultType: 'quanguo', // 点DrawPoint，线DrawLine，面DrawPolygon，行政区划districtCode 全国默认 quanguo
        type: '', // 点线面 buffer，行政区划 districtCode,
        buffer: '', //
        isRefeshData: true, // true，代表要输刷新数据
    },
    eventType: '',
  },
  mutations: {
    changeShowResultPanel(state: any, data: any) {
      state.showResultPanel = data;
    },
    changeNameData(content: any, data: any) {
      content.nameData.geom.coordinates[0] = data.coords.x;
      content.nameData.geom.coordinates[1] = data.coords.y;
      content.nameData.address = data.address;
      content.nameData.name = data.name;
      content.nameData._id = data._id;
      content.nameData.districtObj.code = data.districtObj.code;
      content.nameData.districtObj.name = data.districtObj.name;
      // content.nameData = data;
    },
    changeHandResult(content: any, data: any) {
      content.handResultData = data;
    },
    changeIsRefeshData(content: any, data: any) {
      content.handResultData.isRefeshData = data;
    },
    changeEventType(state: any, data: any) {
      state.eventType = data;
    },
  },
  actions: {
    // setDistrict(content: any, data: any) {
    //   content.commit('changeDistrict', data);
    // },
  },
};
