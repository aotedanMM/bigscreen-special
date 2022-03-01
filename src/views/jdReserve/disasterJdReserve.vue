<template>
  <div class="DisasterView">
    <MapDialog
        :viewData="viewData"
        :viewResData="viewResData"
        :moduleType="moduleType"
    >
      <template v-slot:title>物资储备分布</template>
      <template v-slot:unit>家</template>
    </MapDialog>
  </div>
</template>
<script lang="ts">
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
  import MapDialog from '@/components/feature/gisModule/static/statistic.common.vue';
  import MapCommon from '@/util/MapCommon';
  import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
  import { Draggable } from 'draggable-vue-directive';
  import { populationSetUnit, populationSetTitle } from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterJudge';
  @Component({
    name: 'DisasterJdReserve',
    components: {
      MapDialog,
    },
    mixins: [MapCommon],
    directives: {
      Draggable,
    },
  })
  export default class DisasterJdReserve extends Vue {
    private viewData: any = [];
    private viewResData: any = {
      data: {
        total: '',
      },
    };
    // gis方法param
    private moduleType: any = 'repository';
    // 拖拽
    private draggableValue: any = {
      onPositionChange: this.onPosChanged,
    };
    private onPosChanged(positionDiff: any, absolutePosition: any, event: any) {
      if (event.target.closest('[draggable-state]')) {
        event.target.closest('[draggable-state]').style.position = 'absolute';
      }
    }
    private getComponent() {
      const factory = this.$ioc.resolve('GISFactory-map');
      const component = factory.disasterJudgeFactory.getComponent(
        'disasterJudgeResource',
      );
      return component;
    }
    // 监听烈度圈或经验圈修改时重新请求数据
    @Watch('$store.state.controlMoudle.mapCircleQueryType')
    private watchGetData() {
      this.viewData.forEach((i: any, ind: any, data: any) => {
        this.getComponent().hideResource(this.moduleType, [i.level]);
      });
      (this as any).resolveMap('map').then(() => {
        this.init();
      });
    }
    private mounted() {
      (this as any).resolveMap('map').then(() => {
        this.init();
      });
      // this.messsageBus.off('ranges-refresh');
      this.messsageBus.on('ranges-refresh', (data: any) => {
        this.watchGetData();
      }, this);
    }
    private created() {
      this.getComponent().off('popup');
      this.$store.commit(
        'gisModuleDisasterJudge/setDisasterJudgeType',
        this.moduleType,
      );
    }
    private init() {
      const component = this.getComponent();
      // 获取数据
      component.load([this.moduleType]).then((data: any) => {
        component.on('popup', (event: any) => {
          // add eventLocation start
          const eventLocation = [
            this.$store.state.eventPushStore.eventLocation.EventLon,
            this.$store.state.eventPushStore.eventLocation.EventLat,
          ];
          // add eventLocation end
          const param = {
            that: this,
            eventLocation, // 添加事故点定位经纬度
            popupId: 'popup', // 监听id，必须
            moduleTypeID: 'disasterJudgeResource', // 模块id，必须
          };
          if (event.data.REPERTORYTYPECODE.REPERTORYTYPECODE / 1 === 3) {
            event.type = 'jdRepository';
          }
          const popUpTemplate = new renderpopUpTemplate();
          popUpTemplate.getParams(param);
          popUpTemplate.onShowPopup(event);
        });
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
            levelUnit: populationSetTitle(this.$store.state.controlMoudle.mapCircleQueryType),
            level: item.level,
            title: item.title,
            quantity: item.count,
            listData: item.list,
            isChecked: retIsChecked,
          };
        });
      });
    }
    private beforeDestroy() {
      const component = this.getComponent();
      component.unload();
      component.off('popup');
      this.messsageBus.off('ranges-refresh');
    }
  }
</script>
<style lang="less" scoped>
  @import url('../../assets/css/decisionSupport/GisPanel.less');
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
</style>
