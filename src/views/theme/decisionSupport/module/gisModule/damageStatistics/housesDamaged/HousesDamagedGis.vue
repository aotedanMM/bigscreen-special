<template>
  <div class="DisasterView" id="HousesDamagedGIS">
    <DamageHouseGIS :listData="listData" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import DamageHouseGIS from '@/components/feature/gisModule/static/damage.HousesDamagedGis.vue';
import { pushDataRequestServe } from '@/api/installServer';
@Component({
  name: 'HousesDamagedGIS',
  components: {
    DamageHouseGIS,
  },
})
export default class HousesDamagedGIS extends Vue {
  private listData: any = [];
  private created() {
    if (this.$store.state.eventPushStore.housesh >= 0) {
      this.getData();
    }
  }

  private async getData() {
    const eventId = this.$store.state.eventPushStore.eventId; // 事件id
    const processId = 'housesh';  // 伤亡id
    const { data }: any = await pushDataRequestServe.getPushDataByIds(eventId, processId );
    const content = JSON.parse(data.content);
    if (content.length > 0) {
      const houseData = JSON.parse(content[0].data).data;
      for (const i of houseData) {
        i.name = i.parentName;
        for (const k of i.child) {
          k.name = k.village;
        }
      }
      houseData.sort( function(a: any, b: any) {
        return b.damage - a.damage;
      });
      this.listData = houseData;
      this.messsageBus.emit('damageToolTable', houseData, 'all');
    }
  }

  @Watch('$store.state.eventPushStore.housesh')
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
#HousesDamagedGIS {
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
