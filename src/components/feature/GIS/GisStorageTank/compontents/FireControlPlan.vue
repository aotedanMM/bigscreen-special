/** author: chenyu time:2020-03-25 **/
<template>
  <div style="height: 100%;">
    <div class="FireControlPlan" v-if="true">
      <el-scrollbar style="height: 100%;">
        <el-main style="overflow: hidden;">
          <el-row>
            <el-col :span="24">
              <div class="title">
                指挥作战分区
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="content">
                <table border="0">
                  <tr class="header">
                    <th>分区含义</th>
                    <th>面积</th>
                  </tr>
                  <tr
                    v-for="(item, index) in CommandDivisionData"
                    :key="item + index"
                    class="formList"
                    :class="[index % 2 == 0 ? '' : 'tdStyle']"
                  >
                    <td style="border-right:1px solid #07a4d7">
                      {{ item.date}}
                    </td>
                    <td>{{ item.name }}</td>
                  </tr>
                </table>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="title">
                泡沫消防剂选型
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="FoamAgent content">
                <span v-for="(item, index) in FoamAgent" :key="item + index"
                  >{{ item }}&nbsp;&nbsp;</span
                >
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="title">
                消防用液信息
              </div>
            </el-col>
          </el-row>
          <!-- <el-row>
        <el-col :span="24">
          <div class="content">
            <el-select v-model="LiquidFireValue" placeholder="请选择">
              <el-option
                v-for="item in LiquidFireOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-col>
      </el-row> -->
          <el-row>
            <el-col :span="24">
              <div class="content">
                <table border="0">
                  <tr class="header">
                    <th>混合比</th>
                    <th>施用时间</th>
                    <th>使用强度</th>
                    <th>混合液总量</th>
                    <th>60%冗余</th>
                    <th>泡沫原液量</th>
                    <th>发泡用水量</th>
                  </tr>
                  <tr
                    v-for="(item, index) in LiquidFireData"
                    :key="item + index"
                    class="formList"
                    :class="[index % 2 == 0 ? '' : 'tdStyle']"
                  >
                    <td
                      style="border-right:1px solid #07a4d7"
                      :title="item.MixingRatio"
                    >
                      {{ item.MixingRatio }}
                    </td>
                    <td
                      style="border-right:1px solid #07a4d7"
                      :title="item.UseOftime"
                    >
                      {{ item.UseOftime }}(min)
                    </td>
                    <td
                      style="border-right:1px solid #07a4d7"
                      :title="item.UseOfStrength"
                    >
                      {{ item.UseOfStrength }}
                    </td>
                    <td
                      style="border-right:1px solid #07a4d7"
                      :title="item.TotalMixture"
                    >
                      {{ item.TotalMixture }}
                    </td>
                    <td
                      style="border-right:1px solid #07a4d7"
                      :title="item.redundant"
                    >
                      {{ item.redundant }}
                    </td>
                    <td
                      style="border-right:1px solid #07a4d7"
                      :title="item.VolumeOfFoam"
                    >
                      {{ item.VolumeOfFoam }}
                    </td>
                    <td>{{ item.FoamingWater }}</td>
                  </tr>
                </table>
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <div class="title">
                冷却用水信息
              </div>
            </el-col>
          </el-row>
          <!-- <el-row>
        <el-col :span="24">
          <div class="content">
            <el-select
              v-model="CoolingWaterInformationValue"
              placeholder="请选择"
            >
              <el-option
                v-for="item in CoolingWaterInformationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-col>
      </el-row> -->
          <el-row>
            <el-col :span="24">
              <div class="content">
                <table border="0">
                  <tr class="header">
                    <th>罐体</th>
                    <th>储罐类型</th>
                    <th>冷却用水量</th>
                    <th>冷却用水流量</th>
                    <!--<th>描述</th>-->
                  </tr>
                  <tr
                    v-for="(item, index) in CoolingWaterInformationData"
                    :key="item + index"
                    class="formList"
                    :class="[index % 2 == 0 ? '' : 'tdStyle']"
                  >
                    <td
                      style="border-right:1px solid #07a4d7"
                      :title="item.StorageType"
                    >
                      {{ item.StorageType }}
                    </td>
                    <td
                      style="border-right:1px solid #07a4d7"
                      :title="item.StorageType"
                    >
                      {{ item.StorageType }}
                    </td>
                    <td
                      style="border-right:1px solid #07a4d7"
                      :title="item.ColdWater_Amount"
                    >
                      {{ item.ColdWater_Amount.toFixed(2) }}(t)
                    </td>
                    <td
                      style="border-right:1px solid #07a4d7"
                      :title="item.ColdWater_Flow"
                    >
                      {{ item.ColdWater_Flow.toFixed(2) }}(t)
                    </td>
                    <!--<td>{{ item.Desc }}</td>-->
                  </tr>
                </table>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="recalculate_felxBox">
                <div class="recalculate" @click="FnRecount()">
                  <div class="recalculate_img"></div>
                  <div class="recalculate_font">重新计算</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-scrollbar>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import RiskAnalysisDetil from '@/components/feature/gisModule/popUp/riskAnalysisDetil.vue';
import { gisStorageTankServer } from '@/api/installServer';
@Component({
  name: 'FireControlPlan',
  components: {},
})
export default class FireControlPlan extends Vue {
  @Prop() private GetLargeTankFireModelData: any;
  @Prop() private GetLargeTankFireAnalysisModelData: any;
  // @Prop() private GetLargeTankFireModelDataTwo: any;
  private RiskAnalysisVariable: any; // @Prop()
  private msg: any = '消防方案';
  private CommandDivisionData: any = [
    {
      date: '消防员禁入区',
      name: '8220.62(平方米)',
    },
    {
      date: '消防车停靠边界',
      name: '14561.42(平方米)',
    },
    {
      date: '消防员可停留区',
      name: '44531.52(平方米)',
    },
    {
      date: '警戒区',
      name: '74531.52(平方米)',
    },
  ];
  private FoamAgentValue: any = '';
  private FoamAgentOptions: any = [
    {
      value: '选项1',
      label: '黄金糕',
    },
    {
      value: '选项2',
      label: '双皮奶',
    },
    {
      value: '选项3',
      label: '蚵仔煎',
    },
    {
      value: '选项4',
      label: '龙须面',
    },
    {
      value: '选项5',
      label: '北京烤鸭',
    },
  ];
  private LiquidFireValue: any = '';
  private LiquidFireOptions: any = [
    {
      value: '选项1',
      label: '黄金糕',
    },
    {
      value: '选项2',
      label: '双皮奶',
    },
    {
      value: '选项3',
      label: '蚵仔煎',
    },
    {
      value: '选项4',
      label: '龙须面',
    },
    {
      value: '选项5',
      label: '北京烤鸭',
    },
  ];
  private LiquidFireData: any = [];
  private CoolingWaterInformationValue: any = '';
  private CoolingWaterInformationOptions: any = [
    {
      value: '选项1',
      label: '黄金糕',
    },
    {
      value: '选项2',
      label: '双皮奶',
    },
    {
      value: '选项3',
      label: '蚵仔煎',
    },
    {
      value: '选项4',
      label: '龙须面',
    },
    {
      value: '选项5',
      label: '北京烤鸭',
    },
  ];
  private CoolingWaterInformationData: any = [];
  private FoamAgent: any = ''; // 泡沫剂选型
  private FnRecount(): any {
    this.messsageBus.emit('recount', 'GisInputPanle');
  }
  @Watch('GetLargeTankFireAnalysisModelData')
  private FnRenderData(): void {
    this.FoamAgent = this.GetLargeTankFireAnalysisModelData.data.data.Service_Info.Parms_Return.FireFighting_Info.Foamite_Select;
    // console.log('泡沫消防剂选型', this.FoamAgent);

    const UseOftime: any = this.GetLargeTankFireAnalysisModelData.data.data
      .Service_Info.Parms_Return.FireFighting_Info.Foamite_Time;
    const UseOfStrength: any = this.GetLargeTankFireAnalysisModelData.data.data
      .Service_Info.Parms_Return.FireFighting_Info.Foamite_Strength;
    // const UseOfStrength1: any = UseOfStrength.toString().substr(
    //   0,
    //   UseOfStrength.indexOf('.'),
    // );
    const UseOfStrength1: any = UseOfStrength ? parseInt(UseOfStrength, 10) : 0;
    const TotalMixture: any = this.GetLargeTankFireAnalysisModelData.data.data
      .Service_Info.Parms_Return.FireFighting_Info.FireFighting_liquid
      .Foam_Mixture_Amount;
    // const TotalMixture1: any = TotalMixture.substr(
    //   0,
    //   TotalMixture.indexOf('.'),
    // );
    const TotalMixture1: any = TotalMixture ? parseInt(TotalMixture, 10) : 0;
    const redundant1: any = this.GetLargeTankFireAnalysisModelData.data.data
      .Service_Info.Parms_Return.FireFighting_Info.FireFighting_liquid
      .Foam_Surplus_Amount;
    // const redundant: any = redundant1.substr(0, redundant1.indexOf('.'));
    const redundant: any = redundant1 ? parseInt(redundant1, 10) : 0;
    const VolumeOfFoam13: any = this.GetLargeTankFireAnalysisModelData.data.data
      .Service_Info.Parms_Return.FireFighting_Info.FireFighting_liquid[
      'Foam_Amount_3%'
    ];
    // const VolumeOfFoam3: any = VolumeOfFoam13.substr(
    //   0,
    //   VolumeOfFoam13.indexOf('.'),
    // );
    const VolumeOfFoam3: any = VolumeOfFoam13 ? parseInt(VolumeOfFoam13, 10) : 0;
    const FoamingWater13: any = this.GetLargeTankFireAnalysisModelData.data.data
      .Service_Info.Parms_Return.FireFighting_Info.FireFighting_liquid[
      'Foam_Water_Amount_3%'
    ];
    // const FoamingWater3: any = FoamingWater13.substr(
    //   0,
    //   FoamingWater13.indexOf('.'),
    // );
    const FoamingWater3: any = FoamingWater13 ? parseInt(FoamingWater13, 10) : 0;
    const VolumeOfFoam26: any = this.GetLargeTankFireAnalysisModelData.data.data
      .Service_Info.Parms_Return.FireFighting_Info.FireFighting_liquid[
      'Foam_Amount_6%'
    ];
    // const VolumeOfFoam6: any = VolumeOfFoam26.substr(
    //   0,
    //   VolumeOfFoam26.indexOf('.'),
    // );
    const VolumeOfFoam6: any = VolumeOfFoam26 ? parseInt(VolumeOfFoam26, 10) : 0;
    const FoamingWater26: any = this.GetLargeTankFireAnalysisModelData.data.data
      .Service_Info.Parms_Return.FireFighting_Info.FireFighting_liquid[
      'Foam_Water_Amount_6%'
    ];
    // const FoamingWater6: any = FoamingWater26.substr(
    //   0,
    //   FoamingWater26.indexOf('.'),
    // );
    const FoamingWater6: any = FoamingWater26 ? parseInt(FoamingWater26, 10) : 0;
    const LiquidFireData3: any = {
      MixingRatio: '3%',
      UseOftime,
      UseOfStrength: UseOfStrength1 + '(L/min/m²)', // UseOfStrength,
      TotalMixture: TotalMixture1 + '(t)', // TotalMixture,
      redundant: redundant + '(t)', // redundant1,
      VolumeOfFoam: VolumeOfFoam3 + '(t)', // this.GetLargeTankFireAnalysisModelData.data.Service_Info.Parms_Return.FireFighting_Info.FireFighting_liquid['Foam_Amount_3%'],
      FoamingWater: FoamingWater3 + '(t)', // this.GetLargeTankFireAnalysisModelData.data.Service_Info.Parms_Return.FireFighting_Info.FireFighting_liquid['Foam_Water_Amount_3%'],
    };
    const LiquidFireData6: any = {
      MixingRatio: '6%',
      UseOftime,
      UseOfStrength: UseOfStrength1 + '(L/min/m²)', // UseOfStrength,
      TotalMixture: TotalMixture1 + '(t)', // TotalMixture,
      redundant: redundant + '(t)', // redundant1,
      VolumeOfFoam: VolumeOfFoam6 + '(t)', // this.GetLargeTankFireAnalysisModelData.data.Service_Info.Parms_Return.FireFighting_Info.FireFighting_liquid['Foam_Amount_6%'],
      FoamingWater: FoamingWater6 + '(t)', // this.GetLargeTankFireAnalysisModelData.data.Service_Info.Parms_Return.FireFighting_Info.FireFighting_liquid['Foam_Water_Amount_6%'],
    };
    this.LiquidFireData.push(LiquidFireData3, LiquidFireData6);
    this.CoolingWaterInformationData = [];
    // console.log('消防用液信息', this.LiquidFireData);
    // this.CoolingWaterInformationData.push(
    //   this.GetLargeTankFireAnalysisModelData.data.data.Service_Info.Parms_Return
    //     .FireFighting_Info.ColdWater['CloserStorage'],
    //   // ,this.GetLargeTankFireAnalysisModelData.data.Service_Info.Parms_Return.FireFighting_Info.ColdWater['CloserStorage-2'],
    // );
    this.CoolingWaterInformationData = this.GetLargeTankFireAnalysisModelData.data.data.Service_Info.Parms_Return
        .FireFighting_Info.ColdWater.CloserStorage;
    // console.log('冷却用水信息', this.CoolingWaterInformationData);
  }
  // 获取地图功能
  private getComponent() {
    const gisModules = this.$ioc.resolve('GISFactory-map');
    const component = gisModules.commonFactory.getComponent('riskAnalysis');
    return component;
  }
  @Watch('GetLargeTankFireModelData')
  private watchModelDataChange() {
    this.FnRenderDataClick('Combat');
  }
  private FnRenderDataClick(val: any): any {
    if (this.GetLargeTankFireModelData && this.GetLargeTankFireModelData.data && this.GetLargeTankFireModelData.data.data && this.GetLargeTankFireModelData.data.data.Model_Infos) {

      this.getComponent().getList(
        this.GetLargeTankFireModelData,
        val,
        this.$store.state.eventPushStore.eventDataList,
      );
      const res: any = this.getComponent().getArea();
      this.CommandDivisionData = [
        {
          date: '消防员禁入区',
          name: res.death ? res.death + '平方米' : 0 + '平方米',
        },
        {
          date: '消防车停靠边界',
          name: res.seriousInjury ? res.seriousInjury + '平方米' : 0 + '平方米',
        },
        {
          date: '消防员可停留区',
          name: res.minorWound ? res.minorWound + '平方米' : 0 + '平方米',
        },
        {
          date: '警戒区',
          name: res.feel ? res.feel + '平方米' : 0 + '平方米',
        },
      ];
      return res;
    }
  }
  private onShowPopup1(info: any) {
    this.RiskAnalysisVariable = info;
    this.onShowPopup();
  }
  // @Watch('RiskAnalysisVariable')
  private onShowPopup() {
    const info = this.RiskAnalysisVariable;
    const self = this;
    const popup = new RiskAnalysisDetil({
      el: '#' + info.containerId,
      data() {
        return {
          data: info,
          config: {},
          dataTime: '',
          area: '',
          downwindDistance: '',
        };
      },
      methods: {
        close() {
          // self.getComponent().clear();
          self.getComponent().closePopup();
        },
        FnDataTime() {
          const eventInfo = self.$store.state.eventPushStore.eventDataList;
          const eventReporttime = eventInfo.eventReporttime;
          const dataTime = new Date(eventReporttime.replace('-', '/'));
          const reTimestamp = dataTime.getTime();
          const NowDate = new Date();
          const NowTimestamp = NowDate.getTime();
          const res = NowTimestamp - reTimestamp;
          const res1 = Math.floor(res / 1000) / 60 / 60;
          this.dataTime = res1.toFixed(2);
        },
        returnFloat(value: any) {
          let val: any = Math.round(parseFloat(value) * 100) / 100;
          const s = val.toString().split('.');
          if (s.length === 1) {
            val = val.toString() + '.00';
            return val;
          }
          if (s.length > 1) {
            if (s[1].length < 2) {
              val = val.toString() + '0';
            }
            return val;
          }
        },
      },
      created() {
        // this.FnDataTime();
        // switch(info.data.typeName) {
        //  switch (
        //   info.data.attributeSet.attributes[2].value.Attribute.Level_Tag
        //  ) {
        //    case 'Combat_Lv4-1': // '消防员禁入区'
        //     this.area = self.CommandDivisionData[0].name;
        //     break;
        //    case 'Combat_Lv3-1': // '消防车停靠边界':
        //     this.area = self.CommandDivisionData[1].name;
        //     break;
        //    case 'Combat_Lv2-1': // '消防员可停留区':
        //     this.area = self.CommandDivisionData[2].name;
        //     break;
        //    case 'Combat_Lv1-1': // '警戒区':
        //     this.area = self.CommandDivisionData[0].name;
        //     break;
        // }
        // console.log(info,'数据----------------------------')
        this.area = self.RiskAnalysisVariable.data.attributeSet.attributes[3].value + '平方米';
        this.downwindDistance =
        info.data.attributeSet.attributes[2].value.Attribute.MaxRadius;
      },
    });
  }
  // 方法(保留两位小数，不足补零)
  private returnFloat(value: any): any {
    let val: any = Math.round(parseFloat(value) * 100) / 100;
    const s = val.toString().split('.');
    if (s.length === 1) {
      val = val.toString() + '.00';
      return val;
    }
    if (s.length > 1) {
      if (s[1].length < 2) {
        val = val.toString() + '0';
      }
      return val;
    }
  }
  // @Watch('GetLargeTankFireModelData')
  // private FnRenderDataTable(): void {
  //   const res: any = this.FnRenderDataClick('Combat');
  //   // this.CommandDivisionData = [
  //   //   {
  //   //     date: '消防员禁入区',
  //   //     name: this.returnFloat(res.death / 10000) + '平方米',
  //   //   },
  //   //   {
  //   //     date: '消防车停靠边界',
  //   //     name: this.returnFloat(res.seriousInjury / 10000) + '平方米',
  //   //   },
  //   //   {
  //   //     date: '消防员可停留区',
  //   //     name: this.returnFloat(res.minorWound / 10000) + '平方米',
  //   //   },
  //   //   {
  //   //     date: '警戒区',
  //   //     name: this.returnFloat(res.feel / 10000) + '平方米',
  //   //   },
  //   // ];
  //   console.log('指挥作战分区' , this.CommandDivisionData);
  // }
  // @Watch('GetLargeTankFireModelDataTwo')
  private FnRenderDataTableTwo(data: any): void {
    const res: any = this.FnRenderDataClick('Combat');

    // console.log('指挥作战分区' , this.CommandDivisionData);
  }
  private created() {
    this.getComponent()
        .off()
        .on('RiskAnalysisId', this.onShowPopup1, this);
    if (this.GetLargeTankFireAnalysisModelData !== '') {
      this.FnRenderData();
      this.FnRenderDataClick('Combat');
      // this.CommandDivisionData = [
      //   {
      //     date: '消防员禁入区',
      //     name: this.returnFloat(res.death / 10000) + '平方米',
      //   },
      //   {
      //     date: '消防车停靠边界',
      //     name: this.returnFloat(res.seriousInjury / 10000) + '平方米',
      //   },
      //   {
      //     date: '消防员可停留区',
      //     name: this.returnFloat(res.minorWound / 10000) + '平方米',
      //   },
      //   {
      //     date: '警戒区',
      //     name: this.returnFloat(res.feel / 10000) + '平方米',
      //   },
      // ];
    }
    if (this.GetLargeTankFireModelDataTwo !== '') {
      this.FnRenderDataClick('Combat');
      // this.CommandDivisionData = [
       // {
        //  date: '消防员禁入区',
         // name: this.GetLargeTankFireModelDataTwo.data.data['Combat-death'],
        // },
       //  {
         //  date: '消防车停靠边界',
         // name: this.GetLargeTankFireModelDataTwo.data.data['Combat-seriousInjury'],
       // },
        // {
         // date: '消防员可停留区',
         // name: this.GetLargeTankFireModelDataTwo.data.data['Combat-minorWound'],
        // },
        // {
         // date: '警戒区',
         // name: this.GetLargeTankFireModelDataTwo.data.data['Combat-feel'],
        // },
      // ];
    }
  }
}
</script>
<style scoped lang="less">
.FireControlPlan {
  width: 100%;
  height: 100%;
}
.title {
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 25px;
  color: #00e4ff;
  margin-left: 20px;
}
.content {
  // margin: 10px 20px 10px 20px;
  width: auto;
}
.content table {
  width: 100%;
  height: auto;
}
.content table th {
  height: 52px;
  line-height: 26px;
  font-size: 22px;
  color: #fff;
}

.content1 table th {
  height: 52px;
  line-height: 26px;
  font-size: 22px;
  color: #fff;
}

.header td {
  height: 53px;
  line-height: 53px;
  font-size: 22px;
  color: #fff;
  text-align: center;
  border-bottom: 1px solid #07a4d7;
}
.formList td {
  height: 46px;
  line-height: 8px;
  font-size: 22px;
  color: #fff;
  text-align: center;
  border-bottom: 1px solid #07a4d7;
  max-width: 77px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tdStyle {
  background-image: url('../../../../../assets/img/gisModule/GisStorageTank/FireControlPlan.png');
  background-position: -8px -322px;
}
.header {
  background-image: url('../../../../../assets/img/gisModule/GisStorageTank/tableTitle.png');
  background-size: 100% 100%;
}
.FoamAgent {
  background-image: url('../../../../../assets/img/gisModule/GisStorageTank/shellFrame.png');
  background-position: 0px 0px;
  background-size: 100% 100%;
  width: 94%;
  height: 51px;
  color: #fff;
  text-align: left;
  font-size: 20px;
  line-height: 51px;
  padding-left: 10px;
}
.recalculate_felxBox {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.recalculate {
  width: 180px;
  height: 60px;
  background-image: url(../img/recount.png);
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.recalculate:hover {
  width: 180px;
  height: 60px;
  background-image: url(../img/recount_hover.png);
  background-size: 100% 100%;
  justify-content: center;
  align-items: center;
}
.recalculate_img {
  width: 40px;
  height: 40px;
  background-image: url(../img/recount_icon.png);
}
.recalculate_img:hover {
  width: 40px;
  height: 40px;
  background-image: url(../img/recount_icon_hover.png);
}
.recalculate_font {
  font-size: 22px;
  color: #70feff;
  cursor: pointer;
}
.recalculate_font:hover {
  font-size: 22px;
  color: #fff600;
  cursor: pointer;
}
/deep/.el-input__inner {
  -webkit-appearance: none;
  background-color: #00000000;
  background-image: none;
  border-radius: 7px;
  border: 1px solid #dcdfe600;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 47px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 71%;
  background-image: url('../../../../../assets/img/gisModule/GisStorageTank/FireControlPlan.png');
  background-position: -7px -403px;
}
/deep/ .el-input__suffix {
  right: 64px;
  transition: all 0.3s;
}
/deep/ .el-scrollbar__thumb {
  position: relative;
  display: block;
  width: 0;
  height: 0;
  cursor: pointer;
  border-radius: inherit;
  background-image: linear-gradient(#00efd5a8, #0080d378);
  transition: 0.3s background-color;
}
</style>
