<template>
  <!-- <div id="HousesDamagedRight"> -->
    <!-- <AreaListHousesDamagedRight
      :paginationObj="paginationObj"
      :header="header"
      :filexed="filexed"
      :IsPagination="IsPagination"
      :title="title"
      :listData="listData"
      :eventObject="eventObject"
      :itemClick="clickItemEvent"
    ></AreaListHousesDamagedRight> -->
    <AreaListHousesDamagedRight
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
    ></AreaListHousesDamagedRight>
  <!-- </div> -->
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EventInfoPop from '@/components/feature/gisModule/popUp/eventInfo.vue';
// import AreaListHousesDamagedRight from '@/components/common/render/AreaListHousesDamagedRight.common.vue';
import AreaListHousesDamagedRight from '@/components/common/render/AreaList.damage.vue';
import MapCommon from '@/util/MapCommon';
@Component({
  name: 'HousesDamagedRight',
  mixins: [MapCommon],
  components: {
    AreaListHousesDamagedRight,
  },
})
export default class HousesDamagedRight extends Vue {
  //  private listDataFlag  = false;
  public title: any = '房屋损毁';
  private filexed = [
    'num',
    'name',
    'yazhongsunhuai',
    'yibansunhuai',
    'houseCollapse',
    'happendWhere',
  ];
  private definitionWidth = {
    num : '12%',
    name : '10%',
    yazhongsunhuai : '20%',
    yibansunhuai : '20%',
    houseCollapse : '20%',
    happendWhere : '18%',
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
      yazhongsunhuai  : '严重受损(万间)',
    },
    {
      yibansunhuai: '一般受损(万间)',
    },
    {
      houseCollapse: '房屋倒塌(万间)',
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
      let LethouseCollapse = 0;
      let LethappendWhere = 0;
      let Letyazhongsunhuai = 0;
      let Letyibansunhuai = 0;
      if (all !== 'all') {
        Letname = element.village || '暂无数据';
      } else {
        Letname = element.parentName || '暂无数据';
      }
      LethouseCollapse = element.damage === 0 ? 0 : (element.damage || '暂无数据');
      const polylinewkt = 'LINESTRING(' + eventLocation[0] +
       ' ' + eventLocation[1] + ',' + element.x + ' ' + element.y + ')';
      const polyline = (g2 as any).sfs.GeometryFactory.createGeometryFromWkt(polylinewkt, 4326);
      const clength = (measureService.length(polyline) / 1000).toFixed(2);
      LethappendWhere = element.LethappendWhere === 0 ? 0 : (element.LethappendWhere || clength);
      Letyazhongsunhuai = element.yazhongsunhuai === 0 ? 0 : (element.yazhongsunhuai || '暂无数据');
      Letyibansunhuai = element.yibansunhuai === 0 ? 0 : (element.yibansunhuai || '暂无数据');
      const data = {
        name: Letname,
        lon: element.x,
        lat: element.y,
        id: element.id,
        num: index + 1,
        houseCollapse: LethouseCollapse,
        happendWhere: LethappendWhere,
        yazhongsunhuai: Letyazhongsunhuai,
        yibansunhuai: Letyibansunhuai,
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
          return b.damage - a.damage;
        });
        this.FneachList(sortData);
      }
    });
  }

  private clickItemEvent(item: any, index: number) {
    this.listCheck = index;
    this.getComponent().districPointClick(item.id); // 定位点
    this.getComponent().provinceClick(item.id); // 地图选中区域高亮
    // this.getComponent().on('disasterSta_popup', this.showToolTip, this);
  }

  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterStaFactory.getComponent('disasterSta');
    return component;
  }

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

