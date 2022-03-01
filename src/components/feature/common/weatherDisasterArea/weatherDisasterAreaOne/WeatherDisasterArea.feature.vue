<template> 
    <div class="YJ-headWeather_cnt" @click="weatherClick">
        <div class="YJ-wea-item"><i class=" YJ-wea-item-location"></i>{{weatherObj.dq}}</div>
        <div class="YJ-wea-item YJ-wea-item-line">
            <div class="YJ-wea-item-temp">{{weatherObj.dqqw}}</div>
            <div class="YJ-wea-item-weathericon">
                <img :src="srcDAYMS" >
            </div>
            <div>{{weatherObj.dayms}}</div>
        </div>
        <div class="YJ-wea-item">{{weatherObj.fx?weatherObj.fx+weatherObj.fl:weatherObj.fl}}</div>
        <!-- <div class="YJ-wea-item  YJ-wea-item-weathericon w_special">
            <img src="../../../../../assets/img/weather/weatherstation.png" >
        </div> -->
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import {
    IWeatherListItem,
} from '@/interface/feature/common/weather/Weather.interface.ts';
import {locationServer} from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';
import { districtServer } from '@/api/installServer';
@Component({
    name : 'WeatherDisasterArea',
})
export default class WeatherDisasterArea extends Vue {
    @Prop() public weatherObj?: IWeatherListItem;

    private srcDAYMS: string = '';
    private WILSService: any = '';
    @Watch('weatherObj', {deep: true })
    private onChange(val: IWeatherListItem) {
        this.srcDAYMS = require(`../../../../../assets/img/weather/${(val as any).icon}.png`);
    }

    private weatherClick() {
        this.$store.commit('updateShowWeatherPanel', true);
    }
    private serviceFn() {
        const urlService: any = publishObjectPath.value.egis.server + 'egis/base/v1'; // 服务地址
        const clientIds: any = publishObjectPath.value.egis.clientId; // 用户id
        const clientSecrets: any = publishObjectPath.value.egis.clientSecret; // 用户密码
        const tokenUrls: any = publishObjectPath.value.egis.tokenServer; // 授权服务地址
        const authTypes: any = 'Token'; // 授权类型
        this.WILSService = new (window as any).egis.ews.RestWILSService({
            url: urlService,
            clientId: clientIds,
            clientSecret: clientSecrets,
            authType: authTypes,
            tokenUrl: tokenUrls,
        });
    }
    private queryIp() {
        locationServer.interetIP().then((ip: any) => {
            this.WILSService.locationByIP(ip).then((res: any) => {
                const optsTest = {
                    location: [res.content.location.x, res.content.location.y],
                    level: '2',
                };
                districtServer.getDistrictByLonLat(optsTest).then((dataDis: any) => {
                    this.$store.commit('eventPushStore/setDistrict', dataDis.data[0]); // 推送
                });
            });
        });
    }
    private created() {
        const that: any = this;
        this.onChange(that.weatherObj);
        this.queryIp();
        this.serviceFn();
    }


}
</script>
<style scoped lang="less">

.YJ-headWeather_cnt{
   width:100%;
   height:100%;
   box-sizing: border-box;
   font-size:24px;
   color:white;
   display:flex;
   justify-content:flex-start;
   cursor: pointer;
}
.YJ-wea-item{
  display:flex;
}
.YJ-wea-item-line{
  padding:0 15px;
  margin:0 15px;
  position: relative;
  &:after,
  &:before{
    content:"|";
    position:absolute;
  }
  &:before{
   left:0;
   top:1.5px;
  }
  &:after{
    right:0;
    top:1.5px;
  }
}
/*.YJ-wea-item-temp:after{
  content:"℃";
}*/
.YJ-wea-item-location{
  height:28px;
  width:18px;
  background:url(../../../../../assets/img/weather/gsp.png) left 6px no-repeat;
  background-size:contain;
  margin-right:5px;
}

.YJ-wea-item-weathericon{
  width:25px;
  height:25px;
  margin:3px 10px;
  &>img{
    width:100%; 
    height:100%;
  }
}

.w_special{
   width:20px;
   height:20px;
   margin-top:7px;
}



</style>