<template>
    <!-- <div id="DistrictRightDialog"> -->
    <!-- <DistrictRightModule :addressData="searchResult" @updateAddrData="updateAddrData"></DistrictRightModule> -->
    <!-- <district-right-module :setting = setting ></district-right-module> -->
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
    ></AreaList>
    <!-- </div> -->
</template>
<script lang="ts">
  import {Component, Vue, Prop} from 'vue-property-decorator';
  // import DistrictRightModule from '@/components/feature/gisModule/list/list.district.vue';
  import HoverGIS from '@/views/common/gisModules/common/interact/CommonnteractComponent';
  import EventInfoPop from '@/components/feature/gisModule/popUp/eventInfo.vue';
  import AreaList from '@/components/common/render/AreaList.common.vue';
  import MapCommon from '@/util/MapCommon';

  @Component({
    name: 'DisasterShipList',
    mixins: [MapCommon],
    components: {
      //   DistrictRightModule,
      AreaList,
    },
  })
  export default class DisasterShipList extends Vue {
    //  private listDataFlag  = false;
    public title: any = '船舶信息列表';
    private filexed = ['num', 'name', 'level', '_distance'];
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

    private onTableHover() {
      return true;
    }

    private onTableClick() {
      return true;
    }

    private FnListData() {
      this.messsageBus.on('listSearchObj', (item: any) => {
        this.listData = [];
        const listData = [];
        for (const iterator of item.allData) {
          const data = {
            num: iterator.index,
            name: iterator.tag.name,
            area: iterator.area,
            location: iterator._distance,
            popeleNum: iterator.population,
            lon: iterator.lon,
            lat: iterator.lat,
            id: iterator._id,
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
          'disasterJudgeShip',
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
      this.getComponent().openPopup('_RealShip', item.id);
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
    }

    private mounted() {
      (this as any).resolveMap.call(this, 'map').then(() => {
        // this.getComponent().on('EventPointspopup', this.onShowPopup, this);
        this.getComponent().on('disasterXZDist', this.FnShowXZD, this); // 替换 列表数据 的监听
      });
    }
  }
</script>
<style lang="less" scoped>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    // #DistrictRightDialog{
    //     position: absolute;
    //     top: -16px;
    //     left: 20px;
    //     z-index: 9999;  
    // }
</style>
