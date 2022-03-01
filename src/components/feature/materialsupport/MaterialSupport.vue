<template>
  <div class="rescueTeamsHome MaterialSupport">
    <span
      v-if="
        $store.state.eventPushStore.eventLocation.EventType.toString() ===
          '10' && $store.state.TyphoonModule.viewConfig.tabChooseValue !== '2'
      "
      class="closeAndback"
      @click="closeAndbackFn"
    ></span>
    <div class="rescueTeamsHome_hd title-panel">
      <p>
        物资保障
        <ZoomBtn></ZoomBtn>
      </p>
    </div>
    <div v-if="!loadingState" class="detail-box">
      <div class="showDetail">
        <div class="search_box">
          <div class="listDistrict-flex-box">
            <div class="listDistrict-input">
              <div class="listDistrict-input-content">
                <el-input
                  class="csmMyInput input_container"
                  type="text"
                  v-model.trim="inputWord"
                  placeholder="请输入物资库，物资名称"
                >
                  <i slot="suffix" class="iconSelf_search"></i>
                </el-input>
              </div>
            </div>
            <div class="select_box">
              <div class="listDistrict-select">
                <div @click.stop="isShowSelect = !isShowSelect">
                  <div
                    class="listDistrict-input-content"
                    @click="isSelectBolFn"
                  >
                    <el-input
                      class="csmMyInput input_container"
                      type="text"
                      :class="{ ' csmMyInput-cur': isSelectBol }"
                      readonly
                      v-model.trim="selectWord"
                      placeholder="储备库物资类型"
                    >
                      <i
                        slot="suffix"
                        :class="isSelectBol ? 'selcetIconBot' : 'selcetIconTop'"
                      ></i>
                    </el-input>
                  </div>
                </div>
                <el-scrollbar
                  class="cmp-scrollbar-y selectList"
                  v-show="isShowSelect"
                >
                  <div class="listDistrict-option">
                    <el-checkbox
                      class="constomMyCheckbox"
                      v-model="checkAll"
                      @change="handleCheckAllChange"
                      >全选</el-checkbox
                    >
                    <el-checkbox-group
                      v-model="checkedOption"
                      @change="handleCheckedChange"
                    >
                      <el-checkbox
                        class="constomMyCheckbox"
                        v-for="name in selectArr"
                        :label="name"
                        :key="name"
                        :title="name"
                        >{{ name }}</el-checkbox
                      >
                    </el-checkbox-group>
                    <ul class="selectBtn">
                      <li @click="canclehandle">关闭</li>
                    </ul>
                  </div>
                </el-scrollbar>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom_container">
          <div class="total_title">
            <span class="title">物资库合计</span>
            <span class="totalNum f-number">
              {{ totalNum }}
              <em>个</em>
            </span>
          </div>
          <div class="content">
            <!--  -->
            <el-scrollbar class="scrollbar" style="height: 100%">
              <ul v-if="materialData.length > 0">
                <li
                  v-for="(item, index) in materialData"
                  :key="index"
                  @click.stop="handleSupport(item)"
                >
                  <p class="title_name">
                    <span class="sort_number">{{ item.serialNumber }}</span>
                    <span>{{ item.name }}</span>
                  </p>
                  <p>
                    <span class="info_title">管理机构：</span>
                    <span>{{ item.chargedept || "- -" }}</span>
                  </p>
                  <p>
                    <span class="info_title">负责人：</span>
                    <span>{{ item.concateper || "- -" }}</span>
                    <span class="call">
                      <span
                        v-if="item.concatemobtel"
                        @click.stop="makingACall(item)"
                      >
                        <span class="callNumber">{{ item.concatemobtel }}</span>
                        <i class="phone_icon"></i>
                      </span>
                      <span v-else>{{ item.concateper ? "- -" : "" }}</span>
                    </span>
                  </p>
                </li>
              </ul>
              <div v-else class="nodata"></div>
            </el-scrollbar>
          </div>
          <div class="page">
            <el-pagination
              class="constomMyElPage"
              small
              :pager-count="5"
              :current-page.sync="paginationObj.currentPage"
              @current-change="handleCurrentChange"
              :page-size="paginationObj.pageSize"
              layout="prev, pager, next,total"
              :total="paginationObj.total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="loading"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { dataSourcesServer } from '@/api/installServer';
import disasterJudgeServer from '@/api/feature/disasterJudge/installDisasterJudgeServer';
import { dataSourceConfig } from '@/views/theme/decisionSupport/module/gisModule/disasterJudge/disasterJudge';
import { stringify } from 'qs';
import ZoomBtn from '../flood/ZoomBtn.vue'; // 导入最小化组件
import { nomalLeftServer, multiuleInterfaceServer } from '@/api/installServer';
@Component({
  name: 'MaterialSupport',
  components: { ZoomBtn },
})
export default class MaterialSupport extends Vue {
  @Prop() public rescueTeamHomeData: any;
  @Prop() private parentHandleClickNumFn?: any; // 父组件处理点击数字的方法
  private selectJson: any = require('../../../../public/json/eventConfigJson/rainstorm.json');
  private loadingState: boolean = false;
  private inputWord: string = ''; // 搜素框输入的关键字
  private isShowSelect: boolean = false; // 是否展示下拉框选择
  private selectData: any = []; // 全部物资类型
  private checkAll = false; // 默认全选
  private moduleType: any = []; // 已选的队伍类型
  private factoryKey = '';
  private checkedOption: any = []; // 已选的队伍名称
  private selectWord = '';
  private isSelectBol: boolean = false;
  private totalNum = 0;
  private sourceTypeCodeObj: any;
  private materialData = [];
  private MapCode = []; // 地图点位所需参数
  private MapKey: boolean = true; // 地图点位所需参数
  // 分页
  private paginationObj: any = {
    currentPage: 1,
    pageSize: 4,
    total: 0,
  };
  private viewResData: any = {
    total: '0',
  };
  private opts: any = {
    keyword: this.inputWord,
    typeArr: this.moduleType,
    levelArr: [],
    pageSize: 4,
    pageIndex: 1,
  };
  private isQIantu = '';
  private created() {
    this.getMaterialType();
    this.loadingState = true;
    // 初始化参数
    this.opts.pageIndex = 1;
    // this.factoryKey = this.rescueTeamHomeData.curMapParam;
  }
  private destroyed() {
    this.getComponent_new()._clearLayerByID('repository', '');
  }
  @Watch('$store.state.configModel.config.MaterialLibrary', { deep: true })
  private getType() {
    this.getMaterialType();
  }
  // 获取物资类型
  private getMaterialType() {
    // 如果专题json里有配置就使用josn里面的
    const obj = this.$store.state.configModel.config.MaterialLibrary;
    if (obj && obj.MaterialLibraryTypeList) {
      // this.selectData = obj.MaterialLibraryTypeList.map((item: any) => {
      //   item.name = item.REPERTORYTYPENAME;
      //   item.codeType =
      //     item.REPERTORYTYPECODE * 1 > 9
      //       ? item.REPERTORYTYPECODE
      //       : 0 + item.REPERTORYTYPECODE;
      //   return item;
      // });

       // 刘云梦2022/02/24 左侧物资储备与右侧物资储备数据类型对齐
      this.selectData = [
        {
          ogc_fid: '01',
          id: '01',
          createTime: '2021-01-29T10:11:10.456Z',
          isSync: '1',
          REPERTORYTYPECODE: '01',
          REPERTORYTYPENAME: '通用防护物资库',
          codeType: '01',
          name: '通用防护物资库',
        },
          {
          ogc_fid: '05',
          id: '05',
          createTime: '2021-01-29T10:11:10.456Z',
          isSync: '1',
          REPERTORYTYPECODE: '05',
          REPERTORYTYPENAME: '森林消防物资库',
          codeType: '05',
          name: '森林消防物资库',
        },
        {
          ogc_fid: '13',
          id: '13',
          createTime: '2021-01-29T10:11:10.456Z',
          isSync: '1',
          REPERTORYTYPECODE: '13',
          REPERTORYTYPENAME: '本地救援物资库',
          codeType: '13',
          name: '本地救援物资库',
        },
         {
          ogc_fid: '14',
          id: '14',
          createTime: '2021-01-29T10:11:10.456Z',
          isSync: '1',
          REPERTORYTYPECODE: '14',
          REPERTORYTYPENAME: '委托救援物资库',
          codeType: '14',
          name: '委托救援物资库',
        },
      ];
      this.handleCheckAllChange(false);
    } else {
      const list = [
        {
          ogc_fid: '10',
          id: '10',
          createTime: '2021-01-29T10:11:10.456Z',
          isSync: '1',
          REPERTORYTYPECODE: '10',
          REPERTORYTYPENAME: '溢油防治物资库',
          codeType: '10',
          name: '防震物资库',
        },
        {
          ogc_fid: '11',
          id: '11',
          createTime: '2021-01-29T10:11:10.456Z',
          isSync: '1',
          REPERTORYTYPECODE: '11',
          REPERTORYTYPENAME: '防震物资库',
          codeType: '11',
          name: '防震物资库',
        },
        {
          ogc_fid: '12',
          id: '12',
          createTime: '2021-01-29T10:11:10.456Z',
          isSync: '1',
          REPERTORYTYPECODE: '12',
          REPERTORYTYPENAME: '港口救援物资库',
          codeType: '12',
          name: '港口救援物资库',
        },
        {
          ogc_fid: '01',
          id: '01',
          createTime: '2021-01-29T10:11:10.456Z',
          isSync: '1',
          REPERTORYTYPECODE: '01',
          REPERTORYTYPENAME: '通用防护物资库',
          codeType: '03',
          name: '通用防护物资库',
        },
        {
          ogc_fid: '02',
          id: '02',
          createTime: '2021-01-29T10:11:10.456Z',
          isSync: '1',
          REPERTORYTYPECODE: '02',
          REPERTORYTYPENAME: '防汛抗旱物资库',
          codeType: '02',
          name: '防汛抗旱物资库',
        },
        {
          ogc_fid: '03',
          id: '03',
          createTime: '2021-01-29T10:11:10.456Z',
          isSync: '1',
          REPERTORYTYPECODE: '03',
          REPERTORYTYPENAME: '城市防汛物资库',
          codeType: '03',
          name: '城市防汛物资库',
        },
        {
          ogc_fid: '04',
          id: '04',
          createTime: '2021-01-29T10:11:10.456Z',
          isSync: '1',
          REPERTORYTYPECODE: '04',
          REPERTORYTYPENAME: '消防设施物资库',
          codeType: '04',
          name: '消防设施物资库',
        },
        {
          ogc_fid: '05',
          id: '05',
          createTime: '2021-01-29T10:11:10.456Z',
          isSync: '1',
          REPERTORYTYPECODE: '05',
          REPERTORYTYPENAME: '森林消防物资库',
          codeType: '05',
          name: '森林消防物资库',
        },
        {
          ogc_fid: '06',
          id: '06',
          createTime: '2021-01-29T10:11:10.456Z',
          isSync: '1',
          REPERTORYTYPECODE: '06',
          REPERTORYTYPENAME: '电力设施物资库',
          codeType: '06',
          name: '电力设施物资库',
        },
        {
          ogc_fid: '07',
          id: '07',
          createTime: '2021-01-29T10:11:10.456Z',
          isSync: '1',
          REPERTORYTYPECODE: '07',
          REPERTORYTYPENAME: '通讯物资库',
          codeType: '07',
          name: '通讯物资库',
        },
        {
          ogc_fid: '08',
          id: '08',
          createTime: '2021-01-29T10:11:10.456Z',
          isSync: '1',
          REPERTORYTYPECODE: '08',
          REPERTORYTYPENAME: '生物防疫物资库',
          codeType: '08',
          name: '生物防疫物资库',
        },
        {
          ogc_fid: '09',
          id: '09',
          createTime: '2021-01-29T10:11:10.456Z',
          isSync: '1',
          REPERTORYTYPECODE: '09',
          REPERTORYTYPENAME: '机场消防物资库',
          codeType: '09',
          name: '机场消防物资库',
        },
      ];

      // this.selectData = this.selectJson.MaterialContainer.statisticsList[0].subList
      this.selectData = list.map((item: any) => {
        item.name = item.REPERTORYTYPENAME;
        item.codeType =
          item.REPERTORYTYPECODE * 1 > 9
            ? item.REPERTORYTYPECODE
            : 0 + item.REPERTORYTYPECODE;
        return item;
      });

      this.handleCheckAllChange(false);
      // disasterJudgeServer.repositoryServer
      // .getRepositoryType()
      // .then((data: any) => {

      //   // console.log(9999, data)
      // });
    }
  }
  // 下拉框展开/收起
  private isSelectBolFn() {
    this.isSelectBol = !this.isSelectBol;
  }
  // gis方法
  private getComponent() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.disasterJudgeFactory.getComponent(
      'disasterJudgeNewRepertory',
    );
    return component;
  }
  //  地图组件
  private getComponent_new() {
    const factory = this.$ioc.resolve('GISFactory-map');
    const component = factory.normalFactory.getComponent(
      'NewResourceComponent_left',
    );
    return component;
  }
  // 数据过滤条件发生更改
  @Watch('$store.state.dataFilterControl.filter')
  private updateGeometry() {
    this.FnListData(JSON.parse(JSON.stringify(this.opts)));
  }
  // 获取列表数据
  private FnListData(opts: any) {
    const optsObj = JSON.parse(JSON.stringify(opts));
    this.getComponent().clear();
    // 地图标点的参数，其中行政区划过滤和geometry过滤
    const showResourceOpts: any = {
      keyword: opts.keyword,
      districtCode: this.$store.state.dataFilterControl.filter.districtCode,
    };
    // 前端分页列表的参数，其中行政区划过滤和geometry过滤
    const queryParam: any = {
      pageSize: optsObj.pageSize,
      pageIndex: optsObj.pageIndex,
      keyword: optsObj.keyword ? optsObj.keyword : '',
      districtCode: this.$store.state.dataFilterControl.filter.districtCode ? this.$store.state.dataFilterControl.filter.districtCode : '',
      typecode: optsObj.typeArr ? optsObj.typeArr : '',
      resourceKey: 'repository',
      polygon: '',
      type: '2',
    };
    if (this.$store.state.dataFilterControl.filter.geometry) {
      const jsonObj = JSON.parse(
        this.$store.state.dataFilterControl.filter.geometry,
      );
      showResourceOpts.geometry = jsonObj;
      queryParam.geometry = jsonObj;
    }
    // 判断是否是 事件态
    if (this.$store.state.dataFilterControl.filter.geometry) {
      queryParam.polygon = g2.sfs.GeometryFactory.createGeometryFromGeoJson(
            JSON.parse(this.$store.state.dataFilterControl.filter.geometry),
          ).asWkt();
    }
    const curSelecttypeArrArr: any = this.$store.state.dataFilterControl.filter.districtCode.split(',') || [];
    curSelecttypeArrArr.forEach((element: any, i: any) => {
        curSelecttypeArrArr[i] = '\'' + curSelecttypeArrArr[i] + '\'';
    });
    queryParam.districtCode = curSelecttypeArrArr.length > 1 ? curSelecttypeArrArr.toString() : queryParam.districtCode ;
    if (this.$store.state.eventPushStore.eventId) {

      multiuleInterfaceServer.getDataList(queryParam).then((res: any) => {
        this.totalNum = res.total;
        this.materialData = res.list.map((item: any, index: any) => {
          item.serialNumber =
            index + 1 + optsObj.pageSize * (optsObj.pageIndex - 1);
          return item;
        });
        this.paginationObj.total = res.total;
        this.paginationObj.pageSize = optsObj.pageSize;
        this.loadingState = false;
      });
      this.MapRender(queryParam);
    } else {
      // queryParam.polygon = '';
      queryParam.type = this.$store.state.dataFilterControl.filter.geometry ? '2' : '3';
      multiuleInterfaceServer.getDataList(queryParam).then((res: any) => {
        this.totalNum = res.total;
        this.materialData = res.list.map((item: any, index: any) => {
          item.serialNumber =
            index + 1 + optsObj.pageSize * (optsObj.pageIndex - 1);
          return item;
        });
        this.paginationObj.total = res.total;
        this.paginationObj.pageSize = optsObj.pageSize;
        this.loadingState = false;
      });
      this.MapRender(queryParam);
    }
  }
  private MapRender(queryParam: any) {
    queryParam.pageSize = '999';
    queryParam.pageIndex = '1';
    multiuleInterfaceServer.getDataList(queryParam).then((res: any) => {
        this.getComponent_new()._showPoint(
          res.list,
          'repository',
          '',
        );
      });
  }
  // 分页点击
  private handleCurrentChange(val: number) {
    this.opts.pageIndex = val;
  }
  // 拨打电话
  private makingACall(data: any) {
    const item = {
      conactTel: data.concatemobtel,
      leaderName: data.concateper || '- -',
    };
    this.messsageBus.emit(
      'showCallup',
      true,
      item,
      item.conactTel,
      {},
      item.leaderName,
    );
  }
  // 下拉全选
  private handleCheckAllChange(val: any) {
    this.MapKey = val;
    this.checkedOption = val ? this.selectArr : [];
  }
  // 下拉复选框
  private handleCheckedChange(value: any) {
    const checkedCount = value.length;
    this.checkAll = checkedCount === this.selectArr.length;
  }
  // 下拉框选项数据处理
  get selectArr(): any {
    const res: any = [];
    this.selectData.map((item: any, index: number) => {
      (res as any).push(item.name);
    });
    return res;
  }
  // 获取已选队伍类型
  @Watch('checkedOption', { deep: true })
  private dealmoduleType() {
    const res: any = [];
    this.selectWord = '';
    this.checkedOption.forEach((name: any, ind: number) => {
      this.selectData.forEach((item: any, index: number) => {
        if (name === item.name) {
          res.push(item.id);
          if (
            this.checkedOption.length === 1 ||
            this.checkedOption.length === 1
          ) {
            this.selectWord += item.name;
          } else {
            this.selectWord += item.name + '，';
          }
        }
      });
    });
    // 点击下拉框，地图点位上图
    // 默认选不选中展示所有，跟力量调度同步，后期力量调度要重构，展示修改
    this.moduleType =
      res.length > 0 ? res : this.selectData.map((item: any) => item.id);
    this.MapCode = this.moduleType;
    this.opts.typeArr = '';
    for (const k of this.moduleType) {
      this.opts.typeArr += '\'' + k + '\',' + '';
    }
    this.opts.typeArr = this.opts.typeArr.slice(
      0,
      this.opts.typeArr.length - 1,
    );
  }
  // 取消下拉弹窗
  private canclehandle() {
    this.isShowSelect = !this.isShowSelect;
    this.isSelectBol = !this.isSelectBol;
  }
  // 搜索框关键字
  @Watch('inputWord')
  private getInputWordListData() {
    this.paginationObj.currentPage = 1;
    this.opts.keyword = this.inputWord;
    this.opts.pageIndex = 1;
  }
  @Watch('opts', { deep: true })
  private updateList(): void {
    setTimeout(() => {
      this.FnListData(JSON.parse(JSON.stringify(this.opts)));
    }, 1000);
  }
  // 物资库列表点击事件
  private handleSupport(data: any) {
    if (this.parentHandleClickNumFn) {
      this.parentHandleClickNumFn(JSON.parse(JSON.stringify(data)));
      this.getComponent().openPopup(data.repertorytypename, data.id);
      this.getComponent_new().locationCenter('repository', data.id);
    }
  }
  private closeAndbackFn() {
    this.messsageBus.emit('closeAndBack', true);
  }
}
</script>
<style lang="less" scoped>
@import "../../../assets/css/decisionSupport/teamIcon.less";
@import "../../../assets/css/decisionSupport/DiscussTab.less";
@import "../../../assets/css/decisionSupport/Statistic.half.less";
.MaterialSupport {
  width: 100%;
  span,
  p {
    cursor: default;
  }
  .detail-box {
    height: calc(100% - 34.67px);
  }
  .showDetail {
    width: 100%;
    height: 100%;
    // padding: 10px;
    .search_box {
      width: 100%;
      padding: 10px;
      padding-bottom: 0;
      box-sizing: border-box;
      .selectList {
        height: 319px !important;
        position: absolute;
        top: 140px;
        left: 10px;
        z-index: 20;
        background-color: #071022 !important;
        box-shadow: 4px 6px 16px 0px #001931;
        background: url("../../../assets/img/halfScreen/eventAndTopics/select_bg.png")
          no-repeat;
        background-size: 100% 100%;
        width: 94%;
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
            background-image: linear-gradient(
                180deg,
                rgba(249, 216, 72, 0.54) 0%,
                rgba(243, 177, 61, 0.54) 100%
              ),
              linear-gradient(#061418, #061418);
            background-blend-mode: normal, normal;
            box-shadow: 0px 2px 4px 0px rgba(95, 59, 16, 0.45);
            border-radius: 3px;
            border: solid 1px #fbe663;
            opacity: 0.8;
            color: #fefefe;
          }
          li:nth-of-type(2) {
            background-image: linear-gradient(
                -3deg,
                #357ac1 0%,
                rgba(72, 161, 204, 0.29) 53%,
                rgba(91, 199, 214, 0.55) 100%
              ),
              linear-gradient(#061418, #061418);
            background-blend-mode: normal, normal;
            box-shadow: 1px 2px 4px 0px rgba(91, 199, 214, 0.82);
            border-radius: 3px;
            border: solid 1px #5bc7d6;
            color: #a0f4fd;
          }
        }
      }
      .select_box {
        margin-top: 12px;
        .selcetIconTop {
          display: inline-block;
          width: 35px;
          height: 30px;
          background: url("../../../assets/img/halfScreen/halflist/select2bg.png")
            no-repeat;
          background-size: 100% 100%;
          margin: 5px 5px 0 0;
          cursor: pointer;
        }
        .selcetIconBot {
          display: inline-block;
          width: 35px;
          height: 30px;
          background: url("../../../assets/img/halfScreen/halflist/selcet1bg.png")
            no-repeat;
          background-size: 100% 100%;
          margin: 5px 5px 0 0;
          cursor: pointer;
          transform: rotate(180deg);
        }
      }
    }
    .bottom_container {
      width: 100%;
      position: relative;
      height: calc(100% - 122px);
      .total_title {
        width: 100%;
        margin-top: 22px;
        padding: 0 20px;
        box-sizing: border-box;
        > span {
          color: #eff004;
          font-size: 25px;
          font-style: italic;
          > em {
            font-style: normal;
            color: #bbd0dc;
            font-size: 26px;
            margin-left: 5px;
          }
        }
        .title {
          color: #67e1fb;
          font-size: 28px;
          font-style: normal;
        }
        .totalNum {
          float: right;
          margin-top: 3px;
        }
        &:after {
          content: "";
          background: url(../../../assets/img/halfScreen/halflist/titlexian.png)
            50% 0 no-repeat;
          position: absolute;
          width: 100%;
          height: 23px;
          top: 42px;
          left: 0;
        }
      }
      .content {
        width: 100%;
        margin-top: 20px;
        // height: 474px; // develop分支下样式
        height: calc(100% - 92px);
        ul {
          width: 100%;
          height: 550px;
          li {
            padding: 0 10px;
            box-sizing: border-box;
            width: 100%;
            margin-bottom: 10px;
            height: 145px;
            color: #e5f2fe;
            // background-color: rgba(0, 0, 0, 0.3);
            background: url(../../../assets/img/halfScreen/halflist/boxListBgIcon.png)
              50% 0 no-repeat;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            p {
              line-height: 30px;
              font-size: 23px;
              > span:nth-of-type(2) {
                color: #f7fdff;
                margin-right: 6px;
              }
            }
            p {
              &:nth-of-type(1) {
                font-size: 24px;
                display: flex;
              }
            }
            .info_title {
              color: #8cafd0;
            }
            .call {
              margin-left: 5px;
              .callNumber {
                cursor: pointer !important;
                font-size: 24px;
                // text-decoration: underline;
                // color: #3799ff;
              }
              i {
                display: inline-block;
                cursor: pointer !important;
                width: 16px;
                height: 18px;
                background: url(../../../assets/img/CommandDispatch/phone.png)
                  55% 50% no-repeat;
                background-size: contain;
                margin-left: 5px;
              }
            }
            &:hover {
              background-image: url(../../../assets/img/halfScreen/halflist/boxListBgIcon_h.png);
            }
            .sort_number {
              background: rgba(71, 215, 162, 0.2);
              border: 1px #47d7a2 solid;
              border-radius: 5px;
              color: #fff;
              font-size: 24px;
              padding: 0 5px;
              display: inline-block;
              font-style: normal;
              margin-right: 10px;
              height: 27px;
              padding: 0 5px;
              line-height: 27px;
              box-sizing: border-box;
              text-align: center;
            }
          }
        }
        .nodata {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          height: 200px;
          background: url(../../../assets/img/default/panel/noData.png) 55% 50%
            no-repeat;
        }
      }
      .page {
        width: 100%;
        position: relative;
        left: 50%;
        transform: translateX(-47%);
      }
    }
    .loading {
      color: #fff;
      background: url(../../../assets/img/halfScreen/halflist/loading.gif)
        no-repeat 33px 255px;
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
  }
}
</style>
<style lang="less">
.input_container.el-input .el-input__inner {
  font-size: 22px !important;
}
.scrollbar .el-scrollbar__bar.is-vertical > div {
  background-image: linear-gradient(
    0deg,
    #0a7ccc 0%,
    #06b4d1 52%,
    #02ebd5 100%
  );
}
</style>
