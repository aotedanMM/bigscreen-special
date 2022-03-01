<template>
  <!-- 火点监测 -->
  <div class="FirePointMonitorBox">
    <div class="title">
      <span class="title-panel">火点监测</span>
    </div>
    <div class="content-box">
      <!-- // 头部样式隐藏不需要延续火点 -->
      <div class="content-top" v-if="false">
        <div
          v-for="(item, index) in firePointData"
          :key="index"
          class="firePointBox"
        >
          <p class="firePointBox-num">
            <span>{{ item.num }}</span>
            <span>{{ item.unit }}</span>
          </p>
          <p class="firePointBox-text">{{ item.text }}</p>
        </div>
      </div>
      <div class="content-select">
        <div
          class="DiscussCont"
          v-for="(itemFather, index) in curcontList"
          :key="index"
          v-show="itemFather.title!=='延续火点'"
        >
          <div class="tempRight-title f-tit-h2 top-line">
            <span
              @click="addMapdot(itemFather)"
              :class="{ 'itemName-active': itemFather.active }"
               v-if="itemFather.showPopList !== 'hqxx'"
              >{{ itemFather.title }}</span
            >
            <span
              @click="addShowPop(itemFather)"
              :class="{ 'itemName-active': itemFather.title===activeShowPop }"
               v-else
              >{{ itemFather.title }}</span
            >
            <span
              class="tempRight-total"
              style="right:45px"
              @click="isShowOpenFn(itemFather)"
              v-if="itemFather.showPopList !== 'hqxx'"
            >
              <span class="f-number">{{ itemFather.sum }}</span>
              <span class="text-unit">{{ itemFather.unit }}</span>
            </span>
            <i
              :class="
                itemFather.isShowOpen
                  ? 'tempRight-switch'
                  : 'tempRight-switch tempRight-switch-reverse'
              "
              v-if="itemFather.list && itemFather.showPopList !== 'hqxx'"
              @click="isShowOpenFn(itemFather)"
            ></i>
          </div>
          <template v-if="itemFather.isShowOpen">
            <div class="team-ul fire-ul" v-if="itemFather.list"  :style="itemFather.list.length>5?'height:674px':''">
               <el-scrollbar style="height:100%;">
                    <div
                      class="team-liBox"
                      v-for="(item, indexList) of itemFather.list"
                      :key="indexList"
                    >
                      <div class="elBox">
                        <el-checkbox v-model="item.checked" @change="handleCheckedCitiesChange(item)"></el-checkbox>
                      </div>
                      <div @click="changeLi(item)" class="team-li">
                        <p class="serial">{{ indexList + 1 }}</p>
                        <div class="team-text">
                          <p class="team-textContent f-txt-com">{{ item.address }}</p>
                          <p class="team-time f-txt-com" style="display: flex;justify-content: space-between;">
                            <span>{{ item.observationDatetime }}</span>
                            <!-- <i class="el-icon-edit" ></i> -->
                            <i class="editorBtn" @click.stop="openEditorPanel(item,indexList)" :class="{'acticeBtn':indexList===acticeBtnIndex}"></i>
                          </p>
                        </div>
                      </div>
                    </div>
              </el-scrollbar>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="editorPanelBox" v-if="showEditorView">
      <i class="closeEditorPanel" @click="closeEditorPanel()"></i>
      <div class="content">
        <p>请确认该疑似火点是否为真实火点？</p>
      </div>
      <div class="btnBox">
        <div class="yes" @click="confirm()">是</div>
        <div class="no" @click="cancel()">否</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import { firePointMonitorServer } from '@/api/feature/monitorwarning/installServer';
import { getDateFormat } from '@/util/tools';
/**
 * 火点监测
 */
@Component({
  name: 'FirePointMonitor',
  components: {},
  mixins: [MapCommon],
})
export default class FirePointMonitor extends Vue {
  private checkedList: any = [];
  private firePointData: any = [
    {
      num: 0,
      unit: '点',
      text: '今日火点',
    },
    {
      num: 0,
      unit: '点',
      text: '延续火点',
    },
  ];
  // 弹框模板
  private popUpTemplate: any = new renderpopUpTemplate();
  private DiscussContKey: boolean = false;
  private showEditorView: boolean = false;
  private theCurrentId: any = ''; // 当前疑似火点点击数据
  private curcontList: any = [
    {
      title: '今日火点',
      sum: 0,
      unit: '个', // 经兴民总确认，火点单位统一为个
      active: true,
      isShowOpen: false,
      list: [],
      codeKey: '',
    },
    {
      title: '延续火点',
      sum: 0,
      unit: '个', // 经兴民总确认，火点单位统一为个
      active: true,
      isShowOpen: false,
      list: [],
      codeKey: '',
    },
    {
      title: '历史火点',
      sum: 0,
      unit: '个', // 经兴民总确认，火点单位统一为个
      active: false,
      showPopList: 'hqxx',
      isShowOpen: false,
      list: [],
      codeKey: 'histroyFire',
    },
    // {
    //   title: '火情信息',
    //   sum: 10,
    //   unit: '起',
    //   showPopList: 'hqxx',
    //   active: false,
    //   isShowOpen: false,
    //   list: [],
    //   codeKey: 'fireMessage',
    // },
  ];
  private activeShowPop: any = '';
  private acticeBtnIndex: any = -1;
  private checkedTrue: any = false;
  // 监听历史信息弹框列表显影
  @Watch('$store.state.mapTools.showFireList', { deep: true })
  private initData(val: any) {
    if (!val.isShow) {
      this.activeShowPop = '';
    }
  }
  // 确认疑似火点按钮
  private openEditorPanel(item: any, index: any) {
    this.showEditorView = true;
    this.theCurrentId = item;
    this.acticeBtnIndex = index;
  }
  // 关闭却能按钮
  private closeEditorPanel() {
    this.acticeBtnIndex = -1;
    this.showEditorView = false;
    this.theCurrentId = '';
  }
  // 确认
  private confirm() {
    this.modifyFireInformation(1);
  }
  // 否认
  private cancel() {
    this.modifyFireInformation(2);
  }
  // 选框时间
  private handleCheckedCitiesChange(item: any) {
    if (item.checked) {
      this.checkedList.push(item);
      this.getComponentFire()._showResource('firePointToday',  this.checkedList);
    } else {
      const len = this.checkedList.length;
      this.getComponentFire()._clearFirePointToday(item.id);
      for (let i = 0; i < len; i++) {
        if (this.checkedList[i].id === item.id) {
          this.checkedList.splice(i, 1);
        }
      }
    }
  }
  // 地图定点回调
  private popupData(event: any) {
    if (!event.type && event.featureType) {
      event.type = event.featureType;
      const eventType = event.featureType;
    }
    const param = {
      that: this,
      popupId: 'popup', // 监听id，必须
      moduleTypeID: 'FirePointQuery_popup',
      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    this.popUpTemplate.getParams(param);
    this.popUpTemplate.onShowPopup(event);
  }
  private isShowOpenFn(itemFather: any) {
    itemFather.isShowOpen = !itemFather.isShowOpen;
  }
  // 历史火点于历史火情按钮事件
  private addShowPop(item: any) {
    let params: any = '';
    if (this.activeShowPop === item.title) {
      this.activeShowPop = '';
      params = {
        isShow: false,
        title: item.title,
        codeKey: item.codeKey,
      };
    } else {
      this.activeShowPop = item.title;
      params = {
        isShow: true,
        title: item.title,
        codeKey: item.codeKey,
      };
    }
    this.$store.commit('mapTools/changeShowFireList', params);
  }
  // 文字点击
  private addMapdot(item: any) {
      item.active = ! item.active;
      if (item.active) {
        this.getComponentFire()._showResource('firePointToday', item.list);
      } else {
        // 清图层
        this.getComponentFire()._clear('firePointToday', item.list);
      }
  }
  // 初始化火点统计接口数据
  private async getFireStatisticsTotal() {
    const res: any = await firePointMonitorServer.getFireStatisticsTotal();
    if (res.status === 200) {
      this.firePointData[0].num = res.data.today;
      // this.firePointData[1].num = res.data.continue;
      this.curcontList[0].sum = res.data.today;
      // this.curcontList[1].sum = res.data.continue;
    }
  }
  // 今日与延续的列表数据接口
  private async getFireListPonit() {
    const res: any = await firePointMonitorServer.getFireListPonit();
    // console.log('列表数据11111',res)
    if (res.status === 200) {
      if (this.$store.state.configModel.FireContListAll.length) {
       res.data.additionalProp1.forEach((item: any, index: any) => { // 默认添加数据状体
        const isIn =  this.$store.state.configModel.FireContListAll.some((checkedItem: any) => {
          return checkedItem.id === item.id;
        });
        if (isIn) {
            item.checked = true;
            this.checkedList.push(item);
         }
        });
      } else {
        if (!this.checkedTrue) {
          res.data.today.forEach((item: any, index: any) => { // 默认添加数据状体
              item.checked = true;
              this.checkedList.push(item);
          });
        }
      }
      this.curcontList[0].list = res.data.today;
      // this.curcontList[1].list = res.data.continue;
      if (!this.checkedTrue) {
        this.getComponentFire()._showResource('firePointToday',  this.checkedList);
      }
      // this.getComponentFire()._showResource('firePointToday',  res.data.continue);
    }
  }
  private async modifyFireInformation(key: any) {
    const self = this;
    const opts = {
      sid: this.theCurrentId.id,
      sflag: key,
    };
    const res: any = await firePointMonitorServer.modifyFireInformation(opts);
    if (res.status === 200) {
      this.$message.success('修改成功');
      if (key === 2) {
        if (this.theCurrentId.checked) {
          this.getComponentFire()._clearFirePointToday(this.theCurrentId.id);
          this.checkedList.forEach((item: any, index: any) => {
            if (item.id === this.theCurrentId.id) {
                this.checkedList.splice(index, 1);
            }
          });
        }
        if (!this.checkedList.length) {
          this.checkedTrue = true;
        }
        this.$store.commit('configModel/setFireContListAll', this.checkedList);
        this.checkedList = [];
      }
      this.showEditorView = false;
      this.theCurrentId = '';
      this.acticeBtnIndex = -1;
      self.getFireListPonit();
      self.getFireStatisticsTotal();
    }
  }
  private changeLi(item: any) {
    this.getComponentFire()._addItemHight('firePointToday', item);
  }
  private created() {
    this.getFireStatisticsTotal();
    this.getFireListPonit();
  }
  private mounted() {
    this.getComponentFire().off('FirePointQuery_popup');
    this.getComponentFire().on('FirePointQuery_popup', this.popupData, this);
  }
  private beforeDestroy() {
    this.$store.commit('configModel/setFireContListAll', this.checkedList);
    console.log('>>>>>>', this.checkedList);
    this.$store.commit('mapTools/changeShowFireList', { isShow: false });
    this.getComponentFire()._clearAll();
  }
  private getComponentFire() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'ResourceQuery',
    );
    return component;
  }
}
</script>

<style lang="less">
@icons: '../../../../assets/img/gisModule/gisLayerPanel/';
.team-liBox  {
  .el-checkbox__inner {
    margin-left: 20px;
  }
  .el-checkbox {
    margin-right: 0 !important;
    margin-top: 23px;
    display: flex;
    align-items: center;
  }
  .el-checkbox__label {
    padding-left: 20px;
    font-size: 26px;
    line-height: 25px;
    color: #fff;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 334px;
  }
  .el-checkbox__inner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 0px !important;
    background: url('@{icons}checked.png') no-repeat center center;
    background-size: 100% 100%;
    &::after {
      border: 0 !important;
    }
  }
  .is-checked {
    .el-checkbox__inner {
      background: url('@{icons}checked_active.png') no-repeat center center !important;
      background-size: 100% 100%;
    }
    .el-checkbox__label {
      color: #fffabe;
    }
  }
}
</style>
<style lang="less" scoped>
@imgPath: '../../../../assets/img/flood/MonitorWarning';
@import '../../../../assets/css/decisionSupport/teamIcon.less';
@import '../../../../assets/css/decisionSupport/Statistic.half.less';
.FirePointMonitorBox {
  width: 100%;
  height: 99% !important;
  .title {
    padding-left: 20px;
    .title-panel {
      font-weight: 600;
      font-family: 'myHeiti';
      font-size: calc(20px * 1.5);
      color: #00e4ff;
      background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -1px;
      padding-right: 20px;
      font-style: italic;
    }
  }
  .content-box {
    width: 97%;
    height: 100%;
    padding: 0 10px;
    overflow: hidden;
    .content-top {
      width: 91%;
      margin-top: 10px;
      height: 103px;
      padding-left: 14px;
      background: url('@{imgPath}/popleBj.png') no-repeat center / 100% 100%;
      display: flex;
      align-items: center;
      &:hover {
        background: url('@{imgPath}/poplehover.png') no-repeat center / 100%
          100%;
      }
      .firePointBox {
        width: 50%;
        height: 100%;
        .firePointBox-num {
          display: flex;
          align-items: center;
          span {
            display: inline-block;
            &:nth-child(1) {
              font-size: calc(20px * 1.8);
              font-family: 'Impact';
              color: #fff000;
            }
            &:nth-child(2) {
              line-height: 30px;
              font-size: 22px;
              font-family: 'Impact';
              color: #daf2ff;
              margin-left: 10px;
            }
          }
        }
        .firePointBox-text {
          font-size: 26px;
          font-weight: 600;
          line-height: 46px;
        }
      }
    }
  }
  .tempRight-total {
    span {
      &:nth-child(1) {
        padding-right: 10px;
      }
    }
  }
}
* {
  margin: 0;
  padding: 0;
}
.content-select{
  padding-top: 14px;
}
.DiscussCont {
  width: 420px;
  padding-bottom: 20px;
  &:nth-child(1){
    .top-line::before{
          content: '';
          display: inline-block;
          background: url('../../../../assets/img/halfScreen/halflist/titleline.png') no-repeat;
          position: absolute;
          top: -10px;
          left: 0px;
          width: 100%;
          height: 26px;
        }
  }
  .tempRight-cont {
    .tempRight-itemNum1 {
      display: flex;
      justify-content: flex-end;
      .text-number {
        color: #3ef7fe;
        font-family: Impact;
        padding-left: 15px;
      }
    }
  }
  .text-unit {
    color: #bacfdc !important;
    font-style: normal;
  }
  .team-liBox {
    position: relative;
    height: 134px;
    .elBox{
      position: absolute;
      left: 0;
      bottom: 16px;
    }
  }
  .team-li {
    display: flex;
    background: url('@{imgPath}/textBj.png') no-repeat center / 100% 100%;
    height: 134px;
    cursor: pointer;
    .editorBtn{
      display: inline-block;
      width: 41px;
      height: 32px;
      cursor: pointer;
      background: url('../../../../assets/img/forestFire/bjk.png') no-repeat center center;
      background-size: 100% 100%;
      &.acticeBtn,     
      &:hover{
        background: url('../../../../assets/img/forestFire/bjk_hover.png') no-repeat center center;
        background-size: 100% 100%;     
      }
    }
    .serial {
      width: 45px;
      height: 27px;
      color: #fff;
      background: url('@{imgPath}/serial.png') no-repeat center / 100% 100%;
      margin: 16px 0 0 5px;
      text-align: center;
      font-size: 22px;
      font-weight: 600;
      line-height: 27px;
    }
    .team-text {
      width: 100%;
      height: calc(100% - 10px);
      margin: 10px 10px 0 5px;
      overflow: hidden;
      .team-textContent {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        height: 82px;
      }
    }
  }
}
.editorPanelBox{
position: fixed;
left: 50%;
top: 50%;
transform: translate(-50%,-50%);
width: 413px;
height: 217px;
padding: 10px 24px 10px 10px;
background: url('../../../../assets/img/forestFire/firePop.png') no-repeat center center;
background-size: 100% 100%;
.closeEditorPanel {
    display: inline-block;
    width: 36px;
    height: 35px;
    background: url('../../../../assets/img/forestFire/close.png') no-repeat center center;
    background-size: 100% 100%;
    cursor: pointer;
    margin-left:378px;
  }
.content {
  margin-top: 40px;
  p{
    width: 100%;
    text-align: center;
    font-size: 20px;
    color: #ffffff;
    font-family: "Microsoft Ya Hei";
  }
}
.btnBox{
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 45px;
  .yes,.no{
    width: 109px;
    height: 46px;
    background: url('../../../../assets/img/forestFire/btn.png') no-repeat center center;
    background-size: 100% 100%;
    font-size: 20px;
    color: #ffffff;
    font-family: "Microsoft Ya Hei";
    text-align: center;
    line-height:46px;
    cursor: pointer;
    &:hover{
      background: url('../../../../assets/img/forestFire/btn_hover.png') no-repeat center center;
      background-size: 100% 100%;     
    }
  }
  .no{
    margin-left: 16px;
  }
}
}
</style>
