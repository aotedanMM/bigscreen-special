<template>
  <div class="riskHidden">
    <p class="title">
      {{ showTitle }}<ZoomBtn v-if="showTitle === '应急资源'"></ZoomBtn>
    </p>
    <span v-if="showTitle !== '应急资源'" @click="getBack" class="toBack_">
    </span>
    <el-scrollbar style="height: 100%">
      <CommonList
        :contListAll="contListAll"
        @addMapdot="addMapdot"
        @changeKuang="changeKuang"
        @addMapdotChecked="addMapdotChecked"
        @changeNumChecked="changeNumChecked"
        @changeBox="changeBox"
        v-if="showTitle === '应急资源'"
        :showKeyIcon="showKeyIcon"
        ref="mychildEmergency"
      ></CommonList>
      <CommonListTwo
        :childernList="childernList"
        @addMapdot="addMapdot"
        @changeKuang="changeKuang"
        @addMapdotChecked="addMapdotChecked"
        @changeNumChecked="changeNumChecked"
        @changeBtn="changeBtn"
        ref="mychildEmergencyTwo"
        :showTitle="showTitle"
        :showKeyIcon="showKeyIcon"
        :codeKey="codeKey"
        :btnTable="btnTable"
        v-if="showTitle !== '应急资源'"
      ></CommonListTwo>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import CommonList from '@/components/feature/riskHiddenView/children/CommonList.vue';
import CommonListTwo from '@/components/feature/riskHiddenView/children/CommonListTwo.vue';
import {
  baseDataServer,
  detailInfoServer,
  emerSourceServer,
  riskSourceServer,
  nomalLeftServer,
} from '@/api/installServer';
import ZoomBtn from '../flood/ZoomBtn.vue'; // 导入最小化组件

@Component({
  name: 'EmergencyResource',
  components: {
    CommonList,
    CommonListTwo,
    ZoomBtn,
  },
})
export default class EmergencyResource extends Vue {
  // 加载点位的名称
  public popIsSureName: string = '';
  // 点击数字传上来的展示数据
  public paramData: any = {};
  // 请求参数, 转化为type
  private requestArgs: any = [];
  // 显示隐藏按钮
  private showZoomBtn: boolean = true;
  private showTitle: any = '应急资源';
  private showKeyIcon: any = 'yjzy';
  // 用于判断是否显示多选列表
  private codeKey: any = '';
  private childernList: any = '';
  private contListAll: any = [];
  // 专家按钮统计
  private btnTable: any = [];
  // 应急专家分组 默认
  private ExpertData: any = [];
  // 专家擅长领域 默认
  private ExpertDataTwo: any = [];
  private dataArr: any = '';
  private title: any = '';
  private clearKey: any = '';
  // 应急资源数据请求接口
  private initData() {
    const self = this;
    // const type='landslide,debrisflow,mountaincollapse,bottomcollapse,productionindustry,runeddustry,useddustry,otherdustry,majordanger,tailingpond,firework,fireworkhouse,metalnonmetal,coal,metallurgical,nonferrous,mechanical,dust,refrigeration';
    this.requestArgs = [];  //  请求请求参数；
    this.handleArgs(self.contListAll);
    const type: string = this.requestArgs.toString();
    this.getComponent_new()
      .getMultiuleAllNum(type)
      .then((data: any) => {
        const temp: any = [];
        Object.keys(data).forEach((item) => {
          temp.push({
            codeKey: item,
            tabNumber: data[item],
          });
        });
        self.deleteNull(temp, self.contListAll);
        // 取消走单独处理装备的总数统计 毕东方 2021.11.23
        // self.handleEquipment();  // 单独处理装备的总数统计
        // console.log(data, 9999999999);
      });
  }

  // 子页面切换点击事件
  private changeBox(data: any) {
    const self = this;
    if (data.select === 'zj') {
      this.childernList = this.ExpertData;
      this.codeKey = 'zj';
    } else {
      this.childernList = data.list;
      this.codeKey = 'jyzb';
      this.getComponent()._clearLayers();
    }
    this.showTitle = data.title;
  }

  // 处理数据统计
  private handleArgs(item: any) {
    item.forEach((i: any) => {
      // 取消走单独处理装备的总数统计 毕东方 2021.11.23
      // if (i.title === '救援装备') {
      //   return; // 救援装备单独处理
      // }
      if (i.list && i.list.length) {
        this.handleArgs(i.list);
      } else if (typeof i.codeKey === 'string') {
        this.requestArgs.push(i.codeKey);
      }
    });
  }

  // 单独处理装备数据统计
  private handleEquipment() {
    const numList: any = [];
    this.contListAll.forEach((tab: any) => {
      if (tab.title === '救援装备') {
        const type = 'equipment';
        this.getComponent_new()
          .getMultiuleAllNumEquip(type)
          .then((data: any) => {
            let num: any = 0;
            data.forEach((item: any) => {
              num += item.sum;
              numList.push(
                {
                  codeKey: item.equiptypecode,
                  tabNumber: item.sum,
                  equipment: true,  // @1 添加装备标记，在@2处理
                },
              );
            });
            tab.tabNumber = num;
            this.deleteNull(numList, this.contListAll);
          });
      }
    });

  }

  // 子页面切换点击事件
  private changeBtn(item: any) {
    // 清理地图图层图标
    this.getComponent()._clearLayers();
    this.deepQuery(this.childernList);
    switch (item.codeKey) {
      case 'Expert※01':
        this.childernList = this.ExpertData;
        break;
      case 'Expert※12':
        this.childernList = this.ExpertDataTwo;
        break;

      default:
        break;
    }
  }
  private getBack() {
    this.showTitle = '应急资源';
    this.deepQuery(this.contListAll);
    this.getComponent()._clearLayers();
    this.showZoomBtn = true;
  }
  private deepQuery(tree: any) {
    // 递归匹配数据
    for (const item of tree) {
      if (item.codeKey) {
        item.checked = false;
        item.numChecked = false;
      }
      if (item.list && item.list.length > 0) {
        this.deepQuery(item.list);
      }
    }
  }
  // 文字点击事件
  private addMapdot(data: any, checked: any) {
    /**
     * 隐藏常态模式事件分布
     * 隐藏地图上的事件点
     * */
    this.messsageBus.emit('eventInfoMapShow', false);
    this.getComponent()._clearLayers();
    if (checked) {
      this.getComponent().showResource(data.codeKey);
    }
    // 取消弹窗列表
    this.messsageBus.emit('clickEmerencyResourcesNum', null, false);
  }
  // 文字点击多选上图
  private addMapdotChecked(data: any) {
    this.messsageBus.emit('eventInfoMapShow', false);
    this.getComponent_new()._clearLayerByID(data.codeKey);
    if (data.checked) {
      this.getComponent_new().showExtentData(data.codeKey);
      // this.getComponent().showResource(data.codeKey);
    }
    // else {
    //   this.getComponent()._clearLayerByID(data.codeKey);
    // }
    // 取消弹窗列表
    this.messsageBus.emit('clickEmerencyResourcesNum', null, false);
  }
  // 数字点击事件
  private changeKuang(data: any, checked: boolean, textHandlerName?: string) {
    this.clearKey = data.codeKey;
    if (!checked) {
      if (textHandlerName === 'close') {
        return;
      } else {
        if (this.showTitle !== '应急资源') {
          (this.$refs.mychildEmergencyTwo as any).closePanelFn();
        } else {
          (this.$refs.mychildEmergency as any).closePanelFn();
        }
      }
    } else {
      this.paramData = {
        item: data,
        panelType: 'emergencyResource',
      };
      this.popIsSureName = textHandlerName || '';
      if (checked && this.popIsSureName) {
        this.getComponent().showResource(data.codeKey);
      }
      if (!this.popIsSureName) {
        this.messsageBus.emit(
          'clickEmerencyResourcesNum',
          this.paramData,
          checked,
        );
      } else {
        this.messsageBus.emit(
          'clickEmerencyResourcesNum',
          this.paramData,
          true,
        );
      }
    }
  }
  // 数字点击事件
  private changeNumChecked(data: any, textHandlerName?: string) {
  if (!data.numChecked) {
      if (textHandlerName === 'close') {
        return;
      } else {
        // 清理地图对应图层图标
        this.getComponent_new()._clearLayerByID(data.codeKey);
        // 取消弹窗列表
        this.messsageBus.emit('clickEmerencyResourcesNum', null, false);
      }
    } else {
      this.paramData = {
        item: data,
        panelType: 'emergencyResource',
      };
      this.popIsSureName = textHandlerName || '';
      this.getComponent_new()._clearLayerByID(data.codeKey);
      // this.getComponent_new()._clearLayerByID('repository');

      if (data.checked && this.popIsSureName) {
        this.getComponent_new().showExtentData(data.codeKey);
      }
      if (!this.popIsSureName) {
        this.messsageBus.emit(
          'clickEmerencyResourcesNum',
          this.paramData,
          data.checked,
        );
      } else {
        this.messsageBus.emit(
          'clickEmerencyResourcesNum',
          this.paramData,
          true,
        );
      }
    }
  }

  private getTargetItem(sourceKey: any, sourceList: any[]) {
    const targetItem = sourceList.find((fitem: any, findex: number) => {
      return fitem.codeKey === sourceKey;
    });
    return targetItem;
  }

  // 从list中拿到codeKey数组中需要的结果对象数组
  private getTargetItemAll(codeKeyArr: any, sourceList: any[]) {
    let arr: any = [];
    arr = sourceList.filter((litem: any, lindex: number) => {
      return codeKeyArr.includes(litem.codeKey);
    });
    return arr;
  }

  private getTargetItemAllTabnumsum(codeKeyArr: any, sourceList: any[]) {
    let sum = 0;
    const resultArr = this.getTargetItemAll(codeKeyArr, sourceList);
    resultArr.forEach((item: any, index: number) => {
      sum += item.tabNumber ? item.tabNumber : 0;
    });
    return sum;
  }

  // 匹配辅助
  private deleteNull(list: any, sourceArr: any[]) {
    sourceArr.forEach((item: any, index: number) => {
      if (item.specialType === 'codeStr' || !item.specialType) {
        // 如果没有配置，默认为codeStr
        const itemInList = this.getTargetItem(item.codeKey, list);
        if (itemInList) {
          item.tabNumber = itemInList.tabNumber ? itemInList.tabNumber : 0;
        }
      } else if (item.specialType === 'codeArr') {
        // 匹配codeKey为数组的
        const itemArrInListSum = this.getTargetItemAllTabnumsum(
          item.codeKey,
          list,
        );
        item.tabNumber = itemArrInListSum === 0 ? item.tabNumber : itemArrInListSum;
      }
      if (item.list && item.list.length) {
        this.deleteNull(list, item.list);
      }
    });
  }
  private created() {
    // 判断是否有配置项，没有走默认配置
    let eventContListAll = this.$store.state.configModel.config
      .RightSideBarList;
    if (eventContListAll) {
      // 读取配置项应急资源
      eventContListAll = JSON.parse(JSON.stringify(eventContListAll));
      this.contListAll = eventContListAll.EmergencyResource;
      // 应急资源数据请求接口
      this.initData();
    } else {
      // 请求配置文件对应的初始数据
      nomalLeftServer.getInitDataYjzy().then((res: any) => {
        this.contListAll = res.data;
        // 应急资源数据请求接口
        this.initData();
      });
    }
  }
  private beforeDestroy() {
    // 清理地图图层图标
    this.getComponent_new()._clearLayerByID(this.clearKey);
    this.getComponent()._clearLayerByID(this.clearKey);
    this.getComponent()._clearLayers();
    // 列表关闭弹框事件
    this.messsageBus.emit('clickEmerencyResourcesNumPanelClosed', {}, false);
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
}
</script>
<style lang="less" scoped>
@imgUrl: "../../../assets/img/default/panel/";
.riskHidden {
  height: 95%;
  .title {
    font-weight: 600;
    font-family: "myHeiti";
    font-size: calc(20px * 1.5);
    color: 00e4ff;
    background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -1px;
    padding-left: 20px;
    font-style: italic;
  }
  .toBack_ {
    position: absolute;
    right: 0;
    top: 10px;
    width: 61px;
    height: 25px;
    display: block;
    cursor: pointer;
    background: url("@{imgUrl}toBack.png") no-repeat center center;
    &:hover {
      background: url("@{imgUrl}toBack_h.png") no-repeat center center;
    }
  }
}
</style>
