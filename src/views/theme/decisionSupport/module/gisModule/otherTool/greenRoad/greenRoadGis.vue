<template>
  <div id="GreenRoadGis">
    <DamageCommon :listData='listData' isblock='0' :allListNum="allListNum" textType='绿色通道'></DamageCommon>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import DamageCommon from '@/components/feature/gisModule/static/damage.common.vue';
import { pushDataRequestServe } from '@/api/installServer';
@Component({
  name: 'GreenRoadGis',
  components: {
    DamageCommon,
  },
})
export default class GreenRoadGis extends Vue {
  private listData: any = [];
  private allListNum: number = 0;
  private created() {
    if (this.$store.state.eventPushStore.traffic >= 0) {
      this.getData();
    }
  }

  private async getData() {
    const eventId = this.$store.state.eventPushStore.eventId; // 事件id
    const processId = 'traffic';  // 伤亡id
    const { data }: any = await pushDataRequestServe.getPushDataByIds(eventId, processId );
    const content = JSON.parse(data.content);
    if (content.length > 0) {
        const localListdata = JSON.parse(content[0].data).data;
        const arr: any = [];
        localListdata.forEach((ele: any, index: number) => {
          if (ele.isblock === 0 || ele.isblock === '0') {
            arr.push(ele);
          }
        });
        this.listData = arr;
        // this.messsageBus.emit('damageToolTable', this.listData, 'all');
        this.allListNum = 0;
        for (const i of this.listData) {
          this.allListNum += i.count;
        }
    }
  }

  @Watch('$store.state.eventPushStore.traffic')
  private eventChange(val: any) {
    if (val >= 0) {
      this.getData();
    }
  }
}
</script>
<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#GreenRoadGis {
  position: absolute!important;
  top: 200px;
  left: 60px;
  z-index: 9999;
}
</style>
