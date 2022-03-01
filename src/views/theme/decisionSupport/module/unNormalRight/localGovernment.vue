<!--当地政府-->

<template>
  <div style="height:100%;">
    <local-government v-if="laders.length" :laders="laders" :class="anim?'flashRedBoxs':''"></local-government>
    <LoadingElement v-else :status="status" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import LocalGovernment from '@/components/feature/localGovernment/LocalGovernment.feature.vue';
import { ILaders } from '@/interface/feature/earthquake/LocalGovernment.interface';
import LoadingElement from '@/components/feature/common/Loading/Loading.vue';

import { pushDataRequestServe } from '@/api/installServer';
@Component({
  name: 'LocalGovernmentView',
  components: {
    LocalGovernment,
    LoadingElement,
  },
})
export default class LocalGovernmentView extends Vue {
  private anim = false;
  private laders: ILaders[] = [
    // {
    //   work: '当地政府',
    //   infomationwork: '云南省省长',
    //   infomationname: '阮成发',
    //   infomationphone: '18699018732',
    // },
    // {
    //   work: '当地政府',
    //   infomationwork: '省应急厅长',
    //   infomationname: '王以志',
    //   infomationphone: '13557490401',
    // },
    // {
    //   work: '当地政府',
    //   infomationwork: '玉溪市市长',
    //   infomationname: '张德华',
    //   infomationphone: '15901305478',
    // },
    // {
    //   work: '当地政府',
    //   infomationwork: '元江县县长',
    //   infomationname: '封志荣',
    //   infomationphone: '13779542007',
    // },
  ];
  private status = 'nodata';

  // @Watch('this.$store.state.eventPushStore.eventId')
  // public eventChange(newVal: any): void {
  //   this.reqLaders();
  // }
  @Watch('$store.state.eventPushStore.SEND_PERSON_INFO')
  public eventChange(newVal: any) {
    if (newVal > 0) {
      this.reqLaders();
      this.animation();
    } else if (newVal < 0) {
      this.laders = [];
    }
  }

  // @Watch('this.$store.state.eventPushStore.locationId')
  // public locationChange(newVal: any): void {
  //   if (newVal === 'SEND_PERSON_INFO') {
  //     this.reqLaders();
  //   }
  // }
  @Watch('$store.state.eventPushStore.locationId')
  public locationChange(newVal: any) {
    if (newVal === 'SEND_PERSON_INFO') {
      this.reqLaders();
    }
  }

  // 查询数据
  private async reqLaders() {
    const eventId = this.$store.state.eventPushStore.eventId; // 事件id
    const locationId = 'SEND_PERSON_INFO'; // 位置id
    pushDataRequestServe
      .getPushDataByIds(eventId, locationId)
      .then((res: any) => {
        if (res.data && res.data.content) {
          const tsData = JSON.parse(res.data.content);
          this.laders = JSON.parse(tsData[0].data).event;
          this.status = '';
        } else {
          this.status = 'nodata';
        }
      })
      .catch(() => {
        this.status = 'nodata';
      });
  }
  private created() {
    if (this.$store.state.eventPushStore.SEND_PERSON_INFO > -1) {
      this.reqLaders();
    }
  }
  private animation() {
    this.anim = true;
    setTimeout(() => {
      this.anim = false;
    }, 8000);
  }
}
</script>
<style lang="less" scoped>
</style>