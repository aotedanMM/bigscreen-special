<template>
    <div class="riskHidden">
        <p class="title">
            {{ showTitle }}
            <ZoomBtn></ZoomBtn>
        </p>
        <el-scrollbar style="height: 100%">
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
import {Component, Vue, Watch, Prop} from 'vue-property-decorator';
import CommonList from '@/components/feature/riskHiddenView/children/CommonList.vue';
import {
  baseDataServer,
  detailInfoServer,
  emerSourceServer,
  riskSourceServer,
  nomalLeftServer,
} from '@/api/installServer';
import ZoomBtn from '../flood/ZoomBtn.vue'; // 导入最小化组件
import {firePointMonitorServer} from '@/api/feature/monitorwarning/installServer';

@Component({
  name: 'SenResistantLayer',
  components: {
    CommonList,
    ZoomBtn,
  },
})
export default class SenResistantLayer extends Vue {
  // 加载点位的名称
  public popIsSureName: string = '';
  // 点击数字传上来的展示数据
  public paramData: any = {};
  // 请求参数, 转化为type
  private requestArgs: any = [];
  // 显示标题
  private showTitle: any = '森林防火';
  // 用于显示对应文件下面的小图标
  private showKeyIcon: any = 'sftc';
  // 静态文件数据
  private contListAll: any = [];
  private focusOnCityData: any = ''; // 重点乡镇数据

  private handleArgs(item: any) {
    // 森防图层前四个没有总数展示，排除这四个key
    const exceptType = ['ForestFireAreaLayer', 'ForestResourceLayer', 'ForestTreeStructureLayer', 'MajorTown'];
    item.forEach((i: any) => {
      // if (i.title === "救援装备") {
      //   return; // 救援装备单独处理
      // }
      if (i.list && i.list.length) {
        this.handleArgs(i.list);
      } else if (typeof i.codeKey === 'string') {
        if (!exceptType.includes(i.codeKey)) {
          this.requestArgs.push(i.codeKey);
        }
      }
    });
  }

  // 森防数据请求接口
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
        console.log(data, 9999999999);
      });
    // emerSourceServer.getStatistics({}).then((res: any) => {
    //   // console.log(res, "qqqqqqqqqqqqqqqq");
    //   self.deleteNull(res.list, self.contListAll);
    // });
  }

  // 文字点击多选上图
  private addMapdotChecked(data: any) {
    this.messsageBus.emit('eventInfoMapShow', false);
    switch (data.codeKey) {
      case 'ForestFireAreaLayer': // 全市森林防火重点区域
      case 'ForestResourceLayer': // 全市森林资源分布图
      case 'ForestTreeStructureLayer': // 全市树种结构分布图
      case 'MajorTown': // 全市森林防灭火重点乡镇
        this.addSenCoverage(data);
        break;
      default:
        this.getComponent_new()._clearLayerByID(data.codeKey);
        if (data.checked) {
          this.getComponent_new().showExtentData(data.codeKey);
          // this.getComponent().showResource(data.codeKey);
        }
        // else {
        //   this.getComponent()._clearLayerByID(data.codeKey);
        // }
        break;
    }
    // 取消弹窗列表
    this.messsageBus.emit('clickEmerencyResourcesNum', null, false);
  }

  private addSenCoverage(data: any) {
    let key: any;
    let obj: any;
    switch (data.codeKey) {
      case 'ForestFireAreaLayer':
        key = 'ForestFireAreaLayer';
        break;
      case 'MajorTown':
        key = 'MajorTown';
        break;
      case 'ForestResourceLayer':
        key = 'ForestResourceLayer';
        obj = {
          id: 'ForestResources',
          name: '森林资源',
        };
        break;
      case 'ForestTreeStructureLayer':
        key = 'ForestTreeStructureLayer';
        obj = {
          id: 'TreeStructure',
          name: '树种结构',
        };
        break;
      default:
        break;
    }
    if (data.checked) {
      this.getComponent1().addLayer(key);
      if (obj) {
        this.$store.commit('mapTools/addSelectedLayer', {
          id: obj.id,
          name: obj.name,
          play: false,
          legend: {component: obj.id},
        });
      }
    } else {
      this.getComponent1().removeLayer(key);
      if (obj) {
        this.$store.commit('mapTools/removeSelectedLayer', {
          id: obj.id,
        });
      }
    }
  }

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
        panelType: 'emergencyResource',
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
    // this.getFocusOnCityData();
    // 请求配置文件对应的初始数据
    nomalLeftServer.getInitDataSenResistant().then((res: any) => {
      this.contListAll = res.data;
      this.initData();
    });
  }

  // 获取重点乡镇接口
  // private async getFocusOnCityData() {
  //   const res: any = await firePointMonitorServer.getFocusOnCity();
  //   this.focusOnCityData = res;
  // }
  private mounted() {
    // 风险隐患数据请求接口
    // this.initData();
    const self = this;
  }

  private beforeDestroy() {
    // 列表关闭弹框事件
    this.$store.commit('configModel/setContListAll', []);
    // console.log(this.contListAll,'contListAllcontListAllcontListAllcontListAllcontListAll')
    this.messsageBus.emit('clickEmerencyResourcesNumPanelClosed', {}, false);
    // 清理地图图层图标
    this.getComponent()._clearLayers();
    const mapList = [
      'ForestTreeStructureLayer',
      'ForestFireAreaLayer',
      'ForestResourceLayer',
      'MajorTown',
    ];
    // mapList.forEach((item: any) => {
    //   this.getComponent1().removeLayer(item);
    //   switch (item) {
    //     case "ForestResourceLayer":
    //       this.$store.commit("mapTools/removeSelectedLayer", {
    //         id: "ForestResources",
    //       });
    //       break;
    //     case "ForestTreeStructureLayer":
    //       this.$store.commit("mapTools/removeSelectedLayer", {
    //         id: "TreeStructure",
    //       });
    //       break;
    //     default:
    //       break;
    //   }
    // });
  }

  //  地图组件
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent('ResourceComponent');
    return component;
  }

  //  地图组件
  private getComponent1() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('mapserviceIn');
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
            font-family: "myHeiti";
            font-size: calc(20px * 1.5);
            color: 00 e4ff;
            background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -1px;
            padding-left: 20px;
            font-style: italic;
        }
    }
</style>
