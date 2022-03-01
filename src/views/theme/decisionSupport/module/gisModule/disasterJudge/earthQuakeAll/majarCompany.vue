<template>
    <div id="MajarCompany">
        <EarthQuake :personnelKey='personnelKey' :earthTitle='earthTitle'/>
    </div>
</template>
<script lang="ts">
  import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
  import EarthQuake from './earthQuakeCommon.vue';

  @Component({
    name: 'MajarCompany',
    components: {
      EarthQuake,
    },
  })
  export default class MajarCompany extends Vue {
    private personnelKey: any = ['reservoir', 'portwharf', 'nuclear'];
    private earthTitle: any = '重要设施';
    // private personnelKey: any = ['school', 'hospital', 'airport', 'railwaystation', 'hazardous', 'coalMine', 'mine', 'explosive', 'reservoir', 'portwharf', 'nuclear'];
  }
</script>
