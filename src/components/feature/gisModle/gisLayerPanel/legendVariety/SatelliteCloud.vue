<template>
  <!-- 卫星云图图层图例 -->
  <div class="legendLayerBox">
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import {} from '@/api/feature/monitorwarning/installServer';
/**
 * 图层
 */
@Component({
  name: 'RainForest',
})
export default class RainForest extends Vue {
  private colorList: any = [
    {
      color: '#fff',
      value: '无降水',
    },
    {
      color: '#d3fdbc',
      value: '0~1',
    },
    {
      color: '#a5f094',
      value: '1~2',
    },
    {
      color: '#3fa30a',
      value: '2~4',
    },
    {
      color: '#57baff',
      value: '4~6',
    },
    {
      color: '#0101fa',
      value: '6~8',
    },
    {
      color: '#04704e',
      value: '8~20',
    },
    {
      color: '#fc03f3',
      value: '10~20',
    },
    {
      color: '#de4d08',
      value: '20~50',
    },
    {
      color: '#6c0501',
      value: '>50',
    },
  ];
}
</script>

<style lang="less" scoped>
.legendLayerBox {
  .legend_color {
    height: 100px;
    width: 96%;
    margin-left: 30px;
    .subtext {
      font-size: 22px;
      color: #bbd0dc;
      margin-left: 10px;
    }
    ul {
      display: flex;
      margin-top: 10px;
      margin-left: 6px;
      li {
        span {
          &:nth-child(1) {
            width: 39px;
            height: 15px;
            display: block;
            margin-bottom: 4px;
          }
          &:nth-child(2) {
            font-size: 13px;
            width: 39px;
            display: block;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
