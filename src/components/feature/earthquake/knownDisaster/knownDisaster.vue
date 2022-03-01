<template>
    <!-- 实时灾情组件 -->
    <div class="knownDisaster">
      <p class="title">
      {{ showTitle }}
      <ZoomBtn></ZoomBtn>
      </p>
        <el-scrollbar class="cmp-scrollbar-y" style="height: 99%; margin-top: -10px">
            <!-- <div>
              <ul class="knownDisaster_ul">
                <li class="knownDisaster_ul_li f-txt-com" v-for="(item,key) in getList" :key="key">
                    <div class="knownDisaster_ul_li_details">
                        <i :class="[item.class, 'thumb']"></i>
                        <span class="knownDisaster_ul_li_details_name">{{item.name}}</span>
                        <i class="icon-arrow" :class="[item.arrow > 0?'icon-arrow-up':'', item.arrow < 0?'icon-arrow-down':'']"
                        ></i>
                        <span class="knownDisaster_ul_li_details_value" :class="item.arrow !== 0 && 'scale_value'">{{item.value}}</span>
                        {{item.unit}}
                    </div>
                    <div
                        class="knownDisaster_ul_li_estimates"
                        v-if="item.estimates|| item.estimates === 0"
                    >
                        预估
                        <span class="scale_value">{{item.estimates}}</span>
                        {{item.unit}}
                    </div>
                </li>
              </ul>
            </div> -->
            <div v-if="isIntensityPage">
              <ul class="fristNode" v-for="(item, index) in dataForIntensity" :key="index">
                <li>
                  <div class="frist-node-title" @click="changeShowState('dataForIntensity',index)">
                    <span class="fristNode-Title">{{item.name}}</span>
                    <i :class="item.isShowChild ? '' : 'no-reverse' " v-if="item.type !== 'Intensity_Angle' && item.type !== 'Financial_Loss'"></i>
                    <div v-if="item.type === 'Intensity_Angle' || item.type === 'Financial_Loss'" class="fristNode-value">
                      <span>
                        {{item.value}}
                      </span>
                      <p>{{item.unit}}</p>
                    </div>
                  </div>
                  <ul class="second" v-if="item.type !== 'Intensity_Angle' && item.type !== 'Financial_Loss'" v-show="item.isShowChild">
                    <li v-for="(jtem, jndex) in item.value" :key="jndex">
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
            <div v-if="isIntensityPage" class="substance">
              <ul v-for="(item, index) in dataForSubstance" :key="index" class="fristNode">
                  <li>
                    <div class="frist-node-title" @click="changeShowState('dataForSubstance',index)">
                      <span>{{item.level}}</span>
                      <i :class="item.isShowChild ? '' : 'no-reverse' "></i>
                    </div>
                    <div>
                      <ul class="second" v-show="item.isShowChild">
                        <li v-for="(jtem, jndex) in item.cData" :key="jndex">
                          <span :class="jtem.name.length > 10 ? 'no-marginval' : ''">{{jtem.name}}</span>
                          <span>{{jtem.value}}</span>
                        </li>
                      </ul>
                    </div>
                  </li>
              </ul>
            </div>
        </el-scrollbar>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { KnownDisasterInterface } from '@/interface/feature/earthquake/KnownDisaster';
import ZoomBtn from '../../flood/ZoomBtn.vue';  // 导入最小化组件
import { substanceInfo } from '@/api/installServer';
/**
 * 实时灾情组件
 */
@Component({
  name: 'KnownDisaster',
  components: {
    ZoomBtn, // 缩放按钮
  },
})
export default class KnownDisaster extends Vue {
  @Prop({ default: () => [] }) public list!: KnownDisasterInterface[];
  private showTitle: any = '灾情预估'; // 实时灾情

  private dataForIntensity: any = [ // 灾损数据
  //   {
  //   name: '烈度圈旋转角度',
  //   type: 'Intensity_Angle',
  //   value: '0',
  //   unit: '度',
  // },
  {
    name: '预估人员损伤',
    type: 'Person_Harm',
    isShowChild: true,
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
    name: '预估建筑损毁',
    type: 'Buildings_Demage',
    isShowChild: true,
    value: [
      {
        name: '基本完好',
        value: '0',
        type: 'BasicalIntact',
        unit: '平方米',
      },
      {
        name: '轻微破坏',
        value: '0',
        type: 'MinorDamage',
        unit: '平方米',
      },
      {
        name: '中等破坏',
        value: '0',
        type: 'ModerateDamage',
        unit: '平方米',
      },
      {
        name: '严重破坏',
        type: 'SevereDamage',
        value: '0',
        unit: '平方米',
      },
      {
        name: '完全破坏',
        type: 'CompleteDamage',
        value: '0',
        unit: '平方米',
      },
    ],
  },
  //  {
  //   name: '预估直接经济损失',
  //   type: 'Financial_Loss',
  //   value: '0',
  //   unit: '亿元',
  // }
  ];
  private dataForSubstance: any = []; // 物资信息模型数据
  private isIntensityPage: boolean = false; // 是否显示灾损和物资信息数据
  // private list:
  get getList() {
    return this.list;
  }
  // 是否显示子节点
  private changeShowState(type: string, index: any) {
    if (type === 'dataForSubstance') {
      this.dataForSubstance[index].isShowChild = !this.dataForSubstance[index].isShowChild;
    } else {
      this.dataForIntensity[index].isShowChild = !this.dataForIntensity[index].isShowChild;
    }
  }
  @Watch('$store.state.earthQuake.earthQuakeIntensityData', {deep: true})
  private getIntensityDataForWatch() {
    if (this.$store.state.earthQuake.earthQuakeIntensityData && this.$store.state.earthQuake.earthQuakeIntensityData !== {}) {

      if (!this.$store.state.earthQuake.earthQuakeIntensityData.Service_Info) {
        this.isIntensityPage = false;
        return false;
      }
      this.isIntensityPage = true;
      const data: any = this.$store.state.earthQuake.earthQuakeIntensityData.Service_Info.Parms_Return;
      const params: any = {
        110902 : 'EarthQuake', // 灾害类型	 可写死
        110903 : this.$store.state.earthQuake.earthQuakeIntensityData.Model_Infos.GModel_EQ_Intensity.Parms_Return.ParmsInfo[105202], // 灾害区县 可获取
        110904 : 180, // 灾区面积
        110905 : 3000, // 灾区污水体积
        110906 : Number(this.$store.state.earthQuake.earthQuakeIntensityData.Model_Infos.GModel_EQ_Intensity.Parms_Return.ParmsInfo[105203].split('-')[1]),	// 月份	可获取
        110907 : '雨天', // 天气
        110908 : 5, // 提前期
        110910 : [
          {105801: '麻醉药',
           105802: '1000',
           105803: '20000',
           105804: '0',
           105807: '0',
           105808: '0',
           105809: '0',
           105810: [100, 150, 120, 130, 160]}],
        110920 : data.Person_Harm.Total_Person, // 灾区总人口
        110921 : data.Person_Harm.Dead_Person, // 	死亡人数
        110922 : Number(data.Person_Harm.Slight_Person) + Number(data.Person_Harm.Serious_Person), // 受伤人数
        110924 : data.Person_Harm.Arrange_Person, // 无家可归人数
      };
      substanceInfo.getDataForSubstance(params).then((result: any) => {
        this.$store.commit('earthQuake/setSubstanceData', result.data.data);
        this.dataForSubstance = [];
        const levalArr: any = {
          Import_Level1: '急需物资',
          Import_Level2: '重要物资',
          Import_Level3: '普通物资',
        };
        const tempData = result.data.data.Model_Infos.GModel_Emerg_Demand.Result_Info.Note_Info.Emerg_Demands;
        for (const key of Object.keys(tempData)) {
          const ctempData = JSON.parse(JSON.stringify(tempData[key]));
          const ctempNewArr = [];
          for (const ckey of Object.keys(ctempData)) {
            if (Number(ctempData[ckey].split('(')[0].trim()) !== 0) {
              ctempNewArr.push({
                name: ckey,
                value: ctempData[ckey],
              });
            }
          }
          this.dataForSubstance.push({
            level: '预估' + levalArr[key],
            cData: ctempNewArr,
            isShowChild: false,
          });
        }
      });
      this.dataForIntensity.forEach((item: any, index: any) => {
        if (item.type === 'Intensity_Angle') {
          this.dataForIntensity[index].value = data.Intensity_Angle.Angle_Value;
          this.dataForIntensity[index].unit = data.Intensity_Angle.Angle_Unit;
        } else if (item.type === 'Financial_Loss') {
          this.dataForIntensity[index].value = Number(data.Financial_Loss.Total_FinancialLoss / 100000000).toFixed(2);
        } else {
          item.value.forEach((jtem: any, jndex: any) => {
            this.dataForIntensity[index].value[jndex].value = data[item.type][jtem.type];
          });
        }
      });
    }
  }
  private created() {
    this.getIntensityDataForWatch();
  }
}
</script>

<style lang="less" scoped>
@url: '../../../../assets/img/other/';
/*.knownDisaster_ul_li_details > i.icon-arrow-up {
  background-image: url('../../../../assets/img/gisModule/iconArrowFlag.gif');
}
.knownDisaster_ul_li_details > i.icon-arrow-down {
  background-image: url('../../../../assets/img/gisModule/iconArrowFlag.gif');
  position: relative;
  transform: rotate(180deg);
}*/
.knownDisaster_ul_li_details > i.icon-arrow{
  // position: absolute;
  width: 24px !important;
  height: 40px !important;
  background-size: 100% 100%;
  // left:108px;

}

.knownDisaster_ul_li_details > i {
  width: 30px !important;
  height:30px !important;
  transition: width 1s;
}
.knownDisaster_ul_li_details >  {
  width: 40px !important;
  height: 40px !important;
  margin-right: 12px;
}
.knownDisaster_ul_li {
  white-space: nowrap;
}
.knownDisaster {
  height: 100%;
  // padding: 0 15px 0 24px;
  box-sizing: border-box;

  .title {
    font-weight: 600;
    font-family: 'myHeiti';
    font-size: calc(20px * 1.5);
    color: 00e4ff;
    background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -1px;
    padding-left: 20px;
    font-style: italic;
    margin-bottom:10px;
  }

  &_ul {
    margin: 0;
    padding: 0;
    list-style: none;
    // margin-right: 24px;
    margin: 0 6px 0 10px;

    &_li {
      display: flex;
      justify-content: space-between;
      // font-size: 28px;
      color: #dafbff;
      margin: 0 0 15px;
      align-items: center;
      &:last-child{
        margin-bottom:0;
      }

      &_details {
        width: 60%;
        display: flex;
        align-items: center;

        > i {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          &.damage {
            background: url('@{url}/damage.png') no-repeat center / 100% 100%;
          }

          &.death {
            background: url('@{url}/death.png') no-repeat center / 100% 100%;
          }

          &.hurt {
            background: url('@{url}/hurt.png') no-repeat center / 100% 100%;
          }

          &.resuce {
            background: url('@{url}/resuce.png') no-repeat center / 100% 100%;
          }

          &.transfer {
            background: url('@{url}/transfer.png') no-repeat center / 100% 100%;
          }
        }

        &_name {
          background: url('@{url}/titleBg1.png') no-repeat center / 100% 100%;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          white-space: nowrap;
          padding: 0 5px;
          // margin-right: 10px;
        }

        &_value {
          font-family: 'Impact';
          color: #fff001;
          font-weight: bold;
          // font-size: 28px;
          margin: 0 10px 0 0px;
        }
      }

      &_estimates {
        width: 40%;
        // font-size: 28px;
        text-align: right;
        // margin-right: 20px;

        > span {
          font-family: 'Impact';
          color: #2cf7ff;
          font-weight: bold;
          display: inline-sblock;
        }
      }
    }
  }

  .fristNode {
    color: #dafbff;
    font-size: calc(20px * 1.3);
    text-indent: 14px;
    &:nth-child(1) {
      margin-top: 18px;
      li {
        // display: flex;
        span {
          flex: 1;
        }
        .fristNode-value {
          flex: 1;
          span {
            float: left;
            line-height: 48px;
            font-family: 'Impact';
            color: #2cf7ff;
            font-weight: bold;
            margin: 0 10px 0 0px;
          }
          p {
            text-indent: 10px;
          }
        }
      }
    }
    &:nth-child(2) {
      li {
        span {
          flex: 2;
        }
      }
    }
    &:last-child {
      li {
        // display: flex;
        span {
          flex: 2;
        }
        .fristNode-value {
          flex: 1;
          span {
            float: left;
            line-height: 48px;
            font-family: 'Impact';
            color: #2cf7ff;
            font-weight: bold;
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
    padding-left: 23px;
    li {
      margin-bottom: 3px;
      background: url("../../../../assets/img/halfScreen/halflist/listbg.png")
      no-repeat -5px 50%;
      margin-bottom: 9px;
      span {
        float: left;
        &:nth-child(2) {
          line-height: 42px;
          font-family: 'Impact';
          color: #2cf7ff;
          font-weight: bold;
        }
      }
    }
  }
  .frist-node-title {
    display: flex;
    background: url('../../../../assets/img/halfScreen/halflist/titleline.png') no-repeat;
    width: 100%;
    height: 45px;
    background-size: 100% auto;
    line-height: 48px;
    i {
      display: block;
      width: 20px;
      height: 20px;
      margin-top: 14px;
      cursor: pointer;
      background: url("../../../../assets/img/halfScreen/halflist/open.png") 50% 50% no-repeat;
      transition: transform .3s;
    }
    .no-reverse {
      transform: scale(1, -1);
    }
  }
  .substance { // 经兴民总确认，数据之间不需要间隔
    .fristNode {
      &:nth-child(1) {
        margin-top: 0px;
      }
    }
    .second {
      span {
        float: none;
        &:nth-child(2) {
          margin-right: 0px;
          margin-left: 10px;
        }
      }
    }
    .no-marginval {
      margin-right: 0;
    }
  }
}

.cmp-scrollbar-y .el-scrollbar__wrap {
  overflow-x: hidden;
  // margin-right: -18px !important;
}
</style>
