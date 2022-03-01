<template>
  <div class="plotSymbolTreeBox">
    <div class="treeFilter-box">
      <el-input class="treeInput" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
    </div>
    <div class="treeBox" style="padding-top:50px;">
      <el-tree
        class="cu-filter-tree"
        :data="treeData"
        :props="defaultProps"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
        ref="tree"
      >
        <span slot-scope="{ node, data }">
          <i
            v-if="'symbol' in data"
            class="treeNodeImg"
            :style="
                        'background: url(./imgs/gisPlot/' + data.symbol + ') 43%'
                      "
          ></i>
          <span style="padding-left: 4px;">{{ data.name }}</span>
        </span>
      </el-tree>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator';
import { plotServer, plotNoSqlService } from '@/api/installServer';
@Component({})
export default class GisPlotPanelEmergency extends Vue {
  @Prop() public leftTabValue?: any;
  @Prop() public hotIconIndex?: any;
  // @Prop() public commonIconIndex?: any;
  @Prop() public options?: any;
  @Prop() public mapComponent?: any;
  @Prop() public mapOpts?: any;
  @Prop() public eventType?: any;
  @Prop() public plotIcons?: any;
  private filterText: any = '';
  private treeData: any = [];
  private hotTabDatas = [];
    // 定义应急标绘tree展示的内容字段
  private defaultProps: any = {
    children: 'children',
    label: 'name',
  };
   /**
   * plotIcons 有值时 再进行加载
   */
  @Watch('plotIcons')
  private updateplotIcons(val: any) {
    if (val) {
      this.getPlotSymbol(this.eventType);
    }
  }
  private created() {
    //
  }
  private mounted() {
    this.updateplotIcons(this.plotIcons);
  }
    // 监听应急标绘符号查询
  @Watch('filterText')
  private filterTextChange(val: any) {
    (this.$refs.tree as any).filter(val);
  }
  // 点击应急标绘tree节点
  private handleNodeClick(data: any) {
     if (!data.children) {
      this.mapComponent.emergencyPlot(data, this.mapOpts.businessId);
    }
  }
    // 图标点击事件;
  private hotIconClick(item: any, index: any) {
    // if (this.leftTabValue === 'common') {
    //   this.hotIconIndex = index;
    // } else if (this.leftTabValue === 'emergency') {
    //   this.commonIconIndex = index;
    // } else if (this.leftTabValue === 'basic') {
    //   this.commonIconIndex = index;
    // }
    // console.log(item);
    this.mapComponent.draw(item, this.mapOpts.businessId);
    // this.getEMapPanelEdit(item);
  }
   // 请求应急标绘符号数据;
  private getPlotSymbol(eventType: any) {
    const type = eventType || this.eventType;
    return new Promise((resolve, reject) => {
      // 1 service.hotTabDats 更换了请求方法，已替换成返回正确的请求
      plotServer
        .getEmergencyPlotSymbol({eventType: this.eventType})
        .then((res: any) => {
          this.treeData = res.symbols;
          // const temp: any = res;
          // const plotIconObj: any = this.plotIcons;
          // this.hotTabDatas = temp[0].data;
          // this.hotTabDatas.map((item: any) => {
          //   const obj: any = item;
          //   obj.icons = this.options.iconImageDir + '/' + obj.icons;
          //   obj.base64 = plotIconObj[obj.tit];
          // });
          resolve();
        });
    });
  }
  private filterNode(value: any, data: any) {
    if (!value) {
      return true;
    }
    return data.name.indexOf(value) !== -1;
  }
}
</script>