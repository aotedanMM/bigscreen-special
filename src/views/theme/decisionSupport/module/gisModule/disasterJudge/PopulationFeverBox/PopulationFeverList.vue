<template>
    <div style="height: 100%;">
        <MultiTable
                :title="sourceObj.title"
                :handleKeywordChange="handleKeywordChange"
                :clickHandler="clickHandler"
                :hoverHandler="hoverHandler"
                :hoverLeaveHandler="hoverLeaveHandler"
                :tableData=curTableArr
                :pageSize=5
                :total=total
                :getParentCurrentPage=currentPage
                :handleCurrentChange="handleCurrentChange"
                :sourceTypeCodeObj="sourceTypeCodeObj"
                :sourceTypeCodeObj1="sourceTypeCodeObj1"
        ></MultiTable>
    </div>
</template>
<script lang="ts">
  import {Component, Vue, Prop} from 'vue-property-decorator';
  import MultiTable from '@/components/common/table/MultiTable.vue';
  import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
  import {dataSourcesServer} from '@/api/installServer';
  import {dataSourceConfig} from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterJudge';

  @Component({
    name: 'PopulationFeverList',
    components: {
      MultiTable,
    },
  })
  export default class PopulationFeverList extends Vue {
    @Prop() public sourceObj: any;
    private curTableArr: any[] = [];
    private total = 0;
    private currentPage = 1;
    private keyWord = '';
    // 数据源
    private sourceTypeCodeObj: any;
    private sourceTypeCodeObj1: any;

    // 处理keyword改变的方法
    private handleKeywordChange(newVal: any, oldVal: any) {
      this.keyWord = newVal;
      this.currentPage = 1;
      this.getData();
    }

    // 处理行点击的方法
    private clickHandler(row: any, index: number) {
      if (this.sourceObj.key === 'cunCount') {
        return;
      }
      this.getComponent().openPopup(this.sourceObj.key, row.id);
    }

    // 处理行hover的方法
    private hoverHandler(row: any, index: number) {
      if (this.sourceObj.key === 'countyCount') {
        return;
      }
      const type = 'district_point_' + this.sourceObj.key;
      const strType = type.split('Count');
      this.getComponent1().addHover(strType[0], row.id);
    }

    // 处理行hoverLeave的方法
    private hoverLeaveHandler(row: any, index: number) {
      this.getComponent1().clearHover();
    }

    // 翻页处理
    private handleCurrentChange(curPage: any) {
      this.currentPage = curPage;
      this.getData();
    }

    // 制作参数
    private handleParam() {
      const sourceOpt = JSON.parse(JSON.stringify(this.$store.state.dataFilterControl.filter));
      const obj: any = {
        pac: sourceOpt.districtCode,
        keyWord: this.keyWord || '',
        pageSize: 5,
        nowPage: this.currentPage,
        // point: [116.35, 39.87],
      };
      const eventPushStore = this.$store.state.eventPushStore.eventLocation;
      if (eventPushStore.EventLon && eventPushStore.EventLat) {
        obj.point = [eventPushStore.EventLon, eventPushStore.EventLat];
      }
      if (sourceOpt.geometry) {
        obj.geometry = JSON.parse(sourceOpt.geometry);
      }
      // 制作差异化参数
      switch (this.sourceObj.key) {
        case 'countyCount':
          obj.returnXiangNum = true; // 查询区县有多少个乡镇
          break;
        case 'townCount':
          break;
        case 'cunCount':
          break;
      }
      return obj;
    }

    // 从接口获得数据
    private async getData() {
      const param = this.handleParam();
      let result: any = null;
      switch (this.sourceObj.key) {
        case 'countyCount':
          // 获得区县的分页数据
          result = await installDisasterJudgeServer.quickJudgeServer.getQxPageList(param);
          break;
        case 'townCount':
          // 获得乡镇的分页数据
          result = await installDisasterJudgeServer.quickJudgeServer.getTownPageList(param);
          break;
        case 'cunCount':
          // 获得村庄的分页数据
          result = await installDisasterJudgeServer.quickJudgeServer.getCunPageList(param);
          break;
      }
      this.handleResult(result);
    }

    private handleResult(res: any) {
      this.curTableArr = res.list;
      this.total = res.total;
    }

    // 处理从统计面板接到数据后，把queryHeightFn emit出去，是为了去掉loading，为了适配以前的代码
    private async handleStaticEmit(res: any) {
      this.currentPage = 1;
      await this.getData();
      this.$nextTick(() => {
        this.$emit('queryHeightFn');
      });
    }

    // 获取数据来源
    private FnSourceTypeCode() {
      this.sourceTypeCodeObj = dataSourceConfig('PopulationFeverList');
      dataSourcesServer.getDataSourceServer({typeCode: this.sourceTypeCodeObj.typeCode}).then((data: any) => {
        const res = data;
        this.sourceTypeCodeObj.sourceData = res.data[0];
      });
      this.sourceTypeCodeObj1 = dataSourceConfig('DistrictRightDialog');
      dataSourcesServer.getDataSourceServer({typeCode: this.sourceTypeCodeObj1.typeCode}).then((data: any) => {
        const res = data;
        this.sourceTypeCodeObj1.sourceData = res.data[0];
      });
    }

    private initListener() {
      this.messsageBus.off('listSearchObj', this.handleStaticEmit);
      this.messsageBus.on('listSearchObj', this.handleStaticEmit);
    }

    // 联动gis方法 开始
    private getComponent() {
      let component = null;
      const factory = this.$ioc.resolve('GISFactory-map');
      if (factory) {
        component = factory.disasterJudgeFactory.getComponent(
          'districtCompYT',
        );
      }
      return component;
    }

    private getComponent1() {
      let component1 = null;
      const factory1 = this.$ioc.resolve('GISFactory-map');
      if (factory1) {
        component1 = factory1.commonFactory.getComponent('commonInteract');
      }
      return component1;
    }

    private created() {
      this.FnSourceTypeCode();
    }

    private mounted() {
      this.initListener();
    }

    private beforeDestroy() {
      this.messsageBus.off('listSearchObj', this.handleStaticEmit);
    }
  }
</script>
<style lang="less" scoped>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

</style>
