<template>
  <div class="newDetailsProtrusion" v-show="isShowTeamInfo">
    <div class="newDetailsProtrusion_title-panel">队伍详情</div>
    <span
      class="newDetailsProtrusion-header-closebtn detail-container_fan"
      @click="realtimeTeamClose"
    ></span>
    <div class="newDetailsProtrusion-baseinfo-content">
      <div class="newDetailsProtrusion_title">
        <span>
          <!-- <b v-show="isprotrusion">[前突]</b> -->
          {{rescueTeamHomeData.name?rescueTeamHomeData.name:''}}
        </span>
      </div>
      <el-scrollbar class="newDetailsProtrusion-baseinfo-content-top">
        <p>
          <span class="staticfont">类型：</span>
          <span
            class="TeamLeix"
          >{{rescueTeamHomeData.rescuetypename? rescueTeamHomeData.rescuetypename: '- -'}}</span>
        </p>
        <p style="display: flex;">
          <span class="staticfont">地址：</span>
          <span class="TeamLeix" style="flex: 1;">{{rescueTeamHomeData.address ? rescueTeamHomeData.address : '- -'}}</span>
        </p>
        <p>
          <span class="staticfont">行政区划：</span>
          <span
            class="TeamLeix"
          >{{rescueTeamHomeData.districtname ? rescueTeamHomeData.districtname : '- -'}}</span>
        </p>
        <p>
          <span class="staticfont">等级：</span>
          <span class="TeamLeix">{{rescueTeamHomeData.rescuegrade ? (rescueTeamHomeData.respPer === '1'? '地方':'国家') : '- -'}}</span>
        </p>
        <p>
          <span class="staticfont">专兼职：</span>
          <span>{{rescueTeamHomeData.timequality ? rescueTeamHomeData.timequality : '- -'}}</span>
        </p>
        <p style="display: flex;">
          <span class="staticfont">管理单位：</span>
          <span class="TeamLeix" style="flex: 1;">{{rescueTeamHomeData.chargedept ? rescueTeamHomeData.chargedept : '- -'}}</span>
        </p>
        <p>
          <span class="staticfont">现有人数：</span>
          <span class="TeamLeix">{{rescueTeamHomeData.totalpernum ? rescueTeamHomeData.totalpernum + '人': '- -'}}</span>
        </p>
        <p>
          <span class="staticfont">负责人：</span>
          <span class="TeamLeix">{{rescueTeamHomeData.levelname ? rescueTeamHomeData.levelname : '- -'}}</span>
          <span class="TeamLeix">{{rescueTeamHomeData.leadertel ? rescueTeamHomeData.leadertel : '- -'}}</span>
          <b
            v-if="parantDatas.chargecontel"
            class="callphonebgimg"
            :title="rescueTeamHomeData.chargecontel ? rescueTeamHomeData.chargecontel : ''"
            @click.stop="handleClickCallup(rescueTeamHomeData.chargecontel,rescueTeamHomeData.chargecontel,$event,rescueTeamHomeData.levelname)"
          ></b>
        </p>
        <p>
          <span class="staticfont">值班电话：</span>
          <span class="TeamLeix">{{rescueTeamHomeData.dutytel ? rescueTeamHomeData.dutytel : '- -'}}</span>
          <b
            v-if="rescueTeamHomeData.dutytel"
            class="callphonebgimg"
            :title="rescueTeamHomeData.dutytel ? rescueTeamHomeData.dutytel : ''"
            @click.stop="handleClickCallup(rescueTeamHomeData.dutytel,rescueTeamHomeData.dutytel,$event,rescueTeamHomeData.levelname)"
          ></b>
        </p>
        <p>
          <span class="staticfont">春节期间值班情况：</span>
          <span>{{detailsData.address ? detailsData.address : '- -'}}</span>
        </p>
        <p
          :class="{PathPlanning_btn:isprotrusion,PathPlanning_btn_roadlan:!isprotrusion}"
          @click="roadPlaning"
        ></p>
        <div class="newDetailsProtrusion-baseinfo-content-bottom">
          <div class="newDetailsProtrusion-baseinfo-content-bottom-top xiedaizbbg">
            主要装备
            <span
              :class="{list_lens_btn:!isShowimpotantDataList,list_lens_btnopen:isShowimpotantDataList}"
              @click="cutshowimpotantData"
            ></span>
          </div>
          <div
            class="newDetailsProtrusion-baseinfo-content-bottom-bottom"
            v-show="!isShowimpotantDataList"
          >
            <div class="newDetailsProtrusion-baseinfo-content-bottom-bottom-title">
              <div>序号</div>
              <div>装备名称</div>
              <div>数量</div>
            </div>
            <div class="newDetailsProtrusion-baseinfo-content-bottom-bottom-list" v-if="impotantDataList.length > 0 && loading">
              <li class="list_" v-for="(item,index) in impotantDataList" :key="index">
                <div class="list_icon">
                  <span>{{(opts.pageNo - 1) * paginationObj.pageSize + index + 1}}</span>
                </div>
                <div
                  class="equiomentname"
                  :title="item.equiptypename||(item.equiptypename+''+item.spmodel)"
                >{{item.equiptypename||item.equiptypename}}{{item.spmodel||''}}</div>
                <div class="list_mun_Company">
                  <span>{{item.equipnum || item.equipnum || 0}}</span>
                </div>
              </li>
            </div>
            <div v-else>
                <p>暂无数据</p>
            </div>
          </div>
        </div>
        <div class="newDetailsProtrusion-footer">
          <div class="newDetailsProtrusion-footer-pagenations">
            <el-pagination
              v-if="impotantDataList.length"
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
      </el-scrollbar>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { realtimeTeam } from '@/api/installServer';
import moment from 'moment';
import { rescueTeamServer } from '@/api/installServer';
import renderpopUpTemplate from '@/components/feature/gisModule/popUp/renderpopUpTemplate.vue';
import popDataDeal from '@/components/feature/gisModule/popUp/dataDeal/popDataDeal';
import MapCommon from '@/util/MapCommon';
import installDisasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';

@Component({
  name: 'TeamDetailsPopup',
  mixins: [popDataDeal, MapCommon],
})
export default class TeamDetailsPopup extends Vue {
  private rescueTeamHomeData?: any;
  private opts: any = {
    pageSize: 3,
    pageNo: 1,
    id: '', // team_053000016 team_053000026  team_053000029
    resourceKey: 'equipment',
  };
  private paginationObj: any = {
    currentPage: this.opts.pageIndex,
    pageSize: this.opts.pageSize,
    total: 0,
  };

  private detailsData: any = {}; // 队伍详情

  private teamstatype: any = {}; // 队伍详情
  private detailsDataDis: any = {};
  private parantDatas = {};
  private teamcurrentAddress: string = ''; // 当前位置
  private teamhappened: string = ''; // 距事发地距离
  private callnumber: number = 0; // 电话号码
  private equipmentList: any[] = []; // 装备列表数据
  private backMessageList: any[] = []; // 回传信息
  private NumberOfShortMessages: any = ''; // 回传信息的总数
  private historyOrbit: any[] = []; // 历史轨迹数据
  private pageSize: number = 4; // 条数
  private currentPage: number = 1; //  页码
  private total: number = 0; // 总页数
  private isActive: boolean = true; // 切换的内容隐藏显示 标识
  private isPlay: boolean = false;
  private equipmentSliceList: any = [];
  private isShowPagenation: boolean = false;
  private IsprevPagination: boolean = true; // true  为前端分页  false  为后端分页
  private isbtn: boolean = false; // 是否显示历史轨迹的播放 暂停按钮
  private firstSourceAddr: string = '';
  private banckinfobtn: boolean = true; // 回传信息的按钮
  private historyTrack: boolean = false; // 历史轨迹加载
  private isShowBackMsg: boolean = true; // 是否显示最新回传信息
  private impotantDataList: any[] = []; // 主要装备列表的数组
  private impotantDataListHangkong: any[] = [];
  private realpopuptimer: string = '';
  private resultLength: number = 0;
  private resNeedHour: string | number = ''; // 预计所需小时数
  private resNeedMinute: string | number = ''; // 预计所需分钟数
  private resArriveTime: string | number = ''; // 预计到达时间
  private teamId: string = ''; // 队伍的id
  private sendTime: string = ''; // 发报时间
  private fbcontent: string = ''; // 发报内容
  private fbaddress: string = ''; // 发报地址
  private isShowTeamInfo: boolean = true; // 点击路径规划隐藏详情窗开关
  private xzspace: string = ''; // 行政区划

  private isShowimpotantDataList: boolean = false; // 是否显示主要列表
  private isClose: any = false; // 返回按钮
  private isprotrusion: boolean = false; // 是否是前突 队伍
  private readDataList: any[] = []; // 已读数据
  private noreadDataList: any[] = []; // 未读数据
  private teamTitle: any = ''; // 判断标题
  private teamnameQian: any = ''; // 前突标识
  private ishistorylinebg: boolean = true; // 已读未读区分线
  private isHangkong: boolean = false; // 判断是否是航空
  private loading: boolean = true; // 判断是否是航空
  private numShow: boolean = false;
  private pathMainDatas: any = [
    {
      lat: '', // 起点信息
      lon: '', // 起点信息
      inputKey: '', // 地点文字描述
    },
    {
      lat: '', // 终点信息 vuex里面
      lon: '', // 终点信息 vuex里面
      inputKey: '',
    },
  ];
  // 分页点击
  private handleCurrentChange(val: number) {
    this.opts.pageNo = val;
    this.getEquipmemtList(JSON.parse(JSON.stringify(this.opts)));
  }

  // 打电话
  private handleClickCallup(listObj: any, val: any, event: any, name: any) {
    const self: any = this;
    self.messsageBus.emit('showCallup', true, listObj, val, event, name);
  }

  private cutshowimpotantData() {
    const self: any = this;
    self.isShowimpotantDataList = !self.isShowimpotantDataList;
  }

  /**
   * 获取队伍详情
   *
   */
  private getrealtimeTeambaseInfo() {
    rescueTeamServer
      .getRescueTeamDetail({ id: this.rescueTeamHomeData.id })
      .then((data: any) => {
        this.detailsData = data.result.tag;
        this.teamstatype = data.result.teamstatype.tag;
        this.detailsDataDis = data.result.district.tag;
      });
  }

  /**
   * 根据设备类型 获取装备列表
   * @teamid 队伍的id
   *
   */
  private getEquipmemtList(opts: any) {
    // 清空请求数据
    this.impotantDataList = [];
    this.any = {
      pageSize: 3,
      pageNo: 1,
      id: '',
    };
    installDisasterJudgeServer.rescueTeamServer
      .getEquipmentByTeamId(opts)
      .then((res: any) => {
        console.log(res);
        this.impotantDataList = res.data.data.list;
        this.paginationObj.total = res.data.data.total;
        if (this.impotantDataList.hasOwnProperty('EQUIPNUM')) {
          this.numShow = true;
        }
      });
  }

  /**
   * 根据设备类型 获取历史轨迹
   * @type:1,
   * @souceAddr:data,
   * @startTime:lastDay.format('yyyy-MM-dd hh:mm:ss'),
   * @endTime:today.format('yyyy-MM-dd hh:mm:ss')
   */
  private getHistoryOrbitList(souceAddr: string) {
    const self: any = this;
    const objdata = {
      type: '1',
      souceAddr,
      startTime:
        self.realpopuptimer ||
        self
          .$moment(self.$moment().valueOf('x'))
          .format('YYYY-MM-DD HH:mm:ss')
          .toString(),
      endTime: self
        .$moment(self.$moment().valueOf('x'))
        .format('YYYY-MM-DD HH:mm:ss')
        .toString(),
    };
    realtimeTeam
      .getEquipmentHistoryServer(objdata)
      .then((res: any) => {
        if (res.code === 0 && res.data.length > 0) {
          self.historyOrbit = res.data;
          self.isbtn = true;
        } else {
          self.historyOrbit = [];
          self.isbtn = false;
        }
      })
      .catch((err: any) => {
        self.historyOrbit = [];
        self.isbtn = false;
      });
  }

  /**
   * 路径规划
   *
   */
  private roadPlaning(param: any) {
    const self: any = this;
    /**
     * 点击路径规划隐藏当前详情窗,
     * 当点击路径规划的返回时重新展示此弹窗
     * */
    self.isShowTeamInfo = false;
    /**
     * 路径规划关闭的时候显示弹窗  接收监听
     * */
    self.messsageBus.off('showTeamInfo');
    self.messsageBus.on('showTeamInfo', (val: boolean) => {
      self.isShowTeamInfo = val;
    });
    self.initMapEvents();
    this.messsageBus.emit('Open_Router', {
      startPoint: [self.rescueTeamHomeData.longitude, self.rescueTeamHomeData.latitude],
      endPoint: [self.rescueTeamHomeData.longitude, self.rescueTeamHomeData.latitude],
      type: 0, // 判断打开哪个路径弹窗
      receidata: {
        realTeamName: self.parantDatas.name,
        id: self.parantDatas.id,
      },
    });

    /**
     * 路径规划关闭的时候显示弹窗  接收监听
     * */
    self.messsageBus.off('showTeamInfo');
    self.messsageBus.on('showTeamInfo', (val: boolean) => {
      self.isShowTeamInfo = val;
    });
  }
  // 起点终点的信息  初始化的信息 放在 mounted
  private async initMapEvents() {
    const self: any = this;
    let startAddress: any;
    if (self.pathMainDatas[0].lon && self.pathMainDatas[0].lat) {
      startAddress = {
        x: self.pathMainDatas[0].lon,
        y: self.pathMainDatas[0].lat,
      };
    } else if (
      this.$store.state.eventPushStore.eventLocation.EventLat &&
      this.$store.state.eventPushStore.eventLocation.EventLaton
    ) {
      startAddress = {
        x: this.$store.state.eventPushStore.eventLocation.EventLon,
        y: this.$store.state.eventPushStore.eventLocation.EventLat,
      };
    } else {
      return;
    }
    await self
      .getComponentrouterPlan()
      .request2(startAddress)
      .then((res: any) => {
        self.pathMainDatas[0].inputKey = res.address;
      })
      .catch((err: any) => {
        this.$message.error('路径规划服务调用失败: ' + err.message);
        console.error(err);
      });
    const endAddress = {
      x: self.pathMainDatas[1].lon,
      y: self.pathMainDatas[1].lat,
    };
    await self
      .getComponentrouterPlan()
      .request2(endAddress)
      .then((res: any) => {
        self.pathMainDatas[1].inputKey = res.address;
      })
      .catch((err: any) => {
        self.$message.error('路径规划服务调用失败: ' + err.message);
        console.error(err);
      });
  }
  private getTeamcomponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'disasterJudgeNewTeam',
    );
    return component;
  }
  /**
   * 获取地理位置aa
   *
   */
  private getAdrressData(obj: any) {
    const self: any = this;
    const realTeamHistoryInfo: any = {
      realTeamName: '救援队伍名称', // 救援队伍名称
    };
    if (obj.x && obj.y) {
      self
        .getComponentrouterPlan()
        .request2(obj)
        .then((res: any) => {
          realTeamHistoryInfo.realTeamHistoryName = res.address || '- -';
          self.pathClick(realTeamHistoryInfo);
        })
        .catch((err: any) => {
          this.$message.error('路径规划服务调用失败: ' + err.message);
          console.error(err);
        });
    } else {
      realTeamHistoryInfo.realTeamHistoryName = '- -';
      self.pathClick(realTeamHistoryInfo);
    }
  }
  /**
   * 关闭实时队伍弹窗
   *
   */
  private realtimeTeamClose(item: any) {
    const self = this;
    (self as any).close();
  }

  /**
   * 回传信息的更新状态
   *
   */

  private updateMessageStatus(souceAddr: string) {
    const self: any = this;
    const obj = {
      souceAddr,
    };
    realtimeTeam
      .getUpdataReiceveServer(obj)
      .then((res: any) => {
        if (res.code === 0) {
          // 取消对应前突点位闪烁
          self.getTeamcomponent().stopTeamBlink(self.data._id);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  //  地图组件   获取用的
  private getComponentrouterPlan() {
    const self: any = this;
    const factory = self.$ioc.resolve('GISFactory-map');
    const component = factory.commonFactory.getComponent('routerPlan');
    return component;
  }

  // 根据经纬度获取信息   里程 小时等
  private async getData_driving(options: any) {
    const self: any = this;
    await self
      .getComponentrouterPlan()
      .queryPath(options)
      .then((res: any) => {
        if (res.error) {
          self.$message.error(res.error);
        } else {
          self.resultLength = res.length; // 总里程数
          self.resNeedHour = res.durationHourMinutes.hours; // 预计所需小时数
          self.resNeedMinute = res.durationHourMinutes.minutes; // 预计所需分钟数
          self.resArriveTime = res.enddate; // 预计到达时间
        }
      })
      .catch((err: any) => {
        self.$message.error('路径规划服务调用失败: ' + err.message);
        console.error(err);
      });
  }

  // 回传信息数量
  private getNumberOfShortMessages(souceAddr: string) {
    const self: any = this;
    const obj = {
      sourceAddr: self.firstSourceAddr,
      startTime:
        self.realpopuptimer ||
        self
          .$moment(self.$moment().valueOf('x'))
          .format('YYYY-MM-DD HH:mm:ss')
          .toString(),
      endTime: self
        .$moment(self.$moment().valueOf('x'))
        .format('YYYY-MM-DD HH:mm:ss')
        .toString(),
    };
    realtimeTeam
      .NumberOfShortMessages(obj)
      .then((res: any) => {
        if (res.code === 0) {
          self.NumberOfShortMessages = res.data;
          self.total = res.data;
          self.watchIsshowPagination();
        }
      })
      .catch((err: any) => {
        self.historyOrbit = [];
        self.isbtn = false;
      });
  }

  /**
   * 页面初始加载 获取数据
   *
   */
  private mounted() {
    const self = this;
    this.rescueTeamHomeData = (self as any).data;
    this.init();
  }
  private init() {
    const self: any = this;
    self.parantDatas = JSON.parse(JSON.stringify(this.rescueTeamHomeData));
    this.opts.id = self.parantDatas.id;
    self.getEquipmemtList(JSON.parse(JSON.stringify(this.opts)));
    // self.getrealtimeTeambaseInfo();
  }
}
</script>
<style lang="less" scoped>
@import url('../../../../assets/css/popUp/RealteamAndMareria.less');
.newDetailsProtrusion {
  pointer-events: auto;
  position: relative;
  border-radius: 5px;
  width: 365px;
  background: url('../../../../assets/img/default/panel/half_bg.png') no-repeat 0 5px;
  // background-size: 440px 959px;
  background-size: 100% 94%;
}
.CaptainName {
  max-width: 280px;
}
.constomMyElPage.el-pagination {
  margin-top: 0px;
}
</style>
