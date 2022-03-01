<template>
  <!-- 雷达回波图层图例 -->
  <div class="legendLayerBox">
    <div class="legend_color">
      <span class="subtext">雷达（反射率）</span>
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
      color: '#622EA7',
      value: '65',
    },
    {
      color: '#765DA8',
      value: '60',
    },
    {
      color: '#812240',
      value: '55',
    },
    {
      color: '#874850',
      value: '45',
    },
    {
      color: '#85697B',
      value: '40',
    },
    {
      color: '#4A5A31',
      value: '35',
    },
    {
      color: '#6B7637',
      value: '30',
    },
    {
      color: '#045A34',
      value: '25',
    },
    {
      color: '#038437',
      value: '20',
    },
    {
      color: '#518C76',
      value: '15',
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
            margin-left: 15px;
          }
        }
      }
    }
  }
}
</style>
