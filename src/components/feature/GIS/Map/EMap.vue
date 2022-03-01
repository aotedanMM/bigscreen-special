<template>
	<div :id="targetId"  class="emap">
	</div>
</template>
<script lang="ts">
    import { Vue, Component, Prop, Watch} from 'vue-property-decorator';
    import MapCommon from '../../../../util/MapCommon';
    @Component({
        mixins: [MapCommon],
    })
    export default class EMap extends Vue {
            public  map: any;
            @Prop() public targetId: any;
            // 地图配置
            @Prop() public config: any;

            public created() {
                this.map = new window.G.Map( this.config.map);
            }
            public mounted() {
                this.initMap();
            }
            public initMap() {
                this.map.init({
                    targetId: this.targetId,
                });
                const baseLayer = window.G.utils.LayerUtil.createBaseLayer(this.config.baseLayer);
                this.map.addLayer(baseLayer);
                // 地图加载完成后，注册地图变量，触发地图加载完成事件
                const self: any = this;
                self.registMap(this.getMap(), this.targetId);
            }
            public getMap() {
                return this.map;
            }
    }
</script>
<style lang="less">
 .emap{
		width: 100%;
		height: 500px;
		margin: 0px;
	}
</style>
