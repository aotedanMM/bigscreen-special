<template>
  <div>
    <div
      class="tab_video_Material"
      :class="{ video_on: flag, material_on: !flag }"
    >
      <p class="video_cont_btn" @click="video_cont_on"></p>
      <p class="Material_cont_btn" @click="Material_cont_on"></p>
    </div>
    <div class="video_cont_end" v-show="flag">
      <Panel title="视频监控">
        <video
          class="video_cont"
          :src="BaseVideo.jiankongUrl"
          autoplay
          controls
        ></video>
      </Panel>
    </div>
    <div class="video_Material_cont_end" v-show="!flag">
      <Panel title="救援物资">
        <div>
          <header><input type="text" placeholder="北京" /></header>
          <div class="Material_cont_list">
            <ul>
              <li>111111</li>
              <li>222222</li>
              <li>333333</li>
              <li>444444</li>
              <li>555555</li>
              <li>666666</li>
              <li>777777</li>
              <li>888888</li>
            </ul>
          </div>
        </div>
      </Panel>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Panel from '@/components/common/panel/Panel.common.vue';
@Component({
  components: {
    Panel,
  },
})
export default class VideoSurveillance extends Vue {
  @Prop(Object)
  private BaseVideo!: any;
  @Prop(Object)
  private flag = false;
  private video_cont_on() {
    this.flag = false;
  }
  private Material_cont_on() {
    this.flag = true;
  }
}
</script>

<style scoped lang="less">
.module-VideoMoniter {
  video {
    width: 88%;
    margin-left: 6%;
    height: 80%;
    margin-top: 5px;
  }
}
.video_on {
  background: url('../../../assets/img/videoSurveillance/video_live1.png')
    no-repeat;
  position: absolute;
  top: 25px;
  right: 0;
  width: 128px;
  height: 25px;
  display: flex;
  .video_cont_btn {
    width: 50%;
    height: 100%;
    cursor: pointer;
  }
  .Material_cont_btn {
    width: 50%;
    height: 100%;
    cursor: pointer;
  }
}
.material_on {
  position: absolute;
  right: 0;
  width: 128px;
  height: 25px;
  display: flex;
  background: url('../../../assets/img/videoSurveillance/chaxuan_rescue.png')
    no-repeat;
  .video_cont_btn {
    width: 50%;
    height: 100%;
    cursor: pointer;
  }
  .Material_cont_btn {
    width: 50%;
    height: 100%;
    cursor: pointer;
  }
}
</style>
