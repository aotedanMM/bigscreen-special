<template>
    <div id="GeneralCompany">
        <EarthQuake :personnelKey='personnelKey' :earthTitle='earthTitle'/>
    </div>
</template>
<script lang="ts">
  import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
  import EarthQuake from './earthQuakeCommon.vue';

  @Component({
    name: 'GeneralCompany',
    components: {
      EarthQuake,
    },
  })
  export default class GeneralCompany extends Vue {
    private personnelKey: any = ['hazardous', 'coalMine', 'mine', 'explosive'];
    private earthTitle: any = '企业';
    // private personnelKey: any = ['school', 'hospital', 'airport', 'railwaystation', 'hazardous', 'coalMine', 'mine', 'explosive', 'reservoir', 'portwharf', 'nuclear'];
  }
</script>
