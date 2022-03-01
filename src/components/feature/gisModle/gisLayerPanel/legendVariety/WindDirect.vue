<template>
  <!-- 风速风向图层图例 -->
  <div class="legendLayerBox">
    <div class="legend_color">
      <span class="subtext">风速（m/s）</span>
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
  name: 'RadarMap',
})
export default class RainForest extends Vue {
  private colorList: any = [
    {
      color: '#8E9BA9',
      value: '0~2',
    },
    {
      color: '#359642',
      value: '2~4',
    },
    {
      color: '#749542',
      value: '4~6',
    },
    {
      color: '#829543',
      value: '6~8',
    },
    {
      color: '#827B3C',
      value: '8~10',
    },
    {
      color: '#865635',
      value: '10~12',
    },
    {
      color: '#843733',
      value: '12~14',
    },
    {
      color: '#84212D',
      value: '14~16',
    },
    {
      color: '#663D2E',
      value: '16~18',
    },
    {
      color: '#431528',
      value: '18~20',
    },
    {
      color: '#342324',
      value: '>20',
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
          height: 25px;
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
