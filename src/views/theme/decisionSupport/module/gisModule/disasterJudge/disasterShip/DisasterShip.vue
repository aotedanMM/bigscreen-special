<template>
    <div class="DisasterView">
        <MapDialog
                :viewData="viewData"
                :viewResData="viewResData"
                :moduleType="moduleType"
        >
            <template v-slot:title>船舶分布</template>
            <template v-slot:unit>只</template>
        </MapDialog>
    </div>
</template>
<script lang="ts">
  import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
  import MapDialog from '@/components/feature/gisModule/static/statistic.common.vue';
  import {staticDataRequestServer} from '@/api/installServer';
  import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
  import MapCommon from '@/util/MapCommon';
  import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';

  @Component({
    name: 'DisasterShip',
    components: {
      MapDialog,
    },
    mixins: [MapCommon],
  })
  export default class DisasterShip extends Vue {
    private viewData: any = [];
    private showInit: any = false;
    private viewResData: any = {
      data: {
        total: '',
      },
    };
    private moduleType: any = '_RealShip';

    private getComponent() {
      const factory = this.$ioc.resolve('GISFactory-map');
      const component = factory.disasterJudgeFactory.getComponent(
        'disasterJudgeShip',
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

    private init() {
      const component = this.getComponent();
      // 获取数据
      //      disasterJudgeShip.load(['_RealShip']).then((data: any) => {
      //         console.log(data);
      //         disasterJudgeShip.showResource('_RealShip', ['']);
      //     });
      if (this.$store.state.eventPushStore.eventLocation.EventType && this.showInit) {
        component.load([this.moduleType]).then((data: any) => {
          console.log(data);
          this.viewResData = data[0];
          let i = 0;
          this.viewData = this.viewResData.data.map((item: any) => {
            i++;
            let retIsChecked = false;
            if (i === 1) {
              retIsChecked = true;
              this.messsageBus.emit('listSearchObj', item.list);
            }
            return {
              level: item.level,
              title: item.title,
              quantity: item.count,
              listData: item.list,
              isChecked: retIsChecked,
            };
          });
          console.log(this.viewData);
          // 默认显示第一条点位 模块名 [‘公里数’]
          component.showResource(this.moduleType, [this.viewData[0].level]);
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
        queryParam.point = this.getComponent().getQueryResourcePoint(queryParam.dataA);
        // 添加标点

        installDisasterJudgeServer.hazServer.queryResourceByRanges(queryParam).then((dataObj: any) => {
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
      const component = this.getComponent();
      component.unload();
    }

    private mounted() {
      (this as any).resolveMap('map').then(() => {
        this.init();
      });
      // add popUp start ，弹出层引用
      const component = this.getComponent();
      component.on('popup', (event: any) => {
        const param = {
          that: this,
          popupId: 'popup', // 监听id，必须
          moduleTypeID: 'disasterJudgeShip', // 模块id，必须
        };
        const popUpTemplate = new renderpopUpTemplate();
        popUpTemplate.getParams(param);
        popUpTemplate.onShowPopup(event);
      });
      // add popUp  end
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
