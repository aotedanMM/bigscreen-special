<!--救援救助-现场队伍-->
<template>
<div class='ca-echart-loop-wrap'>
    <el-scrollbar style="height:100%;" class="cmp-scrollbar-y">
    <div class="fieldTeamView-count">
        <span class="fieldTeamView-count_title">队伍数量</span>
        <span class="fieldTeamView-count_value">{{teamCount}}</span>
        <span class="fieldTeamView-count_unit">支</span>
    </div>
    <FieldTeam class="ca-echart-loop-bd"
        :id='id'
        :option='option'
    ></FieldTeam>
    </el-scrollbar>
</div>
</template>
<script lang='ts'>
import {Component, Prop, Vue } from 'vue-property-decorator';
import FieldTeam from '@/components/feature/earthquake/fieldTeam/FieldTeam.vue';
@Component({
    name : 'FieldTeamView',
    components : {
        FieldTeam,
    },
})
export default class TeamDemandView extends Vue {
    private id = 'BarChartDemoContianer' ;
    private teamCount: number = 0;
    private option = {
        grid: {
            top: '5%',
            left: '38%',
            right: '20%',
            bottom: '8%',
            containLabel: false,
        },
        xAxis: {
            show: false,
        },
        yAxis: [
            {
                inverse: true,
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    margin: 20,
                    fontSize: 28,
                    color: '#b1d5e1',
                    fontFamily: '微软雅黑',
                },
                data: ['社会救援', '应急搜救', '医疗防疫', '抢通抢修'],
            },
        ],
        series: [
            {
                name: '支',
                type: 'bar',
                data: [
                    {
                        value: 0,
                        label: {
                            show: true,
                            position: 'right',
                            distance: 2,
                            textStyle: {
                                fontSize: 28,
                                color: 'rgba(6,235,253,1)',
                                fontFamily: '微软雅黑',
                            },
                            fontSize: 28,
                            fontFamily: '微软雅黑',
                            color: 'rgba(6,235,253,1)',
                        },
                        itemStyle: {
                            color: {
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 0,
                                type: 'linear',
                                global: false,
                                colorStops: [
                                    {offset: 0, color: 'rgba(6,235,253,0.1)'},
                                    {offset: 1, color: 'rgba(6,235,253,0.7)'}],
                            },
                        },
                        emphasis: {label: {show: true}},
                    },
                    {
                        value: 0,
                        label: {
                            show: true,
                            position: 'right',
                            distance: 2,
                            textStyle: {fontSize: 28, color: 'rgba(0,162,255,1)', fontFamily: '微软雅黑'},
                            fontSize: 28,
                            fontFamily: '微软雅黑',
                            color: 'rgba(0,162,255,1)',
                        },
                        itemStyle: {
                            color: {
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 0,
                                type: 'linear',
                                global: false,
                                colorStops: [{offset: 0, color: 'rgba(0,162,255,0.1)'}, {
                                    offset: 1,
                                    color: 'rgba(0,162,255,0.7)',
                                }],
                            },
                        },
                        emphasis: {label: {show: true}},
                    },
                    {
                        value: 0,
                        label: {
                            show: true,
                            position: 'right',
                            distance: 2,
                            textStyle: {fontSize: 28, color: 'rgba(255,174,0,1)', fontFamily: '微软雅黑'},
                            fontSize: 28,
                            fontFamily: '微软雅黑',
                            color: 'rgba(255,174,0,1)',
                        },
                        itemStyle: {
                            color: {
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 0,
                                type: 'linear',
                                global: false,
                                colorStops: [
                                    {offset: 0, color: 'rgba(255,174,0,0.1)'},
                                    {offset: 1, color: 'rgba(255,174,0,0.7)'}],
                            },
                        },
                        emphasis: {label: {show: true}},
                    },
                    {
                        value: 0,
                        label: {
                            show: true,
                            position: 'right',
                            distance: 2,
                            textStyle: {fontSize: 28, color: 'rgba(24,223,127,1)', fontFamily: '微软雅黑'},
                            fontSize: 28,
                            fontFamily: '微软雅黑',
                            color: 'rgba(24,223,127,1)',
                        },
                        itemStyle: {
                            color: {
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 0,
                                type: 'linear',
                                global: false,
                                colorStops: [{offset: 0, color: 'rgba(24,223,127,0.1)'}, {
                                    offset: 1,
                                    color: 'rgba(24,223,127,0.7)',
                                }],
                            },
                        },
                        emphasis: {label: {show: true}},
                    }],
                barWidth: 20,
                itemStyle: {
                    barBorderRadius: [0, 20, 20, 0],
                },
                // markPoint: {
                //     symbol: 'circle',
                //     symbolSize: 20,
                //     symbolOffset: ['0', '0'],
                //     data: [
                //     {
                //         xAxis: 0,
                //         yAxis: '社会救援',
                //         itemStyle: {
                //             color: 'rgba(6,235,253,1)',
                //             shadowBlur: 20,
                //             shadowColor: 'rgba(6,235,253,1)',
                //             opacity: 1,
                //         },
                //         label: {},
                //         emphasis: {label : {}},
                //     },
                //     {
                //         xAxis: 0,
                //         yAxis: '应急搜救',
                //         itemStyle: {
                //             color: 'rgba(0,162,255,1)',
                //             shadowBlur: 20,
                //             shadowColor: 'rgba(0,162,255,1)',
                //             opacity: 1,
                //         },
                //         label: {},
                //         emphasis: {label : {}},
                //     },
                //     {
                //         xAxis: 200,
                //         yAxis: '医疗防疫',
                //         itemStyle: {
                //             color: 'rgba(255,174,0,1)',
                //             shadowBlur: 20,
                //             shadowColor: 'rgba(255,174,0,1)',
                //             opacity: 1,
                //         },
                //         label: {},
                //         emphasis: {label : {}},
                //     },
                //     {
                //         xAxis: 180,
                //         yAxis: '抢通抢修',
                //         itemStyle: {
                //             color: 'rgba(24,223,127,1)',
                //             shadowBlur: 20,
                //             shadowColor: 'rgba(24,223,127,1)',
                //             opacity: 1,
                //         },
                //         label: {},
                //         emphasis: {label : {}},
                //     }],
                // },
            },
        ],
    };

}
</script>
<style lang='less' scoped>
// @import url(); 引入公共css类
.ca-echart-loop-wrap{
    padding:10px;
    height: 100%;
    margin-left:-20px;
    box-sizing: border-box
}
.ca-echart-loop-bd{
    height:220px;

}
.fieldTeamView-count{
    height: 75px;
    background: url(../../../assets/img/decisionSupport/fieldTeam/title-bg.png) left top no-repeat;
    background-size: 100% 100%;
    font-size: 28px;
    padding-left: 52px;
    margin-top: -26px;
    line-height: 75px;
}
.fieldTeamView-count_title{
    color: #00c0ff;
    padding-right: 20px;
}
.fieldTeamView-count_value ,
.fieldTeamView-count_unit 
{
    color: #ffae00;

}


</style>