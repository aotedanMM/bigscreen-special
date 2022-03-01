<template>
  <div class="GisChemicalBlast" style="height: 100%;">
    <div class="GisChemicalBlast-title">压力容器爆炸灾损分析</div>
    <span class="halflist-back" @click="handleBackParent"></span>
    <div class="GisChemicalBlast-content" style="height: 87%;">
      <el-scrollbar style="height: 100%;">
      <el-form :rules="formRules" :model="formData" ref="blastForm">
        <el-form-item>
          <span class="GisInputPanelTitleTwoFelxBox_right_title" style="margin-right: 28px;">爆炸类型</span>
          <el-select v-model="formData.blastType" placeholder="请选择" @change="getSaveName" >
            <el-option
              v-for="item in blastType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col>
              <el-form-item prop="saveAddlon">
                <span class="GisInputPanelTitleTwoFelxBox_right_title">爆炸点位置</span>
                <el-input placeholder="" v-model="formData.saveAddlon">
                  <template slot="prepend">x</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item prop="saveAddlat">
                <div class="saveAddpst">
                  <el-input placeholder="" v-model="formData.saveAddlat">
                    <template slot="prepend">y</template>
                  </el-input>
                </div>
              </el-form-item>
            </el-col>
            <el-col >
                <div
                  class="GisTable_right_operation_right Pointer"
                  @click="getPosition('save')"
                ></div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="formData.blastType==='压力容器爆炸'">
          <span class="GisInputPanelTitleTwoFelxBox_right_title">储罐类型</span>
          <el-select v-model="formData.tankType" placeholder="请选择">
            <el-option 
              label="卧式储罐"
              value="卧式储罐"
            ></el-option>
            <el-option 
              label="立式储罐"
              value="立式储罐"
            ></el-option>
            <el-option 
              label="球罐"
              value="球罐"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.blastType==='压力容器爆炸'" prop="tankSize">
          <span class="GisInputPanelTitleTwoFelxBox_right_title">罐体质量</span>
          <el-input placeholder="" v-model="formData.tankSize">
            <template slot="append">kg</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="formData.blastType==='压力容器爆炸'" prop="tankVolume">
          <span class="GisInputPanelTitleTwoFelxBox_right_title">罐体容积</span>
          <el-input placeholder="" v-model="formData.tankVolume">
            <template slot="append">m3</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="formData.blastType==='压力容器爆炸'" prop="maxTank">
          <span class="GisInputPanelTitleTwoFelxBox_right_title">最大储罐工作压力</span>
          <el-input placeholder="" v-model="formData.maxTank">
            <template slot="append">MPa</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="formData.blastType==='压力容器爆炸'">
          <span class="GisInputPanelTitleTwoFelxBox_right_title">罐体方向</span>
          <el-select v-model="formData.tankDirection" placeholder="请选择">
            <el-option 
              v-for="(item, index) in directionType" :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.blastType==='压力容器爆炸'">
          <span class="GisInputPanelTitleTwoFelxBox_right_title">安装安全阀</span>
          <el-select v-model="formData.isHave" placeholder="请选择">
            <el-option  label="是" value="true" ></el-option>
            <el-option  label="否" value="false" > </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.blastType==='压力容器爆炸'">
          <span class="GisInputPanelTitleTwoFelxBox_right_title">风向</span>
          <el-select v-model="formData.windDirection" placeholder="请选择">
            <el-option 
              v-for="(item, index) in windDirectionType" :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.blastType==='压力容器爆炸'" prop="windSpeed">
          <span class="GisInputPanelTitleTwoFelxBox_right_title">风速</span>
          <el-input placeholder="" v-model="formData.windSpeed">
            <template slot="append">m/s</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="formData.blastType==='压力容器爆炸'" prop="modelTime">
          <span class="GisInputPanelTitleTwoFelxBox_right_title">碎片模拟次数</span>
          <el-input placeholder="" v-model="formData.modelTime">
            <template slot="append">万</template>
          </el-input>
        </el-form-item>
        <el-form-item  v-if="formData.blastType==='固体爆炸'">
          <span class="GisInputPanelTitleTwoFelxBox_right_title">存贮物质量</span>
          <el-input placeholder="" v-model="formData.savezl">
            <template slot="append">kg</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="formData.blastType==='固体爆炸'">
          <span class="GisInputPanelTitleTwoFelxBox_right_title" style="margin-right: 28px;">爆炸位置类型</span>
          <el-select v-model="formData.blastAddType" placeholder="请选择">
            <el-option 
              label="普通地面"
              value="0"
            ></el-option>
            <el-option 
              label="刚性地面"
              value="1"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.blastType==='蒸汽云爆炸'">
          <span class="GisInputPanelTitleTwoFelxBox_right_title">存贮物体积</span>
          <el-input placeholder="" v-model="formData.saveSize">
            <template slot="append">m^3</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <span class="GisInputPanelTitleTwoFelxBox_right_title">存贮物质名</span>
          <el-select v-model="formData.saveNames" placeholder="请选择">
            <el-option
              v-for="item in saveName"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span class="GisInputPanelTitleTwoFelxBox_right_title ptstitle">观察点集</span>
          <div class="addviewpts" @click="getPosition('view')"><i class="el-icon-map-location"></i>添加观察点</div>
          <div style="margin-top: 21px;">
              <ul>
                <li v-for="(item, index) in formData.addView" :key="index">
                  <span class="titleForPos">{{item.name}}</span>
                  <el-row>
                    <el-col :span="10">
                      <el-form-item :prop="'addView.' + index + '.xData'" :rules="formRulesForPst.xData">
                        <el-input placeholder="" v-model="item.xData">
                          <template slot="prepend">x</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item :prop="'addView.' + index + '.yData'" :rules="formRulesForPst.yData">
                      <el-input placeholder="" v-model="item.yData">
                        <template slot="prepend">y</template>
                      </el-input>
                      <div class="deletePos" @click="deletePos(item, index)">X</div>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </li>
              </ul>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="GisInputPanleButton_box">
            <div class="GisInputPanleButton" @click="FnEmpty()" style="margin-left: -26px;">
              <div class="GisInputPanleButton_icon">
                <img src="../GisStorageTank/img/clear.png" alt="" />
              </div>
              <div class="GisInputPanleButton_title">清空</div>
            </div>
            <div class="GisInputPanleButton" @click="FnSubmit()">
              <div class="GisInputPanleButton_icon">
                <img src="../GisStorageTank/img/sumbit.png" alt="" />
              </div>
              <div class="GisInputPanleButton_title" style="width: 102px;">开始分析</div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      </el-scrollbar>
    </div>
    <div v-if="false" class="datatabs">
      <div class="datatabs-title">
        <div class="datatitlespan"  @click="isshowlegendselectFunc">
          <span>{{currentLegend}}</span>
          <i></i>
        </div>
      </div>
      <div class="selectTabs" v-show="isshowlegendselect" :style="{height: isShowChip ? '97px' : '66px'}">
        <span @click="changeLegend('人员损伤')" :class="currentLegend === '人员损伤' ? 'active' : ''">人员损伤</span>
        <span @click="changeLegend('建筑损坏')" :class="currentLegend === '建筑损坏' ? 'active' : ''">建筑损坏</span>
        <span v-if="isShowChip"  @click="changeLegend('碎片')" :class="currentLegend === '碎片' ? 'active' : ''">碎片</span>
      </div>
      <div class="legendListData">
        <ul>
          <li><i class="el-icon-location"></i><span>爆炸点</span></li>
          <li v-for="(item, index) in currendLegendData" :key="index" :title="item"><i :class= "currentLegend==='人员损伤' || currentLegend==='碎片' ? 'colorChange' : ''"></i><span>{{item}}</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { gisChemicalBlastServer } from '@/api/installServer';
@Component({
  name: 'GisChemicalBlast',
})
export default class GisChemicalBlast extends Vue {
  private isShowDataTabs: boolean = false; // 图例显隐
  private isshowlegendselect: boolean = false; // 图例类型切换显隐
  private currentLegend: string = '人员损伤'; // 当前图例类型选择
  private currendLegendData: any = [];  // 图例数据 当前选中
  private currendLegendDataForPeople: any = [];  // 图例数据 人员损伤
  private currendLegendDataForBuild: any = [];  // 图例数据 建筑损坏
  private currendLegendDataForchip: any = [];  // 图例数据 碎片
  private dataAll: any = {}; // 请求到的数据
  private formData: any = {
    blastType: '固体爆炸',
    blastAddType: '0',
    tankType: '卧式储罐',
    tankSize: 300000,
    saveSize: 10,
    tankVolume: 100.5,
    maxTank: 1.6,
    tankDirection: 0,
    isHave: 'true',
    windDirection: -1,
    windSpeed: 1.5,
    modelTime: 20,
    savezl: 10,
    saveNames: '',
    saveAddlon: '',
    saveAddlat: '',
    saveAddlatz: 0,
    addView: [],
  };
  private mapType: any = {
    current: '',
    save: 0,
    view: 0,
  };
  private blastType: any = [
    {
      value: '固体爆炸',
      label: '固体爆炸',
    },
    {
      value: '压力容器爆炸',
      label: '压力容器爆炸',
    },
    {
      value: '蒸汽云爆炸',
      label: '蒸汽云爆炸',
    },
  ];
  private directionType: any = [
    {value: 0, label: '东'},
    {value: 45, label: '东北'},
    {value: 90, label: '北'},
    {value: 135, label: '西北'},
    {value: 0, label: '西'},
    {value: 45, label: '西南'},
    {value: 90, label: '南'},
    {value: 135, label: '东南'},
  ];
  private windDirectionType: any = [
    {value: -1, label: '无风'},
    {value: 0, label: '西风'},
    {value: 1, label: '西南风'},
    {value: 2, label: '南风'},
    {value: 3, label: '东南风'},
    {value: 4, label: '东风'},
    {value: 5, label: '东北风'},
    {value: 6, label: '北风'},
    {value: 7, label: '西北风'},
  ];
  private currentSaveType: any = '';
  private saveName: any = [];

  private formRules: any = {
    saveAddlon: [{required: true, message: '不能为空'},
                 { type: 'number', validator: this.valifunc, trigger: 'blur'},
    ],
    saveAddlat: [{required: true, message: '不能为空'},
                 { type: 'number', validator: this.valifunc, trigger: 'blur'},
    ],
    saveAddlatz: [{required: true, message: '不能为空'},
                 { type: 'number', validator: this.valifunc, trigger: 'blur'},
    ],
    tankSize: [{required: true, message: '不能为空'},
                 { type: 'number', validator: this.valifunc, trigger: 'blur'},
    ],
    saveSize: [{required: true, message: '不能为空'},
                 { type: 'number', validator: this.valifunc, trigger: 'blur'},
    ],
    tankVolume: [{required: true, message: '不能为空'},
                 { type: 'number', validator: this.valifunc, trigger: 'blur'},
    ],
    maxTank: [{required: true, message: '不能为空'},
                 { type: 'number', validator: this.valifunc, trigger: 'blur'},
    ],
    windSpeed: [{required: true, message: '不能为空'},
                 { type: 'number', validator: this.valifunc, trigger: 'blur'},
    ],
    modelTime: [{required: true, message: '不能为空'},
                 { type: 'number', validator: this.valifunc, trigger: 'blur'},
    ],
  };
  private formRulesForPst: any = {
    xData: [{required: true, message: '不能为空'},
                 { type: 'number', validator: this.valifunc, trigger: 'blur'},
    ],
    yData: [{required: true, message: '不能为空'},
                 { type: 'number', validator: this.valifunc, trigger: 'blur'},
    ],
  };
  private isShowChip: boolean = false; // 是否显示碎片
  // form验证
  private valifunc(rule: any, value: any, callback: any) {
    if (rule.type === 'number' && !Number(value) && Number(value) !== 0) {
      return callback(new Error('必须为数字'));
    }
    callback();
  }
  // 图例切换显隐
  private isshowlegendselectFunc() {
    this.isshowlegendselect = !this.isshowlegendselect;
  }
  // 切换图例类型
  private changeLegend(str: string) {
    this.currentLegend = str;
    this.isshowlegendselect = false;
    this.currendLegendData = [];
    this.getComponent().clear();
    if (this.currentLegend === '人员损伤') {
      this.currendLegendData = this.currendLegendDataForPeople;
      this.getComponent().showExplordResult(this.dataAll, 'Harm');
    }
    if (this.currentLegend === '建筑损坏') {
      this.currendLegendData = this.currendLegendDataForBuild;
      this.getComponent().showExplordResult(this.dataAll, 'Damage');
    }
    if (this.currentLegend === '碎片') {
      this.currendLegendData = this.currendLegendDataForchip;
      this.getComponent().showExplordResult(this.dataAll, 'Debris');
    }
  }
  // 删除点位
  private deletePos(item: any, val: any) {
    this.removePoint(item.id);
    this.formData.addView.splice(val, 1);
  }
  // 移除指定点位
  private removePoint(id: any) {
    this.getComponent().removeIgnitionPointLayer(id);
  }
  // 获取点位
  private getPosition(parms: any) {
    if (parms === 'save') {
      this.mapType.current = 'save';
      this.getComponent().setIgnitionPoint('爆炸点', 'blast1', 32);
    }
    if (parms === 'view') {
      this.mapType.current = 'view';
      this.mapType.view++;
      this.getComponent().setIgnitionPoint('观察点' + this.mapType.view, 'map' + this.mapType.view, 32);
    }

  }
  // 获取存储物质名
  private async getSaveName(parms: string) {
    this.saveName = [];
    await gisChemicalBlastServer.getSaveName(parms).then((res: any) => {
      res.data.data.forEach((item: any, indexs: any) => {
        if (indexs === 0) {
          this.currentSaveType = item.name;
          this.formData.saveNames = item.name;
        }
        this.saveName.push({
          label: item.name,
          value: item.code,
        });
      });
   });
  }
  // 初始化地图
  private getComponent() {
    const gisModules = this.$ioc.resolve('GISFactory-map');
    const component = gisModules.commonFactory.getComponent('chemicalleak');
    return component;
  }
  @Watch('$store.state.earthQuake.currentSelectLegend')
  private currentSelectLegend(val: any) {
    this.getComponent().clear();
    if (val === '人员损伤') {
      this.getComponent().showExplordResult(this.dataAll, 'Harm');
    }
    if (val === '建筑损坏') {
      this.getComponent().showExplordResult(this.dataAll, 'Damage');
    }
    if (val === '碎片') {
      this.getComponent().showExplordResult(this.dataAll, 'Debris');
    }
  }
  // 开始分析
  private FnSubmit() {
    const dom: any = this.$refs.blastForm;
    dom.validate((valid: any) => {
      if (valid) {
        const tempAddView: any  = [];
        this.formData.addView.forEach((item: any, index: any) => {
          tempAddView.push([4326, item.xData, item.yData, item.zData]);
        });
        const tempSaveAdd: any = [4326, this.formData.saveAddlon, this.formData.saveAddlat, this.formData.saveAddlatz];
        this.dataAll = {};
        if (this.formData.blastType === '固体爆炸') {
          this.isShowChip = false;
          const parms: any = {110024: 50,
                              110028: true,
                              110051: tempAddView, // tempAddView,
                              110501: this.formData.blastType, // ,'固体爆炸',
                              110502: true,
                              110504: true,
                              110505: true,
                              110520: this.formData.saveNames, // this.formData.saveNames,
                              110521: this.formData.savezl, // this.formData.savezl,
                              110530: tempSaveAdd, // tempSaveAdd,
                              110531: 0, // this.formData.blastAddType,
                              110540: [1, 1.1, 1.2, 1.3]};
          gisChemicalBlastServer.getDataForChemicalBlast(parms).then((res: any) => {
            this.isShowDataTabs = true;
            this.dataAll = res;
            this.setDataForLegend('人员损伤',  res.data.data.Model_Infos.GModel_Explode_Chemical.Result_Info.Indexes.Vector_Enum_Alias);
          });
        }
        if (this.formData.blastType === '压力容器爆炸') {
          this.isShowChip = true;
          const parmsyl: any = {
            103001: this.formData.windDirection, // 4,
            103004: this.formData.windSpeed, // 1.5,
            110024: 1,
            110028: true,
            110051: tempAddView,
            110501: this.formData.blastType, // "压力容器爆炸",
            110502: true,
            110503: true,
            110504: 'true',
            110505: 'true',
            110506: Number(this.formData.modelTime) * 10000, // 200000,
            110510: this.formData.tankType, // "卧式储罐",
            110511: this.formData.tankSize, // 300000,
            110512: this.formData.tankVolume, // 100.5,
            110513: this.formData.maxTank, // 1.6,
            110514: this.formData.tankDirection, // 0,
            110515: this.formData.isHave, // false
            110516: 0.1,
            110520: this.formData.saveNames, // "柴油",
            110521: '',
            110522: 180,
            110523: '',
            110530: tempSaveAdd,
            110540: [1, 1.1, 1.2, 1.3],
          };
          gisChemicalBlastServer.getDataForChemicalBlast(parmsyl).then((res: any) => {
            this.isShowDataTabs = true;
            this.dataAll = res;
            this.setDataForLegend('人员损伤', res.data.data.Model_Infos.GModel_Explode_Chemical.Result_Info.Indexes.Vector_Enum_Alias);
          });
        }
        if (this.formData.blastType === '蒸汽云爆炸') {
          this.isShowChip = false;
          const parmszq: any = {
            110028: true,
            110051: tempAddView,
            110501: this.formData.blastType, // "蒸汽云爆炸",
            110502: true,
            110504: 'true',
            110505: 'true',
            110520: this.formData.saveNames, // "氨气",
            110522: this.formData.saveSize, // "10",
            110530: tempSaveAdd,
            110540: [1, 1.1, 1.2, 1.3],
          };
          gisChemicalBlastServer.getDataForChemicalBlast(parmszq).then((res: any) => {
            this.isShowDataTabs = true;
            this.dataAll = res;
            this.setDataForLegend('人员损伤', res.data.data.Model_Infos.GModel_Explode_Chemical.Result_Info.Indexes.Vector_Enum_Alias);
          });
        }
      }
    });
  }
  private setDataForLegend(str: string, data: any) {
    this.currendLegendDataForPeople = [];
    this.currendLegendDataForBuild = [];
    this.currendLegendDataForchip = [];
    if (data && data.length > 0) {
      data.forEach((item: any, index: any) => {
        if (item.indexOf('观察点') < 0) {
          if (index > 0 && index < 5) {
            this.currendLegendDataForPeople.push(item.substring(9));
          }
          if (index > 5 && index < 11) {
            this.currendLegendDataForBuild.push(item.substring(9));
          }
          if (index > 10 && index < 15) {
            this.currendLegendDataForchip.push(item.substring(9));
          }
        }
      });
    }
    const legendTempData: any = [];
    if (this.currendLegendDataForPeople.length > 0) {
      legendTempData.push({
        label: '人员损伤',
        legendData: this.currendLegendDataForPeople,
        component: 'EarthQuakeModel',
        color: ['red', '#0000ff', '#ffff00', '#ffa500', '#ff0000'],
        hasClass: [
          {name: '爆炸点', className: 'locations'},
        ],
      });
    }
    if (this.currendLegendDataForBuild.length > 0) {
      const tempColor = this.formData.blastType === '压力容器爆炸' ? ['red', '#0000ff', '#ffff00', '#ffd700', '#ffa500', '#ff0000'] : ['red', '#0000ff', '#ffff00', '#ffd700', '#ff0000'];
      legendTempData.push({
        label: '建筑损坏',
        legendData: this.currendLegendDataForBuild,
        component: 'EarthQuakeModel',
        color: tempColor,
        hasClass: [
          {name: '爆炸点', className: 'el-icon-location'},
        ],
      });
    }
    if (this.currendLegendDataForchip.length > 0 && this.formData.blastType === '压力容器爆炸') {
      legendTempData.push({
        label: '碎片',
        legendData: this.currendLegendDataForchip,
        component: 'EarthQuakeModel',
        color: ['red', '#0000ff', '#ffff00', '#ffa500'],
        hasClass: [
          {name: '爆炸点', className: 'locations'},
        ],
      });
    }
    this.$store.commit('earthQuake/setIsShowChemicalBlastLegend', true);
    this.$store.commit('earthQuake/setChemicalBlastLegend', {data: legendTempData});
    this.changeLegend(str);
  }
  // 清空
  private FnEmpty() {
    this.removePoint('blast1');
    this.formData.addView.forEach((item: any, index: any) => {
      this.removePoint(item.id);
    });
    this.$store.commit('earthQuake/setIsShowChemicalBlastLegend', false);
    this.$store.commit('earthQuake/setChemicalBlastLegend', {data: [], color: []});
    this.getComponent().clear();
    this.isShowDataTabs = false;
    this.mapType = {
      current: '',
      save: 0,
      view: 0,
    };
    this.formData = {
      blastType: '固体爆炸',
      blastAddType: '0',
      tankType: '卧式储罐',
      tankSize: 300000,
      saveSize: 10,
      tankVolume: 100.5,
      maxTank: 1.6,
      saveNames: this.currentSaveType,
      tankDirection: 0,
      isHave: 'true',
      windDirection: -1,
      windSpeed: 1.5,
      modelTime: 20,
      savezl: 10,
      saveAddlon: '',
      saveAddlat: '',
      saveAddlatz: 0,
      addView: [],
    };
  }
  // 返回一级页面
  private handleBackParent() {
    this.$emit('tobackParent');
  }
  private created() {
    this.getComponent().on('chemicalLeak', (data: any) => {
      if (this.mapType.current === 'save') {
        this.formData.saveAddlon = data.x.toFixed(5);
        this.formData.saveAddlat = data.y.toFixed(5);
        this.formData.saveAddlatz = data.z;
      }
      if (this.mapType.current === 'view') {
        this.formData.addView.push({
          id: 'map' + this.mapType.view,
          name: '观察点' + this.mapType.view,
          xData: '',
          yData: '',
          zData: '',
        });
        this.formData.addView.forEach((item: any, index: any) => {
          if (item.id === 'map' + this.mapType.view) {
            this.formData.addView[index].xData = data.x.toFixed(5);
            this.formData.addView[index].yData = data.y.toFixed(5);
            this.formData.addView[index].zData = 0;
          }
        });
      }
    }, this);
    this.getSaveName('固体爆炸');
  }
  private beforeDestroy() {
    this.removePoint('blast1');
    this.$store.commit('earthQuake/setIsShowChemicalBlastLegend', false);
    this.$store.commit('earthQuake/setChemicalBlastLegend', {data: [], color: []});
    this.isshowlegendselect = false;
    this.isShowDataTabs = false;
    this.getComponent().clear();
    this.formData.addView.forEach((item: any, index: any) => {
      this.removePoint(item.id);
    });
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
.GisChemicalBlast {
  position: relative;
  .GisChemicalBlast-content {
    margin-top: 55px;
    margin-left: 43px;
  }
  .GisChemicalBlast-title {
    display: block;
    width: 61%;
    font-size: calc(16px * 1.5);
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
  .halflist-back {
    width: 61px;
    height: 19px;
    position: absolute;
    top: 10px;
    left: 329px;
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
  .GisInputPanelTitleTwoFelxBox_right_title {
    font-size: 19px;
    color: #e5f4ff;
    margin-right: 10px;
    margin-left: 3%;
    line-height: 41px;
  }
  .GisTable_right_operation_right {
    width: 15px;
    height: 20px;
    background-image: url(../GisStorageTank/img/mapPosistion.png);
    background-size: 100% 100%;
    position: absolute;
    left: 266px;
    top: 92px;
    cursor: pointer;
  }
  .ptstitle {
    display: block;
    width: 80px;
    float: left;
  }
  .addviewpts {
    color: white;
    font-size: 13px;
    width: 137px;
    margin-left: 111px;
    background-color: rgba(24, 75, 95, 0.7);
    border: 1px solid #38747f;
    border-radius: 7px;
    cursor: pointer;
    i {
      margin-right: 13px;
      margin-left: 7px;
      font-size: 17px;
    }
  }
  .titleForPos {
    color: white;
    font-size: 15px;
    width: 100%;
    display: block;
  }
  .deletePos{
    width: 20px;
    height: 20px;
    position: relative;
    left: 146px;
    top: -29px;
    text-align: center;
    color: white;
    cursor: pointer;
    border: 1px solid #38747f;
    border-radius: 50%;
    line-height: 20px;
    background-color: rgba(24, 75, 95, 0.7);
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
  .Pointer {
    top: 52px;
  }
  .datatabs {
    position: fixed;
    top: 227px;
    left: 1560px;
    width: 234px;
    height: 263px;
    cursor: pointer;
    // background: #0f4461;
    background: url('@{imgPath}/legendRightBg.png') no-repeat;
    background-size: 100% 100%;
    .datatabs-title {
      color: #fff;
      text-align: center;
      font-size: 16px;
      line-height: 37px;
      height: 57px;
      width: 180px;
      background: url('@{imgPath}/layerTextBg.png') no-repeat;
      background-size: 100% 100%;
    }
    .datatabs-data {
      flex: 1;
      color: #fff;
      text-align: center;
      font-size: 19px;
      line-height: 32px;
      ul {
        display: flex;
        li {
          flex: 1;
          border-width: 1px 1px 1px 1px;
          flex-direction: column;
          border-style: solid;
          border-color: #069fcf;
          &:last-child{
            border-radius: 0 5px 5px 0;
          }
          &:hover{
            color: rgb(250, 222, 67);
          }
        }
      }
    }
    .selectTabs {
      position: absolute;
      width: 97px;
      display: flex;
      flex-direction: column;
      background: url('../../../../assets/img/halfScreen/eventAndTopics/select_bg.png') no-repeat 0 0;
      background-size: 100% 100%;
      background-color: rgba(3, 33, 69, 0.9) !important;
      border: 1px solid rgba(0,0,0,0.8);
      margin-left: 30px;
      margin-top: -13px;
      color: #fff;
      line-height: 31px;
      padding-left: 23px;
      padding-top: 4px;
      span {
        &:hover {
          color: #f0bc54;
        }
      }
      .active {
        color: #f0bc54;
      }
    }
    .legendListData {
      color: white;
      line-height: 31px;
      padding-left: 29px;
      width: 175px;
      font-size: 16px;
      span {
        display: block;
        word-break: keep-all;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      li {
        &:nth-child(1) {
          i {
            color: red;
            float: left;
            line-height: 31px;
            margin-right: 10px;
          }
        }
        &:nth-child(2) {
          i {
            width: 10px;
            height: 10px;
            display: block;
            background-color: rgb(0, 0, 255);
            border-radius: 50%;
            float: left;
            margin-right: 10px;
            margin-top: 12px;
          }
        }
        &:nth-child(3) {
          i {
            width: 10px;
            height: 10px;
            display: block;
            background-color: rgb(255, 255, 0);
            border-radius: 50%;
            float: left;
            margin-right: 10px;
            margin-top: 12px;
          }
        }
        &:nth-child(4) {
          i {
            width: 10px;
            height: 10px;
            display: block;
            background-color: rgb(255, 215, 0);
            border-radius: 50%;
            float: left;
            margin-right: 10px;
            margin-top: 12px;
          }
          .colorChange {
            background-color: rgb(255, 165, 0);
          }
        }
        &:nth-child(5) {
          i {
            width: 10px;
            height: 10px;
            display: block;
            background-color: rgb(255, 165, 0);
            border-radius: 50%;
            float: left;
            margin-right: 10px;
            margin-top: 12px;
          }
          .colorChange {
            background-color: rgb(255, 0, 0);
          }
        }
        &:last-child {
          i {
            width: 10px;
            height: 10px;
            display: block;
            background-color: rgb(255, 0, 0);
            border-radius: 50%;
            float: left;
            margin-right: 10px;
            margin-top: 12px;
          }
        }
      }
    }
  }
  .datatitlespan {
    width: 135px;
    line-height: 48px;
    i {
      display: block;
      cursor: pointer;
      background-image: url(../GisStorageTank/img/fx.png);
      background-repeat: no-repeat;
      width: 32px;
      height: 26px;
      position: absolute;
      left: 94px;
      top: 10px;
      transform: rotate(180deg);
    }
  }
  /deep/ .el-input {
      width: 133px;
    }
  /deep/ .el-input-group__prepend{
    color: white;
    background-color: transparent;
    border: 1px solid #38747f;
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
}
.saveAddpst {
  margin-left: 116px;
}
</style>
