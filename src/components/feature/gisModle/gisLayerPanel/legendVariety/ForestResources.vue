<template>
  <!-- 降水图层图例 -->
  <div class="legendLayerBox">
    <div class="legend_color">
      <!-- <span class="subtext">降水（mm）</span> -->
      <ul>
        <li v-for="(item, index) in colorList" :key="index">
          <span :style="{ background: item.color }"></span>
          <span :title="item.value">{{ item.value }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
@Component({
  name: 'ForestResources',
})
export default class ForestResources extends Vue {
  private colorList: any = [
    {
      color: '#1a9641',
      value: '牧草林',
    },
    {
      color: '#2c9e46',
      value: '竹林',
    },
    {
      color: '#3da74b',
      value: '乔木林',
    },
    {
      color: '#4faf50',
      value: '地方一般灌木林',
    },
    {
      color: '#60b856',
      value: '辅助生产林',
    },
    {
      color: '#72c05b',
      value: '国家特别规定的灌木林',
    },
    {
      color: '#83c860',
      value: '其他灌木林',
    },
    {
      color: '#95d165',
      value: '疏林地',
    },
    {
      color: '#a6d96a',
      value: '其他宜林地',
    },
    {
      color: '#b1de75',
      value: '耕地',
    },
    {
      color: '#bce380',
      value: '苗圃地',
    },
    {
      color: '#c7e78a',
      value: '撩荒地',
    },
    {
      color: '#d3ec95',
      value: '火烧迹地',
    },
    {
      color: '#def1a0',
      value: '采伐迹地',
    },
    {
      color: '#e9f6ab',
      value: '其他无立木林地（未审批）',
    },
    {
      color: '#f4fab5',
      value: '其他无立木林地（原范围）',
    },
    {
      color: '#ffffc0',
      value: '未成林造林地',
    },
    {
      color: '#fff5b4',
      value: '未成林封育地',
    },
    {
      color: '#ffeba8',
      value: '非林地（保留）',
    },
    {
      color: '#fee19c',
      value: '毁林开垦',
    },
    {
      color: '#fed791',
      value: '临时占有',
    },
    {
      color: '#fecc85',
      value: '宜林荒山荒地',
    },
    {
      color: '#fec279',
      value: '宜林沙荒地',
    },
    {
      color: '#fdb86d',
      value: '建设用地',
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
          height: 30px;
        span {
          &:nth-child(1) {
            width: 20px;
          }
          &:nth-child(2) {
            font-size: 20px;
            margin-left: 15px;
            width: 122px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
