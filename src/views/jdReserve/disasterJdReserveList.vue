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
      :eventObject="eventObject"
      :itemClick="clickItemEvent"
      :definitionWidth="definitionWidth"
      :sourceTypeCodeObj="sourceTypeCodeObj"
      :FnHoverItemEvent="FnHoverItemEvent"
      :FnMouserLeave="FnMouserLeave"
      :SelectClass="SelectClass"
  ></AreaList>
  <!-- </div> -->
</template>
<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import EventInfoPop from '@/components/feature/gisModule/popUp/eventInfo.vue';
  import HoverGIS from '@/views/common/gisModules/common/interact/CommonnteractComponent';
  import AreaList from '@/components/common/render/AreaList.common.vue';
  import MapCommon from '@/util/MapCommon';
  import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
  import {dataSourcesServer} from '@/api/installServer';
  import {dataSourceConfig} from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterJudge';
  @Component({
    name: 'DisasterJdReserveList',
    mixins: [MapCommon],
    components: {
      AreaList,
    },
  })
  export default class DisasterJdReserveList extends Vue {
    public title: any = '物资储备列表';
    private filexed = ['num', 'name', 'type' , '_distance'];
    private definitionWidth = {
      num: '15%',
      name: '35%',
      type: '25%',
      _distance: '25%',
    };
      private SelectClass = [
      {
        label: '全部',
        value: 'all',
      },
      {
        label: '中央',
        value: '1',
      },
      {
        label: '地方',
        value: '2',
      },
      {
        label: '社会',
        value: '3',
      },
      {
        label: '消防局',
        value: '4',
      },
      {
        label: '森林消防局',
        value: '5',
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
        type: '暂无数据',
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
        type: '物资库类型',
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
    private onTableHover() {
      return true;
    }
    private onTableClick() {
      return true;
    }
    // 获取数据来源
    // @Watch('sourceTypeCode')
    private FnSourceTypeCode() {
      this.sourceTypeCodeObj = dataSourceConfig('DisasterJdReserveList');
      dataSourcesServer.getDataSourceServer({typeCode: this.sourceTypeCodeObj.typeCode}).then((data: any) => {
        const res = data;
        this.sourceTypeCodeObj.sourceData = res.data[0];
        console.log(this.sourceTypeCodeObj, 'this.sourceTypeCodeObj');
      });
    }
    private FnListData() {
      // this.messsageBus.off('listSearchObj');
      this.messsageBus.on('listSearchObj', (item: any) => {
        this.listData = [];
        const listData = [];
        for (let index = 0; index < item.length; index++) {
          const element = item[index];
          let Letname = '暂无数据';
          let Lettype = '暂无数据';
          let Letdistance = '暂无数据';
          let LetTypecode = '暂无数据';
          if (element.name && element.name !== null) {
            Letname = element.name;
          }
          if (element.REPERTORYTYPECODE && (element.REPERTORYTYPECODE.REPERTORYTYPENAME !== null || element.REPERTORYTYPECODE.REPERTORYTYPENAME !== undefined )) {
            Lettype = element.REPERTORYTYPECODE.REPERTORYTYPENAME;
          }
          if (element._distance && element._distance !== null) {
            Letdistance = element._distance;
          }
          if (element.LEVELCODE && element.LEVELCODE.LEVELCODE !== null) {
            LetTypecode = element.LEVELCODE.LEVELCODE;
          }
          const data = {
            name: Letname,
            type: Lettype,
            level: element.level,
            lon: element.latitude || '',
            lat: element.longitude || '',
            typecode: LetTypecode,
            id: element._id,
            num: index + 1,
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
      /*this.eventInfo = {
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
        eventLocation,module: NodeModule
      };
      const popUpTemplate = new renderpopUpTemplate();
      popUpTemplate.getParams(param);*/
      // add eventLocation end
      this.getComponent().openPopup('repository', item.id);
    }
    private FnHoverItemEvent(item: any) {
      const type = 'disaster_judge_resource__' + this.$store.state.gisModuleDisasterJudge.disasterJudgeType + '__' + item.level;
      this.getComponent1().addHover(type, item.id);
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
      console.log(event, 'event');
      /*const eventInfo = this.eventInfo;
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
      });*/
    }
    // 联动gis方法 结束
    private created() {
      this.FnListData();
      this.FnSourceTypeCode();
    }
    private mounted() {
      (this as any).resolveMap.call(this, 'map').then(() => {
        // this.getComponent().off('disasterXZDist');
        this.getComponent().on('disasterXZDist', this.FnShowXZD, this); // 替换 列表数据 的监听
      });
    }

    /*private destroyed(): void {
      this.getComponent().off('disasterXZDist');
      // this.messsageBus.off('listSearchObj');
    }*/
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
