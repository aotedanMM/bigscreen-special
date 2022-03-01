<template>
  <div class="newDetailsProtrusion">
    <div class="newDetailsProtrusion_title-panel">
        船舶详情
    </div>
    <span class="newDetailsProtrusion-header-closebtn detail-container-close" @click="MaterialClose" ></span>
    <div class="newDetailsProtrusion-baseinfo-content">
      <div class="newDetailsProtrusion_title">
            <span>{{ curData.name || "暂无数据" }}</span>
        </div>
      <el-scrollbar class="newDetailsProtrusion-baseinfo-content-top">
        <p v-for="(item) of dictMap"
          :key="item.key">
          <span class="staticfont">{{item.label}}：</span>
          <span class="currentLocation">{{curData[item.key] | formatData(item)}}</span>
        </p>
      </el-scrollbar>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import moment from 'moment';
import MapCommon from '@/util/MapCommon';
import {getFormatData} from '@/util/filter/CommonFilter';
@Component({
  name: 'AisPopup',
  mixins: [MapCommon ],
  filters: {
    formatData: getFormatData, // null
  },
})
export default class AisPopup extends Vue {
  private dictMap: any = [
    {
      key: 'chineseName',
      label: '中文名称',
    },
    {
      key: 'mmsi',
      label: '水上移动通信标识',
    },
    {
      key: 'nationality',
      label: '国籍',
    },
    {
      key: 'advancePort',
      label: '预到港',
    },
    {
      key: 'advanceTime',
      label: '预计到达时间',
    },
    {
      key: 'callsign',
      label: '呼号',
    },
    {
      key: 'shipType',
      label: '船舶类型',
    },
    {
      key: 'heading',
      label: '船首向',
      unit: '度',
      filterType: 'isDefaultUnit',
      filterRule: {
                    pointNum: 10,
                },
    },
    {
      key: 'shipLength',
      label: '船长',
      unit: '米',
      filterType: 'isDefaultUnit',
    },
    {
      key: 'stateSpeed ',
      label: '状态/航速',
    },
    {
      key: 'tonnage',
      label: '载重吨',
      unit: '吨',
      filterType: 'isDefaultUnit',
    },
    {
      key: 'grossTonnage',
      label: '总吨',
      unit: '吨',
      filterType: 'isDefaultUnit',
    },
    {
      key: 'netTons',
      label: '净吨',
      unit: '吨',
      filterType: 'isDefaultUnit',
    },
    {
      key: 'updateTime',
      label: '更新时间',
      filterType: 'isTimestamp',
    },
  ];
  private curData: any = {};
  // 关闭弹窗
  private MaterialClose() {
    (this as any).close();
  }

  private created() {
    this.curData = JSON.parse(JSON.stringify((this as any).data)); // 这句话必须放在created中
  }
}
</script>
<style lang="less" scoped>
 @import url('../../../../../assets/css/popUp/RealteamAndMareria.less');
 
</style>
