<template>

    <div>
        <div style="position:absolute;top:100px;left:150px;z-index:1000;">
            <button @click="switchMap3d">切换到三维</button>
            <button @click="addTerrianLayer('terrainlayer1')">添加地形图层1</button>
            <button @click="removeTerrainLayer('terrainlayer1')">删除地形图层1</button>
            <button @click="addTerrianLayer('terrainlayer2')">添加地形图层2</button>
            <button @click="removeTerrainLayer('terrainlayer2')">删除地形图层2</button>
            <button @click="removeAllTerrainLayers">删除所有地形图层</button>
            <button @click="switchMap2d">切换到二维</button>
        </div>
    </div>

</template>
<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import EarthQuakeEventInfo from '../../event/EarthQuakeEventInfo';
import Map3D from './Map3D';
@Component({
    name: 'Map3DTest',
    components: {},
    mixins: [MapCommon],
})
export default class IndexTest extends Vue {
    public getMap: any = null;
    private mapId: string = '';
    private map3dId: string = '';
    private component: any = null;
    private mounted() {
        // 地图容器id
        this.mapId = 'map';
        (this as any).resolveMap(this.mapId).then((data: any) => {
            this.getMap = () => {
              return data.map;
            };
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
        const GISComponents = this.$ioc.resolve(`GISComponents-${this.mapId}`);
        const factory = this.$ioc.resolve('GISFactory-map');
        const component = factory.commonFactory.getComponent('map3d');
        this.component = component;
        //
        component.load();
        //
    }

    private addTerrianLayer(layername: string) {
        this.component.addTerrianLayer(layername, true);
    }

    private removeTerrainLayer(layerName: string) {
        this.component.removeTerrainLayer(layerName);
    }

    private removeAllTerrainLayers() {
        this.component.removeAllTerrainLayers();
    }


    private switchMap3d() {
        jQuery('#map3d').css('visibility', 'visible');
        jQuery('#map').css('visibility', 'hidden');
        this.component.syncronizeViewFrom2D();
    }

    private switchMap2d() {
        jQuery('#map3d').css('visibility', 'hidden');
        jQuery('#map').css('visibility', 'visible');
        this.component.syncronizeViewFrom3D();
    }
}
</script>
<style lang="less" scoped>
</style>
