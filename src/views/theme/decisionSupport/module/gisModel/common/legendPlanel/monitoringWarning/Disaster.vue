<template>
  <!--  -->
  <!-- 
    :class="[
      $store.state.configModel.lengendLayout.vertical.hasNum
        ? 'leftDistant'
        : '',
    ]" -->
  <div class="rainfallContent" v-show="isShow">
    <span class="title">灾损情况</span>
    <!-- <span class="close" @click="close()">
      <img
        class="img"
        src="@/assets/img/gisModule/legendPlanel/legendhide.png"
        alt
      />
    </span> -->

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
 * 灾情统计图例
 */
@Component({
  name: 'Disaster',
})
export default class Disaster extends Vue {
  // @Prop() private componentParam: any;
  // @Prop() private compParam: any;
  private isShow = false; // 这的数据是从灾情统计面板过来的，当那里发送请求数据没回来的时候，这个组件会有几个没有数据的框，所以这里加入个字段，控制显隐。其实，还可以在template v-for那里加入显示的判断，但是，需求没明确，先临时这么改。
  private DisasterShow = false;
  private componentParam: any = {
    title: '灾损情况',
    content: [
      {
        text: '',
        color: '#f43d42',
      },
      {
        text: '',
        color: '#f28a24',
      },
      {
        text: '',
        color: '#fef260',
      },
      {
        text: '',
        color: '#21c4f3',
      },
    ],
  };
  private created() {
    this.messsageBus.on('tuliDataA', (title: any) => {
      this.isShow = true;
      // const arr = title.reverse();
      title.map((v: any, index: any) => {
        this.componentParam.content.map((item: any, index1: any) => {
          if (index === index1) {
            item.text = v;
          }
        });
      });
    });
  }
  // private close() {
  //   this.messsageBus.emit('DisasterOpentuli', false);
  // }
}
</script>

<style lang="less" scoped>
// @imgPath: '../../../../../../../../assets/img/gisModule/legendPlanel';
.rainfallContent {
  // padding-top: 14px;
  // padding-left: 20px;
  color: #fff;
  // width: 170px;
  // height: 116px;
  // position: absolute;
  // right: 300px;
  // bottom: 8px;
  // z-index: 3;
  // background: url('@{imgPath}/legendbg.png') no-repeat 0 0;
  // background-size: 100% 100%;
  .title {
    display: inline-block;
    margin-bottom: 8px;
  }
  .close {
    position: absolute;
    top: -13px;
    right: -2px;
  }
  ul {
    li {
      span {
        display: inline-block;
        &:nth-child(1) {
          width: 20px;
          height: 10px;
          margin: 0px 10px;
        }
      }
    }
  }
}
// .leftDistant {
//   right: 100px;
// }
</style>
