<!--救援进展——风险隐患排查-->
<template>
<el-scrollbar class="cmp-scrollbar-y" style="height:100%;">   
    <bar-list  class="hiddenTroubleInvertigation-wrap"
        :titleData='titleData' 
        :listData = 'listData'   
    ></bar-list>
</el-scrollbar>
</template>

<script lang='ts'>
import {Component, Prop, Vue} from 'vue-property-decorator';
import BarList from '@/components/common/chart/BarList.common.vue';

@Component({
    name: 'BarListDemo',
    components: {
        BarList ,
    },
})
export default class BarListDemo extends Vue {
    public titleData = [
        {
            label : '未处理',
            class : 'icon18 icon18_danger',
        },
         {
            label : '处置中',
            class : 'icon18 icon18_warn',
        },
         {
            label : '处置完成',
            class : 'icon18 icon18_primary',
        },
    ];

    public listData = [
        {
            label : '地震隐患点',
            id : 'dizhengdian',
            option : {
                grid: {
                    containLabel: true,
                    top: '8%',
                    left: '5%',
                    right: '5%',
                    bottom: '8%',
                },
                tooltip: {
                    show: true,
                },
                // color: ["#b4680a","#b4680a","#01E3FD","#FF0000","#FFFF00"],
                color: '#b4680a',
                xAxis: [{
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true,
                    },
                    data: ['有问题', '未排查', '无问题'],
                    axisLabel: {
                        formatter: '{value}',
                        color: '#fff',
                        textStyle: {
                            fontSize: 20,
                        },
                    },
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    },
                }],
                yAxis: [{
                    type: 'value',
                    /*  max:30,*/
                    position: 'left',
                    axisLabel: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    },
                }],
                series: [
                    {
                        name: '未排查',
                        type: 'bar',
                        barWidth: 40,
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color: '#fff',
                                fontSize: 20,
                                formatter: '{c}',
                            },
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: [50, 50, 50, 50], // 圆角
                            },
                        },
                        stack: '总量',
                        data: ['', '10', ''],
                    },
                    {
                        name: '无问题',
                        type: 'bar',
                        barWidth: 80,
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color: '#fff',
                                fontSize: 20,
                                formatter: '{c}',
                            },
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: [50, 50, 50, 50], // 圆角
                            },
                        },
                        stack: '总量',
                        data: ['', '', '10'],
                    },
                    {
                        name: '轻度',
                        type: 'bar',
                        barWidth: 80,
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color: '#01E3FD',
                                fontSize: 20,
                                formatter: '{c}',
                            },
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: [0, 0, 50, 50], // 圆角
                            },
                        },
                        data: ['10', '', ''],
                    },
                    {
                        name: '良',
                        type: 'bar',
                        barWidth: 80,
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color: '#ff0',
                                fontSize: 20,
                                formatter: '{c}',
                            },
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: [0, 0, 0, 0], // 圆角
                            },
                        },
                        data: ['2', '', ''],
                    },
                    {
                        name: '优',
                        type: 'bar',
                        barWidth: 80,
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color: '#f00',
                                fontSize: 20,
                                formatter: '{c}',
                            },
                        },
                        itemStyle : {
                            normal : {
                                barBorderRadius: [50, 50, 0, 0], // 圆角
                            },
                        },
                        stack: '总量',
                        data: ['3', '', ''],
                    },
                ],
            },
        } ,
        {
            label : '重大设施',
            id : 'dizhengser',
            option : {
                grid: {
                    containLabel: true,
                    top: '8%',
                    left: '5%',
                    right: '5%',
                    bottom: '8%',
                },
                tooltip: {
                    show: true,
                },
                // color: ["#b4680a","#b4680a","#01E3FD","#FF0000","#FFFF00"],
                color: '#01a3bb',
                xAxis: [{
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true,
                    },
                    data: ['有问题', '未排查', '无问题'],
                    axisLabel: {
                        formatter: '{value}',
                        color: '#fff',
                        textStyle: {
                            fontSize: 20,
                        },
                    },
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    },
                }],
                yAxis: [{
                    type: 'value',
                    /*  max:30,*/
                    position: 'left',
                    axisLabel: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    },
                }],
                series: [
                    {
                        name: '未排查',
                        type: 'bar',
                        barWidth: 40,
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color: '#fff',
                                fontSize: 20,
                                formatter: '{c}',
                            },
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: [50, 50, 50, 50], // 圆角
                            },
                        },
                        stack: '总量',
                        data: ['', '6', ''],
                    },
                    {
                        name: '无问题',
                        type: 'bar',
                        barWidth: 80,
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color: '#fff',
                                fontSize: 20,
                                formatter: '{c}',
                            },
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: [50, 50, 50, 50], // 圆角
                            },
                        },
                        stack: '总量',
                        data: ['', '', '6'],
                    },
                    {
                        name: '轻度',
                        type: 'bar',
                        barWidth: 80,
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color: '#01E3FD',
                                fontSize: 20,
                                formatter: '{c}',
                            },
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: [0, 0, 50, 50], // 圆角
                            },
                        },
                        data: ['5', '', ''],
                    },
                    {
                        name: '良',
                        type: 'bar',
                        barWidth: 80,
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color: '#ff0',
                                fontSize: 20,
                                formatter: '{c}',
                            },
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: [0, 0, 0, 0], // 圆角
                            },
                        },
                        data: ['3', '', ''],
                    },
                    {
                        name: '优',
                        type: 'bar',
                        barWidth: 80,
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color: '#f00',
                                fontSize: 20,
                                formatter: '{c}',
                            },
                        },
                        itemStyle : {
                            normal : {
                                barBorderRadius: [50, 50, 0, 0], // 圆角
                            },
                        },
                        stack: '总量',
                        data: ['2', '', ''],
                    },
                ],
            },
        },
        {
            label : '重点企业',
            id : 'dizheng',
            option : {
                grid: {
                    containLabel: true,
                    top: '8%',
                    left: '5%',
                    right: '5%',
                    bottom: '8%',
                },
                tooltip: {
                    show: true,
                },
                // color: ["#b4680a","#b4680a","#01E3FD","#FF0000","#FFFF00"],
                color: '#0175ba',
                xAxis: [{
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true,
                    },
                    data: ['有问题', '未排查', '无问题'],
                    axisLabel: {
                        formatter: '{value}',
                        color: '#fff',
                        textStyle: {
                            fontSize: 20,
                        },
                    },
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    },
                }],
                yAxis: [{
                    type: 'value',
                    /*  max:30,*/
                    position: 'left',
                    axisLabel: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    },
                }],
                series: [
                    {
                        name: '未排查',
                        type: 'bar',
                        barWidth: 40,
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color: '#fff',
                                fontSize: 20,
                                formatter: '{c}',
                            },
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: [50, 50, 50, 50], // 圆角
                            },
                        },
                        stack: '总量',
                        data: ['', '12', ''],
                    },
                    {
                        name: '无问题',
                        type: 'bar',
                        barWidth: 80,
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color: '#fff',
                                fontSize: 20,
                                formatter: '{c}',
                            },
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: [50, 50, 50, 50], // 圆角
                            },
                        },
                        stack: '总量',
                        data: ['', '', '12'],
                    },
                    {
                        name: '轻度',
                        type: 'bar',
                        barWidth: 80,
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color: '#01E3FD',
                                fontSize: 20,
                                formatter: '{c}',
                            },
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: [0, 0, 50, 50], // 圆角
                            },
                        },
                        data: ['7', '', ''],
                    },
                    {
                        name: '良',
                        type: 'bar',
                        barWidth: 80,
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color: '#ff0',
                                fontSize: 20,
                                formatter: '{c}',
                            },
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: [0, 0, 0, 0], // 圆角
                            },
                        },
                        data: ['8', '', ''],
                    },
                    {
                        name: '优',
                        type: 'bar',
                        barWidth: 80,
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color: '#f00',
                                fontSize: 20,
                                formatter: '{c}',
                            },
                        },
                        itemStyle : {
                            normal : {
                                barBorderRadius: [50, 50, 0, 0], // 圆角
                            },
                        },
                        stack: '总量',
                        data: ['2', '', ''],
                    },
                ],
            },
        },
    ];


}
</script>

<style>
.hiddenTroubleInvertigation-wrap{
    height:100%;
}
.before-list {
    color : 'red' 
}

.current-list {
    color : 'blue' 
}
.finly-list {
    color : 'green' 
}


</style>