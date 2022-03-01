<template>
  <div id="HousesDamagedGis">
    <span
      class="showModule"
      v-show="!moduleIsShow"
      @click="changeModuleIsShow"
    ></span>
    <div class="detail" v-show="moduleIsShow">
       <div class="title">
        <span class="closeModule" @click="changeModuleIsShow"></span>
        <span >房屋损毁</span>
      </div>
      <ul class="dieTotalBox">
        <li
          @click="checkListFunc('all')"
          :class="listCheck === 'all' ? 'checkSty' : ''"
        >
          房屋损毁共<span>{{ allHouseDamage }}</span
          >处
        </li>
      </ul>
      <ul class="dieListBox">
        <li
          v-for="(i, index) in listData"
          :key="index"
          @click="checkListFunc(index)"
          :class="listCheck === index ? 'checkSty' : ''"
        >
          <span class="address">{{ i.parentName }}</span>
          <div class="listCont">
            <span> <span>严重受损：</span>{{ i.yazhongsunhuai }} </span>
            <span> <span>一般受损：</span>{{ i.yibansunhuai }} </span>
            <span> <span>房屋倒塌：</span>{{ i.damage }} </span>
          </div>
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
  name: 'HousesDamagedGis',
  components: {
    MapDialogTitle,
  },
})
export default class HousesDamagedGis extends Vue {
  @Prop() private listData: any;
  private listCheck: any = '';
  private moduleIsShow: boolean = true;
  private allHouseDamage: number = 0;
  private changeModuleIsShow() {
    this.moduleIsShow = !this.moduleIsShow;
  }

  private checkListFunc(index: any) {
    this.listCheck = index;
    this.messsageBus.emit('ToolTablePoint', '');
    if (index === 'all') {
      this.getComponent().showAll();
    } else {
      this.getComponent().provinceClick(this.listData[index].id); // 地图选中区域高亮
    }
    this.messsageBus.emit('damageToolTable', this.listData, index);
  }
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterStaFactory.getComponent('disasterSta');
    return component;
  }
  private showToolTip(data: any) {
    const eventLocation = [
      this.$store.state.eventPushStore.eventLocation.EventLon,
      this.$store.state.eventPushStore.eventLocation.EventLat,
    ];
    // 展示弹窗
    const param = {
        that: this,
        eventLocation, // 添加事故点定位经纬度
        popupId: 'disasterSta_popup', // 监听id，必须
        moduleTypeID: 'disasterSta', // 实体类资源模块id，必须
    };
    const popUpTemplate = new renderpopUpTemplate();
    popUpTemplate.getParams(param);
    popUpTemplate.onShowPopup(data);

    if (data.featureType === 'disaster_sta_point_type' ) {
      // 右栏高亮
      this.messsageBus.emit('ToolTablePoint', data.data.id);
    } else {
      // 右栏取消高亮
      this.messsageBus.emit('ToolTablePoint', '');
      // 左栏样式
      for (const i in this.listData) {
        if (this.listData[i].id === data.data.id) {
          this.listCheck = Number(i);
          // 右栏数据
          this.messsageBus.emit('damageToolTable', this.listData, i);
        }
      }
    }
  }
  private closeToolTip() {
    // 关闭弹窗
    this.getComponent().closePopup();
  }

  @Watch('listData')
  private eventChange() {
    this.allHouseDamage = 0;
    for (const i of this.listData) {
      this.allHouseDamage += i.damage;
    }
    this.getComponent().load({
      list: this.listData,
      type: 'Hous_damage_type',
    });
  }
  private mounted() {
    this.getComponent().on('disasterSta_popup', this.showToolTip, this); // 展示弹窗
  }

  private beforeDestroy() {
    this.getComponent().off('disasterSta_popup', this.showToolTip, this);
    this.getComponent().unload({});
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
#HousesDamagedGis {
  width: 405px;
  height: auto;
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
      display: flex;
      justify-content: space-between;
      padding: 5px 25px 5px 15px;
      .address {
        width: 34%;
        height: auto;
        font-size: 24px;
        text-align: center;
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
