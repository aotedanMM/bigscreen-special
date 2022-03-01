<!-- 进入处置 -->
<template>
    <div>
        <span class="infoManagementBtn f-txt-little" @click="hadleclickmercy(popupData)">进入处置</span>
        <div class="maskbox" v-show="ismaskbox">
          <div class="typecodebox" v-show="isselecttypecode">
            <div class="closetypecodebox" @click="closetypecodebox"></div>
            <div class="typecodebox-container f-txt-com">
            <div class="typecodeboxTitle" :title="popAddress">{{ popAddress }}</div>
            <div class="typecodeboxlonlat">
              <p>经度：<span style="color:#88e2ee">{{ longitude }}</span></p>
              <p>纬度：<span style="color:#88e2ee">{{ dimension }}</span></p>
            </div>
            <p class="bottomline"></p>
            <div class="typecodeboxTitle-box">
              <div class="typecodeboxTitle-box-left">
                <span class="zdbtbg" style="margin-right:5px;margin-left: 5px;"></span><span>事件类型</span>
                </div>
               <el-select class="constomMySelect" v-model="selecttypecode" placeholder="请选择" @change = "queryhandle(popupData)">
                <el-option
                  v-for="item in typeoptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </div>
            <div class='isLike_alertinfo'>
                <div class="isLike f-txt-small"><el-checkbox v-model="isLike">收藏</el-checkbox></div>
                <div><p class="alertinfo f-txt-com" v-text="alertinfo"></p></div>
            </div>
            </div>
            <div class="typecodeboxbtn">
              <p class="querybtn" @click="querybtnlan(popupData)"></p>
            </div>
          </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import uuid from 'uuid';
import { districtServer, eventPushServer } from '@/api/installServer';
import { socketRestServer } from '@/api/feature/normal/installNormalServer';
import {messsageBus} from '@/util/message';
import store from '@/store/index';
import { websoketServer } from '@/api/installServer';
import EventConfigRegistry from '@/util/eventConfigRegistry';
import {getEvemtInfoOrCreatedInfo} from '@/api/installServer';
@Component({
  name: 'InEventInfo',
  store,
})
export default class InEventInfo extends Vue {
  private alertinfo: string = '';
  private ismaskbox: boolean = false;
  private isselecttypecode: boolean = true;
  private longitude: string = '';
  private dimension: string = '';
  private popAddress: string = '';
  private selecttypecode: string = '';
  private typeoptions: any[] = [];
  private isLike = false;
  private isCollection: number = 0;
  // private specialtopic: string = '';

  @Prop()
  private popupData: any;
  /*@Prop({ // 安全生产专题 危化品出详情窗版
    default: '',
  })
  private popupType: any;*/
  // 关闭弹窗函数
  @Prop({
    default: '',
  })
  private closeFunc: any;
  // vueThis this指向的问题 所以需要在上层传下来vue的this  用来获取url中的字段
  @Prop({
    default: '',
  })
  private vueThis?: any;
  private hadleclickmercy(popupData: any) {
    if (!popupData || !popupData.geom || !popupData.geom.coordinates[1] || !popupData.geom.coordinates[0]) {
      return;
    }
    this.popAddress = popupData.address || '暂无数据';
    this.longitude = popupData.geom.coordinates[0].toFixed(6) || '暂无数据';
    this.dimension = popupData.geom.coordinates[1].toFixed(6) || '暂无数据';
    this.ismaskbox = true;
    this.isselecttypecode = true;
    eventPushServer.getInfotypeCode().then((res: any) => {
      if (res.data.code === 0) {
        this.typeoptions = res.data.data;
      }
      }).catch((error: any ) => {
        console.log(error);
      });

  }
  // change
  private queryhandle(popupData: any) {
    if (!this.selecttypecode) {
      this.selecttypecode = '';
      this.alertinfo = '您即将跳转至其它灾害';
    } else {
      const specialtopicname = EventConfigRegistry.getTopicByEventType(this.selecttypecode).label;
      if ((specialtopicname).indexOf('专题') === -1) {
        if ((specialtopicname).indexOf('其它') === -1) {
          this.alertinfo = '您即将跳转至' + specialtopicname + '专题';
        } else {
         this.alertinfo = '您即将跳转至' + specialtopicname ;
        }
      } else {
        this.alertinfo = '您即将跳转至' + specialtopicname ;
      }
    }
  }


  // 确定
  private querybtnlan(popupData: any) {
    this.ismaskbox = false;
    if (this.isLike === true) {
      this.isCollection = 1;
    } else {
      this.isCollection = 0;
    }
    this.handleEventInClick(popupData);
  }

  // 关闭按钮
  private closetypecodebox() {
    this.ismaskbox = false;
  }

  private  handleEventInClick(sourceData: any) {
    if (!sourceData || !sourceData.geom || !sourceData.geom.coordinates[1] || !sourceData.geom.coordinates[0]) {
      return;
    }
    const self: any = this;
    const that: any = this.vueThis || this;
    /**
     * 一键搜创建事件
     * 传输信息 添加至数据库,获取最新数据
     * 如果是地震灾害 没有震级和震源深度信息
     * 需要下次支撑屏推送的时候添加
     * */
      // that: this指向的问题 所以需要在上层传下来vue的this  用来获取url中的字段
    const userName: string = (that.$route ? that.$route.query.loginName : '') || (sessionStorage.loginName ? JSON.parse(sessionStorage.loginName) : '') || 'eads';
    const paramData: any = {
      collection: this.isCollection, // 收藏标识：0：未收藏，1：已收藏
      eventAddr: sourceData.address, // 事件地址
      eventId: (sourceData._id + (uuid().replace(/-/g, ''))).substr(0, 32), // 事件id（不可为空） 32位
      eventLat: sourceData.geom.coordinates[1].toFixed(6), // 纬度（不可为空）
      eventLon: sourceData.geom.coordinates[0].toFixed(6), // 经度（不可为空）
      eventType: self.selecttypecode || '0', // 事件类型
      locationPointTime: self.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), // 定位点更新时间
      reportMan: userName, // 上报人（不可为空）
      resourceName: '', // 资源名称
      userName, // 用户名称（不可为空）
    };
    getEvemtInfoOrCreatedInfo.getCreatedEventInfo(paramData).then((res: any): void => {

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
        self.$store.commit('configModel/setConfig', EventConfigRegistry.config);
        self.handleEventInfo(eventData);
        self.messsageBus.emit('positioningOperation', false);
        self.eventPushToServe(eventData);
        if (self.closeFunc) {
          self.closeFunc();
        }
      } else {
        /**
         * 添加个错误提示
         * */
        console.log(res.msg);
      }
    });
  }

  // 给vuex传的时间 变成xx年xx月xx日 xx时xx分
  /*private timeconvert(eventTimes: any) {
    let timer = '';
    const date = eventTimes.split(' ')[0].split('-');
    const time = eventTimes.split(' ')[1].split(':');
    timer = date[0] + '年' + date[1] + '月' + date[2] + '日' + time[0] + '时' + time[1] + '分';
    return timer;

  }*/

  // 这个组件是在new中的组件引用的，拿不到vuex，所有冒泡给enderpopUpTemplate.vue
  // private handleEventInClick(sourceData: any) {
  //   (messsageBus as any).$emit('inEventInfoBtn', this.emitToPopOrigin , sourceData);
  // }

  // 将popup传过来的数据进行转换成eventPushstore 中的eventLocation数据
  /*private transformData(data: any) {
    const paramData = {
            /!*inEventInfoPopup: { // 安全生产专题 危化品出详情窗版
              popupData: data,
              popupType: this.popupType,
            },*!/
            EventLat: data.geom.coordinates[1], // 纬度
            EventAddr: data.address, // 地点,北京市大观园
            EventLon: data.geom.coordinates[0], // 经度
            // EventLatLonStr: '' + data.geom.coordinates[1] + data.geom.coordinates[0], // 经纬度拼起来的串，给地图监听用。主要用作推送屏点定位的时候，地图进行重定位。
            radius: '', // 影响经验圈 '5,10,20,50'
            // EqLevel: 7.5,
            EventDesc: data.EventDesc, // "2020年03月08日00时56分,北京市大观园发生重大火灾(此信息为测试数据)"
            EventLevel: '', // "严重"
            EventTime: data.EventTime, // "2020年03月08日00时56分"
            EventTimes: data.EventTimes, // "2020-03-08 00:56:14"
            EventTit: data.EventTit, // "11·24演习"
            EventType: this.selecttypecode || '0', // 其他
            eventId: (data._id + (uuid().replace(/-/g, ''))).substr(0, 32),
            EventIcon: data.EventIcon, // 增加一个全局的事件处置id
    };
    EventConfigRegistry.setConfig(paramData.EventType); // 根据事件类型读取配置文件
    paramData.radius = EventConfigRegistry.config.experienceCircle; // 根据配置文件中的经验圈数值进行赋值,这部分代码应该还要写在支撑系统（下面的那个if中）的，因为时间关系，没有写。
    this.$store.commit('configModel/setConfig', EventConfigRegistry.config);
    return paramData;
  }*/

  // 更改前端的vuex中的event值，以便进入前端处置
  private handleEventInfo(newParamData: any) {
    this.getDistrict(newParamData);
    this.$store.commit('eventPushStore/eventInfoAll', newParamData);
  }

  // 根据经纬度获得行政区划
  private getDistrict(data: any) {
    const optsTest = {
      location: [data.EventLon, data.EventLat],
      level: '2',
    };
    districtServer.getDistrictByLonLat(optsTest).then((dataDis: any) => {
      // debugger
      this.$store.commit('eventPushStore/setDistrict', dataDis.data[0]); // 推送
    });
  }

  // 事件回显到新的支撑屏
  private eventPushToServe(item: any) {
    let receiverIds = 'eads';
    const sendSearch = location.hash || location.search;
    const paramName: any = 'loginName=';  // 获取的为userid
    if (sendSearch.indexOf(paramName) !== -1) {
      receiverIds = sendSearch.split(`${paramName}`)[1];
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
  /*private socketInfo(item: any) {
    const sendSearch = location.hash || location.search;
    const message = {
      key: 'SEND_LOCATIONToOperate',
      event: {
        EqLevel: item.magnitude || '',
        EventAddr: item.EventDesc,
        EventDesc: item.title || '',
        EventLat: item.EventLat,
        EventLon: item.EventLon,
        EventTimes: item.EventTimes || '',
        EventTit: item.EventTit,
        EventType: item.EventType,
        eventId: item.eventId,
      },
    };
    const opts = {
      eventId: item.eventId,
      messageType: '0',
      id: item.eventId,
      content: [
        {
          data: JSON.stringify(message),
        },
      ],
      locationKey: 'operator' + sendSearch.split('=')[1],
      messageName: item.eventId,
      receiverIds: 'operator' + sendSearch.split('=')[1],
      senderId: '1',
    };
    websoketServer.websoketServerInfoServer(opts).then((res: any) => {
      if (res.code === 0) {
        console.log('推送成功');
      }
    });
  }*/
}
</script>
<style lang="less">
@imgPath: "../../img";
.maskbox{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,.5);  
    z-index: 1;
      .typecodebox{
          position: relative;
          width: 495px;
          height: 500px;
          background: url("@{imgPath}/typecodebg.png") no-repeat;
          background-size: 100% 100%;
          .typecodebox-container{
            height: 350px;
            margin: 75px 24px 0px 15px;
            overflow: hidden;
            .isLike_alertinfo{
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 97%;
              margin: auto;
              margin-top: 25px;
              height: 40px;
              position: relative;
              &:before{
                content:'';
                width:442px;
                height:1px;
                background: url("@{imgPath}/bottomlinebg.png") no-repeat;
                background-size: 100% 100%;
                position: absolute;
                top: -7px;
                left: 5px;
              }
              .isLike{
                padding-left:15px;
                label{
                  display:flex;
                  align-items: center;
                  .el-checkbox__input{
                    .el-checkbox__inner{
                      width: 18px;
                      height: 18px;
                      border-radius: 4px;
                      border: solid 1px #3ef7fe;
                      background:none;
                    }
                  }
                  .el-checkbox__input.is-checked{
                    .el-checkbox__inner{
                      width: 18px;
                      height: 18px;
                      background-color: rgba(255,245,81,.5);
                      border: solid 1px #fef551;
                      &:after{
                        left: 5px;
                        top: 3px;
                      }
                    }
                  }
                  span{
                    font-size: 26px;
                    color: #1dbad6;
                  }
                }
              }
              .alertinfo{
                color: #1dbad6;
                line-height: 40px;
                width: 100%;
                margin:0;
                text-align: center;
              }
            }
          }
          .closetypecodebox{
            position: absolute;
            right: 6px;
            width: 91px;
            height: 47px;
            background: url("@{imgPath}/closetypecodebg.png") no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
          }
          .closetypecodebox:hover{
            width: 91px;
            height: 47px;
            background: url("@{imgPath}/closetypecodebox.png") no-repeat;
            background-size: 100% 100%;
          }
          .zdbtbg{
            width: 12px;
            height: 12px;
            display: inline-block;
            background: url("@{imgPath}/zdbtbg.png") no-repeat;
            background-size: 100% 100%;
          }
          .typecodeboxTitle{
              color: #b2d1df;
              text-align: left;
              margin-left: 10px;
              line-height: 40px;
              margin-top: 10px;
              margin-bottom: 10px;
              padding-left: 5px;
              background: url("@{imgPath}/oddpbg.png") no-repeat;
              background-size: 100% 100%;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
          }
          .bottomline{
            width: 442px;
            height: 1px;
            margin: 0;
            padding: 0;
            display: inline-block;
            background: url("@{imgPath}/bottomlinebg.png") no-repeat;
            background-size: 100% 100%;
          }
          .typecodeboxlonlat{
              color: #b2d1df;
              padding-left: 10px;
              text-align: left;
              p{
                margin: 0;
                padding: 0;
                line-height: 45px;
                padding-left: 5px;
              }
              p:nth-child(even){
                background: url("@{imgPath}/oddpbg.png") no-repeat;
                background-size: 100% 100%;
              }
          }
          .typecodeboxTitle-box{
            display: flex;
            color: #b2d1df;
            padding-left: 10px;
            padding-top:10px;
          }
          .typecodeboxTitle-box-left{
            margin-right: 10px;
            line-height: 40px;
          }
          .el-select{
            width: 68%;
            margin-left: 2px;
            .el-input__inner{
                  border: 1px solid #4a95a1;
                  background-color:transparent;
                  color: #b2d1df;
            }

          }
      }
      .typecodeboxbtn{
        display: flex;
        padding-left: 320px;
        .junmbtn{
            width: 109px;
            height: 43px;
            display: inline-block;
            background: url("@{imgPath}/jumptypecodebt.png") no-repeat;
            background-size: 100% 100%;
            margin: 0;
            margin-right: 20px;
            cursor: pointer;
        }
        .querybtn{
            width: 152px;
            height: 56px;
            display: inline-block;
            background: url("@{imgPath}/savetypecodebtn_new.png") no-repeat;
            background-size: 100% 100%;
            margin: 0;
            cursor: pointer;
        }
      }
       
    }
  
</style>
<style scoped lang="less">
    .infoManagementBtn{
        width: 130px;
        height: 64px;
        line-height: 64px;
        text-align: center;
        cursor: pointer;
        font-family: "Microsoft YaHei";
        color: #fff;
        text-transform: uppercase;
        z-index: 136;
        background: url("../../../../../assets/img/eventInfo/guihua.png") no-repeat;
        background-size: 100% 100%;
        margin-left: 10px;
        display: inline-block;
        &:hover{
          background: url("../../../../../assets/img/eventInfo/guihua_hover.png") no-repeat;
          background-size: 100% 100%;
        }
    }
    
</style>
