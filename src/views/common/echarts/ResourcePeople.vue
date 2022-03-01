<!--非常态（救援进展)—— 人员救助-->
<template>
    <line-chart
            :id='id'
            :option='option'
    ></line-chart>
</template>

<script lang='ts'>
import {Component, Prop, Vue} from 'vue-property-decorator';
// import LineChart from '@/views/common/chart/LineChartDemo.vue'
import LineChart from '@/components/common/chart/Line.common.vue';
// 人员救助demo
@Component({
    name: 'ResourcePeople',
    components: {
        LineChart ,
    },
})
export default class ResourcePeople extends Vue {
    private id = 'ChartDemoContianer' ;
    private option = {
                tooltip: {
                    trigger: 'axis',
                    textStyle: {
                        fontSize: 20,
                    },
                },
                grid: {
                    top: '40',
                    left: '5%',
                    right: '15%',
                    bottom: '3%',
                    containLabel: true,
                },
                xAxis: {
                    name: '(小时)',
                    type: 'category',
                    data: [6, 12, 18, 24, 24, '当前'],
                    nameTextStyle: {
                        color: '#fff',
                        fontSize: 20,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff',
                        },
                    },
                    axisLabel: {
                        textStyle: {
                            color: 'white',
                            fontSize: 28,
                        },
                    },
                    splitLine: {
                        show: false,
                    },
                },
                yAxis: {
                    type: 'value',
                    name: '(人)',
                    axisLabel: {
                        textStyle: {
                            color: 'white',
                            fontSize: 28,
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: '#fff',
                        },
                        show: false,
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#fff',
                        },
                    },
                    nameTextStyle: {
                        color: '#fff',
                        fontSize: 20,
                    },
                    splitArea: {
                        show: false,
                    },
                },
            series: [{
                name: '救出',
                type: 'line',
                data: [ 2 , 2 , 2 , 2 , 2 , 2, 2, 2,
                2 , 2 , 2 , 2 , 2 , 2, 2, 2,
                2 , 2 , 2 , 2 , 2 , 2, 2, 2,
                2 , 2 , 2 , 2 , 2 , 2, 2, 2,
                2 , 2 , 2 , 2 , 2 , 2, 2, 2,
                2 , 2 , 2 , 2 , 2 , 2, 2, 2,
                2 , 2 , 2 , 2 , 2 , 2, 2, 2,
                2 , 2 , 2 , 2 , 2 , 2, 2, 2],
                color: '#ffae00',
                lineStyle: {
                    normal: {
                        width: 5,
                        color: {
                            type: 'linear',
                            colorStops: [{
                                offset: 0,
                                color: '#ffae00', // 0% 处的颜色
                            }, {
                                offset: 0.4,
                                color: '#ffae00', // 100% 处的颜色
                            }, {
                                offset: 1,
                                color: '#ffae00', // 100% 处的颜色
                            }],
                            globalCoord: false, // 缺省为 false
                        },
                        shadowColor: 'rgba(245,128,128, 0.5)',
                        shadowBlur: 10,
                        shadowOffsetY: 7,
                    },
                },
                itemStyle: {
                    normal: {
                        color: '#ffae00',
                        borderWidth: 10,
                        /*shadowColor: 'rgba(72,216,191, 0.3)',
                         shadowBlur: 100,*/
                        borderColor: '#ffae00',
                    },
                },
                smooth: true,
            },
            {
                name: '转移',
                type: 'line',
                data: [ 4 , 4 , 4 , 4 , 4 , 4, 4, 4,
                4 , 4 , 4 , 4 , 4 , 4, 4, 4,
                4 , 4 , 4 , 4 , 4 , 4, 4, 4,
                4 , 4 , 4 , 4 , 4 , 4, 4, 4,
                4 , 4 , 4 , 4 , 4 , 4, 4, 4,
                4 , 4 , 4 , 4 , 4 , 4, 4, 4,
                4 , 4 , 4 , 4 , 4 , 4, 4, 4,
                4 , 4 , 4 , 4 , 4 , 4, 4, 4] ,
                lineStyle: {
                    normal: {
                        width: 5,
                        color: {
                            type: 'linear',
                            colorStops: [{
                                offset: 0,
                                color: '#01e1fb' , // 0% 处的颜色
                            },
                                {
                                    offset: 0.4,
                                    color: '#01e1fb', // 100% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#01e1fb', // 100% 处的颜色
                                },
                            ],
                            globalCoord: false, // 缺省为 false
                        },
                        shadowColor: 'rgba(249,165,137, 0.5)',
                        shadowBlur: 10,
                        shadowOffsetY: 7,
                    },
                },
                itemStyle: {
                    normal: {
                        color: '#01e1fb',
                        borderWidth: 10,
                        /*shadowColor: 'rgba(72,216,191, 0.3)',
                            shadowBlur: 100,*/
                        borderColor: '#01e1fb',
                    },
                },
                smooth: true,
            },
        ],
    };
}
</script>