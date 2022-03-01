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
 * 水库测站  河道站 图例
 */
@Component({
  name: 'Riverway',
})
export default class Riverway extends Vue {
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
          width: 20px;
          height: 20px;
          margin-right: 6px;
        }
      }
      .riverwyj {
        background: url('@{imgPath}/riverwyj.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .rivercjj {
        background: url('@{imgPath}/rivercjj.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .rivercbz {
        background: url('@{imgPath}/rivercbz.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
      .rivercls {
        background: url('@{imgPath}/rivercls.png') no-repeat 0 0;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
