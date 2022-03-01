<template>
    <!-- <div class="RescueDemandRight"> -->
        <AreaList
            :paginationObj="paginationObj"
            :header="header"
            :filexed="filexed"
            :IsPagination="IsPagination"
            :title="title"
            :listData="getListData"
            :eventObject="eventObject"
            :itemClick="clickItemEvent"
            :definitionWidth="definitionWidth"     
        ></AreaList>
    <!-- </div> -->
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import AreaList from '@/components/common/render/AreaList.common.vue';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
@Component({
  name: 'RescueDemandRight',
  components: {
    AreaList,
  },
})
export default class RescueDemandRight extends Vue {
  private title = '救援需求';
  private filexed = ['serial', 'name', 'num', 'distance'];
  private IsPagination = true;
  private listData = [];
  private eventInfo: any = {};
  private eventInfoPop: any = null;
  private paginationObj: any = {
    currentPage: 1,
    pageSize: 10,
    total: 110,
  };
  private listCheck: any = '';
  private header = [
    {
      serial: '序号',
    },
    {
      name: '名称',
    },
    {
      num: '可调派人数',
    },
    {
      distance: '距离目的地(km)',
    },
  ];
  // 对应的事件对象
  private eventObject = {
    onclick: this.onTableClick,
    hover: this.onTableHover,
  };
  private definitionWidth = {
    serial: '20%',
    name: '30%',
    num: '20%',
    distance: '30%',
  };
  private rightListData: any = [];
  private switchIds: any[] = [];
  private get getListData() {
    return this.listData;
  }
  private onTableHover() {
    return true;
  }
  private onTableClick() {
    return true;
  }

  private clickItemEvent(item: any, index: number) {
    this.messsageBus.emit('teamPointClickRescue', [item.id, item.typeCode]);
  }
  private solveData() {
    this.messsageBus.on('query_team_point', (data: any) => {
      this.listData = data;
    });
  }

  private created() {
    this.solveData();
  }
}
</script>
