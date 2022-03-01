<template>
  <div class="DisasterView" id="MissDamagedGIS">
    <DamageMissGIS :listData="listData" :allMissFlight="allMissFlight" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import DamageMissGIS from '@/components/feature/gisModule/static/damage.MissingFlight.vue';
import { pushDataRequestServe } from '@/api/installServer';
@Component({
  name: 'MissDamagedGIS',
  components: {
    DamageMissGIS,
  },
})
export default class MissDamagedGIS extends Vue {
  private listData: any = [];
  private allMissFlight: any = {
    area: 0,
    station: 0,
  };
  private created() {
    if (this.$store.state.eventPushStore.outofcontact >= 0) {
      this.getData();
    }
  }

  private async getData() {
    const eventId = this.$store.state.eventPushStore.eventId; // 事件id
    const processId = 'outofcontact';  // 失联id
    const { data }: any = await pushDataRequestServe.getPushDataByIds(eventId, processId );
    const content = JSON.parse(data.content);
    if (content.length > 0) {
      this.listData = JSON.parse(content[0].data).data;
    }
    this.allMissFlight.area = 0;
    this.allMissFlight.station = 0;
    for (const i of this.listData) {
      i.missArea = 0, i.loss = 0, i.good = 0;
      this.allMissFlight.area += i.child.length;
      i.missArea = i.child.length;
      for (const k of i.child) {
        this.allMissFlight.station += k.loss;
        i.loss += k.loss;
        i.good += k.good;
      }
    }
    this.listData.sort( function(a: any, b: any) {
      return b.loss - a.loss;
    });
    this.messsageBus.emit('damageToolTable', this.listData, 'all');
  }

  @Watch('$store.state.eventPushStore.outofcontact')
  private eventChange(val: any) {
    if (val >= 0) {
      this.getData();
    }
  }
}
</script>
<style lang="less" scoped>
@import url('../../../../../../../assets/css/decisionSupport/GisPanel.less');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.checkSty {
  box-shadow: 0 0 50px rgb(240, 234, 17) inset;
}
#MissDamagedGIS {
  // position: absolute;
  // top: 220px;
  // left: 60px;
  // z-index: 9999;
  li {
    list-style-type: none;
  }
  // .dieTotalBox {
  //   width: 100%;
  //   padding: 0;
  //   margin: 10px 0px;
  //   li {
  //     // font-size: 28px;
  //     cursor: pointer;
  //     color: #ffffff;
  //     font-weight: bolder;
  //     background: rgba(7, 25, 65, 0.8);
  //     background-size: 100% 100%;
  //     border-radius: 20px;
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //     span {
  //       font-size: 40px;
  //       cursor: pointer;
  //       margin: 0 10px 0 10px;
  //       color: #ff8d10;
  //       font-weight: 600;
  //       display: flex;
  //       align-items: center;
  //     }
  //   }
  // }
  .dieListBox {
    height: 450px;
    overflow-y: scroll;
    li {
      width: 100%;
      background: rgba(7, 25, 65, 0.8);
      background-size: 100% 100%;
      border-radius: 20px;
      margin-bottom: 10px;
      cursor: pointer;
      color: #ffffff;
      display: flex;
      justify-content: space-between;
      padding: 5px 25px 5px 15px;
      .address {
        width: 34%;
        height: auto;
        font-size: 24px;
        text-align: center;
      }
      .listCont {
        display: flex;
        flex-direction: column;
        font-size: 24px;
      }
    }
  }
  .dieListBox::-webkit-scrollbar {
    display: none;
  }
}
</style>
