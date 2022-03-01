<template>
  <!-- 队伍覆盖率 -->
  <div :id="echartsID" class="teamCoverage" ref="eachar"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as echarts from 'echarts';

interface TeamCoverageInterface {
  name: string[];
  value: number[];
  notPlacedNum: number;
  total: number;
  capacity: number;
}

/**
 * 队伍覆盖率
 */
@Component({
  name: 'TeamCoverage',
  components: {},
})
export default class TeamCoverage extends Vue {
  @Prop()
  public data!: TeamCoverageInterface;

  private echartsID =
    'echarts' + +new Date() + Math.floor(Math.random() * 1000);
  private ehcartsObj: any;

  @Watch('data')
  private dataWatch() {
    this.init();
  }

  private getOption(): any {
    if (this.data && this.data.name && this.data.name.length > 0) {
      return {
        radar: [
          {
            indicator: this.data.name.map((item: any, index: number) => {
              const obj = {
                name: item,
                max: 0,
                data: {},
              };

              switch (index) {
                case 0:
                  obj.max = this.data.total;
                  break;
                case 1:
                  obj.max = this.data.capacity;
                  break;
                default:
                  obj.max = 100;
                  break;
              }

              // obj.max = index==2 ? 100 : totalNum;
              obj.data = this.data.value[index];
              return obj;
            }),
            name: {
              show: true,

              fontFamily: '微软雅黑',
              formatter: (d: any, a: any) => {
                const unit = d === '覆盖率' ? '%' : '人';
                const len = d.length;
                if (len > 5) {
                  d = d.substr(0, 5) + '\n' + d.substr(5);
                }
                return `{a|${a.data}${unit}}\n{b|${d}}`;
              },
              rich: {
                a: {
                  fontSize: 20,
                  color: 'rgba(6,235,253,1)',
                  align: 'center',
                },
                b: {
                  fontSize: 20,
                  color: 'rgba(198,214,233,0.7)',
                  padding: [2, 25],
                },
              },
            },
            nameGap: 10,
            center: ['50%', '50%'],
            radius: 55,
            startAngle: 30,
            splitNumber: 3,
            shape: 'circle',
            splitArea: {
              areaStyle: {
                color: [
                  'rgba(32,49,68,0.57)',
                  'rgba(32,49,68,0.57)',
                  'rgba(32,49,68,0.0)',
                ],
                shadowColor: 'rgba(0,0,0,0.3)',
                shadowBlur: 5,
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
                value: this.data.value,
                name: this.data.name,
                symbol: 'circle',
                symbolSize: 10,
              },
            ],
          },
        ],
      };
    } else {
      return null;
    }
  }

  private init() {
    const div = document.getElementById(this.echartsID) as HTMLDivElement;
    this.ehcartsObj = echarts.init(div);
    const option = this.getOption();
    if (option) {
      this.ehcartsObj.setOption(option);
    }
  }
  private mounted() {
    this.init();
  }
}
</script>

<style lang="less" scoped>
.teamCoverage {
  height: 100%;
}
</style>