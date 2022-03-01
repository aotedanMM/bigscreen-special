<template>
    <!-- <div id="DistrictRightDialog">
      <DistrictRightModule :addressData="searchResult" @updateAddrData="updateAddrData"></DistrictRightModule>
      <district-right-module :setting = setting ></district-right-module>
    </div> -->
    <AreaList
            :paginationObj="paginationObj"
            :header="header"
            :filexed="filexed"
            :IsPagination="IsPagination"
            :title="title"
            :listData="listData"
            :eventObject="eventObject"
            :itemClick="clickItemEvent"
            :SelectClass="SelectClass"
            :SelectFlag="true"
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
    name: 'DisasterCompanyList',
    mixins: [MapCommon],
    components: {
      //   DistrictRightModule,
      AreaList,
    },
  })
  export default class DisasterCompanyList extends Vue {
    //  private listDataFlag  = false;
    public title: any = '危化企业列表';
    private levelData: any = [
      '一级',
      '二级',
      '三级',
      '四级',
      '五级',
      '六级',
      '七级',
      '八级',
      '九级',
      '十级',
    ];
    private filexed = ['num', 'name', 'safetylevel', 'level', '_distance'];
    private definitionWidth = {
      num: '15%',
      name: '20%',
      safetylevel: '20%',
      level: '20%',
      _distance: '25%',
    };
    // private SelectClass = [
    //   {
    //     label: '全部',
    //     value: 'all',
    //   },
    //   {
    //     label: '一级',
    //     value: '1',
    //   },
    //   {
    //     label: '二级',
    //     value: '2',
    //   },
    //   {
    //     label: '三级',
    //     value: '3',
    //   },
    //   {
    //     label: '四级',
    //     value: '4',
    //   },
    //   {
    //     label: '五级',
    //     value: '5',
    //   },
    // ];
    private SelectClass = [
      {
        label: '全部',
        value: 'all',
      },
      {
        label: '一级',
        value: '一级',
      },
      {
        label: '二级',
        value: '二级',
      },
      {
        label: '三级',
        value: '三级',
      },
      {
        label: '四级',
        value: '四级',
      },
      {
        label: '五级',
        value: '五级',
      },
    ];
    private IsPagination = true;
    private eventInfo: any = {};
    private eventInfoPop: any = null;
    private listData = [
      {
        num: '暂无数据',
        name: '暂无数据',
        safetylevel: '暂无数据',
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
        safetylevel: '等级',
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
      this.sourceTypeCodeObj = dataSourceConfig('DisasterCompanyList');
      dataSourcesServer
        .getDataSourceServer({typeCode: this.sourceTypeCodeObj.typeCode})
        .then((data: any) => {
          const res = data;
          this.sourceTypeCodeObj.sourceData = res.data[0];
          console.log(
            this.sourceTypeCodeObj,
            'this.sourceTypeCodeObj1111111111111111111111111111',
          );
          console.log(
            res.data,
            'this.sourceTypeCodeObj1111111111111111111111111111',
          );
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
          let Letsafetylevel = '暂无数据';
          let Letdistance = '暂无数据';
          if (element.name !== null) {
            Letname = element.name;
          }
          if (element.level !== null) {
            Letlevel = element.level;
          }
          if (element.distance !== null) {
            Letdistance = element.distance;
          }
          if (element.safetylevel !== undefined && element.safetylevel !== null) {
            const safetylevelInfo: any = this.SelectClass.find(
              (v: any) => v.value === element.safetylevel,
            );
            if (safetylevelInfo) {
              Letsafetylevel = safetylevelInfo.label;
            }
          }
          const data = {
            name: Letname,
            lon: element.latitude || '',
            lat: element.longitude || '',
            id: element.id,
            num: index + 1,
            level: Letlevel,
            typecode: element.safetylevel,
            _distance: Letdistance,
            safetylevel: element.HAZARDLEVELCODE
              ? this.levelData[element.HAZARDLEVELCODE * 1 - 1]
              : '- -',
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
        this.getComponent_new().locationCenter('hazardous', item.id);
      }, 500);
      // this.getComponent().openPopup('hazardous', item.id);
      /* this.getComponent().locateEvent({
        id: item.id,
        eventType: item.name,
        message: item.name,
        x: item.lon,
        y: item.lat,
      }); */
    }

    private FnHoverItemEvent(item: any) {
      const type =
        'disaster_judge_resource__' +
        this.$store.state.gisModuleDisasterJudge.disasterJudgeType +
        '__' +
        item.level;
      const strType = type.split('级');
      this.getComponent1().addHover(strType[0], item.id);
    }

    private FnMouserLeave(): void {
      this.getComponent1().clearHover();
    }

    // gis 地图联动替换列表数据 开始
    private FnShowXZD(data: any): any {
      const anterh = null;
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
        this.getComponent().on('EventPointspopup', this.onShowPopup, this);
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
