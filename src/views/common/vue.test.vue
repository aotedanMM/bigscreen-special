<template>
    <div>
        <DispatchGoods :dispatched="dispatched" :arrivated="arrivated"></DispatchGoods>
        <EventTime style="color:#fff"></EventTime>
       <leaderInstruction :msg="msg"></leaderInstruction>
       <progressSituation></progressSituation>
          <radarChart></radarChart>
    </div> 
</template>


<script lang="ts">
import { Component, Vue , Prop } from 'vue-property-decorator';

import DispatchGoods from '@/components/feature/earthquake/dispatchGoods/DispatchGoods.feature.vue';
import EventTime from '@/components/feature/earthquake/eventTime/EventTime.feature.vue';
import leaderInstruction from '@/components/feature/earthquake/leaderInstruction/LeaderInstruction.feature.vue';
import progressSituation from '@/components/feature/earthquake/progressSituation/ProgressSituation.feature.vue';
import radarChart from '@/components/feature/earthquake/radarChart/radarChart.feature.vue';
/**
  * 物资调派组件
  */
@Component({
    components : {
        DispatchGoods,
        EventTime,
         leaderInstruction,
         progressSituation,
        radarChart,
    },
})
export default class Flood1 extends Vue {
    private dispatched = '12';
    private arrivated = 16;
    private msg = '领导批示内容';



}
</script>