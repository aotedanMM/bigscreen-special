<template>
  <div style="height:100%;" id="powerWuziBox">
    <div :class="{ LiveMonitorModule1_on: flag, NewRescueForce_off: !flag }">
      <p class="NewRescueForce_button" @click.stop="changeStatus"></p>
      <p class="LiveMonitor-videoList1_button" @click="videoPlay"></p>
    </div>
    <!-- 显示视频 -->
    <div v-if="flag" style="height: 100%;">
      <Panel
        v-for="(vide, index) of this.allData.panelVideo"
        :key="index"
        :title="vide.title"
        :selectData="vide.selectData"
        class="module-item-bg module-item-bg-h"
      >
        <video
          :src="vide.url"
          width="100%"
          height="100%"
          style="object-fit: fill"
          controls="controls"
        ></video>
        <!-- <base-video :url="vide.url"></base-video> -->
      </Panel>
      <!--<Panel title="无人机" class="module-item-bg module-item-bg-h">-->
      <!--<base-video :url="BaseVideo.wurenji"></base-video>-->
      <!--</Panel>-->
    </div>
    <!-- 显示物资搜索框 -->
    <div v-else style="height: 100%;">
      <Panel :title="allData.panelList.title" class="module-item-bg">
        <query-list
          :optionsData="allData.panelList.selectOption"
          :listData="allData.panelList.listData"
          @changeSelectEvent="changeSelectEvent"
          :districtCode="districtCode"
          v-loading="loading"
        ></query-list>
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
import { Alert } from 'element-ui';
import { rescueTeamServer, rescueSuppliesServer } from '@/api/installServer.ts';
import { videoServerPath } from '@/api/installServer';
@Component({
  name: 'HelpPowerAndUAV',
  components: {
    BaseVideo,
    Panel,
    VideoBackHoul,
    QueryList,
  },
})
export default class HelpPowerAndUAV extends Vue {
  @Prop(Object) private allData!: any;
  private BaseVideo: any = {
    url: './vedio/a.mp4',
    jiankongUrl: './vedio/b.mp4',
    wurenji: './vedio/c.mp4',
  };
  // private optionsData: any = [
  //   {
  //     lable: '北京11',
  //     value: 10,
  //   },
  //   {
  //     lable: '天津',
  //     value: 10,
  //   },
  //   {
  //     lable: '天津',
  //     value: 10,
  //   },
  // ];
  // @Watch('allData')
  private flag: boolean = true;
  private listData: any;
  private loading: any = true;
  private districtCode: any = '';
  private changeStatus() {
    this.flag = !this.flag;
    this.initResourceData();
  }
  private videoPlay() {
    this.changeStatus();
  }
  private created() {
    this.initResourceData();
  }

  // 改变video路径，子组件调用
  private handleVideo( videoData: any ) {
    if (videoData.code.select === 0 ) {
      this.allData.panelVideo[0].url = `${videoServerPath}/${videoData.code.key}`;
    } else if (videoData.code.select === 1 ) {
      this.allData.panelVideo[1].url = `${videoServerPath}/${videoData.code.key}`;
    }
  }
  // 初始化数据
  private initResourceData() {
    const opt = {
      districtCode: this.districtCode ? this.districtCode : '110000',
    };
    rescueTeamServer.getRescueTeamStatistics(opt).then((data: any) => {
      this.listData = data.list;
      this.listData.forEach((item: any) => {
        item.content = item.tabTitle;
        item.time = item.tabNumber;
      });
      this.allData.panelList.listData = this.listData;
      this.loading = false;
    });
  }
  // 省市选择改变时
  private changeSelectEvent(data: any) {
    // alert('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
    this.districtCode = data;
    this.initResourceData();
  }
}
</script>

<style lang="less" scoped>
@decisionSupportUrl: '../../../assets/img/decisionSupport';
@videoBackhaulImgUrl: '../../../assets/img/videoBackhaul';

#powerWuziBox {
  position: relative;
}

.module-item-bg-h {
  height: 50%;
  box-sizing: border-box;
  padding-left: 50px;
  padding-right: 12px;
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
