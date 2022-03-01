/**
 * 查询条件面板、工具条上周边查询工具关系处理
 */
import { locationServer, regionSelectionServer, districtServer } from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';
export default {
  computed: {
    showResultPanel() { // 是否显示资源查询条件面板
      return (this as any).$store.state.gisMenuSearch.showResultPanel;
    },
    eventLocation() {
      return (this as any).$store.state.eventPushStore.eventLocation;
    },
  },
  watch: {
    showResultPanel(val: any) {
      if (val === true) { // 关闭工具条上周边查询
        (this as any).onNearbyClose();
      }
    },
    eventLocation(val: any) {
      const self = this;
      if (val) {
        const opts = {
          location: [val.EventLon, val.EventLat],
          level: 3,
        };
        (this as any).updateDistrict(opts);
        (this as any).updateEventType({eventType: val.EventType});
      }
    },
  },
  data() {
    return {
      // 默认定位的行政区划
      currentDistrict: {},
      regionSelectionOption: {
        districtCode: publishObjectPath.value.district.root,
        service: regionSelectionServer,
      },
      // 更改需求-城市多选前-默认定位的行政区划
      citySelectShowInfoOption: {
        districtCode: publishObjectPath.value.district.root,
        service: regionSelectionServer,
      },
    };
  },
  methods: {
    // 获取默认的行政区划
    initCurrentDistrict() {
      const self: any = this;
      locationServer.ipGetDistrict().then((res: any) => {
        self.$store.commit('mapModule/changeDistrict', res);
        self.currentDistrict = res;
        self.$store.commit('mapModule/changeDistrictShowName', res.districtName);
      });
    },
    // 行政区划按钮点击，切换面板显示隐藏
    onRegionSelectionBtnClick() {
      const self: any = this;
      const show: any = !self.$store.state.mapTools.regionPanelVisible;
      self.$store.commit('mapTools/changeRegionPanelVisible', show);
      if (show) {
        self.$store.commit('mapTools/changeNearbyQueryVisible', false);
        // da
        self.messsageBus.emit('queryAroundAdministrativeDivisions', false);
      }
    },
    // 缓冲查询按钮点击
    onNearByBtnClick() {
      const self: any = this;
      const show: any = !self.$store.state.mapTools.nearbyQueryVisible;
      self.$store.commit('mapTools/changeNearbyQueryVisible', show);
      if (show) {
        self.$store.commit('mapTools/changeRegionPanelVisible', false);
        // 点击周边查询后为防止面板重叠关闭右侧面板同时图例右移
        self.$store.commit('panelPositionChangeModule/setbotLegendLocation', 'right: 135px;' );
        // 点击周边查询后定位操作面板收起
        self.messsageBus.emit('positioningOperation', false);
        // da
        self.messsageBus.emit('queryAroundAdministrativeDivisions', false);
      }
    },
    // 工具条周边查询面板关闭
    onNearbyClose() {
      const self: any = this;
      self.$store.commit('mapTools/changeNearbyQueryVisible', false);
      // 重置条件
      const params: any = {
        type: '', // 点线面 buffer，行政区划 districtCode,
        buffer: '', //
        curResultType: 'quanguo', // 点DrawPoint，线DrawLine，面DrawPolygon，行政区划districtCode 全国默认 quanguo
        isRefeshData: true, // true，代表要输刷新数据
        districtCodeArrStr: '', // 行政区划的code数组的字符串
      };
      self.$store.commit('gisMenuSearch/changeHandResult', params);
    },
    // 工具条缓冲区变化
    onNearbyChange(data: any) {
      const self: any = this;
      const typeMap: any = {
        point: 'DrawPoint',
        line: 'DrawLine',
        polygon: 'DrawPolygon',
      };
      const params: any = {};
      params.type = 'buffer';
      params.buffer = data.geometry;
      params.curResultType = typeMap[data.type];
      params.isRefeshData = true;
      params.districtCodeArrStr = '';
      self.$store.commit('gisMenuSearch/changeHandResult', params);
    },
    // 区域选择关闭
    onRegionSelectionClose() {
      const self: any = this;
      self.$store.commit('mapTools/changeRegionPanelVisible', false);
      // 重置条件
      const params: any = {
        type: '', // 点线面 buffer，行政区划 districtCode,
        buffer: '', //
        curResultType: 'quanguo', // 点DrawPoint，线DrawLine，面DrawPolygon，行政区划districtCode 全国默认 quanguo
        isRefeshData: true, // true，代表要输刷新数据
        districtCodeArrStr: '', // 行政区划的code数组的字符串
      };
      self.$store.commit('gisMenuSearch/changeHandResult', params);
    },

    // 跟新需求-多选区县-区域选择关闭
    onCitySelectShowInfoClose() {
      const self: any = this;
      self.$store.commit('mapTools/changeCitySelectVisible', false);
      // 重置条件
      const params: any = {
        type: '', // 点线面 buffer，行政区划 districtCode,
        buffer: '', //
        curResultType: 'quanguo', // 点DrawPoint，线DrawLine，面DrawPolygon，行政区划districtCode 全国默认 quanguo
        isRefeshData: true, // true，代表要输刷新数据
        districtCodeArrStr: '', // 行政区划的code数组的字符串
      };
      self.$store.commit('gisMenuSearch/changeHandResult', params);
    },
    // 区域选择变化
    onRegionSelectionChange(data: any) {
      const self: any = this;
      self.$store.commit('mapModule/changeDistrict', {
        districtCode: data.districtCode,
        districtName: data.location,
      });
      const params: any = {};
      if (data.districtCode === '000000') {
        params.curResultType = 'quanguo';
        params.districtCodeArrStr = '';
        params.type = '';
        params.buffer = '';
      } else {
        self.$store.commit('mapModule/changeDistrictShowName', data.location);
        params.curResultType = 'districtCode';
        params.districtCodeArrStr = data.districtCode;
        params.type = '';
        params.buffer = '';
      }
      params.isRefeshData = true;
      self.$store.commit('gisMenuSearch/changeHandResult', params);
    },

    // 更新需求-多选区县-区域选择变化
    onCitySelectShowInfoChange(data: any) {
      const self: any = this;
      self.$store.commit('mapModule/changeDistrict', {
        districtCode: data.districtCode,
        districtName: data.location,
      });
      const params: any = {};
      if (data.districtCode === '000000') {
        params.curResultType = 'quanguo';
        params.districtCodeArrStr = '';
        params.type = '';
        params.buffer = '';
      } else {
        self.$store.commit('mapModule/changeDistrictShowName', data.location);
        params.curResultType = 'districtCode';
        params.districtCodeArrStr = data.districtCode;
        params.type = '';
        params.buffer = '';
      }
      params.isRefeshData = true;
      self.$store.commit('gisMenuSearch/changeHandResult', params);
    },

    // 推送定位更新政区展示名称
    updateDistrict(opts: any) {
      const self: any = this;
      // 执行行政区划查询
      districtServer.getDistrictByLonLat(opts).then((data: any) => {
        if (data && data.code === 0) {
          if (data.data && data.data[0].name) {
            const disName = data.data[0].name;
            self.$store.commit('mapModule/changeDistrictShowName', disName);
          } else {
            self.$store.commit('mapModule/changeDistrictShowName', '烟台市');
          }
        }
      });
    },
     // 推送类型更新
    updateEventType(opts: any) {
      const self: any = this;
      if (opts.eventType) {
        console.log('当前事件类型：' + opts.eventType);
        self.$store.commit('gisMenuSearch/changeEventType', opts.eventType);
      }
    },
  },
};
