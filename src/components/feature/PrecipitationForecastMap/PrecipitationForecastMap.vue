<template>
    <div class="precipitationForecastMap">
        <precipitation-forecast-map-legend></precipitation-forecast-map-legend>
        <time-axis></time-axis>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import PrecipitationForecastMapLegend from './PrecipitationForecastMapLegend.vue';
import TimeAxis from './timeAxis.vue';
@Component({
    name: 'PrecipitationForecastMap',
    components: {
        PrecipitationForecastMapLegend,
        TimeAxis,
    },
})
export default class PrecipitationForecastMap extends Vue {

}
</script>
<style scoped lang="less">
</style>
