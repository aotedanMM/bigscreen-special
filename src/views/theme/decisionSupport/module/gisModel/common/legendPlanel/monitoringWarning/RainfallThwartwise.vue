<template>
  <!--  -->
  <!-- :class="[
      $store.state.configModel.lengendLayout.vertical.hasNum
        ? ''
        : 'leftDistant',
    ]" -->
  <div class="rainfallContent">
    <div class="colorBg"></div>
    <ul>
      <li v-for="(item, index) in componentParam.content" :key="index">
        <span>{{ item }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
/**
 * 雨情 横图例
 */
@Component({
  name: 'RainfallThwartwise',
})
export default class RainfallThwartwise extends Vue {
  @Prop() private componentParam: any;
}
</script>

<style lang="less" scoped>
@imgPath: '../../../../../../../../assets/img/gisModule/legendPlanel';
.rainfallContent {
  color: #fff;
  // width: 426px;
  // height: 56px;
  // width: 56px;
  height: 300px;
  // border: 1px solid #51dcd8;
  padding: 0px 10px;
  display: flex;
  margin-left: 42px;
  .title {
    display: inline-block;
    margin-bottom: 4px;
  }
  .colorBg {
    // height: 10px;
    // width: 100%;
    // border-radius: 5px;
    // background-image: linear-gradient(
    //   to right,
    //   #4ae3f4,
    //   #fcd128,
    //   #fb6c21,
    //   #fa1811
    // );
    height: 100%;
    width: 10px;
    border-radius: 5px;
    background-image: linear-gradient(
      to bottom,
      #4ae3f4,
      #fcd128,
      #fb6c21,
      #fa1811
    );
    margin-bottom: 4px;
    margin-top: 14px;
  }
  ul {
    // display: flex;
    padding-top: 15px;
    margin-left: 10px;
    li {
      margin-bottom: 23px;
      span {
        display: inline-block;
        width: 64px;
        margin-right: 6px;
      }
    }
  }
}
</style>
