import { messsageBus } from './../../../../../util/message';
/**
 *
 **/
// import { messsageBus } from '@/util/message';
export default {
  data(): any {
    return {
      name: '暂无标题',
      styles: {},
      popUpType: '',
      geometry: '',
      coordinates: '',
      geoPoint: [],
      dataObj: {},
      list: [],
      dataAttributes: [],
      dataChild: [],
      dataTag: [],
      unitObj: {
        distance: '公里',
        eClass: 'M',
        eDeep: 'Km',
      },
      telobj: {
        TEL: 'TEL',
        LEADERMTEL: 'LEADERMTEL',
        DUTYTEL: 'DUTYTEL',
        CONCATEMOBTEL: 'CONCATEMOBTEL',
      },
      dataFilter: [
        // 'NAME',
        // 'DESC',
        // 'TEL',
        // 'DISTRICT',
        // 'area',
        // 'population',
        // 'address',
        // 'typecode',
        // 'phone',
        // 'level',
        // '_distance',
        // 'advancePort',
        // 'advanceTime',
        // 'beam',
        // 'callSign',
        // 'chineseName',
        // 'groupnameStamp',
        // 'shipLength',
        // 'shipType',
        // 'stateSpeed',
        // 'mmsi',
        // 'death',
        // 'injured',
        // 'miss',
        // 'yazhongsunhuai',
        // 'yibansunhuai',
        // // 'poptotal',
        // // 'town',
        // // 'village',
        // 'damage',
        // 'dianxianhao',
        // 'dianzhancount',
        // 'distance',
        // 'eClass',
        // 'eDeep',
        // 'date',
        // 'time',
      ],
      labelObj: {
        // id: 'id',
        // NAME: '名称',
        // CONTACTPER: '联系人',
        // DUTYTEL: '值班电话',
        // DISTRICT: '行政区划',
        // area: '面积',
        // population: '人口',
        // _distance: '距离',
        // gov: 'gov',
        // adcode: '邮编',
        // address: '地址',
        // typecode: '类型编码',
        // phone: '电话',
        // level: '等级',
        // shipType: '类型',
        // stateSpeed: '速度',
        // chineseName: '中文名称',
        // shipLength: '船长',
        // callSign: '呼叫标识',
        // death: '死亡',
        // injured: '受伤',
        // miss: '失踪',
        // poptotal: '人口总数',
        // town: '行政区',
        // // village: '乡镇',
        // yazhongsunhuai: '严重受损',
        // yibansunhuai: '一般受损',
        // damage: '房屋倒塌',
        // dianxianhao: '输电线路',
        // dianzhancount: '变电站',
        // distance: '长度',
        // eClass: '震级',
        // eDeep: '震源深度',
        // date: '日期',
        // time: '时间',
        // missArea: '失联区域',
        // loss: '退服基站',
      },
      pathTypeFilter: ['RescueTeam※03'], // 周边分析 控制数组
      aroundTypeFilter: [
        'school',
        'hospital',
        'airport',
        'portwharf',
        'railwaystation',
        '_RealShip',
      ],
      videoBtnFilter: ['ANJIAN_DAGCHEMENT※DangerousChemical', 'hazardous', 'mine', 'coalMine'], // 视频监控按钮过滤
      chemicalsBtnFilter: ['ANJIAN_DAGCHEMENT※DangerousChemical', 'hazardous'], // 危化物联按钮过滤
      isShowPathPlanningBtn: true, // 路径规划  默认开关
      isAroundAnalysisBtn: true, // 周边分析  默认开关
      isVideoMonitoringBtn: true, // 视频监控  默认开关
      isHazardousChemicalsBtn: true, // 危化物联 默认开关
      btnFilter: [
        // 'pathPlanningBtn', // 路径规划
        // 'aroundAnalysisBtn', // 周边分析
        'videoMonitoringBtn', // 视频监控
        'hazardousChemicalsBtn', // 危化物联
      ],
      popHeight: 0,
      // btnList: ['pathPlanningBtn', 'aroundAnalysisBtn', 'videoMonitoringBtn', 'hazardousChemicalsBtn'],
    };
  },
  methods: {
    setGeomPoint(): any { // 设置当前点位经纬度
      // debugger;
      const that: any = this;
      if (that.data.x && that.data.y) {
        that.geoPoint = [that.data.x, that.data.y];
      } else {
        that.geometry = that.data && that.data.geometry ? that.data.geometry : [];
        that.coordinates = that.data && that.data.geom && that.data.geom.coordinates ? that.data.geom.coordinates : [];
        that.geoPoint = that.geometry ? [that.geometry.x, that.geometry.y] : [];
        that.geoPoint = that.coordinates ? that.coordinates : [];
      }
    },
    // 显示路径规划
    isShowPathPlanning(): any {
      (this as any).isShowPathPlanningBtn = true;
    },
    // 显示周边分析
    isShowAroundAnalysis(): any {
      (this as any).isAroundAnalysisBtn = true;
    },
    getDataFilter(val: any) {
      return (this as any).dataFilter.includes(val);
    },
    getBtnFilter(val: any) {
      return (this as any).btnFilter.includes(val);
    },
    getPathTypeFilter(val: any) {
      return (this as any).pathTypeFilter.includes(val);
    },
    getAroundTypeFilter(val: any) {
      return (this as any).aroundTypeFilter.includes(val);
    },
    getVideoBtnFilter(val: any) {
      return (this as any).videoBtnFilter.includes(val);
    },
    getChemicalsBtnFilter(val: any) {
      return (this as any).chemicalsBtnFilter.includes(val);
    },
    pathClick(receidata?: any) {
      // 路径规划
      // (this as any).setGeomPoint(); // 设置当前点位经纬度给geoPoint
      (this as any).pathPlanningClick((this as any).geoPoint, receidata);
    },
    realTimeClick() {
      const self: any = this;
      self.$store.commit('realTimeUrlModule/SET_GETDATAFORREAL', self.data);
      self.$store.commit('realTimeUrlModule/SET_ISSHOWDIALOGS', true);
    },
    aroundClick() {
      // 周边分析
      // (this as any).setGeomPoint(); // 设置当前点位经纬度给geoPoint
      (this as any).aroundAnalysisClick((this as any).geoPoint);
    },
    aroundVideoClick() {
      // 周边视频分析
      (this as any).aroundVideoAnalysisClick((this as any).geoPoint);
    },
    fireCreepClick() {
      // 蔓延分析
      const that: any = this;
      const curPoint: any = that.geoPoint;
      that.messsageBus.emit('fireCreepPoint', curPoint);
      that.close();
    },
    chemicalsClick() {
      // 危化物联
      (this as any).hazardousChemicalsClick();
    },
    companyVideoClick() {
      // 企业视频
      (this as any).companyVideoClick();
    },
    videoClick() {
      // 视频监控
      (this as any).videoMonitoringClick();
    },
    removeSpaces(val: any) {
      // tslint:disable-next-line:no-debugger
      // debugger;
      if (typeof (val) === 'string') {
        // const str = val.replace(/(^[\s\n\t]+|[\s\n\t\0]+$)/g, '');
        // console.log('str,val:' , str , val);
        return val.replace(/(^[\s\n\t]+|[\s\n\t\0]+$)/g, '');
      } else {
        return val;
      }
    },
    dealAttributes() {
      const self: any = this;
      self.dataObj = {};
      self.dataAttributes.forEach(function(item: any, index: any) {
        self.dataObj[item.name] = item.value;
      });
      console.log('self.dataObj:', self.dataObj);
      return self.dataObj;
    },
    getpopData(data: any) {
      // 初始化渲染弹框的基础数据
      const that: any = this;
      that.list = data;  // 列表渲染需要
      // that.name = data.name ? data.name : that.name;
      // that.name = data.NAME ? data.NAME : that.name;
      // that.name = data.village ? data.village : that.name;
      // that.name = data.parentName ? data.parentName : that.name;
      // that.name = data.WKKMC ? data.WKKMC : that.name;
      // that.name = !that.name ? '默认标题' : that.name
    },
    getData() {
      const self: any = this;
      // this.list = [];
      self.dataAttributes.forEach(function(item: any, index: any) {
        self.dataObj = {};
        // tslint:disable-next-line:align
        // tslint:disable-next-line:no-unused-expression
        if (item.name && item.name === 'NAME') {
          self.name = item.value;
        } else if (item.name && item.name === 'PARENTNAME') {
          self.name = item.value;
          // self.dataObj.name = 'PARENTNAME';
          // self.dataObj.value = self.dataChild[key];
        } else if (item.name && item.name === 'VILLAGE') {
          self.name = item.value;
          // self.dataObj.name = 'VILLAGE';
          // self.dataObj.value = self.dataChild[key];
        }
        self.dataObj.name = item.name;
        self.dataObj.value = item.value;
        self.$set(self.list, index, self.dataObj);
        // _this.list.push(obj);
      });
      // console.log(this.list);
    },
    getDataTag() {
      // debugger;
      // tslint:disable-next-line:variable-name
      const self: any = this;
      // tslint:disable-next-line:no-debugger
      // debugger;
      // tslint:disable-next-line:forin
      for (const key in self.dataTag) {
        self.dataObj = {};
        // tslint:disable-next-line:align
        if (key.toUpperCase() === 'NAME') {
          self.name = self.dataTag[key];
          self.dataObj.name = 'NAME';
          self.dataObj.value = self.dataTag[key];
        } else if (key.toUpperCase() === 'PARENTNAME') {
          self.name = self.dataTag[key];
          self.dataObj.name = 'PARENTNAME';
          self.dataObj.value = self.dataTag[key];
        } else if (key.toUpperCase() === 'VILLAGE') {
          self.name = self.dataTag[key];
          self.dataObj.name = 'VILLAGE';
          self.dataObj.value = self.dataTag[key];
        }
        self.dataObj.name = key;
        self.dataObj.value = self.dataTag[key];
        self.$set(self.list, self.list.length, self.dataObj);
      }
      if (self.dataTag.tag) {
        // tslint:disable-next-line:forin
        for (const key in self.dataTag.tag) {
          self.dataObj = {};
          if (key.toUpperCase() === 'NAME') {
            self.name = self.dataTag.tag[key];
            self.dataObj.name = 'NAME';
            self.dataObj.value = self.dataTag.tag[key];
          } else if (key.toUpperCase() === 'PARENTNAME') {
            self.name = self.dataTag[key];
            self.dataObj.name = 'PARENTNAME';
            self.dataObj.value = self.dataTag[key];
          } else if (key.toUpperCase() === 'VILLAGE') {
            self.name = self.dataTag[key];
            self.dataObj.name = 'VILLAGE';
            self.dataObj.value = self.dataTag[key];
          }
          self.dataObj.name = key;
          self.dataObj.value = self.dataTag.tag[key];
          self.$set(self.list, self.list.length, self.dataObj);
          // debugger;
        }
      }
      // console.log(this.list);
    },
    getDataChild() {
      // debugger;
      const self: any = this;
      // debugger;
      // tslint:disable-next-line:forin
      for (const key in self.dataChild) {
        self.dataObj = {};
        // tslint:disable-next-line:align
        // tslint:disable-next-line:no-unused-expression
        if (key.toUpperCase() === 'NAME') {
          self.name = self.dataChild[key];
          self.dataObj.name = 'NAME';
          self.dataObj.value = self.dataChild[key];
        } else if (key.toUpperCase() === 'PARENTNAME') {
          self.name = self.dataChild[key];
          self.dataObj.name = 'PARENTNAME';
          self.dataObj.value = self.dataChild[key];
        } else if (key.toUpperCase() === 'VILLAGE') {
          self.name = self.dataChild[key];
          self.dataObj.name = 'VILLAGE';
          self.dataObj.value = self.dataChild[key];
        }
        self.dataObj.name = key;
        self.dataObj.value = self.dataChild[key];
        self.$set(self.list, self.list.length, self.dataObj);
      }
      // tslint:disable-next-line:forin
      /*if (self.dataChild.child[0]) {
                for (const key in self.dataChild.child[0]) {
                self.dataObj = {};
                // tslint:disable-next-line:align
                // tslint:disable-next-line:no-unused-expression
                if ( key.toUpperCase() === 'TOWN') {
                  self.name = self.dataChild.child[0][key];
                  self.dataObj.name = 'NAME';
                  self.dataObj.value = self.dataChild.child[0][key];
                }
                self.dataObj.name = key;
                self.dataObj.value = self.dataChild.child[0][key];
                self.$set(self.list,  self.list.length, self.dataObj);
                }
              }*/

      // console.log(this.list);
    },
  },
};
