<template>
    <div style="height:100%;">
      <LeaderInstruction  v-if="flag"  :msg="msg" />
      <LoadingElement v-else :status="status" />
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import LeaderInstruction from '@/components/feature/earthquake/leaderInstruction/LeaderInstruction.feature.vue';
import LoadingElement from '@/components/feature/common/Loading/Loading.vue';
// import {
//   KnownDisasterInterface,
//   KnownDisasterDataField,
// } from '@/interface/feature/earthquake/KnownDisaster';
import { pushDataRequestServe } from '@/api/installServer';
@Component({
  name: 'KnownDisasterInstantiation',
  components: {
    LeaderInstruction,
    LoadingElement,
  },
})
export default class KnownDisasterInstantiation extends Vue {
  private msg: string = '';
  private flag: boolean = false;
  private status = 'nodata';
  private getData() {
    const eventId = this.$store.state.eventPushStore.eventId; // 事件id
    const processId = 'SEND_PROGRESS';  // 进程id
    pushDataRequestServe.getPushDataByIds(eventId, processId ).then((res: any) => {
      if (res.data && res.data.content) {

        const jsonData = JSON.parse(res.data.content)[0].data;
        const msgData = JSON.parse(jsonData);

        if (msgData.event.type === '0') {
          this.msg = msgData.event.progressCont;
          this.status = '';
          this.flag = true;
        }
      } else {
        this.status = 'nodata';
      }
    }).catch(() => {
      this.status = 'nodata';
    });
  }

  @Watch('$store.state.eventPushStore.SEND_PROGRESS')
  private eventChange(val: any) {
    if (val > 0) {
      this.getData();
    } else if (val < 0) {
      this.msg = '';
    }
  }

  private created() {
    // this.getData();
  }
}
</script>