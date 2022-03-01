<template>
    <ManagementOnDuty
        :leaderLabel="leaderLabel"
        :leaderName="leaderName"
        :sectionList="sectionList"
        :bureausList="bureausList"
        :hallList="hallList"
        :tableData="tableData"
        :bureausName="bureausName"
        :year="year"
        :month="month"
        :days="days"
        v-loading="loading"
    ></ManagementOnDuty>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import ManagementOnDuty from '@/components/feature/managementOnDuty/ManagementOnDuty.vue';

import { managementOnDutyServer } from '@/api/installServer';

import { staff } from '@/interface/feature/earthquake/DutyInfo.interface';

@Component({
  name: 'DutyInfo',
  components: {
    ManagementOnDuty,
  },
})
export default class DutyInfo extends Vue {
  private loading = false;
  private leaderLabel = '';
  private leaderName = '';
  private bureausName = '';
  private year: string | number = '';
  private month: string | number = '';
  private days: string | number = '';
  private sectionList: any[] = [];
  private hallList: any[] = [];
  private tableData: any[] = [];
  private bureausList: any[] = [];
  // 获取值班信息
  private getManagementDuty() {
    this.loading = true;
    // const time = '2020-01-12';
    const time = this.timeChange(new Date().getTime());
    managementOnDutyServer.getData(time).then((res: any) => {
      const tsData: any = res.data;
      this.leaderLabel = tsData.leader.postion;
      this.leaderName = tsData.leader.staffInfo[0].name;
      this.bureausName = tsData.staff[1].orgName;
      this.sectionList = tsData.staff;
      this.bureausList = tsData.staff[1].staffs;
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }
    /*时间转化类型*/
    private timeChange(dates: any) {
        const date = new Date(dates);
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        this.month = this.month < 10 ? '0' + this.month : this.month;
        this.days = date.getDate();
        this.days = this.days < 10 ? '0' + this.days : this.days;
        const str = this.year + '-' + this.month + '-' + this.days;
        return str;

    }


  private getHallData() {
    this.loading = true;
    const time = '2019-12-16';
    managementOnDutyServer.getDataHall(time).then((res: any) => {
      this.hallList = res.data;
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }
  private created() {
    this.getManagementDuty();
    // this.getHallData();
  }
}
</script>