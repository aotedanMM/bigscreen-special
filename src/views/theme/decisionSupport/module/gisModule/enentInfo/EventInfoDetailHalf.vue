<template>
    <div class="EventInfoDetailHalf">
        <!-- <div v-if="detailsBtn" class="dialong_bg_pao" @click="details"></div> -->
        <div class="YJ-EventAnnounce">
            <!-- <h1 class="shiguTitle">事件信息</h1> -->
            <div class="content">
                <p :title="EventTime">{{EventTime}}</p>
                <div class="eventDetails">
                    <el-scrollbar style="height:100%">
                        <span>{{strList.EventDesc}}</span>
                    </el-scrollbar>
                </div>
            </div>
            <!-- <div class="pao_Close" @click="details"></div> -->
        </div>
    </div>
</template>
<script lang="ts">
  import {Component, Vue, Prop, Watch} from 'vue-property-decorator';

  @Component({
    name: 'EventInfoDetailHalf',
  })
  export default class EventInfoDetailHalf extends Vue {
    private strList: any = {};
    private EventTime: any = '';
    private detailsBtn: boolean = false;

    @Watch('$store.state.eventPushStore.eventId')
    private eventChange(val: any) {
      this.strList = this.$store.state.eventPushStore.eventLocation;
      this.timeConversion();
    }

    private timeConversion() {
      if (this.strList.EventTime) {
        this.EventTime = this.strList.EventTime;
      } else if (this.strList.EventTimes) {
        const eventTimes = this.strList.EventTimes;
        const date = eventTimes.split(' ')[0].split('-');
        const time = eventTimes.split(' ')[1].split(':');
        this.EventTime = date[0] + '年' + date[1] + '月' + date[2] + '日' + time[0] + '时' + time[1] + '分';
      } else {
        const EventTime = '';
      }
    }

    private details() {
      this.detailsBtn = !this.detailsBtn;
    }

    private created() {
      this.strList = this.$store.state.eventPushStore.eventLocation;
      this.timeConversion();
    }
  }
</script>
<style lang="less" scope>
    @imgPath: "../../../../../../assets/img/gisModule/PopulationFeverBox";
    .EventInfoDetailHalf {
        width: 100%;
        height: 100%;

        .YJ-EventAnnounce {

            .content {
                font-size: 28px;
                font-weight: bold;
                font-stretch: normal;
                line-height: 30px;
                letter-spacing: 2px;

                p {
                    margin: 0 6px;
                    color: #ffffff;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .eventDetails {
                    color: yellow;
                    height: 155px;
                    margin-left: 6px;
                    padding-right: 6px;
                }
            }
        }
    }
</style>
