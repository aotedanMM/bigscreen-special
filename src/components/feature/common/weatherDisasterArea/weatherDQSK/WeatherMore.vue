<template>
    <div class="weatherMorebox">
    <div class="weatherMoreTop">
        <p class="currentReality"><span class="title-panel">当前实况</span><span><i class="weizhi"></i>{{weatherList.weatherDQSKObj.DQ}}</span></p>
        <p class="closeBtn" @click="closeWeatherMorePanel"></p>
        <div class="todayWeather">
            <img :src="iconSrc1">
            <p>{{weatherList.weatherDQSKObj.DAYMS}}</p>
            <ul>
                <li><span>{{weatherList.weatherDQSKObj.DQQW}}</span>℃</li>
                <li><i class="qiwen"></i>气温</li>
            </ul>
            <ul>
                <li><span>{{weatherList.weatherDQSKObj.SD}}</span>%</li>
                <li><i class="shidu"></i>相对湿度</li>
            </ul>
            <ul>
                <li v-if="weatherList.precipitationData.l6"><span>{{weatherList.precipitationData.l6}}</span>mm</li>
                <li v-else>暂无数据</li>
                <li><i class="jiangshui"></i>降水</li>
            </ul>
            <ul>
                <li>{{weatherList.weatherDQSKObj.FX}}<span>{{weatherList.weatherDQSKObj.FL}}</span>级</li>
                <li><i class="fxfl"></i>风向风速</li>
            </ul>
        </div>
        <p class="dataSources">实时数据来源：<span>{{weatherList.weatherDQSKObj.DQ}}气象站</span>实时数据更新时间：{{weatherList.weatherDQSKObj.RQ}}时</p>
    </div>
    <div class="weatherMoreBot">
        <el-tabs  v-model="activeName"  class="weatherMoreTitle">
            <el-tab-pane label="24小时" name="first">
                <div class="tableList">
                    <el-table
                            size="mini"
                            :data="tableData"
                            :row-class-name="tableRowClassName"
                            :header-row-class-name="tableHeaderClassName"
                            tooltip-effect="light"
                            style="width: 100%"
                    >
                        <el-table-column prop="title" label="类型">
                        </el-table-column>
                        <el-table-column
                                v-for="(item,index) in col"
                                :key="item.key + index"
                                :prop="item.prop"
                                :label="item.label"
                                :align="item.align"
                                :width="item.width"
                                show-overflow-tooltip
                        >
                            <template slot-scope="scope">
                                <span class="title" v-if="item.prop=='title'">{{scope.row[item.prop]}}</span>
                                <span v-else>{{scope.row[item.prop]}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="sliderList">
                    <el-slider
                            v-model="timeValue"
                            :step="6"
                            :max="18"
                            @input="changeTimeFn"
                            tooltip-class="tootipTimeElement"
                            :format-tooltip="timestepToolTip"
                            show-stops>
                    </el-slider>
                </div>
            </el-tab-pane>
            <el-tab-pane label="未来5日" name="second">
                <div class="fiveDayBox">
                    <div class="fiveDayList" v-for="(item,index) in weatherList.tomorrowData" :key="index">
                        <div class="card  f-txt-small">
                            <p>{{item.weekDay}}</p>
                            <p class="f-txt-small"> {{item.dayTime}}</p>
                            <p><img :src="item.imgIcon"></p>
                            <p>{{item.NIGHLOW.replace('最低：', '')}}-{{item.DAYHIGHT.replace('最高：','')}}</p>
                            <p>{{item.DAYMS}}</p>
                            <p>{{item.FX}}{{item.FL}}</p>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!-- <div class="weatherMoreTitle">
            <p>预报信息</p>
        </div> -->
        <!-- 下面数据来源注释不要了 -->
        <!-- <p class="dataSources">预测数据来源：<span>中央气象局</span>预测数据更新时间：{{weatherList.weatherDQSKObj.RQ}}时</p> -->
    </div>
</div>
</template>
<script lang="ts">
    import {
        IHour24ForecastListItem,
        IweatherJXYBTable,
        IweatherJXYBServer,
    } from '@/interface/feature/common/weather/Weather.interface.ts';
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    @Component({
        name: 'WeatherMore',
    })
    export default class WeatherMore extends Vue {
        @Prop() private adminCodeChn!: any;
        @Prop() private weatherList!: any;
        private activeName = 'first';
        private timeValue: any = 0;
        private tableData!: IweatherJXYBTable[]; // 表格数据
        private weatherDQSKObj: any = ''; // 当天数据
        private iconSrc1: any = ''; // 天气图片
        private col: IHour24ForecastListItem[] = [
            {
                key: '2',
                prop: 'value1',
                label: '未来1小时',
                width: '',
                align: 'center',
            },
            {
                key: '3',
                prop: 'value2',
                label: '未来2小时',
                width: '',
                align: 'center',
            },
            {
                key: '4',
                prop: 'value3',
                label: '未来3小时',
                width: '',
                align: 'center',
            },
            {
                key: '5',
                prop: 'value4',
                label: '未来4小时',
                width: '',
                align: 'center',
            },
            {
                key: '6',
                prop: 'value5',
                label: '未来5小时',
                width: '',
                align: 'center',
            },
            {
                key: '7',
                prop: 'value6',
                label: '未来6小时',
                width: '',
                align: 'center',
            },
        ];
        // 表头样式类名
        private tableHeaderClassName() {
            return 'tableHead';
        }
        // table斑马线
        private tableRowClassName(row: any) {
            if (row.rowIndex % 2 !== 0) {
                return 'odd-row';
            }
        }
        private closeWeatherMorePanel() {
            this.$emit('closeWeatherMorePanel', false);
        }
        private timestepToolTip(val: any) {
            let times = val;
            if (val) {
                this.col.forEach((item: any) => {
                    times ++;
                    item.label = '未来' + times + '小时';
                });
            } else {
                val = 0;
                this.col.forEach((item: any) => {
                    times ++;
                    item.label = '未来' + times + '小时';
                });
            }
            const num = val + 6;
            let tip = '';
            tip = val + 1 + 'h' + '-' + num + 'h';
            return tip;
        }
        private changeTimeFn(val: any) {
            this.dealJXYBDatas(this.weatherList.weatherList.slice(val, val + 6));
        }
        private dealJXYBDatas(opt: any) {
            if (opt.length) {
                const arr: IweatherJXYBTable[] = [
                    {
                        title: '风向',
                    },
                    {
                        title: '风速(m/s)',
                    },
                    {
                        title: '温度(℃)',
                    },
                    // {
                    //     title: '降水量(mm)',
                    // },
                ];
                opt.forEach((item: IweatherJXYBServer, index: number) => {
                    const value = 'value' + (index + 1);
                    (arr[0] as any)[value] = this.translateWindX(item.jc);
                    (arr[1] as any)[value] = item.jd;
                    (arr[2] as any)[value] = item.jb;
                    // (arr[3] as any)[value] = '暂无数据';
                });
                this.tableData = arr;
            } else {
                this.tableData = [];
            }
        }
        // 处理风向
        private translateWindX(num: any) {
            const temp2 = Number(num);
            let windX = '';
            if (temp2 === 0) {
                windX = '持续无风';
            } else if (temp2 === 1) {
                windX = '东北风';
            } else if (temp2 === 2) {
                windX = '东风';
            } else if (temp2 === 3) {
                windX = '东南风';
            } else if (temp2 === 4) {
                windX = '南风';
            } else if (temp2 === 5) {
                windX = '西南风';
            } else if (temp2 === 6) {
                windX = '西风';
            } else if (temp2 === 7) {
                windX = '西北风';
            } else if (temp2 === 8) {
                windX = '北风';
            } else if (temp2 === 9) {
                windX = '旋转风';
            } else {
                windX = '无数据';
            }
            return windX;
        }
        // 获取当天天气,周几
        private dealDatas(opt1: any, opt2: any) {
            if (opt1 && opt1.icon) {
                this.iconSrc1 = require(`../../../../../assets/img/weather/${opt1.icon}.png`);
            }
            for (let i = 0; i < opt2.length; i++) {
                if (opt2[i] && opt2[i].icon) {
                    opt2[i].imgIcon = require(`../../../../../assets/img/weather/${opt2[i].icon}.png`);
                    opt2[i].dayTime = this.getDay(i + 1, '-');
                    const weekDayArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']; // 星期映射数组
                    const myDate = new Date();
                    const milliseconds = myDate.getTime() + 1000 * 60 * 60 * 24 * i; // 当i为0代表当前日期，为1时可以得到明天的日期，以此类推
                    const newMyDate = new Date(milliseconds);
                    const weekDay = newMyDate.getDay(); // 获取当前星期X(0-6,0代表星期天)
                    opt2[i].weekDay = weekDayArr[weekDay + 1];
                }
            }
        }
        // 获取明后天
        private getDay(num: number, str: any) {
            const today = new Date();
            const nowTime = today.getTime();
            const ms = 24 * 3600 * 1000 * num;
            const time = nowTime + ms;
            today.setTime(Number(time));
            const oYear = today.getFullYear();
            let oMoth = (today.getMonth() + 1).toString();
            if (oMoth.length <= 1) {
                oMoth = '0' + oMoth;
            }
            var oDay = today.getDate().toString();
            if (oDay.length <= 1) {
                oDay = '0' + oDay;
            }
            return oMoth + str + oDay;
        }
        private created() {
            this.dealJXYBDatas(this.weatherList.weatherList.slice(0, 6));
            this.dealDatas(this.weatherList.weatherDQSKObj, this.weatherList.tomorrowData);
        }
    }
</script>
<style scoped lang="less">
    .weatherMorebox{
        background: url("../../../../../assets/img/darkgreen/panel/videoBg.png") no-repeat;
        background-size: 100% 100%;
        width: 1227px;
        height: 734px;
        position: relative;
        .currentReality{
            position: absolute;
            padding-left: 50px;
            top: 25px;
            width: 94%;
            span:nth-of-type(2){
                float: right;
                color: #67e1fb;
                font-size: 26px;
                padding-right: 100px;
                padding-top: 3px;
            }
            .weizhi{
                display: inline-block;
                width: 28px;
                height: 35px;
                background: url("../../../../../assets/img/weather/weizhi.png") no-repeat;
                background-size: 100% 100%;
                vertical-align: middle;
            }
        }
        .closeBtn{
            display: inline-block;
            width: 90px;
            height: 48px;
            background: url("../../../../../assets/img/gisModule/PopulationFeverBox/closeBtn.png")no-repeat;
            background-size: 100% 100%;
            position: absolute;
            right: 17px;
            top: 8px;
            cursor: pointer;
        }
        .closeBtn:hover{
            display: inline-block;
            width: 90px;
            height: 48px;
            background: url("../../../../../assets/img/gisModule/PopulationFeverBox/closeHover.png")no-repeat;
            background-size: 100% 100%;
            position: absolute;
            right: 17px;
            top: 8px;
            cursor: pointer;
        }
        .weatherMoreTop{
            .todayWeather{
                display: flex;
                justify-content: space-around;
                padding-top: 84px;
                width: 98%;
                img{
                    width: 122px;
                    height: 100px;
                    padding-top: 15px;
                }
                ul{
                    text-align: center;
                    padding-top: 18px;
                    li{
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
                            background: url('../../../../../assets/img/weather/jiangshuiIcon.png')
                            center center no-repeat;
                            width: 21px;
                            height: 18px;
                        }
                        .fxfl {
                            background: url('../../../../../assets/img/weather/fsIcon.png')
                            center center no-repeat;
                            width: 15px;
                            height: 15px;
                        }
                    }
                    li:nth-of-type(1) {
                        color: #e5f4ff;
                        font-size: 21px;
                        span{
                            font-family: Impact;
                            font-size: 32px;
                            font-weight: normal;
                            font-stretch: normal;
                            letter-spacing: 1px;
                            color: #f0e34d;
                            padding: 0 5px;
                        }
                    }
                    li:nth-of-type(2){
                        color: #85fefe;
                        font-size: 26px;
                    }
                }
                ul:nth-last-of-type(1){
                    li:nth-of-type(1){
                        font-size: 28px;
                    }
                }
                p{
                    font-size: 32px;
                    color: #e5f4ff;
                    margin-left: -89px;
                    line-height: 47px;
                }
            }
            .dataSources{
                padding-left: 25px;
                color: #e5f4ff;
                font-size: 20px;
                width: 92%;
                margin: auto;
                padding-top: 14px;
                padding-bottom: 30px;
                border-bottom: 1px solid rgba(27,158,252,0.64);
                span{
                    padding-right: 112px;
                }
            }
        }
        .weatherMoreBot{
            margin-top:30px;
            #pane-first{
                height:400px;
            }
             /deep/.el-tabs__header{
                width: 92%;
                margin-left: 55px;
                .el-tabs__item{
                    font-size: 28px;
                    color:#fff;
                    outline: none;
                    .is-active{
                        background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
                        -webkit-background-clip: text;
                        background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                }
                .el-tabs__active-bar{
                    background: #00ecff;
                }
                .el-tabs__nav-wrap::after{
                    background-color: rgba(255,255,255,0);
                }
            }
            /deep/.el-tabs__content{
                .el-tab-pane{
                    width: 92%;
                    margin-left: 4%;
                }
            }
            .tableList{
                border: 1px solid rgba(84,191,249,0.2);
            }
            .sliderList{
                width: 92%;
                margin: auto;
                position: absolute;
                bottom: 75px;
                left: 50px;
            }
            .fiveDayBox{
                display: flex;
                .fiveDayList{
                    width: 19%;
                    margin-right: 20px;
                }
                .fiveDayList:nth-last-child(1){
                    margin: 0;
                }
            }
            .card{
                color:#fff;
                height:300px;
                background: rgba(84, 191, 249, 0.1);
                padding:15px;
                p{
                    text-align: center;
                    line-height:25px;
                    margin: 0;
                    padding-bottom: 13px;
                    img{
                        width: 130px;
                        height: 100px;
                    }
                }
            }
            .dataSources{
                /*padding-left: 25px;*/
                color: #e5f4ff;
                font-size: 20px;
                width: 92%;
                margin: auto;
                padding-top: 14px;
                padding-bottom: 30px;
                position: absolute;
                bottom: 28px;
                left: 52px;
                span{
                    padding-right: 112px;
                }
            }
            .tomorrow{
                margin-left: 70px;
            }
        }
    }
</style>
<style lang="less">
    .tootipTimeElement{
        background: url("../../../../../assets/img/weather/tip.png") no-repeat !important;
        background-size: 100% 100% !important;
        font-size: 24px !important;
        color: #f6fdff !important;
        min-width: 100px !important;
        max-width: 120px !important;
        height: 48px !important;
        line-height: 38px !important;
        text-align: center;
    }
    .el-tooltip__popper{
        padding: 0px !important;
        margin-bottom: 0 !important;
    }
    .weatherMorebox .el-slider__runway{
        background-image: linear-gradient(90deg,
        #0d2c44 0%,
        #000000 100%);
        border-radius: 4px;
        border: solid 1px #54bff9;
        margin: 8px 0;
    }
    .weatherMorebox .el-slider__stop{
        background: none;
    }
    .weatherMorebox .el-slider__button{
        background: url("../../../../../assets/img/weather/yuan.png")no-repeat;
        background-size: 100% 100%;
        border: none !important;
        width: 22px !important;
        height: 22px !important;
    }
    .weatherMorebox .el-slider__bar{
        background-image: linear-gradient(90deg,
        #4cb1f8 0%,
        #a4f1fd 100%);
    }
    .weatherMorebox{
        .el-table{
            background-color: transparent;
            border: 1px solid rgba(84,191,249,0.2);
        }
        .el-table::before{
            background: rgba(84,191,249,0.2) !important;
        }
        .el-table td, .el-table th.is-leaf{
            border-bottom: 1px solid rgba(84,191,249,0.2) !important;
        }
        .el-table,
        .el-table th,
        .el-table tr,
        .el-table td {
            font-size: 26px;
            color: white;
            border: 0;
            background-color: transparent;
            font-weight: normal;
        }
        .el-table::before {
            height: 0;
        }
        .el-table .cell{
            line-height: 45px;
        }
        .el-table th {
            color: #00ecff;
            font-size: 26px;
            font-family: MicrosoftYaHei;
        }
        .el-table--enable-row-hover .el-table__body tr:hover > td {
            border: 0;
            background-color: transparent;
        }
         .odd-row {
            background: rgba(84,191,249,0.2) !important;
        }
        .tableHead {
            height: 55px;
            background: url("../../../../../assets/img/weather/theaderBg.png")no-repeat;
            background-size: 100% 115%;
        }
    }
    .weatherMorebox .el-tabs__header{
        width: 94%;
        margin-left: 34px;
        .el-tabs__item{
            color: #00ecff;
            font-size: 26px;
        }
        .el-tabs__active-bar{
            bottom: 2px;
            left: -11px;
            height: 3px;
            background-color:#4cb1f8 ;
            padding: 0 10px;
        }
        .el-tabs__nav{
            margin-left: 38px;
        }
    }
    .weatherMorebox .el-tabs__nav-wrap::after{
        background-color:rgba(27, 158, 252, 0.64);
    }
</style>