<template>
  <div v-if="false">
    <!--  style="display: none;" -->
    <div class="btn-entry" @click="showContent()">
      <span>{{ leverTitle ? leverTitle : '未启动响应' }}</span>

      <!-- <div class="dialong_bg_pao_title_txt">
          <span>{{ leverTitle ? leverTitle : '未响应' }}</span>
      </div> -->
    </div>
    <div class="baidudistricfilterBox" v-show="showEmergency">
      <h1 class="title-panel" @click="showEmergency = false">
        应急响应
        <span class="close-city"></span>
      </h1>
      <div class="emergency-box">
        <div class="emergency-left-menu">
          <!-- 预案内容、响应级别tab -->
          <ul class="palnBox">
            <li
              v-for="(item, index) in planTabs"
              :class="{ active: index == planTabNum }"
              @click="tab(index, 1)"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
          <!-- /预案内容、响应级别tab -->

          <div class="working-group" v-show="eventId!== ''">工作组</div>
          <!-- 工作组tab -->
          <ul class="workList" v-show="eventId!== ''">
            <el-scrollbar>
              <li
                v-for="(item, index) in workingGroupTabs"
                :class="{ active: index + 3 == planTabNum }"
                @click="tab(index + 3, 3)"
                :key="index"
              >
                {{ item.teamName }}
              </li>
            </el-scrollbar>
          </ul>
          <!-- /工作组tab -->
        </div>
        <div class="tabCon">
          <!-- 预案内容、响应级别tabcontent -->
          <div v-show="showTabIdx == 1">
            <div v-show="planTabNum == 0 && eventId !== ''">
              <el-row class="plan_box">
                <el-col :span="6" class="plan-menu">
                  <el-steps direction="vertical">
                    <el-step
                      :description="item.nodeName"
                      icon="el-icon-circle-plus-outline"
                      v-for="(item, index) in stepData"
                      :key="index"
                      @click.native="
                        handleStepClick(
                          item.nodeName,
                          item.sort,
                          item.nodeId,
                          item.content
                        )
                      "
                    ></el-step>
                  </el-steps>
                </el-col>
                <el-col :span="18" id="editPlan" class="plan-content">
                  <el-scrollbar>
                    <div
                      v-for="(item, index) in stepData"
                      class="edit_plan_note"
                      v-show="showAll"
                      :key="index"
                    >
                      <h3>{{ item.nodeName }}</h3>
                      <div v-html="item.content"></div>
                    </div>
                  </el-scrollbar>
                  <el-scrollbar>
                    <div
                      :model="planContent"
                      class="edit_plan_note"
                      v-show="!showAll"
                    >
                      <h3>{{ planContent.nodeName }}</h3>
                      <div v-html="planContent.content"></div>
                    </div>
                  </el-scrollbar>
                </el-col>
              </el-row>
            </div>
            <!-- 没有eventId情况下默认展示当前预案内容 -->
            <div v-show="planTabNum == 0 && eventId === ''">
              <div class="planPdf">
                <embed class="iframeContainer" :src="earthquakeEmergencyPlan" />
              </div>
            </div>
            <div v-show="planTabNum == 1 && eventId !== ''">
              <div class="planPdf">
                <embed class="iframeContainer" :src="pdfUrl" />
              </div>
            </div>
            <div v-show="planTabNum == 1 && eventId === ''">
              <div class="planPdf">
                <embed
                  class="iframeContainer"
                  :src="earthquakeEmergencyPlanManual"
                />
              </div>
            </div>

            <div v-show="planTabNum == 2" class="emerLever">
              <div class="container">
                <div
                  @click="getLeverTitle('I级响应', 1)"
                  :class="selectKey === 1 ? 'checkedBox' : 'label'"
                >
                  <span class="icon-img1"></span>
                  <span>I级响应</span>
                  <div class="context" v-show="selectKey === 1">
                    <div class="context-content">
                      {{
                        emerLeverData.responseAction
                          ? emerLeverData.responseAction
                          : '暂无数据'
                      }}
                    </div>
                    <div
                      v-if="eventId && planId"
                      class="context-btn"
                      @click="toStart('1')"
                    >
                      {{ responseLevel == 1 ? '已启动响应' : '启动应急响应' }}
                    </div>
                  </div>
                </div>
                <div
                  @click="getLeverTitle('II级响应', 2)"
                  :class="selectKey === 2 ? 'checkedBox' : 'label'"
                >
                  <span class="icon-img2"></span>
                  <span>II级响应</span>
                  <div class="context" v-show="selectKey === 2">
                    <div class="context-content">
                      {{
                        emerLeverData.responseAction
                          ? emerLeverData.responseAction
                          : '暂无数据'
                      }}
                    </div>
                    <div
                      v-if="eventId && planId"
                      class="context-btn"
                      @click="toStart('2')"
                    >
                      {{ responseLevel == 2 ? '已启动响应' : '启动应急响应' }}
                    </div>
                  </div>
                </div>
                <div
                  @click="getLeverTitle('III级响应', 3)"
                  :class="selectKey === 3 ? 'checkedBox' : 'label'"
                >
                  <span class="icon-img3"></span>
                  <span>III级响应</span>
                  <div class="context" v-show="selectKey === 3">
                    <div class="context-content">
                      {{
                        emerLeverData.responseAction
                          ? emerLeverData.responseAction
                          : '暂无数据'
                      }}
                    </div>
                    <div
                      v-if="eventId && planId"
                      class="context-btn"
                      @click="toStart('3')"
                    >
                      {{ responseLevel == 3 ? '已启动响应' : '启动应急响应' }}
                    </div>
                  </div>
                </div>
                <div
                  @click="getLeverTitle('IV级响应', 4)"
                  :class="selectKey === 4 ? 'checkedBox' : 'label'"
                >
                  <span class="icon-img4"></span>
                  <span>IV级响应</span>
                  <div class="context" v-show="selectKey === 4">
                    <div class="context-content">
                      {{
                        emerLeverData.responseAction
                          ? emerLeverData.responseAction
                          : '暂无数据'
                      }}
                    </div>

                    <div
                      v-if="eventId && planId"
                      class="context-btn"
                      @click="toStart('4')"
                    >
                      {{ responseLevel == 4 ? '已启动响应' : '启动应急响应' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- /预案内容、响应级别tabcontent -->

          <!-- 工作组tabtabcontent -->
          <div v-show="showTabIdx == 3">
            <div
              v-for="(itemCon, index) in workingGroupTabs"
              v-show="index + 3 == planTabNum"
              :key="index"
            >
              <div class="duty-content" v-if="workDoing == 1">
                <div class="duty-box">
                  <p>工作职责</p>
                  <div class="duty-emer">
                    {{ itemCon.teamDuty }}
                  </div>
                </div>
                <div class="duty-box">
                  <p>成员信息</p>
                  <div class="duty-emer">
                    <el-table
                      :data="itemCon.eventTeamPersonDTOList"
                      height="241"
                      style="width: 100%"
                    >
                      <el-table-column prop="comPersonName" label="姓名">
                      </el-table-column>
                      <el-table-column prop="comPersonPost" label="职务">
                      </el-table-column>
                      <el-table-column prop="comPersonTel" label="手机号">
                      </el-table-column>
                      <el-table-column prop="dutyNumber" label="办公电话">
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
                <div class="duty-box-bg">
                  <div
                    class="to-metting"
                    @click="changeworkDoing(2)"
                    v-if="
                      itemCon.eventTeamPersonDTOList &&
                        itemCon.eventTeamPersonDTOList.length > 0
                    "
                  >
                    一键会议
                  </div>
                </div>
              </div>
              <div class="duty-content" v-if="workDoing == 2">
                <div class="groupMetting">
                  <div class="groupMettingPeople">
                    <div class="commmingpeoples clearfix">
                      <div
                        class="commmingpeople"
                        v-for="(item, index) in workingGroupTabContents"
                        :key="index"
                      >
                        <div
                          :class="{
                            headerImg: item.state == 1,
                            toConnect: item.state == 2,
                            muteImg: item.state == 3,
                            notconnectedImg: item.state == 4,
                            oncallImg: item.state == 5,
                          }"
                        ></div>
                        <div class="name-btn">{{ item.personName }}</div>
                      </div>
                    </div>
                    <div class="pages">
                      <span
                        v-for="(item, index) in pages"
                        :key="index"
                        @click="changepage(index)"
                        :class="{
                          active: currentPage == index,
                        }"
                      ></span>
                    </div>
                  </div>
                  <div class="groupMettingBtn">
                    <div>
                      <span>全员静音</span>
                      <span @click="changeworkDoing(4)">结束会议</span>
                      <span @click="changeworkDoing(3)">添加参会人</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="duty-content" v-if="workDoing == 3">
                <searchTree @showmeeting="allmeetingPersons"></searchTree>
              </div>
            </div>
          </div>
          <!-- /工作组tabtabcontent -->
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import MapCommon from '@/util/MapCommon';
import {
  emergencyResponseServer,
  emergencyResponseEventServer,
  emergencyResponseTypeServer,
} from '@/api/feature/emergencyresponse/installServer';
import { jiesiruiServer } from '@/api/installServer';
import searchTree from '@/components/feature/flood/EmergencyResponse/searchTree.vue';
@Component({
  name: 'EmergencyResponse',
  components: { MapCommon, searchTree },
  mixins: [MapCommon],
})
export default class EmergencyResponse extends Vue {
  private pdfUrl = './pdf/senhuonew.pdf'; // 'taifeng.pdf';
  private earthquakeEmergencyPlan = './pdf/earthquakeEmergencyPlan.pdf';
  private earthquakeEmergencyPlanManual =
    './pdf/earthquakeEmergencyPlanManual.pdf';
  // private eventId = eventIdSever;
  private planId: any = '';
  private responseLevel: any = '';
  private leverTitle: any = '';
  private showEmergency: boolean = false;
  private showAll: boolean = false;
  private activeName = '1';
  private activeplanTabNum = '1';
  //   节点数据
  private workDoing: any = 1;
  private stepData: any[] = [
    // {
    //   nodeId: '2c9287db6ed0fea8016ed1141c370009',
    //   nodeName: '总则',
    //   planId: '2c9287db6ed0fea8016ed1041ef70001',
    //   content:
    //     '<p>使地震应急能够协调、有序和高效进行，最大程度地减少人员伤亡、减轻经济损失和社会影响。</p><p>&nbsp;依据《中华人民共和国防震减灾法》、《破坏性地震应急条例》和《国家突发公共事件总体应急预案》，制定本预案。</p>',
    //   sort: 0,
    //   comments: '',
    //   createTime: 1575465786408,
    //   updateTime: 1575465786408,
    //   createBy: '2c9287db6e7e3851016e7e5cc4720002',
    //   updateBy: '2c9287db6e7e3851016e7e5cc4720002',
    // },
    // {
    //   nodeId: '2c9287db6ed0fea8016ed114b037000c',
    //   nodeName: '组织指挥体系及职责',
    //   planId: '2c9287db6ed0fea8016ed1041ef70001',
    //   content:
    //     '<p>国务院抗震救灾指挥部</p><p><br></p><p>&nbsp;&nbsp;发生特别重大地震灾害，经国务院批准，由平时领导和指挥调度防震减灾工作的国务院防震减灾工作联席会议，转为国务院抗震救灾指挥部，统一领导、指挥和协调地震应急与救灾工作。国务院抗震救灾指挥部办公室设在中国地震局。</p><p><br></p><p>&nbsp;中国地震局</p><p><br></p><p>&nbsp;&nbsp;中国地震局负责国务院抗震救灾指挥部办公室的日常事务，汇集地震灾情速报，管理地震灾害调查与损失评估工作，管理地震灾害紧急救援工作。</p>',
    //   sort: 1,
    //   comments: '',
    //   createTime: 1575465824309,
    //   updateTime: 1575466034118,
    //   createBy: '',
    //   updateBy: '',
    // },
    // {
    //   nodeId: '2c9287db6ed0fea8016ed1154041000d',
    //   nodeName: '预警和预防机制',
    //   planId: '2c9287db6ed0fea8016ed1041ef70001',
    //   content:
    //     '<p>中国地震局在划分地震重点危险区的基础上，组织震情跟踪工作，提出短期地震预测意见，报告预测区所在的省（区、市）人民政府；省（区、市）人民政府决策发布短期地震预报，及时做好防震准备。</p><p>在短期地震预报的基础上，中国地震局组织震情跟踪工作，提出临震预测意见，报告预测区所在的省（区、市）人民政府；省（区、市）人民政府决策发布临震预报，宣布预报区进入临震应急期。预报区所在的市（地、州、盟）、县（市、区、旗）人民政府采取应急防御措施，主要内容是：地震部门加强震情监视，随时报告震情变化；根据震情发展和建筑物抗震能力以及周围工程设施情况，发布避震通知，必要时组织避震疏散；要求有关部门对生命线工程和次生灾害源采取紧急防护措施；督促检查抢险救灾的准备工作；平息地震谣传或误传，保持社会安定。</p>',
    //   sort: 2,
    //   comments: '',
    //   createTime: 1575465861183,
    //   updateTime: 1575465861183,
    //   createBy: '2c9287db6e7e3851016e7e5cc4720002',
    //   updateBy: '2c9287db6e7e3851016e7e5cc4720002',
    // },
  ];
  // 预案内容
  private planContent: any = {
    comments: '', // 备用字段
    content: '', // 预案内容
    createBy: '', // 创建人
    createTime: '', // ($date-time)创建时间
    nodeId: '', // 节点id
    nodeName: '', // 节点名称
    planId: '', // 预案id
    sort: 0, // 排序
    updateBy: '', // 更新人
    updateTime: '', // ($date-time)更新时间
  };
  private planTabs: any = ['预案内容', '预案手册', '响应级别'];
  private planTabContents: any = ['预案内容', '响应级别'];
  private workingGroupTabs: any = [];
  private workingGroupTabContents: any = [];
  private peoplleList: any = [];

  private planTabNum = 0;
  private showTabIdx = 1;
  private selectKey: number = -1;
  private emerLeverData: any = {
    id: '',
    planId: '',
    responseLevel: '',
    startCondition: '',
    responseAction: '',
    createBy: '',
    createtime: '',
    updateBy: '',
    updatetime: '',
  };
  private checkList: any = []; // 通讯录选中数据
  private pages = 0;
  private currentPage = 0;
  private newEventType = '';
  private eventId: any = this.$store.state.eventPushStore.eventLocation
    .originalEventId
    ? this.$store.state.eventPushStore.eventLocation.originalEventId
    : '';
  private eventType: any = this.$store.state.eventPushStore.eventLocation
    .EventType
    ? this.$store.state.eventPushStore.eventLocation.EventType
    : '24';
  public created() {
    if (this.eventType) {
      this.getNewEventType();
    }
  }
  public getNewDatas() {
    const opts1 = {
      eventId: this.eventId,
    };
    const opts2 = {
      eventType: '170106000000', // 'this.newEventType
    };
    emergencyResponseEventServer
      .getNewInfo(this.eventId ? opts2 : opts2)
      .then((res: any) => {
        if (res.status === 200 && res.data && res.data.planId) {
          this.planId = res.data.planId;
          this.responseLevel = res.data.resLevel;
          this.getdutytList(); // 工作组
          this.getList(); // 预案内容
          this.getPlanPdf(); // 预案手册

          switch (res.data.resLevel) {
            case '1':
              this.leverTitle = 'I级响应';
              break;
            case '2':
              this.leverTitle = 'II级响应';
              break;
            case '3':
              this.leverTitle = 'III级响应';
              break;
            case '4':
              this.leverTitle = 'IV级响应';
              break;
            default:
              this.leverTitle = '未启动响应';
              break;
          }
        }
      });
  }
  private getNewEventType() {
    const opts = {
      dsstypeid: this.eventType,
    };
    emergencyResponseTypeServer.changeEventType(opts).then((res: any) => {
      this.newEventType = res.data;
      this.getNewDatas();
    });
  }
  @Watch('$store.state.eventPushStore.eventLocation.originalEventId')
  private updataShowState() {
    this.eventId = this.$store.state.eventPushStore.eventLocation.originalEventId;
    this.getNewEventType();
  }
  @Watch('$store.state.eventPushStore.eventLocation.EventType')
  private updataEventType() {
    this.eventType = this.$store.state.eventPushStore.eventLocation.EventType; // 这个是事件类型
    this.getNewEventType();
  }

  private getLeverInfo(n: any) {
    const opts = {
      planId: this.planId,
      responseLevel: n,
    };
    emergencyResponseServer.getLeverInfo(opts).then((res: any) => {
      this.$set(this, 'emerLeverData', res.data);
      this.emerLeverData = res.data;
    });
  }
  private getPlanPdf() {
    switch (this.$store.state.eventPushStore.eventLocation.EventType) {
      case '1':
        this.pdfUrl = './pdf/earthquakeEmergencyPlanManual.pdf';
        break;
      case '9':
        this.pdfUrl = './pdf/senhuo.pdf';
        break;
      case '24':
        this.pdfUrl = './pdf/taifeng.pdf';
        break;
      default:
        break;
    }
    // const opts = {
    //   planId: this.planId,
    // };
    // emergencyResponseServer.getPlanInfo(opts).then((res: any) => {
    //   this.pdfUrl = res.data;
    // });
  }
  private showContent() {
    this.showEmergency = !this.showEmergency;
    if (this.showEmergency) {
      this.getList();
    }
  }
  private tab(index: any, idx: any) {
    this.showTabIdx = idx;
    this.planTabNum = index;
    this.workDoing = 1;
    if (idx === 3) {
      this.$set(
        this,
        'peoplleList',
        this.workingGroupTabs[index - 3].eventTeamPersonDTOList,
      );
      for (let i = 0; i < this.peoplleList.length; i++) {
        this.$set(
          this.peoplleList[i],
          'personName',
          this.peoplleList[i].comPersonName,
        );
        this.$set(
          this.peoplleList[i],
          'personId',
          this.peoplleList[i].comPersonId,
        );

        if (i % 3 === 0) {
          this.$set(this.peoplleList[i], 'state', 1);
        } else if (i % 5 === 0) {
          this.$set(this.peoplleList[i], 'state', 3);
        } else if (i % 7 === 0) {
          this.$set(this.peoplleList[i], 'state', 4);
        } else {
          this.$set(this.peoplleList[i], 'state', 5);
        }
      }
    }
  }

  private handleStepClick(name: any, sort: any, id: any, content: any) {
    this.showAll = false;
    this.$set(this.planContent, 'sort', sort);
    this.$set(this.planContent, 'nodeId', id);
    this.$set(this.planContent, 'nodeName', name);
    this.$set(this.planContent, 'content', content);
  }
  private getList() {
    const opts = {
      id: this.planId,
      // id: 'ff808081718d634b0171956e20880001',
    };
    emergencyResponseServer.getDetailInfo(opts).then((res: any) => {
      if (res.status === 200) {
        this.$set(this, 'stepData', res.data);
        this.$set(this.planContent, 'sort', res.data[0].sort);
        this.$set(this.planContent, 'nodeId', res.data[0].id);
        this.$set(this.planContent, 'nodeName', res.data[0].nodeName);
        this.$set(this.planContent, 'content', res.data[0].content);
      }
    });
  }
  // 工作组
  private getdutytList() {
    const opts = {
      eventId: this.eventId,
      // eventType:this.eventType,
      planId: this.planId,
      responseLevel: this.responseLevel,
    };
    emergencyResponseEventServer.getDutyInfo(opts).then((res: any) => {
      if (res.status === 200) {
        this.$set(this, 'workingGroupTabs', res.data.eventTeamDTOList);
      }
    });
  }

  private getLeverTitle(num: any, lever: any) {
    if (this.selectKey === lever) {
      this.selectKey = -1;
    } else {
      this.selectKey = lever;
      // 解决没有eventId下默认展示对应响应级别下的内容
      if (this.eventId === '') {
        switch (lever) {
          case 1:
            this.emerLeverData = {
              responseAction:
                '灾区县（市、区）政府启动Ⅱ级或Ⅰ级应急响应，县（市、区）政府主要领导到抗震救灾指挥部协调处置或赶赴地震现场指挥, 组织调动县（市、区）政府地震应急救援队伍及其它专业应急救援队伍和资源进行先期处置。市抗震救灾指挥部即时启动Ⅱ级或Ⅰ级应急响应，组织调动市、县（市、区）地震应急救援队伍，以及市、县（市、区）综合、相关专业及志愿者应急救援队伍和资源进行先期处置。市委、市政府主要领导到市应急指挥中心或赶赴现场指挥协调处置。发生Ⅱ级、Ⅰ级地震灾害后，省、国务院成立地震现场指挥部或派出工作组后，市抗震救灾指挥部在其领导下开展工作。',
            };
            break;
          case 2:
            this.emerLeverData = {
              responseAction:
                '灾区县（市、区）政府启动Ⅱ级或Ⅰ级应急响应，县（市、区）政府主要领导到抗震救灾指挥部协调处置或赶赴地震现场指挥, 组织调动县（市、区）政府地震应急救援队伍及其它专业应急救援队伍和资源进行先期处置。市抗震救灾指挥部即时启动Ⅱ级或Ⅰ级应急响应，组织调动市、县（市、区）地震应急救援队伍，以及市、县（市、区）综合、相关专业及志愿者应急救援队伍和资源进行先期处置。市委、市政府主要领导到市应急指挥中心或赶赴现场指挥协调处置。发生Ⅱ级、Ⅰ级地震灾害后，省、国务院成立地震现场指挥部或派出工作组后，市抗震救灾指挥部在其领导下开展工作。',
            };
            break;
          case 3:
            this.emerLeverData = {
              responseAction:
                '灾区县（市、区）政府启动Ⅲ级应急响应，县（市、区）政府主要领导或分管领导到抗震救灾指挥部指挥处置或赶赴地震现场指挥, 组织调动县（市、区）政府地震应急救援队伍及其它专业应急救援队伍和资源进行协同处置。市抗震救灾指挥部启动Ⅲ级应急响应，组织调动市、县（市、区）地震应急救援队伍赴灾区开展应急救援工作。',
            };
            break;
          case 4:
            this.emerLeverData = {
              responseAction:
                '（1）市抗震救灾指挥部成员单位负责人立即到市应急指挥中心或临时通知的地点集中，并通报驻烟部队。（2）综合协调组收集整理灾情和各类灾害隐患信息。（3）相关部门自行启动本行业地震应急预案并按各自职责开展工作。（4）市抗震救灾指挥部召开紧急会议，根据灾区反馈情况，分析、研判抗震救灾工作形势，研究部署抢险救灾工作。',
            };
            break;
          default:
            break;
        }
        return;
      } else {
        this.emerLeverData = {};
      }
      this.getLeverInfo(lever); // 级别
    }
  }
  // 获取对应响应级别下的对应数据
  private toStart(lever: any) {
    const opts = {
      eventId: this.eventId,
      planId: this.planId,
      resLevel: lever,
    };
    emergencyResponseEventServer.getDetailInfo(opts).then((res: any) => {
      this.getNewDatas();
    });
  }
  private changeworkDoing(index: any) {
    if (index === 4) {
      this.showTabIdx = 3;
      this.workDoing = 1;
      // 挂断电话
      this.jiesiruiHangUp();
    } else {
      if (index === 2) {
        this.jiesiruiGroupCall();
      }
      this.workDoing = index;
      this.pages = Math.ceil(this.peoplleList.length / 8);
      this.workingGroupTabContents = this.peoplleList.slice(0, 8);
    }
  }
  private changepage(index: any) {
    this.currentPage = index;
    this.workingGroupTabContents = this.peoplleList.slice(index * 8, (index + 1) * 8);
  }

  private allmeetingPersons(data: any) {
    this.workDoing = 2;
    this.peoplleList = this.peoplleList.concat(data);
    this.changeworkDoing(2);
  }
  // 群呼接口
  private async jiesiruiGroupCall() {
    let strDisMembersList = '';
    this.workingGroupTabs.forEach((item: any, index: any) => {
      item.eventTeamPersonDTOList.forEach((key: any, indexNum: any) => {
        if (indexNum === item.eventTeamPersonDTOList.length - 1) {
          strDisMembersList += key.comPersonTel;
        } else {
          strDisMembersList += key.comPersonTel + ',';
        }
      });
    });
    const opts = {
      strDisMembersList,
    };
    const res = await jiesiruiServer.jiesiruiGroupCall(opts);
  }
  // 挂断接口
  private async jiesiruiHangUp() {
    const res = await jiesiruiServer.jiesiruiHangUp();
  }
}
</script>
<style lang="less" scoped>
@urlPath: '../../../../assets/img/emergencyResponseImg';
@url: '../../../../assets/img/halfScreen/eventAndTopics';
@img: '../../../../assets/img/eventInfo';

.scroll {
  overflow-y: scroll;
  overflow-x: hidden;
}
::-webkit-scrollbar {
  width: 6px;
  border-radius: 5px;
  opacity: 0.64;
}

::-webkit-scrollbar-track {
  width: 6px;
  height: 3px;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  width: 6px;
  height: 3px;
  background: rgba(58, 250, 252, 0.2);
  border-radius: 4px;
}

input::-moz-placeholder,
input::-moz-placeholder,
input::-webkit-input-placeholder {
  color: #fff;
}
.clearfix,
.city-select .city-cont dl,
.city-select .city-txt {
  *zoom: 1;
}
.clearfix:after,
.city-select .city-cont dl:after,
.city-select .city-txt:after {
  content: ' ';
  display: table;
  height: 0;
  clear: both;
}

/*模拟百度行政区划*/
.baidudistricfilterBox {
  position: absolute;
  top: 55px;
  left: 250px !important;
  // bottom: 205px;
  width: 1450px;
  cursor: default;
  padding: 3px 6px 0 6px;
  box-sizing: border-box;
  // pointer-events: none;
  // background: red;
  z-index: 4;
  background: url('@{urlPath}/emergecy-bg.png') no-repeat 0 0;
}
.baidudistricfilterBox h1 {
  position: relative;
  margin: 20px 0 0 36px;
}
// .btn-entry {
//   position: absolute;
//   right: 120px;
//   top: 13px;
//   transform: translateX(-50%);
//   z-index: 4;
//   font-size: calc(20px * 1.3) !important;
//   .eventAndTopics_hd {
//     display: flex;
//     &_text {
//       color: #fff;
//       background: url('@{img}/eventbg.png') no-repeat 0 0;
//       background-size: 100% 100%;
//       color: #d2e1dc;
//       cursor: pointer;
//       vertical-align: middle;
//       padding: 0 36px;
//       margin-left: 10px;
//       // &::before {
//       //   display: inline-block;
//       //   content: '';
//       //   width: 34px;
//       //   height: 38px;
//       //   background: url('@{img}/eventicon_new.png') no-repeat 50% 50%;
//       //   margin-right: 5px;
//       //   vertical-align: middle;
//       // }
//       & > span {
//         display: inline-block;
//         vertical-align: middle;
//         background-image: -webkit-linear-gradient(left, #8bfbff, #eefeff);
//         background-clip: text;
//         -webkit-text-fill-color: transparent;
//         line-height: 40px;
//       }
//     }
//     &_tmp {
//       background: url('@{img}/chooseTopics_bg.png') no-repeat 0 0;
//       background-size: 100% 100%;
//       padding-left: 30px;
//     }
//   }
// }
.btn-entry {
  height: 55px;
  line-height: 55px;
  width: 143px;
  position: absolute;
  left: 57%;
  top: 36px;
  transform: translateX(-50%);
  z-index: 1;
  background: url('@{urlPath}/header-title-bg.png') no-repeat 0 0;
  span {
    display: inline-block;
    font-size: 24px;
    text-align: center;
    margin-left: 18px;
    font-weight: 700;
    font-family: '微软雅黑';
    background-image: -webkit-linear-gradient(bottom, #f58949, #f6da47);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    cursor: pointer;
  }
}

.close-city {
  position: absolute;
  top: -9px;
  right: 0px;
  width: 80px;
  height: 35px;
  background: url('@{url}/eventAndTopics_close.png') no-repeat 0 0;
  z-index: 1;
  cursor: pointer;
  pointer-events: auto;
}
.close-city:hover {
  background-image: url('@{url}/eventAndTopics_close_h.png');
}
.emergency-box {
  clear: both;
  padding: 18px;
  // display: flex;
  // flex-direction: column;
  // align-items: top;
}
.emergency-left-menu {
  width: 25%;
  p {
    width: 100%;
    background: blue;
    height: 50px;
    color: #fff;
    line-height: 50px;
    font-size: 25px;
    margin: 0;
  }
}
.emergency-content {
  width: 75%;
  height: 100%;
  background: green;
}

.activeTab {
  color: #fbee50;
  background: url('@{urlPath}/work-active-bg.png') no-repeat 0 0 !important;
}
.workList .active {
  color: #fbee50;
  background: url('@{urlPath}/work-active-bg.png') no-repeat 0 0 !important;
  // background: #e74c3c;
}

.emergency-left-menu {
  float: left;
  width: 350px;
  height: 775px;
}

ul {
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 26px;
  letter-spacing: 1px;
  color: #92edf6;
  font-family: 'Microsoft Ya Hei';
  text-align: center;
}
.workList {
  height: 415px;
  overflow: auto;
}
.workList li {
  width: 301px;
  height: 75px;
  text-align: center;
  cursor: pointer;
  line-height: 90px;
  background: url('@{urlPath}/work-bg.png') no-repeat 0 0;
}
ul li:first-child {
  margin-top: 20px;
}
.palnBox li {
  width: 278px;
  height: 86px;
  text-align: center;
  cursor: pointer;
  margin-left: 27px;
  padding-left: 10px;
  line-height: 80px;
}
.palnBox li:nth-child(1) {
  background: url('@{urlPath}/lever-img.png') no-repeat 0 0;
}
.palnBox li:nth-child(2) {
  background: url('@{urlPath}/lever-img.png') no-repeat 0 0;
}
.palnBox li:nth-child(3) {
  background: url('@{urlPath}/lever-img.png') no-repeat 0 0;
}

.palnBox li:nth-child(1).active {
  color: #c3d2da;
  background: url('@{urlPath}/lever-active-img.png') no-repeat 0 0;
}
.palnBox li:nth-child(2).active {
  color: #c3d2da;
  background: url('@{urlPath}/lever-active-img.png') no-repeat 0 0;
}
.palnBox li:nth-child(3).active {
  color: #c3d2da;
  background: url('@{urlPath}/lever-active-img.png') no-repeat 0 0;
}
.working-group {
  margin-top: 20px;
  padding-left: 27px;
  height: 62px;
  line-height: 62px;
  font-size: 30px;
  letter-spacing: 1px;
  color: #e1fffd;
  font-family: 'Microsoft Ya Hei';
  font-style: italic;
  margin-left: 10px;
  background: url('@{urlPath}/work-bg-title.png') no-repeat 0 0;
}

.tabCon {
  float: right;
  width: 990px;
  margin: 0 auto;
  padding: 24px 22px 16px;
  color: #999;
  height: 727px;
  font-size: 14px;
  //预案内容
  .plan_box {
    background: #fff;
    height: 710px;
    .plan-menu {
      height: 680px;
      border-right: 1px solid #ccc;
      padding-left: 30px;
      margin-top: 30px;
      overflow: auto;
    }
    .edit_plan_note {
      margin-bottom: 20px;
      margin: 0 20px;
      height: 710px;
      overflow: auto;

      > h3 {
        color: #333333;
        height: 60px;
        line-height: 60px;
        font-size: 28px;
      }

      > div {
        color: #333333;
        line-height: 40px;
        font-size: 26px;
      }
    }
  }
  //预案手册
  .planPdf {
    background: #fff;
    height: 710px;
    .iframeContainer {
      height: 100%;
      width: 100%;
    }
  }

  // 级别响应
  .container {
    &-box {
      position: relative;
    }
    input {
      display: none;
    }
    .label {
      display: block;
      background-color: #f5f5f5;
      width: 99%;
      height: 76px;
      border-radius: 2px;
      margin-top: 20px;
      line-height: 76px;
      background: url('@{urlPath}/lever-bg-title.png') no-repeat 0 0;
      font-size: 26px;
      letter-spacing: 1px;
      color: #92edf6;
      font-family: 'Microsoft Ya Hei';
    }
    .checkedBox {
      display: block;
      background-color: #f5f5f5;
      width: 99%;
      height: 76px;
      border-radius: 2px;
      margin-top: 20px;
      line-height: 76px;
      background: url('@{urlPath}/lever-bg-title.png') no-repeat 0 0;
      font-size: 26px;
      letter-spacing: 1px;
      color: #92edf6;
      font-family: 'Microsoft Ya Hei';
    }
    .icon-img1 {
      display: inline-block;
      width: 60px;
      height: 60px;
      vertical-align: middle;
      margin: 0 0 0 20px;
      background: url('@{urlPath}/level1Event.png') no-repeat 0 0 !important;
    }
    .icon-img2 {
      display: inline-block;
      width: 60px;
      height: 60px;
      vertical-align: middle;
      margin: 0 0 0 20px;
      background: url('@{urlPath}/level2Event.png') no-repeat 0 0 !important;
    }
    .icon-img3 {
      display: inline-block;
      width: 60px;
      height: 60px;
      vertical-align: middle;
      margin: 0 0 0 20px;
      background: url('@{urlPath}/level3Event.png') no-repeat 0 0 !important;
    }
    .icon-img4 {
      display: inline-block;
      width: 60px;
      height: 60px;
      vertical-align: middle;
      margin: 0 0 0 20px;
      background: url('@{urlPath}/level4Event.png') no-repeat 0 0 !important;
    }

    .label .context {
      visibility: hidden;
      line-height: 0px;
      margin: 0 auto;
      border-radius: 2px;
      transition: height 0.5s linear;
      -webkit-transition: height 0.5s linear;
      -moz-transition: height 0.5s linear;
      -ms-transition: height 0.5s linear;
    }
    .checkedBox {
      height: 408px;
      width: 99%;
      background: url('@{urlPath}/choose-img.png') no-repeat 0 0 !important;
    }
    .checkedBox .context {
      padding: 10px 25px;
      visibility: visible !important;
      line-height: 40px;
      height: 330px;
      overflow: auto;
      position: relative;
      color: #b6d1dd;
      font-size: 22px;
    }
    .checkedBox .context .context-content {
      height: 205px;
      width: 100%;
      overflow: auto;
    }
    .checkedBox .context .context-btn {
      position: absolute;
      right: 32px;
      bottom: 40px;
      width: 227px;
      height: 74px;
      text-align: center;
      line-height: 74px;
      overflow: auto;
      background: url('@{urlPath}/context-btn-img.png') no-repeat 0 0;
      cursor: pointer;
    }
  }
  // 工作职责内容
  .duty-content {
    width: 990px;
    .duty-box {
      margin-top: -20px;
      margin-left: -38px;
      width: 100%;
      height: 300px;
      background: url('@{urlPath}/duty-title-img.png') no-repeat 0 0 !important;
      p {
        height: 37px;
        vertical-align: middle;
        line-height: 30px;
        padding-left: 48px;
        font-size: 26px;
        letter-spacing: 1px;
        color: #92edf6;
        font-family: 'Microsoft Ya Hei';
      }
      .duty-emer {
        width: 1020px;
        height: 240px;
        overflow: auto;
        position: relative;
        color: #b6d1dd;
        font-size: 22px;
        padding: 0 0 0 24px;
        margin-top: 14px;
      }
    }
    .duty-box-bg {
      width: 1070px;
      margin-left: -42px;
      height: 87px;
      border-top: 1px solid transparent;
      background: url('@{urlPath}/duty-tab-bg.png') no-repeat 0 0;
      font-size: 24px;
      letter-spacing: 1px;
      margin-top: 38px;
      color: #92edf6;
      font-family: 'Microsoft Ya Hei';
      .to-metting {
        width: 319px;
        height: 51px;
        line-height: 51px;
        background: url('@{urlPath}/duty-btn-bg.png') no-repeat 0 0;
        text-align: center;
        margin: 15px auto;
      }
      .to-metting:hover {
        width: 319px;
        height: 51px;
        line-height: 51px;
        background: url('@{urlPath}/duty-active.png') no-repeat 0 0;
        text-align: center;
        margin: 15px auto;
      }
    }
    .groupMetting {
      .groupMettingPeople {
        .commmingpeoples {
          height: 555px;
          .commmingpeople {
            float: left;
            width: 245px;
            font-size: 20px;
            letter-spacing: 1px;
            color: #ffffff;
            font-family: 'Microsoft Ya Hei';
            text-align: center;
            .headerImg {
              width: 143px;
              height: 145px;
              background: red;
              margin: 40px auto 10px;
              background: url('@{urlPath}/person-bg.png') no-repeat 0 0;
            }
            .toConnect {
              width: 143px;
              height: 145px;
              background: red;
              margin: 40px auto 10px;
              background: url('@{urlPath}/toconnect-bg.png') no-repeat 0 0;
            }
            .muteImg {
              width: 143px;
              height: 145px;
              background: red;
              margin: 40px auto 10px;
              background: url('@{urlPath}/mute-bg.png') no-repeat 0 0;
            }
            .notconnectedImg {
              width: 143px;
              height: 145px;
              background: red;
              margin: 40px auto 10px;
              background: url('@{urlPath}/notconnected-bg.png') no-repeat 0 0;
            }
            .oncallImg {
              width: 143px;
              height: 145px;
              background: red;
              margin: 40px auto 10px;
              background: url('@{urlPath}/oncall-bg.png') no-repeat 0 0;
            }
            .name-btn {
              width: 192px;
              height: 82px;
              line-height: 82px;
              background: url('@{urlPath}/person-btn.png') no-repeat 0 0;
              text-align: center;
              margin: 0 auto;
            }
          }
        }
        .pages {
          width: 100%;
          text-align: center;
          span {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #3cade5;
            /* margin: 30px 20px 30px 20px; */
            margin: 40px 20px;
            cursor: pointer;
          }
          .active {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #e3e53c;
            /* margin: 30px 20px 30px 20px; */
            margin: 40px 20px;
            cursor: pointer;
          }
        }
      }

      .groupMettingBtn {
        width: 1070px;
        margin-left: -42px;
        height: 87px;
        border-top: 1px solid transparent;
        background: url('@{urlPath}/duty-tab-bg.png') no-repeat 0 0;
        font-size: 20px;
        letter-spacing: 1px;
        margin-top: 12px;
        color: #92edf6;
        font-family: 'Microsoft Ya Hei';
        div {
          margin: 15px auto;
          text-align: center;
          line-height: 54px;
          span {
            display: inline-block;
            width: 312px;
            height: 51px;
            line-height: 51px;
            margin-left: 30px;
            text-align: center;
            cursor: pointer;
          }
          span:nth-child(1) {
            display: none;
            background: url('@{urlPath}/come-meeting.png') no-repeat 0 0;
          }
          span:nth-child(2) {
            background: url('@{urlPath}/end-meeting.png') no-repeat 0 0;
          }
          span:nth-child(3) {
            display: none;
            background: url('@{urlPath}/come-meeting.png') no-repeat 0 0;
          }
          span:hover {
            background: url('@{urlPath}/hover-meeting.png') no-repeat 0 0;
          }
        }
      }
    }
  }
}
</style>
