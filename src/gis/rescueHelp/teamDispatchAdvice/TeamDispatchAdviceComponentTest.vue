<template>
  <div>
    <div class="dpjy">
      <span>
        <input type="button" value="删除队伍" id="remove" @click="remove('矿山（隧道）', 1)">
        <input type="button" value="清空队伍" id="clear" @click="clear()">
      </span>
      <ul>
        <li v-for="(item) in dpjyList" :key="item.name">
          {{item.name + ' ' + item.teamNum + '支 ' + item.totalNum + '人'}}
          <button
            @click="list(item)"
          >详情</button>
          <ul v-show="item.showTeamList">
            <li
              v-for="(team) in item.arr"
              :key="team.name"
              @click="addToMap(team,item.batchNum)"
            >{{team.key + ' ' + team.val.length + '支 ' + team.num + '人'}}</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import TeamDispatchAdviceComponent from './TeamDispatchAdviceComponent';
import SimpleRouterPlanComponent from '../../common/routeplan/SimpleRouterPlanComponent';
import EarthQuakeEventInfo from '../../event/EarthQuakeEventInfo';
import { rescueTeamServer } from '@/api/installServer';
import { districtServer } from '@/api/installServer';
import { rescueAssistanceServer } from '@/api/feature/RescueAssistance/installRescueAssistanceServer';
import publishObjectPath from '@/util/configRegistry';

@Component({
  name: 'TeamDispatchAdviceComponentTest',
  components: {},
  mixins: [MapCommon],
})
export default class TeamDispatchAdviceComponentTest extends Vue {
  private dpjyList: any[] = [];
  private teamList: any[] = [];
  private showTeamList: boolean = false;
  private teamDispatchAdviceComponent: any;
  private mounted() {
    // 地图容器id
    this.mapId = 'map';
    (this as any).resolveMap(this.mapId).then((data: any) => {
      this.init(data.map);
    });
  }

  //  地图加载完成后，初始化
  private init(map: any) {
    // 地图配置
    const mapConfig = this.$ioc.resolve(`mapConfig-${this.mapId}`);
    // 符号配置
    const symbolConfig = this.$ioc.resolve(`symbolConfig-${this.mapId}`);
    // 通用的地图组件实例
    //
    const eventInfo = new EarthQuakeEventInfo([], []);
    const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);
    const map1 = map;
    const simpleRouterComponent = new SimpleRouterPlanComponent({
        map: map1,
        server: publishObjectPath.value.egis,
    });
    simpleRouterComponent.load();
    const teamDispatchAdviceComponent = new TeamDispatchAdviceComponent({
      map,
      service: rescueTeamServer,
      symbolConfig,
      eventInfo,
      GISComponents,
      simpleRenderMgr: GISComponents.simpleRenderMgr,
      popupManager: GISComponents.popupManager,
      featureLocate: GISComponents.featureLocate,
      featureHighlight: GISComponents.featureHighlight,
      pointGeometryBuilder: GISComponents.PointGeometryBuilder,
      simpleRouter: simpleRouterComponent,
    });

    (window as any).teamDispatchAdviceComponent = this.teamDispatchAdviceComponent = teamDispatchAdviceComponent;

    (this as any).resolveMap.call(this, 'map').then(() => {
      (window as any).teamDispatchAdviceComponent.on('firePopup_rescue_dispatch_advice', this.testClickEvent, this);
    });
    const optsTest = {
      location: [eventInfo.getPoint()[0], eventInfo.getPoint()[1]],
      level: '1',
    };

    const self = this;
    districtServer.getDistrictByLonLat(optsTest).then((dataDis: any) => {
      // self.$store.commit('eventPushStore/setDistrict', dataDis.data[0]); // 推送
      console.log(dataDis);
      const optsScheduling = {
        typecode: '',
        adcode: dataDis.data[0].code,
        point: [eventInfo.getPoint()[0], eventInfo.getPoint()[1]],
      };
      // const data = {
      //   '1': {
      //     arr: [
      //       {
      //         key: "矿山（隧道）",
      //         num: 29,
      //         val: [
      //           {
      //             address: "北京市石景山区",
      //             checked: "checked",
      //             contact: "黄勇",
      //             dispatchnum: "29",
      //             dutytel: "15810615810",
      //             id: "RESZGS0032",
      //             iszd: "0",
      //             latitude: 39.921734,
      //             lineardistance: "xxx",
      //             longitude: 116.19661,
      //             name: "国家矿山应急救援大地特勘队",
      //             provincial: "北京市",
      //             rescueorgname: "中国煤炭地质总局",
      //             rescuetypecode: "T001",
      //             resfullnum: "85",
      //             telephone: "15311096106",
      //             totalpernum: 85
      //           }
      //         ]
      //       }
      //     ],
      //     provarray: [],
      //     teamNum: 35,
      //     totalNum: 22235
      //   }
      // };
      rescueAssistanceServer.getScheduling(optsScheduling).then((data: any) => {
        console.log(data);
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const element: any = data[key];
            element.batchNum = key;
            element.name = '第' + key + '批次';
            element.showTeamList = false;
            self.dpjyList.push(element);
          }
        }
        console.log(self.dpjyList);
      });
    });
  }

  private list(team: any) {
    team.showTeamList = !team.showTeamList;
  }

  private addToMap(team: any, batchNum: number) {
    const self = this;
    // team.val.array.forEach((element: any) => {
    //   self.teamDispatchAdviceComponent.addTeamOnMap(element);
    // });
    this.teamDispatchAdviceComponent.addTeamOnMap(team, batchNum);
    this.teamDispatchAdviceComponent.locateTeam(team.key, batchNum);
  }

  private testClickEvent(event: any) {
      // console.log(event);
      // jQuery('#' + event.containerId).append('<b>弹出框内容' + event.data.id + '</b>');
  }

  private remove(teamKey: any, batchNum: number) {
    this.teamDispatchAdviceComponent.removeTeam(teamKey , batchNum);
  }

  private clear() {
    this.teamDispatchAdviceComponent.clear();
  }
}
</script>
<style lang='less' scoped>
.dpjy {
  background-color: yellow;
  position: absolute;
  top: 200px;
  left: 50%;
}
</style>
