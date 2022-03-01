<template>
    <div>
        <div :class="isProgress? 'eventProgressBtnAcive': 'eventProgressBtn'" @click="eventProgressFn"></div>
        <div class="EventProgress">
            <PanelView title="进展情况" class="eventProgress" v-if="isProgress">
                <Progress></Progress>
            </PanelView>
            <!-- 进展详情  -->
            <ProgressDetails v-if="isProgressDetails"
                             :listDatas="listDatas"
                             @closeProgressDetailsFn="closeProgressDetailsFn">
            </ProgressDetails>
        </div>
    </div>
</template>
<script lang="ts">
  import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
  import PanelView from '@/views/theme/decisionSupport/common/PanelView.vue';
  import Progress from '@/views/theme/decisionSupport/module/unNormalLeft/progress.vue';
  import ProgressDetails from './ProgressDetails.vue';

  @Component({
    name: 'EventProgress',
    components: {
      PanelView,
      Progress,
      ProgressDetails,
    },
  })
  export default class EventInfoDetail extends Vue {
    private listDatas: any = ''; // 详情数据
    private isProgressDetails: boolean = false; // 是否显示详情
    private isProgress: boolean = false; // 是否显示列表

    // 点击显示/隐藏列表
    private eventProgressFn() {
      this.isProgress = !this.isProgress;
    }

    // 接收详情数据
    private init() {
      this.messsageBus.on('firstDatas', (data: any) => {
        if (this.isProgress) {
          this.listDatas = data;
          this.isProgressDetails = true;
        }
      });
      this.messsageBus.on('listDatas', (data: any) => {
        if (this.isProgress) {
          this.listDatas = data;
          this.isProgressDetails = true;
        }
      });
    }

    // 关闭详情
    private closeProgressDetailsFn() {
      this.isProgressDetails = false;
    }

    private created() {
      this.init();
    }
  }
</script>
<style scoped lang="less">
    @imgPath: "../../../../../../assets/img/gisModule/PopulationFeverBox";
    .eventProgressBtn {
        width: 64px;
        height: 66px;
        position: absolute;
        background: url("@{imgPath}/process.png") 50% 50% no-repeat;
        top: 114px;
        left: 132px;
        transform: translate(-184%, 66%);
        z-index: 5;
        cursor: pointer;

        &:hover {
            background-image: url('@{imgPath}/processhover.png')
        }
    }

    .eventProgressBtnAcive {
        width: 64px;
        height: 66px;
        position: absolute;
        background: url("@{imgPath}/processhover.png") 50% 50% no-repeat;
        top: 114px;
        left: 132px;
        transform: translate(-184%, 66%);
        z-index: 5;
        cursor: pointer;
    }

    .eventProgress {
        position: absolute;
        top: 114px;
        left: 100px;
        width: 440px;
        height: 580px;
        background: rgba(0, 0, 0, 0.45);
        border-radius: 3px;
        opacity: 1;
        z-index: 5;
    }
</style>
