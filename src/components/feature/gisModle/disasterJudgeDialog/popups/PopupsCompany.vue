<template>
    <div class="enterprise-dialog enterprise-dialog_xiao" v-if="popupsStatus">
        <div class="enterprise-dialog-left">
            <h3 class="enterprise-title enterprise-jstitle elliphsis" title>{{data.title}}</h3>
            <div class="enterprise-table fireworks_produce scroll">
                <ul>
                    <li v-for="(item, index) in data.list" :key="index">
                        <label class="fulllabel">
                            {{item.name}}：
                            <span class="fireworks_list_2">{{item.value}}</span>
                        </label>
                    </li>
                    <li v-for="(item, index) in data.biserialList" :key="index">
                        <label class="fulllabel" v-for="(sitem,ind) in item" :key="ind">
                            {{sitem.name}}：
                            <span class="fireworks_list_2">{{sitem.value}}</span>
                        </label>
                    </li>
                </ul>
            </div>
            <div class="baiduLabel">
                <div class="list_baidu">
                    <h3 class="enterprise-title  f-tit-h2">百度企业画像</h3>
                    <span class="enterprise-status">{{data.status}}</span>
                    <span class="openBaiduPicture" @click="moreStatus = true">更多</span>
                </div>
                <div class="baiduLabelCont scroll">
                    <center class="f-txt-com">暂无数据</center>
                </div>
            </div>
            <!--预览-->
            <div class="look-enterprise-button" @click="detailStatus = true">
                <b></b>详情
            </div>
            <!--查周边-->
            <div class="search-nearby f-txt-little" @click="$emit('extraEvent')">查周边</div>
        </div>
        <div class="baidu_Corporate_portrait animated" v-show="moreStatus">
            <h3 class="enterprise-title  f-tit-h2">百度企业画像</h3>
            <div class="iframe_div">
                <iframe></iframe>
            </div>
        </div>

        <!--关闭-->
        <div class="close-enterprise-dialog" @click="popupsStatus = false"></div>
        <div class="look-enterprise-dialog" v-if="detailStatus">
            <h2 class="entName_header"></h2>
            <div class="look-enterprise-dialog_cont">
                <h3>基本信息</h3>
                <div class="table_list">
                    <ul class="table_list_uls">
                        <li class="new_table_list" v-for="(item, index) in data.info" :key="index">
                            <span class="table_list_name">{{item.name}}：</span>
                            <span class="table_list_contont DEPTTYPENAME">{{item.value}}</span>
                        </li>
                    </ul>
                </div>
                <h3 class="baidu_Corporate_portrait_title  f-tit-h2">企业画像</h3>
                <div class="baidu_img_list">
                    <div v-for="(item, index) in data.company" :key="index">
                        <h3 class="alteration_title">{{item.name}}</h3>
                        <div class="table_list alteration">{{item.value}}</div>
                    </div>
                    <div class="table_list">
                        <div v-for="(item, index) in data.risk" :key="index">
                            <h3 class="dangerYuqing_title">{{item.name}}</h3>
                            <ul class="table_list_uls enterpriserisk">{{item.value}}</ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="close-look-dialog" @click="detailStatus = false"></div>
            <div class="download_btn_world" id="baozhu_download_btn_world"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class PopupsCompany extends Vue {
    @Prop({default: {
        title: '企业专业信息',
        status: '未知',
        list: [
            {
                name: '单位类型',
                value: '',
            },
        ],
        biserialList: [
            [
                {
                    name: '单位类型',
                    value: '',
                },
                {
                    name: '单位类型',
                    value: '',
                },
            ],
            [
                {
                    name: '单位类型',
                    value: '',
                },
                {
                    name: '单位类型',
                    value: '',
                },
            ],
        ],
        info: [
            {
                name: '组织机构代码',
                value: '',
            },
            {
                name: '组织机构代码',
                value: '',
            },
            {
                name: '组织机构代码',
                value: '',
            },
        ],
        company: [
            {
                name: '企业工商变更',
                value: '',
            },
            {
                name: '行政处罚',
                value: '',
            },
            {
                name: '税务处罚',
                value: '',
            },
        ],
        risk: [
            {
                name: '企业安全生产风险',
                value: '',
            },
            {
                name: '经营活动舆情',
                value: '',
            },
            {
                name: '安全事故舆情',
                value: '',
            },
            {
                name: '其他负面舆情',
                value: '',
            },
        ],
    }}) private data?: object;
    @Prop({default: true}) private popupsStatus?: boolean;
    private detailStatus: boolean = false;
    private moreStatus: boolean = false;
}
</script>

<style lang="less" scoped>
@imgPath: "../../../../../assets/img/gisModule/compentsPopups";
/*------企业画像s----*/
/*公共 s*/
.speatialDetail {
    position: absolute;
    top: 30%;
    left: 31%;
}
.enterprise-dialog {
    width: auto;
    height: 550px;
    position: absolute;
    background: url("@{imgPath}/newtankng_02.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    padding: 25px 0 25px 5px;
    z-index: 1000;
}
.enterprise-dialog-left {
    width: 580px;
    height: 510px;
    position: relative;
}

.enterprise-title {
    margin: 0;
    color: #eef9fd;
    // font-size: 20px;
    padding-left: 15px;
    width: 74%;
    height: 37px;
    line-height: 35px;
    font-weight: normal;
    overflow-x: hidden;
}

.close-enterprise-dialog {
    background: url("@{imgPath}/close_qiye.png") no-repeat;
    background-size: 100% 100%;
    width: 15px;
    height: 15px;
    top: 24px;
    right: 26px;
    position: absolute;
}

.close-enterprise-dialog:hover {
    cursor: pointer;
}

/*左-百度画像列表*/
.baiduLabel {
    width: 88%;
    position: relative;
    margin-left: 30px;
}

.baiduLabel .enterprise-title {
    padding-left: 0;
}

.baiduLabel p {
    height: 30px;
    border-bottom: 1px solid rgba(39, 154, 177, 0.5);
    margin-top: 5px;
}

.baiduLabel p span {
    padding: 0px 10px;
    color: #fff;
    border-radius: 5px;
    // font-size: 16px;
}

.baiduLabel p span:first-child {
    border: 1px solid #a20019;
    background: rgba(162, 0, 25, 0.5);
}

.baiduLabel p span:last-child {
    /*border: 1px solid #279ab1;*/
    /*background: rgba(39, 154, 177, 0.5);*/
    position: absolute;
    background-size: 100% 100%;
    right: 60px;
    width: 59px;
    height: 37px;
    line-height: 37px;
    top: 4px;
    text-align: center;
    color: #71d4e1;
}
.list_baidu {
    display: flex;
    border-bottom: 1px solid #67ddff;
}
.list_baidu .enterprise-title {
    width: 20%;
}
.list_baidu .enterprise-status {
    margin-left: 25px;
    width: 62px;
    height: 32px;
    border: 1px solid #a20019;
    background: rgba(162, 0, 25, 0.5);
    color: #fff;
    border-radius: 5px;
    text-align: center;
    line-height: 27px;
}
.list_baidu .enterprise-title {
    width: 24%;
    margin-right: 17px;
    color: #70f0f8;
}
.list_baidu .openBaiduPicture {
    position: absolute;
    background-size: 100% 100%;
    right: 0px;
    width: 59px;
    height: 37px;
    line-height: 37px;
    top: 4px;
    text-align: center;
    color: #71d4e1;
    cursor: pointer;
}
.list_baidu .openBaiduPicture:after {
    content: "";
    width: 11px;
    height: 11px;
    background: url("@{imgPath}/gengduo.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    right: -4px;
    top: 36%;
    transform: translate(-50%);
}

.baiduLabel p span:last-child:hover {
    cursor: pointer;
}

.baiduLabelCont {
    margin-top: 20px;
    height: 150px;
    color: #fff;
    line-height: 30px;
    overflow: auto;
    width: 99%;
    color: #d6f3ff;
}

/*右-百度画像iframe*/
.baidu_Corporate_portrait {
    width: 610px;
    height: 510px;
    padding-right: 10px;
    // display: none;
}
.baidu_Corporate_portrait_title{
    margin:0;
    background:url('@{imgPath}/baiduTitleImg.png') no-repeat 0 0 ;
}

.title_view {
    height: 70px;
    line-height: 70px;
    color: #fda100;
    // font-size: 22px;
    padding-left: 24px;
}

.iframe_div {
    width: 95%;
    height: 455px;
    margin-top: 5px;
    margin-left: 10px;
    overflow: hidden;
}

.iframe_div iframe {
    width: 98%;
    height: 98%;
    overflow: hidden;
}

/*word弹窗*/
.look-enterprise-button {
    border: 1px solid #00eaff;
    position: absolute;
    right: 60px;
    top: 0px;
    color: #5caec1;
    border-radius: 5px;
    width: 84px;
    height: 30px;
    line-height: 25px;
    text-align: center;
    padding-left: 20px;
    cursor: pointer;
}
.look-enterprise-button b {
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url("@{imgPath}/xiangq_icon.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 50%;
    left: 28%;
    transform: translate(-50%, -50%);
}
.look-enterprise-button:hover {
    cursor: pointer;
}
.look-enterprise-dialog {
    background: url("@{imgPath}/world_bg.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    width: 781px;
    // top: -40%;
    // left: -35px;
    height: 987px;
    // display: none;
    z-index: 99999;
}

.look-enterprise-dialog h2 {
    // font-size: 22px;
    text-align: center;
    margin: 0 auto;
    width: 70%;
    margin-top: 135px;
    margin-bottom: 30px;
    font-weight: bolder;
}
.look-enterprise-dialog h3 {
    text-align: left;
    margin-left: 150px;
    margin-bottom: 10px;
    font-weight: bolder;
    // font-size: 22px;
    margin-top: 20px;
}
/*word 企业画像*/
.table_list {
    width: 100%;
    margin: 0 auto;
}
.table_list .list_nowarp_inherit {
    line-height: 35px;
    // font-size: 20px;
    font-weight: bolder;
    color: #000;
}
.table_list .list_nowarp_inherit .list_nowarp_inherit_01 {
    display: flex;
    font-weight: bolder;
}

.table_list .list_nowarp_inherit .list_nowarp_inherit_01 p:nth-of-type(1) {
    width: 10%;
}
.table_list .list_nowarp_inherit .list_nowarp_inherit_01 p:nth-of-type(2) {
    width: 90%;
}
.table_list .list_nowarp_inherit .list_nowarp_inherit_02 {
    display: flex;
    font-weight: bolder;
}
.table_list .list_nowarp_inherit .list_nowarp_inherit_02 p:nth-of-type(1) {
    width: 34%;
}
.table_list .list_nowarp_inherit .list_nowarp_inherit_02 p:nth-of-type(2) {
    width: 88%;
}
.table_list .list_nowarp_inherit .list_nowarp_inherit_03 {
    display: flex;
    font-weight: bolder;
}

.table_list .list_nowarp_inherit .list_nowarp_inherit_03 p:nth-of-type(1) {
    width: 14%;
}
.table_list .list_nowarp_inherit .list_nowarp_inherit_03 p:nth-of-type(2) {
    width: 88%;
}
.table_list .list_nowarp_inherit .list_nowarp_inherit_26 {
    display: flex;
    font-weight: bolder;
}
.table_list .list_nowarp_inherit .list_nowarp_inherit_26 p:nth-of-type(1) {
    width: 26%;
}
.table_list .list_nowarp_inherit .list_nowarp_inherit_26 p:nth-of-type(2) {
    width: 88%;
}
.table_list .list_nowarp_inherit .list_nowarp_inherit_21 {
    display: flex;
    font-weight: bolder;
}
.table_list .list_nowarp_inherit .list_nowarp_inherit_21 p:nth-of-type(1) {
    width: 21%;
}
.table_list .list_nowarp_inherit .list_nowarp_inherit_21 p:nth-of-type(2) {
    width: 88%;
}

.table_list .list_nowarp_inherit .list_nowarp_inherit_18 {
    display: flex;
    font-weight: bolder;
}
.table_list .list_nowarp_inherit .list_nowarp_inherit_18 p:nth-of-type(1) {
    width: 18%;
}
.table_list .list_nowarp_inherit .list_nowarp_inherit_18 p:nth-of-type(2) {
    width: 88%;
}

.table_list .list_nowarp_inherit .list_nowarp_inherit_34 {
    display: flex;
    font-weight: bolder;
}

.table_list .list_nowarp_inherit .list_nowarp_inherit_34 p:nth-of-type(1) {
    width: 34%;
}
.table_list .list_nowarp_inherit .list_nowarp_inherit_34 p:nth-of-type(2) {
    width: 88%;
}

.table_list .list_nowarp_inherit .list_nowarp_inherit_43 {
    display: flex;
    font-weight: bolder;
}

.table_list .list_nowarp_inherit .list_nowarp_inherit_43 p:nth-of-type(1) {
    width: 43%;
}
.table_list .list_nowarp_inherit .list_nowarp_inherit_43 p:nth-of-type(2) {
    width: 88%;
}

.table_list .list_nowarp_inherit .list_nowarp_inherit_25 {
    display: flex;
    font-weight: bolder;
}

.table_list .list_nowarp_inherit .list_nowarp_inherit_25 p:nth-of-type(1) {
    width: 25%;
}
.table_list .list_nowarp_inherit .list_nowarp_inherit_25 p:nth-of-type(2) {
    width: 88%;
}

.table_list_uls .list_nowarp {
    display: flex;
    line-height: 35px;
    color: #000;
    font-weight: bolder;
    // font-size: 20px;
}
.table_list_uls .list_nowarp b {
    // font-size: 20px;
    font-weight: bolder;
    color: #000;
}
.table_list_uls .list_nowarp div {
    display: flex;
    width: 50%;
}
.table_list_uls .list_nowarp .list_nowarp_02 {
    width: 46%;
    margin-left: 19px;
}
/*
.sy-expert-detaileTitle{
    cursor: move;
}
.title-title-title{
    cursor: move;
}
.detailContainer_comprehensive_analysis_title{
    cursor: move;
}
*/

.baidu_img_list {
    width: 100%;
    /*height: 100%;*/
}
// .baidu_img_list h3 {
    // display: none;
// }
.baidu_img_list .baidu_list_etxed {
    width: 66%;
    margin-left: 150px;
    margin-bottom: 20px;
}
.baidu_img_list .baidu_list_etxed ul li {
    line-height: 38px;
    width: 100%;
}
.baidu_img_list .baidu_list_etxed ul li div:nth-of-type(1) {
    float: left;
    // font-size: 20px;
    color: #767676;
}
.baidu_img_list .baidu_list_etxed ul li div:nth-of-type(2) {
    width: 100%;
    // font-size: 20px;
    color: #000000;
}
.baidu_title {
    // display: none;
    margin-left: 0px !important;
    margin: 0 auto;
    text-align: center !important;
}

.table_list_uls .new_table_list {
    margin-left: 150px;
    line-height: 38px;
    width: 66%;
    overflow: hidden;
    white-space: normal;
    text-overflow: ellipsis;
}
.table_list_uls .new_table_list .table_list_name {
    // font-size: 20px;
    color: #767676;
}
.table_list_uls .new_table_list .table_list_contont {
    // font-size: 20px;
    color: #000000;
}
.table_list_uls .new_table_list .table_list_contont_indent {
    width: 85%;
    text-indent: 10em;
    margin-top: -38px;
}
.download_btn_world {
    width: 99px;
    height: 87px;
    background: url("@{imgPath}/download_active_icon.png") no-repeat;
    background-size: 100% 100%;
    color: #6ecfd8;
    // font-size: 20px;
    position: absolute;
    bottom: 42px;
    right: 49px;
    text-align: center;
    line-height: 38px;
    cursor: pointer;
    padding-left: 35px;
}
.download_btn_world:hover {
    background: url("@{imgPath}/download_icon.png") no-repeat;
    background-size: 100% 100%;
}
.look-enterprise-dialog table {
    width: 90%;
    border-top: 1px solid #000;
    border-left: 1px solid #000;
    margin: 20px auto;
}
.look-enterprise-dialog table tbody tr {
    float: left;
    width: 60%;
}
.look-enterprise-dialog table tbody tr:nth-child(2n-1) {
    width: 40%;
}
.look-enterprise-dialog table td {
    line-height: 30px;
    color: #000;
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;
}
.look-enterprise-dialog table tr td:nth-child(1) {
    width: 25%;
}
.look-enterprise-dialog table tr td:nth-child(2) {
    color: #666;
}
.event-enterprise-dialog_xiao .search-nearby {
    bottom: 30px;
}
.search-nearby {
    // font-size: 16px;
    font-family: "Microsoft YaHei";
    color: rgb(132, 246, 255);
    text-transform: uppercase;
    z-index: 136;
    background: url("@{imgPath}/zhoubian_icon.png") no-repeat;
    background-size: 100% 100%;
    width: 103px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    position: absolute;
    right: 60px;
    bottom: 10px;
    cursor: pointer;
}
.close-look-dialog {
    background: url("@{imgPath}/close_world.png") no-repeat;
    background-size: 100% 100%;
    width: 55px;
    height: 56px;
    top: 0.5%;
    right: -10px;
    position: absolute;
    z-index: 9999;
}
.look-enterprise-dialog_cont {
    width: 100%;
    height: calc(100% - 304px);
    overflow-y: scroll;
    margin-top: -10px;
    margin-bottom: 100px;
}
.close-look-dialog:hover {
    cursor: pointer;
}
.table_list_uls .new_table_list {
    margin-left: 150px;
    line-height: 38px;
    width: 66%;
    overflow: hidden;
    white-space: normal;
    text-overflow: ellipsis;
}
.table_list_uls .new_table_list .table_list_name {
    // font-size: 20px;
    color: #767676;
}
.table_list_uls .new_table_list .table_list_contont {
    // font-size: 20px;
    color: #000000;
}
.table_list_uls .new_table_list .table_list_contont_indent {
    width: 85%;
    text-indent: 10em;
    margin-top: -38px;
}
/*左-table*/
.enterprise-table {
    // width: 559px;
    // margin-left: 1%;
    // margin-right: 2%;
    max-height: 240px;
    margin-left:8px;
    margin-bottom: 10px;
    border: 1px solid #0096bb;
}
.enterprise-table ul li {
    line-height: 32px;
    border-bottom: 1px solid #0184a5;
    // font-size: 16px;
    display: flex;
}
.enterprise-table ul li:nth-child(2n-1) {
    background: url("@{imgPath}/list_now.png") no-repeat;
    background-size: 100% 100%;
}
.enterprise-table ul li:last-child {
    border-bottom: none;
}
.event-enterprise-dialog_xiao .enterprise-table ul li {
    padding-left: 10px;
}
.enterprise-table ul li label {
    display: block;
    width: 50%;
    color: #75e4f0;
    padding-right: 10px;
    padding-left: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.enterprise-table ul li label.fulllabel {
    width: 91%;
    white-space: inherit;
}
.enterprise-table ul li label:nth-of-type(2) {
    border-left: 1px solid #0184a5;
}
.enterprise-table ul li label span {
    color: #eef9fd;
}
/*等级*/
.risk_level span {
    text-align: center;
    border-radius: 26px;
    padding: 0px 8px;
    color: #fff;
}

.enterprise_basic_right_01 {
    background: #ff0000;
}

.enterprise_basic_right_02 {
    background: #ff8400;
}

.enterprise_basic_right_03 {
    background: #a5a516;
}

.enterprise_basic_right_04 {
    background: #0000ff;
}

.enterprise_basic_right_05 {
    background: #0bd0c9;
}
</style>