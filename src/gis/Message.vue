<template>
  <div></div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import MessageHandlerBuilder from './message/MessageHandlerBuilder';
import EventInfoAdapter from './event/EventInfoAdapter';
/**
 * 地图对接消息的监听处理
 */
@Component({
  name: 'MapMessage',
  mixins: [MapCommon],
})
export default class MapMessage extends Vue {

  private eventDispatcher: any = {};

  // 当前处理的事件类型
  private currentType: string = '';

  private boolfirst: boolean = true;

  public mounted() {
    const self: any  = this;
    this.eventDispatcher.dispatch = (eventName: any, data: any) => {
      self.messsageBus.emit(eventName, data);
    };
    // test
    (window as any).MapMessage = this;
    // setTimeout(() => { // 延迟执行，不同事件进入处置的默认处理，在Vue Tick之后
    //   this.onEventPush(null, null);
    // }, 1000);
  }

  // 监听事件定位、推送
  @Watch('$store.state.eventPushStore.eventLocation.EventLatLonStr')
  public onEventLocate() {
    console.debug(`>>>>>>>> EventLatLonStr changed `);
    const eventData: any = this.$store.state.eventPushStore;
    const eventLocation: any = eventData.eventLocation;
    const factoryCol = this.$ioc.resolve('GISFactory-map');
    const messageHandler = MessageHandlerBuilder.getDefaultHandler();
    messageHandler.setComponents(factoryCol);
    messageHandler.onLocateEvent(eventLocation);
    this.boolfirst = true;
  }
  // 监听台风事件定位
  @Watch('$store.state.eventPushStore.eventLocation.TyphoonLatLonStr')
  public ontyEventLocate() {
    console.debug(`>>>>>>>> EventLatLonStr changed `);
    this.onEventPush(null, null);
    const eventData: any = this.$store.state.eventPushStore;
    const eventLocation: any = eventData.eventLocation;
    const factoryCol = this.$ioc.resolve('GISFactory-map');
    const messageHandler = MessageHandlerBuilder.getDefaultHandler();
    messageHandler.setComponents(factoryCol);
    messageHandler.onLocateEvent(eventLocation);
    this.boolfirst = false;
  }
  // 标绘组件监听此事件，适配不同标绘方案
  @Watch('$store.state.eventPushStore.eventLocation.EventType')
  public onEventType() {
    console.debug(`>>>>>>>> EventType changed `);
    const self: any = this;
    const eventData: any = self.$store.state.eventPushStore;
    const eventLocation: any = eventData.eventLocation;
    // this.messsageBus.$emit('eventTypeChange', eventLocation.EventType);
    const messageHandler = MessageHandlerBuilder.getAHandler(eventLocation.EventType);
    messageHandler.updateEventType(eventLocation.EventType, self.eventDispatcher, true);
    if (eventLocation.EventType !== '9') {
      const factory = self.$ioc.resolve('GISFactory-map');
      const component = factory.commonFactory.getComponent('mapserviceIn');
      // 切换事件类型后清除风向图层
      component.removeLayer('WindLayer');
    } else {
      self.raFlag = true;
      self.onEventPush(self.raFlag);
    }
  }
  // 监听经验圈变化
  @Watch('$store.state.eventPushStore.eventLocation.radius')
  public onEventRadius(newRadius: string, oldRadius: string) {
    if (oldRadius) {  // 判断经验圈设置是第一次进来，还是在面板中变化，面板中变化由旧值变化为新数值
      return;
    }
    // console.debug(`>>>>>>>> radius changed `, oldRadius, 'newRadius->', newRadius);
    if (this.$store.state.eventPushStore.eventId) {
      this.onEventPush(null, null);
    } else {
      this.returnNormal();
    }
  }
  // 监听事件定位、推送
  @Watch('$store.state.eventPushStore.eventId')
  public onEventId(eventId: any) {
    console.debug(`>>>>>>>> eventId changed `);
    if (eventId) {
      this.onEventPush(null, null);
    } else {
      this.returnNormal();
    }
  }

  // 返回常态
  public returnNormal() {
    const modules = this.$ioc.resolve('GISFactory-map');
    // 清除定位
    const locateComp = modules.commonFactory.getComponent('locateComp');
    locateComp.unload();
    // 清除灾损区
    const influence = modules.commonFactory.getComponent('influence');
    influence.unload();
    // 重置消息
    const eventData: any = this.$store.state.eventPushStore;
    const eventLocation: any = eventData.eventLocation;
    const messageHandler = MessageHandlerBuilder.getAHandler(eventLocation.EventType);
    messageHandler.reset();
    // 重置
    this.currentType = '';
    // 重置视野
    const gisTool = modules.commonFactory.getComponent('gisToolComp');
    gisTool.fullExtent();
  }


  // 监听影响圈半径
  @Watch('$store.state.eventPushStore.eventLocation.radius')
  public onAffectRadiusChange(radius: any) {
    if (radius) {
      const eventData: any = this.$store.state.eventPushStore;
      const eventLocation: any = eventData.eventLocation;
      const messageHandler = MessageHandlerBuilder.getAHandler(eventLocation.EventType);
      console.debug('更新影响圈……');
      messageHandler.updateAffectRadius(radius, this.eventDispatcher, true);
    }
  }

  @Watch('$store.state.eventPushStore.UPLOADSHP')
  public onUpdateShp() { // 地震事件,上传烈度shpape
    const eventData: any = this.$store.state.eventPushStore;
    const eventLocation: any = eventData.eventLocation;
    const messageHandler = MessageHandlerBuilder.getAHandler(eventLocation.EventType);
    if (messageHandler.onPushUploadShp) {
      messageHandler.onPushUploadShp(eventLocation, this.eventDispatcher);
    }
  }
  public onEventPush(raflag: any, istyphoon: any) {
    if (!istyphoon) {
      this.clearOnPush();
    }
    const eventData: any = this.$store.state.eventPushStore;
    // const eventLocation: any = JSON.parse(JSON.stringify(eventData.eventLocation));
    const eventLocation: any = EventInfoAdapter.adapt(eventData.eventLocation);
    eventLocation.eventId = eventData.eventId;
    const modules = this.$ioc.resolve('GISFactory-map');
    const GISComponents = this.$ioc.resolve('GISComponents-map');
    const eventInfoWrapper: any = this.$ioc.resolve('eventInfo');
    const messageHandler = MessageHandlerBuilder.getAHandler(eventLocation.EventType);
    messageHandler.setEventWapper(eventInfoWrapper);
    messageHandler.setComponents(modules);
    messageHandler.setTools(GISComponents);
    // 设置当前的事件类型
    this.currentType = eventLocation.EventType;
    messageHandler.onPushEvent(eventLocation, this.eventDispatcher, () => {
      this.$store.commit('earthQuake/setEarthQuakeIntensityData', messageHandler.intentsityData);
    });
    setTimeout(() => { // 延迟执行，不同事件进入处置的默认处理，在Vue Tick之后
      messageHandler.postPushEvent(eventLocation, this.eventDispatcher);
    }, 0);
    this.boolfirst = true;
  }

  // 触发上一次的事件清除
  private clearOnPush() {
    const modules = this.$ioc.resolve('GISFactory-map');
    const GISComponents = this.$ioc.resolve('GISComponents-map');
    // clear
    const defaultMessageHandler: any = MessageHandlerBuilder.getDefaultHandler();
    defaultMessageHandler.setComponents(modules);
    defaultMessageHandler.setTools(GISComponents);
    defaultMessageHandler.clearOnPushEvent();
    this.eventDispatcher.dispatch('showGisSwitchMap', 0); // 切换到默认影像
    // reset
    if (this.currentType) {
      console.debug('清除上一次的事件：' , this.currentType);
      const messageHandler = MessageHandlerBuilder.getAHandler(this.currentType);
      messageHandler.reset();
    }
  }

// 清除默认叠加的数据
@Watch('$store.state.resetDefaultAddedData')
  private resetDefaultAddedData() {
    if (this.boolfirst ) {
       const factoryCol = this.$ioc.resolve('GISFactory-map');
    // const mapserviceIn = factoryCol.commonFactory.getComponent('mapserviceIn');
    // mapserviceIn.unload();
       const districtComp = factoryCol.disasterJudgeFactory.getComponent('districtComp');
       districtComp.unload();
       const disasterJudgeResource = factoryCol.disasterJudgeFactory.getComponent('disasterJudgeResource');
       disasterJudgeResource.clear();
       this.boolfirst = false;
    }
  }
}
</script>
<style>
</style>
