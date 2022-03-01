<template>
  <panel :title="title" @fatherMethodEmergency="clickParentEmergency" class="emergency_panel_bg">
    <emergency-resource
      ref="mychildEmergency"
      :panelType="panelType"
      :clickTextHandler="clickTextHandler"
      :clickNumberHandler="clickNumberHandler"
      :dataArr="dataArr"
    ></emergency-resource>
  </panel>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import Panel from '@/components/common/panel/Panel.primary.vue';
import EmergencyResource from '@/components/feature/common/emergencyResource/EmergencyResource.vue';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import MapCommon from '@/util/MapCommon';
import { messsageBus } from '@/util/message';
import {
  baseDataServer,
  detailInfoServer,
  emerSourceServer,
  riskSourceServer,
} from '@/api/installServer';
@Component({
  name: 'EmergencyResources',
  mixins: [MapCommon],
  components: {
    Panel,
    EmergencyResource,
  },
})
export default class EmergencyResources extends Vue {
  // 加载点位的名称
  public popIsSureName: string = '';
  // 点击数字传上来的展示数据
  public paramData: any = {

  };
  // 定义应急资源面板的接收数据的数组
  public dataArr: any = {};
  // 当前选中panel的tab标签
  public panelType = '';
  // 定义应急资源面板的Title
  public title = [
    {
      name: '应急资源',
      key: 'emergencyResource',
      ativeClass: true,
    },
    {
      name: '风险隐患',
      key: 'riskTrouble',
      ativeClass: false,
    },
    {
      name: '基础数据',
      key: 'baseData',
      ativeClass: false,
    },
  ];
  // 监听定位-恢复默认状态
  @Watch('$store.state.eventPushStore.eventLocation.EventLatLonStr')
  public onEventLocate() {
    this.title.forEach((item: any) => {
      item.ativeClass = false;
      if (item.key === 'emergencyResource') {
        item.ativeClass = true;
      }
    });
  }
  public beforeDestroy() {
    this.getComponent().unload();
  }

  private clickTextHandler(data: any, checked: boolean) {
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

  private clickNumberHandler(data: any, checked: boolean, textHandlerName?: string) {
    if (!checked) {
      if (textHandlerName === 'close') {
        return;
      } else {
        (this.$refs.mychildEmergency as any).closePanelFn();
      }
    } else {
      this.paramData = {
        item: data,
        panelType: this.panelType,
      };
      this.popIsSureName = textHandlerName || '';
      if (checked && this.popIsSureName) {
        this.getComponent()._clearLayers();
        this.getComponent().showResource(data.codeKey);
      }
      if (!this.popIsSureName) {
        this.messsageBus.emit('clickEmerencyResourcesNum', this.paramData, checked);
      } else {
        this.messsageBus.emit('clickEmerencyResourcesNum', this.paramData, true);
      }
    }
  }

  // 生命周期函数
  private created() {
    // this.initResources();
    this.clickParentEmergency(this.title[0]);
    this.messsageBus.on('clickEmerencyResourcesNumPanelClosed',
            (leftItemData: any, closeState: boolean) => {
              (this.$refs.mychildEmergency as any).closePanelFn();
            },
    );
    // 监听定位关闭弹框
    this.messsageBus.on('clickEmerencyResourcesNumPanelCloseds',
            (leftItemData: any) => {
              (this.$refs.mychildEmergency as any).clickNumber(leftItemData);
            },
    );
  }
  // 初始应急资源组件
  // private initResources() {
  //  emerSourceServer.getStatistics({}).then((res: any) => {
  //     this.dataArr = res.list;
  //  });
  // }
  // // 传给应急资源组件的方法
  private clickParentEmergency(data: any) {
    this.dataArr = [];
    this.title.forEach((item: any) => {
      item.ativeClass = false;
      if (data.name === item.name) {
        item.ativeClass = true;
      }
    });
    this.erClickTabTitle(this.title);
  }
  private erClickTabTitle(data: any) {
    // this.tabArr = data;
    data.forEach((item: any, index: number) => {
      if (item.ativeClass) {
        const key = item.key;
        this.panelType = key;
        switch (key) {
          case 'emergencyResource':
            this.dataArr = {
              'RescueTeam※03': {
                codeKey: 'RescueTeam※03',
                tabTitle: '救援队',
                tabNumber: 0,
              },
              'Expert※01': { codeKey: 'Expert※01', tabTitle: '专家', tabNumber: 0 },
              'shelter': { codeKey: 'shelter', tabTitle: '避难场所', tabNumber: 0 },
              'ANJIAN_REPERTORY※01': {
                codeKey: 'ANJIAN_REPERTORY※01',
                tabTitle: '物资储备库',
                tabNumber: 0,
              },
              'JC_WARBASE※01': {
                codeKey: 'JC_WARBASE※01',
                tabTitle: '战保基地',
                tabNumber: 0,
              },
            };
            emerSourceServer.getStatistics({}).then((res: any) => {
              this.deleteNull(res.list);
            });
            break;
          case 'riskTrouble':
            this.dataArr = {
              'ANJIAN_DAGCHEMENT※DangerousChemical': {
                codeKey: 'ANJIAN_DAGCHEMENT※DangerousChemical',
                tabTitle: '危化企业',
                tabNumber: 0,
              },
              'ANJIAN_ENT_WHSMYHBZ※01': {
                codeKey: 'ANJIAN_ENT_WHSMYHBZ※01',
                tabTitle: '工贸企业',
                tabNumber: 0,
              },
              'coal': {
                codeKey: 'coal',
                tabTitle: '煤矿企业',
                tabNumber: 0,
              },
              'tailingpond': {
                codeKey: 'tailingpond',
                tabTitle: '尾矿库',
                tabNumber: 0,
              },
              'firework': {
                codeKey: 'firework',
                tabTitle: '烟花爆竹',
                tabNumber: 0,
              },
              'BAS_GEOLOGICHAZARD※01': {
                codeKey: 'BAS_GEOLOGICHAZARD※01',
                tabTitle: '地质灾害隐患点',
                tabNumber: 0,
              },
              'majordanger': {
                codeKey: 'majordanger',
                tabTitle: '重大危险源',
                tabNumber: 0,
              },
              'metalnonmetal': {
                codeKey: 'metalnonmetal',
                tabTitle: '金属非金属矿山',
                tabNumber: 0,
              },
              'ANJIAN_OILGASFIELD※01': {
                codeKey: 'ANJIAN_OILGASFIELD※01',
                tabTitle: '陆油',
                tabNumber: 0,
              },
              'ANJIAN_OILGASFIELD※02': {
                codeKey: 'ANJIAN_OILGASFIELD※02',
                tabTitle: '海油',
                tabNumber: 0,
              },
            };
            riskSourceServer.getStatistics({}).then((res: any) => {
              this.deleteNull(res.list);
            });
            break;
          case 'baseData':
            this.dataArr = {
              'bas_school': { codeKey: 'bas_school', tabTitle: '学校', tabNumber: 0 },
              'hospital': { codeKey: 'hospital', tabTitle: '医院', tabNumber: 0 },
              'airport': { codeKey: 'airport', tabTitle: '机场', tabNumber: 0 },
              'railwaystation': { codeKey: 'railwaystation', tabTitle: '火车站', tabNumber: 0 },
              'Resrrvoir※01': {
                codeKey: 'Resrrvoir※01',
                tabTitle: '水库大坝',
                tabNumber: 0,
              },
              'Nuclearinfo※01': {
                codeKey: 'Nuclearinfo※01',
                tabTitle: '核设施',
                tabNumber: 0,
              },
              'portwharf': {
                codeKey: 'portwharf',
                tabTitle: '码头',
                tabNumber: 0,
              },
            };
            baseDataServer.getStatistics({}).then((res: any) => {
              this.deleteNull(res.list);
            });
            break;
        }
      }
    });
  }
  //  地图组件
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent('ResourceComponent');
    return component;
  }

  // 点击事件处理
  // private clickHandler(item: any, arr: any) {
  //   const itemArr: any = item;
  //   if (itemArr.length === 1) {
  //     this.getComponent()._clearLayers();
  //     this.getComponent().showResource(itemArr[0]);
  //     this.messsageBus.emit( 'gsmapVisible', true );
  //   } else {
  //     this.getComponent()._clearLayers();
  //     this.messsageBus.emit( 'gsmapVisible', false );
  //   }
  // }
  //  关闭地图
  // private closeClickHandler(item: any) {
  //   // console.log('item=>', item);
  //   // alert(1);

  // }
  // private onShowPopup(event: any) {
  //   // console.log('event', event);
  // }
  // 监听应急资源地图点位是否完成
  private onShowPopup(event: any) {
    // if (this.popIsSureName === event.key) {
    //   this.messsageBus.emit('clickEmerencyResourcesNum', this.paramData, true);
    // }
  }
  private mounted() {
    // (this as any).resolveMap('map').then(() => {
    //   this.getComponent().on('popup', this.onShowPopup, this);
    // });
    // 监听应急资源地图点位是否完成
    (this as any).resolveMap.call(this, 'map').then(() => {
      this.getComponent().on('data-loaded', this.onShowPopup, this);
    });
    // poptmplFunction start
    const param = {
      popupId: 'popup',
      moduleTypeID: 'ResourceComponent',
      that: this,
      // getComponenContext: this.getComponent(),
    };
    new renderpopUpTemplate().clickHandler(param);
    // poptmplFunction end
  }
  // 匹配辅助
  private deleteNull(list: any) {
    // for (const item of list) {
    //   if (item.codeKey) {
    //     this.dataArr[item.codeKey].tabNumber = item.tabNumber;
    //   }
    // }
  }
}
</script>

