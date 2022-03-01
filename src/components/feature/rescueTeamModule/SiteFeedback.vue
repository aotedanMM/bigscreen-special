<!--现场回传-->
<template>
<div class="rescueTeamsHome halflist ">
    <span class="halflist-back" @click="backParent"></span>
    <div class="rescueTeamsHome_hd title-panel">
        <!-- <div class="loading" v-if="loading"> -->
        <p>现场回传</p>
    </div>
    <el-scrollbar v-if="feedbackData || demandData">
        <div class="detachment_name" ref="detachment_name">{{rescueTeamHomeData.parameter.orgName || '- -'}}</div>
        <div class="rescueTeamsHome_cnt">
            <div class="rescueTeamItem" ref="feedbackBoxTop">
                <div class="tempRight-title  f-tit-h2">
                    <span>任务反馈</span>
                    <i :class="feedbackShow? 'tempRight-switch':'tempRight-switch tempRight-switch-reverse'" @click.stop="feedbackBoxShow()"></i>
                </div>
                <template v-if="feedbackShow">
                    <div class="tempRight-cont feedbackBox">
                        <el-scrollbar :wrap-style="'max-height: 330px;'">
                            <div v-for="(item, index) in feedbackData" :key="index">
                                <p>反馈：<span :title="item.backinfo">{{item.backinfo ? item.backinfo : '- -'}}</span></p>
                                <p>任务：<span :title="item.tasktitle">{{item.tasktitle ? item.tasktitle : '- -'}}</span></p>
                                <p :class="['icon', item.icon]" @click.stop="openAttachment(item)">
                                    <i v-if="item.attachmentList.length">{{item.attachmentList.length}}</i>
                                </p>
                            </div>
                        </el-scrollbar>
                    </div>
                </template>
            </div>
            <div class="rescueTeamItem">
                <div class="tempRight-title  f-tit-h2">
                    <span>需求提报</span>
                    <i :class="demandShow? 'tempRight-switch':'tempRight-switch tempRight-switch-reverse'" @click.stop="demandShow = !demandShow"></i>
                </div>
                <template v-if="demandShow">
                    <div class="tempRight-cont demandBox" :style="{height: listHeight + 'px'}">
                        <el-scrollbar style="height: 100%">
                            <div v-for="(item, index) in demandData" :key="index">
                                <span>{{index + 1}}</span>
                                <p>{{item.information ? item.information : '- -'}}</p>
                                <p>{{item.createtime ? item.createtime : '- -'}}</p>
                                <p class="type" :class="{'rescue' : item.demandflag === '1'}">{{item.demandflag === '1' ? '救援需求' : '物资需求'}}</p>
                            </div>
                        </el-scrollbar>
                    </div>
                </template>
            </div>
        </div>
        
    </el-scrollbar>
    <div v-else class="loading"></div>
    <RescueTeamsAttachment :rescueTeamHomeData="parameter" v-if="showAttachment" @close="showAttachment = false"></RescueTeamsAttachment>
</div>
</template>

<script lang="ts">
// import {
//     messsageBus,
// } from '@/util/message';
import {
    Component,
    Vue,
    Prop,
    Watch,
} from 'vue-property-decorator';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import RescueTeamsAttachment from './RescueTeamsAttachment.vue';
@Component({
    name: 'SiteFeedback',
    components: {
        RescueTeamsAttachment,
    },
})
export default class SiteFeedback extends Vue {
    @Prop() private parentHandleClickNumFn?: any; // 父组件处理点击数字的方法
    @Prop() private rescueTeamHomeData?: any; // 父组件传的数据
    @Prop() private popupFlag?: boolean; // 是否是从小分队弹窗过来
    private feedbackShow: boolean = true;
    private demandShow: boolean = true;
    private feedbackData: any = [];
    private demandData: any = [];
    private icons: any = ['photo', 'audio', 'video'];
    private showAttachment: boolean = false;  //  控制附件弹窗的显示隐藏
    private parameter: any = [];  // 附件弹窗的数据
    private listHeight: number = 280;

    private mounted() {
        console.log(this.popupFlag, 'popupFlag');
        if (!!this.rescueTeamHomeData.SiteFeedbackData) {
            this.feedbackData = this.rescueTeamHomeData.SiteFeedbackData.feedbackData;
            this.demandData = this.rescueTeamHomeData.SiteFeedbackData.demandData;
        } else {
            this.getDispatchtaskback();
        }
    }
    private async getDispatchtaskback() {
        const obj = {
                eventId: this.rescueTeamHomeData.eventId,
                taskId: this.rescueTeamHomeData.parameter.dispatchTaskid,
            };
        const res: any = await installDisasterJudgeServer.rescueTeamServer.getDispatchtaskback(obj);

        this.feedbackData = JSON.parse(JSON.stringify(res));
        console.log(this.feedbackData, 'this.feedbackData');
        if (this.feedbackData) {
            this.feedbackData.forEach((item: any, index: number) => {
                item.attachmentList.forEach((v: any) => {
                    v.url = v.urlOuterNet;
                    if (v.urlOuterNet) {
                        const str = v.urlOuterNet.substr(v.urlOuterNet.length - 3);
                        switch (str) {
                            case 'jpg':
                            case 'png':
                                v.type = 'photo';
                                break;
                            case 'm4a':
                                v.type = 'audio';
                                break;
                            case 'mp4':
                                v.type = 'video';
                                break;
                            default:
                                v.type = 'photo';
                                break;
                        }
                        if (v.type === 'audio') {
                            v.thumb = require('../../../assets/img/powerdispatch/audio-img.png');
                        } else {
                            v.thumb = v.urlOuterNet;
                            console.log(v.thumb, 'v.thumb');
                        }
                        if (v.type === 'video') {
                            item.icon = 'video';
                        } else if (item.icon !== 'video' && v.type === 'audio') {
                            item.icon = 'audio';
                        } else if (item.icon !== 'video' && item.icon !== 'audio' && v.type === 'photo') {
                            item.icon = 'photo';
                        }
                    } else { // 没有url 的情况
                        item.icon = 'photo';
                    }
                    this.$nextTick(() => {
                        this.listHeight = 740 - (this.$refs.feedbackBoxTop as HTMLElement).offsetHeight - (this.$refs.detachment_name as HTMLElement).offsetHeight;
                    });
                });
            });
        }
        this.getQueryPresentationList();
    }
    private async getQueryPresentationList() {
        const obj = {
                taskbackId: this.feedbackData[0].taskbackid,
            };
        const res: any = await installDisasterJudgeServer.rescueTeamServer.getQueryPresentationList(obj);
        this.demandData = res.data.list;
    }
    // 打开关闭任务反馈列表
    private feedbackBoxShow() {
        this.feedbackShow = !this.feedbackShow;
        // 下方需求提报列表打开时，关闭下方需求提报列表，计算高度后再重新打开
        this.demandShow = !this.demandShow;
        this.$nextTick(() => {
            this.listHeight = 740 - (this.$refs.feedbackBoxTop as HTMLElement).offsetHeight - (this.$refs.detachment_name as HTMLElement).offsetHeight;
            this.demandShow = !this.demandShow;
        });
    }
    // 打开附件弹窗
    private openAttachment(item: any) {
        if (!item.attachmentList.length) { // 没有附件就不打开附件弹窗
            return;
        }
        this.parameter = item.attachmentList;
        // console.log(item.attachmentList, 'parameter')
        this.showAttachment = true;
        // this.$forceUpdate(); // 强制刷新页面效果
    }
    private backParent() {
        if (this.popupFlag) {
            if (this.parentHandleClickNumFn) {  // 返回从小分队弹窗
                this.parentHandleClickNumFn(JSON.parse(JSON.stringify(this.rescueTeamHomeData)), 'RescueTeamsDispatchedDetail');
            }
        } else {
            if (this.parentHandleClickNumFn) { // 返回已出动队伍情况页面
                this.parentHandleClickNumFn(JSON.parse(JSON.stringify(this.rescueTeamHomeData)), 'RescueTeamsDispatched');
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import '../../../assets/css/decisionSupport/teamIcon.less';
@import '../../../assets/css/decisionSupport/Statistic.half.less';
@import '../../../assets/css/decisionSupport/DiscussTab.less';
@import '../../../assets/css/decisionSupport/halfScreen.statistic.less';
@url: '../../../assets/img/RescueTeams/siteFeedback';
.halflist {
    height: 100%;
    padding: 0;
    background: none;
    overflow: visible;
}
.rescueTeamsHome {
    >.el-scrollbar {
        height: 840px;
        color: #e8f4fe;
        .detachment_name {
            font-size: 28px;
            line-height: 36px;
            padding: 20px 15px 15px;
            text-indent: 0;
            background: url('@{url}/detachment_name_bg.png') no-repeat 100% bottom;
        }
        .rescueTeamsHome_cnt {
            padding: 0;
            .tempRight-title {
                padding: 0 15px;
                .tempRight-switch {
                    right: 15px;
                }
            }
            .feedbackBox {
                margin-top: 15px;
                .el-scrollbar {
                    div {
                        position: relative;
                        height: 103px;
                        background: rgba(43, 190, 251, 0.1);
                        margin-bottom: 10px;
                        padding: 15px;
                        box-sizing: border-box;
                        p {
                            font-size: 26px;
                            line-height: 35px;
                            color: #92edf6;
                            span {
                                display: inline-block;
                                width: 215px;
                                color: #e8f4fe;
                                vertical-align: top;
                                overflow: hidden; //超出的文本隐藏
                                text-overflow: ellipsis; //溢出用省略号显示
                                white-space: nowrap; //溢出不换行
                            }
                        }
                        .icon {
                            position: absolute;
                            right: 5px;
                            top: 0;
                            width: 80px;
                            height: 103px;
                            cursor: pointer;
                            i {
                                position: absolute;
                                right: 8px;
                                top: 12px;
                                width: 28px;
                                height: 28px;
                                font-size: 22px;
                                line-height: 28px;
                                text-align: center;
                                color: #e8f4fe;
                                border-radius: 14px;
                                background-color: #dd2e2e;
                                font-style: normal;
                            }
                            &.video {
                                background: url('@{url}/video.png') no-repeat 100% bottom;
                            }
                            &.photo {
                                background: url('@{url}/img.png') no-repeat 100% bottom;
                            }
                            &.audio {
                                background: url('@{url}/audio.png') no-repeat 100% bottom;
                            }
                        }
                    }
                }
            }
            .demandBox {
                height: 280px;
                padding: 15px 10px 0;
                .el-scrollbar {
                    div {
                        position: relative;
                        min-height: 153px;
                        background: rgba(43, 190, 251, 0.1);
                        margin-bottom: 10px;
                        padding: 18px 10px 18px 69px;
                        box-sizing: border-box;
                        font-size: 26px;
                        line-height: 42px;
                        span {
                            position: absolute;
                            left: 1px;
                            top: 39px;
                            padding-left: 15px;
                            width: 45px;
                            height: 26px;
                            font-size: 28px;
                            line-height: 26px;
                            text-align: center;
                            background: url('@{url}/serialNumber-bg.png') no-repeat;
                            background-size: 100% 100%;
                            box-sizing: border-box;
                        }
                        .type {
                            display: inline-block;
                            padding: 0 8px;
                            height: 34px;
                            line-height: 34px;
                            border-radius: 5px;
                            background: #2b90c1;
                        }
                        .rescue {
                            background: #4f1974;
                        }
                    }
                }
            }
        }
        
    }
}
// serialNumber-bg
.loading{
    color: #fff;
    background: url(../../../assets/img/halfScreen/halflist/loading.gif) no-repeat 33px 255px;
    color: #d2e1ec;
    height: 800%;
    p{
        padding-left: 5px;
        margin:0;
        transform: translateY(-8px);
    }
    center{
      margin-top:120%;
    }
  }
</style>
