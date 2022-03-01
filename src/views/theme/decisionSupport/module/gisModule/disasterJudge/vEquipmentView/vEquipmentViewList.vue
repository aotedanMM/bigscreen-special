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
  // import DistrictRightModule from '@/components/feature/gisModule/list/list.district.vue';
  import HoverGIS from '@/views/common/gisModules/common/interact/CommonnteractComponent';
  import EventInfoPop from '@/components/feature/gisModule/popUp/eventInfo.vue';
  import AreaList from '@/components/common/render/AreaList.common.vue';
  import MapCommon from '@/util/MapCommon';
  import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
  import {dataSourcesServer} from '@/api/installServer';
  import {dataSourceConfig} from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterJudge';

  @Component({
    name: 'VEquipmentViewList',
    mixins: [MapCommon],
    components: {
      //   DistrictRightModule,
      AreaList,
    },
  })
  export default class VEquipmentViewList extends Vue {
    //  private listDataFlag  = false;
    public title: any = '救援装备列表';
    private filexed = ['num', 'name', 'address', 'level', '_distance'];
    private definitionWidth = {
      num: '25%',
      name: '25%',
      level: '25%',
      _distance: '25%',
    };
    private IsPagination = true;
    private eventInfo: any = {};
    private eventInfoPop: any = null;
    private listData = [
      {
        num: '暂无数据',
        name: '暂无数据',
        level: '暂无数据',
        address: '暂无数据',
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
        address: '地址',
      },
      {
        level: '所在烈度区',
      },
      {
        _distance: '距事发地',
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
      this.sourceTypeCodeObj = dataSourceConfig('DisasterNoCoalList');
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
          let Letlevel = '暂无数据';
          let Letdistance = '暂无数据';
          let address = '暂无数据';
          if (element.name !== null) {
            Letname = element.name;
          }
          if (element.level !== null) {
            Letlevel = element.level;
          }
          if (element.address !== null) {
            address = element.address;
          }
          if (element.distance !== null) {
            Letdistance = element.distance;
          }
          const data = {
            name: Letname,
            lon: element.latitude || '',
            lat: element.longitude || '',
            id: element.id,
            num: index + 1,
            level: Letlevel,
            address,
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
        component = factory.disasterJudgeFactory.getComponent('disasterJudgeResource');
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
      // console.log(this.$store.state.eventPushStore);
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
        this.getComponent_new().locationCenter('v_equipment※02', item.id);
      }, 500);

      // this.getComponent().openPopup('v_equipment※02', item.id);
      /* this.getComponent().locateEvent({
        id: item.id,
        eventType: item.name,
        message: item.name,
        x: item.lon,
        y: item.lat,
      }); */
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
        // this.getComponent().on('EventPointspopup', this.onShowPopup, this);
        this.getComponent().on('disasterXZDist', this.FnShowXZD, this); // 替换 列表数据 的监听
      });
    }

    // 数据加载完成,dom更改后发送事件设置列表高度
    private updated() {
      this.$nextTick(() => {
        this.$emit('queryHeightFn');
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

    // #DistrictRightDialog {
    //   position: absolute;
    //   top: -16px;
    //   left: 20px;
    //   z-index: 9999;
    // }
</style>
