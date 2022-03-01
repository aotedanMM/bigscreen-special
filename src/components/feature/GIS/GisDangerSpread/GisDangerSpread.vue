<template>
  <div class="GisDangerSpread" style="height: 100%;">
    <div class="panelPublicDefault_hd hd_class">
      <div class="title-panel">
        <span>危化品大气扩散预测</span>
      </div>
    </div>
    <span class="halflist-back" @click="handleBackParent"></span>
    <el-scrollbar style="height: 91%">
      <div class="panelPublicDefault_bd">
        <el-form
          ref="ruleForm"
          size="small"
          default-time
          :model="forestAnalysisDatas"
          label-width="100px"
        >
          <div class="splitLine">
            <div class="titleClass">模型信息</div>
            <el-form-item label="泄漏发生事故时间" label-width="173px">
              <el-date-picker
                type="datetime"
                placeholder="选择日期"
                v-model="forestAnalysisDatas.sourceInfo[0].startTime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-M-d HH:mm:ss"
                style="width: 100%"
                :picker-options="pickerOptions0"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="事件地点" class="fire-position">
              <div class="gis-localtion-cont">
                <span class="gis-localtion-txt1">经度：</span>
                <input type="text" v-model="localtionX" @input="handleInput" />
                <span class="gis-localtion-txt2">纬度：</span>
                <input type="text" v-model="localtionY" @input="handleInput" />
                <!-- <span class="gis-localtion-search" @click="localtionClickFn"></span> -->
                <i class="gis-localtion-weizhi" @click="localtionGisFn"></i>
              </div>
            </el-form-item>
            <el-form-item label="模拟持续时间" label-width="136px">
              <el-row>
                <el-col :span="13">
                  <el-select
                    v-model="forestAnalysisDatas.analysisTimeH"
                    placeholder="请选择"
                    width="60%"
                  >
                    <el-option
                      v-for="(item, index) in options"
                      :key="index"
                      :label="item"
                      :value="item * 60"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="8"><span class="unit">(分钟)</span></el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="模拟时间步长" label-width="136px">
              <el-row>
                <el-col :span="13">
                  <el-select
                    v-model="forestAnalysisDatas.analysisStepH"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in optionsH"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <span class="unit">(分钟)</span>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
          <div class="splitLine">
            <div class="titleClass">
              <i class="el-icon-qixiang"></i>气象信息
            </div>
            <div
              style="
                height: 160px;
                border: 1px solid rgb(38, 112, 200);
                margin-bottom: 10px;
                padding: 5px;
              "
            >
              <el-scrollbar style="height: 100%">
                <table id="hor-minimalist-a" summary="Employee Pay Sheet">
                  <thead>
                    <tr>
                      <th scope="col">时刻</th>
                      <th scope="col">风速(m/s)</th>
                      <th scope="col">风向</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in lists" :key="index">
                      <td>
                        {{ item.index }}
                      </td>
                      <td>
                        <el-input
                          style="width: 70%"
                          type="number"
                          min="1"
                          max="40.5"
                          v-model="item['103004']"
                          @keydown.native="channelInputLimit"
                        ></el-input>
                        <!-- <input type="text" v-model="item['103004']" /> -->
                        <span>{{ item.speedLever }}级</span>
                      </td>

                      <td>
                        <el-select
                          v-model="item['103001']"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="(item, index) in windOption"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </el-scrollbar>
            </div>
            <el-form-item label="云量" label-width="70px">
              <el-select
                v-model="forestAnalysisDatas.cloudNum"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in cloudNum"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <!-- <div class="splitLine"></div> -->
          <div class="titleClass">
            <i class="el-icon-gelidai"></i>泄漏信息
            <el-form-item label="泄漏物质"  label-width="120px">
              <el-select
                v-model="forestAnalysisDatas.matterType"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in matterType"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="泄漏源高度" label-width="120px">
              <el-input placeholder="" v-model="forestAnalysisDatas.heightD">
                <template slot="append">米</template>
              </el-input>
            </el-form-item>
            <div
              style="
                height: 160px;
                border: 1px solid rgb(38, 112, 200);
                margin-bottom: 10px;
                padding: 5px;
              "
            >
              <el-scrollbar style="height: 100%">
                <table id="hor-minimalist-a" summary="Employee Pay Sheet">
                  <thead>
                    <tr>
                      <th scope="col" width="50px">时刻</th>
                      <!-- <th scope="col">
                        泄漏源<br />高度<span class="unitstyle">(米)</span>
                      </th> -->
                      <th scope="col">
                        泄漏速率<span class="unitstyle">(千克/小时)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item,
                      index) in forestAnalysisDatas.listsForLeveal"
                      :key="index"
                    >
                      <td>
                        {{ item.index }}
                      </td>
                      <!-- <td class="tditemstyle">
                        <el-form-item
                          :prop="'listsForLeveal.' + index + '.heightD'"
                          :rules="formRulesForMatter.heightD"
                        >
                          <el-input
                            style="width: 100% !important"
                            v-model="item.heightD"
                            @input="onInput()"
                          ></el-input>
                        </el-form-item>
                        <!-- <input type="text" v-model="item['103004']" /> 
                      </td> -->
                      <td class="tditemstyle">
                        <el-form-item
                          :prop="'listsForLeveal.' + index + '.speedD'"
                          :rules="formRulesForMatter.speedD"
                        >
                          <el-col :span="15" style="padding-left: 70px;">
                            <el-input
                              style="width: 100% !important"
                              v-model="item.speedD"
                              @input="onInput()"
                            ></el-input>
                          </el-col>
                        </el-form-item>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </el-scrollbar>
            </div>
          </div>
        </el-form>
        <div class="bottomClass">
          <el-button
            class="csmMySlider"
            type="primary"
            size="small"
            :disabled="loadingState"
            @click="submitForm('ruleForm')"
            >{{ loadingState ? "模型分析中" : "开始分析" }}</el-button
          >
        </div>
      </div>
    </el-scrollbar>
    <!--  -->
    <div class="playBox" v-show="isShowPlay">
      <div class="legend_title">
        <span>危化品大气扩散</span>
      </div>
      <span class="legend_closeBtn" @click="isShowPlaybtn"></span>
      <div class="playShaftBox">
        <div class="timeSteps">
          <i :class="isPlay ? 'openBtn' : 'closeBtn'" @click="playFn"></i>
          <ul>
            <li
              v-for="(item, index) in timeSteps"
              :key="index"
              :class="item.checked ? 'active' : ''"
              :title="item.title"
            >
              <span :class="item.checked ? 'activeIndex' : ''">{{
                item.value
              }}</span>
              <i
                @click="nextFn(index)"
                :class="item.checked ? 'activei' : ''"
              ></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="playMin" v-show="showMin" @click="isShowPlaybtn"></div>
    <!-- isshowLegend -->
    <div class="datatabs" v-if="false">
      <ul>
        <li><i class="el-icon-location"></i><span>泄漏点</span></li>
        <li><i></i><span>警戒区</span></li>
        <li><i></i><span>轻危区</span></li>
        <li><i></i><span>重危区</span></li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { gisDangerSpreadServer } from '@/api/installServer';
import server from '@/api/feature/forestFireModuleYantai/installForestFireServer';
import FireUtil from '../../forestFireYantai/spreadAnalysis/FireUtil';
@Component({
  name: 'GisDangerSpread',
  components: {},
})
export default class GisDangerSpread extends Vue {
  private get startTimeWatch() {
    return this.forestAnalysisDatas.sourceInfo[0].startTime;
  }
  private options = [30, 60, 90, 120, 150, 180];
  private optionsH = [
    { label: '10', value: 600},
    { label: '15', value: 900},
    { label: '20', value: 1200},
  ];
  private loadingState = false; // 模型分析状态
  private localtionX: any = '';
  private localtionY: any = '';
  private getDataFinish: boolean = false; // 是否成功获取到数据
  private noDataForMap: boolean = false; // 是否有数据
  private forestAnalysisDatas: any = {
    location: '山东.烟台',
    weatherInfo: {
      windInfo: {
        windArr: [],
        windArrOld: [
          {
            windType: '无风',
            windAngle: 0,
            windSpeedZ: 0,
            windSpeed: 0,
            windStartTime: this.$store.state.eventPushStore.eventLocation
              .EventTimes
              ? this.$store.state.eventPushStore.eventLocation.EventTimes
              : '',
            // windEndTime: this.getHoursTime(
            //   this.$store.state.eventPushStore.eventLocation.EventTimes,
            //   1,
            // ),
            windEndTime: '',
            windLast: 0,
          },
        ],
      },
    },
    analysisTimeH: 1800,
    analysisStepH: 600,
    analysisTime: 0,
    analysisStep: 0,
    heightD: 20, // 泄漏源高度
    sourceInfo: [
      {
        startTime: '',
        fireSourceInfo: {
          geoType: 0,
          geometry: [4326, Number(this.localtionX), Number(this.localtionY), 0],
          geometryString: this.localtionX + ',' + this.localtionY,
        },
      },
    ],
    isolationInfo: [],
    cloudNum: '1',
    matterType: 'methyl isocyanate',
    listsForLeveal: [],
  };
  private drawingMode: any = 'line';
  private windOption: any = [
    {
      title: '西风',
      value: '西风',
    },
    {
      title: '西南风',
      value: '西南风',
    },
    {
      title: '南风',
      value: '南风',
    },
    {
      title: '东南风',
      value: '东南风',
    },
    {
      title: '东风',
      value: '东风',
    },
    {
      title: '东北风',
      value: '东北风',
    },
    {
      title: '北风',
      value: '北风',
    },
    {
      title: '西北风',
      value: '西北风',
    },
  ];
  private listItemSetFlag: any = false;
  private drawIndex: any = 0;
  private isshowLegend: boolean = false;
  private isChangeFractionalSeconds = false;
  private lists: any = [];
  private cloudNum: any = [
    {
      value: '1',
      label: '总云量≤4成/低云量≤4成',
    },
    {
      value: '2',
      label: '总云量5~7成/低云量≤4成',
    },
    {
      value: '3',
      label: '总云量≥8成/低云量≤4成',
    },
    {
      value: '4',
      label: '总云量≥5成/低云量5~7成',
    },
    {
      value: '5',
      label: '总云量≥8成/低云量≥8成',
    },
  ];
  private matterType: any = []; // 泄漏物质类型
  private formRulesForMatter: any = {
    // 验证泄漏物质
    // heightD: [{ type: 'number', validator: this.valifunc, trigger: 'blur' }],
    speedD: [{ type: 'number', validator: this.valifunc, trigger: 'blur' }],
  };
  private dataAll: any = {};
  private isHaveDataTime: any = null;
  private isShowPlay = false; // 是否显示播放
  private isPlay: boolean = false; // 是否播放
  private autoPlay: any = ''; // 自动播放定时器
  private activeIndex: number = 0; // 播放位置
  private showMin: boolean = false; // 是否显示最小化按钮
  private timeSteps: any = []; // 播放步长
  // 不能选今天以后得日期
  private pickerOptions0 = {
    disabledDate: (time: any) => {
      return time.getTime() > Date.now() - 8.64e6;
    },
  };
  constructor() {
    super();
  }
  private onInput() {
    this.$forceUpdate();
  }
  /**
   * 自定义验证
   * parm 判断验证哪个
   */
  private valifunc(rule: any, value: any, callback: any) {
    if (rule.field.indexOf('speedD') > 0) {
      const inds: number = Number(rule.field.split('.')[1]);
      const val: any = this.forestAnalysisDatas.listsForLeveal[inds].speedD;
      if (!Number(val)) {
        if (val === '') {
          return callback(new Error('不能为空'));
        } else if (val !== 0 && val !== '0') {
          return callback(new Error('必须为数字'));
        }
      }
    }
    callback();
  }
  // 返回一级页面
  private handleBackParent() {
    this.$emit('tobackParent');
  }
  // 不允许输入
  private channelInputLimit(e: any) {
    const key = e.key;
    // 不允许输入
    e.returnValue = false;
    return false;
  }
  @Watch('startTimeWatch')
  private startTimeChange(val: any) {
    // this.toDefaultWind();
    this.getDataFromWind();
  }
  // 监听持续时间数据变化
  @Watch('forestAnalysisDatas.analysisTimeH')
  private analysisTimeChange(val: any) {
    if (!this.listItemSetFlag) {
      // this.toDefaultWind();
      this.getDataFromWind();
    }
    this.$nextTick(() => {
      this.listItemSetFlag = false;
    });
  }
  private getDataFromWind() {
    const tempStartTime = this.forestAnalysisDatas.analysisTimeH;
    const tempNumber = Math.ceil(Number(this.forestAnalysisDatas.analysisTimeH) / 3600);
    this.lists = [];
    this.forestAnalysisDatas.listsForLeveal = [];
    for (var i = 0; i <= tempNumber; i++) {
      this.lists.push({
        index: i,
        103001: '东风',
        103004: '2',
        103009: this.getHourTime(this.forestAnalysisDatas.sourceInfo[0].startTime, i * 3600000),
      });
      this.forestAnalysisDatas.listsForLeveal.push({
        index: i,
        103001: '东风',
        103004: '2',
        103009: this.getHourTime(this.forestAnalysisDatas.sourceInfo[0].startTime, i * 3600000),
        speedD: 14.5,
      });
    }
  }
  private getHourTime(time: any, step: any) {
    const temptime = new Date().getTime();
    const tt = new Date();
    const temptime1 = tt.setTime(temptime + step);
    const newYear = new Date(temptime1).getFullYear();
    const newMonth = new Date(temptime1).getMonth() + 1;
    const newDay = new Date(temptime1).getDate();
    const newHour = new Date(temptime1).getHours();
    const minutes = new Date(temptime1).getMinutes();
    const seconds = new Date(temptime1).getSeconds();
    return newYear + '-' + newMonth + '-' + newDay + ' ' + newHour + ':' + minutes + ':' + seconds;
  }
  // 根据火电开始时间和分析时长，获取风场信息
  private toDefaultWind() {
    const opt = {
      startDate: this.forestAnalysisDatas.sourceInfo[0].startTime,
      duration: Math.ceil(this.forestAnalysisDatas.analysisTimeH / 3600),
    };
    if (opt.startDate !== null && opt.duration) {
      server.forestFireModelServer.getDefaultWind(opt).then((res: any) => {
        if (res.status === 200) {
          this.lists = res.data;
          this.forestAnalysisDatas.listsForLeveal = res.data;
          res.data.forEach((item: any, indexs: any) => {
            this.lists[indexs][103001] = '东风';
            // this.forestAnalysisDatas.listsForLeveal[indexs].heightD = 20;
            this.forestAnalysisDatas.listsForLeveal[indexs].speedD = 14.5;
          });
        }
      });
    }
  }
  // 监听初始化
  private async watchInit() {
    const component: any = await this.getComponent();
    component.on('chemicalLeak', (data: any) => {
      this.localtionX = String(data.x).replace(/^(.*\..{5}).*$/, '$1');
      this.localtionY = String(data.y).replace(/^(.*\..{5}).*$/, '$1');
    });
  }
  // 回调防止获取不到数据
  private async getResultData(id: any) {
    await gisDangerSpreadServer
    .getDataFromTaskForChemicalleak(id)
    .then((res: any) => {
      if (
        res &&
        res.data &&
        res.data.data &&
        res.data.data.result !== null
      ) {
        this.loadingState = false;
        this.dataAll = res;
        if (this.dataAll.data.data.result.data.Model_Infos.GModel_Leak_Chemical.Result_Info_Step && this.dataAll.data.data.result.data.Model_Infos.GModel_Leak_Chemical.Result_Info_Step.length > 0) {
          this.noDataForMap = true;
          this.$store.commit('earthQuake/setIsShowChemicalBlastLegend', true);
          const legendTempData: any = [
            {
              label: '图层',
              legendData: ['警戒区', '轻危区', '重危区'],
              component: 'EarthQuakeModel',
              color: ['red', '#0000ff', '#c9c92c', '#ffff00'],
              hasClass: [
                {name: '泄漏点', className: 'locations'},
              ],
            },
          ];
          this.$store.commit('earthQuake/setChemicalBlastLegend', {data: legendTempData});
          this.getComponent().getLeakData(this.dataAll);
          this.getDataFinish = true;
          this.nextFn(0);
          this.isshowLegend = true;
        } else {
          this.$message.info('暂无数据。。。');
        }
      } else {
        this.getResultData(id);
      }
    }).catch((e: any) => {
      this.loadingState = false;
    });
  }
  private getNowTime() {
    let dateTime;
    const yy = new Date().getFullYear();
    const mm = new Date().getMonth() + 1;
    const dd = new Date().getDate();
    const hh = new Date().getHours();
    const mf =
      new Date().getMinutes() < 10
        ? '0' + new Date().getMinutes()
        : new Date().getMinutes();
    const ss =
      new Date().getSeconds() < 10
        ? '0' + new Date().getSeconds()
        : new Date().getSeconds();
    dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;
    this.forestAnalysisDatas.sourceInfo[0].startTime = dateTime;
  }
  // 计算时间
  private calculateTime(currTime: any, index: any) {
    var time = new Date(currTime).getTime();
    time = time + (index * this.forestAnalysisDatas.analysisStepH * 1000);
    const newTime = new Date(time);
    const year = newTime.getFullYear();
    const month = newTime.getMonth();
    const day = newTime.getDate();
    const hour = newTime.getHours() + 1;
    const minutes = newTime.getMinutes();
    const second = newTime.getSeconds();
    return {value: hour + ':' + minutes, title: year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + second};
  }
  // 提交
  private async submitForm(formName: any) {
    if (!this.localtionX || !this.localtionY) {
      this.$message('请选择火点得经纬度');
      return;
    }
    (this.$refs[formName] as any).validate((valid: any) => {
      if (valid) {
        clearInterval(this.autoPlay);
        this.getDataFinish = false;
        this.noDataForMap = false;
        this.isShowPlay = true;
        this.isPlay = false;
        this.getComponent().clear();
        this.timeSteps = [];
        for (
          var ii = 0;
          ii <=
          this.forestAnalysisDatas.analysisTimeH /
            this.forestAnalysisDatas.analysisStepH;
          ii++
        ) {
          this.timeSteps.push({
            value: this.calculateTime(this.forestAnalysisDatas.listsForLeveal[0][103009], ii).value,
            title: this.calculateTime(this.forestAnalysisDatas.listsForLeveal[0][103009], ii).title,
            checked: false,
          });
        }
        this.showMin = false;
        const tempWindData: any = [];
        this.lists.forEach((item: any, index: any) => {
          tempWindData.push({
            103001: item[103001],
            103003: 0,
            103004: item[103004], // 风速
            103007: 0,
            103008: [this.localtionX, this.localtionY, 0],
            103009: item[103009],
            103010: 3600,
          });
        });
        var znum = 0;
        var dnum = 0;
        if (this.forestAnalysisDatas.cloudNum === '1') {
          znum = 2;
          dnum = 2;
        }
        if (this.forestAnalysisDatas.cloudNum === '2') {
          znum = 6;
          dnum = 2;
        }
        if (this.forestAnalysisDatas.cloudNum === '3') {
          znum = 9;
          dnum = 2;
        }
        if (this.forestAnalysisDatas.cloudNum === '4') {
          znum = 8;
          dnum = 6;
        }
        if (this.forestAnalysisDatas.cloudNum === '5') {
          znum = 9;
          dnum = 9;
        }
        const tempForLeveal: any = [];
        this.loadingState = true;
        if (this.forestAnalysisDatas.listsForLeveal.length > 1) {
          this.forestAnalysisDatas.listsForLeveal.forEach(
            (item: any, indexs: any) => {
              if (indexs > 0) {
                tempForLeveal.push({
                  103041: this.forestAnalysisDatas.matterType, // 'methyl isocyanate',
                  103042: '1',
                  103044:
                    Number(this.forestAnalysisDatas.listsForLeveal[0].speedD) /
                    3600,
                  103045: [
                    4326,
                    this.localtionX,
                    this.localtionY,
                    this.forestAnalysisDatas.heightD,
                  ],
                  103050: item[103009],
                  103051: 3600,
                });
              }
            },
          );
        }
        const parms = {
          101201: '', // 降雨强度 没用
          103001: '', // 风向 没用
          103003: '', // 风向 没用
          103004: '', // 风向角度_Z 没用
          103007: '', // 风速_Z 没用
          103008: [], // 测量点  没用
          103041: this.forestAnalysisDatas.matterType, // 'methyl isocyanate',  // 泄漏物名称
          103042: '1', // 泄漏方式
          103043: '', // 泄漏总量
          103044: 1.6666666666666667, // Number(this.forestAnalysisDatas.listsForLeveal[0].speedD) / 3600,
          103045: [
            4326,
            this.localtionX,
            this.localtionY,
            this.forestAnalysisDatas.heightD,
          ],
          103050: this.forestAnalysisDatas.listsForLeveal[0][103009], // 起始时间
          103051: this.forestAnalysisDatas.analysisTimeH, // 持续时间
          103101: '',
          103105: '',
          103106: '',
          103107: '',
          103108: 1, // 城市 、郊区
          105600: {
            105601: {
              105081: [
                {
                  103101: 20,
                  103102: '0.2',
                  103103: '101.352',
                  103105: '',
                  103106: znum,
                  103107: dnum,
                  103108: 1,
                  103118: this.forestAnalysisDatas.sourceInfo[0].startTime,
                  103119: '-1',
                },
              ],
            },
            105602: {
              105041: tempWindData,
              105042: '',
            },
            105603: {
              105061: [
                {
                  103022: '',
                  103023: '',
                  103024: '',
                },
              ],
            },
          },
          110010: true,
          110022: this.forestAnalysisDatas.analysisTimeH,
          110023: 20000,
          110024: '2',
          110026: 8,
          110027: true,
          110028: false,
          110031: 10,
          110035: true,
          110051: [
            [4326, 105.0001, 32.0001, 1.5],
            [4326, 105.0002, 32.0002, 1.0],
          ],
          110321: 8,
          110322: 120, // this.forestAnalysisDatas.analysisStepH, // 步长
          110403: tempForLeveal,
          110410: -1,
          110415: true,
          110420: true,
          110421: false,
          110430: false,
        };
        this.dataAll = [];
        gisDangerSpreadServer
          .getDataForChemicalleak(parms)
          .then((iddata: any) => {
            this.getResultData(iddata.data.data.id);
          }).catch((e: any) => {
            this.loadingState = false;
          });
      }
    });
  }
  // 处理数据，转成gis需要的数据
  private dealDatas() {
    // 把分析时长转换成秒
    this.forestAnalysisDatas.analysisTime = this.forestAnalysisDatas.analysisTimeH;
    // 把时间刻度转换成秒
    this.forestAnalysisDatas.analysisStep = this.forestAnalysisDatas.analysisStepH;
  }
  // 获取泄漏物质类型数据
  private async getLevealMatter() {
    gisDangerSpreadServer.getLevealMatter().then((res: any) => {
      this.matterType = [];
      res.data.data.forEach((item: any, index: any) => {
        this.matterType.push({
          label: item.name,
          value: item.code,
        });
        // if (index === 0) {
        //   this.forestAnalysisDatas.matterType = item.code;
        // }
      });
    });
  }
  private isShowPlaybtn() {
    this.isShowPlay = !this.isShowPlay;
    this.showMin = !this.showMin;
  }
  // 点击播放按钮开始或关闭
  private playFn() {
    if (!this.getDataFinish) {
      this.tooltipForNoGetData();
      return false;
    }
    if (!this.noDataForMap) {
      this.$message.info('暂无数据');
      return false;
    }
    this.isPlay = !this.isPlay;
    clearInterval(this.autoPlay);
    if (this.isPlay) {
      this.autoPlayFn();
    }
  }
  // 点击播放条指定位置
  private nextFn(index: any) {
    this.isPlay = false;
    if (!this.getDataFinish) {
      this.tooltipForNoGetData();
      return false;
    }
    if (!this.noDataForMap) {
      this.$message.info('暂无数据');
      return false;
    }
    this.timeSteps.map((timeItem: any, itemIndex: number) => {
      timeItem.checked = false;
      if (itemIndex <= index) {
        timeItem.checked = true;
      }
    });
    this.activeIndex = index;
    if (this.activeIndex === 0) {
      this.getComponent().playLeak(this.activeIndex);
    } else {
      this.getComponent().playLeak(this.activeIndex * (this.forestAnalysisDatas.analysisStepH / 120) - 1);
    }
    // this.dataAll 接口请求回来的数据在这里面 index 是当前播放位置
    clearInterval(this.autoPlay);
  }
  // 播放定时器
  private autoPlayFn() {
    this.timeSteps[0].checked = true;
    this.autoPlay = setInterval(() => {
      this.activeIndex++;
      if (this.activeIndex > this.timeSteps.length - 1) {
        this.activeIndex = 0;
        this.timeSteps.map((item: any) => {
          item.checked = false;
        });
      }
      this.timeSteps[this.activeIndex].checked = true;
      if (this.activeIndex === 0) {
        this.getComponent().playLeak(this.activeIndex);
      } else {
        this.getComponent().playLeak(this.activeIndex * (this.forestAnalysisDatas.analysisStepH / 120) - 1);
      }
    }, 2000);
  }
  // 清除定时器以及恢复默认值
  private clearPlay(): void {
    if (this.autoPlay) {
      clearInterval(this.autoPlay);
    }
    this.isPlay = false;
    this.activeIndex = 0;
    this.timeSteps.map((item: any, index: number) => {
      item.checked = index === 0 ? true : false;
    });
  }
  // 由于数据加载过慢，加提示
  private tooltipForNoGetData() {
    this.$message.info('数据加载中。。。');
  }
  private created() {
    this.watchInit();
    this.localtionX = this.$store.state.eventPushStore.eventLocation.EventLon
      ? this.$store.state.eventPushStore.eventLocation.EventLon
      : '';
    this.localtionY = this.$store.state.eventPushStore.eventLocation.EventLat
      ? this.$store.state.eventPushStore.eventLocation.EventLat
      : '';
    this.getLevealMatter();
    // 风场的开始和结束时间范围确定
    // this.changeAnalysisTimeH(24);
    this.getNowTime();
    // this.toDefaultWind();
  }
  private beforeDestroy() {
    this.$store.commit('earthQuake/setIsShowChemicalBlastLegend', false);
    this.getComponent().removeIgnitionPointLayer('1'); // 清除标点
    this.getComponent().clear();  // 清除地图数据
    this.isshowLegend = false; // 隐藏图例
    // 清除定时器
    this.clearPlay();
    // 获取父级元素
    const el: any = document.getElementById('right_function_box');
    if (el) {
      // 设置父级元素宽度
      el.style.width = '390px';
    }
  }
  @Watch('lists', { deep: true })
  private changeWindSpeeds(item: any) {
    this.setWindSpeed(this.lists);
  }
  private setWindSpeed(list: any) {
    list.forEach((item: any, index: any) => {
      if (Number(item['103004']) >= 0 && Number(item['103004']) <= 0.2) {
        item.speedLever = 0;
      }
      if (Number(item['103004']) >= 0.3 && Number(item['103004']) <= 1.5) {
        item.speedLever = 1;
      }
      if (Number(item['103004']) >= 1.6 && Number(item['103004']) <= 3.3) {
        item.speedLever = 2;
      }
      if (Number(item['103004']) >= 3.4 && Number(item['103004']) <= 5.4) {
        item.speedLever = 3;
      }
      if (Number(item['103004']) >= 5.5 && Number(item['103004']) <= 7.9) {
        item.speedLever = 4;
      }
      if (Number(item['103004']) >= 8.0 && Number(item['103004']) <= 10.7) {
        item.speedLever = 5;
      }
      if (Number(item['103004']) >= 10.8 && Number(item['103004']) <= 13.8) {
        item.speedLever = 6;
      }
      if (Number(item['103004']) >= 13.9 && Number(item['103004']) <= 17.1) {
        item.speedLever = 7;
      }
      if (Number(item['103004']) >= 17.2 && Number(item['103004']) <= 20.7) {
        item.speedLever = 8;
      }
      if (Number(item['103004']) >= 20.8 && Number(item['103004']) <= 24.4) {
        item.speedLever = 9;
      }
      if (Number(item['103004']) >= 24.5 && Number(item['103004']) <= 28.4) {
        item.speedLever = 10;
      }
      if (Number(item['103004']) >= 28.5 && Number(item['103004']) <= 32.6) {
        item.speedLever = 11;
      }
      if (Number(item['103004']) >= 32.7 && Number(item['103004']) <= 36.9) {
        item.speedLever = 12;
      }
      if (Number(item['103004']) >= 37.0 && Number(item['103004']) <= 41.4) {
        item.speedLever = 13;
      }
      if (Number(item['103004']) >= 41.5 && Number(item['103004']) <= 46.1) {
        item.speedLever = 14;
      }
      if (Number(item['103004']) >= 46.2 && Number(item['103004']) <= 50.9) {
        item.speedLever = 15;
      }
      if (Number(item['103004']) >= 51.0 && Number(item['103004']) <= 56) {
        item.speedLever = 16;
      }
      if (Number(item['103004']) >= 56.1 && Number(item['103004']) <= 61.2) {
        item.speedLever = 17;
      }
    });
    return list;
  }
  private getComponent() {
    const gisModules = this.$ioc.resolve('GISFactory-map');
    const component = gisModules.commonFactory.getComponent('chemicalleak');
    return component;
  }

  // 分析时长改变
  private changeAnalysisTimeH(val: number) {
    return false;
  }
  // 获取当前时间time后的num小时的时间
  private getHoursTime(time: any, num: any) {
    const curHours: any = Number.parseInt(time.slice(11, 13), 10);
    const curDate: any = Number.parseInt(time.slice(8, 10), 10);
    if (num.toString().indexOf('.') > -1) {
      const curMins: any = Number.parseInt(time.slice(14, 16), 10);
      const temps: any = num.toString().split('.');
      let tempHours: any = Number.parseInt(temps[0], 10) + curHours;
      let tempMins: any = curMins + Number.parseInt(temps[1], 10) * 6;
      if (tempMins >= 60) {
        tempHours += 1;
        tempMins -= 60;
        tempMins = tempMins < 10 ? '0' + tempMins : tempMins;
        if (tempHours >= 24) {
          tempHours -= 24;
          tempHours = tempHours < 10 ? '0' + tempHours : tempHours;
          return (
            time.slice(0, 8) +
            (curDate + 1) +
            ' ' +
            tempHours +
            ': ' +
            tempMins +
            time.slice(16)
          );
        }
        return time.slice(0, 11) + tempHours + ': ' + tempMins + time.slice(16);
      } else {
        if (tempHours >= 24) {
          tempHours -= 24;
          tempHours = tempHours < 10 ? '0' + tempHours : tempHours;
          return (
            time.slice(0, 8) +
            (curDate + 1) +
            ' ' +
            tempHours +
            ': ' +
            tempMins +
            time.slice(16)
          );
        }
        return time.slice(0, 11) + tempHours + ': ' + tempMins + time.slice(16);
      }
    }
    let temp: any = curHours + num;
    if (temp >= 24) {
      temp -= 24;
      temp = temp < 10 ? '0' + temp : temp;
      return time.slice(0, 8) + (curDate + 1) + ' ' + temp + time.slice(13);
    }
    return time.slice(0, 11) + temp + time.slice(13);
  }
  private checkWeatherInfo(rule: any, value: any, callback: any) {
    if (value.windInfo.windArrOld.length > 0) {
      value.windInfo.windArrOld.forEach((item: any, index: any) => {
        if (!item.windStartTime || !item.windEndTime) {
          return callback(
            new Error('请选择风场' + index + '的开始起始时间或结束时间'),
          );
        } else if (
          new Date(item.windStartTime).getTime() >
          new Date(item.windEndTime).getTime()
        ) {
          return callback(
            new Error('风场' + index + '的开始起始时间大于结束时间，请重新选择'),
          );
        } else {
          return callback();
        }
      });
    } else {
      return callback(new Error('请添加风场'));
    }
  }
  // 当前风场开始时间改变方法
  // private windStartTimeChange(curtime: any) {
  // }
  // private destroyed() {
  // }
  private handleInput(e: any) {
    // 只能输入正整数和小数
    // 经度 只能是整数
    // 小数的经度坐标
    const localtionX: RegExp = /^-?(([1]?[0-7]?[0-9]?(\.[0-9]*)?)|([0-9]?[0-9]?(\.[0-9]*)?))$/g;
    if (!localtionX.test(this.localtionX)) {
      this.localtionX = '';
      this.$message('请输入正确的 经度：-179.9999～179.9999');
    }
    // 小数的维度坐标
    const localtionY: RegExp = /^-?([1-8]?[0-9])?(\.[0-9]*)?$/g;
    if (!localtionY.test(this.localtionY)) {
      this.localtionY = '';
      this.$message('请输入正确的纬度！纬度：-89.9999～89.9999');
    }
  }

  private localtionGisFn() {
    this.getComponent().setIgnitionPoint('大气扩散', '1', 32);
  }
}
</script>
<style scoped lang="less">
@import url("../../../../assets/css/decisionSupport/Statistic.half.less");
@forestFire: "../../../../assets/img/forestFire";
@imgPath: "../../../../assets/img/gisModule/legendPlanel";
@imgUrl: "../../../../assets/img/darkgreen";
.GisDangerSpread {
  .title-panel {
    font-size: calc(16px * 1.5);
  }
  .halflist-back {
    width: 61px;
    height: 19px;
    position: absolute;
    top: 10px;
    left: 329px;
    color: #338af8;
    cursor: pointer;
    z-index: 1;
    background: url("../../../../assets/img/default/panel/toBack.png") no-repeat
      0px 70%;
    background-size: 100% 100%;
    &:hover {
      background-image: url("../../../../assets/img/default/panel/toBack_h.png");
    }
  }
  .cursor {
    cursor: pointer;
  }
  .panelPublicDefault_bd {
    height: calc(100% - 230px) !important;
    padding-top: 7px;
    .gis-localtion-cont {
      width: 360px;
      height: 55px;
      align-items: center;
      position: relative;
      display: flex;
      font-size: 20px;
      span:nth-child(1) {
        color: #ffffff;
      }
      span:nth-child(3) {
        margin-left: 8px;
        color: #ffffff;
      }
      input[type="text"] {
        width: 112px;
        height: 30px;
        outline: none;
        border: 1px solid transparent;
        border-radius: 5px;
        background: url(../../../../assets/img/nav/inputLatLon.png) no-repeat;
        background-size: 100% 100%;
        color: #fff;
        text-indent: 0.3rem;
      }
      .gis-localtion-weizhi {
        position: absolute;
        top: -35px;
        left: 100px;
        width: 40px;
        height: 40px;
        background: url(../../../../assets/img/nav/echo_lat_and_long.png) 0 0
          no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }
  }
  .datatabs {
    position: fixed;
    top: 235px;
    left: 1562px;
    width: 179px;
    height: 253px;
    color: white;
    font-size: 16px;
    line-height: 44px;
    cursor: pointer;
    // background: #0f4461;
    background: url("@{imgPath}/legendRightBg.png") no-repeat;
    background-size: 100% 100%;
    text-indent: 77px;
    span {
      display: block;
      word-break: keep-all;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    ul {
      padding-top: 38px;
      li {
        &:nth-child(1) {
          i {
            color: red;
          }
        }
      }
      li:not(:first-child) {
        i {
          width: 12px;
          height: 12px;
          display: block;
          border-radius: 50%;
          position: absolute;
        }
        &:nth-child(2) {
          i {
            left: 42px;
            top: 98px;
            background-color: rgb(0, 0, 255);
          }
        }
        &:nth-child(3) {
          i {
            left: 42px;
            top: 141px;
            background-color: rgb(201, 201, 44);
          }
        }
        &:nth-child(4) {
          i {
            left: 42px;
            top: 184px;
            background-color: rgb(255, 255, 0);
          }
        }
      }
    }
    i {
      width: 23px;
      height: 23px;
      top: 50px;
      left: -40px;
    }
  }
  .splitLine {
    border-bottom: 1px solid #3e808c;
  }
  .titleClass {
    color: #8de5fc;
    font-size: 26px;
    line-height: 40px;
    .drawingClass {
      cursor: pointer;
      float: right;
      font-size: 20px;
      margin: 8px 16px 0;
      font-size: 24px;
    }

    i {
      width: 40px;
      height: 40px;
      background-size: 100% 100%;
      position: relative;
      left: 0;
      top: 7px;
      margin-right: 5px;
    }
    .el-icon-times {
      background: url("@{forestFire}/analicy-time-icon.png") no-repeat center
        center;
      top: 12px;
    }
    .el-icon-qixiang {
      background: url("@{forestFire}/analicy-qixiang-icon.png") no-repeat center
        center;
    }
    .el-icon-gelidai {
      background: url("@{forestFire}/analicy-gelidai-icon.png") no-repeat center
        center;
    }
  }
  .unit {
    text-align: left;
    font-size: 20px;
    color: #fff;
    line-height: 32px;
    padding-left: 15px;
    box-sizing: border-box;
  }
  i {
    position: absolute;
    right: 0;
    top: -28px;
    width: 25px;
    font-size: 23px;
    color: #3c8ce7;
    cursor: pointer;
  }
  .csmMySlider {
    margin: 10px 33%;
    width: 142px;
    height: 55px;
  }
  .weatherInfoTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .windSlideClass {
      width: 100%;
      // background: #30536E;
      display: flex;
      flex-wrap: wrap;
      font-size: 23px;
      .windItem {
        padding: 2px 5px;
        box-sizing: border-box;
        margin-right: 10px;
        color: white;
        text-align: center;
        cursor: pointer;
        position: relative;
      }
      .windItem:hover,
      .windActive {
        color: #9cfc6e;
      }
      .windItemCloseClass {
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        align-items: center;
        background: #3c8ce7;
        font-size: 16px;
        color: #000;
        position: absolute;
        right: -8px;
        top: -8px;
        border-radius: 50%;
        cursor: pointer;
      }
    }
  }
  .windTitleClass {
    text-align: left;
    font-size: 22px;
    color: #fff;
  }
  .drawWrap {
    // margin-top: -20px;
    height: 100px;
  }
  .drawItem {
    width: 100%;
    line-height: 40px;
    height: 40px;
    /* padding: 10px; */
    box-sizing: border-box;
    position: relative;
    background: #101f34;
    border-bottom: 1px solid;
    .titleWrap {
      display: flex;
      font-size: 20px;
      color: #fff;
      padding-left: 10px;

      .drawingClass {
        margin-left: 10px;
        color: #3c8ce7;
        cursor: pointer;
      }
    }

    .content {
      margin: 8px 0;
      width: 100%;
      height: auto;
      padding: 5px;
      background: rgba(43, 246, 254, 0.2);
      color: #fff;
      border: 1px solid rgba(118, 242, 251, 0.1);
      font-size: 22px;
    }
  }
  .drawItem:hover {
    background: #0c1527;
    cursor: pointer;
  }
  .drawItemCloseClass {
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    align-items: center;
    background: #3c8ce7;
    font-size: 20px;
    color: #000;
    position: absolute;
    right: 10px;
    border-radius: 50%;
    top: 10px;
    cursor: pointer;
  }
  .bottomClass {
    box-sizing: border-box;
    text-align: center;
  }
  /deep/.tditemstyle {
    .el-form-item__content {
      margin-left: 20px !important;
    }
  }
  .playBox {
    position: fixed;
    left: 566px;
    top: 774px;
    width: 950px;
    height: 150px;
    z-index: 1000;
    color: #fff;
    background: url("@{imgPath}/legendbg.png") no-repeat;
    background-size: 100% 100%;
  }
  .playShaftBox {
    color: #fff;

    .legend_palyer {
      width: 40px;
      height: 20px;
      background: url("@{imgPath}/legend_player.png") no-repeat 0 0;
      background-size: 100% 100%;
    }
    .timeSteps {
      width: 95%;
      display: flex;
      margin-top: 30px;
      height: 111px;
      .closeBtn {
        display: inline-block;
        width: 65px;
        height: 57px;
        background: url("@{imgPath}/legend_player.png") no-repeat 0 0;
        background-size: 100% 100%;
        cursor: pointer;
        margin-top: 29px;
        margin-left: 57px;
        overflow-x: auto;
        overflow-y: hidden;
        position: relative;
        top: 2px;
      }
      .openBtn {
        display: inline-block;
        width: 65px;
        height: 57px;
        background: url("@{imgPath}/legend_stop.png") no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
        margin-top: 29px;
        margin-left: 57px;
        position: relative;
        top: 2px;
      }
      ul {
        display: flex;
        margin-left: 26px;
        margin-top: 12px;
        width: 80%;
        overflow-x: hidden;
        padding-left: 20px;
        padding-right: 37px;
        overflow-y: hidden;
        padding-top: 40px;
        li {
          width: 48%;
          background: rgba(106, 209, 246, 0.4);
          height: 5px;
          position: relative;
          i {
            display: inline-block;
            width: 22px;
            height: 20px;
            background: url("@{imgPath}/dot02.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            right: -1px;
            top: -7px;
            cursor: pointer;
          }
          span {
            position: absolute;
            top: 15px;
            right: -56px;
            color: #ffffff;
            font-size: 20px;
            cursor: pointer;
            // display: none;
            text-align: center;
            line-height: 32px;
            width: 105px;
            padding: 3px;
          }
          &:nth-child(odd) {
            span {
              top: 15px;
            }
          }
          &:nth-child(even) {
            span {
              top: -45px;
            }
          }
        }
        .active {
          background: #9eff6f;
        }
        .activei {
          background: url("@{imgPath}/dot01.png") no-repeat;
          background-size: 100% 100%;
          transform: translateX(-1px);
        }
        .activeIndex {
          display: block;
          // background: url('@{imgPath}/wordBg.png') no-repeat;
          // background-size: 100% 100%;
          width: 105px;
          padding: 3px;
          // height: 35px;
          color: #9eff6f;
        }
        li:nth-of-type(1) {
          width: 2%;
        }
      }
    }
  }
  .legend_closeBtn {
    width: 40px;
    height: 40px;
    cursor: pointer;
    background: url("@{imgPath}/legendhide-.png") no-repeat 0 0;
    background-size: 100% 100%;
    position: absolute;
    right: 32px;
    top: 6px;
  }
  .legend_title {
    font-size: 16px;
    color: #333;
    color: #67e1fb;
    width: 270px;
    height: 58px;
    line-height: 58px;
    font-size: 24px;
    text-align: center;
    background: url("@{imgPath}/legend_title.png") no-repeat 0 0;
    background-size: 100% 100%;
    position: absolute;
    top: -18px;
    left: 14px;
  }
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
/*滚动条里面小方块样式*/
::-webkit-scrollbar-thumb {
  border-radius: 100px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background-image: linear-gradient(
    0deg,
    #0a7ccc 0%,
    #06b4d1 52%,
    #02ebd5 100%
  );
}
/*滚动条里面轨道样式*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
  border-radius: 0;
  background: rgba(0, 0, 0, 0);
}
.playMin {
  width: 110px;
  height: 36px;
  position: fixed;
  cursor: pointer;
  background: url("@{imgUrl}/panel/toMinifyBtn.png") no-repeat;
  background-size: 100% 100%;
  top: 917px;
  left: 952px;
  z-index: 1000;
  &:hover {
    background: url("@{imgUrl}/panel/toMinifyBtnHover.png") no-repeat;
    background-size: 100% 100%;
  }
}
.playMinActive {
  width: 110px;
  height: 36px;
  position: fixed;
  cursor: pointer;
  background: url("@{imgUrl}/panel/toMinifyBtnHover.png") no-repeat;
  background-size: 100% 100%;
  top: 917px;
  left: 952px;
  z-index: 1000;
}
</style>
<style lang="less">
.popbg {
  height: 100%;
}
.GisDangerSpread {
  .el-input--suffix .el-input__inner {
    padding-right: 8px;
  }
  .hd_class {
    line-height: 29px !important;
  }
  .el-input__inner {
    background: rgba(43, 246, 254, 0.2);
    color: #fff;
    border: rgba(118, 242, 251, 0.1);
    font-size: 16px;
    &:hover,
    &:focus {
      border-color: rgba(118, 242, 251, 0.1);
    }
  }
  .itemContent {
    .el-input__inner {
      font-size: 20px !important;
    }
    .el-input__suffix {
      top: -5px;
    }
  }
}
.GisDangerSpread {
  .loading {
    color: #fff;
    background: url(../../../../assets/img/halfScreen/halflist/loading.gif)
      no-repeat 33px 255px;
    color: #d2e1ec;
    height: 100%;
    margin-top: -120px;
    p {
      padding-left: 5px;
      margin: 0;
      transform: translateY(-8px);
    }
    center {
      margin-top: 120%;
    }
  }
  .el-form {
    height: calc(100% - 60px);
  }
  .el-form-item__label {
    text-align: left;
    font-size: 20px;
    color: #fff;
  }
  .el-input-group {
    width: 88%;
  }
  /deep/.el-input-group__append, .el-input-group__prepend {
    background-color: rgba(0,0,0,0);
    color: #e5f4ff;
    vertical-align: middle;
    display: table-cell;
    position: relative;
    border: 1px solid #4b9ba2;
    border-left-color: rgb(75, 155, 162);
    border-left-style: solid;
    border-left-width: 1px;
    border-radius: 4px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    padding: 0 20px;
    width: 1px;
    white-space: nowrap;
    font-size: 14px;
  }
  .el-form-item {
    position: relative;
    .locationClass {
      position: absolute;
      right: 13px;
      top: 0;
      width: 32px;
      height: 32px;
      // background: #3c8ce7;
      // .primaryDark(background-color,0%);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      .iconfont {
        font-size: 20px;
      }
    }
    .addClass {
      background: white;
      // color: #3c8ce7;
      position: absolute;
      right: 105px;
      top: 0;
      i {
        font-size: 22px;
      }
    }
  }
}
.time .el-select > .el-input {
  width: 190px !important;
}
// .el-select .el-select--small {
//   width: 190px !important;
// }
// .el-input .el-input--small .el-input--suffix {
//   width: 190px !important;
// }
.el-form-item--small.el-form-item {
  margin-bottom: 8px !important;
}
.el-form-item.fire-position.el-form-item--small {
  .el-form-item__label {
    width: 122px !important;
    display: block !important;
  }
  .el-form-item__content {
    margin-left: 0 !important;
    display: block !important;
  }
}

#hor-minimalist-a {
  font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif;
  font-size: 12px;
  // background: #dde1d8;
  width: 370px;
  border-collapse: collapse;
  text-align: left;
  // input {
  //   width: 110px;
  //   cursor: pointer;
  //   background: rgba(43, 246, 254, 0.2);
  //   border: rgba(118, 242, 251, 0.1);
  //   color: #fff;
  //   padding-left: 5px;
  // }
  .el-input {
    width: 80px !important;
    cursor: pointer;
    margin-right: 10px;
  }
  .el-select {
    .el-input {
      width: 140px !important;
      cursor: pointer;
    }
  }
  span {
    font-size: 22px;
  }
  // select {
  //   cursor: pointer;
  //   background: rgba(43, 246, 254, 0.2);
  //   border: rgba(118, 242, 251, 0.1);
  //   color: #fff;
  //   padding-left: 5px;
  //   option {
  //     background: #071022;
  //   }
  // }
  thead {
    tr {
      background: #0c1527;
      th {
        font-size: 24px;
      }
    }
  }
  tr:nth-child(odd) {
    background: #101f34;
  }
  tr:nth-child(even) {
    background: #0c1527;
  }
}
#hor-minimalist-a th {
  font-size: 14px;
  font-weight: normal;
  color: #039;
  /* padding: 10px 8px; */
  color: #67e1fb;
  text-align: center;
}
#hor-minimalist-a td {
  padding: 8px;
  color: #fff;
  font-size: 22px;
}
</style>
