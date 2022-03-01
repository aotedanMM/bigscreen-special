<template>
  <!-- 灾情统计入口页面 -->
  <div class="disaster_main">
    <DisasterStatisticsHome
      v-show="!curActiveComp.compName"
      :handleClick="handleClickFn"
      :showState="!curActiveComp.compName"
    >
    </DisasterStatisticsHome>
    <component
      v-if="curActiveComp.compName"
      :is="curActiveComp.compName"
      :compParam="curActiveComp.compParam"
      :handleClick="handleClickFn"
    >
    </component>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import DisasterSituationContainer from '@/components/feature/flood/DisasterStatistics/DisasterSituationContainer.vue';
import CommonDisasterContainer from '@/components/feature/flood/DisasterStatistics/CommonDisasterContainer.vue';
import DisasterSituationTown from '@/components/feature/flood/DisasterStatistics/DisasterSituationTown.vue';

import { disasterSituationServer } from '@/api/feature/disasterStatistics/installServer';
import DisasterStatisticsHome from '@/components/feature/flood/DisasterStatistics/DisasterStatisticsHome.vue'; // 灾情统计首页

/**
 * 灾情统计
 */
@Component({
  name: 'DisasterStatistics',
  components: {
    DisasterSituationContainer, // 受灾情况详情
    CommonDisasterContainer, // 自然灾害详情
    DisasterSituationTown, // 受灾乡镇
    DisasterStatisticsHome,
  },
})
export default class DisasterStatistics extends Vue {
  private curActiveComp = {
    // 当前激活的下钻组件
    compName: '',
    compParam: {},
  };

  private handleClickFn(compName: any, compParam: any) {
    this.curActiveComp = {
      compName: compName === 'DisasterStatisticsHome' ? '' : compName,
      compParam: JSON.parse(JSON.stringify(compParam)),
    };
  }
}
</script>

<style lang="less" scoped></style>
