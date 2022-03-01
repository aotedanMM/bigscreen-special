<!--地图工具箱（事件概况）(当地天气，舆情监控，互联网情报，测量工具，交通管制，道路损毁，回传图像，绿色通道)-->
<template>
  <GisMapTool :originData="originDatas" @clickHandler="funClick"></GisMapTool>
</template>
<script lang="ts">
import { Component, Vue, Prop , Watch} from 'vue-property-decorator';
import { IMapToolItem } from '@/interface/feature/common/mapTool/MapTool.interface';
import GisMapTool from '@/components/feature/gisModle/gisMapTool/GisMapTool.vue';
import { gisToolServer } from '@/api/installServer';
import { clearPeripheral , clearPathPlanning , closeRightVideo , clearTrack, mapUtilFun} from '@/views/common/nvaUtil/nvaUtil' ;

@Component({
  name: 'ToolEventOverview',
  components: {
    GisMapTool,
  },
})
export default class ToolEventOverview extends Vue {
  private originDatas: IMapToolItem[] = [];
  /**
   * 在vuex 里面选取当前工具条所需list文件名称
   * 配置 this.$store.state.configModel.config.toolConfig 的文件在
   * public\json\eventConfigJson 中 分别对应不同灾种  如地震 通用 森林 等
   * 配置其中 toolConfig 字段
   * */
  public getData() {
    const that = this;
    gisToolServer
      .getMapToolIconData('./json/gisMapTool/' + this.$store.state.configModel.config.toolConfig.mapToolIconEventOverview)
      .then((res: any) => {
        that.originDatas = res.data;
      });
  }
  public funClick(item: any) {
    if (item.disabled === true) {
      return ;
    }
    const tempFun: any = mapUtilFun;
    // 判断是否有互斥的数据
    if (item.mutexkey) {
      // 遍历数组
      item.mutexkey.forEach((val: string) => {
        if (val) {
          const mutexkeyInfo: string[] = val.split('.');
          this.messsageBus.emit(mutexkeyInfo[0], mutexkeyInfo[1]);
        }
      });
    }
    if (item.hasOwnProperty('isOpen')) {
      item.isOpen = !item.isOpen;
    }
    if (item.leftComponentName) {
      clearPeripheral(this);
      clearPathPlanning(this);
      closeRightVideo(this);
      clearTrack(this);
      this.messsageBus.emit('DisasterDecideRigth' , item.isOpen ? item.rightComponentName : '' , item.isOpen ? item.leftComponentName : '');
    } else {
      if (tempFun[item.key]) {
        tempFun[item.key](this, item);
      }
    }
  }
  private created() {
    this.getData();
    const self: any = this;
    // 循环互斥事件监听
    // this.messsageBus.off('ToolIconEventOverview');
    this.messsageBus.on('ToolIconEventOverview', (item: string, isClose: boolean): void => {
      const tempFun: any = mapUtilFun;
      // " , " 分割对应的key
      const funKeyName = item.split(',');
      funKeyName.forEach((val) => {
        /**
         * 判断有没有 " - "  如果有就是还有二级菜单 如测量中的 测量面积  和测量距离
         * */
        if (val.indexOf('-') > -1) { // 这里是有二级菜单
          const valName = val.split('-');
          // 找到对应的二级菜单list
          const listData: any = (self.originDatas.find((v: any) => v.key === valName[0]) as any).list;
          // 处理对应的二级菜单内容
          const originDataInfo: any = listData.find((v: any) => v.key === valName[1]);
          if (originDataInfo && originDataInfo.hasOwnProperty('isOpen')) {
            originDataInfo.isOpen = false;
          }
        } else { //  没有二级菜单
          // 关闭的按钮恢复默认关闭
          const originDataInfo: any = self.originDatas.find((v: any) => v.key === val);
          if (originDataInfo && originDataInfo.hasOwnProperty('isOpen')) {
            originDataInfo.isOpen = false;
          }
        }
        // 如果是此处调取的关闭,退出,点击弹窗关闭的继续
        if (isClose) {
          return;
        }
        if (tempFun[val]) {
          tempFun[val](self, { isOpen: false });
        }
      });
    });
  }

  /**
   * 监听事件类型 发生改变时 重新获取对应事件list
   * */
  @Watch('$store.state.eventPushStore.eventLocation.EventType')
  private mapCommonTools_type(type: any) {
    if (type) { // 常态下没有
      this.getData();
    }
  }

  private destroyed(): void {
    // this.messsageBus.off('ToolIconEventOverview');
  }
}
</script>
<style lang="less" scoped>
</style>
