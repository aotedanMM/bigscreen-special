<template>
  <div class="banner">
    <div class="left" @click="changePic(true)"></div>
    <el-carousel ref="carousel" arrow="never" indicator-position="none" :height="`${height}px`" :autoplay="false">
      <el-carousel-item v-for="(item, key) in pictures" :key="key">
        <img :src="item" />
      </el-carousel-item>
    </el-carousel>
    <div class="right" @click="changePic(false)"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
@Component({
  name: 'Banner',
})
export default class Banner extends Vue {
  // 高度
  @Prop({ default: 0 }) public height?: number;

  // 图{片集
  @Prop() public pictures?: string[];

  private changePic(bool: boolean) {
    if (bool) {
      (this.$refs.carousel as any).prev();
    } else {
      (this.$refs.carousel as any).next();
    }
  }
}
</script>

<style lang="less" scoped>
@imgUrl: '../../../../assets/img/banner/';
.banner {
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .left {
    background: url('@{imgUrl}left.png') no-repeat center / 100% 100%;
    left: 2em;
  }
  .right {
    background: url('@{imgUrl}right.png') no-repeat center / 100% 100%;
    right: 2em;
  }
  .right,
  .left {
    height: 44px;
    width: 27px;
    position: absolute;
    top: calc(50% - 22px);
    z-index: 3;
    cursor: pointer;
  }
}
</style>