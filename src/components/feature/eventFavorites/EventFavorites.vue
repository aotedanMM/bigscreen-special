<!-- 16比9 head部分事件列表与专题选择 -->
<template>
    <div class="eventinfo">
      <div class="eventinfo_select">
        <el-select style="width:100%;"  class="constomMySelect" v-model="TimeoptionsValue" placeholder="请选择" v-show="false">
          <el-option
            v-for="item in Timeoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="eventinfo_content"  v-if="colletionDataList.length">
        <el-scrollbar  class="cmp-scrollbar-y" style="height:100%" >
          <ul class="eventinfo_content_ul">
            <li class="eventinfo_content_ul_single f-txt-com" v-for="(item, index) in colletionDataList" :key="index" @click="clickHandlerItem(item,index)">
                <span class="dot"></span>  
                <div class="eventinfo_content_ul_single_time">
                  <p class="eventinfo_content_ul_single_time_p">
                    <!-- 发布时间： -->
                    <span class="time">{{item.collectionTime}}</span>
                    <!-- <span class="eventinfo_time_icon collecte-icon collecte-icon-collected"></span>   -->
                  </p>
                </div>
                <div class="eventinfo_content_ul_single_txt" >                 
                  <!-- <span  class="eventinfo_icon collecte-icon collecte-icon-position"></span> -->
                  <p :title="item.title">{{item.title}}</p> 
                </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>  
      <div class="nocontBox" v-else>
        <p class="noeventInfoDatabg"></p>
      </div> 
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop , Watch} from 'vue-property-decorator';
import { eventInfoServer, getEvemtInfoOrCreatedInfo, districtServer, eventPushServer } from '@/api/installServer';
import EventInfoPop from '@/components/feature/gisModule/popUp/eventInfo.vue';
import MapCommon from '@/util/MapCommon';
import EventConfigRegistry from '@/util/eventConfigRegistry';
@Component({
  name: 'EventFavorites',
    mixins: [MapCommon],
    components: {
      EventInfoPop,
  },
})
export default class EventFavorites extends Vue {
private colletionDataList: any[] = [];
private TimeoptionsValue: string = 'day3';
private eventInfo: any = '';
  private Timeoptions: any[] = [
    {
      label: '近三天',
      value: 'day3',
    },
    {
      label: '近一周',
      value: 'week',
    },
    {
      label: '近一月',
      value: 'month',
    },
    {
      label: '近一年',
      value: 'year',
    },
  ];
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
  private getColletionDataList() {
    eventInfoServer.getCollectionList({
      userNameCollect: (this.$route ? this.$route.query.loginName : '') || (sessionStorage.loginName ? sessionStorage.loginName : '') || 'eads',
      }).then((res: any) => {
        if (res.data.length > 0 && res.code === 0) {
          this.colletionDataList = res.data;
        } else {
          this.colletionDataList = [];
        }
        this.showGisDotted();
      }).catch(() => {
        this.colletionDataList = [];
        this.showGisDotted();
      });
  }

  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent('newsEventLocate');
    return component;
  }

   // 点击常态左侧 '事件信息' 四个字地图标记显隐藏
  private eventInfoMapShow() {
    this.messsageBus.on('eventInfoMapShow', (flagMap: boolean) => {
      this.getComponent().setVisible(flagMap);
    });
  }

  private showGisDotted() {
  (this as any).resolveMap('map').then(() => {
      this.getComponent().on('EventPointspopup', this.onShowPopup, this);
      this.getComponent().showEvents(this.colletionDataList);
      this.eventInfoMapShow();
    });
  }

   // 点击事件的处理
  private clickHandlerItem(item: any, index?: any) {
    this.eventInfo = item;
    this.messsageBus.emit('EventInfoToTree', item);
    this.getComponent().locateEvent(item);
  }

   private onShowPopup(event: any) {
     console.log(event, 33333);
     const data = event.data;
     data.reportTime = data.collectionTime;
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
  // 点击进入专题将字段转化成需要的
  private handleEventInfo(eventInfo: any) {
    /**
     * 需要用eventId  和 userName 获取对应事件信息
     * 1. 在session storage中获取用户名 userName(存储的叫 loginName)
     * 2. 根据 id 和 userName获取信息, 因为本地开发不存在userName  所以这里要做容错
     * */
    const info: any = {
      id: eventInfo.id,
      userName: (this.$route ? this.$route.query.loginName : '') || (sessionStorage.loginName ? sessionStorage.loginName : '') || 'eads',
    };
    getEvemtInfoOrCreatedInfo.getEventInfoByIdAndUserName(info).then((res: any): void => {
      const {data, code} = res;
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
        this.$store.commit('configModel/setConfig', EventConfigRegistry.config);
        this.$store.commit('eventPushStore/intoSpecial', this.eventInfoStore);
        // 事件回显到新的支撑屏
        this.eventPushToServe(this.eventInfoStore);
      } else {
        console.log(res.msg);
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
      console.log(dataDis);
      self.$store.commit('eventPushStore/setDistrict', dataDis.data[0]); // 推送
      self.$store.commit('mapModule/changeDistrictShowName', dataDis.data[0].name);  // 行政区划 地址数据
    });
  }

   // 事件回显到新的支撑屏
  private eventPushToServe(item: any) {
    let receiverIds = 'eads';
    const sendSearch = location.hash || location.search || window.sessionStorage.loginName;
    const paramName: any = 'loginName=';  // 获取的为userid
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
    eventPushServer.pushEventToServe(param).then((res: any) => {
      // res && res.data && res.data.data
      console.log('操作屏回填=>', res);
    }).catch((error: any ) => {
      console.log('操作屏回填=>', error);
    });
  }


  private mounted() {
    // 获取收藏列表
    this.getColletionDataList();
  }
}
</script>
<style lang="less" scoped>
@imgPath:'../../../assets/img/gisModule/PopulationFeverBox';
.nocontBox{
    position: relative;
    height: 810px;
    margin-right: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    .noeventInfoDatabg{
      width: 165px;
      height: 163px;
      background: url(../../../assets/img/default/panel/noData.png) no-repeat;
      background-size: 100% 100%;
      // margin: 250px auto; 注释这句是为了兼容ie11.
    }
}
.collecte-icon{
    display: inline-block;
    vertical-align: middle;
    width:32px;
    height: 32px;
    background: url('@{imgPath}/collected-icon.png') 50% 50% no-repeat;
    margin-right:10px;
}
// 已收藏
.collecte-icon-collected{
    background-position:0 -3px;
}
// 收藏
.collecte-icon-collecte{
    background-position:0 -39px;
}
// 已定位
.collecte-icon-position{
    background-position:0 -74px;
}
// 定位
.collecte-icon-positioned{
    background-position:0 -103px;
}
.eventinfo_icon{
  float:right; position:absolute;bottom:0;right:-8px;
}
.eventinfo_time_icon{
  float:right; position:absolute;top:50%;right:-5px;
  margin-top:-16px;

}
.eventinfo {
  z-index: 4;
  box-sizing:border-box;
  margin:0 12px 0 15px;
  // outline:1px solid red;
  p{margin:0;padding:0;}
  
  &_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffde00;
    height: 60px;
    font-weight: 600;
    padding-left:40px;
    line-height: 60px;;
    margin-bottom:5px;
  
  }
  &_select{
    margin-left:10px;
    margin-right:10px;
  }
  &_content {
    // height: calc(100% - 100px);
    // overflow: hidden;
    // height:850px;    
    height: calc(100% - 100px);
    margin:0 0px 0 8px;
    &::before{
      content: '';
      width: 1px;
      height: calc(100% - 40px);
      position: absolute;
      margin-left: 12px;
      background-color: #05a7a8;
      margin-top: 20px;
      // outline:1px solid red;
    }

    &_ul {
      list-style: none;
      padding: 0;
      margin:0;
      // padding-top:200px;
      box-sizing: border-box;
      &_single {
        position: relative;
        color: #fff;
        margin-bottom: 5px;
        margin-top: 5px;
        // font-size: 20px;
        display: flex;
        flex-direction: column;
        padding-bottom: 5px;
        margin-bottom: 5px;
        padding-left:20px;
        cursor: pointer;
        border-radius: 5px;
        padding: 0px 0 10px 15px;
       
        // &:first-child {    
        //   // background-image: -webkit-gradient(linear, left bottom, left top, color-stop(10%, rgba(72, 223, 255, 0.23)), to(rgba(0, 156, 255, 0.18)));
        //   // background-image: linear-gradient(to top, rgba(72, 223, 255, 0.23) 10%, rgba(0, 156, 255, 0.18));
        //   // border: 1px solid #088d91;
        //   margin-left:25px;
        //   padding-left:0;
        //   // color:#ffde00;
        //   span.dot{
        //   left: -20px;
        //   width: 14px;
        //   height: 14px;
        //   }      
        //   span.time{
        //     color: inherit;
        //   }
        // }
        > div {
          margin: 0 2em;
        }
        span {
          color: #e5f4ff;
        }
        span.dot{
          position: absolute;
          top: 16px;
          display: inline-block;          
            width:6px;
            height:6px;
            left:9px;
          background-size: 100% 100%;
          background-color: #14d4fd;
          box-shadow: inset 0 0 0 3px rgba(0, 255, 246, 0.5), 0 0 10px 3px rgba(0, 252, 255, 0.6);
          border-radius: 50%;
          z-index: 1;
        }
        span.time{
          display: block;
          background-size:100% 100%;
          padding:5px;
          background: url('../../../assets/img/eventInfo/locationbg.png');
          background-size: 100% 100%;
          color:#52728c;
        }
        span.primary-text{
          color:#00fffc
        }
        &_time {
          display: flex;
          align-items: center;
            position:relative;
          &_p{
            margin-block-start: 0.2em!important;
            margin-block-end: 0.2em!important;
            // display: flex;
            // justify-content: space-between;
            // float: right;
          }
        }
        &_text{
          position: relative;
          outline: 1px solid red;
          & >p{
            margin:0;
          }
        }
      }
    }
  }
}
.eventinfo_title{
  display: none;
}
.eventinfo_content_ul_single > div{
          margin-left:10px;
          margin-right:0; 
          padding-right:10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
}
.cmp-scrollbar-y{
  margin-top: 15px;
}
.cmp-scrollbar-y .el-scrollbar__wrap{
    overflow-x:hidden;
  // margin-right: -18px!important; 
}

</style>
