<template>
  <div class="layer-panel" id="onlinePop">
    <!-- 图层 -->
    <div>
      <div class="titleTop">
        <span>在线会商终端</span>
        <!-- 在线终端快速创建会议入口 -->
        <!-- <el-button @click="openMeetingDialog">创建会议</el-button> -->
        <div class="btn">
          <i
            v-if="expanded"
            class="narrow-on"
            @click="expanded = !expanded"
          ></i>
          <i v-else class="narrow" @click="expanded = !expanded"></i>
          <i class="close" @click="closeBtn"></i>
        </div>
      </div>
      <div class="content" v-show="expanded" :class="{'noEvent':!expanded}">
        <div class="videoListBox" v-show="showImg">
          <div class="videoListBox_content">
            <div class="searchBox">
              <input
                v-model="input"
                placeholder="请输入所在位置、用户名、所在队伍进行搜索"
                @keyup.enter="search"
                maxlength="16"
              />
              <i class="searchBtn" @click="search"></i>
            </div>
            <div class="elCheckboxTwo">
              <el-scrollbar style="height: 100%;">
                <div class="allcheckedBox" v-show="showImg">
                  <p
                    :class="
                      isCheckAll ? 'activeXuankuang' : 'changtaiXuankuang'
                    "
                    @click="changeAllChecked"
                  >
                    <span class="xuankuang"></span>
                    <span class="titleWz">全部选中</span>
                  </p>
                </div>
                <div v-for="(item, index) in listData" :key="index" class="listBox">
                  <el-checkbox
                    v-model="item.checked"
                    @change="handleCheckedCitiesChange(item, index)"
                  >
                    <template>
                      <div class="contentText">
                        <p>
                          <span>用户名：</span>
                          <span :title="item.userName">{{ item.userName }}</span>
                        </p>
                        <p>
                          <span>单位：</span>
                          <span :title="item.orgName">{{ item.orgName }}</span>
                        </p>
                        <p>
                          <span>位置：</span>
                          <span :title="item.address">{{ item.address }}</span>
                        </p>
                      </div>
                    </template>
                  </el-checkbox>
                  <ul class="contentBtn">
                    <li
                      v-for="(itemTab, indexKey) in tabList"
                      :key="indexKey"
                      @click="changeTab(itemTab, indexKey, item, index)"
                      :class="[
                          indexKey === activeIndex && fatherIndex === index&&'active',!item.telnumber&&itemTab.name==='语音通话'&&'gray'
                      ]"
                    >
                      <span :class="itemTab.icon" class="iconBox"></span>
                      <span>{{ itemTab.name }}</span>
                    </li>
                  </ul>
                </div>
              </el-scrollbar>
            </div>
          </div>
        </div>
        <!-- 在线终端快速创建会议入口 -->
        <div class="onlinemeet" @click="openMeetingDialog" v-show="showImg">创建会议</div>
        <div v-show="!showImg" class="zwsj"></div>
      </div>
      <div class="bottom" v-if="expanded"></div>
    </div>
    
    <el-dialog class="meetingSetting" title="创建会议" width="36%" :visible.sync="meetingDialog" :append-to-body="true" left @close="closeMeetingDialog">
      <el-form ref="meetingForm" class="meetingForm" :model="meetingForm" :rules="meetingRules" label-width="170px">
        <el-form-item label="会议名称:" prop="title">
          <el-input v-model="meetingForm.title" autocomplete="off" placeholder="请输入会议名称" maxlength="15" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="会议ID:" prop="meetingId">
          <el-input v-model="meetingForm.meetingId" autocomplete="off" placeholder="请输入会议ID" maxlength="12" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="主持人昵称:" prop="hostName">
          <el-input v-model="meetingForm.hostName" autocomplete="off" placeholder="请输入主持人昵称" maxlength="10" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="会议时间:" prop="mettingTime">
          <el-date-picker
            popper-class="ytDateTimePicker"
            class="ytDateTimePicker"
            v-model="meetingForm.mettingTime"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
            :default-time="[startTime, endTime]"
            >
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="会议类型:">
         <el-radio-group v-model="meetingForm.type">
            <el-radio :label="1">视频会议</el-radio>
            <el-radio :label="0">语音会议</el-radio>
          </el-radio-group>
        </el-form-item> -->
          <i class="transverseLine"></i>
         <div class="btnBox">
           <span @click="closeMeetingDialog">取 消</span>
           <span class="confirm" @click="createMeet">确 定</span>
         </div>
      </el-form>
      <div slot="footer" class="dialog-footer"></div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { onlineTerminalServer } from '@/api/feature/monitorwarning/installServer';
import { Drag } from '@/components/feature/GIS/GisPlot/toDrag';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
@Component({
  name: 'OnlineTerminal',
  components: {},
})
export default class OnlineTerminal extends Vue {
  // 弹框模板
  private popUpTemplate = new renderpopUpTemplate();
  private input: any = '';
  private listData: any = [];
  private transArr: any = [];
  private checkedList: any = [];
  private activeIndex: any = -1;
  private fatherIndex: any = -1;
  private timer: any = null;
  private pickerMinDate: any = '';
  private showImg: boolean = false;
    // 缩小按钮
  private expanded: boolean = true;
  private tabList: any = [
    {
      name: '语音通话',
      icon: 'yuyintonghua',
    },
    {
      name: '视频通话',
      icon: 'shipintonghua',
    },
    {
      name: '历史轨迹',
      icon: 'lishiguiji',
    },
  ];
  private initOpts: any = {
    keyword: '',
    nowPage: 1,
    pageSize: 100,
    value: '30',
  };
  private meetingDialog: boolean = false;
  private meetingForm: any = {
    title: '',
    meetingId: '',
    hostName: '指挥中心',
    type: 1,
    mettingTime: [],
    hostId: '18000000000',
    needPassword: false,
  };
  private meetingRules = {
    title: [
      { required: true, message: '请输入会议名称', trigger: ['blur', 'change'] },
    ],
    meetingId: [
      { required: true, validator: this.validateMeetingId, trigger: ['blur', 'change'] },
    ],
    hostName: [
      { required: true, message: '请输入主持人昵称', trigger: ['blur', 'change'] },
    ],
    mettingTime: [
      { type: 'array', required: true, message: '请选择会议时间', trigger: ['blur', 'change'] },
    ],
  };
  private startTime: string = '12:00:00'; // 默认开始时间
  private endTime: string = '12:00:00'; // 默认结束时间
  private pickerOptions = {
    // onPick: ({ maxDate, minDate }: any) => {
    //   this.pickerMinDate = minDate.getTime();
    //   if (maxDate) {
    //     this.pickerMinDate = '';
    //   }
    // },
    disabledDate: (time: any) => {
      const times = Date.now();
      return time.getTime() <= times - 8.64e7;
    },
  };
  private validateMeetingId(rule: any, value: any, callback: any) {
    if (value === '') {
      return callback(new Error('请输入会议ID'));
    } else if (/\D/.test(value) || +value <= 0) {
      return callback(new Error('请输入正整数'));
    } else {
      callback();
    }
  }

  private openMeetingDialog() {
    if (!this.transArr.length) {
      this.$message({
          message: '请先选择在线终端！',
          type: 'warning',
        });
      return;
    }
    const currentDate = new Date();
    this.meetingForm.meetingId =
      currentDate.getHours().toString().padStart(2, '0') +
      currentDate.getMinutes().toString().padStart(2, '0') +
      currentDate.getSeconds().toString().padStart(2, '0');
    this.meetingForm.title = '指挥中心' + this.meetingForm.meetingId;
    this.meetingForm.mettingTime = [currentDate, new Date(+currentDate + 6 * 60 * 60 * 1000)];
    this.startTime = currentDate.toString().slice(16, 24);
    this.endTime = new Date(+currentDate + 6 * 60 * 60 * 1000).toString().slice(16, 24);
    this.meetingDialog = true;
  }
  private closeMeetingDialog() {
    (this.$refs.meetingForm as any).resetFields();
    this.meetingDialog = false;
  }
  private createMeet() {
    (this.$refs.meetingForm as any).validate((valid: boolean) => {
      if (!valid) { return; }
      this.openOnlinemeet();
      this.closeMeetingDialog();
    });
  }
  private openOnlinemeet() {
    console.log(this.transArr);
    // const personList = ['-35'];
    const config: any = {
      name: '在线会商',
      width: 1665,
      height: 825,
      left: 125,
      top: 90,
      minWidth: 690,
      minHeight: 680,
    };
    const path = `deps/OnlineConsultation/index.html?personList=${encodeURIComponent(JSON.stringify(this.transArr))}&form=${encodeURIComponent(JSON.stringify(this.meetingForm))}`;
    this.messsageBus.emit('showVideoCallBox', path, config);
  }
  private closeBtn() {
    this.messsageBus.emit('closeTerminal', false);
    this.$store.commit('mapTools/changeShowOnlyLayerPlay', { isShow: false });
  }
  private search() {
    // console.log()
    this.initOpts.keyword = this.input;
    this.initData();
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
      moduleTypeID: 'onlineTerminal',
      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    this.popUpTemplate.getParams(param);
    this.popUpTemplate.onShowPopup(event);
  }
  // 选中框事件
  private handleCheckedCitiesChange(item: any, index: any) {
    const idx = this.transArr.indexOf(item.userId);
    if (idx > -1) {
      this.transArr.splice(idx, 1);
    } else {
      this.transArr.push(item.userId);
    }
    this.getOnlineXY(item);
  }
  // 按钮事件
  private changeAllChecked() {
    if (this.isCheckAll) {
      this.clearCheckbox();
    } else {
      this.checkAll();
    }
  }
  // 全选
  private checkAll() {
    const len = this.listData.length;
    this.transArr = [];
    const userIdList: any = [];
    for (let i = 0; i < len; i++) {
      this.listData[i].checked = true;
      userIdList.push(this.listData[i].userId);
      this.checkedList.push(this.listData[i]);
      this.transArr.push(this.listData[i].userId);
    }
    // this.getOnlineXY(userIdList, true);
  }
  // 取消全选
  private clearCheckbox() {
    this.transArr = [];
    const userIdList: any = [];
    this.listData.forEach((item: any) => {
      item.checked = false;
      userIdList.push(item);
    });
    this.checkedList = [];
    // this.getOnlineXY(userIdList, false);
  }
  get isCheckAll() {
    if (this.transArr.length === this.listData.length && this.listData.length > 0) {
      return true;
    }
    return false;
  }
  /**
   * 图标点击方法
   * @param index 当前图标的index
   * @param item 当前图标数据
   * @param itemFather 当前父级所有数据
   * @param fatherIndex 当前父级的index
   */
  private changeTab(item: any, index: any, itemFather: any, fatherIndex: any) {
    this.$store.commit('mapTools/changeShowOnlyLayerPlay', { isShow: false });
    switch (item.name) {
      case '语音通话':
        this.messsageBus.emit(
          'showCallup',
          true,
          itemFather,
          itemFather.telnumber,
          {},
          itemFather.userName,
        );
        break;
      case '视频通话':
        const path = 'anyChat/index.html?id=' + itemFather.userId;
        this.messsageBus.emit('showVideoCallBox', path);
        break;
      case '历史轨迹':
        this.getHistoricalRoute(itemFather.userId);
        break;
      default:
        break;
    }
    if (
      index === 2 &&
      index === this.activeIndex &&
      fatherIndex === this.fatherIndex
    ) {
      this.activeIndex = '';
      this.$store.commit('mapTools/changeShowOnlyLayerPlay', { isShow: false });
    } else {
      this.activeIndex = index;
    }
    this.fatherIndex = fatherIndex;
  }
  // 初始化列表数据
  private async initData() {
    const res: any = await onlineTerminalServer.getOnlineStationsList(
      this.initOpts,
    );
    const userIdList: any = [];
    if (res.data.list && res.data.list.length > 0) {
      res.data.list.forEach((item: any) => {
        item.checked = false;
        userIdList.push(item.userId);
      });
      // 初始话点位上图
      this.getOnlineXY(userIdList, true);
    } else {
      // 清除所有图层
        const itemList: any = [];
        this.getComponent().showResource(itemList);
    }
    this.listData = res.data.list;
    if (res.data.list.length > 0) {
      this.showImg = true;
    }
      // 同步选中信息 是列表栏选中
    if (this.checkedList.length > 0) {
      const len = this.checkedList.length;
      const lenTwo = this.listData.length;
      for (let i = 0; i < len; i++) {
        const checkedId = this.checkedList[i].userId;
        for (let j = 0; j < lenTwo; j++) {
          const checkedIdTwo = this.listData[j].userId;
          if (checkedId === checkedIdTwo) {
            this.listData[j].checked = true;
          }
        }
      }
    }
  }
// 获取经纬度
private async getOnlineXY(item: any, falg?: any) {
    if (item && item.length) {
      if (falg) {
        clearInterval(this.timer);
        const res: any = await onlineTerminalServer.getOnlineXY(item);
        if (!res.data || !res.data.length) {
          return;
        }
        // 传数组给gis
        this.getComponent().showResource(res.data, true);
         // 定时刷新数据
        this.timer = setInterval(() => {
            this.initData();
          }, 5000);
      } else {
        // 传数组给gis
        const itemList: any = [];
        // this.getComponent().showResource(itemList);
      }
    } else {
      const list: any = [];
      if (item.checked) {
        this.listData.forEach((item2: any) => {
            if (item2.checked) {
              list.push(item2.userId);
              // 选中的数据
              this.checkedList.push(item2);
            }
        });
        const res: any = await onlineTerminalServer.getOnlineXY(list);
        if (!res.data) {
          return;
        }
        // 传数组给gis
        // this.getComponent().showResource(res.data, true);
        // this.getComponent().locatePoint('id', item.userId);
      } else {
        // console.log()
        this.fatherIndex = -1;
        this.activeIndex = -1;
        const idx = this.checkedList.indexOf(item.userId);
        this.checkedList.splice(idx, 1);
        // 传数组给gis
        const itemList: any = [];
        this.listData.forEach((item2: any) => {
            if (!item2.checked) {
              itemList.push(item2);
            }
        });
        // this.getComponent().showResource(itemList, true);
      }
    }
  }
  // 历史轨迹接口
  private async getHistoricalRoute(id: any) {
    const playParams = {
      isShow: true,
      param: {
        id,
      },
    };
    // this.getComponent().showHistoryTrack(opts);
    this.$store.commit('mapTools/changeShowOnlyLayerPlay', playParams);
  }
  private created() {
    this.initData();
    // 视频通话挂断监听
    this.messsageBus.on('closeVideoCallBox', (data: any) => {
      this.activeIndex = -1;
      this.fatherIndex = -1;
    });
    // 语音通话挂断监听
    this.messsageBus.on('showCallup', (data: any) => {
      if (!data) {
        this.activeIndex = -1;
        this.fatherIndex = -1;
      }
    });
    // 定时刷新数据
    this.timer = setInterval(() => {
        this.initData();
      }, 5000);
  }
  private mounted() {
    // const eMapPanelDrag: any = new Drag('#onlinePop', '.titleTop', {
    //   container: '.layoutMain',
    // });
    // eMapPanelDrag.toDrag();
    this.getComponent().load();
    this.getComponent().on('TerminalLayer_popup', this.popupData, this);
  }
  private beforeDestroy() {
    clearInterval(this.timer);
    this.getComponent().off('TerminalLayer_popup', this.popupData, this);
    this.getComponent().unload();
    this.$store.commit('mapTools/changeShowOnlyLayerPlay', { isShow: false });
    this.checkedList = [];
  }
  //  获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'terminalLayer',
    );
    return component;
  }
}
</script>
<style lang="less">
@imgPath: '../../../../assets/img/gisModule/PopulationFeverBox';
  .meetingSetting {
    * {
      box-sizing: border-box;
    }
    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
      color: #606266;
    }
    input:-moz-placeholder, textarea:-moz-placeholder {
      color: #606266;
    }
    input::-moz-placeholder, textarea::-moz-placeholder {
      color: #606266;
    }
    input:-ms-input-placeholder, textarea:-ms-input-placeholder {
      color: #606266;
    }
    .el-dialog {
      background: transparent;
      box-shadow: none;
    }
    .el-dialog__body {
      background: url('@{imgPath}/centerBg.png') no-repeat;
      background-size: 100% 100%;
      width: 100%;
      padding-bottom: 0px;
      padding-top: 40px;
    }
    .el-dialog__header {
      background: url('@{imgPath}/topbg.png') no-repeat;
      background-size: 100% 100%;
      padding: 29px 45px 16px;
      width: 100%;
      .el-dialog__title {
        font-weight: 600;
        font-family: 'myHeiti';
        font-size: calc(20px * 1.2);
        color: 00e4ff;
        background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    .el-dialog__headerbtn {
      background: url('@{imgPath}/closeBtn.png') no-repeat;
      background-size: 100% 100%;
      width: 92px;
      height: 52px;
      background-size: 100% 100%;
      right: 7px;
      top: 3px;
      &:hover {
        background: url('@{imgPath}/closeHover.png') no-repeat;
        background-size: 100% 100%;
        color: transparent;
      }
      .el-dialog__close {
        display: none;
        &:hover {
          color: transparent;
        }
      }
    }
    .el-dialog__footer {
      background: url('@{imgPath}/botBg-.png') no-repeat;
      background-size: 100% 100%;
      width: 100%;
      height: 38px;
      padding: 35px 20px 20px;
    }
  }
  .meetingForm {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      margin-bottom: 35px;
      padding: 0 30px 0 16px;
      box-sizing: border-box;
      width: 100%;
      .el-form-item__label {
        font-size: 26px;
        color: #92edf6;
        &::before {
          content: '';
          display: none;
        }
      }
      .el-form-item__content {
        .el-input {
          width: calc(100% - 20px);
          font-size: 24px;
          color: #606266;
          .el-input__suffix {
            color: #c4d8da;
            .el-input__count {
              font-size: 24px;
              color: #c4d8da;
              .el-input__count-inner {
                background: none;
              }
            }
          }
          .el-input__inner {
            color: #c4d8da;
            border: none;
            background: url('@{imgPath}/input-bg.png') no-repeat;
            background-size: 100% 100%;
          }
        }
        .el-date-editor {
          width: calc(100% - 20px);
          border: none;
          background: url('@{imgPath}/input-bg.png') no-repeat;
          background-size: 100% 100%;
          input {
            background: transparent;
          }
        }
        &::after {
          content: '*';
          position: absolute;
          top: 0;
          right: 4px;
          color: #F56C6C;
          margin-left: 5px;
        }
      }
      .el-date-editor {
        width: 100%;
      }
    }
    .transverseLine {
      margin-top: 60px;
      margin-bottom: 35px;
      width: 100%;
      height: 1px;
      background-image: url('@{imgPath}/transverseLine.png');
      background-size: 100% 100%;
    }
    .btnBox {
      display: flex;
      justify-content: flex-end;
      padding: 0 50px;
      width: 100%;
      height: 44px;
      >span {
        width: 110px;
        height: 44px;
        text-align: center;
        color: #a0f4fd;
        font-size: 20px;
        line-height: 44px;
        background-color: transparent;
        border: none;
        cursor: pointer;
        &:hover {
          color: #fffabe;
        }
      }
      .confirm {
        margin-left: 20px;
        background-image: url('@{imgPath}/confirm-bg.png');
        background-size: 100% 100%;
        &:hover {
          color: #fffabe;
          background-image: url('@{imgPath}/confirm-hover.png');
          background-size: 100% 100%;
        }
      }
    }
    
  }
</style>
<style lang="less">
// @imgUrl: "../../../../assets/img/jyImgCollect/";
@icons: "../../../../assets/img/gisModule/gisLayerPanel/";
.elCheckboxTwo {
  .el-checkbox__inner {
    margin-left: 20px;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #cee6ea;
  }
  .el-checkbox {
    margin-right: 0 !important;
    display: flex;
  }
  .el-checkbox__label {
    padding-left: 20px;
    font-size: 26px;
    line-height: 25px;
    color: #cee6ea;
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
    background: url("@{icons}checked.png") no-repeat center center;
    background-size: 100% 100%;
    &::after {
      border: 0 !important;
    }
  }
  .is-checked {
    .el-checkbox__inner {
      background: url("@{icons}checked_active.png") no-repeat center center !important;
      background-size: 100% 100%;
    }
    .el-checkbox__label {
      color: #fffabe;
    }
  }
}
// 分页样式
.pagingBox {
  width: 100%;
  margin-top: 10px;
  text-align: center;
  .el-pagination.is-background .el-pager li.more {
    background-color: transparent;
    color: #ddfdfc;
    margin: 0px;
  }
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li.number {
    background-color: transparent;
    background: url("@{icons}page-bg.png") no-repeat center center / 100% 100%;
    width: 41px;
    height: 36px;
    font-size: 12px;
    letter-spacing: 1px;
    line-height: 36px;
    color: #ddfdfc;
    margin: 0px;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: transparent;
    color: #fff;
    background: url("@{icons}fy_btnactive.png") no-repeat center center / 80%
      94%;
  }
  .el-pagination__total {
    line-height: 36px !important;
    color: #fff !important;
  }
}
</style>
<style lang="less" scoped>
@url: "../../../../assets/img/gisModule/PopulationFeverBox";
@btn: "../../../../assets/img/gisPlot";
@icon: "../../../../assets/img/gisModule/gisLayerPanel";
@icons: "../../../../assets/img/gisModule/gisLayerPanel/";
.zwsj{
  width: 165px;
  height: 163px;
  margin: auto;
  margin-top: 179px;
  background: url('../../../../assets/img/default/panel/noData.png') no-repeat center center;
  background-size: 100% 100%;
}
.layer-panel {
  width: 480px;
  // position: absolute;
  // top: 100px;
  // right: 20px;
  // z-index: 20;
  .titleTop {
    position: relative;
    padding: 10px 40px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 30px;
    font-weight: 600;
    height: 70px;
    background: url('@{url}/topbg-.png') no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
    span {
      display: block;
      width: 340px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
      -webkit-background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
      text-fill-color: transparent;
    }
    .btn {
      position: absolute;
      display: flex;
      top: 5px;
      right: 0;
      .narrow {
        position: absolute;
        right: 68px;
        width: 68px;
        height: 48px;
        cursor: pointer;
        background: url('@{btn}/eventAndTopics_down_normal.png') no-repeat
          center / 100% 100%;
        &:hover {
          top: 1px;
          background: url('@{btn}/eventAndTopics_down_highlight.png') no-repeat
            center / 100% 100%;
        }
      }
      .narrow-on {
        position: absolute;
        right: 68px;
        width: 68px;
        height: 48px;
        cursor: pointer;
        background: url('@{btn}/eventAndTopics_up_normal.png') no-repeat center /
          100% 100%;
        &:hover {
          top: 1px;
          background: url('@{btn}/eventAndTopics_up_highlight.png') no-repeat
            center / 100% 100%;
        }
      }
      .close {
        position: absolute;
        right: 0;
        width: 68px;
        height: 48px;
        cursor: pointer;
        background: url('@{btn}/eventAndTopics_close_normal.png') no-repeat
          center / 100% 100%;
        &:hover {
          top: 1px;
          background: url('@{btn}/eventAndTopics_close_highlight.png') no-repeat
            center / 100% 100%;
        }
      }
    }
  }
  .content {
    height: 540px;
    padding: 10px 0px 10px 0px;
    // box-sizing: border-box;
    background: url('@{url}/centerBg.png') no-repeat;
    background-size: 100% 100%;
    .el-scrollbar {
      height: 450px;
      color: #fff;
    }
    .videoListBox {
      .videoListBox_content {
        .searchBox {
          width: 428px;
          margin-left: 25px;
          height: 40px;
          position: relative;
          margin-top: 10px;
          border-radius: 2px;
          background-color: rgba(118, 242, 251, 0.16862745098039217);
          border: 1px solid #76f2fb;
          input {
            width: 352px;
            height: 100%;
            border: none;
            background: transparent;
            font-size: 22px;
            padding-left: 10px;
            line-height: 42px;
            color: #c4d8da;
            font-family: "Microsoft Ya Hei";
            outline: none;
          }
          .searchBtn {
            position: absolute;
            right: 0;
            top: 2px;
            display: inline-block;
            height: 41px;
            width: 34px;
            // background: url(../../../../assets/img/nav/searchIcon.png) no-repeat;
            // background-size: 100% 100%;
            // position: absolute;
            // right: 3.5%;
            // top: 25%;
            background: url(../../../../assets/img/nav/searchIcon.png) no-repeat
              50% 50%;
            cursor: pointer;
          }
        }
        .elCheckboxTwo {
          height: 430px;
          overflow: hidden;
          width: 428px !important;
          margin-left: 30px;
          width: 100%;
          .allcheckedBox {
            cursor: pointer;
          }
          .changtaiXuankuang {
            width: 100%;
            display: flex;
            align-items: center;
            padding-left: 20px;
            margin-top: 14px;
            .xuankuang {
              display: inline-block;
              width: 18px;
              height: 18px;
              background: url("@{icons}checked.png") no-repeat center center;
              background-size: 100% 100%;
            }
            .titleWz {
              font-size: 26px;
              line-height: 45px;
              color: #fff;
              font-family: "Microsoft Ya Hei";
              margin-left: 18px;
            }
          }
          .activeXuankuang {
            width: 100%;
            display: flex;
            align-items: center;
            height: 45px;
            padding-left: 20px;
            margin-top: 14px;
            .xuankuang {
              display: inline-block;
              width: 18px;
              height: 18px;
              background: url("@{icons}checked_active.png") no-repeat center
                center !important;
              background-size: 100% 100%;
            }
            .titleWz {
              font-size: 26px;
              line-height: 45px;
              color: #92edf6;
              font-family: "Microsoft Ya Hei";
              margin-left: 18px;
            }
          }
          .listBox {
            margin-top: 10px;
            padding: 14px 0;
            background: url("@{icon}/bjk.png") no-repeat center center / 100%
              100%;
            .contentBtn {
              display: flex;
              align-items: center;
              margin-top: 16px;
              padding: 0 6px;
              li {
                width: 150px;
                height: 46px;
                background: url("@{url}/tabBj.png") no-repeat center center /
                  100% 100%;
                line-height: 46px;
                font-size: 22px;
                color: #cee6ea;
                display: flex;
                align-items: center;
                cursor: pointer;
                &.active {
                  width: 138px;
                  margin-left: 12px;
                  background: url("@{url}/tabBjactive.png") no-repeat center
                    center / 100% 100%;
                  .iconBox {
                    display: inline-block;
                    margin-left: 0px;
                    &.yuyintonghua {
                      width: 32px;
                      height: 39px;
                      background: url("@{url}/vicoeactive.png") no-repeat center
                        center / 100% 100%;
                    }
                    &.shipintonghua {
                      width: 36px;
                      height: 36px;
                      background: url("@{url}/videoactive.png") no-repeat center
                        center / 100% 100%;
                    }
                    &.lishiguiji {
                      width: 35px;
                      height: 35px;
                      background: url("@{url}/llishiactive.png") no-repeat
                        center center / 100% 100%;
                    }
                  }
                  span {
                    &:nth-child(2) {
                      margin-left: 0px;
                    }
                  }
                }
                .iconBox {
                  display: inline-block;
                  margin-left: 20px;
                  &.yuyintonghua {
                    width: 16px;
                    height: 23px;
                    background: url("@{url}/vicoe.png") no-repeat center center /
                      100% 100%;
                  }
                  &.shipintonghua {
                    width: 20px;
                    height: 20px;
                    background: url("@{url}/video.png") no-repeat center center /
                      100% 100%;
                  }
                  &.lishiguiji {
                    width: 19px;
                    height: 19px;
                    background: url("@{url}/llishi.png") no-repeat center center /
                      100% 100%;
                  }
                }
                span {
                  &:nth-child(2) {
                    margin-left: 6px;
                  }
                }
              }
            }
          }
          .contentText {
            p {
              display: flex;
              align-items: center;
              &:nth-child(1) {
                margin-top: -10px;
              }
              span {
                display: inline-block;
                line-height: 45px;
                font-size: 26px;
                &:nth-child(1) {
                  color: #92edf6;
                  font-family: "Microsoft Ya Hei";
                }
                &:nth-child(2) {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  width: 310px;
                  color: #cee6ea;
                }
              }
            }
          }
        }
      }
    }
    .onlinemeet {
      margin-left: 300px;
      padding-left: 10px;
      width: 150px;
      height: 46px;
      background: url("@{url}/tabBj.png") no-repeat center center /
        100% 100%;
      line-height: 46px;
      font-size: 22px;
      color: #cee6ea;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
  .bottom {
    width: 100%;
    height: 49px;
    background: url('@{url}/botBg-.png') no-repeat;
    background-size: 100% 100%
  }
  .border {
    margin-left: 13px;
    width: 474px;
    height: 2px;
    background: #143c5c;
  }

  .hwsx-as-prop {
    position: absolute;
    right: 15px;
    width: 470px;
    top: 567px;
    color: #fff;
    // z-index: 2;
  }
  .noEvent{
    height: 0;
  }
}
</style>
