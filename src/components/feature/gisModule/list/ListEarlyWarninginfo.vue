<template>
<div class="hotspot_early_warning_infor_popu-wrap" v-if="type">
  <div class="minimize-position" @click="toMinify" v-if="isShow" ></div>
    <div class="hotspot_early_warning_infor_popu"  v-else>
      <h2 class="hotspot_popu_title">
        <span>{{titles}}</span>预警信息
      </h2>
      <div class="hotspot_popu_opreate">
        <!-- <span class="hotspot_popu_minify" @click="toMinify"></span> -->
        <span class="hotspot_popu_close" @click="close"></span>
      </div>
      <div class="hotspot_popu_cont">
        <el-scrollbar
          class="cmp-scrollbar-y"
          style="height:calc(100% - 18px)"
          v-loading="loadingList"
        >
          <ul>
            <template v-if="listData.length>0">
              <li
                class="hotspot_popu_li"
                v-for="(item,index) in listData"
                :key="index"
                @click="clickItemEvent(item,index)"
                :class="activeIndex === index&&'active'"
                :type="item.type"
              >
                <img v-if="item.signallevel == '红色'" :src="getImgUrl(item.typeCode+'_01')" />
                <img v-else-if="item.signallevel == '橙色'" :src="getImgUrl(item.typeCode+'_02')" />
                <img v-else-if="item.signallevel == '黄色'" :src="getImgUrl(item.typeCode+'_03')" />
                <img v-else-if="item.signallevel == '蓝色'" :src="getImgUrl(item.typeCode+'_04')" />
                <img v-else-if="item.signallevel == '灰色'" :src="getImgUrl(item.typeCode+'_05')" />
                <p>
                  <span :title="item.sender">{{item.sender}}</span>
                  <span>{{item.time}}</span>
                </p>
              </li>
            </template>
            <template v-if="isShowNo" >
              <li
                style="box-sizing:border-box;height:500px;"
              ><div class="nothingData--bg"></div></li>
            </template>
          </ul>
        </el-scrollbar>
      </div>
    </div>
</div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import EventInfoPop from '@/components/feature/gisModule/popUp/eventInfo.vue';
import { IEventinfo } from '@/interface/feature/earthquake/Eventinfo.interface';
import { warningInfoServer } from '@/api/installServer';
import { getDateFormat } from '@/util/tools';
import MapCommon from '@/util/MapCommon';
@Component({
  name: 'ListEarlyWarninginfo',
  mixins: [MapCommon],
  components: {
    EventInfoPop,
  },
})
export default class ListEarlyWarninginfo extends Vue {
  // 显示状态
  private isShow: boolean = false;
  private flag: boolean = true;
  private activeIndex = -1;
  private titles = '森林火险';
  private listData = [];
  private loadingList = false;
  private isShowNo = false;
  private eventInfoPop: any = null;
  private eventInfoData: IEventinfo[] = [];
  // eventInfo默认的初始化数据
  private eventInfo: IEventinfo = {
    id: '',
    title: '',
    eventType: '',
    typeCode: '',
    reportTime: '',
    location: '',
    longitude: '',
    latitude: '',
  };
  @Prop() private earlyWarninginfo!: any;
  @Prop() private type: any;
  public beforeDestroy() {
    this.getComponent().off('EventPointspopup', this.onShowPopup, this);
    this.getComponent().unload();
  }
  // 当操作屏定位后弹框消失
  @Watch('$store.state.eventPushStore.eventLocation.EventLatLonStr')
  @Watch('$store.state.configModel.config')
  public onEventLocate() {
    this.messsageBus.emit('listEarlyWarninginfoEmit', []);
    this.messsageBus.emit('idShow', -1);
    this.getComponent().closePopup();
  }

  // 监听数据是否有变化
  @Watch('earlyWarninginfo')
  private handlerEarlyWarninginfoChange(val: any) {
    const parentData = JSON.parse(JSON.stringify(val));
    this.titles = parentData.name;
    this.listData = [];
    this.getListData(parentData);
    if (this.getComponent()) {
      this.getComponent().clearAll();
    }
    // 再次点击默认展开列表
    this.isShow = false;
    // 再次点击列表条目恢复不选中状态
    this.activeIndex = -1;
  }

  @Watch('type')
  private typeWatch() {
    // 其他的时候没有类型
    if (!this.type) {
      this.close();
    }
  }
  private getImgUrl(url: any) {
    try {
      return require('../../../../assets/img/warningInfo/warnimg/' + url + '.png');
    } catch {
      // console.log('图片不存在');
      return require('../../../../assets/img/warningInfo/warnimg/11001_01.png');
    }
  }

  private toMinify() {
   this.isShow = !this.isShow;
    // this.close();
  }

  private close() {
    // 关闭弹窗 关闭高亮
    this.messsageBus.emit('listEarlyWarninginfoEmit', []);
    this.messsageBus.emit('idShow', -1);
    this.getComponent().clearAll();
  }
  private getListData(item: any) {
    /* 接口可能存在没有catch loading暂时先不调用 */
    this.loadingList = true;
    this.isShowNo = false;
    if (!item.type) {
      return;
    }
    warningInfoServer
      .getTypeData({
        type: item.type,
        startTime: getDateFormat({ last: 'year' }), // quarter day3
        endTime: getDateFormat(),
      })
      .then((res: any) => {
        if (res && res.data.length > 0) {
          this.listData = res.data;
          this.isShowNo = false;
        } else {
          this.isShowNo = true;
        }
        this.getComponent().addResource(res.data);
        this.loadingList = false;
      })
      .catch((e: any) => {
        this.loadingList = false;
      });
  }

  private created() {
    this.handlerEarlyWarninginfoChange(this.earlyWarninginfo);
    // 右侧功能性按钮预警信息消失，预警弹框也要消失
    this.messsageBus.on('earlyWarningFrame', (data: any) => {
        this.close();
    });
  }
  private getComponent() {
    let component = null;
    const factory = this.$ioc.resolve('GISFactory-map');
    if (factory) {
      component = factory.normalFactory.getComponent('eventWarnInfor');
    }
    return component;
  }

  /**
   * 处理地图上点位的点击事件，用来对表格的缩小和高亮进行处理
  */
  private handleMapClick(event: any) {
    this.isShow  = true; // 缩小列表
    const targetIndex = this.listData.findIndex( (item: any, index: number) => {
      return (item.id === event.data.id);
    });

    this.activeIndex = targetIndex; // 高亮行数
  }


  private onShowPopup(event: any) {
    let eventInfo: any = {};
    if (event.mapClick) {
      eventInfo = {
        title: event.data.sender,
        content: event.data.cont,
        reportTime: '',
      };
    } else {
      eventInfo = this.eventInfo;
    }
    const self = this;
    this.eventInfoPop = new EventInfoPop({
      el: '#' + event.id,
      data() {
        return {
          data: eventInfo,
          config: {
            title: 'title',
            content: 'content',
            time: 'reportTime',
            icon: 'eventType',
            code: 'typeCode',
          },
        };
      },
      methods: {
        // 这个是关闭操作
        close() {
          self.getComponent().clearPopup();
          self.getComponent().hideHighlight();
          self.activeIndex = -1;
        },
      },
    });
    this.handleMapClick(event);
  }
  // 点击出现弹窗
  private clickItemEvent(item: any, index: number) {
    const self = this;
    if (this.eventInfoPop) {
      self.getComponent().clearPopup();
    }
    this.activeIndex = index;
    // console.log(item);
    // 列表点击事件
    // 存储信息
    this.eventInfo = {
      id: item.id,
      title: item.sender,
      content: item.cont,
      reportTime: '',
      location: '',
      longitude: item.longitude,
      latitude: item.latitude,
      typeCode: item.typeCode,
      eventType: (() => {
        switch (item.signallevel) {
          case '红色':
            return '01';
          case '橙色':
            return '02';
          case '黄色':
            return '03';
          case '蓝色':
            return '04';
          case '灰色':
            return '05';
        }
        return '';
      })(),
    };
    this.getComponent().locateEvent({
      id: item.id,
      eventType: item.eventType,
      typeCode: item.typeCode,
      message: item.eventType,
      x: item.longitude,
      y: item.latitude,
    });
    this.toMinify();
  }
  private mounted() {
    (this as any).resolveMap.call(this, 'map').then(() => {
      this.getComponent().on('EventPointspopup', this.onShowPopup, this);
      // this.getComponent().showEvents(this.eventInfoData);
    });
  }
}
</script>
<style  lang="less">
/* 修改loading和混动条样式 */
.hotspot_popu_cont {
  .el-loading-mask {
    background-color: transparent;
  }
  .el-scrollbar__wrap {
    overflow: auto;
  }
}
</style>
<style scoped  lang="less">
@url: '../../../../assets/img/warningInfo/';
@panelImg: '../../../../assets/img/panel';
.hotspot_early_warning_infor_popu-wrap{
  position:absolute;
  left:80px;
  top:50%;
  margin-top:-310px;
  z-index: 3;
}
// .hotspot_early_warning_infor_minify {
//   position:absolute;
//   left:-47px;
//     left:50%;
//     width:110px;;
//     height:36px;
//   background:url('@{panelImg}/toMinifyBtn.png') no-repeat 50% 50%;
//   transform: rotate(90deg);
//   cursor:pointer;
// }

.hotspot_popu_opreate{
  position:absolute;
  right:20px;
  margin-top:-35px;
  // top:32px;
}
/*弹框*/
.hotspot_early_warning_infor_popu {  
  padding: 29px 20px 19px;
  width: 480px;
  height: 655px;
  background: url('@{url}eventBg2.png') no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
}
.hotspot_popu_title {
  color: #00e4ff;
  background-image: -webkit-linear-gradient(top, #fffd73 10%,#ffffff ,#1ae7ff 50%);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  font-size: 30px;
  line-height: 52px;
  position: relative;
  margin: 5px 0 0 30px;
  width: 65%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;
  user-select: none;
  top: -22px;
}
.hotspot_popu_close {
  display: inline-block;
  cursor: pointer;
  width:80px;
  height: 35px;
  background: url("../../../../assets/img/halfScreen/eventAndTopics/eventAndTopics_close.png");
  background-size: 100% 100%;
  position: absolute;
  right: -18px;
  top: -48px;
  &:hover{
    background-image: url("../../../../assets/img/halfScreen/eventAndTopics/eventAndTopics_close_h.png");
  }
}
.hotspot_popu_minify{ 
  font-size: 20px;
  display: inline-block;
  cursor: pointer;
    width:110px;
    height:36px;
  text-align: center;
  text-shadow: 0 0 5px rgba(6,22,51,.5);
  font-weight: bold;
  &:after{
    content: '';
    width:20px;
    height:3px;
    display: inline-block;
    // background-color: #00f0ff;
    background-color:#00f0ff;
    position: absolute;
    left:72%;
    margin-left:-30px;
    right:0;
    top:50%;
    margin-top:-9px;
  }

}
.hotspot_popu_cont {
  height: calc(100% - 72px);
  margin: 10px 10px;
  ul {
    /*  width: 100%;
    height: 100%;
    overflow: auto; */
    height: 100%;
    margin:0;
    padding:0;
    & > .hotspot_popu_li {
      height: 80px;
      display: flex;
      padding: 10px 10px;
      align-items: center;
      cursor: pointer;
      &.active,
      &:hover {
        background: rgba(215,185,64,0.15);
        /*linear-gradient(*/
        /*        #fcff00,*/
        /*        #fcff00);*/
        /*background-blend-mode: normal,*/
        /*normal;*/
        border-bottom: solid 1px #fef551;
      }
      & > img {
        width: 67px;
        height: 67px;
        margin-right: 8px;
      }
      & > p {
        width: calc(100% - 92px);
        position: relative;
        & > span {
          display: inline-block;
          font-size: 30px;
          color: #ffffff;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          // cursor: pointer;
          &:last-child {
            font-size: 20px;
            color: rgba(255, 255, 255, 0.6);
          }
        }
      }
    }
    & > li {
      height: 80px;
      display: flex;
      padding: 10px 10px;
      align-items: center;
      cursor: default;
      user-select: none;
    }
  }
  .yujing_active {
    background: url('@{url}yujing_active.png') no-repeat;
    background-size: 100% 100%;
  }
}
.cmp-scrollbar-y .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
