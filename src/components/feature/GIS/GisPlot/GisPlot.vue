<template>
  <div class="emap_control_plotCtrl" style>
    <div
      v-if="rendered"
      class="plotCtrlMainWrap"
      id="plotCtrlMainWrap"
      :style="options.panelStyle"
    >
      <div class="plotCtrlTop emap_control_plotCtrl_top">
        <div class="topTitle title-panel">标绘</div>
        <div
          class="topClose"
          :class="{ active: panelShow }"
          @click="plotClose(true)"
        ></div>
        <div
          class="topVisible topVisible-collapse"
          :class="{ active: panelShow }"
          @click="plotVisible()"
        ></div>
        <div
          class="topVisible topVisible-expand"
          :class="{ active: !panelShow }"
          @click="plotVisible()"
        ></div>
      </div>
      <div class="plotButton-box">
        <div class="topButton" @click="savePlotClick">保存标绘</div>
        <div class="topButton" @click="whiteBoardClick">白板标绘</div>
      </div>

      <div class="plotCtrlMain">
        <ul class="plotCtrlLeft">
          <li
            v-for="(item, index) in leftTabArr"
            :key="item.value"
            :class="{ leftTabActive: item.value == leftTabValue }"
            @click="toTabItem(item, index)"
          >
            {{ item.label }}
          </li>
        </ul>
        <div class="plotCtrlRight">
          <el-scrollbar style="height:100%;">
            <gis-panel-hot-tab
              v-show="leftTabValue === 'common' && plotIcons"
              :eventType="eventType"
              :options="options"
              :mapComponent="mapComponent"
              :mapOpts="mapOpts"
              :plotIcons="plotIcons"
            ></gis-panel-hot-tab>
            <gis-panel-basic
              v-show="leftTabValue === 'basic' && plotIcons"
              :eventType="eventType"
              :options="options"
              :mapComponent="mapComponent"
              :mapOpts="mapOpts"
              :plotIcons="plotIcons"
            ></gis-panel-basic>
            <gis-panel-emergency
              v-show="leftTabValue === 'emergency' && plotIcons"
              :eMapPanelEditObj="eMapPanelEditObj"
              :eventType="eventType"
              :options="options"
              :mapComponent="mapComponent"
              :mapOpts="mapOpts"
              :plotIcons="plotIcons"
            ></gis-panel-emergency>
            <gis-panel-manage
              v-show="leftTabValue == 'manage'"
              ref="gisPanelManage"
              :eMapPanelEditObj="eMapPanelEditObj"
              :mapComponent="mapComponent"
              :mapOpts="mapOpts"
              :rendered="rendered"
              @closeEMapPanelEdit="closeEMapPanelEdit"
            ></gis-panel-manage>
          </el-scrollbar>
        </div>
      </div>
      <div class="bottom" v-if="rendered"></div>
    </div>
    <gis-emap-panel-edit
      v-if="rendered"
      v-show="showPanelEdit"
      @eMapPanelEdit="eMapPanelEdit"
      @panelEditClose="panelEditClose"
      @delete="deletePlotOnEdit"
      :eMapPanelEditObj="eMapPanelEditObj"
      :options="options"
    ></gis-emap-panel-edit>
    <gis-emap-panel-save
      v-if="rendered"
      :options="options"
      :mapComponent="mapComponent"
      :mapOpts="mapOpts"
    ></gis-emap-panel-save>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Drag } from './toDrag';
import { plotServer, plotNoSqlService } from '@/api/installServer';
import { PlotManagerMapComponent } from './PlotManagerMapComponent';
import GisEmapPanelEdit from './GisEmapPanelEdit.vue';
import GisPanelBasic from './GisPlotPanel/GisPlotPanelBasic.vue';
import GisPanelEmergency from './GisPlotPanel/GisPlotPanelEmergency.vue';
import GisPanelHotTab from './GisPlotPanel/GisPlotPanelHotTab.vue';
import GisPanelManage from './GisPlotPanel/GisPlotPanelManage.vue';
import GisEmapPanelSave from './GisEmapPanelSave.vue';
import MapCommon from '@/util/MapCommon';
@Component({
  name: 'GisPlot',
  components: {
    GisEmapPanelEdit,
    GisPanelBasic,
    GisPanelEmergency,
    GisPanelHotTab,
    GisPanelManage,
    GisEmapPanelSave,
  },
  mixins: [MapCommon],
})
export default class GisPlot extends Vue {
  public mapComponent: any = null;
  // public timer: any;
  @Prop() public options: any;
  private leftTabArr = [
    {
      label: '常用标绘', // 显示名称
      value: 'common', // 唯一标识
    },
    {
      label: '应急标绘符号',
      value: 'emergency',
    },
    {
      label: '基础标绘符号',
      value: 'basic',
    },
    {
      label: '管理标绘',
      value: 'manage',
    },
  ];
  private leftTabValue = 'common';
  private whiteBoardFlag = true;
  private hotIconIndex = -1;
  private filterText: any = '';
  private treeData: any = [];
  private eventType: any = '';
  private eMapPanelEditObj = {
    data: {
      id: '',
      schemaId: '',
      businessId: '',
    },
  };
  private showPanelEdit = false;
  // 标绘图标
  private plotIcons: any = null;
  // 默认地图2d
  private mapDimensionality = '2d';
  // 是否渲染
  private rendered: boolean = false;
  private panelShow: boolean = false;

  private isShowMapForWhiteBoard: boolean = true;
  private mapOpts: any = {
    businessId: '2f2ee16f-44ac-c7ed-c8ba-52ec60a1a1fe',
  };
  private map3D: any = null;
  // 打开面板
  public plotOpen() {
    return new Promise<void>(async (resolve, reject) => {
      // this.leftTabArr = ['常用标绘', '应急标绘符号'/* , '基础标绘符号', '管理标绘' */];
      await this.plotInit();
      $('#plotCtrlMainWrap').fadeIn();
      this.panelShow = true;
      $('#plotCtrlMainWrap').css('visibility', 'visible');
      $('.emap_control_plotCtrl_top').css('visibility', 'visible');
      $('.emap_control_plotCtrl_top').removeClass('plotCtrlTop-highlight');
      $('.topClose').css('visibility', 'visible');
      $('.topVisible-collapse').css('visibility', 'visible');
      $('.topVisible-expand').css('visibility', 'hidden');
      resolve();
    });
  }
  /**
   * 关闭面板
   * @param
   * @param.isClose 是否点击关闭按钮
   */
  public plotClose(isClose: boolean = false) {
    $('#plotCtrlMainWrap').fadeOut();
    this.panelShow = false;
    if (isClose) {
      // 如果是点击的关闭按钮
      // this.messsageBus.emit('commonTools', 'realTimePlotting' , isClose);
      this.messsageBus.emit('GisPlotControlBtn', 'realTimePlotting', isClose);
    } else {
      this.showPanelEdit = false;
    }
  }

  public plotVisible(flag: boolean) {
    this.panelShow = !this.panelShow;
    if (this.panelShow) {
      $('.topVisible-collapse').css('visibility', 'visible');
      $('.emap_control_plotCtrl_top').css('visibility', 'visible');
      $('.emap_control_plotCtrl_top').removeClass('plotCtrlTop-highlight');
      $('.topVisible-expand').css('visibility', 'hidden');
      $('#plotCtrlMainWrap').css('visibility', 'visible');
    } else {
      $('.topClose').css('visibility', 'visible');
      $('.emap_control_plotCtrl_top').css('visibility', 'visible');
      $('.emap_control_plotCtrl_top').addClass('plotCtrlTop-highlight');
      $('.topVisible-expand').css('visibility', 'visible');
      $('.topVisible-collapse').css('visibility', 'hidden');
      $('#plotCtrlMainWrap').css('visibility', 'hidden');
    }
  }

  // 标绘工具箱初始化
  public plotInit() {
    return new Promise<void>((resolve, reject) => {
      // 延迟渲染，第一次打开的时候渲染
      if (this.rendered === false) {
        this.rendered = true;
        this.$nextTick(() => {
          // 懒加载
          const self: any = this;
          self.resolveMap(this.options.mapId).then((event: any) => {
            this.initialize(event.map);
            resolve();
          });
        });
      } else {
        resolve();
      }
    });
  }
  // 根据事件类型，更改标绘图标方案
  private eventTypeChange(type: any) {
    this.eventType = type;
    if (this.rendered === true) {
      this.initTabContent();
    }
  }
  // 调用面板编辑;
  private getEMapPanelEdit(opt: any) {
    // console.debug('编辑内容', opt);
    this.eMapPanelEditObj = opt;
    if (opt.key === 'point') {
      $('#eMapPanelEdit').fadeOut();
      return;
    }
    this.showPanelEdit = true;
  }
  // 关闭面板编辑
  private closeEMapPanelEdit() {
    this.eMapPanelEditObj = {
      data: {
        id: '',
        schemaId: '',
        businessId: '',
      },
    };
    $('#eMapPanelEdit').fadeOut();
    this.showPanelEdit = false;
  }
  // tab选项切换
  private toTabItem(item: any, index: any) {
    this.leftTabValue = item.value;
    // // 如果点管理标绘，则刷新列表
    if (item.value === 'manage') {
      (this.$refs as any).gisPanelManage.refreshSchemaList();
    }
  }
  // 点击保存标绘按钮
  private savePlotClick() {
    const count = this.mapComponent.getPlotCount();
    if (count > 0) {
      $('.savePlotName').fadeIn();
    } else {
      this.$message({
        type: 'info',
        message: '请绘制图形后再保存!',
      });
    }
  }
  // 删除标绘-编辑框点击
  private deletePlotOnEdit(id: any) {
    this.mapComponent.removeUnsaved(id);
    this.showPanelEdit = false;
  }

  // -白板标绘-
  private whiteBoardClick() {

    this.isShowMapForWhiteBoard = !this.isShowMapForWhiteBoard;
    this.getComponent1().setCountyVisible(this.isShowMapForWhiteBoard);
    this.mapComponent.whiteBoardClick(this.whiteBoardFlag);
    this.whiteBoardFlag = !this.whiteBoardFlag;
  }
  //  地图组件
  private getComponent1() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('districtHome');
    return component;
  }
  // -图形编辑器-
  private eMapPanelEdit(val: any) {
    // console.debug('编辑后的标绘符号', val);
    this.mapComponent.plotElementUpdate(val);
  }

  private panelEditClose(val: any) {
    // this.showPanelEdit = false;
    this.closeEMapPanelEdit();
  }

  private getSchemaData() {
    //            this.mapservices.list()

    // 替换写法
    plotNoSqlService.list();
  }
  private switchMap(val: any) {
    this.mapDimensionality = val.type;
    if (this.mapComponent) {
      this.mapComponent.switchMap(val);
    } else {
      this.map3D = val.map;
    }
  }
  /**
   * 开启外部标绘
   * @param opts
   * @param opts.businessId: "PT110101"
   * @param opts.options:
   */
  private startBusinessPlot(opts: any) {
    const self = this;
    this.plotInit().then(() => {
      this.mapComponent.removeByBusinessId(opts.businessId);
      this.mapComponent.draw(opts.options, opts.businessId);
      // self.messageBus.emit('plotPanelOpened');
    });
  }
  /**
   * 外部标绘编辑
   * @param opts
   * @param opts.businessId: "PT110101"
   * @param opts.item:
   */
  private businessPlotEdit(opts: any) {
    const self = this;
    this.mapComponent.plotElementUpdate(opts);
  }
  /**
   * 外部标绘保存
   * @param opts
   */
  private businessPlotSave(opts: any) {
    const self = this;
    // opts.page = 1;
    // opts.pageSize = 5,
    this.mapComponent.savePlotSchema(
      opts.businessId,
      opts.name,
      opts.page,
      opts.pageSize,
    );
  }
  /**
   * 外部标绘方案列表查询
   * @param opts
   */
  private businessPlotList(opts: any) {
    const self = this;
    this.plotInit().then(() => {
      this.mapComponent.refreshPlotSchemaList(
        opts.businessId,
        opts.page,
        opts.pageSize,
        '',
      );
    });
  }
  /**
   * 外部标绘方案列表 关键字查询
   * @param opts
   */
  private businessPlotListSearch(opts: any) {
    const self = this;
    this.mapComponent.planSearchBack(
      opts.businessId,
      opts.name,
      opts.page,
      opts.pageSize,
    );
  }
  /**
   * 外部标绘方案加载
   * @param opts
   */
  private businessPlotSchemaShow(opts: any) {
    const self = this;
    this.mapComponent.planShowBack(opts.schemaId);
  }
  /**
   * 外部标绘方案隐藏
   * @param opts
   */
  private businessPlotSchemaClean(opts: any) {
    const self = this;
    this.mapComponent.planCleanBack(opts.schemaId);
  }
  /**
   * 外部标绘方案删除
   * @param opts
   */
  private businessPlotSchemaDelete(opts: any) {
    const self = this;
    this.mapComponent.planDeleteBack(
      opts.businessId,
      opts.schemaId,
      opts.page,
      opts.pageSize,
    );
  }
  /**
   * 暴雨落区 标绘 进入处置
   * @param opts
   */
  private businessPlotStartDisposal(opts: any) {
    const self = this;
    if (opts.schemaId) {
      // 已保存过的
      this.mapComponent.planQueryBack(opts.schemaId).then((schema: any) => {
        let geometry = this.mapComponent.getGeometryfromSchema(schema);
        let center = geometry.getBaryCenter();
        center = {
          type: 'Point',
          coordinates: [center.x, center.y],
        };
        geometry = geometry.asGeoJson();
        // console.debug('businessPlotDisposalReturn', {geometry});
        this.messsageBus.emit('businessPlotDisposalReturn', {
          geometry,
          geom: center,
          name: opts.name,
          address: opts.name,
          _id: '',
        });
        this.mapComponent.removeByBusinessId(opts.businessId);
      });
    } else {
      // 未保存过的
      let geometry = this.mapComponent.getBusinessPlotGeometry(opts.businessId);
      let center = geometry.getBaryCenter();
      center = {
        type: 'Point',
        coordinates: [center.x, center.y],
      };
      geometry = geometry.asGeoJson();
      if (opts.flag) {
        // 自动保存
        this.mapComponent.savePlotSchema(
          opts.businessId,
          opts.name,
          opts.page,
          opts.pageSize,
          true,
        );
      }
      // console.debug('businessPlotDisposalReturn', {geometry});
      this.messsageBus.emit('businessPlotDisposalReturn', {
        geometry,
        geom: center,
        name: opts.name,
        address: opts.name,
        _id: '',
      });
      this.mapComponent.removeByBusinessId(opts.businessId);
    }
  }
  /**
   * 外部标绘 - 全部移除
   * @param opts
   */
  private businessPlotClear(opts: any) {
    this.mapComponent.removeByBusinessId(opts.businessId);
    this.mapComponent.cancelPlot();
  }
  private mapComponentEvents() {
    const self = this;
    // 点击标绘图形打开编辑面板
    this.mapComponent.off('plotElementClick');
    this.mapComponent.on('plotElementClick', (data: any) => {
      const temp: any = data;
      // console.log(data);
      if (data.businessId === this.mapOpts.businessId) {
        this.getEMapPanelEdit({ data: temp, key: temp.symbol.type });
      } else {
        // console.debug('businessPlotStartEdit', data);
        this.messsageBus.emit('businessPlotStartEdit', data);
      }
    });
    // 关闭编辑面板
    this.mapComponent.off('clearEditPanel');
    this.mapComponent.on('clearEditPanel', () => {
      this.closeEMapPanelEdit();
    });
  }
  // messsageBus的监听
  private init() {
    if (this.messageBus) {
      this.messageBus.off('openPlot');
      this.messageBus.off('closePlot');
      this.messageBus.off('eventTypeChange');
      this.messageBus.off('mapDemension');
      this.messageBus.on('openPlot', () => {
        this.plotOpen();
      });
      this.messageBus.on('closePlot', () => {
        this.plotClose();
      });
      this.messageBus.on('eventTypeChange', (type: any) => {
        this.eventTypeChange(type);
      });
      this.messageBus.on('mapDemension', (opts: any) => {
        this.switchMap(opts);
      });
      /** 外部标绘相关事件 */
      // 开始外部标绘
      this.messageBus.on('startBusinessPlot', (opts: any) => {
        this.startBusinessPlot(opts);
      });
      // 外部标绘编辑
      this.messageBus.on('businessPlotEdit', (opts: any) => {
        this.businessPlotEdit(opts);
      });
      // 外部标绘保存
      this.messageBus.on('businessPlotSave', (opts: any) => {
        this.businessPlotSave(opts);
      });
      // 外部标绘方案列表查询
      this.messageBus.on('businessPlotList', (opts: any) => {
        this.businessPlotList(opts);
      });
      // 外部标绘方案列表 关键字查询
      this.messageBus.on('businessPlotListSearch', (opts: any) => {
        this.businessPlotListSearch(opts);
      });
      // 外部标绘方案加载
      this.messageBus.on('businessPlotSchemaShow', (opts: any) => {
        this.businessPlotSchemaShow(opts);
      });
      // 外部标绘方案隐藏
      this.messageBus.on('businessPlotSchemaClean', (opts: any) => {
        this.businessPlotSchemaClean(opts);
      });
      // 外部标绘方案删除
      this.messageBus.on('businessPlotSchemaDelete', (opts: any) => {
        this.businessPlotSchemaDelete(opts);
      });
      // 暴雨落区 标绘 进入处置
      this.messageBus.on('businessPlotStartDisposal', (opts: any) => {
        this.businessPlotStartDisposal(opts);
      });
      // 外部标绘 - 全部移除
      this.messageBus.on('businessPlotClear', (opts: any) => {
        this.businessPlotClear(opts);
      });

      // 标绘 测量保存------------------------------------------------------------------------
      // this.messageBus.off('savePlotMeasureSchema');
      this.messageBus.on('savePlotSchema', (opts: any) => {
        const options: any = {
          id: window.G.utils.CommonUtil.newUUID32(),
          name: 'test',
          userId: this.mapOpts.businessId,
        };
        const schema = JSON.stringify(this.mapComponent.createSchema(options));
        this.messageBus.emit('PlotSchemaReturn', { schema });
      });
      // this.messageBus.off('loadPlotMeasureSchema');
      this.messageBus.on('loadPlotSchema', (opts: any) => {
        const schema = opts.content.plotSchema;
        const id = opts.id;
        if (schema) {
          // schema.schema.id = id;
          if (opts.checked) {
            this.mapComponent.loadSchema(schema.schema, id);
          } else {
            this.mapComponent.removeSchema(schema.schema, id);
          }
        }
      });
    }
    this.initMapComponent();
  }
  private created() {

    this.isShowMapForWhiteBoard = true;
    // 新增messsageBus的监听
    this.messageBus = this.messageBus || this.messsageBus;
    // this.init();
    return false;
  }

  private beforeDestroy() {

    this.isShowMapForWhiteBoard = true;
    this.messageBus.off('openPlot');
    this.messageBus.off('closePlot');
  }
  private mounted() {
    this.init();
    // 注释，修改为懒加载
    // 获取地图，地图加载完成后进入回调
    // const self: any = this;
    // self.resolveMap(this.options.mapId).then((event: any) => {
    //   this.initialize(event.map);
    // });
    // 点击删除按钮关闭编辑弹窗
    this.messsageBus.on('closeEditorBh', () => {
      this.showPanelEdit = false;
    });
  }
  private initMapComponent() {
    const self = this;
    this.plotInit().then(() => {
      // self.messageBus.emit('plotPanelOpened');
    });
  }
  // 组件初始化
  private async initialize(map: any) {
    console.log('初始化标绘');
    // 拖拽
    const toDragPlotCtrl: any = new Drag(
      '#plotCtrlMainWrap',
      '.emap_control_plotCtrl_top',
      this.options.drag,
    );
    toDragPlotCtrl.toDrag();

    const toDragSaveName: any = new Drag(
      '#savePlotName',
      '.saveName_top',
      this.options.drag,
    );
    toDragSaveName.toDrag();
    //
    this.mapComponent = new PlotManagerMapComponent({
      businessId: this.mapOpts.businessId,
    });
    const plotConf: any = this.options.service;
    // 初始化标绘组件
    // this.mapComponent = new PlotManagerMapComponent({
    //   map,
    //   map3D: this.map3D,
    //   // textLineLimit: this.options.textLineLimit,
    // });
    this.mapComponent.addControl({
      map,
      map3D: this.map3D,
      mapDemension: this.mapDimensionality,
    });
    // 初始化查询
    plotNoSqlService.options = plotConf;
    // plotNoSqlService.options.serverUrl = 'http://120.52.31.108:8090/nodeServer';
    plotNoSqlService.dataSetId1 = 'planPlotData';
    plotNoSqlService.deserializer = new g2.core.Deserializer();
    this.mapComponent.setService(plotNoSqlService);
    // 事件注册
    this.mapComponentEvents();
    // 数据初始化
    this.plotIcons = await plotServer.getPlotIcons();
    // 设置图标
    this.mapComponent.setIcons(this.plotIcons);
    this.initTabContent();
  }

  private initTabContent() {
    // 根据事件类型匹配tab 配置项
    let tabList: any = this.options.tabConfig.default;
    if (this.options.tabConfig.hasOwnProperty(this.eventType)) {
      tabList = this.options.tabConfig[this.eventType];
    }
    this.leftTabArr = jQuery.extend(true, [], tabList);
    this.leftTabValue = this.leftTabArr[0].value;
  }
}
</script>
<style lang="less">
@import url('./GisPlot.less');
.paginationClass {
  .el-pagination {
    color: #c0c4cc !important;
    .el-pagination__totalm,
    .pagination__jump,
    input,
    span,
    button {
      color: #c0c4cc !important;
      vertical-align: inherit !important;
    }
    button {
      background: transparent !important;
      &:hover {
        color: #f8f8ff !important;
      }
    }
    .el-pager {
      vertical-align: middle !important;
      li {
        background: transparent !important;
      }
    }
  }
}
.el-loading-mask {
  background-color: rgba(7, 16, 34, 0.8) !important;
}
</style>
