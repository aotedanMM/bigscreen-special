<!-- 16比9 head部分事件列表与专题选择 新develop -->
<template>
    <div>
      <span class="gisScreenBtn-box_btn--back" @click="CkNormalBehavior()" v-show="this.$store.state.eventPushStore.eventId"></span>
      <div class="eventAndTopics_hd">

        <div class="eventAndTopics_hd_tmp">
          <el-select  class="csmMySelect-noBg"  style="width:123px;" :disabled="(this.$route ? this.$route.query.topicChangable : null)==='false'"
          v-model="eventType" placeholder="选择专题" @change="selectEventTypeVal" @click.native="clickSelect">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
              <span style="display:block;padding:0 30px">
              <span class="eventTypeSelecticon" :class="'eventTypeSelecticon_'+item.icon"></span>
             <!-- <img :src="'../../../assets/img/halfScreen/eventAndTopics/'+item.icon+'.png'"  /> -->
              <span>{{item.label}}</span></span>
            </el-option>
          </el-select>
        </div>
      <!-- <div class="eventAndTopics_hd_text"  @click.stop ="toShowcollectionList" ><span class="f-txt-com">事件收藏</span> </div> -->
      <div class="eventAndTopics_hd_text" @click.stop="toShow"><span class="f-txt-com">事件列表</span> </div>
      </div>
      <!-- <div class="eventAndTopics_bd" v-show="isShowcollectionList">
        <span class="eventAndTopics_bd_close" style="color:red;" @click.stop="isShowcollectionList=false"> </span>
        <el-tabs class="csmMyTabs" v-model="collectiontabCur" stretch>
          <el-tab-pane label="收藏夹" v-if="isShowcollectionList" name="first">
              <EventContainer :modulename='collection' />
          </el-tab-pane>
        </el-tabs>
      </div> -->

      <div class="eventAndTopics_bd" v-show="isShow">
        <span class="eventAndTopics_bd_close" style="color:red;" @click.stop="toShow"> </span>
        <el-tabs class="csmMyTabs" v-model="tabCur" stretch @tab-click="tabCurhandle">
          <el-tab-pane :label="reportType" name="first">
            <!-- <el-scrollbar class="cmp-scrollbar-y" wrap-style="height:calc(100% - 320px)"> -->
            <!-- <div style="height:700px;overflow-y:auto;"> -->
              <EventContainer :modulename='infolistleft' />
            <!-- </div> -->
            <!-- </el-scrollbar> -->
          </el-tab-pane>
          <el-tab-pane :label="tworeportType" name="second" v-if = "isEarthquake">
            <!-- <el-scrollbar class="cmp-scrollbar-y" wrap-style="height:calc(100% - 320px)"> -->
             <!-- <Rendless type="eventList" v-slot="{data}">
                <EventinfoList v-model="isShow"  :list="data" />
              </Rendless> -->
            <!-- </el-scrollbar> -->
            <component :is='secondTabPanelCompName' :isShow='isShow'></component>
          </el-tab-pane>

          
        </el-tabs>

      </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop , Watch} from 'vue-property-decorator';
import PanelView from '@/views/theme/decisionSupport/common/PanelView.vue';
import EventContainer from '@/views/theme/decisionSupport/module/normalLeft/eventContainer.vue';
// import Rendless from '@/components/common/rander/Rendless.vue';
// import EventinfoList from '@/components/feature/earthquake/eventinfolist/EventinfoList.vue';
import EventConfigRegistry from '@/util/eventConfigRegistry';
import EarthquakeReport from '@/components/feature/earthquakeReport/earthquakeReport.vue';
import FirePointTopics from '@/components/feature/firePoint/FirePoint.vue';
import EventFavorites from '@/components/feature/eventFavorites/EventFavorites.vue';
import TyphoonInfoContainer from '@/components/feature/typhoonInfo/TyphoonInfoContainer.vue';
import MapCommon from '@/util/MapCommon';
import eventConfigRegistry from '@/util/eventConfigRegistry';
@Component({
  name: 'EventAndTopics',
  mixins: [MapCommon],
  components: {
    PanelView,
    TyphoonInfoContainer,
    // Rendless,
    EventContainer, // 事件信息
    // EventinfoList, // 地震速报
    EarthquakeReport, // 地震速报
    FirePointTopics, // 火点
    EventFavorites, // 收藏夹
  },
})
export default class EventAndTopics extends Vue {
  private collection: string = 'collection';
  private infolistleft: string = 'infolistleft';
  private reportType: string = '全部接报';
  private tworeportType: string = '地震速报';   // 火点信息
  private isEarthquake: boolean = true;
  private typecodestr: any = [];
  private tabCur: string = 'first';
  private collectiontabCur: string = 'first';
  private eventType: any = '';
  private eventStatus: any = ' ';
  private isShow = false;
  private isShowcollectionList: boolean = false;
  private secondTabPanelCompName = 'EarthquakeReport';
  private themeCode: any = '';
  //   {
  //   value: 'dangerousChemicalTradeAccident',
  //   label: '安全生产专题',
  //   disabled: false,
  //   icon: 'whzt',
  // },
  private options = [
     {
    value: 'common',
    label: '全部事件',
    disabled: false,
    icon: 'tyzh',
  }, {
    value: 'earthQuake',
    label: '地震专题',
    disabled: false,
    icon: 'dzzh',
  },
  {
    value: 'forestFire',
    label: '森火专题',
    disabled: false,
    icon: 'shzt',
  },
  {
    value: 'flood',
    label: '防汛专题',
    disabled: false,
    icon: 'fxzt',
  },
  {
    value: 'other',
    label: '其他事件',
    disabled: false,
    icon: 'tyzh',
  }];

  private reportTypeList = [
    {
      value: ['common'],
      lable: '全部接报',
      key: '全部事件',
      // typecode: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '16', '17', '18', '19', '20', '21'],
      typecode: [],
    },
    {
      value: ['earthQuake'],
      lable: '地震接报',
      key: '地震专题',
      typecode: ['1'],
    },
    // {
    //   value: ['dangerousChemicalTradeAccident', 'colliery', 'noncoalMine'],
    //   lable: '安全生产接报',
    //   key: '安全生产专题',
    //   typecode: ['2', '4', '5'],
    // },
    {
      value: ['forestFire', 'caoyuanhuozai'],
      key: '森火专题',
      lable: '森火接报',
      typecode: ['9', '11'],
    },
    {
      value: ['flood', 'dizhizaihai', 'typhoon', 'rainstorm', 'nishiliu', 'huapo', 'yansehu', 'shuikukuiba', 'neilao', 'shuikuzhongda', 'difangzhongda', 'lingxun', 'shanhong'],
      key: '防汛专题',
      lable: '汛情接报',
      typecode: ['24', '10', '16', '17', '18', '20', '21', '25', '26', '27', '28'],
    },
    {
      value: ['other'],
      key: '其他事件',
      lable: '其他事件',
      typecode: ['0', '2', '4', '5', '6', '7', '12', '13'],
    },
  ];

  @Watch('$store.state.eventPushStore.eventLocation.EventType')
  private updataEventType() {
    this.eventStatus = this.$store.state.eventPushStore.eventId;
    const eventType = this.$store.state.eventPushStore.eventLocation.EventType; // 这个是事件类型
    const typeMapResult = EventConfigRegistry.getEventByEventType(eventType).speciaTopicKey; // 这个是拿到事件的专题标志
    // EventConfigRegistry.getEventDictMap();
    // this.init();

    // 当前选择专题这里已经展示洪涝，又进入了洪涝的其他灾种，这里应该是不变的。
    if (this.eventType === typeMapResult) { // 这里的this.eventType是专题名
      return ;
    }
    if (!this.eventStatus ) {
        this.eventType = this.eventType  || 'common'; // 各专题首页时，要进入专题的那个常态
        // this.isShow = true;
    } else {
      // 如果从配置文件中根据事件类型拿到了例如火灾，但是在option中没有，则显示通用。
      // const isHasFlag =  this.options.findIndex((oitem: any , oindex: any) => {
      //   return oitem.value === typeMapResult;
      // });
      // this.eventType = isHasFlag === (-1) ? 'common' : typeMapResult;
      let zhuantilable: any;
      this.reportTypeList.forEach((element: any) => {
        element.value.forEach((oitem: any) => {
            if (oitem === typeMapResult) {
              zhuantilable = element.key;
              return;
            }
        });
      });

      this.options.forEach((item: any) => {
        if (zhuantilable === item.label) {
          this.eventType = item.value;
          return;
        }
      });
      this.getreportType(this.eventType, false);
      // this.isShow = false;
    }
  }
  @Watch('$store.state.eventPushStore.eventId')
  private updataShowState() {
    // 非常态该面板隐藏
    this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {EventlistPanel: {showFlag: false}});
    this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {EventCollection: {showFlag: false}});
  }
  // private init() {
  //   if (!this.eventStatus ) {
  //       this.eventType = 'normal';
  //   } else {
  //     if ( this.eventType === '地震灾害') {
  //       this.eventType = 'earthQuake';
  //     } else {
  //         this.eventType = 'common';
  //     }
  //   }
  // }

  // 收藏列表点击事件
  // private toShowcollectionList() {
  //   this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {EventlistPanel: {showFlag: false}}); // 事件信息面板隐藏
  //   this.isShowcollectionList = !this.isShowcollectionList;
  //   if (this.isShowcollectionList) {
  //     this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {EventCollection: {showFlag: true}});
  //   } else {
  //     this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {EventCollection: {showFlag: false}});
  //   }
  // }

  // tab 切换  森火专题问题
  private tabCurhandle(val: any) {
    if (this.reportType === '森火接报' && this.tabCur === 'second') {
      this.messsageBus.emit('firepointmodule', true);
    }
  }


  // 获取接报的名字 clickFlag ,代表是否是由用户主动点击选择专题
  private getreportType(val: string, clickFlag: boolean) {
    this.$store.commit('earthQuake/setEarthQuakeIntensityData', {});
    this.reportTypeList.forEach((element: any) => {
      element.value.forEach((oitem: any) => {
        if (oitem === val) {
          this.reportType = element.lable;
          this.typecodestr = element.typecode;
          this.eventType = oitem;
          this.upateMap();
        }
      });
    });
    if (this.reportType === '全部接报' || this.reportType === '地震接报') {
      this.isEarthquake = true;
      this.tworeportType = '地震速报';
      this.secondTabPanelCompName = 'EarthquakeReport';
    } else if (this.reportType === '森火接报') {
      this.tabCur = 'first';
      this.isEarthquake = false;
      this.tworeportType = '火点信息';
      this.secondTabPanelCompName = 'FirePointTopics';
    } else if (this.reportType === '汛情接报') {
      // this.tabCur = 'first';
      // this.isEarthquake = true;
      // this.tworeportType = '台风信息';
      // this.secondTabPanelCompName = 'TyphoonInfoContainer';
      this.tabCur = 'first';
      this.isEarthquake = false;
      this.secondTabPanelCompName = '';
    } else {
      this.tabCur = 'first';
      this.isEarthquake = false;
      this.secondTabPanelCompName = '';
    }
    const topicConf = EventConfigRegistry.getTopicByTopicKey(val);
    if ( clickFlag && topicConf && topicConf.jsonPath) {
      EventConfigRegistry.setTopicConfig(val); // 专题常态
      this.$store.commit('configModel/setConfig', EventConfigRegistry.config);
      const dataObj = { // 字段是可以变得，先写这些
            curLocationKey: '', // 表明当前是定位还是推送 send_location：定位   NEW_POPULATIONFEVE：推送
            EventLat: '', // 纬度
            EventAddr: '', // 地点,北京市大观园
            EventLon: '', // 经度
            EventLatLonStr: '', // 经纬度拼起来的串，给地图监听用。主要用作推送屏点定位的时候，地图进行重定位。
            radius: '', // 影响经验圈 '5,10,20,50'
            EqLevel: '', // 7.5
            EventDesc: '', // "2020年03月08日00时56分,北京市大观园发生重大火灾(此信息为测试数据)"
            EventLevel: '', // "严重"
            EventTime: '', // "2020年03月08日00时56分"
            EventTimes: '', // "2020-03-08 00:56:14"
            EventTit: '', // "11·24演习"
            EventType: '', // "6"
            EventIcon: '', // 增加一个全局的事件处置id
            Pushofsupportscreen: '', // 判断是否是支撑屏推送过来的
            // eventid: "8a808b9c70a9016a0170b5e4d11f0be1"
            /*inEventInfoPopup: { // 这里是为了储存安全生产进入处置后详情窗的信息, 为了展示详情窗 在StudtToolHalf.vue 的mounted里面
              popupData: null, // 安全生产专题 危化品出详情窗版
              popupType: '',
            },*/
        };
      this.$store.commit('eventPushStore/eventInfoAll', dataObj);
    }
    this.$store.commit('eventInfoType/seeventInfoType', this.typecodestr); // 更改类型
    // 根据json配置控制是否显示图层按钮
    if (this.$store.state.configModel.config.LayerPanelConfig && this.$store.state.configModel.config.LayerPanelConfig.isShow) {
        this.$store.commit('mapTools/changeShowLayerPanel', true);
    } else {
        this.$store.commit('mapTools/changeShowLayerPanel', false);
    }
  }
  // 切换专题清空点位
  private upateMap() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('gisToolComp');
    component.clearAll();
  }

  // 获取选中的专题 的 数字 类型
  private selectEventTypeVal(val: any) {
    // forestFire 森火专题
    // earthQuake 地震专题
    // dangerousChemicalTradeAccident 安全生产专题
    // flood 防汛专题
    // 1.防汛，2.林火，3.交通，4.地震
    switch (val) {
      case 'forestFire':
        this.themeCode = '2';
        break;
      case 'earthQuake':
        this.themeCode = '4';
        break;
      case 'dangerousChemicalTradeAccident':
        this.themeCode = '3';
        break;
      case 'flood':
        this.themeCode = '1';
        break;
    }
    this.$store.commit('forestFireModule/setProjectType', this.themeCode);
    this.$store.commit('forestFireModule/setSpecailType', val);
    this.getreportType(val, true);
    if (val !== 'flood') {
          this.messsageBus.emit('closeMap', true);
      }
       // 森火专题-森火接报-事件点击，关闭全局模式
    if (this.$store.state.configModel.config.type === 'forestFireDefault') {
      this.$store.commit('forestFireModule/setShowCastModel', true);
    } else {
      this.$store.commit('forestFireModule/setShowCastModel', false);
    }
  }
  // 选择时专题
  private clickSelect() {
    this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {EventlistPanel: {showFlag: false}}); // 事件信息面板隐藏
  }

      // 监听事件信息面板的显隐
  @Watch('$store.state.panelMutualExclusionMudule.panelMutualExclusion', {deep: true})
  private changelargeRightPanel(val: any) {
    this.isShow = val.EventlistPanel.showFlag; // 事件信息面板的显隐
    // this.isShowcollectionList = val.EventCollection.showFlag; // 事件收藏面板的显隐
  }

  private toShow() {
    // 显示常态模式事件列表
    // this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {EventCollection: {showFlag: false}}); // 事件收藏面板隐藏
    this.isShow = !this.isShow;
    if (this.isShow) {
      this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {EventlistPanel: {showFlag: true}});
    } else {
      this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {EventlistPanel: {showFlag: false}});
    }
    // this.isEarthquake = false;
    this.$store.state.configModel.fastSearchPosition =  0;
  }

  // 返回按钮
  private async CkNormalBehavior() {
    this.getreportType(this.eventType, true);
    // 清空gis数据，事件态切换回常态是，ranges（经验圈）清空
    const eventInfoWrapper: any = await this.$ioc.resolve('eventInfo');
    eventInfoWrapper.setCurrentStatus(0);
  }
  private created() {
  //   // eventConfigRegistry.getEventDictMap();
  //   this.eventStatus = this.$store.state.eventPushStore.eventId;
  //   this.eventType = this.$store.state.eventPushStore.eventLocation.EventType;
  //   this.init();
    // this.updataEventType();
  }

  private mounted() {
     // 地图容器id
    (this as any).resolveMap('map').then((data: any) => {
      const routerTopic = this.$route && this.$route.query && this.$route.query.eventTopic;
      const topic = routerTopic || this.$store.state.configModel.config.defaultTopicsType;
      this.getreportType(topic, true);
    });
  }
}
</script>
<style lang="less" scoped>
@import url('../../../assets/css/decisionSupport/LayoutHome.less');
@url: '../../../assets/img/halfScreen/eventAndTopics';
 .eventAndTopics_hd{
  display:flex;
  display: none;
  &_text{
    // padding: 10px 20px;
    color: #fff;
    // margin-top: -3px;
    // display: -webkit-box;
    // display: flex;
    // -webkit-box-align: center;
    // align-items: center;
    // -webkit-box-pack: center;
    // justify-content: center;
    background:url('../../../assets/img/eventInfo/eventbg.png') no-repeat 0  0;
    background-size:100% 100%;
    // background: url(/img/eventbg.ac6392ca.png) no-repeat center / 139px 40px;
    // font-size: 22px;
    color: #d2e1dc;
    cursor: pointer;
    // line-height: 34px;
      vertical-align: middle;
      padding:0 10px;
      margin-left: 10px;
    &::before {
      display:inline-block;
      content: '';
      width: 34px;
      height: 38px;
      background: url('../../../assets/img/eventInfo/eventicon.png') no-repeat 50% 50%;
      margin-right: 5px;
      vertical-align: middle;
    }
    &>span{
      display:inline-block;
      vertical-align: middle;
      background-image:-webkit-linear-gradient(left,#8bfbff,#eefeff);
    -webkit-background-clip:text;    
    background-clip: text;
    -webkit-text-fill-color:transparent;
    line-height:40px;
    }
  }
  &_tmp{
    // border: 1px solid #338af8;
    background: url('../../../assets/img/eventInfo/chooseTopics_bg.png') no-repeat 0 0 ;
    background-size:100% 100%;
    /* background-color: rgba(64, 125, 206, 0.5);
    box-shadow: inset 0 0 10px #338af8;
    text-align:center;
    border-radius: 5px; */
    // width: 204px;
    padding-left:30px;
    // height: 34px;
    // margin-left: 10px;
  }
 }
 .eventAndTopics_bd{
      width:390px;
     background: url('@{url}/eventAndTopics_bg.png') no-repeat 0 0 ;
      background-size:100% 100%;
      z-index: 0;
      padding-bottom:20px;
      padding-top:12px;
    &_close{
      position: absolute;
      right: -8px;
      width: 90px;
      height: 48px;
      background: url('@{url}/eventAndTopics_close.png') no-repeat 0 0;
      z-index: 3;
      margin-top: -11px;
      cursor: pointer;
      &:hover{
        background-image: url('@{url}/eventAndTopics_close_h.png');
      }
    }

 }
.eventAndTopics_hd_tmp {
    height: 33px;
    width: 118px;
    padding-left: 15px;
}
.eventAndTopics_hd_text {
    width: 111px;
    height: 33px;
    span {
      font-size: 18px !important;
    }
}

</style>
<style lang="less">
.eventTypeSelecticon{
      display:inline-block;
      width:32px;
      height:32px;
      vertical-align: middle;
      background: url('../../../assets/img/halfScreen/eventAndTopics/select_icon.png') no-repeat 50% 50%;
      // outline:1px solid red;
    }
    .eventTypeSelecticon_dzzh{
      background-position: 4px 4px;
    }
   .eventTypeSelecticon_tyzh{
      background-position: 4px -32px;
    }
    .eventTypeSelecticon_whzt{
      background-position: 4px -64px;
    }
    .eventTypeSelecticon_fxzt{
      background-position: 4px -104px;
    }
    .eventTypeSelecticon_shzt{
      background-position: 4px -135px;
    }
    .eventTypeSelecticon_tfzt{
      background-position: 4px -167px;
    }
    .eventTypeSelecticon_xzzt{
      background-position: 4px -199px;
    }
    .csmMySelect-noBg.el-select .el-input.is-disabled .el-input__inner, .csmMySelect-noBg.el-select .el-input__inner {
      font-size: 18px !important;
    }
</style>
