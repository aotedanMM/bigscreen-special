<template>
    <!--    <div class="CompanyDetail" >-->
    <div class="ProgressDetails" v-if="isProgressDetails">
        <p class="title"><span>进展情况</span><i class="closeBtn" @click="closeProgressDetailsFn"></i></p>
        <div class="progressDetailsContent">
            <p><span class="situation">{{processType(listDatas.type)}}</span><span class="time">{{listDatas.progressTime}}</span>
            </p>
            <!--                <el-scrollbar class="cmp-scrollbar-y"-->
            <!--                              style="height:100%;">-->
            <p class="department"><span>({{listDatas.sendDept || ''}})</span>{{listDatas.progressCont}}</p>
            <!--                </el-scrollbar>-->
        </div>
    </div>
    <!--    </div>-->

</template>
<script lang="ts">
  import {Component, Vue, Prop, Watch} from 'vue-property-decorator';

  @Component({
    name: 'ProgressDetails',
  })
  export default class ProgressDetails extends Vue {
    private listDatas: any = '';
    private isProgressDetails = false;

    // 字段过滤器
    private processType(type: string) {
      switch (type) {
        case '0' :
          return '领导批示';
        case '1' :
          return '救援进展';
        case '2' :
          return '灾情上报';
        case '3' :
          return '处置建议';
        case '4' :
          return '灾情评估';
      }
    }

    // 接收详情数据
    private init() {
      this.messsageBus.on('firstDatas', (data: any) => {
        this.listDatas = data;
        this.isProgressDetails = true;
      });
      this.messsageBus.on('listDatas', (data: any) => {
        this.listDatas = data;
        this.isProgressDetails = true;
      });
      this.messsageBus.on('closeProgressDetails', () => {
        this.isProgressDetails = false;
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
    .CompanyDetail {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.85);
        position: absolute;
        left: 0;
        top: 0;
        z-index: 300;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .ProgressDetails:before {
        content: '';
        display: inline-block;
        background: url("../../../../../../assets/img/gisModule/PopulationFeverBox/botBg.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        bottom: -78px;
        height: 78px;
        width: 959px;
    }

    .ProgressDetails {
        position: absolute;
        margin: 0px;
        display: block;
        width: 959px;
        top: 253px;
        left: 22%;
        max-height: 550px;
        min-height: 300px;
        z-index: 1120;
        background: url("../../../../../../assets/img/gisModule/PopulationFeverBox/centerBg.png") no-repeat;
        background-size: 100% 100%;

        .closeBtn {
            display: inline-block;
            width: 90px;
            height: 48px;
            background: url("../../../../../../assets/img/gisModule/PopulationFeverBox/closeBtn.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            right: 15px;
            top: 8px;
            cursor: pointer;

            &:hover {
                background-image: url('../../../../../../assets/img/gisModule/PopulationFeverBox/closeHover.png')
            }
        }

        .title {
            font-family: MicrosoftYaHei;
            font-size: 30px;
            font-stretch: normal;
            line-height: 90px;
            letter-spacing: 1px;
            color: #00e4ff;
            /*padding-left: 55px;*/
            background: url("../../../../../../assets/img/gisModule/PopulationFeverBox/topbg.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            top: -78px;
            height: 78px;
            width: 959px;

            span {
                padding-left: 55px;
            }
        }

        .progressDetailsContent {
            margin-left: 38px;
            margin-top: 20px;
            margin-right: 35px;

            .situation {
                color: #ffffff;
                // background: #9d0808;
                background: #278817;
                padding: 5px 10px;
                font-size: 32px;
                border-radius: 7px;
            }

            .time {
                // color: #ffffff;
                color: #adefff;
                font-size: 32px;
                margin-left: 30px;
            }

            .department {
                color: #ffffff;
                font-size: 32px;
                margin: 0;
                min-height: 200px;
                max-height: 450px;
                overflow: auto;

                span {
                    color: #00ffed;
                    font-size: 32px;
                    margin-right: 20px;
                    height: 450px;
                }
            }

            .department::-webkit-scrollbar {
                width: 10px;
                height: 10px;
                /**/
            }

            .department::-webkit-scrollbar-thumb {
                background-image: linear-gradient(0deg,
                #0a7ccc 0%,
                #06b4d1 52%,
                #02ebd5 100%);
                border-radius: 5px;
            }

            .department::-webkit-scrollbar-thumb:hover {
                background-image: linear-gradient(0deg,
                #0a7ccc 0%,
                #06b4d1 52%,
                #02ebd5 100%);
            }
        }
    }
</style>
<style>
    .ProgressDetails .el-scrollbar__bar.is-vertical > div {
        background-image: linear-gradient(0deg,
        #0a7ccc 0%,
        #06b4d1 52%,
        #02ebd5 100%);
        height: 194px;
    }

    .ProgressDetails .el-scrollbar__thumb:hover {
        background-image: linear-gradient(0deg,
        #0a7ccc 0%,
        #06b4d1 52%,
        #02ebd5 100%);
    }
</style>
