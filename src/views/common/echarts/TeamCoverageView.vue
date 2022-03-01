<!--非常态（救援进展)—— 队伍覆盖-->
<template>
  <div class="ca-echart-loop-wrap">
    <div class="title-contain">
      <span class="dw-title">队伍覆盖率</span>
      <span class="dw-number">10%</span>
    </div>
    <TeamCoverage :option="option" :data="data" class="teamCoverage-wrap"></TeamCoverage>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import TeamCoverage from '@/components/feature/earthquake/teamCoverage/TeamCoverage.teature.vue';
@Component({
  name: 'TeamCoverageView',
  components: {
    TeamCoverage,
  },
})
export default class TeamCoverageView extends Vue {
  public id = 'TeamCoverage-echart';
  public data = {
    name: ['江安县', '长宁县', '高县', '兴文县', '珙县'],
    value: [25, 60, 0, 15, 10],
    notPlacedNum: 10, // 队伍覆盖率
    total: 110,
    capacity: 60, // 容量最大值
  };

  public option = {
    radar: [
      {
        indicator: this.data.name.map((item, index) => {
          const obj = { name: item, max: 0, data: 0 };
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
              color: '#d2e1ec',
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
            color: '#d2e1ec',
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
        /*   label:{
                           show:true,
                           position:'outside',

                           textStyle:{
                               fontSize: 28,
                               color:"rgba(6,235,253,1)",
                               fontFamily:'微软雅黑'
                           },

                           formatter:function (params,index) {

                           }
                       },*/
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
}
</script>
<style lang='less' scoped>
// @import url(); 引入公共css类
.ca-echart-loop-wrap {
  padding:0 10px;
  height: 100%;
  margin-left: -20px;
}
.title-contain {
  margin-top:-10px;
  height: 65px;
  line-height: 69px;
  background: url('../../../assets/img/decisionSupport/fieldTeam/title-bg.png') no-repeat left tops;
  background-size:100% 100%;
}
.dw-title {
  display: inline-block;
  padding-right: 4px;
  color: orange;
  font-size: 26px;
  padding-left: 56px;
  
}
.dw-number {
  display:  inline-block;
  font-size: 26px;
  color: #afaf1b;
  padding-left: 20px;
  font-weight: bold;
}
.teamCoverage-wrap{
  height: calc(100% - 30px)
}
</style>