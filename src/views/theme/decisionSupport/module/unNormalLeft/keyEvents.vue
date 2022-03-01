<template>
    <KeyPointEvent :data="data" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import KeyPointEvent from '@/components/feature/earthquake/keyEvent/keyEvent.vue';
import { eventServer } from '@/api/installServer';
@Component({
  components: {
    KeyPointEvent,
  },
})
export default class KeyEvents extends Vue {
  private data: any = [];
  private async init() {
    let res: any;
    // 重点事件
    res = await eventServer.getPointEventData();
    return res;
  }

  private async created() {
    // this.data = await this.init();
  }
}
</script>