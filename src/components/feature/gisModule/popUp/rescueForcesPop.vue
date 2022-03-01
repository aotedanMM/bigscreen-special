<template>
<!-- 救援队伍详情弹出框 -->
<!-- :style = "{marginTop: -popHeight + 'px'}" -->
  <div class="rescueForcesPop" v-show="isShowTeamInfo">
    <div class="popup-content" v-if="rescueTeam">
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
        </div>
        <div class="common-detailContent">
          <div class="sy-rescueForces-detailContent">
            <div class="sy-rescueForces-detailListBox box-box-box">
              <div class="sy-rescueForces-detailList">
                <div class="sy-rescueForces-detailListLeft">
                  <ul class="common-detailContent-ul" v-if="list">
                    <!-- <li
                      v-for="(item, key) in list"
                      :key="key"
                      v-if="getDataFilter(item.name)"
                    >
                      <span>
                        {{ labelObj[item.name] }}:
                        <b :title="item.value">{{ item.value }} {{ unitObj[item.name] }}</b>
                        <img
                          v-if="item.value && telobj[item.name]"
                          src="../../../../assets/img/eventInfo/telphoon.png"
                          class="allphone"
                        />
                      </span>
                    </li> -->
                    <!-- <li
                        class=""
                        v-for="item of dataFilter"
                        :key="item"
                    >
                        <span>{{ labelObj[item] }}：</span>
                        <span :title="list[item] + unitObj[item]">{{list[item]}} {{unitObj[item]}}</span>
                    </li> -->
                    <li
                        class="f-tit-h2"
                        v-for="item of dataFilter"
                        :key="item"
                        :class="list[item] && telobj[item]? 'callPhone_li': ''"
                    >
                      <span class="risk_level  fulllabel">
                          {{ labelObj[item] }}：
                      </span>
                      <span
                        :class="
                          labelObj[item] && labelObj[item].indexOf('安全风险等级') !== -1
                            ? 'enterprise_basic_right_0' + list[item]
                            : ''
                        "
                        :title="filterNumFixed(item, list, unitObj[item] || '')"
                      >
                        {{filterNumFixed(item, list, unitObj[item] || '')}}
                        <img
                                v-if="list[item] && telobj[item]"
                                src="../../../../assets/img/eventInfo/telphoon.png"
                                class="callPhoneCur principalCall"
                                @click.stop='handleClickCallup(list,list[item],$event,list.captain)'
                        />
                      </span>

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
            <div class="sy-rescueForces-equipmentNum">
              <equipmentList :rescueId='rescueId'></equipmentList>
            </div>
          </div>
          <p class="managementBtn">
            <InEventInfo :closeFunc="closeFunc" :vueThis="vueThis" v-if="data.isEventBtn" :popupData='data'></InEventInfo>
          </p>
          <div class="guihua_btn_list" v-if="isShowPathPlanningBtn">
            <span class="guihua_btn f-txt-little" style="display: inline;" @click="showPathClick()">路径规划</span>
          </div>
        </div>
        <div class="elsebtn EventHandlingBtn_elsebtn">
          <div class="EventHandlingBtn">事件处置</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Draggable } from 'draggable-vue-directive';
import popDataDeal from './dataDeal/popDataDeal';
import { dataDeal } from './dataDeal/dataDeal';
import equipmentList from '@/components/feature/gisModule/popUp/equipmentList.vue';
import InEventInfo from '@/components/feature/gisModule/popUp/btnComponent/inEventInfo.vue';
@Component({
  name: 'RescueForcesPop',
  components: {
    equipmentList,
    InEventInfo,
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
  public dataDeal: any = dataDeal;
  public popHeight: any = 0;
  private rescueTeam: boolean = true;
  private isShowTeamInfo: boolean = true; // 点击路径规划隐藏详情窗开关
  // 拖拽
  private draggableValue: any = {
    onPositionChange: this.onPosChanged,
  };
  private showPathClick() {
    const self: any = this;
    /**
     * 点击路径规划隐藏当前详情窗,
     * 当点击路径规划的返回时重新展示此弹窗
     * 路径规划关闭的时候显示弹窗  接收监听
     * */
    self.isShowTeamInfo = false;
    self.messsageBus.off('showTeamInfo');
    self.messsageBus.on('showTeamInfo', (val: boolean) => {
      self.isShowTeamInfo = val;
    });
    /**
     * 给路径规划传队伍名称
     * */
    self.pathClick({realTeamName: self.data.name});
  }
  // 进入处置关闭弹窗
  private closeFunc() {
    const self: any = this;
    self.close();
  }
  private onPosChanged(positionDiff: any, absolutePosition: any, event: any) {
    if (event.target.closest('[draggable-state]')) {
      event.target.closest('[draggable-state]').style.position = 'absolute';
    }
  }
  private calcHeight() {
    this.popHeight = $('.rescueForcesPop').innerHeight();
    this.popHeight += 40;
  }
  /*private pathClick() {
    // 路径规划
    // tslint:disable-next-line:no-debugger
    // debugger;
    /!*  this.messageBus.emit('Open_Router', {
            startPoint: this.geoPoint,
            endPoint: [120, 20],
          }); *!/
    this.pathPlanningClick(this.geoPoint);
  }*/
  /*private aroundClick() {
    // 周边分析
    // tslint:disable-next-line:no-debugger
    // debugger;
    this.aroundAnalysisClick(this.geoPoint);
  }*/
  // 数字过滤
  private filterNumFixed(key: any, list: any, unitObj: any) {
    // 这里先把现在数据和元数据进行解地址引用，这个原因不是很确定，原来的就调用了，于是我没有改动
    var resultVal: any = JSON.parse(JSON.stringify(list))[key];
    // 首先判断是不是null 或 undefined 如果是显示无 否则原来数据,有单位加单位
    if (resultVal !== null && resultVal !== undefined) {
      // 判断是不是字符串不是字符串直接往下进行字符串做去两边空格操作(有数据返回为空格许显示无)
      if (typeof resultVal === 'string') {
        resultVal = resultVal.trim() ? resultVal : '暂无数据';
      } else if (typeof resultVal === 'number') {
        resultVal = resultVal ? resultVal : '暂无数据';
      }
    } else {
      resultVal = '暂无数据';
    }
    if (resultVal !== '暂无数据') {
      resultVal = resultVal + unitObj; // 如果不是无有单位的添加单位
    }
    return resultVal;
  }
  // 打电话
  private handleClickCallup(listObj: any, val: any, event: any, name: any) {
    this.messsageBus.emit('showCallup', true, listObj, val, event, name);
  }
  private created() {
    this.rescueId = (this.data.id ? this.data.id : this.data._id );
  }

  private mounted() {
    console.log(this.data);
    // tslint:disable-next-line:no-debugger
    // debugger;
    const that: any = this;
    that.popUpType = that.type;
    this.calcHeight();
    // 应急资源 救援队伍其他类
    if (that.type.split('※')[0] === 'RescueTeam') {
      that.popUpType = 'RescueTeam※03';
    }
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
      that.telobj = dataDeal[that.popUpType].telobj ? dataDeal[that.popUpType].telobj : that.telobj;
      that.btnFilter = dataDeal[that.popUpType].btnFilter ? dataDeal[that.popUpType].btnFilter : that.btnFilter;
      dataDeal[that.popUpType].cb(that);
    } else {
      if (
        that.data &&
        that.data.attributeSet &&
        that.data.attributeSet.attributes
      ) {
        that.dataAttributes = that.data.attributeSet.attributes;
        that.getData(that.dataAttributes);
      } else {
        that.getData(that.data);
      }
    }
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
    .risk_level {
      white-space: nowrap;
    }
  .risk_level span {
    text-align: center;
    border-radius: 26px;
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
    display: inline-block;
    overflow: hidden;
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
    // position: absolute;
    // bottom: 58px;
    // right: 23px;
    height: 50px;
  }
  .guihua_btn {
    // position: absolute;
    float: right;
    cursor: pointer;
    right: 35px;
    width: 128px;
    text-align: center;
    height: 64px;
    // top: -15px;
    line-height: 64px;
    background: url('@{eventInfo}/guihua.png') no-repeat;
    background-size: 100% 100%;
  }
  .common-detailContent {
    background: url('@{eventInfo}/contentRescue.png') repeat-y;
    min-height: 320px;
  }
  .common-detailContent img.allphone {
    margin-left: 10px;
    width: 23px;
    height: 26px;
    cursor: pointer;
  }
  .common-detailContent>div {
    padding: 0 25px;
  }
  .sy-rescueForces-detailList {
    position: relative;
  }
  .common-detailContent-ul {
    width: 520px;
  }
  .common-detailContent-ul li {
    font-size: 28px;
    padding-left: 10px;
    line-height: 51px;
    width: 100%;
    box-sizing: border-box
  }
  .common-detailContent-ul .risk_level {
    color: #92edf6;
  }
  .common-detailContent-ul li:nth-child(even) {
    background:rgba(43,191,252,0.1);
  }
  .callPhone_li{
    span:nth-of-type(2){
      display: inline-block;
      vertical-align: top;
      margin-right: 15px;
    }
  }
  .common-detailContent-ul li b {
    color: #fbffff;
    padding-left: 10px;
  }
  .common-detailContent-ul li .callPhoneCur {
    cursor: pointer;
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
      z-index: 136;
      background: url('@{eventInfo}/zhoubian_icon.png') no-repeat;
      background-size: 100% 100%;
      margin-left: 10px;
    }
  }
  .managementBtn {
    position: absolute;
    right: 184px;
    bottom: -10px;
  }
}
</style>
