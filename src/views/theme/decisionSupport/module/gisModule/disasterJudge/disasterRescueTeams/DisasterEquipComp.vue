<!--力量调度&物资库下钻-->
<template>
    <div class="DisasterPowerDispatch">
        <span class="halflist-back" @click="backParent"></span>
        <div class="loading" v-if="loading">
            <p class="title-panel" style="font-style:italic;">{{ title }}分布</p>
        </div>
        <div v-else>
            <!--统计-->
            <div id="MapDialog">
                <div class="detail">
                    <div class="half-title title-panel">{{ title }}分布</div>
                    <!--这里是面的统计-->
                    <ul class="statisticCount f-tit-h2">
                        <li>
                            共
                            <span class="f-number">{{ total }}</span>
                            <slot name="unit">{{unit}}</slot>
                        </li>
                    </ul>
                </div>
            </div>
            <!--列表-->
            <div class="listDistrict">
                <div class="listDistrict_title">
                    <span class="f-tit-h2">{{ title }}列表</span>
                    <i
                            @click="FnMinimize"
                            :class="minimize? 'panel_switch': 'panel_switch panel-switch-reverse'"
                    ></i>
                </div>
                <div v-show="minimize">
                    <div class="listDistrict-flex-box">
                        <div class="listDistrict-input">
                            <div class="listDistrict-input-content">
                                <el-input class="csmMyInput" type="text" v-model.trim="inputWord">
                                    <i slot="suffix" class="iconSelf_search"></i>
                                </el-input>
                            </div>
                        </div>
                    </div>
                    <!-- 列表每一行-->
                    <div class="nodata" v-if="!listDataAll.length">
                        <img src="../../../../../../../assets/img/default/panel/noData.png" alt srcset/>
                    </div>
                    <div v-else>
                        <div class="listBoxScrollbar">
                            <ul class="listBoxSingle">
                                <li
                                        class="f-txt-com listBoxSingle_li"
                                        v-for="(item, index) in listDataAll"
                                        :key="index"
                                        @click="clickHandler(item,index)"
                                        @mouseenter="hoverHandler(index)"
                                        @mouseleave="hoverHandlerLeave"
                                        :class="[listBgClick === index ? 'classList' : '']"
                                >
                                    <p class="teamName">
                                        <i class="orderNum">{{item.num}}</i>
                                        {{item.equiptypename}}{{item.spmodel}}
                                    </p>
                                    <p class="teamDistance">
                                        <em class="typeTitles">数量：</em>
                                        <span>
                      <i class="num-color">{{item.equipnum}}</i>{{unit}}
                    </span>
                                    </p>
                                    <p class="teamDistance">
                                        <em class="typeTitles">队长：</em>
                                        <span>
                      <i class="num-color">{{item.leader}}</i>
                    </span>
                                    </p>
                                    <p class="teamDistance">
                                        <em class="typeTitles">距离：</em>
                                        <span>
                      <i class="num-color">{{item._distance}}</i>km
                    </span>
                                    </p>
                                </li>
                            </ul>
                            <div class="felx_box_statistics" v-if="sourceTypeCodeObj && sourceTypeCodeObj.isShow">
                                <div class="f-txt-com">
                                    <span>数据来源：{{(sourceTypeCodeObj && sourceTypeCodeObj.sourceData && sourceTypeCodeObj.sourceData.attrOrgin)||('暂无数据')}}</span>
                                    <br/>
                                    <span>数据更新时间：{{(sourceTypeCodeObj && sourceTypeCodeObj.sourceData && sourceTypeCodeObj.sourceData.attrTime.split(' ')[0])||('暂无数据')}}</span>
                                </div>
                            </div>
                        </div>
                        <!-- 分页-->
                        <el-pagination
                                v-if="listDataAll.length !== 0"
                                class="constomMyElPage"
                                small
                                :pager-count="5"
                                :current-page.sync="paginationObj.currentPage"
                                @current-change="handleCurrentChange"
                                :page-size="paginationObj.pageSize"
                                layout="prev, pager, next"
                                :total="paginationObj.total"
                        ></el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
  import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
  // 数据来源接口,
  import {dataSourcesServer} from '@/api/installServer';
  // 数据来源参数
  import {dataSourceConfig} from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterJudge';

  @Component({
    name: 'DisasterEquipComp',
    components: {},
  })
  export default class DisasterEquipComp extends Vue {
    // 接收左侧列表是否是隐藏状态,再打开的时候重新加载一下高度
    @Prop({default: false}) public isShow!: boolean;
    @Prop() public rescueTeamHomeData: any;
    // 定义 暴漏hover联动GIS的方法
    @Prop({default: ''}) private FnHoverItemEvent: any;
    // 鼠标移出销毁方法
    @Prop() private FnMouserLeave: any;
    private listBgClick: any = -1;
    private viewResData: any = {
      total: '0',
    };
    private loading: boolean = true;
    private viewRenderData: any = [];
    private title: string = '';
    private sourceTypeCodeObj: any;
    // 定义 input关键字
    private inputWord: string = '';
    private total: number = 0;
    private listDataAll: any = [];
    private minimize: any = true;
    private listData: any = [];
    private moduleType: any = []; // 已选的队伍类型
    private cacheListTotalData: any = []; // 搜索筛选后的数据
    private unit = '';
    // 分页
    private paginationObj: any = {
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
    private halflistHeight: any = '';
    private searchDomHeight: any = '';
    /*------公共------*/

    // gis方法
    private getComponent() {
      const factory = this.$ioc.resolve('GISFactory-map');
      const component = factory.disasterJudgeFactory.getComponent('EquipComp');
      return component;
    }

    // 返回一级页面
    private backParent() {
      this.$emit('backParent');
      this.messsageBus.$emit('densePlaces', true);
    }

    /*------统计相关---------*/

    // 监听烈度圈或经验圈修改时重新请求数据
    @Watch('$store.state.controlMoudle.mapCircleQueryType')
    private updateTeam() {
      this.loading = true;
      this.paginationObj.currentPage = 1;
      // 在gis哪里获取当前经验圈或者烈度圈信息
      this.getData();
    }

    // 获取所有数据
    private async getData() {
      const component = this.getComponent();
      this.listData = await component.getDataList(this.moduleType);
      component.showResource(this.moduleType);
      this.changeFiltrate();
      this.loading = false;
    }

    /*---------------列表相关------------*/

    // 搜索框
    @Watch('inputWord')
    private changeFiltrate(): void {
      this.listDataAll = [];
      let listAll: any = [];
      const inputWord: string = this.inputWord.trim();
      if (inputWord) {
        // 只有input有值
        for (const iterator of this.listData) {
          if (iterator.equiptypename.includes(inputWord) || iterator.spmodel.includes(inputWord)) {
            listAll.push(iterator);
          }
        }
      } else {
        // 都没有
        listAll = JSON.parse(JSON.stringify(this.listData));
      }
      this.total = listAll.length;
      this.cacheListTotalData = this.setNum(listAll);
      this.frentPag();
    }

    private setNum(data: any) {
      const list: any[] = data.map((v: any, index: number) => {
        v.num = index + 1;
        return v;
      });
      return list;
    }

    // 数据加载完成,dom更改后发送事件设置列表高度
    private updated() {
      this.ListHeightFn();
    }

    private ListHeightFn() {
      this.$nextTick(() => {
        this.halflistHeight = $('#MapDialog').height(); // 统计面板高
        this.searchDomHeight = $('.listDistrict-flex-box').height(); // 搜索/下拉的高
        // 滚动条的高 = 总高-统计面板高-标题/搜索/分页的高
        $('.listDistrict .listBoxScrollbar').css(
          'height',
          855 - this.halflistHeight - this.searchDomHeight - 115 + 'px',
        );
      });
    }

    // 当展开的时候重新加载高度信息
    @Watch('isShow')
    private initListHeightFn(val: any): void {
      if (val) {
        this.ListHeightFn();
      }
    }

    // 列表点击
    private clickHandler(item: any, index: number) {
      this.getComponent().openPopup(this.moduleType[0], item.rescueid);
    }

    // 分页点击
    private handleCurrentChange(val: number) {
      this.paginationObj.currentPage = val;
      this.changeFiltrate();
    }

    private frentPag() {
      this.paginationObj.total = this.cacheListTotalData.length;
      this.listDataAll = this.cacheListTotalData.slice(
        (this.paginationObj.currentPage - 1) * this.paginationObj.pageSize,
        this.paginationObj.pageSize * this.paginationObj.currentPage,
      );
    }

    // 获取数据来源
    private FnSourceTypeCode() {
      this.sourceTypeCodeObj = dataSourceConfig('getEquipmentSource');
      dataSourcesServer
        .getDataSourceServer({typeCode: this.sourceTypeCodeObj.typeCode})
        .then((data: any) => {
          const res = data;
          this.sourceTypeCodeObj.sourceData = res.data[0];
        });
    }

    // 列表展开收起
    private FnMinimize() {
      this.minimize = !this.minimize;
    }

    private hoverHandler(index: number) {
      if (this.FnHoverItemEvent) {
        this.FnHoverItemEvent(this.moduleType[0], this.cacheListTotalData[index + (this.paginationObj.currentPage - 1) * this.paginationObj.pageSize], '', '',
        );
      }
    }

    private hoverHandlerLeave() {
      if (this.FnHoverItemEvent) {
        this.FnMouserLeave();
      }
    }

    private mounted() {
      // 初始化参数
      this.moduleType = [this.rescueTeamHomeData.curNumItem.codeType]; // 当前所选的类型
      this.title = this.rescueTeamHomeData.curNumItem.name;
      this.unit = this.rescueTeamHomeData.curNumItem.teamUnit; // 单位
      this.updateTeam();
      this.FnSourceTypeCode();
      this.messsageBus.off('ranges-refresh');
      this.messsageBus.on('ranges-refresh', () => {
        this.updateTeam();
      });
    }

    private beforeDestroy() {
      const component: any = this.getComponent();
      component.clear();
      this.messsageBus.off('ranges-refresh');
    }
  }
</script>
<style lang="less" scoped>
    .typeTitles {
        color: rgb(128, 173, 207);
        font-style: normal;
    }

    .num-color {
        font-style: normal;
        color: #27e8ff;
    }

    .DisasterPowerDispatch {
        width: 365px;
        height: 855px;
        padding: 5px 15px;
        border-radius: 5px;
        position: relative;

        .loading {
            color: #fff;
            background: url(../../../../../../../assets/img/halfScreen/halflist/loading.gif) no-repeat 33px 255px;
            color: #d2e1ec;
            height: 100%;

            p {
                padding-left: 5px;
                margin: 0;
                transform: translateY(-8px);
            }

            center {
                margin-top: 120%;
            }
        }

        /* 统计总数 start*/

        .statisticCount {
            padding-left: 10px;
            margin: 5px 0 0 0;
            background: url('../../../../../../../assets/img/halfScreen/halflist/totalbg.png') 0 0 no-repeat;
            background-size: 100% 100%;

            li {
                list-style: none;
                cursor: pointer;
                color: #ffffff;
                font-weight: bolder;
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: flex-start;

                span {
                    cursor: pointer;
                    margin: 0 10px;
                    color: yellow;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                }
            }
        }

        /* 统计列表样式  start*/

        .statisticList {
            padding-top: 5px;

            &_li {
                display: flex;
                justify-content: space-between;
                color: #ffffff;
                background: url('../../../../../../../assets/img/halfScreen/halflist/listbg.png')
                    no-repeat -5px 50%;
                background-size: 100% 100%;
                padding: 10px;
                box-sizing: border-box;
                margin: 5px 0;
                cursor: pointer;

                &.checkSty,
                &:hover {
                    background-image: url('../../../../../../../assets/img/halfScreen/halflist/listbghover.png');
                }

                & + & {
                    margin-top: 5px;
                }

                &_textWarning {
                    color: yellow;
                    padding-right: 5px;
                }
            }
        }

        /* 统计列表样式  end*/

        .halflist-back {
            width: 61px;
            height: 25px;
            position: absolute;
            top: 10px;
            right: 6px;
            color: #338af8;
            cursor: pointer;
            z-index: 1;
            background: url('../../../../../../../assets/img/default/panel/toBack.png') no-repeat 0px 70%;
            background-size: 100% 100%;

            &:hover {
                background-image: url('../../../../../../../assets/img/default/panel/toBack_h.png');
            }
        }
    }

    // 统计面板
    #MapDialog {
        height: auto;

        .half-title {
            height: 37px;
            font-style: italic;
            margin-top: -10px;
        }
    }

    // 列表
    .listDistrict {
        .listDistrict-flex-box {
            display: block;
            width: 100%;

            .selcetIconTop {
                display: inline-block;
                width: 35px;
                height: 30px;
                background: url('../../../../../../../assets/img/halfScreen/halflist/select2bg.png') no-repeat;
                background-size: 100% 100%;
                margin: 5px 5px 0 0;
                cursor: pointer;
            }

            .selcetIconBot {
                display: inline-block;
                width: 35px;
                height: 30px;
                background: url('../../../../../../../assets/img/halfScreen/halflist/selcet1bg.png') no-repeat;
                background-size: 100% 100%;
                margin: 5px 5px 0 0;
                cursor: pointer;
                transform: rotate(180deg);
            }

            input::-webkit-input-placeholder {
                color: #c4d7da;
            }

            input:-moz-placeholder {
                color: #c4d7da;
            }

            input:-ms-input-placeholder {
                color: #c4d7da;
            }

            .listDistrict-input-content {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .listDistrict-icon {
                width: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 32px;
                cursor: pointer;
            }
        }

        .listDistrict-input {
            width: 100%;
            height: 40px;
            display: flex;
            justify-content: flex-start;
            background-size: 100% 100%;
            color: #3cc0ec;
            margin: 10px 0;
        }

        .listDistrict-input-choose {
            width: 100%;
            height: 40px;
            display: flex;
            justify-content: flex-start;
            background: url(../../../../../../../assets/img/halfScreen/halflist/selcetHoverbg.png) no-repeat;
            background-size: 100% 100%;
            color: #3cc0ec;
            margin: 10px 0;

            .selcetIconTop {
                display: inline-block;
                width: 35px;
                height: 30px;
                background: url('../../../../../../../assets/img/halfScreen/halflist/select2bg.png') no-repeat;
                background-size: 100% 100%;
                margin: 5px 5px 0 0;
                cursor: pointer;
            }

            .selcetIconBot {
                display: inline-block;
                width: 35px;
                height: 30px;
                background: url('../../../../../../../assets/img/halfScreen/halflist/selcet1bg.png') no-repeat;
                background-size: 100% 100%;
                margin: 5px 5px 0 0;
                cursor: pointer;
                transform: rotate(180deg);
            }

            input::-webkit-input-placeholder {
                color: #c4d7da;
            }

            input:-moz-placeholder {
                color: #c4d7da;
            }

            input:-ms-input-placeholder {
                color: #c4d7da;
            }

            .listDistrict-input-content {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .listDistrict-icon {
                width: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }
        }

        .selectList {
            height: 319px !important;
            position: absolute;
            top: 164px;
            z-index: 20;
            background-color: #071022 !important;
            box-shadow: 4px 6px 16px 0px #001931;
            background: url('../../../../../../../assets/img/halfScreen/eventAndTopics/select_bg.png') no-repeat;
            background-size: 100% 100%;
            width: 100%;
            padding-bottom: 10px;
            padding-top: 10px;
        }

        .listDistrict-option {
            padding: 5px 0 0 10px;
            line-height: 30px;

            .selectBtn {
                display: flex;
                justify-content: space-around;

                li {
                    width: 104px;
                    height: 38px;
                    font-family: MicrosoftYaHei;
                    text-align: center;
                    line-height: 38px;
                    cursor: pointer;
                }

                li:nth-of-type(1) {
                    background-image: linear-gradient(180deg,
                    rgba(249, 216, 72, 0.54) 0%,
                    rgba(243, 177, 61, 0.54) 100%),
                    linear-gradient(#061418, #061418);
                    background-blend-mode: normal, normal;
                    box-shadow: 0px 2px 4px 0px rgba(95, 59, 16, 0.45);
                    border-radius: 3px;
                    border: solid 1px #fbe663;
                    opacity: 0.8;
                    color: #fefefe;
                }

                li:nth-of-type(2) {
                    background-image: linear-gradient(-3deg,
                    #357ac1 0%,
                    rgba(72, 161, 204, 0.29) 53%,
                    rgba(91, 199, 214, 0.55) 100%),
                    linear-gradient(#061418, #061418);
                    background-blend-mode: normal, normal;
                    box-shadow: 1px 2px 4px 0px rgba(91, 199, 214, 0.82);
                    border-radius: 3px;
                    border: solid 1px #5bc7d6;
                    color: #a0f4fd;
                }
            }
        }
    }

    .el-tree-node__content {
        padding-left: 0 !important;
    }

    .listDistrict_title {
        color: #67e1fb;
        letter-spacing: 1px;
        font-weight: normal;
        line-height: 60px;
        display: flex;

        &:after {
            content: '';
            background: url(../../../../../../../assets/img/halfScreen/halflist/titlexian.png) 50% 0 no-repeat;
            // background: url(../../../assets/img/halfScreen/halflist/titlebg.png) 50% 0 no-repeat;
            position: absolute;
            width: 100%;
            height: 23px;
            top: 54px;
            left: 0;
        }

        .panel_switch {
            width: 34px;
            height: 29px;
            background-size: 100% 100%;
            position: absolute;
            right: 0px;
            top: 15px;
            cursor: pointer;
            background: url('../../../../../../../assets/img/halfScreen/halflist/open.png') 50% 50% no-repeat;
            transition: transform 0.3s;
        }

        .panel_switch.panel-switch-reverse {
            transform: scale(1, -1);
        }
    }

    .classList {
        color: yellow;
    }

    .nodata {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .felx_box_statistics {
        width: 100%;
        display: block;
        color: #8cafd0;
        font-weight: 500;
        bottom: 40px;
        top: unset;
        position: unset;
    }

    .listBoxScrollbar {
        overflow: hidden;
        overflow-y: scroll;
    }

    .listBoxSingle {
        &_li {
            cursor: pointer;
            color: #ffffff;
            padding: 10px 0px;
            margin: 10px 0 0 0;
            background: url('../../../../../../../assets/img/halfScreen/halflist/boxListBgIcon.png') no-repeat 0 0;
            background-size: 100% 100%;

            .teamName {
                font-family: MicrosoftYaHei;
                font-weight: normal;
                font-stretch: normal;
                color: #e8f4fe;
                padding-bottom: 10px;
            }

            .teamDistance {
                font-weight: normal;
                color: #e8f4fe;

                font {
                    font-family: Impact;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 1;
                    color: #27e8ff;
                    padding-right: 10px;
                }
            }

            .teamType {
                font-weight: normal;
                color: #f7fdff;

                font {
                    height: 23px;
                    font-family: MicrosoftYaHei;
                    font-weight: normal;
                    font-stretch: normal;
                    color: #8cafd0;
                }
            }
        }

        .checkSty {
            background: url(../../../../../../../assets/img/halfScreen/halflist/listbghover.png) no-repeat;
        }
    }
</style>
<style lang="less">
    .DisasterPowerDispatch .orderNum {
        background: rgba(71, 215, 162, 0.2);
        border: 1px #47d7a2 solid;
        border-radius: 5px;
        color: #fff;
        font-size: 24px;
        padding: 0 5px;
        display: inline-block;
        font-style: normal;
        margin-right: 10px;
    }

    .DisasterPowerDispatch .el-scrollbar__bar.is-vertical > div {
        background-image: linear-gradient(0deg,
        #0a7ccc 0%,
        #06b4d1 52%,
        #02ebd5 100%);
    }

    .DisasterPowerDispatch .el-scrollbar__thumb:hover {
        background-image: linear-gradient(0deg,
        #0a7ccc 0%,
        #06b4d1 52%,
        #02ebd5 100%);
    }

    /*修改滚动条样式*/
    .listBoxScrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        /**/
    }

    .listBoxScrollbar::-webkit-scrollbar-thumb {
        background-image: linear-gradient(0deg,
        #0a7ccc 0%,
        #06b4d1 52%,
        #02ebd5 100%);
        border-radius: 5px;
    }

    .listBoxScrollbar::-webkit-scrollbar-thumb:hover {
        background-image: linear-gradient(0deg,
        #0a7ccc 0%,
        #06b4d1 52%,
        #02ebd5 100%);
    }

    .listDistrict-input-content .el-input--suffix .el-input__inner {
        padding-right: 45px;
    }
</style>
