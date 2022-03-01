<template>
    <div class="DisasterView DisasterMessenger">
        <MapDialog
                :viewData="viewData"
                :viewResData="viewResData"
                :moduleType="moduleType"
        >
            <template v-slot:title>大型文化体育场所</template>
            <template v-slot:unit>家</template>
        </MapDialog>
    </div>
</template>
<script lang="ts">
  import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
  import MapDialog from '@/components/feature/gisModule/static/statistic.common.vue';
  import MapCommon from '@/util/MapCommon';
  import {
    populationSetUnit,
    populationSetTitle,
  } from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterJudge';
  import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';

  @Component({
    name: 'LargeCulturalAndSports',
    components: {
      MapDialog,
    },
    mixins: [MapCommon],
  })
  export default class LargeCulturalAndSports extends Vue {
    @Prop() public tabList: any;
    private viewData: any = [];
    private showInit: any = false;
    private viewResData: any = {
      data: {
        total: '',
      },
    };
    // gis方法param
    private moduleType: any = 'Gymnasium';

    private getComponent() {
      const factory = this.$ioc.resolve('GISFactory-map');
      const component = factory.disasterJudgeFactory.getComponent('disasterJudgeResource');
      return component;
    }

    // 监听烈度圈或经验圈修改时重新请求数据
    // @Watch('$store.state.controlMoudle.mapCircleQueryType')
    @Watch('$store.state.eventPushStore.eventLocation.geometry')
    private watchGetData() {
      this.viewData.forEach((i: any, ind: any, data: any) => {
        this.getComponent().hideResource(this.moduleType, [i.level]);
      });
      (this as any).resolveMap('map').then(() => {
        this.init();
      });
    }

    // 数据 过滤条件发生更改
    @Watch('$store.state.dataFilterControl.filter')
    private setGeometryFn(newVal: any, oldVal: any) {
      if (this.$store.state.dataFilterControl.filter.geometry && this.$store.state.dataFilterControl.filter.districtCode) {
        this.showInit = false;
      } else if (this.$store.state.dataFilterControl.filter.districtCode === '370600' && this.$store.state.dataFilterControl.filter.geometry) {
        this.showInit = false;
      } else if (this.$store.state.dataFilterControl.filter.geometry && this.$store.state.dataFilterControl.filter.districtCode === '370600') {
        this.showInit = true;
      } else if (!this.$store.state.dataFilterControl.filter.geometry && this.$store.state.dataFilterControl.filter.districtCode === '370600') {
        this.showInit = false;
      } else if (this.$store.state.dataFilterControl.filter.geometry && this.$store.state.dataFilterControl.filter.districtCode !== '') {
        this.showInit = true;
      } else if (this.$store.state.dataFilterControl.filter.geometry && this.$store.state.dataFilterControl.filter.districtCode === '') {
        if (this.$store.state.mapTools.nearbyQueryVisible || this.$store.state.dataFilterControl.zhypGeoType.key === 'searchYp') {
          this.showInit = false;
        } else {
          this.showInit = true;
        }
      } else {
        this.showInit = true;
      }
      (this as any).resolveMap('map').then(() => {
        this.init();
      });
    }

    private mounted() {
      (this as any).resolveMap('map').then(() => {
        this.init();
      });
    }

    private created() {
      if (this.$store.state.dataFilterControl.filter.geometry) { // 看空间字段是否有值
        if (this.$store.state.mapTools.nearbyQueryVisible || this.$store.state.dataFilterControl.zhypGeoType.key === 'searchYp') { // 确认周边查询是否打开初始化进来的时候
          this.showInit = false;
        } else {
          this.showInit = true;
        }
      }
      this.$store.commit(
        'gisModuleDisasterJudge/setDisasterJudgeType',
        this.moduleType,
      );

    }

    private init() {
      const component = this.getComponent();
      /**
       * 上来先卸载,防止未成功卸载
       * */
      component.unload();
      if (this.$store.state.eventPushStore.eventLocation.EventType && this.showInit) {
        // 获取数据
        component.load([this.moduleType]).then((data: any) => {
          this.viewResData = data[0];
          let i = 0;
          let newArr: any = [];
          this.viewData = this.viewResData.data.map((item: any) => {
            i++;
            let retIsChecked = false;
            if (this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp') {
              // 判断是否是经验圈
              // if (i === this.$store.state.controlMoudle.exprienceCircle + 1) {
              if (i === data[0].data.length) {
                // 添加高亮状态
                retIsChecked = true;
                newArr = item.list;
                component.showResource(this.moduleType, [item.level]);
              }
            } else if (this.$store.state.dataFilterControl.zhypGeoType.key === 'ldqYp') {
              // 判断是否是烈度圈
              // 添加高亮状态
              if (i === data[0].data.length) {
                // 添加高亮状态
                retIsChecked = true;
                newArr = item.list;
                component.showResource(this.moduleType, [item.level]);
              }
            }
            this.messsageBus.emit('listSearchObj', newArr);
            return {
              levelTitle: populationSetUnit(
                item.level,
                this.$store.state.controlMoudle.mapCircleQueryType,
              ),
              levelUnit: populationSetTitle(
                this.$store.state.controlMoudle.mapCircleQueryType,
              ),
              level: item.level,
              title: item.title,
              quantity: item.count,
              listData: item.list,
              isChecked: retIsChecked,
            };
          });
        });
      } else {
        const queryParam: any = {
          districtCode: this.$store.state.dataFilterControl.filter.districtCode,
          typecode: this.moduleType,
        };
        // point,
        // dataA: item.geometry,
        if (this.$store.state.dataFilterControl.filter.geometry) {
          const jsonObj = JSON.parse(
            this.$store.state.dataFilterControl.filter.geometry,
          );
          queryParam.dataA = jsonObj;
        }
        queryParam.point = this.getComponent().getQueryResourcePoint(
          queryParam.dataA,
        );
        // 添加标点

        installDisasterJudgeServer.hazServer
          .queryResourceByRanges(queryParam)
          .then((dataObj: any) => {
            const data = {data: [dataObj], total: dataObj.list.length};
            this.getComponent().addResource(dataObj);
            this.viewResData = data;
            let i = 0;
            let newArr: any = [];
            this.viewData = this.viewResData.data.map((item: any) => {
              i++;
              const retIsChecked = false;
              newArr = item.list;
              this.messsageBus.emit('listSearchObj', newArr);
              return {
                levelTitle: populationSetUnit(
                  item.level,
                  this.$store.state.controlMoudle.mapCircleQueryType,
                ),
                levelUnit: populationSetTitle(
                  this.$store.state.controlMoudle.mapCircleQueryType,
                ),
                level: item.level,
                title: item.title,
                quantity: item.count,
                listData: item.list,
                isChecked: retIsChecked,
              };
            });
          });
      }
    }

    private beforeDestroy() {
      const component = this.getComponent();
      component.unload();

    }
  }
</script>
<style lang="less" scoped>
    @import url('../../../../../../../assets/css/decisionSupport/GisPanel.less');

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
</style>
