<template>
  <!-- 图层图例 -->
  <div class="Wind-legend">
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
import {} from '@/api/feature/monitorwarning/installServer';
/**
 * 图层
 */
@Component({
  name: 'Wind',
})
export default class Wind extends Vue {
  private isShow: any = true;
  private colorList: any = [
    {
      color: '#fdfdfd',
      value: '2',
    },
    {
      color: '#69f727',
      value: '4',
    },
    {
      color: '#d3f51b',
      value: '6',
    },
    {
      color: '#0101fa',
      value: '8',
    },
    {
      color: '#04704e',
      value: '10',
    },
    {
      color: '#fc03f3',
      value: '12',
    },
    {
      color: '#de4d08',
      value: '14',
    },
    {
      color: '#6c0501',
      value: '16',
    },
  ];

  public getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('rainForecast');
    return component;
  }

  private created(): void {
    // this.getComponent().load(0);
  }
  // private beforeDestroy(): void {
  //   clearInterval(this.autoPlay);
  // this.getComponent().unload();
  // }
}
</script>

<style lang="less" scoped>
@imgPath: '../../../../assets/img/gisModule/legendPlanel';
.Wind-legend {
  .legend_color {
    height: 100px;
    width: 90%;
    margin-left: 30px;
    margin-top: 70px;
    .subtext {
      font-size: 26px;
      color: #bbd0dc;
      margin-left: 10px;
      margin-bottom: 20px;
      display: block;
    }
    ul {
      display: flex;
      margin-top: 10px;
      margin-left: 6px;
      li {
        span {
          &:nth-child(1) {
            width: 50px;
            height: 15px;
            display: block;
            margin-bottom: 4px;
          }
          &:nth-child(2) {
            font-size: 18px;
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
