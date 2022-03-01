<template>
    <div class="abdcd">
        <GisMapToolMore :options="originDatas" @clickHandler="choiceHandler"></GisMapToolMore>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import GisMapToolMore from '@/components/feature/gisModle/gisMapTool/GisMapToolMore.vue';
import { IMapToolItem } from '@/interface/feature/common/mapTool/MapTool.interface';
import { gisToolServer } from '@/api/installServer';
import {mapUtilFun } from '@/views/common/nvaUtil/nvaUtil' ;
@Component({
  name: 'DisasterDecide',
  components : {
      GisMapToolMore,
  },
})
export default class DisasterDecide extends Vue {
    public leftComponentName: any;
    public originDatas: IMapToolItem[] = [];
    /**
     * 在vuex 里面选取当前工具条所需list文件名称
     * 配置 this.$store.state.configModel.config.toolConfig 的文件在
     * public\json\eventConfigJson 中 分别对应不同灾种  如地震 通用 森林 等
     * 配置其中 toolConfig 字段
     * */
    public getData() {
      const that = this;
      gisToolServer
        .getMapToolIconData('./json/gisMapTool/' + this.$store.state.configModel.config.toolConfig.disasterDecide)
        .then((res: any) => {
          that.originDatas = res.data;
        });
    }
    // 绑定每一种逻辑的情况
    private choiceHandler(data: any) {
        if (data.hasOwnProperty('isOpen')) {
          data.isOpen = !data.isOpen;
        }
        if (!data.isOpen) {
          // 清空左侧面板
          this.clearMapComponents();
          return;
        }
        // 加载组件的逻辑，此处要进行判定，工具条的几种状态
        this.loadComponents(data.typeConfig);
        // 判断是否有互斥的数据
        if (data.mutexkey) {
          // 遍历数组
          data.mutexkey.forEach((val: string) => {
            if (val) {
              const mutexkeyInfo: string[] = val.split('.');
              this.messsageBus.emit(mutexkeyInfo[0], mutexkeyInfo[1]);
            }
          });
        }
    }
    // 展示左侧面板
    private loadComponents(data: any) {
      this.messsageBus.$emit('moreDetails', data);
    }
    // 清空左侧面板的方法
    private clearMapComponents() {
        this.messsageBus.$emit('moreDetails');
    }
    private created() {
        const self: any = this;
        // 循环互斥事件监听
        // self.messsageBus.off('disasterDecide');
        self.messsageBus.on('disasterDecide', (item: string, isClose: boolean): void => {
          const tempFun: any = mapUtilFun;
          const funKeyName = item.split(',');
          funKeyName.forEach((val) => {
            /**
             * 判断有没有 " - "  如果有就是还有二级菜单 如测量中的 测量面积  和测量距离
             * */
            if (val.indexOf('-') > -1) {
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
            /**
             * 暂时无用,如果需要调用方法可以使用
             * */
            if (tempFun[val]) {
              tempFun[val](self, { isOpen: false });
            }
          });
        });
    }

    /*private destroyed(): void {
      this.messsageBus.off('disasterDecide');
    }*/
}
</script>
