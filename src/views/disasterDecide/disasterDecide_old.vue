<template>
  <div class="abdcd">
    <GisMapToolMore :options="originDatas" @clickHandler="choiceHandler"></GisMapToolMore>
    <!--<GisMapToolMore :options="options" @clickHandler="choiceHandler" :lastKey="lastKey" ></GisMapToolMore>-->
  </div>
</template>
<script lang="ts">
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
  import GisMapToolMore from '@/components/feature/gisModle/gisMapTool/GisMapToolMore.vue';
  import { clearPeripheral , clearPathPlanning , closeRightVideo , mapUtilFun } from '@/views/common/nvaUtil/nvaUtil' ;
  @Component({
    name: 'DisasterDecide',
    components : {
      GisMapToolMore,
    },
  })
  export default class DisasterDecide extends Vue {
    @Prop({
      default: () => [],
    })
    public options?: any;
    public leftComponentName: any;
    public originDatas: any[] = [];
    // 绑定每一种逻辑的情况
    private choiceHandler(data: any) {
      data.isOpen = !data.isOpen;
      if (!data.isOpen) {
        this.clearMapComponents();
        if (data.is2d === '3d') {
          this.$store.commit('controlMoudle/setMapDimensionality', '2d');
          this.getComponent('map3d').syncronizeViewFrom3D();
        }
        return;
      }
      // 加载组件的逻辑，此处要进行判定，工具条的几种状态
      this.loadComponents(data);
      // 二三维切换的方法
      if (data.is2d === '3d') {
        this.$store.commit('controlMoudle/setMapDimensionality', '3d');
        this.getComponent('map3d').syncronizeViewFrom2D();
      }
      // 影响圈和烈度圈
      if (data.circleFlag === 0) {
        this.messsageBus.emit('clickFromToolNav', 'influence');
      } else if (data.circleFlag === 1) {
        this.messsageBus.emit('clickFromToolNav', 'Intensity');
      }
      // 发送影响圈和烈度圈
      this.messsageBus.emit('setMapCircle', data.key);
      // 人口热力
      if (data.key === '_popluheat') {
        this.messsageBus.emit('clickFromToolNav', 'openThermodynamiTc');
      } else {
        this.messsageBus.emit('clickFromToolNav', 'closeThermodynamiTc');
      }
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
    // 清空左侧面板的方法
    private clearMapComponents() {
      this.messsageBus.$emit('DisasterDecideRigth' , '' , '');
    }
    // 加载第一个左右组件的逻辑
    private loadComponents(data: any) {
      // 右侧面板弹出的逻辑
      // this.$emit('monitorCmpName', data.rightComponentName);
      this.leftComponentName = data.leftComponentName;
      this.messsageBus.emit('DisasterDecideRigth' , data.rightComponentName , data.leftComponentName);
      // 清除路径规划与周边查询
      clearPeripheral(this);
      clearPathPlanning(this);
      closeRightVideo(this);
      // 点击有数字时，要清除total
      this.clearTotal(data);
    }
    // 清除total
    private clearTotal(data: any) {
      if (data.pushLocationKeyArr) {
        data.pushLocationKeyArr.forEach((item: any) => {
          this.$store.state.eventPushStore[item] = 0 ;
        });
      }
    }
    // 得到地图的方法
    private getComponent(cmpName: string = 'gisToolComp') {
      // map3d
      let component = null;
      const factory = this.$ioc.resolve('GISFactory-map');
      if (factory) {
        component = factory.commonFactory.getComponent(cmpName);
      }
      return component;
    }
    // 监听切换nva时，清除的方法
    private clear() {
      this.messsageBus.on('clearLeftRight', () => {
        this.clearMapComponents();
        // 清除路径规划与周边查询
        clearPeripheral(this);
        clearPathPlanning(this);
        closeRightVideo(this);
      });
    }
    private created() {
      const self: any = this;
      // 循环互斥事件监听
      self.messsageBus.on('disasterDecide', (item: string, isClose: boolean): void => {
        const tempFun: any = mapUtilFun;
        const funKeyName = item.split(',');
        funKeyName.forEach((val) => {
          if (val.indexOf('-') > -1) {
            const valName = val.split('-');
            const listData: any = (self.originDatas.find((v: any) => v.key === valName[0]) as any).list;
            const originDataInfo: any = listData.find((v: any) => v.key === valName[1]);
            if (originDataInfo && originDataInfo.hasOwnProperty('isOpen')) {
              originDataInfo.isOpen = false;
            }
          } else {
            // 关闭的按钮恢复默认关闭
            const originDataInfo: any = self.originDatas.find((v: any) => v.key === val);
            if (originDataInfo && originDataInfo.hasOwnProperty('isOpen')) {
              originDataInfo.isOpen = false;
            }
          }
          if (val === '_disasterstyle') {
            this.$store.commit('controlMoudle/setMapDimensionality', '2d');
            this.getComponent('map3d').syncronizeViewFrom3D();
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
      this.originDatas = this.options;
      this.clear();
    }

    private destroyed() {
      this.messsageBus.emit('DisasterDecideRigth' , '' , '');
    }
  }
</script>
