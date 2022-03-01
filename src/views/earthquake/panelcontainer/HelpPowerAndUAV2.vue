<template>
  <div style="height:100%;" id="powerWuziBox">
    <div :class="{ LiveMonitorModule1_on: flag, NewRescueForce_off: !flag }">
      <p class="NewRescueForce_button" @click="changeStatus"></p>
      <p class="LiveMonitor-videoList1_button" @click="videoPlay"></p>
    </div>
    <div v-if="flag" style="height: 100%;">
      <Panel
        v-for="(vide, index) of this.allData.panelVideo"
        :key="index"
        :title="vide.title"
        :selectData="vide.selectData"
        class="module-item-bg module-item-bg-h"
      >
        <base-video :url="vide.url" v-if="vide.type==4 && isShowVideo"></base-video>
        <video v-else
          :src="vide.url"
          width="100%"
          height="100%"
          style="object-fit: fill"
          controls="controls"
        ></video>
      </Panel>
      <!--<Panel title="无人机" class="module-item-bg module-item-bg-h">-->
      <!--<base-video :url="BaseVideo.wurenji"></base-video>-->
      <!--</Panel>-->
    </div>
    <div v-else style="height: 100%;">
      <Panel :title="allData.panelList.title" class="module-item-bg">
        <!-- <query-list
          :optionsData="allData.panelList.selectOption"
          :listData="allData.panelList.listData"
        ></query-list>-->
        <ReliefGoods />
      </Panel>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import BaseVideo from '@/components/feature/vedio/Vedio.common.vue';
import VideoBackHoul from '@/components/feature/videoBackhoul/VideoBackHoul.feature.vue';
import Panel from '@/components/common/panel/Panel.common.vue';
import QueryList from '@/components/feature/videoBackhoul/QueryList.vue';
import ReliefGoods from '@/views/theme/decisionSupport/module/unNormalRight/ReliefGoods.vue';
import { videoServerPath } from '@/api/installServer';
@Component({
  name: 'HelpPowerAndUAV',
  components: {
    BaseVideo,
    Panel,
    VideoBackHoul,
    QueryList,
    ReliefGoods,
  },
})
export default class HelpPowerAndUAV extends Vue {
  @Prop(Object) private allData!: any;
  private isShowVideo: boolean = true;
  private BaseVideo: any = {
    url: './vedio/a.mp4',
    jiankongUrl: './vedio/b.mp4',
    wurenji: './vedio/c.mp4',
  };
  private optionsData: any = [
    {
      lable: '北京11',
      value: 10,
    },
    {
      lable: '天津',
      value: 10,
    },
    {
      lable: '天津',
      value: 10,
    },
  ];

  private flag: boolean = true;

  private changeStatus() {
    this.flag = !this.flag;
  }
  private videoPlay() {
    this.changeStatus();
  }
  // 改变video路径，子组件调用
  private handleVideo( videoData: any ) {
    this.isShowVideo = false;
    if (videoData.code.select === 3 ) {
      this.allData.panelVideo[0].url = `${videoServerPath}/${videoData.code.key}`;
    } else if (videoData.code.select === 4 ) {
      this.allData.panelVideo[1].url = videoData.code.key;
      if (this.allData.panelVideo[1].type === 4 ) {
        // this.allData.panelVideo[1].type = 4;
      } else {
         this.allData.panelVideo[1].type = 4;
      }

      if ( videoData.name === '新闻报道' ) {
         this.allData.panelVideo[1].type = 2;
         this.allData.panelVideo[1].url = `${videoServerPath}/${videoData.code.key}`;
      }
    }
    this.$nextTick((): void => {
      this.isShowVideo = true;
    });
  }
}
</script>
<style scoped lang="less">
@decisionSupportUrl: '../../../assets/img/decisionSupport';
@videoBackhaulImgUrl: '../../../assets/img/videoBackhaul';
#powerWuziBox {
  position: relative;
}
.module-item-bg-h {
  height: 50%;
}

.module-item-bg {
  padding-left: 50px;
  padding-right: 12px;
  box-sizing: border-box;
  // background: url('@{decisionSupportUrl}/panel/panelbg.png') -39px -15px  no-repeat;
}

.LiveMonitorModule1_on {
  width: 128px;
  height: 26px;
  background: url('@{videoBackhaulImgUrl}/video_live1.png') no-repeat;
  background-size: 100%;
  position: absolute;
  top: 23px;
  right: 21px;
  z-index: 1;
  cursor: pointer;
  .LiveMonitor-videoList1_button {
    top: 0px;
    position: absolute;
    left: 0px;
    width: 50%;
    height: 100%;
    margin: 0;
  }
  .NewRescueForce_button {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 50%;
    height: 100%;
    margin: 0;
  }
}

.NewRescueForce_off {
  width: 128px;
  height: 26px;
  background: url('@{videoBackhaulImgUrl}/chaxuan_rescue.png') no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 23px;
  right: 21px;
  z-index: 1;
    cursor: pointer;
  .NewRescueForce_button {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 50%;
    height: 100%;
    margin: 0;
  }
  .LiveMonitor-videoList1_button {
    top: 0px;
    position: absolute;
    left: 0px;
    width: 50%;
    height: 100%;
  }
}
</style>
