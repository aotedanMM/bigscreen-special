<!--防御准备的首页-->
<template>
  <div class="DefensiveHome">
    <div class="rescueTeamsHome_hd title-panel">
      <p>
        {{curTitle}}
        <ZoomBtn></ZoomBtn>
      </p>
      <span
        v-if="($store.state.eventPushStore.eventLocation.EventType === '10') && ($store.state.TyphoonModule.viewConfig.tabChooseValue !== '2')"
        class="closeAndback"
        @click="closeAndbackFn"
      ></span>
    </div>
    <div class="DefensiveHome_cnt">
      <el-scrollbar style="height: 100%;">
        <div class="rescueTeamsHome_cnt">
          <template v-for="(pitem) of panelList">
            <component
              :key="pitem.key"
              :is="pitem.subCompName"
              :compParam="pitem.subCompParam"
              :handleClick="handleChildClick"
              :getCacheData="updateCacheData"
              :handleTitleClick="handleTitleClick"
              :handleSubTitleClick="handleSubTitleClick"
            ></component>
          </template>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import Person from '@/components/feature/flood/DefensivePreparation/children/Person.vue';
import Ship from '@/components/feature/flood/DefensivePreparation/children/Ship.vue';
import CommonList from '@/components/feature/flood/DefensivePreparation/children/CommonList.vue';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import DispatchAdviceRightBox from '../../../../views/theme/decisionSupport/module/gisModule/rescueAid/dispatchAdvice/DispatchAdviceRightBox.vue';
import ZoomBtn from '../ZoomBtn.vue';  // 导入最小化组件
@Component({
  name: 'DefensiveHome',
  mixins: [MapCommon], // GIS 将地图组件混入当前组件
  components: {
    Person, // 人口转移情况
    Ship, // 船舶归港及人员上岸情况
    CommonList, // 风险隐患点
    ZoomBtn, // 缩放按钮
  },
})
export default class DefensiveHome extends Vue {
  @Prop() private handleClick: any; // 父组件处理子组件的点击的方法
  @Prop() private showState: any;
  private curTitle: string = '防御准备'; // 本组件面板的title
  private cacheData: any = {
    PersonnelTransfer: {
      title: '人口转移情况',
      key: 'PersonnelTransfer',
      sourceKey: 'populationShiftsList', // 从cacheData这个对象中的populationShiftsList中进行数组遍历
      cacheData: {},
      targetData: {}, // 根据地图的点击拿到了具体的行政区划下的数据
    },
    ShipToHarbour: {
      title: '船舶归港及人员上岸情况',
      key: 'ShipToHarbour',
      sourceKey: 'shipPersonList', // 从cacheData这个对象中的shipPersonList中进行数组遍历
      cacheData: {},
      targetData: {}, // 根据地图的点击拿到了具体的行政区划下的数据
    },
  };
  private panelList: any = [
    {
      title: '人口转移情况',
      key: 'PersonnelTransfer',
      subCompName: 'Person',
      subCompParam: {
        title: '人口转移情况',
        key: 'PersonnelTransfer',
      },
    },
    {
      title: '船舶归港及人员上岸情况',
      key: 'ShipToHarbour',
      clearAisFlag: true,
      subCompName: 'Ship',
      subCompParam: {
        title: '船舶归港及人员上岸情况',
        key: 'PersonnelTransfer',
        updateAis: false, // 更新ais的状态和地图
      },
    },
    // {
    //   title: "风险隐患点",
    //   key: "RiskPoint",
    //   mutex: [
    //     // 互斥
    //     {
    //       title: "防护目标",
    //       key: "ProtectiveGoal",
    //       index: 3
    //     }
    //   ],
    //   subCompName: "CommonList",
    //   subCompParam: {
    //     title: "风险隐患点", // 名称,这个在组件一开始形成后就不可以变
    //     key: "RiskPoint", // 关键字,,这个在组件一开始形成后就不可以变
    //     unit: "处", // 单位,,这个在组件一开始形成后就不可以变
    //     serveName: "riskServer", // 子组件用到的服务,,这个在组件一开始形成后就不可以变
    //     serveParam: {
    //       // 子组件需要的服务参数
    //       curDisCode: "" // 当前的行政区划
    //     },
    //     index: 2, // 当前对象在panelList中的数组下标,这个在组件一开始形成后就不可以变
    //     thermodynamicLayerParam: "fxyh", // 热力图的参数,,这个在组件一开始形成后就不可以变
    //     updateTitleChecked: false, // 当前是否需要更新一级标题的高亮
    //     updateSubTitleChecked: false // 当前是否需要完全更新二级标题的高亮
    //   }
    // },
    // {
    //   title: "防护目标",
    //   key: "ProtectiveGoal",
    //   mutex: [
    //     // 互斥
    //     {
    //       title: "风险隐患点",
    //       key: "RiskPoint",
    //       index: 2
    //     }
    //   ],
    //   subCompName: "CommonList",
    //   subCompParam: {
    //     title: "防护目标",
    //     key: "ProtectiveGoal",
    //     unit: "处",
    //     serveName: "protectTargetServer",
    //     serveParam: {
    //       // 子组件需要的服务参数
    //       curDisCode: "" // 当前的行政区划
    //     },
    //     index: 3,
    //     thermodynamicLayerParam: "fhmb", // 热力图的参数
    //     updateTitleChecked: false, // 当前是否需要更新一级标题的高亮
    //     updateSubTitleChecked: false // 当前是否需要完全更新二级标题的高亮
    //   }
    // }
  ];

  @Watch('showState')
  private updateCurCompShowState(val: any) {
    if (val) {
      this.getComponent().addDistrict();
    } else {
      this.getComponent().removeDistrict();
    }
  }
  private closeAndbackFn() {
    this.messsageBus.emit('closeAndBack', true);
  }

  /**
   * 处理子组件的点击事件
   */
  private handleChildClick(compName: string, compParam: any) {
    // 清除高亮和清除热力等
    this.getResourceQueryComponent()._clearHeatlayer(); // 因为是互斥的，所以要清除掉热力
    this.getResourceQueryComponent()._clear(); // 清楚所有图层
    this.panelList.forEach((pitem: any, pindex: number) => {
      const filterArr = ['RiskPoint', 'ProtectiveGoal'];
      if (filterArr.includes(pitem.key)) {
        // 这些的的高亮状态要还原
        const subCompParam = JSON.parse(JSON.stringify(pitem.subCompParam));
        subCompParam.updateTitleChecked = true;
        subCompParam.updateSubTitleChecked = true;
        this.panelList[pindex].subCompParam = subCompParam;
      }

      if (pitem.clearAisFlag) {
        const subCompParam = JSON.parse(JSON.stringify(pitem.subCompParam));
        subCompParam.updateAis = true;
        this.panelList[pindex].subCompParam = subCompParam;
      }
    });
    this.handleClick(compName, JSON.parse(JSON.stringify(compParam)));
  }

  /**
   * 处理子组件的一级标题的点击
   */
  private handleTitleClick(childCompParam: any) {
    this.getResourceQueryComponent()._clearHeatlayer(); // 因为是互斥的，所以要清除掉热力
    this.getResourceQueryComponent()._clear(); // 清楚所有图层
    if (childCompParam.titleActive) {
      // 由原来的不选中变成选中
      this.getResourceQueryComponent()._addHeatMap(
        childCompParam.thermodynamicLayerParam,
      ); // 标点
      // 要把互斥的高亮清掉，例如当防护目标有高亮的话，如果此时选中了风险隐患，那么就要清除防护目标了
    }
    // 通知子组件是否需要更新标题
    this.panelList[childCompParam.index].mutex.forEach(
      (item: any, index: number) => {
        const subCompParam = JSON.parse(
          JSON.stringify(this.panelList[item.index].subCompParam),
        );
        subCompParam.updateTitleChecked = childCompParam.titleActive;
        subCompParam.updateSubTitleChecked = true; // 二级标题也要去高亮
        this.panelList[item.index].subCompParam = subCompParam;
      },
    );
  }

  /**
   * 处理子组件的二级标题的点击事件
   */
  private handleSubTitleClick(
    childItem: any,
    childIndex: number,
    childList: any,
    childCompParam: any,
  ) {
    const filterArr = childList.filter((item: any, index: number) => {
      return index !== childIndex && item.isChecked;
    });
    // filterArr.length = 0, 表明除了目标这个状态的更改，subList没有高亮的状态
    //   if ( (filterArr.length === 0) && (childItem.isChecked) ) { // 这个应该可以表示，某一个组件的第一次点击（例如： 风险隐患）
    // 那么互斥的那个组件（防护）
    this.getResourceQueryComponent()._clearHeatlayer(); // 因为是互斥的，所以要清除掉热力
    // this.getResourceQueryComponent()._clear();  // 清楚所有图层
    // 通知子组件是否需要更新标题
    this.panelList[childCompParam.index].mutex.forEach(
      (item: any, index: number) => {
        const subCompParam = JSON.parse(
          JSON.stringify(this.panelList[item.index].subCompParam),
        );
        subCompParam.updateTitleChecked = true;
        subCompParam.updateSubTitleChecked = false;
        this.panelList[item.index].subCompParam = subCompParam;
      },
    );
    //   }
    if (childItem.isChecked) {
      const filters = {
        layerId: childItem.code,
        keyword: '',
        districtCode: '',
      };
      this.getResourceQueryComponent().queryResource(
        childItem.mapLayerType,
        filters,
        false,
      );
    } else {
      this.getResourceQueryComponent().removeResource(childItem.mapLayerType);
    }
  }

  /**
   * 获得子组件的数据
   */
  private updateCacheData(key: any, cacheData: any) {
    this.cacheData[key].cacheData = JSON.parse(JSON.stringify(cacheData));
  }
  /**
   * 通过行政区划code获得相应数据
   */
  private getDataByCode(dictObj: any) {
    let result = {};
    const keyArr = Object.keys(this.cacheData);
    keyArr.forEach((keyItem: any, keyIndex: number) => {
      const cacheItem = this.cacheData[keyItem];
      if (cacheItem.cacheData[cacheItem.sourceKey]) {
        cacheItem.cacheData[cacheItem.sourceKey].forEach(
          (fitem: any, findex: number) => {
            if (fitem.cityCode === dictObj.districtcode) {
              this.cacheData[keyItem].targetData = fitem;
            }
          },
        );
      }
    });
    result = JSON.parse(JSON.stringify(this.cacheData));
    return result;
  }

  // 地图弹窗组件加载
  private showPopup(event: any) {
    event.type = 'defensiveDistrictPopup';
    const self = this;
    const param = {
      that: self,
      popupId: 'defensive_district_popup', // 监听弹出层id，必须
      moduleTypeID: 'defensiveDistrictComponent', // 实体类资源模块id，必须
    };
    event.data.cacheData = this.getDataByCode(event.data);
    const popUpTemplate = new renderpopUpTemplate();
    popUpTemplate.getParams(param);
    popUpTemplate.onShowPopup(event);
  }

  // 初始化监听的事件
  private initEventListener() {
    // 行政区划的点位点击事件监听
    this.getComponent().on('defensive_district_popup', this.showPopup, this);
  }

  /**
   * 地图上标佛山的行政区划的地图注册
   */
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.defensivePreparationFactory.getComponent(
      'defensiveDistrictComponent',
    );
    return component;
  }

  /**
   * 防护目标和风险隐患点的地图
   */
  private getResourceQueryComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.defensivePreparationFactory.getComponent(
      'ResourceQuery',
    );
    return component;
  }

  private created() {
    const disCodeOri =
      (this.$store.state.eventPushStore.geometrySelectShareObj &&
        this.$store.state.eventPushStore.geometrySelectShareObj.districtCode) ||
      this.$store.state.eventPushStore.district.code;
    const finalCode = disCodeOri.replace(/(00){1,2}/gi, '%');
    this.panelList.forEach((item: any, index: number) => {
      if (item.subCompParam.serveParam && item.subCompParam.serveParam) {
        item.subCompParam.serveParam.curDisCode = finalCode; // 当前的行政区划
      }
    });
  }

  private mounted() {
    this.initEventListener();
    (this as any).resolveMap('map').then((data: any) => {
      this.getComponent().load();
    });
  }

  private beforeDestroy() {
    this.getComponent().unload();
    this.getComponent().off('defensive_district_popup', this.showPopup, this);
    this.getResourceQueryComponent()._clearHeatlayer(); // 因为是互斥的，所以要清除掉热力
    this.getResourceQueryComponent()._clear(); // 清楚所有图层
    // this.getComponent().unload();
    // this.getResourceQueryComponent().unload();
  }
}
</script>

<style lang="less" scoped>
@import "../../../../assets/css/decisionSupport/teamIcon.less";
@import "../../../../assets/css/decisionSupport/DiscussTab.less";
@import "../../../../assets/css/decisionSupport/Statistic.half.less";
.DefensiveHome {
  height: 848px;
  &_cnt {
    height: calc(100% - 35px);
  }
}
</style>
