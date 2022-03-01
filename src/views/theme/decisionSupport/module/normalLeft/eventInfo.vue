<template>
  <div class="EventInfoView" style="height:100%;">
    <EventInfo
      :eventInfoData="eventInfoData"
      :datatotal="datatotal"
      :clickPerItemData="clickHandlerItem"
      :index="index"
      :SwitchingData="SwitchingData"
      :modulename="modulename"
    ></EventInfo>
    <!-- <LoadingElement v-else :status="status" /> -->
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import EventInfo from '@/components/feature/common/eventInfo/EventInfo.feature.vue';
import { IEventinfo } from '@/interface/feature/earthquake/Eventinfo.interface';
import EventInfoPop from '@/components/feature/gisModule/popUp/eventInfo.vue';
import { eventInfoServer } from '@/api/installServer';
import { getEvemtInfoOrCreatedInfo } from '@/api/installServer';
import { getDateFormat } from '@/util/tools';
import LoadingElement from '@/components/feature/common/Loading/Loading.vue';
import { districtServer } from '@/api/installServer';
import MapCommon from '@/util/MapCommon';
import { socketRestServer } from '@/api/feature/normal/installNormalServer';
import { eventPushServer } from '@/api/installServer';
import { websoketServer } from '@/api/installServer';
import EventConfigRegistry from '@/util/eventConfigRegistry';
/**
 * 事件信息组件View层
 * name值的定义方式：组件名+View
 */
@Component({
  name: 'EventInfoView',
  mixins: [MapCommon],
  components: {
    EventInfo,
    EventInfoPop,
    LoadingElement,
  },
})
export default class EventInfoView extends Vue {
  @Prop() public modulename: any;
  private eventInfoData: IEventinfo[] = [];
  private eventCodestr: any = [];
  private tiemeout: any;
  private showTwoPage = false;
  private loading = true;
  private index: any = '';
  private status = 'loading';
  private selectTime: any;
  // eventInfo默认的初始化数据
  private eventInfo: IEventinfo = {
    id: '',
    title: '',
    eventType: '',
    reportTime: '',
    location: '',
    longitude: '',
    latitude: '',
  };
  private datatotal: number = 0;

  // 对应推送屏事件类型
  private eventType: any = {
    地震灾害: 1,
    煤矿事故: 2,
    地质灾害: 3,
    非煤矿山事故: 4,
    危化工贸事故: 5,
    火灾事故: 6,
    交通事故: 7,
    洪涝灾害: 8,
    森林火灾: 9,
    台风事件: 10,
    草原火灾: 11,
    涉外突发事件: 12,
    公共卫生事件: 13,
    暴雨事件: 16,
    泥石流事件: 17,
    滑坡事件: 18,
    燃气泄漏事故: 19,
    水库溃坝: 20,
    内涝: 21,
    其他: '0',
  };

  private eventInfoStore: any = {
    curLocationKey: 'NEW_POPULATIONFEVE', // 表明当前是定位还是推送 send_location：定位   NEW_POPULATIONFEVE：推送
    EventLat: '', // 纬度
    EventAddr: '', // 地点,北京市大观园
    EventLon: '', // 经度
    EventLatLonStr: '', // 经纬度拼起来的串，给地图监听用。主要用作推送屏点定位的时候，地图进行重定位。
    radius: '', // 影响经验圈 '5,10,20,50'
    EqLevel: '', // 7.5
    EventDesc: '', // "2020年03月08日00时56分,北京市大观园发生重大火灾(此信息为测试数据)"
    EventLevel: '', // "严重"
    EventTime: '', // "2020年03月08日00时56分"  标题取得这个字段显示在了事发时间 所以这里存的是事发时间
    EventTimes: '', // "2020-03-08 00:56:14"   这里存的是上报时间
    EventTit: '', // "11·24演习"
    EventType: '', // "6"
    eventId: '', // 事件id
  };
  // 监听定位-清楚地图上其他点位
  @Watch('$store.state.eventPushStore.eventLocation.EventLatLonStr')
  public onEventLocate() {
    this.getComponent().unload();
  }
  public beforeDestroy() {
    this.getComponent().off('EventPointspopup', this.onShowPopup, this);
    this.getComponent().unload();
    clearInterval(this.tiemeout);
  }

  @Watch('$store.state.eventPushStore.eventId')
  public NormalBehavior(val: any) {
    if (!val) {
      this.getComponent().showEvents(this.eventInfoData);
      this.getComponent().setVisible(true);
      this.getComponent1().unload();
      this.getComponent_Influence().unload();
    }
  }

  // 监听类型的变化
  @Watch('$store.state.eventInfoType.eventInfoType')
  public getTypeCodeList(val: any) {
    this.eventCodestr = '';
    this.loading = false;
    this.eventCodestr = val;
    this.getData();
  }
  public SwitchingData(val: any) {
    this.selectTime = val;
    (window as any).selectTimeok = val;
    this.getData();
  }

  // private showEventInfoPop: boolean = false;
  // 这方法只是获取数据
  private getData() {
    if (this.modulename === 'infolistleft') {
      if ((window as any).selectTimeok) {
        this.selectTime = (window as any).selectTimeok;
      }
      const startTime =
        this.selectTime &&
        this.selectTime.timer &&
        this.selectTime.timer.length > 0
          ? this.$moment(this.selectTime.timer[0]).format('YYYY-MM-DD HH:mm:ss')
          : this.$moment(new Date().getTime() - 3600 * 1000 * 24 * 3).format(
              'YYYY-MM-DD HH:mm:ss',
            );
      const endTime =
        this.selectTime &&
        this.selectTime.timer &&
        this.selectTime.timer.length > 0
          ? this.$moment(this.selectTime.timer[1]).format('YYYY-MM-DD HH:mm:ss')
          : this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const title = this.selectTime ? this.selectTime.inputvalue : '';
      const nowPage = this.selectTime ? this.selectTime.current : 1;
      const pageSize = this.selectTime ? this.selectTime.pageSize : 10;
      eventInfoServer
        .getEventInfo({
          startTime,
          endTime,
          eventCode: this.eventCodestr,
          nowPage,
          pageSize,
          title,
        })
        .then((res: any) => {
          if (res.data.total > 0 && res.code === 0) {
            res.data.list.forEach((item: any) => {
              item.type = false;
            });
            if (title) {
              this.eventInfoData = res.data.list;
              this.eventInfoData = this.eventInfoData.filter(
                (item) => item.title.indexOf(title) !== -1,
              );
              this.datatotal = this.eventInfoData.length;
            } else {
              this.datatotal = res.data.total;
              this.eventInfoData = res.data.list;
              // this.datatotal = res.data.total;
              // this.eventInfoData = res.data.list;
              this.status = '';
            }
          } else {
            console.log('this.datatotal ', '不满足条件');
            this.status = 'nodata';
            this.eventInfoData = [];
            this.datatotal = 0;
            this.showGisDotted();
          }
          this.showGisDotted();
        })
        .catch(() => {
          this.status = 'nodata';
          this.datatotal = 0;
          this.eventInfoData = [];
          this.showGisDotted();
        });
    } else if (this.modulename === 'collection') {
      eventInfoServer
        .getCollectionList({
          userNameCollect:
            (this.$route ? this.$route.query.loginName : '') ||
            (sessionStorage.loginName ? sessionStorage.loginName : '') ||
            'eads',
        })
        .then((res: any) => {
          if (res.data.length > 0 && res.code === 0) {
            this.eventInfoData = res.data;
          } else {
            this.eventInfoData = [];
          }
          this.showGisDotted();
        })
        .catch(() => {
          this.eventInfoData = [];
          this.showGisDotted();
        });
    }
  }
  // 点击常态左侧 '事件信息' 四个字地图标记显隐藏
  private eventInfoMapShow() {
    this.messsageBus.on('eventInfoMapShow', (flagMap: boolean) => {
      this.getComponent().setVisible(flagMap);
    });
  }

  // 清除事件列表选中状态
  private eventListCheck() {
    this.eventInfoData.forEach((item: any) => {
      item.type = false;
    });
  }
  // 点击事件的处理
  private clickHandlerItem(item: IEventinfo, index?: any) {
        // 森火专题-森火接报-事件点击，关闭全局模式
    if (this.$store.state.configModel.config.type === 'forestFireDefault') {
      this.$store.commit('forestFireModule/setShowCastModel', false);
    }
    if (this.$store.state.configModel.config.type === 'forestFireDefault' || this.$store.state.configModel.config.type === '9') {
      this.$store.commit('forestFireModule/setCurEventId', item.id);
    }
    if (index) {
      // 事件列表点击后选中的处理
      this.index = index;
      this.eventListCheck();
    } else {
      this.eventListCheck();
      this.index = '';
      item.type = true;
    }
    this.eventInfo = item;
    this.messsageBus.emit('EventInfoToTree', item);
    this.getComponent().locateEvent(item);
  }

  // 这个方式是初始化的时候要干的活
  private init() {
    this.loading = false;
    this.getData();
  }

  private onShowPopup(event: any) {
    const eventInfo = this.eventInfo;
    const data = event.data;
    data.reportTime = data.reportTime ? data.reportTime : data.collectionTime;
    const self = this;
    const popup = new EventInfoPop({
      el: '#' + event.containerId,
      data() {
        return {
          data,
          config: {
            title: 'title',
            content: 'title',
            time: 'reportTime',
            btnName: '进入处置',
          },
        };
      },
      methods: {
        // 这个是关闭操作
        close() {
          self.getComponent().closePopup();
          self.getComponent().hideHighlight();
          if (self.index) {
            // 关闭进入专题操作后，清除事件列表选中效果
            self.index = '';
          } else {
            self.eventListCheck();
          }
        },
        // 这个是点击按钮的操作
        clickHandler() {
          self.getComponent().closePopup();
          // self.messsageBus.emit('EventInfoPreview');
          // 点击进入专题相当于一次定位推送,在layouthome页面，通过监听事件id进行屏幕切换
          self.handleEventInfo(data);
          // 调用接口给推送屏发消息 TODO 回显到一线操作屏
          // self.socketInfo(data);
        },
      },
    });
  }

  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent('newsEventLocate');
    return component;
  }

  private getComponent1() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('locateComp');
    return component;
  }

  private getComponent_Influence() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('influence');
    return component;
  }

  private mounted() {
    // this.tiemeout = setInterval(() => {
    //   this.getData();
    // }, 300000); // 左侧列表五分钟获取信息
  }

  // 事件回显到新的支撑屏
  private eventPushToServe(item: any) {
    let receiverIds = 'eads';
    const sendSearch =
      location.hash || location.search || window.sessionStorage.loginName;
    const paramName: any = 'loginName='; // 获取的为userid
    if (window.sessionStorage.loginName) {
      receiverIds = window.sessionStorage.loginName;
    } else {
      if (sendSearch.indexOf(paramName) !== -1) {
        receiverIds = sendSearch.split(`${paramName}`)[1];
      }
    }
    const param = {
      content: [
        {
          eventId: item.eventId,
          date: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        },
      ],
      eventId: item.eventId,
      locationKey: 'eads',
      messageName: item.eventId,
      messageType: 'command',
      receiverIds,
      senderId: '1',
    };
    eventPushServer
      .pushEventToServe(param)
      .then((res: any) => {
        // res && res.data && res.data.data
        console.log('操作屏回填=>', res);
      })
      .catch((error: any) => {
        console.log('操作屏回填=>', error);
      });
  }

  // 展示屏向推送屏推送消息
  private socketInfo(item: any) {
    let EqLevel: any;
    if (item.title.split('发生')[1]) {
      EqLevel = item.title.split('发生')[1].split('级地震')[0] * 1;
    } else {
      EqLevel =
        item.title
          .split('级地震')[0]
          .substring(
            item.title.split('级地震')[0].length - 3,
            item.title.split('级地震')[0].length,
          ) * 1
          ? item.title
              .split('级地震')[0]
              .substring(
                item.title.split('级地震')[0].length - 3,
                item.title.split('级地震')[0].length,
              ) * 1
          : '';
    }
    let receiverIdsNew = '';
    const sendSearch =
      location.hash || location.search || window.sessionStorage.loginName;
    if (sendSearch.indexOf('=') !== -1) {
      receiverIdsNew = sendSearch.split('=')[1];
    } else {
      receiverIdsNew = sendSearch;
    }
    const message = {
      key: 'SEND_LOCATIONToOperate',
      event: {
        EqLevel: EqLevel || item.magnitude || '',
        EventAddr: item.location || '',
        EventDesc: item.title || '',
        EventLat: item.latitude,
        EventLon: item.longitude,
        EventTimes: item.reportTime,
        EventTit: item.title,
        EventType: this.eventType[item.eventType],
        eventId: item.id,
      },
    };
    const opts = {
      eventId: item.id,
      messageType: '0',
      id: item.id,
      content: [
        {
          data: JSON.stringify(message),
        },
      ],
      locationKey: 'operator' + receiverIdsNew,
      messageName: item.id,
      receiverIds: 'operator' + receiverIdsNew,
      senderId: '1',
    };
    websoketServer.websoketServerInfoServer(opts).then((res: any) => {
      if (res.code === 0) {
        console.log('推送成功');
      }
    });
  }

  // 行政区划
  private getDistrict(data: any) {
    const self = this;
    const optsTest = {
      location: [data.EventLon, data.EventLat],
      level: '2',
    };
    console.log(optsTest);
    districtServer.getDistrictByLonLat(optsTest).then((dataDis: any) => {
      self.$store.commit('eventPushStore/setDistrict', dataDis.data[0]); // 推送
      self.$store.commit(
        'mapModule/changeDistrictShowName',
        dataDis.data[0].name,
      ); // 行政区划 地址数据
    });
  }

  // 点击进入专题将字段转化成需要的
  private handleEventInfo(eventInfo: any) {
    eventInfo.id = eventInfo.eventId ? eventInfo.eventId : eventInfo.id;
    /**
     * 需要用eventId  和 userName 获取对应事件信息
     * 1. 在session storage中获取用户名 userName(存储的叫 loginName)
     * 2. 根据 id 和 userName获取信息, 因为本地开发不存在userName  所以这里要做容错
     * */
    const info: any = {
      id: eventInfo.id,
      userName:
        (this.$route ? this.$route.query.loginName : '') ||
        (sessionStorage.loginName ? sessionStorage.loginName : '') ||
        'eads',
    };
    getEvemtInfoOrCreatedInfo
      .getEventInfoByIdAndUserName(info)
      .then((res: any): void => {
        const { data, code } = res;
        if (code === 0) {
          this.eventInfoStore = {
            curLocationKey: 'NEW_POPULATIONFEVE', // 表明当前是定位还是推送 send_location：定位   NEW_POPULATIONFEVE：推送
            EventLat: parseFloat(data.latitude), // 纬度
            EventAddr: data.location, // 地点,北京市大观园
            EventLon: parseFloat(data.longitude), // 经度
            EventLatLonStr: `${data.location}${data.longitude}${new Date()}`, // 经纬度拼起来的串，给地图监听用。主要用作推送屏点定位的时候，地图进行重定位。
            radius: data.eventExtra ? data.eventExtra.affectRange : '', // 影响经验圈 '5,10,20,50'
            EqLevel: data.eventExtra ? data.eventExtra.magnitude : '', // 7.5
            EventDesc: data.eventDesc, // "2020年03月08日00时56分,北京市大观园发生重大火灾(此信息为测试数据)"
            EventLevel: data.level, // "严重"
            EventTime: '', // "2020年03月08日00时56分"   这两个好像只是格式的区别 别的没有区别
            EventTimes: data.occurTime, // "2020-03-08 00:56:14"   标题取得这个字段显示在了事发时间 所以这里存的是事发时间
            EventTit: data.title, // "11·24演习"
            EventType: data.eventType, // "6"
            eventId: data.id, // 事件id
            originalEventId: data.eventId, // mis端事件id
          };
          this.getDistrict(this.eventInfoStore); // 获取行政区划信息
          EventConfigRegistry.setConfig(this.eventInfoStore.EventType); // 根据事件类型读取配置文件
          this.$store.commit(
            'configModel/setConfig',
            EventConfigRegistry.config,
          );
          this.$store.commit('eventPushStore/intoSpecial', this.eventInfoStore);
          // 事件回显到新的支撑屏
          this.eventPushToServe(this.eventInfoStore);
        } else {
          console.log(res.msg);
        }
      });
  }

  private showGisDotted() {
    (this as any).resolveMap('map').then(() => {
      this.getComponent().on('EventPointspopup', this.onShowPopup, this);
      this.getComponent().showEvents(this.eventInfoData);
      this.eventInfoMapShow();
    });
  }

  private created() {
    this.init();
    // this.showGisDotted();
  }
}
</script>
<style lang="less" scoped>
.EventInfoView {
  height: 100%;
}
</style>
