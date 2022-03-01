<template>
  <div class="riskHidden">
    <p class="title">
      {{ showTitle }}
      <div class="select-container">
          <el-select v-model="btnflags" placeholder="请选择" >
            <el-option
              v-for="item in btnlist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      <ZoomBtn></ZoomBtn>
    </p>
    <el-scrollbar style="height:100%">
      <CommonList
        :contListAll="contListAll"
        @addMapdotChecked="addMapdotChecked"
        @changeNumChecked="changeNumChecked"
        :showKeyIcon="showKeyIcon"
        ref="mychildEmergency"
      ></CommonList>
    </el-scrollbar>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import CommonList from '@/components/feature/riskHiddenView/children/CommonList.vue';
import {
  baseDataServer,
  detailInfoServer,
  emerSourceServer,
  riskSourceServer,
  nomalLeftServer,
} from '@/api/installServer';
import ZoomBtn from '../flood/ZoomBtn.vue'; // 导入最小化组件

@Component({
  name: 'RiskHiddenView',
  components: {
    CommonList,
    ZoomBtn,
  },
})
export default class RiskHiddenView extends Vue {
  // 加载点位的名称
  public popIsSureName: string = '';
  // 点击数字传上来的展示数据
  public paramData: any = {};
  // 请求参数, 转化为type
  private requestArgs: any = [];
  private showTitle: any = '安全生产';
  private showKeyIcon: any = 'fxyh';
  private contListAll: any = [];
  private dataArr: any = '';
  private title: any = '';
  private clearKey: any = '';
  private btnflags: any = '';
  private btnlist = [
    {
      label: '全部',
      value: '',
    },
    {
      label: '企业视频',
      value: '0',
    },
    {
      label: '实时监测',
      value: '1',
    },
  ];
  @Watch('btnflags')
  public btnflagsList(val: any) {
    this.initData();
  }
  // 风险隐患数据请求接口
  private initData() {
    const self = this;
    // const type='landslide,debrisflow,mountaincollapse,bottomcollapse,productionindustry,runeddustry,useddustry,otherdustry,majordanger,tailingpond,firework,fireworkhouse,metalnonmetal,coal,metallurgical,nonferrous,mechanical,dust,refrigeration';
    this.requestArgs = [];  //  请求请求参数；
    this.handleArgs(self.contListAll);
    this.$store.commit('configModel/setIsCheck', self.btnflags);
    const type: string = this.requestArgs.toString();
    this.getComponent_new()
      .getMultiuleAllNum(type, self.btnflags)
      .then((data: any) => {
        const temp: any = [];
        Object.keys(data).forEach((item) => {
          temp.push({
            codeKey: item,
            tabNumber: data[item],
          });
        });
        self.deleteNull(temp, self.contListAll);
        console.log(data, 9999999999);
      });
    // riskSourceServer.getStatistics({}).then((res: any) => {
    //   console.log(res, 'qqqqqqqqqqqqqqqq');
    //   self.deleteNull(res.list, self.contListAll);
    // });
  }

  private handleArgs(item: any) {
    item.forEach((i: any) => {
      // if (i.title === "救援装备") {
      //   return; // 救援装备单独处理
      // }
      if (i.list && i.list.length) {
        this.handleArgs(i.list);
      } else if (typeof i.codeKey === 'string') {
        this.requestArgs.push(i.codeKey);
      }
    });
  }
  // 文字点击事件
  // private addMapdot(data: any, checked: any) {
  //   /**
  //    * 隐藏常态模式事件分布
  //    * 隐藏地图上的事件点
  //    * */
  //   this.messsageBus.emit('eventInfoMapShow', false);
  //   this.getComponent()._clearLayers();
  //   if (checked) {
  //     this.getComponent().showResource(data.codeKey);
  //   }
  //   // 取消弹窗列表
  //   this.messsageBus.emit('clickEmerencyResourcesNum', null, false);
  // }
  // 文字点击多选上图
  private addMapdotChecked(data: any) {
    const self = this;
    this.messsageBus.emit('eventInfoMapShow', false);
    this.getComponent_new()._clearLayerByID(data.codeKey);
    if (data.checked) {
      this.getComponent_new().showExtentData(data.codeKey, self.btnflags);
     // this.getComponent().showResource(data.codeKey);
    }
    // else {
    //   this.getComponent()._clearLayerByID(data.codeKey);
    // }
    // 取消弹窗列表
    this.messsageBus.emit('clickEmerencyResourcesNum', null, false);
  }
  // 数字点击事件
  // private changeKuang(data: any, checked: boolean, textHandlerName?: any) {
  //   if (!checked) {
  //     if (textHandlerName === 'close') {
  //       return;
  //     } else {
  //       (this.$refs.mychildEmergency as any).closePanelFn();
  //     }
  //   } else {
  //     this.paramData = {
  //       item: data,
  //       panelType: 'riskTrouble',
  //     };
  //     this.popIsSureName = textHandlerName || '';
  //     if (checked && this.popIsSureName) {
  //       this.getComponent()._clearLayers();
  //       this.getComponent().showResource(data.codeKey);
  //     }
  //     if (!this.popIsSureName) {
  //       this.messsageBus.emit(
  //         'clickEmerencyResourcesNum',
  //         this.paramData,
  //         checked,
  //       );
  //     } else {
  //       this.messsageBus.emit('clickEmerencyResourcesNum', this.paramData, true);
  //     }
  //   }
  // }
  // 多选数字点击事件
  private changeNumChecked(data: any, textHandlerName?: string) {
    if (!data.numChecked) {
      if (textHandlerName === 'close') {
        return;
      } else {
        // 清理地图对应图层图标
        this.getComponent()._clearLayerByID(data.codeKey);
        // 取消弹窗列表
        this.messsageBus.emit('clickEmerencyResourcesNum', null, false);
        // (this.$refs.mychildEmergency as any).closePanelFn();
      }
    } else {
      this.paramData = {
        item: data,
        panelType: 'riskTrouble',
      };
      this.popIsSureName = textHandlerName || '';
      this.getComponent_new()._clearLayerByID(data.codeKey);
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
  private getTargetItem(sourceKey: any, sourceList: any[]) {
    const targetItem = sourceList.find((fitem: any, findex: number) => {
      return fitem.codeKey === sourceKey;
    });
    return targetItem;
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
        item.tabNumber = itemArrInListSum;
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
      // 读取配置项风险隐患
      eventContListAll = JSON.parse(JSON.stringify(eventContListAll));
      this.contListAll = eventContListAll.RiskHiddenView;
      // 风险隐患数据请求接口
      this.initData();
    } else {
      // 请求配置文件对应的初始数据
      nomalLeftServer.getInitDataFxyh().then((res: any) => {
        this.contListAll = res.data;
        // 风险隐患数据请求接口
        this.initData();
      });
    }
  }
  private mounted() {
    // 风险隐患数据请求接口
    // this.initData();
    // const self = this;
  }
  private beforeDestroy() {
    // 列表关闭弹框事件
    this.messsageBus.emit('clickEmerencyResourcesNumPanelClosed', {}, false);
    // 清理地图图层图标
    this.getComponent()._clearLayers();
    this.getComponent_new()._clearLayerByID(this.clearKey);
    this.getComponent()._clearLayerByID(this.clearKey);
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
.riskHidden {
  height: 95%;
  // margin-bottom: 8px;
  // overflow: hidden;
  // height: 270px;
  .title {
    font-weight: 600;
    font-family: 'myHeiti';
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
  /deep/.select-container {
      width: 174px;
      height: 30px;
      padding: 0;
      position: absolute;
      top: 3px;
      left: 140px;
      border: 1px solid #0ceff5;
      .el-select {
        margin: 0;
        float: left;
        .el-input {
          border-radius: 4px;
        }
        .el-input__inner {
          background: none;
          border-radius: 4px;
          border: none;
          font-size: 24px;
          color: #fff;
          height: 30px;
        }
      }
    }
}
</style>
