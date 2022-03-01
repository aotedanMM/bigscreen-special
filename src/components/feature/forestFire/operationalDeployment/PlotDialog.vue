<template>
<div>
  <div class="plotEditDialog" v-if="plotEditDialog">
   <div class="ws-head">
      <p class="title-panel title">保存当前分析结果</p>
    </div>
    <i class="ws-close" @click="closeFn"></i>
    <div class="ws-content">
        <el-form ref="forms" :model="forms" :rules="rules"  label-width="100px">
            <el-form-item  prop="plotName"  >
                <span slot="label" class="f-txt-com my-forms-item">名称</span>
                <el-input v-model.trim="forms.plotName"></el-input>
            </el-form-item>
            <ul>
                <!-- <li>
                    <span><i>*</i></span>
                    <el-input type="text" class="csmMyInput-noBg" v-model="plotName"></el-input>
                </li> -->
                <li><span>用户</span><span>{{this.$route.query.loginName}}</span></li>
                <li><span>时间</span><span>{{this.nowTime}}</span></li>
                <li><span>类型</span><span>地图标绘/地图测量</span></li>
                <!-- <li>
                    <span>部门</span>
                    <el-select class="constomMySelect" v-model="departmentValue" placeholder="请选择">
                        <el-option
                                v-for="item in departmentList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </li> -->
            </ul>
            <el-form-item  prop="departmentValue"  >
                <span slot="label" class="f-txt-com my-forms-item">部门</span>
                <el-select class="constomMySelect" v-model="forms.departmentValue" placeholder="请选择">
                    <el-option
                            v-for="item in departmentList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <!-- <el-input v-model="ruleForm.departmentValue"></el-input> -->
            </el-form-item>

        </el-form>
        
      <div class="submit">
          <el-button class="csmMySlider" @click="pushAndSave('forms')">推送</el-button>
          <el-button class="csmMySlider" @click="saveFn('forms')">保存</el-button>
<!--          <el-button @click="list">列表</el-button>-->
      </div>
    </div>
    <div class="ws-bottom"></div>
  </div>
  <!-- 标绘列表   -->
   <div class="plotListDialog">
       <PlotList v-if="plotListDialog" @edit="editFn" @closeList="closeListDialog" ref="plotLists"></PlotList>
   </div>
</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import PlotList from '@/components/feature/GIS/GisPlot/PlotList.vue';
import { eadsWebPlot } from '@/api/installServer.ts';
@Component({
  name: 'PlotDialog',
  components: {
    PlotList,
  },
})
export default class PlotDialog extends Vue {
    // private plotName: any = '';
    // private departmentValue: any = '';
    private forms: any = {
        plotName: '',
        departmentValue: '',
    };
    private rules: any = {
        plotName: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }],
        departmentValue: [
            { required: true, message: '请选择部门', trigger: 'change' } ],
    };
    private plotEditDialog: boolean = false; // 编辑弹窗
    private plotListDialog: boolean = false; // 列表弹窗
    private nowTime: any = ''; // 当前时间
    private id: any = ''; // id
    private measureSchema: any = '';
    private plotSchema: any = '';
    private editData: any = '';
    private dataList: any = '';
    private eventId: any = '';
    private departmentList = [
            {
                label: '指挥中心',
                value: '指挥中心',
            },
            {
                label: '监测减灾司',
                value: '监测减灾司',
            },
            {
                label: '救援协调局',
                value: '救援协调局',
            },
            {
                label: '防火司',
                value: '防火司',
            },
            {
                label: '防汛抗旱司',
                value: '防汛抗旱司',
            },
            {
                label: '地震地质司',
                value: '地震地质司',
            },
            {
                label: '危化监管司',
                value: '危化监管司',
            },
            {
                label: '安全基础司',
                value: '安全基础司',
            },
            {
                label: '安全协调局',
                value: '安全协调局',
            },
            {
                label: '救灾司',
                value: '救灾司',
            },
            {
                label: '新闻司',
                value: '新闻司',
            },
            {
                label: '科信司',
                value: '科信司',
            },
            {
                label: '消防救援局',
                value: '消防救援局',
            },
            {
                label: '森林消防局',
                value: '森林消防局',
            },
            {
                label: '地震局',
                value: '地震局',
            },
            {
                label: '煤监局',
                value: '煤监局',
            },
            {
                label: '减灾中心',
                value: '减灾中心',
            },
        ];
    private saveFn(formName: any) {
        //   debugger;
        const that = this;
        (this.$refs[formName] as any).validate((valid: any) => {
            if (valid) {
                that.messsageBus.emit('saveMeasureSchema');
                that.messsageBus.emit('savePlotSchema');
                setTimeout(() => {
                        if (that.measureSchema || that.plotSchema) {
                            that.saveOnFn();
                        }
                }, 50);
            } else {
                return false;
            }
        });


        // if (this.plotName === '' || this.plotName.length < 20) {
        //     this.$message('请输入名称，长度不能大于20。');
        // } else if (this.departmentValue === '') {
        //     this.$message('请选择部门');
        // } else {
        //     this.messsageBus.emit('saveMeasureSchema');
        //     this.messsageBus.emit('savePlotSchema');
        //     setTimeout(() => {
        //         if (this.measureSchema || this.plotSchema) {
        //             this.saveOnFn();
        //         }
        //     }, 50);
        // }
    }
    private saveOnFn() {
        const pushId = this.$store.state.eventPushStore.eventLocation.eventId;
        const obj = {
            measureSchema: this.measureSchema,
            plotSchema: this.plotSchema,
        };
        const params = {
            operationTime: this.nowTime,
            id: this.id ? this.id : '',
            pushId: this.eventId,
            pushInfo: JSON.stringify(obj),
            pushName: this.$route.query.loginName,
            pushType: '地图标绘',
            status: '0',
            updateTime: '',
            sendDept: this.forms.departmentValue,
            pushTitle: this.forms.plotName,
            readFlag: 0,
        };
        eadsWebPlot.save(params).then((res: any) => {
            if (res.code === 0) {
                this.$message({
                    type : 'success',
                    message : '保存成功',
                });
                // this.forms.departmentValue = '';
                this.forms.plotName = '';
                // this.departmentValue = '';
                // this.plotName = '';
                this.id = '';
                this.plotEditDialog = false;
                if (this.plotListDialog) {
                    (this.$refs as any).plotLists.queryList();
                }
            }
        });
    }
    private init() {
        this.messsageBus.on('MeasureSchemaReturn', (opts: any) => {
            if (opts) {
                this.measureSchema = opts;
            }
        });
        this.messsageBus.on('PlotSchemaReturn', (opts: any) => {
            if (opts) {
                this.plotSchema = opts;
            }
        });
    }
    private list() {
        this.plotListDialog = true;
    }
    // 编辑
    private editFn(val: any) {
        this.editData = val;
        this.id = val.id;
        this.plotEditDialog = true;
        this.forms.plotName = val.pushTitle;
        this.forms.departmentValue = val.sendDept;
        const content = JSON.parse(val.progressCont);
        this.messsageBus.emit('loadMeasureSchema', {content, id: val.id, checked: true});
        this.messsageBus.emit('loadPlotSchema', {content, id: val.id, checked: true});
    }
    private pushAndSave(formName: any) {
        const that = this;
        (this.$refs[formName] as any).validate((valid: any) => {
            if (valid) {
                that.messsageBus.emit('saveMeasureSchema');
                that.messsageBus.emit('savePlotSchema');
                setTimeout(() => {
                    if (that.measureSchema || that.plotSchema) {
                        this.pushFn(this.editData ? this.editData : '');
                    }
                }, 50);
            } else {
                return false;
            }
        });
    }
    private pushFn(val: any) {
        if (this.forms.plotName === '' && !val) {
            this.$message('请输入名称');
        } else if (this.forms.departmentValue === '' && !val) {
            this.$message('请选择部门');
        } else {
            this.messsageBus.emit('saveMeasureSchema');
            this.messsageBus.emit('savePlotSchema');
            const pushId = this.$store.state.eventPushStore.eventLocation.eventId;
            const obj = {
                measureSchema: this.measureSchema,
                plotSchema: this.plotSchema,
            };
            const params = {
                dynamicPO: {
                    operationTime: this.nowTime,
                    id: val.id ? val.id : '',
                    pushId: this.eventId,
                    pushInfo: val.progressCont ? val.progressCont : JSON.stringify(obj),
                    pushName: this.$route.query.loginName,
                    pushType: '地图标绘',
                    status: '1',
                    updateTime: '',
                    sendDept: this.forms.departmentValue,
                    pushTitle: this.forms.plotName,
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
                    // this.forms.departmentValue = '';
                    this.forms.plotName = '';
                    this.id = '';
                    this.messsageBus.emit('pushPlot');
                    if (this.plotListDialog) {
                        (this.$refs as any).plotLists.queryList();
                    }
                } else {
                    this.$message('推送失败');
                }
            });
        }
    }
    // private pushListFn(val: any) {
    //     this.pushFn(val);
    // }
    private closeListDialog(val: any) {
        this.plotListDialog = val;
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
    private closeFn() {
        this.plotEditDialog = false;
    }
    private created() {
        this.nowTimeFn();
        this.init();

    }
    private mounted() {
        const self: any = this;
        window.addEventListener('message', (event: any) => {
            self.eventId = event.data.id;
            if (event.data.name === '保存') {
                // 此处执行事件
                this.plotEditDialog = true;
            } else if (event.data.name === '标绘列表') {
                this.plotListDialog = true;
                setTimeout(() => {
                    this.messsageBus.emit('eventId', this.eventId);
                }, 500);
                // (this.$refs as any).plotLists.queryList();
            }
        });
    }
}
</script>
<style lang="less">
    @imgUrl: '../../../../assets/img/areaSelect';

    .plotEditDialog {
        position: absolute;
        top:24%;
        left:50%;
        width: 26%;
        .my-forms-item{
            color:#fff;
        }
        ul{
            li{
                display: flex;
                color: #eefeff;
                font-size: 26px;
                line-height: 52px;
                span:nth-of-type(1){
                    display: inline-block;
                    margin-right: 15px;
                    text-align: right;
                    width: 19%;
                    i{
                        color: #84F7FF;
                    }
                }
            }
            li:nth-of-type(1) {
                .el-input{
                    width: 74%;
                }
                .el-input__inner{
                    background-color: rgba(118, 242, 251, 0.1) !important;
                    border:1px solid #76f2fb !important;
                }
            }
            li:nth-last-child(1){
                .el-input{
                    width: 92%;
                }
            }
        }
    }
    .plotListDialog{
        position: absolute;
        top:10%;
        left:5%;
        width: 32%;
    }
    /*头*/
    .ws-head {
        background: url("@{imgUrl}/bg_head.png") no-repeat;
        background-size: 100% 100%;
        height: 60px;
        & > .title {
            padding-left: 35px;
            padding-top: 5px;
            line-height: 60px;
            margin: 0;
        }
    }

    .ws-content {
        background: url("@{imgUrl}/bg_content.png") no-repeat;
        background-size: 100% 100%;
        padding: 20px 27px 6px 20px;
        .el-form-item{
            margin-bottom:0;
        }
        .el-form-item__content{
            .el-input .el-input__inner{
                background-color: rgba(118, 242, 251, 0.1);
                border:1px solid #76f2fb;
                font-size:26px;
                color:#fff;
            }
        }

        & > .content {
            padding: 7px;
            box-shadow: 0 0 4px 1px rgba(10, 60, 77, 1);
            border-radius: 1px;

            & > .row {
                position: relative;
                display: flex;
                align-items: center;
                padding: 5px;
                border: 1px solid rgba(10, 60, 77, 1);
                border-radius: 3px;
                font-family: Microsoft YaHei, serif;
                font-size: 26px;

                .name {
                    width: 40%;
                    padding-left: 5px;
                    font-family: Microsoft YaHei, serif;
                }

                .value {
                    width: 60%;
                    font-weight: 200;
                    /*border: 1px solid #01BBF6;*/
                    border: 1px solid  rgba(43,246,254,.5);
                    border-radius: 5px;
                    margin-left: 33px;

                    /deep/ .el-input__inner {
                        font-family: Microsoft YaHei, serif;
                        font-size: 22px;
                    }

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

                .listDistrict-input-content {
                    width: 62%;
                    border-radius: 5px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: -7px;
                    padding-left: 33px;

                    .selcetIconTop {
                        display: inline-block;
                        width: 35px;
                        height: 30px;
                        background: url("../../../../assets/img/halfScreen/halflist/select2bg.png") no-repeat;
                        background-size: 100% 100%;
                        margin: 5px -7px 0 0;
                        cursor: pointer;
                    }
                    .selcetIconBot {
                        display: inline-block;
                        width: 35px;
                        height: 30px;
                        background: url("../../../../assets/img/halfScreen/halflist/selcet1bg.png") no-repeat;
                        background-size: 100% 100%;
                        margin: 5px -7px 0 0;
                        cursor: pointer;
                    }

                }
                .listDistrict-input{
                    width: 40%;
                    border-radius: 5px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-left: 18px;
                    border: 1px solid  rgba(43,246,254,.5);
                    /*border: 1px solid  #01BBF6;*/
                }
                .kilometer{
                    padding-left: 12px;
                }

                .search-results {
                    position: absolute;
                    background: url("../../../../assets/img/halfScreen/eventAndTopics/select_bg.png") no-repeat;
                    background-size: 100% 100%;
                    width: 60%;
                    top: 48px;
                    left: 40%;
                    font-size: 22px;
                    height: 200px;
                    z-index: 5;

                    .item {
                        display: flex;
                        justify-content: space-between;
                        cursor: pointer;
                        margin-top: 10px;

                        .child-item{
                            padding: 5px 10px;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                        }


                        &:hover {
                            background: url("@{imgUrl}/seleted.png") no-repeat;
                            background-size: 100% 100%;
                            color: rgb(238, 231, 80);
                        }

                    }

                    /*滚动条样式*/
                    /deep/ .el-scrollbar {
                        height: 200px;
                    }
                    /deep/ .el-scrollbar__bar.is-vertical > div {
                        background-image: linear-gradient(0deg,
                        #0a7ccc 0%,
                        #06b4d1 52%,
                        #02ebd5 100%);
                    }
                    /deep/ .el-scrollbar__thumb:hover {
                        background-image: linear-gradient(0deg,
                        #0a7ccc 0%,
                        #06b4d1 52%,
                        #02ebd5 100%);
                    }
                }
            }
        }

        & > .submit {
            display: flex;
            margin-top: 20px;
            justify-content: center;
        }
    }

    /*关闭按钮*/
    .ws-close {
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

    /*底*/
    .ws-bottom {
        background: url("@{imgUrl}/bg_bottom.png") no-repeat;
        background-size: 100% 100%;
        height: 31px;
    }

</style>
