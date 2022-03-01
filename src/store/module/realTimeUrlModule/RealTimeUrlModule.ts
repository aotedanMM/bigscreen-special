/**
 *  台风事件信息
 */

export default {
  namespaced : true,
  state: {
    isShowDialogs: false,
    getDataForreal: {},
  },
  mutations: {
    SET_ISSHOWDIALOGS(content: any, data: boolean): void {
      content.isShowDialogs = data;
    },
    SET_GETDATAFORREAL(content: any, data: any): void {
      content.getDataForreal = data;
    },
  },
};
