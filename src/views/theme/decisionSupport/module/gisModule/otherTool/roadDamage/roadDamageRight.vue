
<template>
  <!-- <div id="RoadDamageRight"> -->
    <!-- <AreaListRoadDamageRight
      :paginationObj="paginationObj"
      :header="header"
      :filexed="filexed"
      :IsPagination="IsPagination"
      :title="title"
      :listData="listData"
      :eventObject="eventObject"
      :itemClick="clickItemEvent"
      :listCheck = "listCheck"
    ></AreaListRoadDamageRight> -->
    <AreaListRoadDamageRight
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
    ></AreaListRoadDamageRight>
  <!-- </div> -->
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EventInfoPop from '@/components/feature/gisModule/popUp/eventInfo.vue';
// import AreaListRoadDamageRight from '@/components/common/render/AreaListRoadDamageRight.common.vue';
import AreaListRoadDamageRight from '@/components/common/render/AreaList.common.vue';
import MapCommon from '@/util/MapCommon';
@Component({
  name: 'RoadDamageRight',
  mixins: [MapCommon],
  components: {
    AreaListRoadDamageRight,
  },
})
export default class RoadDamageRight extends Vue {
  //  private listDataFlag  = false;
  public title: any = '道路损毁';
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
      distance: '长度',
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
      if (element.name !== null || element.name !== '') {
        Letname = element.name;
      }
      const data = {
        name: Letname,
        num: index + 1,
        type: element.type,
        distance: element.distance,
        damage: '道路损毁',
        restore: element.isResume,
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
    // this.getComponent().load( 'dlsh' , this.listData);
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
      this.getComponent().unload( 'dlsh' , []);
  }
}
</script>
<style lang="less" scoped>
// * {
//   margin: 0;
//   padding: 0;
//   box-sizing: border-box;
// }
// #RoadDamageRight {
//   position: absolute;
//   top: -16px;
//   left: 20px;
//   z-index: 9999;
//   right: 0;
// }
</style>
