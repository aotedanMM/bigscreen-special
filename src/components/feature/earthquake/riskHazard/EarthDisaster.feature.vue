<template>
    <dl class="YJ-panel-dl">
        <dt class="head-dt">
            <span class="title">{{title}}</span>
            <span class="number">{{total}} {{unit}}</span>
        </dt>
        <dd class="body-dd">
            <!--<div class="echart-box" :id="id" :statisticsData="statisticsData" ref="myEchart">
            </div>-->
            <div class="echart-box">
                <bar-chart ref="echarts" :id="id" :option="option"></bar-chart>
            </div>
        </dd>
    </dl>
</template>
<script lang="ts">
    import BarChart from '../../../../components/common/chart/Bar.common.vue';

    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    /**
    *  重点企业、地灾隐患点、重点设备整体的组件
    */
    @Component({
        components: {
            BarChart,
        },
        name: 'EarthDisaster',
    })
    export default class EarthDisaster extends Vue {
        /**
        *   标题
        */
        @Prop() public title!: string;
        /**
        *   容器id
        */
        @Prop() public id!: string;
        /**
        *  echarts的 options
        */
        @Prop() public option!: any;
        /**
        *  总数
        */
        @Prop() public total!: number;
        /**
        *  单位,非必填
        */
        @Prop() public unit?: string;

        public echartsObj: any;
        // 更新optoin

        @Watch('option')
        public changeEach(val: any) {
            if (!this.echartsObj) { return false; }
            this.echartsObj.setOption(val);
        }
        public mounted() {
            const clickOption = this.echartsObj = (this.$refs as any).echarts.echartsObj;
            const colorList = ['#8c0613', '#986d13', '#9fa30e', '#016093'];
            const oldColorList = ['#8c0613', '#986d13', '#9fa30e', '#016093'];
            this.echartsObj.on('click', function(params: any) {
                // 风险隐患排查点击gis预留
                if (params.color !== '#fff') {
                    colorList[params.dataIndex] = '#fff';
                } else {
                    colorList[params.dataIndex] = oldColorList[params.dataIndex];
                }
                clickOption.setOption({
                    series: [
                        {
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color(paramsColor: any) {
                                        const colorNum = colorList.length;
                                        return colorList[paramsColor.dataIndex % colorNum];
                                    },
                                },
                            },
                        },
                    ],
                });
            });
        }
    }
</script>
<style scoped lang="less">
    .YJ-panel-dl {
        //  margin: 2% 0 0 13%;
        margin: 0;
        padding: 0;
        height: 300px;

        .head-dt {
            display: block;
            padding: 0;
            margin-bottom: 2%;
            margin-left: 0;

            .title {
                padding: 3%;
                margin-right: 3%;
                display: inline-block;
                background: url(../../../../assets/img/riskHazard/title.png) no-repeat 0 50%;
                background-size: 90% 90%;
                color: #81feff;
                font-size: 30px;
                text-align: left;
                text-indent: 0;
            }

            .number {
                padding: 2% 0% 2%;
                display: inline-block;
                font-size: 32px;
                color: #ff9100;
                font-style: normal;

            }
        }

        .body-dd {
            padding: 0;
            margin: 0;

            /*padding: 2%;*/
            .echart-box {
                width: 100%;
                height: 180px;
            }
        }
    }
</style>