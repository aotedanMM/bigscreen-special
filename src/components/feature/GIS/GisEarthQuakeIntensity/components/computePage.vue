<template>
  <div class="ComputePage">
    <el-scrollbar style="height: 641px;">
      <el-form :rules="formRules" :model="formData" ref="blastForm">
        <el-form-item>
          <el-row>
            <el-col>
              <el-form-item prop="lon">
                <span class="GisInputPanelTitleTwoFelxBox_right_title"  style="padding-left: 36px;">震中位置</span>
                <el-input placeholder="" v-model="formData.lon">
                  <template slot="prepend">x</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item prop="lat">
                <div class="saveAddpst">
                  <el-input placeholder="" v-model="formData.lat">
                    <template slot="prepend">y</template>
                  </el-input>
                </div>
              </el-form-item>
            </el-col>
            <el-col >
                <div
                  class="GisTable_right_operation_right Pointer"
                  @click="getPosition()"
                ></div>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- <el-form-item>
          <span class="GisInputPanelTitleTwoFelxBox_right_title" style="padding-left: 36px;">震中区县</span>
          <el-cascader
            v-model="formData.areaInfo"
            :options="areaList"></el-cascader>
        </el-form-item> -->
        <el-form-item prop="startTime">
          <span class="GisInputPanelTitleTwoFelxBox_right_title" style="padding-left: 36px;">起始时间</span>
          <el-date-picker
                type="datetime"
                placeholder="选择日期"
                v-model="formData.startTime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-M-d HH:mm:ss"
                style="width: 56%"
              ></el-date-picker>
        </el-form-item>
        <el-form-item prop="lastTime">
          <span class="GisInputPanelTitleTwoFelxBox_right_title" style="padding-left: 36px;">持续时间</span>
          <el-input placeholder="" v-model="formData.lastTime">
            <template slot="append">秒</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="earthLeveal">
          <span class="GisInputPanelTitleTwoFelxBox_right_title" style="padding-left: 74px;">震级</span>
          <el-input placeholder="" v-model="formData.earthLeveal">
            <template slot="append">级</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="angle">
          <span class="GisInputPanelTitleTwoFelxBox_right_title">断层走向角度</span>
          <el-input placeholder="" v-model="formData.angle">
            <template slot="append">°</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <div class="GisInputPanleButton_box">
            <div class="GisInputPanleButton" @click="FnEmpty()" style="margin-left: -26px;">
              <div class="GisInputPanleButton_icon">
                <img src="../../GisStorageTank/img/clear.png" alt="" />
              </div>
              <div class="GisInputPanleButton_title">清空</div>
            </div>
            <div class="GisInputPanleButton" @click="FnSubmit()">
              <div class="GisInputPanleButton_icon">
                <img src="../../GisStorageTank/img/sumbit.png" alt="" />
              </div>
              <div class="GisInputPanleButton_title" style="width: 102px;">开始分析</div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div class="datatabs" v-show="isShowDataTabs">
      <div class="legendListData">
        <ul>
          <li><i class="el-icon-location"></i><span>震中位置</span></li>
          <li v-for="(item, index) in resultInfo" :key="index" :title="item">
            <i></i><span>{{item}}</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { gisEarthQuakeIntensity } from '@/api/installServer';
@Component({
  name: 'ComputePage',
})
export default class ComputePage extends Vue {
  // private areaList: any = []; // 区域数组
  private formData: any = {
    lon: '121.09268', // 经度
    lat: '42.70253',  // 纬度
    areaInfo: ['山东省', '烟台市', '福山区'], // 区域
    startTime: '2018-06-01 00:00:00',  // 起始时间
    lastTime: 4,  // 持续时间
    earthLeveal: 8.1, // 震级
    angle: 0.0015,  // 角度
  };
  private resultInfo: any = []; // 结果集合
  private isShowDataTabs: boolean = false; // 图例显隐
  private isChinese: boolean = true;
  private formRules: any = {
    lon: [{required: true, message: '不能为空'},
                 { type: 'number', validator: this.valifunc, trigger: 'blur'},
    ],
    lat: [{required: true, message: '不能为空'},
                 { type: 'number', validator: this.valifunc, trigger: 'blur'},
    ],
    startTime: [{required: true, message: '不能为空'},
    ],
    lastTime: [{required: true, message: '不能为空'},
                 { type: 'number', validator: this.valifunc, trigger: 'blur'},
    ],
    earthLeveal: [{required: true, message: '不能为空'},
                 { type: 'number', validator: this.valifunc, trigger: 'blur'},
    ],
    angle: [{required: true, message: '不能为空'},
                 { type: 'number', validator: this.valifunc, trigger: 'blur'},
    ],
  };
  // form验证
  private valifunc(rule: any, value: any, callback: any) {
    if (rule.type === 'number' && !Number(value) && Number(value) !== 0) {
      return callback(new Error('必须为数字'));
    }
    if (rule.field === 'lastTime') {
      if (value < 0 || value > 300) {
        return callback(new Error('持续时间范围必须在0-300之间'));
      }
    }
    if (rule.field === 'earthLeveal') {
      if (value < 5 || value > 8.2) {
        return callback(new Error('震级范围必须在5-8.2之间'));
      }
    }
    if (rule.field === 'angle') {
      if (value < 0 || value > 180) {
        return callback(new Error('断层走向角度范围必须在0-180之间'));
      }
    }
    callback();
  }
  // 移除指定点位
  private removePoint(id: any) {
    this.getComponent().removeIgnitionPointLayer(id);
  }
  // 获取点位
  private getPosition() {
    this.getComponent().setIgnitionPoint('震中位置', 'map', 32);

  }
  // 获取区域名称 暂时不用
  // private async getAreaName() {
  //   await gisEarthQuakeIntensity.getAreaData().then((res: any) => {
  //     this.areaList = [];
  //     res.data.area.forEach((item: any) => {
  //       if (item.id.indexOf('0000') >= 0) {
  //         this.areaList.push({
  //           id: item.id,
  //           value: item.tag.districtname,
  //           label: item.tag.districtname,
  //           children: [],
  //         });
  //       }
  //     });

  //     res.data.area.forEach((item: any) => {
  //       if (item.id.indexOf('0000') < 0 && item.id.substring(item.id.length - 2, item.id.length) === '00') {
  //         this.areaList.forEach((jtem: any, jndex: any) => {
  //           if (item.id.substring(0, 2) === jtem.id.substring(0, 2)) {
  //             this.areaList[jndex].children.push({
  //               id: item.id,
  //               value: item.tag.districtname,
  //               label: item.tag.districtname,
  //               children: [],
  //             });
  //           }
  //         });
  //       }
  //     });
  //     res.data.area.forEach((item: any) => {
  //       if (item.id.substring(item.id.length - 2, item.id) !== '00') {
  //         this.areaList.forEach((jtem: any, jndex: any) => {
  //           jtem.children.forEach((sstem: any, ssdex: any) => {
  //             if (item.id.substring(0, 4) + '00' === sstem.id) {
  //               this.areaList[jndex].children[ssdex].children.push({
  //                 id: item.id,
  //                 value: item.tag.districtname,
  //                 label: item.tag.districtname,
  //               });
  //             }
  //           });
  //         });
  //       }
  //     });
  //   });
  // }

  // 初始化地图
  private getComponent() {
    const gisModules = this.$ioc.resolve('GISFactory-map');
    const component = gisModules.commonFactory.getComponent('earthQuakeIntensity');
    return component;
  }

  // 开始分析
  private FnSubmit() {
    if (!this.isChinese) {
      this.$message.warning('请选择国内区域');
      return false;
    }
    const dom: any = this.$refs.blastForm;
    dom.validate((valid: any) => {
      if (valid) {
        // const parms: any = {
        //   105201: [4326, this.formData.lon, this.formData.lat, 0],
        //   105202: this.formData.areaInfo.join('.'),
        //   105203: this.formData.startTime,
        //   105204: this.formData.lastTime,
        //   105213: this.formData.angle,
        //   111010: this.formData.earthLeveal,
        //   111001: true,
        //   111021: true,
        //   111022: true,
        // };
        const parms: any =  {
          105201: [4326, 120.54470992190717, 37.58398863579302, 0],
          105202: '山东省',
          105203: '2020-10-26 10:05:49.000.000',
          111001: true,
          111010: 6,
          111021: true,
          111022: true,
          };
        this.resultInfo = [];
        gisEarthQuakeIntensity.getDataForIntensity(parms).then((res: any) => {
          if (res && res !== null && res.data && res.data !== null && res.data.data && res.data.data !== null && res.data.data.Model_Infos && res.data.data.Model_Infos !== null && res.data.data.Model_Infos.GModel_EQ_Intensity && res.data.data.Model_Infos.GModel_EQ_Intensity !== null && res.data.data.Model_Infos.GModel_EQ_Intensity.Result_Info && res.data.data.Model_Infos.GModel_EQ_Intensity.Result_Info !== null ) {
            this.resultInfo = res.data.data.Model_Infos.GModel_EQ_Intensity.Result_Info.Indexes.Vector_Enum_Alias;
            this.messsageBus.emit('computeResult', res.data.data);
            this.isShowDataTabs = true;
            console.log('===>', res);
            this.getComponent().draw(res.data.data);
          }
        });
      }
    });
  }
  // 清空
  private FnEmpty() {
    this.removePoint('blast1');
    this.getComponent().clear();
    this.isShowDataTabs = false;
    this.formData = {
      lon: '121.09268', // 经度
      lat: '42.70253',  // 纬度
      areaInfo: ['山东省', '烟台市', '福山区'], // 区域
      startTime: '2018-06-01 00:00:00',  // 起始时间
      lastTime: 4,  // 持续时间
      earthLeveal: 8.1, // 震级
      angle: 0.0015,  // 角度
    };
  }
  private created() {
    this.getComponent().on('earthquakeIntensity', (data: any) => {
      this.formData.lon = data.x.toFixed(5);
      this.formData.lat = data.y.toFixed(5);
    });
    this.getComponent().on('getdistrict', (data: any) => {
      if (data.address_component.country === '中国') {
        this.isChinese = true;
        this.formData.areaInfo = [];
        if (data.address_component.province) {
          this.formData.areaInfo.push(data.address_component.province);
        }
        if (data.address_component.district) {
          this.formData.areaInfo.push(data.address_component.district);
        }
        if (data.address_component.street) {
          this.formData.areaInfo.push(data.address_component.street);
        }
      } else {
        this.isChinese = false;
        this.$message.warning('请选择国内区域');
      }

    });
  }
}
</script>
<style scoped lang="less">
@imgPath: '../../../../../assets/img/gisModule/legendPlanel';
.ComputePage {
  position: relative;
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
    background-image: url(../../GisStorageTank/img/mapPosistion.png);
    background-size: 100% 100%;
    position: absolute;
    left: 276px;
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
    font-size: 18px;
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
    background: url(../../GisStorageTank/img/clearAndSumbit.png);
    background-size: 100% 100%;
    margin: 0 20px;
  }
  .GisInputPanleButton:hover {
    width: 103px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url(../../GisStorageTank/img/clearAndSumbit_hover.png);
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
    height: 310px;
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
      background: url('../../../../../assets/img/halfScreen/eventAndTopics/select_bg.png') no-repeat 0 0;
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
      padding-top: 33px;
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
        &:nth-child(6) {
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
        &:nth-child(7) {
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
      background-image: url(../../GisStorageTank/img/fx.png);
      background-repeat: no-repeat;
      width: 32px;
      height: 26px;
      position: absolute;
      left: 94px;
      top: 10px;
      transform: rotate(180deg);
    }
  }
  /deep/ .el-cascader {
    .el-input {
      width: 209px;
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
    background-image: url(../../GisStorageTank/img/fx.png);
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
  margin-left: 132px;
}
</style>
