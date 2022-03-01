<template>
  <div id="DamageCasualtiesGIS">
    <span class="showModule" v-show="!moduleIsShow" @click="changeModuleIsShow"></span>
    <div class="detail" v-show="moduleIsShow">
       <div class="title">
        <span class="closeModule" @click="changeModuleIsShow"></span>
        <span >{{ textType }}</span>
      </div>
      <ul class="dieTotalBox">
        <li @click="checkListFunc('all')" :class="isCheckObj === 'all' ? 'checkSty' : ''">
          共
          <span>{{ allListNum }}</span>
          处{{ textType }}
        </li>
      </ul>
      <ul class="dieListBox">
        <li
          v-for="(item, index) in listData"
          :key="index"
          @click="checkListFunc(index, item)"
          :class="isCheckObj === index ? 'checkSty' : ''"
        >
          <span class="name">名称</span>
          <span class="address">{{ item.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import MapDialogTitle from '@/views/theme/decisionSupport/common/MapDialogTitle.vue';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import MapCommon from '@/util/MapCommon';
@Component({
  name: 'DamageCasualtiesGIS',
  mixins: [MapCommon],
  components: {
    MapDialogTitle,
  },
})
export default class DamageCasualtiesGIS extends Vue {
  @Prop() private listData: any;
  @Prop({ default: 0 }) private allListNum: any;
  @Prop() private textType: any;
  @Prop() private isblock: any;
  private listCheck: any = 'all';
  private isCheckObj: any = 'all';
  private moduleIsShow: boolean = true;
  private changeModuleIsShow() {
    this.moduleIsShow = !this.moduleIsShow;
  }
  private checkListFunc(index: any, item: any) {
    const self = this;
    let type: string = '';
    if (this.isblock === '1' || this.isblock === 1) {
      type = 'dlsh';
    } else if (this.isblock === '0' || this.isblock === 0) {
      type = 'lstd';
    } else {
      type = 'jtgz';
    }
    this.isCheckObj = index;
    this.messsageBus.emit('ToolTablePoint', '');
    if (index === 'all') {
      this.getComponent().closePopup();
      this.getComponent().load( type , this.listData);
    } else {
      this.getComponent().locate(item.lineId);
      this.messsageBus.emit('ToolTablePoint', item.lineId);
    }
    // this.messsageBus.emit('trafficToolTable', this.listData);
  }
  // 联动gis方法 开始
  private getComponent() {
    let component = null;
    const factory = this.$ioc.resolve('GISFactory-map');
    if (factory) {
      component = factory.commonFactory.getComponent('trafficStatus');
    }
    return component;
  }
  @Watch('listData')
  private mapChange() {
    this.isCheckObj = 'all';
    if (this.listData.length <= 0) {
      return false;
    }
    this.getComponent().closePopup();
    if (this.isblock === '1' || this.isblock === 1) {
      this.getComponent().load('dlsh', this.listData);
    } else if (this.isblock === '0' || this.isblock === 0) {
      this.getComponent().load('lstd', this.listData);
    } else {
      this.getComponent().load('jtgz', this.listData);
    }
    this.messsageBus.emit('trafficToolTable', this.listData);
  }
  private onShowPopup(event: any) {
    const eventLocation = [
      this.$store.state.eventPushStore.eventLocation.EventLon,
      this.$store.state.eventPushStore.eventLocation.EventLat,
    ];
    const  self = this;
    const param = {
        that: self,
        eventLocation, // 添加事故点定位经纬度
        popupId: 'popup',  //  监听id，必须
        moduleTypeID: 'trafficStatus', //  实体类资源模块id，必须
    };
    const popUpTemplate = new renderpopUpTemplate();
    popUpTemplate.getParams(param);
    popUpTemplate.onShowPopup(event);
    for (const v in this.listData) {
      if (event.data.lineId === this.listData[v].lineId) {
        this.isCheckObj = Number(v);
      }
    }
  }
  private mounted() {
    this.getComponent().off('popup', this.onShowPopup, this);
    this.getComponent().on('popup', this.onShowPopup, this);
  }
}
</script>
<style lang="less" scoped>
@path: '../../../../assets/img/gisModule/districtDialog'; // 定义路径
@import url('../../../../assets/css/popUp/statistic.less');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.checkSty {
  box-shadow: 0 0 50px rgb(240, 234, 17) inset;
}
#DamageCasualtiesGIS {
  width: 405px;
  height: auto;
  // .showModule {
  //   position: absolute;
  //   top: 5px;
  //   left: 14px;
  //   background: url('@{path}/zhankaibutton.png') center top no-repeat;
  //   width: 44px;
  //   height: 54px;
  //   display: inline-block;
  //   position: absolute;
  //   cursor: pointer;
  // }
  // .closeModule {
  //   background: url('@{path}/iconClose.png') center top no-repeat;
  //   width: 37px;
  //   height: 33px;
  //   display: inline-block;
  //   position: absolute;
  //   cursor: pointer;
  //   right: 42px;
  //   top: 3px;
  // }
  li {
    list-style-type: none;
  }
  // .dieTotalBox {
  //   width: 100%;
  //   padding: 0;
  //   margin: 10px 0px;
  //   li {
  //     // font-size: 28px;
  //     cursor: pointer;
  //     color: #ffffff;
  //     font-weight: bolder;
  //     background: rgba(7, 25, 65, 0.8);
  //     background-size: 100% 100%;
  //     border-radius: 20px;
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //     span {
  //       font-size: 40px;
  //       cursor: pointer;
  //       margin: 0 10px 0 10px;
  //       color: #ff8d10;
  //       font-weight: 600;
  //       display: flex;
  //       align-items: center;
  //     }
  //   }
  // }
  .dieListBox {
    height: 450px;
    overflow-y: scroll;
    li {
      width: 100%;
      background: rgba(7, 25, 65, 0.8);
      background-size: 100% 100%;
      border-radius: 20px;
      margin-bottom: 10px;
      cursor: pointer;
      color: #ffffff;
      padding: 10px 20px;
      .name {
        background: rgba(129, 125, 125, 0.61);
        display: inline-block;
        padding: 5px 10px;
        font-size: 24px;
        color: #fff;
        border-radius: 10px;
      }
      .address {
        font-size: 20px;
        color: #fff;
        padding: 5px 10px;
        font-size: 24px;
      }
      .listCont {
        display: flex;
        flex-direction: column;
        font-size: 24px;
      }
    }
  }
  .dieListBox::-webkit-scrollbar {
    display: none;
  }
}
</style>
