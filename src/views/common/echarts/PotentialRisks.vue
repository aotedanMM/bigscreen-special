<template>
    <bar-list
        :titleData='titleData' 
        :listData = 'listData'   
    ></bar-list>
</template>

<script lang='ts'>
import {Component, Prop, Vue} from 'vue-property-decorator';
import BarList from '@/components/common/chart/BarList.common.vue';
// 风险隐患排查
@Component({
    name: 'HiddenTroubleInvestigation',
    components: {
        BarList ,
    },
})
export default class HiddenTroubleInvestigation extends Vue {
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
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'line',
                    },
                },
                textStyle : {
                    fontStyle : 'italic',
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                },
                xAxis:  {
                    type: 'category',
                    data: ['有问题', '未排查', '无问题'],
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        name: '未处置',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color : 'red',
                            },
                        },
                        itemStyle : {
                            color : 'red',
                            barBorderRadius : [2, 2, 3, 2],
                        },
                        data: [
                            3
                        , 2, 1],
                    },
                    {
                        name: '处置中',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color : '#FFFF00',
                            },
                        },
                        itemStyle : {
                            color : '#FFFF00',
                        },
                        data: [2],
                    },
                    {
                        name: '处置完成',
                        type: 'bar',
                        stack: '总量',
                        itemStyle : {
                            color : '#01E3FD',
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color : '#01E3FD',
                            },
                        },
                        data: [1],
                    },
                ],
            },
        } ,
        {
            label : '重大设备',
            id : 'dizhengser',
            option : {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'line',
                    },
                },
                textStyle : {
                    fontStyle : 'italic',
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                },
                xAxis:  {
                    type: 'category',
                    data: ['有问题', '未排查', '无问题'],
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        name: '未处置',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color : 'red',
                            },
                        },
                        itemStyle : {
                            color : 'red',
                            barBorderRadius : [2, 2, 3, 2],
                        },
                        data: [
                            3
                        , 2, 1],
                    },
                    {
                        name: '处置中',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color : '#FFFF00',
                            },
                        },
                        itemStyle : {
                            color : '#EFFFF00',
                        },
                        data: [2],
                    },
                    {
                        name: '处置完成',
                        type: 'bar',
                        stack: '总量',
                        itemStyle : {
                            color : '#01E3FD',
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color : '#01E3FD',
                            },
                        },
                        data: [1],
                    },
                ],
            },
        },
         {
            label : '重大企业',
            id : 'dizheng',
            option : {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'line',
                    },
                },
                textStyle : {
                    fontStyle : 'italic',
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                },
                xAxis:  {
                    type: 'category',
                    data: ['有问题', '未排查', '无问题'],
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        name: '未处置',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color : 'red',
                            },
                        },
                        itemStyle : {
                            color : 'red',
                            barBorderRadius : [2, 2, 3, 2],
                        },
                        data: [
                            3
                        , 2, 1],
                    },
                    {
                        name: '处置中',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color : '#FFFF00',
                            },
                        },
                        itemStyle : {
                            color : '#FFFF00',
                        },
                        data: [2],
                    },
                    {
                        name: '处置完成',
                        type: 'bar',
                        stack: '总量',
                        itemStyle : {
                            color : '#01E3FD',
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color : '#01E3FD',
                            },
                        },
                        data: [1],
                    },
                ],
            },
        },
    ];


}
</script>

<style>

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