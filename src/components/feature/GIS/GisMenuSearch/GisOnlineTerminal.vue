<template>
  <div class="RealTimeVideo" @click="isShowlineTerminal(curCompData)">
    <div class="imgIcon" :class="{'RealTimeVideo_active':curCompData.isOpen}"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import {  } from '@/api/installServer';
import { mapUtilFun } from '@/views/common/nvaUtil/nvaUtil';
@Component({
  name: 'GisOnlineTerminal',
  components: {},
})
export default class GisOnlineTerminal extends Vue {
  private ShowlineTerminal: any = false;
    private curCompData: any = {
    iconName: '',
    title: '在线终端',
    key: 'OnlineTerminal',
    isOpen: false,
  };
  private isShowlineTerminal(item: any) {
    // 关闭弹框
    const obj = [
          {
            iconName: 'gisMapTool-realTimePlotting',
            title: '标绘',
            key: 'realTimePlotting',
            isOpen: false,
          },
          // {
          //   iconName: 'gisMapTool-onlinePren',
          //   title: '在线单兵',
          //   key: 'onlinePawn',
          //   isOpen: false,
          // },
          // {
          //   iconName: 'gisMapTool-PeripheralQuery',
          //   title: '周边查询',
          //   key: 'PeripheralQuery',
          //   isOpen: false,
          // },
    ];
    const tempFun: any = mapUtilFun;
    obj.forEach((itemData: any) => {
      if (tempFun[itemData.key]) {
        tempFun[itemData.key](this, itemData);
      }
    });
    // 展示在线单兵弹框
    item.isOpen = !item.isOpen;
    if (tempFun[item.key]) {
      tempFun[item.key](this, item);
    }
  }

  // closedState，表示关闭状态。 true为关闭
  private handleCommonToolsClose(key: string, closedState: boolean) {
    // 其实这个key理论上是一定会相等的，因为on的那个GisPlotControlBtn，现在只要这个组件在用
    if (key === this.curCompData.key) {
      this.curCompData.isOpen = false;
    }
  }

  private initListener() {
    const self = this;
    this.messsageBus.off('GisonlineTerminal', this.handleCommonToolsClose);
    this.messsageBus.on('GisonlineTerminal', this.handleCommonToolsClose);
  }
  private created() {
    this.initListener();
  }
   private beforeDestroy() {
    //  this.messsageBus.emit('closeOnlineTerminal', false);
   }
}
</script>
<style lang="less" scoped>
@icons: '../../../../assets/img/gisModule/gisLayerPanel/';
.RealTimeVideo {
  .imgIcon {
    height: 60px;
    display: block;
    width: 60px;
    height: 60px;
    line-height: 1;
    cursor: pointer;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background: url('@{icons}zxzd.png') no-repeat center center;
    background-size: 100% 100%;
    &:hover{
      background: url('@{icons}zxzdhover.png') no-repeat center center;
      background-size: 100% 100%;      
    }
    &.RealTimeVideo_active{
      background: url('@{icons}zxzdhover.png') no-repeat center center;
      background-size: 100% 100%;
    }
  }
}
</style>
