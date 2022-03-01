<template>
<!-- :style = "{marginTop: -popHeight + 'px'}" -->
  <div class="eventInfoPop expert" :class="{commonInfoPop:otherDialog}" >
    <input id="eventPopdata" type="hidden" :value="data" />
    <div class="eventInfoPop_title">
      <div class="eventInfoPop_title_txt" :title="name">{{ name }}</div>
      <div class="eventInfoPop_title_close" @click="close()"></div>
    </div>
    <div class="eventInfoPop_content">
      <geologyHidden :rescueData="rescueData" v-if="popUpType === 'BAS_GEOLOGICHAZARD※01'"></geologyHidden>
      <dangerSource :rescueData="rescueData" v-if="popUpType === 'majordanger'"></dangerSource>
      <otherPop :rescueData="rescueData" v-if="otherDialog"></otherPop>
      <housePop :rescueData="rescueData" v-if="houseDialog"></housePop>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IEventinfo } from '@/interface/feature/earthquake/Eventinfo.interface';
import { Draggable } from 'draggable-vue-directive';
import popDataDeal from './dataDeal/popDataDeal';
import { dataDeal } from './dataDeal/dataDeal';
// import equipmentList from '@/components/feature/gisModule/popUp/equipmentList.vue';
import geologyHidden from '@/components/feature/gisModule/popUp/geologyHidden.vue';
import dangerSource from '@/components/feature/gisModule/popUp/dangerSource.vue';
import otherPop from '@/components/feature/gisModule/popUp/otherPop.vue';
import housePop from '@/components/feature/gisModule/popUp/housePop.vue';
@Component({
  name: 'searchCommonPop',
  components: {
    geologyHidden,
    dangerSource,
    otherPop,
    housePop,
  },
  mixins: [popDataDeal],
  directives: {
    Draggable,
  },
})
export default class SearchCommonPop extends Vue {
  public name: any = '暂无标题';
  public styles: any = {};
  public popUpType: any;
  public geometry: any;
  public coordinates: any;
  public geoPoint: any = [];
  public dataObj: any;
  public list: [] = [];
  public dataAttributes: any;
  public dataChild: any;
  public dataTag: any;
  public rescueData: any;
  public popHeight: any = 0;

  private otherDialog: boolean = false;
  private houseDialog: boolean = false;

  // 拖拽
  private draggableValue: any = {
    onPositionChange: this.onPosChanged,
  };
  private onPosChanged(positionDiff: any, absolutePosition: any, event: any) {
    if (event.target.closest('[draggable-state]')) {
      event.target.closest('[draggable-state]').style.position = 'absolute';
    }
  }
  private pathClick() {
    // 路径规划
    // tslint:disable-next-line:no-debugger
    // debugger;
    this.pathPlanningClick(this.geoPoint);
  }
  private aroundClick() {
    // 周边分析
    // tslint:disable-next-line:no-debugger
    // debugger;
    this.aroundAnalysisClick(this.geoPoint);
  }
  private created() {
    const that: any = this;
    //   判断房屋结构
    if (that.type === 'house_struc_type') {
      that.rescueData = that.event.renderData;
    } else {
      that.rescueData = that.data;
    }
  }
  private calcHeight() {
    // this.popHeight = $('.eventInfoPop.expert').innerHeight();
    // this.popHeight += 40;
    this.popHeight = 416;
  }
  private mounted() {
    // tslint:disable-next-line:no-debugger
    // debugger;
    this.calcHeight();
    const that: any = this;
    that.popUpType = that.type;
    // 显示一线简略弹窗
    switch (that.popUpType) {
      case 'tunnel※01':
      case 'portwharf':
      case 'Nuclearinfo※01':
      case 'powerplant※01':
      case 'government':
      case 'development※01':
        that.otherDialog = true;
        break;
      case 'house_struc_type': // 房屋结构
        this.houseDialog = true;
        this.name = that.data.COUNTRYNAME;
        break;
    }

    that.setGeomPoint(); // 设置当前点位经纬度给geoPoint
    /*  that.geometry = that.data && that.data.geometry ? that.data.geometry : [];
    that.coordinates = that.data && that.data.geom && that.data.geom.coordinates ? that.data.geom.coordinates : [];
    that.geoPoint = that.geometry ? [that.geometry.x, that.geometry.y] : [];
    that.geoPoint = that.coordinates ? that.coordinates : []; */
    if (that.styleObj) {
      that.styles = that.styleObj;
    }
    if (that.getPathTypeFilter(that.popUpType)) {
      that.isShowPathPlanning();
    }
    if (that.getAroundTypeFilter(that.popUpType)) {
      that.isShowAroundAnalysis();
    }

    if (dataDeal[that.popUpType]) {
      that.unitObj = dataDeal[that.popUpType].unitObj;
      that.dataFilter = dataDeal[that.popUpType].dataFilter;
      that.labelObj = dataDeal[that.popUpType].labelObj;
      dataDeal[that.popUpType].cb(that);
    } else {
      // tslint:disable-next-line:no-debugger
      // debugger;
      // console.log(that.data.attributeSet);
      if (
        that.data &&
        that.data.attributeSet &&
        that.data.attributeSet.attributes
      ) {
        that.dataAttributes = that.data.attributeSet.attributes;
        that.getData();
      } else if (
        that.data &&
        that.popUpType &&
        that.popUpType === 'disaster_sta_feature_type'
      ) {
        that.dataChild = that.data;
        that.getDataChild();
      } else if (that.data) {
        that.dataTag = that.data;
        that.getDataTag();
      }
    }
  }
}
</script>
<style lang="less" scoped>
@url: "../../../../assets/img/eventInfo";
.eventInfoPop {
  cursor: default !important;
  // min-width: 760px;
  width:410px;
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  background: rgba(7, 25, 65, 0.8);
  border-radius: 1px;
  box-shadow: 0 0 15px #071941;
  color: #fff;
  // position: absolute;
  // bottom: 0;
  // margin-bottom: -250px;
  // margin-left: -380px;
  // left: 0;
  padding-bottom: 10px;
  z-index: 1;
  &_title {
    background: url("@{url}/title.png") no-repeat center / 100% 100%;
    height: 60px;
    line-height: 65px;
    display: flex;
    align-items: center;
    font-size: 28px;
    color: #fff;
    &::before {
      content: "";
      width: 54px;
      height: 54px;
      background: url("@{url}/dotdefault.png") no-repeat center / 100% 100%;
      flex-shrink: 0;
    }
    &_close {
      background: url("@{url}/maptooltipclose.png") no-repeat center / 100% 100%;
      width: 15px;
      height: 14px;
      cursor: pointer;
      flex-shrink: 0;
      position: absolute;
      right: 20px;
    }
    &_txt {
      color: #fff;
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 24px;
      white-space: nowrap;
      width: 300px;
      font-weight: normal;
      height: 55px;
      line-height: 55px;
    }
  }
  &_content {
    padding: 0 15px 15px 15px;
    ul {
      position: relative;
      max-height: 350px;
      li {
        font-size: 28px;
        width: 92%;
        margin-top: 10px;
        line-height: 40px;
        span {
          white-space: nowrap;
          color: #0edbe4;
          text-align: left;
          b {
            white-space: pre-wrap;
            line-height: 36px;
            color: #fff;
            display: inline;
            min-width: 300px;
            font-weight: normal;
          }
        }
        .pathPlanning,
        .aroundAnalysis {
          display: block;
          float: right;
          border: solid 1px #02e9d5;
          color: white;
          padding: 0 5px;
          margin-left: 10px;
          margin-top: 10px;
          font-size: 28px;
          line-height: 40px;
          cursor: pointer;
        }
      }
    }
  }
}
.commonInfoPop {
  min-width: 400px;
  background: rgba(7, 25, 65, 0.8);
}
</style>
<style lang="less">
.el-scrollbar__wrap {
  margin-bottom: 0 !important;
}
</style>
