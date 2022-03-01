<!--地图工具箱-->
<template>
  <GisMapTool :originData='originDatas' @clickHandler='clickHandler'></GisMapTool>
</template>
<script lang='ts'>
import { Component, Vue, Prop , Watch} from 'vue-property-decorator';
import GisMapTool from '@/components/feature/gisModle/gisMapTool/GisMapTool.vue';
import { gisToolServer } from '@/api/installServer';
import { mapUtilFun } from '@/views/common/nvaUtil/nvaUtil' ;
import { IMapToolItem } from '@/interface/feature/common/mapTool/MapTool.interface';

@Component({
  name: 'CommonTools',
  components: {
    GisMapTool,
  },
})

export default class CommonTools extends Vue {
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
      .getMapToolIconData('./json/gisMapTool/' + this.$store.state.configModel.config.toolConfig.mapCommonTools)
      .then((res: any) => {
        const mapDimensionality = that.$store.state.controlMoudle.mapDimensionality;
        if (mapDimensionality === '2d') {
          const dataList = res.data;
          const clIndex = dataList.findIndex((fitem: any, findex: number) => {
            return (fitem.key === 'measuringTools');
          });
          if (clIndex !== -1) {
            for (let i = 0; i < dataList[clIndex].list.length; i++) {
              if (dataList[clIndex].list[i].key === 'measureHeight' || dataList[clIndex].list[i].key === 'measureSlope') {
                dataList[clIndex].list.splice(i, 1);
                i--;
              }
            }
          }
          that.originDatas = dataList;
          return that.originDatas;
        } else {
          that.originDatas = res.data;
        }
      });
  }

  /**
   * 监听事件类型 发生改变时 重新获取对应事件list
   * */
  @Watch('$store.state.eventPushStore.eventLocation.EventType')
  private mapCommonTools_type() {
    this.getData();
  }
  //  监听2d/3d：2d工具箱-测量工具-隐藏坡度和高度测量，3d:全展示；
  @Watch('$store.state.controlMoudle.mapDimensionality')
  private mapDimensionality() {
    this.getData();
  }
  private clickHandler(item: any) {
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
    if (tempFun[item.key]) {
      tempFun[item.key](this , item);
    }
  }

  private created() {
    this.getData();
    const self: any = this;
    // 循环互斥事件监听
    this.messsageBus.on('commonTools', (item: string, isClose: boolean): void => {
      // 如果是此处调取的关闭,退出,点击弹窗关闭的继续
      if (isClose) {
        const originDataInfo: any = self.originDatas.find((v: any) => v.key === item);
        if (originDataInfo && originDataInfo.hasOwnProperty('isOpen')) {
          originDataInfo.isOpen = false;
        }
        return;
      }
      const tempFun: any = mapUtilFun;
      const funKeyName = item.split(',');
      funKeyName.forEach((val) => {
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
}
</script>
<style lang='less' scoped>
</style>
