<template>
  <!-- <div class="DeploymentRight"> -->
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
    ></AreaList>
  <!-- </div> -->
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import AreaList from '@/components/common/render/AreaList.common.vue';
@Component({
  name: 'DeploymentRight',
  components: {
    AreaList,
  },
})
export default class DeploymentRight extends Vue {
  private title = '调度部署';
  private filexed = ['serial', 'name', 'type', 'distance'];
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
      serial: '序号',
    },
    {
      name: '名称',
    },
    {
      type: '类型',
    },
    {
      distance: '距离事发地(km)',
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
    type: '20%',
    distance: '30%',
  };
  private onTableHover() {
    return true;
  }
  private onTableClick() {
    return true;
  }

  private queryDeploymentList(data: any[]) {
    this.listData = data;
  }

  private clickItemEvent(item: any, index: number) {
     this.messsageBus.emit('openPopup', item.event);
  }

  private created() {
    // this.messsageBus.off('query_deployment_list');
    this.messsageBus.on('query_deployment_list', this.queryDeploymentList);
  }

  /*private destroyed(): void {
    this.messsageBus.off('query_deployment_list');
  }*/
}
</script>
