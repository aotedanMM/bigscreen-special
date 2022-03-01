


<!--队伍需求-->
<template>
  <div :id="echartsID"
       style="width:100%;height:90%;"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as echarts from 'echarts';

import { TeamCoverageOption } from '../../../../interface/feature/common/teamCoverage/TeamCoverage.interface';
/**
 * 队伍需求
 */
@Component({
  name: 'TeamCoverage',
  components: {},
})
export default class TeamCoverage extends Vue {
  @Prop({ default: '队伍需求', type: String }) public title?: string;
  @Prop(String) public id!: string;
  //  @Prop(Object) public originData!: any;
  @Prop(Object) public option!: TeamCoverageOption;
  private echartsID =
    'echarts' + +new Date() + Math.floor(Math.random() * 1000);

  private ehcartsObj: any;
  private init() {
    const div = document.getElementById(this.echartsID) as HTMLDivElement;
    this.ehcartsObj = echarts.init(div);
    this.ehcartsObj.setOption(this.option);
  }

  private mounted() {
    this.init();
  }
}
</script>
