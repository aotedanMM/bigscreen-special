<!--队伍详情-->
<template>
<div class="rescueTeamsHome">
    <!-- <span class="halflist-back" @click="backParent"></span> -->
    <div class="rescueTeamsHome_hd title-panel">
        <!-- <div class="loading" v-if="loading"> -->
        <p>队伍详情</p>
        <i @click="backParent()"></i>
    </div>
    <el-scrollbar>
        <div class="detachment_name">{{detailsData.teamName}}</div>
        <div class="teamConfiguration">
            <div><span>类型：</span><span>{{detailsData.teamtypeName ? detailsData.teamtypeName : '- -'}}</span></div>
            <div><span>总人数（人）：</span><span>{{detailsData.totalPerNum ? detailsData.totalPerNum : '- -'}}</span></div>
            <div>
                <span>队长：</span>
                <span>{{detailsData.respPer ? detailsData.respPer : '- -'}}</span>
                <span>{{detailsData.telNumber ? detailsData.telNumber : ''}}</span>
                <b
                    v-if="detailsData.telNumber"
                    class="callphonebgimg"
                    :title="detailsData.telNumber ? detailsData.telNumber : ''"
                    @click="handleClickCallup(detailsData.telNumber,detailsData.telNumber,$event, detailsData.telPelope)"
                ></b>
            </div>
            <div><span>地址：</span><span>{{detailsData.address ? detailsData.address : '- -'}}</span></div>
            <div><span>队伍特长：</span><span>{{detailsData.speciality ? detailsData.speciality : '- -'}}</span></div>
        </div>
        <div class="rescueTeamsHome_cnt">
            <div class="rescueTeamItem" v-for="(item, index) in equipmentList" :key="index">
                <div class="tempRight-title  f-tit-h2">
                    <span>{{item.title ? item.title : '- -'}}</span>
                    <i :class="item.show? 'tempRight-switch':'tempRight-switch tempRight-switch-reverse'" @click.stop="item.show = !item.show"></i>
                </div>
                <template v-if="item.show">
                    <div class="tempRight-cont">
                        <div v-for="(sub, i) in item.list" :key="i">
                            <span>{{sub.name? sub.name : '- -'}}</span>
                            <span>{{sub.materialNum ? sub.materialNum : 0}}</span>
                            <span>{{sub.unit}}</span>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <!-- <template v-else>
            <div class="loading"></div>
        </template> -->
    </el-scrollbar>
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
@Component({
    name: 'TeamDetailsPopup',
    components: {},
})
export default class SiteFeedback extends Vue {
    @Prop() private parentHandleClickNumFn?: any; // 父组件处理点击数字的方法
    @Prop() private rescueTeamHomeData?: any; // 父组件传的数据
    private detailsData: any = {};
     private equipmentList: any = [
         {
             title: '通讯装备',
             show: true,
             list: [],
         },
         {
             title: '主要装备',
             show: true,
             list: [],
         },
     ];

    private created() {
        this.detailsData = this.rescueTeamHomeData.parameter;
        console.log(this.detailsData, 'this.detailsData');
        this.equipmentList[1].list = this.detailsData.list;
        this.equipmentList[0].list = this.detailsData.mlist;
    }
    // 打电话
    private handleClickCallup(listObj: any, val: any, event: any, name: any) {
        let telName = '';
        const list = Object.values(listObj);
        const objList = Object.keys(listObj);
        list.forEach((item: any, index: any) => {
        if (item === val) {
            const key: any = objList[index];
            const telKey = name[key];
            telName = listObj[telKey] || '';
        }
        });
        this.messsageBus.emit('showCallup', true, listObj, val, event, telName);
    }
    // 返回首页
    private backParent() {
        // const paramObj = {};
        // if (this.parentHandleClickNumFn) {
        //     this.parentHandleClickNumFn(JSON.parse(JSON.stringify(paramObj)), 'RescueTeamsHome');
        // }
        this.$emit('backParent', 'second');
    }
}
</script>

<style lang="less" scoped>
@import '../../../assets/css/decisionSupport/teamIcon.less';
@import '../../../assets/css/decisionSupport/Statistic.half.less';
@import '../../../assets/css/decisionSupport/DiscussTab.less';
@import '../../../assets/css/decisionSupport/halfScreen.statistic.less';
@url: '../../../assets/img/RescueTeams/siteFeedback';
@closeUrl: '../../../assets/img/gisModule/PopulationFeverBox';
.halflist {
    padding: 0;
}
.rescueTeamsHome {
    .rescueTeamsHome_hd {
        position: relative;
        i {
            position: absolute;
            top: -3px;
            right: -15px;
            width: 90px;
            height: 48px;
            background: url("@{closeUrl}/closeBtn.png") no-repeat;
            background-size: 100% 100%;
            &:hover {
                background: url("@{closeUrl}/closeHover.png") no-repeat;
            }
        }
    }
    .el-scrollbar {
        height: 800px;
        color: #e8f4fe;
        .detachment_name {
            font-size: 28px;
            line-height: 36px;
            padding: 20px 15px 20px;
            text-align: center;
            background: url('@{url}/detachment_name_bg.png') no-repeat 100% bottom;
        }
        .teamConfiguration {
            padding: 0 10px 0 20px;
            div {
                span {
                    // display: inline-block;
                    height: 45px;
                    line-height: 45px;
                    font-size: 26px;
                    color: #e8f4fe;
                    &:nth-child(1) {
                        color: #92edf6;
                    }
                    &:nth-child(3) {
                        margin-left: 10px;
                    }
                }
                .callphonebgimg{
                    display: inline-block;
                    width: 22px;
                    height: 22px;
                    background: url("../../../assets/img/realtimeTeam/phone.png") no-repeat;
                    background-size: 100% 100%;
                    vertical-align: middle;
                    margin-left: 10px;
                    margin-bottom: 10px;
                    cursor: pointer;
                }
            }
        }
        .rescueTeamsHome_cnt {
            .tempRight-title {
                margin-top: 15px;
            }
            .tempRight-cont {
                margin-top: 15px;
                div {
                    display: flex;
                    width: 100%;
                    align-items: center;
                    justify-content: space-between;
                    height: 75px;
                    background: rgba(43, 190, 251, 0.1);
                    margin-bottom: 5px;
                    padding: 0 15px;
                    box-sizing: border-box;
                    font-size: 26px;
                    color: #f7feff;
                    span {
                        height: 100%;
                        line-height: 75px;
                        &:nth-child(1) {
                            width: 250px;
                        }
                        &:nth-child(2) {
                            font-size: 32px;
                            color: #fdef03;
                            font-family: "Impact";
                            font-weight: 400;
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
    height: 100%;
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
