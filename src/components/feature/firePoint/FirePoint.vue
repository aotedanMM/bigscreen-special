<template>
  <div class="firePoint">
    <div class="firePoint_info">
      <div class="firePoint_info_hd">
        <dl class="text-dl" :class="{cur : curClass}" @click="todayfirecount">
          <dt class="text-title">当日火点数</dt>
          <dd class="text-num ">{{ dayHotspots}}</dd>
        </dl>
      </div>
      <div class="firePoint_info_bd">
        <dl class="text-dl text-dl-width" :class="{cur : addClass}" @click="addfirecount">
          <dt class="text-title">今日新增</dt>
          <dd class="text-num">{{ addfirepointcount }}</dd>
        </dl>
        <dl class="text-dl text-dl-width" :class="{cur : countinuClass}" @click="countinufire">
          <dt class="text-title">延续火点</dt>
          <dd class="text-num">{{ continuousfire }}</dd>
        </dl>
        <!-- <dl class="text-dl text-dl-width">
          <dt class="text-title">核查中</dt>
          <dd class="text-num">0</dd>
        </dl> -->
        <!-- <dl class="text-dl text-dl-width">
          <dt class="text-title">未反馈</dt>
          <dd class="text-num">0</dd>
        </dl> -->
      </div>
      <!-- <div class="firePoint_info_ft">
        <dl class="text-dl text-dl-width">
          <dt class="text-title">扑救中</dt>
          <dd class="text-num">0</dd>
        </dl>
      </div>      -->
    </div>    
    <div class="firePoint_count">
      共 <span class="textNumber">{{total}}</span> 条结果
    </div> 
    <div class="firePoint_list">
      <div class="firePoint_list_hd">相关列表</div> 
        <!-- <div class="firePoint_search">
          <el-input  placeholder="请输入省份查询" v-model="searchtext" style="color:#abb1ba">
            <i slot="suffix" class="firePointIcon_search" @click="firePointIconsearch"></i>
          </el-input>
        </div> -->
      <el-scrollbar style="height:510px;" v-if="fireListData.length">
      <ul class="firePoint_list_bd" v-loading='loading'>
            <li class="firePoint_list_item" @click="firePointhandle(item)" v-for="(item, index) in fireListData" :key="index">
              <h5 class="text-primary">{{item.hotspot_site || '暂无数据'}}</h5>
              <p class="text-common"> <span>{{item.longitude}}</span> , <span>{{item.latitude}}</span></p>
              <p class="text-common"><span class="text-primary">接收时间：</span>{{item.load_time || '暂无数据'}} </p>
              <p class="text-common"><span class="text-primary">反馈情况：</span>{{ item.hotspot_notes || '暂无数据' }}</p>
              <p class="text-common"><span class="text-primary">监控图像</span></p>
            </li>
      </ul>
      </el-scrollbar>
      <div class="nocontBox" v-else>
        <p class="noeventInfoDatabg"></p>
      </div>
      <div v-show="total > 5">
        <el-pagination
          small
          :pager-count="5"
          class="constomMyElPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size ="pageSize"
          layout="prev, pager, next, total"
          :total="total"
        >
        </el-pagination>
    </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop , Watch} from 'vue-property-decorator';
import { firePoint, getEvemtInfoOrCreatedInfo, eventPushServer, districtServer } from '@/api/installServer';
import EventConfigRegistry from '@/util/eventConfigRegistry';
import EventInfoPop from '@/components/feature/gisModule/popUp/eventInfo.vue';
@Component({
  name: 'FirePointTopics',
    components: {
    EventInfoPop,
  },
})
export default class FirePointTopics extends Vue {
  private continuousfire: any = 0; // 延续火灾
  private addfirepointcount: any = 0; // 今日新增
  private dayHotspots: any = 0; // 当日热点数
  private forestfire: string = ''; // 林火
  private Checkingfire: string = ''; // 核查中
  private Nofeedback: string = ''; // 未反馈
  private fighting: string = ''; // 扑救中
  private searchtext: string = ''; // 输入框的查询内容
  private currentPage: number = 1;
  private pageSize: number = 5;
  private total: number = 0;
  private fireListData: any[] = []; // 列表数组
  private loading: boolean = true;
  private curClass: boolean = true; // 当日火点数
  private addClass: boolean = false; // 当日新增火点数
  private countinuClass: boolean = false; // 延续火点数
  private eventInfo: any;


  // 今日火点数量
  private todayfirecount() {
    this.curClass = true;
    this.addClass = false;
    this.countinuClass = false;
    this.currentPage = 1;
    this.firePointListData();
  }
  // 当日新增火点
  private addfirecount() {
    this.curClass = false;
    this.addClass = true;
    this.countinuClass = false;
    this.currentPage = 1;
    this.firePointListData();
  }
  // 延续火点
  private countinufire() {
    this.curClass = false;
    this.addClass = false;
    this.countinuClass = true;
    this.currentPage = 1;
    this.firePointListData();

  }

  // 搜索数据
  private firePointIconsearch() {
    this.currentPage = 1;
    this.firePointListData();
  }

  // 获取地图组件
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent('firepointinforemationComponent');
    return component;
  }

    // 增加类型
  private eventListCheck() {
    this.fireListData.forEach((item: any) => {
      item.typeCode = 'firepoint';
    });
  }

  // 火点列表数据
  private firePointListData() {
    const that = this;
    that.loading = true;
    const obj = {
        continueFlagCode: '',
        disName: that.searchtext,
        nowPage: that.currentPage,
        pageSize: that.pageSize,
    };
    if (that.curClass) {
      obj.continueFlagCode = '';
    } else if (that.addClass) {
      obj.continueFlagCode = '0';
    } else if (that.countinuClass) {
      obj.continueFlagCode = '1';
    }
    firePoint.getFirePointListDataServer(obj).then((res: any) => {
      that.loading = false;
      if (res.code === 0 && res.data.total > 0) {
        that.total = res.data.total;
        that.fireListData = res.data.list;
        that.eventListCheck();
      } else {
        that.loading = false;
        that.total = 0;
        that.fireListData = [];
      }
      that.showGisDotted();
    }).catch((err: any) => {
      that.loading = false;
      that.total = 0;
      that.fireListData = [];
      that.showGisDotted();
    });
  }

  // 获取统计数据
  private firePointCountData() {
    const that = this;
    firePoint.getFirePointcountServer().then((res: any) => {
      if (res.code === 0 ) {
        that.continuousfire = res.data.continuous; // 延续火灾
        that.addfirepointcount = res.data.tody; // 今日新增
        that.dayHotspots = res.data.count; // 当日热点数
      }
    }).catch((err: any) => {
      that.continuousfire = 0; // 延续火灾
      that.addfirepointcount = 0; // 今日新增
      that.dayHotspots = 0; // 当日热点数
    });
  }

  // 列表数据 点击
  private firePointhandle(item: any) {
    this.eventInfo = item;
    // this.messsageBus.emit('EventInfoToTree', item);
    this.getComponent().locateEvent(item);
  }
  // 翻页
  private handleCurrentChange(val: any) {
    const that = this;
    const obj = {
        continueFlagCode: '',
        disName: that.searchtext,
        nowPage: val,
        pageSize: that.pageSize,
    };
    if (that.curClass) {
      obj.continueFlagCode = '';
    } else if (that.addClass) {
      obj.continueFlagCode = '0';
    } else if (that.countinuClass) {
      obj.continueFlagCode = '1';
    }
    firePoint.getFirePointListDataServer(obj).then((res: any) => {
      if (res.code === 0 && res.data.total > 0) {
        that.total = res.data.total;
        that.fireListData = res.data.list;
        that.eventListCheck();
        that.showGisDotted();
      }
    }).catch((err: any) => {
     // that.ispagination = false;
      that.total = 0;
      that.fireListData = [];
    });
  }

  // 地图标点
  private showGisDotted() {
      this.getComponent().on('EventPointspopup', this.onShowPopup, this);
      this.getComponent().showEvents(this.fireListData);
      this.eventInfoMapShow();
  }
   // 点击常态左侧 '事件信息' 四个字地图标记显隐藏
  private eventInfoMapShow() {
    this.messsageBus.on('eventInfoMapShow', (flagMap: boolean) => {
      this.getComponent().setVisible(flagMap);
    });
  }

  private beforeDestroy() {
    this.getComponent().off('EventPointspopup', this.onShowPopup, this);
    this.getComponent().unload();
    this.messsageBus.off('firepointmodule');
  }

  private onShowPopup(event: any) {
    const eventInfo = this.eventInfo;
    const data = event.data;
    const self = this;
    data.title = data.hotspot_site;
    data.content = data.hotspot_notes || '暂无数据';
    data.reportTime = data.load_time;
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


  // 行政区划
  private getDistrict(data: any) {
    const self = this;
    const optsTest = {
      location: [data.EventLon, data.EventLat],
      level: '2',
    };
    districtServer.getDistrictByLonLat(optsTest).then((dataDis: any) => {
      self.$store.commit('eventPushStore/setDistrict', dataDis.data[0]); // 推送
      self.$store.commit('mapModule/changeDistrictShowName', dataDis.data[0].name);  // 行政区划 地址数据
    });
  }


 // 更改前端的vuex中的event值，以便进入前端处置
  private handleEventupdata(newParamData: any) {
    this.getDistrict(newParamData);
    this.$store.commit('eventPushStore/eventInfoAll', newParamData);
  }
    // 点击进入专题将字段转化成需要的
  private handleEventInfo(sourceData: any) {
    const userName: string = (this.$route ? this.$route.query.loginName : '') || (sessionStorage.loginName ? sessionStorage.loginName : '') || 'eads';
    const paramData: any = {
        collection: '', // 收藏标识：0：未收藏，1：已收藏
        eventAddr: sourceData.hotspot_site,
        eventId: ((sourceData.hotspot_id).replace(/-/g, '')).substr(0, 32), // 事件id（不可为空） 32位
        eventLat: sourceData.latitude.toFixed(6), // 纬度（不可为空）
        eventLon: sourceData.longitude.toFixed(6), // 经度（不可为空）
        eventType:  '9', // 事件类型
        locationPointTime: sourceData.load_time, // 定位点更新时间
        reportMan:  userName, // 上报人（不可为空）
        resourceName:  '', // 资源名称
        userName,
      };
    getEvemtInfoOrCreatedInfo.getfirepointdEventInfo(paramData).then((res: any): void => {
      const {data, code} = res;
      if (code === 0) {
        const eventData: any = {
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
          EventIcon: sourceData._id, // 这里用来隐藏同一个事件进入处置按钮 增加一个全局的事件处置id
          originalEventId: data.originalEventId, // mis端事件id
        };
        EventConfigRegistry.setConfig(eventData.EventType); // 根据事件类型读取配置文件
        /**
         * 经验圈信息全部都在后端拿不在读配置文件
         * */
        this.$store.commit('configModel/setConfig', EventConfigRegistry.config);
        this.handleEventupdata(eventData);
        this.messsageBus.emit('positioningOperation', false);
        this.eventPushToServe(eventData);
        if (this.closeFunc) {
          this.closeFunc();
         }
      } else {
        /**
         * 添加个错误提示
         * */
        console.log(res.msg);

      }
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

  private handleSizeChange(val: any) {
    console.log(val);

  }


  private mounted() {
     // 获取火点列表
    // this.firePointListData();
    // 获取火点统计数据
    // this.firePointCountData();
    this.messsageBus.off('firepointmodule');
    this.messsageBus.on('firepointmodule', (data: any) => {
      if (data) {
         // 获取火点列表
        this.firePointListData();
        // 获取火点统计数据
        this.firePointCountData();
      }
    });
  }
}
</script>
<style lang="less" scoped>
@url:'../../../assets/img/halfScreen/firePoint';
.nocontBox{
    position: relative;
    height: 510px;
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
  .firePoint{
    margin:0 15px 0 10px; 
    // outline:1px solid red;
    padding:0 8px;
    height:845px;
    &Icon_search{
      display: inline-block;
      width:30px;
      height:30px;
      background: url('@{url}/icon_search.png') no-repeat 50% 50%;
      margin-top:5px;
    }
    &_search{  
      cursor: pointer;
      // outline:1px solid red;
      /deep/.el-input__inner{
        background-color:rgba(118,242,251,.1);
        border-color:transparent;
        font-size:24px;
        line-height: 1;;
        height:38px;
        line-height: 38px;;
        color:#abb1ba;
      }
    }
    &_info{
        background:url('@{url}/bg.png') no-repeat 50% 50% ;
        background-size:102% 100% ;
        padding:10px 10px; 
        margin:10px 0px; 
      &_bd{
        box-shadow: inset 0 1px 0 0 #195d7f, inset 0 -1px 0 0 #195d7f;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding:8px 0px;
        margin:8px 0
      }
      &_ft {
        padding:0 0px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      } 

    }
    &_count{
        background:url('@{url}/count-bg.png') no-repeat 0 0 ;
        background-size: 100% 100% ;
        padding:10px;
        line-height: 1;
        font-size:26px;
        color:#d4f2ff;
        margin-bottom:7px;
      // outline:1px solid red;
      }
    &_list{
      // padding:0 5px;
      // outline:1px solid red;
      &_hd{
        background:url('@{url}/list_title_bg.png') no-repeat left 30px;
        padding-bottom:20px;
        // padding-top:20px;
        padding-left:10px;
        font-size: 28px;
        color:#67e1fb;
        // outline:1px solid red;
      }
      &_bd{
        margin:0;
        padding:0 1px;
        list-style: none;
      }
      &_item{
        margin-top:10px;
        box-shadow: inset 0 0 0 1px transparent;
        background-color:rgba(43,191,252,.1);
        cursor: pointer;
        padding:12px;
        &:hover{
        box-shadow: inset 0 0 0 1px #fef551;
        background-color:rgba(215,185,64,.1);
        }        
        h5,p{
          margin:0;
          padding:0;
          line-height: 1.65;
        }

      }

    }
    .text-dl-width{
      width: 50%;
    }
    .text-dl{
      margin: 0;
      box-sizing:border-box;
      border-radius: 4px;;
      padding:5px 0;
      margin:5px 0;
      cursor: pointer;
      .text-title{
        box-sizing:border-box;
        display: table-cell;
        width: 120px;
        font-size: 22px;
        color:#d6f3ff;
        line-height: 1.25;
        white-space: nowrap;
        vertical-align: middle;
        padding-right:10px;
        padding-left:10px;
      }
      .text-num{
        display: table-cell;
        font-family: 'Impact';
        color:#fde517;
        font-size:32px;
        vertical-align: middle;
      }
      
    }
    .text-dl.cur,
    .text-dl:hover{
        box-shadow: 0 0 0 1px #fef551;
        background-color:rgba(215,185,64,.15) ;
      }
    .text-num,
    .textNumber{      
        font-family: 'Impact';
        color:#fde517;
        font-size:32px;
    }
    .text-primary{
      color:#8cafd0;
      font-size:22px;
    }
    .text-common{
      color:#f7fdff;
      font-size:22px;

    }
  }
</style>
