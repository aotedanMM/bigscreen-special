<template>
    <div class="EventInfoDetail">
        <div v-if="detailsBtn" class="dialong_bg_pao" @click="details"></div>
        <div v-else class="YJ-EventAnnounce">
            <h1 class="shiguTitle">事件信息</h1>
            <div class="content">
                <p :title="EventTime">{{EventTime}}</p>
                <div class="eventDetails">
                    <el-scrollbar style="height:100%">
                        <span>{{strList.EventDesc}}</span>
                    </el-scrollbar>
                </div>
            </div>
            <div class="pao_Close" @click="details"></div>
        </div>
    </div>
</template>
<script lang="ts">
  import {Component, Vue, Prop, Watch} from 'vue-property-decorator';

  @Component({
    name: 'EventInfoDetail',
  })
  export default class EventInfoDetail extends Vue {
    private strList: any = {};
    private EventTime: any = '';
    private detailsBtn: boolean = true;

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
<style lang="less" space>
    @imgPath: "../../../../../../assets/img/gisModule/PopulationFeverBox";
    .EventInfoDetail {
        .dialong_bg_pao {
            width: 64px;
            height: 66px;
            position: absolute;
            background: url("@{imgPath}/pao_moren.png") 50% 50% no-repeat;
            top: 50px;
            left: 127px;
            transform: translate(-184%, 66%);
            z-index: 5;
            cursor: pointer;

            &:hover {
                background-image: url('@{imgPath}/pao_morenhover.png')
            }
        }

        .YJ-EventAnnounce {
            width: 616px;
            height: 352px;
            position: absolute;
            background: url("@{imgPath}/pao_bg.png") center top no-repeat;
            top: 124px;
            left: 0px;
            z-index: 9999;
            padding: 25px 0px 10px 0px;

            h1 {
                margin: 0;
                height: 55px;
                font-family: MicrosoftYaHei;
                font-size: 28px;
                font-weight: bold;
                font-stretch: normal;
                line-height: 55px;
                letter-spacing: 1px;
                color: #ffde00;
                padding-left: 70px;
            }

            .content {
                font-size: 32px;
                font-weight: bold;
                font-stretch: normal;
                line-height: 52px;
                letter-spacing: 2px;
                margin: 26px auto 0;

                p {
                    margin: 0 70px;
                    color: #ffffff;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .eventDetails {
                    color: yellow;
                    height: 155px;
                    margin-left: 70px;
                    padding-right: 50px;
                }
            }
        }

        .pao_Close {
            width: 60px;
            height: 50px;
            position: absolute;
            right: 44px;
            top: 25px;
            cursor: pointer;
        }

        .cmp-panel-cnt-hd {
            padding-left: 30px;
        }

        .cmp-panel-cnt-bd {
            padding-left: 2px !important;
        }

        .right_item {
            cursor: pointer !important;
        }
    }
</style>
