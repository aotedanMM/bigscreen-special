<template>
  <!--  -->
  <div class="rainfallContent">
    <!-- <span class="title">{{ componentParam.title }}</span> -->
    <ul>
      <li v-for="(item, index) in componentParam.content" :key="index">
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
 * 雨量站图例
 */
@Component({
  name: 'RainStation',
})
export default class RainStation extends Vue {
  @Prop() private componentParam: any;
}
</script>

<style lang="less" scoped>
@imgPath: '../../../../../../../../assets/img/gisModule/legendPlanel/legendIcon';
.rainfallContent {
  margin-top: 15px;
  //   padding-left: 60px;
  color: #fff;
  .title {
    display: inline-block;
    font-size: 20px;
    margin-bottom: 4px;
  }
  ul {
    li {
      margin-left: 20%;
      margin-bottom: 10px;
      span {
        display: inline-block;
        font-size: 20px;
        &:nth-child(1) {
          width: 20px;
          height: 20px;
          margin-right: 6px;
        }
      }
      .rainstation {
        background: url('@{imgPath}/rainstation.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .rain {
        background: url('@{imgPath}/rain.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .heavyRain {
        background: url('@{imgPath}/heavyRain.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .superRain {
        background: url('@{imgPath}/superRain.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
