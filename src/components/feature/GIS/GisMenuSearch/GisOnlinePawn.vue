<template>
  <div class="gisMapTool-item">
    <div class="gisMapTool-item_hd">
      <span
        class="gisMapTool-icon--head"
        :title="curCompData.title"
        :class="[curCompData.iconName, curCompData.isOpen ? 'toolActive' : '']"
        @click.stop="clickHandler(curCompData)"
      ></span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import '@/assets/css/gisUI/mapToolIcon.less';
import { mapUtilFun } from '@/views/common/nvaUtil/nvaUtil';
@Component({
  name: 'GisOnlinePawn',
})
export default class GisOnlinePawn extends Vue {
  @Prop() private title?: string;
  private curCompData: any = {
    iconName: 'gisMapTool-onlinePren',
    title: '在线单兵',
    key: 'onlinePawn',
    isOpen: false,
    // mutexkey: [
    //     'ToolCompared.returnImage,internetIntelligence,imageContrast,latestImages,tianyan,publicOpinionMonitor,aftershock',
    //     'commonTools.mapPrint,updateExperienceCircle',
    // ],
  };
  private clickHandler(item: any) {
    const tempFun: any = mapUtilFun;
    // 关闭弹框
    const obj = [
      {
        iconName: 'gisMapTool-realTimePlotting',
        title: '标绘',
        key: 'realTimePlotting',
        isOpen: false,
      },
      // {
      //   iconName: 'gisMapTool-PeripheralQuery',
      //   title: '周边查询',
      //   key: 'PeripheralQuery',
      //   isOpen: false,
      // },
    ];
    obj.forEach((itemData: any) => {
      if (tempFun[itemData.key]) {
        tempFun[itemData.key](this, itemData);
      }
    });
    // 关闭弹框
    this.messsageBus.emit('showVideoMonitorPop', false);
    //  this.messsageBus.emit('showOnlinePop', false);
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
    this.messsageBus.off('GisonlinePawn', this.handleCommonToolsClose);
    this.messsageBus.on('GisonlinePawn', this.handleCommonToolsClose);
  }

  private created() {
    this.initListener();
  }
}
</script>
<style lang="less" scoped>
ul,
li {
  margin: 0;
  padding: 0;
}
@gisMapToolMore: '../../../../assets/img/gisUI/gisMapToolMore';
.gisMapTool-item {
  position: relative;
  width: 60px;
  // margin:0 6px;
  text-align: center;
  cursor: pointer;
  // margin-left: -10px;
}
.gisMapTool-item_hd {
  display: block;
  height: 60px;
}
.gisMapTool-item_bd {
  position: absolute;
  // left: 2px;
  // margin-top:10px;
  width: 55px;
  user-select: none;
}
.gisMapTool-item_bd--bg {
  // background: url('../../../../assets/img/gisUI/gisMapTool/dituselecterbg.png')
  // no-repeat 50% 0;
  background-position: 4px 0;
  background-size: 93%;
}
.gisMapTool-item_bd_icon {
  display: block;
  width: 60px;
  height: 60px;
  line-height: 1;
  margin: 0 auto;
}
.gisMapTool-icon--head {
  display: block;
  width: 60px;
  height: 60px;
  line-height: 1;
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}
.gisMapTool-item_bd_item {
  position: relative;
  & > .text {
    display: none;
    background: rgba(1, 235, 245, 0.5);
    border: 1px #01ebf5 solid;
    border-radius: 2px;
    position: absolute;
    top: 9px;
    right: 54px;
    height: 42px;
    line-height: 42px;
    min-width: 130px;
    text-align: center;
    font-size: 24px;
    color: #fff;
    z-index: 1;
  }
  &:hover {
    & > .text {
      display: block;
      background: url('@{gisMapToolMore}/dituhoverbg.png') no-repeat 0 0;
      background-size: 100% 100%;
      border: none;
      width: 218px;
    }

    & > ul {
      display: block;
      background: url('@{gisMapToolMore}/fhmbzhabf.png') no-repeat 0 0;
      background-size: 100% 100%;
    }
  }
}
.gisMapToolMore-box_item_list {
  display: none;
  position: absolute;
  top: 52px;
  right: 62px;
  white-space: nowrap;
  width: 178px;
  text-align: left;
  padding: 10px 16px;
  & > li {
    list-style: none;
    line-height: 50px;
    border-bottom: 1px dashed #145763;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
    height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover {
      color: #e2d500;
    }
    & > span {
      width: 24px;
      height: 24px;
      margin: 5px;
      margin-bottom: 8px;
      display: inline-block;
      vertical-align: middle;
      background-size: 100% 100%;
    }
  }
  .borderNone {
    border-bottom: none;
  }
  .optionActive {
    color: #e2d500;
  }
}
</style>
