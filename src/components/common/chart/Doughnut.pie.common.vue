<!--队伍需求 饼图甜甜圈-->
<template>
  <div class="" :id="id" style="width:100%; height:100%;">
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
  import BaseChart from './BaseChart';
  /**
    *  甜甜圈饼图组件
    */
  @Component({
    name: 'DoughnutPie',
  })
  export default class DoughnutPie extends BaseChart {
    // 容器id
    @Prop() public id!: string;
    // 传入的option ，参考echarts option
    @Prop() public option: any;
    public mounted() {
      this.getDoughnutData();
    }

    @Watch('option')
    private getDoughnutData() {
      this.init(this.id);
      this.setOption(this.option);
    }

  }
</script>
<style lang="less"  scoped>
  // @import url(); 引入公共css类
</style>