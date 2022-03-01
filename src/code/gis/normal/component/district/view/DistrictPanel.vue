
<template>
  <div>
       <ul>
         <li v-for = "item in gisData.model.countyList" v-bind:key="item.id" >
           <span @click = "locate(item)">{{item.name}}</span>
         </li>
       </ul>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
// GIS模块
// 灾情研判行政区划
import EComponentVueView from '../../../../../emap/component/EComponentVueView';
import DistritComponent from '../DistritComponent';

@Component({
  name: 'DistrictPanel',
})
export default class TestGIS extends EComponentVueView<DistritComponent> {

    private gisData: any = { model : {} };
    public accept(component: DistritComponent) {
        super.accept(component);
        //
        this.gisData = component.model();
   }

   private locate(data: any) {
     this.getComponent().locate(data);
   }
}
</script>
<style lang="less" scoped>
</style>