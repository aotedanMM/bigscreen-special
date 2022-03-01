<template>
  <!--  -->
  <div class="rainfallContent">
    <!-- <span class="title">{{ componentParam.title }}</span> -->
    <ul>
      <li v-for="(item, index) in componentParam.content"
          :key="index">
        <!-- <img class="img" :src="item.iconName" alt /> -->
        <span :class="item.iconName"></span>
        <span>{{ item.text }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
/**
 * 水库测站  告警水库 图例
 */
@Component({
  name: 'Warning',
})
export default class Warning extends Vue {
  @Prop() private componentParam: any;
}
</script>

<style lang="less" scoped>
@imgPath: '../../../../../../../../../assets/img/gisModule/legendPlanel/reservoirLegend';
.rainfallContent {
  margin-top: 15px;
  //   padding-left: 60px;
  color: #fff;
  .title {
    font-size: 20px;
    display: inline-block;
    margin-bottom: 4px;
  }
  ul {
    li {
      margin-left: 15%;
      margin-bottom: 10px;
      span {
        font-size: 20px;
        display: inline-block;
        &:nth-child(1) {
          width: 24px;
          height: 20px;
          margin-right: 6px;
          margin-bottom: -3px;
        }
      }
      // .reservoirwyj {
      //   background: url('@{imgPath}/bigreservoirwyj.png') no-repeat 0 0;
      //   background-size: 100% 100%;
      // }
      .reservoircxx {
        background: url('@{imgPath}/bigreservoircxx.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .reservoirczc {
        background: url('@{imgPath}/bigreservoirczc.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .reservoircsj {
        background: url('@{imgPath}/bigreservoircsj.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .reservoircls {
        background: url('@{imgPath}/bigreservoircls.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
            .reservoircxx1 {
        background: url('@{imgPath}/middlereservoircxx.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .reservoirczc1 {
        background: url('@{imgPath}/middlereservoirczc.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .reservoircsj1 {
        background: url('@{imgPath}/middlereservoircsj.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .reservoircls1 {
        background: url('@{imgPath}/middlereservoircls.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
            .reservoircxx2 {
        background: url('@{imgPath}/smalltopreservoircxx.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .reservoirczc2 {
        background: url('@{imgPath}/smalltopreservoirczc.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .reservoircsj2 {
        background: url('@{imgPath}/smalltopreservoircsj.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .reservoircls2 {
        background: url('@{imgPath}/smalltopreservoircls.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
            .reservoircxx3 {
        background: url('@{imgPath}/smallreservoircxx.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .reservoirczc3 {
        background: url('@{imgPath}/smallreservoirczc.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .reservoircsj3 {
        background: url('@{imgPath}/smallreservoircsj.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .reservoircls3 {
        background: url('@{imgPath}/smallreservoircls.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
