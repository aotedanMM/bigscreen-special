<template>
  <div id="app">
    <!--<router-view  />-->
    <!-- <div v-if="!isLogin">
    
     </div>  -->
    <!-- <components :is="currentTheme" v-if="isLogin"></components> -->
    <components :is="currentTheme"></components>
    <!-- websocket推送展示企业信息 -->
    <EnterpriseAlert :enterListData="enterListData" :enterTotal="enterTotal"></EnterpriseAlert>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
// import LayoutHome from '@/views/theme/classic/LayoutHome.vue';
import DecisionSupprotHome from '@/views/theme/decisionSupport/DecisionSupprotHome.vue';
// import DarkGreenHome from '@/views/theme/darkGreen/DarkGreenHome.vue';
import Socket from '@/util/socket';
import { eventPushServer, staticDataRequestServer } from '@/api/installServer';
import {
  allLayout,
  fuzhujuece,
  // foshan,
  // darkGreen,
  defaultChange,
} from '@/config/themeConfig';
import { pushDataRequestServe } from '@/api/installServer';
import { districtServer } from '@/api/installServer';
import EventConfigRegistry from '@/util/eventConfigRegistry';
import {EventConfigList} from '@/util/eventConfigList';
import publishObjectPath from '@/util/configRegistry';
import { loginServer } from '@/api/installServer';
// iframe 消息处理
import { IFrameMessageBus } from './util/iframe/IFrameMessageBus';
import { IFrameMessageListeners } from './util/iframe/IFrameMessageListeners';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import EnterpriseAlert from '@/components/feature/forestFireYantai/MonitorWarning/EnterpriseAlert.vue';
import { match } from 'core-js/es6/symbol';
// import { loginServer } from '@/api/installServer';
@Component({
  components: {
    // LayoutHome,
    DecisionSupprotHome,
    EnterpriseAlert,
    //  DarkGreenHome,
  },
})
export default class App extends Vue {
  // 弹框模板
  private popUpTemplate: any = new renderpopUpTemplate();
  private currentTheme: any;
  private currentThemeDefualt = defaultChange;
  private eventId = '';
  private locationKey = '';
  private addPushList: any = []; // 现场队伍的数据
  private enterListData: any = []; // 企业监测弹窗列表
  private enterTotal: number = 0; // 今日报警企业数量
  // get isLogin() {
  //   const tempWin: any = window;
  //   return window.sessionStorage.getItem('token') ? true : false;
  // }
  get curPage() {
    return this.$store.state.layoutModule.theme;
  }
  @Watch('curPage')
  public changeTheme() {
    const temp: any = this.curPage;
    this.currentTheme = allLayout[temp];
  }
  // defensiveEventId 防御准备事件id
  @Watch('$store.state.configModel.config')
  public changeEventId(val: any) {
    this.eventId = this.eventId || val.defensiveEventId || '';
  }
  // 周边查询
  public getresourceOnMapComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component =
      factory &&
      factory.commonFactory &&
      factory.commonFactory.getComponent('resourceOnMap'); // newsEventLocate,ResourceComponent
    return component;
  }
  // 雨情监测popupData
  private popupDataRain(event: any) {
    if (!event.type && event.featureType) {
      event.type = event.featureType;
      const eventType = event.featureType;
    }
    const param = {
      that: this,
      popupId: 'popup', // 监听id，必须
      moduleTypeID: 'rainMonitor',
      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    this.popUpTemplate.getParams(param);
    this.popUpTemplate.onShowPopup(event);
  }
   // 雨情监测
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'WindWaterRainWork',
    );
    return component;
  }
  // 火点监测/企业监测
  private getComponentFire() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.monitorWarningFactory.getComponent(
      'ResourceQuery',
    );
    return component;
  }

  private getCurPage() {
    /**
     *  应急辅助情况
     */
    const that = this;
    if (this.currentThemeDefualt === 'fuzhujuece') {
      const data = {
        theme: fuzhujuece.theme,
        left: fuzhujuece.normal.left,
        right: fuzhujuece.normal.right,
      };
      that.$store.dispatch('layoutModule/setTheme', data);
      that.$store.dispatch('layoutModule/cacheData', fuzhujuece);
    }
    /**
     *  应急辅助情况--墨绿版
     */
    // if (this.currentThemeDefualt === 'darkGreen') {
    //   const data = {
    //     theme: darkGreen.theme,
    //     left: darkGreen.normal.left,
    //     right: darkGreen.normal.right,
    //   };
    //   that.$store.dispatch('layoutModule/setTheme', data);
    //   that.$store.dispatch('layoutModule/cacheData', darkGreen);
    // }

    /**
     * 佛山的情况
     */
    // if (this.currentThemeDefualt === 'foshan') {
    //   const data = {
    //     theme: foshan.theme,
    //     left: foshan.left,
    //     right: foshan.right,
    //   };
    //   that.$store.dispatch('layoutModule/setTheme', data);
    //   that.$store.dispatch('layoutModule/cacheData', fuzhujuece);
    // }
    // socket情况
    // ajax情况
  }

  // @Watch('$store.state.eventPushStore.eventId')
  // private changEventId() {
  //   this.eventTimes = new Date(
  //     this.$store.state.eventPushStore.eventLocation.EventTimes,
  //   );
  // }

  /**
   * 地址栏中取参数存储session
   */
  //   private getUserName(){
  //       /*url参数处理*/
  //       function GetQueryString(name:any)
  //       {
  //           var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  //           var r = window.location.href.substr(1).match(reg);
  //           if(r!=null)return  unescape(r[2].substring(0,r[2].length)); return null;
  //       }
  //       console.log(GetQueryString('token'));
  //       console.log(GetQueryString('userId'));

  //       const obj={
  //         token:GetQueryString('token'),
  //         userId:GetQueryString('userId')
  //       }
  //       loginServer.getUserNameServer(obj).then((res: any) => {
  //         if(res.status==200){
  //           window.sessionStorage.setItem('userId', res.data.userId);
  //           window.sessionStorage.setItem('loginName', res.data.loginName);
  //           window.sessionStorage.setItem('Name', res.data.name);
  //           window.sessionStorage.setItem('orgName', res.data.orgName);
  //         }

  //       }).catch((err: any) => {
  //
  //       });

  //   }

  private async informGisEventState() {
    // 清空gis数据，事件态切换回常态是，ranges（经验圈）清空
    this.$ioc.resolve('eventInfo').setCurrentStatus(1);
  }
  private socketWithStore() {
    const self = this;
    Socket.onmessage = (message: any) => {
      const data = message.data;
      // 给constData和locationKey赋空值，防止下边报错
      const evnetsObj = JSON.parse(data);
      const constData = { locationKey: '', eventId: ''};
      const locationKey = '';
      // const constData = JSON.parse(evnetsObj.content);
      // const locationKey = constData.locationKey;
      // if ( self.$store.state.eventPushStore.eventId ) { // 当从地震速报那里进行切换时，拿到当前事件的id，从此用这个id进行同步拿数据
      //   self.eventId = self.$store.state.eventPushStore.eventId;
      // }
      self.eventId = self.$store.state.eventPushStore.eventId;
      /**
       * 这个清屏不知道是干啥的 暂时屏蔽
       * */
      /* if (constData.locationKey !== self.locationKey) { // 这里调用了清屏
        self.$store.commit('changeClearAllStatus');
      } else {
        self.locationKey = constData.locationKey;
      } */
      self.locationKey = constData.locationKey;
      const eventAtelier = self.$route ? self.$route.query.eventTopic : '';
      this.informGisEventState();  // 通知gis进入事件态了
      console.log(constData);
      console.log('有消息推送过来了');
      for (const m of evnetsObj) {
        if (m.type === 'rain') {
          // 雨情监测
          if (m.list.length > 0) {
            self.getComponent().on('WindWaterRainWork_popup', self.popupDataRain, self);
            self.getComponent()._addResource(m);
          }
        } else if (m.type === 'fire') {
          // 火情监测
          if (m.list.length > 0) {
             self.getComponentFire()._showResource('firePointToday', m.list);
          }
        } else if (m.type === 'enterPrise') {
          // 企业监测
          if (m.list.length > 0) {
            self.enterListData = m.list;
            self.enterTotal = m.sum;
          } else {
            self.enterListData = [];
            self.enterTotal = 0;
          }
        }
      }
      if (self.eventId !== constData.eventId)  {
        self.getresourceOnMapComponent()._clearLayers('theteam');
        self.getresourceOnMapComponent()._clearLayers('baseCom');
      }
      if (constData.locationKey === 'LocationAndEventPush') {
        // 支撑屏直接选择一个事件，相当于同时触发定位和推送。
        if (self.eventId === constData.eventId) {
          // if(eventAtelier) {
            self.DataSynchronization(self.eventId);
            // }
            return;
        }
        self.eventId = constData.eventId; // 拿到事件id，存进全局。
        const tmpItem = {
          id: self.eventId,
        };
        self.eventPushToServe(tmpItem); // 支撑屏要求，前端在对某个推送过来的事件进行处置时，在通知下支撑屏。
        pushDataRequestServe
          .getPushDataByIds(constData.eventId, locationKey)
          .then((res: any) => {
            if (res.data.content) {
              const dataRes = JSON.parse(res.data.content)[0].data;
              const dataObj = JSON.parse(dataRes).event;
              // 定位
              const obj = {
                EventLat: dataObj.EventLat,
                EventAddr: dataObj.EventAddr,
                EventLon: dataObj.EventLon,
                curLocationKey: locationKey,
              };
              if (dataObj.EventType && eventAtelier) {
                  const index: any = dataObj.EventType * 1;
                  const EventConfigRegistryList = Object.keys(EventConfigList);
                  if (EventConfigRegistryList.indexOf(dataObj.EventType) !== -1) {
                    console.log('>>>>>>>>', EventConfigList[index].key);
                    if (EventConfigList[index].key !== eventAtelier) {
                        return;
                    }
                  }
              }
              self.$store.commit('eventPushStore/eventLocation', obj);
              self.getDistrict(dataObj); // 根据经纬度查询到当前的行政区划编码等，放在vuex中
              // 事件推送过来
              dataObj.curLocationKey = constData.locationKey;
              dataObj.Pushofsupportscreen = true;
              EventConfigRegistry.setConfig(dataObj.EventType); // 根据事件类型读取配置文件
              /**
               * 推送接收直接接收支撑屏经验圈信息, 不再读取配置文件
               * */
              // dataObj.radius = EventConfigRegistry.config.experienceCircle; // 根据配置文件中的经验圈数值进行赋值,这部分代码应该还要写在支撑系统（下面的那个if中）的，因为时间关系，没有写。
              self.$store.commit(
                'configModel/setConfig',
                EventConfigRegistry.config,
              );
              self.$store.commit('eventPushStore/eventInfoAll', dataObj);
              // if(eventAtelier) {
              self.DataSynchronization(self.$store.state.eventPushStore.eventId);
              // }
              // 森火专题-森火接报-事件点击，关闭全局模式
              if (EventConfigRegistry.config.type === 'forestFireDefault') {
                this.$store.commit('forestFireModule/setShowCastModel', true);
              } else {
                this.$store.commit('forestFireModule/setShowCastModel', false);
              }
            } else {
              console.log('操作屏返回数据为空', res.data);
            }
          }); // 一线的  不需要了(支撑屏修改,未开始)               //  这个是二线支撑屏  定位
      } else if (
        constData.locationKey === 'send_location' ||
        constData.locationKey === 'NEW_send_location'
      ) {
        // send_location为一线推送屏点击定位 NEW_send_location为支撑系统的定位
        // 获取定位事件信息，并且把定位的信息存在vuex中
        pushDataRequestServe
          .getPushDataByIds(constData.eventId, locationKey)
          .then((res: any) => {
            const dataRes = JSON.parse(res.data.content)[0].data;
            const dataObj = JSON.parse(dataRes).event;
            const obj = {
              EventLat: dataObj.EventLat,
              EventAddr: dataObj.EventAddr,
              EventLon: dataObj.EventLon,
              curLocationKey: locationKey,
              Pushofsupportscreen: true,
              // EventType: dataObj.EventType,
            };
            self.$store.commit('eventPushStore/eventLocation', obj);
            self.getDistrict(dataObj); // 根据经纬度查询到当前的行政区划编码等，放在vuex中
          });
      } else if (constData.locationKey === 'POPULATIONFEVE') {
        // 定位后的推送，一线操作屏
        self.eventId = constData.eventId; // 拿到事件id，存进全局。
        const tmpItem = {
          id: self.eventId,
        };
        self.eventPushToServe(tmpItem); // 支撑屏要求，前端在对某个推送过来的事件进行处置时，在通知下支撑屏。
        // 推送事件信息
        pushDataRequestServe
          .getPushDataByIds(self.eventId, 'send_location') // 这里之所以用send_location这个key值，其实是因为，在现在的一线临时推送屏中，真正的数据在这个key里。
          .then((res: any) => {
            if (res.data.content) {
              const dataRes = JSON.parse(res.data.content)[0].data;
              const dataObj = JSON.parse(dataRes).event;
              dataObj.Pushofsupportscreen = true;
              dataObj.curLocationKey = constData.locationKey; // 这个原来是给地图做监听定位用的，现在没有用了
              EventConfigRegistry.setConfig(dataObj.EventType); // 根据事件类型读取配置文件
              dataObj.radius = EventConfigRegistry.config.experienceCircle; // 根据配置文件中的经验圈数值进行赋值,这部分代码应该还要写在支撑系统（下面的那个if中）的，因为时间关系，没有写。
              this.$store.commit(
                'configModel/setConfig',
                EventConfigRegistry.config,
              );
              self.$store.commit('eventPushStore/eventInfoAll', dataObj);
            } else {
              console.log('操作屏返回数据为空', res.data);
            }
          });
      } else if (constData.locationKey === 'NEW_POPULATIONFEVE') {
        // 定位后的推送，支撑系统
        /**
         * 推送的时候判断是否id一致 如果一致就是修改目前的标题等信息
         * */
        if (self.eventId === constData.eventId) {
          this.DataSynchronization(self.eventId);
          return; // 暂不支持对事件的更改
          const tmpItem = {
            id: self.eventId,
          };
          self.eventPushToServe(tmpItem); // 支撑屏要求，前端在对某个推送过来的事件进行处置时，在通知下支撑屏。
          // 推送事件信息
          pushDataRequestServe
            .getPushDataByIds(self.eventId, locationKey)
            .then((res: any) => {
              if (res.data.content) {
                const dataRes = JSON.parse(res.data.content)[0].data;
                const dataObj = JSON.parse(dataRes).event;
                /**
                 * 推送可以做修改, 事件类型不变的时候不做处理
                 * */
                if (
                  dataObj.EventType !==
                  self.$store.state.eventPushStore.eventLocation.eventType
                ) {
                  if (dataObj.EventType && eventAtelier) {
                  const index: any = dataObj.EventType * 1;
                  const EventConfigRegistryList = Object.keys(EventConfigList);
                  if (EventConfigRegistryList.indexOf(dataObj.EventType) !== -1) {
                    // console.log('>>>>>>>>',EventConfigList[index].key);
                    if (EventConfigList[index].key !== eventAtelier) {
                        return;
                    }
                  }
                }
                  EventConfigRegistry.setConfig(dataObj.EventType); // 根据事件类型读取配置文件
                  self.$store.commit(
                    'configModel/setConfig',
                    EventConfigRegistry.config,
                  );
                }
                dataObj.curLocationKey = constData.locationKey;
                dataObj.Pushofsupportscreen = true;
                self.$store.commit('eventPushStore/eventInfoAll', dataObj);
              } else {
                console.log('操作屏返回数据为空', res.data);
              }
            });
        } else {
          /**
           * 不一致 根据类型获取配置 当作新事件处理
           * */
          self.eventId = constData.eventId; // 拿到事件id，存进全局。
          const tmpItem = {
            id: self.eventId,
          };
          self.eventPushToServe(tmpItem); // 支撑屏要求，前端在对某个推送过来的事件进行处置时，在通知下支撑屏。
          // 推送事件信息
          pushDataRequestServe
            .getPushDataByIds(self.eventId, locationKey)
            .then((res: any) => {
              if (res.data.content) {
                const dataRes = JSON.parse(res.data.content)[0].data;
                const dataObj = JSON.parse(dataRes).event;
                if (dataObj.EventType && eventAtelier) {
                  const index: any = dataObj.EventType * 1;
                  const EventConfigRegistryList = Object.keys(EventConfigList);
                  if (EventConfigRegistryList.indexOf(dataObj.EventType) !== -1) {
                    // console.log('>>>>>>>>',EventConfigList[index].key);
                    if (EventConfigList[index].key !== eventAtelier) {
                        return;
                    }
                  }
                }
                EventConfigRegistry.setConfig(dataObj.EventType); // 根据事件类型读取配置文件
                self.$store.commit(
                  'configModel/setConfig',
                  EventConfigRegistry.config,
                );
                dataObj.curLocationKey = constData.locationKey;
                dataObj.Pushofsupportscreen = true;
                self.$store.commit('eventPushStore/eventInfoAll', dataObj);
                this.DataSynchronization(self.$store.state.eventPushStore.eventId);
              } else {
                console.log('操作屏返回数据为空', res.data);
              }
            });
        }
      } else if (constData.locationKey === 'derivativeEvents') {
        // 16:9接收支撑屏数据-新处理方式
        // if (self.eventId === constData.eventId) {
        //   return;
        // }
        self.eventId = constData.eventId; // 拿到事件id，存进全局。
        const tmpItem = {
          id: self.eventId,
        };
        pushDataRequestServe
          .getPushDataByIds(constData.eventId, locationKey)
          .then((res: any) => {
            if (res.data && res.data.content) {
              let dataRes: any = JSON.parse(res.data.content)[0].data;
              if (typeof dataRes === 'string') {
                dataRes = JSON.parse(dataRes);
              }
              this.$store.commit(
                'eventPushStore/updateEventPushData',
                dataRes,
              );
            } else {
              this.$store.commit(
                'eventPushStore/updateEventPushData',
                {
                  key: locationKey,
                },
              );
              console.log('操作屏返回数据为空', res.data);
            }
          });
      } else if (constData.locationKey === 'rescueForces') {
        // 现场指挥部
        pushDataRequestServe
          .getPushDataByIds(constData.eventId, locationKey)
          .then((res: any) => {
            if (res.data.content) {
              const dataRes = JSON.parse(res.data.content)[0].data;
              const dataList = JSON.parse(dataRes);
              self.getresourceOnMapComponent().on('localResource_popup', self.popupData , self);
              self.getresourceOnMapComponent()._showResourcesOnMap(
                'baseCom',
                [dataList.data],
              );
            } else {
              console.log('操作屏返回数据为空', res.data);
            }
          });
      } else if (constData.locationKey === 'siteTeam') {
        const keyType = ['9', '11'];
        if (!keyType.includes(self.$store.state.eventPushStore.eventLocation.EventType)) {
              return;
        }
        pushDataRequestServe
          .getPushDataByIds(constData.eventId, locationKey)
          .then((res: any) => {
            if (res.data.content) {
              const dataRes = JSON.parse(res.data.content)[0].data;
              const dataList = self.newArr(JSON.parse(dataRes).data);
              self.getresourceOnMapComponent().on('localResource_popup', self.popupData , self);
              self.getresourceOnMapComponent()._showResourcesOnMap(
                'theteam',
                dataList,
              );
            } else {
              console.log('操作屏返回数据为空', res.data);
            }
          });
      } else if (self.eventId === constData.eventId) {
        // 拿到当前eventId的推送
        self.$store.commit('eventPushStore/composex', constData.locationKey); // 推送
      }
      // if (evnetsObj.messageType === 'command') {
      //   self.$store.commit('eventPushStore/composex', constData.locationKey);
      // } else {
      //   // 只处理一个的情况
      //   const resData = JSON.parse(constData[0].data);
      //   if (resData.eventId) {
      //     // 事件信息
      //     self.$store.commit('eventPushStore/eventInfoAll', resData);
      //   } else {
      //     // 定位
      //     self.$store.commit('eventPushStore/eventInfoLocation', resData);
      //   }
      // }
    };
  }
  // 推送事件同步当前事件中的衍生事件、指挥部、救援队伍数据
  private DataSynchronization(eventId: any) {
    const self = this;
    const pushKey = ['derivativeEvents', 'rescueForces', 'siteTeam'];
    self.getresourceOnMapComponent()._clearLayers('theteam');
    self.getresourceOnMapComponent()._clearLayers('baseCom');
    pushKey.forEach((item: any) => {
    pushDataRequestServe.getPushDataByIds(eventId, item).then((res: any) => {
      if (res.data.content) {
              if (item === 'derivativeEvents') {
                const dataRes = JSON.parse(res.data.content)[0].data;
                self.$store.commit(
                    'eventPushStore/updateEventPushData',
                    JSON.parse(dataRes),
                  );
                } else {
                  switch (item) {
                    case 'rescueForces':
                      const dataResTwo = JSON.parse(res.data.content)[0].data;
                      const dataListTwo = JSON.parse(dataResTwo);
                      this.getresourceOnMapComponent().on('localResource_popup', this.popupData , this);
                      this.getresourceOnMapComponent()._showResourcesOnMap(
                          'baseCom',
                          [dataListTwo.data],
                        );
                      break;
                    case 'siteTeam':
                    const keyType = ['9', '11'];
                    if (!keyType.includes(self.$store.state.eventPushStore.eventLocation.EventType)) {
                            return;
                    }
                    const dataResThree = JSON.parse(res.data.content)[0].data;
                    const dataListThree = self.newArr(JSON.parse(dataResThree).data);
                    this.getresourceOnMapComponent().on('localResource_popup', this.popupData , this);
                    this.getresourceOnMapComponent()._showResourcesOnMap(
                          'theteam',
                          dataListThree,
                        );
                    break;
                    default:
                    break;
                  }
                }
        } else {
              console.log('操作屏返回数据为空', res.data);
            }
          });
    });
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
      moduleTypeID: 'localResource_popup',
      styleObj: {
        // 选填
        'margin-bottom': '66px',
        'margin-left': '-205px',
      },
    };
    this.popUpTemplate.getParams(param);
    this.popUpTemplate.onShowPopup(event);
  }
  // 对数据进行去重
  private newArr(arr: any) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i].id === arr[j].id) {
          // 如果第一个等于第二个，splice方法删除第二个
          arr.splice(j, 1);
          j--;
        }
      }
    }
    return arr;
  }

  // 事件回显到新的支撑屏
  private eventPushToServe(item: any) {
    let receiverIds = 'eads';
    const sendSearch = location.hash || location.search;
    const paramName: any = 'loginName=';
    if (sendSearch.indexOf(paramName) !== -1) {
      receiverIds = sendSearch.split(`${paramName}`)[1];
    }
    const param: any = {
      content: [
        {
          eventId: item.id,
          date: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        },
      ],
      eventId: item.id,
      locationKey: 'eads',
      messageName: item.id,
      messageType: 'command',
      receiverIds,
      senderId: '1',
    };
    eventPushServer
      .pushEventToServe(param)
      .then((res: any) => {
        console.log('操作屏回填=>', res);
      })
      .catch((error: any) => {
        console.log('操作屏回填=>', error);
      });
  }

  // 行政区划
  private getDistrict(data: any) {
    const self = this;
    const optsTest = {
      location: [data.EventLon, data.EventLat],
      level: '2',
    };
    districtServer.getDistrictByLonLat(optsTest).then((dataDis: any) => {
      self.$store.commit('eventPushStore/setDistrict', dataDis.data[0]); // 推送
    });
  }

  private userToken() {
    const token = window.sessionStorage.token;
    const userInfoStr: any = window.sessionStorage.role;
    if (!(token || userInfoStr)) {
      // window.location.href = publishObjectPath.value.loginUrl;
    }
    // else { 目前注释
    //   const userInfo: any = JSON.parse(userInfoStr);
    //   const userId = userInfo.userId;
    //   $.ajax({
    //     url:
    //       publishObjectPath.value.tokenServer +
    //       'api/gemp/user/baseuser/baseinfo/id/v1',
    //     type: 'POST',
    //     dataType: 'json',
    //     headers: {
    //       'Content-Type': 'application/json;charset=utf8',
    //       token: token,
    //     },
    //     data: JSON.stringify({ userId }),
    //     error(err) {
    //       window.location.href = publishObjectPath.value.loginUrl;
    //     },
    //     statusCode: {
    //       401() {
    //         window.location.href = publishObjectPath.value.loginUrl;
    //       },
    //       403() {
    //         window.location.href = publishObjectPath.value.loginUrl;
    //       },
    //     },
    //   });
    // }
  }

  private initIFrameBus() {
    const iframeMessageBus: IFrameMessageBus = new IFrameMessageBus();
    // 注册到共享变量，vue组件中通过 this.$ioc.resolve('iframeMessageBus') 获取
    this.$ioc.register('iframeMessageBus', iframeMessageBus);
    // for test
    (window as any).iframeMessageBus = iframeMessageBus;
    // 绑定窗口
    iframeMessageBus.bind(window);
    if ((window as any).parent) {
      // 绑定接收消息的窗口为父窗口window
      iframeMessageBus.addTargetWindow((window as any).parent.window);
    }
    // iframe listener
    const iframeMessageListeners: IFrameMessageListeners = new IFrameMessageListeners(
      iframeMessageBus,
      this,
    );
    iframeMessageListeners.bind();
  }
  private created() {
    // 2020年5月2日 临时先注释
    // this.userToken();
    // this.updateCurEventConfig();
    this.getCurPage();
    this.changeTheme();
    this.socketWithStore();
    this.initIFrameBus();
    // this.getUserName()
    EventConfigRegistry.setConfig(10000); // 常态
    this.$store.commit('configModel/setConfig', EventConfigRegistry.config);
  }
}
</script>
<style lang="less">
@import url("./assets/css/index.all.less");
</style>
<style lang="less" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  height: 100%;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
