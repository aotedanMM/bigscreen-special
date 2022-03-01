<template>
  <div class="GisMapUtil">
    <!--工具条-->
    <GisMapContainer v-if="canShow && gisToolList.length" :gisToolList="gisToolList" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
// gis工具容器
import GisMapContainer from '@/components/feature/gisModle/gisMapTool/GisMapContainer.vue';
/**
 * gis地图加载方法
 * */
import MapCommon from '@/util/MapCommon';
import GisAreaSelectEvent from '@/util/GisAreaSelectEvent';
import FloodLegendEvent from '@/util/FloodLegendEvent';
/**
 * 新工具条方法 , 路径规划 实时视频 周边分析 历史轨迹 清除
 * */
import {
  clearPeripheral,
  clearPathPlanning,
  closeRightVideo,
  clearTrack,
  mapUtilFun,
} from '@/views/common/nvaUtil/nvaUtil';
// 资源查询组件
@Component({
  name: 'GisMapUtil',
  mixins: [MapCommon, GisAreaSelectEvent, FloodLegendEvent],
  components: {
    GisMapContainer,
  },
})
export default class GisMapUtil extends Vue {

  private get canShow() {
    // 此处判定,对应的工具t要显示不显示
    const tool = this.gisToolList.find((item: any) => {
      if (item.component === 'GisSwitchMap') {
        return item;
      }
    });
    if (tool as any) {
      if ((tool as any).options.baseLayers.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  // 横着的按钮选项 // 常态工具条
  private gisToolList = this.$store.state.configModel.config.toolConfig.gisToolList || [];

    // 监听工具个数，传到父级以计算【今日天气】位置
    @Watch('gisToolList.length')
    private toolCount() {
        this.$emit('getToolCount', this.gisToolList.length);
    }

  // 关于影响的操作
  private getBaseLayers() {
    const mapConfig = this.$ioc.resolve(`mapConfig-map`);
    return mapConfig.baseLayers;
  }

  // watch 此处干了什么.
  @Watch('$store.state.clearAll')
  private clearAllWatch() {
    // 清屏状态发生改变  触发非常态清屏
    mapUtilFun.qingpin(this);
  }

  // 定位清屏 周边分析 路径规划 历史轨迹 实时视频信息
  @Watch('$store.state.eventPushStore.eventLocation.EventLatLonStr')
  private eventChange() {
    this.closeAll();
  }

  /**
   * 事件列表 和地震速报 进入战时之后 周边分析 路径规划 历史轨迹 实时视频信息 这里做清除
   * 但是推送的时候也改变事件id 需求不需要清屏 所以获取记录判断是否是推送的
   * */
  // 原来监听的是eventId ，但是导致常态切换其他灾种常态的时候不触发，随意这里改成eventLocation，因为，无论是常态的变化，还是非常态的变化，这个对象都会被重新赋值
  @Watch('$store.state.eventPushStore.eventLocation')
  private eventIdChange(val: any) {
      // 切换事件列表事件时清除区域选择
    // this.$store.commit('mapTools/changeShowLayerPanel', false);
    this.getComponent_RiverNetworkJudgement().clear();
    this.getComponent_AreaSelectJudgement().clear();
    this.sendDisasterDecideData(val);
    /**
     * 进入处置 地震速报 和 事件信息列表 都清空了此字段
     * 定位时 上面清除 这里不用  推送时不清空内容
     * */
    const curLocationKey: any = this.$store.state.eventPushStore.eventLocation.curLocationKey || '';
    if (!curLocationKey) {
      this.closeAll();
    }
  }
  /**
   * 根据状态是否有事件id 判断当前 是战时状态 还是常态
   * */
  private sendDisasterDecideData(normalState: any) {
    /**
     * 三元判断现在是什么状态
     * 因为返回是刷新,所以常态暂时多余,考虑以后
     * 如果加工具条 直接在这里配置工具条模板名称
     * */
    const toolArr: any[] = this.$store.state.configModel.config.toolConfig.gisToolList || [];

    // 更新到最新的工具条
    this.gisToolList = toolArr.map((tool: any) => {
      if (tool.component === 'GisSwitchMap') {
        tool.options.baseLayers = this.getBaseLayers();
      }
      return tool;
    });
  }
  /**
   * 清除弹窗 周边分析 实时视频大弹窗 路径规划 公共方法
   **/
  private closeAll() {
    clearPeripheral(this);
    clearPathPlanning(this);
    closeRightVideo(this);
    clearTrack(this);
    const closeArr: string[] = [
      'ToolCompared.' + // 灾情动态
      'aftershock' + // 余震
      ',returnImage' + // 影响回传
      ',imageContrast' + // 影响对比
      ',latestImages' + // 最新影像
      ',tianyan' + // 天眼
        ',publicOpinionMonitor', // 舆情监控

      'commonTools.realTimePlotting' + ',mapPrint', // 标绘 // 地图下载
      ',updateExperienceCircle', // 经验圈

      'ToolIconEventOverview.' + // 天气交通
      'realTimeTraffic' + // 实时路况
      ',BaiduStreetView' + // 百度街景
      ',tencentStreetView' + // 腾讯街景
      ',surroundingWeather' + // 当地天气
      ',greenChannel' + // 绿色通道
      ',trafficControl' + // 交通管制
        ',roadDamage', // 道路损毁
    ];
    /**
     * 循环发送互斥监听 " . " 前面是监听文件名称 同时是事件接收名称  后面 " , " 分割对应关闭信息
     * */
    closeArr.forEach((val: string) => {
      if (val) {
        const mutexkeyInfo: string[] = val.split('.');
        this.messsageBus.emit(mutexkeyInfo[0], mutexkeyInfo[1]);
      }
    });
  }


  private mounted() {
    // 初始化.要看,做了些什么
    /**
     * 初始化加载地图,获取底图影像按钮
     * resolveMap 方法在 MapCommon 中
     * */
    (this as any).resolveMap('map').then(() => {
      this.gisToolList = this.gisToolList.map((tool: any) => {
        if (tool.component === 'GisSwitchMap') {
          tool.options.baseLayers = this.getBaseLayers();
        }
        return tool;
      });
    });
  }
}
</script>
