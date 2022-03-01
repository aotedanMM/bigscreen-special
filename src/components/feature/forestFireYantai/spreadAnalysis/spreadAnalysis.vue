<template>
  <div class="panelPublicDefault spreadAnalysisWrap">
    <div class="panelPublicDefault_hd hd_class">
      <div class="title-panel">
        <span>蔓延分析</span>
        <ZoomBtn></ZoomBtn>
      </div>
    </div>
    <div class="panelPublicDefault_bd">
      <el-form
        ref="ruleForm"
        size="small"
        :model="forestAnalysisDatas"
        :rules="rules"
        default-time
        label-width="100px"
      >
        <el-scrollbar style="height:100%">
          <div class="splitLine">
            <div class="titleClass"><i class="el-icon-fire"></i>火源信息</div>
            <el-form-item label="起始时间">
              <el-date-picker
                type="datetime"
                placeholder="选择日期"
                v-model="forestAnalysisDatas.sourceInfo[0].startTime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-M-d HH:mm:ss"
                style="width: 100%;"
                :picker-options="pickerOptions0"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="火源位置" class="fire-position">
              <div class="gis-localtion-cont">
                <span class="gis-localtion-txt1">经度&nbsp;&nbsp;&nbsp;</span>
                <input type="text" v-model="localtionX" @input="handleInput" />
                <span class="gis-localtion-txt2">纬度&nbsp;&nbsp;&nbsp;</span>
                <input type="text" v-model="localtionY" @input="handleInput" />
                <!-- <span class="gis-localtion-search" @click="localtionClickFn"></span> -->
                <i class="gis-localtion-weizhi" @click="localtionGisFn"></i>
              </div>
            </el-form-item>
          </div>

          <div class="splitLine time">
            <div class="titleClass"><i class="el-icon-times"></i>分析时间</div>
            <el-form-item label="分析时长">
              <el-select
                v-model="forestAnalysisDatas.analysisTimeH"
                placeholder="请选择"
                width="60%"
              >
                <el-option
                  v-for="item in options"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
              <span class="unit">(小时)</span>
            </el-form-item>
            <el-form-item label="时间刻度">
              <el-select
                v-model="forestAnalysisDatas.analysisStepH"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in optionsH"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
              <!-- <el-input
                style="width: 70%;"
                class="lableContent csmMyInput"
                type="number"
                min="0.5"
                step="0.5"
                v-model="forestAnalysisDatas.analysisStepH"
              ></el-input> -->
              <span class="unit">(小时)</span>
            </el-form-item>
          </div>
          <div class="splitLine">
            <div class="titleClass">
              <i class="el-icon-qixiang"></i>气象信息
            </div>
            <div
              style="height:160px;border:1px solid rgb(38, 112, 200);margin-bottom:10px;padding: 5px;"
            >
              <el-scrollbar style="height:100%">
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
                          style="width: 70%;"
                          type="number"
                          min="0"
                          max="62"
                          v-model="item['103004']"
                          @keydown.native="channelInputLimit"
                        ></el-input>
                        <!-- <input type="text" v-model="item['103004']" /> -->
                      <span>{{item.speedLever}}级</span></td>

                      <td>
                        <el-select
                          v-model="item['103001']"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="(it, i) in windOption"
                            :key="i"
                            :label="it.value"
                            :value="it.value"
                          >
                          </el-option>
                        </el-select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </el-scrollbar>
            </div>
          </div>
          <!-- <div class="splitLine"></div> -->
          <div class="titleClass">
            <i class="el-icon-gelidai"></i>设置隔离带
            <span
              class="drawingClass"
              @click="drawClick"
            >
              +绘制
              <!-- <i class="el-icon-circle-plus" @click="drawClick"></i> -->
            </span>
          </div>
          <!-- <el-form-item label="绘制方式">
            <el-select
              v-model="drawingMode"
              style="width: 90%;"
              placeholder="请选择"
            >
              <el-option label="缓冲线" value="line"></el-option>
              <el-option label="缓冲面" value="polygon"></el-option>
            </el-select>
          </el-form-item> -->
          <el-scrollbar class="drawWrap">
            <div
              class="drawItem"
              v-for="(item, index) in forestAnalysisDatas.isolationInfo"
              :key="index"
            >
              <div
                class="titleWrap"
                @mouseover="mouseOverShow(item, index)"
                @mouseleave="mouseOverHide(item, index)"
              >
                <div>隔离带{{ index + 1 }}</div>
                <div class="drawItemCloseClass" @click="deleteDrawing(index)">
                  ×
                </div>
                <!-- <div class="drawingClass" @click="drawClick">+绘制</div> -->
              </div>
              <!-- <div class="content">
                {{ item }}
                <div class="drawItemCloseClass" @click="deleteDrawing(index)">
                  ×
                </div>
              </div> -->
            </div>
          </el-scrollbar>
        </el-scrollbar>
      </el-form>
      <div class="bottomClass">
        <el-button
          class="csmMySlider"
          type="primary"
          size="small"
          @click="submitForm('ruleForm')"
          >{{ loadingState ? "模型分析中" : "开始分析" }}</el-button
        >
      </div>
    </div>
    <div class="analysis-data" v-show="isShowTime">
      <div class="data-title">
        <span>蔓延趋势</span>
        <i></i>
      </div>
      <div class="data-main">
        <ul>
          <li>
            <span>当前分析时间点:</span>
            <span>{{this.forestAnalysisDatas.sourceInfo[0].startTime}}</span>
          </li>
          <li>
            <span>分析时段:</span>
            <span>第{{currentInfo.timeIndex}}个{{forestAnalysisDatas.analysisStepH === 0.5 ? '半小时' : (forestAnalysisDatas.analysisStepH === 1 ? '1小时' : '2小时')}}</span>
          </li>
          <li>
            <span>当前时点预测蔓延范围:</span>
            <span>{{currentInfo.currArea ? currentInfo.currArea : '--'}}平方公里</span>
          </li>
          <li>
            <span>总预测着火范围:</span>
            <span>{{this.currentInfo.allArea ? this.currentInfo.allArea : '--'}}平方公里</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import server from '@/api/feature/forestFireModuleYantai/installForestFireServer';
import FireUtil from './FireUtil';
import ZoomBtn from '../../flood/ZoomBtn.vue';
// import { geocodeServer } from "@/api/installServer.ts";
@Component({
  name: 'SpreadAnalysis',
  components: { ZoomBtn },
})
export default class SpreadAnalysis extends Vue {
  private get startTimeWatch() {
    return this.forestAnalysisDatas.sourceInfo[0].startTime;
  }
  private options = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
  private optionsH = [0.5, 1, 2];
  private loadingState = false;
  private localtionX: any = '';
  private localtionY: any = '';
  private isShowTime: boolean = true;
  private currentInfo: any = {
    timeIndex: 0,
    currArea: '',
    allArea: '',
  };
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
    analysisTimeH: 2,
    analysisStepH: 1,
    analysisTime: 0,
    analysisStep: 0,
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
  };

  private rules: any = {
    sourceInfo: [{ required: true, message: '请选择', trigger: 'blur' }],
    weatherInfo: [
      { required: true, validate: this.checkWeatherInfo, trigger: 'blur' },
    ],
  };
  private drawingMode: any = 'line';
  private windOption: any = [
    {
      title: '无风',
      value: '无风',
    },
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
    {
      title: '西西南风',
      value: '西西南风',
    },
    {
      title: '南西南风',
      value: '南西南风',
    },
    {
      title: '南东南风',
      value: '南东南风',
    },
    {
      title: '东东南风',
      value: '东东南风',
    },
    {
      title: '东东北风',
      value: '东东北风',
    },
    {
      title: '北东北风',
      value: '北东北风',
    },
    {
      title: '北西北风',
      value: '北西北风',
    },
    {
      title: '西西北风',
      value: '西西北风',
    },
  ];
  private listItemSetFlag: any = false;
  private drawIndex: any = 0;

  private isChangeFractionalSeconds = false;
  private lists = [];
  // 不能选今天以后得日期
  private pickerOptions0 = {
          disabledDate: (time: any) => {
             return time.getTime() > Date.now() - 8.64e6;
          },
  };
  constructor() {
    super();
  }
  @Watch('$store.state.eventPushStore.eventLocation.EventLon')
  public getEventLon() {
    this.localtionX = this.$store.state.eventPushStore.eventLocation.EventLon;
  }
  @Watch('$store.state.eventPushStore.eventLocation.EventLat')
  public EventLat() {
    this.localtionY = this.$store.state.eventPushStore.eventLocation.EventLat;
  }
  private channelInputLimit(e: any) {
    const key = e.key;
    // 不允许输入
    e.returnValue = false;
    return false;
  }

  // 监听初始化
  private async watchInit() {
    const component: any = await this.getComponent();
    component.on('isolationDrawEnd', (d: any) => {
      this.$set(this.forestAnalysisDatas.isolationInfo, this.drawIndex, d);
      this.drawIndex++;
    });
  }

  @Watch('forestAnalysisDatas.analysisTimeH')
  private analysisTimeChange(val: any) {
    if (!this.listItemSetFlag) {
      this.toDefaultWind();
    }
    this.$nextTick(() => {
      this.listItemSetFlag = false;
    });
  }
  @Watch('$store.state.forestFireModule.currentInfo', {deep: true})
  private getMapInfo(val: any) {
    this.currentInfo.timeIndex = Number(val.times) + 1;
    const currentDataArr: any = this.$store.state.forestFireModule.spreadResultData;
    const tempstr = '过火面积';
    if (currentDataArr && currentDataArr.Service_Info && currentDataArr.Service_Info.Parms_Return && currentDataArr.Service_Info.Parms_Return[tempstr] && currentDataArr.Service_Info.Parms_Return[tempstr].length > 0) {
      const tempData: any = currentDataArr.Service_Info.Parms_Return[tempstr];
      this.currentInfo.currArea = val.times === -1 ? 0 : Number(tempData[Number(val.times)]).toFixed(4);
      this.currentInfo.allArea = Number(tempData[tempData.length - 1]).toFixed(4);
    }
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
  // 开始绘制
  private async drawClick() {
    this.getComponent().draw_isolation(this.drawingMode, this.drawIndex);
  }
  // 鼠标移入到哪个隔离带，哪个隔离带高亮
  private mouseOverShow(item: any, index: any) {
    this.getComponent().highLightBuffer(index);
  }
  // 鼠标移出，清除高亮
  private mouseOverHide(item: any, index: any) {
    this.getComponent().clearHighLight();
  }

  // 删除绘制
  private async deleteDrawing(index: any) {
    const comp: any = await this.getComponent();
    comp.removeBuffer(index);
    this.drawIndex--;
    this.forestAnalysisDatas.isolationInfo.splice(index, 1);
  }
  // 提交
  private async submitForm(formName: any) {
     const comp: any = await this.getComponent();
     if (!this.localtionX || !this.localtionY) {
      this.$message('请选择火点得经纬度');
      return;
    }

     (this.$refs[formName] as any).validate((valid: any) => {
      if (valid) {
        this.$store.commit(
          'forestFireModule/setSpreadData',
          JSON.parse(JSON.stringify(this.forestAnalysisDatas)),
        );
        this.dealDatas();
        const parsedResult: any = {};
        FireUtil.parse(this.forestAnalysisDatas, parsedResult);
        // 事件经纬度、location、事发时间使用默认数据
        parsedResult['105600'] = {
          105602: {
            105041: this.lists,
          },
        };
        parsedResult['102079'] = '山东.烟台';
        parsedResult['112120'] = [
          {
            112103:
              this.forestAnalysisDatas.sourceInfo[0].startTime &&
              this.forestAnalysisDatas.sourceInfo[0].startTime !== null
                ? this.forestAnalysisDatas.sourceInfo[0].startTime
                : '',
            112105: {
              102201: 0,
              102204: [
                4326,
                Number(this.localtionX),
                Number(this.localtionY),
                0,
              ],
            },
          },
        ];
        this.loadingState = true;
        server.forestFireModelServer
          .analysis(JSON.stringify(parsedResult))
          .then((results: any) => {
            if (results.data.result && results.status) {
              const res = JSON.parse(results.data.result);
              if (
                res &&
                res.data &&
                !res.data.Model_Infos.GModel_Fire_Forest.Error_Info
                  .Err_Params_Check_Auto
              ) {
                this.$store.commit(
                  'forestFireModule/setShowSpreadTimeBar',
                  true,
                );
                this.loadingState = false;
                G.savedResult = res.data;
                // 蔓延分析结果数据存催
                this.$store.commit(
                  'forestFireModule/setSpreadResultData',
                  res.data,
                );
                this.isShowTime = true;
                console.log('蔓延分析成功');
                // this.getComponent().clearPoint();
              } else {
                this.isShowTime = false;
                this.$message(res.data.Model_Infos.GModel_Fire_Forest.Error_Info
                  .Err_Params_Check_Auto);
                this.loadingState = false;
                console.log('蔓延分析失败');
              }
            }
          });
      }
    });
  }
  // 处理数据，转成gis需要的数据
  private dealDatas() {
    // 把分析时长转换成秒
    this.forestAnalysisDatas.analysisTime =
      this.forestAnalysisDatas.analysisTimeH * 60 * 60;
    // 把时间刻度转换成秒
    this.forestAnalysisDatas.analysisStep =
      this.forestAnalysisDatas.analysisStepH * 60 * 60;
  }

  private created() {
    this.isShowTime = false;
    this.watchInit();
    this.localtionX = this.$store.state.eventPushStore.eventLocation.EventLon
      ? this.$store.state.eventPushStore.eventLocation.EventLon
      : '';
    this.localtionY = this.$store.state.eventPushStore.eventLocation.EventLat
      ? this.$store.state.eventPushStore.eventLocation.EventLat
      : '';

    // 风场的开始和结束时间范围确定
    this.changeAnalysisTimeH(24);
    this.getNowTime();
    // this.toDefaultWind();
    if (this.$store.state.firePointInfo.clickFirePoint) {
      this.localtionX = this.$store.state.firePointInfo.firePointXY[0];
      this.localtionY = this.$store.state.firePointInfo.firePointXY[1];
    }
  }

  @Watch('startTimeWatch')
  private startTimeChange(val: any) {
    this.toDefaultWind();

  }
 @Watch('lists', {deep: true})
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
          if (Number(item['103004']) >= 10.8 && Number(item['103004']) <= 13.8 ) {
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
  // 根据火电开始时间和分析时长，获取风场信息
  private toDefaultWind() {
    const opt = {
      startDate: this.forestAnalysisDatas.sourceInfo[0].startTime,
      duration: this.forestAnalysisDatas.analysisTimeH,
    };
    console.log(opt, 'opt');
    if (opt.startDate !== null && opt.duration) {
      server.forestFireModelServer.getDefaultWind(opt).then((res: any) => {
        if (res.status === 200) {
          this.setWindSpeed(res.data);
          this.lists = res.data;
        }
      });
    }

  }
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'forestFireComponent',
    );
    return component;
  }
  private getComponent1() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.forestFireFactory.getComponent('spreadAnalysis');
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
  private windStartTimeChange(curtime: any) {
    // // 风场只有风场1
    // let windArrOld: any = this.forestAnalysisDatas.weatherInfo.windInfo.windArrOld;
    // windArrOld.forEach((item: any, index: number) => {
    //   if(curtime > new Date(item.windStartTime).getTime() && curtime < new Date(item.windEndTime).getTime()) {
    //     this.$message({type: 'warning', message: '起始时间和其他风场起始时间范围内，请重新变更时间！'})
    //     return '';
    //   }
    // });
  }
  // 当前风场结束时间改变方法
  private windEndTimeChange(curtime: any) {
    // // 风场只有风场1
    // let windArrOld: any = this.forestAnalysisDatas.weatherInfo.windInfo.windArrOld;
    // windArrOld.forEach((item: any, index: number) => {
    //   if(curtime > new Date(item.windStartTime).getTime() && curtime < new Date(item.windEndTime).getTime()) {
    //     this.$message({type: 'warning', message: '起始时间和其他风场起始时间范围内，请重新变更时间！'})
    //     return false;
    //   }
    // });
  }
  // 删除绘制
  private async deleteDrawings(index: any) {
    const comp: any = await this.getComponent();
    comp.removeBuffer(index);
  }
  private destroyed() {
    this.getComponent().clearPoint();
    this.$store.commit('firePointInfo/setClickFirePoint', false);
    this.$store.commit('firePointInfo/setFirePointXY', []);
    this.$store.commit('forestFireModule/setShowSpreadTimeBar', false);
    if (this.forestAnalysisDatas.isolationInfo.length > 0) {
      for (
        var i = this.forestAnalysisDatas.isolationInfo.length - 1;
        i >= 0;
        i--
      ) {
        this.deleteDrawings(i);
      }
    }
  }
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
    this.isChangeFractionalSeconds = !this.isChangeFractionalSeconds;
    if (this.isChangeFractionalSeconds) {
      this.getComponent().on(
        'getAddress',
        (data: any) => {
          this.localtionX = String(data.x).replace(/^(.*\..{5}).*$/, '$1');
          this.localtionY = String(data.y).replace(/^(.*\..{5}).*$/, '$1');
        },
        this,
      );
      this.getComponent().draw_point();
      // this.$store.commit('forestFireModule/setShowSpreadTimeBar', false);
    } else {
      this.getComponent().clearPoint();
    }
  }
}
</script>

<style scoped lang="less">
@import url("../../../../assets/css/decisionSupport/Statistic.half.less");
@forestFire: "../../../../assets/img/forestFire";
@urlBase: "../../../../assets/img/default/panel";
.spreadAnalysisWrap {
  .cursor {
    cursor: pointer;
  }
  .panelPublicDefault_bd {
    // height: calc(100% - 230px) !important;
    .gis-localtion-cont {
      width: 360px;
      height: 55px;
      align-items: center;
      position: relative;
      display: flex;
      font-size:20px;
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
  .splitLine {
    border-bottom: 1px solid #3e808c;
  }
  .titleClass {
    color: #8de5fc;
    font-size: 26px;
    line-height: 40px;
    .drawingClass{
      cursor: pointer;float:right;font-size: 20px;margin: 8px 16px 0;font-size:24px;
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
    .el-icon-fire {
      background: url("@{forestFire}/analicy-fire-icon.png") no-repeat center
        center;
      top: 11px;
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
    margin: 10px 22%;
    display: block;
    width: 169px;
    height: 52px;
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
  .analysis-data {
    width: 405px;
    height: 255px;
    position: fixed;
    top: 102px;
    left: 543px;
    .data-title {
      width: 100%;
      height: 40px;
      display: flex;
      font-weight: 600;
      font-family: 'myHeiti';
      font-size: calc(20px * 1.5);
      color: #00e4ff;
      background: url("@{urlBase}/half_bg_top.png") no-repeat;
      background-size: 100% 100%;
      text-indent: 25px;
      letter-spacing: 1px;
      font-style: italic;
    }
    .data-main {
      width: 100%;
      height: calc(100% - 40px);
      background: url("@{urlBase}/half_bg1.png") no-repeat;
      background-size: 100% 100%;
      color: #fff;
      font-size: 22px;
      line-height: 41px;
      text-indent: 5px;
      ul {
        padding-top: 13px;
        li {
          span {
            &:nth-child(2) {
              padding-left: 8px;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.spreadAnalysisWrap {
  .hd_class{
    line-height: 29px!important;
  }
  .el-input__inner {
    background: rgba(43, 246, 254, 0.2);
    color: #fff;
    border: rgba(118, 242, 251, 0.1);
    font-size: 22px;
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
.spreadAnalysisWrap {
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
    margin-right:10px;
  }
  .el-select {
    .el-input {
      width: 140px !important;
      cursor: pointer;
    }
  }
  span{
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
      th{
        font-size:24px;
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
  font-size:22px;
}
</style>
