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
            :FnHoverItemEvent="FnHoverItemEvent"
            :definitionWidth="definitionWidth"
            :FnMouserLeave="FnMouserLeave"
            :sourceTypeCodeObj="sourceTypeCodeObj"
    ></AreaList>
</template>
<script lang="ts">
  import {Component, Vue, Prop} from 'vue-property-decorator';
  // import DistrictRightModule from '@/components/feature/gisModule/list/list.district.vue';
  import EventInfoPop from '@/components/feature/gisModule/popUp/eventInfo.vue';
  import AreaList from '@/components/common/render/AreaList.common.vue';
  import MapCommon from '@/util/MapCommon';
  import HoverGIS from '@/views/common/gisModules/common/interact/CommonnteractComponent';
  import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
  import {dataSourcesServer} from '@/api/installServer';
  import {dataSourceConfig} from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterJudge';
  // import Qs from 'qs';
  @Component({
    name: 'DistrictRightDialog',
    mixins: [MapCommon],
    components: {
      //   DistrictRightModule,
      AreaList,
    },
  })
  export default class DistrictRightDialog extends Vue {
    //  private listDataFlag  = false;
    public title: any = '行政区划列表';
    public type: any;
    private filexed = ['num', 'name', 'population'];
    private definitionWidth = {
      num: '15%',
      name: '25%',
      // address: '25%',
      // respper: '25%',
      // phone: '25%',
      // area: '15%',
      // location: '30%',
      population: '30%',
    };
    private IsPagination = true;
    private eventInfo: any = {};
    private eventInfoPop: any = null;
    private listData = [
      {
        num: '暂无数据',
        name: '暂无数据',
        // area: '',
        // location: '',
        population: '',
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
      // {
      //   area: '面积(km²)',
      // },
      // {
      //   location: '距事发地(km)',
      // },
      {
        population: '人口密度(人/km²)',
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
      this.sourceTypeCodeObj = dataSourceConfig('DistrictRightDialog');
      dataSourcesServer.getDataSourceServer({typeCode: this.sourceTypeCodeObj.typeCode}).then((data: any) => {
        const res = data;
        this.sourceTypeCodeObj.sourceData = res.data[0];
        console.log(this.sourceTypeCodeObj, 'this.sourceTypeCodeObj');
      });
    }

    private FnListData() {
      this.messsageBus.off('listSearchObj');
      this.messsageBus.on('listSearchObj', (item: any) => {
        item = JSON.parse(JSON.stringify(item));
        if (item.allData !== undefined) {
          if (item.type) {
            this.type = item.type;
          } else {
            if (item.city === '乡镇') {
              this.type = 'Town';
            } else {
              this.type = 'County';
            }
          }
          this.listData = [];
          const listData = [];
          for (let index = 0; index < item.allData.length; index++) {
            const element = item.allData[index];
            let Letname = '暂无数据';
            // let Letarea = 0;
            let Letlocation = '';
            let LetpopeleNum = 0;
            let Letpopulation = 0;
            // 修改，默认取简称
            if (element.shortName) {
              Letname = element.shortName;
            } else if (element.name !== null || element.name !== '') {
              Letname = element.name;
            }
            // if (element.area !== null || element.area !== '') {
            //   Letarea = element.area;
            // }
            if (element._distance !== null || element._distance !== '') {
              Letlocation = element._distance;
            }
            if (element.population !== null || element.population !== '') {
              LetpopeleNum = element.population;
            }
            if ((element.population !== null || element.population !== '') && (element.area !== null || element.area !== '')) {
              Letpopulation = 10000 * element.population / element.area;
            }
            if (element.area === 0) {
              Letpopulation = 0;
            }
            const data = {
              name: Letname,
              // area: Letarea,
              lon: element.lat,
              lat: element.lon,
              id: element._id,
              num: index + 1,
              location: Letlocation,
              popeleNum: LetpopeleNum,
              population: Letpopulation,
            };
            listData.push(data);
          }
          this.$set(this, 'listData', listData);
        } else {
          this.listData = [];
        }
      });
    }

    // 联动gis方法 开始
    private getComponent() {
      let component = null;
      const factory = this.$ioc.resolve('GISFactory-map');
      if (factory) {
        component = factory.disasterJudgeFactory.getComponent('districtComp');
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
        this.getComponent_new().locationCenter(this.type, item.id);
      }, 500);

      // this.eventInfo = {
      //   id: item.id,
      //   title: item.name,
      //   eventType: item.name,
      //   reportTime: '',
      //   location: '',
      //   longitude: item.lon,
      //   latitude: item.lat,
      // };
      // this.getComponent().openPopup(this.type, item.id);
    }

    private FnHoverItemEvent(item: any) {
      let type = 'district_point_county';
      if (this.type === 'County') {
        type = 'district_point_county';
      } else if (this.type === 'Town') {
        type = 'district_point_town';
      }
      this.getComponent1().addHover(type, item.id);
    }

    private FnMouserLeave(): void {
      this.getComponent1().clearHover();
    }

    // gis 地图联动替换列表数据 开始
    // 排序方法
    private FnShowXZD(arrVal: any): any {
      this.listData = [];
      const listData = [];
      const compare = function(a: any, b: any) {
        return a._distance - b._distance;
      };
      const beforeSorted = arrVal.xzTown;
      const sortedData = beforeSorted.sort(compare);
      for (let index = 0; index < sortedData.length; index++) {
        const element = sortedData[index];
        let Letname = '暂无数据';
        let Letarea = 0;
        let Letlocation = '';
        let LetpopeleNum = 0;
        let Letpopulation = 0;
        if (element.name !== null || element.name !== '') {
          Letname = element.name;
        }
        if (element.area !== null || element.area !== '') {
          Letarea = element.area;
        }
        if (element._distance !== null || element._distance !== '') {
          Letlocation = element._distance;
        }
        if (element.population !== null || element.population !== '') {
          LetpopeleNum = element.population;
        }
        if ((element.population !== null || element.population !== '') && (element.area !== null || element.area !== '')) {
          Letpopulation = 10000 * element.population / element.area;
        }
        const data = {
          name: Letname,
          area: Letarea,
          lon: element.lat,
          lat: element.lon,
          id: element._id,
          num: index + 1,
          location: Letlocation,
          popeleNum: LetpopeleNum,
          population: Letpopulation,
        };
        listData.push(data);
      }
      this.$set(this, 'listData', listData);
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
