<!--现场队伍-->
<template>

    <field-team
            :id='id'
            :option='option'></field-team>
</template>

<script lang='ts'>
import {Component, Prop, Vue} from 'vue-property-decorator';
import {IFieldTeamDemo} from '@/interface/feature/earthquake/FieldTeam.interface';
import FieldTeam from '@/components/feature/earthquake/fieldTeam/FieldTeam.vue';
import PanelView from '@/components/common/panel/PanelView.vue';
// 现场队伍demo
@Component({
    name: 'FieldTeamDemo',
    components: {
        FieldTeam,
        PanelView,
    },
})
export default class FieldTeamDemo extends Vue {
    private id = 'BarChartDemoContianer' ;
    private option: IFieldTeamDemo = {
        grid: {
            top: '5%',
            left: '45%',
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
                        value: 800,
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
                        value: 1265,
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
                        value: 200,
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
                        value: 180,
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
                markPoint: {
                    symbol: 'circle',
                    symbolSize: 20,
                    symbolOffset: ['-10', '0'],
                    data: [
                    {
                        xAxis: 800,
                        yAxis: '社会救援',
                        itemStyle: {
                            color: 'rgba(6,235,253,1)',
                            shadowBlur: 20,
                            shadowColor: 'rgba(6,235,253,1)',
                            opacity: 1,
                        },
                        label: {},
                        emphasis: {label : {}},
                    },
                    {
                        xAxis: 1265,
                        yAxis: '应急搜救',
                        itemStyle: {
                            color: 'rgba(0,162,255,1)',
                            shadowBlur: 20,
                            shadowColor: 'rgba(0,162,255,1)',
                            opacity: 1,
                        },
                        label: {},
                        emphasis: {label : {}},
                    },
                    {
                        xAxis: 200,
                        yAxis: '医疗防疫',
                        itemStyle: {
                            color: 'rgba(255,174,0,1)',
                            shadowBlur: 20,
                            shadowColor: 'rgba(255,174,0,1)',
                            opacity: 1,
                        },
                        label: {},
                        emphasis: {label : {}},
                    },
                    {
                        xAxis: 180,
                        yAxis: '抢通抢修',
                        itemStyle: {
                            color: 'rgba(24,223,127,1)',
                            shadowBlur: 20,
                            shadowColor: 'rgba(24,223,127,1)',
                            opacity: 1,
                        },
                        label: {},
                        emphasis: {label : {}},
                    }],
                },
            },
        ],
    };
}
</script>