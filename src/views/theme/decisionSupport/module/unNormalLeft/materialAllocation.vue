<template>
  <SuppliesAllocate v-bind="dkey" :animateflag="animateflag" :class="anim?'flashRedBoxs':''"></SuppliesAllocate>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import SuppliesAllocate from '@/components/feature/earthquake/suppliesAllocate/SuppliesAllocate.vue';
import { suppliesAllocateServer } from '@/api/installServer';
import { KnownDisasterDataField } from '@/interface/feature/earthquake/MaterialAlloc';
import { pushDataRequestServe } from '@/api/installServer';
const materialAllocation = 'equipment_dispatch';
@Component({
  components: {
    SuppliesAllocate,
  },
})
export default class MaterialAllocation extends Vue {
  private anim = false;
  private animateflag = 0;
  get dkey() {
    return {
      accept: this.data.death,
      allot: this.data.shoul,
    };
  }
  private data: KnownDisasterDataField = {
    death: 0,
    shoul: 0,
  };
  private async getData() {
    const eventId = this.$store.state.eventPushStore.eventId; // 事件id
    const locationId = materialAllocation; // 位置id
    const res: any = await pushDataRequestServe.getPushDataByIds(
      eventId,
      locationId,
    );
    console.log(JSON.parse(JSON.parse(res.data.content)[0].data).event);
    return JSON.parse(JSON.parse(res.data.content)[0].data).event;
  }

  private async init() {
    const tsData = await this.getData();
    this.data.shoul = 0;
    this.data.death = 0;
    tsData.forEach((v: any) => {
      switch (v.stateName) {
        case '调拨':
          this.data.shoul = Number(this.data.shoul) + Number(v.num);
          break;
        case '到达':
          this.data.death = Number(this.data.death) + Number(v.num);
          break;
      }
    });
  }
  @Watch('$store.state.eventPushStore.equipment_dispatch')
  private getEQUIPMENT_DISPATCH(val: any) {
    if (val > 0) {
      this.animateflag = 1;
      this.animation();
      this.init();
    } else if (val < 0) {
      this.animateflag = -1;
      this.data.shoul = 0;
      this.data.death = 0;
    }
  }
  private created() {
    if (this.$store.state.eventPushStore.equipment_dispatch > -1) {
      this.init();
    }
  }
  private animation() {
    this.anim = true;
    setTimeout(() => {
      this.anim = false;
      this.animateflag = 0;
    }, 8000);
  }
}
</script>
