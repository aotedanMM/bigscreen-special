<template>
  <div class="DiscussCont" :class="DiscussContKey ? 'DiscussCont_key' : ''">
    <div class="tempRight-title f-tit-h2" @click="isShowOpenFn">
      <span
        @click="addMapdot(curcontList)"
        :class="{'itemName-active':curcontList.clickKey&&curcontList.active}"
        :title="curcontList.title"
      >{{ curcontList.title }}</span>
      <span
        class="tempRight-total tempRight-box"
        :style="curcontList.danwei?'right:5px':'right:45px'"
      >
        <span class="f-number">{{ curcontList.sum }}</span>
        <span class="text-unitDw" v-show="curcontList.danwei">{{ curcontList.danwei }}</span>
        <i class="instake_cont" v-show="curcontList.clickKey" @click="changeKuang(curcontList)"></i>
      </span>
      <i
        :class="isShowOpen? 'tempRight-switch':'tempRight-switch tempRight-switch-reverse'"
        v-if="curcontList.list"
      ></i>
    </div>
    <template v-if="isShowOpen">
      <!-- <div class="tempRight-cont"> -->
      <div class="team-ul" v-if="curcontList.list">
        <div v-for="(item,index) of curcontList.list" :key="index+'1'">
          <div
            v-if="!item.isChild"
            class="tempRight-itemTitle f-txt-com"
            :class="{'gray':!item.num }"
          >
            <div class="tempRight-icon_bg icon_bg_normal">
              <i class="teamIcon" :class="'teamIcon-'+item.bg"></i>
            </div>
            <div
              :class="{'tempRight-itemName':true , 'itemName-active':item.active}"
              @click="addMapdot(item)"
            >
              <span class="f-txt-com" :title="item.name">{{item.name}}</span>
            </div>
            <div v-if="item.team===undefined" class="tempRight-box">
                <div class="tempRight-itemNum">
                  <em class="f-number text-number">{{ item.num }}</em>
                  <i class="text-unit">{{item.danwei?item.danwei:''}}</i>
                </div>
                 <span class="instake_cont" @click="changeKuang(item)"></span>
            </div>
            <div class="tempRight-itemNum1" v-else>
              <span>
                <i>{{item.team}}</i>
                {{item.zhi}}
              </span>
              <span>
                <font class="f-number">{{item.num}}</font>
                {{item.danwei?item.danwei:''}}
              </span>
            </div>
          </div>
          <ChildDiscussCont
            v-else
            @changeKuang="childChangeKuang"
            :contList="item"
            :radius="radius"
            :keyArr="keyArr"
            @dealKey="childDealKey"
          ></ChildDiscussCont>
        </div>
      </div>
      <!-- </div> -->
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ChildDiscussCont from '@/components/feature/StudyAndJudgmentOfaPicture/discuss/ChildDiscussCont.vue';
import CommonList from '@/components/feature/riskHiddenView/children/CommonList.vue';
import {
  clearPeripheral,
  clearPathPlanning,
  closeRightVideo,
  clearTrack,
  mapUtilFun,
} from '@/views/common/nvaUtil/nvaUtil';
@Component({
  name: 'DiscussCont',
  components: {
    ChildDiscussCont,
    CommonList,
  },
})
export default class DiscussCont extends Vue {
  @Prop() public contList!: any;
  @Prop() public radius: any;
  @Prop() public keyArr!: any;
  // 点击数字传上来的展示数据
  public paramData: any = {};
  // 加载点位的名称
  public popIsSureName: string = '';
  private DiscussContKey = false;
  private curcontList: any = this.contList;
  private isShowOpen: boolean = false;
  private curkeyArr: any = this.keyArr;
  private clearKey: any = '';

  @Watch('contList')
  private updateCurcontList(val: any) {
    this.isShowOpen = !!val.defaultExpand;
    this.curcontList = val;
  }
  private isShowOpenFn() {
    this.isShowOpen = !this.isShowOpen;
  }

  //  地图组件
  private getComponent1() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('mapserviceIn');
    return component;
  }

  private checkActive(item: any) {
    item.active = !item.active;

    if (item.active) {
      this.getComponent1().addLayer('RailwayLayer');
      this.getComponent1().addLayer('RoadLayer');
    } else {
      this.getComponent1().removeLayer('RailwayLayer');
    }
  }

  // 文字点击
  private addMapdot(item: any) {
    if (item.noneParam === true) {
      // 没有配置参数，但是又要显示的那种
      return;
    }

    if (item.num === 0 || item.sum === 0) {
      return;
    }
    item.active = !item.active;

    this.$emit('dealKey', item);
    this.$store.commit('resetAllDefaultData');
    clearPeripheral(this);
  }

  private childChangeKuang(item: any) {
    this.$emit('changeKuang', item);
  }

  private childDealKey(item: any) {
    this.$emit('dealKey', item);
  }

  // 数字点击
  private changeKuang(item: any) {
    console.log(item);
    if (item.sign && item.sign === 'copy') {
      console.log('自己的66');
      // 点位信息
      item.checked = item.numChecked;
      this.paramData = {
        item,
        panelType: 'riskTrouble',
      };
      if (!this.popIsSureName) {
        this.popIsSureName = 'majordanger';
      } else {
        this.popIsSureName = '';
      }
      this.getComponent_new()._clearLayerByID(item.codeKey);
      if (item.checked && this.popIsSureName) {
        this.getComponent_new().showExtentData(item.codeKey);
      }
      if (!this.popIsSureName) {
        this.messsageBus.emit(
          'clickEmerencyResourcesNum',
          this.paramData,
          item.checked,
        );
      } else {
        this.messsageBus.emit(
          'clickEmerencyResourcesNum',
          this.paramData,
          true,
        );
      }
    }  else if (item.stag && item.stag === 'meikuang') {
      // 左侧由非煤矿山改为获取非煤企业的数据并展示
            console.log('走煤矿企业自己的');
      // 点位信息
            item.checked = item.numChecked;
            this.paramData = {
        item,
        panelType: 'riskTrouble',
      };
            if (!this.popIsSureName) {
        this.popIsSureName = 'noncoal';
      } else {
        this.popIsSureName = '';
      }
            this.getComponent_new()._clearLayerByID(item.codeKey);
            if (item.checked && this.popIsSureName) {
        this.getComponent_new().showExtentData(item.codeKey);
      }
            if (!this.popIsSureName) {
        this.messsageBus.emit(
          'clickEmerencyResourcesNum',
          this.paramData,
          item.checked,
        );
      } else {
        this.messsageBus.emit(
          'clickEmerencyResourcesNum',
          this.paramData,
          true,
        );
      }
    } else {
      // 清除点文字出的点位 + 高亮
      this.$emit('clearPoint');
      // 列表+点位
      if (!item.clickKey) {
        return;
      } else {
        if (item.num === 0 || item.sum === 0) {
          return;
        }
        this.$emit('changeKuang', item);
        this.$store.commit('resetAllDefaultData');
        clearPeripheral(this);
      }
    }
  }
  private beforeDestroy() {
    // 列表关闭弹框事件
    this.messsageBus.emit('clickEmerencyResourcesNumPanelClosed', {}, false);
    // 清理地图图层图标
    this.getComponent()._clearLayers();
    this.getComponent_new()._clearLayerByID(this.clearKey);
    this.getComponent()._clearLayerByID(this.clearKey);
  }
  //  地图组件
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent('ResourceComponent');
    return component;
  }
  //  地图组件
  private getComponent_new() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent(
            'NewResourceComponent',
    );
    return component;
  }
  private getDiscussContKey(data: any) {
    if (data.clickKey) {
      this.DiscussContKey = true;
    } else {
      this.DiscussContKey = false;
    }
  }
  private created() {
    this.isShowOpen = !this.curcontList.defaultExpand;
    this.getDiscussContKey(this.curcontList);
  }
}
</script>
<style lang="less" scoped>
@import '../../../../assets/css/decisionSupport/teamIcon.less';
@import '../../../../assets/css/decisionSupport/Statistic.half.less';

* {
  margin: 0;
  padding: 0;
}
.DiscussCont {
  width: 370px;
  padding-bottom: 20px;
  .text-unitDw {
    color: #bacfdc;
    padding-right: 5px;
    padding-left: 15px;
    float: right;
    font-style: normal;
  }
  .tempRight-box{
    display: flex;
    align-items: center;
  }
  .instake_cont {
    display: inline-block;
    cursor: pointer;
    width: 32px;
    height: 32px;
    background: url("../../../../assets/img/discuss/icon_cont.png") 0 50% no-repeat;

    &:hover {
        background: url("../../../../assets/img/discuss/icon_cont_hover.png") 0 50% no-repeat;
    }
}
    .text-number {
      cursor: auto!important;
    }
  .tempRight-cont {
    .tempRight-itemNum1 {
      display: flex;
      justify-content: flex-end;
      .text-unit {
        color: #fff000;
        font-family: Impact;
        margin-right: 10px;
      }
      .text-number {
        color: #3ef7fe;
        font-family: Impact;
        padding-left: 15px;
      }
    }
  }
}
</style>
