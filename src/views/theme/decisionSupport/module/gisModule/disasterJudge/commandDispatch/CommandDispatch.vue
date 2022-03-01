
<template>
<div>
  <div class="minimize-position" v-show="!isShow" @click="btnShow"></div>
    <div class="commandDispatch-box"  v-show="isShow">
      <div class="commandDispatch popupPanelRight_bg">
        <div class="commandDispatch_hd">
          <h2 class="commandDispatch_hd_tit">指挥调度</h2>
          <span class="commandDispatch_hd_total">
            设备总数：
            <strong>{{listDataTotal}}</strong>个
          </span>
          
          <div class="closeNarrowBg">
            <span class="commandDispatch_hd_close"  @click="closeDialog"></span>
            <span class="commandDispatch_hd_narrow" @click="narrowDialog"></span>
          </div>
        </div>
        <div class="commandDispatch_bd">
          <div class="commandDispatch_cnt">
            <div class="commandDispatch_cnt_tab">
              <ul class="commandDispatch_cnt_tab_nav">
                <li
                  :data-new="item.receive ?'A' : 'B' "
                  :class="[(tabCur === index)?'cur ':'',' li-item']"
                  v-for="(item,index) in listData"
                  :key="index"
                  @click="commandClick(item,index,true)"
                  v-if="item.type != 4 "
                >
                  <span class="title">{{item.name}}</span>
                  <i class="number">({{item.count}})</i>
                </li>
                <!-- <li class="li-item"><span class="title">天通终端</span><i class="number">(23)</i></li>
              <li class="li-item"><span class="title">视频回传</span><i class="number">(23)</i></li>
              <li class="li-item"><span class="title">短波台</span><i class="number">(23)</i></li>
              <li class="li-item"><span class="title">消防车辆</span><i class="number">(23)</i></li>
                <li class="li-item"><span class="title">消防<br/>移动终端</span><i class="number">(23)</i></li>-->
              </ul>
              <section class="commandDispatch_cnt_tab_cnt">
                <component :is="componentsList" :currentObj="currentObj"></component>
                <!-- <slot name="BeidouTerminal"></slot>
              <slot name="TiantongTerminal"></slot>
              <slot name="videoReturn"></slot>
              <slot name="shortwaveStation"></slot>
              <slot name="fireFightingVehicles"></slot>
                <slot name="fireMobileTerminal"></slot>-->
              </section>
            </div>
            <div class="commandDispatch_cnt_info">
              <!-- 默认显示 -->
              <component :is="componentsInfo" v-show="infoMark" :currentCurrent="currentCurrent"></component>

              <!-- 真实显示  -->
              <component :is="componentsAll" v-if="!infoMark" :currentChildObj="currentChildObj"></component>
              <!-- <slot></slot>
          <slot name="BeidouTerminal_info"></slot>
          <slot name="TiantongTerminal_info"></slot>
          <slot name="videoReturn_info"></slot>
          <slot name="shortwaveStation_info"></slot>
          <slot name="fireFightingVehicles_info"></slot>
              <slot name="fireMobileTerminal_info"></slot>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
// 对应的组件

import BeidouTerminal from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/commandDispatch/listTables/BeidouTerminal.vue';
import TiantongTerminal from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/commandDispatch/listTables/TiantongTerminal.vue';
import VideoReturn from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/commandDispatch/listTables/VideoReturn.vue';
import ShortwaveStation from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/commandDispatch/listTables/ShortwaveSta.vue';
import FireFightingVehicles from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/commandDispatch/listTables/FireFightingVehicle.vue';
import FireMobileTer from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/commandDispatch/listTables/FireMobileTer.vue';

import DispatchInfoDefault from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/commandDispatch/details/DispatchInfoDefault.vue';
import BeidouTerminalInfo from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/commandDispatch/details/BeidouTerminalInfo.vue';
import FireFightingVehiclesInfo from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/commandDispatch/details/FireFightingVehiclesInfo.vue';
import FireMobileTerminalInfo from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/commandDispatch/details/FireMobileTerminalInfo.vue';
import TiantongTerminalInfo from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/commandDispatch/details/TiantongTerminalInfo.vue';
import VideoReturnInfo from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/commandDispatch/details/VideoReturnInfo.vue';

import { communicationServer } from '@/api/installServer';

@Component({
  name: 'CommandDispatchView',
  components: {
    BeidouTerminal,
    TiantongTerminal,
    VideoReturn,
    ShortwaveStation,
    FireFightingVehicles,
    FireMobileTer,
    DispatchInfoDefault,
    BeidouTerminalInfo,
    FireFightingVehiclesInfo,
    FireMobileTerminalInfo,
    TiantongTerminalInfo,
    VideoReturnInfo,
  },
})
export default class CommandDispatchView extends Vue {
  private isShow = true;
  private isShowDialog = false;

  // 测试数据

  private testData: any = {
    point: [116.35, 39.87],
    radius: 300, // 单位千米
    startTime: '2018-12-12 12:12:12',
    endTime: '2019-12-30 12:12:12',
  };
  // 对应显示的key
  private infoMark = true;

  // 上方列表 动态组件名
  private componentsList: any = '';
  // 下方具体的详情
  private componentsInfo: any = '';
  private tabCur: number = 0;

  // 实时短报文，字段 ;
  private loopNum: any;

  // 每个当前组件传递的对应(列表)

  private currentObj: any = {};

  // 实时短报文

  private currentCurrent: any = {};

  // 每个当前传的详情的值

  private currentChildObj: any = {};

  // 与后端相匹配的字段
  // 目前，只能根据type 进行判定
  private filexed: any = {
    // type = 1 时 "北斗终端"
    1: {
      type: 1,
      listBig: 'BeidouTerminal',
      contentList: 'BeidouTerminalInfo',
      emitType: 'EmitBeidouTerminal', // 此处先留出来，可能后续要用到。
      resutlData: 'beidou', // 后端返回的data的key
      flag: 'getShortMessageById', // 进行之后默认有请求,true为有，false 则为没有
    },
    // type  = 2 时 , "天通终端"
    2: {
      type: 2,
      listBig: 'TiantongTerminal',
      contentList: 'TiantongTerminalInfo',
      emitType: 'EmitTiantongTerminal',
      resutlData: 'tiantong', // 后端返回的data的key
      flag: false, // 进行之后默认有请求,true为有，false 则为没有
    },
    // type  = 3 时 , "视频回传"
    3: {
      type: 3,
      listBig: 'videoReturn',
      contentList: 'VideoReturnInfo',
      emitType: 'EmitVideoReturn',
      resutlData: 'app',
      flag: 'getAttachments', // 进行之后默认有请求,true为有，false 则为没有
    },
    // type  = 4 时 , "短波台"
    4: {
      type: 4,
      listBig: 'ShortwaveStation',
      contentList: 'DispatchInfoDefault', // 没有。显示默认
      emitType: 'EmitShortwaveStation',
      resutlData: '', // 为空，则为data.data
      flag: false, // 进行之后默认有请求,true为有，false 则为没有
    },
    // type  = 5 时 , "消防车辆"
    5: {
      type: 5,
      listBig: 'FireFightingVehicles',
      contentList: 'FireFightingVehiclesInfo',
      emitType: 'EmitFireFightingVehicles',
      resutlData: 'xiafangche',
      flag: false, // 进行之后默认有请求,true为有，false 则为没有
    },
    // type  = 6 时 , "消防移动终端"
    6: {
      type: 6,
      listBig: 'FireMobileTer',
      contentList: 'FireMobileTerminalInfo',
      emitType: 'EmitFireMobileTerminal',
      resutlData: 'xiaofangren',
      flag: false, // 进行之后默认有请求,true为有，false 则为没有
    },
  };

  private listData: any = [];

  private listDataTotal: any = 0;

  private numberTotal: any = 0;
  public mounted() {
    this.getComponent().load();
    this.getComponent().on('mapclick', this.mapClick, this);
    const opts = {
      point: [
        this.$store.state.eventPushStore.eventLocation.EventLon,
        this.$store.state.eventPushStore.eventLocation.EventLat,
      ],
      radius: 300 * 1000,
    };
    this.getComponent().fitToExtent(opts);
  }

  // GIS
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'commandDispatch',
    );
    return component;
  }

  // 地图图标点击的回调
  private mapClick(event: any) {
    //
    const temp = 'gis_' + this.filexed[event.type].emitType;
    this.messsageBus.emit(temp, event.data);
  }

  // 列表的
  private getListData() {
    const opt = {
      point: [
        this.$store.state.eventPushStore.eventLocation.EventLon,
        this.$store.state.eventPushStore.eventLocation.EventLat,
      ],
      radius: 300,
    };
    communicationServer.getTerminalCount(opt).then((data: any) => {

      this.listData = data.data;
      this.getTotalData();
      // 初始化
      this.commandClick(this.listData[this.tabCur], this.tabCur, false);
    });
  }
  // 方法返回到默认页面
  private returnDefault(key: any) {
    const tempkey = 'small_' + key;
    this.messsageBus.off(tempkey);
    this.messsageBus.on(tempkey, () => {
      this.infoMark = true;
    });
    this.toPathPlan() ;
  }
  // 得到每一项的数据
  private getItmeData(opt: any, currentItem: any) {
    communicationServer
      .getTerminalList(opt)
      .then((data: any) => {
        if (currentItem.resutlData) {
          this.currentObj.resultData = data.data[currentItem.resutlData];
        } else {
          // 没有下方，直接 返回
          this.infoMark = true;
          this.currentObj.resultData = data.data;
        }
        this.componentsList = currentItem.listBig;
        // 监听对应的key 触发数据
        this.getInfoDataEvent(currentItem);
        // 地图展示
        if (this.numberTotal === 0) {
          this.getComponent().addResource({
            type: currentItem.type,
            list: this.currentObj.resultData,
            autoPan: false,
          });
        } else {
          // this.getComponent().addResource({
          //   type: currentItem.type,
          //   list: this.currentObj.resultData,
          //   autoPan: false,
          // });
        }
      })
      .catch(() => {
        this.currentObj.resultData = [];
        this.componentsList = currentItem.listBig;
      });
  }
  // 监听 对应的 key
  private getInfoDataEvent(currentItem: any) {
    this.messsageBus.off(currentItem.emitType);
    this.messsageBus.on(
      currentItem.emitType,
      (data: any, key: string, userid: any) => {
        const opt = {
          id: data,
          type: currentItem.type,
        };

        // 重置下属性
        this.currentChildObj = {
          defaultData: '',
          data: '',
          type: currentItem.type,
          emitType: currentItem.emitType,
        };
        // this.currentChildObj.defaultData = '' ;
        // this.currentChildObj.data = '' ;
        // this.currentChildObj.type = currentItem.type ;
        if (currentItem.flag) {
          // 有二个请求的方法 getShortMessageById
          this[currentItem.flag](opt, currentItem, userid);
        } else {
          // 统一调详情的方法
          this.getInfoData(opt, currentItem);
        }
        // 地图弹框
        this.getComponent().locate(opt.type, key, opt.id);
        // 绑定子模块的方法返回到默认页面
        this.returnDefault(currentItem.emitType);
        this.toPathPlan() ;
      },
    );
  }

  // 根据id获取短报文
  private getShortMessageById(opt: any, currentItem: any, userid?: any) {
    const opts = {
      startTime: '2018-12-12 12:12:12',
      endTime: '2019-12-30 12:12:12',
      // startTime: this.$moment()
      //   .subtract(1, 'days')
      //   .format('YYYY-MM-DD hh:mm:ss'),
      // endTime: this.$moment().format('YYYY-MM-DD hh:mm:ss'),
      id: opt.id,
    };
    communicationServer
      .getShortMessageById(opts)
      .then((data: any) => {
        this.currentChildObj.defaultData = data.data;
        this.getInfoData(opt, currentItem);
      })
      .catch((err: any) => {
        this.currentChildObj.defaultData = [];
        this.getInfoData(opt, currentItem);
      });
  }

  // 根据id获取 附件

  private getAttachments(opt: any, currentItem: any, userid?: any) {
    const opts = {
      userid,
    };
    communicationServer
      .getAttachments(opts)
      .then((data: any) => {
        this.currentChildObj.defaultData = data.data;
        this.getInfoData(opt, currentItem);
      })
      .catch((err: any) => {
        this.currentChildObj.defaultData = [];
        this.getInfoData(opt, currentItem);
      });
  }

  // 得到每一个的data
  private getInfoData(opt: any, currentItem: any) {
    communicationServer.getTerminalById(opt).then((data: any) => {
      this.currentChildObj.data = data.data;
      this.componentsAll = currentItem.contentList;
      this.infoMark = false;
    });
    this.currentChildObj.tmpeDat = new Date();
  }

  // 列表的方法
  private commandClick(item: any, idx: number, falg: any) {
    this.tabCur = idx;

    const currentItem = this.filexed[item.type];
    // 默认显示的
    if (this.tabCur === 0) {
      this.componentsInfo = 'DispatchInfoDefault';
    }
    // 每组件要的对象数据
    this.currentObj = {
      emitType: currentItem.emitType,
    };
    // 写死的数据
    // const itemData = this.testData;
    const itemData: any = {
      point: [
        this.$store.state.eventPushStore.eventLocation.EventLon,
        this.$store.state.eventPushStore.eventLocation.EventLat,
      ],
      radius: 300,
      startTime: '2018-12-12 12:12:12',
      endTime: '2019-12-30 12:12:12',
      // startTime: this.$moment().subtract(1, 'days').format('YYYY-MM-DD hh:mm:ss'),
      // endTime:  this.$moment().format('YYYY-MM-DD hh:mm:ss'),
    };
    itemData.type = item.type;
    itemData.type = item.type;
    // 判定是从列表点的，还是自动点的
    if (falg) {
      this.infoMark = true;
      this.numberTotal = 0;
      this.toPathPlan() ;
    }
    //  if (itemData.type == item.type ){
    //    this.infoMark = true
    // }
    // const itemData = {
    //   point : [this.$store.state.eventPushStore.eventLocation.EventLon,this.$store.state.eventPushStore.eventLocation.EventLat],
    //   radius : this.$store.state.eventPushStore.eventLocation.radius || 300,
    //   type : item.type,
    //   startTime: '2018-12-12 12:12:12',
    //   endTime: '2019-12-30 12:12:12',
    // };
    // 得到每一项里面的数据
    this.getItmeData(itemData, currentItem);
  }

  // 得到设计总数的方法
  private getTotalData() {
    let total = 0;
    this.listData.forEach((item: any) => {
      if (item.type !== '4') {
        total += item.count;
      }
    });
    this.listDataTotal = total;
  }
  private narrowDialog() {
    this.isShow = false;
  }
  private btnShow() {
  this.isShow = true;
  }

  private closeDialog() {
    this.isShow = false;
  }
  private openDialog() {
    this.isShow = true;
  }

  // 得到短报文
  private getCurrentData() {
    const opts = {
      pageNo: 1,
      pageSize: 5,
      startTime: '2018-12-12 12:12:12',
      endTime: '2019-12-30 12:12:12',
      // startTime: this.$moment()
      //   .subtract(1, 'days')
      //   .format('YYYY-MM-DD hh:mm:ss'),
      // endTime: this.$moment().format('YYYY-MM-DD hh:mm:ss'),
    };
    communicationServer
      .getShortMessage(opts)
      .then((data: any) => {
        if (data.success || data.data) {
          this.currentCurrent = data.data.list;
        }
      })
      .catch((err: any) => {
        this.currentChildObj.defaultData = [];
      });
  }
  // 点击时，显示对应的短报文 详情
  private getCurrentInfo() {
    // 目前与绑定beidouTerminalInfog 里面绑定
    this.messsageBus.on('sendChangeItem', (data: any) => {
      // 目前先写死 (目前与列表上传的key不一样)
      this.messsageBus.emit('EmitBeidouTerminal', data.souceAddr, 'souceAddr');
      // 为1的时候，不调用更新的方法
      if (data.receive !== '1') {
        this.updateReceive(data.id);
      }
    });
    // 从列表更新短报文
    this.messsageBus.on('sendShortUpdate', (data: any) => {
      // 目前先写死 (目前与列表上传的key不一样)
      if (data.receive !== '1') {
        this.updateReceive(data.id);
      }
    });
    // 从列表更新视频知报文
    this.messsageBus.on('sendShortUpdateVideo', (data: any) => {
      if (data.receive !== '1') {
        this.updateReceiveVideo(data.userid);
      }
    });
  }
  // 更新状态的视频已读方法 请求

  private updateReceiveVideo(id: any) {
    communicationServer
      .updateVedioStatus({
        id,
      })
      .then((data: any) => {
        // 更新成功
        console.log(data);
      });
  }
  // 更新状态短报文的方法 请求
  private updateReceive(id: string) {
    communicationServer
      .updateShortMessageStatus({
        id,
      })
      .then((data: any) => {
        // 更新成功
        console.log(data);
      });
  }
  // 轮缓的方法
  private loopFun() {
    this.loopNum = setInterval(() => {
      this.numberTotal++;
      this.getCurrentData();
      this.getListData();
    }, 3000);
  }

  private beforeDestroy() {
    this.getComponent().off('mapclick', this.mapClick, this);
    this.getComponent().unload();
    // 清空轮循环
    // this.loopNum = null ;
    clearInterval(this.loopNum);
    // 清除路径规则
    this.toPathPlan();
  }
  private toPathPlan() {
    // 调用路径规划方法
    this.messsageBus.emit('Close_Router', null);
  }
  private created() {
    this.getListData();
    this.messsageBus.on('openDialog', (data: any) => {
      this.openDialog();
    });
    this.messsageBus.on('closeDialog', (data: any) => {
      this.closeDialog();
    });
    this.getCurrentData();
    this.loopFun();
    this.getCurrentInfo();
  }
}
</script>
<style lang="less" scoped>
@districtDialogImg: '../../../../../../../assets/img/gisModule/districtDialog';
@commandDispatchImg: '../../../../../../../assets/img/CommandDispatch';
.commandDispatch-box {
  width:100%;
  height:100%;
}
.commandDispatch_bg {
  // background: url('@{districtDialogImg}/team_bg.png') no-repeat 50% 50%;
  background-size: 100% 100%;
}
.commandDispatch {
  width: 100%;
  height: 990px;
  padding: 20px 35px 50px;
  box-sizing: border-box;
  &_hd {
    height: 65px;
    line-height: 65px;
    padding-left: 50px;
    white-space: nowrap;
    &_tit {
      margin: 0;
      padding: 0;
      display: inline-block;
      font-size: 30px;
      color: #fda100;
      font-weight: bold;
      padding-right: 30px;
    }
    &_total {
      display: inline-block;
      font-size: 22px;
      color: #dafbff;
    }
    &_close {
      cursor: pointer;
      width: 40px;
      height: 40px;
      position: absolute;
      right: -2px;
      top: -2px;
    }
    &_narrow{
      cursor: pointer;
      width: 40px;
      height: 40px;
      position: absolute;
      right: 45px;
      top: -2px;
    }
  }

  &_bd {
    height: calc(100% - 65px);
    padding-top: 10px;
    box-sizing: border-box;
  }
  &_cnt {
    height: 100%;
    &_tab {
      height: 50%;
      &_nav {
        float: left;
        width: 185px;
        margin: 0;
        padding: 0;
        display: flex;
        list-style: none;
        flex-direction: column;
        height: 100%;

        & .li-item {
          margin: 0;
          padding: 0;
          text-align: center;
          background: url('@{commandDispatchImg}/button_01.png') no-repeat 50%
            50%;
          background-size: 100% 100%;
          color: #fff;
          cursor: pointer;
          &.cur,
          &:hover {
            background-image: url('@{commandDispatchImg}/buttton_active_01.png');
          }
          &:last-child {
            // height: 81px;
            .title {
              display: inline-block;
              // line-height: 1.3;
              // padding-top: 5px;
              text-align: center;
            }
          }
        }
        .title {
          font-size: 26px;
          line-height: 60px;
        }
        .number {
          font-style: normal;
          font-size:22px;
        }
      }
      &_cnt {
        margin-left: calc(185px + 15px);
        height: 100%;
      }
    }
    &_info {
      background: url('@{commandDispatchImg}/llight_bg.png') no-repeat 50% -30px;
      padding-top: 30px;
      height: 50%;
      box-sizing: border-box;
    }
    .commandDispatch_cnt_tab_nav li.li-item[data-new='A']::after {
      content: ' ';
      width: 16px;
      height: 16px;
      background-color: red;
      border-radius: 50%;
      float: right;
    }
  }
}
.closeNarrowBg{
    position: absolute;
    width: 98px;
    height: 52px;
    right: 20px;
    top: 16px;
    cursor: pointer;
    background: url('@{commandDispatchImg}/panleClosenarrow.png') no-repeat center /
        100% 100%;
    background-size: 100% 100%;
}
  .minimize-position{
    position:absolute;
    top:964px!important;
    left:890px;
    z-index:9999;  
    width: 110px;
    height: 36px;
    // background: url('@{commonPath}/toMinifyBtn.png') no-repeat 0 0;
    cursor:pointer;
  }
</style>
