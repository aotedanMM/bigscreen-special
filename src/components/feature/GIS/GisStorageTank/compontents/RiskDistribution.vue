/** author: chenyu time:2020-03-25 **/
<template>
  <div class="RiskDistribution">
    <el-scrollbar style="height: 100%;">
      <el-row>
        <el-col :span="24">
          <div class="title">
            人员风险
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="content contentFlex">
            <div :class="contentLine">
              <div class="content_line_click" @click="FnContentLine(1)"></div>
              <div class="content_line_click" @click="FnContentLine(2)"></div>
              <div class="content_line_click" @click="FnContentLine(3)"></div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="content">
            <table border="0">
              <tr class="header">
                <th>灾损区名称</th>
                <th>含义</th>
                <th>面积</th>
                <th>下风向距离</th>
              </tr>
              <tr
                v-for="(item, index) in PeopleRiskData"
                :key="item + index"
                class="formList"
                :class="[index % 2 == 0 ? '' : 'tdStyle']"
              >
                <td style="border-right:1px solid #07a4d7">
                  {{ item.DamageZone }}
                </td>
                <td style="border-right:1px solid #07a4d7">
                  {{ item.meaning }}
                </td>
                <td style="border-right:1px solid #07a4d7">{{ item.area }}</td>
                <td>{{ item.DownwindDistance }}</td>
              </tr>
            </table>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="title">
            设备风险
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="EquipmentRisk content">
            <div
              :class="[
                EquipmentRiskButtonValue === '1'
                  ? 'EquipmentRisk_button'
                  : 'EquipmentRisk_button_click',
              ]"
              @click="FnEquipmentRisk('1')"
            ></div>
            <div
              :class="[
                EquipmentRiskButtonValue === '2'
                  ? 'EquipmentRisk_button1'
                  : 'EquipmentRisk_button1_click',
              ]"
              @click="FnEquipmentRisk('2')"
            ></div>
            <div
              :class="[
                EquipmentRiskButtonValue === '3'
                  ? 'EquipmentRisk_button2'
                  : 'EquipmentRisk_button2_click',
              ]"
              @click="FnEquipmentRisk('3')"
            ></div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="content">
            <table border="0">
              <tr class="header">
                <th>灾损区名称</th>
                <th>含义</th>
                <th>面积</th>
                <th>下风向距离</th>
              </tr>
              <tr
                v-for="(item, index) in EquipmentRiskData"
                :key="item + index"
                class="formList"
                :class="[index % 2 == 0 ? '' : 'tdStyle']"
              >
                <td style="border-right:1px solid #07a4d7">
                  {{ item.DamageZone }}
                </td>
                <td style="border-right:1px solid #07a4d7">
                  {{ item.meaning }}
                </td>
                <td style="border-right:1px solid #07a4d7">{{ item.area }}</td>
                <td>{{ item.DownwindDistance }}</td>
              </tr>
            </table>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="recalculate_felxBox">
            <div
              class="recalculate"
              style="margin-right: 14px;"
              @click="FnRecount()"
            >
              <div class="recalculate_img"></div>
              <div class="recalculate_font">重新计算</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import RiskAnalysisDetil from '@/components/feature/gisModule/popUp/riskAnalysisDetil.vue';
import data from '../../../../../views/common/gisModules/disasterSta/sta/data';

@Component({
  name: 'RiskDistribution',
  components: {},
})
export default class RiskDistribution extends Vue {
  @Prop() private GetLargeTankFireModelData: any;
  @Prop() private GetLargeTankFireAnalysisModelData: any;
  // @Prop() private GetLargeTankFireModelDataTwo: any;
  private RiskAnalysisVariable: any; // @Prop()
  private msg: any = '风险分布';
  private contentLine: any = 'content_line';
  private EquipmentRiskButtonValue: any = '1';
  private areaData: any = ''; //  所有面积集合
  private PeopleRisk: any = [
    '一般伤亡等级',
    '无防护伤亡概率',
    '有防护伤亡概率',
  ];
  private GetLargeTankFireModelDataTwo: any = {};
  private PeopleRiskData: any = '';
  private currentModeMap: any = {};
  private EquipmentRisk: any = ['一般设备', '常压储罐', '压力储罐'];
  private EquipmentRiskData: any = '';
  private FnContentLine(value: any): void {
    if (this.GetLargeTankFireModelData && this.GetLargeTankFireModelData.data && this.GetLargeTankFireModelData.data.data && this.GetLargeTankFireModelData.data.data.Model_Infos) {
      const dataObj = this.GetLargeTankFireModelData.data.data.Model_Infos
      .GModel_Fire_Chemical.Result_Info;
      switch (value) {
        case 1:
          // 一般伤亡等级
          const res: any = this.FnRenderDataClick('Harm');
          this.contentLine = 'content_line';
          // this.PeopleRiskData = [
          //   {
          //     DamageZone: '死亡区',
          //     meaning: '人员暴露1min1%致死，暴露10s烧伤；',
          //     area:321.3 ,
          //     DownwindDistance: '0米',
          //   },
          //   {
          //     DamageZone: '重伤区',
          //     meaning: '人员暴露8s达到疼痛极限，暴露20s烧伤；',
          //     area: 461.6,
          //     DownwindDistance: '0米',
          //   },
          //   {
          //     DamageZone: '轻伤区',
          //     meaning: '暴露20s引起疼痛，皮肤可能会起泡',
          //     area: 975,
          //     DownwindDistance: '0米',
          //   },
          //   {
          //     DamageZone: '有感区',
          //     meaning: '长期暴露不会引起不适',
          //     area:1562.3,
          //     DownwindDistance: '0米',
          //   },
          // ];
          break;
        case 2:
          // 无防护死亡概率
          const res1: any = this.FnRenderDataClick('UnProtect');
          this.contentLine = 'content_line1';
          // this.PeopleRiskData = [
          //   {
          //     DamageZone: '高风险区',
          //     meaning: '伤亡概率大于90%',
          //     area:412.56,
          //     DownwindDistance: '60米',
          //   },
          //   {
          //     DamageZone: '中风险区',
          //     meaning: '伤亡概率大于50%',
          //     area: 727.3,
          //     DownwindDistance: '70米',
          //   },
          //   {
          //     DamageZone: '低风险区',
          //     meaning: '伤亡概率大于10%',
          //     area: 1451 ,
          //     DownwindDistance: '55米',
          //   },
          // ];
          break;
        case 3:
          // 有防护死亡概率
          const res2: any = this.FnRenderDataClick('Protect');
          this.contentLine = 'content_line2';
          // this.PeopleRiskData = [
          //   {
          //     DamageZone: '高风险区',
          //     meaning: '伤亡概率大于90%',
          //     area:525,
          //     DownwindDistance: '0米',
          //   },
          //   {
          //     DamageZone: '中风险区',
          //     meaning: '伤亡概率大于50%',
          //     area:894,
          //     DownwindDistance: '0米',
          //   },
          //   {
          //     DamageZone: '低风险区',
          //     meaning: '伤亡概率大于10%',
          //     area: 2301,
          //     DownwindDistance: '0米',
          //   },
          // ];
          break;
      }
    }
  }
  private FnRecount(): any {
    this.messsageBus.emit('recount', 'GisInputPanle');
  }
  private FnEquipmentRisk(item: any): void {
    this.EquipmentRiskButtonValue = item;
    if (this.GetLargeTankFireModelData && this.GetLargeTankFireModelData.data && this.GetLargeTankFireModelData.data.data && this.GetLargeTankFireModelData.data.data.Model_Infos) {
      const dataObj = this.GetLargeTankFireModelData.data.data.Model_Infos
      .GModel_Fire_Chemical.Result_Info;
      switch (item) {
        case '1':
          // 一般设备
          this.FnRenderDataClick('Build');
          // this.EquipmentRiskData = [
          //   {
          //     DamageZone: '建筑起火区',
          //     meaning: '木材和纺织物燃烧，建筑起火',
          //     area: 89,
          //     DownwindDistance: '0米',
          //   },
          //   {
          //     DamageZone: '钢材失效区',
          //     meaning: '有绝热保护的薄型钢可能失去机械性能',
          //     area: 473,
          //     DownwindDistance: '0米',
          //   },
          //   {
          //     DamageZone: '木材起火区',
          //     meaning: '木材点燃，压力容器失效',
          //     area: 221.05,
          //     DownwindDistance: '0米',
          //   },
          //   {
          //     DamageZone: '塑料起火区',
          //     meaning: '电线塑料绝热层可能融化，塑料管融化',
          //     area: 921.9,
          //     DownwindDistance: '0米',
          //   },
          //   {
          //     DamageZone: '薄钢失效区',
          //     meaning: '部分绝热保护的薄型钢可能失去机械性能',
          //     area: 781.3,
          //     DownwindDistance:'0米',
          //   },
          // ];
          break;
        case '2':
          // 常压储罐
          this.FnRenderDataClick('CommonStorage');
          // this.EquipmentRiskData = [
          //   {
          //     DamageZone: '高风险区',
          //     meaning: '伤亡概率大于10^-5',
          //     area: 120.1,
          //     DownwindDistance: '0米',
          //   },
          //   {
          //     DamageZone: '中风险区',
          //     meaning: '伤亡概率大于10^-7',
          //     area: 457,
          //     DownwindDistance: '0米',
          //   },
          // ];
          break;
        case '3':
          // 压力储罐
          this.FnRenderDataClick('PressureStorage');
          // this.EquipmentRiskData = [
          //   {
          //     DamageZone: '高风险区',
          //     meaning: '伤亡概率大于10^-5',
          //     area:422 ,
          //     DownwindDistance: '0米',
          //   },
          //   {
          //     DamageZone: '中风险区',
          //     meaning: '伤亡概率大于10^-7',
          //     area: 300,
          //     DownwindDistance:  '0米',
          //   },
          // ];
          break;
        default:
          break;
      }
    }
    const res: any = this.getComponent().getArea();
    return res;
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
          // console.log('接过来的eventInfo:', eventInfo);
          const dataTime = new Date(eventReporttime.replace('-', '/'));
          const reTimestamp = dataTime.getTime();
          const NowDate = new Date();
          const NowTimestamp = NowDate.getTime();
          const res = NowTimestamp - reTimestamp;
          const res1 = Math.floor(res / 1000) / 60 / 60;
          this.dataTime = res1.toFixed(2);
          // console.log('时间：', res1.toFixed(2));
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
        // console.log('模型弹窗：', info);
        // console.log('模型弹窗：', info.data.attributeSet.attributes[2].value.Attribute.Level_Tag);
        // switch(info.data.typeName) {
        // console.log(self.currentModeMap, info.data.typeName);
        // for (const item of self.currentModeMap) {
        //   if (item.DamageZone === info.data.typeName) {
        //     this.area = item.area;
        //     this.downwindDistance = item.DownwindDistance;
        //   }
        // }
        this.area = info.data.attributeSet.attributes[3].value + '平方米';
        switch (
        info.data.attributeSet.attributes[2].value.Attribute.Level_Tag
        ) {
          case 'Harm_Lv4-1': // 死亡区
            // this.area = self.GetLargeTankFireModelDataTwo.data.data['Harm-death'];
            break;
          case 'Harm_Lv3-1': // 重伤区
            // this.area = self.GetLargeTankFireModelDataTwo.data.data['Harm-seriousInjury'];
            break;
          case 'Harm_Lv2-1': // '轻伤区':
            // this.area = self.GetLargeTankFireModelDataTwo.data.data['Harm-minorWound'];
            break;
          case 'Harm_Lv1-1': // '有感区':
            // this.area = self.GetLargeTankFireModelDataTwo.data.data['Harm-feel'];
            break;
          case 'UnProtect_Lv3-1': // '无防护高风险区':
            // this.area = self.GetLargeTankFireModelDataTwo.data.data['UnProtect-seriousInjury'];
            break;
          case 'UnProtect_Lv2-1': // '无防护中风险区':
            // this.area = self.GetLargeTankFireModelDataTwo.data.data['UnProtect-minorWound'];
            break;
          case 'UnProtect_Lv1-1': // '无防护低风险区':
            // this.area = self.GetLargeTankFireModelDataTwo.data.data['UnProtect-feel'];
            break;
          case 'Protect_Lv3-1': // '有防护高风险区':
            // this.area = self.GetLargeTankFireModelDataTwo.data.data['Protect-seriousInjury'];
            break;
          case 'Protect_Lv2-1': // '有防护中风险区':
            // this.area = self.GetLargeTankFireModelDataTwo.data.data['Protect-minorWound'];
            break;
          case 'Protect_Lv1-1': // '有防护低风险区':
            // this.area = self.GetLargeTankFireModelDataTwo.data.data['Protect-feel'];
            break;
          case 'Build_Lv5-1': // '建筑起火区':
            // this.area = self.GetLargeTankFireModelDataTwo.data.data['Build-five'];
            break;
          case 'Build_Lv4-1': // '钢材失效区':
            // this.area = self.GetLargeTankFireModelDataTwo.data.data['Build-death'];
            break;
          case 'Build_Lv3-1': // '木材起火区':
            // this.area = self.GetLargeTankFireModelDataTwo.data.data['Build-seriousInjury'];
            break;
          case 'Build_Lv2-1': // '塑料起火区':
            // this.area = self.GetLargeTankFireModelDataTwo.data.data['Build-minorWound'];
            break;
          case 'Build_Lv1-1': // '薄钢失效区':
            // this.area = self.GetLargeTankFireModelDataTwo.data.data['Build-feel'];
            break;
          case 'CommonStorage_Lv2-1': // '常压储罐高风险区':
            // this.area =
            //   self.GetLargeTankFireModelDataTwo.data.data[
            //     'CommonStorage-minorWound'
            //   ];
            break;
          case 'CommonStorage_Lv1-1': // '常压储罐中风险区':
            // this.area = self.GetLargeTankFireModelDataTwo.data.data['CommonStorage-feel'];
            break;
          case 'PressureStorage_Lv2-1': // '压力储罐高风险区':
            // this.area =
            //   self.GetLargeTankFireModelDataTwo.data.data[
            //     'PressureStorage-minorWound'
            //   ];
            break;
          case 'PressureStorage_Lv1-1': // '压力储罐中风险区':
            // this.area =
            //   self.GetLargeTankFireModelDataTwo.data.data['PressureStorage-feel'];
            break;
        }
        // this.downwindDistance =
        // info.data.attributeSet.attributes[2].value.Attribute.MaxRadius;
      },
    });
  }
  private onShowPopup1(info: any) {
    this.RiskAnalysisVariable = info;
    this.onShowPopup();
  }

  // 获取地图功能
  private getComponent() {
    const gisModules = this.$ioc.resolve('GISFactory-map');
    const component = gisModules.commonFactory.getComponent('riskAnalysis');
    return component;
  }
  private FnRenderDataClick(val: any): any {
    // this.getComponent()
    //   .off()
    //   .on('RiskAnalysisId', this.onShowPopup1, this);

    this.getComponent().getList(
      this.GetLargeTankFireModelData,
      val,
      this.$store.state.eventPushStore.eventDataList,
    );
    const res: any = this.getComponent().getArea();
    if (this.GetLargeTankFireModelData && this.GetLargeTankFireModelData.data && this.GetLargeTankFireModelData.data.data && this.GetLargeTankFireModelData.data.data.Model_Infos) {
      const dataObj = this.GetLargeTankFireModelData.data.data.Model_Infos
      .GModel_Fire_Chemical.Result_Info;
      // this.currentModeMap =
      switch (val) {
        case 'Harm':
          // 一般伤亡等级
          this.PeopleRiskData = [
            {
              DamageZone: '死亡区',
              meaning: '人员暴露1min1%致死，暴露10s烧伤；',
              area: res.death ? res.death + '平方米' : 0 + '平方米',
              DownwindDistance: dataObj['Harm_Lv4-1-0']
                  ? dataObj['Harm_Lv4-1-0'].Attribute.MaxRadius + '米'
                  : '0米',
            },
            {
              DamageZone: '重伤区',
              meaning: '人员暴露8s达到疼痛极限，暴露20s烧伤；',
              area: res.seriousInjury ? res.seriousInjury + '平方米' : 0 + '平方米',
              DownwindDistance: dataObj['Harm_Lv3-1-0']
                  ? dataObj['Harm_Lv3-1-0'].Attribute.MaxRadius + '米'
                  : '0米',
            },
            {
              DamageZone: '轻伤区',
              meaning: '暴露20s引起疼痛，皮肤可能会起泡',
              area: res.minorWound ? res.minorWound + '平方米' : 0 + '平方米',
              DownwindDistance: dataObj['Harm_Lv2-1-0']
                  ? dataObj['Harm_Lv2-1-0'].Attribute.MaxRadius + '米'
                  : '0米',
            },
            {
              DamageZone: '有感区',
              meaning: '长期暴露不会引起不适',
              area: res.feel ? res.feel + '平方米' : 0 + '平方米',
              DownwindDistance: dataObj['Harm_Lv1-1-0']
                  ? dataObj['Harm_Lv1-1-0'].Attribute.MaxRadius + '米'
                  : '0米',
            },
          ];
          this.currentModeMap = this.PeopleRiskData;
          break;
        case 'UnProtect':
          // 无防护死亡概率
          this.PeopleRiskData = [
            {
              DamageZone: '高风险区',
              meaning: '伤亡概率大于90%',
              area: res.seriousInjury ? res.seriousInjury + '平方米' : 0 + '平方米',
              DownwindDistance: dataObj['UnProtect_Lv3-1-600']
                ? dataObj['UnProtect_Lv3-1-600'].Attribute.MaxRadius + '米'
                : '0米',
            },
            {
              DamageZone: '中风险区',
              meaning: '伤亡概率大于50%',
              area: res.minorWound ? res.minorWound + '平方米' : 0 + '平方米',
              DownwindDistance: dataObj['UnProtect_Lv2-1-600']
                ? dataObj['UnProtect_Lv2-1-600'].Attribute.MaxRadius + '米'
                : '0米',
            },
            {
              DamageZone: '低风险区',
              meaning: '伤亡概率大于10%',
              area: res.feel ? res.feel + '平方米' : 0 + '平方米',
              DownwindDistance: dataObj['UnProtect_Lv1-1-600']
                ? dataObj['UnProtect_Lv1-1-600'].Attribute.MaxRadius + '米'
                : '0米',
            },
          ];
          this.currentModeMap = this.PeopleRiskData;
          break;

        case 'Protect':
          // 有防护死亡概率
          this.PeopleRiskData = [
            {
              DamageZone: '高风险区',
              meaning: '伤亡概率大于90%',
              area: res.seriousInjury ? res.seriousInjury + '平方米' : 0 + '平方米',
              DownwindDistance: dataObj['Protect_Lv3-1-600']
                ? dataObj['Protect_Lv3-1-600'].Attribute.MaxRadius + '米'
                : '0米',
            },
            {
              DamageZone: '中风险区',
              meaning: '伤亡概率大于50%',
              area: res.minorWound ? res.minorWound + '平方米' : 0 + '平方米',
              DownwindDistance: dataObj['Protect_Lv2-1-600']
                ? dataObj['Protect_Lv2-1-600'].Attribute.MaxRadius + '米'
                : '0米',
            },
            {
              DamageZone: '低风险区',
              meaning: '伤亡概率大于10%',
              area: res.feel ? res.feel + '平方米' : 0 + '平方米',
              DownwindDistance: dataObj['Protect_Lv1-1-600']
                ? dataObj['Protect_Lv1-1-600'].Attribute.MaxRadius + '米'
                : '0米',
            },
          ];
          this.currentModeMap = this.PeopleRiskData;
          break;
        case 'Build':
          // 一般设备
          this.EquipmentRiskData = [
            {
              DamageZone: '建筑起火区',
              meaning: '木材和纺织物燃烧，建筑起火',
              area: res.five ? res.five + '平方米' : 0 + '平方米',
              DownwindDistance: dataObj['Build_Lv5-1-0']
                ? dataObj['Build_Lv5-1-0'].Attribute.MaxRadius + '米'
                : '0米',
            },
            {
              DamageZone: '钢材失效区',
              meaning: '有绝热保护的薄型钢可能失去机械性能',
              area: res.death ? res.death + '平方米' : 0 + '平方米',
              DownwindDistance: dataObj['Build_Lv4-1-0']
                ? dataObj['Build_Lv4-1-0'].Attribute.MaxRadius + '米'
                : '0米',
            },
            {
              DamageZone: '木材起火区',
              meaning: '木材点燃，压力容器失效',
              area: res.seriousInjury ? res.seriousInjury + '平方米' : 0 + '平方米',
              DownwindDistance: dataObj['Build_Lv3-1-0']
                ? dataObj['Build_Lv3-1-0'].Attribute.MaxRadius + '米'
                : '0米',
            },
            {
              DamageZone: '塑料起火区',
              meaning: '电线塑料绝热层可能融化，塑料管融化',
              area: res.minorWound ? res.minorWound + '平方米' : 0 + '平方米',
              DownwindDistance: dataObj['Build_Lv2-1-0']
                ? dataObj['Build_Lv2-1-0'].Attribute.MaxRadius + '米'
                : '0米',
            },
            {
              DamageZone: '薄钢失效区',
              meaning: '部分绝热保护的薄型钢可能失去机械性能',
              area: res.feel ? res.feel + '平方米' : 0 + '平方米',
              DownwindDistance: dataObj['Build_Lv1-1-0']
                ? dataObj['Build_Lv1-1-0'].Attribute.MaxRadius + '米'
                : '0米',
            },
          ];
          this.currentModeMap = this.EquipmentRiskData;
          break;
        case 'CommonStorage':
          // 常压储罐
          this.EquipmentRiskData = [
              {
                DamageZone: '高风险区',
                meaning: '伤亡概率大于10^-5',
                area: res.minorWound ? res.minorWound + '平方米' : 0 + '平方米',
                DownwindDistance: dataObj['CommonStorage_Lv2-1-0']
                ? dataObj['CommonStorage_Lv2-1-0'].Attribute.MaxRadius + '米'
                : '0米',
              },
              {
                DamageZone: '中风险区',
                meaning: '伤亡概率大于10^-7',
                area: res.feel ? res.feel + '平方米' : 0 + '平方米',
                DownwindDistance: dataObj['CommonStorage_Lv1-1-0']
                ? dataObj['CommonStorage_Lv1-1-0'].Attribute.MaxRadius + '米'
                : '0米',
              },
            ];
          this.currentModeMap = this.EquipmentRiskData;
          break;
        case 'PressureStorage':
          // 压力储罐
          this.EquipmentRiskData = [
            {
              DamageZone: '高风险区',
              meaning: '伤亡概率大于10^-5',
              area: res.minorWound ? res.minorWound + '平方米' : 0 + '平方米',
              DownwindDistance: dataObj['PressureStorage_Lv2-1-0']
                ? dataObj['PressureStorage_Lv2-1-0'].Attribute.MaxRadius + '米'
                : '0米',
            },
            {
              DamageZone: '中风险区',
              meaning: '伤亡概率大于10^-7',
              area: res.feel ? res.feel + '平方米' : 0 + '平方米',
              DownwindDistance: dataObj['PressureStorage_Lv1-1-0']
                ? dataObj['PressureStorage_Lv1-1-0'].Attribute.MaxRadius + '米'
                : '0米',
            },
          ];
          this.currentModeMap = this.EquipmentRiskData;
          break;
        default:
          break;

      }
    }
    return res;
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
  private created() {
  //  this.getComponent().on('setArea', (data:any)=> {
  //   },this)
    this.getComponent()
          .off()
          .on('RiskAnalysisId', this.onShowPopup1, this);
    this.FnContentLine(1);
    this.FnEquipmentRisk('1');
  }
}
</script>
<style scoped lang="less">
.RiskDistribution {
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
  width: 100%;
  margin: 10px 0;
  display: flex;
  justify-content: center;
}
.contentFlex {
  display: flex;
  justify-content: center;
  align-items: center;
}
.content_line {
  border-radius: 5px;
  padding: 5px;
  background-image: url('../../../../../assets/img/gisModule/GisStorageTank/RiskDistribution.png');
  background-position: 0px -43px;
  width: 621px;
  height: 52px;
  display: flex;
  justify-self: flex-start;
  cursor: pointer;
}
.content_line1 {
  border-radius: 5px;
  padding: 5px;
  background-image: url('../../../../../assets/img/gisModule/GisStorageTank/RiskDistribution.png');
  background-position: 0px -114px;
  width: 621px;
  height: 52px;
  display: flex;
  justify-self: flex-start;
  cursor: pointer;
}
.content_line2 {
  border-radius: 5px;
  padding: 5px;
  background-image: url('../../../../../assets/img/gisModule/GisStorageTank/RiskDistribution.png');
  background-position: 0px -185px;
  width: 621px;
  height: 52px;
  display: flex;
  justify-self: flex-start;
  cursor: pointer;
}
.content_line_click {
  width: 219px;
  height: 50px;
}
.content table {
  width: 700px;
  height: auto;
}
.content table th {
  height: 53px;
  line-height: 53px;
  font-size: 22px;
  color: #fff;
}

.content1 table th {
  width: 14%;
  height: 53px;
  line-height: 53px;
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
  width: 14%;
  height: 49px;
  line-height: 23px;
  font-size: 20px;
  color: #fff;
  text-align: center;
  border-bottom: 1px solid #07a4d7;
}
.tdStyle {
  background-position: -8px -322px;
  background-color: #14476873;
}
.header {
  background-image: url('../../../../../assets/img/gisModule/GisStorageTank/FireControlPlan.png');
  background-position: -8px -147px;
}
.FoamAgent {
  background-image: url('../../../../../assets/img/gisModule/GisStorageTank/FireControlPlan.png');
  background-position: -6px -480px;
  width: 100%;
  height: 51px;
  color: #fff;
  text-align: left;
  font-size: 20px;
  line-height: 51px;
  padding-left: 10px;
}
.EquipmentRisk {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: flex-start;
  margin-left: 19px;
}
.EquipmentRisk_button_click {
  width: 161px;
  height: 50px;
  background-image: url('../../../../../assets/img/gisModule/GisStorageTank/generalEquipment.png');
  background-position: -35px -32px;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #6af2ff;
  cursor: pointer;
  transition: transform 0.3s;
}
.EquipmentRisk_button {
  width: 161px;
  height: 50px;
  background-image: url('../../../../../assets/img/gisModule/GisStorageTank/generalEquipment.png');
  background-position: -35px -98px;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #6af2ff;
  cursor: pointer;
}
.EquipmentRisk_button1_click {
  width: 161px;
  height: 50px;
  background-image: url('../../../../../assets/img/gisModule/GisStorageTank/storageTank.png');
  background-position: -35px -32px;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #6af2ff;
  cursor: pointer;
  transition: transform 0.3s;
}
.EquipmentRisk_button1 {
  width: 161px;
  height: 50px;
  background-image: url('../../../../../assets/img/gisModule/GisStorageTank/storageTank.png');
  background-position: -35px -98px;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #6af2ff;
  cursor: pointer;
}
.EquipmentRisk_button2_click {
  width: 161px;
  height: 50px;
  background-image: url('../../../../../assets/img/gisModule/GisStorageTank/pressure.png');
  background-position: -35px -32px;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #6af2ff;
  cursor: pointer;
  transition: transform 0.3s;
}
.EquipmentRisk_button2 {
  width: 161px;
  height: 50px;
  background-image: url('../../../../../assets/img/gisModule/GisStorageTank/pressure.png');
  background-position: -35px -98px;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #6af2ff;
  cursor: pointer;
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
