<template>
    <div class="DQSK_Wrap">
        <div class="right" v-if="weatherData">
            <ul @click="queryWeatherMoreFn">
                <li><i class="fxfl"></i><span>{{weatherDQSKObj.FX}}</span><span>{{weatherDQSKObj.FL}}级</span></li>
                <li><i class="qiwen"></i><span>温度</span><span>{{weatherDQSKObj.DQQW}}℃</span></li>
<!--                <li><i class="shidu"></i><span>湿度</span><span>{{weatherDQSKObj.SD}}%</span></li>-->
            </ul>
<!--            <p class="dataResouce">数据更新：{{weatherDQSKObj.RQ}}时 <span>{{weatherDQSKObj.DQ}}</span></p>-->
        </div>
        <div class="nothingData--bg1" v-else></div>

    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { weatherServer, newWeatherServer, districtServer } from '@/api/installServer.ts';
    import {
        IWeatherImageListItem,
    } from '@/interface/feature/common/weather/Weather.interface.ts';
    @Component({
        name: 'WeatherToday',
    })
    export default class WeatherToday extends Vue {
        private weatherData: any = '';
        private fengxiang: any = '';
        private adminCodeChn: any = '';
        private weatherList: any = '';
        private weatherDQSKObj: any = '';
        private firstList: any = '';
        private tomorrowData: any = '';
        private precipitationData: any = '';

        @Watch ('$store.state.eventPushStore.eventLocation.EventLat')
        private watchEventTit(val: any) {
            const eventType: number |  string = this.$store.state.eventPushStore.eventLocation.EventType;
            // if ( (eventType === 9) || (eventType === '9')) {
            this.getWeatherData();
            this.$emit('changeOtherEvent');
            this.messsageBus.emit('queryWeatherMore', false);
            // }
        }
        private getWeatherData() {
            const latitude = this.$store.state.eventPushStore.eventLocation.EventLat.toString();
            const longitude = this.$store.state.eventPushStore.eventLocation.EventLon.toString();
            // weatherServer.getWeatherDataFn(latitude, longitude).then((data: any) => {
            const param = {
                location: [longitude, latitude],
                level: '3',
            };
            districtServer.getDistrictByLonLat(param).then((res: any) => {
                const data = res;
                // if (data.data[0]) {
                //     const derictiondata = data.data[0].winDAvg2mi;
                //     const directions = [ '北风', '东北风', '东风', '东南风', '南风', '西南风', '西风', '西北风', '北风'];
                //     if (derictiondata === -1 || derictiondata === 0) {
                //         this.fengxiang = '北风';
                //     } else {
                //         const index = Math.ceil(derictiondata / 40);
                //         this.fengxiang = directions[index - 1];
                //     }
                // }
                if (data.data[0] && data.data[0].code) {
                    this.weatherData = data.data[0];
                    this.adminCodeChn = data.data[0].code;
                    this.queryWeatherData(this.adminCodeChn);
                    this.getData(this.adminCodeChn);
                    this.precipitationFn(this.adminCodeChn);
                }
            });
        }
        // 获取24小时天气预报
        private queryWeatherData(code: any) { // districtCode
            const that = this;
            newWeatherServer
                .getJXYBDatas('24H', code)
                .then((res: any) => {
                    if (res.code === 1) {
                        const arr = JSON.parse(res.message);
                        this.firstList = arr[0];
                        const newArr = arr.slice(1);
                        this.$set(this, 'weatherList', newArr );
                    }
                });
        }
        // 获取当天天气
        private getData(code: any) {
            let curIndex1 = 0;
            let curIndex2 = 0;
            weatherServer.getImgConfigData().then((res: IWeatherImageListItem[]) => {
                const imgMap = res;
                newWeatherServer
                    .getJXYBDatas('3D', code)
                    .then((data: any) => {
                        if (data && JSON.stringify(data.message) !== '{}') {
                            const arrList = [];
                            for (const iterator of JSON.parse(data.message)) {
                                if (iterator.RQTJ === 'today') {
                                    this.weatherDQSKObj = iterator;
                                    // 过滤掉符号，%,℃，级，设计图上这些符号字体是白色
                                    this.weatherDQSKObj.DQQW = this.weatherDQSKObj.DQQW.replace('℃', '');
                                    this.weatherDQSKObj.SD = this.weatherDQSKObj.SD.replace('%', '');
                                    this.weatherDQSKObj.FL = this.weatherDQSKObj.FL.replace('级', '');
                                } else if (iterator.RQTJ !== 'seventh') {
                                    arrList.push(iterator);
                                    this.tomorrowData = arrList;
                                }
                            }
                            curIndex1 = this.findIndexFromImgMap1(
                                this.weatherDQSKObj.DAYMS,
                                imgMap,
                            );
                            for (const i of this.tomorrowData) {
                                curIndex2 = this.findIndexFromImgMap2(i.DAYMS, imgMap);
                                i.icon = imgMap[curIndex2].value;
                            }
                            this.weatherDQSKObj.icon = imgMap[curIndex1].value;
                        }
                    });
            });
        }
        private findIndexFromImgMap1(str: any, arr: any[]) {
            let curIdex = 0;
            arr.forEach((item: any, index: number) => {
                if (str === item.label) {
                    curIdex = index;
                }
            });
            return curIdex;
        }
        private findIndexFromImgMap2(str: any, arr: any[]) {
            let curIdex2 = 0;
            arr.forEach((item: any, index: number) => {
                if (str === item.label) {
                    curIdex2 = index;
                }
            });
            return curIdex2;
        }
        // 获取降水量
        private precipitationFn(code: any) {
            const that = this;
            newWeatherServer
                .getJXYBDatas('RN', code)
                .then((res: any) => {
                    if (res.code === 1) {
                        const arr = JSON.parse(res.message);
                        this.precipitationData = arr;
                    }
                });
        }
        private queryWeatherMoreFn() {
            const obj: any = {};
            obj.weatherList = this.weatherList;
            obj.weatherDQSKObj = this.weatherDQSKObj;
            obj.tomorrowData = this.tomorrowData;
            obj.precipitationData = this.precipitationData;
            this.messsageBus.emit('queryWeatherMore', true, this.adminCodeChn, obj);
        }
        private created() {
            this.getWeatherData();
        }
    }
</script>

<style scoped lang="less">
    .DQSK_Wrap {
        .right{
            /*min-width: 411px;*/
            /*max-width: 435px;*/
            height: 92px;
            background: url("../../../../../assets/img/weather/weatherBg.png") no-repeat;
            background-size: 100% 100%;
            /*display: flex;*/
            font-size: 18px;
            width: 280px;
            height: 63px;
            ul{
                display: flex;
                /*padding-left: 12px;*/
                cursor: pointer;
                width: 95%;
                margin: auto;
                height: 46px;
                /*border-bottom: 1px solid #55d5ff;*/
                li{
                    line-height: 62px;
                    margin-left: 10px;
                    span:nth-of-type(1){
                        color: #ffffff;
                        font-size: 20px;
                        margin-right: 7px;
                    }
                    span:nth-of-type(2){
                        color: #ffff5e;
                        font-size: 20px;
                        padding-right: 5px;
                        border-right: 1px solid #1295a9;
                    }
                    i {
                        background-size: 100% 100%;
                        display: inline-block;
                        margin-right: 7px;
                    }
                    .qiwen {
                        background: url('../../../../../assets/img/weather/qiwenIcon.png') center
                        center no-repeat;
                        width: 10px;
                        height: 19px;
                    }
                    .shidu {
                        background: url('../../../../../assets/img/weather/shiduIcon.png') center
                        center no-repeat;
                        width: 17px;
                        height: 18px;
                    }
                    .jiangshui {
                        background: url('../../../../../assets/img/weather/jiangshui.png')
                        center center no-repeat;
                    }
                    .fxfl {
                        background: url('../../../../../assets/img/weather/fsIcon.png')
                        center center no-repeat;
                        width: 15px;
                        height: 15px;
                    }
                }
                li:nth-last-child(1){
                    span:nth-of-type(2){
                        border: none;
                        /*padding-right: 17px;*/
                    }
                }
            }
            p{
                font-size: 18px;
                color: #e5f4ff;
                margin: 0;
                padding-left: 30px;
                line-height: 31px;
                span{
                    padding-left: 5px;
                }
            }
        }
        .nodataClass {
            width: 100%;
            height: 100px;
            text-align: center;
            line-height: 100px;
        }
    }
</style>