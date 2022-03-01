<template>
  <!-- 事件列表 -->
  <div class="CompanyDetail">
    <div class="previewPrint popupPanelCenter_bg">
      <div class="previewPrint_title">
        <span class="previewPrint_title_txt">下载预览</span>
        <span class="previewPrint_title_tit" v-if="data.title">{{data.title}}</span>
        <span class="previewPrint_title_tit" v-else>专题图</span>
        <span class="closed-container" @click="closeEve">
        <span class="panel_btnClose"></span>
      </span>
      </div>
      <div class="previewPrint_content">
        <div id="newPrint">
          <div id="newMap"></div>
        </div>
        <!-- <div class="beizhen"></div> -->
      </div>
      <div class="unit" v-if="data.unit">{{data.unit}}</div>
      <!-- 暂时写登陆单位，等到有登陆用户时显示用户的登陆单位   -->
      <div class="unit" v-else></div>
      <div class="timebox">{{data.time}}</div>

    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Map2D from '@/views/common/Map2D.vue';
import {mapServer} from '../../../api/installServer';
import MapCommon from '../../../util/MapCommon';
import MapPrintComponent from '@/gis/common/mapPrint/MapPrintComponent';
@Component({
  name: 'PreviewPrint',
  components: {
    Map2D,
    MapPrintComponent,
  },
  mixins: [MapCommon],
})
export default class PreviewPrint extends Vue {

  // 是否进行显示boolean
  @Prop({default: false}) public value?: boolean;
  @Prop() public data?: any;
  @Prop() public targetId: any ;
  public visibility: any = 'visibility:visible';
  private mapParent: any = '';
  private mapDom: any = '';
  public initControls() {
    this.map.addScaleLineControl();
  }
  private closeEve() {
    this.$emit('closePrintPreviewEmit', {isShow: false});
    this.getComponent().resize();
  }
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('gisToolComp');
    return component;
  }
  /**
   * 打印预览地图展示
   */
  private created() {
    console.log(this.data);
    this.$nextTick(() => {
      const oldmap = (window as any).map;
      const level = oldmap.getZoomLevel();
      const mapExtent = oldmap.getExtent();
      const pointXY = oldmap.getCenter();
      mapServer.getConfig('./json/map.json').then((res: any) => {
        res.data.map.defaultExtent.zoom = level;
        res.data.map.defaultExtent.center = [pointXY.x, pointXY.y];
        res.data.map.fullExtent.zoom = level;
        res.data.map.fullExtent.center = [pointXY.x, pointXY.y];
        this.initMap(res.data.map);
        const mapPrintComponent = new MapPrintComponent();
        mapPrintComponent.printViewMapLayer(res.data.baseLayers);
        this.initControls();
        this.map.dragPan.setActive(false);
        this.map.stopMouseWheelZoom();
        this.map.stopDbClick();
      });
      this.getComponent().resize();
    });
  }
  /**
   *创建地图
   */
  private initMap(opts: any) {
        this.map = new G.Map(opts);
        this.map.init({
            targetId: 'newMap',
        });
        // 地图加载完成后，注册地图变量，触发地图加载完成事件
        const self: any = this;
        (window as any).Newmap = this.map;
        self.registMap(this.map, 'newMap');
        // const scaleLine = new egis.control.ScaleLine({
        //     className:"ol-scale-line-new",
        //     // className:"ol-scale-line",
        //     bar: true,
        //     steps: 4,
        //     minWidth: 128
        // })
        // this.map.map.addControl(scaleLine);//比例尺
  }
}
</script>
<style lang="less" scoped>
/* beizhen */
@imgUrl: '../../../assets/img/eventInfo';
.CompanyDetail{
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}
#newPrint{
  height: 100%;
  width:100%;
}
#newMap{
  height: 100%;
  width:100%;
}
.closed-container {
    width: 57px;
    /* height: 66px; */
    /* right: 0px; */
    /* top: 0; */
    padding-left: 13px;
    text-align: center;
    box-sizing: border-box;
  cursor: pointer;
}
.previewPrint {
  position: absolute!important;
  left: 50%;
  top: 53.5%;
  transform: translate(-50%, -47%);
  width: 1465px;
  height:890px;
  // background: url('@{imgUrl}/infolistimg.png') no-repeat  50% 50%;
  // background-size:100% 100%;
  padding: 44px 81px 72px 80px;
  z-index: 4;
  box-sizing:border-box;
  &_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffde00;
    height: 60px;
    font-size: 28px;
    font-weight: 600;
    padding-left:33px;
    line-height: 60px;;
    margin-bottom:20px;
    position: relative;
    &_tit{
      position:absolute;
      text-align:center;
      width:93%;
    }
    
  }
  &_content {
    height: calc(100% - 130px);
    overflow: hidden;
    margin: 0 2% 0 2%;
    position: relative;
    .beizhen{
      position:absolute;
      cursor: pointer;
      top: 20px;
      right: 20px;
      background: url('@{imgUrl}/beizhen.png') no-repeat center / 100% 100%;
      width: 88px;
      height: 88px;
    }
  }
  .timebox{
    position:absolute;
    bottom: 64px;
    right: 100px;
    line-height: 60px;
    color: #eef9fd;
    font-size: 24px;
  }
  .unit{
    position:absolute;
    bottom: 64px;
    left: 100px;
    line-height: 60px;
    color: #eef9fd;
    font-size: 24px;
  }
}
</style>
