<template>
  <!-- <div id="DispatchAdviceRightBox"> -->
    <AreaList
      :paginationObj="paginationObj"
      :header="header"
      :filexed="filexed"
      :IsPagination="IsPagination"
      :title="title"
      :listData="listData"
      :eventObject="eventObject"
      :itemClick="clickItemEvent"
      :definitionWidth="definitionWidth"
      :sourceTypeCodeObj="sourceTypeCodeObj"
    ></AreaList>
  <!-- </div> -->
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import AreaList from '@/components/common/render/AreaList.common.vue';
import MapCommon from '@/util/MapCommon';
import {dataSourcesServer} from '@/api/installServer';
import {dataSourceConfig} from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterJudge';
@Component({
  name: 'DispatchAdviceRightBox',
  mixins: [MapCommon],
  components: {
    AreaList,
  },
})
export default class DispatchAdviceRightBox extends Vue {
  public title: any = '调拨建议';
  private filexed = ['num', 'name', 'type', 'location'];
  private definitionWidth = {
    num: '20%',
    name: '30%',
    type: '30%',
    location: '20%',
  };
  // 队伍类型字典表
  private typeDictionary: any = {
    T005: '地震救援队',
    T003: '消防救援队',
    T004: '森林(草原)消防救援队',
    T022: '工程抢险队',
    T001: '矿山救援队',
    T002: '危化救援队',
    T008: '铁路救援队',
    T009: '电力救援队',
    T010: '通信救援队',
    T011: '社会救援队',
    T014: '医疗救援队',
    T006: '卫生防疫救援队',
    T013: '未知',
    T017: '中国安能',
    T018: '中国电建',
    T019: '中国交建',
    T020: '中国能建',
    T021: '中国铁建',
  };
  private batchNum: any = null;  // 存放当前列表显示的数据为第几批次
  // 存放当前列表数据
  private listData = [
    {
      name: '暂无数据',
      address: '暂无数据',
      type: '暂无数据',
      location: '暂无数据',
    },
  ];
  private IsPagination = true;  // 是否分页
  // 翻页数据
  private paginationObj: any = {
    currentPage: 1,
    pageSize: 10,
    total: 110,
  };
  // 列表表头字段定义
  private header = [
    {
      num: '序号',
    },
    {
      name: '名称',
    },
    {
      type: '类型',
    },
    {
      location: '距事发地(km)',
    },
  ];
  // 列表点击和hover对应的事件对象
  private eventObject = {
    onclick: this.onTableClick,
    hover: this.onTableHover,
  };
  // //数据源
  private sourceTypeCodeObj: any;

  private onTableHover() {
    return true;
  }

  private onTableClick() {
    return true;
  }
 // 获取数据来源
  // @Watch('sourceTypeCode')
  private FnSourceTypeCode() {
    this.sourceTypeCodeObj = dataSourceConfig('DispatchAdviceRightBox');
    dataSourcesServer.getDataSourceServer({typeCode: this.sourceTypeCodeObj.typeCode}).then((data: any) => {
      const res = data;
      this.sourceTypeCodeObj.sourceData = res.data[0];
      console.log(this.sourceTypeCodeObj, 'this.sourceTypeCodeObj');
    });
  }
  // 将原始数据处理成表格需要的数据结构
  private FnListData() {
    // this.messsageBus.off('updataDispatchAdviceList');
    this.messsageBus.on('updataDispatchAdviceList', (data: any) => {
      const list = data.list;
      this.batchNum = data.batchNum;
      let tableData: any = [];
      list.forEach((item: any) => {
        if (item.isActive) {
          const key = item.key;
          item.val.forEach((val: any) => {
            val.key = key;
          });
          tableData = [...tableData, ...item.val];
        }
      });
      this.listData = [];
      const sourceData = [];
      for (let index = 0; index < tableData.length; index++) {
        const element = tableData[index];
        let Letname = '暂无数据';
        let Lettype = '暂无数据';
        let Letlocation = '暂无数据';
        if (element.name !== null) {
          Letname = element.name;
        }
        if (element.rescuetypecode !== null) {
          Lettype = this.typeDictionary[element.rescuetypecode];
        }
        if (element.lineardistance !== null && element.lineardistance !== '' && !Number.isNaN(Number(element.lineardistance))) {
           Letlocation = (element.lineardistance).toFixed(2);
        }
        const obj = {
          name: Letname,
          type: Lettype,
          id: element.id,
          num: index + 1,
          location: Letlocation,
          key: element.key,
        };
        sourceData.push(obj);
      }
      this.$set(this.paginationObj, 'currentPage', 1);
      this.$set(this, 'listData', sourceData);
    });
  }

  // 获取gis组件
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.rescueHelpFactory.getComponent('teamDispatchAdvice');
    return component;
  }

  // 表格行的点击事件
  private clickItemEvent(item: any) {
    this.getComponent().locateSingleTeam(item.key, this.batchNum, item.id);  // 定位地图位置
    this.getComponent().addHighlight(item.key, this.batchNum, item.id);  // 添加队伍高亮气泡
    this.getComponent().showPopup(item.key, this.batchNum, item.id); // 显示详情弹窗
  }

  private created() {
    this.FnListData();
    this.FnSourceTypeCode();
  }

  /*private destroyed(): void {
    this.messsageBus.off('updataDispatchAdviceList');
  }*/
}
</script>
