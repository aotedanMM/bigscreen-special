<template>
  <!--   :style = "{marginTop: -popHeight + 'px'}" -->
  <div class="enterpriseCrisisPop enterpriseClass">
    <div id="enterpriseCrisis_Details" v-if="enterpriseCrisisPop">
      <div class="enterpriseCrisis_view enterprise-dialog">
        <!--关闭-->
        <div class="dialog-oprate">
          <div
            v-if="false"
            class="look-enterprise-button"
            @click="preview"
            v-show="isWeihua"
          >
            <span span class="f-txt-small">详情</span>
          </div>
          <div class="close-enterprise-dialog" @click="close()"></div>
        </div>
        <div class="enterprise-dialog-left">
          <h3
            class=" enterprise-title enterprise-jstitle elliphsis"
            :title="name"
          >
            <span class=" enterprise-title_inner title-panel">{{ name }}</span>
          </h3>
          <div class="enterprise-table enterprisecrsis_produce">
            <div id="dangerQY-detail-container" :title="name">
              <el-scrollbar
                wrap-style="height:100%;max-height: 240px;"
                :class="{ isHazardSource: isActive }"
              >
                <div class="bj-rescueForces-detailListLeft">
                  <ul class="list-ul" v-if="list">
                    <!-- <li
                      class=""
                      v-for="(item, key) in list"
                      :key="key"
                      v-if="getDataFilter(item.name)"
                    >
                      <label class="risk_level fulllabel">
                        {{ labelObj[item.name] }}:
                        <span
                          :class="
                            labelObj[item.name] && labelObj[item.name].indexOf('安全风险等级') !== -1
                              ? 'efnterprise_basic_right_0' + item.value
                              : ''
                          "
                        >
                          {{ item.value }} {{ unitObj[item.name] }}
                          <img
                            v-if="item.value && telobj[item.name]"
                            src="../../../../assets/img/eventInfo/icon_phone.png"
                            class="callPhoneCur principalCall"
                          />
                        </span>
                      </label>
                    </li> -->
                    <li class="f-tit-h2" v-for="item of dataFilter" :key="item">
                      <label class="risk_level fulllabel">
                        {{ labelObj[item] + '：' }}
                        <span
                          v-if="item == 'damheight'"
                          :class="
                            labelObj[item] &&
                            labelObj[item].indexOf('安全风险等级') !== -1
                              ? 'enterprise_basic_right_0' + list[item]
                              : ''
                          "
                          :title="filterNumTwo(item, list, unitObj[item] || '')"
                        >
                          {{ filterNumTwo(item, list, unitObj[item] || '') }}
                          <img
                            v-if="telobj[item]"
                            src="../../../../assets/img/eventInfo/telphoon.png"
                            class="allphone callPhoneCur"
                            @click.stop="
                              handleClickCallup(list, list[item], $event)
                            "
                          />
                        </span>
                        <span
                          v-else
                          :class="
                            labelObj[item] &&
                            labelObj[item].indexOf('安全风险等级') !== -1
                              ? 'enterprise_basic_right_0' + list[item]
                              : ''
                          "
                          :title="
                            filterNumFixed(item, list, unitObj[item] || '')
                          "
                        >
                          {{ filterNumFixed(item, list, unitObj[item] || '') }}
                          <img
                            v-if="list[item] && telobj[item]"
                            src="../../../../assets/img/eventInfo/telphoon.png"
                            class="allphone callPhoneCur"
                            @click.stop="
                              handleClickCallup(list, list[item], $event)
                            "
                          />
                        </span>
                      </label>
                    </li>
                  </ul>
                </div>
              </el-scrollbar>
              <div
                class="bj-rescueForces-detailListRight"
                style="display: none;"
              >
                <p>距离事发地</p>
                <p>
                  <span>暂无数据</span>
                  <!-- <span>{{enterpriseData.data.distance}}</span> -->
                </p>
              </div>
            </div>
          </div>
          <div class="baiduLabel" v-show="isWeihua">
            <div class="list_baidu">
              <h3 class="f-tit-h2 enterprise-title">企业画像</h3>
              <span
                v-if="false"
                class="openBaiduPicture f-txt-small"
                @click="moreList"
                >更多</span
              >
            </div>
            <div class="baiduLabelCont" v-loading="loading">
              <el-scrollbar style="height:100%;">
                <p class="f-txt-com" v-if="imgList" v-html="imgList"></p>
                <center v-else class="f-txt-com">{{ noData }}</center>
              </el-scrollbar>
            </div>
          </div>
          <!--查周边-->
          <div class="search-nearby f-txt-little" style="display: none;">
            查周边
          </div>
          <popButtonList
            :btnFilter="btnFilterTwo"
            @buttonListClick="buttonListClick"
          ></popButtonList>
          <!--路径规划-->
          <!-- <span class="popDetailBtn" v-if="isShowPathPlanningBtn" @click="pathClick()" style="">路径规划</span> -->
          <!--周边分析-->
          <!-- <span class="popDetailBtn" v-if="isAroundAnalysisBtn" @click="aroundClick()" style="">周边分析</span> -->
          <!--视频监控-->
          <!-- <div
            class="elsebtn aside"
            v-if="isVideoMonitoringBtn"
            @click="videoClick()"
          >
            <div class="jiankongBtn">视频监控</div>
          </div> -->
          <!-- <span class="popDetailBtn" v-if="isVideoMonitoringBtn" @click="videoClick()" style="">视频监控</span> -->
          <!--危化物联-->
          <!-- <div
            class="elsebtn"
            v-if="isHazardousChemicalsBtn"
            @click="chemicalsClick()"
          >
            <div class="jianceBtn">危化物联</div>
          </div> -->
          <!-- <span class="popDetailBtn" v-if="isHazardousChemicalsBtn" @click="chemicalsClick()" style="">危化物联</span> -->
          <div class="elsebtn EventHandlingBtn_elsebtn">
            <!--            <div class="EventHandlingBtn">事件处置</div>-->
          </div>
          <div class="managementBtn f-txt-little">
            <!-- 安全生产专题 危化品出详情窗版-->
            <!--<InEventInfo :closeFunc="closeFunc" v-if="data.isEventBtn" :popupData='data' :popupType="popUpType" ></InEventInfo>-->
            <!-- wuen  2020/6/10-->
            <InEventInfo
              :closeFunc="closeFunc"
              :vueThis="vueThis"
              v-if="data.isEventBtn"
              v-show="isEntryDisposalIsShow"
              :popupData="data"
            ></InEventInfo>
            <popButtonList
              :btnFilter="btnFilter"
              v-if="data.isEventBtn"
              @buttonListClick="buttonListClick"
            ></popButtonList
            ><!--按钮列表组件-->
          </div>

          <!--预览-->
        </div>
        <!--更多中企业画像-->
        <div class="baidu_Corporate_portrait animated">
          <h3 class="baidu_Corporate_portrait_title f-tit-h2">企业画像</h3>
          <div class="iframe_div">
            <iframe></iframe>
          </div>
        </div>
        <div class="look-enterprise-dialog">
          <!-- <h2 class="entName_header">
            {{ data.name }}
          </h2> -->
          <div class="look-enterprise-dialog_cont">
            <!-- 企业详情 -->
            <el-scrollbar style="height: 100%;">
              <!-- <h3>基本信息</h3>
              <div class="table_list">
                <ul class="table_list_uls">
                  <li
                    class="new_table_list"
                    v-for="(val, key) in enterpriseTitle"
                    :key="key"
                  >
                    <span class="table_list_name">{{ val }}：</span>
                    <span class="table_list_contont PROPERTYNAME">{{
                      data[key]
                    }}</span>
                  </li>
                </ul>
              </div> -->
              <h3 class="baidu_title">企业画像</h3>
              <div class="baidu_img_list">
                <h3 class="adminabnormal_title">经营异常</h3>
                <div class="table_list adminabnormal"></div>

                <h3 class="adminpunish_title">行政处罚</h3>
                <div class="table_list adminpunish"></div>

                <h3 class="alteration_title">企业工商变更</h3>
                <div class="table_list alteration"></div>

                <h3 class="riskDetail_title">企业工商信息</h3>
                <div class="table_list riskDetail"></div>

                <h3 class="keyperson_title">企业高管</h3>
                <div class="table_list keyperson"></div>

                <h3 class="shareholder_title">企业股东股权</h3>
                <div class="table_list shareholder"></div>

                <h3 class="risklabels_title">风险标签</h3>
                <div class="table_list risklabels"></div>

                <h3 class="itemscount_title">统计</h3>
                <div class="table_list itemscount"></div>

                <h3 class="sProductList_title">企业经营状况商标</h3>
                <div class="table_list sProductList"></div>

                <h3 class="sAdminlicences_title">企业经营状况许可</h3>
                <div class="table_list sAdminlicences"></div>

                <h3 class="sBrand_title">企业经营状况产品</h3>
                <div class="table_list sBrand"></div>

                <!-- 以下是百度画像 内容 -->
                <h3 class="illegalTax_title">税务处罚</h3>
                <div class="table_list illegalTax"></div>

                <h3 class="enterpriserisk_title">企业安全生产风险</h3>
                <div class="table_list">
                  <ul class="table_list_uls enterpriserisk"></ul>
                  <h3 class="dangerYuqing_title">风险隐患舆情</h3>
                  <ul class="table_list_uls dangerYuqing"></ul>
                  <h3 class="financeYuqing_title">经营活动舆情</h3>
                  <ul class="table_list_uls financeYuqing"></ul>
                  <h3 class="safetyYuqing_title">安全事故舆情</h3>
                  <ul class="table_list_uls safetyYuqing"></ul>
                  <h3 class="negYuqing_title">其他负面舆情</h3>
                  <ul class="table_list_uls negYuqing"></ul>
                </div>
              </div>
            </el-scrollbar>
          </div>
          <div class="close-look-dialog" @click="previewClose"></div>
          <div
            class="download_btn_world"
            id="weihua_download_btn_world"
            @click="exportList"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { messsageBus } from '@/util/message';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { IEventinfo } from '@/interface/feature/earthquake/Eventinfo.interface';
import { Draggable } from 'draggable-vue-directive';
import popDataDeal from './dataDeal/popDataDeal';
import { dataDeal } from './dataDeal/dataDeal';
import { buttonList } from './dataDeal/buttonList';
import popButtonList from '@/components/feature/gisModule/popUp/popButtonList.vue';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import InEventInfo from '@/components/feature/gisModule/popUp/btnComponent/inEventInfo.vue';
import { hazardoubaseinfoServer } from '@/api/installServer';

@Component({
  name: 'EnterpriseCrisisPop',
  components: {
    popButtonList,
    InEventInfo,
  },
  mixins: [popDataDeal, buttonList],
  directives: {
    Draggable,
  },
})
export default class EnterpriseCrisisPop extends Vue {
  // 详情 end

  // 要显示的按钮
  public btnFilter = [
    // 'pathPlanningBtn', // 路径规划
    // 'aroundAnalysisBtn', // 周边分析
    'videoMonitoringBtn', // 视频监控
    // 'hazardousChemicalsBtn', // 危化物联
  ];
  public btnFilterTwo: any = [
    'aroundVideoBtn', // 周边视频
  ];
  public buttonList = buttonList;
  public name: any = '暂无标题';
  public styles: any = {};
  public popUpType: any;
  public geometry: any;
  public coordinates: any;
  public geoPoint: any = [];
  public safetylevel: any = 0;
  public isCoalMine: any = true;
  public isActive: boolean = false;
  public dataFilter: any = [
    'NAME',
    'ADDRESS',
    'DISTRICT',
    'RESCUECODE',
    'LEADER',
    'LEADERMTEL',
    'LEADERTEL',
  ];
  public dataObj: any;
  public isWeihua: any = false;
  public list: [] = [];
  public dataAttributes: any;
  public dataChild: any;
  public dataTag: any;
  public labelObj: any = {
    NAME: '名称',
    ADDRESS: '地址',
    DISTRICT: '行政区划',
    SUMOUTPUT: '总生产量(万吨)：',
    PRINCIPAL: '企业负责人',
    PRINCIPALTEL: '负责人电话',
  };
  public dataDeal: any = dataDeal;
  public isShowBtn: any = {};
  public popHeight: any = 0;
  public isEntryDisposalIsShow: any = true; // 进入处置
  private data: any = {};
  private type: any = '';
  // 详情 start
  private enterpriseTitle = {};
  private enterpriseData = [];
  //
  private enterpriseCrisisPop: boolean = true;
  private imgList: string = '';
  // 拖拽
  private draggableValue: any = {
    onPositionChange: this.onPosChanged,
  };
  private loading = false;
  private noData: any = '';
  private closeFunc() {
    const self: any = this;
    self.close();
  }
  /* private getDataFilter(val: any) {
  return this.dataFilter.includes( val );
}

private getData() {
  // tslint:disable-next-line:variable-name
  const _this = this;
  // this.list = [];
  this.dataAttributes.forEach(function(item: any , index: any ) {
      _this.dataObj = {};
      // tslint:disable-next-line:align
      // tslint:disable-next-line:no-unused-expression
      if (item.name && item.name === 'NAME' ) {
          _this.name = item.value;
          // _this.$set(_this.rescueForcesData.data, 'rescuename', item.name);
        }
      _this.dataObj.name = item.name;
      _this.dataObj.value = item.value;
      _this.$set(_this.list, index, _this.dataObj);

      });
  // console.log('this.list:' , this.list);
}
private mounted() {
  const that: any = this;
  if (that.data && that.data.attributeSet && that.data.attributeSet.attributes) {
        that.dataAttributes = that.data.attributeSet.attributes;
        that.getData();
    }
  } */

  // 计算弹框的调度，调度margin-top值
  private calcHeight() {
    this.popHeight = $('.enterpriseCrisisPop').innerHeight();
    this.popHeight += 40;
  }
  private onPosChanged(positionDiff: any, absolutePosition: any, event: any) {
    if (event.target.closest('[draggable-state]')) {
      event.target.closest('[draggable-state]').style.position = 'absolute';
    }
  }
  // $('.enterprise_basic_right_0').addClass('enterprise_basic_right_0' + this.enterpriseData.data.HAZARDLEVELCODE);
  // 更多按钮
  private moreList() {
    // 收缩左侧统计窗口  32:9 缩小左侧统计面板 用来调用下面这个路径文件的方法
    // \src\components\feature\gisModule\static\statistic.common.vue
    // this.messsageBus.emit('closeStatisticPop');

    $('.enterprise-dialog').addClass('enterprise-spread');
    $('.enterprise-jstitle').addClass('enterpriseTitle-spread');
    /*name 企业名称
      code企业统一社会信用代码 目前跟一线统一是写死的
    */
    const url = encodeURI(
      (window as any).EMAP_CONFIG.common.taijiQyhqUrl +
        '?name=' +
        this.data.name +
        '&code=91130223084990733M#Portrayal/Details3',
    );
    $('.baidu_Corporate_portrait iframe').attr('src', url);
    $('.baidu_Corporate_portrait')
      .show()
      .addClass('slideInLeft');
  }
  // 详情按钮,显示对应信息字段
  private preview() {
    this.messsageBus.emit('companyDetailData', this.data, this.type);
  }
  private previewClose() {
    $('.look-enterprise-dialog').hide();
    $('#look-enterprise-dialog_body').remove();
  }
  private exportList() {
    console.log('导出================');
  }
  private closePopup() {
    this.enterpriseCrisisPop = false;
  }
  private buttonListClick(item: any) {
    buttonList[item].btnClick(this);
  }
  /*   private pathClick() {
    // 路径规划
    this.pathPlanningClick(this.geoPoint);
  }
  private aroundClick() {
    // 周边分析
    this.aroundAnalysisClick(this.geoPoint);
  }
  private videoClick() {
    // 视频监控
    this.videoMonitoringClick();
  }
  private chemicalsClick() {
    // 危化物联
    this.hazardousChemicalsClick();
  } */
  // 数字过滤
  private filterNumFixed(key: any, list: any, unitObj: any) {
    // 这里先把现在数据和元数据进行解地址引用，这个原因不是很确定，原来的就调用了，于是我没有改动
    var resultVal: any = JSON.parse(JSON.stringify(list))[key];
    // 首先判断是不是null 或 undefined 如果是显示无 否则原来数据,有单位加单位
    if (resultVal !== null && resultVal !== undefined) {
      // 判断是不是字符串不是字符串直接往下进行字符串做去两边空格操作(有数据返回为空格许显示无)
      if (typeof resultVal === 'string') {
        resultVal = resultVal.trim() ? resultVal : '暂无数据';
      }
    } else {
      resultVal = '暂无数据';
    }
    if (resultVal !== '暂无数据') {
      resultVal = resultVal + unitObj; // 如果不是无有单位的添加单位
    }
    return resultVal;
  }

  // 保留俩位小数点
  private filterNumTwo(key: any, list: any, unitObj: any) {
    // 这里先把现在数据和元数据进行解地址引用，这个原因不是很确定，原来的就调用了，于是我没有改动
    var resultVal: any =
      JSON.parse(JSON.stringify(list)).damheight.toFixed(2) + '米';
    // 首先判断是不是null 或 undefined 如果是显示无 否则原来数据,有单位加单位
    if (resultVal !== null && resultVal !== undefined) {
      // 判断是不是字符串不是字符串直接往下进行字符串做去两边空格操作(有数据返回为空格许显示无)
      if (typeof resultVal === 'string') {
        resultVal = resultVal.trim() ? resultVal : '暂无数据';
      }
    } else {
      resultVal = '暂无数据';
    }
    if (resultVal !== '暂无数据') {
      resultVal = resultVal + unitObj; // 如果不是无有单位的添加单位
    }
    console.log(resultVal);
    return resultVal;
  }
  // 打电话
  private handleClickCallup(listObj: any, val: any, event: any) {
    this.messsageBus.emit('showCallup', true, listObj, val, event);
  }
  private getBaiduLabelFn() {
    this.loading = true;
    // 企业画像 下面列表内容
    installDisasterJudgeServer.hazServer
      .getBaiduLabel({ name: this.data.name })
      .then((data: any) => {
        this.loading = false;
        if (data.data.report) {
          this.imgList = data.data.report;
        } else {
          this.noData = '暂无数据';
        }
      });
  }
  private created() {
    // console.log(this.data.isEventBtn);
    const self: any = this;
    this.data = self.event.data;
    this.getBaiduLabelFn();
    const iframeCode = this.data._id ? this.data._id : '';
    console.log('this.type', this.type);
    if (this.type === 'coalMine' || this.type === 'coal') {
      this.isShowBtn = {
        firmtype: '1',
        url: '/api/mobileapp/downloadfeedbackattach/v1?id=',
        code: iframeCode,
      };
    } else {
      this.isShowBtn = {
        firmtype: 'null',
        url: '/api/mobileapp/downloadfeedbackattach/v1?id=',
        code: iframeCode,
      };
    }

    hazardoubaseinfoServer
      .getHazardouvideolistServer(this.isShowBtn)
      .then((res: any) => {
        if (res.code === 0) {
          if (res.data.length <= 0) {
            const videoMonitoringBtn = document.getElementsByClassName(
              'popBtn',
            )[0] as HTMLDivElement;
            videoMonitoringBtn.style.display = 'none';
            this.isCoalMine = false;
          }
        }
      })
      .catch((err: any) => {
        // const videoMonitoringBtn = document.getElementsByClassName('popBtn')[0] as HTMLDivElement ;
        // videoMonitoringBtn.style.display = 'none';
      });
  }
  private mounted() {
    // console.log(this.data.isEventBtn);
    const that: any = this;
    that.popUpType = that.type;
    that.parentThis = this;
    this.calcHeight();
    this.safetylevel = Number(this.data.safetylevel);
    that.setGeomPoint(); // 设置当前点位经纬度给geoPoint
    if (that.styleObj) {
      that.styles = that.styleObj;
    }
    /*if (that.getPathTypeFilter(that.popUpType)) {
      that.isShowPathPlanning();
    }
    if (that.getAroundTypeFilter(that.popUpType)) {
      that.isShowAroundAnalysis();
    }*/
    // 判断是否显示进入处置
    if (this.data.EntryDisposalIsShow !== '') {
      // this.EventIcon=this._id;
      if (this.data.EventIcon === this.data._id) {
        // 进入事件处置id相同
        this.isEntryDisposalIsShow = false;
      } else {
        // 进入事件处置id不同
        this.isEntryDisposalIsShow = true;
      }
    }
    if (dataDeal[that.popUpType]) {
      that.popHeight = dataDeal[that.popUpType].popHeight;
      // 单位
      that.unitObj = dataDeal[that.popUpType].unitObj;
      // 属性(以及顺序)
      that.dataFilter = dataDeal[that.popUpType].dataFilter;
      // 标题
      that.labelObj = dataDeal[that.popUpType].labelObj;
      // 电话图标的字段
      that.telobj = dataDeal[that.popUpType].telobj
        ? dataDeal[that.popUpType].telobj
        : that.telobj;
      // 下部按钮list
      that.btnFilter = dataDeal[that.popUpType].btnFilter
        ? dataDeal[that.popUpType].btnFilter
        : that.btnFilter;
      that.btnFilterTwo = dataDeal[that.popUpType].btnFilter
        ? dataDeal[that.popUpType].btnFilter
        : that.btnFilter;
      if (
        this.name !== '火点信息' &&
        that.btnFilter.indexOf('fireCreep') > 0
      ) {
        that.btnFilter.splice(
          that.btnFilter.findIndex((item: any) => item === 'fireCreep'),
          1,
        );
      }
      dataDeal[that.popUpType].cb(that);
      // 判断企业是否显示 危化物联 和视频监控
      // if (this.data.isEventBtn !== true) {
      if (
        [2, 4, 5].includes(this.data.typecodeStr) ||
        ['2', '4', '5'].includes(this.data.typecodeStr)
      ) {
        // 判断视频监控和危化物联按钮
        if (this.type === 'majorDanger') {
          if (!this.data.companycode) {
            const videoMonitoringBtn = document.getElementsByClassName(
              'popBtn',
            )[0] as HTMLDivElement;
            videoMonitoringBtn.style.display = 'block';
          }
          this.isWeihua = false;
          this.isActive = true;
        } else {
          if (!this.data.companycode) {
            const videoMonitoringBtn = document.getElementsByClassName(
              'popBtn',
            )[0] as HTMLDivElement;
            videoMonitoringBtn.style.display = 'none';
          }
          if (this.safetylevel !== 1 && this.safetylevel !== 2) {
            const hazardousChemicalsBtn = document.getElementsByClassName(
              'popBtn',
            )[1] as HTMLDivElement;
            hazardousChemicalsBtn.style.display = 'none';
          }
          this.isWeihua = true;
        }
      } else {
        if (this.type === 'hazardous') {
          const videoMonitoringBtn = document.getElementsByClassName(
            'popBtn',
          )[0] as HTMLDivElement;
          videoMonitoringBtn.style.display = 'none';
          const hazardousChemicalsBtn = document.getElementsByClassName(
            'popBtn',
          )[1] as HTMLDivElement;
          hazardousChemicalsBtn.style.display = 'none';
          // if (!this.data.companycode) {
          //     const videoMonitoringBtn = document.getElementsByClassName('popBtn')[0] as HTMLDivElement ;
          //     videoMonitoringBtn.style.display = 'none';
          // }
          // if (this.safetylevel !== 1 && this.safetylevel !== 2) {
          //   const hazardousChemicalsBtn = document.getElementsByClassName('popBtn')[1] as HTMLDivElement ;
          //   hazardousChemicalsBtn.style.display = 'none';
          // }
          this.isWeihua = false;
        } else if (
          this.type === 'coalMine' ||
          this.type === 'coal'
        ) {
          if (this.isCoalMine === false) {
            const videoMonitoringBtn = document.getElementsByClassName(
              'popBtn',
            )[0] as HTMLDivElement;
            videoMonitoringBtn.style.display = 'none';
            const hazardousChemicalsBtn = document.getElementsByClassName(
              'popBtn',
            )[1] as HTMLDivElement;
            hazardousChemicalsBtn.style.display = 'none';
          }
          if (this.safetylevel !== 1 && this.safetylevel !== 2) {
            const videoMonitoringBtn = document.getElementsByClassName(
              'popBtn',
            )[0] as HTMLDivElement;
            videoMonitoringBtn.style.display = 'none';
            const hazardousChemicalsBtn = document.getElementsByClassName(
              'popBtn',
            )[1] as HTMLDivElement;
            hazardousChemicalsBtn.style.display = 'none';
          }
          this.isWeihua = false;
        } else {
          const videoMonitoringBtn = document.getElementsByClassName(
            'popBtn',
          )[0] as HTMLDivElement;
          videoMonitoringBtn.style.display = 'none';
          const hazardousChemicalsBtn = document.getElementsByClassName(
            'popBtn',
          )[1] as HTMLDivElement;
          hazardousChemicalsBtn.style.display = 'none';
          this.isWeihua = false;
        }
      }

      // }
    } else {
      if (
        that.data &&
        that.data.attributeSet &&
        that.data.attributeSet.attributes
      ) {
        that.dataAttributes = that.data.attributeSet.attributes;
        that.getData(that.dataAttributes);
      } else {
        that.getData(that.data);
      }
    }
  }
}
</script>
<style lang="less" scoped>
@popdialog: '../../../../assets/img/popdialog';
@closebg: '../../../../assets/img/halfScreen/eventAndTopics';
@imgPath: '../../../../assets/img/gisModule/PopulationFeverBox';
.enterpriseCrisisPop {
  // margin-left:-290px;
  ul {
    margin: 0;
    padding: 0;
  }
  .black {
    color: black;
  }
  /*------企业画像s----*/

  /*公共 s*/
  .enterprise-dialog {
    width: auto;
    // height: 555px;
    // position: absolute;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
    // background: url("@{popdialog}/businessImgBack.png") no-repeat;
    background-image: url('@{imgPath}/topbg.png'),
      url('@{imgPath}/centerBg.png'), url('@{imgPath}/botBg.png');
    background-repeat: no-repeat;
    background-position: 0 0, 0 60px, 0 100%;
    background-size: 100% 60px, 100% calc(100% - 109px), 100% 49px;
    display: flex;
    padding: 5px 19px 13px 8px;
    // position:relative;
  }
  .enterprise-spread {
    // padding-left: 20px;
    background: url('@{popdialog}/businessImgBackBig.png') no-repeat;
    background-size: 100% 100%;
    // margin-left:-340px;

    .enterprise-table {
      margin-top: 85px;
    }
  }
  .enterprise-dialog-left {
    width: 548px;
    // height: 480px;
    position: relative;
    padding-left: 10px;
    padding-bottom: 30px;
  }

  .enterprise-title {
    padding-left: 20px;
    // padding-right: 160px;
    padding-right: 60px;
    height: 67px;
    line-height: 67px;
    overflow-x: hidden;
    font-weight: bold;
    font-stretch: normal;
    // letter-spacing: 1px;
    // color: #ffde00;
    margin: 0;
    // outline:1px solid red;
    user-select: none;
  }
  .enterprise-title_inner {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .enterprise-title.enterprise-jstitle.enterpriseTitle-spread {
    // width: calc(100% - 120px);;
    position: absolute;
    width: 930px;
  }

  .baidu_Corporate_portrait_title {
    margin: 0;
    background: url('@{popdialog}/baiduTitleImg.png') no-repeat;
    background-size: 100% 100%;
    color: #70f0f8;
    width: 178px;
    overflow: hidden;
    padding: 16px 0 3px 20px;
    margin-top: 3px;
    font-weight: 300;
  }
  .elliphsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .enterprise-table {
    // width: 559px;
    // margin-left: 1%;
    // margin-right: 2%;
    margin-left: 8px;
    max-height: 240px;
    margin-bottom: 10px;
    // margin-top: 10px;
  }
  .close-enterprise-dialog {
    display: inline-block;
    background: url('@{closebg}/eventAndTopics_close.png') no-repeat 0 -3px;
    background-size: 100% 100%;
    width: 80px;
    margin-right: -7px;
    height: 35px;
    // margin-top:-5px;
    &:hover {
      cursor: pointer;
      background-image: url('@{closebg}/eventAndTopics_close_h.png');
    }
  }

  /*左-百度画像列表*/

  .baiduLabel {
    // width: 88%;
    position: relative;
    margin-right: 17px;
    margin-left: 17px;
    padding-top: 12px;
  }

  .baiduLabel .enterprise-title {
    padding-left: 0;
  }

  .baiduLabel p {
    height: 30px;
    // border-bottom: 1px solid rgba(39, 154, 177, 0.5);
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
    border-bottom: 1px solid #377785;
    // height: 46px;
  }
  .list_baidu .enterprise-title {
    width: 20%;
  }
  /*.list_baidu .enterprise-status {
    margin-left: 0px;
    text-align: center;
    font-weight: normal;
    font-stretch: normal;
    line-height: 24px;
    width: 77px;
    height: 28px;
    border-radius: 4px;
    font-size: 22px;
    letter-spacing: 0px;
    color: #ffffff;
    border: 1px solid #a20019;
    background: rgba(162, 0, 25, 0.5);
    margin-top: 6px;
  }*/
  .list_baidu .enterprise-title {
    width: 24%;
    margin-right: 17px;

    letter-spacing: 0px;
    // font-size: 28px;
    font-weight: 300;
    font-stretch: normal;
    line-height: 35px;
    height: 37px;
    color: #70f0f8;
  }
  .list_baidu .openBaiduPicture {
    position: absolute;
    background-size: 100% 100%;
    right: 0px;
    top: 18px;
    text-align: center;
    cursor: pointer;
    width: 82px;
    height: 22px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 23px;
    letter-spacing: 0px;
    color: #06ebff;
  }
  .list_baidu .openBaiduPicture:after {
    content: '';
    width: 11px;
    height: 11px;
    background: url('@{popdialog}/gengduo.png') no-repeat;
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
    margin-top: 10px;
    height: 106px;
    color: #fff;
    line-height: 30px;
    overflow: auto;
    color: #d6f3ff;
  }
  /*右-百度画像iframe*/
  .baidu_Corporate_portrait {
    margin-top: 53px;
    width: 529px;
    height: 510px;
    padding-right: 10px;
    padding-top: 14px;
    margin-left: 15px;
    margin-right: 5px;
    margin-bottom: 6px;
    display: none;
  }
  @-webkit-keyframes slideInLeft {
    from {
      -webkit-transform: translate3d(-100%, 0, 0);
      transform: translate3d(-100%, 0, 0);
      visibility: visible;
    }

    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes slideInLeft {
    from {
      -webkit-transform: translate3d(-100%, 0, 0);
      transform: translate3d(-100%, 0, 0);
      visibility: visible;
    }

    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  .slideInLeft {
    -webkit-animation-name: slideInLeft;
    animation-name: slideInLeft;
  }
  .title_view {
    height: 70px;
    line-height: 70px;
    color: #fda100;
    // font-size: 22px;
    padding-left: 24px;
  }

  .iframe_div {
    // width: 95%;
    margin-right: 10px;
    width: 525px;
    height: 410px;
    // margin-top: -1px;
    margin-left: 0;
    overflow: hidden;
    border: 2px solid #70f0f8;
  }

  .iframe_div iframe {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: none;
  }

  /*word弹窗*/

  .dialog-oprate {
    height: 50px;
    vertical-align: middle;
    position: absolute;
    right: 16px;
    top: 7px;
    // margin-top: -17px;
    z-index: 1;
    // padding-top:20px;
  }
  .look-enterprise-button {
    position: absolute;
    display: inline-block;
    margin-top: 11px;
    // border: 1px solid #00eaff;
    background: url('@{popdialog}/look-enterprise_btn_bg.png') no-repeat 0 0;
    // background-size:100% 100%;
    color: #a0f4fd;
    border-radius: 5px;
    // width: 104px;
    height: 42px;
    line-height: 34px;
    text-align: center;
    padding-left: 40px;
    padding-right: 25px;
    cursor: pointer;
    // font-size: 26px;
    box-sizing: border-box;
    right: 50px;
    box-sizing: border-box;
    white-space: nowrap;
    cursor: pointer;
    width: 104px;
    &:hover {
      height: 42px;
      background-position: 0 bottom;
      color: #ffde00;
    }
  }

  // .look-enterprise-button:hover b {
  //   background: url('@{popdialog}/xiangq_iconHover.png') no-repeat;
  //   background-size: 100% 100%;
  // }

  // .look-enterprise-button b {
  //   width: 20px;
  //   height: 21px;
  //   display: inline-block;
  //   background: url('@{popdialog}/xiangq_icon.png') no-repeat;
  //   background-size: 100% 100%;
  //   position: absolute;
  //   top: 50%;
  //   left: 15%;
  //   transform: translate(-50%, -50%);
  // }

  .look-enterprise-dialog {
    background: url('@{popdialog}/world_bg.png') no-repeat;
    background-size: 100% 100%;
    position: absolute;
    width: 781px;
    top: -40%;
    left: -35px;
    height: 987px;
    display: none;
    z-index: 99999;
  }

  .look-enterprise-dialog h2 {
    // font-size: 30px;
    text-align: center;
    margin: 0 auto;
    width: 70%;
    margin-top: 135px;
    margin-bottom: 30px;
    font-weight: bolder;
    color: #333;
  }

  .look-enterprise-dialog h3 {
    text-align: left;
    margin-left: 150px;
    margin-bottom: 10px;
    font-weight: bolder;
    // font-size: 26px;
    margin-top: 20px;
    color: #333;
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
  .baidu_img_list {
    width: 100%;
  }

  .baidu_img_list h3 {
    display: none;
  }

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
    font-size: 20px;
    color: #767676;
  }

  .baidu_img_list .baidu_list_etxed ul li div:nth-of-type(2) {
    width: 100%;
    font-size: 20px;
    color: #000000;
  }

  .baidu_title {
    display: none;
    margin-left: 0px !important;
    margin: 0 auto;
    text-align: center !important;
  }

  .download_btn_world {
    width: 98px;
    height: 88px;
    background: url('@{popdialog}/download_active_icon.png') no-repeat;
    background-size: 100% 100%;
    color: #6ecfd8;
    font-size: 20px;
    position: absolute;
    bottom: 42px;
    right: 49px;
    text-align: center;
    line-height: 38px;
    cursor: pointer;
  }

  .download_btn_world:hover {
    background: url('@{popdialog}/download_icon.png') no-repeat;
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
    font-size: 16px;
    font-family: 'Microsoft YaHei';
    color: rgb(132, 246, 255);
    text-transform: uppercase;
    -moz-transform: matrix(1, 0, 0, 1.00091157702826, 0, 0);
    -webkit-transform: matrix(1, 0, 0, 1.00091157702826, 0, 0);
    -ms-transform: matrix(1, 0, 0, 1.00091157702826, 0, 0);
    z-index: 136;
    background: url('@{popdialog}/zhoubian_icon.png') no-repeat;
    background-size: 100% 100%;
    width: 103px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    // position: absolute;
    // right: 60px;
    // bottom: 10px;
    float: right;
    margin-top: 10px;
    margin-right: 30px;
    cursor: pointer;
  }
  .elsebtn {
    position: absolute;
    right: 40px;
    bottom: 0px;
    display: flex;
  }
  .elsebtn.aside {
    right: 150px;
  }
  .elsebtn > div {
    width: 103px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
    // font-size: 16px;
    font-family: 'Microsoft YaHei';
    color: rgb(132, 246, 255);
    text-transform: uppercase;
    -moz-transform: matrix(1, 0, 0, 1.00091157702826, 0, 0);
    -webkit-transform: matrix(1, 0, 0, 1.00091157702826, 0, 0);
    -ms-transform: matrix(1, 0, 0, 1.00091157702826, 0, 0);
    z-index: 136;
    background: url('@{popdialog}/zhoubian_icon.png') no-repeat;
    background-size: 100% 100%;
    margin-left: 10px;
  }
  .close-look-dialog {
    background: url('@{popdialog}/close_world.png') no-repeat;
    background-size: 100% 100%;
    width: 55px;
    height: 56px;
    top: 0.5%;
    right: -10px;
    position: absolute;
    z-index: 9999;
  }

  .look-enterprise-dialog_cont {
    width: 90%;
    height: calc(100% - 304px);
    margin-top: -10px;
    margin-bottom: 100px;
  }
  .close-look-dialog:hover {
    cursor: pointer;
  }

  .table_list_uls .new_table_list {
    margin-left: 150px;
    line-height: 42px;
    width: 66%;
    overflow: hidden;
    white-space: normal;
    text-overflow: ellipsis;
  }
  .table_list_uls .new_table_list .table_list_name {
    // font-size: 26px;
    color: #333;
  }
  .table_list_uls .new_table_list .table_list_contont {
    // font-size: 26px;
    color: #333;
  }
  .wordPhoneIcon {
    background: url('@{popdialog}/wordPhone.png');
    background-size: 100% 100%;
    width: 34px;
    height: 34px;
    display: inline-block;
    vertical-align: sub;
  }
  .wordPhoneIcon:hover {
    background: url('@{popdialog}/wordPhoneHover.png');
    background-size: 100% 100%;
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
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .enterprise-table ul li {
    line-height: 32px;
    // font-size: 16px;
    display: flex;
  }
  .enterprise-table ul li:nth-child(2n-1) {
    background: url('@{popdialog}/list_nowNew.png') no-repeat;
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
    padding-left: 10px;
    padding-right: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    // font-size: 27px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 48px;
    letter-spacing: 0px;
    color: #92edf6;
  }
  .enterprise-table ul li label.fulllabel {
    width: 95%;
    white-space: inherit;
  }
  .enterprise-table ul li label:nth-of-type(2) {
    border-left: 1px solid #0184a5;
  }
  .enterprise-table ul li label span {
    // font-size: 27px;
    font-weight: normal;
    font-stretch: normal;
    // line-height: 48px;
    letter-spacing: 0px;
    color: #ffffff;
  }

  .callPhoneCur {
    cursor: pointer;
  }

  .controlcentertel,
  .product_date_cole {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  /*等级*/
  .risk_level span {
    text-align: center;
    border-radius: 26px;
    // padding: 0px 8px;
    color: #ffffff;
  }
  .animated {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
  #dangerQY-detail-container ul li span i {
    display: inline-block;
    color: #00e4ff;
    list-style: none;
    font-style: normal;
    margin-top: -2px;
    font-weight: normal;
  }
  .bj-rescueForces-detailListLeft {
    margin-top: 0;
    margin-right: 8px;
  }
  .bj-rescueForces-detailListLeft ul {
    width: 100%;
  }
  .bj-rescueForces-detailListLeft ul li {
    // font-size: 16px;
    line-height: 32px;
    font-weight: 100;
    color: #00e4ff;
  }
  .bj-rescueForces-detailListLeft ul li:first-child {
    display: flex;
  }
  .bj-rescueForces-detailListLeft ul li:last-child {
    display: flex;
  }
  .bj-rescueForces-detailListLeft ul li span {
    // margin: 0 5px;
    font-weight: normal;
    color: #fff;
  }
  .bj-rescueForces-detailListRight {
    position: absolute;
    top: 0;
    right: 0;
    width: 295px;
    min-height: 85px;
    max-height: 90px;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.1);
    text-align: center;
  }
  .bj-rescueForces-detailListRight p {
    margin: 0;
    padding-top: 10px;
    line-height: 1;
    letter-spacing: 1px;
  }
  .bj-rescueForces-detailListRight p:first-child {
    height: 35px;
    // font-size: 28px;
    color: #ffffff;
  }
  .bj-rescueForces-detailListRight p:last-child {
    // font-size: 28px;
    color: #fff500;
  }
  .bj-rescueForces-detailListRight p:last-child span {
    // font-size: 30px;
    font-weight: bolder;
    letter-spacing: 2px;
  }
  .enterprise_basic_right_01 {
    display: inline-block;
    color: #fff;
    width: 30px;
    height: 30px;
    background: url('@{popdialog}/icon_01.png') no-repeat;
    background-size: 100% 100%;
    text-align: center;
    line-height: 30px;
    // font-size: 22px;
    font-weight: 600;
  }
  .enterprise_basic_right_02 {
    display: inline-block;
    color: #fff;
    width: 30px;
    height: 30px;
    background: url('@{popdialog}/icon_02.png') no-repeat;
    background-size: 100% 100%;
    text-align: center;
    line-height: 30px;
    // font-size: 22px;
    font-weight: 600;
  }
  .enterprise_basic_right_03 {
    display: inline-block;
    color: #fff;
    width: 30px;
    height: 30px;
    background: url('@{popdialog}/icon_03.png') no-repeat;
    background-size: 100% 100%;
    text-align: center;
    line-height: 30px;
    // font-size: 22px;
    font-weight: 600;
    margin-top: 0.3%;
  }
  .enterprise_basic_right_04 {
    display: inline-block;
    color: #fff;
    width: 30px;
    height: 30px;
    background: url('@{popdialog}/icon_04.png') no-repeat;
    background-size: 100% 100%;
    text-align: center;
    line-height: 30px;
    // font-size: 22px;
    font-weight: 600;
  }
  .enterprise_basic_right_05 {
    display: inline-block;
    color: #fff;
    width: 30px;
    height: 30px;
    background: url('@{popdialog}/icon_05.png') no-repeat;
    background-size: 100% 100%;
    text-align: center;
    line-height: 30px;
    // font-size: 22px;
    font-weight: 600;
  }
  .enterprise_basic_right_06 {
    display: inline-block;
    color: #fff;
    width: 30px;
    height: 30px;
    background: url('@{popdialog}/icon_06.png') no-repeat;
    background-size: 100% 100%;
    text-align: center;
    line-height: 30px;
    // font-size: 22px;
    font-weight: 600;
  }
  .managementBtn {
    // position: absolute;
    // bottom: 10px;
    // right: 44px;
    width: 100%;
    display: flex;
    padding: 5px 0;
    div {
      display: flex;
      justify-content: flex-end;
      padding-right: 0px;
      width: 100%;
    }
  }
}
/deep/.baiduLabelCont .el-loading-mask {
  background-color: rgba(7, 16, 34, 0.8);
}
</style>

<style lang="less">
@popdialog: '../../../../assets/img/popdialog';
.el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.isHazardSource .el-scrollbar__wrap {
  max-height: 400px !important;
}
.enterpriseClass {
  .infoManagementBtn {
    width: 103px !important;
    height: 36px !important;
    line-height: 36px !important;
    text-align: center;
    cursor: pointer;
    font-family: 'Microsoft YaHei';
    color: #84f6ff;
    text-transform: uppercase;
    -moz-transform: matrix(1, 0, 0, 1.00091158, 0, 0);
    -webkit-transform: matrix(1, 0, 0, 1.00091158, 0, 0);
    -ms-transform: matrix(1, 0, 0, 1.00091158, 0, 0);
    z-index: 136;
    background: url('@{popdialog}/zhoubian_icon.png') no-repeat !important;
    background-size: 100% 100% !important;
    margin-left: 10px;
    &:hover {
      background: url('@{popdialog}/zhoubian_icon_active.png') no-repeat !important;
      background-size: 100% 100% !important;
      color: #fff;
    }
  }
}
</style>
