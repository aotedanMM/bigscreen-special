<template>
  <!-- <div id="CasualtiesRight"> -->
    <!-- <AreaListCasualtiesRight
      :paginationObj="paginationObj"
      :header="header"
      :filexed="filexed"
      :IsPagination="IsPagination"
      :title="title"
      :listData="listData"
      :eventObject="eventObject"
      :itemClick="clickItemEvent"
      :listCheck = "listCheck"
    ></AreaListCasualtiesRight> -->
    <AreaListCasualtiesRight
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
    ></AreaListCasualtiesRight>
  <!-- </div> -->
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EventInfoPop from '@/components/feature/gisModule/popUp/eventInfo.vue';
// import AreaListCasualtiesRight from '@/components/common/render/AreaListCasualtiesRight.common.vue';
import AreaListCasualtiesRight from '@/components/common/render/AreaList.damage.vue';
import MapCommon from '@/util/MapCommon';
@Component({
  name: 'CasualtiesRight',
  mixins: [MapCommon],
  components: {
    AreaListCasualtiesRight,
  },
})
export default class CasualtiesRight extends Vue {
  //  private listDataFlag  = false;
  public title: any = '人员伤亡';
  private filexed = [
    'num',
    'name',
    'deathPerson',
    'injuredPerson',
    'missingPerson',
    'happendWhere',
  ];
  private definitionWidth = {
    num : '13%',
    name : '15%',
    deathPerson : '16%',
    injuredPerson : '16%',
    missingPerson : '16%',
    happendWhere : '22%',
  };
  private IsPagination = true;
  private eventInfo: any = {};
  private eventInfoPop: any = null;
  private listData: any = [];
  private paginationObj: any = {
    currentPage: 1,
    pageSize: 10,
    total: 110,
  };
  private listCheck: any = '';
  private header = [
    {
      num: '序号',
    },
    {
      name: '名称',
    },
    {
      deathPerson: '死亡(人)',
    },
    {
      injuredPerson: '受伤(人)',
    },
    {
      missingPerson: '失踪(人)',
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
      let LetdeathPerson = 0;
      let LetinjuredPerson = 0;
      let LetmissingPerson = 0;
      let LethappendWhere = 0;
      if (all !== 'all') {
        Letname = element.village || '暂无数据';
      } else {
        Letname = element.parentName || '暂无数据';
      }
      LetdeathPerson = element.death === 0 ? 0 : (element.death || '暂无数据');
      LetinjuredPerson = element.injured === 0 ? 0 : (element.injured || '暂无数据');
      LetmissingPerson = element.miss === 0 ? 0 : (element.miss || '暂无数据');
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
        deathPerson: LetdeathPerson,
        injuredPerson: LetinjuredPerson,
        missingPerson: LetmissingPerson,
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
      } else if (!idd && idd !== 0) {
         this.FneachList(item);
      } else {
        const sortData = item[idd].child.sort( function(a: any, b: any) {
          return b.death - a.death;
        });
        this.FneachList(sortData);
      }
    });
  }

  private clickItemEvent(item: any, index: number) {
    // this.eventInfo = {
    //   id: item.id,
    //   title: item.name,
    //   eventType: item.name,
    //   reportTime: '',
    //   injuredPerson: '',
    //   longitude: item.lon,
    //   latitude: item.lat,
    // };
    // this.getComponent().locateEvent({
    //   id: item.id,
    //   eventType: item.name,
    //   message: item.name,
    //   x: item.lon,
    //   y: item.lat,
    // });
    this.listCheck = index;
    this.getComponent().districPointClick(item.id); // 定位乡镇点
    this.getComponent().provinceClick(item.id); // 地图选中区域高亮
    // this.getComponent().on('disasterSta_popup', this.showToolTip, this);
  }

    // private showToolTip(data: any) {
    //     console.log(data);
    //     // 展示弹窗
    // }

    // private closeToolTip() {
    //     // 关闭弹窗
    //     this.getComponent().closePopup();
    // }

  // gis 地图联动替换列表数据 开始
  // private FnShowXZD(arrVal: any): any {
  //   this.listData = [];
  //   const listData = [];
  //   for (let index = 0; index < arrVal.xzTown.length; index++) {
  //     const element = arrVal.xzTown[index];
  //     let Letname = '暂无数据';
  //     let LetdeathPerson = 0;
  //     let LetinjuredPerson = 0;
  //     let LetmissingPerson = 0;
  //     let LethappendWhere = 0;
  //     if (element.town !== null || element.town !== '') {
  //       Letname = element.town;
  //     }
  //     if (element.death !== null || element.death !== '') {
  //       LetdeathPerson = element.death;
  //     }
  //     if (element.injured !== null || element.injured !== '') {
  //       LetinjuredPerson = element.injured;
  //     }
  //     if (element.miss !== null || element.miss !== '') {
  //       LetmissingPerson = element.miss;
  //     }
  //     if (element.lost !== null || element.lost !== '') {
  //       LethappendWhere = element.lost;
  //     }
  //     const data = {
  //       name: Letname,
  //       lon: element.x,
  //       lat: element.y,
  //       id: element.id,
  //       num: index + 1,
  //       deathPerson: LetdeathPerson,
  //       injuredPerson: LetinjuredPerson,
  //       missingPerson: LetmissingPerson,
  //       happendWhere: LethappendWhere,
  //     };
  //     listData.push(data);
  //   }

  //   this.$set(this, 'listData', listData);
  // }
  // gis 地图联动替换列表数据 结束

  // private onShowPopup(event: any) {
  //   const eventInfo = this.eventInfo;
  //   const self = this;
  //   this.eventInfoPop = new EventInfoPop({
  //     el: '#' + event.containerId,
  //     data() {
  //       return {
  //         data: eventInfo,
  //         config: {
  //           title: 'title',
  //           content: 'eventType',
  //           time: 'reportTime',
  //         },
  //       };
  //     },
  //     methods: {
  //       close() {
  //         self.getComponent().clearAll();
  //       },
  //     },
  //   });
  // }
  // 联动gis方法 结束
  private created() {
    this.FnListData();
  }

// 联动gis方法 开始
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterStaFactory.getComponent('disasterSta');
    return component;
  }

  private mounted() {
    // (this as any).resolveMap.call(this, 'map').then(() => {
    //   this.getComponent().on('EventPointspopup', this.onShowPopup, this);
    //   this.getComponent().on('disasterXZDist', this.FnShowXZD, this); // 替换 列表数据 的监听
    // });
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
    // this.getComponent().on('disasterSta_district_point_code',  this.onCounyClick, this);
  }

  // private onCounyClick(event: any) {
  //   this.getComponent().on('disasterSta_popup', this.showToolTip, this);
  // }

  private beforeDestroy() {
      // this.getComponent().off('disasterSta_district_point_code', this.onCounyClick, this);
      // this.getComponent().off('disasterSta_popup', this.showToolTip, this);
      this.getComponent().unload({});
  }
}
</script>
<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#CasualtiesRight {
  position: absolute;
  // top: -16px;
  // left: 20px;
  left:2804px;
  top:80px;
  z-index: 9999;
}
</style>
