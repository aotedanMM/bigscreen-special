<!--人员转移详情的容器组件-->
<template>
  <div class="personTransfer">
    <div class="title">
      人员转移详情
    </div>
    <span class="halflist-back" @click="handleBackParent"></span>
    <div class="nodata" v-if="!compParam.nextCompParam.populationShiftsList">
      <img src="../../../../assets/img/default/panel/noData.png" />
    </div>
    <div v-else>
      <el-scrollbar style="height: 700px" class="transferList">
        <ul class="transferFirst" v-if="!showDetail">
          <li
            v-for="(item, index) in showListData"
            :key="index"
            @click="openDetail(item)"
          >
            <div class="transferPerson">
              <div>
                <span :title="item.cityName"> {{ item.cityName }} </span
                ><span
                  >完成率
                  <span class="NumTitle">
                    {{ toPercent(item.ratio) }}%</span
                  ></span
                >
              </div>
              <div>
                <span> 预计转移 </span>
                <span
                  ><span class="NumTitle">{{ item.estimated.value || 0 }} </span
                  >{{ item.estimated.unit }}人</span
                >
              </div>
              <div>
                <span>实际转移</span>
                <span
                  ><span class="NumTitle">{{ item.practical.value || 0 }}</span
                  >{{ item.practical.unit }}人</span
                >
              </div>
            </div>
          </li>
        </ul>
        <!-- 详情列表 -->
        <ul class="transferFirstDetail" v-if="showDetail">
          <div class="city">{{ detailList.cityName }}</div>
          <li v-for="(item, index) in detailList.list" :key="index">
            <div class="detailLabelContainer" :title="item.label">{{ item.label }}</div>
            <div>
              <span class="NumTitle">{{
                changgeUnit(item.affected).value || 0
              }}</span
              >{{ changgeUnit(item.affected).unit }} 人
            </div>
          </li>
        </ul>
      </el-scrollbar>
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
  name: 'PersonnelTransferContainer',
  components: {},
})
export default class PersonnelTransferContainer extends Vue {
  @Prop() private compParam: any;
  @Prop() private handleClick: any;

  private showListData: any = [];

  private showDetail: any = false;
  private detailList: any = [];

  // 弹框模板
  private popUpTemplate = new renderpopUpTemplate();

  // 接口 数据
  private async getDataByServ() {
    console.log(this.$store.state.eventPushStore.eventId, 'eventId');
    const resData = await pushDataRequestServe.getPushDataByIds(
      this.$store.state.eventPushStore.eventId ||  publishObjectPath.value.defensiveEventId,
      'personnel_transfer',
    );
    const result = this.handleResData(resData);
    console.log(result, 'resData');
    // this.getCacheData('PersonnelTransfer', result);
    return result.populationShiftsList;
  }
  //  处理 数据 格式
  private handleResData(resData: any) {
    let newResData: any = {};
    if (resData.data.content) {
      const targetJsonStr = JSON.parse(resData.data.content)[0].data;
      const targetDataObj = JSON.parse(targetJsonStr);
      newResData = targetDataObj.data;
    }
    return newResData;
  }

  //  监听
  @Watch('$store.state.eventPushStore.personnel_transfer')
  private async handleResultData() {
    this.showListData = await this.getDataByServ();
    if (this.showListData) {
      this.showListData.forEach((item: any) => {
        item.estimated = this.changgeUnit(item.estimated);
        item.practical = this.changgeUnit(item.practical);
        this.detailList = item;
      });
    }
    // this.detailList.list.forEach((item1: any) => {
    //   item1.affected = this.changgeUnit(item1.affected);
    // });
  }
  private async created() {
    await this.handleResultData();
  }
  // 获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.defensivePreparationFactory.getComponent(
      'PopulationShip',
    );
    return component;
  }

  // 地图定点回调
  private popupData(event: any) {
    event.type = 'personnel';
    const list = JSON.parse(JSON.stringify(this.showListData));
    list.forEach((res: any) => {
      if (res.cityCode === event.data.districtcode) {
        event.data = Object.assign(event.data, res);
      }
    });
    const param = {
      that: this,
      popupId: 'popup', // 监听id，必须
      moduleTypeID: 'personnel',

      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    this.popUpTemplate.getParams(param);
    this.popUpTemplate.onShowPopup(event);
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

  private mounted() {
    this.getComponent().localDistrict();
    console.log(this.compParam, 'compParam');
    if (this.compParam.nextCompParam.populationShiftsList) {
      this.showListData = this.compParam.nextCompParam.populationShiftsList;
      console.log(this.showListData, 'showListData');
      this.showListData.forEach((item: any) => {
        item.estimated = this.changgeUnit(item.estimated);
        item.practical = this.changgeUnit(item.practical);
        this.detailList = item;
      });
      this.detailList.list.forEach((item1: any) => {
        item1.affected = this.changgeUnit(item1.affected);
      });
    }
    // this.getComponent().off('defensive_data_popup', this.popupData, this);
    this.getComponent().on('defensive_data_popup', this.popupData, this);
  }
  // 展开详情列表
  private openDetail(item: any) {
    this.showDetail = true;
    this.detailList = item;
    console.log(item);
    // this.detailList.list.forEach((item1: any) => {
    //   item1.affected = this.changgeUnit(item1.affected);
    // });

    this.getComponent().locate(item.cityName);
    // 将下边的代码移到monted中
    // this.getComponent().on('defensive_data_popup', this.popupData, this);
    this.getComponent().load();
  }

  private beforeDestroy() {
    //  清除图层
    this.getComponent().removeDistrict();
    this.getComponent().off('defensive_data_popup', this.popupData, this);
    this.getComponent().unload();
  }

  // 返回一级页面
  private handleBackParent() {
    // this.getComponent().udload();
    // this.$emit("backParent");
    if (this.showDetail === true) {
      this.showDetail = false;
    } else {
      this.getComponent().removeDistrict();
      this.getComponent().off('defensive_data_popup', this.popupData, this);
      this.handleClick('DefensiveHome', JSON.parse(JSON.stringify({})));
    }
  }
}
</script>

<style lang="less" scoped>
.personTransfer {
  .nodata {
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .NumTitle {
    color: #6ae7fc;
    font-family: 'Impact';
    font-weight: 400;
    // cursor: pointer;
    // &:hover {
    //   color: #fdef4f;
    // }
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
  .transferList {
    .transferFirst {
      li {
        font-size: 26px;
        height: 80px;
        color: #d2e1ec;
        margin: 10px;
        height: 138px;
        border-radius: 2px;
        background-color: rgba(2, 39, 53, 0.25);
        border: 1px solid #1f4766;
        margin: 10px;
        cursor: pointer;
        &:hover {
          background-color: rgba(253, 244, 81, 0.1);
          border: 1px solid #fdf451;
        }
        .transferPerson {
          div {
            height: 45px;
            line-height: 45px;
            padding: 0 10px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            span {
              &:nth-child(1) {
                max-width: 50%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                // display: block;
              }
            }
            .NumTitle {
              color: #6ae7fc;
              font-family: 'Impact';
              font-weight: 400;
              cursor: pointer;
              &:hover {
                color: #fdef4f;
              }
            }

            &:nth-child(2) {
              background-color: rgba(82, 183, 234, 0.12);
            }
          }
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
      &:after {
        content: '';
        display: block;
        height: 6px;
        width: 99.4%;
        background: url('../../../../assets/img/default/panel/line.png')
          no-repeat;
        background-size: 100% 100%;
        margin: 0 auto;
      }
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
      .detailLabelContainer{
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
