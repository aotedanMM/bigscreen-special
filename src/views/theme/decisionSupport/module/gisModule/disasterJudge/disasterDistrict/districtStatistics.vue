<template>
    <div class="DistrictLeftDialog DisasterView">
        <DistrictLeftModule :cityData="cityData"></DistrictLeftModule>
    </div>
</template>
<script lang="ts">
  import {Component, Vue, Prop} from 'vue-property-decorator';
  import DistrictLeftModule from '@/components/feature/gisModule/static/statistic.district.vue';
  import {districtServer} from '@/api/installServer';
  import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
  // 地图组件
  import MapCommon from '@/util/MapCommon';

  @Component({
    name: 'DistrictLeftDialog',
    mixins: [MapCommon], // GIS 将地图组件混入当前组件
    components: {
      DistrictLeftModule,
    },
  })
  export default class DistrictLeftDialog extends Vue {
    private cityData: any = [
      {
        distance: '20',
        distanceUnit: 'km',
        city: '乡镇',
        number: '请求中',
        allData: [],
        isChecked: false,
        type: 'Town',
        unit: '个',
      },
      {
        distance: '50',
        distanceUnit: 'km',
        city: '区县',
        number: '请求中',
        allData: [],
        isChecked: true,
        type: 'County',
        unit: '个',
      },
    ];

    private created() {
      // 我也不知道这是啥接口
      // districtServer
      //   .getTownListByCounty({ code: 110014 })
      //   .then((res: any) => {
      //     return res;
      //   })
      //   .catch((err) => {
      //     return err;
      //   });
    }

    private getComponent() {
      const factory = this.$ioc.resolve('GISFactory-map');
      const component = factory.disasterJudgeFactory.getComponent('districtComp');
      return component;
    }

    // 通过gis方法获取数据
    private onShowDisasterDist(event: any) {
      this.cityData[0].number = event.town.length;
      this.cityData[0].allData = event.town;
      this.cityData[1].number = event.county.length;
      this.cityData[1].allData = event.county;
      this.messsageBus.emit('listSearchObj', this.cityData[1]);
    }

    // 加载
    private mounted() {
      (this as any).resolveMap.call(this, 'map').then(() => {
        this.getComponent().off('disasterDist');
        this.getComponent().on('disasterDist', this.onShowDisasterDist, this);
        this.getComponent().load();
      });
    }

    // 离开页面清空地图点位
    private beforeDestroy() {
      const component = this.getComponent();
      component.unload();
      this.getComponent().off('disasterDist');
      // this.getComponent().off('Pointspopup');
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

    .DistrictLeftDialog {
        /* height: 507px;*/
        width: 360px;
    }
</style>
