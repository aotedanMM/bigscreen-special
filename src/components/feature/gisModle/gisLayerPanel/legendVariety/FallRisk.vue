<template>
  <!-- 暴雨风险评估图层图例 -->
  <div class="legendLayerBox">
    <div class="legend_color">
      <span class="subtext">风险等级</span>
      <ul>
        <li v-for="(item, index) in colorList" :key="index">
          <span :style="{ background: item.color }"></span>
          <span>{{ item.value }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
@Component({
  name: 'FallRisk',
})
export default class FallRisk extends Vue {
    private colorList: any = [
    {
      color: '#ff5e5e',
      value: '极高风险区',
    },
    {
      color: '#ffaa57',
      value: '高风险区',
    },
    {
      color: '#ffff58',
      value: '中风险区',
    },
    {
      color: '#30cefd',
      value: '低风险区',
    },
  ];
}
</script>

<style lang="less" scoped>
.legendLayerBox {
  .legend_color {
    height: 100%;
    width: 100%;
    .subtext {
      font-size: 22px;
      color: #bbd0dc;
    }
    ul {
      display: flex;
      flex-direction: column;
      margin: 10px 0 0 15px;
      li {
          display: flex;
          height: 35px;
          line-height: 35px;
        span {
          &:nth-child(1) {
            width: 20px;
          }
          &:nth-child(2) {
            font-size: 20px;
            margin-left: 15px
          }
        }
      }
    }
  }
}
</style>
