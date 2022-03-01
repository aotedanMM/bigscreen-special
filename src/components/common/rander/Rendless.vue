<script lang="ts">
import { Component, Vue, Inject, Prop } from 'vue-property-decorator';
import {
  pictureServer,
  eventServer,
  dispatchTeamServer,
  leaderInstructionServer,
  suppliesAllocateServer,
  progressSituationServer,
  knownDisasterServer,
} from '@/api/installServer';
import { getDateFormat } from '@/util/tools';
import { EarthinfoParam } from '@/interface/feature/earthquake/Eventinfo.interface';
// 图片的非渲染组件

@Component
export default class Rendless extends Vue {
  // 接收的图片类型（pdf:演练模板 | internet：互联网情报)
  @Prop() public type!: string;
  private timedate: any;
  private data: any = [];
  private array: EarthinfoParam[] = [];

  private interVla: any;
  private async init(data?: any) {
    let res: any;
    switch (this.type) {
      case 'pdf': // 演练模板
        res = await pictureServer.getPDFData();
        return res.data.map((item: any) => {
          return item.src;
        });
      case 'internet': // 互联网情报
        res = await pictureServer.getInternetIntelligenceData();
        return res.data.map((item: any) => {
          return item.src;
        });
      case 'eventList': // 事件列表
        try {
          const startTime =
            data && data.timer && data.timer.length > 0
              ? this.$moment(data.timer[0]).format('YYYY-MM-DD HH:mm:ss')
              : this.$moment(
                  new Date().getTime() - 3600 * 1000 * 24 * 3,
                ).format('YYYY-MM-DD HH:mm:ss');
          const endTime =
            data && data.timer && data.timer.length > 0
              ? this.$moment(data.timer[1]).format('YYYY-MM-DD HH:mm:ss')
              : this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
          const keyWord = data ? data.inputvalue : '';
          const nowPage = data ? data.current : 1;
          const pageSize = data ? data.pageSize : 10;
          const param = {
            startTime,
            endTime,
            keyWord,
            nowPage,
            pageSize,
          };
          res = await eventServer.getEventListData(param);
          if (keyWord && res.data.list.length > 0) {
            this.array = res.data.list;
            res.data.list = this.array.filter(
              (item) => item.content.indexOf(keyWord) !== -1,
            );
          }

          return res.data;
        } catch {
          (console as any).log('eventList error');
        }
      case 'pointEvent': // 重点事件
        res = await eventServer.getPointEventData();
        return res.data;
      case 'knownDisaster': // 实时灾情
        res = await knownDisasterServer.getData();
        return res.data;
      case 'dispatchTeam': // 队伍调派
        res = await dispatchTeamServer.getLatentDangera();
        return res.data;
      case 'suppliesAllocate': // 物资调拨
        res = await suppliesAllocateServer.getData();
        return res.data;
      case 'leaderInstruction': // 领导批示
        res = await leaderInstructionServer.getData();
        return res.data;
      case 'progressSituation': // 进展情况
        res = await progressSituationServer.getDatas();
        return res;
      default:
        // 默认返回空数组
        return true;
    }
  }

  private async updateEventListData(data?: any) {
    this.data = await this.init(data);
  }

  private mounted() {
    if (this.type === 'eventList') {
      // this.interVla = setInterval(() => {
      //   this.updateEventListData(this.timedate);
      // }, 300000); // 五分钟一次更新地震速报列表
      this.messsageBus.on('getSearchDataList', (data: any) => {
        this.timedate = data;
        this.updateEventListData(data);
      });
    }
  }

  private beforeDestroy() {
    clearInterval(this.interVla);
    this.messsageBus.off('getSearchDataList');
  }
  private async created() {
    this.data = await this.init();

    this.$emit('success', this.data);
  }

  private render() {
    return (this.$scopedSlots.default as any)({
      data: this.data,
    });
  }
}
</script>
