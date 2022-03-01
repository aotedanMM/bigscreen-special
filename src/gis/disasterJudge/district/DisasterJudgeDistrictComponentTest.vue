<template>
  <div>
    <div class="btn">
      乡镇：<button @click="toggleLayer('Town',true)">选中</button>
            <button @click="toggleLayer('Town',false)">取消</button>
      区县：<button @click="toggleLayer('County',true)">选中</button>
            <button @click="toggleLayer('County',false)">取消</button>
      切换半径：<button @click="changeRadius([30,50])">[30,50]</button>
    </div>
    
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import DisasterJudgeDistrictComponent from './DisasterJudgeDistrictComponent';
import {disasterJudgeServer, districtServer } from '@/api/installServer';
import EarthQuakeEventInfo from '../../event/EarthQuakeEventInfo';
import disasterJudgeComps from '../../disasterJudge/index';

@Component({
  name: 'DisasterJudgeDistrictComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class IndexTest extends Vue {

  private mapId: string = '';

  private mounted() {
    console.log('mounted');
    // 地图容器id
    this.mapId = 'map';
    (this as any).resolveMap(this.mapId).then((data: any) => {
      this.init(data.map);
    });
  }

  //  地图加载完成后，初始化
  private init(map: any) {
    // 地图配置
    const mapConfig = this.$ioc.resolve(`mapConfig-${this.mapId}`);
    // 符号配置
    const symbolConfig = this.$ioc.resolve(`symbolConfig-${this.mapId}`);
    // 通用的地图组件实例
    //
    const eventInfo = new EarthQuakeEventInfo([], []);
    const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);
    this.disasterJudgeDistrictComponent = new disasterJudgeComps.DisasterJudgeDistrictComponent({
        map,
        service: districtServer, // disasterJudgeServer,
        eventInfo,
        symbolConfig,
        simpleRenderMgr: GISComponents.simpleRenderMgr,
        popupManager: GISComponents.popupManager,
        featureLocate: GISComponents.featureLocate,
        featureHighlight: GISComponents.featureHighlight,
        GISComponents,
    });
    // (window as any).disasterJudgeDistrictComponent = disasterJudgeDistrictComponent;
    // 点击按钮时调用
    console.log('load');
    // 初始化时,默认显示所有,当传入false时,所有都不加载
    this.disasterJudgeDistrictComponent.load();
    // 加载乡镇
    // this.disasterJudgeDistrictComponent.toggleLayer('Town', true);
    // 加载区县
    // this.disasterJudgeDistrictComponent.toggleLayer('County', true);

    // 显示乡镇
    // disasterJudgeDistrictComponent.toggleTownLayer(true);
    // 显示区县
    // disasterJudgeDistrictComponent.toggleCountyLayer(true);
    // 卸载
    // disasterJudgeDistrictComponent.unload();
    // const component = new DisasterJudgeDistrictComponent({
    //     map,
    // });
  }
  // 切换不同业务显隐
  private toggleLayer(type: any, flag: boolean) {
    this.disasterJudgeDistrictComponent.toggleLayer(type, flag);
  }
  // 更改半径
  private changeRadius(radius: any) {
    this.disasterJudgeDistrictComponent.setRadius(radius);
  }
}
</script>
<style lang="less" scoped>
  .btn{
    position: absolute;
    top: 200px;
    left: 50%;
    // background-color: #333
  }
</style>