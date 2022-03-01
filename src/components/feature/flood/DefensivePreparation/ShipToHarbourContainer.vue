<!--船舶归港详情的容器组件-->
<template>
  <div>
    <div class="ShipToHarbour" v-if="compParam.key == 'shipToHarbour'">
      <div class="title">
        {{ compParam.title }}
      </div>
      <span class="halflist-back" @click="handleBackParent"></span>
      <div class="nodata" v-if="!compParam.nextCompParam.shipPersonList">
        <img src="../../../../assets/img/default/panel/noData.png" />
      </div>
      <div v-else>
        <div class="shipSubtext">
          <div>
            受影响船舶共
            <span class="numColor">
              <span class="numChange"
                >{{
                  changgeUnit(compParam.nextCompParam.shipsAffectedNum).value
                }}
              </span>
              <span class="numUnit"
                >{{
                  changgeUnit(compParam.nextCompParam.shipsAffectedNum).unit
                }}只</span
              >
            </span>
          </div>
          <div>
            已归港船舶共
            <span class="numColor">
              <span class="numChange">
                {{
                  changgeUnit(compParam.nextCompParam.shipsBackPortNum).value
                }}</span
              >
              <span class="numUnit"
                >{{
                  changgeUnit(compParam.nextCompParam.shipsBackPortNum).unit
                }}只</span
              ></span
            >
          </div>
          <div>
            已归港船舶最高为：
            <span class="numColor">{{ shipBack }}</span>
          </div>
          <div>
            受影响船舶最高为：
            <span class="numColor">{{ shipEffect }}</span>
          </div>
        </div>
        <el-scrollbar style="height: 630px" class="shipList">
          <ul>
            <li
              class="ship_List"
              v-for="(item, index) in shipPersonList1"
              :key="index"
              @click="expandCityShip(item, 'shipToHarbour')"
            >
              <div class="transferCity">{{ item.cityName }}</div>
              <div class="transferPerson">
                <div>
                  <span> 受影响船舶：&nbsp;</span
                  ><span class="NumTitle">
                    <span class="numChange">
                      {{ item.shipsAffectedNum.value }}</span
                    >&nbsp;&nbsp;<span class="numUnit"
                      >{{ item.shipsAffectedNum.unit }}只</span
                    ></span
                  >
                </div>
                <div>
                  <span>已归港船舶：&nbsp;</span>
                  <span class="NumTitle">
                    <span class="numChange">
                      {{ item.shipsBackPortNum.value }}</span
                    >&nbsp;&nbsp;<span class="numUnit"
                      >{{ item.shipsBackPortNum.unit }}只</span
                    ></span
                  >
                </div>
                <div>
                  <span>归港率：&nbsp;</span
                  ><span class="NumTitle">
                    <span class="numChange">
                      {{ toPercent(item.shipRatio) }}%</span
                    ></span
                  >
                </div>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>

    <div class="ShipToHarbour" v-if="compParam.key == 'personTransfer'">
      <div class="title">
        {{ compParam.title }}
      </div>
      <span class="halflist-back" @click="handleBackParent"></span>
      <div class="nodata" v-if="!compParam.nextCompParam.shipPersonList">
        <img src="../../../../assets/img/default/panel/noData.png" />
      </div>
      <div v-else>
        <div class="shipSubtext">
          <div>
            受影响人员共
            <span class="numColor">
              <span class="numChange">
                {{
                  changgeUnit(compParam.nextCompParam.personnelAffectedNum)
                    .value
                }}</span
              >
              <span class="numUnit"
                >{{
                  changgeUnit(compParam.nextCompParam.personnelAffectedNum)
                    .unit
                }}人</span
              ></span
            >
          </div>
          <div>
            已上岸共
            <span class="numColor">
              <span class="numChange">
                {{
                  changgeUnit(compParam.nextCompParam.personnelAshoreNum).value
                }}</span
              >
              <span class="numUnit"
                >{{
                  changgeUnit(compParam.nextCompParam.personnelAshoreNum).unit
                }}人</span
              ></span
            >
          </div>
          <div>
            已上岸人员最高为：
            <span class="numColor">{{ personnelAshoreNum }}</span>
          </div>
          <div>
            受影响人员最高为：
            <span class="numColor">{{ personnelAffectedNum }}</span>
          </div>
        </div>
        <el-scrollbar style="height: 630px" class="shipList">
          <ul>
            <li
              class="ship_List"
              v-for="(item, index) in shipPersonList1"
              :key="index"
              @click="expandCityShip(item, 'personTransfer')"
            >
              <div class="transferCity">{{ item.cityName }}</div>
              <div class="transferPerson">
                <div>
                  <span> 受影响人员： &nbsp;</span
                  ><span class="NumTitle">
                    <span class="numChange">
                      {{ item.personnelAffectedNum.value }}</span
                    >&nbsp;&nbsp;<span class="numUnit"
                      >{{ item.personnelAffectedNum.unit }}人</span
                    ></span
                  >
                </div>
                <div>
                  <span>已上岸人员：&nbsp;</span>
                  <span class="NumTitle">
                    <span class="numChange">{{
                      item.personnelAshoreNum.value
                    }}</span
                    >&nbsp;&nbsp;<span class="numUnit"
                      >{{ item.personnelAshoreNum.unit }}人</span
                    ></span
                  >
                </div>
                <div>
                  <span>上岸率 ：&nbsp;</span
                  ><span class="NumTitle">
                    <span class="numChange"
                      >{{ toPercent(item.peopleRatio) }}%</span
                    ></span
                  >
                </div>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import { pushDataRequestServe } from '@/api/installServer';
import publishObjectPath from '@/util/configRegistry';
@Component({
  name: 'ShipToHarbourContainer',
  components: {},
})
export default class ShipToHarbourContainer extends Vue {
  @Prop() private compParam: any;
  @Prop() private handleClick: any;
  // 高新区和开发区，这两个名字有些特殊
  private specialCodeMap: any = {
    370671: {
      name: '高新区',
      alias: '烟台高新技术产业开发区', // 给地图传这个名字
    },
    370672: {
      name: '开发区',
      alias: '烟台经济技术开发区', // 给地图传这个名字
    },
  };
  private shipBack: any = this.compParam.nextCompParam.shipPersonList.reduce(
    (p: any, v: any) => (p.shipsBackPortNum < v.shipsBackPortNum ? v : p),
  ).cityName; // 已归港最高
  private shipEffect: any = this.compParam.nextCompParam.shipPersonList.reduce(
    (p: any, v: any) => (p.shipsAffectedNum < v.shipsAffectedNum ? v : p),
  ).cityName; // 受影响最高
  private personnelAshoreNum: any = this.compParam.nextCompParam.shipPersonList.reduce(
    (p: any, v: any) => (p.personnelAshoreNum < v.personnelAshoreNum ? v : p),
  ).cityName; // 已上岸人员最高
  private personnelAffectedNum: any = this.compParam.nextCompParam.shipPersonList.reduce(
    (p: any, v: any) =>
      p.personnelAffectedNum < v.personnelAffectedNum ? v : p,
  ).cityName; // 受影响人员最高

  private shipPersonList1: any = [];

  // 获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.defensivePreparationFactory.getComponent(
      'PopulationShip',
    );
    return component;
  }
  //  处理数据格式
  private handleResData(resData: any) {
    let newResData: any = {};
    if (resData.data.content) {
      const targetJsonStr = JSON.parse(resData.data.content)[0].data;
      const targetDataObj = JSON.parse(targetJsonStr);
      newResData = targetDataObj.data;
    }
    return newResData;
  }
  //  接口
  private async getDataByServ() {
//  defensiveEventId 烟台通用事件Id
    const resData = await pushDataRequestServe.getPushDataByIds(
      this.$store.state.eventPushStore.eventId || publishObjectPath.value.defensiveEventId,
      'ship_transfer',
    );
    const result = this.handleResData(resData);
    // this.getCacheData('ShipToHarbour', result);
    return result;
  }
  //  监听 事件数据
  @Watch('$store.state.eventPushStore.ship_transfer')
  private async handleResultData() {
    // this.clickAis(false);
    this.compParam.nextCompParam = await this.getDataByServ();
    if (this.compParam.nextCompParam.shipPersonList) {
      this.shipPersonList1 = this.compParam.nextCompParam.shipPersonList;
      this.shipPersonList1.forEach((item: any) => {
        item.shipsAffectedNum = this.changgeUnit(item.shipsAffectedNum);
        item.shipsBackPortNum = this.changgeUnit(item.shipsBackPortNum);
        item.personnelAffectedNum = this.changgeUnit(item.personnelAffectedNum);
        item.personnelAshoreNum = this.changgeUnit(item.personnelAshoreNum);
      });
      this.shipBack = this.compParam.nextCompParam.shipPersonList.reduce(
        (p: any, v: any) =>
          p.shipsBackPortNum.value < v.shipsBackPortNum.value ? v : p,
      ).cityName;

      this.shipEffect = this.compParam.nextCompParam.shipPersonList.reduce(
        (p: any, v: any) =>
          p.shipsAffectedNum.value < v.shipsAffectedNum.value ? v : p,
      ).cityName;

      this.personnelAshoreNum = this.compParam.nextCompParam.shipPersonList.reduce(
        (p: any, v: any) =>
          p.personnelAshoreNum.value < v.personnelAshoreNum.value ? v : p,
      ).cityName;
      this.personnelAffectedNum = this.compParam.nextCompParam.shipPersonList.reduce(
        (p: any, v: any) =>
          p.personnelAffectedNum.value < v.personnelAffectedNum.value ? v : p,
      ).cityName;
    }
  }
  // 弹框模板
  // private popUpTemplate = new renderpopUpTemplate();

  // 地图定点回调   船舶
  private popupData(event: any) {
    event.type = 'ship';
    const list = this.compParam.nextCompParam.shipPersonList;
    list.forEach((res: any) => {
      if (res.cityCode === event.data.districtcode) {
        event.data = Object.assign(event.data, res);
      }
    });
    const param = {
      that: this,
      popupId: 'popup', // 监听id，必须
      moduleTypeID: 'ship',

      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    const popUpTemplate = new renderpopUpTemplate();
    popUpTemplate.getParams(param);
    popUpTemplate.onShowPopup(event);
  }

  //  人员上岸
  private popupData1(event: any) {
    event.type = 'ashore';
    const list = this.compParam.nextCompParam.shipPersonList;
    list.forEach((res: any) => {
      if (res.cityCode === event.data.districtcode) {
        event.data = Object.assign(event.data, res);
      }
    });
    const param = {
      that: this,
      popupId: 'popup', // 监听id，必须
      moduleTypeID: 'ashore',

      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    const popUpTemplate = new renderpopUpTemplate();
    popUpTemplate.getParams(param);
    popUpTemplate.onShowPopup(event);
  }

  // 转换 万 单位
  private changgeUnit(value: any) {
    const param: any = {};
    const k = 10000;
    const sizes = ['', '万'];
    let i;
    if (value < k) {
      param.value = value;
      param.unit = '';
    } else {
      i = Math.floor(Math.log(value) / Math.log(k));
      param.value = (value / Math.pow(k, i)).toFixed(2);
      param.unit = sizes[i];
    }
    return param;
  }

  //  转换 百分比
  private toPercent(point: any) {
    if (point === 0) {
      return 0;
    }
    const str = Number(point * 100).toFixed(2);
    return str;
  }
  private async created() {
    // 以下的if是从expandCityShip这个方法下直接拿过来的，只拿了部分
    if (this.compParam.key === 'shipToHarbour') {
      this.getComponent().off('defensive_data_popup');
      this.getComponent().on('defensive_data_popup', this.popupData, this);
    } else if (this.compParam.key === 'personTransfer') {
      this.getComponent().off('defensive_data_popup');
      this.getComponent().on('defensive_data_popup', this.popupData1, this);
    }
    // this.getComponent().off('RealtimeShip_popup');
    await this.handleResultData();
  }
  private mounted() {
    if (this.compParam.nextCompParam.shipPersonList) {
      //     const dataList = this.compParam.nextCompParam.shipPersonList;
      // this.shipBack = dataList.reduce((p: any, v: any) =>
      //   p.shipsBackPortNum.value < v.shipsBackPortNum.value ? v : p,
      // ).cityName;

      // this.shipEffect = this.compParam.nextCompParam.shipPersonList.reduce(
      //   (p: any, v: any) =>
      //     p.shipsAffectedNum.value < v.shipsAffectedNum.value ? v : p,
      // ).cityName;

      // this.personnelAshoreNum = this.compParam.nextCompParam.shipPersonList.reduce(
      //   (p: any, v: any) =>
      //     p.personnelAshoreNum.value < v.personnelAshoreNum.value ? v : p,
      // ).cityName;
      // this.personnelAffectedNum = this.compParam.nextCompParam.shipPersonList.reduce(
      //   (p: any, v: any) =>
      //     p.personnelAffectedNum.value < v.personnelAffectedNum.value ? v : p,
      // ).cityName;

      this.shipPersonList1 = this.compParam.nextCompParam.shipPersonList;
      this.shipPersonList1.forEach((item: any) => {
        item.shipsAffectedNum = this.changgeUnit(item.shipsAffectedNum);
        item.shipsBackPortNum = this.changgeUnit(item.shipsBackPortNum);
        item.personnelAffectedNum = this.changgeUnit(item.personnelAffectedNum);
        item.personnelAshoreNum = this.changgeUnit(item.personnelAshoreNum);
      });
      this.getComponent().localDistrict();
    }
  }

  // 点击列表
  private expandCityShip(item: any, type: any) {
    // 高新区和开发区这个名字是简称，传给地图的时候要放全名
    const cityName = (this.specialCodeMap[item.cityCode] && this.specialCodeMap[item.cityCode].alias)
                      ||
                    item.cityName;
    if (type === 'shipToHarbour') {
      this.getComponent().locate(cityName); //  船舶
      this.getComponent().off('defensive_data_popup');
      this.getComponent().on('defensive_data_popup', this.popupData, this);
      this.getComponent().load();
    } else if (type === 'personTransfer') {
      this.getComponent().locate(cityName); // 人员
      this.getComponent().off('defensive_data_popup');
      this.getComponent().on('defensive_data_popup', this.popupData1, this);
      this.getComponent().load();
    }
  }

  private beforeDestroy() {
    //  清除图层
    this.getComponent().removeDistrict();
    this.getComponent().off('defensive_data_popup', this.popupData, this);
    this.getComponent().unload();
    this.getComponent().off('defensive_data_popup', this.popupData1, this);
    this.getComponent().unload();
  }

  // 返回一级页面
  private handleBackParent() {
    this.getComponent().removeDistrict();
    this.getComponent().off('defensive_data_popup', this.popupData, this);
    this.getComponent().off('defensive_data_popup', this.popupData1, this);
    // this.getComponent().udload();
    // this.$emit("backParent");
    this.handleClick('DefensiveHome', JSON.parse(JSON.stringify({})));
  }
}
</script>

<style lang="less" scoped>
.nodata {
  height: 399px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ShipToHarbour {
  .numChange {
    color: #6ae7fc;
    font-family: 'Impact';
    font-weight: 400;
    cursor: pointer;
    &:hover {
      color: #fdef4f;
    }
  }
  .numColor {
    color: #27e8ff;
    font-size: 28px;
  }
  .numUnit {
    color: #e8f4fe;
  }
  .title {
    line-height: 35px;
    text-align: left;
    white-space: nowrap;
    font-style: italic;
    padding-left: 10px;
    font-weight: 600;
    font-family: 'myHeiti';
    font-size: calc(20px * 1.2);
    color: 00e4ff;
    background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -1px;
    padding-right: 20px;
  }
  .halflist-back {
    width: 61px;
    height: 25px;
    position: absolute;
    top: 10px;
    right: 0px;
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
  .shipSubtext {
    font-size: 24px;
    line-height: 36px;
    color: #8cafd0;
    div {
      height: 28px;
      line-height: 28px;
      padding: 8px 10px;
    }
  }
  .shipList {
    .ship_List {
      cursor: pointer;
      margin-bottom: 10px;
      padding: 10px;
      height: 174px;
      font-size: 26px;
      // box-shadow: 0 0 2px rgba(0, 0, 0, 0.36);
      background-color: rgba(116, 239, 252, 0.1);
      position: relative;
      &:after {
        content: '';
        display: block;
        height: 2px;
        width: 100%;
        background-image: linear-gradient(
          to right,
          rgba(33, 113, 113, 0.1),
          rgba(33, 113, 113, 1),
          rgba(33, 113, 113, 0.1)
        );
        position: absolute;
        bottom: 0px;
      }
      &:before {
        content: '';
        display: block;
        height: 2px;
        width: 100%;
        background-image: linear-gradient(
          to right,
          rgba(33, 113, 113, 0.1),
          rgba(33, 113, 113, 1),
          rgba(33, 113, 113, 0.1)
        );
        position: absolute;
        top: 0px;
      }
      .transferCity {
        color: #e8f4fe;
        margin-bottom: 15px;
      }
      .transferPerson {
        color: #8cafd0;
        div {
          height: 45px;
          .NumTitle {
            display: inline-block;
            height: 26px;
            line-height: 26px;
            color: #00e4ff;
            width: 50%;
          }
        }
      }
    }

    .transferFirstDetail {
      .city {
        font-size: 28px;
        color: #e8f4fe;
        text-align: center;
        height: 74px;
        line-height: 74px;
      }
      li {
        height: 120px;
        font-size: 26px;
        color: #d2e1ec;
        text-align: left;
        color: #e8f4fe;
        div {
          height: 60px;
          line-height: 60px;
          padding: 0 12px;
        }
        &:nth-child(2n) {
          height: 111px;
          background-color: rgba(82, 183, 234, 0.12);
          div {
            height: 55px;
            line-height: 55px;
            padding: 0 10px;
          }
        }
      }
    }
  }
}
</style>
