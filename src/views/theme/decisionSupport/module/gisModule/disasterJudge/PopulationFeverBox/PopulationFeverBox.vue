<template>
    <div class="PopulationFeverBox DisasterView">
        <PopulationFever
                :viewResData="viewResData"
                :viewData="viewData"
                :moduleType="moduleType"
                :totalData="totalData"
                :title="title"
                :sourceObj="sourceObj"
        ></PopulationFever>
    </div>
</template>
<script lang="ts">
  import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
  import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
  import PopulationFever from '@/components/feature/gisModule/static/statistic.populationFever.vue';
  import MapCommon from '@/util/MapCommon';
  import {
    setUnit,
    populationSetUnit,
    populationSetTitle,
  } from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterJudge';

  @Component({
    name: 'PopulationFeverBox',
    components: {
      PopulationFever,
    },
    mixins: [MapCommon],
  })
  export default class PopulationFeverBox extends Vue {
    @Prop() public tabList: any;
    @Prop() public sourceObj: any;
    private title: any = '';
    private viewData: any = [];
    private totalData: any = [];
    private viewResData: any = {
      data: {
        total: '',
      },
    };
    private levelArrNew: any = [];
    private peopleTotal: number = 0;
    private countyTotal: number = 0;
    private townTotal: number = 0;
    private cunTotal: number = 0;
    private eventTimes: any = this.$store.state.eventPushStore.eventLocation
      .EventTimes;
    private moduleType: any = 'PopulationFever'; // 监听烈度圈或经验圈修改时重新请求数据

    // 数据过滤条件发生更改
    @Watch('$store.state.dataFilterControl.filter')
    private watchGetData() {
      this.newInit();
    }

    private created() {
      this.title = this.sourceObj.title || '';
    }

    private newInit() {
      this.destroyDistricts();
      const self = this;
      // 制作参数
      const param: any = {
        // point: [116.35, 39.87],
      };
      const eventPushStore = this.$store.state.eventPushStore.eventLocation;
      if (eventPushStore.EventLon && eventPushStore.EventLat) {
        param.point = [eventPushStore.EventLon, eventPushStore.EventLat];
      }
      if (this.$store.state.dataFilterControl.filter.geometry) {
        const jsonObj = JSON.parse(
          this.$store.state.dataFilterControl.filter.geometry,
        );
        param.geometry = jsonObj;
      }

      // 制作promise all所用到的数组
      // 人口密度，要查询面积，之后再根据返回结果进行计算
      const promiseKey = this.sourceObj.key + 'Promise';
      const promiseObj: any = {};
      // 区县只查询区县，乡镇只查询乡镇、村庄只查询村庄
      switch (promiseKey) {
        // 区县统计
        case 'countyCountPromise':
          const qxParam = {
            ...param,
            pac: this.$store.state.dataFilterControl.filter.districtCode, // 区县、乡镇、村庄用
            returnWKT: true,
            returnXiangNum: true,
          };
          promiseObj.promiseKey = installDisasterJudgeServer.quickJudgeServer
            .getCountiesInfo(JSON.parse(JSON.stringify(qxParam)));
          break;
        // 乡镇统计
        case 'townCountPromise':
          const xzParam = {
            ...param,
            pac: this.$store.state.dataFilterControl.filter.districtCode, // 区县、乡镇、村庄用
            returnWKT: true,
          };
          promiseObj.promiseKey = installDisasterJudgeServer.quickJudgeServer
            .getTownsInfo(JSON.parse(JSON.stringify(xzParam)));
          break;
        // 村庄统计
        case 'cunCountPromise':
          const czParam = {
            ...param,
            pac: this.$store.state.dataFilterControl.filter.districtCode, // 区县、乡镇、村庄用
          };
          promiseObj.promiseKey = installDisasterJudgeServer.quickJudgeServer
            .getCunInfo(JSON.parse(JSON.stringify(czParam)));
          break;
      }
      const rkParam = {
        pac: this.$store.state.dataFilterControl.filter.districtCode || '370600', // 人口用
        geometry: this.$store.state.dataFilterControl.filter.geometry, // 人口用
      };
      const rkPromise = installDisasterJudgeServer.quickJudgeServer[promiseKey + 'Total']
      (JSON.parse(JSON.stringify(rkParam)));
      const requestKeyArr = [promiseObj.promiseKey, rkPromise];
      Promise.all(requestKeyArr).then((values: any) => {
        // 为了还可以使用原来的其他的代码，这里把数据拼接成原来的那种数据格式
        const data = [
          {
            area: 0,
            range: '0',
            population: values[1].xianTotal || values[1].xiangTotal || values[1].cunTotal || 0, // 总人口数
            county: {
              data: [],
              total: 0,
            },
            town: {
              data: [],
              total: 0,
            },
            cun: {
              data: [],
              total: 0,
            },
          },
        ];
        let mapNeedkey = ''; // 地图需要知道从数据的cun town contry中哪一个拿数据
        switch (this.sourceObj.key) {
          // 区县统计
          case 'countyCount':
            data[0].county.data = values[0];
            data[0].county.total = values[0].length;
            mapNeedkey = 'county';
            break;
          // 乡镇统计
          case 'townCount':
            data[0].town.data = values[0];
            data[0].town.total = values[0].length;
            mapNeedkey = 'town';
            break;
          // 村庄统计
          case 'cunCount':
            data[0].cun.data = values[0];
            data[0].cun.total = values[0].length;
            mapNeedkey = 'cun';
            break;
        }
        this.viewResData = data;
        let newArr: any = [];
        const checkedObj: any = {};
        this.peopleTotal = data[0].population / 10000;
        this.countyTotal = data[0].county.total;
        this.townTotal = data[0].town.total;
        this.cunTotal = data[0].cun.total;
        this.totalData = {
          countyTotal: this.countyTotal,
          townTotal: this.townTotal,
          peopleTotal: this.peopleTotal.toFixed(2),
          cunTotal: this.cunTotal,
        };
        this.viewData = this.viewResData.map((item: any) => {
          let retIsChecked = false;
          // 判断是否是经验圈 | 面处置
          // 添加高亮状态
          retIsChecked = true;
          newArr = item.town.data;
          this.levelArrNew.push(item.range);
          checkedObj[item.range] = {
            town: item.town.data,
            county: item.county.data,
            cun: item.cun.data,
          };
          this.addDistrictsNew(item[mapNeedkey].data);
          this.levelArrNew = [];
          this.messsageBus.emit('listSearchObj', checkedObj);
          return {
            Township: item.town.total,
            area: item.area,
            county: item.county.total,
            intensity: item.range,
            intensityNum: populationSetUnit(
              item.range,
              this.$store.state.controlMoudle.mapCircleQueryType,
            ),
            intensityUnit: populationSetTitle(
              this.$store.state.controlMoudle.mapCircleQueryType,
            ),
            population: (item.population / 10000).toFixed(2),
            listData: item.town.data,
            listCountyData: item.county.data,
            isChecked: retIsChecked,
          };
        });
      });
    }

    // 叠加行政区划
    private addDistrictsNew(oriResData: any) {
      // 行政区划组件
      if (this.sourceObj.key === 'cunCount') {
        this.getComponent()._showDistrictPointsCun(oriResData, this.sourceObj.key);
      } else {
        this.getComponent().load(oriResData, this.sourceObj.key); // 区县countyCount 乡镇townCount 村庄cunCount
      }
    }

    private mounted() {
      (this as any).resolveMap('map').then(() => {
        this.newInit();
      });
    }

    private getComponent() {
      const factory = this.$ioc.resolve('GISFactory-map');
      const districtComp = factory.disasterJudgeFactory.getComponent(
        'districtCompYT',
      );
      return districtComp;
    }

    private destroyDistricts() {
      this.getComponent().unload();
    }

    private beforeDestroy() {
      this.destroyDistricts();
    }
  }
</script>
<style lang="less" space>
    @import url('../../../../../../../assets/css/decisionSupport/GisPanel.less');

    .PopulationFeverBox {
        width: 620px;
    }
</style>
