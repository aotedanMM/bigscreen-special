<template>
  <div :id="targetId"></div>
</template>
<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import {mapServer} from '../../api/installServer';
import MapCommon from '../../util/MapCommon';
@Component({
    name: 'DemoMap',
    mixins: [MapCommon],
})
export default class DemoMap extends Vue {
    public map: any = '' ;

    @Prop() public targetId: any ;

    private mounted() {
        // 地图配置
        mapServer.getConfig('./json/map.json').then((res: any) => {
            this.initMap(res.data.map);
            this.initBaseLayers(res.data.baseLayers);
            this.addMapListeners();
        });
        // 初始化符号配置
        mapServer.getConfig('./json/symbol.json').then((res: any) => {
            const data = res.data;
            // 注册到全局共享
            this.$ioc.register('symbolConfig', data);
        });
    }

    private beforeDestroy() {
        this.removeMapListeners();
    }

    private initMap(opts: any) {
        this.map = new G.Map(opts);
        this.map.init({
            targetId: this.targetId,
        });
        // 地图加载完成后，注册地图变量，触发地图加载完成事件
        const self: any = this;
        self.registMap(this.map, this.map.options.targetId);
    }

    private initBaseLayers(baseLayers: any) {
        const baseLayer = G.utils.LayerUtil.createBaseLayer(baseLayers[0]);
        this.map.addLayer(baseLayer);
    }

    private addMapListeners() {
        (console as any).log('add listeners');
    }

    private removeMapListeners() {
        (console as any).log('remove listeners');
    }
}
</script>
<style>
#map{
    width: 100%;
    height: 100%;
}
/* ts-gis */
.ol-unselectable .ol-scale-line-inner{
    /* width: 117px; */
    position: fixed;
    bottom: 52px;
    color:#dfdfdf ;
    border: 1px solid #eee;
    border-top: none;
    background: rgba(0,60,136,.5);
    font-size:26px;
    text-align: center;
    margin: 1px;
    will-change: contents, width;
    left: 52px;
    line-height: 1;
    min-width: 110px !important;
}
/*ts-gis*/
.ol-zoom.ol-unselectable.ol-control{
    position: absolute;
    top: 300px;
    right: 20px;
    left: inherit;
}
</style>
