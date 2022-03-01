<template>
    <div class="ryaz">
        <div class="cz" v-if='showFalse'> 
            <span>安置容量充足</span>
        </div>
        <div class="bcz" v-if='!showFalse'>
            <span>安置容量不足</span>
        </div>
        <div style="height:270px;">
            <radar-chart :id='id'
            :option='option' ></radar-chart>
        </div>
    </div>
</template>
<style scoped lang="less">
    .ryaz {
        padding: 5px 10px;
        height: 270px;
    }
    .cz, .bcz{
        color:#06ebfd;
        height: 30px;
        width: 98%;
        margin-right: auto;
        margin-left: auto;
        line-height: 50px;
        font-size: 26px;
        padding-left: 26px;
        margin-top: -33px;
    }
</style>

<script lang='ts' >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
// import RadarChart from '@/views/common/chart/RadarChartDemo.vue'
import RadarChart from '@/components/common/chart/Radar.common.vue';
import { pushDataRequestServe } from '@/api/installServer';
// 人员安置demo
@Component({
    name : 'RadarChartCom',
    components: {
        RadarChart,
    },
})
export default class RadarChartCom extends Vue {
     private id = 'radarChartDemoContainer' ;
     private optionNoData = {
        radar: [
            {
                indicator: [
                    {
                        name : '未安置人数',
                        max : 100 ,
                        data : 0 ,
                    },
                    {
                        name : '剩余安置容量',
                        max : 140,
                        data : 0 ,
                    },
                    {
                        name : '安置率' ,
                        max : 130 ,
                        data : 0 ,
                    },
                ],
                name: {
                    show: true,
                    fontFamily: '微软雅黑',
                    formatter: (d: any, a: any) => {
                        const unit = d === '安置率' ? '%' : '人';
                        const len = d.length;
                        if (len > 5) {
                            d = d.substr(0, 3) + '\n' + d.substr(3, 3) ;
                        }
                        return `{a|${a.data}${unit}}\n{b|${d}}`;
                    },
                    rich: {
                        a: {
                            fontSize: 25,
                            color:  ' rgba(6, 235, 253, 1)',
                            align: 'center',
                            padding: [4, 0],
                        },
                        b: {
                            fontSize: 25,
                            color:  'rgba(198 ,214 ,233 ,0.7 )',
                        },
                    },
                },
                nameGap: 10,
                center: ['50%', '60%'] ,
                radius: 65 ,
                startAngle: 90 ,
                splitNumber: 3 ,
                shape: 'circle' ,
                splitArea: {
                    areaStyle: {
                        color: [ 'rgba(32,49,68,0.57)' , 'rgba(32,49,68,0.57)' , 'rgba(32,49,68,0.0)' ],
                        shadowColor: 'rgba(0,0,0,0.3)' ,
                        shadowBlur: 10 ,
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(6,235,253,.8)',
                        type: 'solid',
                    },
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(6,235,253,.8)',
                        type: 'dashed',
                    },
                },
            },
        ],
        series: [
            {
                name: '雷达图',
                type: 'radar',
                itemStyle: {
                    color: 'rgba(6,235,253,1)',
                },
                lineStyle: {
                    color: 'rgba(6,235,253,.1)',
                },
                areaStyle: {
                    color: 'rgba(6,235,253,.43)',
                },
                data: [
                    {
                        value: [0, 0, 0],
                        name: ['未安置人数', '剩余安置容量', '安置率'],
                        symbol: 'circle',
                        symbolSize: 10 ,
                    },
                ],
            },
        ],
    };

    private option = this.optionNoData;
    private showFalse = false;

    private placementData: any = {
        totalCapacity: 0,
        totalCapacityPlaced: 0,
        totalPlacement: 0,
        totalPlacementVictims: 0,
    };

    @Watch('$store.state.eventPushStore.SEND_PERSONNELPLACEMENT')
    private eventChange(val: any) {
        if (val > 0) {
            this.getData();
        } else if (val < 0) {
            this.option = this.optionNoData;
        }
    }

    private created() {
        if (this.$store.state.eventPushStore.SEND_PERSONNELPLACEMENT > -1) {
            this.getData();
        }
    }

    private async getData() {
        const eventId = this.$store.state.eventPushStore.eventId; // 事件id
        const processId = 'SEND_PERSONNELPLACEMENT';  // 安置id
        const { data }: any = await pushDataRequestServe.getPushDataByIds(eventId, processId );
        const newData = JSON.parse(data.content)[0].data;
        const placeData = JSON.parse(newData).event.list;
        this.placementData.totalCapacity = 0;
        this.placementData.totalCapacityPlaced = 0;
        this.placementData.totalPlacement = 0;
        this.placementData.totalPlacementVictims = 0;
        for (const i of placeData) {
            this.placementData.totalCapacity! += i.totalCapacity;
            this.placementData.totalCapacityPlaced! += i.totalCapacityPlaced;
            this.placementData.totalPlacement! += i.totalPlacement;
            this.placementData.totalPlacementVictims! += i.totalPlacementVictims;
        }
        const placeInt: any = ((this.placementData.totalPlacementVictims / this.placementData.totalCapacity * 100)).toFixed(0);
        this.option = {
            radar: [
                {
                    indicator: [
                        {
                            name : '未安置人数',
                            max : this.placementData.totalPlacement ,
                            data : (this.placementData.totalPlacement - this.placementData.totalPlacementVictims),
                        },
                        {
                            name : '剩余安置容量',
                            max : this.placementData.totalCapacity,
                            data : (this.placementData.totalCapacity - this.placementData.totalPlacementVictims),
                        },
                        {
                            name : '安置率' ,
                            max : 100 ,
                            data : placeInt,
                        },
                    ],
                    name: {
                        show: true,
                        fontFamily: '微软雅黑',
                        formatter: (d: any, a: any) => {
                            const unit = d === '安置率' ? '%' : '人';
                            const len = d.length;
                            if (len > 5) {
                                d = d.substr(0, 3) + '\n' + d.substr(3, 3) ;
                            }
                            return `{a|${a.data}${unit}}\n{b|${d}}`;
                        },
                        rich: {
                            a: {
                                fontSize: 25,
                                color:  ' rgba(6, 235, 253, 1)',
                                align: 'center',
                                padding: [4, 0],
                            },
                            b: {
                                fontSize: 25,
                                color:  'rgba(198 ,214 ,233 ,0.7 )',
                            },
                        },
                    },
                    nameGap: 10,
                    center: ['50%', '60%'] ,
                    radius: 65 ,
                    startAngle: 90 ,
                    splitNumber: 3 ,
                    shape: 'circle' ,
                    splitArea: {
                        areaStyle: {
                            color: [ 'rgba(32,49,68,0.57)' , 'rgba(32,49,68,0.57)' , 'rgba(32,49,68,0.0)' ],
                            shadowColor: 'rgba(0,0,0,0.3)' ,
                            shadowBlur: 10 ,
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(6,235,253,.8)',
                            type: 'solid',
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(6,235,253,.8)',
                            type: 'dashed',
                        },
                    },
                },
            ],
            series: [
                {
                    name: '雷达图',
                    type: 'radar',
                    itemStyle: {
                        color: 'rgba(6,235,253,1)',
                    },
                    lineStyle: {
                        color: 'rgba(6,235,253,.1)',
                    },
                    areaStyle: {
                        color: 'rgba(6,235,253,.43)',
                    },
                    data: [
                        {
                            value: [(this.placementData.totalPlacement - this.placementData.totalPlacementVictims), (this.placementData.totalCapacity - this.placementData.totalPlacementVictims), placeInt],
                            name: ['未安置人数', '剩余安置容量', '安置率'],
                            symbol: 'circle',
                            symbolSize: 10 ,
                        },
                    ],
                },
            ],
        };
    }
}
</script>