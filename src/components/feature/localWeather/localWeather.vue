<template>
    <div class="localWeather">
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import WeatherTabFrame from '@/views/common/weatherDisasterArea/WeatherTabFrame.vue';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
@Component({
    name: 'LocalWeather',
    mixins: [MapCommon],
    components: {
        WeatherTabFrame,
    },
})
export default class LocalWeather extends Vue {
    private getComponent() {
        const factory = this.$ioc.resolve('GISFactory-map');
        const component: any = factory.commonFactory.getComponent('Weather');
        return component;
    }
    private init() {
        this.getComponent().load();
    }
    private popup() {
        const component = this.getComponent();
        component.on('popup', (event: any) => {
            const param = {
                that: this,
                popupId: 'popup', // 监听id，必须
                moduleTypeID: 'Weather', // 模块id，必须
            };
            const popUpTemplate = new renderpopUpTemplate();
            popUpTemplate.getParams(param);
            popUpTemplate.onShowPopup(event);
        });
    }
    private mounted() {
        (this as any).resolveMap('map').then(() => {
            this.popup();
        });

    }
    private destroyed() {
        this.getComponent().unload();
    }

    private created() {
        this.init();
    }
}
</script>
<style scoped lang="less">
    .localWeather{
        z-index: 999;
        font-size: 30px;
        color: #ffffff;
        position: absolute;
        top: 200px;
        right: 200px;
    }
</style>