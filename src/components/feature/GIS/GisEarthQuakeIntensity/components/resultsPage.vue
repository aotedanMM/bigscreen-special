<template>
  <div class="ComputePage">
    <ul class="fristNode" v-for="(item, index) in computeData" :key="index">
      <li>
        <span>{{item.name}}</span>
        <div v-if="item.type === 'Intensity_Angle' || item.type === 'Financial_Loss'">
          <span>
            {{item.value}}
          </span>
          <p>{{item.unit}}</p>
        </div>
        <ul class="second" v-if="item.type !== 'Intensity_Angle' && item.type !== 'Financial_Loss'">
          <li  v-for="(jtem, jndex) in item.value" :key="jndex">
            <span>
              {{jtem.name}}
            </span>
            <span>
              {{jtem.value}}
            </span>
            <p>
              {{jtem.unit}}
            </p>
          </li>
        </ul>        
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'ResultsPage',
})
export default class ResultsPage extends Vue {
  @Prop() private resultData: any;

  private computeData: any = [{
    name: '烈度圈旋转角度',
    type: 'Intensity_Angle',
    value: '0',
    unit: '度',
  }, {
    name: '人员损伤',
    type: 'Person_Harm',
    value: [
      {
        name: '烈度圈总人口',
        type: 'Total_Person',
        value: '0',
        unit: '人',
      },
      {
        name: '安置人数',
        type: 'Arrange_Person',
        value: '0',
        unit: '人',
      },
      {
        name: '轻伤人数',
        type: 'Slight_Person',
        value: '0',
        unit: '人',
      },
      {
        name: '重伤人数',
        type: 'Serious_Person',
        value: '0',
        unit: '人',
      },
      {
        name: '死亡人数',
        type: 'Dead_Person',
        value: '0',
        unit: '人',
      },
    ],
  }, {
    name: '建筑损毁',
    type: 'Buildings_Demage',
    value: [
      {
        name: '基本完好',
        value: '0',
        type: 'BasicalIntact',
        unit: '万平方米',
      },
      {
        name: '轻微破坏',
        value: '0',
        type: 'MinorDamage',
        unit: '万平方米',
      },
      {
        name: '中等破坏',
        value: '0',
        type: 'ModerateDamage',
        unit: '万平方米',
      },
      {
        name: '严重破坏',
        type: 'SevereDamage',
        value: '0',
        unit: '万平方米',
      },
      {
        name: '完全破坏',
        type: 'CompleteDamage',
        value: '0',
        unit: '万平方米',
      },
    ],
  }, {
    name: '直接经济损失',
    type: 'Financial_Loss',
    value: '0',
    unit: '亿元',
  }];

  private created() {
    const data: any = this.resultData.Service_Info.Parms_Return;
    this.computeData.forEach((item: any, index: any) => {
      if (item.type === 'Intensity_Angle') {
        this.computeData[index].value = data.Intensity_Angle.Angle_Value;
        this.computeData[index].unit = data.Intensity_Angle.Angle_Unit;
      } else if (item.type === 'Financial_Loss') {
        this.computeData[index].value = Number(data.Financial_Loss.Total_FinancialLoss / 100000000).toFixed(2);
      } else {
        if (item.type === 'Buildings_Demage') {
          item.value.forEach((jtem: any, jndex: any) => {
            this.computeData[index].value[jndex].value = Number(data[item.type][jtem.type] / 10000).toFixed(2);
          });
        } else {
          item.value.forEach((jtem: any, jndex: any) => {
            this.computeData[index].value[jndex].value = data[item.type][jtem.type];
          });
        }
      }
    });
  }
}
</script>
<style scoped lang="less">
.ComputePage {
  width: 100%;
  .fristNode {
    color: #dafbff;
    font-size: 20px;
    margin-bottom: 5px;
    &:nth-child(1) {
      li {
        display: flex;
        span {
          flex: 1;
        }
        div {
          flex: 1;
          span {
            float: left;
            line-height: 28px;
          }
          p {
            text-indent: 10px;
          }
        }
      }
    }
    &:last-child {
      li {
        display: flex;
        span {
          flex: 1;
        }
        div {
          flex: 1;
          span {
            float: left;
            line-height: 28px;
          }
          p {
            text-indent: 10px;
          }
        }
      }
    }
    
  }
  .second {
    padding-top: 5px;
    li {
      display: flex;
      margin-bottom: 8px;
      span {
        flex: 1;
        &:nth-child(1) {
          flex: 2;
        }
        &:nth-child(2) {
          line-height: 28px;
        }
      }
      p {
        flex: 1;
      }
    }
  }
}
</style>
