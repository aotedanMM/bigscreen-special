<template>
  <div :id="targetId">
  </div>
</template>
<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import {mapServer} from '@/api/installServer';
import MapCommon from '@/util/MapCommon';
import publishObjectPath from '@/util/configRegistry';
@Component({
    name: 'Map3D',
    mixins: [MapCommon],
})
export default class Map3D extends Vue {
    public getMap: any = null ;

    @Prop() public targetId: any ;
}
</script>
<style>
#map1 {
  width: 100%;
  height: 100%;
}
</style>
