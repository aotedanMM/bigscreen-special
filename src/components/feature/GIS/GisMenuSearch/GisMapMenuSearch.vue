<template>
    <div class="menu-search" :style ="{ left: left+'px'}">
<!--        <i-->
<!--            :class="['YJ_headTabClick', { YJ_headTabClick_active: isIclass }]"-->
<!--            @click="tabTaggleClass"-->
<!--        ></i>-->
<!--   点击事件暂时注释（承灾体，应急资源）     -->
      <!-- 甲方要求注释 -->
        <!-- <i
                :class="['YJ_headTabClick', { YJ_headTabClick_active: isIclass }]"
        ></i> -->
        <ul class="YJ_headTaBox" v-show="isIclass">
            <li
                :class="['tab-' + item.tabkey, item.isMutex && item.isclass]"
                :key="item.tabkey"
                v-for="item in tabConfig"
                @click.stop="tabTabMenuFn(item)"
            >{{ item.tabname }}</li>
        </ul>
        <GisMapSearch :isIclass="isIclass"></GisMapSearch>
        <WarningInfoCommon v-show="false" :title="tabConfig[0].tabname" v-if="tabConfig[0].isMutex" :show="tabConfig[0].isMutex" />
        <HazardAffectedBody v-show="isIclass" :title="tabConfig[1].tabname" v-if="tabConfig[1].isMutex"  :show="tabConfig[1].isMutex"/>
        <EmergencyResource v-show="isIclass" :title="tabConfig[2].tabname" v-if="tabConfig[2].isMutex" :show="tabConfig[2].isMutex"/>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import GisMapSearch from '@/components/feature/GIS/GisMenuSearch/GisMapSearch.vue';
import HazardAffectedBody from '@/components/feature/GIS/GisMenuSearch/HazardAffectedBody.vue';
import EmergencyResource from '@/components/feature/GIS/GisMenuSearch/EmergencyResource.vue';
import WarningInfoCommon from '@/components/feature/GIS/GisMenuSearch/WarningInfoCommon.vue';

@Component({
  name: 'GisMenuSearch',
  components: {
    GisMapSearch,
    HazardAffectedBody,
    EmergencyResource,
    WarningInfoCommon,
  },
})
export default class GisMenuSearch extends Vue {
  private isIclass = false;
  private left = 0;
  private tabConfig = [
    {
      tabkey: 'WarningInfoModule',
      tabname: '监测预警',
      isclass: 'tabactiveOne',
      // isMutex: true,
      isMutex: false,
    },
    {
      tabkey: 'CarrierInfoModule',
      tabname: '承灾体',
      isclass: 'tabactiveTwo',
      isMutex: false,
    },
    {
      tabkey: 'QueryDataModule',
      tabname: '应急资源',
      isclass: 'tabactiveThree',
      isMutex: false,
    },
  ];
  private tabTaggleClass() {
    this.isIclass = !this.isIclass;
    if (this.isIclass) {
        this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {comprehensiveQuery: {showFlag: true}});
        // 定位操作面板隐藏
        this.messsageBus.emit('positioningOperation', false);
    } else {
       this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {comprehensiveQuery: {showFlag: false}});
    }
  }
  private tabTabMenuFn(parame: any) {
    this.tabConfig.forEach((item: any, index: any) => {
      // item.isMutex = false;
      //  item.isMutex = !item.isMutex;
      if (item.tabname === parame.tabname) {
          parame.isMutex = !parame.isMutex;
      } else {
        item.isMutex = false;
      }
    });
    // parame.isMutex = true;
  }
  // 当操作屏定位后弹框消失
  @Watch('$store.state.eventPushStore.eventLocation.EventLatLonStr')
  private onEventLocate() {
    this.$store.commit('panelMutualExclusionMudule/setpanelMutualExclusion', {comprehensiveQuery: {showFlag: false}});
    this.tabConfig.forEach((item: any) => {
        item.isMutex = false;
    });
  }
  @Watch('$store.state.configModel.fastSearchPosition')
  private updatedFastSearchPosition() {
    this.left = this.$store.state.configModel.fastSearchPosition;
  }

        // 监听事件信息面板的显隐
  @Watch('$store.state.panelMutualExclusionMudule.panelMutualExclusion', {deep: true})
  private changelargeRightPanel(val: any) {
    this.isIclass = val.comprehensiveQuery.showFlag;
  }


  private created() {
    this.messsageBus.$on('GisMapMenuSearch-closePopups', (title: string) => {
      this.tabConfig.forEach((item: any, index: any) => {
        if (item.tabname === title) {
          item.isMutex = false;
        }
      });
    });
    this.left = this.$store.state.configModel.fastSearchPosition;


  }
}
</script>
<style scoped lang="less">
.menu-search {
  position: absolute;
  left: 85px;
  top: 25px;
  font-size: 22px;
  // color: #a9edfe;
  color:#fff;
  width: 680px;
  height: 80px;
  line-height: 80px;
  display: flex;
  align-items: center;
  z-index: 199;
  background-size: 100% 100%;
  padding-left: 0px;
  // 甲方要求注释
  // i.YJ_headTabClick {
  //   width: 120px;
  //   height: 80px;
  //   /*cursor: pointer;*/
  //   background: url(../../../../assets/img/head/meunIcon.png) no-repeat scroll left center;
  // }
  i.YJ_headTabClick_active {
    width: 120px;
    height: 80px;
    cursor: pointer;
    background: url(../../../../assets/img/head/yuanquanGl.png) no-repeat left top;
  }
  .YJ_headTaBox {
    width: 72%;
    height: 80px;
    line-height: 80px;
    position: absolute;
    top: -1px;
    left: 90px;
    display: flex;
    align-items: center;
      li:nth-of-type(1){
          display: none;
      }
    li {
      line-height: 58px;
      height: 58px;
      display: block;
      width: 132px;
      text-align: center;
      text-indent: 1.1em;
      background: url(../../../../assets/img/head/centerputong.png) no-repeat
        left center;
      cursor: pointer;
    }
    li:first-child {
      background: url(../../../../assets/img/head/lanleft.png) no-repeat right
        center;
      width: 155px;
      text-indent: 1.8em;
    }
    li:last-child {
      background: url(../../../../assets/img/head/lastPUtong.png) no-repeat left
        center;
      width: 171px;
      text-indent: 1rem;
    }
    li.tabactiveOne {
      background: url(../../../../assets/img/head/ledtGl.png) no-repeat right
        center;
      color: #fdff71;
    }

    li.tabactiveTwo {
      background: url(../../../../assets/img/head/centerGl.png) no-repeat left
        center;
      color: #fdff71;
      background-size: 100% 100%;
    }

    li.tabactiveThree {
      background: url(../../../../assets/img/head/rightGl.png) no-repeat left
        center;
      color: #fdff71;
    }
  }
}
</style>
