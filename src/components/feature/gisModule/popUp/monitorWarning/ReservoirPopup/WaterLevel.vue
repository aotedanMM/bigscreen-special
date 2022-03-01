<template>
  <!-- 水库水位仪表盘 -->
  <div class="WaterLevel">
      <div class="body">
          <div class="echarts" ref="echarts"></div>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
@Component({
  name: 'WaterLevel',
})
export default class WaterLevel extends Vue {
    @Prop() public data!: any;  // 接受数据
    private echartsObj: any = null;  // echarts对象
    public mounted() {
        console.log(this.data, 'dddd');
        this.renderEcharts();
    }
    private renderEcharts() {
        let num = this.data.num;
        if (this.data.num === '满库') {
            num = this.data.fldctrlWaterLevel || 0;
        }
        this.echartsObj = (this as any).$echarts.init(this.$refs.echarts);
        const option: any = {
            // tooltip: {
            //     formatter: '{a} <br/>{b} : {c}%',
            // },
            grid: {
                top: '50%',
            },
            series: [
                {
                    name: this.data.name,
                    type: 'gauge',
                    startAngle: 215,
                    endAngle: -35,
                    max: this.data.fldctrlWaterLevel,
                    data: [{value: num, name: this.data.name}],
                    axisLine: {				// 仪表盘轴线(轮廓线)相关配置。
                        show: true,				// 是否显示仪表盘轴线(轮廓线),默认 true。
                        lineStyle: {			// 仪表盘轴线样式。
                            color: this.data.type === 'waterLevel' ? [[0.8, 'rgba(0,255,255,0.8)'], [1, 'rgba(255,0,0,0.8)']] : [[1, 'rgba(0,255,255,0.8)']], 	// 仪表盘的轴线可以被分成不同颜色的多段。每段的  结束位置(范围是[0,1]) 和  颜色  可以通过一个数组来表示。默认取值：[[0.2, '#91c7ae'], [0.8, '#63869e'], [1, '#c23531']]
                            opacity: 0,					// 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                            width: 0,					// 轴线宽度,默认 30。
                            shadowBlur: 0,				// (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                            shadowColor: '#fff',		// 阴影颜色。支持的格式同color。
                        },
                    },

                    splitLine: {			// 分隔线样式。
                        show: false,				// 是否显示分隔线,默认 true。
                        length: 30,				// 分隔线线长。支持相对半径的百分比,默认 30。
                        lineStyle: {			// 分隔线样式。
                            color: '#eee',				// 线的颜色,默认 #eee。
                            opacity: 1,					// 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
                            width: 2,					// 线度,默认 2。
                            type: 'solid',				// 线的类型,默认 solid。 此外还有 dashed,dotted
                            shadowBlur: 0,				// (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                            shadowColor: '#fff',		// 阴影颜色。支持的格式同color。
                        },
                    },
                    pointer: {
                        width: 3, // 指针的宽度
                        length: '100%', // 指针长度，按照半圆半径的百分比
                        color: '#c04d87',
                        // shadowColor : '#c04d87', //默认透明
                        // shadowBlur: 1
                    },
                     itemStyle: {			// 仪表盘指针样式。
                        color: '#c04d87',
                    },
                    axisTick: {				// 刻度(线)样式。
                        show: false,				// 是否显示刻度(线),默认 true。
                    },
                    axisLabel: {			// 刻度标签。
                        show: false,				// 是否显示标签,默认 true。
                    },
                    title: {				// 仪表盘标题。
                        show: true,				// 是否显示标题,默认 true。
                        offsetCenter: [0, '50%'], // 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
                        color: '#e8f4fe',			// 文字的颜色,默认 #333。
                        fontSize: 16,			// 文字的字体大小,默认 15。
                    },
                    detail: {				// 仪表盘详情，用于显示数据。
                        show: true,				// 是否显示详情,默认 true。
                        offsetCenter: [0, '0%'], // 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
                        color: '#faed51',			// 文字的颜色,默认 auto。
                        fontSize: 32,
                        fontFamily: 'Impact',	// 文字的字体大小,默认 15。
                        formatter: '{value}',	// 格式化函数或者字符串

                    },
                },
            ],
        };
        this.echartsObj.setOption(option, true);
    }
    @Watch('data', {deep: true})
    private setdata() {
        this.renderEcharts();
    }
}
</script>

<style lang="less" scoped>
.WaterLevel {
    width: 100%;
    height: 200px;
    padding: 0 10px 0;
    margin-top: 10px;
    background: url('../../../../../../assets/img/reservoirPopup/waterLevelPanel.png') no-repeat;
    background-position: center center;
    // background-size: auto 100%;
    // background: #4A717D;
    .body {
        width: 100%;
        height: 200px;
        .echarts {
            width: 100%;
            height: 100%;
        }
    }
    
}
</style>
