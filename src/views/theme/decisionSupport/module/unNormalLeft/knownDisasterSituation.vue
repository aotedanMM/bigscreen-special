<template>
  <KnownDisaster :list="getList" :class="anim?'flashRedBoxs':''" />
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import KnownDisaster from '@/components/feature/earthquake/knownDisaster/knownDisaster.vue';
import {
  KnownDisasterInterface,
  KnownDisasterDataField,
} from '@/interface/feature/earthquake/KnownDisaster';
import { pushDataRequestServe } from '@/api/installServer';
import { Switch } from 'element-ui';
const knownDisasterSituation = [
  'casualties',
  'housesh',
  'RESCERTRANSFER',
  'SIZEUP',
]; // 非常态左侧-实时灾情(1.死亡、受伤 2.房屋受损 3.救出、转移 4.预估人/万间)

@Component({
  name: 'KnownDisasterInstantiation',
  components: {
    KnownDisaster,
  },
})
export default class KnownDisasterInstantiation extends Vue {
  private anim = false;
  get getList() {
    // this.animation();
    return [
      {
        class: 'death',
        name: '死亡',
        value: this.data.death,
        unit: '人',
        estimates: this.estimates.death,
        arrow: this.data.arrow1,
      },
      {
        class: 'hurt',
        name: '受伤',
        value: this.data.hurt,
        unit: '人',
        arrow: this.data.arrow2,
      },
      {
        class: 'damage',
        name: '房屋受损',
        value: this.data.damage,
        unit: '处',
        estimates: this.estimates.hurt,
        arrow: this.data.arrow3,
      },
      {
        class: 'resuce',
        name: '救出',
        value: this.data.resuce,
        unit: '人',
        arrow: this.data.arrow4,
      },
      {
        class: 'transfer',
        name: '转移',
        value: this.data.transfer,
        unit: '人',
        arrow: this.data.arrow5,
      },
    ];
  }
  private data: KnownDisasterDataField = {
    death: 0,
    hurt: 0,
    damage: 0,
    resuce: 0,
    transfer: 0,
    arrow1: 0,
    arrow2: 0,
    arrow3: 0,
    arrow4: 0,
    arrow5: 0,
  };

  private estimates: KnownDisasterDataField = {
    death: 0,
    hurt: 0,
    damage: 0,
    resuce: 0,
    transfer: 0,
  };
  private animation() {
    this.anim = true;
    setTimeout(() => {
      this.anim = false;
      this.data.arrow1 = 0;
      this.data.arrow2 = 0;
      this.data.arrow3 = 0;
      this.data.arrow4 = 0;
      this.data.arrow5 = 0;
    }, 8000);
  }

  @Watch('data.death')
  private watchData1(newVal: any, oldVal: any) {
    if (newVal > oldVal) {
      this.data.arrow1 = 1;
    } else if (newVal < oldVal) {
      this.data.arrow1 = -1;
    } else {
      this.data.arrow1 = 0;
    }
  }
  @Watch('data.hurt')
  private watchData2(newVal: any, oldVal: any) {
    if (newVal > oldVal) {
      this.data.arrow2 = 1;
    } else if (newVal < oldVal) {
      this.data.arrow2 = -1;
    } else {
      this.data.arrow2 = 0;
    }
  }
  @Watch('data.damage')
  private watchData3(newVal: any, oldVal: any) {
    if (newVal > oldVal) {
      this.data.arrow3 = 1;
    } else if (newVal < oldVal) {
      this.data.arrow3 = -1;
    } else {
      this.data.arrow3 = 0;
    }
  }
  @Watch('data.resuce')
  private watchData4(newVal: any, oldVal: any) {
    if (newVal > oldVal) {
      this.data.arrow4 = 1;
    } else if (newVal < oldVal) {
      this.data.arrow4 = -1;
    } else {
      this.data.arrow4 = 0;
    }
  }
  @Watch('data.transfer')
  private watchData5(newVal: any, oldVal: any) {
    if (newVal > oldVal) {
      this.data.arrow5 = 1;
    } else if (newVal < oldVal) {
      this.data.arrow5 = -1;
    } else {
      this.data.arrow5 = 0;
    }
  }
  private async getData(indexId: number) {
    const eventId = this.$store.state.eventPushStore.eventId; // 事件id
    const locationId = knownDisasterSituation[indexId]; // 位置id
    const res: any = await pushDataRequestServe.getPushDataByIds(
      eventId,
      locationId,
    );

    const tsData = JSON.parse(res.data.content)[0];
    const tsDataLast = JSON.parse(tsData.data).data;
    return tsDataLast;
  }
  private async setData1() {
    // 1.死亡、受伤
    const tsData: any = await this.getData(0);
    this.data.death = Number(tsData.death) || 0;
    this.data.hurt = Number(tsData.injured) || 0;
  }
  private async setData2() {
    // 2.房屋受损
    const tsData: any = await this.getData(1);
    let damage: number = 0;
    if (tsData.length > 0) {
      tsData.forEach((item: any) => {
        damage += item.damage + item.yazhongsunhuai + item.yibansunhuai ;
      });
    } else {
      damage = tsData.damage + tsData.yazhongsunhuai + tsData.yibansunhuai;
    }
    this.data.damage = damage || 0;
  }
  private async setData3() {
    // 3.救出、转移
    const tsData: any = await this.getData(2);
    this.data.resuce = tsData.rescuerPerson || 0;
    this.data.transfer = tsData.transferPerson || 0;
  }
  private async setData4() {
    // 4.预估人/万间
    const tsData: any = await this.getData(3);
    this.estimates.death = tsData.deathperson || 0;
    this.estimates.hurt = tsData.houseclose || 0;
  }

  // 监听 对应key 改变
  @Watch('$store.state.eventPushStore.casualties')
  private getCASUALTIES(val: any) {
    if (val > 0) {
      this.animation();
      this.setData1();
    } else if (val < 0) {
      this.data.death = 0;
      this.data.hurt = 0;
    }
  }

  @Watch('$store.state.eventPushStore.housesh')
  private getHOUSESH(val: any) {
    if (val > 0) {
      this.animation();
      this.setData2();
    } else if (val < 0) {
      this.data.damage = 0;
    }
  }

  @Watch('$store.state.eventPushStore.RESCERTRANSFER')
  private getRESCERTRANSFER(val: any) {
    if (val > 0) {
      this.animation();
      this.setData3();
    } else if (val < 0) {
      this.data.resuce = 0;
      this.data.transfer = 0;
    }
  }

  @Watch('$store.state.eventPushStore.SIZEUP')
  private getSIZEUP(val: any) {
    if (val > 0) {
      this.animation();
      this.setData4();
    } else if (val < 0) {
      this.estimates.death = 0;
      this.estimates.hurt = 0;
    }
  }
  private created() {
    if (this.$store.state.eventPushStore.casualties > -1) {
      this.setData1();
    }
    if (this.$store.state.eventPushStore.housesh > -1) {
      this.setData2();
    }
    if (this.$store.state.eventPushStore.RESCERTRANSFER > -1) {
      this.setData3();
    }
    if (this.$store.state.eventPushStore.SIZEUP > -1) {
      this.setData4();
    }
  }
}
</script>