<template>
  <div class="mapHistoricalEarthquake"  v-show="isShowcountweirGateWater">
      <div class="mapHistoricalEarthquake_header">
          <div class="mapHistoricalEarthquake_title">
              堰闸监测站
          </div>
          <div class="close_mapHistoricalEarthquake" @click="closeMapHistoricalEarthquake"></div>
      </div>
      <div class="mapHistoricalEarthquake_contont">
          <el-scrollbar>
              <div class="mapHistoricalEarthquake_contont_list">
                <p class="mapHistoricalEarthquake_contont_list_title">监测站点：</p>
                <p class="list_title_contont">{{countweirGateWaterlist.name}}</p>
            </div>
            <div class="mapHistoricalEarthquake_contont_list">
                <p class="mapHistoricalEarthquake_contont_list_title">测量时刻：</p>
                <p class="list_title_contont">{{countweirGateWaterlist.list['tm']}}</p>
            </div>
            <div class="mapHistoricalEarthquake_contont_list">
                <p class="mapHistoricalEarthquake_contont_list_title">闸上水位：</p>
                <p class="list_title_contont">{{countweirGateWaterlist.list['upz']}}</p>
            </div>
             <div class="mapHistoricalEarthquake_contont_list">
                <p class="mapHistoricalEarthquake_contont_list_title">闸下水位：</p>
                <p class="list_title_contont">{{countweirGateWaterlist.list['dwz']}}</p>
            </div>
             <div class="mapHistoricalEarthquake_contont_list">
                <p class="mapHistoricalEarthquake_contont_list_title">总过闸流量：</p>
                <p class="list_title_contont">{{countweirGateWaterlist.list['tgtq']}}</p>
            </div>
             <div class="mapHistoricalEarthquake_contont_list">
                <p class="mapHistoricalEarthquake_contont_list_title">闸上水势：</p>
                <p class="list_title_contont">{{countweirGateWaterlist.list['supwptn']}}</p>
            </div>
             <div class="mapHistoricalEarthquake_contont_list">
                <p class="mapHistoricalEarthquake_contont_list_title">闸下水势：</p>
                <p class="list_title_contont">{{countweirGateWaterlist.list['sdwwptn']}}</p>
            </div>
          </el-scrollbar>
      </div>
      <div class="mapHistoricalEarthquake_footer"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { realtimeTeam } from '@/api/installServer';
import moment from 'moment';
import { rescueTeamServer } from '@/api/installServer';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import popDataDeal from './dataDeal/popDataDeal';
import MapCommon from '@/util/MapCommon';

@Component({
  name: 'countweirGateWater',
  mixins: [ popDataDeal, MapCommon ],

})
export default class CountweirGateWater extends Vue {
    private countweirGateWaterlist: any = '';
    private isShowcountweirGateWater: boolean = false;

    // 关闭窗口
    private closeMapHistoricalEarthquake() {
        const self = this;
        self.close();
    }

    private mounted() {
        const self = this;
        self.countweirGateWaterlist = self.data;
        self.isShowcountweirGateWater = true;
    }
}
</script>
<style lang="less" scoped>
@mapHistoricalEarthquake: '../../../../assets/img/mapHistoricalEarthquake';
.mapHistoricalEarthquake{
    width:638px;
    height: 400px;
    // background: url("@{mapHistoricalEarthquake}/mapBg.png") no-repeat;
    background-size: 100% 100%;
    .mapHistoricalEarthquake_header{
        width: 100%;
        height: 62px;
        position: relative;
        background:url("@{mapHistoricalEarthquake}/headerBg.png") no-repeat;
        background-size: 100% 100%;
        .mapHistoricalEarthquake_title{
            font-weight: 600;
            font-family: 'myHeiti';
            font-size: calc(20px * 1.5);
            color: 00e4ff;
            background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -1px;
            line-height: 62px;
            margin-left: 27px;
        }
        .close_mapHistoricalEarthquake{
            width: 79px;
            height: 35px;
            background: url("@{mapHistoricalEarthquake}/closemapDialong.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            right: 0;
            top:-8px;
            cursor: pointer;
        }
    }
    .mapHistoricalEarthquake_contont{
        width: 608px;
        height: 100%;
        background: url("@{mapHistoricalEarthquake}/contentBg.png") no-repeat;
        background-size: 100% 100%;
        padding: 27px 0px 27px 30px;
        .el-scrollbar{
            // max-height: 277px;
        }
        .mapHistoricalEarthquake_contont_list{
            display: flex;
            line-height: 50px;
            p{
                margin: 0;
                padding: 0;
            }
            p:nth-of-type(2){
                line-height: 50px;
                color: #afc4cf;
                font-size: 28px;
                width: 60%;
            }
            .list_title_contont{
                width: 63%!important;
            }
            .mapHistoricalEarthquake_contont_list_title{
                font-family: MicrosoftYaHeiUI-Bold;
                font-size: 28px;
                font-weight: normal;
                font-stretch: normal;
                line-height: 50px;
                letter-spacing: 0px;
                color: #89dee7;
                padding-left: 25px;
            }
        }
        .mapHistoricalEarthquake_contont_list:nth-child(odd){
            background:url("@{mapHistoricalEarthquake}/mapListbg.png") no-repeat;
            background-size: 100% 100%;
        }
    }
    .mapHistoricalEarthquake_footer{
        width: 100%;
        height: 30px;
        background: url("@{mapHistoricalEarthquake}/bottomBg.png") no-repeat;
        background-size: 100% 100%;
    }

}
.Earthquake_planel{
    position: absolute;
    left: -1500px;
}
 

</style>
