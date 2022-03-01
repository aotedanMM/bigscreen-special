<template>
  <!-- 树种结构图例 -->
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
  name: 'TreeStructure',
})
export default class TreeStructure extends Vue {
  private colorList: any = [
    {
      color: '#d7191c',
      value: '阔叶纯林',
    },
    {
      color: '#ed6e43',
      value: '阔叶相对纯林',
    },
    {
      color: '#fdba6e',
      value: '阔叶混交林',
    },
    {
      color: '#fee8a4',
      value: '针阔混交林',
    },
    {
      color: '#e7f5b7',
      value: '针叶混交林',
    },
    {
      color: '#b7e2a8',
      value: '针叶相对纯林',
    },
    {
      color: '#74b6ad',
      value: '针叶纯林',
    },
    {
      color: '#2b83ba',
      value: '乔灌混交林',
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
