/** author: chenyu time:2020-04-07 **/
<template>
  <div>
    <div class="GisInputPanel" v-if="Num > 0 && Num <= 2">
      <div class="loadingBox">
        <div class="loading"></div>
      </div>
    </div>
    <div class="GisInputPanel" v-else>
      <el-scrollbar style="height: 100%;">
        <div class="GisInputPanelTitle">模型输入参数</div>
        <div class="GisInputPanelSubTitleOne">着火储罐信息</div>
        <div class="GisTableFelxBox">
          <div class="GisTable_left">
            <el-table
              :data="StorageTank"
              style="width: 100%"
              :row-style="getRowClass"
              :header-row-style="getRowClass"
              :header-cell-style="getRowClass"
              :highlight-current-row="false"
              border
            >
              <el-table-column prop="storageTankNUM" label=" " width="90">
                <template slot-scope="scope">
                  储罐{{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column prop="type" label="储罐类型" width="150">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.type" placeholder="请选择">
                    <el-option
                      v-for="item in StorageTankTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="radius" label="储罐半径" width="/">
                <template slot-scope="scope">
                  <div class="tableInputFelxBox">
                    <div class="tableInputFelxBox_left">
                      <input type="text" v-model="scope.row.radius" />
                    </div>
                    <div class="tableInputFelxBox_right">
                      m
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="储罐高度" width="/">
                <template slot-scope="scope">
                  <div class="tableInputFelxBox">
                    <div class="tableInputFelxBox_left">
                      <input type="text" v-model="scope.row.height" />
                    </div>
                    <div class="tableInputFelxBox_right">
                      m
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="储罐液位" width="/">
                <template slot-scope="scope">
                  <div class="tableInputFelxBox">
                    <div class="tableInputFelxBox_left">
                      <input type="text" v-model="scope.row.liquidLevel" />
                    </div>
                    <div class="tableInputFelxBox_right">
                      m
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="存储物质" width="120">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.matter" placeholder="请选择">
                    <el-option
                      v-for="item in MatterOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="GisTable_right">
            <div
              class="GisTable_right_button Pointer"
              @click="FnTankFireInfoAdd()"
            >
              新增
            </div>
            <div
              class="GisTable_right_operation"
              v-for="(item, index) in StorageTank"
              :key="item + index"
            >
              <div
                class="GisTable_right_operation_right Pointer"
                @click="FnTankFireInfoPosition(index)"
              ></div>
              <div
                class="GisTable_right_operation_left Pointer"
                @click="FnTankFireInfoDelect(index)"
              ></div>
            </div>
          </div>
        </div>
        <div class="GisInputPanelSubTitleTwo">气象信息</div>
        <div class="GisInputPanelTitleTwoFelxBox">
          <div class="GisInputPanelTitleTwoFelxBox_left">
            <div class="GisInputPanelTitleTwoFelxBox_left_title">风向</div>
            <div class="GisInputPanelTitleTwofelxBox_left_content">
              <el-select v-model="wind" placeholder="请选择">
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
          <div class="GisInputPanelTitleTwoFelxBox_right">
            <div class="GisInputPanelTitleTwoFelxBox_right_title">风速</div>
            <div>
              <el-input placeholder=" " v-model="windPeed">
                <template slot="append">m/s</template>
              </el-input>
            </div>
          </div>
        </div>
        <div class="GisInputPanelSubTitleOne">周边储罐信息</div>
        <div class="GisStorageTankInfo">
          距离着火罐3倍直径范围内，有多个时只需输入三个最大体积储罐计算
        </div>
        <div class="GisTableFelxBox">
          <div class="GisTable_left">
            <el-table
              :data="StorageTankInfo"
              style="width: 100%"
              :row-style="getRowClass"
              :header-row-style="getRowClass"
              :header-cell-style="getRowClass"
              :highlight-current-row="false"
              border
            >
              <el-table-column prop="storageTankNUM" label=" " width="90">
                <template slot-scope="scope">
                  储罐{{ scope.$index + 3 }}
                </template>
              </el-table-column>
              <el-table-column prop="type" label="储罐类型" width="150">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.type" placeholder="请选择">
                    <el-option
                      v-for="item in StorageTankTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="radius" label="储罐体积" width="180">
                <template slot-scope="scope">
                  <div class="tableInputFelxBox">
                    <div class="tableInputFelxBox_left">
                      <input type="text" v-model="scope.row.volume" />
                    </div>
                    <div class="tableInputFelxBox_right">
                      m³
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="储罐半径" width="180">
                <template slot-scope="scope">
                  <div class="tableInputFelxBox">
                    <div class="tableInputFelxBox_left">
                      <input type="text" v-model="scope.row.radius" />
                    </div>
                    <div class="tableInputFelxBox_right">
                      m
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="GisTable_right">
            <div
              class="GisTable_right_button Pointer"
              @click="FnRoundTankFireInfoAdd()"
            >
              新增
            </div>
            <div
              class="GisTable_right_operation"
              v-for="(item, index) in StorageTankInfo"
              :key="item + index"
            >
              <div
                class="GisTable_right_operation_right Pointer"
                @click="FnRoundTankFireInfoPosition(index)"
              ></div>
              <div
                class="GisTable_right_operation_left Pointer"
                @click="FnRoundTankFireInfoDelect(index)"
              ></div>
            </div>
          </div>
        </div>
        <div class="GisInputPanelSubTitleThree">着火罐灭火泡沫施用方案</div>
        <div class="GisFirePanl">
          <div class="GisFirePanl_left">
            着火罐灭火泡沫施用方案
          </div>
          <div class="GisFirePanl_right">
            <el-select v-model="FirePlane" placeholder="请选择" @change="remarkchange">
              <el-option
                v-for="item in FirePlaneOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="remark">
          注：{{curSelectRemark}}
        </div>
        <div class="GisInputPanelSubTitleOne">消防设备信息</div>
        <div class="remark" style="color:#ffffff">
          大型储罐火灾推荐使用流量足够大的大型消防设备一举歼灭，常见大
          型消防设备如下：
        </div>
        <div class="GisTableFelxBox">
          <div class="GisTable_left">
            <el-table
              :data="fireFightingEquipment"
              style="width: 100%"
              :row-style="getRowClass"
              :header-row-style="getRowClass"
              :header-cell-style="getRowClass"
              :highlight-current-row="false"
              border
            >
              <el-table-column label="装备名称" width="300">
                <template slot-scope="scope">
                  <div class="tableInputFelxBox">
                    <div class="tableInputFelxBox_left" style="width:100%">
                      <input type="text" v-model="scope.row.name" />
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="定额流量（升每秒）" width="300">
                <template slot-scope="scope">
                  <div class="tableInputFelxBox">
                    <div class="tableInputFelxBox_left">
                      <input type="text" v-model="scope.row.Num" />
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="GisTable_right">
            <div
              class="GisTable_right_button Pointer"
              @click="FnFireFightingApparatusAdd()"
            >
              新增
            </div>
            <div
              class="GisTable_right_operation"
              v-for="(item, index) in fireFightingEquipment"
              :key="item + index"
              style="height:53px"
            >
              <div
                class="GisTable_right_operation_left Pointer"
                @click="FnFireFightingApparatusDelect(index)"
              ></div>
            </div>
          </div>
        </div>
        <div class="GisInputPanleButton_box">
          <div class="GisInputPanleButton Pointer" @click="FnEmpty()">
            <div class="GisInputPanleButton_icon">
              <img src="../img/clear.png" alt="" />
            </div>
            <div class="GisInputPanleButton_title">清空</div>
          </div>
          <div class="GisInputPanleButton Pointer" @click="FnSumbit()">
            <div class="GisInputPanleButton_icon">
              <img src="../img/sumbit.png" alt="" />
            </div>
            <div class="GisInputPanleButton_title">提交</div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
// import IntelligentSearchDeatil from '@/components/feature/gisModule/popUp/intelligentSearchDeatil.vue';
import { gisStorageTankServer } from '@/api/installServer';
@Component({
  name: 'GisInputPanel',
  components: {},
})
export default class GisInputPanel extends Vue {
  private msg: any = '输入面板';
  private curSelectRemark: string = '威廉姆斯公司标准根据着火储罐半径大小推荐泡沫施用强度，推荐持续施用泡沫混合液至少65分钟，并保留至少60%的冗余量。';
  private StorageTank: any = [
    {
      type: '拱顶罐',
      radius: '60',
      height: '11',
      liquidLevel: '7.76',
      matter: '汽油',
      longitude: 121.03840058915162,
      latitude: 37.10682258260527,
    },
  ];
  private StorageTankTypeOptions: any = [
    {
      value: '拱顶罐',
      label: '拱顶罐',
    },
    {
      value: '浮顶罐',
      label: '浮顶罐',
    },
    {
      value: '内浮顶罐',
      label: '内浮顶罐',
    },
    {
      value: '球罐',
      label: '球罐',
    },
  ];
  private StorageTankInfo: any = [
    {
      type: '拱顶罐',
      radius: '60',
      volume: '6876.23',
      longitude: '116.433921',
      latitude: '23.555066',
    },
  ];
  private MatterOptions: any = [
    {
      value: '汽油',
      label: '汽油',
    },
    {
      value: '柴油',
      label: '柴油',
    },
    {
      value: '石脑油',
      label: '石脑油',
    },
    {
      value: '原油',
      label: '原油',
    },
  ];
  private wind: any = '西北风';
  private windOptions: any = [
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
  private windPeed: any = '1';
  private FirePlane: any = 0;
  private FirePlaneOptions: any = [
    {
      value: 0,
      label: '威廉姆斯公司标准',
      remark: '威廉姆斯公司标准根据着火储罐半径大小推荐泡沫施用强度，推荐持续施用泡沫混合液至少65分钟，并保留至少60%的冗余量。',
    },
    {
      value: 1,
      label: '日本消防厅2005标准',
      remark: '日本消防厅2005标准根据着火储罐半径大小推荐泡沫施用强度，推荐持续施用泡沫混合液至少120分钟，不考虑冗余量。',
    },
    {
      value: 2,
      label: 'GB50151泡沫灭火系统设计规范',
      remark: '《GB 50151-2010 泡沫灭火系统设计规范》推荐储罐火灾灭火时至少保持6.5L/min/m^2的泡沫施用强度，持续60分钟，不考虑冗余量。',
    },
  ];
  private fireFightingEquipment: any = [
    {
      name: '一般举高喷射消防车',
      Num: '4800',
    },
    {
      name: '6000L/min举高喷射消防车',
      Num: '6000',
    },
    {
      name: '10000L/min举高喷射消防车',
      Num: '10000',
    },
    {
      name: '250L/s拖车炮',
      Num: '15000',
    },
    {
      name: '400L/s大流量消防炮',
      Num: '24000',
    },
    {
      name: '750 L/s大流量消防炮',
      Num: '45000',
    },
    {
      name: '1150L/s车载炮',
      Num: '69000',
    },
  ];
  private TestLongitudeAndLatitude: any = [
    {longitude: 116.433567, latitude: 23.555328},
    {
      longitude: 116.433312,
      latitude: 23.555008,
    },
    {
      longitude: 116.433921,
      latitude: 23.555066,
    },
    {
      longitude: 116.433624,
      latitude: 23.554746,
    },
    {
      longitude: 116.434193,
      latitude: 23.554825,
    },
    {
      longitude: 116.433907,
      latitude: 23.554509,
    },
    {
      longitude: 116.434497,
      latitude: 23.55457,
    },
    {
      longitude: 116.434201,
      latitude: 23.554261,
    },
  ];
  private Num: any = 0;
  private isselectPoint: boolean = false; // 是否选择点位
  private getRowClass({ row, column, rowIndex, columnIndex }: any): any {
    return 'background:#3f5c6d2c;color:#ffffff;text-align:center;';
  }
  private remarkchange(str: any): void {
    console.log(str);
    this.curSelectRemark = this.FirePlaneOptions[str].remark;
  }
  private FnTankFireInfoAdd(): void {
    const storageTankNum = this.StorageTank.length;
    let params: any = {
      type: '拱顶罐',
      radius: '',
      height: '',
      liquidLevel: '',
      matter: '',
      longitude: '',
      latitude: '',
    };
    switch (storageTankNum) {
      case 1:
        params = {
          type: '拱顶罐',
          radius: '60',
          height: '11',
          liquidLevel: '2.47',
          matter: '汽油',
          longitude: '116.433312',
          latitude: '23.555008',
        };
        break;
      case 2:
        params = {
          type: '拱顶罐',
          radius: '60',
          height: '11',
          liquidLevel: '12.6m',
          matter: '汽油',
          longitude: '116.433921',
          latitude: '23.555066',
        };
        break;
      case 3:
        params = {
          type: '拱顶罐',
          radius: '60',
          height: '11',
          liquidLevel: '7.29m',
          matter: '汽油',
          longitude: '116.433624',
          latitude: '23.554746',
        };
        break;
      case 4:
        params = {
          type: '拱顶罐',
          radius: '60',
          height: '11',
          liquidLevel: '1.84m',
          matter: '汽油',
          longitude: '116.434193',
          latitude: '23.554825',
        };
        break;
      case 5:
        params = {
          type: '拱顶罐',
          radius: '60',
          height: '11',
          liquidLevel: '8.5m',
          matter: '柴油',
          longitude: '116.433907',
          latitude: '23.554509',
        };
        break;
      case 6:
        params = {
          type: '拱顶罐',
          radius: '60',
          height: '11',
          liquidLevel: '0.3m',
          matter: '汽油',
          longitude: '116.434497',
          latitude: '23.55457',
        };
        break;
      case 7:
        params = {
          type: '拱顶罐',
          radius: '60',
          height: '11',
          liquidLevel: '4.27m',
          matter: '柴油',
          longitude: '116.434201',
          latitude: '23.554261',
        };
        break;
      default:
        break;
    }

    this.StorageTank.push(params);
  }
  // 着火点删除定位和表格
  private FnTankFireInfoDelect(val: any): void {
    this.StorageTank.splice(val, 1);
    this.getComponent().removeIgnitionPointLayer('IgnitionPoint_layer' + (val * 1 + 1));
  }
  private getComponent() {
    const gisModules = this.$ioc.resolve('GISFactory-map');
    const component = gisModules.commonFactory.getComponent('riskAnalysis');
    return component;
  }
  // 着火点增加定位
  private FnTankFireInfoPosition(val: any): void {
    const text: any = '储罐' + (val * 1 + 1);
    const layer: any = 'IgnitionPoint_layer' + (val * 1 + 1);
    this.getComponent().off().on('TankPositionId', this.changeLocation, this);
    this.getComponent().setIgnitionPoint(text, layer, val);
    this.isselectPoint = true;
    //  this.changeLocation(val)
    // this.$message(
    //   '已确定储罐位置' +
    //     'longitude' +
    //     this.TestLongitudeAndLatitude[val].longitude +
    //     ',' +
    //     'latitude' +
    //     this.TestLongitudeAndLatitude[val].latitude,
    // );
  }
  // 着火储罐修改定位
  private changeLocation(val: any) {
    this.StorageTank[val.evt.num].longitude = val.evt.mapX;
    this.StorageTank[val.evt.num].latitude = val.evt.mapY;
  }
  private FnRoundTankFireInfoAdd(): void {
    const storageTankNum = this.StorageTankInfo.length;
    let params: any = {
      type: '拱顶罐',
      radius: '60',
      volume: '6052',
      longitude: '116.434193',
      latitude: '23.554825',
    };
    switch (storageTankNum) {
      case 3:
        params = {
          type: '拱顶罐',
          radius: '60',
          volume: '3982.34',
          longitude: '116.433624',
          latitude: '23.554746',
        };
        break;
      case 4:
        params = {
          type: '拱顶罐',
          radius: '60',
          volume: '35785.40',
          longitude: '116.434193',
          latitude: '23.554825',
        };
        break;
      case 5:
        params = {
          type: '拱顶罐',
          radius: '60',
          volume: '4631.28',
          longitude: '116.433907',
          latitude: '23.554509',
        };
        break;
      case 6:
        params = {
          type: '拱顶罐',
          radius: '60',
          volume: '163.42',
          longitude: '116.434497',
          latitude: '23.554570',
        };
        break;
      case 7:
        params = {
          type: '拱顶罐',
          radius: '60',
          volume: '2332.77',
          longitude: '116.434201',
          latitude: '23.554261',
        };
        break;
      default:
        break;
    }
    this.StorageTankInfo.push(params);
  }
  // 周边储罐删除
  private FnRoundTankFireInfoDelect(val: any): void {
    this.StorageTankInfo.splice(val, 1);
    this.getComponent().removeIgnitionPointLayer('PeripheralTankPoint_layer' + (val * 1 + 1));
  }
  // 周边储罐增加定位
  private FnRoundTankFireInfoPosition(val: any): void {
    // const PostitonArr: any = [5, 7];
    // const PositionInfo: any =
    //   PostitonArr[Math.floor(Math.random() * PostitonArr.length)];
    // console.log('PositionInfo', PositionInfo);
        const text: any = '周边储罐' + (val * 1 + 1);
        const layer: any = 'PeripheralTankPoint_layer' + (val * 1 + 1);
        this.getComponent().off().on('TankPositionId', this.FnchangeLocation, this);
        this.getComponent().setIgnitionPoint(text, layer, val);
    //  this.FnchangeLocation(val)
    // this.StorageTankInfo[val].longitude = this.TestLongitudeAndLatitude[
    //   PositionInfo
    // ].longitude;
    // this.StorageTankInfo[val].latitude = this.TestLongitudeAndLatitude[
    //   PositionInfo
    // ].latitude;
  }
  // 周边储罐修改定位
  private FnchangeLocation(val: any) {
    this.StorageTankInfo[val.evt.num].longitude = val.evt.mapX;
    this.StorageTankInfo[val.evt.num].latitude = val.evt.mapY;
  }
  private FnFireFightingApparatusAdd(): void {
    const storageTankNum = this.StorageTankInfo.length;
    const params: any = {
      name: '',
      Num: '',
    };
    this.fireFightingEquipment.push(params);
  }
  private FnFireFightingApparatusDelect(val: any): void {
    this.fireFightingEquipment.splice(val, 1);
  }
  private FnSumbit(val: any) {
    if (this.StorageTank.length < 1) {
      this.$message.info('着火储罐信息不能为空！');
      return false;
    }

    if (!this.isselectPoint) {
      this.$message.info('请选择着火储罐点位！');
      return false;
    }
    if (Number(this.windPeed) < 0 || Number(this.windPeed) > 100) {
      this.$message.info('气象信息风速只能在0-100之间');
      return false;
    }
    this.Num = this.Num + 1;
    const StorageTanks: any = [];
    for (const iterator of this.StorageTank) {
      const Arr: any = {
        110517: iterator.radius,
        110518: iterator.height,
        110525: iterator.liquidLevel,
        110520: iterator.matter,
        110530: [4326, iterator.longitude, iterator.latitude, 1],
      };
      StorageTanks.push(Arr);
    }
    // const FireParamsData: any = {
    //   params: {
    //     110517: this.StorageTank[0].radius,
    //     110518: this.StorageTank[0].height,
    //     110525: this.StorageTank[0].liquidLevel,
    //     110520: this.StorageTank[0].matter,
    //     110530: [
    //       4326,
    //       this.StorageTank[0].longitude,
    //       this.StorageTank[0].latitude,
    //       0,
    //     ],
    //     110601: StorageTank,
    //     103001: this.wind,
    //     103004: this.windPeed,
    //     103101: 28,
    //     103104: 1.293,
    //     110602: 1000,
    //     110603: [10, 30, 60, 600],
    //     110010: true,
    //     110028: true,
    //     110051: [],
    //   },
    //   modelId: 'chemicalfire',
    //   validDays: -1,
    // };
    const FireParamsData: any = {
      params: {
        103001: this.wind,
        103004: this.windPeed,
        103101: 28,
        103104: 1.293,
        110010: true,
        110028: true,
        110051: [],
        110601: StorageTanks,
        110602: 1000,
        110603: [10, 30, 60, 600],
      },
    };
    // console.log('FireParamsData', FireParamsData);
    const FireControl: any = [];
    for (const iterator of this.StorageTank) {
      const Arr: any = {
        110510: iterator.type,
        110517: iterator.radius,
        110519: [4326, iterator.longitude, iterator.latitude, 1],
      };
      FireControl.push(Arr);
    }
    const FireControlParamsData: any = {
      params: {
        110510: this.StorageTank[0].type,
        110517: this.StorageTank[0].radius,
        110519: [
          4326,
          this.StorageTank[0].longitude,
          this.StorageTank[0].latitude,
          1,
        ],
        110520: this.StorageTank[0].matter,
        110703: this.FirePlane,
        110704: 360,
        110705: 360,
        110610: FireControl,
      },
      validDays: -1,
    };
    gisStorageTankServer
      .getLargeTankFireModel(FireParamsData)
      .then((data: any) => {
        this.Num = this.Num + 1;
        this.messsageBus.emit('TankFireModel', data);
      });
    // gisStorageTankServer
    // .getLargeTankFireModelTwo(FireParamsData)
    // .then((data: any) => {
    //   // this.Num = this.Num + 1;
    //   this.messsageBus.emit('TankFireModelTwo', data);
    //   console.log(data, '大型储罐火灾最新分析模型');
    // });
    gisStorageTankServer
      .getLargeTankFireAnalysisModel(FireControlParamsData)
      .then((data: any) => {
        this.Num = this.Num + 1;
        this.messsageBus.emit('TankFireAnalysisModel', data);
      });
  }
  private FnEmpty(): void {
    this.Num = 0;
    this.StorageTank.forEach((item: any, index: any) => {
      this.getComponent().removeIgnitionPointLayer('IgnitionPoint_layer' + (index * 1 + 1));
    });
    this.StorageTankInfo.forEach((item: any, index: any) => {
      this.getComponent().removeIgnitionPointLayer('PeripheralTankPoint_layer' + (index * 1 + 1));
    });
    this.curSelectRemark = '威廉姆斯公司标准根据着火储罐半径大小推荐泡沫施用强度，推荐持续施用泡沫混合液至少65分钟，并保留至少60%的冗余量。';
    this.StorageTank = [
      {
        type: '拱顶罐',
        radius: '60',
        height: '11',
        liquidLevel: '7.76',
        matter: '汽油',
        longitude: 121.03840058915162,
        latitude: 37.10682258260527,
      },
    ];
    this.StorageTankInfo = [
      {
        type: '拱顶罐',
        radius: '60',
        volume: '6876.23',
        longitude: '116.433921',
        latitude: '23.555066',
    },
    ];
    this.wind = '西北风';
    this.windPeed = '1';
    this.FirePlane = 0;
    this.fireFightingEquipment = [
      {
        name: '一般举高喷射消防车',
        Num: '4800',
      },
      {
        name: '6000L/min举高喷射消防车',
        Num: '6000',
      },
      {
        name: '10000L/min举高喷射消防车',
        Num: '10000',
      },
      {
        name: '250L/s拖车炮',
        Num: '15000',
      },
      {
        name: '400L/s大流量消防炮',
        Num: '24000',
      },
      {
        name: '750 L/s大流量消防炮',
        Num: '45000',
      },
      {
        name: '1150L/s车载炮',
        Num: '69000',
      },
    ];
  }
}
</script>
<style scoped lang="less">
@import url('../../../../../assets/css/animate.min.css');
.GisInputPanel {
  width: 100%;
  height: 100%;
}
.Pointer {
  cursor: pointer;
}
.GisInputPanelTitle {
  width: 100%;
  margin: 20px 30px;
  text-align: left;
  font-size: 26px;
  height: 35px;
  line-height: 35px;
  color: #00e4ff;
}
.GisInputPanelSubTitleOne {
  width: 240px;
  height: 35px;
  background-image: url(../img/titleOne.png);
  background-size: 100% 100%;
  text-align: center;
  color: #00e4ff;
  line-height: 35px;
  font-size: 26px;
  margin: 10px 0 10px 40px;
}
.GisTableFelxBox {
  width: 96%;
  height: auto;
  display: flex;
  justify-content: center;
  margin: 0 auto;
}
.GisTable_left {
  width: 87%;
  height: auto;
}
.GisTable_right {
  width: 11%;
  height: auto;
}
.GisTable_right_button {
  width: 65px;
  height: 47px;
  margin: 0 10px;
  text-align: center;
  font-size: 22px;
  line-height: 50px;
  color: #00e4ff;
  background-image: url(../img/add.png);
  background-size: 100% 100%;
}
.GisTable_right_button:hover {
  width: 65px;
  height: 47px;
  margin: 0 10px;
  text-align: center;
  font-size: 22px;
  line-height: 50px;
  color: #00e4ff;
  background-image: url(../img/add_hover.png);
  background-size: 100% 100%;
}
.GisTable_right_operation {
  width: 85px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.GisTable_right_operation_right {
  width: 15px;
  height: 20px;
  background-image: url(../img/mapPosistion.png);
  background-size: 100% 100%;
  margin: 0 10px;
}
.GisTable_right_operation_left {
  width: 15px;
  height: 20px;
  background-image: url(../img/closeList.png);
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
  width: 70%;
  height: 100%;
}
.tableInputFelxBox_left input {
  background: rgba(0, 0, 0, 0);
  width: 100%;
  height: 100%;
  border: none;
  text-align: center;
  font-size: 22px;
  color: #fff;
}
.tableInputFelxBox_right {
  width: 30%;
  font-size: 22px;
}
.GisInputPanelSubTitleTwo {
  width: 184px;
  height: 39px;
  background-image: url(../img/titleTwo.png);
  background-size: 100% 100%;
  text-align: center;
  color: #00e4ff;
  line-height: 35px;
  font-size: 26px;
  margin: 10px 0 10px 40px;
}
.GisInputPanelTitleTwoFelxBox {
  width: 95%;
  height: auto;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.GisInputPanelTitleTwoFelxBox_left {
  width: 54%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.GisInputPanelTitleTwoFelxBox_left_title {
  font-size: 22px;
  color: #e5f4ff;
  margin-right: 10px;
}
.GisInputPanelTitleTwoFelxBox_right {
  width: 46%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.GisInputPanelTitleTwoFelxBox_right_title {
  width: 61px;
  font-size: 22px;
  color: #e5f4ff;
  margin-right: 10px;
}
.GisStorageTankInfo {
  width: 95%;
  margin: 5px auto;
  font-size: 22px;
  color: #fff;
}
.GisInputPanelSubTitleThree {
  width: 380px;
  height: 39px;
  background-image: url(../img/titleThree.png);
  background-size: 100% 100%;
  text-align: center;
  color: #00e4ff;
  line-height: 35px;
  font-size: 26px;
  margin: 10px 0 10px 40px;
}
.GisFirePanl {
  width: 90%;
  margin: 10px auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.GisFirePanl_left {
  width: 242px;
  height: 30px;
  line-height: 30px;
  font-size: 22px;
  color: #e5f4ff;
  margin-right: 20px;
}
.remark {
  width: 90%;
  margin: 10px auto;
  font-size: 22px;
  line-height: 30px;
  color: #a0f7ff;
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
  width: 155px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(../img/clearAndSumbit.png);
  background-size: 100% 100%;
  margin: 0 20px;
}
.GisInputPanleButton:hover {
  width: 155px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(../img/clearAndSumbit_hover.png);
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
  font-size: 22px;
  color: #70feff;
}
.loadingBox {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loading {
  color: #fff;
  font-size: 36px;
  background: url(../../../../../assets/img/halfScreen/halflist/searchOne.gif)
    no-repeat 33px 255px;
  color: #d2e1ec;
  height: 800px;
  width: 390px;
}
/deep/ .el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  margin: 0 5px;
  background-color: rgba(0, 0, 0, 0);
  color: #606266;
  min-width: 30px;
  border-radius: 8px;
  border: 1px solid #38747f;
}

/deep/ .el-collapse-item__header {
  display: flex;
  align-items: center;
  height: 60px;
  line-height: 48px;
  background-color: rgba(0, 0, 0, 0);
  color: #303133;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0);
  border-bottom-color: rgba(235, 238, 245, 0);
  font-size: 13px;
  font-weight: 500;
  transition: border-bottom-color 0.3s;
  outline: 0;
  background-image: url(../../../../../assets/img/gisModule/GisIntelligentSearch/GisTeamViewAll.png);
  background-position: 14px -152px;
}

/deep/ .el-collapse {
  border-top: 1px solid rgba(0, 0, 0, 0);
  border-bottom: 1px solid rgba(0, 0, 0, 0);
}

/deep/ .el-collapse-item__wrap {
  will-change: height;
  background-color: rgba(0, 0, 0, 0);
  overflow: hidden;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0);
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

/deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-image: linear-gradient(#ffbf00a8, #c69b74e3);
  color: #fff;
}

/deep/ .el-pagination.is-background .el-pager li {
  margin: 0 5px;
  background-color: rgba(0, 0, 0, 0);
  color: #606266;
  min-width: 30px;
  border-radius: 8px;
  border: 1px solid #38747f;
}

/deep/ .el-pagination.is-background .btn-prev:disabled {
  margin: 0 5px;
  background-color: rgba(0, 0, 0, 0);
  color: #606266;
  min-width: 30px;
  border-radius: 8px;
  border: 1px solid #38747f;
}

/deep/ .el-pagination.is-background .btn-prev {
  margin: 0 5px;
  background-color: rgba(0, 0, 0, 0);
  color: #606266;
  min-width: 30px;
  border-radius: 8px;
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
  font-size: 20px;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  padding-right: 15px;
  padding-left: 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 5px;
}
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
  background-image: url('../img/titleHead.png');
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
  background-image: url(../img/fx.png);
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
  background-image: url(../img/tbodyBg.png);
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
/deep/ .el-input-group__append,
.el-input-group__prepend {
  background-color: rgba(0, 0, 0, 0);
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
  font-size: 20px;
}
</style>
