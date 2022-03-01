<template>
  <!--  -->
  <!-- :class="[
      $store.state.configModel.lengendLayout.vertical.hasNum == 0
        ? ''
        : 'leftDistant_wind',
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
 * 风力 横图例
 */
@Component({
  name: 'WindThwartwise',
})
export default class WindThwartwise extends Vue {
  @Prop() private componentParam: any;
}
</script>

<style lang="less" scoped>
@imgPath: '../../../../../../../../assets/img/gisModule/legendPlanel';
.rainfallContent {
  color: #fff;
  // position: absolute;
  // bottom: 10px;
  // left: -500px;
  // width: 573px;
  // height: 56px;
  height: 350px;
  display: flex;
  margin-left: 30px;
  .title {
    display: inline-block;
    margin-bottom: 4px;
  }
  .colorBg {
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
      margin-bottom: 6px;
      span {
        display: inline-block;
        width: 48px;
        margin-right: 6px;
      }
    }
  }
}
</style>
