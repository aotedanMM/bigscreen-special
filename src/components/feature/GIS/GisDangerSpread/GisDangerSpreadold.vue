<template>
  <div class="GisDangerSpread-old">
    <div class="GisDangerSpread-title">
      <span class="title-content">危化品大气扩散</span>
    </div>
    <span class="halflist-back" @click="handleBackParent"></span>
    <div class="GisDangerSpread-content">
      <el-scrollbar style="height: 100%;">
        <el-form ref="dangerform" :model="formData" :rules="formRules">
          <el-form-item>
            <div class="GisInputPanelSubTitleOne">模型信息</div>
            <div class="GisTableFelxBox">
              <div class="GisTable_left">
                <div class="Proiect_name">
                  
                  <el-form-item prop="ProiectName" >
                    <span class="GisInputPanelTitleTwoFelxBox_right_title" style="margin-right: 90px;">案例名称</span>
                     <el-input placeholder="建议格式： xx(物质)xx(事故类型)事故" v-model="formData.ProiectName"> </el-input> 
                  </el-form-item>
                </div>
                <div class="modelInfo-title">
                  <el-form-item prop="happenTimeVal" >
                    <span class="GisInputPanelTitleTwoFelxBox_right_title">泄漏事故发生时间</span>
                    <el-date-picker
                      v-model="formData.happenTimeVal"
                      type="datetime"
                      placeholder="选择日期时间"
                      default-time="00:00:00">
                    </el-date-picker>
                  </el-form-item>
                </div>
                <div class="modeltime modelInfo-title">
                  <el-row>
                    <el-col :span="15">
                      <el-form-item prop="modeltimeday">
                        <span class="GisInputPanelTitleTwoFelxBox_right_title">模拟持续时间</span>
                        <el-input placeholder=" " v-model="formData.modeltimeday">
                          <template slot="append">天</template>
                        </el-input>
                      </el-form-item>                     
                    </el-col>
                    <el-col :span="4">
                      <el-form-item prop="modelTimeHour">
                        <el-input placeholder=" " v-model="formData.modelTimeHour">
                          <template slot="append">小时</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  
                  
                </div>
                <div class="modeltime modelInfo-title">
                  <el-form-item prop="modelstep">
                    <span class="GisInputPanelTitleTwoFelxBox_right_title">模拟时间步长</span>
                    <el-input placeholder=" " v-model="formData.modelstep">
                      <template slot="append">秒</template>
                    </el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item prop="addressInfo">
            <div class="GisInputPanelSubTitleOne">地点信息</div>
            <div class="GisTableFelxBox">
              <div class="GisTable_left">
                <div>
                  <span class="GisInputPanelTitleTwoFelxBox_right_title">泄漏地点地貌</span>
                  <el-radio v-model="formData.addselect" :label="'城市地貌'">城市地貌</el-radio>
                  <el-radio v-model="formData.addselect" :label="'郊区地貌'">郊区地貌</el-radio>   
                </div>
                <div class="eventAddress">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="lon">
                        <span class="GisInputPanelTitleTwoFelxBox_right_title">事件地点</span>
                        <el-input placeholder="经度" v-model="formData.lon">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="lat">
                        <el-input placeholder="纬度" v-model="formData.lat">
                        </el-input>
                        <div
                          class="GisTable_right_operation_right Pointer"
                          @click="getPosition"
                        ></div>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item prop="weatherInfo">
            <div class="GisInputPanelSubTitleOne">气象信息</div>
            <div class="GisTableFelxBox weather-info">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="手动输入" name="first">
                  <div>
                    <span style="color: #e5f4ff;font-size: 20px;">风</span>
                  </div>
                  <div class="tabsboxs">
                    <div class="boxleft">
                      <el-form-item prop="weatherWind">
                        <el-table
                        :data="formData.weatherWind"
                        style="width: 100%"
                        :row-style="getRowClass"
                        :header-row-style="getRowClass"
                        :header-cell-style="getRowClass"
                        :highlight-current-row="false"
                        border
                      >
                        <el-table-column label="开始时间" width="/">
                          <template slot-scope="scope">
                            <div class="tableInputFelxBox">
                              <div class="tableInputFelxBox_left" style="width:100%">
                                <el-form-item :prop="'weatherWind.' + scope.$index +'.startTime'"
                                :rules="formRulesForWind.startTime"
                                >
                                  <el-date-picker
                                    v-model="scope.row.startTime"
                                    type="datetime"
                                    placeholder="选择日期时间"
                                    default-time="00:00:00">
                                  </el-date-picker> 
                                </el-form-item>
                              </div>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column label="风速/米每秒" width="70">
                          <template slot-scope="scope">
                            <div class="tableInputFelxBox">
                              <div class="tableInputFelxBox_left">
                                <el-form-item :prop="'weatherWind.' + scope.$index +'.windSpeed'"
                                  :rules="formRulesForWind.windSpeed"
                                >
                                  <el-input type="text" placeholder="0-40" v-model="scope.row.windSpeed" ></el-input>
                                </el-form-item>
                              </div>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column label="风向/八风向" width="80">
                          <template slot-scope="scope">
                            <div class="tableInputFelxBox">
                              <div class="tableInputFelxBox_left">
                                <!-- <input type="text" v-model="scope.row.windDirection" /> -->
                                <el-select v-model="scope.row.windDirection" placeholder="请选择">
                                  <el-option
                                    v-for="item in windOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                  >
                                  </el-option>
                                </el-select>
                              </div>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column label="持续时间/小时" width="70">
                          <template slot-scope="scope">
                            <div class="tableInputFelxBox">
                              <div class="tableInputFelxBox_left">
                                <el-form-item :prop="'weatherWind.' + scope.$index +'.windHour'"
                                  :rules="formRulesForWind.windHour"
                                >
                                  <el-input type="text" v-model="scope.row.windHour" ></el-input>
                                </el-form-item>
                                
                              </div>
                            </div>
                          </template>
                        </el-table-column>
                        </el-table>
                      </el-form-item>
                    </div>
                    <div class="boxright">
                      <div
                        class="GisTable_right_button"
                        @click="FnFireFightingApparatusAdd()"
                      >
                        新增
                      </div>
                      <div
                        class="GisTable_right_operation"
                        v-for="(item, index) in formData.weatherWind"
                        :key="item + index"
                        style="height:48px"
                      >
                        <div
                          class="GisTable_right_operation_left Pointer"
                          @click="FnFireFightingApparatusDelect(index)"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div style="margin-top: 13px;">
                    <span style="color: #e5f4ff;font-size: 20px;">云量</span>
                    <div class="cloudnumIcon"></div>
                  </div>
                  <div class="cludnum">
                    <el-radio v-model="formData.cloudnum" :label="1">总云量≤4成/低云量≤4成</el-radio>
                    <el-radio v-model="formData.cloudnum" :label="2">总云量5~7成/低云量≤4成</el-radio>
                    <el-radio v-model="formData.cloudnum" :label="3">总云量≥8成/低云量≤4成</el-radio>
                    <el-radio v-model="formData.cloudnum" :label="4">总云量≥5成/低云量5~7成</el-radio>
                    <el-radio v-model="formData.cloudnum" :label="5">总云量≥8成/低云量≥8成</el-radio>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="自动输入" name="second">
                  <div class="autoinput">敬请期待。。。。</div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-form-item>
          <el-form-item prop="levealInfo">
            <div class="GisInputPanelSubTitleOne">泄漏信息</div>
            <div class="GisTableFelxBox">
              <div class="matterInfo">
                <el-form-item prop="matter">
                  <span class="GisInputPanelTitleTwoFelxBox_right_title">泄漏物质</span>
                  <el-select v-model="formData.matter" placeholder="请选择">
                    <el-option
                      v-for="item in matterType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="matterInfo" style="margin-top: 24px;">
                <span class="GisInputPanelTitleTwoFelxBox_right_title">泄漏总量</span>
                <div class="matterbox">
                  <span class="box-title">容器是否发生灾难性/脆性失效事故:</span>
                  <el-select v-model="formData.ishappendmatter" placeholder="请选择">
                    <el-option label="是" value="是"></el-option>
                    <el-option label="否" value="否" ></el-option>
                  </el-select>
                </div>
                <div class="matterbox">
                  <span class="box-title">是否为稳定泄漏:</span>
                  <el-select v-model="formData.ismatter" placeholder="请选择">
                    <el-option label="是" value="是"></el-option>
                    <el-option label="否" value="否" ></el-option>
                  </el-select>
                </div>
                <div class="matterbox">
                  <span class="box-title">泄漏速率单位:</span>
                  <el-select v-model="formData.matterunit" placeholder="请选择">
                    <el-option label="克/秒" value="克/秒"></el-option>
                    <el-option label="千克/秒" value="千克/秒" ></el-option>
                    <el-option label="克/小时" value="克/小时" ></el-option>
                    <el-option label="千克/小时" value="千克/小时" ></el-option>
                  </el-select>
                </div>    
              </div>
              <div class="matterInfo">
                <div class="boxleft">
                  <el-form-item prop="levealData">
                    <el-table
                    :data="formData.levealData"
                    style="width: 100%"
                    :row-style="getRowClass"
                    :header-row-style="getRowClass"
                    :header-cell-style="getRowClass"
                    :highlight-current-row="false"
                    border
                  >
                    <el-table-column label="开始时间" width="/">
                      <template slot-scope="scope">
                        <div class="tableInputFelxBox">
                          <div class="tableInputFelxBox_left" style="width:100%">
                            <el-form-item :prop="'levealData.' + scope.$index +'.startTime'"
                                :rules="formRulesForMatter.startTime"
                                >
                              <el-date-picker
                                v-model="scope.row.startTime"
                                type="datetime"
                                placeholder="选择日期时间"
                                default-time="00:00:00">
                              </el-date-picker> 
                            </el-form-item>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="泄漏源高度/米" width="70">
                      <template slot-scope="scope">
                        <div class="tableInputFelxBox">
                          <div class="tableInputFelxBox_left">
                            <el-form-item :prop="'levealData.' + scope.$index +'.levealHeight'"
                                :rules="formRulesForMatter.levealHeight"
                                >
                                <el-input type="text" v-model="scope.row.levealHeight"> </el-input>
                            </el-form-item>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="泄漏速率" width="80">
                      <template slot-scope="scope">
                        <div class="tableInputFelxBox">
                          <div class="tableInputFelxBox_left">
                            <!-- <input type="text" v-model="scope.row.windDirection" /> -->
                            <el-form-item :prop="'levealData.' + scope.$index +'.levealSpeed'"
                                :rules="formRulesForMatter.levealSpeed"
                                >
                              <el-input type="text" v-model="scope.row.levealSpeed"> </el-input>
                            </el-form-item>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="持续时间/小时" width="70">
                      <template slot-scope="scope">
                        <div class="tableInputFelxBox">
                          <div class="tableInputFelxBox_left">
                             <el-form-item :prop="'levealData.' + scope.$index +'.levealHour'"
                                :rules="formRulesForMatter.levealHour"
                                >
                              <el-input type="text" v-model="scope.row.levealHour"> </el-input>
                             </el-form-item>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                  </el-form-item>
                </div>
                <div class="boxright">
                  <div
                    class="GisTable_right_button"
                    @click="FnLevealAdd()"
                  >
                    新增
                  </div>
                  <div
                    class="GisTable_right_operation"
                    v-for="(item, index) in formData.levealData"
                    :key="item + index"
                    style="height:48px"
                  >
                    <div
                      class="GisTable_right_operation_left Pointer"
                      @click="FnLevealDelect(index)"
                    ></div>
                  </div>
                </div>
              </div>

            </div>
          </el-form-item>
          <el-form-item>
            <div class="GisInputPanleButton_box">
              <div class="GisInputPanleButton Pointer" @click="FnEmpty()">
                <div class="GisInputPanleButton_icon">
                  <img src="../GisStorageTank/img/clear.png" alt="" />
                </div>
                <div class="GisInputPanleButton_title">清空</div>
              </div>
              <div class="GisInputPanleButton Pointer" @click="FnSubmit()">
                <div class="GisInputPanleButton_icon">
                  <img src="../GisStorageTank/img/sumbit.png" alt="" />
                </div>
                <div class="GisInputPanleButton_title">提交</div>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>
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
            >
              <span :class="item.checked ? 'activeIndex' : ''">{{item.value}}</span>
              <i @click="nextFn(item, index)" :class="item.checked ? 'activei' : ''"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { gisDangerSpreadServer } from '@/api/installServer';
@Component({
  name: 'GisDangerSpreadold',
  components: {
  },
})
export default class GisDangerSpreadold extends Vue {
  private formData: any = {
    ProiectName: '', // 案例名称
    happenTimeVal: '', // 泄漏事故发生时间
    modeltimeday: 0,  // 模拟持续时间 天
    modelTimeHour: 0, // 模拟持续时间 小时
    modelstep: 0, // 模拟时间步长
    lon: 0, // 经度
    lat: 0, // 纬度
    weatherWind: [
      {
        startTime: '',
        windSpeed: 14.7,
        windDirection: '东南风',
        windHour: 0,
      },
    ], // 气象信息 风的数据
    addselect: '城市地貌', // 泄漏地点类型
    cloudnum: 1, // 云量类型
    matter: '', // 泄漏物质
    ishappendmatter: '否', // 容器是否发生灾难性/脆性失效事故
    ismatter: '否', // 是否为稳定泄漏
    matterunit: '千克/小时', // 泄漏速率单位
    levealData: [{
      startTime: '',
      levealHeight: '',
      levealSpeed: 0,
      levealHour: 1,
    }], // 泄漏总量信息
  };
  private windOptions: any = [ // 风级别
    {
      value: '无风',
      label: '无风',
    },
    {
      value: '东风',
      label: '东风',
    },
    {
      value: '西风',
      label: '西风',
    },
    {
      value: '南风',
      label: '南风',
    },
    {
      value: '北风',
      label: '北风',
    },
    {
      value: '东北风',
      label: '东北风',
    },
    {
      value: '东南风',
      label: '东南风',
    },
    {
      value: '西北风',
      label: '西北风',
    },
    {
      value: '西南风',
      label: '西南风',
    },
  ];
  private matterType: any = []; // 泄漏物质类型
  private activeName: string = 'first'; // 气象信息切换 默认手动输入
  private formRules: any = {
    ProiectName: [{required: true, message: '案例名称不能为空'}],
    happenTimeVal: [{required: true, message: '泄漏事故发生时间不能为空'}],
    modeltimeday: [{type: 'number', validator: this.valifunc, trigger: 'blur'}],
    modelTimeHour: [{type: 'number', validator: this.valifunc, trigger: 'blur'}],
    modelstep: [{type: 'number', validator: this.valifunc, trigger: 'blur'}],
    lon: [{type: 'number', validator: this.valifunc, trigger: 'blur'}],
    lat: [{type: 'number', validator: this.valifunc, trigger: 'blur'}],
    levealData:  [{required: true, message: '泄漏物质信息不能为空'}],
    weatherWind: [{required: true, message: '风信息不能为空'}],
    matter:  [{required: true, message: '泄漏物质类型不能为空'}],
  };
  private formRulesForWind: any = { // 验证风信息
    startTime: [{ required: true, message: '开始时间不能为空'}],
    windSpeed: [{ required: true, message: '风速不能为空'},
                  { type: 'number', validator: this.valifunc, trigger: 'blur'}],
    windHour:  [{ required: true, message: '持续时间不能为空'},
                  { type: 'number', validator: this.valifunc, trigger: 'blur'}],
  };
  private formRulesForMatter: any = { // 验证泄漏物质
    startTime: [{ required: true, message: '开始时间不能为空'}],
    levealHeight: [{ required: true, message: '泄漏源高度不能为空'},
                  { type: 'number', validator: this.valifunc, trigger: 'blur'}],
    levealSpeed: [{ required: true, message: '泄漏速率不能为空'},
                  { type: 'number', validator: this.valifunc, trigger: 'blur'}],
    levealHour:  [{ required: true, message: '持续时间不能为空'},
                  { type: 'number', validator: this.valifunc, trigger: 'blur'}],
  };
  private isShowPlay = true; // 是否显示播放
  private isPlay: boolean = false; // 是否播放
  private autoPlay: any = ''; // 自动播放定时器
  private activeIndex: number = 0; // 播放位置
  private timeSteps: any = [
    {
      value: '10',
      checked: false,
    },
    {
      value: '20',
      checked: false,
    },
    {
      value: '30',
      checked: false,
    },
    {
      value: '40',
      checked: false,
    },
    {
      value: '50',
      checked: false,
    },
    {
      value: '60',
      checked: false,
    },
    {
      value: '70',
      checked: false,
    },
  ]; // 播放步长
  /**
   * 自定义验证
   * parm 判断验证哪个
   */
  private valifunc(rule: any, value: any, callback: any) {
    if (rule.field === 'modeltimeday') {
      if (value === '' || value === '0' || value === 0) {
        if (this.formData.modelTimeHour === '' || this.formData.modelTimeHour === '0' || this.formData.modelTimeHour === 0) {
          return callback(new Error('不能同时为0或者为空'));
        }
      }
      if (!Number(value) && Number(value) !== 0 ) {
        return callback(new Error('必须为数字'));
      }
      if (value > 1) {
        return callback(new Error('不能大于1天'));
      }
      if (Number(value) === 1) {
        if (this.formData.modelTimeHour && this.formData.modelTimeHour !== '0') {
          return callback(new Error('不能大于1天'));
        }
      }
    }
    if (rule.field === 'modelTimeHour') {
      if (value === '' || value === '0' || value === 0) {
        if (this.formData.modeltimeday === '' || this.formData.modeltimeday === '0' || this.formData.modeltimeday === 0) {
          return callback(new Error('不能同时为0或者为空'));
        }
      }
      if (!Number(value) && Number(value) !== 0 ) {
        return callback(new Error('必须为数字'));
      }
      if (Number(value) > 24) {
        return callback(new Error('不能大于1天'));
      }
      console.log(this.formData.modeltimeday);
      if (this.formData.modeltimeday === '1') {
        if (Number(value) > 0) {
          return callback(new Error('不能大于1天'));
        }
      }
    }
    if (rule.field === 'modelstep' || rule.field === 'lon' || rule.field === 'lat' ) {
      if (value === '' && value !== 0) {
        return callback(new Error('不能为空'));
      }
      if (!Number(value) && Number(value) !== 0 ) {
        return callback(new Error('必须为数字'));
      }
    }
    if (rule.type === 'number' && !Number(value) && Number(value) !== 0) {
      return callback(new Error('必须为数字'));
    }
    callback();
  }
  private isShowPlaybtn() {
    this.isShowPlay = !this.isShowPlay;
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
      });
    });
  }
   private getComponent() {
    const gisModules = this.$ioc.resolve('GISFactory-map');
    const component = gisModules.commonFactory.getComponent('chemicalleak');
    return component;
  }
  // 切换气象信息
  private handleClick(tab: any, event: any) {
    console.log(tab, event);
  }
  // 表格行背景样式
  private getRowClass({ row, column, rowIndex, columnIndex }: any): any {
    return 'background:#3f5c6d2c;color:#ffffff;text-align:center;';
  }

  // 点击新增 表格新增一行 (气象信息)
  private FnFireFightingApparatusAdd() {
    this.formData.weatherWind.push({
      startTime: '',
      windSpeed: 14.7,
      windDirection: '东南风',
      windHour: 0,
    });
  }

  // 删除一行 (气象信息)
  private FnFireFightingApparatusDelect(val: any): void {
    this.formData.weatherWind.splice(val, 1);
  }
  // 新增一行 泄漏总量
  private FnLevealAdd() {
    this.formData.levealData.push({
      startTime: '',
      levealHeight: 0,
      levealSpeed: 0,
      levealHour: 1,
    });
  }
  // 删除一行 (泄漏总量)
  private FnLevealDelect(val: any): void {
    this.formData.levealData.splice(val, 1);
  }
  // 获取地图坐标点
  private getPosition() {
    this.getComponent().setIgnitionPoint('大气扩散', '1', 32);
  }
  // 清空
  private FnEmpty() {
    this.getComponent().removeIgnitionPointLayer('1');
    this.formData = {
      ProiectName: '', // 案例名称
      happenTimeVal: '', // 泄漏事故发生时间
      modeltimeday: 0,  // 模拟持续时间 天
      modelTimeHour: 0, // 模拟持续时间 小时
      modelstep: 0, // 模拟时间步长
      lon: 0, // 经度
      lat: 0, // 纬度
      weatherWind: [{
        startTime: '',
        windSpeed: 14.7,
        windDirection: '东南风',
        windHour: 0,
      }], // 气象信息 风的数据
      addselect: '城市地貌', // 泄漏地点类型
      cloudnum: 1, // 云量类型
      matter: '', // 泄漏物质
      ishappendmatter: '否', // 容器是否发生灾难性/脆性失效事故
      ismatter: '否', // 是否为稳定泄漏
      matterunit: '千克/小时', // 泄漏速率单位
      levealData: [{
        startTime: '',
        levealHeight: 0,
        levealSpeed: 0,
        levealHour: 1,
      }], // 泄漏总量信息
    };
  }
  // 提交
  private FnSubmit() {
    const dom: any = this.$refs.dangerform;
    console.log('jin');
    dom.validate((valid: any) => {
      console.log('ssss-----', valid);
    });
  }
  // 点击播放按钮开始或关闭
  private playFn() {
    this.isPlay = !this.isPlay;
    if (this.isPlay) {
      this.autoPlayFn();
    } else {
      clearInterval(this.autoPlay);
    }
  }
   // 点击播放条指定位置
  private nextFn(item: any, index: any) {
    this.isPlay = false;
    this.timeSteps.map((timeItem: any, itemIndex: number) => {
      timeItem.checked = false;
      if (itemIndex <= index) {
        timeItem.checked = true;
      }
    });
    this.activeIndex = index;
    // this.getComponent()._play(this.activeIndex);
    clearInterval(this.autoPlay);
  }
  // 播放定时器
  private autoPlayFn() {
      this.timeSteps[0].checked = true;
      this.autoPlay = setInterval(() => {
      this.activeIndex++;
      if (this.activeIndex > this.timeSteps.length - 1) {
        this.activeIndex = 0;
        clearInterval(this.autoPlay);
        this.isPlay = false;
        this.timeSteps.map((item: any) => {
          item.checked = false;
        });
      } else {
        this.timeSteps[this.activeIndex].checked = true;
      }

      // this.getComponent()._play(this.activeIndex);
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
    // this.getComponent()._clear();
  }
  // 返回一级页面
  private handleBackParent() {
    this.$emit('tobackParent');
  }

  private created() {
    this.getComponent().on('chemicalLeak', (data: any) => {
      this.formData.lon = data.x.toFixed(5);
      this.formData.lat = data.y.toFixed(5);
    }, this);
    this.getLevealMatter();
  }
  private beforeDestroy() {
        // 获取父级元素
    const el: any = document.getElementById('right_function_box');
    if (el) {
      // 设置父级元素宽度
      el.style.width = '390px';
    }
  }
}
</script>
<style scoped lang="less">
@imgPath: '../../../../assets/img/gisModule/legendPlanel';
.GisDangerSpread {
  position: relative;
  .halflist-back {
    width: 61px;
    height: 25px;
    position: absolute;
    top: 10px;
    left: 455px;
    color: #338af8;
    cursor: pointer;
    z-index: 1;
    background: url('../../../../assets/img/default/panel/toBack.png') no-repeat
      0px 70%;
    background-size: 100% 100%;
    &:hover {
      background-image: url('../../../../assets/img/default/panel/toBack_h.png');
    }
  }
  .GisDangerSpread-title {
    // font-size:20px;
    // font-weight: 600;
    // padding-left: 28px;
    // line-height: 32px;
    // font-family: 'myHeiti';
    // font-style: italic;
    // background:-webkit-linear-gradient(top,#f5f7c3 10%,#00e4ff);
    // -webkit-text-fill-color: transparent;
    // background-clip: text;
    // -webkit-background-clip: text;
    // letter-spacing: -1px;
    width: 517px;
    height: 35px;
    background: url('./img/title.png') no-repeat;
    background-size: 100% auto;
    .title-content {
      display: block;
      width: 61%;
      font-size: calc(20px * 1.5);
      font-weight: 600;
      padding-left: 28px;
      line-height: 32px;
      font-family: 'myHeiti';
      font-style: italic;
      background:-webkit-linear-gradient(top,#f5f7c3 10%,#00e4ff);
      -webkit-text-fill-color: transparent;
      background-clip: text;
      -webkit-background-clip: text;
      letter-spacing: -1px;
    }
    
  }
  .Proiect_name {
    margin-top: 20px;
    .GisInputPanelTitleTwoFelxBox_right_title {
      margin-right: 89px;
    }
    .el-input {
      width: 54%;
    }
  }
  .GisTableFelxBox {
    &:nth-child(2) {
      .GisInputPanelTitleTwoFelxBox_right_title {
        margin-right: 52px;
        &:nth-child(2) {
          margin-right: 90px;
        }
      }
    }
  }
  .modelInfo-title {
    margin-top: 14px;
    .GisInputPanelTitleTwoFelxBox_right_title {
      margin-right: 52px;
    }
    &:nth-child(2) {
      .GisInputPanelTitleTwoFelxBox_right_title {
        margin-right: 15px;
      }     
    }
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .GisDangerSpread-content {
    width: 517px;
    height: 888px;
    background: url(./img/contentbg.png) no-repeat;
    background-size: 100% 100%;
  }
  .GisInputPanelSubTitleOne {
    width: 240px;
    height: 35px;
    background-image: url(../GisStorageTank/img/titleOne.png);
    background-size: 100% 100%;
    text-align: center;
    color: #00e4ff;
    line-height: 35px;
    font-size: 26px;
    margin: 40px 0 10px 19px;
  }
  .GisInputPanelTitleTwoFelxBox_right_title {
    font-size: 19px;
    color: #e5f4ff;
    margin-right: 10px;
    margin-left: 3%;
    line-height: 41px;
  }
  .modeltime {
    width: 100%;
    .el-input {
      width: 133px;
      margin-right: 13px;
    }
  }
  .eventAddress {
    width: 100%;
    position: relative;
    .el-input {
      width: 43%;
      &:nth-child(3) {
        margin-left: 101px;
      }
    }
    .el-input-group--append {
      width: 64%;
      margin-left: 20%;
      margin-top: 5px;
    }
  }
  .weather-info {
    width: 92%;
    margin: 0 auto;
  }
  .tabsboxs {
    display: flex;
  }
  .boxleft{
    width: 89%;
    height: auto;
  }
  .boxright {
    width: 9%;
    height: auto;
  }
  .GisTable_right_button {
    width: 36px;
    height: 27px;
    margin: 0 10px;
    margin-top: 15px;
    margin-left: 7px;
    margin-bottom: 29px;
    text-align: center;
    font-size: 12px;
    line-height: 22px;
    color: #00e4ff;
    cursor: pointer;
    background: url(../GisStorageTank/img/add.png) no-repeat;
    background-size: 100% auto;
  }
  .GisTable_right_button:hover {
    background: url(../GisStorageTank/img/add_hover.png) no-repeat;
    background-size: 100% auto;
  }
  .GisTable_right_operation {
    width: 55px;
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .GisTable_right_operation_right {
    width: 15px;
    height: 20px;
    background-image: url(../GisStorageTank/img/mapPosistion.png);
    background-size: 100% 100%;
    position: absolute;
    left: 120px;
    top: 13px;
    cursor: pointer;
  }
  .GisTable_right_operation_left {
    width: 15px;
    height: 20px;
    background-image: url(../GisStorageTank/img/closeList.png);
    background-size: 100% 100%;
    margin: 0 10px;
  }
  .tableInputFelxBox {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tableInputFelxBox_left {
    width: 100%;
    height: 100%;
  }
  .tableInputFelxBox_left input {
    background: rgba(0, 0, 0, 0);
    width: 100%;
    height: 100%;
    border: none;
    text-align: center;
    font-size: 14px;
    color: #fff;
  }
  .tableInputFelxBox_right {
    width: 30%;
    font-size: 22px;
  }
  .autoinput {
    color: #e5f4ff;
    font-size: 16px;
    text-align: center;
  }
  .cludnum {
    display: flex;
    flex-direction: column;
    padding-left: 55px;
    .el-radio {
      margin-top: 16px;
    }
  }
  .matterInfo {
    &:last-child {
      display: flex;
      margin-right: 2%;
      margin-left: 3%;
    }
    .matterbox {
      width: 92%;
      margin-left: 24px;
      display: flex;
      margin-bottom: 10px;
      .box-title {
        flex: 2;
        font-size: 16px;
        color: #e5f4ff;
      }
      .el-select {
        flex: 1;
      }
    }
  }

  .GisInputPanleButton_box {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
  }
  .GisInputPanleButton {
    width: 103px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background: url(../GisStorageTank/img/clearAndSumbit.png);
    background-size: 100% 100%;
    margin: 0 20px;
  }
  .GisInputPanleButton:hover {
    width: 103px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url(../GisStorageTank/img/clearAndSumbit_hover.png);
    background-size: 100% 100%;
    margin: 0 20px;
  }
  .GisInputPanleButton_icon {
    width: 27px;
    height: 27px;
    margin-right: 10px;
  }
  .GisInputPanleButton_icon img {
    width: 100%;
    height: 100%;
  }
  .GisInputPanleButton_title {
    width: auto;
    height: 30px;
    line-height: 30px;
    font-size: 17px;
    color: #70feff;
  }
  /deep/.el-tabs__item {
    color: #e5f4ff;
    font-size: 18px;
  }
  /deep/ .el-input__inner {
    -webkit-appearance: none;
    background-color: rgba(24, 75, 95, 0.7);
    background-image: none;
    border-radius: 2px;
    border: 1px solid #38747f;
    box-sizing: border-box;
    color: #ffffff;
    text-align: center;
    display: inline-block;
    font-size: 13px;
    height: 40px;
    line-height: 40px;
    outline: 0;
    // padding: 0 15px;
    padding-right: 15px;
    padding-left: 0;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 5px;
  }
  /deep/.el-select .el-input .el-select__caret {
    color: rgba(0, 0, 0, 0);
    font-size: 22px;
    transition: transform 0.3s;
    transform: rotate(180deg);
    transform-origin: 72% 50%;
    cursor: pointer;
    background-image: url(../GisStorageTank/img/fx.png);
    background-repeat: no-repeat;
    background-position: 1px 5px;
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
  /deep/.el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 191px;
  }
  /deep/.el-radio{
    color: #e5f4ff;
  }
  // 表格样式
  /deep/ .el-table,
    .el-table__expanded-cell {
      background-color: rgba(0, 0, 0, 0);
    }
    /deep/ .el-table {
      border-bottom: 1px solid rgba(0, 0, 0, 0);
      border-right: 1px solid rgba(0, 0, 0, 0);
    }
    /deep/ th.is-leaf {
      border-bottom: 1px solid rgba(0, 0, 0, 0);
      border-right: 1px solid rgba(0, 0, 0, 0);
    }
    /deep/ .el-table th.is-leaf {
      border-bottom: 1px solid rgba(0, 0, 0, 0);
    }
    /deep/ .el-table th {
      background-color: rgba(0, 0, 0, 0);
    }
    /deep/ .el-table tr {
      background-color: rgba(0, 0, 0, 0);
    }
    /deep/ .el-table tbody tr:hover > td {
      background-color: rgba(13, 56, 80, 0.5) !important;
    }
    /deep/ .el-table {
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      flex: 1;
      width: 100%;
      max-width: 100%;
      font-size: 14px;
      color: #ffffff;
      font-size: 18px;
    }
    /deep/ .el-table thead {
      font-weight: 500;
      font-size: 14px;
      background-image: url('../GisStorageTank/img/titleHead.png');
      background-size: 100% 100%;
    }
    /deep/ .el-table .cell {
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
      word-break: break-all;
      line-height: 23px;
      padding-right: 9px;
      text-align: center;
    }
    /deep/.el-select .el-input .el-select__caret {
      color: rgba(0, 0, 0, 0);
      font-size: 22px;
      transition: transform 0.3s;
      transform: rotate(180deg);
      transform-origin: 70% 50%;
      cursor: pointer;
      background-image: url(../GisStorageTank/img/fx.png);
      background-repeat: no-repeat;
      background-position: 1px 5px;
    }
    /deep/ .el-table th,
    .el-table tr {
      background-color: rgba(0, 0, 0, 0);
    }
    /deep/ tbody {
      display: table-row-group;
      vertical-align: middle;
      border-color: inherit;
      background-image: url(../GisStorageTank/img/tbodyBg.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-color: rgba(20, 63, 87, 0.4);
    }
    /deep/ .el-table--border td {
      border-right: 1px solid rgba(0, 0, 0, 0);
    }
    /deep/ .el-table--border td:last-child {
      border-right: 1px solid rgba(0, 0, 0, 0);
    }
    /deep/ .el-table th,
    .el-table tr {
      background-color: rgba(0, 0, 0, 0);
    }
    /deep/ .el-table--border td,
    .el-table--border th,
    .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
      border-right: 1px solid rgba(0, 0, 0, 0);
    }
    /deep/ .el-table--border,
    .el-table--group {
      border: 1px solid rgba(0, 0, 0, 0);
      border-right-color: rgba(235, 238, 245, 0);
      border-right-style: solid;
      border-right-width: 1px;
      border-bottom-color: rgba(235, 238, 245, 0);
      border-bottom-style: solid;
      border-bottom-width: 1px;
    }
    /deep/.el-table td,
    .el-table th.is-leaf,
    .el-table--border,
    .el-table--group {
      border-color: #07a4d7;
    }
    /deep/.el-table--border::after,
    .el-table--group::after,
    .el-table::before {
      background-color: rgba(0, 0, 0, 0);
    }
    /deep/ .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
      content: '';
      position: absolute;
      background-color: rgba(0, 0, 0, 0);
      z-index: 1;
    }
    /deep/ .el-table td,
    .el-table th.is-leaf {
      border-bottom: 1px solid #07a4d7;
    }
    .playBox {
      position: fixed;
      left: 566px;
      top: 743px;
      width: 950px;
      height: 150px;
      z-index: 1000;
      color: #fff;
      background: url('@{imgPath}/legendbg.png') no-repeat;
      background-size: 100% 100%;
    }
    .playShaftBox {
      
      color: #fff;

      .legend_palyer {
        width: 40px;
        height: 20px;
        background: url('@{imgPath}/legend_player.png') no-repeat 0 0;
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
          background: url('@{imgPath}/legend_player.png') no-repeat 0 0;
          background-size: 100% 100%;
          cursor: pointer;
          margin-top: 29px;
          margin-left: 57px;
          overflow-x: auto;
          overflow-y: hidden;
        }
        .openBtn {
          display: inline-block;
          width: 65px;
          height: 57px;
          background: url('@{imgPath}/legend_stop.png') no-repeat;
          background-size: 100% 100%;
          cursor: pointer;
          margin-top: 29px;
          margin-left: 57px;
        }
        ul {
          display: flex;
          margin-left: 26px;
          margin-top: 25px;
          width: 80%;
          overflow-x: auto;
          padding-left: 20px;
          padding-right: 37px;
          overflow-y: hidden;
          padding-top: 14px;
          li {
            width: 48%;
            background: rgba(106, 209, 246, 0.4);
            height: 5px;
            position: relative;
            i {
              display: inline-block;
              width: 22px;
              height: 20px;
              background: url('@{imgPath}/dot02.png') no-repeat;
              background-size: 100% 100%;
              position: absolute;
              right: -1px;
              top: -7px;
              cursor: pointer;
            }
            span {
              position: absolute;
              top: 15px;
              right: -41px;
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
            background: url('@{imgPath}/dot01.png') no-repeat;
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
}
.legend_closeBtn {
  width: 55px;
  height: 32px;
  cursor: pointer;
  background: url('@{imgPath}/legendhide-.png') no-repeat 0 0;
  background-size: 100% 100%;
  position: absolute;
  right: 32px;
  top: 6px;
}
.legend_title {
  font-size:16px;
  color:#333;
  color: #67e1fb;
  width: 270px;
  height: 58px;
  line-height: 58px;
  font-size: 24px;
  text-align: center;
  background: url('@{imgPath}/legend_title.png') no-repeat 0 0;
  background-size: 100% 100%;
  position: absolute;
  top: -18px;
  left: 14px;
}
::-webkit-scrollbar {
  width:8px;
  height:8px;
}
/*滚动条里面小方块样式*/
::-webkit-scrollbar-thumb {
  border-radius:100px;
  -webkit-box-shadow:inset 0 0 5px rgba(0,0,0,0.2);
  background-image:linear-gradient(0deg, #0a7ccc 0%, #06b4d1 52%, #02ebd5 100%);
}
/*滚动条里面轨道样式*/
::-webkit-scrollbar-track {
-webkit-box-shadow:inset 0 0 5px rgba(0,0,0, 0);
  border-radius:0;
  background:rgba(0,0,0,0);
}
</style>
<style lang="less" >
  .matterInfo {
    .el-select {
      .el-input--suffix{
        width: 61% !important;
      }
    }
    
    .tableInputFelxBox_left {
      .el-input--suffix{
        width: 191px !important;
      }
    }
  }
</style>
