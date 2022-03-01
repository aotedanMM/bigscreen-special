<!--救援进展——抢修速率 -->
<template>
    <chartLine
        :id='id'
        :option='option'
    ></chartLine>
</template>

<script lang='ts'>
import {Component, Prop, Vue} from 'vue-property-decorator';
import chartLine from '@/components/common/chart/Line.common.vue';
import echarts_new from 'echarts';
@Component({
    name: 'RushRepairRate',
    components: {
        chartLine,
    },
})
export default class RushRepairRate extends Vue {
    public id = 'Repair-rate-line-chart';
    private charts = {
                lineX: ['0小时 13:28', '1小时 14:28', '2小时 15:28', '3小时 16:28', '4小时 17:28', '5小时 18:28', '6小时 19:28', '7小时 20:28', '8小时 21:28', '9小时 22:28', '10小时 23:28', '11小时 00:28', '12小时 01:28', '13小时 02:28', '14小时 03:28', '15小时 04:28', '16小时 05:28', '17小时 06:28', '18小时 07:28', '19小时 08:28', '20小时 09:28', '21小时 10:28', '22小时 11:28', '23小时 12:28', '24小时 13:28', '25小时 14:28', '26小时 15:28', '27小时 16:28', '28小时 17:28', '29小时 18:28', '30小时 19:28', '31小时 20:28', '32小时 21:28'],
                // value:[0,0.11,0.19,0.2,0.29,0.43,0.49,0.46,0.5,0.55,0.59,0.66,0.69,0.7,0.7,0.76,0.76,0.8,0.8,0.8,0.86,0.88,0.88,0.89,0.9,0.91,0.94,0.94,0.94,0.95,0.96,0.97,0.97]
                value: [0, 11, 19, 20, 29, 43, 49, 46, 50, 55, 59, 66, 69, 70, 70, 76, 76, 80, 80, 80, 86, 88, 88, 89, 90, 90, 94, 94, 94, 95, 96, 97, 97],

            };
    private color = [ 'rgba(92,87,27', 'rgba(14, 112, 131'];
    private option = {
                color: ['#00F7FB'],
                tooltip: {
                    trigger: 'axis',
                    textStyle: {
                        fontSize: 18,
                    },
                    formatter: '{b}<br/>{c}%',
                    // formatter(data: any) {
                    //     let result = '';
                    //     for (let i = 0 ; i < data.length; i++) {
                    //         result += data[i].name + '<br>' + '速率：' + data[i].value + '%';
                    //     }
                    //     return result;
                    // },
                },
                grid: {
                   /*  top: '10%',
                    left: '5%',
                    right: '10%',
                    bottom: '15%',
                    containLabel: true, */
                    top: '15%',
                    left: '10%',
                    right: '10%',
                    bottom: '15%',
                    containLabel: true,
                },
                dataZoom: [{
                    type: 'slider',
                    start: 0,
                    end: 70,
                    fillerColor: 'rgba(255,255,255,0.2)',
                    borderColor: '#586e91',
                    handleIcon: 'M8.2,13.6V3.9H6.3v9.7H3.1v14.9h3.3v9.7h1.8v-9.7h3.3V13.6H8.2z M9.7,24.4H4.8v-1.4h4.9V24.4z M9.7,19.1H4.8v-1.4h4.9V19.1z',
                    handleSize: '80%',
                    handleStyle: {
                        color: '#a7b7cc',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2,
                        opacity: 0.5,

                    },
                    textStyle: {
                        color: 'transparent',
                    },
                    bottom: 14,
                }],
                xAxis: {
                    // name:"小时",
                    nameTextStyle: {
                        color: '#d2e1ec',
                        fontSize: 20,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#d2e1ec',
                        },
                    },
                    type: 'category',
                    boundaryGap: false,
                    data: this.charts.lineX,
                    axisLabel: {
                        textStyle: {
                            color: 'white',
                            fontSize: 28,
                        },
                        formatter(params: any) {
                            return params.split(' ')[0] + '\n' + params.split(' ')[1];
                        },
                    },
                },
                yAxis: {
                    type: 'value',
                    splitNumber: 4,
                    max: 100,
                    min: 0,
                    interval: 25,
                    axisLabel: {
                        formatter: '{value}%',
                        textStyle: {
                            color: 'white',
                            fontSize: 28,
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(191,191,191,0.3)',
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'white',
                        },
                    },
                },
                series: [
                    {
                        type: 'line',
                        smooth: true,
                        symbolSize: 10,
                        data: this.charts.value,
                        label: {
                            normal: {
                                show: false,
                                position: 'top',
                                color: '#00F7FB',
                                fontSize: 20,
                                fontWeight: 'bold',
                                formatter(v: any) {
                                    const val = v.data;
                                    return val + '%';
                                },
                            },
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts_new.graphic.LinearGradient(0, 0, 0, 1,
                                [{
                                    offset: 0,
                                    color: this.color[1] + ', 0.6)',
                                },
                                {
                                    offset: 1,
                                    color: this.color[1] + ', 0)',
                                }], false),
                                shadowColor: 'rgba(0, 0, 0, 0.8)',
                                shadowBlur: 20,
                            },
                        },
                    },
                ],
            };
}
</script>

