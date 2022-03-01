
<!--救援救助-队伍需求-->
<template>
    <div class="ca-echart-loop-wrap">
        <TeamDemand :id="id" :option="personalOption" v-if="loaded"></TeamDemand>
        <div v-else class="nothingData--bg"></div> 
    </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import TeamDemand from '@/components/feature/earthquake/personalCasualty/PersonalCasualty.vue';
import { IpersonalOption } from '@/interface/feature/earthquake/personalCasualty.interface';
import { pushDataRequestServe } from '@/api/installServer';
const locationKey = ['SEND_FIELDTEAM', 'SEND_RESCUEDEMAND']; // （1.现场队伍人数 2.需要队伍人数）
@Component({
  name: 'TeamNeedView',
  components: {
    TeamDemand,
  },
})
export default class TeamNeedView extends Vue {
  public id = 'teamDemand-echart';
  public originData = [
    { name: '需要队伍人数', value: 0 },
    { name: '现场队伍人数', value: 0 },
  ];
  public personalOption = {
    color: ['#0187d9', '#15b873'],
    dataset: {
      source: [{ name: '医院', value: 12 }],
    },
    series: [
      {
        type: 'pie',
        radius: ['47%', '57%'],
        label: {
          padding: [5, -115],
          formatter(params: any) {
            const name = params.data.name;
            const value = params.data.value ? params.data.value : '--';
            return `{aa|${value}人\n${name}}`;
          },
          rich: {
            aa: {
              fontSize: 22,
              padding: [7, 10],
            },
          },
        },
        labelLine: {
          length: 25,
          length2: 100,
        },
      },
      {
        z: 0,
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['37%', '57%'],
        data: [1],
        itemStyle: {
          color: '#071c44',
        },
        hoverAnimation: false,
        label: {
          padding: 10,
          formatter: '',
          position: 'center',
          color: '#00d2ff',
          fontSize: 30,
          // borderRadius: 100,
          // backgroundColor: '#1c2a3e',
        },
      },
    ],
  };
  public sum1 = this.originData.reduce((pre: any, cur: any) => {
    return pre + cur.value;
  }, 0);
  private loaded = false;
  public created() {
    if (this.$store.state.eventPushStore.SEND_FIELDTEAM > -1) {
      this.init();
    }
    if (this.$store.state.eventPushStore.SEND_RESCUEDEMAND > -1) {
      this.init();
    }
  }
  private async getData(indexId: number) {
    const eventId = this.$store.state.eventPushStore.eventId; // 事件id
    const locationId = locationKey[indexId]; // 位置id
    const res: any = await pushDataRequestServe.getPushDataByIds(
      eventId,
      locationId,
    );
    if (res.data.content) {
      const tsData = JSON.parse(JSON.parse(res.data.content)[0].data).event;
      return tsData;
    } else {
      return  this.originData;
    }
  }
  private async init() {
    if (this.getData.length === 0) {
        this.getData  = JSON.parse(JSON.stringify(this.originData));
    }
    const tsDataA: any = await this.getData(0);
    const tsDataB: any = await this.getData(1);
    this.setData(tsDataA.totalNum, tsDataB.list.length);
  }
  private setData(A: any, B: any) {
    this.originData[0].value = A;
    this.originData[1].value = B;
    this.personalOption.dataset.source = this.originData;
    this.loaded = true;
  }
  @Watch('$store.state.eventPushStore.SEND_FIELDTEAM')
  @Watch('$store.state.eventPushStore.SEND_RESCUEDEMAND')
  private getSIZEUP(val: any) {
    if (val >= 0) {
      this.init();
    } else if (val < 0) {
      this.originData[0].value = 0;
      this.originData[1].value = 0;
      this.personalOption.dataset.source = this.originData;
    }
  }
}
</script>
<style lang='less' scoped>
.ca-echart-loop-wrap {
  padding: 10px;
  height: 230px;
  margin-left: -15px;
}
</style>
