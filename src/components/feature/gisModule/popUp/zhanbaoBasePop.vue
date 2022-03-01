<template>
<!-- :style = "{marginTop: -popHeight + 'px'}" -->
  <div class="rescueForcesPop" >
    <div class="popup-content" >
      <div
        class="sy-rescueForces-detailContainer common-detailContainer"
        id="sy-rescueForces-detail-container"
      >
        <div class="sy-rescueForces-detailTitle title-title-title">
          <span :title="name" class="title-title-title-content">{{
            name
          }}</span>
          <a
            href="javascript:;"
            class="detail-container-close close_guihua_dialong"
            name="detailclose"
            @click="close()"
          ></a>
          <!-- <div class="guihua_btn_list">
            <span
              class="guihua_btn f-txt-little"
              v-if="isShowPathPlanningBtn"
              @click="pathClick()"
              >路径规划</span
            >
          </div> -->
        </div>
        <div class="common-detailContent">
          <el-scrollbar wrap-style="height:100%;max-height: 450px;">
            <div class="sy-rescueForces-detailContent">
              <div class="sy-rescueForces-detailListBox box-box-box">
                <div class="sy-rescueForces-detailList">
                  <div class="sy-rescueForces-detailListLeft">
                    <ul class="common-detailContent-ul" v-if="list">
                      <li
                        class="f-tit-h2"
                        v-for="(item, key) in list"
                        :key="key"
                      >
                        <label class="risk_level fulllabel"    v-if="getDataFilter(item.name)">
                          {{ labelObj[item.name] }}:
                          <span :title="item.value">
                            {{ item.value }} {{unitObj[item.name]}}
                            <img
                              v-if="item.value && telobj[item.name]"
                              src="../../../../assets/img/eventInfo/telphoon.png"
                              class="allphone"
                              @click.stop='handleClickCallup(list,item.value,$event)'
                            />
                          </span>
                        </label>
                      </li>
                    </ul>
                  </div>
                  <div
                    class="sy-rescueForces-detailListRight"
                    style="display: none;"
                  >
                    <p>
                      距离事发地距离：
                      <span>无</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="sy-rescueForces-equipmentNum" v-if="tableFlag">
                <zhanbaoBaseList :rescueId='rescueId'></zhanbaoBaseList>
                <!--  titleBox headObj widthObj dataObj tableData -->
              </div>
              <div class="sy-rescueForces-equipmentTableBox">
                <ul id="sy-rescueteam-equipmentlist"></ul>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { messsageBus } from '@/util/message';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { rescueTeamServer } from '@/api/installServer';
import { getDateFormat } from '@/util/tools';
import { Draggable } from 'draggable-vue-directive';
import popDataDeal from './dataDeal/popDataDeal';
import { dataDeal } from './dataDeal/dataDeal';
import zhanbaoBaseList from '@/components/feature/gisModule/popUp/zhanbaoBaseList.vue';
@Component({
  name: 'RescueForcesPop',
  components: {
    zhanbaoBaseList,
  },
  mixins: [popDataDeal],
  directives: {
    Draggable,
  },
})
export default class RescueForcesPop extends Vue {
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
  public rescueId: any;
  public popHeight: any = 0;
  public tableFlag: boolean = true;

  private rescueTeam: boolean = true;
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
    /*  this.messageBus.emit('Open_Router', {
            startPoint: this.geoPoint,
            endPoint: [120, 20],
          }); */
    this.pathPlanningClick(this.geoPoint);
  }
  private aroundClick() {
    this.aroundAnalysisClick(this.geoPoint);
  }
  // 打电话
  private handleClickCallup(listObj: any, val: any, event: any) {
    this.messsageBus.emit('showCallup', true, listObj, val, event);
  }
  private created() {
    this.rescueId = this.data.id ? this.data.id : this.data._id;
  }
  private calcHeight() {
    this.popHeight = $('.rescueForcesPop').innerHeight();
    this.popHeight += 40;
  }
  private mounted() {
    // tslint:disable-next-line:no-debugger
    const that: any = this;
    that.popUpType = that.type;
    this.calcHeight();
    // 救援装备 没有表格的 transportationteam（救援队） equipment（矿山装备）
    if (that.type.split('※')[0] === 'v_equipment') {
      that.popUpType = that.type.split('※')[0];
      this.tableFlag  = false;
    }
    /* if (that.type.split('※')[0] === 'RescueTeam') {
      that.popUpType = that.type.split('※')[0];
      this.tableFlag  = true;
    } */
    that.setGeomPoint(); // 设置当前点位经纬度给geoPoint
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
      that.popHeight = dataDeal[that.popUpType].popHeight;
      that.unitObj = dataDeal[that.popUpType].unitObj;
      that.dataFilter = dataDeal[that.popUpType].dataFilter;
      that.labelObj = dataDeal[that.popUpType].labelObj;
      dataDeal[that.popUpType].cb(that);
    } else {
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
    this.list.map((ele: any) => {
      if (!ele.value || ele.value === null) {
        ele.value = '暂无数据';
      }
    });

  }
}
</script>
<style lang="less" scoped>
@eventInfo: '../../../../assets/img/eventInfo';
@url: '../../../../assets/img/halfScreen/eventAndTopics';
em, i, b, strong {
  font-weight: normal;
  font-style: normal;
}
.rescueForcesPop {
  // margin-left: -293px;
  position: relative;
  a,
  a:link {
    color: #333;
    text-decoration: none;
  }
  a {
    background-color: transparent;
  }
  ul {
    margin: 0;
    padding: 0;
  }
  ul,
  li {
    list-style: none;
  }
  .popup-content {
    color: #fff;
    font-size: 20px;
  }
  .common-detailContainer::after {
    content: '';
    height: 44px;
    width: 569px;
    background: url('@{eventInfo}/footRescue.png') no-repeat;
    display: block;
}
  /*等级*/
  .risk_level span {
    text-align: center;
    border-radius: 26px;
    padding: 0px 8px;
    color: #fff;
  }
  .title-title-title {
    // width: 569px;
    height: 71px;
    line-height: 90px;
    background: url('@{eventInfo}/headRescue.png') no-repeat;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-left: 36px;
  }
  .title-title-title-content {
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 450px;
    font-weight: 600;
    font-family: 'myHeiti';
    font-size: calc(20px * 1.5);
    color: 00e4ff;
    background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -1px;
  }
  .detail-container-close {
    position: absolute;
    right: -4px;
    top: 1px;
    width: 90px;
    height: 48px;
    background: url('@{url}/eventAndTopics_close.png') no-repeat 0 0;
    cursor: pointer;
    &:hover{
      background-image: url('@{url}/eventAndTopics_close_h.png');
    }
  }
  .guihua_btn_list {
    position: absolute;
    bottom: 56px;
    right: 23px;
  }
  .guihua_btn {
    position: absolute;
    cursor: pointer;
    right: 35px;
    width: 128px;
    text-align: center;
    height: 64px;
    top: -15px;
    line-height: 64px;
    background: url('@{eventInfo}/guihua.png') no-repeat;
    background-size: 100% 100%;
  }
  .common-detailContent {
    width: 547px;
    background: url('@{eventInfo}/contentRescue.png') repeat-y;
    min-height: 320px;
    max-height: 450px;
    padding-right: 25px;
  }
  .common-detailContent img.allphone {
    margin-left: 10px;
    width: 23px;
    height: 26px;
    cursor: pointer;
  }
  .common-detailContent>div {
    padding: 0 25px;
    padding-right: 0px;
  }
  .sy-rescueForces-detailList {
    position: relative;
  }
  .common-detailContent-ul {
    width: 520px;
  }
  .common-detailContent-ul li {
    width: 100%;
    color: #92edf6;
    font-size: 28px;
    padding-left: 10px;
    line-height: 51px;
    display: flex;
  }
  .common-detailContent-ul li:nth-child(even) {
    background:rgba(43,191,252,0.1);
  }
  .common-detailContent-ul li b {
    color: #fbffff;
    padding-left: 10px;
  }
  .sy-rescueForces-detailListRight {
    position: absolute;
    top: 0;
    left: 340px;
    width: 320px;
    height: 44px;
    line-height: 44px;
    text-align: center;
  }
  .sy-rescueForces-detailListRight p {
    margin: 0;
    padding-left: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .sy-rescueForces-equipmentNum {
    font-size: 30px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 48px;
    letter-spacing: 0px;
    color: #ffffff;
  }
  .guihua_btn:hover {
    background: url('@{eventInfo}/guihua_hover.png') no-repeat;
    background-size: 100% 100%;
  }
  .elsebtn {
    position: absolute;
    right: 172px;
    bottom: 23px;
    display: none;
    div {
      width: 103px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
      font-size: 16px;
      font-family: "Microsoft YaHei";
      color: rgb( 132, 246, 255 );
      text-transform: uppercase;
      // -moz-transform: matrix( 1,0,0,1.00091157702826,0,0);
      // -webkit-transform: matrix( 1,0,0,1.00091157702826,0,0);
      // -ms-transform: matrix( 1,0,0,1.00091157702826,0,0);
      z-index: 136;
      background: url('@{eventInfo}/zhoubian_icon.png') no-repeat;
      background-size: 100% 100%;
      margin-left: 10px;
    }
  }
}
</style>
<style lang="less">
.el-scrollbar__bar.is-horizontal {
  display: none;
}
</style>
