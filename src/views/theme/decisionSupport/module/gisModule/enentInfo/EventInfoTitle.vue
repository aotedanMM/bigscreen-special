<template>
    <div>
        <div class="EventInfoTitle" style="display: block;">
            <div class="dialong_bg_pao_title_txt">
                <div class="paomadeng_box"
                     id="paomadeng_box"
                     @mousemove.stop="mousemoveTitleFn"
                     @mouseleave.stop="mouseleaveTitleFn"
                     @click="title_dialong"
                     :style="'width:'+ (($store.state.configModel.config.EmergencyResponse && $store.state.configModel.config.EmergencyResponse.isShow) ? '270px' : '100%')">
                    <p
                            :style="'left:'+num+'px'"
                            class="dialong_bg_pao_title_txt_child"
                            id="dialong_bg_pao_title_txt_child"

                    >
                        <!-- <span v-html="strList.EventTit"> <span></span></span> -->
                        <span><span v-html="strListEventTit"></span><span class="Abnormal_title">{{strListEventTitZhenji}}</span><span>{{strListEventTitJi}}</span><span>{{strListEventTitShendan}}<b
                                class="Abnormal_title">{{strListEventTitShendu}}</b></span></span>
                    </p>
                </div>
            </div>
        </div>
        <!-- v-if="$store.state.configModel.config.EmergencyResponse && $store.state.configModel.config.EmergencyResponse.isShow" -->
        <EmergencyResponse
                ></EmergencyResponse>
        <div class="NewEventInformation" v-show="isShow">
            <div class="NewEventInformation_dialong">
                <!-- <div class="close_EventInformation" @click="close_EventInformation"></div> -->
                <p class="title">
                    <!-- <span class="collecteBtn f-txt-com" v-if="CollectionIconTrue"  @click="CancelCollectionBtn"><i class="collecte-icon collecte-icon-collected"></i> <span>已收藏</span></span> -->
                    <!-- <span class="collecteBtn f-txt-com" v-if="CollectionIconFalse"  @click="CollectionBtn"><i class="collecte-icon collecte-icon-collecte"></i> <span>收藏</span></span> -->
                    <span class="title_span title-panel">事件信息</span>
                    <i class="closeBtn" @click="close_EventInformation"></i>

                </p>
                <!--                <el-scrollbar class="cmp-scrollbar-y" style="height:100%;width:98%">-->
                <!--    注释了el的滚动条，用了原生的滚动条            -->
                <div class="EventInformation_CareatList">
                    <div class="EventInformation_list"><p>事件标题：<span><span v-html="strListEventTit"></span><span
                            class="Abnormal_title">{{strListEventTitZhenji}}</span><span>{{strListEventTitJi}}</span><span>{{strListEventTitShendan}}<b
                            class="Abnormal_title">{{strListEventTitShendu}}</b></span></span></p></div>
                    <div class="EventInformation_list" id='EventInformation_list1'>
                        <p>事发时间：<span class="list_notColor">{{EventDate[0]}}</span>年<span class="list_notColor">{{EventDate[1]}}</span>月<span
                                class="list_notColor">{{EventDate[2]}}</span>日<span class="list_notColor">{{EventTimes[0]}}</span>时<span
                                class="list_notColor">{{EventTimes[1]}}</span>分<span class="list_notColor">{{EventTimes[2]}}</span>秒
                        </p></div>
                    <div class="EventInformation_list"><p>地点：{{strList.EventAddr}}</p></div>
                    <!-- <div class="EventInformation_list"><p>震级：{{strList.EqLevel}}</p></div> -->
                    <div class="EventInformation_list"><p>经度：<span class="list_notColor">{{(strListEventLon).toFixed(6)}}</span>，纬度：<span
                            class="list_notColor">{{(strListEventLat).toFixed(6)}}</span></p></div>
                    <!-- <div class="EventInformation_list"><p>事件描述：{{strList.EventDesc}}</p></div> -->
                    <div class="EventInformation_list" v-show="isnormal"><p>事件描述：<span
                            v-html="strList.EventDesc"></span></p></div>
                    <div class="EventInformation_list" v-show="Abnormal"><p>事件描述：<span v-html="strListEventDesc"></span><span
                            class="zhenji">{{strListEventDescZhenji}}</span>{{strListEventDescZhenjiCont}}{{strListEventDescZhenshen}}<span
                            class="zhenji">{{strListEventDescShendu}}</span></p></div>
                </div>
                <!--                </el-scrollbar>-->
            </div>
        </div>
    </div>

</template>
<script lang="ts">
  import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
  import {eventInfoServer} from '@/api/installServer';
  // 应急响应
  import EmergencyResponse from '@/components/feature/flood/EmergencyResponse/EmergencyResponse.vue';

  @Component({
    name: 'EventInfoTitle',
    components: {
      EmergencyResponse,
    },
  })
  export default class EventInfoTitle extends Vue {
    private strList: any = {};
    private syTimer: any = null;
    private num: any = 0;
    private isShow: any = false;
    private EventTime: any = '';
    private detailsBtn: boolean = false;
    private EventDate: any = '';
    private EventTimes: any = '';
    private eventAndTopics: any = '';
    private strListEventLon: number = 0;
    private strListEventLat: number = 0;
    private strListEventDesc: any = '';
    private strListEventDescZhenji: any = '';
    private strListEventDescZhenjiCont: any = '';
    private strListEventDescShendu: any = '';
    private strListEventDescZhenshen: any = '';
    private isnormal: boolean = false;
    private Abnormal: boolean = false;
    private strListEventTit: any = '';
    private strListEventTitJi: any = '';
    private strListEventTitZhenji: any = '';
    private strListEventTitShendu: any = '';
    private strListEventTitShendan: any = '';
    private CollectionList: any = '';
    private CollectionIconTrue: boolean = false;
    private CollectionIconFalse: boolean = false;

    /**
     * 当事件信息发生改变的时候 获取最新的信息
     * */
    @Watch('$store.state.eventPushStore.eventLocation', {deep: true})
    private changeEventLocation(val: any): void {
      /**
       * 推送的时候才做修改
       * */
      if (val.curLocationKey === 'NEW_POPULATIONFEVE') {
        this.eventChange();
      }
    }

    @Watch('$store.state.eventPushStore.eventId')
    private eventChange() {
      this.strList = this.$store.state.eventPushStore.eventLocation;
      // console.log(this.strList);
      this.num = 0;
      this.getData();
      this.timeConversion();
    }

    private getData() {
      clearInterval(this.syTimer);
      $('.dialong_bg_pao_title_txt_child').css({left: '0px', position: 'static'});
      this.strListEventTit = this.strList.EventTit;
      if ((this.strListEventTit).indexOf('发生') !== -1 && (this.strListEventTit).indexOf('深度') !== -1 && (this.strListEventTit).indexOf('级') !== -1) {
        const str = this.strListEventTit.match(/发生(\S*)级/)[1];
        const str1 = this.strListEventTit.match(/深度(\S*)千米/)[1];
        const strListEventTitFa = this.strListEventTit.split('发生');
        const strListEventTitJinei = this.strListEventTit.split('级');
        this.strListEventTitZhenji = str;
        this.strListEventTit = strListEventTitFa[0] + '发生';
        this.strListEventTitShendu = str1 + '千米';
        this.strListEventTitShendan = '级地震，震源深度';

      } else {
        if ((this.strListEventTit).indexOf('发生') !== -1 && (this.strListEventTit).indexOf('级') !== -1) {
          const str = this.strListEventTit.match(/发生(\S*)级/)[1];
          const strListEventTitFa = this.strListEventTit.split('发生');
          const strListEventTitJinei = this.strListEventTit.split('级');
          this.strListEventTitZhenji = str + '级';
          this.strListEventTit = strListEventTitFa[0] + '发生';
          this.strListEventTitJi = strListEventTitJinei[1];
        }
      }
      if (this.strList.EventTit.length < 5) {
        $('.EventInfoTitle').css('width', '543px');
      } else {
        $('.EventInfoTitle').css('width', '543px');
        if (this.strList.EventTit.length >= 10) {
          $('.dialong_bg_pao_title_txt_child').css('position', 'absolute');
          if (!this.syTimer) {
            clearInterval(this.syTimer);
          }
          this.syTimer = setInterval(this.move, 20);
        }
      }
    }

    private timeConversion() {
      if (this.strList.EventTime) {
        this.EventTime = this.strList.EventTime;
        const eventTimes = this.strList.EventTimes;
        const date = eventTimes.split(' ')[0].split('-');
        const time = eventTimes.split(' ')[1].split(':');
        this.EventDate = date;
        this.EventTimes = time;
      } else if (this.strList.EventTimes) {
        const eventTimes = this.strList.EventTimes;
        const date = eventTimes.split(' ')[0].split('-');
        const time = eventTimes.split(' ')[1].split(':');
        this.EventDate = date;
        this.EventTimes = time;
        this.EventTime = date[0] + '年' + date[1] + '月' + date[2] + '日' + time[0] + '时' + time[1] + '分';
      } else {
        const EventTime = '';
      }
    }

    private move() {
      const oUl: any = document.getElementById('paomadeng_box');
      const childEl: any = document.getElementById('dialong_bg_pao_title_txt_child');
      const elWidth = childEl.offsetWidth;
      const oUlWidth = oUl.offsetWidth;
      this.num--;
      if (this.num <= -elWidth) {
        this.num = oUlWidth;
      }
    }

    // 鼠标移入标题
    private mousemoveTitleFn() {
      clearInterval(this.syTimer);
    }

    // 鼠标移出
    private mouseleaveTitleFn() {
      this.syTimer = setInterval(this.move, 20);
    }

    // 点击标题弹出新的事件信息
    private title_dialong() {

      // 判断是否显示收藏按钮
      const CollectionIs = {
        userName: this.$route.query.loginName,
        eventInfoId: this.strList.eventId,
      };
      eventInfoServer.getSearchCollection(CollectionIs).then((res: any) => {
        if (res.data === true) {
          this.CollectionIconFalse = false; // 显示未收藏
          this.CollectionIconTrue = true; // 显示已收藏
        } else {
          this.CollectionIconFalse = true; // 显示未收藏
          this.CollectionIconTrue = false; // 显示已收藏
        }
      });

      this.isShow = true;
      // console.log(this.strList);
      this.strListEventLon = parseFloat(this.strList.EventLon);
      this.strListEventLat = parseFloat(this.strList.EventLat);

      this.timeConversion();
      this.eventAndTopics = document.getElementById('eventAndTopics-box');
      this.eventAndTopics.style.zIndex = '0';
      this.strListEventDesc = this.strList.EventDesc;
      if ((this.strListEventDesc).indexOf('地震') === -1) {
        this.isnormal = true;
        this.Abnormal = false;
      } else {
        if ((this.strListEventDesc).indexOf('发生') !== -1 && (this.strListEventDesc).indexOf('深度') !== -1 && (this.strListEventDesc).indexOf('级') !== -1) {
          console.log((this.strListEventDesc).indexOf('发生') !== -1, (this.strListEventDesc).indexOf('深度') !== -1, (this.strListEventDesc).indexOf('级') !== -1);
          const str = this.strListEventDesc.match(/发生(\S*)级/)[1];
          const str1 = this.strListEventDesc.match(/深度(\S*)千米/)[1];
          if (str !== '' && str1 !== '') {
            this.Abnormal = true;
            this.isnormal = false;
          } else {
            this.isnormal = true;
            this.Abnormal = false;
          }
          const newtitle = this.strListEventDesc.split('发生');
          const newtitle1 = this.strListEventDesc.split('级');
          const newtitle2 = this.strListEventDesc.split('深度');
          const newtitle3 = this.strListEventDesc.split('千米');
          const zhenghe = newtitle[0] + '发生' + str + '级' + newtitle1[1];
          this.strListEventDesc = newtitle[0] + '发生';
          this.strListEventDescZhenji = str + '级';
          this.strListEventDescShendu = str1 + '千米。';
          this.strListEventDescZhenshen = '地震，震源深度';
        } else if ((this.strListEventDesc).indexOf('发生') !== -1 && (this.strListEventDesc).indexOf('级') !== -1) {
          const str = this.strListEventDesc.match(/发生(\S*)级/)[1];
          if (str !== '') {
            this.Abnormal = true;
            this.isnormal = false;
          } else {
            this.isnormal = true;
            this.Abnormal = false;
          }
          const newtitle = this.strListEventDesc.split('发生');
          const newtitle1 = this.strListEventDesc.split('级');
          this.strListEventDesc = newtitle[0] + '发生';
          this.strListEventDescZhenji = str + '级';
          this.strListEventDescZhenjiCont = newtitle1[1];
        } else {
          this.isnormal = true;
          this.Abnormal = false;
        }

      }
    }

    // 点击标题弹出新的事件信息
    private close_EventInformation() {
      this.isShow = false;
      this.eventAndTopics.style.zIndex = '4';
    }

    // 点击收藏按钮
    private CollectionBtn() {
      console.log(this);
      this.CollectionList = {
        userNameCollect: this.$route.query.loginName,
        eventInfoId: this.strList.eventId,
      };
      eventInfoServer.getAddCollection(this.CollectionList).then((res: any) => {
        if (res.data) {
          if (Number(res.data.collection) === 1) {
            this.CollectionIconFalse = false; // 显示未收藏
            this.CollectionIconTrue = true; // 显示已收藏
          } else {
            this.CollectionIconFalse = true; // 显示未收藏
            this.CollectionIconTrue = false; // 显示已收藏
          }
        }
      });
    }

    // 点击取消收藏按钮

    private CancelCollectionBtn() {
      console.log(this);
      this.CollectionList = {
        userNameCollect: this.$route.query.loginName,
        eventInfoId: this.strList.eventId,
      };
      eventInfoServer.getDeleteCollection(this.CollectionList).then((res: any) => {
        if (res.data) {
          if (res.data) {
            if (Number(res.data.collection) === 1) {
              this.CollectionIconFalse = false; // 显示未收藏
              this.CollectionIconTrue = true; // 显示已收藏
            } else {
              this.CollectionIconFalse = true; // 显示未收藏
              this.CollectionIconTrue = false; // 显示已收藏
            }
          }
        }
      });
    }

    private mounted() {
      this.strList = this.$store.state.eventPushStore.eventLocation;
      this.getData();
    }

    private beforeDestroy() {
      clearInterval(this.syTimer);
    }

  }
</script>
<style lang="less" space>
    @imgPath: '../../../../../../assets/img/gisModule/PopulationFeverBox';
    @urlPath: '../../../../../../assets/img/emergencyResponseImg';
    .EventInfoTitle {
        display: none;
        width: 543px;
        height: 107px;
        position: absolute;
        left: 50%;
        top: 1%;
        transform: translateX(-50%);
        z-index: 1;
        color: #ec5b39;
        font-weight: bold;
    }

    .Abnormal_title {
        color: #ffff51;
    }

    .collecte-icon {
        display: inline-block;
        vertical-align: middle;
        width: 32px;
        height: 32px;
        background: url('@{imgPath}/collected-icon.png') 50% 50% no-repeat;
        margin-right: 10px;
    }

    .collecte-icon-collected {
        background-position: 0 -3px;
    }

    .collecte-icon-collecte {
        background-position: 0 -39px;
    }

    .collecteBtn {
        color: #67e1fb;
        float: right;
        height: 32px;
        vertical-align: middle;
        font-weight: 300;
        cursor: pointer;

        &:hover {
            color: #fffabe;

            .collecte-icon {
                background-image: url('@{imgPath}/collected-icon-h.png');
            }
        }
    }

    .dialong_bg_pao_title_txt {
        background: url('@{imgPath}/new__title16.png') no-repeat;
        background-size: 100% 100%;
        height: 100%;
        background-position: -24px center;
        padding: 0 65px 0 60px;
        overflow: hidden;
    }

    .dialong_bg_pao_title_txt_child {
        line-height: 60px;
        text-align: center;
        white-space: nowrap;
        position: absolute;
        left: 20px;
        font-size: 26px;
        // z-index:5;
    }

    .paomadeng_box {
        position: relative;
        // width: 100%;
        // width: 270px;
        height: 58px;
        overflow: hidden;
        cursor: pointer;
        margin-top: 25px;
    }

    .NewEventInformation {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .95);
        // opacity: 0.85;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999;
    }

    .NewEventInformation_dialong {
        width: 959px;
        background: url('@{imgPath}/centerBg.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -47%);
        max-height: 550px;
        min-height: 300px;

        &:before {
            content: '';
            display: inline-block;
            background: url('@{imgPath}/botBg.png') no-repeat;
            background-size: 100% 100%;
            background-size: 100% 100%;
            position: absolute;
            bottom: -77px;
            height: 78px;
            // width: 959px;
            left: 0;
            right: 0;
        }

        .title {
            font-family: MicrosoftYaHei;
            // font-size: 28px;
            font-weight: bold;
            font-stretch: normal;
            // line-height: 90px;
            letter-spacing: 1px;
            color: #00e4ff;
            /*padding-left: 55px;*/
            background: url('@{imgPath}/topbg.png') no-repeat;
            background-size: 100% 100%;
            position: absolute;
            top: -77px;
            height: 78px;
            // width: 959px;
            left: 0;
            right: 0;
            margin: 0;
            // outline: 1px solid red;;
            padding: 27px 110px 30px 30px;
            box-sizing: border-box;

            &_span {
                padding-left: 20px;
                padding-top: 20px;
            }
        }

        .closeBtn {
            display: inline-block;
            width: 90px;
            height: 48px;
            background: url('@{imgPath}/closeBtn.png') no-repeat;
            background-size: 100% 100%;
            position: absolute;
            right: 15px;
            top: 8px;
            cursor: pointer;

            &:hover {
                background-image: url('@{imgPath}/closeHover.png');
            }
        }

        .EventInformation_CareatList {
            width: 96%;
            margin-right: 5px;
            min-height: 200px;
            max-height: 450px;
            overflow: auto;

            .Abnormal_title {
                color: #00fffc;
            }
        }

    }

    .close_EventInformation {
        width: 71px;
        height: 30px;
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
    }

    .EventInformation_list {
        color: #bbd0dc;
        font-size: 32px;
        padding: 22px 0px 0 45px;
        font-weight: bold;
    }

    .EventInformation_list p {
        margin: 0px;
    }

    .EventInformation_list .zhenji {
        color: #00fffc;
    }

    .list_notColor {
        color: #00fffc;
    }

    .NewEventInformation .el-scrollbar__bar.is-vertical > div {
        background-image: linear-gradient(0deg,
        #0a7ccc 0%,
        #06b4d1 52%,
        #02ebd5 100%);
        height: 194px;
    }

    .NewEventInformation .el-scrollbar__thumb:hover {
        background-image: linear-gradient(0deg,
        #0a7ccc 0%,
        #06b4d1 52%,
        #02ebd5 100%);
    }

    /*修改滚动条样式*/
    .EventInformation_CareatList::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        /**/
    }

    .EventInformation_CareatList::-webkit-scrollbar-thumb {
        background-image: linear-gradient(0deg,
        #0a7ccc 0%,
        #06b4d1 52%,
        #02ebd5 100%);
        border-radius: 5px;
    }

    .EventInformation_CareatList::-webkit-scrollbar-thumb:hover {
        background-image: linear-gradient(0deg,
        #0a7ccc 0%,
        #06b4d1 52%,
        #02ebd5 100%);
    }

</style>
