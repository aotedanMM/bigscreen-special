<template>
  <div style="position:absolute;z-index:9999">
    <!-- <button class="el-button" @click="loadYujingData('11B16')">加载预警信息</button>
    <button class="el-button" @click="loadYingjiData('floodteam')">加载应急floodteam</button>
    <button class="el-button" @click="clearByType('floodteam')">移除应急floodteam</button>
    <button class="el-button" @click="loadYingjiData('DisasterPer※01')">加载应急数据DisasterPer※01</button>
    <button class="el-button" @click="loadCar()">加载车辆</button>
    <button class="el-button" @click="unloadCar()">移除车辆</button>
    <button class="el-button" @click="loadHouseDistr()">加载房屋分布</button>
    <button class="el-button" @click="unloadHouseDistr()">移除房屋分布</button>
    <button class="el-button" @click="loadHouseStruc()">加载房屋结构</button>
    <button class="el-button" @click="unloadHouseStruc()">移除房屋结构</button>
    <button class="el-button" @click="loadPopHeat()">加载人口热力</button>
    <button class="el-button" @click="unloadPopHeat()">移除人口热力</button>
    <button class="el-button" @click="testYingjiJiekou()">测试应急接口</button>
    <button class="el-button" @click="unionGeometry()">测试合并geometry功能</button>
    <button
      class="el-button"
      @click="loadYingjiData('ANJIAN_REPERTORY※01')"
    >加载应急数据ANJIAN_REPERTORY※01</button> -->
  </div>
</template>
<script lang='ts'>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import {
  warningInfoServer,
  normalResourceServer,
  districtServer,
  disasterJudgeServer,
} from '@/api/installServer';
import { resourceanalysisServer } from '@/api/feature/normal/installNormalServer';
import QueryHouseComponent from './QueryHouseComponent';
import installSearchReosurce from '@/api/feature/searchresource/installSearchReosurce';
import FireCarHistoryCmponent from './FireCarHistory/FireCarHistoryCmponent';
import QueryResourceComponent from './QueryResourceComponent';
import PopHeatComponent from '../../../common/popheat/PopHeatCompnent';
@Component({
  name: 'QueryResourceComponentTest',
  mixins: [MapCommon],
})
export default class QueryResourceComponentTest extends Vue {
  private mapId: any = 'map';
  private queryResourceComponent: any = null;
  /* private mounted() {
    // 获取地图，地图加载完成后进入回调
    const self: any = this;
    self.resolveMap(this.mapId).then((event: any) => {
      this.init(event.map);
    });
  }

  private init(map?: any) {
    // 地图配置
    const mapConfig = this.$ioc.resolve(`mapConfig-${this.mapId}`);
    // 符号配置
    const symbolConfig = this.$ioc.resolve(`symbolConfig-${this.mapId}`);
    // 过滤条件
    const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);
    // 房屋
    const queryHouseComponent = new QueryHouseComponent({
      districtServer,
      map,
      symbolConfig,
      buildingServer: installSearchReosurce.buildingServer,
      featureLocate: GISComponents.featureLocate,
      popupManager: GISComponents.popupManager,
      simpleRenderMgr: GISComponents.simpleRenderMgr
    });
    // 车辆
    const fireCarHistoryCmponent = new FireCarHistoryCmponent({
      map,
      symbolConfig,
      featureLocate: GISComponents.featureLocate,
      popupManager: GISComponents.popupManager,
      featureHighlight: GISComponents.featureHighlight,
      simpleRenderMgr: GISComponents.simpleRenderMgr,
      realTimeCar: installSearchReosurce.realTimeCar
    });
    // 人口热力
    const popHeatComponent: any = new PopHeatComponent({
      map,
      service: disasterJudgeServer,
      simpleRenderMgr: GISComponents.simpleRenderMgr,
      symbolConfig,
      featureLocate: GISComponents.featureLocate
    });
    // 资源查询
    const queryResourceComponent = new QueryResourceComponent({
      map, // 地图
      symbolConfig, // 符号配置
      fireCarHistoryCmponent, // 车辆组件
      queryHouseComponent, // 房屋组件
      popHeatComponent, // 人口热力组件
      normalResourceServer, // server
      resourceanalysisServer, // server
      warningInfoServer, // server
      districtServer,
      simpleRenderMgr: GISComponents.simpleRenderMgr,
      featureLocate: GISComponents.featureLocate,
      featureHighlight: GISComponents.featureHighlight,
      popupManager: GISComponents.popupManager
    });
    this.queryResourceComponent = queryResourceComponent;
    this.queryResourceComponent.load();
  }

  // 测试加载预警数据
  private loadYujingData(type: string) {
    // 清除数据后再加载（可不清，由前端决定调用）
    this.queryResourceComponent.clearData();
    const opts = {
      opts: {
        type,
        startTime: '2019-12-11 15:28:55',
        endTime: '2019-12-24 09:28:55',
        districtCode: ''
      }
    };
    this.queryResourceComponent.addData({
      TYPE: 'yujing',
      type,
      opts,
      geoFilter: false
    });
  }
  // 测试加载应急资源和承灾体数据
  private loadYingjiData(type: string) {
    const geojsonStr =
      '{"type":"Polygon","coordinates":[[[116.35,40.31915764205975],[116.37890505584808,40.31861303713406],[116.40773908816048,40.316980560677585],[116.4364312582776,40.31426422416549],[116.46491109670495,40.310470701777824],[116.4931086862314,40.305609313020824],[116.52095484329834,40.29969199847434],[116.54838129705094,40.29273328874234],[116.57532086551342,40.28475026670554],[116.60170762834568,40.27576252319495],[116.62747709565473,40.26579210622638],[116.65256637235419,40.25486346395481],[116.67691431758689,40.24300338152674],[116.70046169874864,40.23024091202603],[116.72315133967795,40.216607301726285],[116.74492826260284,40.20213590987796],[116.76573982346491,40.186862123274025],[116.78553584027124,40.170823265850906],[116.80426871415472,40.154058503594534],[116.82189354285606,40.136608745032476],[116.83836822637181,40.118516537602986],[116.85365356454662,40.09982596020115],[116.86771334641897,40.08058251220953],[116.8805144311627,40.06083299932729],[116.89202682049917,40.04062541651691],[116.90222372248503,40.02000882839197],[116.91108160661257,39.99903324737136],[116.91858025018826,39.97774950992826],[116.92470277598505,39.95620915126169],[116.92943568119043,39.934464278718586],[116.93276885769926,39.91256744429293],[116.93469560382547,39.89057151652556],[116.93521262752891,39.86852955212565],[116.93432004127763,39.8464946676301],[116.93202134868412,39.824519911412786],[116.92832342307457,39.8026581363493],[116.92323647816642,39.780961873437164],[116.91677403104526,39.75948320666422],[116.90895285764684,39.738273649410694],[116.89979294096136,39.7173840226622],[116.88931741218988,39.69686433530325],[116.87755248509028,39.67676366675125],[116.86452738376052,39.65713005218285],[116.85027426411231,39.63801037059442],[116.83482812929547,39.61945023592943],[116.81822673933598,39.60149389149549],[116.8005105152568,39.584184107884035],[116.78172243795078,39.56756208459557],[116.76190794207814,39.55166735556347],[116.7411148052617,39.53653769875875],[116.71939303285308,39.52220905004887],[116.69679473854292,39.50871542147228],[116.67337402108751,39.49608882408144],[116.64918683742319,39.48435919549604],[116.62429087243748,39.47355433229821],[116.59874540566558,39.46369982739185],[116.57261117517741,39.45481901243744],[116.5459502389196,39.446932905464436],[116.51882583377386,39.44006016375292],[116.4913022325917,39.434217042066535],[116.46344459946329,39.42941735630903],[116.43531884347611,39.42567245266664],[116.40699147121836,39.422991182289266],[116.37852943827954,39.42137988155336],[116.35,39.420842357940245],[116.32147056172045,39.42137988155336],[116.29300852878163,39.422991182289266],[116.26468115652388,39.42567245266664],[116.2365554005367,39.42941735630903],[116.20869776740827,39.434217042066535],[116.18117416622613,39.44006016375292],[116.15404976108039,39.446932905464436],[116.12738882482256,39.45481901243744],[116.1012545943344,39.46369982739185],[116.07570912756249,39.47355433229821],[116.0508131625768,39.48435919549604],[116.02662597891248,39.49608882408144],[116.00320526145705,39.50871542147228],[115.9806069671469,39.52220905004887],[115.95888519473827,39.53653769875875],[115.93809205792185,39.55166735556347],[115.9182775620492,39.56756208459557],[115.89948948474319,39.584184107884035],[115.88177326066399,39.60149389149549],[115.8651718707045,39.61945023592943],[115.84972573588766,39.63801037059442],[115.83547261623947,39.65713005218284],[115.82244751490968,39.67676366675125],[115.81068258781009,39.69686433530325],[115.80020705903863,39.7173840226622],[115.79104714235314,39.738273649410694],[115.78322596895471,39.75948320666422],[115.77676352183356,39.78096187343715],[115.7716765769254,39.8026581363493],[115.76797865131587,39.824519911412786],[115.76567995872236,39.8464946676301],[115.76478737247106,39.86852955212565],[115.76530439617451,39.89057151652556],[115.7672311423007,39.91256744429293],[115.77056431880955,39.934464278718586],[115.77529722401492,39.95620915126169],[115.7814197498117,39.97774950992826],[115.7889183933874,39.99903324737136],[115.79777627751493,40.02000882839197],[115.8079731795008,40.04062541651691],[115.81948556883728,40.06083299932729],[115.83228665358102,40.08058251220953],[115.84634643545333,40.09982596020115],[115.86163177362818,40.118516537602986],[115.87810645714393,40.136608745032476],[115.89573128584526,40.154058503594534],[115.91446415972874,40.170823265850906],[115.93426017653508,40.186862123274025],[115.95507173739715,40.20213590987796],[115.97684866032202,40.216607301726285],[115.99953830125135,40.23024091202603],[116.02308568241308,40.24300338152674],[116.04743362764579,40.25486346395481],[116.07252290434526,40.26579210622638],[116.09829237165431,40.27576252319495],[116.12467913448656,40.28475026670554],[116.15161870294904,40.29273328874234],[116.17904515670165,40.29969199847434],[116.20689131376858,40.305609313020824],[116.23508890329502,40.310470701777824],[116.26356874172238,40.31426422416549],[116.2922609118395,40.316980560677585],[116.3210949441519,40.31861303713406],[116.35,40.31915764205975]]]}';
    const opts: any = {
      // districtCode: '110000,130000',
      // resourceKeys: [type]
      // geometry: JSON.parse(geojsonStr),
    };
    this.queryResourceComponent.addData({
      TYPE: 'yingjiziyuan',
      type,
      opts,
      geoFilter: true
    });
  }
  private testYingjiJiekou() {
    const opts: any = {
      // districtCode: '110000,130000',
      resourceKeys: ['mineteam'],
      buffer: {
        type: 'Polygon',
        coordinates: [
          [
            [113.31736265279649, 24.74342],
            [113.24244979023743, 24.05074116777054],
            [113.02059006185678, 23.381136891591826],
            [112.66030941259585, 22.761013238299327],
            [112.175453225758, 22.215141897302708],
            [111.58465425269296, 21.765562020251384],
            [110.9106165666117, 21.43057770322085],
            [110.17924305778565, 21.22391143162394],
            [109.41864000000001, 21.154063186787567],
            [109.41861999999999, 21.154063186787567],
            [108.65801694221435, 21.22391143162394],
            [107.9266434333883, 21.43057770322085],
            [107.25260574730704, 21.765562020251384],
            [106.66180677424201, 22.215141897302708],
            [106.17695058740415, 22.761013238299327],
            [105.8166699381432, 23.381136891591826],
            [105.59481020976257, 24.05074116777054],
            [105.51989734720352, 24.74342],
            [105.51989734720352, 24.74343999999999],
            [105.59481020976257, 25.432280776079136],
            [105.8166699381432, 26.090957841052493],
            [106.17695058740415, 26.694734568796925],
            [106.66180677424201, 27.221333808047795],
            [107.25260574730704, 27.65165282809375],
            [107.9266434333883, 27.970317375264255],
            [108.65801694221435, 28.166083619964887],
            [109.41861999999999, 28.232105138118172],
            [109.41864000000001, 28.232105138118172],
            [110.17924305778565, 28.166083619964887],
            [110.9106165666117, 27.970317375264255],
            [111.58465425269296, 27.65165282809375],
            [112.175453225758, 27.221333808047795],
            [112.66030941259585, 26.694734568796925],
            [113.02059006185678, 26.090957841052493],
            [113.24244979023743, 25.432280776079136],
            [113.31736265279649, 24.74343999999999],
            [113.31736265279649, 24.74342]
          ]
        ]
      }
    };
    resourceanalysisServer.getNearbyList(opts).then((res2: any) => {
      console.log(res2);
    });
  }
  private loadCar() {
    this.queryResourceComponent.addData({
      TYPE: 'chengzaiti',
      type: '车辆',
      opts: null,
      geoFilter: false
    });
  }
  private unloadCar() {
    this.queryResourceComponent.clearByType('车辆');
  }
  private loadHouseDistr() {
    this.queryResourceComponent.addData({
      TYPE: 'chengzaiti',
      type: '房屋分布',
      opts: null,
      geoFilter: false
    });
  }
  private unloadHouseDistr() {
    this.queryResourceComponent.clearByType('房屋分布');
  }
  private loadHouseStruc() {
    const opts = {
      districtCode: '532501'
    };
    this.queryResourceComponent.addData({
      TYPE: 'chengzaiti',
      type: '房屋结构',
      opts,
      geoFilter: false
    });
  }
  private unloadHouseStruc() {
    this.queryResourceComponent.clearByType('房屋结构');
  }
  private loadPopHeat() {
    const geometry = {
      type: 'Polygon',
      coordinates: [
        [
          [116.35831890646219, 40.172020480604466],
          [116.07267429139316, 40.12514544148892],
          [116.25285008940696, 39.88491108604669],
          [116.6688657367587, 39.77797736377418],
          [116.67472502235174, 40.15737201516479],
          [116.35831890646219, 40.172020480604466]
        ]
      ]
    };
    const districtCode = '110108';
    const opts = { districtCode };
    this.queryResourceComponent.addData({
      TYPE: 'chengzaiti',
      type: '人口热力',
      opts,
      geoFilter: false
    });
  }
  private unloadPopHeat() {
    this.queryResourceComponent.clearByType('人口热力');
  }
  private clearByType(type: string) {
    this.queryResourceComponent.clearByType(type);
  } */
}
</script>
<style lang="less">
</style>
