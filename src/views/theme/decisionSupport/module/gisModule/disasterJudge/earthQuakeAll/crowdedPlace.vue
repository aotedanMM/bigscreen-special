<template>
    <div id="CrowdedPlace">
        <EarthQuake :personnelKey='personnelKey' :earthTitle='earthTitle'/>
    </div>
</template>
<script lang="ts">
  import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
  import EarthQuake from './earthQuakeCommon.vue';

  @Component({
    name: 'CrowdedPlace',
    components: {
      EarthQuake,
    },
  })
  export default class CrowdedPlace extends Vue {
    private personnelKey: any = ['school', 'hospital', 'airport', 'railwaystation'];
    private earthTitle: any = '人员密集场所';
    // private personnelKey: any = ['school', 'hospital', 'airport', 'railwaystation', 'hazardous', 'coalMine', 'mine', 'explosive', 'reservoir', 'portwharf', 'nuclear'];
  }
</script>
