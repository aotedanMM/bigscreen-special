<template>
    <div class="DisasterView DisasterMessenger">
        <MapDialog
                :viewData="viewData"
                :viewResData="viewResData"
                :moduleType="moduleType"
        >
            <template v-slot:title>文化场馆</template>
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
    name: 'CulturalValues',
    components: {
      MapDialog,
    },
    mixins: [MapCommon],
  })
  export default class CulturalValues extends Vue {
    @Prop() public tabList: any;
    private viewData: any = [];
    private viewResData: any = {
      data: {
        total: '',
      },
    };
    private showInit: any = false;
    // gis方法param
    private moduleType: any = 'culturalvenues';

    private getComponent() {
      const factory = this.$ioc.resolve('GISFactory-map');
      const component = factory.disasterJudgeFactory.getComponent(
        'disasterJudgeResource',
      );
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

    // 数据过滤条件 发生更改
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
      const component = this.getComponent_new();
      /**
       * 上来先卸载,防止未成功卸载
       * */
      component.unload();
      if (this.$store.state.eventPushStore.eventLocation.EventType && this.showInit) {
        component.getMultiuleOneNum(this.moduleType).then((dataTemp: any) => {
          const data: any = [];
          for (const item of Object.keys(dataTemp)) {
            dataTemp[item].level = item;
            dataTemp[item].layerName = this.moduleType + '_img';
            dataTemp[item].geom = {coordinates: [dataTemp[item].latitude || '', dataTemp[item].longitude || '']};
            data.push(dataTemp[item]);
          }
          this.viewResData = data;
          let i = 0;
          let newArr: any = [];
          this.viewData = this.viewResData.map((item: any) => {
            i++;
            let retIsChecked = false;
            if (this.$store.state.dataFilterControl.zhypGeoType.key === 'jyqYp') {
              // 判断是否是经验圈
              // if (i === this.$store.state.controlMoudle.exprienceCircle + 1) {
              if (i === data.length) {
                // 添加高亮状态
                retIsChecked = true;
                newArr = item.list;
                component._showPoint(item.list, this.moduleType, '');
                this.messsageBus.emit('listSearchObj', newArr);
              }
            } else if (this.$store.state.dataFilterControl.zhypGeoType.key === 'ldqYp') {
              // 判断是否是烈度圈
              // 添加高亮状态
              if (i === data.length) {
                // 添加高亮状态
                retIsChecked = true;
                newArr = item.list;
                component._showPoint(item.list, this.moduleType, '');
                this.messsageBus.emit('listSearchObj', newArr);
              }
            }
            return {
              levelTitle: populationSetUnit(
                item.level,
                this.$store.state.controlMoudle.mapCircleQueryType,
              ),
              levelUnit: populationSetTitle(this.$store.state.controlMoudle.mapCircleQueryType),
              level: item.level,
              title: item.title,
              quantity: item.count,
              listData: item.list,
              isChecked: retIsChecked,
            };
          });
        });
      } else {
        // 获取数据
        const queryParam: any = {
          districtCode: this.$store.state.dataFilterControl.filter.districtCode,
          typecode: this.moduleType,
        };
        // point,
        // dataA: item.geometry,
        let jsonObj = null;
        if (this.$store.state.dataFilterControl.filter.geometry) {
          jsonObj = JSON.parse(
            this.$store.state.dataFilterControl.filter.geometry,
          );
        }
        let districtCode = null;
        if (this.$store.state.dataFilterControl.filter.districtCode) {
          districtCode = this.$store.state.dataFilterControl.filter.districtCode;
        }
        // 添加标点
        component.getMultiuleOneNum(this.moduleType, jsonObj ? jsonObj : null, districtCode ? districtCode : null).then((dataObj: any) => {
          const tempData = {
            icons: this.moduleType + '_img',
            layerName: this.moduleType,
            list: dataObj,
            count: dataObj.length,
          };
          const data = {data: [tempData], total: tempData.list.length};
          this.getComponent_new()._showPoint(dataObj, this.moduleType, '');
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
                0,
                0,
              ),
              levelUnit: populationSetTitle(0),
              level: 0,
              title: 0,
              quantity: item.count,
              listData: item.list,
              isChecked: retIsChecked,
            };
          });
        });
      }
    }

    private beforeDestroy() {
      const component = this.getComponent_new();
      component.unload();

    }

    //  地图组件
    private getComponent_new() {
      const factory = this.$ioc.resolve('GISFactory-map');
      const component = factory.normalFactory.getComponent('NewResourceComponent_left');
      return component;
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
