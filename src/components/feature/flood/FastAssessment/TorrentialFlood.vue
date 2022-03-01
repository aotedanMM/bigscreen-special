<!--山洪的首页-->
<template>
  <div class="rescueTeamsHome">
    <div class="rescueTeamsHome-box">
      <div class="torrenSelect">
        <SelectTitle @select="changeType"></SelectTitle>
      </div>
      <div class="list">
        <NextHours
          :parentHandleClickNumFn="parentHandleClickNumFn"
          :currentState="currentState"
          @backParent="handleTab"
          :rescueTeamHomeData="rescueTeamHomeData"
        ></NextHours>
      </div>

      <!-- <el-tabs class="csmMyTabs-flood" v-model="currentTab"  @tab-click="handleTab">
        <el-tab-pane label="未来1小时" name="first">
          <NextHours
            v-if="currentTab === 'first'"
            :parentHandleClickNumFn="parentHandleClickNumFn"
            :rescueTeamHomeData="rescueTeamHomeData"
          ></NextHours>
        </el-tab-pane>
        <el-tab-pane label="未来2小时" name="second">
          <NextTwoHours
            v-if="currentTab === 'second'"
            :parentHandleClickNumFn="parentHandleClickNumFn"
            :rescueTeamHomeData="rescueTeamHomeData"
          ></NextTwoHours>
        </el-tab-pane>
      </el-tabs>-->
    </div>
  </div>
</template>

<script lang="ts">
// import {
//     messsageBus,
// } from '@/util/message';
import { districtServer } from '@/api/installServer';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { dataSourcesServer } from '@/api/installServer';
import SelectTitle from '@/components/feature/flood/FastAssessment/SelectTitle.vue'; // 未来1小时

import NextHours from '@/components/feature/flood/FastAssessment/NextHours.vue'; // 未来1小时
// import NextTwoHours from "@/components/feature/flood/FastAssessment/NextTwoHours.vue"; // 未来俩小时
@Component({
  name: 'TorrentialFlood',
  components: {
    NextHours,
    // NextTwoHours,
    SelectTitle,
  },
})
export default class TorrentialFlood extends Vue {
  @Prop() public rescueTeamHomeData: any;
  @Prop() public openPopup: any;
  @Prop() public activeTab: any;
  public currentState = { name: '当前10分钟', id: '10', state: '0' };

  private currentTab = '';
  private flag = false;

  @Prop() private parentHandleClickNumFn?: any; // 父组件处理点击列表的方法
  public changeType(item: any, index: any) {
    this.currentState = item;
    this.$emit('backParent');
    this.$emit('getTimeParam', this.currentState);
    this.getComponent().removeResource();
  }

  public mounted() {
    this.currentTab = this.activeTab ? this.activeTab : 'first';
    this.$emit('getTimeParam', this.currentState);
  }

  public handleTab() {
    this.$emit('backParent');
  }

  // 清除
  private beforeDestroy() {
    this.getComponent().removeResource();
  }
  //  获取地图功能
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.ModelDisplayFactory.getComponent('mountainFlood');
    return component;
  }
  // 返回一级页面
  //   private backParent() {
  //     this.$emit('backParent');
  //   }
}
</script>

<style lang="less" scoped>
.rescueTeamsHome {
  height: 100%;
  .rescueTeamsHome-box {
    padding: 0 10px;
    height: calc(100% - 36px);
    .torrenSelect {
      height: 40px;
      margin-top: 10px;
      display: flex;
      z-index: 100000;
      position: relative;
      div + div {
        margin-left: 30px;
      }
    }
    .list {
      height: calc(100% - 50px);
    }
  }
}
</style>
