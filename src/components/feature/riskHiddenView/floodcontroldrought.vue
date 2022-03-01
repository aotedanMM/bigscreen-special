<template>
  <div class="riskHidden">
    <p class="title">
      {{ showTitle }}
      <ZoomBtn></ZoomBtn>
    </p>
    <el-scrollbar style="height: 100%">
      <CommonList
        :contListAll="contListAll"
        @addMapdotChecked="addMapdotChecked"
        @changeNumChecked="changeNumChecked"
        :showKeyIcon="showKeyIcon"
        ref="mychildEmergency"
      ></CommonList>
    </el-scrollbar>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import CommonList from '@/components/feature/riskHiddenView/children/CommonList.vue';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import {
  monitorWarningServer,
  waterSituationServer,
} from '@/api/feature/monitorwarning/installServer';
import { riverWaterSystemServe } from '@/api/installServer';
import ZoomBtn from '../flood/ZoomBtn.vue'; // 导入最小化组件
@Component({
  name: 'RiskHiddenView',
  components: {
    CommonList,
    ZoomBtn,
  },
})
export default class RiskHiddenView extends Vue {
  // 加载点位的名称
  public popIsSureName: string = '';
  // 点击数字传上来的展示数据
  public paramData: any = {};
  // 请求参数, 转化为type
  private requestArgs: any = [];
  private showTitle: any = '防汛抗旱';
  private showKeyIcon: any = 'fxyh';
  private contListAll: any = [];
  private dataArr: any = '';
  private title: any = '';
  private clearKey: any = '';
  private datalist: any = [];
  private popUpTemplate = '';
   // 地图定点回调
  private popupData(event: any) {
    if (!event.type && event.featureType) {
      event.type = event.featureType;
      const eventType = event.featureType;
    }
    const param = {
      that: this,
      popupId: 'popup', // 监听id，必须
      moduleTypeID: 'waterMonitor',
      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    const popUpTemplate = new renderpopUpTemplate();
    popUpTemplate.getParams(param);
    popUpTemplate.onShowPopup(event);
  }
  // 风险隐患数据请求接口
  private initData() {
    const self = this;
    this.requestArgs = []; //  请求请求参数；
    this.handleArgs(self.contListAll);
    const type: string = this.requestArgs.toString();
    const obj: any = {
      districtCode:
        this.$store.state.dataFilterControl.filter.districtCode === '130400'
          ? ''
          : this.$store.state.dataFilterControl.filter.districtCode,
    };
    monitorWarningServer.getStatistics(obj).then((res: any) => {
      this.deleteNull(res.data, this.contListAll);
    });
  }

  private handleArgs(item: any) {
    for (const k of item) {
      this.requestArgs.push(k.key);
    }
  }
  // 文字点击多选上图
  private addMapdotChecked(item: any) {
    // console.log('uuu')
    const vm = this;
    // this.messsageBus.emit('eventInfoMapShow', false);
    // this.getComponent_new()._clearLayerByID(item.codeKey);
    if (item.checked) {
      if (item.name === '河网水系') {
        // 初始化显示图例中的河网水系和流域
        const params = {
          isMajorRiver: 1,
          isShow: item.checked,
          name: '重点河流',
        };
        vm.$store.commit('mapTools/changeShowRiverList', params);
      }
      // 添加雨量监测站 河流检测站
      switch (item.codeKey) {
        case 'rainNum':
          this.raingetComponent().addResource_Rain({ geometry: this.geoJsonData, districtCode: this.districtCode }, false);
          break;
        case 'riverNum':
          this.raingetComponent().addResource_River({ geometry: this.geoJsonData, districtCode: this.districtCode }, false);
          break;
        case 'countweirGateWater':
          this.raingetComponent().addResource_monitorstation({ geometry: this.geoJsonData, districtCode: this.districtCode }, false);
          break;
        case 'reservoirNum':
          this.raingetComponent().addResource_Reservoir({ geometry: this.geoJsonData, regionCode: this.districtCode }, false);
          break;
        case 'floodvillage':
          this.raingetComponent().addResource_Floodvillage({ geometry: this.geoJsonData, regionCode: this.districtCode }, false);
          break;
        case 'reservoirCountdx':
          this.raingetComponent().addResource_ReservoirCountdx({ geometry: this.geoJsonData, regionCode: this.districtCode}, false);
          break;
        case 'reservoirCountzx':
          this.raingetComponent().addResource_ReservoirCountzx({ geometry: this.geoJsonData, regionCode: this.districtCode}, false);
          break;
        case 'reservoirCountxx':
          this.raingetComponent().addResource_ReservoirCountxx({ geometry: this.geoJsonData, regionCode: this.districtCode}, false);
          break;
      }
      // if (item.name.includes('库')) {
      //   // 初始化显示图例中的河网水系和流域
      //   vm.datalist.push(item);
      //   item.num = item.tabNumber;
      //   vm.datalist.push(item);
      //   const addreservoir = {
      //     isShow: true,
      //     type: vm.datalist,
      //   };
      //   vm.$store.commit('mapTools/changeShowReservoirList', addreservoir);
      // }

      // this.getComponent_new().showExtentData(item.codeKey);
    } else {
      // 去除各种水库功能
      // if (item.name.includes('库')) {
      //   this.datalist.forEach((data: any, index: any) => {
      //     if (data.name === item.name) {
      //       vm.datalist.splice(index);
      //       const delreservoir = {
      //         isShow: true,
      //         type: vm.datalist,
      //       };
      //       vm.$store.commit('mapTools/changeShowReservoirList', delreservoir);
      //     }
      //   });
      //   // 关闭各种水库功能
      //   if (vm.datalist.length === 0) {
      //     const delreservoir = {
      //       isShow: false,
      //     };
      //     vm.$store.commit('mapTools/changeShowReservoirList', delreservoir);
      //   }
      // }
      // 去除河网水系
      if (item.name === '河网水系') {
        const deleteRiver = {
          isMajorRiver: 1,
          isShow: item.checked,
          name: '重点河流',
        };
        vm.$store.commit('mapTools/changeShowRiverList', deleteRiver);
      }
      // 去除雨量监测站 河流检测站
      switch (item.codeKey) {
        case 'rainNum':
          this.raingetComponent().removeResource('rain');
          vm.hideJsl('RainfallThwartwise');
          break;
        case 'riverNum':
          this.raingetComponent().removeResource('river');
          break;
        case 'countweirGateWater':
          this.raingetComponent().removeResource('countweirGateWater');
          break;
        case 'reservoirNum':
          this.raingetComponent().removeResource('reservoir');
          break;
        case 'floodvillage':
          this.raingetComponent().removeResource('floodvillage');
          break;
        case 'reservoirCountdx':
          this.raingetComponent().removeResource('reservoirCountdx');
          break;
        case 'reservoirCountzx':
          this.raingetComponent().removeResource('reservoirCountzx');
          break;
        case 'reservoirCountxx':
          this.raingetComponent().removeResource('reservoirCountxx');
          break;
      }
      // this.getComponent_new()._clearLayerByID(item.codeKey);
    }
  }
  // 获取雨量地图功能
  private raingetComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component =
      factory.monitorWarningFactory.getComponent('WindWaterRainWork');
    return component;
  }
  // 获取河道水库统计数据 (大中小型水库)
  private async getCountData() {
    const res: any = await waterSituationServer.getCurrentReservoirInfo({});
    this.deleteNull(res.data.data, this.contListAll);
  }
  // 获取河流条数易涝点
  private async getStatImportantInfo() {
    const resData: any = await riverWaterSystemServe.getStatImportantInfo();
    this.deleteNull(resData.data, this.contListAll);
  }
  // 多选数字点击事件
  private changeNumChecked(item: any, textHandlerName?: string) {
    // console.log('数字点击事件', item.codeKey);
    const that = this;
    const allparams = {
      isShow: false,
    };
    this.$store.commit('mapTools/changeShowRainMonitorList', allparams);
    this.$store.commit('mapTools/changeShowsRiverList', allparams);
    this.$store.commit('mapTools/changeShowWeirgateMonitorList', allparams);
    this.$store.commit('mapTools/changeShowReservoirList', allparams);
    this.$store.commit('mapTools/changeShowReservoirCountdxList', allparams);
    this.$store.commit('mapTools/changeShowReservoirCountzxList', allparams);
    this.$store.commit('mapTools/changeShowReservoirCountxxList', allparams);
    this.$store.commit('mapTools/changeShowRiverList', allparams);
    if (item.checked) {
      // console.log('段龙龙',item.codeKey);
      // 雨量监测站 河流检测站
      switch (item.codeKey) {
        case 'rainNum':
          this.raingetComponent().addResource_Rain({geometry: this.geoJsonData, districtCode: this.districtCode }, false);
          const params = {
            level: '',
            isShow: item.checked,
            name: '雨情监测站',
          };
          that.showJsl('RainStation');
          this.$store.commit('mapTools/changeShowRainMonitorList', params);
          break;
        case 'riverNum':
          this.raingetComponent().addResource_River({ geometry: this.geoJsonData, districtCode: this.districtCode }, false);
          const params1 = {
            isMajorRiver: null,
            isShow: item.checked,
            name: '河流监测站',
          };
          this.$store.commit('mapTools/changeShowsRiverList', params1);
          break;
        case 'countweirGateWater':
          this.raingetComponent().addResource_monitorstation({ geometry: this.geoJsonData, districtCode: this.districtCode }, false);
          const params2 = {
            isShow: item.checked,
            name: '堰闸监测站',
          };
          this.$store.commit('mapTools/changeShowWeirgateMonitorList', params2);
          break;
        case 'reservoirNum':
          this.raingetComponent().addResource_Reservoir({ geometry: this.geoJsonData, regionCode: this.districtCode }, false);
          const params3 = {
            isShow: true,
          };
          this.$store.commit('mapTools/changeShowReservoirList', params3);
          break;
        case 'reservoirCountdx':
          this.raingetComponent().addResource_ReservoirCountdx({ geometry: this.geoJsonData, regionCode: this.districtCode }, false);
          const params5 = {
            isShow: true,
            scalename: '大型',
          };
          this.$store.commit('mapTools/changeShowReservoirCountdxList', params5);
          break;
        case 'reservoirCountzx':
          this.raingetComponent().addResource_ReservoirCountzx({ geometry: this.geoJsonData, regionCode: this.districtCode }, false);
          const params6 = {
            isShow: true,
            scalename: '中型',
          };
          this.$store.commit('mapTools/changeShowReservoirCountzxList', params6);
          break;
        case 'reservoirCountxx':
          this.raingetComponent().addResource_ReservoirCountxx({ geometry: this.geoJsonData, regionCode: this.districtCode }, false);
          const params7 = {
            isShow: true,
            scalename: '小型',
          };
          this.$store.commit('mapTools/changeShowReservoirCountxxList', params7);
          break;
        case 'floodvillage':
          this.raingetComponent().addResource_Floodvillage({ geometry: this.geoJsonData, regionCode: this.districtCode }, false);
          const params4 = {
            isShow: true,
          };
          this.$store.commit('mapTools/changeShowFloodvillageList', params4);
          break;
      }
      if (item.name === '河网水系') {
        // 初始化显示图例中的河网水系和流域
        const params = {
          isMajorRiver: 1,
          isShow: item.checked,
          name: '重点河流',
        };
        this.$store.commit('mapTools/changeShowRiverList', params);
      }
      // if (item.name.includes('库')) {
      //   // 初始化显示图例中的河网水系和流域
      //   item.num = item.tabNumber;
      //   this.datalist.push(item);
      //   const params1 = {
      //     isShow: true,
      //   };
      //   this.$store.commit('mapTools/changeShowReservoirList', params1);
      // }

    } else {
      switch (item.codeKey) {
        case 'rainNum':
          this.raingetComponent().removeResource('rain');
          const params = {
            isShow: false,
          };
          this.$store.commit('mapTools/changeShowRainMonitorList', params);
          that.hideJsl('RainfallThwartwise');
          break;
        case 'riverNum':
          this.raingetComponent().removeResource('river');
          const params1 = {
            isShow: false,
          };
          this.$store.commit('mapTools/changeShowsRiverList', params1);
          break;
        case 'countweirGateWater':
          this.raingetComponent().removeResource('countweirGateWater');
          const params2 = {
            isShow: false,
          };
          this.$store.commit('mapTools/changeShowWeirgateMonitorList', params2);
          break;
        case 'reservoirNum':
          this.raingetComponent().removeResource('reservoir');
          const params3 = {
              isShow: false,
            };
          this.$store.commit('mapTools/changeShowReservoirList', params3);
          break;
        case 'reservoirCountdx':
          this.raingetComponent().removeResource('reservoirCountdx');
          const params5 = {
              isShow: false,
            };
          this.$store.commit('mapTools/changeShowReservoirCountdxList', params5);
          break;
        case 'reservoirCountzx':
          this.raingetComponent().removeResource('reservoirCountzx');
          const params6 = {
              isShow: false,
            };
          this.$store.commit('mapTools/changeShowReservoirCountzxList', params6);
          break;
        case 'reservoirCountxx':
          this.raingetComponent().removeResource('reservoirCountxx');
          const params7 = {
              isShow: false,
            };
          this.$store.commit('mapTools/changeShowReservoirCountxxList', params7);
          break;
        case 'floodvillage':
          this.raingetComponent().removeResource('floodvillage');
          const params4 = {
            isShow: false,
          };
          this.$store.commit('mapTools/changeShowFloodvillageList', params4);
          break;
      }
      // 根据名称去除多余水库数据
      // if (item.name.includes('库')) {
      //   this.datalist.forEach((element: any, index: any) => {
      //     if (item.name === element.name) {
      //       this.datalist.splice(index, 1);
      //       const params1 = {
      //         isShow: true,
      //         type: this.datalist,
      //       };
      //       if (this.datalist.length === 0) {
      //         const params = {
      //           isShow: false,
      //         };
      //         this.$store.commit('mapTools/changeShowReservoirList', params);
      //       }
      //     }
      //   });
      // }
      // 河网水系去除功能
      const deleteRiver = {
        isMajorRiver: 1,
        isShow: item.checked,
        name: '重点河流',
      };
      this.$store.commit('mapTools/changeShowRiverList', deleteRiver);
      // if (textHandlerName === 'close') {
      //   return;
      // } else {
      //   // 清理地图对应图层图标
      //   this.getComponent()._clearLayerByID(item.key);
      //   // 取消弹窗列表
        // this.messsageBus.emit('clickEmerencyResourcesNum', null, false);
      //   // (this.$refs.mychildEmergency as any).closePanelFn();
      // }
    }
  }
  // 从list中拿到codeKey数组中需要的结果对象数组
  private getTargetItemAll(codeKeyArr: any, sourceList: any[]) {
    let arr: any = [];
    arr = sourceList.filter((litem: any, lindex: number) => {
      return codeKeyArr.includes(litem.codeKey);
    });
    return arr;
  }
   // 显示 图例
  private showJsl(val: any) {
    this.$store.commit('mapTools/addSelectedLayer', {
      id: val,
      name: '雨量站',
      play: false,
      legend: { component: val },
    });
  }
  private hideJsl(value: any) {
    // const data = {
    //   key: value,
    //   isShow: false,
    // };
    // this.$store.dispatch('configModel/updateLegendItem', data);
    this.$store.commit('mapTools/removeSelectedLayer', {
      id: value,
    });
  }
  private getTargetItemAllTabnumsum(codeKeyArr: any, sourceList: any[]) {
    let sum = 0;
    const resultArr = this.getTargetItemAll(codeKeyArr, sourceList);
    resultArr.forEach((item: any, index: number) => {
      sum += item.tabNumber ? item.tabNumber : 0;
    });
    return sum;
  }
  private getTargetItem(sourceKey: any, sourceList: any[]) {
    const targetItem = sourceList.find((fitem: any, findex: number) => {
      return fitem.codeKey === sourceKey;
    });
    return targetItem;
  }
  // 匹配辅助
  private deleteNull(list: any, sourceArr: any[]) {
    // console.log('list的值', list);
    // console.log('sourceArr的值', sourceArr);
    for (const j of sourceArr) {
      // console.log('j的值', j);
      if (list[j.key]) {
        j.tabNumber = list[j.key];
        // 再遍历一层，拿水库子集的值
        if (j.list) {
          for (const i of j.list) {
            if (list[i.key]) {
              i.tabNumber = list[i.key];
            }
          }
        }
      } else if (list.data) {
        j.tabNumber = list.data[j.key];
      }
    }
    this.contListAll = sourceArr;
  }
  private created() {
    // 判断是否有配置项，没有走默认配置
    let eventContListAll =
      this.$store.state.configModel.config.quickStudy.floodcontroldrought;
    if (eventContListAll) {
      // 读取配置项风险隐患
      eventContListAll = JSON.parse(JSON.stringify(eventContListAll));
      this.contListAll = eventContListAll.list;
      // 风险隐患数据请求接口
      this.initData();
    } else {
      // 请求配置文件对应的初始数据
      // nomalLeftServer.getInitDataFxyh().then((res: any) => {
      //   this.contListAll = res.data;
      //   // 风险隐患数据请求接口
      //   this.initData();
      // });
    }
    this.getCountData();
    this.getStatImportantInfo();
  }
  private mounted() {
     this.raingetComponent().on('WindWaterRainWork_popup', this.popupData, this);
  }
  private beforeDestroy() {
    // 列表关闭弹框事件
    this.raingetComponent().removeAll();
    this.raingetComponent().off('WindWaterRainWork_popup', this.popupData, this);
    this.messsageBus.emit('clickEmerencyResourcesNumPanelClosed', {}, false);
    // 清理地图图层图标
    this.getComponent()._clearLayers();
    this.getComponent_new()._clearLayerByID(this.clearKey);
    this.getComponent()._clearLayerByID(this.clearKey);
  }
  //  地图组件
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent('ResourceComponent');
    return component;
  }

  //  地图组件
  private getComponent_new() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent('NewResourceComponent');
    return component;
  }
}
</script>
<style lang="less" scoped>
.riskHidden {
  height: 95%;

  // margin-bottom: 8px;
  // overflow: hidden;
  // height: 270px;
  .title {
    font-weight: 600;
    font-family: "myHeiti";
    font-size: calc(20px * 1.5);
    color: 00e4ff;
    background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -1px;
    padding-left: 20px;
    font-style: italic;
  }
}
</style>