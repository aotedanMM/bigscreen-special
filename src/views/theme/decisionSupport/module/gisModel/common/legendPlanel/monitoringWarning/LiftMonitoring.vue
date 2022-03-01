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
 * 工情监测图例
 */
@Component({
  name: 'LiftMonitoring',
})
export default class LiftMonitoring extends Vue {
  @Prop() private componentParam: any;
}
</script>

<style lang="less" scoped>
@imgPath: '../../../../../../../../assets/img/gisModule/legendPlanel/legendIcon/';
.rainfallContent {
  margin-top: 15px;
  //   padding-left: 60px;
  color: #fff;
  .title {
    display: inline-block;
    margin-bottom: 4px;
    font-size: 20px;
  }
  ul {
    li {
      margin-left: 20%;
      margin-bottom: 10px;
      span {
        display: inline-block;
        font-size: 20px;
        &:nth-child(1) {
          width: 24px;
          height: 23px;
          margin-right: 6px;
          margin-bottom: -3px;
        }
      }
      // .riverNetwork {
      //   background: url('@{imgPath}/riverNetwork.png') no-repeat 0 0;
      //   background-size: 100% 100%;
      // }
      .bundpitch {
        background: url('@{imgPath}/bundpitch.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .dianpaizhan {
        background: url('@{imgPath}/dianpaizhan.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .chuanzha {
        background: url('@{imgPath}/chuanzha.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .shuidianzhan {
        background: url('@{imgPath}/shuidianzhan.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .shuizha {
        background: url('@{imgPath}/shuizha.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
