<template>

</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component({
    name: 'SatelliteCloudPicture',
})
export default class SatelliteCloudPicture extends Vue {

    public getComponent() {
        const factory = this.$ioc.resolve('GISFactory-map');
        const component = factory.commonFactory.getComponent('satilliteCloud');
        return component;
    }
    // 卫星云图绘制
    private satelliteCloudPictureFn() {
        this.getComponent().load();
    }
    private created(): void {
        this.satelliteCloudPictureFn();
    }
    private destroyed(): void {
        this.getComponent().unload();
    }
}
</script>