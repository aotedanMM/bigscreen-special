<template>
    <div class="SavedPlots">
        <div class="sp-head">
            <p class="title">标绘测量管理</p>
        </div>
        <i class="sp-close" @click="closePanel"></i>
        <div class="sp-content" v-loading="loading">
            <div class="search">
                <el-input class="csmMyInput-noBg"
                          type="text"
                          v-model.trim="keyWord"
                          @input="searchFn(keyWord)"
                          @keyup.enter.native="searchFn(keyWord)"
                          placeholder="请输入查询内容">
                    <i slot="suffix" class="search-icon" @click="searchFn(keyWord)"></i>
                </el-input>
            </div>
            <div class="table" v-if="dataList.length">
                        <li class="boxHead">
                            <span class="indexnum">序号</span>
                            <span class="boxName">名称</span>
                            <span class="boxTime">时间</span>
                            <span class="status">状态</span>
                            <span class="funText">操作</span>
                        </li>
                        <li class="row"
                            v-for="(plot, i) in dataList"
                            :key="i">
                            <span class="indexNum">{{i + 1}}</span>
                            <span class="name" :title="plot.pushTitle">{{plot.pushTitle}}</span>
                            <span class="createTime" :title="plot.progressTime">{{plot.progressTime}}</span>
                            <span class="pushStatus" v-if="plot.status === '0'">未推送</span>
                            <span class="pushStatus" v-if="plot.status === '1'">已推送</span>
                            <span class="disposal" @click="pushFn(plot)">推送</span>
                            <span class="edit" @click="editFn(plot)">编辑</span>
                            <span class="delete" @click="deleteFn(plot)">删除</span>
                        </li>
                    </div>
            <div class="nothingData--bg" v-else></div>


<!--            <el-pagination v-if="paginationObj.total"-->
<!--                           class="constomMyElPage"-->
<!--                           small-->
<!--                           :pager-count="5"-->
<!--                           @current-change="handleCurrentChange"-->
<!--                           :current-page.sync="paginationObj.currentPage"-->
<!--                           :page-size="paginationObj.pageSize"-->
<!--                           layout="prev, pager, next"-->
<!--                           :total="paginationObj.total"-->
<!--            ></el-pagination>-->
        </div>

        <div class="sp-bottom"></div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
// import { eadsWebPlot, newProgressSituationServer } from '@/api/installServer.ts';
import { eadsWebPlot } from '@/api/installServer.ts';
@Component({
    name: 'PlotList',
    components: {},
})
export default class PlotList extends Vue {
    private eventId: any = '';
    private dataList: any = [];
    private plots: any[] = [];
    private keyWord: string = '';
    private loading: boolean = false;
    private nowTime: any = '';
    private plotListDialog: boolean = false;
    private paginationObj: any = {
        currentPage: 1,
        pageSize: 5,
        total: '',
    };
    private index: number = -1;

    private editFn(val: any) {
        this.$emit('edit', val);
    }
    private searchFn(val: any) {
        if (!val) {
            // this.queryList();
        }
        this.dataList = this.dataList.filter((item: any) => item.pushTitle.indexOf(val) >= 0 );
    }
    private deleteFn(val: any) {
        const content = JSON.parse(val.progressCont);
        const params = {
            id: val.id,
        };

        this.$confirm('此操作将永久删除文件，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                eadsWebPlot.deletFn(params).then((res: any) => {
                    if (res.code === 0) {
                        this.$message({
                            type : 'success',
                            message : '删除成功',
                        });
                        this.messsageBus.emit('loadMeasureSchema', {content, id: val.id, checked: false});
                        // this.queryList();
                    }
                });
            });
    }
    private queryList() {
        this.loading = true;
        const pushId = this.$store.state.eventPushStore.eventLocation.eventId;
        const parmas = {
            eventId : this.eventId, // 事件id
            status : null,
            typeCode : '7', // 如果根据类型查询可传值
        };
        // newProgressSituationServer.getAllData(parmas).then((res: any) => {
        //     if (res.code === 0) {
        //         // this.plotListDialog = true;
        //         this.loading = false;
        //         this.dataList = res.data;
        //     } else {
        //         this.loading = false;
        //         this.$message(res.msg);
        //     }
        //
        //     // this.paginationObj.total = this.dataList.length;
        // });
    }
    private pushFn(item: any) {
        const params = {
            dynamicPO: {
                operationTime: this.nowTime,
                id: item.id,
                pushId: this.eventId,
                pushInfo: item.progressCont,
                pushName: this.$route.query.loginName,
                pushType: '地图标绘',
                status: '1',
                updateTime: '',
                sendDept: item.sendDept,
                pushTitle: item.pushTitle,
            },
            pushDto: {
                content: [
                    {
                        componentName: '',
                        data: '',
                        deps: '',
                        layout: '',
                        memo: '',
                        uuid: '',
                    },
                ],
                eventId: this.eventId,
                locationKey: 'SEND_commanddata',
                messageName: this.eventId,
                messageType: 'command',
                receiverIds: this.$route.query.loginName,
                senderId: this.$route.query.loginName,
            },
        };
        eadsWebPlot.addDataPush(params).then((res: any) => {
            if (res.code === 0) {
                this.$message({
                    type : 'success',
                    message : '推送成功',
                });
                // this.queryList();
                this.messsageBus.emit('pushPlot');
            } else {
                this.$message('推送失败');
            }
        });
    }
    // 获取当前时间
    private nowTimeFn() {
        const today = new Date();
        const year = today.getFullYear();     // 获取当前时间的年份
        let month = today.getMonth() + 1;   // 获取当前时间的月份，月份从0开始，所以需要加一
        let day = today.getDate();          // 获取当前时间的日期，getDay()可以获取星期几
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();
        // 在 numbers<10 的数字前加上 0
        month = this.checkTime(month);
        day = this.checkTime(day);
        h = this.checkTime(h);
        m = this.checkTime(m);
        s = this.checkTime(s);
        this.nowTime = year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s;
    }
    private checkTime(i: any) {
        if (i < 10) {
            i = '0' + i;
        }
        return i;
    }
    private closePanel() {
        // this.plotListDialog = false;
        this.$emit('closeList', false);
    }
    // private handleCurrentChange(val: any) {
    //
    // }
    private created() {
        this.messsageBus.on('eventId', (data: any) => {
            this.eventId = data;
            if (data) {
                // this.queryList();
            }
        });
        this.nowTimeFn();
        // this.queryList();
    }
}
</script>

<style lang="less" scoped>
    @imgUrl: '../../../../assets/img/areaSelect';

    .itemHover {
        border: 1px solid rgb(242, 206, 88) !important;
        box-shadow: inset 0 0 10px rgba(242, 206, 88, 0.8);
        color: #F5EDC0;
    }

    .SavedPlots {
        position: absolute;
        width: 100%;
        color: #fff;
    }

    /*头*/
    .sp-head {
        background: url("@{imgUrl}/bg_head.png") no-repeat;
        background-size: 100% 100%;
        height: 60px;
        & > .title {
            padding-left: 35px;
            padding-top: 5px;
            line-height: 60px;
            font-family: Microsoft YaHei, serif;
            font-weight: bold;
            margin: 0;
            letter-spacing: 3px;
            font-size: 30px;

            /*字体颜色渐变*/
            background-image: -webkit-linear-gradient(bottom, #00f, #00e4ff, #d6c83d 80%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    .sp-content {
        background: url("@{imgUrl}/bg_content.png") no-repeat;
        background-size: 100% 100%;
        padding: 10px 20px 6px 20px;
        height: 460px;
        margin-bottom: -1px;

        & > .search {
            font-weight: 200;
            border: 1px solid #01BBF6;
            border-radius: 3px;

            &:hover {
                border: 1px solid rgb(238, 231, 80);
                background: rgba(238, 231, 80, 0.2);
            }

            & .search-icon {
                display: inline-block;
                background: url("@{imgUrl}/search.png") no-repeat;
                background-size: 100% 100%;
                height: 39px;
                width: 39px;
                cursor: pointer;

                &:hover {
                    background: url("@{imgUrl}/search_hover.png") no-repeat;
                }
            }
        }

        & > .table {
            margin: 15px 0;
            height: 410px;
            overflow: auto;
            .boxHead{
                background: rgba(10, 60, 77, 0.3);
                border-bottom: 1px solid rgba(10, 60, 77, 0.6);
                font-family: Microsoft YaHei, serif;
                font-size: 26px;
                padding: 15px 10px;
                color: #ffffff;
                span{
                    display: inline-block;
                    text-align: center;
                }
                .indexnum{
                    width: 11%;
                }
                .boxName{
                    width: 20%;
                }
                .boxTime{
                    width: 20%;
                }
                .status{
                    width: 19%;
                }
                .funText{
                    width: 30%;
                }
            }
            & > .row {
                display: flex;
                margin-top: 3px;
                padding: 15px 10px;
                border-radius: 3px;
                background: rgba(10, 60, 77, 0.3);
                border-bottom: 1px solid rgba(10, 60, 77, 0.6);
                font-family: Microsoft YaHei, serif;
                font-size: 26px;

                /*&:hover {*/
                /*    border: 1px solid rgb(242, 206, 88) !important;*/
                /*    box-shadow: inset 0 0 10px rgba(242, 206, 88, 0.8);*/
                /*    color: #F5EDC0;*/
                /*}*/

                .disposal, .delete, .edit {
                    color: #83CBD4;
                    cursor: pointer;
                }
                .indexNum{
                    width: 11%;
                    text-align: center;
                }
                .name {
                    width: 25%;
                    cursor: default;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    text-align: center;
                }
                .createTime{
                    width: 20%;
                    cursor: default;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    text-align: center;
                }
                .pushStatus{
                    width: 19%;
                    cursor: default;
                    text-align: center;
                }
                .disposal {
                    width: 13%;
                    &:hover {
                        font-weight: bolder;
                    }
                }
                .edit{
                    width: 13%;
                    &:hover {
                        font-weight: bolder;
                    }
                }
                .delete {
                    width: 12%;
                    &:hover {
                        font-weight: bolder;
                    }
                }
            }
        }
        .nothingData--bg{
            background: url('../../../../assets/img/default/panel/noData.png') no-repeat 50% 50%;
            width: 100%;
            height:100%;
        }
    }

    /*关闭按钮*/
    .sp-close {
        background: url("@{imgUrl}/close.png") no-repeat;
        background-size: 100% 100%;
        width: 90px;
        height: 48px;
        position: absolute;
        display: block;
        right: 0;
        top: -3px;
        cursor: pointer;

        &:hover {
            background: url("@{imgUrl}/close_hover.png") no-repeat;
        }
    }

    .sp-prop {
        position: absolute;
        right: 500px;
        top: 100px;
        width: 470px;
    }

    /*底*/
    .sp-bottom {
        background: url("@{imgUrl}/bg_bottom.png") no-repeat;
        background-size: 100% 100%;
        height: 31px;
    }
    .table::-webkit-scrollbar{
        width:10px;
        height:10px;
        /**/
    }
    .table::-webkit-scrollbar-thumb{
        background-image: linear-gradient(0deg,
        #0a7ccc 0%,
        #06b4d1 52%,
        #02ebd5 100%);
        border-radius:5px;
    }
    .table::-webkit-scrollbar-thumb:hover{
        background-image: linear-gradient(0deg,
        #0a7ccc 0%,
        #06b4d1 52%,
        #02ebd5 100%);
    }
    /deep/.el-loading-mask{
        width: 93%;
        margin: auto;
        background-color: rgba(7,16,34,.8);
    }
</style>
