<template>
  <div id="HousesDamagedGis">
    <MapDialogTitle>
      <template v-slot:title>
        物资调拨
      </template>
    </MapDialogTitle>
    <ul class="dieListBox">
      <li
        v-for="(i, index) in listData"
        :key="index"
        @click="checkListFunc(index)"
        :class="listCheck === index ? 'checkSty' : ''"
      >
        <span class="address">{{ i.address }}</span>
        <div class="listCont">
          <span> <span>严重受损：</span>{{ i.dieNum }} </span>
          <span> <span>一般受损：</span>{{ i.hurtNum }} </span>
          <span> <span>房屋倒塌：</span>{{ i.missingNum }} </span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MapDialogTitle from '@/views/theme/decisionSupport/common/MapDialogTitle.vue';
@Component({
  name: 'HousesDamagedGis',
  components: {
    MapDialogTitle,
  },
})
export default class HousesDamagedGis extends Vue {
  private listCheck: any = '';
  private listData: any = [
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
    {
      address: '朝阳区',
      dieNum: '291',
      hurtNum: '129',
      missingNum: '133',
    },
  ];
  private checkListFunc(index: number) {
    this.listCheck = index;
  }
}
</script>
<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.checkSty {
  box-shadow: 0 0 50px rgb(240, 234, 17) inset;
}
#HousesDamagedGis {
  position: fixed;
  top: 30vh;
  left: 51vw;
  z-index: 9999;
  width: 343px;
  height: auto;
  li {
    list-style-type: none;
  }
  .dieTotalBox {
    width: 100%;
    padding: 0;
    margin: 10px 0px;
    li {
      // font-size: 28px;
      cursor: pointer;
      color: #ffffff;
      font-weight: bolder;
      background: rgba(7, 25, 65, 0.8);
      background-size: 100% 100%;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        font-size: 40px;
        cursor: pointer;
        margin: 0 10px 0 10px;
        color: #ff8d10;
        font-weight: 600;
        display: flex;
        align-items: center;
      }
    }
  }
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
