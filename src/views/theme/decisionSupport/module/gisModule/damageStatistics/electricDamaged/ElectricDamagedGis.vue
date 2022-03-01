<template>
  <div class="DisasterView" id="ElectricDamagedGIS">
    <DamageElectricGIS :listData="listData" :allEleDamage="allEleDamage" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import DamageElectricGIS from '@/components/feature/gisModule/static/damage.ElectricDamagedGis.vue';
import { pushDataRequestServe } from '@/api/installServer';
@Component({
  name: 'ElectricDamagedGIS',
  components: {
    DamageElectricGIS,
  },
})
export default class ElectricDamagedGIS extends Vue {
  private listData: any = [];
  private allEleDamage: any = {
    road: 0,
    station: 0,
  };
  private created() {
    if (this.$store.state.eventPushStore.power >= 0) {
      this.getData();
    }
  }

  private async getData() {
    const eventId = this.$store.state.eventPushStore.eventId; // 事件id
    const processId = 'power';  // 伤亡id
    const { data }: any = await pushDataRequestServe.getPushDataByIds(eventId, processId );
    const content = JSON.parse(data.content);
    if (content.length > 0) {
      const eletricData = JSON.parse(content[0].data).data;
      for (const i of eletricData) {
        i.name = i.parentName;
        for (const k of i.child) {
          k.name = k.village;
        }
      }
      eletricData.sort( function(a: any, b: any) {
        return b.dianxianhao - a.dianxianhao;
      });
      this.listData = eletricData;
      this.messsageBus.emit('damageToolTable', eletricData, 'all');
    }
    this.allEleDamage.road = 0;
    this.allEleDamage.station = 0;
    for (const i of this.listData) {
      this.allEleDamage.road += i.dianxianhao;
      this.allEleDamage.station += i.dianzhancount;
    }
  }

  @Watch('$store.state.eventPushStore.power')
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
#ElectricDamagedGIS {
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
