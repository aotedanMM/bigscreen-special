<template>
    <DispatchTeam v-bind="data" :animateFlag="animateFlag" :class="{ 'flashRedBoxs' : isAnimate}" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import DispatchTeam from '@/components/feature/earthquake/dispatchTeam/DispatchTeam.feature.vue';
import { ITeamAssignment } from '@/interface/feature/earthquake/TeamAssignment.interface';
import { pushDataRequestServe } from '@/api/installServer';
const teamAssignment = ['SEND_FIELDTEAM', 'SEND_HURRYTEAM']; // 队伍调派(1.现场队伍 2.赶赴队伍、待命队伍)
@Component({
  name: 'LeftUnNormal',
  components: {
    DispatchTeam,
  },
})
export default class TeamAssignment extends Vue {
  private isAnimate = false;
  private data: ITeamAssignment = {
    local: 0,
    localperson: 0,
    ontheway: 0,
    onthewayperson: 0,
    wait: 0,
    waitperson: 0,
  };
  private animateFlag = {
    liveTeam: 0,
    rushToTeam: 0,
    standbyTeam: 0,
  };
  // 动画播放
  private animation() {
    this.isAnimate = true;
    setTimeout(() => {
      this.isAnimate = false;
      this.animateFlag.liveTeam = 0 ;
      this.animateFlag.rushToTeam = 0 ;
      this.animateFlag.standbyTeam = 0 ;
    }, 8000);
  }

  // 队伍调派
  private async getData(indexId: number) {
    const eventId = this.$store.state.eventPushStore.eventId; // 事件id
    const locationId = teamAssignment[indexId]; // 位置id
    const res: any = await pushDataRequestServe.getPushDataByIds(
      eventId,
      locationId,
    );
    const tsData = JSON.parse(res.data.content)[0].data;
    const tsDataLast = JSON.parse(tsData).event;
    return tsDataLast;
  }
  private async setData1() {
    // 1.现场队伍
    const tsData: any = await this.getData(0);
    console.log(tsData);
    this.data.local = tsData.total;
    this.data.localperson = tsData.totalNum;
  }
  private async setData2() {
    // 2.赶赴队伍
    const tsData: any = await this.getData(1);
    tsData.list.forEach((v: any) => {
      switch (v.teamjc) {
        case '赶赴救援队':
          this.data.ontheway += 1;
          this.data.onthewayperson =
            Number(this.data.onthewayperson) + Number(v.num);
          break;
        case '待命救援队':
          this.data.wait += 1;
          this.data.waitperson = Number(this.data.waitperson) + Number(v.num);
          break;
      }
    });
  }
  @Watch('$store.state.eventPushStore.SEND_FIELDTEAM')
  private getSEND_FIELDTEAM(val: any) {
    if (val > 0) {
      this.animation();
      this.setData1();
      this.animateFlag.liveTeam = 1;
    } else if (val < 0) {
      this.data.local = 0;
      this.data.localperson = 0;
      this.animateFlag.liveTeam = -1;
    }
  }

  @Watch('$store.state.eventPushStore.SEND_HURRYTEAM')
  private getSEND_HURRYTEAM(val: any) {
    if (val > 0) {
      this.animation();
      this.setData2();
      this.animateFlag.rushToTeam = 1;
      this.animateFlag.standbyTeam = 1;

    } else if (val < 0) {

      this.data.ontheway = 0;
      this.data.onthewayperson = 0;
      this.data.wait = 0;
      this.data.waitperson = 0;
      this.animateFlag.rushToTeam = -1;
      this.animateFlag.standbyTeam = -1;
    }
  }
  private created() {
    if (this.$store.state.eventPushStore.SEND_FIELDTEAM > -1) {
      this.setData1();
    }
    if (this.$store.state.eventPushStore.SEND_HURRYTEAM > -1) {
      this.setData2();
    }
  }
}
</script>
