<template>
  <TeamCoverage :data="data" />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import TeamCoverage from '@/components/feature/earthquake/teamCoverage/TeamCoverage.teature.vue';
/**
 * 队伍覆盖率
 */
@Component({
  name: 'TeamCoverageDemo',
  components: {
    TeamCoverage,
  },
})
export default class TeamCoverageDemo extends Vue {
  private data = {
    name: ['江安县', '长宁县', '高县', '兴文县', '珙县'],
    value: [25, 60, 0, 15, 10],
    notPlacedNum: 10, // 队伍覆盖率
    total: 110,
    capacity: 60, // 容量最大值
  };
}
</script>