<template>
  <!-- 地震专题图例 -->
  <div class="legendLayerBox">
    <div class="legend_color">
      <!-- <span class="subtext">降水（mm）</span> -->
      <ul>
        <li v-if="hasClass.length > 0">
          <i :class="hasClass[0].className" :style="{ color: colorList[0] }"></i>
          <span>{{ hasClass[0].name}}</span>
        </li>
        <li v-for="(item, index) in dataColor" :key="index">
          <i :style="{ background: colorList[hasClass.length > 0 ? index + 1 : index] }"></i>
          <span :title="item.value">{{ item}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
@Component({
  name: 'EarthQuakeModel',
})
export default class EarthQuakeModel extends Vue {
  @Prop() private tabtitle: any;
  private componentParam: any;
  private colorList: any = [];
  private dataColor: any = [];
  private hasClass: any = [];
  @Watch('tabtitle')
  private changeTitle() {
    this.$store.state.earthQuake.chemicalBlastLegend.data.forEach((item: any, index: any) => {
      if (item.label === this.tabtitle) {
        this.componentParam = index;
      }
    });

    this.dataColor = this.$store.state.earthQuake.chemicalBlastLegend.data[this.componentParam].legendData;
    this.colorList = this.$store.state.earthQuake.chemicalBlastLegend.data[this.componentParam].color;
    this.hasClass = this.$store.state.earthQuake.chemicalBlastLegend.data[this.componentParam].hasClass;
  }
  private created() {
    this.changeTitle();
  }
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
        i {
          width: 15px;
          border-radius: 50%;
          height: 15px;
          font-size: 23px;
          margin-top: 5px;
        }
        span {
          display: block;
          word-break: keep-all;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 138px;
          font-size: 20px;
          margin-left: 15px;
        }
      }
    }
  }
  .locations {
    width: 23px !important;
    height: 23px !important;
    margin-left: -3px;  
    background: url('./img/local.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
