<template>
    <div class="Meteorological_Wrap">
      <div   v-for="(item,index) in WeatherMeteorologicalDatas" :key="index" @click="WeatherMeteorologicalFn(item.iconclass,item.label, item)">
       <div class="iconClass" :class="item.checked? item.activeclass: item.iconclass" ></div>
       <div class="labelClass" v-html="item.label"></div>
      </div>

    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {  IMeteorologicalElementMapListItem } from '@/interface/feature/common/weather/Weather.interface.ts';
@Component({
    name: 'WeatherMeteorological',
})
export default class WeatherMeteorological extends Vue {
    @Prop() private WeatherMeteorologicalDatas!: IMeteorologicalElementMapListItem[];
    private isChecked: boolean = false;
    // 气象要素图, 暂时没有事件
    private WeatherMeteorologicalFn(icon: any, label: any, item: any) {
        const bol = item.checked;
        this.WeatherMeteorologicalDatas.map((i: any) => {
            i.checked = false;
        });
        item.checked = !bol;
        if (item.checked === false) {
            this.messsageBus.emit('reverseElectionClose');
        } else {
            this.messsageBus.emit('satelliteCloudPicture', icon, label);
        }
    }
    private created(): void {
        this.messsageBus.on('closeSatelliteCloudPicture', () => {
            this.WeatherMeteorologicalDatas.map((i: any) => {
                i.checked = false;
            });
        });
    }
}
</script>

<style scoped lang="less">
    .Meteorological_Wrap{
        width: 100%;
        display: flex;
        justify-content:space-between;
        font-size: 18px;
        &>div{
          display: flex;
          justify-content:flex-start;
          align-items:center;
           .iconClass{
               width:85px;
               height:85px;
               margin-right:10px;
               cursor: pointer;
           }
           .icon1{
                background: url("../../../../../assets/img/weather/weixingyun.png") center center no-repeat;
           }
           .icon2{
                background: url("../../../../../assets/img/weather/jiangshuiyubao.png") center center no-repeat;
           }
           .icon3{
                background: url("../../../../../assets/img/weather/wendugaodi.png") center center no-repeat;
           }
           .icon4{
                background: url("../../../../../assets/img/weather/flood.png") center center no-repeat;
           }
            .activeClass1{
                background: url("../../../../../assets/img/weather/weixingyaosu.png") center center no-repeat;
            }
            .activeClass2{
                background: url("../../../../../assets/img/weather/jiangshuiyaosu.png") center center no-repeat;
            }
           .labelClass{
               color:#93f9fe;
           }
        }

    }
</style>
