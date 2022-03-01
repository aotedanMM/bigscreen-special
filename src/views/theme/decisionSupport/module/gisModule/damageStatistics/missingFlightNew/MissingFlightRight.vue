<template>
  <!-- <div id="MissingFlightRight"> -->
    <!-- <AreaListMissingFlightRight
      :paginationObj="paginationObj"
      :header="header"
      :filexed="filexed"
      :IsPagination="IsPagination"
      :title="title"
      :listData="listData"
      :eventObject="eventObject"
      :itemClick="clickItemEvent"
      :listCheck = "listCheck"
    ></AreaListMissingFlightRight> -->
    <AreaListMissingFlightRight
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
    ></AreaListMissingFlightRight>
  <!-- </div> -->
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EventInfoPop from '@/components/feature/gisModule/popUp/eventInfo.vue';
// import AreaListMissingFlightRight from '@/components/common/render/AreaListMissingFlightRight.common.vue';
import AreaListMissingFlightRight from '@/components/common/render/AreaList.damage.vue';
import MapCommon from '@/util/MapCommon';
@Component({
  name: 'MissingFlightRight',
  mixins: [MapCommon],
  components: {
    AreaListMissingFlightRight,
  },
})
export default class MissingFlightRight extends Vue {
  //  private listDataFlag  = false;
  public title: any = '失联区域';
  private filexed = [
    'num',
    'name',
    'backToBaseStation',
    'recoveryQuantity',
    'happendWhere',
  ];
  private definitionWidth = {
    num : '20%',
    name : '20%',
    backToBaseStation : '20%',
    recoveryQuantity : '20%',
    happendWhere : '20%',
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
  /* 序号、名称、退服基站(座)、恢复数量、距事发地(km) */
  private header = [
    {
      num: '序号',
    },
    {
      name: '名称',
    },
    {
      backToBaseStation: '退服基站(个)',
    },
    {
      recoveryQuantity: '恢复数量',
    },
    {
      happendWhere: '距事发地(km)',
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
    const eventLocation = [
      this.$store.state.eventPushStore.eventLocation.EventLon,
      this.$store.state.eventPushStore.eventLocation.EventLat,
    ];
    const projectService = new g2.sfs.CoordinateTransform();
    const measureService = new g2.sfs.MeasureService({projectService});
    for (let index = 0; index < item.length; index++) {
      const element = item[index];
      let Letname = '暂无数据';
      let LetbackToBaseStation = 0;
      let LetrecoveryQuantity = 0;
      let LethappendWhere = 0;
      if (all !== 'all') {
        // if (element.village !== null || element.village !== '') {
        Letname = element.village || '暂无数据';
        // }
      } else {
        // if (element.parentName !== null || element.parentName !== '') {
        Letname = element.parentName || '暂无数据';
        // }
      }
      // if (element.loss !== null || element.loss !== '') {
      LetbackToBaseStation = element.loss === 0 ? 0 : (element.loss || '暂无数据');
      // }
      // if (element.good !== null || element.good !== '') {
      LetrecoveryQuantity = element.good === 0 ? 0 : (element.good || '暂无数据');
      // }
      // if (element.damage !== null || element.damage !== '') {
      const polylinewkt = 'LINESTRING(' + eventLocation[0] +
       ' ' + eventLocation[1] + ',' + element.x + ' ' + element.y + ')';
      const polyline = (g2 as any).sfs.GeometryFactory.createGeometryFromWkt(polylinewkt, 4326);
      const clength = (measureService.length(polyline) / 1000).toFixed(2);
      LethappendWhere = element.LethappendWhere === 0 ? 0 : (element.LethappendWhere || clength);
      // }
      const data = {
        name: Letname,
        lon: element.x,
        lat: element.y,
        id: element.id,
        num: index + 1,
        backToBaseStation: LetbackToBaseStation,
        recoveryQuantity: LetrecoveryQuantity,
        happendWhere: LethappendWhere,
      };
      listData.push(data);
    }
    this.$set(this, 'listData', listData);
  }
  private FnListData() {
     this.messsageBus.on('damageToolTable', (item: any, idd: any) => {
      if (idd === 'all') {
        this.FneachList(item, 'all');
      } else {
        const sortData = item[idd].child.sort( function(a: any, b: any) {
          return b.loss - a.loss;
        });
        this.FneachList(sortData);
      }
    });
  }
  // 联动gis方法 开始
  private clickItemEvent(item: any, index: number) {
    this.listCheck = index;
    this.getComponent().districPointClick(item.id); // 定位点
    this.getComponent().provinceClick(item.id); // 地图选中区域高亮
  }
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterStaFactory.getComponent('disasterSta');
    return component;
  }
  // 联动gis方法 结束
  private created() {
    this.FnListData();
  }
  private mounted() {
    // this.getComponent().load({
    //     list: this.listData,
    // });
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
      this.getComponent().unload({});
  }
}
</script>