<template>
    <div class="map_len_show">
        <h3>图例（毫米）</h3>
        <ul>
            <li class="list_01">无降水</li>
            <li class="list_02">0~1</li>
            <li class="list_03">1~2</li>
            <li class="list_04">2~4</li>
            <li class="list_05">4~6</li>
            <li class="list_06">6~8</li>
            <li class="list_07">8~10</li>
            <li class="list_08">10~20</li>
            <li class="list_09">20~50</li>
            <li class="list_10">>50</li>
        </ul>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component({
    name: 'PrecipitationForecastMapLegend',
})
export default class PrecipitationForecastMapLegend extends Vue {

}
</script>
<style scoped lang="less">
    .map_len_show{
        width: 127px;
        height: 366px;
        position: absolute;
        left: 30px;
        top: 25%;
        z-index: 99999;
        background: #fff;
        border: 2px solid #c3c3c3;
    }

    .map_len_show ul li{
        color: #000;
        width: 100%;
        height: 30px;
        position: relative;
        margin-left: 38px;
    }

    .map_len_show ul .list_01::before{
        content: "";
        width: 30px;
        height: 20px;
        display: inline-block;
        background: #fff;
        border: 1px solid #c3c3c3;
        position: absolute;
        left: -35px;
    }

    .map_len_show .list_02:before{
        content: "";
        width: 30px;
        height: 20px;
        display: inline-block;
        background: #d3fdbc;
        border: 1px solid #c3c3c3;
        position: absolute;
        left: -35px;
    }


    .map_len_show .list_03:before{
        content: "";
        width: 30px;
        height: 20px;
        display: inline-block;
        background: #a5f094;
        border: 1px solid #c3c3c3;
        position: absolute;
        left: -35px;
    }


    .map_len_show .list_04:before{
        content: "";
        width: 30px;
        height: 20px;
        display: inline-block;
        background: #3fa30a;
        border: 1px solid #c3c3c3;
        position: absolute;
        left: -35px;
    }


    .map_len_show .list_05:before{
        content: "";
        width: 30px;
        height: 20px;
        display: inline-block;
        background: #57baff;
        border: 1px solid #c3c3c3;
        position: absolute;
        left: -35px;
    }


    .map_len_show .list_06:before{
        content: "";
        width: 30px;
        height: 20px;
        display: inline-block;
        background: #0101fa;
        border: 1px solid #c3c3c3;
        position: absolute;
        left: -35px;
    }


    .map_len_show .list_07:before{
        content: "";
        width: 30px;
        height: 20px;
        display: inline-block;
        background: #04704e;
        border: 1px solid #c3c3c3;
        position: absolute;
        left: -35px;
    }


    .map_len_show .list_08:before{
        content: "";
        width: 30px;
        height: 20px;
        display: inline-block;
        background: #fc03f3;
        border: 1px solid #c3c3c3;
        position: absolute;
        left: -35px;
    }


    .map_len_show .list_09:before{
        content: "";
        width: 30px;
        height: 20px;
        display: inline-block;
        background: #de4d08;
        border: 1px solid #c3c3c3;
        position: absolute;
        left: -35px;
    }


    .map_len_show .list_10:before{
        content: "";
        width: 30px;
        height: 20px;
        display: inline-block;
        background: #6c0501;
        border: 1px solid #c3c3c3;
        position: absolute;
        left: -35px;
    }
</style>