<!--地图工具箱-->
<template>
  <GisMapTool :originData="originDatas" @clickHandler="funClick"></GisMapTool>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { IMapToolItem } from '@/interface/feature/common/mapTool/MapTool.interface';
import GisMapTool from '@/components/feature/gisModle/gisMapTool/GisMapTool.vue';
import { gisToolServer } from '@/api/installServer';
import { mapUtilFun } from '@/views/common/nvaUtil/nvaUtil';
import { pictureServer } from '@/api/installServer';
import {
  KnownDisasterInterface,
  KnownDisasterDataField,
} from '@/interface/feature/earthquake/KnownDisaster';
import { pushDataRequestServe } from '@/api/installServer';
@Component({
  name: 'ToolCompared',
  components: {
    GisMapTool,
  },
})
export default class ToolCompared extends Vue {
  private originDatas: IMapToolItem[] = [];
  /**
   * 在vuex 里面选取当前工具条所需list文件名称
   * 配置 this.$store.state.configModel.config.toolConfig 的文件在
   * public\json\eventConfigJson 中 分别对应不同灾种  如地震 通用 森林 等
   * 配置其中 toolConfig 字段
   * */
  public getDatateam() {
    const that = this;
    gisToolServer
      .getMapToolIconData('./json/gisMapTool/' + this.$store.state.configModel.config.toolConfig.mapToolCompared)
      .then((res: any) => {
        that.originDatas = res.data;
      });
  }
  /**
   * 监听事件类型 发生改变时 重新获取对应事件list
   * */
  @Watch('$store.state.eventPushStore.eventLocation.EventType')
  private mapCommonTools_type(type: any) {
    if (type) { // 常态下没有
      this.getDatateam();
    }
  }

  // 获取回传图像图片
  private async getData() {
    const eventId = this.$store.state.eventPushStore.eventId; // 事件id
    const locationId = 'liveSendBack'; // 位置id
    const res: any = await pushDataRequestServe.getPushDataByIds(
      eventId,
      locationId,
    );
    let tsData: any;
    const content = JSON.parse(res.data.content || '{}');
    if (content.length > 0) {
      const data = JSON.parse(content[0].data || '{}');
      tsData = data.event[0];
    }
    if (tsData && tsData.imgs.length > 0) {
      return tsData.imgs.map((item: any) => {
        return item.img;
      });
    }
  }

  /**
   * 点击事件  点击对应按钮 触发对应事件
   * */
  private funClick(item: any) {
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
    // 图像回传
    if (item.key === 'returnImage') {
      tempFun[item.key](this, item, this.getData);
      return false;
    }
    // 调取方法文件内的对应方法
    if (tempFun[item.key]) {
      tempFun[item.key](this, item);
    }
  }
  private created() {
    this.getDatateam();
    const self: any = this;
    // 循环互斥事件监听
    // this.messsageBus.off('ToolCompared');
    this.messsageBus.on('ToolCompared', (item: string): void => {
      const tempFun: any = mapUtilFun;
      // " , " 分割对应的key
      const funKeyName = item.split(',');
      funKeyName.forEach( (val: any) => {
        // 关闭的按钮恢复默认关闭
        const originDataInfo: any = self.originDatas.find((v: any) => v.key === val);
        if (originDataInfo && originDataInfo.hasOwnProperty('isOpen')) {
          originDataInfo.isOpen = false;
        }
        if (tempFun[val]) {
          tempFun[val](self, { isOpen: false });
        }
      });
    });
  }
  private destroyed(): void {
    // this.messsageBus.off('ToolCompared');
  }
}
</script>
<style lang="less" scoped>
</style>
