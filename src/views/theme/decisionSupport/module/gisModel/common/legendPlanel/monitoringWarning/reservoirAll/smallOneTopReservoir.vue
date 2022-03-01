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
 * 水库测站  头顶库 图例
 */
@Component({
  name: 'SmallOneTopReservoir',
})
export default class SmallOneTopReservoir extends Vue {
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
      .reservoirwyj {
        background: url('@{imgPath}/smalltopreservoirwyj.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .reservoircxx {
        background: url('@{imgPath}/smalltopreservoircxx.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .reservoirczc {
        background: url('@{imgPath}/smalltopreservoirczc.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .reservoircsj {
        background: url('@{imgPath}/smalltopreservoircsj.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .reservoircls {
        background: url('@{imgPath}/smalltopreservoircls.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
