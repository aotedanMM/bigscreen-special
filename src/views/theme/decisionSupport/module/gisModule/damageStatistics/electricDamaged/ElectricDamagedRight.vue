<template>
  <!-- <div id="ElectricDamagedRight"> -->
    <!-- <AreaListElectricDamagedRight
      :paginationObj="paginationObj"
      :header="header"
      :filexed="filexed"
      :IsPagination="IsPagination"
      :title="title"
      :listData="listData"
      :eventObject="eventObject"
      :itemClick="clickItemEvent"
      :listCheck = "listCheck"
    ></AreaListElectricDamagedRight> -->
    <AreaListElectricDamagedRight
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
    ></AreaListElectricDamagedRight>
  <!-- </div> -->
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EventInfoPop from '@/components/feature/gisModule/popUp/eventInfo.vue';
// import AreaListElectricDamagedRight from '@/components/common/render/AreaListElectricDamagedRight.common.vue';
import AreaListElectricDamagedRight from '@/components/common/render/AreaList.damage.vue';
import MapCommon from '@/util/MapCommon';
@Component({
  name: 'ElectricDamagedRight',
  mixins: [MapCommon],
  components: {
    AreaListElectricDamagedRight,
  },
})
export default class ElectricDamagedRight extends Vue {
  //  private listDataFlag  = false;
  public title: any = '电力受损';
  private filexed = [
    'num',
    'name',
    'lineDamage',
    'transformerSubstationDamage',
    'happendWhere',
  ];
  private definitionWidth = {
    num : '20%',
    name : '20%',
    lineDamage : '20%',
    transformerSubstationDamage : '20%',
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
  /* 序号、名称、受损线路(条)、受损变电站(座)、距事发地(km) */
  private header = [
    {
      num: '序号',
    },
    {
      name: '名称',
    },
    {
      lineDamage: '受损线路(条)',
    },
    {
      transformerSubstationDamage: '受损变电站(座)',
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
      let LetlineDamage = 0;
      let LettransformerSubstationDamage = 0;
      let LethappendWhere = 0;
      if (all !== 'all') {
        Letname = element.village || '暂无数据';
      } else {
        Letname = element.parentName || '暂无数据';
      }
      LetlineDamage = element.dianxianhao === 0 ? 0 : (element.dianxianhao || '暂无数据');
      LettransformerSubstationDamage = element.dianzhancount === 0 ? 0 : (element.dianzhancount || '暂无数据');
      const polylinewkt = 'LINESTRING(' + eventLocation[0] +
       ' ' + eventLocation[1] + ',' + element.x + ' ' + element.y + ')';
      const polyline = (g2 as any).sfs.GeometryFactory.createGeometryFromWkt(polylinewkt, 4326);
      const clength = (measureService.length(polyline) / 1000).toFixed(2);
      LethappendWhere = element.LethappendWhere === 0 ? 0 : (element.LethappendWhere || clength);
      const data = {
        name: Letname,
        lon: element.x,
        lat: element.y,
        id: element.id,
        num: index + 1,
        lineDamage: LetlineDamage,
        transformerSubstationDamage: LettransformerSubstationDamage,
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
          return b.dianxianhao - a.dianxianhao;
        });
        this.FneachList(sortData);
     }
    });
  }
  // 联动gis方法 开始
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterStaFactory.getComponent('disasterSta');
    return component;
  }

  private clickItemEvent(item: any, index: number) {
    this.listCheck = index;
    this.getComponent().districPointClick(item.id); // 定位点
    this.getComponent().provinceClick(item.id); // 地图选中区域高亮
    // this.getComponent().on('disasterSta_popup', this.showToolTip, this);
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

