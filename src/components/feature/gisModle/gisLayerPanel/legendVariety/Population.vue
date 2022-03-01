<template>
  <!-- 人口热力图层图例 -->
  <div class="legendLayerBox">
    <div class="legend_color">
      <div>
        <span class="population"></span
        ><span class="subtext">人/100平方米</span>
      </div>
      <span class="subtext sub">实时人口</span>
      <div class="legendCol">
            <div class="borderBg"></div>
            <ul>
                <li v-for="(item, index) in colorList" :key="index">
                <span>{{ item.value }}</span>
                </li>
            </ul>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
@Component({
  name: 'Population',
})
export default class Population extends Vue {
  private isShow: any = true;
  private colorList: any = [
    {
      color: '#a5f094',
      value: '0',
    },
    {
      color: '#3fa30a',
      value: '125',
    },
    {
      color: '#57baff',
      value: '275',
    },
    {
      color: '#0101fa',
      value: '425',
    },
    {
      color: '#04704e',
      value: '500以上',
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
@imgPath: '../../../../../assets/img/gisModule/legendPlanel';
.legendLayerBox {
  .legend_color {
    height: 100%;
    width: 100%;
    .population {
      width: 26px;
      height: 29px;
      background: url('@{imgPath}/population.png') no-repeat 0 0;
      background-size: 100% 100%;
      display: inline-block;
      margin-bottom: -7px;
    }
    .subtext {
      font-size: 22px;
      color: #bbd0dc;
    }
    .sub {
      text-align: left;
      margin: 20px 0px 20px 15px;
    }
    .legendCol {
        display: flex;
        margin-top: 20px;
    }
    .borderBg {
      width: 15px;
      height: 200px;
      margin: 0 20px;
      background-image: linear-gradient(
        180deg,
        #ffffff 10%,
        #53c8f9 30%,
        #53f873 50%,
        #f8db53 70%,
        #e64236 90%
      );
    }
    ul {
      display: flex;
      flex-direction: column;
      li {
        display: flex;
        height: 40px;
        line-height: 40px;
        span {
            font-size: 20px;
            margin-left: 15px;
        }
      }
    }
  }
}
</style>
