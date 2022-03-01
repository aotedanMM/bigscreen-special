<template>
    <!-- <div id="videoMonitor"> -->
    <VideoRight class="videoMonitor"
                :title="title"
                :listData="listData"
                :itemClick="clickItemEvent"
    ></VideoRight>
    <!-- </div> -->
</template>
<script lang="ts">
  import {Component, Vue, Prop} from 'vue-property-decorator';
  import EventInfoPop from '@/components/feature/gisModule/popUp/eventInfo.vue';
  import VideoRight from '@/components/common/render/VideoRight.vue';
  import MapCommon from '@/util/MapCommon';
  import {hazardoubaseinfoServer} from '@/api/installServer';

  @Component({
    name: 'videoMonitor',
    mixins: [MapCommon],
    components: {
      VideoRight,
    },
  })
  export default class VideoMonitor extends Vue {
    public title: any = '视频监控';
    @Prop() private tempData: any;
    private eventInfo: any = {};
    private eventInfoPop: any = null;
    private listData: any = [];
    private isShowBtn: any = {};

    // 获取危化企业的视频监控列表

    private getvideolistdata() {
      if (this.tempData.code) {
        if (this.tempData.istype === 'coalMine' || this.tempData.istype === 'coal') {
          this.isShowBtn = {
            code: this.tempData.code,
            firmtype: 1,
          };
        } else {
          this.isShowBtn = {
            code: this.tempData.code,
            firmtype: null,
          };
        }


        hazardoubaseinfoServer.getHazardouvideolistServer(this.isShowBtn).then((res: any) => {
          if (res.code === 0 && res.data.length > 0) {
            const dataArr = res.data;
            this.FnListData(res.data);
          }
        }).catch((err: any) => {
          const dataArr: any = [];
          this.FnListData(dataArr);
        });
      } else {
        const dataArr: any = [];
        this.FnListData(dataArr);
      }

    }

    private FnListData(dataArr: any) {
      // const item: any = [{name : '测试数据1'}, {name : '测试数据2'}, {name : '测试数据3'},{name : '测试数据1'}, {name : '测试数据2'}, {name : '测试数据3'},{name : '测试数据1'}, {name : '测试数据2'}, {name : '测试数据3'}];
      const item: [] = dataArr;
      for (let index = 0; index < item.length; index++) {
        const element: any = item[index];
        const data = {
          num: index + 1,
          name: element[0],
          cameraindexcode: element[1],
        };
        this.listData.push(data);
      }
      this.$set(this, 'listData', this.listData);

    }

    private clickItemEvent(item: any) {
      console.log('列表点击事件');
    }

    private created() {
      this.getvideolistdata();
    }
  }
</script>
<style lang="less" scoped>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .videoMonitor {
        /deep/ .closed-container {
            width: 75px;
        }

    }
</style>
