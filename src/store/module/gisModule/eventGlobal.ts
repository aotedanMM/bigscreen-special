export default {
  namespaced: true,
  state: {
    send_location: {
      EventTimes: '2019-12-11 10:30:34',
      EventTit: '11·24演习',
      EventTime: '2019年12月11日10时30分',
      EventLevel: '严重',
      EventType: '6',
      EventAddr: '北京市大观园',
      EventDesc:
        '2019年12月11日10时30分,北京市大观园发生重大火灾(此信息为测试数据)',
      EventLon: 116.35,
      EventLat: 39.87,
      radius: '5,10,20,50',
      EqLevel: 7.5,
      eventid: 13140,
    },
    district: {
      code: 110100,
      name: '北京市',
    },
  },
  mutations: {
    /**
     *  切换左边的布局
     */
    changeDistrict(content: any, data: any) {
      content.district = data;
    },
    changeListSearchObj(content: any, data: any) {
      content.send_location.ListSearchObj = data;
    },
  },
  actions: {
    setDistrict(content: any, data: any) {
      content.commit('changeDistrict', data);
    },
  },
};
