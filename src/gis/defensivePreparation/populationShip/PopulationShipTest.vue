<!--
 * @Descripttion:  
 * @Date: 2020-05-11 11:20:44
 * @LastEditors: tande
 * @LastEditTime: 2020-05-11 11:57:35
 -->
<template>
	<div>
		<div class="fysj">
			<ul>
				<li v-for="item in zhddList" :key="item.name">
					<button @click="add()">显示</button>
          <button @click="remove()">移除</button>
          <button @click="locate()">定位</button>
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import DistrictComponent from './PopulationShip';
@Component({
  name: 'DisasterJudgeDistrictComponentTest',
  components: {
  },
  mixins: [MapCommon],
})
export default class PopulationShipTest extends Vue {
  private mapId: string = '';
  private commandDispatch: any;
  private zhddList: any = [{ id: 1, name: '', featureType: 'dis' }];
 private mounted() {
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

    const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);
    this.commandDispatch = new DistrictComponent({
        map,
        service: installDisasterJudgeServer.districtServer,
        symbolConfig,
        simpleRenderMgr: GISComponents.simpleRenderMgr,
        popupManager: GISComponents.popupManager,
        featureLocate: GISComponents.featureLocate,
        featureHighlight: GISComponents.featureHighlight,
        GISComponents,
    });
    (window as any).commandDispatch = this.commandDispatch;
    this.commandDispatch.load();
  }

  private add() {
    this.commandDispatch.localDistrict();
  }
  private remove() {
    this.commandDispatch.removeDistrict();
  }
  private locate() {
    this.commandDispatch.locate('莱州市');
  }
}
</script>

<style lang="less" scoped>
.fysj {
	background-color: yellow;
	position: absolute;
	top: 200px;
	left: 30%;
	z-index: 99999;
}
</style>
