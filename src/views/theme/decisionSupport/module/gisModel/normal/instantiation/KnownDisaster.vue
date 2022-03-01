<template>
  <KnownDisaster :list="getList" />
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import KnownDisaster from '@/components/feature/earthquake/knownDisaster/knownDisaster.vue';
import {
  KnownDisasterInterface,
  KnownDisasterDataField,
} from '@/interface/feature/earthquake/KnownDisaster';
import { knownDisasterServer } from '@/api/installServer';
@Component({
  name: 'KnownDisasterInstantiation',
  components: {
    KnownDisaster,
  },
})
export default class KnownDisasterInstantiation extends Vue {
  @Prop() public data!: KnownDisasterDataField;

  @Prop() public estimates!: KnownDisasterDataField;

  get getList() {
    return [
      // {
      //   class: 'death',
      //   name: '死亡',
      //   value: this.data.death,
      //   unit: '人',
      //   estimates: this.estimates.death,
      // },
      // {
      //   class: 'hurt',
      //   name: '受伤',
      //   value: this.data.hurt,
      //   unit: '人',
      // },
      // {
      //   class: 'damage',
      //   name: '房屋受损',
      //   value: this.data.damage,
      //   unit: '万间',
      //   estimates: this.estimates.death,
      // },
      // {
      //   class: 'resuce',
      //   name: '救出',
      //   value: this.data.resuce,
      //   unit: '人',
      // },
      // {
      //   class: 'transfer',
      //   name: '转移',
      //   value: 0,
      //   unit: '人',
      // },
    ];
  }
}
</script>