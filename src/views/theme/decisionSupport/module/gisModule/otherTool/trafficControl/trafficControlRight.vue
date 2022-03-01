<template>
  <!-- <div id="TrafficControlRight"> -->
    <!-- <AreaListTrafficControlRight
      :paginationObj="paginationObj"
      :header="header"
      :filexed="filexed"
      :IsPagination="IsPagination"
      :title="title"
      :listData="listData"
      :eventObject="eventObject"
      :itemClick="clickItemEvent"
      :listCheck = "listCheck"
    ></AreaListTrafficControlRight> -->
    <AreaListTrafficControlRight
      :paginationObj="paginationObj"
      :header="header"
      :filexed="filexed"
      :IsPagination="IsPagination"
      :title="title"
      :listData="listData"
      :eventObject="eventObject"
      :itemClick="clickItemEvent"
      :listCheck = "listCheck"
      :definitionWidth="definitionWidth"
    ></AreaListTrafficControlRight>
  <!-- </div> -->
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EventInfoPop from '@/components/feature/gisModule/popUp/eventInfo.vue';
// import AreaListTrafficControlRight from '@/components/common/render/AreaListTrafficControlRight.common.vue';
import AreaListTrafficControlRight from '@/components/common/render/AreaList.common.vue';
import MapCommon from '@/util/MapCommon';
@Component({
  name: 'TrafficControlRight',
  mixins: [MapCommon],
  components: {
    AreaListTrafficControlRight,
  },
})
export default class TrafficControlRight extends Vue {
  //  private listDataFlag  = false;
  public title: any = '交通管制';
  private filexed = [
    'num',
    'name',
    'type',
    'distance',
    'damage',
    'restore',
  ];
  private definitionWidth = {
    num : '12%',
    name : '25%',
    type : '15%',
    distance : '15%',
    damage : '15%',
    restore : '15%',
  };
  private IsPagination = true;
  private eventInfo: any = {};
  private eventInfoPop: any = null;
  private listData: any = [];
  private listCheck: any = '';
  private paginationObj: any = {
    currentPage: 1,
    pageSize: 10,
    total: 110,
  };
  /* 序号、名称、严重受损(万间)、一般受损(万间)、房屋倒塌(万间)、距事发地(km) */
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
      distance: '长度(km)',
    },
    {
      damage: '受损情况',
    },
    {
      restore: '恢复情况',
    },
  ];
  // 对应的事件对象
  private eventObject = {
    onclick: this.onTableClick,
    hover: this.onTableHover,
  };
  private onTableHover() {
    return true;
  }
  private onTableClick() {
    return true;
  }
  private FneachList(item: any , all?: any) {
    this.listData = [];
    const listData = [];
    for (let index = 0; index < item.length; index++) {
      const element = item[index];
      let Letname = '暂无数据';
      let Letrestore = '未恢复';
      if (element.name !== null || element.name !== '') {
        Letname = element.name;
      }
      // 1是已恢复,0是未恢复
      if (element.isResume === '1') {
        Letrestore = '已恢复';
      }
      const data = {
        name: Letname,
        num: index + 1,
        type: element.type,
        distance: element.distance,
        damage: '交通管制',
        restore: Letrestore,
        id: element.lineId,
      };
      listData.push(data);
    }
    this.$set(this, 'listData', listData);
  }
  private FnListData() {
    this.messsageBus.on('trafficToolTable', (item: any) => {
       this.FneachList(item);
    });
  }
  // 联动gis方法 开始
  private clickItemEvent(item: any, index: number) {
    this.listCheck = index;
    this.getComponent().locate(item.id);
  }
  // 联动gis方法 结束
  private getComponent() {
    let component = null;
    const factory = this.$ioc.resolve('GISFactory-map');
    if (factory) {
      component = factory.commonFactory.getComponent('trafficStatus');
    }
    return component;
  }

  private created() {
    this.FnListData();
  }
  private mounted() {
    // this.getComponent().load( 'jtgz' , this.listData);
    this.messsageBus.on('ToolTablePoint', (data: any) => {
      this.listCheck = false;
      for (const i in this.listData) {
        if (data === this.listData[i].id) {
          this.listCheck = Number(i);
        }
      }
    });
  }
  private beforeDestroy() {
      this.getComponent().unload( 'jtgz' , []);
  }
}
</script>
<style lang="less" scoped>
// * {
//   margin: 0;
//   padding: 0;
//   box-sizing: border-box;
// }
// #TrafficControlRight {
//   position: absolute;
//   top: -16px;
//   left: 20px;
//   z-index: 9999;
//   right:0;
// }
</style>
