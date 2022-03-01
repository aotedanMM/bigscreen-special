<template>
    <!-- <div id="DisasterRescueTeamsList"> -->
    <AreaList
            :paginationObj="paginationObj"
            :header="header"
            :filexed="filexed"
            :IsPagination="IsPagination"
            :title="title"
            :SelectFlag="SelectFlag"
            :listData="listData"
            :SelectClass="SelectClass"
            :eventObject="eventObject"
            :itemClick="clickItemEvent"
            :definitionWidth="definitionWidth"
            :FnHoverItemEvent="FnHoverItemEvent"
            :FnMouserLeave="FnMouserLeave"
            :sourceTypeCodeObj="sourceTypeCodeObj"
    ></AreaList>
    <!-- </div> -->
</template>
<script lang="ts">
  import {Component, Vue, Prop} from 'vue-property-decorator';
  import EventInfoPop from '@/components/feature/gisModule/popUp/eventInfo.vue';
  import HoverGIS from '@/views/common/gisModules/common/interact/CommonnteractComponent';
  import AreaList from '@/components/common/render/AreaList.common.vue';
  import MapCommon from '@/util/MapCommon';
  import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
  import {dataSourcesServer} from '@/api/installServer';
  import {dataSourceConfig} from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterJudge';

  @Component({
    name: 'DisasterRescueTeamsList',
    mixins: [MapCommon],
    components: {
      AreaList,
    },
  })
  export default class DisasterRescueTeamsList extends Vue {
    public title: any = '力量调度列表';
    private filexed = ['num', 'name', 'typecode', 'level', '_distance'];
    private definitionWidth = {
      num: '15%',
      name: '15%',
      type: '20%',
      level: '20%',
      _distance: '30%',
    };
    // 救援队伍类型字典表
    private typeDictionary: any = {
      T005: '地震救援队',
      T003: '消防救援队',
      T004: '森林(草原)消防救援队',
      T022: '工程抢险队',
      T001: '矿山救援队',
      T002: '危化救援队',
      T008: '铁路救援队',
      T009: '电力救援队',
      T010: '通信救援队',
      T011: '社会救援队',
      T014: '医疗救援队',
      T006: '卫生防疫救援队',
    };
    // 救援队伍类型
    private SelectClass = [
      {
        label: '全部',
        value: 'all',
      },
      {
        label: '消防',
        value: '消防',
      },
      {
        label: '地方森林(草原)灭火',
        value: '地方森林(草原)灭火',
      },
      {
        label: '社会组织',
        value: '社会组织',
      },
      {
        label: '安全生产水上',
        value: '安全生产水上',
      },
      {
        label: '矿山（隧道）',
        value: '矿山（隧道）',
      },
      {
        label: '危险化学品（油气管道、油气田）',
        value: '危险化学品（油气管道、油气田）',
      },
      {
        label: '国家森林（草原）消防',
        value: '国家森林（草原）消防',
      },
      {
        label: '地震',
        value: '地震',
      },
      {
        label: '卫生防疫',
        value: '卫生防疫',
      },
      {
        label: '水上',
        value: '水上',
      },
      {
        label: '铁路',
        value: '铁路',
      },
      {
        label: '电力',
        value: '电力',
      },
      {
        label: '通信',
        value: '通信',
      },
      {
        label: '应急勘测',
        value: '应急勘测',
      },
      {
        label: '医疗',
        value: '医疗',
      },
      {
        label: '技术指挥中心',
        value: '技术指挥中心',
      },
    ];
    // 搜索列表是否存在
    private SelectFlag = true;
    private IsPagination = true;
    private eventInfo: any = {};
    private eventInfoPop: any = null;
    private listData = [
      {
        num: '暂无数据',
        name: '暂无数据',
        typecode: '暂无数据',
        level: '暂无数据',
        _distance: '暂无数据',
      },
    ];
    private paginationObj: any = {
      currentPage: 1,
      pageSize: 10,
      total: 110,
    };
    private header = [
      {
        num: '序号',
      },
      {
        name: '名称',
      },
      {
        typecode: '类型',
      },
      {
        level: '所在烈度区',
      },
      {
        _distance: '距事发地（km）',
      },
    ];

    // 对应的事件对象
    private eventObject = {
      onclick: this.onTableClick,
      hover: this.onTableHover,
    };
    // //数据源
    private sourceTypeCodeObj: any;

    /*// 处理子组件是否处于input中
    private handleInput(inputVal: boolean ) {
      this.messsageBus.emit('searchTimeInteval', inputVal);
    }*/
    // 处理子组件是否处于input中
    /* private handleInput(inputVal: string ) {
      if (inputVal) {
        this.messsageBus.emit('searchTimeInteval', true);
      } else {

        this.messsageBus.emit('searchTimeInteval', false);
      }
    }
    // 处理子组件的换页时的定时器问题
    private handlCurrentPge(val: number) {
    if (val !== 1) {
          this.messsageBus.emit('searchTimeInteval', true);
        } else {
          this.messsageBus.emit('searchTimeInteval', false);
        }
    } */
    private onTableHover() {
      return true;
    }

    private onTableClick() {
      return true;
    }

    // 获取数据来源
    // @Watch('sourceTypeCode')
    private FnSourceTypeCode() {
      this.sourceTypeCodeObj = dataSourceConfig('DisasterRescueTeamsList');
      dataSourcesServer.getDataSourceServer({typeCode: this.sourceTypeCodeObj.typeCode}).then((data: any) => {
        const res = data;
        this.sourceTypeCodeObj.sourceData = res.data[0];
        console.log(this.sourceTypeCodeObj, 'this.sourceTypeCodeObj');
      });
    }

    private FnListData() {
      this.messsageBus.on('listSearchObj', (item: any) => {
        this.listData = [];
        const listData = [];
        for (let index = 0; index < item.length; index++) {
          const element = item[index];
          let Letname = '暂无数据';
          let Lettype = '暂无数据';
          let Letlevel = '暂无数据';
          let Letdistance = '暂无数据';
          if (element.name !== null) {
            Letname = element.name;
          }
          if (element.type !== null || element.type !== undefined) {
            Lettype = element.type;
          }
          if (element.level !== null) {
            Letlevel = element.level;
          }
          if (element.distance !== null) {
            Letdistance = element.distance;
          }
          const data = {
            name: Letname,
            typecode: Lettype,
            lon: element.latitude || '',
            lat: element.longitude || '',
            id: element.id,
            num: index + 1,
            level: Letlevel,
            _distance: Letdistance,
          };
          listData.push(data);
        }
        this.$set(this, 'listData', listData);
      });
    }

    // 联动gis方法 开始
    private getComponent() {
      let component = null;
      const factory = this.$ioc.resolve('GISFactory-map');
      if (factory) {
        component = factory.disasterJudgeFactory.getComponent(
          'disasterJudgeResource',
        );
      }
      return component;
    }

    private getComponent1() {
      let component1 = null;
      const factory1 = this.$ioc.resolve('GISFactory-map');
      if (factory1) {
        component1 = factory1.commonFactory.getComponent('commonInteract');
      }
      return component1;
    }

    private clickItemEvent(item: any) {
      this.eventInfo = {
        id: item.id,
        title: item.name,
        eventType: item.name,
        reportTime: '',
        location: '',
        longitude: item.lon,
        latitude: item.lat,
      };
      // add eventLocation start
      const eventLocation = [
        this.$store.state.eventPushStore.eventLocation.EventLon,
        this.$store.state.eventPushStore.eventLocation.EventLat,
      ];
      const param = {
        eventLocation,
      };
      const popUpTemplate = new renderpopUpTemplate();
      popUpTemplate.getParams(param);
      // add eventLocation end

      setTimeout(() => {
        this.getComponent_new().locationCenter('RescueTeam※03', item.id);
      }, 500);

      // this.getComponent().openPopup('RescueTeam※03', item.id);
    }

    private FnHoverItemEvent(item: any) {
      const type = 'disaster_judge_resource__' + this.$store.state.gisModuleDisasterJudge.disasterJudgeType + '__' + item.level;
      const strType = type.split('级');
      this.getComponent1().addHover(strType[0], item.id);
    }

    private FnMouserLeave(): void {
      this.getComponent1().clearHover();
    }

    // gis 地图联动替换列表数据 开始
    private FnShowXZD(data: any): any {
      console.log(data);
    }

    // gis 地图联动替换列表数据 结束
    private onShowPopup(event: any) {
      const eventInfo = this.eventInfo;
      const self = this;
      this.eventInfoPop = new EventInfoPop({
        el: '#' + event.containerId,
        data() {
          return {
            data: eventInfo,
            config: {
              title: 'title',
              content: 'eventType',
              time: 'reportTime',
            },
          };
        },
        methods: {
          close() {
            self.getComponent().clearAll();
          },
        },
      });
    }

    // 联动gis方法 结束
    private created() {
      this.FnListData();
      this.FnSourceTypeCode();
    }

    private mounted() {
      (this as any).resolveMap.call(this, 'map').then(() => {
        this.getComponent().on('disasterXZDist', this.FnShowXZD, this); // 替换 列表数据 的监听
      });
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
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    #DisasterRescueTeamsList {
        position: absolute;
        top: -16px;
        left: 20px;
        z-index: 9999;
    }
</style>
