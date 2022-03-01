<template>
  <div class="ChildDiscussCont" :class="DiscussContKey ? 'DiscussCont_key' : ''">
    <div class="tempRight-title f-tit-h2" @click="isShowOpenFn">
      <span
        @click="addMapdot(curcontList)"
        :class="{'itemName-active':curcontList.clickKey&&curcontList.active}"
        :title="curcontList.title"
      >{{ curcontList.title }}</span>
      <span class="tempRight-total" style="right:45px" @click="changeKuang(curcontList)">
        <span class="f-number">{{ !curcontList.noList ? curcontList.sum : '' }}</span>
      </span>
      <i
        :class="isShowOpen? 'tempRight-switch':'tempRight-switch tempRight-switch-reverse'"
        v-if="curcontList.list"
      ></i>
    </div>
    <template v-if="isShowOpen">
      <!-- <div class="tempRight-cont"> -->
      <div class="team-ul" v-if="curcontList.list">
        <!-- 地震专题道路没有数组需要判断noList -->
        <div
          class="tempRight-itemTitle f-txt-com"
          :class="{'gray':!item.num && !item.noList }"
          v-for="(item,index) of curcontList.list"
          :key="index+'1'"
        >
          <div class="tempRight-icon_bg icon_bg_normal">
            <i class="teamIcon" :class="'teamIcon-'+item.bg"></i>
          </div>
          <div
            :class="{'tempRight-itemName':true , 'itemName-active':item.active}"
            @click="addMapdot(item)"
          >
            <span class="f-txt-com" :title="item.name">{{ item.name}}</span>
          </div>
          <div class="tempRight-itemNum" v-if="item.team===undefined" @click="changeKuang(item)">
            <!-- 地震专题道路没有数组需要判断noList -->
            <em class="f-number text-number">{{ item.noList ? '' : item.num }}</em>
            <i class="text-unit">{{item.danwei?item.danwei:''}}</i>
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
      </div>
      <!-- </div> -->
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import {
  clearPeripheral,
  clearPathPlanning,
  closeRightVideo,
  clearTrack,
  mapUtilFun,
} from '@/views/common/nvaUtil/nvaUtil';
@Component({
  name: 'ChildDiscussCont',
})
export default class ChildDiscussCont extends Vue {
  @Prop() public contList!: any;
  @Prop() public radius: any;
  @Prop() public keyArr!: any;
  private DiscussContKey = false;
  private curcontList: any = this.contList;
  private isShowOpen: boolean = false;
  private curkeyArr: any = this.keyArr;

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

    switch (item.key) {
      case 'freeway': // 高速公路
        if (item.active) {
          this.getComponent1().addLayer('RoadLayer_Gaosu');
        } else {
          this.getComponent1().removeLayer('RoadLayer_Gaosu');
        }
        break;
      case 'provincial': // 国道
        if (item.active) {
          this.getComponent1().addLayer('RoadLayer_Guodao');
        } else {
          this.getComponent1().removeLayer('RoadLayer_Guodao');
        }
        break;
      case 'prefecture': // 省道
        if (item.active) {
          this.getComponent1().addLayer('RoadLayer_Shengdao');
        } else {
          this.getComponent1().removeLayer('RoadLayer_Shengdao');
        }
        break;
      case 'other': // 其他
        if (item.active) {
          this.getComponent1().addLayer('RoadLayer_Qita');
        } else {
          this.getComponent1().removeLayer('RoadLayer_Qita');
        }
        break;
      case 'railway': // 铁路
        if (item.active) {
          this.getComponent1().addLayer('RailwayLayer');
        } else {
          this.getComponent1().removeLayer('RailwayLayer');
        }
        break;
    }
  }

  // 文字点击
  private addMapdot(item: any) {
    if (item.noneParam === true) {
      // 没有配置参数，但是又要显示的那种
      return;
    }
    // 地震专题道路没有数组需要判断noList
    if (item.noList) {
      this.checkActive(item);
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
  // 数字点击
  private changeKuang(item: any) {
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
.ChildDiscussCont {
  width: 350px;
  position: relative;
  left: 20px;
  padding-bottom: 20px;

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
