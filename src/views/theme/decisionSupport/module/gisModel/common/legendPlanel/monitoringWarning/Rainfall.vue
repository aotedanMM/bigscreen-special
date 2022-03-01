<template>
  <!--  -->
  <div class="rainfallContent">
    <!-- <span class="title">{{ componentParam.title }}</span> -->
    <ul>
      <li v-for="(item, index) in componentParam.content" :key="index">
        <span :style="{ background: item.color }"></span>
        <span>{{ item.text }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
/**
 * 降雨量图例
 */
@Component({
  name: 'Rainfall',
})
export default class Rainfall extends Vue {
  @Prop() private componentParam: any;
}
</script>

<style lang="less" scoped>
.rainfallContent {
  color: #fff;
  .title {
    display: inline-block;
    margin-bottom: 8px;
  }
  ul {
    li {
      span {
        display: inline-block;
        &:nth-child(1) {
          width: 40px;
          height: 16px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
