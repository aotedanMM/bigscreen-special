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
 * 风力 图例
 */
@Component({
  name: 'Wind',
})
export default class Wind extends Vue {
  @Prop() private componentParam: any;
}
</script>

<style lang="less" scoped>
@imgPath: '../../../../../../../../assets/img/gisModule/legendPlanel';
.rainfallContent {
  color: #fff;
  .title {
    display: inline-block;
    margin-bottom: 4px;
  }
  ul {
    li {
      span {
        display: inline-block;
        &:nth-child(1) {
          width: 24px;
          height: 16px;
          margin-right: 6px;
        }
      }
      .rainfall {
        width: 20px;
        height: 15px;
        background: url('@{imgPath}/rainfall.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .riverSystem {
        width: 20px;
        height: 15px;
        background: url('@{imgPath}/riverSystem.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
