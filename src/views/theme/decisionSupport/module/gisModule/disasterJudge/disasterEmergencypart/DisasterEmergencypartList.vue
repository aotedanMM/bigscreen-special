<template>
    <AreaList
            :paginationObj="paginationObj"
            :header="header"
            :filexed="filexed"
            :IsPagination="IsPagination"
            :title="title"
            :listData="listData"
            :eventObject="eventObject"
            :itemClick="clickItemEvent"
            :definitionWidth="definitionWidth"
            :FnHoverItemEvent="FnHoverItemEvent"
            :FnMouserLeave="FnMouserLeave"
            :sourceTypeCodeObj="sourceTypeCodeObj"
    ></AreaList>
</template>
<script lang="ts">
  import {Component, Vue, Prop} from 'vue-property-decorator';
  import EventInfoPop from '@/components/feature/gisModule/popUp/eventInfo.vue';
  import AreaList from '@/components/common/render/AreaList.common.vue';
  import MapCommon from '@/util/MapCommon';
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
    public title: any = '应急管理机构列表';
    private filexed = ['num', 'name', 'location'];
    private definitionWidth = {
      num: '20%',
      name: '40%',
      location: '40%',
    };
    private IsPagination = true;
    private eventInfo: any = {};
    private eventInfoPop: any = null;
    private listData = [
      {
        name: '暂无数据',
        address: '暂无数据',
        location: '暂无数据',
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
        location: '距事发地（km）',
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
          let Letlocation = '暂无数据';
          if (element.name !== null) {
            Letname = element.name;
          }
          if (element._distance !== null) {
            Letlocation = element._distance;
          }
          const data = {
            name: Letname,
            lon: element.latitude || '',
            lat: element.longitude || '',
            id: element.id,
            num: index + 1,
            location: Letlocation,
            level: element.level,
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
      this.getComponent().openPopup('emergencypart', item.id);
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

    // 数据加载完成,dom更改后发送事件设置列表高度
    private updated() {
      this.$nextTick(() => {
        this.$emit('queryHeightFn');
      });
    }
  }
</script>
