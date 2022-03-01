<template>
  <!-- 洪水径流图层图例 -->
  <div class="legendLayerBox">
    <div class="legend_color">
      <span class="subtext">水深（m）</span>
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
  name: 'FloodForecast',
})
export default class FloodForecast extends Vue {
  private colorList: any = [
    {
      color: 'rgb(255,255,240)',
      value: '0~0.005',
    },
    {
      color: 'rgb(56,168,0)',
      value: '0.005~0.05',
    },
    {
      color: 'rgb(38,115,0)',
      value: '0.05~0.1',
    },
    {
      color: 'rgb(115,233,255)',
      value: '0.1~0.15',
    },
    {
      color: 'rgb(0,169,230)',
      value: '0.15~0.2',
    },
    {
      color: 'rgb(0,132,168)',
      value: '0.2~0.25',
    },
    {
      color: 'rgb(0,92,230)',
      value: '0.25~0.3',
    },
    {
      color: 'rgb(230,230,0)',
      value: '0.3~0.5',
    },
    {
      color: 'rgb(255,170,0)',
      value: '0.5~0.8',
    },
    {
      color: 'rgb(255,85,0)',
      value: '0.8~1',
    },
    {
      color: 'rgb(115,0,0)',
      value: '1~100',
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
        height: 25px;
        span {
          &:nth-child(1) {
            width: 20px;
          }
          &:nth-child(2) {
            font-size: 20px;
            margin-left: 15px;
          }
        }
      }
    }
  }
}
</style>
