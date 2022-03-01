<template>
  <div>
    <!-- <button @click="fnClick()" style="position: fixed;top: 10%;left: 10%;z-index: 30;">按钮</button> -->
    <div v-if="this.isShow" class="legend">
      <div class="legend-head" @click="setIsShow(list.type)">图例</div>
      <div class="legend-main">
        <ul>
          <li v-for='(each, index) in list.list' :key="index"><span class="colorBlock"></span> <span>{{each.name}}</span></li>
          <!-- <li><span class="colorBlock"></span> <span>重伤区</span></li>
          <li><span class="colorBlock"></span> <span>轻伤区</span></li>
          <li><span class="colorBlock"></span> <span>有感区</span></li> -->
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import RiskAnalysisComponent from './RiskAnalysisComponent';
// import {mouxServer} from '../../../api/installServer';
@Component({
  name: 'RiskAnalysisComponentTest',
  mixins: [MapCommon],
  components: {

  },
})
export default class RiskAnalysisComponentTest extends Vue {
  private mapId: string = '';
  private list: any = null;
  private isShow: any = false;
  private isMapShow: any = false;
  // 实时监听
  private mounted() {
    // 地图容器id
    this.mapId = 'map';
    (this as any).resolveMap(this.mapId).then((data: any) => {
      this.init(data.map);
      // this.getComponent().load();
    });
  }
  //  地图加载完成后，初始化
  private init(map: any) {
    const temp: any = this;
    // 地图配置
    const mapConfig = temp.$ioc.resolve(`mapConfig-map`);
    // 符号配置
    const symbolConfig = temp.$ioc.resolve(`symbolConfig-map`);
    // 通用的地图组件实例
    const GISComponents = temp.$ioc.resolve(`GISFactory-map`);
    //
    // console.log(G.common);
    // const riskAnalysis: any = new G.common.RiskAnalysis({
    //     map,
    // });
    const component = new RiskAnalysisComponent({
      map,
      GISComponents,
      simpleRenderMgr: GISComponents.simpleRenderMgr,
    });
  }
  // 获取地图功能
  private getComponent() {
    const gisModules = this.$ioc.resolve('GISFactory-map');
    const component = gisModules.commonFactory.getComponent('riskAnalysis');
    return component;
  }

  private load() {
    this.getComponent().load();
  }

  private unload() {
    this.getComponent().unload();
  }
  private fnClick( ) {
    // mouxServer.getConfig('./json/data.json').then((res: any) => {
    //   this.getComponent().getList(res, 'Harm');
    //   this.getComponent().getArea();
    //   this.isShow = true;
    //   // this.getComponent().getLegendData().list = this.getComponent().getLegendData().list.reverse();
    //   this.list = this.getComponent().getLegendData();
    //   this.list.list = this.list.list.reverse();
    //   console.log(this.list);
    // });
  }

  private setIsShow(type: any) {
    this.getComponent().setModuleIsShow(type, this.isMapShow);
    this.isMapShow = !this.isMapShow;
  }
}
</script>
<style lang="less" scoped>
  .legend{
    background-color: #fff;
    position: absolute;
    bottom: 10%;
    right: 10%;
    z-index: 30;
    padding: 15px 0;
  }
  .legend-head{
    text-align: center;
    font-weight: bold;
    font-size: 20px;
    cursor: pointer;
    padding: 5px 0;
  }
  .legend-head:hover{
    background-color: #838B86;
  }
  .legend-main ul li{
    display: flex;
    padding: 5px 25px;
  }
  .legend-main .colorBlock{
    display: block;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    border: 1px solid;
  }
  .legend-main ul li:nth-child(1) .colorBlock{
    background-color: #FF0000;
  }
  .legend-main ul li:nth-child(2) .colorBlock{
    background-color: #FFC000;
  }
  .legend-main ul li:nth-child(3) .colorBlock{
    background-color: #00B050;
  }
  .legend-main ul li:nth-child(4) .colorBlock{
    background-color: #4472C4;
  }
  .legend-main ul li:nth-child(5) .colorBlock{
    background-color: #fff;
  }
</style>
