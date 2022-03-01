<template>
  <!-- 地震速报 -->
    <div class="eventinfo"   v-if="value">
      <div class="eventinfo_title">
        <span class="eventinfo_title_txt">地震速报</span>
        <span class="closed-container" @click="$emit('input',!value)">
          <span class="panel_btnClose"></span> 
        </span>
      </div>
      <div class="eventinfo_select">
        <el-input class="csmMyInput" v-model.trim="inputVal" placeholder="请输入事件名称"></el-input>
        <div class="timerbuttonhandle">
          <p :class="item.select?'selecttimerbghhhover':'selecttimerbghh'"
          v-for="(item, index) in selecttimebutton" 
          :key="index" 
          @click="selectbuttonhandle(item)">
          {{item.text}}
          </p>
          <!-- <p @click="threeDay" class="selecttimerbghhhover">三天</p>
          <p @click="onrWeek" class="selecttimerbghh">一周</p>
          <p @click="oneMonth" class="selecttimerbghh">一月</p>
          <p @click="oneYear" class="selecttimerbghh">一年</p> -->
        </div>
        
        <el-date-picker class="csmMyInput datapicker"
        v-model="TimeoptionsValue"
        type="daterange"
        align="right"
        unlink-panels
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        range-separator="至"
        :editable='false'
        :clearable='false'
        @change="datapickerChange"
      >
    </el-date-picker>
    <div class="totalbgselectbg">查询结果 <span>{{total}}</span> 条 </div>
      </div>
      <div class="eventinfo_content" v-if='total'>
        <el-scrollbar  class="cmp-scrollbar-y" style="height:100%">
          <ul class="eventinfo_content_ul" >
            <li
              class="eventinfo_content_ul_single f-txt-com"
              v-for="(item, key) in list.list"
              @click="clickHandle(item)"
              :key="key"
            >
                <div class="eventinfo_content_ul_single_time">
                  <span class="orderNum">{{(currentPage - 1) * pageSize + key + 1}}</span>
                  <p class="eventinfo_content_ul_single_time_p">
                    <!-- 发布时间： -->
                    <span class="time">{{ item.releaseTime }}</span>
                  </p>
                </div>
                <div class="eventinfo_content_ul_single_txt" :title="item.content">
                  
                  <span class="span"></span>
                  {{ item.content }}<br/>
                  纬度:<span class="primary-text">{{ item.latitude }}</span>
                  经度:<span class="primary-text">{{ item.longitude }}</span>
                </div>
            </li>
          </ul>
        </el-scrollbar>
            <el-pagination
          small
          :pager-count="5"
          class="constomMyElPage"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
      <div class="nothingData--bg" v-else>
        <p class="noeventInfoDatabg--bg"></p>
      </div>
    </div>

  
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { IEventinfo } from '../../../../interface/feature/earthquake/Eventinfo.interface';
import { districtServer } from '@/api/installServer';
import { websoketServer } from '@/api/installServer';
import { socketRestServer } from '@/api/feature/normal/installNormalServer';
import {eventPushServer} from '@/api/installServer';
import {getEvemtInfoOrCreatedInfo} from '@/api/installServer';
import EventConfigRegistry from '@/util/eventConfigRegistry';
/***
 * 事件列表组件
 */
@Component({
  name: 'EventinfoList',
})
export default class EventinfoList extends Vue {
  @Prop({ default: () => [] }) public list?: any;

  // 是否进行显示boolean
  @Prop({default: false}) public value?: boolean;
  private eventInfoStore: any = {
    radius: '',
    eventId: '',
    curLocationKey: '',
    EventType: '',
    EventTit: '',
    EventTimes: '',
    EventTime: '',
    EventLon: '',
    EventLevel: '',
    EventLat: '',
    EventDesc: '',
    EventAddr: '',
    EqLevel: '',
  };
  private TimeoptionsValue: any = [new Date().getTime() - 3600 * 1000 * 24 * 3, new Date()];
  private inputVal: string = '';
  private currentPage: number = 1;
  private pageSize: number = 10;
  private total: number = 0;
  private selecttimebutton: any[] = [
      {
        text: '三天',
        clasname: 'selecttimerbghhhover',
        select: true,
      },
      {
        text: '一周',
        clasname: 'selecttimerbghh',
        select: false,
      },
      {
        text: '一月',
        clasname: 'selecttimerbghh',
        select: false,
      },
      {
        text: '一年',
        clasname: 'selecttimerbghh',
        select: false,
      },
    ];
@Watch('list')
private getlistlength(val: any) {
  // this.total = val.total;
   this.total = val.total;
   if (this.inputVal) {
     this.total = this.list.list.length;
   }

}
  // 时间段搜索
@Watch('TimeoptionsValue')
private getTimeoptionsValue(val: any) {
  const obj = {
    timer: val,
    inputvalue: this.inputVal,
    current: 1,
    pageSize: this.pageSize,
  };
  this.messsageBus.emit('getSearchDataList', obj);
}

// 关键字搜索
@Watch('inputVal')
private searchinputVal(val: any) {
  const obj = {
    timer: this.TimeoptionsValue,
    inputvalue: val,
    current: 1,
    pageSize: this.pageSize,
  };
  this.messsageBus.emit('getSearchDataList', obj);
}

// datapicker 改变时间执行
private datapickerChange(val: any) {
  this.uncheckhandle();
}

// 所有的时间button取消选中
private uncheckhandle() {
    for (const ele of this.selecttimebutton) {
      ele.select = false;
    }
}
// 选择时间段
private selectbuttonhandle(item: any) {
  this.uncheckhandle();
  this.currentPage = 1;
  switch (item.text) {
      case'三天':
          this.TimeoptionsValue = [new Date().getTime() - 3600 * 1000 * 24 * 3, new Date()];
          item.select = true;
          break;
      case'一周':
          this.TimeoptionsValue = [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()];
          item.select = true;
          break;
      case'一月':
          this.TimeoptionsValue = [new Date().getTime() - 3600 * 1000 * 24 * 30, new Date()];
          item.select = true;
          break;
      case'一年':
          this.TimeoptionsValue = [new Date().getTime() - 3600 * 1000 * 24 * 365, new Date()];
          item.select = true;
          break;
    }
  }


// 页码点击
private handleCurrentChange(val: any) {
    const obj = {
    timer: this.TimeoptionsValue,
    inputvalue: this.inputVal,
    current: val,
    pageSize: this.pageSize,
  };
    this.messsageBus.emit('getSearchDataList', obj);

}
  private clickHandle(item: any) {
    this.$store.commit('earthQuake/setEarthQuakeIntensityData', {});
    this.$emit('choice', item);
    // this.$emit('input', !this.value);
    this.handleEventInfo(item);
    // 事件回显 TODO 到一线操作屏
    // this.socketInfo(item);
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

  // 展示屏向推送屏推送消息
  private socketInfo(item: any) {
    let receiverIdsNew = '';
    const sendSearch = location.hash || location.search || window.sessionStorage.loginName;
    if (sendSearch.indexOf('=') !== -1) {
      receiverIdsNew = sendSearch.split('=')[1];
    } else {
      receiverIdsNew = sendSearch;
    }
    const message = {
      key: 'SEND_LOCATIONToOperate',
      event: {
        EqLevel: item.magnitude,
        EventAddr: item.locale,
        EventDesc: item.content,
        EventLat: item.latitude,
        EventLon: item.longitude,
        EventTimes: item.releaseTime,
        EventTit: item.content,
        EventType: item.typeCode,
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

  private handleEventInfo(item: any) {
    /*this.eventInfoStore.eventId = item.id;
    // 点击的时候清空推送 定位字段
    this.eventInfoStore.curLocationKey = '';
    // this.eventInfoStore.EventType = item.typeCode;
    this.eventInfoStore.EventType = '1';
    this.eventInfoStore.EventTit = item.content;
    this.eventInfoStore.EventTimes = item.releaseTime;
    this.eventInfoStore.EventLon = item.longitude;
    this.eventInfoStore.EventLat = item.latitude;
    this.eventInfoStore.EventDesc = item.content;
    this.eventInfoStore.EventAddr = item.locale;
    this.eventInfoStore.EqLevel = item.magnitude || '';*/
    /**
     * 需要用eventId  和 userName 获取对应事件信息
     * 1. 在session storage中获取用户名 userName(存储的叫 loginName)
     * 2. 根据 id 和 userName获取信息, 因为本地开发不存在userName  所以这里要做容错
     * */
    const info: any = {
      id: item.id,
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
          EventLatLonStr: '', // 经纬度拼起来的串，给地图监听用。主要用作推送屏点定位的时候，地图进行重定位。
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
        EventConfigRegistry.setConfig(this.eventInfoStore.EventType); // 根据事件类型读取配置文件
        this.$store.commit('configModel/setConfig', EventConfigRegistry.config);
        this.eventStore();
        // 事件信息回显到新的操作屏
        this.eventPushToServe(this.eventInfoStore);
      } else {
        console.log(res.msg);
      }
    });
  }
  private eventStore() {
    this.getDistrict(this.eventInfoStore);
    this.$store.commit('eventPushStore/intoSpecial', this.eventInfoStore);
    // 调用接口通知推送屏
  }
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
}
</script>
<style lang="less" scoped>
@imgUrl: '../../../../assets/img/eventInfo/';
.datapicker.el-date-editor.el-input__inner {
  width: 100%;
}
.totalbgselectbg{
  width: 359px;
  height: 44px;
  background: url(../../../../assets/img/default/panel/totalbgselectbg.png) no-repeat;
  background-size: 100% 100%;
  color: #fff;
  font-size: 26px;
  padding-left: 25px;
  margin-top: 20px;
  line-height: 44px;
  span{
    font-family: 'Impact';
    color: #ffe615;
    font-size: 28px;
  }
}
.timerbuttonhandle{
  width: 100%;
  display: flex;
  height: 40px;
  margin: 15px 0;
  p{
    margin: 0;
    width: 24%;
    height: 100%;
    line-height: 40px;
    text-align: center;
    color: #fff;
    font-size: 26px;
    cursor: pointer;
  }
  p:hover{
    background: url(../../../../assets/img/default/panel/selecttimerbghhhover.png) no-repeat;
    background-size: 100% 100%;
  }
  .selecttimerbghh{
    width: 84px;
    height: 37px;
    background: url(../../../../assets/img/default/panel/selecttimerbghh.png) no-repeat;
    background-size: 100% 100%;
    margin-left: 5px;
  }
  .selecttimerbghhhover{
    width: 84px;
    height: 37px;
    background: url(../../../../assets/img/default/panel/selecttimerbghhhover.png) no-repeat;
    background-size: 100% 100%;
    margin-left: 5px;
  }
}
.nothingData--bg{
    position: relative;
    height: 630px;
    margin-right: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    .noeventInfoDatabg--bg{
      width: 165px;
      height: 163px;
      background: url(/img/noData.645c4a4f.png) no-repeat;
      background-size: 100% 100%;
      // margin: 250px auto; 注释这句是为了兼容ie11.
    }
}

.closed-container{
  width:52px;
  text-align:center;
  padding-left:12px;
}
// .eventinfo-popup{
//   left: 50%;
//   position: absolute;
//   top: 53.5%;
//   transform: translate(-50%, -47%);
//   width: 1184px;
//   height:830px;
//   padding: 38px 62px 57px 62px;
// }

.eventinfo {
  /*position: fixed;*/
  // left: calc(50% - 572px);  
  z-index: 4;
  box-sizing:border-box;
  margin:0 12px 0 15px;
  &_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffde00;
    height: 60px;
    // font-size: 20px;
    font-weight: 600;
    padding-left:40px;
    line-height: 60px;;
    margin-bottom:5px;
    &_close {
      cursor: pointer;
      width: 92px;
      height: 66px;
      background: url('@{imgUrl}/infolistclose.png') no-repeat center / 100% 100%;
      position: absolute;
      right: 45px;
      top: 35px;
    }
  }
  &_select{
   margin-right:10px;
  }
  &_content {
    height: calc(100% - 100px);
    // overflow: hidden;
    margin:0 0px 0 8px;

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
        // font-size: 20px;
        display: flex;
        flex-direction: column;
        padding-bottom: 5px;
        margin-bottom: 5px;
        cursor: pointer;
        border-radius: 5px;

        // &:first-child{          
        //   background-image:linear-gradient(top,rgba(72,223,255,.23) 10%, rgba(0,156,255,.18)) ;
        //   border:1px solid #088d91;
        //   margin-left:30px;
        //   padding-left:0;
        //   position:absolute;
        //   z-index: 2;
        //   top:0;
        // }
       
        &:first-child {    
          span.dot{
          left: 6px;
          width: 14px;
          height: 14px;
          }      
        }
        // &:hover{
        //   background: url('@{imgUrl}/infolisttitlebg_hover.png') no-repeat center / 100% 100%;
        // }
        > div {
          // height: 55px;
          margin: 0 2em;
        }
        span {
          color: #e5f4ff;
          // text-decoration: underline;
        }
        span.orderNum{
          background: rgba(71, 215, 162, 0.2);
          border: 1px #47d7a2 solid;
          border-radius: 5px;
          color: #fff;
          font-size: 24px;
          padding: 0 5px;
          display: inline-block;
          font-style: normal;
          margin-right: 10px;
        }
        span.time{
          display: block;
          background: url('../../../../assets/img/eventInfo/locationbg.png') no-repeat 0 0 ;
          background-size:100% 100%;
          padding:5px;
          color:#52728c;
          // outline:1px solid red;
        }
        span.primary-text{
          color:#00fffc
        }
        &_time {
          display: flex;
          align-items: center;
          // &::before {
          //   content: '';
          //   width: 30px;
          //   height: 30px;
          //   background: url('@{imgUrl}/infolisttimeicon.png') no-repeat center /
          //     100% 100%;
          //   margin-right: 10px;
          // }
          &_p{
            margin-block-start: 0.2em!important;
            margin-block-end: 0.2em!important;
          }
        }
      }
    }
  }
}

 

.eventinfo_content{
  height:575px;
  margin-bottom: 40px;
}
.eventinfo_title{
  display: none;
}
.eventinfo_content_ul_single > div{
  margin-left:10px;
  margin-right:0; 
}
.cmp-scrollbar-y{
  margin-top: 15px;
}
.cmp-scrollbar-y .el-scrollbar__wrap{
    overflow-x:hidden;
  // margin-right: -18px!important; 
}
</style>
