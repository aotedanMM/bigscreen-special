<template>
  <div :id="targetId"></div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { mapServer } from '@/api/installServer';
import MapCommon from '@/util/MapCommon';
import Map from '@/gis/Map';
import publishObjectPath from '@/util/configRegistry';
import EventInfoWapper from '@/gis/event/EventInfoWapper';
import FilterInfo from '@/gis/common/query/FilterInfo';
@Component({
  name: 'Map2D',
  mixins: [MapCommon],
})
export default class Map2D extends Vue {
  public getMap: any = null;

  @Prop() public targetId: any;

  private eventInfo!: EventInfoWapper ;
  private async mounted() {
    // 地图配置
    const mapConfigRes = await mapServer.getConfig('./json/map.json');
    this.registGlobal('mapConfig', mapConfigRes.data);
    //
    const self: any = this;
    // 全局事件委托
    const EventDispatcher: any = G.base.ComponentBase.extend({
      dispatch(event: string, data: any) {
          this.fire(event, data);
          self.messsageBus.emit(event, data);
      },
    });
    const eventDispatcher: any = new EventDispatcher();
    // (window as any).eventDispatcher = eventDispatcher;
    const mapInstance = new Map({
      targetId: this.targetId,
      mapConfig: mapConfigRes.data,
      serviceConfig: publishObjectPath.value,
      eventDispatcher,
    });
    mapInstance.init();
    // 符号配置
    const symbolConfigRes = await mapServer.getConfig('./json/symbol.json');
    this.registGlobal('symbolConfig', symbolConfigRes.data);
    mapInstance.setOptions({
      symbolConfig: symbolConfigRes.data,
    });
    // 创建公用组件工具
    const gisComponents = mapInstance.createComponents({
      // 这里根据面板是否展开动态计算边距
      marginFn: () => {
        let pmargin = [500, 100, 500, 50];
        if (this.$store.state.mapModule.margin) {
          const marginsets = this.$store.state.mapModule.margin;
          pmargin = [marginsets.left, marginsets.top, marginsets.right, marginsets.bottom];
        }
        // [left, top, right, bottom]
        return pmargin;
      },
      paddingFn: () => {
        let ppadding = [100, 500, 50, 100];
        if (this.$store.state.mapModule.margin) {
          const marginsets = this.$store.state.mapModule.margin;
          ppadding = [marginsets.top, marginsets.right, marginsets.bottom, marginsets.left];
        }
        // [top, right, bottom, left]
        return ppadding;
      },
    });
    this.registGlobal('GISComponents', gisComponents);
    //
    const factorySet = mapInstance.createBusinessComponents({
      eventInfo: this.getEventInfo(),
      filterInfo: new FilterInfo(),
    });
    this.registGlobal('GISFactory', factorySet);
    // 地图加载完成后，注册地图变量，触发地图加载完成事件
    const map = mapInstance.getMap();
    self.registMap(map, this.targetId);
    //
    this.addListeners();
  }

  private beforeDestroy() {
    this.removeListeners();
  }

  private registGlobal(key: string, value: any) {
    this.$ioc.register(`${key}-${this.targetId}`, value);
  }

  private resolveGlobal(key: string) {
    return this.$ioc.resolve(`${key}-${this.targetId}`);
  }

  // 获取事件信息
  private getEventInfo() {
    // 构造事件信息对象
    if (!this.eventInfo) {
      const eventInfo = new EventInfoWapper();
      this.$ioc.register('eventInfo', eventInfo);
      this.eventInfo = eventInfo;
    }
    return this.eventInfo;
  }

  private addListeners() {
    // todo
    this.messsageBus.on('leftMapPanelMutexContrary', this.onPanelStateChange, this);
  }

  private removeListeners() {
    // todo
    this.messsageBus.off('leftMapPanelMutexContrary', this.onPanelStateChange, this);
  }

  /**
   * 左侧面板展开时的事件
   */
  private onPanelStateChange(data: any) {
    // todo
    // 调用commoninteract的方法关闭最新的详情框、清除最新的高亮；
    this.getCommonInteract().clearHighlightAndPopup();
  }

  // 交互组件
  private getCommonInteract() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('commonInteract');
    return component;
  }

  // // 当右侧面板占位
  // @Watch('$store.state.mapModule.margin.right')
  // private onUpdatemarginR(val: any) {
  //   console.log('右边-----', val);
  // }
  // // 当左侧面板占位
  // @Watch('$store.state.mapModule.margin.left')
  // private onUpdatemarginL(val: any) {
  //   console.log('左边-----', val);
  // }
//   @Watch('$store.state.eventPushStore.eventLocation.geometry')
//   private updateGeometry(val: any) {
//     if ( this.$store.state.dataFilterControl.zhypGeoType
//          &&
//          this.$store.state.dataFilterControl.zhypGeoType.key === 'jyq') {
//       return ;
//     }
//     const eventInfo: any = this.getEventInfo();
//     // 行政区划研判增加区划filter，改善查询效率
//     if ( this.$store.state.dataFilterControl.zhypGeoType
//          &&
//          (this.$store.state.dataFilterControl.zhypGeoType.key === 'xzqhyp' || this.$store.state.dataFilterControl.zhypGeoType.key === 'tfyp')) {
//           const districtCode = this.$store.state.dataFilterControl.filter.districtCode;
//           eventInfo.setDistrictCode(districtCode);
//     } else {
//       eventInfo.setDistrictCode('');
//     }
//     if (!val) {
//       return ;
//     }
//     const geometryObj = JSON.parse(this.$store.state.eventPushStore.eventLocation.geometry);
//     eventInfo.setGeometry(geometryObj);
//   }
}
</script>
<style>
#map {
  width: 100%;
  height: 100%;
}
/* ts-gis */
.ol-unselectable .ol-scale-line-inner {
  /* width: 117px; */
  position: absolute;
  bottom: 52px;
  color: #dfdfdf;
  border: 1px solid #eee;
  border-top: none;
  background: rgba(0, 60, 136, 0.5);
  font-size: 26px;
  text-align: center;
  margin: 1px;
  will-change: contents, width;
  left: 20px;
  line-height: 1;
  min-width: 110px !important;
}
/*ts-gis*/
.ol-zoom.ol-unselectable.ol-control {
  position: absolute;
  top: 300px;
  right: 20px;
  left: inherit;
}

.BMap_noprint{
    right: 147px !important;
    top: 155px!important;
}
.isShowquanjing_baidu .BMap_noprint{
    right: 563px !important;
    top: 155px!important;
}
.Hide_pano{
  top: 41px!important;
  right: 147px!important;
}
.district-county-box{
  width:auto;
  /* text-align: center; */
  height: auto;
  color: #fefefe;
  padding: 5px 10px ; 
  /* background: rgba(24, 62, 80, 0.60);
   border: solid 2px #37e0f5;  */
   background:url('../../assets/img/gisModule/districtDialog/district-county-name_bg.png') no-repeat 50% 50%;
   background-size:100% 100%;
   border-radius: 5px;
   font-family: "Microsoft Yahei" , "Arial", "Simsun";   
    cursor: default;
}
.district-county-name{
  display:block;
  color:#f8feff;
}
.district-county-distance{
  color:#ff6319;

}
/* .district-county-distance-number{

} */
.district-county-distance-unit{
  color:#f8feff

}
/**测量*/
.emap-measure-node-tooltip{
  display: none;
  background-color: #fff;
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 1px;
  border-radius: 1px;
  border: solid 2px red;
  font-size: 20px;
  color:#7B7878;
}
.emap-measure-tooltip{
  display: none;
  background-color: #fff;
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 3px;
  border-radius: 1px;
  border: solid 2px red;
  font-size: 20px;
  color:#000;
  font-weight:bold;
}
.emap-measure-node-tooltip .popup-content,
.emap-measure-tooltip .popup-content {
  color: #000 !important;
  height: auto !important;
  line-height: 22px !important;
}
</style>
