<template>
  <!-- 降水图层图例 -->
  <div class="legendLayerBox">
    <div class="legend_color">
      <span class="subtext">降水（mm）</span>
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
  name: 'RainForest',
})
export default class RainForest extends Vue {
  private colorList: any = [
    {
      color: '#8C9AA8',
      value: '无降雨',
    },
    {
      color: '#589167',
      value: '0~10',
    },
    {
      color: '#2B664F',
      value: '10~25',
    },
    {
      color: '#3D6E9F',
      value: '25~50',
    },
    {
      color: '#09189E',
      value: '50~100',
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
      margin: 10px 0 0 30px;
      li {
          display: flex;
          height: 40px;
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
