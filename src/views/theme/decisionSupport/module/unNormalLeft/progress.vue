<template>
  <div style="height:100%;">
   <p class="title">
      {{ showTitle }}
    <ZoomBtn></ZoomBtn>
   </p>
    <ProgressSituation v-if="data.length" :listDatas="data" :firstDatas="firstDatas" />
    <LoadingElement v-else :status="status" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator';
import ProgressSituation from '@/components/feature/earthquake/progressSituation/ProgressSituation.feature.vue';
import LoadingElement from '@/components/feature/common/Loading/Loading.vue';
import { pushDataRequestServe } from '@/api/installServer';
import ZoomBtn from '../../../../../components/feature/flood/ZoomBtn.vue';  // 导入最小化组件

// 图片的非渲染组件

@Component({
  components: {
    ProgressSituation,
    LoadingElement,
    ZoomBtn, // 缩放按钮
  },
})
export default class Progress extends Vue {
  private data: any = [];
  private firstDatas: any = [];
  private status = 'loading';
  private dataList: any = [];
  private showTitle: any = '进展情况';
  private async init() {
    this.getData();
  }

  @Watch('$store.state.eventPushStore.SEND_commanddata')
  private eventChange(val: any) {
    if (val > 0) {
      this.getData();
    } else if (val < 0) {
      this.firstDatas = [];
      this.data = [];
    }
  }
@Watch('$store.state.eventPushStore.fontScl')
  private eventChangeTwo(val: any) {
    if (val > 0) {
      this.getList();
    } else if (val < 0) {
      this.firstDatas = [];
      this.data = [];
    }
  }
  private async getData() {
    const eventId = this.$store.state.eventPushStore.eventId; // 事件id
    const processId = 'SEND_commanddata'; // 进程id
    pushDataRequestServe
      .getPushDataByIds(eventId, processId)
      .then((res: any) => {
        if (res.data && res.data.content) {
          const jsonData = JSON.parse(res.data.content)[0].data;
          this.firstDatas = JSON.parse(jsonData).event;
          if (this.firstDatas.progressTime.length > 13) {
            this.firstDatas.progressTime = this.firstDatas.progressTime.slice(5);
          }
          this.data.unshift(this.firstDatas);
          if (JSON.stringify(this.data).indexOf(JSON.stringify(this.firstDatas)) === -1) {
            this.data.unshift(this.firstDatas);
          }
          this.status = '';
        } else {
          this.status = 'nodata';
        }
      })
      .catch(() => {
        this.status = 'nodata';
      });
  }
  // 获取全部数据
  private getList() {
    const params: any = {};
    params.eventId = this.$store.state.eventPushStore.eventId; // 事件id
    params.status = '1';
    params.typeCode = ''; // 如果根据类型查询可传值
    const self = this;
    pushDataRequestServe
            .getAllData(params)
            .then((res: any) => {
              if (res.data) {
                self.data = res.data;
                self.firstDatas = res.data[0];
                self.status = '';
              } else {
                self.status = 'nodata';
              }
            })
            .catch(() => {
              self.status = 'nodata';
            });
  }
  private created() {
  this.getList();
    // if (this.$store.state.eventPushStore.SEND_commanddata > -1) {
    //   // this.init();
    //   this.getList();
    // } else {
    //   this.status = 'nodata';
    // }
  }
}
</script>
<style lang="less" scoped>
  .title {
    font-weight: 600;
    font-family: 'myHeiti';
    font-size: calc(20px * 1.5);
    color: 00e4ff;
    background-image: -webkit-linear-gradient(top, #f5f7c3 10%, #00e4ff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -1px;
    padding-left: 20px;
    font-style: italic;
    margin-bottom:10px;
  }
</style>
