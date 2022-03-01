<template>
  <div class="RightPlane_content_main_right">
    <ol>
      <li>
        <span
          v-for="(item, index) in title"
          :key="index + 'title'"
          :style="LiWidth"
          >{{ item }}</span
        >
      </li>
    </ol>
    <div>
      <ul>
        <li v-for="(item, index) in data" :key="index">
          <span
            v-for="(val, index) in item"
            :key="index + 'data'"
            class="RightPlane_content_main_right_ul"
            :style="LiWidth"
            >{{ val }}</span
          >
        </li>
      </ul>
    </div>
    <ul class="RightPlane_content_main_tab_bottom" v-if="flag">
      <div class="RightPlane_content_main_noData">暂无数据</div>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

@Component({
  name: 'CommandDispatchRightBox',
  components: {},
})
export default class CommandDispatchRightBox extends Vue {
  @Prop() private data: any;
  @Prop() private title: any;
  private LiWidth: any = {
    width: '33%',
  };
  private flag: any = true;
  @Watch('data')
  private FnNoData(): void {
    this.flag = false;
    this.LiWidth = {};
    const width = 100 / Object.keys(this.data[0]).length + '%';
    this.$set(this.LiWidth, 'width', width);
    console.log('当前计算出来的宽度:', Object.keys(this.data[0]).length);
    console.log('当前对象LiWidth:', this.LiWidth);
  }
}
</script>

<style lang="less" scoped>
@path: '../../../../../../../assets/img/CommandDispatch'; // 定义路径
// src\assets\img\CommandDispatch\bg.png
#RightPlane {
  background: url('@{path}/list_bg.png') no-repeat;
  background-size: 100% 100%;
  right: 15px;
  top: 0px;
  width: 1050px;
  height: 980px;
  z-index: 3;
  position: absolute;
}
.RightPlane_content {
  width: 985px;
  height: 900px;
  margin-top: 30px;
  margin-left: 40px;
  position: relative;
}
.RightPlane_content_title {
  display: flex;
  justify-content: flex-start;
  padding-right: 30px;
}
.RightPlane_content_title_content {
  font-size: 30px;
  color: #fda100;
  font-weight: bold;
}
.RightPlane_content_title_subtitle {
  font-size: 24px;
  color: #afd5d7;
  padding-left: 10px;
  font-weight: normal;
}
.RightPlane_content_main {
  clear: both;
  display: flex;
  justify-content: space-between;
  height: 50%;
  padding-top: 20px;
}
.RightPlane_content_main_left {
  width: 182px;
  height: 100%;
}
.RightPlane_content_main_left_bottonBox {
  width: 182px;
  position: relative;
  color: #fff;
  font-size: 26px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 2px;
}
.RightPlane_content_main_left_bottonBox_botton {
  background: url('@{path}/button_01.png') no-repeat;
  background-size: 100% 100%;
  width: 182px;
  height: 60px;
  text-align: center;
  line-height: 52px;
}
.RightPlane_content_main_right {
  width: calc(100% - 210px);
  height: 92%;
  border: 1px solid transparent;
  border-color: rgba(0, 246, 255, 0.26);
}
.RightPlane_content_main_right span {
  color: #fff;
  font-size: 26px;
  display: inline-block;
  line-height: 54px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 54px;
  background-color: #1f3179;
}
.RightPlane_content_main_right ol {
  height: 54px;
  width: 100%;
  list-style: none;
  padding-left: 0;
}
.RightPlane_content_main_right_tab_card_num_01 {
  width: 30%;
}
.RightPlane_content_main_right_tab_holder_01 {
  width: 33%;
}
.RightPlane_content_main_right_tab_disyance_form_01 {
  width: 35%;
}
.RightPlane_content_main_tab_bottom {
  width: 100%;
  overflow-y: auto;
  height: calc(100% - 54px);
  list-style: none;
  padding-left: 0;
}
.RightPlane_content_main_noData {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
.RightPlane_content_line {
  height: 5%;
  width: 100%;
  background: url('@{path}/llight_bg.png') no-repeat;
  background-size: 100% 100%;
}
.RightPlane_content_title_subtitle i {
  font-size: 26px;
  color: #fda100;
  font-weight: bold;
  font-style: normal;
  font-family: 'Impact';
}
.RightPlane_content_mainBottom {
  width: 100%;
  height: calc(50% - 170px);
}
.RightPlane_content_mainBottom_title {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  color: #fff;
}
.RightPlane_content_mainBottom_title_latest_news_title {
  width: 30%;
  height: 50px;
  line-height: 50px;
  font-size: 28px;
  text-indent: 1.5rem;
  color: #fff;
}
.RightPlane_content_mainBottom_title_latest_news_switch span {
  display: inline-block;
  text-align: center;
  font-size: 30px;
  color: #b6cfd5;
  line-height: 30px;
  font-weight: 600;
}
.leftIcon_bg {
  width: 60px;
  height: 30px;
  background: url('@{path}/leftIcon.png') no-repeat;
  background-size: 100% 100%;
  pointer-events: none;
}
.RightPlane_content_mainBottom_title_latest_news_switch-num {
  margin: 0 14px;
}
.rightIcon_bg {
  width: 60px;
  height: 30px;
  background: url('@{path}/rightIcon.png') no-repeat;
  background-size: 100% 100%;
  pointer-events: none;
}
.RightPlane_content_box {
  width: 100%;
  height: calc(100% - 50px);
  background: url('@{path}/bg.png') center center;
  background-size: 100% 100%;
  padding: 20px 3px;
}
.RightPlane_content_box_latest_news_connent-box {
  width: 100%;
  height: 100%;
}
.RightPlane_content_box_latest_news_connent-box_ul {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  list-style: none;
}
.RightPlane_content_main_right_ul {
  color: #fff;
  font-size: 10px;
  text-align: center;
}
</style>
